import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SettingDialog } from '~/components/setting-dialog';
import toast from 'react-hot-toast';

export type Setting = {
  id: string;
  name: string;
  icon?: string;
  placeholder?: string;
  label: string;
  type?: 'text' | 'password';
};

export type SettingGroup = {
  id: string;
  title: string;
  description: string;
  settings: Setting[];
};

interface ConfigEditorProps {
  config: SettingGroup;
  values: Record<string, string>;
  onSave: (groupId: string, settingId: string, value: string) => void;
}

export function ConfigEditor({ config, values, onSave }: ConfigEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting & { value?: string } | null>(null);

  const handleEditClick = (setting: Setting) => {
    setSelectedSetting({ ...setting, value: values[setting.id] || '' });
    setIsDialogOpen(true);
  };

  const handleSave = (value: string) => {
    if (selectedSetting) {
      onSave(config.id, selectedSetting.id, value);
      toast(`${selectedSetting.name} saved!`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {config.settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {setting.icon && <span className="text-2xl">{setting.icon}</span>}
              <div className="font-medium">{setting.name}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground w-72 truncate">
                {setting.type === 'password' && values[setting.id] ? '********' : values[setting.id] || setting.placeholder}
              </div>
              <Button variant="outline" onClick={() => handleEditClick(setting)}>
                Edit
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      {selectedSetting && (
        <SettingDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          setting={selectedSetting}
        />
      )}
    </Card>
  );
}
