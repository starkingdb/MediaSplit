import React, { useState } from 'react';
import { Download, Share2, Loader2, Archive } from 'lucide-react';
import { canShare, formatFileSize } from '../lib/helpers';

export default function ActionsSection({ clips, file, onDownloadZip, onShare, darkMode, isProcessing }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const totalSize = clips.reduce((acc, clip) => acc + clip.size, 0);
  const canShareApi = canShare();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownloadZip();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!canShareApi) {
      alert('Web Share API not supported in this browser');
      return;
    }
    setIsSharing(true);
    try {
      await onShare();
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const hasClips = clips.length > 0;

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      darkMode ? 'border-zinc-700 bg-zinc-800/30' : 'border-zinc-200 bg-white'
    }`}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Stats */}
          <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            <span className="font-semibold text-zinc-300 dark:text-zinc-300">{clips.length} clips</span>
            <span className="mx-2">•</span>
            <span>Total: {formatFileSize(totalSize)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {/* Share Button */}
            {canShareApi && (
              <button
                onClick={handleShare}
                disabled={!hasClips || isSharing || isProcessing}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  hasClips && !isProcessing
                    ? darkMode 
                      ? 'bg-zinc-700 hover:bg-zinc-600 text-white' 
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {isSharing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
                Share
              </button>
            )}

            {/* Download ZIP Button */}
            <button
              onClick={handleDownload}
              disabled={!hasClips || isDownloading || isProcessing}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                hasClips && !isProcessing
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5'
                  : 'opacity-50 cursor-not-allowed bg-emerald-500'
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating ZIP...
                </>
              ) : (
                <>
                  <Archive className="w-5 h-5" />
                  Download ZIP
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
