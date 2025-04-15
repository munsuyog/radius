"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share, Check, Copy, Twitter, Facebook, Linkedin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ShareButton = ({ courseId, courseName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/shared/${courseId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform) => {
    let url;
    const text = `Check out this course: ${courseName} on Radius!`;
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank');
    toast(`Shared to ${platform}!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <Share className="h-4 w-4" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this course</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Input
            readOnly
            value={shareUrl}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className="flex gap-1 items-center"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy
              </>
            )}
          </Button>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <Button 
            onClick={() => shareToSocial('twitter')} 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-[#1DA1F2] hover:bg-[#1a94df] text-white"
          >
            <Twitter className="h-5 w-5" />
          </Button>
          <Button 
            onClick={() => shareToSocial('facebook')} 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-[#4267B2] hover:bg-[#375593] text-white"
          >
            <Facebook className="h-5 w-5" />
          </Button>
          <Button 
            onClick={() => shareToSocial('linkedin')} 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-[#0A66C2] hover:bg-[#0956a3] text-white"
          >
            <Linkedin className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;