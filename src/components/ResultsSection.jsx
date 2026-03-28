import React from 'react';
import { Film, Volume2, Trash2, Play, Download } from 'lucide-react';
import { formatTime, formatFileSize } from '../lib/helpers';

export default function ResultsSection({ clips, file, onDeleteClip, darkMode }) {
  const isAudio = file?.type.startsWith('audio');

  const calculateDuration = (index) => {
    if (!file?.duration) return 0;
    const start = index * (file.chunkSize || 60);
    const end = Math.min(start + (file.chunkSize || 60), file.duration);
    return end - start;
  };

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      darkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-200 bg-white'
    }`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Film className={`w-5 h-5 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
          <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Generated Clips
          </h2>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            darkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
          }`}>
            {clips.length}
          </span>
        </div>
      </div>

      {/* Clips Grid */}
      <div className="p-6">
        {clips.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            No clips generated yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clips.map((clip, index) => {
              const duration = calculateDuration(index);
              const isAudioType = isAudio || clip.name?.includes('.mp3');
              
              return (
                <div 
                  key={clip.id || index}
                  className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                    darkMode 
                      ? 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600' 
                      : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {/* Preview */}
                  <div className={`aspect-video flex items-center justify-center relative ${
                    darkMode ? 'bg-zinc-900' : 'bg-zinc-100'
                  }`}>
                    {isAudioType ? (
                      <Volume2 className={`w-12 h-12 ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`} />
                    ) : (
                      <video 
                        src={clip.url} 
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    )}
                    
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity">
                      <Play className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>

                    {/* Duration badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-xs font-medium">
                      {formatTime(duration)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                          {clip.name}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          {formatFileSize(clip.size)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {/* Download single */}
                        <a
                          href={clip.url}
                          download={clip.name}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'hover:bg-zinc-700 text-zinc-400 hover:text-white' 
                              : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                          }`}
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        
                        {/* Delete */}
                        <button
                          onClick={() => onDeleteClip(index)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'hover:bg-red-500/20 text-zinc-400 hover:text-red-400' 
                              : 'hover:bg-red-100 text-zinc-500 hover:text-red-600'
                          }`}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
