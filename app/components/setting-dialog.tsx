import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useState, useEffect } from "react";

interface SettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  setting: {
    id: string;
    name: string;
    value?: string;
    placeholder?: string;
    label: string;
    type?: 'text' | 'password';
  };
}

export function SettingDialog({ isOpen, onClose, onSave, setting }: SettingDialogProps) {
  const [value, setValue] = useState(setting.value || "");

  useEffect(() => {
    setValue(setting.value || '');
  }, [setting.value]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {setting.name}</DialogTitle>
        </DialogHeader>
        <div>
          <Label htmlFor={setting.id}>{setting.label}</Label>
          <Input
            id={setting.id}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={setting.placeholder || `Enter your ${setting.name}`}
            type={setting.type || 'text'}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
