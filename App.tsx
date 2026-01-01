
import React, { useState, useRef, useCallback } from 'react';
import type { AppState, ScanResult } from './types';
import { analyzeImage } from './services/geminiService';
import AnimatedBackground from './components/AnimatedBackground';
import CameraFeed from './components/CameraFeed';
import ResultsDisplay from './components/ResultsDisplay';
import { CameraIcon, SparklesIcon } from './components/icons/Icons';

export default function App(): React.ReactElement {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleStartScanning = () => {
    setAppState('SCANNING');
    setError(null);
    setScanResult(null);
  };

  const handleScanFace = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera components are not ready.');
      setAppState('ERROR');
      return;
    }

    setAppState('LOADING');
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
        setError('Could not get canvas context.');
        setAppState('ERROR');
        return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg');
    const base64Data = imageDataUrl.split(',')[1];

    try {
      const result = await analyzeImage(base64Data);
      setScanResult(result);
      setAppState('RESULTS');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState('ERROR');
    }
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'SCANNING':
      case 'LOADING':
        return (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            <CameraFeed ref={videoRef} isScanning={appState === 'SCANNING' || appState === 'LOADING'} />
            <canvas ref={canvasRef} className="hidden"></canvas>
            <button
              onClick={handleScanFace}
              disabled={appState === 'LOADING'}
              className="mt-6 flex items-center justify-center gap-3 px-8 py-4 bg-purple-600/50 text-white font-bold rounded-full backdrop-blur-md border border-purple-400/50 hover:bg-purple-600/70 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {appState === 'LOADING' ? (
                <>
                  <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                  Analyzing Vibe...
                </>
              ) : (
                <>
                  <CameraIcon />
                  Scan My Face
                </>
              )}
            </button>
          </div>
        );
      case 'RESULTS':
        return scanResult && <ResultsDisplay result={scanResult} onScanAgain={handleStartScanning} />;
      case 'ERROR':
        return (
          <div className="text-center p-8 bg-red-500/10 rounded-2xl backdrop-blur-sm border border-red-500/20">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong.</h2>
            <p className="text-red-200 mb-6">{error}</p>
            <button onClick={handleStartScanning} className="px-6 py-2 bg-red-600/50 text-white font-semibold rounded-full hover:bg-red-600/70 transition-colors">
              Try Again
            </button>
          </div>
        );
      case 'IDLE':
      default:
        return (
          <div className="text-center flex flex-col items-center">
            <div className="p-4 bg-white/10 rounded-full mb-6 animate-pulse">
               <SparklesIcon />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">Epix Music</h1>
            <p className="text-lg md:text-xl text-purple-200 max-w-xl mb-8">
              Discover your next favorite song. Let our AI scan your mood and curate a personalized playlist just for you.
            </p>
            <button
              onClick={handleStartScanning}
              className="flex items-center gap-3 px-8 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20"
            >
              <CameraIcon />
              Start Your Vibe Check
            </button>
          </div>
        );
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 text-white overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 w-full">
        {renderContent()}
      </div>
    </main>
  );
}
