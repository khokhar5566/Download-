import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  FastForward,
  X,
  Sparkles,
} from 'lucide-react';
import { downloadBase64Wav } from '../utils/audioExport.ts';

interface AudioPlayerBarProps {
  audioBase64: string | null;
  trackTitle: string;
  sceneId?: number;
  onClose?: () => void;
  onTrackEnded?: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  audioBase64,
  trackTitle,
  sceneId,
  onClose,
  onTrackEnded,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // When audioBase64 changes, load new audio
  useEffect(() => {
    if (!audioBase64 || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = `data:audio/wav;base64,${audioBase64}`;
    audio.load();
    audio.playbackRate = playbackRate;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.log('Audio autoplay prevented:', err));
  }, [audioBase64]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const restart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDownload = () => {
    if (!audioBase64) return;
    const name = sceneId
      ? `UAE_Doc_Scene_${sceneId}_Voiceover`
      : 'UAE_Full_Documentary_Voiceover';
    downloadBase64Wav(audioBase64, name);
  };

  if (!audioBase64) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#07090e]/95 backdrop-blur-xl border-t border-amber-500/30 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          if (onTrackEnded) onTrackEnded();
        }}
      />
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-amber-200 truncate flex items-center gap-1.5">
              <span>{trackTitle}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                WAV • 24kHz
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans truncate">
              صوتی نشریات (Gemini 3.8 Flash TTS Engine)
            </div>
          </div>
        </div>

        {/* Controls & Progress Bar */}
        <div className="flex-1 max-w-2xl w-full flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-3">
            <button
              onClick={restart}
              title="شروع سے چلائیں (Restart)"
              className="p-1.5 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              )}
            </button>

            {/* Playback speed toggle */}
            <button
              onClick={() => {
                const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : playbackRate === 1.5 ? 0.75 : 1;
                setPlaybackRate(nextRate);
              }}
              title="رفتار تبدیل کریں (Speed)"
              className="px-2 py-0.5 text-xs font-mono font-semibold text-amber-300 bg-slate-900 rounded border border-slate-700 hover:border-amber-500 transition-colors"
            >
              {playbackRate}x
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="w-full flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Download Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 hover:text-slate-200 transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
            title="آڈیو ڈاؤن لوڈ کریں (WAV Format)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>آڈیو ڈاؤن لوڈ</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
