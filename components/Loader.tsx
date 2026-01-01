import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-t-4 border-purple-500 animate-spin"></div>
        <div className="absolute inset-3 rounded-full border-r-4 border-indigo-500 animate-spin animation-delay-150"></div>
        <div className="absolute inset-6 rounded-full border-b-4 border-pink-500 animate-spin animation-delay-300"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Analyzing your vibe...</h2>
      <p className="text-purple-300 text-sm animate-pulse">Detecting emotions & curating playlist</p>
    </div>
  );
};

export default Loader;
