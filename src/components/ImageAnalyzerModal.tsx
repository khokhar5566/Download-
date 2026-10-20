import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Loader2,
  FileImage,
  Copy,
  Plus,
  CheckCircle,
  Clapperboard,
} from 'lucide-react';
import { SAMPLE_PHOTOS, SamplePhoto } from '../data/sampleImages.ts';

interface ImageAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppendNarrationToScript?: (narrationLine: string) => void;
}

export const ImageAnalyzerModal: React.FC<ImageAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onAppendNarrationToScript,
}) => {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('براہ کرم تصویر والی فائل منتخب کریں (Please select an image)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      setImagePreviewUrl(resultStr);

      // Extract raw base64 and mime type
      const parts = resultStr.split(',');
      if (parts.length === 2) {
        const mimeMatch = parts[0].match(/:(.*?);/);
        setSelectedMimeType(mimeMatch ? mimeMatch[1] : file.type);
        setSelectedImageBase64(parts[1]);
      }
      setError(null);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Select sample photo
  const handleSelectSample = (sample: SamplePhoto) => {
    // Convert SVG to data URI
    const svgBase64 = btoa(unescape(encodeURIComponent(sample.sampleSvg)));
    setSelectedImageBase64(svgBase64);
    setSelectedMimeType('image/svg+xml');
    setImagePreviewUrl(`data:image/svg+xml;base64,${svgBase64}`);
    setCustomPrompt(sample.promptSuggestion);
    setError(null);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImageBase64) {
      setError('براہ کرم پہلے تصویر اپلوڈ کریں (Please upload an image first)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImageBase64,
          mimeType: selectedMimeType,
          userPrompt: customPrompt.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze photo with Gemini 4 Argon');
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Error occurred during image analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0b0f19] border border-purple-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-purple-950/50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>تصویر کا بصری تجزیہ (Gemini 4 Argon)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  gemini-4-argon
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                تاریخی اور جدید تصاویر کا تجزیہ، کیمرہ موومنٹ، اور اردو ڈاکومنٹری جملوں کی تیاری
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Sample archetypes */}
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2">
              تاریخی و جدید نمائندہ مناظر (Click to load sample UAE documentary photo):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PHOTOS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-left transition-all flex flex-col gap-1.5 group cursor-pointer"
                >
                  <div
                    className="w-full h-16 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center p-1"
                    dangerouslySetInnerHTML={{ __html: sample.sampleSvg }}
                  />
                  <div>
                    <div className="text-[11px] font-bold text-slate-200 group-hover:text-purple-300 truncate font-sans">
                      {sample.titleEnglish}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate font-urdu">
                      {sample.titleUrdu}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Dropzone & Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-950/40 hover:bg-slate-900/50 cursor-pointer transition-all min-h-[160px]"
              >
                <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-semibold text-slate-200 block">
                    اپنی تصویر اپلوڈ کریں (Click to Upload Photo)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    JPG, PNG, WEBP — تاریخی تصاویر، برج خلیفہ، جبل علی یا مسدر سٹی
                  </span>
                </div>
              </div>

              {/* Custom prompt override */}
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="اضافی ہدایات یا مخصوص سوال (e.g. Focus on B-roll lighting and emotional narration)..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-400"
              />

              <button
                onClick={handleAnalyze}
                disabled={isLoading || !selectedImageBase64}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>تصویر کا تجزیہ کریں (Analyze with Gemini 4 Argon)</span>
              </button>
            </div>

            {/* Selected Image Preview */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5 text-purple-400" />
                <span>تصویر کا پیش نظارہ (Preview):</span>
              </span>
              <div className="w-full h-48 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden p-2">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center text-slate-600 text-xs">
                    کوئی تصویر منتخب نہیں ہوئی
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Analysis Result */}
          {analysisResult && (
            <div className="flex flex-col gap-3 bg-slate-950/90 border border-purple-500/30 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Gemini 4 Argon Documentary Visual & Script Report</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 bg-slate-900 rounded border border-slate-700"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'کاپی ہوگیا!' : 'کاپی'}</span>
                  </button>
                  {onAppendNarrationToScript && (
                    <button
                      onClick={() => onAppendNarrationToScript(analysisResult)}
                      className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30"
                    >
                      <Plus className="w-3 h-3" />
                      <span>اسکرپٹ میں شامل کریں</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed font-sans max-h-80 overflow-y-auto">
                {analysisResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
