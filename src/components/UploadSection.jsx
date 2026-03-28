import React, { useState, useRef } from 'react';
import { Upload, Film, Volume2 } from 'lucide-react';
import { formatFileSize, formatTime, validateFile } from '../lib/helpers';

export default function UploadSection({ file, onFileSelect, darkMode }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError('');
    onFileSelect(file);
  };

  const isAudio = file?.type.startsWith('audio');

  return (
    <div className={`rounded-2xl border-2 transition-all duration-300 ${
      isDragging 
        ? 'border-emerald-500 bg-emerald-500/10' 
        : darkMode 
          ? 'border-zinc-700 bg-zinc-800/30' 
          : 'border-zinc-200 bg-white'
    }`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative p-8 cursor-pointer transition-all duration-300 ${
          isDragging ? 'scale-[0.99]' : ''
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*,audio/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {!file ? (
          <div className="text-center py-12">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDragging 
                ? 'bg-emerald-500 text-white scale-110' 
                : darkMode 
                  ? 'bg-zinc-800 text-zinc-400' 
                  : 'bg-zinc-100 text-zinc-500'
            }`}>
              <Upload className="w-10 h-10" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              {isDragging ? 'Suelta el archivo' : 'Drag & drop your video'}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              or click to upload • MP4, WebM, MP3, WAV
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            {/* File Icon */}
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              isAudio 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {isAudio ? <Volume2 className="w-8 h-8" /> : <Film className="w-8 h-8" />}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold truncate ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {file.name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  darkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {formatFileSize(file.size)}
                </span>
                {file.duration && (
                  <span className="px-3 py-1 rounded-lg text-sm font-medium bg-emerald-500/20 text-emerald-400">
                    {formatTime(file.duration)}
                  </span>
                )}
              </div>
            </div>

            {/* Change file button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
              }`}
            >
              Change
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
