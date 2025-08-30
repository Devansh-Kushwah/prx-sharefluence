import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Video, 
  Camera, 
  Smartphone, 
  Share2, 
  Coins, 
  Gift, 
  Play,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  TrendingUp
} from 'lucide-react';
import { VideoUpload } from './VideoUpload';
import { TemplateSelection } from './TemplateSelection';
import { ProcessingStatus } from './ProcessingStatus';
import { ShareInterface } from './ShareInterface';
import { RewardsTracker } from './RewardsTracker';
import heroImage from '@/assets/hero-background.jpg';

type Step = 'welcome' | 'upload' | 'template' | 'processing' | 'complete';

export default function UGCLandingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
    setCurrentStep('template');
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setCurrentStep('processing');
    
    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCurrentStep('complete');
          setEarnings(100);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeSection onGetStarted={() => setCurrentStep('upload')} />;
      case 'upload':
        return <VideoUpload onVideoUpload={handleVideoUpload} />;
      case 'template':
        return <TemplateSelection onTemplateSelect={handleTemplateSelect} />;
      case 'processing':
        return <ProcessingStatus progress={processingProgress} template={selectedTemplate} />;
      case 'complete':
        return <ShareInterface earnings={earnings} videoFile={uploadedVideo} />;
      default:
        return <WelcomeSection onGetStarted={() => setCurrentStep('upload')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">PlatinumRx</h1>
                <p className="text-xs text-primary-foreground/80">UGC Creator</p>
              </div>
            </div>
            <RewardsTracker earnings={earnings} />
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      {currentStep !== 'welcome' && (
        <div className="bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <StepProgress currentStep={currentStep} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderStepContent()}
      </main>
    </div>
  );
}

function WelcomeSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-hero shadow-strong">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative px-8 py-16 text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground hover:bg-accent-hover">
            <Gift className="w-4 h-4 mr-2" />
            Earn ₹100 + Referral Rewards
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            Share Your Savings Story
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Create professional unboxing videos with AI enhancement and earn rewards for every share
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={onGetStarted}
            className="bg-secondary hover:bg-secondary-hover text-secondary-foreground shadow-medium"
          >
            <Video className="w-5 h-5 mr-2" />
            Start Creating - Earn ₹100
          </Button>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-6 h-6 text-success-foreground" />
            </div>
            <CardTitle>Instant Rewards</CardTitle>
            <CardDescription>₹100 PRx coins for each shared video</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Get rewarded immediately when you share your unboxing experience
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle>AI Enhancement</CardTitle>
            <CardDescription>Professional quality with zero effort</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Our AI adds captions, branding, and professional touches automatically
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-accent-foreground" />
            </div>
            <CardTitle>Referral Earnings</CardTitle>
            <CardDescription>5% commission on referrals</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Earn ongoing commissions when friends use your referral links
            </p>
          </CardContent>
        </Card>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: Upload, title: "Upload Video", desc: "Record or upload your unboxing video" },
            { icon: Sparkles, title: "Choose Template", desc: "Select AI enhancement level" },
            { icon: Video, title: "AI Processing", desc: "We enhance your video professionally" },
            { icon: Share2, title: "Share & Earn", desc: "Share on social media and get rewarded" }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StepProgress({ currentStep }: { currentStep: Step }) {
  const steps = [
    { key: 'upload', label: 'Upload' },
    { key: 'template', label: 'Template' },
    { key: 'processing', label: 'Processing' },
    { key: 'complete', label: 'Share' }
  ];

  const currentIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div>
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={step.key} 
            className={`text-sm font-medium ${
              index <= currentIndex ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {step.label}
          </div>
        ))}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}