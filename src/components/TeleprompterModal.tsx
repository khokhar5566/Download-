import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Type,
  FlipHorizontal,
  Clock,
} from 'lucide-react';
import { Scene } from '../types/documentary.ts';

interface TeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: Scene[];
}

export const TeleprompterModal: React.FC<TeleprompterModalProps> = ({
  isOpen,
  onClose,
  scenes,
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 - 10
  const [fontSize, setFontSize] = useState(32); // px
  const [isMirrored, setIsMirrored] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll animation loop
  useEffect(() => {
    if (!isOpen || !isScrolling) return;

    const interval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop += scrollSpeed * 0.7;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isOpen, isScrolling, scrollSpeed]);

  // Elapsed timer
  useEffect(() => {
    if (!isOpen || !isScrolling) return;

    const timer = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isScrolling]);

  const handleRestart = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    setIsScrolling(false);
    setElapsedSec(0);
  };

  const toggleFullscreen = () => {
    if (!modalRef.current) return;
    if (!document.fullscreenElement) {
      modalRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex flex-col bg-[#050608] text-slate-100 select-none"
    >
      {/* Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-[#0d1017] border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-sm text-amber-300 font-urdu">
              اسٹوڈیو ٹیلی پرامپٹر (Live Teleprompter)
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(elapsedSec)}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Scroll Toggle */}
          <button
            onClick={() => setIsScrolling(!isScrolling)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold transition-all ${
              isScrolling
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isScrolling ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>روکیں (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>شروع کریں (Scroll)</span>
              </>
            )}
          </button>

          <button
            onClick={handleRestart}
            title="Reset to Top"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed slider */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-medium">رفتار (Speed):</span>
            <input
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
              className="w-20 h-1 accent-amber-500 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="font-mono text-amber-300">{scrollSpeed}x</span>
          </div>

          {/* Font size */}
          <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <Type className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setFontSize((f) => Math.max(22, f - 4))}
              className="px-1.5 text-slate-300 hover:text-white font-bold"
            >
              -
            </button>
            <span className="font-mono text-slate-300">{fontSize}px</span>
            <button
              onClick={() => setFontSize((f) => Math.min(56, f + 4))}
              className="px-1.5 text-slate-300 hover:text-white font-bold"
            >
              +
            </button>
          </div>

          {/* Mirror toggle for physical prompter glass */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isMirrored
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="آئینہ موڈ (Mirror Flip for Glass Prompters)"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-300 rounded-lg border border-red-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Prompter Guide Overlay Line */}
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 border-y-2 border-amber-500/20 bg-amber-500/5 z-20 flex items-center justify-between px-4">
        <span className="text-[10px] uppercase font-mono text-amber-400/60 tracking-widest">
          ▶ READ MARK
        </span>
        <span className="text-[10px] uppercase font-mono text-amber-400/60 tracking-widest font-urdu">
          پڑھنے کی لکیر ◀
        </span>
      </div>

      {/* Script Scrolling Content */}
      <div
        ref={containerRef}
        className={`flex-1 overflow-y-auto px-8 sm:px-20 md:px-32 py-40 ${
          isMirrored ? 'scale-x-[-1]' : ''
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-16 text-center">
          {scenes.map((scene) => (
            <div key={scene.id} className="flex flex-col gap-4 py-8 border-b border-slate-900">
              <span className="text-xs uppercase font-mono tracking-widest text-amber-500/70">
                [منظر {scene.id}: {scene.titleEnglish}]
              </span>

              <p
                style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
                className="font-urdu text-amber-100 font-semibold leading-relaxed tracking-normal"
                dir="rtl"
              >
                {scene.urduScript}
              </p>

              <p className="text-sm font-sans text-slate-500 italic max-w-2xl mx-auto">
                Cue: {scene.visualCue}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
