/**
 * Gemini 2.5 TTS — narration generator
 *
 * Reads scripts from narration-scripts.ts, calls Google's Gemini API
 * (gemini-2.5-pro-preview-tts), saves mp3 per scene under
 * /public/walkthrough/audio/<scriptId>.mp3
 *
 * Pre-flight (one time, ~2 minutes):
 *   1. Visit https://aistudio.google.com/apikey
 *      (sign in with any Google account — no Cloud project needed)
 *   2. Click "Create API key" → "Create API key in new project"
 *   3. Copy the key (starts with AIza...)
 *   4. Save it locally:
 *        echo 'GEMINI_API_KEY=AIza...' >> .env.local
 *
 * Run:
 *   npx tsx scripts/generate-narration.ts                # all scripts
 *   npx tsx scripts/generate-narration.ts home-to-admin  # one by id
 *
 * Cost (free tier covers the entire pitch round many times over):
 *   ~600 input tokens + ~30K audio tokens per 20-second clip
 *   ≈ $0.0006 per regeneration on the paid tier; FREE in AI Studio.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { scripts, type NarrationScript } from './narration-scripts';

const __scriptDir = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__scriptDir, '..');
const OUT_DIR = resolve(REPO_ROOT, 'public', 'walkthrough', 'audio');

// Tiny .env reader — no dotenv dep.
function loadDotEnv(path: string): void {
  try {
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m || line.trim().startsWith('#')) continue;
      const [, k, raw] = m;
      const v = raw.replace(/^["']|["']$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    /* file optional */
  }
}
loadDotEnv(resolve(REPO_ROOT, '.env.local'));
loadDotEnv(resolve(REPO_ROOT, '.env'));

const MODEL = 'gemini-2.5-pro-preview-tts';

interface AudioPart {
  inlineData?: { data: string; mimeType: string };
}
interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: AudioPart[] } }>;
  error?: { message: string; status?: string };
}

async function synthesize(s: NarrationScript, apiKey: string): Promise<Buffer> {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  // Style prompt is concatenated before the spoken text using a Gemini-
  // specific pattern: the model reads the prompt as instructions, then
  // performs the spoken portion. We isolate the speakable text with
  // explicit framing so the listener only hears the script.
  const promptedText = s.stylePrompt
    ? `${s.stylePrompt}\n\nSay the following exactly: ${s.text}`
    : s.text;

  const body = {
    contents: [{ parts: [{ text: promptedText }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: s.voice },
        },
      },
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as GeminiResponse;
  if (!res.ok || data.error) {
    throw new Error(
      `Gemini TTS ${res.status}: ${data.error?.message ?? JSON.stringify(data)}`,
    );
  }

  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part?.inlineData) {
    throw new Error(`No audio returned. Full response: ${JSON.stringify(data)}`);
  }

  // Gemini returns 24kHz signed-16-bit PCM as base64. We need to wrap it
  // as a WAV (so ffmpeg can read it without flag-soup) then transcode to mp3.
  const pcm = Buffer.from(part.inlineData.data, 'base64');
  const sampleRate = parseInt(
    part.inlineData.mimeType.match(/rate=(\d+)/)?.[1] ?? '24000',
    10,
  );
  return pcmToWav(pcm, sampleRate);
}

// Wrap raw PCM in a minimal WAV header so ffmpeg / players accept it.
function pcmToWav(pcm: Buffer, sampleRate: number, channels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);          // PCM chunk size
  header.writeUInt16LE(1, 20);           // PCM format
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

function transcodeWavToMp3(wavPath: string, mp3Path: string): void {
  // `apad=pad_dur=0.8` appends 800 ms of silence so the audio never sounds
  // clipped against the trailing video frame. Gemini TTS sometimes ends on
  // the last word's natural decay with no breathing tail.
  const r = spawnSync('ffmpeg', [
    '-y', '-i', wavPath,
    '-af', 'apad=pad_dur=0.8',
    '-codec:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100',
    mp3Path,
  ], { stdio: 'pipe' });
  if (r.status !== 0) {
    throw new Error(`ffmpeg failed:\n${r.stderr?.toString()}`);
  }
}

async function main(): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      'Missing GEMINI_API_KEY.\n' +
        '→ Get a key at https://aistudio.google.com/apikey (free)\n' +
        '→ Save to .env.local at repo root: GEMINI_API_KEY=AIza...',
    );
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const filter = process.argv[2];
  const targets = filter
    ? scripts.filter((s) => s.scriptId === filter)
    : scripts;
  if (targets.length === 0) {
    console.error(`No scripts matching "${filter}".`);
    process.exit(1);
  }

  for (const s of targets) {
    process.stdout.write(`→ ${s.scriptId} (voice=${s.voice}, ${s.text.length} chars) `);
    const wav = await synthesize(s, apiKey);
    const wavPath = resolve(OUT_DIR, `${s.scriptId}.wav`);
    const mp3Path = resolve(OUT_DIR, `${s.scriptId}.mp3`);
    writeFileSync(wavPath, wav);
    transcodeWavToMp3(wavPath, mp3Path);
    const kb = Math.round((wav.length / 1024) * 0.18); // mp3 ≈ 18% of wav at 128k
    console.log(`✓ ~${kb} KB · ${mp3Path}`);
  }
}

main().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
