import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function ProcessingSection({ progress, darkMode }) {
  return (
    <div className={`rounded-2xl border overflow-hidden ${
      darkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-200 bg-white'
    }`}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Processing video...
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className={darkMode ? 'text-zinc-400' : 'text-zinc-500'}>
              Generating clips
            </span>
            <span className="text-emerald-500 font-semibold">{progress}%</span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${
            darkMode ? 'bg-zinc-700' : 'bg-zinc-200'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Status messages */}
        <div className={`text-center text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {progress < 30 && 'Loading FFmpeg engine...'}
          {progress >= 30 && progress < 60 && 'Analyzing video...'}
          {progress >= 60 && progress < 90 && 'Splitting into clips...'}
          {progress >= 90 && 'Finalizing clips...'}
        </div>

        {/* FFmpeg info */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Sparkles className="w-3 h-3" />
          <span>Powered by FFmpeg.wasm • 100% local processing</span>
        </div>
      </div>
    </div>
  );
}
