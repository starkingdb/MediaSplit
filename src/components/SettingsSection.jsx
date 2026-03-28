import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, Smartphone, Instagram, Clock, Youtube } from 'lucide-react';

const PRESETS = [
  { id: 'whatsapp', name: 'WhatsApp', duration: 60, icon: Smartphone },
  { id: 'instagram', name: 'Instagram', duration: 60, icon: Instagram },
  { id: 'tiktok', name: 'TikTok', duration: 600, icon: Clock },
  { id: 'shorts', name: 'Shorts', duration: 60, icon: Youtube },
];

export default function SettingsSection({ settings, onSettingsChange, darkMode, disabled }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetClick = (duration) => {
    onSettingsChange({ ...settings, chunkSize: duration });
  };

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      darkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-200 bg-white'
    }`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className={`w-5 h-5 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
          <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Settings
          </h2>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1 text-sm ${
            darkMode ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Advanced
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Presets */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Quick Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isActive = settings.chunkSize === preset.duration;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.duration)}
                  disabled={disabled}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    isActive 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                      : darkMode 
                        ? 'border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-zinc-300' 
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-500 hover:text-zinc-700'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{preset.name}</span>
                  <span className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {preset.duration}s
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Duration per clip (seconds)
          </label>
          <div className="relative">
            <input
              type="number"
              value={settings.chunkSize}
              onChange={(e) => onSettingsChange({ ...settings, chunkSize: Math.max(1, parseInt(e.target.value) || 1) })}
              min="1"
              disabled={disabled}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                darkMode 
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-emerald-500' 
                  : 'bg-white border-zinc-200 text-zinc-900 focus:border-emerald-500'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm ${
              darkMode ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              sec
            </span>
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-zinc-700/50">
            {/* Resolution */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Resolution
              </label>
              <select
                value={settings.resolution}
                onChange={(e) => onSettingsChange({ ...settings, resolution: e.target.value })}
                disabled={disabled}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  darkMode 
                    ? 'bg-zinc-800 border-zinc-700 text-white' 
                    : 'bg-white border-zinc-200 text-zinc-900'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="original">Original</option>
                <option value="720">720p</option>
                <option value="1080">1080p</option>
              </select>
            </div>

            {/* Format */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Format
              </label>
              <select
                value={settings.format}
                onChange={(e) => onSettingsChange({ ...settings, format: e.target.value })}
                disabled={disabled}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  darkMode 
                    ? 'bg-zinc-800 border-zinc-700 text-white' 
                    : 'bg-white border-zinc-200 text-zinc-900'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="mp4">MP4</option>
                <option value="webm">WebM</option>
              </select>
            </div>

            {/* Quality */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Quality
              </label>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map((q) => (
                  <button
                    key={q}
                    onClick={() => onSettingsChange({ ...settings, quality: q })}
                    disabled={disabled}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 capitalize transition-all ${
                      settings.quality === q 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                        : darkMode 
                          ? 'border-zinc-700 text-zinc-400' 
                          : 'border-zinc-200 text-zinc-600'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
