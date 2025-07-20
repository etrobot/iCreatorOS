import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { EditSocialLinkDialog } from '~/components/edit-social-link-dialog';
import { Label } from '~/components/ui/label';
import toast, { Toaster } from 'react-hot-toast';


export const socialLinkConfig = [
    { id: "youtube", name: "YouTube", icon: "🎥", placeholder: "https://youtube.com/channel/..." },
    { id: "tiktok", name: "TikTok", icon: "🎵", placeholder: "https://tiktok.com/@username" },
    { id: "medium", name: "Medium", icon: "📝", placeholder: "https://medium.com/@username" },
    { id: "x", name: "X", icon: "🐦", placeholder: "https://x.com/username" },
    { id: "instagram", name: "Instagram", icon: "📷", placeholder: "https://instagram.com/username" },
    { id: "pinterest", name: "Pinterest", icon: "📌", placeholder: "https://pinterest.com/username" },
];

export default function SettingsPage() {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<(typeof socialLinkConfig)[number] & { url?: string } | null>(null);

  useEffect(() => {
    try {
      const savedLinks = localStorage.getItem('socialLinks');
      if (savedLinks) {
        setSocialLinks(JSON.parse(savedLinks));
      }
    } catch (error) {
      console.error("Failed to parse social links from localStorage", error);
    }
  }, []);

  const handleEditClick = (link: (typeof socialLinkConfig)[number]) => {
    setSelectedLink({ ...link, url: socialLinks[link.id] || '' });
    setIsDialogOpen(true);
  };

  const handleSaveLink = (url: string) => {
    if (selectedLink) {
      const newLinks = { ...socialLinks, [selectedLink.id]: url };
      setSocialLinks(newLinks);
      localStorage.setItem('socialLinks', JSON.stringify(newLinks));
      toast("Settings saved!");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialLinkConfig.map((link) => (
              <div className="space-y-2 flex items-center justify-between" key={link.id}>
                  <Label>{link.icon} {link.name}</Label>
                  <div>
                <span className="text-sm text-muted-foreground mr-2">
                    {socialLinks[link.id] || "Not set"}
                  </span>
                <Button variant="outline" size="sm" onClick={() => handleEditClick(link)}>
                    Edit
                  </Button>
                  </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      {selectedLink && (
        <EditSocialLinkDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveLink}
          link={selectedLink}
        />
      )}
      <Toaster />
    </>
  );
}
