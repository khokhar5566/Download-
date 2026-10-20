import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Download,
  Search,
  Camera,
  Tv,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { SceneCard } from './components/SceneCard.tsx';
import { AudioPlayerBar } from './components/AudioPlayerBar.tsx';
import { SearchGroundingModal } from './components/SearchGroundingModal.tsx';
import { ImageAnalyzerModal } from './components/ImageAnalyzerModal.tsx';
import { TeleprompterModal } from './components/TeleprompterModal.tsx';
import { ExportModal } from './components/ExportModal.tsx';
import { INITIAL_SCENES, AVAILABLE_VOICES } from './data/defaultScript.ts';
import { Scene } from './types/documentary.ts';
import {
  downloadBase64Wav,
  downloadTextFile,
  generateFullProductionScript,
  generateSrtContent,
} from './utils/audioExport.ts';

export default function App() {
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [selectedVoice, setSelectedVoice] = useState<string>('Puck');
  const [voiceStyle, setVoiceStyle] = useState<string>(
    'Urdu cinematic documentary narrator, authoritative, inspiring, solemn and grand tone with natural pacing'
  );

  // Active audio player state
  const [activeTrack, setActiveTrack] = useState<{
    audioBase64: string | null;
    title: string;
    sceneId?: number;
  }>({
    audioBase64: null,
    title: '',
  });

  // Modal visibility states
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Batch generation state
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(
    null
  );

  // Filter or search scenes
  const [searchFilter, setSearchFilter] = useState('');

  // Computed metrics
  const totalWords = useMemo(() => {
    return scenes.reduce((acc, s) => {
      const words = s.urduScript.trim().split(/\s+/).filter(Boolean).length;
      return acc + words;
    }, 0);
  }, [scenes]);

  const totalEstimatedTimeSec = useMemo(() => {
    return scenes.reduce((acc, s) => acc + (s.estimatedDurationSec || 20), 0);
  }, [scenes]);

  const completedAudioCount = useMemo(() => {
    return scenes.filter((s) => Boolean(s.audioBase64)).length;
  }, [scenes]);

  // Handle single scene TTS generation using gemini-3.8-flash-tts
  const handleGenerateSceneAudio = async (scene: Scene) => {
    setScenes((prev) =>
      prev.map((s) =>
        s.id === scene.id ? { ...s, isGeneratingAudio: true, audioError: undefined } : s
      )
    );

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scene.urduScript,
          voice: selectedVoice,
          style: voiceStyle,
          speakerName: 'Narrator',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate voiceover audio');
      }

      setScenes((prev) =>
        prev.map((s) =>
          s.id === scene.id
            ? { ...s, audioBase64: data.audioBase64, isGeneratingAudio: false }
            : s
        )
      );

      // Automatically set as active track and play
      setActiveTrack({
        audioBase64: data.audioBase64,
        title: scene.titleUrdu,
        sceneId: scene.id,
      });
    } catch (err: any) {
      setScenes((prev) =>
        prev.map((s) =>
          s.id === scene.id
            ? {
                ...s,
                isGeneratingAudio: false,
                audioError: err.message || 'TTS generation failed',
              }
            : s
        )
      );
    }
  };

  // Batch generate all missing audio
  const handleGenerateAll = async () => {
    setIsGeneratingAll(true);
    setBatchProgress({ current: 0, total: scenes.length });

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      setBatchProgress({ current: i + 1, total: scenes.length });

      // Generate if missing or refresh
      try {
        setScenes((prev) =>
          prev.map((s) =>
            s.id === scene.id ? { ...s, isGeneratingAudio: true, audioError: undefined } : s
          )
        );

        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: scene.urduScript,
            voice: selectedVoice,
            style: voiceStyle,
            speakerName: 'Narrator',
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate audio');
        }

        setScenes((prev) =>
          prev.map((s) =>
            s.id === scene.id
              ? { ...s, audioBase64: data.audioBase64, isGeneratingAudio: false }
              : s
          )
        );
      } catch (err: any) {
        setScenes((prev) =>
          prev.map((s) =>
            s.id === scene.id
              ? {
                  ...s,
                  isGeneratingAudio: false,
                  audioError: err.message || 'Generation failed',
                }
              : s
          )
        );
      }
    }

    setIsGeneratingAll(false);
    setBatchProgress(null);
  };

  // Play a specific scene
  const handlePlayScene = (scene: Scene) => {
    if (scene.audioBase64) {
      setActiveTrack({
        audioBase64: scene.audioBase64,
        title: scene.titleUrdu,
        sceneId: scene.id,
      });
    }
  };

  // Advance to next scene automatically when track finishes
  const handleTrackEnded = () => {
    if (activeTrack.sceneId) {
      const nextScene = scenes.find((s) => s.id === (activeTrack.sceneId as number) + 1);
      if (nextScene && nextScene.audioBase64) {
        setActiveTrack({
          audioBase64: nextScene.audioBase64,
          title: nextScene.titleUrdu,
          sceneId: nextScene.id,
        });
      }
    }
  };

  // Update text of a scene
  const handleUpdateScript = (sceneId: number, newUrduScript: string) => {
    setScenes((prev) =>
      prev.map((s) => {
        if (s.id === sceneId) {
          const words = newUrduScript.trim().split(/\s+/).filter(Boolean).length;
          // Approximate 2.5 words per second for documentary narration
          const estimatedSec = Math.max(10, Math.round(words / 2.5));
          return {
            ...s,
            urduScript: newUrduScript,
            estimatedDurationSec: estimatedSec,
          };
        }
        return s;
      })
    );
  };

  // Append fact or narration from search/image modals to the first or active scene
  const handleAppendFactToActiveScene = (factText: string) => {
    const targetSceneId = activeTrack.sceneId || scenes[scenes.length - 1].id;
    setScenes((prev) =>
      prev.map((s) => {
        if (s.id === targetSceneId) {
          return {
            ...s,
            urduScript: `${s.urduScript}\n\n[اضافی تصدیق شدہ معلومات: ${factText.slice(0, 150)}...]`,
          };
        }
        return s;
      })
    );
    alert('حقائق کامیابی سے اسکرپٹ میں شامل کر دیے گئے ہیں!');
  };

  const filteredScenes = useMemo(() => {
    if (!searchFilter.trim()) return scenes;
    const q = searchFilter.toLowerCase();
    return scenes.filter(
      (s) =>
        s.urduScript.toLowerCase().includes(q) ||
        s.titleUrdu.toLowerCase().includes(q) ||
        s.titleEnglish.toLowerCase().includes(q) ||
        s.visualCue.toLowerCase().includes(q)
    );
  }, [scenes, searchFilter]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col pb-28">
      {/* Top Navigation & Controls */}
      <Header
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoice}
        voiceList={AVAILABLE_VOICES}
        voiceStyle={voiceStyle}
        onChangeVoiceStyle={setVoiceStyle}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenImageAnalyzer={() => setIsImageModalOpen(true)}
        onOpenTeleprompter={() => setIsTeleprompterOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onGenerateAll={handleGenerateAll}
        isGeneratingAll={isGeneratingAll}
        totalWords={totalWords}
        totalEstimatedTimeSec={totalEstimatedTimeSec}
        completedAudioCount={completedAudioCount}
        totalScenesCount={scenes.length}
      />

      {/* Hero Documentary Showcase Banner */}
      <div className="relative overflow-hidden border-b border-amber-950/40 bg-gradient-to-b from-[#0e1424] via-[#090d17] to-[#07090e] py-10 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(217,119,6,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-3xl flex flex-col gap-3 text-center md:text-right">
            <div className="inline-flex items-center gap-2 self-center md:self-end px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>یو اے ای اقتصادی معجزہ: مکمل ڈاکومنٹری اسٹوڈیو</span>
            </div>

            <h2 className="font-urdu text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 leading-[1.8] sm:leading-[1.9]">
              سوچیں، 70 سال پہلے یہاں کچھ بھی نہیں تھا۔
            </h2>

            <p className="font-urdu text-lg sm:text-xl text-slate-300 leading-relaxed" dir="rtl">
              صرف ریت، سمندر اور موتیوں کی تلاش... سے دنیا کی جدید ترین معیشت، ہوابازی، مسدر سٹی اور مصنوعی ذہانت کے مرکز بننے تک کی سحر انگیز داستان۔
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 pt-2">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>مکمل وائس اوور اور اسکرپٹ ڈاؤن لوڈ کریں</span>
              </button>

              <button
                onClick={() => setIsTeleprompterOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Tv className="w-4 h-4 text-emerald-400" />
                <span>لائیو ریکارڈنگ موڈ (Teleprompter)</span>
              </button>
            </div>
          </div>

          {/* Quick Voiceover Spec Card */}
          <div className="w-full md:w-80 p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                آواز کا انتخاب (Voice Specs)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                gemini-3.8-flash-tts
              </span>
            </div>

            <div className="text-xs text-slate-300 flex flex-col gap-2 font-sans">
              <div className="flex justify-between">
                <span className="text-slate-400">منتخب راوی (Voice):</span>
                <span className="font-semibold text-amber-200">{selectedVoice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">آڈیو فارمیٹ (Output):</span>
                <span className="font-mono text-emerald-300">WAV (24kHz Mono)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">کل مناظر (Scenes):</span>
                <span className="font-semibold text-slate-100">{scenes.length} ابواب</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">تیار شدہ وائس اوور:</span>
                <span className="font-semibold text-cyan-300">
                  {completedAudioCount} / {scenes.length}
                </span>
              </div>
            </div>

            {/* Batch Progress Bar */}
            {isGeneratingAll && batchProgress && (
              <div className="mt-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[11px] text-amber-300 mb-1">
                  <span>آڈیو پروڈکشن جاری ہے...</span>
                  <span>
                    {batchProgress.current} / {batchProgress.total}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300"
                    style={{
                      width: `${(batchProgress.current / batchProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PROMINENT INSTANT DOWNLOAD BAR (1-CLICK DOWNLOADS) */}
        <div className="max-w-7xl mx-auto mt-6 pt-5 border-t border-amber-500/20">
          <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                <Download className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-200 flex items-center gap-2">
                  <span>ڈاؤن لوڈ سینٹر (One-Click Download Center)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
                    READY
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-sans">
                  ڈاکومنٹری کی اردو تحریر، سب ٹائٹلز، یا مکمل وائس اوور آڈیو فوری طور پر ڈاؤن لوڈ کریں:
                </p>
              </div>
            </div>

            {/* Quick Download Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
              {/* 1. Download Script .TXT */}
              <button
                onClick={() => {
                  const content = generateFullProductionScript(scenes);
                  downloadTextFile(content, 'UAE_Documentary_Desert_to_Silicon_Full_Script.txt');
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-cyan-500/10"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>ڈاؤن لوڈ اسکرپٹ (.TXT)</span>
              </button>

              {/* 2. Download Subtitles .SRT */}
              <button
                onClick={() => {
                  const srt = generateSrtContent(scenes);
                  downloadTextFile(srt, 'UAE_Documentary_Urdu_Subtitles.srt', 'text/plain;charset=utf-8');
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/10"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>سب ٹائٹلز (.SRT)</span>
              </button>

              {/* 3. Download Master Voiceover Audio .WAV */}
              <button
                onClick={async () => {
                  const withAudio = scenes.filter((s) => Boolean(s.audioBase64));
                  if (withAudio.length === 0) {
                    // Trigger batch generation first, then download
                    await handleGenerateAll();
                  } else {
                    try {
                      const audioList = withAudio.map((s) => s.audioBase64 as string);
                      const res = await fetch('/api/tts/stitch', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ audioList }),
                      });
                      const data = await res.json();
                      if (data.audioBase64) {
                        downloadBase64Wav(data.audioBase64, 'UAE_Full_Documentary_Voiceover_24kHz');
                      }
                    } catch (err) {
                      console.error('Download error:', err);
                      setIsExportModalOpen(true);
                    }
                  }
                }}
                disabled={isGeneratingAll}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>
                  {isGeneratingAll
                    ? 'وائس اوور بن رہا ہے...'
                    : completedAudioCount > 0
                    ? `وائس اوور آڈیو ڈاؤن لوڈ (.WAV) [${completedAudioCount} مناظر]`
                    : 'مکمل وائس اوور بنائیں اور ڈاؤن لوڈ کریں'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Body: Scene Cards List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full flex flex-col gap-6">
        {/* Search & Scene Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>ڈاکومنٹری کے مناظر اور آواز کی تیاری (Scenes & Narration)</span>
              <span className="text-xs font-normal text-slate-400">
                ({filteredScenes.length} مناظر)
              </span>
            </h3>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="منظر یا لفظ تلاش کریں (Filter scenes)..."
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Scene Cards Grid */}
        <div className="flex flex-col gap-5">
          {filteredScenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              isActive={activeTrack.sceneId === scene.id}
              onPlayScene={handlePlayScene}
              onGenerateAudio={handleGenerateSceneAudio}
              onUpdateScript={handleUpdateScript}
            />
          ))}
        </div>
      </main>

      {/* Floating Quick Download Hub Button */}
      <div className="fixed bottom-20 right-5 z-40">
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-2xl shadow-amber-500/50 hover:scale-105 transition-all cursor-pointer border-2 border-amber-300/80"
          title="ڈاؤن لوڈ وائس اوور اور اسکرپٹ (Download Voiceover & Script)"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>ڈاؤن لوڈ سینٹر (Download)</span>
        </button>
      </div>

      {/* Sticky Bottom Audio Player Bar */}
      <AudioPlayerBar
        audioBase64={activeTrack.audioBase64}
        trackTitle={activeTrack.title}
        sceneId={activeTrack.sceneId}
        onTrackEnded={handleTrackEnded}
        onClose={() => setActiveTrack({ audioBase64: null, title: '' })}
      />

      {/* Feature Modals */}
      <SearchGroundingModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onAppendFactToScene={handleAppendFactToActiveScene}
      />

      <ImageAnalyzerModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onAppendNarrationToScript={handleAppendFactToActiveScene}
      />

      <TeleprompterModal
        isOpen={isTeleprompterOpen}
        onClose={() => setIsTeleprompterOpen(false)}
        scenes={scenes}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        scenes={scenes}
        onGenerateAllMissing={handleGenerateAll}
        isGeneratingAll={isGeneratingAll}
      />
    </div>
  );
}
