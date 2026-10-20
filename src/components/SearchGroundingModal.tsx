import React, { useState } from 'react';
import {
  X,
  Search,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Copy,
  Plus,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { GroundedResult } from '../types/documentary.ts';

interface SearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppendFactToScene?: (factText: string) => void;
}

const PRESET_QUERIES = [
  'What is the current non-oil GDP share and foreign trade volume of UAE in 2025/2026?',
  'What are the latest milestones of the "We The UAE 2031" economic vision?',
  'What are the latest UAE investments in Artificial Intelligence, semiconductors, and MGX?',
  'How many containers does Jebel Ali Port process annually and what are DP World’s latest expansions?',
  'What are the latest passenger traffic statistics for Dubai International Airport (DXB)?',
];

export const SearchGroundingModal: React.FC<SearchGroundingModalProps> = ({
  isOpen,
  onClose,
  onAppendFactToScene,
}) => {
  const [query, setQuery] = useState(PRESET_QUERIES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [groundedData, setGroundedData] = useState<GroundedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          promptContext:
            'Focus on verified facts, exact numbers, and recent economic milestones for the UAE documentary "From Desert to Silicon: The UAE Economic Miracle". Provide response in Urdu and English summary.',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to search grounded data');
      }

      setGroundedData({
        query: q,
        result: data.result,
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      setError(err.message || 'Error executing Google Search Grounding');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (groundedData) {
      navigator.clipboard.writeText(groundedData.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Google Search Grounding (Gemini 3.8 Flash)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Live Web Search
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                ڈاکومنٹری کے معاشی اور تاریخی حقائق کی لائیو تصدیق و تازہ ترین اعداد و شمار
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
          {/* Query input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search UAE economic statistics, AI initiatives, or history..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-cyan-400 font-sans"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !query.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>تلاش کریں</span>
            </button>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>فوری تجاویز (Click to Search Live Facts):</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(preset);
                    handleSearch(preset);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs text-left transition-colors hover:border-cyan-500/40"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Results Area */}
          {groundedData && (
            <div className="flex flex-col gap-3 bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Google Search Grounded Result</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 bg-slate-900 rounded border border-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'کاپی ہوگیا!' : 'کاپی'}</span>
                  </button>
                  {onAppendFactToScene && (
                    <button
                      onClick={() => onAppendFactToScene(groundedData.result)}
                      className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>اسکرپٹ میں شامل کریں</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Text content */}
              <div className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed font-sans max-h-72 overflow-y-auto">
                {groundedData.result}
              </div>

              {/* Grounding Web Sources */}
              {groundedData.sources.length > 0 && (
                <div className="mt-2 pt-3 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    تصدیق شدہ ویب ذرائع (Grounded Sources):
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {groundedData.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-xs text-cyan-400 hover:text-cyan-300 bg-slate-900/90 hover:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
                      >
                        <span className="truncate pr-2 font-medium">
                          {src.title || src.uri}
                        </span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
