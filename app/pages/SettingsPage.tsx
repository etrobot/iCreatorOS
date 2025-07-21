import { useState, useEffect } from 'react';
import { SettingDialog } from '~/components/setting-dialog';
import { SettingList } from '~/components/SettingList';
import toast, { Toaster } from 'react-hot-toast';
import { initGoogleSheets, getSettings, saveSettings, initializeSpreadsheet } from '~/utils/googleSheets';

type Setting = {
  id: string;
  name: string;
  placeholder: string;
  label: string;
  type?: 'text' | 'password';
  icon?: string;
  isSocial?: boolean;
  value?: string;
};
const socialLinkConfig: Setting[] = [
  { id: "youtube", name: "YouTube", icon: "🎥", placeholder: "https://youtube.com/channel/...", label: "URL", isSocial: true },
  { id: "tiktok", name: "TikTok", icon: "🎵", placeholder: "https://tiktok.com/@username", label: "URL", isSocial: true },
  { id: "medium", name: "Medium", icon: "📝", placeholder: "https://medium.com/@username", label: "URL", isSocial: true },
  { id: "x", name: "X", icon: "🐦", placeholder: "https://x.com/username", label: "URL", isSocial: true },
  { id: "instagram", name: "Instagram", icon: "📷", placeholder: "https://instagram.com/username", label: "URL", isSocial: true },
  { id: "pinterest", name: "Pinterest", icon: "📌", placeholder: "https://pinterest.com/username", label: "URL", isSocial: true },
];

const llmSettingConfig: Setting[] = [
  { id: "baseUrl", name: "Base URL", icon: "🔗", placeholder: "https://api.openai.com/v1", label: "Base URL" },
  { id: "apiKey", name: "API Key", icon: "🔑", placeholder: "sk-...", label: "API Key", type: "password" },
  { id: "model", name: "Model", icon: "🤖", placeholder: "gpt-4-turbo", label: "Model" },
];

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';
const GOOGLE_CREDENTIALS = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS ? 
  JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) : null;

export default function SettingsPage() {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [llmConfig, setLlmConfig] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Sheets and load settings
  useEffect(() => {
    const initializeSettings = async () => {
      if (!GOOGLE_CREDENTIALS || !SPREADSHEET_ID) {
        setError('Google Sheets configuration is missing');
        return;
      }

      try {
        // Initialize Google Sheets API
        const isInitialized = await initGoogleSheets(GOOGLE_CREDENTIALS);
        if (!isInitialized) {
          throw new Error('Failed to initialize Google Sheets');
        }

        // Initialize the spreadsheet with required sheets
        await initializeSpreadsheet(SPREADSHEET_ID);

        // Load settings from Google Sheets
        const [socialSettings, llmSettings] = await Promise.all([
          getSettings(SPREADSHEET_ID, 'social'),
          getSettings(SPREADSHEET_ID, 'llm')
        ]);

        setSocialLinks(socialSettings);
        setLlmConfig(llmSettings);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing settings:', error);
        setError('Failed to load settings. Please check your configuration.');
        
        // Fallback to localStorage if available
        try {
          const savedLinks = localStorage.getItem('socialLinks');
          if (savedLinks) {
            setSocialLinks(JSON.parse(savedLinks));
          }
          const savedLlmConfig = localStorage.getItem('llmConfig');
          if (savedLlmConfig) {
            setLlmConfig(JSON.parse(savedLlmConfig));
          }
        } catch (localError) {
          console.error('Failed to parse settings from localStorage', localError);
        }
      }
    };

    initializeSettings();
  }, []);

  const handleEditClick = (setting: Setting) => {
    const isSocial = setting.isSocial ?? false;
    const value = isSocial ? socialLinks[setting.id] : llmConfig[setting.id];
    setSelectedSetting({ ...setting, value: value || '' });
    setIsDialogOpen(true);
  };

  const handleSave = async (value: string) => {
    if (!selectedSetting) return;
    
    const isSocial = selectedSetting.isSocial ?? false;
    
    try {
      if (isSocial) {
        // Update state optimistically
        const newLinks = { ...socialLinks, [selectedSetting.id]: value };
        setSocialLinks(newLinks);
        
        // Save to Google Sheets
        if (isInitialized && GOOGLE_CREDENTIALS && SPREADSHEET_ID) {
          await saveSettings(SPREADSHEET_ID, 'social', selectedSetting.id, value);
        } else {
          // Fallback to localStorage
          localStorage.setItem('socialLinks', JSON.stringify(newLinks));
        }
        
        toast.success("Social link saved!");
      } else {
        // Update state optimistically
        const newConfig = { ...llmConfig, [selectedSetting.id]: value };
        setLlmConfig(newConfig);
        
        // Save to Google Sheets
        if (isInitialized && GOOGLE_CREDENTIALS && SPREADSHEET_ID) {
          await saveSettings(SPREADSHEET_ID, 'llm', selectedSetting.id, value);
        } else {
          // Fallback to localStorage
          localStorage.setItem('llmConfig', JSON.stringify(newConfig));
        }
        
        toast.success(`LLM ${selectedSetting.name} saved!`);
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      toast.error('Failed to save setting. Please try again.');
      
      // Revert optimistic update on error
      if (isSocial) {
        setSocialLinks({ ...socialLinks });
      } else {
        setLlmConfig({ ...llmConfig });
      }
    }
  };

  return (
    <>
      <div className="space-y-4">
        <SettingList
          title="Social Links"
          description="Manage your social media links for the AI to use."
          settings={socialLinkConfig}
          values={socialLinks}
          onEdit={handleEditClick}
        />

        <SettingList
          title="LLM Settings"
          description="Configure the API endpoint and credentials for the language model."
          settings={llmSettingConfig}
          values={llmConfig}
          onEdit={handleEditClick}
        />
      </div>
      {selectedSetting && (
        <SettingDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          setting={selectedSetting}
        />
      )}
      <Toaster />
    </>
  );
}