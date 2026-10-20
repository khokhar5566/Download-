import { Scene } from '../types/documentary.ts';

/**
 * Trigger download of base64 audio data as a WAV file
 */
export function downloadBase64Wav(base64Data: string, filename: string) {
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.wav') ? filename : `${filename}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download audio file:', err);
  }
}

/**
 * Trigger download of plain text (e.g. Script .txt, .json, or .srt)
 */
export function downloadTextFile(content: string, filename: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format seconds to SRT timestamp: HH:MM:SS,mmm
 */
function formatSrtTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
}

/**
 * Generate standard SubRip (.srt) subtitle file from documentary scenes
 */
export function generateSrtContent(scenes: Scene[]): string {
  let srt = '';
  let currentTime = 0;

  scenes.forEach((scene, index) => {
    const startTimeStr = formatSrtTime(currentTime);
    const endTime = currentTime + (scene.estimatedDurationSec || 15);
    const endTimeStr = formatSrtTime(endTime);

    srt += `${index + 1}\n`;
    srt += `${startTimeStr} --> ${endTimeStr}\n`;
    srt += `${scene.urduScript}\n\n`;

    currentTime = endTime + 1.0; // 1 second breath between scenes
  });

  return srt;
}

/**
 * Generate complete formatted script for video production team
 */
export function generateFullProductionScript(scenes: Scene[]): string {
  const header = `====================================================================
صحرا سے سلیکون تک: متحدہ عرب امارات کا معجزہ
FROM DESERT TO SILICON: THE UAE ECONOMIC MIRACLE
Comprehensive Documentary Narration Script & Video Production Guide
Generated via UAE Documentary Studio
====================================================================\n\n`;

  const body = scenes
    .map(
      (s) => `--------------------------------------------------------------------
[${s.titleEnglish}]
${s.titleUrdu}
تخمینی دورانیہ: ${s.estimatedDurationSec} سیکنڈز
--------------------------------------------------------------------
▶ اردوو وائس اوور (VOICE-OVER NARRATION):
${s.urduScript}

▶ ENGLISH TRANSLATION:
${s.englishTranslation}

▶ کیمرہ اور بصری ہدایات (CAMERA & B-ROLL DIRECTION):
${s.visualCue}

▶ صوتی اثرات (SOUND FX & AMBIENCE):
${s.soundEffect}
\n`
    )
    .join('\n');

  return header + body;
}
