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

interface EditSocialLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  link: { id: string; name: string; icon: string, url?: string };
}

export function EditSocialLinkDialog({ isOpen, onClose, onSave, link }: EditSocialLinkDialogProps) {
  const [url, setUrl] = useState(link.url || "");

  useEffect(() => {
    setUrl(link.url || '');
  }, [link.url]);

  const handleSave = () => {
    onSave(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {link.name} Link</DialogTitle>
        </DialogHeader>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`Enter your ${link.name} URL`}
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
