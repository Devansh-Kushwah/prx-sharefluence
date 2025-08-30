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
  const [isConverting, setIsConverting] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [conversionProgress, setConversionProgress] = useState<string>('');
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

      // Try to use MP4 format first, fallback to WebM if not supported
      let mimeType = 'video/mp4';
      let fileExtension = '.mp4';
      
      // Check if MP4 is supported
      if (!MediaRecorder.isTypeSupported('video/mp4')) {
        // Try other MP4 variants
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
          mimeType = 'video/mp4;codecs=h264';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
          fileExtension = '.webm';
        } else {
          // Fallback to any supported format
          mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
          fileExtension = mimeType.includes('webm') ? '.webm' : '.mp4';
        }
      }

      console.log('Using recording format:', mimeType);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 5000000 // 5 Mbps for good quality
      });

      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        
        // Convert to MP4 if not already MP4
        if (mimeType !== 'video/mp4' && mimeType !== 'video/mp4;codecs=h264') {
          convertToMP4(blob, mimeType);
        } else {
          // Already MP4, create file directly
          const fileName = `platinumrx-video-${Date.now()}${fileExtension}`;
          const file = new File([blob], fileName, { type: mimeType });
          setRecordedBlob(blob);
          onVideoUpload(file);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check camera permissions.');
    }
  };

  const convertToMP4 = async (blob: Blob, originalType: string) => {
    try {
      console.log('Converting video to MP4...');
      setIsConverting(true);
      setConversionProgress('Starting conversion...');
      
      // Create video element for conversion
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        setConversionProgress('Processing video frames...');
        // Set canvas size to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Start video playback for frame capture
        video.currentTime = 0;
        video.play();
      };
      
      video.onseeked = () => {
        setConversionProgress('Converting to MP4 format...');
        // Draw video frame to canvas
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to MP4 using MediaRecorder
          const stream = canvas.captureStream(30); // 30 FPS
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/mp4'
          });
          
          const chunks: Blob[] = [];
          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
          };
          
          mediaRecorder.onstop = () => {
            setConversionProgress('Finalizing MP4 file...');
            const mp4Blob = new Blob(chunks, { type: 'video/mp4' });
            const fileName = `platinumrx-video-${Date.now()}.mp4`;
            const file = new File([mp4Blob], fileName, { type: 'video/mp4' });
            
            console.log('Video converted to MP4 successfully');
            setRecordedBlob(mp4Blob);
            setIsConverting(false);
            setConversionProgress('');
            onVideoUpload(file);
          };
          
          // Record for the duration of the original video
          mediaRecorder.start();
          setTimeout(() => {
            mediaRecorder.stop();
            video.pause();
          }, 5000); // Record for 5 seconds (adjust as needed)
        }
      };
      
      video.onerror = () => {
        console.error('Video conversion failed');
        setIsConverting(false);
        setConversionProgress('');
        // Fallback to original format
        const fileName = `platinumrx-video-${Date.now()}.webm`;
        const file = new File([blob], fileName, { type: originalType });
        setRecordedBlob(blob);
        onVideoUpload(file);
      };
      
      // Load video blob
      video.src = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error converting video:', error);
      setIsConverting(false);
      setConversionProgress('');
      // Fallback to original format
      const fileName = `platinumrx-video-${Date.now()}.webm`;
      const file = new File([blob], fileName, { type: originalType });
      setRecordedBlob(blob);
      onVideoUpload(file);
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
            <CardTitle className="flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Recorded Video Preview
            </CardTitle>
            <CardDescription>
              {isConverting ? (
                <div className="flex items-center space-x-2 text-amber-600">
                  <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  <span>{conversionProgress}</span>
                </div>
              ) : (
                'Review your recorded video before proceeding'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <video 
              src={URL.createObjectURL(recordedBlob)}
              controls 
              className="w-full rounded-lg"
              style={{ aspectRatio: '16/9' }}
            />
            
            <div className="p-3 bg-gradient-card rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Format:</span>
                <span className="font-medium">
                  {isConverting ? 'Converting to MP4...' : 
                   recordedBlob.type.includes('mp4') ? 'MP4 (Ready for sharing)' : 
                   recordedBlob.type.includes('webm') ? 'WebM (Converting to MP4)' : 
                   recordedBlob.type}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{(recordedBlob.size / (1024 * 1024)).toFixed(1)}MB</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={useRecordedVideo}
                className="flex-1"
                disabled={isConverting}
              >
                {isConverting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Use This Video
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setRecordedBlob(null);
                  setIsConverting(false);
                  setConversionProgress('');
                }}
                disabled={isConverting}
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