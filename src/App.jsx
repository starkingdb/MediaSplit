import React, { useState, useEffect, useCallback } from 'react';
import { initFFmpeg, splitMedia, createZip } from './lib/ffmpeg';
import { getDarkMode, setDarkMode, getSettings, setSettings, getHistory, addToHistory } from './lib/storage';
import { generateClipName } from './lib/helpers';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import SettingsSection from './components/SettingsSection';
import ProcessingSection from './components/ProcessingSection';
import ResultsSection from './components/ResultsSection';
import ActionsSection from './components/ActionsSection';

export default function App() {
  // State
  const [darkMode, setDarkModeState] = useState(getDarkMode);
  const [settings, setSettingsState] = useState(getSettings);
  const [history, setHistory] = useState(getHistory);
  
  // File & Processing
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(0);
  const [clips, setClips] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  
  // Status
  const [status, setStatus] = useState('ready');

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    setDarkMode(darkMode);
  }, [darkMode]);

  // Save settings when changed
  useEffect(() => {
    setSettings(settings);
  }, [settings]);

  // Initialize FFmpeg on mount
  useEffect(() => {
    initFFmpeg().then(() => setFfmpegLoaded(true)).catch(console.error);
  }, []);

  // Handlers
  const handleToggleDarkMode = () => setDarkModeState(!darkMode);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setDuration(0);
      setClips([]);
      return;
    }
    
    setFile(selectedFile);
    setClips([]);
    
    // Get duration
    const tempUrl = URL.createObjectURL(selectedFile);
    const mediaElement = document.createElement(selectedFile.type.startsWith('audio') ? 'audio' : 'video');
    mediaElement.src = tempUrl;
    mediaElement.onloadedmetadata = () => {
      setDuration(mediaElement.duration);
      URL.revokeObjectURL(tempUrl);
    };
  };

  const handleSettingsChange = (newSettings) => {
    setSettingsState(newSettings);
  };

  const handleProcess = async () => {
    if (!file || duration === 0) return;
    
    setIsProcessing(true);
    setStatus('processing');
    setProgress(0);
    setClips([]);

    try {
      const results = await splitMedia(file, settings.chunkSize, setProgress);
      
      // Add clip info
      const processedClips = results.map((clip, idx) => ({
        ...clip,
        id: Date.now() + idx,
        name: generateClipName(idx, settings.format)
      }));
      
      setClips(processedClips);
      
      // Add to history
      const totalSize = processedClips.reduce((acc, c) => acc + c.size, 0);
      addToHistory({
        fileName: file.name,
        clips: processedClips,
        totalSize,
        settings: { ...settings }
      });
      setHistory(getHistory());
      
      setStatus('ready');
    } catch (err) {
      console.error('Processing error:', err);
      alert('Error: ' + err.message);
      setStatus('ready');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClip = (index) => {
    setClips(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownloadZip = async () => {
    if (clips.length === 0) return;
    try {
      const zipUrl = await createZip(clips);
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `mediasplit_${Date.now()}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(zipUrl), 10000);
    } catch (err) {
      console.error('ZIP error:', err);
      alert('Error creating ZIP');
    }
  };

  const handleShare = async () => {
    if (clips.length === 0) return;
    
    try {
      await navigator.share({
        title: 'MediaSplit Clips',
        text: `Generated ${clips.length} clips from ${file.name}`,
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
      }
    }
  };

  const handleNewSplit = () => {
    setFile(null);
    setDuration(0);
    setClips([]);
    setProgress(0);
  };

  const handleLoadFromHistory = (item) => {
    // Load clips from history (note: URLs will be stale, but metadata persists)
    setFile({ 
      name: item.fileName, 
      type: 'video/mp4',
      chunkSize: item.settings?.chunkSize || 60
    });
    setSettingsState(item.settings || getSettings());
    setClips(item.clips || []);
    setDuration(0);
  };

  // Determine page title
  const getPageTitle = () => {
    if (file) return `Splitting: ${file.name}`;
    if (clips.length > 0) return `${clips.length} Clips Ready`;
    return 'Video Splitter';
  };

  return (
    <div className={`h-screen flex ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
      {/* Sidebar */}
      <Sidebar 
        history={history}
        onNewSplit={handleNewSplit}
        onLoadFromHistory={handleLoadFromHistory}
        darkMode={darkMode}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          title={getPageTitle()}
          darkMode={darkMode}
          onToggleDark={handleToggleDarkMode}
          status={status}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Upload Section */}
            <UploadSection
              file={file}
              onFileSelect={handleFileSelect}
              darkMode={darkMode}
            />

            {/* Settings Section */}
            {file && !isProcessing && clips.length === 0 && (
              <SettingsSection
                settings={settings}
                onSettingsChange={handleSettingsChange}
                darkMode={darkMode}
                disabled={isProcessing}
              />
            )}

            {/* Process Button */}
            {file && !isProcessing && clips.length === 0 && (
              <button
                onClick={handleProcess}
                disabled={!ffmpegLoaded}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                  ffmpegLoaded
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1'
                    : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                }`}
              >
                {ffmpegLoaded ? 'Start Processing' : 'Loading FFmpeg...'}
              </button>
            )}

            {/* Processing Section */}
            {isProcessing && (
              <ProcessingSection progress={progress} darkMode={darkMode} />
            )}

            {/* Results Section */}
            {clips.length > 0 && !isProcessing && (
              <ResultsSection
                clips={clips}
                file={{ ...file, duration, chunkSize: settings.chunkSize }}
                onDeleteClip={handleDeleteClip}
                darkMode={darkMode}
              />
            )}

            {/* Actions Section */}
            {clips.length > 0 && !isProcessing && (
              <ActionsSection
                clips={clips}
                file={file}
                onDownloadZip={handleDownloadZip}
                onShare={handleShare}
                darkMode={darkMode}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
