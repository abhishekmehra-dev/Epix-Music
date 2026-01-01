import React from 'react';
import { MoodResult as MoodResultType, Song } from '../types';

interface MoodResultProps {
  data: MoodResultType;
  onScanAgain: () => void;
}

const MoodResult: React.FC<MoodResultProps> = ({ data, onScanAgain }) => {
  const getYoutubeLink = (song: Song) => {
    const query = `${song.title} ${song.artist} ${song.album || ''} song`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header Section */}
      <div className="text-center mb-10">
        <p className="text-purple-300 font-medium mb-2 tracking-wide uppercase text-sm opacity-80">AI detected your vibe as</p>
        <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl">
          {data.mood}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Playlist Section - Takes up 2/3 width on desktop */}
        <div className="md:col-span-2 bg-vibe-card/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
            Your Personalized Playlist
          </h2>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {data.playlist.map((song, index) => (
              <a 
                key={index}
                href={getYoutubeLink(song)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-purple-500/30 cursor-pointer"
              >
                {/* Music Icon/Album Art Placeholder */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-300 mr-4 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                </div>
                
                {/* Song Info */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-white truncate text-lg group-hover:text-purple-300 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {song.artist} {song.album && <span className="text-gray-600">• {song.album}</span>}
                  </p>
                </div>

                {/* External Link Icon */}
                <div className="ml-4 text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Associated Moods Section - Takes up 1/3 width */}
        <div className="bg-vibe-card/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/5 shadow-lg h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
            Associated Moods
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.associatedMoods.map((mood, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 rounded-full bg-indigo-900/40 text-indigo-200 text-sm font-medium border border-indigo-500/20 hover:bg-indigo-800/50 transition-colors"
              >
                {mood}
              </span>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-white/5 text-center">
            <p className="text-sm text-gray-400 mb-4">Not quite right? Try another scan.</p>
            <button
              onClick={onScanAgain}
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-900/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Scan Again
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MoodResult;
