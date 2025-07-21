import { useState, useEffect } from 'react';
import { SettingDialog } from '~/components/setting-dialog';
import { SettingList } from '~/components/SettingList';
import toast, { Toaster } from 'react-hot-toast';


type Setting = {
  id: string;
  name: string;
  placeholder: string;
  label: string;
  type?: 'text' | 'password';
  icon?: string;
  category: 'social' | 'llm';
  value?: string;
};

export const socialLinkConfig: Setting[] = [
  { id: "youtube", name: "YouTube", icon: "🎥", placeholder: "https://youtube.com/channel/...", label: "URL", category: 'social' },
  { id: "tiktok", name: "TikTok", icon: "🎵", placeholder: "https://tiktok.com/@username", label: "URL", category: 'social' },
  { id: "medium", name: "Medium", icon: "📝", placeholder: "https://medium.com/@username", label: "URL", category: 'social' },
  { id: "x", name: "X", icon: "🐦", placeholder: "https://x.com/username", label: "URL", category: 'social' },
  { id: "instagram", name: "Instagram", icon: "📷", placeholder: "https://instagram.com/username", label: "URL", category: 'social' },
  { id: "pinterest", name: "Pinterest", icon: "📌", placeholder: "https://pinterest.com/username", label: "URL", category: 'social' }
];

const llmSettingConfig: Setting[] = [
  { id: "baseUrl", name: "Base URL", icon: "🔗", placeholder: "https://api.openai.com/v1", label: "Base URL", category: 'llm' },
  { id: "apiKey", name: "API Key", icon: "🔑", placeholder: "sk-...", label: "API Key", type: "password", category: 'llm' },
  { id: "model", name: "Model", icon: "🤖", placeholder: "gpt-4-turbo", label: "Model", category: 'llm' }
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        const fetchedSettings = await response.json();
        const newSettings: Record<string, string> = {};
        for (const key in fetchedSettings) {
          newSettings[key] = fetchedSettings[key].value;
        }
        setSettings(newSettings);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to fetch settings.');
      }
    }
    fetchSettings();
  }, []);

  const handleEditClick = (setting: Setting) => {
    const value = settings[setting.id];
    setSelectedSetting({ ...setting, value: value || '' });
    setIsDialogOpen(true);
  };

  const handleSave = async (value: string) => {
    if (!selectedSetting) return;

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedSetting.id, value, category: selectedSetting.category }),
      });
      setSettings({ ...settings, [selectedSetting.id]: value });
      toast.success(`${selectedSetting.name} saved!`);
    } catch (error) {
      console.error('Error saving setting:', error);
      toast.error('Failed to save setting. Please try again.');
    }
  };

  return (
    <>
      <div className="space-y-4">
        <SettingList
          title="Social Links"
          description="Manage your social media links for the AI to use."
          settings={socialLinkConfig}
          values={settings}
          onEdit={handleEditClick}
        />

        <SettingList
          title="LLM Settings"
          description="Configure the API endpoint and credentials for the language model."
          settings={llmSettingConfig}
          values={settings}
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