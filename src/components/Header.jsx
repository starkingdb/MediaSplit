import React from 'react';
import { Moon, Sun, Loader2, CheckCircle2 } from 'lucide-react';

export default function Header({ title, darkMode, onToggleDark, status }) {
  return (
    <header className={`h-16 border-b flex items-center justify-between px-6 ${
      darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
    }`}>
      {/* Title */}
      <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
        {title}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {status === 'processing' ? (
            <>
              <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              <span className="text-sm text-amber-500 font-medium">Processing</span>
            </>
          ) : status === 'ready' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-500 font-medium">Ready</span>
            </>
          ) : null}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDark}
          className={`p-2 rounded-lg transition-all duration-200 ${
            darkMode 
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white' 
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900'
          }`}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
