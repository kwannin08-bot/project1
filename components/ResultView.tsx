import React, { useState } from 'react';
import { Download, Mail, Check, Copy, Share2 } from 'lucide-react';

interface ResultViewProps {
  content: string;
}

export const ResultView: React.FC<ResultViewProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    // Simulate email sending
    setEmailStatus('sending');
    setTimeout(() => {
      setEmailStatus('sent');
      setTimeout(() => setEmailStatus('idle'), 3000);
      
      // Fallback for demo: Open mail client
      const subject = encodeURIComponent("Translated Document");
      const body = encodeURIComponent("Here is your translation:\n\n" + content.substring(0, 1000) + "...\n\n(Content truncated for mailto link)");
      window.open(`mailto:?subject=${subject}&body=${body}`);
      
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-slate-900/50 border-b border-slate-700">
        <h3 className="font-semibold text-white flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           Translation Result
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Copy Markdown"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          
          <div className="h-4 w-[1px] bg-slate-700 mx-1"></div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>

          <button
            onClick={handleEmail}
            disabled={emailStatus !== 'idle'}
            className={`
              flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all
              ${emailStatus === 'sent' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}
            `}
          >
             {emailStatus === 'sending' ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             ) : emailStatus === 'sent' ? (
                <Check className="w-3.5 h-3.5" />
             ) : (
                <Mail className="w-3.5 h-3.5" />
             )}
             {emailStatus === 'sent' ? 'Sent' : 'Email'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
      
      <div className="p-2 bg-slate-900/30 text-[10px] text-center text-slate-600 border-t border-slate-800">
        AI Generated Content • Please verify for accuracy
      </div>
    </div>
  );
};