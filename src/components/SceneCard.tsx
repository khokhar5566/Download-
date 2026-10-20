import React, { useState } from 'react';
import {
  Play,
  Download,
  Sparkles,
  Clapperboard,
  Music,
  Edit3,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  Languages,
} from 'lucide-react';
import { Scene } from '../types/documentary.ts';
import { downloadBase64Wav } from '../utils/audioExport.ts';

interface SceneCardProps {
  scene: Scene;
  isActive: boolean;
  onPlayScene: (scene: Scene) => void;
  onGenerateAudio: (scene: Scene) => void;
  onUpdateScript: (sceneId: number, newUrduScript: string) => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  isActive,
  onPlayScene,
  onGenerateAudio,
  onUpdateScript,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(scene.urduScript);
  const [showDetails, setShowDetails] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleSaveEdit = () => {
    onUpdateScript(scene.id, editedText);
    setIsEditing(false);
  };

  const handleDownloadSceneAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scene.audioBase64) {
      downloadBase64Wav(scene.audioBase64, `Scene_${scene.id}_Voiceover`);
    }
  };

  return (
    <div
      className={`relative rounded-2xl transition-all duration-300 border ${
        isActive
          ? 'bg-[#0f172a]/90 border-amber-500 shadow-xl shadow-amber-500/10'
          : 'bg-[#0b0f19]/70 hover:bg-[#0f1626] border-slate-800/80 hover:border-slate-700'
      } p-5 flex flex-col gap-4`}
    >
      {/* Top Header: Scene Title, Badge, and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
            {scene.id}
          </span>
          <div>
            <h3 className="font-urdu text-lg sm:text-xl font-bold text-amber-200">
              {scene.titleUrdu}
            </h3>
            <p className="text-xs text-slate-400 font-sans tracking-wide">
              {scene.titleEnglish}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{scene.estimatedDurationSec}s</span>
          </div>

          {/* Edit Script Toggle */}
          <button
            onClick={() => {
              if (isEditing) {
                handleSaveEdit();
              } else {
                setEditedText(scene.urduScript);
                setIsEditing(true);
              }
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors text-xs flex items-center gap-1"
            title="تحریر میں تبدیلی (Edit Script)"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">محفوظ کریں</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] hidden sm:inline">تبدیل کریں</span>
              </>
            )}
          </button>

          {/* Generate Voiceover Button */}
          <button
            onClick={() => onGenerateAudio(scene)}
            disabled={scene.isGeneratingAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
              scene.audioBase64
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold'
            } disabled:opacity-50`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${
                scene.isGeneratingAudio ? 'animate-spin' : ''
              }`}
            />
            <span>
              {scene.isGeneratingAudio
                ? 'تیار ہو رہا ہے...'
                : scene.audioBase64
                ? 'دوبارہ بنائیں (Regen)'
                : 'آڈیو بنائیں (Gemini TTS)'}
            </span>
          </button>

          {/* Play Generated Audio */}
          {scene.audioBase64 && (
            <button
              onClick={() => onPlayScene(scene)}
              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors cursor-pointer"
              title="آڈیو سنیں (Play Audio)"
            >
              <Play className="w-4 h-4 fill-emerald-300" />
            </button>
          )}

          {/* Always Available Download Scene Audio Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (scene.audioBase64) {
                downloadBase64Wav(scene.audioBase64, `UAE_Doc_Scene_${scene.id}_Voiceover`);
              } else {
                onGenerateAudio(scene);
              }
            }}
            disabled={scene.isGeneratingAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
              scene.audioBase64
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
            }`}
            title="یہ منظر ڈاؤن لوڈ کریں (Download Scene Audio .WAV)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {scene.isGeneratingAudio
                ? 'تیاری جاری ہے...'
                : scene.audioBase64
                ? 'ڈاؤن لوڈ آڈیو (.WAV)'
                : 'ڈاؤن لوڈ آڈیو'}
            </span>
          </button>
        </div>
      </div>

      {/* Script Display / Edit Area */}
      <div className="relative">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={4}
              className="w-full p-4 rounded-xl bg-slate-950 border border-amber-500/50 text-amber-100 font-urdu text-xl focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
              dir="rtl"
            />
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>مشورہ: وقفے کے لیے تین نقطے (...) یا &lt;breath&gt; استعمال کر سکتے ہیں۔</span>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded"
              >
                تبدیلی محفوظ کریں
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              if (scene.audioBase64) onPlayScene(scene);
            }}
            className={`p-4 rounded-xl ${
              scene.audioBase64
                ? 'cursor-pointer hover:bg-slate-900/90'
                : 'bg-slate-950/60'
            } border border-slate-800/80 transition-colors`}
          >
            <p className="font-urdu text-xl sm:text-2xl text-slate-100 font-medium leading-[2.4] select-text">
              {scene.urduScript}
            </p>
          </div>
        )}

        {scene.audioError && (
          <div className="mt-2 p-2 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{scene.audioError}</span>
          </div>
        )}
      </div>

      {/* Visual B-Roll Cue & Director's Sound Notes */}
      <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/60 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold"
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>ڈائریکٹر بصری اور صوتی نوٹس (Visual & Audio Direction)</span>
            {showDetails ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showTranslation ? 'انگریزی چھپائیں' : 'English Translation'}</span>
          </button>
        </div>

        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/60 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 shrink-0">
                <Clapperboard className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-semibold text-slate-200 block mb-0.5">
                  بصری اشارہ (Video B-Roll):
                </span>
                <p className="text-slate-400 leading-relaxed font-sans">{scene.visualCue}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-300">
              <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 shrink-0">
                <Music className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-semibold text-slate-200 block mb-0.5">
                  صوتی اثرات (Sound Design):
                </span>
                <p className="text-slate-400 leading-relaxed font-sans">{scene.soundEffect}</p>
              </div>
            </div>
          </div>
        )}

        {showTranslation && (
          <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg font-sans">
            <span className="font-semibold text-amber-300 block mb-1">
              English Subtitle / Translation:
            </span>
            <p className="italic leading-relaxed">{scene.englishTranslation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
