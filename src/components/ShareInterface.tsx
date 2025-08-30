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
}

export function ShareInterface({ earnings, videoFile }: ShareInterfaceProps) {
  const [referralCode] = useState(`PRX${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
  const [videoUrl] = useState(`https://videos.platinumrx.com/ugc/${Date.now()}.mp4`);
  const [isSharing, setIsSharing] = useState(false);

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: '📱',
      color: 'bg-green-500',
      description: 'Share with family & friends'
    },
    {
      name: 'Instagram',
      icon: '📷',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Post to your story or feed'
    },
    {
      name: 'Facebook',
      icon: '👥',
      color: 'bg-blue-600',
      description: 'Share with your network'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-blue-400',
      description: 'Tweet to your followers'
    },
    {
      name: 'YouTube Shorts',
      icon: '🎬',
      color: 'bg-red-600',
      description: 'Upload as a short video'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700',
      description: 'Professional network'
    }
  ];

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  const handleCopyVideoUrl = () => {
    navigator.clipboard.writeText(videoUrl);
    toast.success('Video URL copied to clipboard!');
  };

  const handleDownload = () => {
    // Simulate download
    toast.success('Video downloaded to your device!');
  };

  const handleShare = (platform: string) => {
    setIsSharing(true);
    
    // Simulate sharing process
    setTimeout(() => {
      setIsSharing(false);
      toast.success(`Video shared to ${platform}! Your earnings have been credited.`);
    }, 2000);
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
                onClick={() => handleShare(platform.name)}
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
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Share
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
            defaultValue="Just saved ₹200 on my monthly medicines with @PlatinumRx! 💊💰 Check out my unboxing experience and use my referral code for exclusive discounts. #PlatinumRx #HealthcareSavings #MoneySaver"
          />
          
          <div className="flex items-center space-x-4">
            <Input 
              placeholder="Add hashtags..."
              defaultValue="#PlatinumRx #HealthcareSavings #MedicineDelivery"
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
              <Button className="bg-gradient-primary">
                Create Another Video
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}