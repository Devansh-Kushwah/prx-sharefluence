import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Sparkles, 
  FileVideo, 
  Palette, 
  Volume2, 
  Type,
  Crown,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface ProcessingStatusProps {
  progress: number;
  template: string;
  videoFile: File | null;
}

export function ProcessingStatus({ progress, template, videoFile }: ProcessingStatusProps) {
  const [currentStep, setCurrentStep] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const getTemplateInfo = () => {
    switch (template) {
      case 'no-edit':
        return {
          name: 'No Edits',
          icon: FileVideo,
          gradient: 'bg-gradient-to-br from-muted to-muted/80',
          steps: ['File optimization', 'Format conversion', 'Quality check']
        };
      case 'basic':
        return {
          name: 'Basic Edits',
          icon: Sparkles,
          gradient: 'bg-gradient-primary',
          steps: ['File analysis', 'Light correction', 'Noise reduction', 'Logo overlay', 'Stabilization']
        };
      case 'pro':
        return {
          name: 'Pro Edits',
          icon: Crown,
          gradient: 'bg-gradient-accent',
          steps: [
            'AI video analysis',
            'Caption generation',
            'Savings overlay creation',
            'Enhanced branding',
            'Audio enhancement',
            'Final rendering'
          ]
        };
      default:
        return {
          name: 'Processing',
          icon: Cpu,
          gradient: 'bg-gradient-primary',
          steps: ['Processing video']
        };
    }
  };

  const templateInfo = getTemplateInfo();

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * templateInfo.steps.length);
    const currentStepName = templateInfo.steps[stepIndex];
    
    if (currentStepName && currentStepName !== currentStep) {
      setCurrentStep(currentStepName);
      
      // Mark previous steps as completed
      const newCompletedSteps = templateInfo.steps.slice(0, stepIndex);
      setCompletedSteps(newCompletedSteps);
    }
  }, [progress, templateInfo.steps, currentStep]);

  const getStepIcon = (step: string) => {
    if (step.includes('analysis') || step.includes('File')) return Cpu;
    if (step.includes('Caption') || step.includes('overlay')) return Type;
    if (step.includes('Light') || step.includes('branding')) return Palette;
    if (step.includes('Audio') || step.includes('Noise')) return Volume2;
    if (step.includes('rendering') || step.includes('Quality')) return CheckCircle;
    return Sparkles;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Processing Your Video</h2>
        <p className="text-muted-foreground">
          Our AI is enhancing your video with the {templateInfo.name} template
        </p>
      </div>

      {/* Main Processing Card */}
      <Card className="shadow-strong">
        <CardHeader className="text-center">
          <div className={`w-20 h-20 ${templateInfo.gradient} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-medium animate-pulse`}>
            <templateInfo.icon className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl">{templateInfo.name} Processing</CardTitle>
          <CardDescription>
            Please wait while we enhance your video
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Current Step */}
          {currentStep && (
            <Card className="bg-gradient-card border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                  </div>
                  <div>
                    <p className="font-medium">Currently processing:</p>
                    <p className="text-sm text-primary">{currentStep}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Processing Steps */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Processing Steps</CardTitle>
          <CardDescription>
            Track the enhancement process in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templateInfo.steps.map((step, index) => {
              const StepIcon = getStepIcon(step);
              const isCompleted = completedSteps.includes(step);
              const isCurrent = step === currentStep;
              const isPending = !isCompleted && !isCurrent;

              return (
                <div 
                  key={index}
                  className={`flex items-center space-x-4 p-3 rounded-lg transition-all ${
                    isCompleted
                      ? 'bg-success/10 border border-success/20'
                      : isCurrent
                      ? 'bg-primary/10 border border-primary/20 animate-pulse'
                      : 'bg-muted/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-gradient-success'
                      : isCurrent
                      ? 'bg-gradient-primary'
                      : 'bg-muted'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-success-foreground" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                    ) : (
                      <StepIcon className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium ${
                      isCompleted
                        ? 'text-success'
                        : isCurrent
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}>
                      {step}
                    </p>
                  </div>

                  {isCompleted && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Complete
                    </Badge>
                  )}
                  
                  {isCurrent && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Processing...
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Video Preview During Processing */}
      {videoFile && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
            <CardDescription>Your original video being processed</CardDescription>
          </CardHeader>
          <CardContent>
            <video 
              controls 
              className="w-full max-w-md mx-auto rounded-lg"
              style={{ aspectRatio: '16/9' }}
            >
              <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
              Your browser does not support the video tag.
            </video>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {videoFile.name} • {(videoFile.size / (1024 * 1024)).toFixed(1)}MB
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI Disclosure */}
      <Card className="bg-gradient-card shadow-soft border-accent/20">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-4">
            <Cpu className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold">Processing with AI Enhancement</p>
              <p className="text-sm text-muted-foreground">
                Your video will be ready shortly. Don't close this page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}