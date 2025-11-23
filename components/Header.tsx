import React from 'react';
import { Languages, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              PolyGlot AI
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">UNIVERSAL TRANSLATOR</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Languages className="w-4 h-4" />
            <span>Powered by Gemini 2.5</span>
          </div>
        </div>
      </div>
    </header>
  );
};