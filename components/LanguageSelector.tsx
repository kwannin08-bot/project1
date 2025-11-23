import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  selected: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange, disabled }) => {
  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-slate-400 mb-2">Target Language</label>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.name}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};