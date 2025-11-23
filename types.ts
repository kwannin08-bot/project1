export interface TranslationRequest {
  file: File;
  targetLanguage: string;
}

export interface TranslationResult {
  originalText?: string;
  translatedText: string;
  detectedMimeType: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  TRANSLATING = 'TRANSLATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export interface FileData {
  file: File;
  previewUrl: string | null;
  base64: string | null; // Base64 content without prefix
  mimeType: string;
}