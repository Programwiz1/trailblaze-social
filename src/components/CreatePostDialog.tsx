
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

interface CreatePostDialogProps {
  onSuccess: () => void;
}

export const CreatePostDialog = ({ onSuccess }: CreatePostDialogProps) => {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !user) return;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('post-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      const { error: postError } = await supabase
        .from('posts')
        .insert([{
          user_id: user.id,
          image_url: publicUrl,
          caption: caption,
          type: 'trail'
        }]);

      if (postError) throw postError;

      toast({
        title: "Success!",
        description: "Your post has been shared.",
      });

      setOpen(false);
      setImageFile(null);
      setCaption("");
      onSuccess();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-8 bg-nature-600 hover:bg-nature-700 text-white">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
          </div>
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share your adventure..."
              required
            />
          </div>
          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? "Posting..." : "Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
