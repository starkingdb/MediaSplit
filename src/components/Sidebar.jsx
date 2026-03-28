import React from 'react';
import { Film, Plus, History, Trash2, Clock } from 'lucide-react';
import { formatDate, formatFileSize } from '../lib/helpers';
import { clearHistory } from '../lib/storage';

export default function Sidebar({ history, onNewSplit, onLoadFromHistory, darkMode }) {
  const handleClearHistory = (e) => {
    e.stopPropagation();
    if (confirm('¿Eliminar todo el historial?')) {
      clearHistory();
    }
  };

  return (
    <aside className={`w-64 ${darkMode ? 'bg-zinc-900' : 'bg-white'} border-r ${darkMode ? 'border-zinc-800' : 'border-zinc-200'} flex flex-col h-full`}>
      {/* Logo */}
      <div className="p-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Media<span className="text-emerald-500">Split</span>
          </span>
        </div>
      </div>

      {/* New Split Button */}
      <div className="p-4">
        <button
          onClick={onNewSplit}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          New Split
        </button>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400">
            <History className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">History</span>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-zinc-500 hover:text-red-400 transition-colors"
              title="Clear history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
          {history.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay historial</p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onLoadFromHistory(item)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  darkMode 
                    ? 'bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-emerald-500/30' 
                    : 'bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-emerald-300'
                }`}
              >
                <div className={`text-sm font-medium truncate ${darkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                  {item.fileName}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                  <span>{item.clips.length} clips</span>
                  <span>•</span>
                  <span>{formatFileSize(item.totalSize)}</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {formatDate(item.timestamp)}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
