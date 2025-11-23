import React, { useCallback, useState } from 'react';
import { UploadCloud, FileType, X, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { FileData } from '../types';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../constants';

interface FileUploadProps {
  onFileSelect: (fileData: FileData) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    // Validate type roughly
    const isValidType = Object.keys(ACCEPTED_FILE_TYPES).some(mime => {
       // Simple check: if mime key matches start of file type or extensions match
       if (file.type.match(new RegExp(mime.replace('*', '.*')))) return true;
       // Check extension manually if type is empty/generic
       const ext = '.' + file.name.split('.').pop()?.toLowerCase();
       const extensions = ACCEPTED_FILE_TYPES[mime as keyof typeof ACCEPTED_FILE_TYPES];
       return extensions.includes(ext);
    });

    if (!isValidType) {
      setError("Unsupported file format. Please use PDF, JPG, PNG, or Text files.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 only
      const base64 = result.split(',')[1];
      
      onFileSelect({
        file,
        previewUrl: file.type.startsWith('image/') ? result : null,
        base64,
        mimeType: file.type || 'application/octet-stream',
      });
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center group cursor-pointer overflow-hidden
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
            : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50 bg-slate-800/30'}
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleInputChange}
          disabled={disabled}
          accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,.md,.json,.csv"
        />

        <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl border border-slate-700">
           {isDragging ? (
             <UploadCloud className="w-8 h-8 text-indigo-400" />
           ) : (
             <FileType className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" />
           )}
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">
          {isDragging ? 'Drop file to upload' : 'Click or drag file here'}
        </h3>
        <p className="text-sm text-slate-400 max-w-xs mx-auto">
          Supports PDF, JPG, PNG, TXT, MD (Max 10MB)
        </p>

        {/* Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const FilePreview: React.FC<{ fileData: FileData; onClear: () => void }> = ({ fileData, onClear }) => {
  const isImage = fileData.mimeType.startsWith('image/');
  
  return (
    <div className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex items-center gap-4 relative group">
       <div className="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center shrink-0 overflow-hidden border border-slate-600">
          {isImage && fileData.previewUrl ? (
            <img src={fileData.previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <FileText className="w-8 h-8 text-indigo-400" />
          )}
       </div>
       
       <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate pr-8">{fileData.file.name}</h4>
          <p className="text-sm text-slate-400">
            {(fileData.file.size / 1024 / 1024).toFixed(2)} MB • {fileData.mimeType}
          </p>
       </div>

       <button 
        onClick={onClear}
        className="p-2 rounded-full hover:bg-red-500/20 hover:text-red-400 text-slate-500 transition-colors"
        title="Remove file"
       >
         <X className="w-5 h-5" />
       </button>
    </div>
  );
};