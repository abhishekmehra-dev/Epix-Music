import React, { useRef, useEffect, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError("Unable to access camera. Please allow permissions.");
        console.error("Camera Error:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally for a mirror effect, feels more natural for selfies
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageSrc);
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-vibe-dark rounded-xl border border-red-500/30">
        <p className="text-red-400 mb-4 text-lg">{error}</p>
        <button 
          onClick={onCancel}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto object-cover transform -scale-x-100 min-h-[400px]"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center bg-gradient-to-t from-black/80 to-transparent gap-6">
         <button
          onClick={onCancel}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all text-white/80 hover:text-white"
          title="Cancel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <button
          onClick={handleCapture}
          className="w-16 h-16 rounded-full bg-white border-4 border-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-transform"
          aria-label="Capture Photo"
        >
          <div className="w-14 h-14 rounded-full border-2 border-black/10"></div>
        </button>
        
        <div className="w-12 h-12 opacity-0"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
};

export default CameraCapture;
