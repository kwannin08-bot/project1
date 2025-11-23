import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload, FilePreview } from './components/FileUpload';
import { LanguageSelector } from './components/LanguageSelector';
import { ResultView } from './components/ResultView';
import { AppStatus, FileData } from './types';
import { translateDocument } from './services/geminiService';
import { Sparkles, ArrowRight, Loader2, FileCode, Play } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from './constants';

const App: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [targetLang, setTargetLang] = useState<string>(SUPPORTED_LANGUAGES[0].name);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [translation, setTranslation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (data: FileData) => {
    setFileData(data);
    setStatus(AppStatus.IDLE);
    setTranslation('');
    setError(null);
  };

  const handleClearFile = () => {
    setFileData(null);
    setStatus(AppStatus.IDLE);
    setTranslation('');
    setError(null);
  };

  const handleTranslate = async () => {
    if (!fileData || !fileData.base64) return;

    setStatus(AppStatus.TRANSLATING);
    setError(null);

    try {
      const result = await translateDocument(
        fileData.base64,
        fileData.mimeType,
        targetLang
      );
      setTranslation(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Panel: Input */}
        <div className="flex flex-col gap-6 animate-slide-up">
           <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <FileCode className="w-5 h-5 text-indigo-400" />
                 </div>
                 <h2 className="text-xl font-semibold text-white">Source Document</h2>
              </div>

              {!fileData ? (
                <FileUpload onFileSelect={handleFileSelect} />
              ) : (
                <div className="space-y-6">
                  <FilePreview fileData={fileData} onClear={handleClearFile} />
                  
                  <div className="h-px bg-slate-800 w-full" />
                  
                  <LanguageSelector 
                    selected={targetLang}
                    onChange={setTargetLang}
                    disabled={status === AppStatus.TRANSLATING}
                  />

                  <button
                    onClick={handleTranslate}
                    disabled={status === AppStatus.TRANSLATING}
                    className={`
                      w-full py-4 rounded-xl font-semibold text-white text-lg shadow-xl flex items-center justify-center gap-3 transition-all
                      ${status === AppStatus.TRANSLATING 
                        ? 'bg-slate-800 cursor-wait opacity-80' 
                        : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/25 active:scale-[0.98]'}
                    `}
                  >
                    {status === AppStatus.TRANSLATING ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Translate Now
                        <ArrowRight className="w-5 h-5 opacity-50" />
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-200 text-sm">
                      <strong className="block mb-1 text-red-400">Translation Failed</strong>
                      {error}
                    </div>
                  )}
                </div>
              )}
           </div>

           {/* Features / Info (Visible only when no file or idle) */}
           {!fileData && (
             <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-slate-800/20 border border-slate-800 rounded-2xl hover:bg-slate-800/40 transition-colors">
                  <h4 className="text-indigo-400 font-semibold mb-2">Multi-Format</h4>
                  <p className="text-sm text-slate-400">Support for PDF, JPG, PNG, and text-based documents.</p>
               </div>
               <div className="p-6 bg-slate-800/20 border border-slate-800 rounded-2xl hover:bg-slate-800/40 transition-colors">
                  <h4 className="text-violet-400 font-semibold mb-2">Smart Analysis</h4>
                  <p className="text-sm text-slate-400">Powered by Gemini 2.5 Flash for high-speed multimodal understanding.</p>
               </div>
             </div>
           )}
        </div>

        {/* Right Panel: Output */}
        <div className={`
          flex flex-col h-[600px] lg:h-[calc(100vh-140px)] sticky top-24 transition-all duration-500
          ${status === AppStatus.IDLE && !fileData ? 'opacity-50 blur-sm scale-95 pointer-events-none' : 'opacity-100 blur-0 scale-100'}
        `}>
           {status === AppStatus.SUCCESS ? (
             <ResultView content={translation} />
           ) : (
             <div className="h-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-8 border-dashed">
                {status === AppStatus.TRANSLATING ? (
                   <div className="space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
                        <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Analyzing Document</h3>
                        <p className="text-slate-400 max-w-xs mx-auto">Please wait while our AI extracts and translates the content...</p>
                      </div>
                   </div>
                ) : (
                   <div className="space-y-4 opacity-50">
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <Play className="w-8 h-8 text-slate-600 ml-1" />
                      </div>
                      <p className="text-lg font-medium text-slate-500">Translation will appear here</p>
                   </div>
                )}
             </div>
           )}
        </div>

      </main>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-violet-900/20 rounded-full blur-[128px]"></div>
      </div>
    </div>
  );
};

export default App;