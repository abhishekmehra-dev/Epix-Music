import React, { useState, useEffect } from 'react';
import { AppState, MoodResult as MoodResultType } from './types';
import CameraCapture from './components/CameraCapture';
import MoodResult from './components/MoodResult';
import Loader from './components/Loader';
import { analyzeMoodAndGetSongs } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [moodData, setMoodData] = useState<MoodResultType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    // Check if API key is configured
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
      console.warn("API_KEY is missing. Please set it in your environment variables.");
      // We don't block the UI immediately, but we track it for error handling
      setIsApiKeyMissing(true);
    }
  }, []);

  const handleCapture = async (imageSrc: string) => {
    if (isApiKeyMissing) {
      setErrorMsg("The developer hasn't configured the API Key yet. Please add API_KEY to your environment variables.");
      setAppState(AppState.ERROR);
      return;
    }

    setAppState(AppState.ANALYZING);
    try {
      const result = await analyzeMoodAndGetSongs(imageSrc);
      setMoodData(result);
      setAppState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      setErrorMsg("We couldn't detect a face or analyze the mood properly. Please try again with better lighting.");
      setAppState(AppState.ERROR);
    }
  };

  const handleStart = () => {
    setAppState(AppState.SCANNING);
    setErrorMsg('');
  };

  const handleScanAgain = () => {
    setAppState(AppState.IDLE);
    setMoodData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white selection:bg-purple-500 selection:text-white overflow-x-hidden">
      
      {/* Background ambient glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Navbar / Logo */}
        <header className="flex justify-between items-center py-6 mb-8 md:mb-12">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleScanAgain}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              Epix Music
            </span>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
              Free Public Access
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col items-center justify-center">
          
          {appState === AppState.IDLE && (
            <div className="text-center max-w-2xl animate-fadeIn">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
                No Login Required • AI-Powered
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                Bollywood beats for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                  your every mood
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
                Epix Music uses AI to detect your emotions and curates the perfect Hindi playlist for the moment.
              </p>
              <button
                onClick={handleStart}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
              >
                <span className="mr-2 text-lg">Scan My Vibe</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </button>
              
              {isApiKeyMissing && (
                <p className="mt-8 text-amber-400 text-xs bg-amber-400/10 p-2 rounded-lg border border-amber-400/20">
                  ⚠️ Developer Note: Your API Key is not detected in environment variables.
                </p>
              )}
            </div>
          )}

          {appState === AppState.SCANNING && (
            <div className="w-full flex flex-col items-center animate-fadeIn">
               <h2 className="text-2xl font-semibold mb-6 text-center">Capture your expression</h2>
               <CameraCapture 
                 onCapture={handleCapture} 
                 onCancel={() => setAppState(AppState.IDLE)} 
               />
               <p className="mt-6 text-gray-500 text-sm">Ensure your face is well-lit and clearly visible.</p>
            </div>
          )}

          {appState === AppState.ANALYZING && (
            <Loader />
          )}

          {appState === AppState.RESULTS && moodData && (
            <MoodResult data={moodData} onScanAgain={handleScanAgain} />
          )}

          {appState === AppState.ERROR && (
            <div className="text-center max-w-md bg-white/5 p-8 rounded-2xl border border-red-500/30 backdrop-blur-md animate-fadeIn">
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Oops!</h2>
              <p className="text-gray-300 mb-6">{errorMsg}</p>
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          )}

        </main>
        
        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm py-4">
          <p>© {new Date().getFullYear()} Epix Music. No login required. Powered by Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;