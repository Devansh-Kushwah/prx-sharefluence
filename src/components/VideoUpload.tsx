import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, Video, FileVideo, AlertCircle } from 'lucide-react';

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
}

export function VideoUpload({ onVideoUpload }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      validateAndUpload(videoFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file: File) => {
    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('File size too large. Please upload a video under 100MB.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file.');
      return;
    }

    onVideoUpload(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      });

      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const useRecordedVideo = () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], 'recorded-video.webm', {
        type: 'video/webm'
      });
      onVideoUpload(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Upload Your Unboxing Video</h2>
        <p className="text-muted-foreground">
          Record a new video or upload an existing one to get started
        </p>
      </div>

      {/* Recording Interface */}
      {!recordedBlob && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Record New Video
            </CardTitle>
            <CardDescription>
              Record directly in your browser for the best experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isRecording ? (
              <div className="text-center">
                <video 
                  ref={videoRef}
                  autoPlay 
                  muted 
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg bg-muted"
                  style={{ aspectRatio: '16/9' }}
                />
                <Button 
                  onClick={startRecording}
                  className="mt-4"
                  variant="default"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <video 
                  ref={videoRef}
                  autoPlay 
                  muted 
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg"
                  style={{ aspectRatio: '16/9' }}
                />
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <div className="flex items-center text-red-500">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                    Recording...
                  </div>
                  <Button 
                    onClick={stopRecording}
                    variant="destructive"
                  >
                    Stop Recording
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recorded Video Preview */}
      {recordedBlob && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Recorded Video Preview</CardTitle>
            <CardDescription>
              Review your recording and use it, or record again
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <video 
              controls 
              className="w-full max-w-md mx-auto rounded-lg"
              style={{ aspectRatio: '16/9' }}
            >
              <source src={URL.createObjectURL(recordedBlob)} type="video/webm" />
            </video>
            <div className="flex justify-center space-x-4">
              <Button onClick={useRecordedVideo} className="bg-gradient-success">
                <Video className="w-4 h-4 mr-2" />
                Use This Video
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setRecordedBlob(null);
                  setIsRecording(false);
                }}
              >
                Record Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Interface */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Existing Video
          </CardTitle>
          <CardDescription>
            Upload a video file from your device (Max 100MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/30 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileVideo className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop your video here</h3>
            <p className="text-muted-foreground mb-6">
              or click to browse your files
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="bg-gradient-card shadow-soft border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center text-accent-foreground">
            <AlertCircle className="w-5 h-5 mr-2" />
            Video Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Good lighting and clear audio</li>
                <li>• Show the medicines clearly</li>
                <li>• Mention your savings amount</li>
                <li>• Keep it between 15-60 seconds</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Technical Requirements</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Minimum 720p resolution</li>
                <li>• MP4, MOV, or AVI format</li>
                <li>• Maximum 100MB file size</li>
                <li>• Portrait or landscape orientation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}