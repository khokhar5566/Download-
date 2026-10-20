import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  Music,
  FileCode,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Share2,
} from 'lucide-react';
import { Scene } from '../types/documentary.ts';
import {
  downloadBase64Wav,
  downloadTextFile,
  generateSrtContent,
  generateFullProductionScript,
} from '../utils/audioExport.ts';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: Scene[];
  onGenerateAllMissing: () => Promise<void>;
  isGeneratingAll: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  scenes,
  onGenerateAllMissing,
  isGeneratingAll,
}) => {
  const [isStitching, setIsStitching] = useState(false);
  const [stitchError, setStitchError] = useState<string | null>(null);

  if (!isOpen) return null;

  const scenesWithAudio = scenes.filter((s) => Boolean(s.audioBase64));
  const hasAllAudio = scenesWithAudio.length === scenes.length;

  // Download Stitched Full Master Audio
  const handleDownloadMasterAudio = async () => {
    if (scenesWithAudio.length === 0) {
      setStitchError('کسی بھی منظر کی آڈیو موجود نہیں ہے۔ پہلے آڈیو جنریٹ کریں۔');
      return;
    }

    setIsStitching(true);
    setStitchError(null);

    try {
      const audioList = scenesWithAudio.map((s) => s.audioBase64 as string);

      const res = await fetch('/api/tts/stitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioList }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to stitch master audio');
      }

      downloadBase64Wav(data.audioBase64, 'UAE_Documentary_Master_Soundtrack_24kHz');
    } catch (err: any) {
      setStitchError(err.message || 'Failed to stitch full documentary audio');
    } finally {
      setIsStitching(false);
    }
  };

  // Download Plain Text Script & Production Guide
  const handleDownloadScript = () => {
    const content = generateFullProductionScript(scenes);
    downloadTextFile(
      content,
      'UAE_Documentary_Desert_to_Silicon_Full_Script.txt'
    );
  };

  // Download Subtitles (.srt)
  const handleDownloadSrt = () => {
    const srt = generateSrtContent(scenes);
    downloadTextFile(
      srt,
      'UAE_Documentary_Urdu_Subtitles.srt',
      'text/plain;charset=utf-8'
    );
  };

  // Download JSON
  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(scenes, null, 2);
    downloadTextFile(
      jsonStr,
      'UAE_Documentary_Project_Data.json',
      'application/json;charset=utf-8'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0b0f19] border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-amber-950/50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>ڈاؤن لوڈ و برآمد مرکز (Export & Download Studio)</span>
              </h2>
              <p className="text-xs text-slate-400">
                مکمل ویڈیو وائس اوور آڈیو، اردو اسکرپٹ، اور سب ٹائٹل فائلز ڈاؤن لوڈ کریں
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
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Status summary banner */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  hasAllAudio
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {hasAllAudio ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  آڈیو کی دستیابی: {scenesWithAudio.length} از {scenes.length} مناظر تیار
                </div>
                <div className="text-[11px] text-slate-400">
                  {hasAllAudio
                    ? 'تمام مناظر کی آڈیو مکمل ہے اور ڈاؤن لوڈ کے لیے تیار ہے'
                    : 'کچھ مناظر کی آڈیو ابھی جنریٹ نہیں ہوئی، آپ تمام آڈیو ایک کلک میں تیار کر سکتے ہیں'}
                </div>
              </div>
            </div>

            {!hasAllAudio && (
              <button
                onClick={onGenerateAllMissing}
                disabled={isGeneratingAll}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>تمام بنائیں</span>
              </button>
            )}
          </div>

          {stitchError && (
            <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300">
              {stitchError}
            </div>
          )}

          {/* Download Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Master Audio WAV */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-200">
                    مکمل وائس اوور آڈیو (.WAV)
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-0.5">
                    تمام 10 مناظر کو جوڑ کر ایک سنگل ماسٹر آڈیو ٹریک (24kHz Studio Quality)
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadMasterAudio}
                disabled={isStitching || scenesWithAudio.length === 0}
                className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isStitching ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>ماسٹر آڈیو ڈاؤن لوڈ کریں ({scenesWithAudio.length} مناظر)</span>
              </button>
            </div>

            {/* 2. Full Narration Script (.txt) */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    مکمل اسکرپٹ گائیڈ (.TXT)
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-0.5">
                    اردو متن، انگریزی ترجمہ، بصری B-Roll کیمرہ ہدایات اور صوتی اثرات
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadScript}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>اسکرپٹ فائل ڈاؤن لوڈ کریں</span>
              </button>
            </div>

            {/* 3. Video Subtitles (.srt) */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    ویڈیو سب ٹائٹلز (.SRT)
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-0.5">
                    ٹائم اسٹیمپ کے ساتھ SubRip فارمیٹ — پریمیئر، فائنل کٹ، کیپ کٹ کے لیے موزوں
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadSrt}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>سب ٹائٹل (.SRT) ڈاؤن لوڈ کریں</span>
              </button>
            </div>

            {/* 4. Complete Project Data (.json) */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    پروجیکٹ ڈیٹا (.JSON)
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-0.5">
                    تمام مناظر اور بصری نوٹس کا اسٹرکچرڈ ڈیٹا بیک اپ
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadJson}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>JSON ڈیٹا ڈاؤن لوڈ کریں</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
