import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limit for base64 image and audio uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI client with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Helper to concatenate multiple RIFF WAV buffers into a single valid WAV buffer
 */
function concatenateWavBuffers(wavBuffers: Buffer[]): Buffer {
  if (wavBuffers.length === 0) return Buffer.alloc(0);
  if (wavBuffers.length === 1) return wavBuffers[0];

  const audioPayloads: Buffer[] = [];
  let totalDataLength = 0;

  for (const buf of wavBuffers) {
    if (buf.length > 44) {
      // Find "data" chunk header in case there are extra chunks
      let dataOffset = 36;
      const dataStr = buf.toString('ascii', 36, 40);
      if (dataStr !== 'data') {
        const found = buf.indexOf('data');
        if (found !== -1 && found + 8 <= buf.length) {
          dataOffset = found;
        }
      }
      const pcm = buf.subarray(dataOffset + 8);
      audioPayloads.push(pcm);
      totalDataLength += pcm.length;
    }
  }

  // Clone header from first buffer
  const firstBuf = wavBuffers[0];
  const header = Buffer.from(firstBuf.subarray(0, 44));

  // Write RIFF overall chunk size: totalDataLength + 36
  header.writeUInt32LE(totalDataLength + 36, 4);
  // Write "data" chunk size at byte 40
  header.writeUInt32LE(totalDataLength, 40);

  return Buffer.concat([header, ...audioPayloads]);
}

/**
 * 1. Convert Text to Speech using gemini-3.8-flash-tts
 * Feature: Voice over for script narration with custom voice styling & download option
 */
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const {
      text,
      voice = 'Puck',
      style = 'Urdu cinematic documentary narrator, authoritative, inspiring, solemn and grand tone with natural pacing',
      speakerName = 'Narrator',
    } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for TTS' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the server environment.',
      });
      return;
    }

    // Call gemini-3.8-flash-tts
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: {
                speaker: speakerName,
                style: style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Supported prebuilt voices: Puck, Charon, Kore, Fenrir, Zephyr
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(502).json({
        error: 'No audio returned from Gemini Flash TTS.',
      });
      return;
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      voice,
    });
  } catch (error: any) {
    console.error('Error generating speech:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate voiceover with gemini-3.8-flash-tts',
    });
  }
});

/**
 * Stitch multiple scene audio buffers into one master documentary soundtrack
 */
app.post('/api/tts/stitch', async (req: Request, res: Response) => {
  try {
    const { audioList } = req.body; // array of base64 WAV strings
    if (!Array.isArray(audioList) || audioList.length === 0) {
      res.status(400).json({ error: 'audioList array is required' });
      return;
    }

    const buffers = audioList.map((b64: string) => Buffer.from(b64, 'base64'));
    const stitched = concatenateWavBuffers(buffers);

    res.json({
      audioBase64: stitched.toString('base64'),
      mimeType: 'audio/wav',
      sizeBytes: stitched.length,
    });
  } catch (error: any) {
    console.error('Error stitching audio:', error);
    res.status(500).json({ error: 'Failed to stitch documentary audio' });
  }
});

/**
 * 2. Search Grounding using gemini-3.8-flash (with googleSearch tool)
 * Feature: Look up latest UAE economic data, We The UAE 2031 metrics, AI initiatives, etc.
 */
app.post('/api/search-grounding', async (req: Request, res: Response) => {
  try {
    const { query, promptContext } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required for search grounding' });
      return;
    }

    const systemPrompt = `You are an expert economic research analyst and documentary writer specializing in the United Arab Emirates (UAE, Dubai, Abu Dhabi).
Provide accurate, grounded, and up-to-date information with exact figures, dates, and milestone names.
Respond in both Urdu and English so it can be directly integrated into the documentary script.`;

    const contents = promptContext
      ? `${promptContext}\n\nSearch Question: ${query}`
      : query;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((chunk: any) => chunk?.web)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
      }));

    res.json({
      result: text,
      sources: webSources,
    });
  } catch (error: any) {
    console.error('Error with search grounding:', error);
    res.status(500).json({
      error: error?.message || 'Failed to search grounded data',
    });
  }
});

/**
 * 3. Analyze Images using gemini-4-argon
 * Feature: Upload documentary archival or modern photos and analyze them for video editing, B-roll cues & Urdu narration
 */
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userPrompt } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'imageBase64 is required' });
      return;
    }

    const defaultPrompt = `You are a master cinematic documentary director and historical analyst for the documentary: "سوچیں، 70 سال پہلے یہاں کچھ بھی نہیں تھا: صحرا سے سلیکون تک کا سفر" (The UAE Economic Miracle).
Analyze this uploaded photograph in detail:
1. Historical / Contemporary Context: What does this image show? (e.g. Trucial states, pearling boats, early oil rigs in Bab/Umm Shaif, Sheikh Zayed, construction of Jebel Ali Port, Burj Al Arab, Burj Khalifa, Palm Jumeirah, Dubai metro, Masdar City, autonomous transport, or AI data centers).
2. Documentary Visual / B-Roll Recommendation: Camera movement (pan, tilt, slow zoom-in), archival treatment (sepia, grainy film vs 4K HDR), sound design (desert wind, ocean waves, drill sounds, city ambient hum).
3. Suggested Urdu Narration Script Line (ایک پر اثر اردو جملہ): Provide 2 to 3 poetic and impactful documentary narration sentences in fluent Urdu (Nastaliq style) that perfectly match the narration in our script.
4. English Translation and narration notes.

Structure your answer clearly with headers and bullet points.`;

    const promptText = userPrompt ? `${defaultPrompt}\n\nUser specific question: ${userPrompt}` : defaultPrompt;

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: { parts: [imagePart, textPart] },
    });

    res.json({
      analysis: response.text || '',
    });
  } catch (error: any) {
    console.error('Error analyzing image with gemini-4-argon:', error);
    res.status(500).json({
      error: error?.message || 'Failed to analyze image with gemini-4-argon',
    });
  }
});

// Start Express server and connect Vite in development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UAE Documentary Studio running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
