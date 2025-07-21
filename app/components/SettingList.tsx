import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

type SettingItem = {
  id: string;
  name: string;
  placeholder: string;
  label: string;
  type?: 'text' | 'password';
  icon?: string;
  category: 'social' | 'llm';
  value?: string;
};

type SettingListProps = {
  title: string;
  description: string;
  settings: SettingItem[];
  values: Record<string, string>;
  onEdit: (setting: SettingItem) => void;
};

export function SettingList({ title, description, settings, values, onEdit }: SettingListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {settings.map((setting) => (
          <div key={setting.id} className="md:flex items-center justify-between">
            <div className="flex items-center gap-2">
              {setting.icon && <span className="text-2xl">{setting.icon}</span>}
              <div className="font-medium">{setting.name}</div>
            </div>
            <div className="md:flex items-center gap-2">
              <div className="text-sm text-muted-foreground w-72 truncate">
                {setting.type === 'password' && values[setting.id] 
                  ? '********' 
                  : values[setting.id] || setting.placeholder}
              </div>
              <Button className="my-2" variant="outline" size="sm" onClick={() => onEdit({ ...setting, value: values[setting.id] })}>
                Edit
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
