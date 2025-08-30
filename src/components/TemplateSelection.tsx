import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileVideo, 
  Sparkles, 
  Crown, 
  CheckCircle, 
  Clock,
  Palette,
  Type,
  Music,
  Zap
} from 'lucide-react';

interface TemplateSelectionProps {
  onTemplateSelect: (template: string) => void;
}

export function TemplateSelection({ onTemplateSelect }: TemplateSelectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const templates = [
    {
      id: 'no-edit',
      name: 'No Edits',
      description: 'Raw video with minimal processing',
      price: 'Free',
      processingTime: 'Instant',
      features: [
        'File compression',
        'Format standardization',
        'Quick processing'
      ],
      icon: FileVideo,
      gradient: 'bg-gradient-to-br from-muted to-muted/80',
      popular: false
    },
    {
      id: 'basic',
      name: 'Basic Edits',
      description: 'Enhanced video with professional touches',
      price: 'Free',
      processingTime: '2-3 minutes',
      features: [
        'Auto light correction',
        'Noise reduction',
        'PlatinumRx logo watermark',
        'Video stabilization'
      ],
      icon: Sparkles,
      gradient: 'bg-gradient-primary',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro Edits',
      description: 'Premium enhancement with AI-powered features',
      price: 'Free',
      processingTime: '5-7 minutes',
      features: [
        'All Basic features',
        'Dynamic captions/subtitles',
        'Savings amount overlay',
        'Enhanced branding',
        'Background music',
        'Professional transitions'
      ],
      icon: Crown,
      gradient: 'bg-gradient-accent',
      popular: false
    }
  ];

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Enhancement Level</h2>
        <p className="text-muted-foreground">
          Select how you want your video to be processed by our AI
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-medium ${
              selectedTemplate === template.id
                ? 'ring-2 ring-primary shadow-medium scale-105'
                : 'hover:scale-102'
            } ${template.popular ? 'border-primary/50' : ''}`}
            onClick={() => handleSelect(template.id)}
          >
            {template.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-success">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 ${template.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft`}>
                <template.icon className="w-8 h-8 text-white" />
              </div>
              
              <CardTitle className="text-xl">{template.name}</CardTitle>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
              
              <div className="flex justify-center space-x-4 mt-4">
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  {template.price}
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Clock className="w-3 h-3 mr-1" />
                  {template.processingTime}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Features included:</h4>
                <ul className="space-y-2">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {selectedTemplate === template.id && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center text-primary text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Selected Template
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Disclosure */}
      <Card className="bg-gradient-card shadow-soft border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">AI Enhancement Notice</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Videos processed with Basic or Pro templates will include "Enhanced with AI" watermarks 
                for transparency. This ensures compliance with platform policies and builds trust with viewers.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-xs">
                <div className="flex items-center">
                  <Palette className="w-4 h-4 mr-2 text-primary" />
                  Visual Enhancement
                </div>
                <div className="flex items-center">
                  <Type className="w-4 h-4 mr-2 text-primary" />
                  Text & Captions
                </div>
                <div className="flex items-center">
                  <Music className="w-4 h-4 mr-2 text-primary" />
                  Audio Processing
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleContinue}
          disabled={!selectedTemplate}
          className="bg-gradient-success hover:shadow-medium transition-all"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start Processing
        </Button>
      </div>
    </div>
  );
}