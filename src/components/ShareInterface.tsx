import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Share2, 
  Copy, 
  Download, 
  Coins, 
  Gift,
  Users,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

interface ShareInterfaceProps {
  earnings: number;
  videoFile: File | null;
  videoUrl: string;
  onCreateAnother: () => void;
}

export function ShareInterface({ earnings, videoFile, videoUrl, onCreateAnother }: ShareInterfaceProps) {
  const [referralCode] = useState(`PRX${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
  const [isSharing, setIsSharing] = useState(false);
  const [customMessage, setCustomMessage] = useState('Just saved ₹200 on my monthly medicines with @PlatinumRx! 💊💰 Check out my unboxing experience and use my referral code for exclusive discounts. #PlatinumRx #HealthcareSavings #MoneySaver');
  const [hashtags, setHashtags] = useState('#PlatinumRx #HealthcareSavings #MedicineDelivery');

  // Create share URL and message
  const shareUrl = videoUrl || 'https://platinumrx.com';
  const shareMessage = `${customMessage}\n\nReferral Code: ${referralCode}\n\n${hashtags}`;

  const socialPlatforms = [
    {
      name: 'WhatsApp Video',
      icon: '📱',
      color: 'bg-green-500',
      description: 'Share video file to WhatsApp',
      shareType: 'whatsapp-video'
    },
    {
      name: 'Instagram Stories',
      icon: '📷',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Post to Instagram Stories',
      shareType: 'instagram'
    },
    {
      name: 'Facebook',
      icon: '👥',
      color: 'bg-blue-600',
      description: 'Share to Facebook',
      shareType: 'facebook'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-blue-400',
      description: 'Tweet video',
      shareType: 'twitter'
    },
    {
      name: 'YouTube Shorts',
      icon: '🎬',
      color: 'bg-red-600',
      description: 'Upload as Short',
      shareType: 'youtube'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700',
      description: 'Professional share',
      shareType: 'linkedin'
    },
    {
      name: 'All Platforms',
      icon: '⋯',
      color: 'bg-gray-500',
      description: 'Native sharing (WhatsApp, etc.)',
      shareType: 'native'
    }
  ];

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  const handleCopyVideoUrl = () => {
    if (videoUrl) {
      navigator.clipboard.writeText(videoUrl);
      toast.success('Video URL copied to clipboard!');
    } else {
      toast.error('Video URL not available');
    }
  };

  const handleDownload = () => {
    if (videoFile && videoUrl) {
      // Create download link
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `platinumrx-${videoFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Video downloaded to your device!');
    } else {
      toast.error('Video not available for download');
    }
  };

  const handleShare = async (platform: string, shareType: string) => {
    if (!videoFile) {
      toast.error('No video available to share');
      return;
    }

    setIsSharing(true);

    try {
      if (shareType === 'whatsapp-video') {
        // Special handling for WhatsApp video sharing
        await handleWhatsAppVideoShare();
      } else if (shareType === 'native') {
        // Use native Web Share API (works on mobile for WhatsApp, etc.)
        await handleNativeShare();
      } else {
        // Handle specific platform sharing
        await handlePlatformShare(shareType);
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      toast.error('Sharing failed. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleWhatsAppVideoShare = async () => {
    // Try native sharing first (best for mobile)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [videoFile] })) {
      try {
        const shareData = {
          title: 'PlatinumRx Unboxing Video',
          text: shareMessage,
          files: [videoFile]
        };
        
        console.log('Sharing video to WhatsApp via native API:', shareData);
        await navigator.share(shareData);
        toast.success('Video shared to WhatsApp successfully!');
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Native WhatsApp sharing failed:', error);
          // Fallback to download method
          await handleAlternativeSharing();
        }
      }
    } else {
      // Fallback: download video and guide user to share manually
      await handleAlternativeSharing();
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && navigator.canShare) {
      try {
        // Create a File object that can be shared
        const shareData: any = {
          title: 'PlatinumRx Unboxing Video',
          text: shareMessage
        };

        // Always try to share the video file first
        if (videoFile && navigator.canShare({ files: [videoFile] })) {
          shareData.files = [videoFile];
          console.log('Sharing video file:', videoFile.name, 'Size:', videoFile.size);
          
          // Remove URL when sharing files to avoid conflicts
          delete shareData.url;
        } else if (videoUrl) {
          // Fallback to URL if file sharing not supported
          shareData.url = videoUrl;
          console.log('File sharing not supported, sharing URL instead');
        }

        console.log('Share data:', shareData);
        await navigator.share(shareData);
        toast.success('Video shared successfully!');
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Native sharing failed:', error);
          // Try alternative sharing methods
          await handleAlternativeSharing();
        }
      }
    } else {
      // Fallback for desktop - try alternative methods
      await handleAlternativeSharing();
    }
  };

  const handleAlternativeSharing = async () => {
    // Try to create a downloadable link for the video
    if (videoFile) {
      try {
        // Create a blob URL for the video file
        const blobUrl = URL.createObjectURL(videoFile);
        
        // Create a temporary download link
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `platinumrx-${videoFile.name}`;
        link.style.display = 'none';
        
        // Add to DOM and trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        
        toast.success('Video downloaded! You can now share it manually to WhatsApp.');
        toast.info('Tip: Open WhatsApp → Tap + → Document → Select the downloaded video');
      } catch (error) {
        console.error('Alternative sharing failed:', error);
        handleFallbackShare();
      }
    } else {
      handleFallbackShare();
    }
  };

  const handlePlatformShare = async (platform: string) => {
    const platformUrls: { [key: string]: string } = {
      instagram: 'https://www.instagram.com/stories/',
      facebook: 'https://www.facebook.com/sharer/sharer.php',
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
      youtube: 'https://www.youtube.com/shorts/upload',
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    const url = platformUrls[platform];
    if (url) {
      // Open platform in new tab
      window.open(url, '_blank');
      toast.success(`Opened ${platform} for sharing!`);
    }
  };

  const handleFallbackShare = () => {
    // Create a temporary share button that copies everything to clipboard
    const shareText = `Title: PlatinumRx Unboxing Video\n\nMessage: ${shareMessage}\n\nVideo: ${videoUrl}\n\nReferral Code: ${referralCode}`;
    navigator.clipboard.writeText(shareText);
    toast.success('Share details copied to clipboard! You can paste this anywhere.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
          <CheckCircle className="w-10 h-10 text-success-foreground" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Your Video is Ready! 🎉</h2>
        <p className="text-muted-foreground">
          Share your enhanced video and start earning rewards
        </p>
      </div>

      {/* Earnings Card */}
      <Card className="bg-gradient-success shadow-strong">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-success-foreground/20 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-success-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-success-foreground">
                  ₹{earnings} Earned!
                </h3>
                <p className="text-success-foreground/80">
                  Credited to your PRx wallet
                </p>
              </div>
            </div>
            <Badge className="bg-success-foreground/20 text-success-foreground border-success-foreground/30">
              <Gift className="w-4 h-4 mr-2" />
              Instant Reward
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Video Preview & Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Video Preview */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Your Enhanced Video</CardTitle>
            <CardDescription>
              Preview your AI-enhanced unboxing video
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {videoFile && videoUrl ? (
              <video 
                controls 
                className="w-full rounded-lg"
                style={{ aspectRatio: '16/9' }}
                poster={videoUrl}
              >
                <source src={videoUrl} type={videoFile.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="font-medium">Enhanced Video Preview</p>
                  <p className="text-sm text-muted-foreground">
                    {videoFile?.name || 'Your unboxing video'}
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-gradient-card rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">File:</span>
                <span className="font-medium">{videoFile?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{videoFile ? (videoFile.size / (1024 * 1024)).toFixed(1) : 0}MB</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyVideoUrl}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referral Info */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Your Referral Code
            </CardTitle>
            <CardDescription>
              Earn 5% commission on every referral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-card rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Referral Code</p>
                  <p className="text-2xl font-bold font-mono">{referralCode}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyReferralCode}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Commission per referral:</span>
                <span className="font-semibold text-success">5%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Maximum per month:</span>
                <span className="font-semibold">₹500</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Current earnings:</span>
                <span className="font-semibold text-accent">₹{earnings}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Options */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Video
          </CardTitle>
          <CardDescription>
            Choose where to share your video and reach more people
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {socialPlatforms.map((platform) => (
              <Card 
                key={platform.name}
                className="cursor-pointer hover:shadow-soft transition-all hover:scale-105"
                onClick={() => handleShare(platform.name, platform.shareType)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl`}>
                    {platform.icon}
                  </div>
                  <h4 className="font-semibold mb-1">{platform.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {platform.description}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-3 w-full"
                    disabled={isSharing}
                  >
                    {isSharing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3 h-3 mr-2" />
                        Share
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Share Message */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Customize Your Message</CardTitle>
          <CardDescription>
            Personalize the message that goes with your video
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Just saved big on my medicines with PlatinumRx! Check out my unboxing video and save money too with my referral code..."
            className="min-h-[100px]"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
          
          <div className="flex items-center space-x-4">
            <Input 
              placeholder="Add hashtags..."
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
            <Button variant="outline">
              Add Hashtags
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-gradient-card shadow-soft border-0">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <TrendingUp className="w-12 h-12 text-primary mx-auto" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Keep Creating & Earning!</h3>
              <p className="text-muted-foreground mb-4">
                Create more videos with your next orders and maximize your earnings
              </p>
              <Button 
                className="bg-gradient-primary"
                onClick={onCreateAnother}
              >
                Create Another Video
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}