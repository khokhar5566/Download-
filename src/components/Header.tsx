import React from 'react';
import {
  Sparkles,
  Search,
  Camera,
  Tv,
  Download,
  Mic,
  Volume2,
  Clock,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { VoiceOption } from '../types/documentary.ts';

interface HeaderProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  voiceList: VoiceOption[];
  voiceStyle: string;
  onChangeVoiceStyle: (style: string) => void;
  onOpenSearch: () => void;
  onOpenImageAnalyzer: () => void;
  onOpenTeleprompter: () => void;
  onOpenExport: () => void;
  onGenerateAll: () => void;
  isGeneratingAll: boolean;
  totalWords: number;
  totalEstimatedTimeSec: number;
  completedAudioCount: number;
  totalScenesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedVoice,
  onSelectVoice,
  voiceList,
  voiceStyle,
  onChangeVoiceStyle,
  onOpenSearch,
  onOpenImageAnalyzer,
  onOpenTeleprompter,
  onOpenExport,
  onGenerateAll,
  isGeneratingAll,
  totalWords,
  totalEstimatedTimeSec,
  completedAudioCount,
  totalScenesCount,
}) => {
  const [showVoiceStyleModal, setShowVoiceStyleModal] = React.useState(false);

  const formatMinutes = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}m ${remaining}s`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-amber-900/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top Branding Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
                <Mic className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-urdu text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                  صحرا سے سلیکون تک
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  UAE Documentary Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans tracking-wide">
                Gemini 3.8 Flash TTS Voiceover • Google Search Grounding • Gemini 4 Argon Photo Analysis
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalWords} الفاظ (Words)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>~{formatMinutes(totalEstimatedTimeSec)} تخمینی وقت</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {completedAudioCount}/{totalScenesCount} ریکارڈنگز تیار
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Voice Selector & Persona Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 rounded-lg px-2.5 py-1">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-400 font-medium">Gemini TTS Voice:</span>
              <select
                value={selectedVoice}
                onChange={(e) => onSelectVoice(e.target.value)}
                className="bg-transparent text-xs font-semibold text-amber-200 outline-none cursor-pointer pr-2"
              >
                {voiceList.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-slate-100">
                    {v.name} ({v.gender} - {v.recommendedFor.slice(0, 24)}...)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowVoiceStyleModal(!showVoiceStyleModal)}
              title="Voice Style & Persona Tone"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors"
            >
              <SlidersHorizontal className="w-3 h-3 text-amber-400" />
              <span>لہجہ و انداز (Tone)</span>
            </button>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Generate All Audio */}
            <button
              onClick={onGenerateAll}
              disabled={isGeneratingAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{isGeneratingAll ? 'آڈیو تیار ہو رہی ہے...' : 'مکمل وائس اوور بنائیں'}</span>
            </button>

            {/* Google Search Grounding Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-cyan-300 font-medium transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>حقائق کی تصدیق (Google Search)</span>
            </button>

            {/* Photo Analyzer (Gemini 4 Argon) */}
            <button
              onClick={onOpenImageAnalyzer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-purple-300 font-medium transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              <span>تصویر کا تجزیہ (Gemini 4)</span>
            </button>

            {/* Teleprompter */}
            <button
              onClick={onOpenTeleprompter}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-emerald-300 font-medium transition-colors cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5 text-emerald-400" />
              <span>ٹیلی پرامپٹر (Teleprompter)</span>
            </button>

            {/* Download & Export */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer border border-amber-300"
            >
              <Download className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span>ڈاؤن لوڈ سینٹر (Download)</span>
            </button>
          </div>
        </div>

        {/* Expandable Voice Style Drawer */}
        {showVoiceStyleModal && (
          <div className="mt-3 p-3 bg-slate-900/95 border border-amber-500/30 rounded-xl shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
            <div className="flex-1 w-full">
              <label className="block text-slate-300 font-semibold mb-1">
                Gemini Flash TTS Voice Style & Delivery Prompt (لہجہ اور صوتی انداز):
              </label>
              <input
                type="text"
                value={voiceStyle}
                onChange={(e) => onChangeVoiceStyle(e.target.value)}
                placeholder="e.g. Urdu cinematic documentary narrator, authoritative, inspiring, solemn and grand tone"
                className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() =>
                  onChangeVoiceStyle(
                    'Urdu cinematic documentary narrator, authoritative, inspiring, solemn and grand tone with natural pacing'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-300 text-[11px]"
              >
                کلاسیکی ڈاکومنٹری
              </button>
              <button
                onClick={() =>
                  onChangeVoiceStyle(
                    'Energetic, dramatic, suspenseful pacing, deep historical awe and crescendo'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-300 text-[11px]"
              >
                سسپنس و ڈرامائی
              </button>
              <button
                onClick={() => setShowVoiceStyleModal(false)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-[11px]"
              >
                محفوظ کریں
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
