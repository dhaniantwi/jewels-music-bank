// Web Audio API Utilities for Church Music Ministry & Vocalists

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Note frequencies map
export const NOTE_FREQUENCIES: Record<string, number> = {
  'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56,
  'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65,
  'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30,
  'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25
};

export const CHROMATIC_KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

/**
 * Play a vocal pitch reference tone (Pitch Pipe)
 */
export function playPitchTone(note: string, durationSeconds = 2.5): () => void {
  try {
    const ctx = getAudioContext();
    const freq = NOTE_FREQUENCIES[note] || NOTE_FREQUENCIES[`${note}4`] || 440;
    
    // Fundamental tone
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Harmonic warmth (organ/pipe-like)
    const osc2 = ctx.createOscillator();
    const gainNode2 = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);
    
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
    
    gainNode2.gain.setValueAtTime(0.0001, now);
    gainNode2.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
    gainNode2.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc2.connect(gainNode2);
    gainNode2.connect(ctx.destination);
    
    osc.start(now);
    osc2.start(now);
    osc.stop(now + durationSeconds);
    osc2.stop(now + durationSeconds);
    
    return () => {
      try {
        gainNode.gain.cancelScheduledValues(ctx.currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        setTimeout(() => {
          osc.stop();
          osc2.stop();
        }, 60);
      } catch {
        // ignore
      }
    };
  } catch (err) {
    console.warn('Audio playback error:', err);
    return () => {};
  }
}
/**
 * Play a musical key reference chord
 * Major = root + major third + fifth
 * Minor = root + minor third + fifth
 */
export function playKeyChord(
  key: string,
  durationSeconds = 2.5
): () => void {
  try {
    const ctx = getAudioContext();

    const cleanKey = key.trim();
    const isMinor = cleanKey.toLowerCase().includes('m');
    const rootKey = cleanKey.replace(/m/gi, '');

    const rootFreq =
      NOTE_FREQUENCIES[`${rootKey}4`] ||
      NOTE_FREQUENCIES[rootKey] ||
      440;

    const intervals = isMinor
      ? [0, 3, 7]
      : [0, 4, 7];

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    const now = ctx.currentTime;

    intervals.forEach((interval, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      const frequency =
        rootFreq * Math.pow(2, interval / 12);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(
        frequency,
        now
      );

      gain.gain.setValueAtTime(0.0001, now);

      gain.gain.exponentialRampToValueAtTime(
        index === 0 ? 0.22 : 0.14,
        now + 0.05
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + durationSeconds
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(now);
      oscillator.stop(now + durationSeconds);

      oscillators.push(oscillator);
      gains.push(gain);
    });

    return () => {
      try {
        const stopTime = ctx.currentTime;

        gains.forEach((gain) => {
          gain.gain.cancelScheduledValues(stopTime);
          gain.gain.setValueAtTime(
            Math.max(gain.gain.value, 0.0001),
            stopTime
          );
          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            stopTime + 0.05
          );
        });

        setTimeout(() => {
          oscillators.forEach((oscillator) => {
            try {
              oscillator.stop();
            } catch {
              // ignore
            }
          });
        }, 60);
      } catch {
        // ignore
      }
    };
  } catch (err) {
    console.warn('Key chord playback error:', err);
    return () => {};
  }
}

/**
 * Play a metronome click sound
 */
export function playMetronomeClick(isHighAccent = false): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    const now = ctx.currentTime;
    osc.type = isHighAccent ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(isHighAccent ? 1200 : 800, now);
    
    gainNode.gain.setValueAtTime(1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (err) {
    console.warn('Metronome click error:', err);
  }
}

/**
 * Transpose a musical key by semitone offset
 */
export function transposeKey(currentKey: string, semitones: number): string {
  const cleanKey = currentKey.trim().replace('m', '');
  const isMinor = currentKey.includes('m');
  const index = CHROMATIC_KEYS.findIndex(k => k.toLowerCase() === cleanKey.toLowerCase());
  if (index === -1) return currentKey;
  
  let newIndex = (index + semitones) % CHROMATIC_KEYS.length;
  if (newIndex < 0) newIndex += CHROMATIC_KEYS.length;
  
  return CHROMATIC_KEYS[newIndex] + (isMinor ? 'm' : '');
}
