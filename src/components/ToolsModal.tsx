import React, { useState, useEffect, useRef } from 'react';
import {
  playPitchTone,
  playMetronomeClick,
  CHROMATIC_KEYS,
  transposeKey
} from '../utils/audioUtils';
import { X, Play, Square } from 'lucide-react';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({
  isOpen,
  onClose
}) => {
  // Pitch pipe state
  const [activeTone, setActiveTone] = useState<string | null>(null);
  const [octave, setOctave] = useState<'3' | '4'>('4');
  const stopToneRef = useRef<(() => void) | null>(null);

  // Metronome state
  const [bpm, setBpm] = useState<number>(100);
  const [isPlayingMetronome, setIsPlayingMetronome] =
    useState<boolean>(false);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const metronomeIntervalRef = useRef<number | null>(null);
  const beatCountRef = useRef<number>(0);
  const [currentBeatVisual, setCurrentBeatVisual] = useState<number>(0);

  // Transpose tool state
  const [sourceKey, setSourceKey] = useState<string>('G');
  const [semitones, setSemitones] = useState<number>(2);

  // Handle playing pitch pipe tone
  const handlePlayTone = (note: string) => {
    if (stopToneRef.current) {
      stopToneRef.current();
      stopToneRef.current = null;
    }

    if (activeTone === note) {
      setActiveTone(null);
      return;
    }

    setActiveTone(note);

    const stopFn = playPitchTone(`${note}${octave}`, 3.5);
    stopToneRef.current = stopFn;

    setTimeout(() => {
      setActiveTone((prev) => (prev === note ? null : prev));
    }, 3500);
  };

  // Metronome logic
  useEffect(() => {
    if (isPlayingMetronome) {
      const intervalMs = (60 / bpm) * 1000;
      beatCountRef.current = 0;

      const tick = () => {
        const isAccent = beatCountRef.current % 4 === 0;

        playMetronomeClick(isAccent);
        setCurrentBeatVisual(beatCountRef.current % 4);

        beatCountRef.current =
          (beatCountRef.current + 1) % 4;
      };

      tick();

      metronomeIntervalRef.current = window.setInterval(
        tick,
        intervalMs
      );

      return () => {
        if (metronomeIntervalRef.current) {
          clearInterval(metronomeIntervalRef.current);
        }
      };
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }

      setCurrentBeatVisual(0);
    }
  }, [isPlayingMetronome, bpm]);

  // Tap tempo handler
  const handleTapTempo = () => {
    const now = Date.now();

    const newTaps = [
      ...tapTimes.filter((t) => now - t < 3000),
      now
    ];

    setTapTimes(newTaps);

    if (newTaps.length >= 2) {
      const intervals: number[] = [];

      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }

      const avgInterval =
        intervals.reduce((a, b) => a + b, 0) /
        intervals.length;

      const calculatedBpm = Math.round(60000 / avgInterval);

      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        setBpm(calculatedBpm);
      }
    }
  };

  if (!isOpen) return null;

  const notesList = [
    'C',
    'C#',
    'D',
    'Eb',
    'E',
    'F',
    'F#',
    'G',
    'Ab',
    'A',
    'Bb',
    'B'
  ];

  const inputClass =
    'w-full bg-white/[0.055] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none transition-all focus:border-[#007aff]/60 focus:ring-2 focus:ring-[#007aff]/10';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative ios-glass bg-[#141417]/95 rounded-[32px] max-w-xl w-full p-5 sm:p-7 shadow-[0_30px_100px_rgba(0,0,0,0.55)] border border-white/10 max-h-[92vh] overflow-y-auto">

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-32 -left-24 w-72 h-72 rounded-full bg-[#007aff]/10 blur-3xl" />
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#7c3aed]/10 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between pb-5 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#007aff] to-[#7c3aed] flex items-center justify-center text-white text-lg shadow-lg shadow-[#007aff]/20">
              🛠️
            </div>

            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#4da3ff]">
                Director & Rehearsal Suite
              </span>

              <h2 className="text-xl font-bold text-white tracking-tight">
                Ministry Musical Tools
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/[0.11] flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOOL 1: VOCAL PITCH PIPE */}
        <div className="relative mb-6 p-4 rounded-2xl bg-white/[0.035] border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🎵</span>

              <h3 className="text-sm font-bold text-white">
                Vocal Pitch Pipe
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-black/20 border border-white/10 p-1 rounded-xl text-[10px] font-semibold self-start">
              <button
                type="button"
                onClick={() => setOctave('3')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  octave === '3'
                    ? 'bg-[#007aff] text-white shadow-lg shadow-[#007aff]/20'
                    : 'text-white/45 hover:text-white/80'
                }`}
              >
                Octave 3 · Low
              </button>

              <button
                type="button"
                onClick={() => setOctave('4')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  octave === '4'
                    ? 'bg-[#007aff] text-white shadow-lg shadow-[#007aff]/20'
                    : 'text-white/45 hover:text-white/80'
                }`}
              >
                Octave 4 · Mid
              </button>
            </div>
          </div>

          <p className="text-xs text-white/40 mb-4 leading-relaxed">
            Tap a note to play a reference pitch for vocal harmonies
            (Soprano, Alto, Tenor).
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {notesList.map((note) => {
              const isPlaying = activeTone === note;

              return (
                <button
                  key={note}
                  type="button"
                  onClick={() => handlePlayTone(note)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                    isPlaying
                      ? 'bg-[#007aff] text-white border-[#007aff] shadow-lg shadow-[#007aff]/30 scale-105 animate-pulse'
                      : 'bg-white/[0.045] text-white border-white/10 hover:border-[#007aff]/40 hover:bg-[#007aff]/10'
                  }`}
                >
                  <span>{note}</span>

                  <span className="text-[10px] opacity-55 font-normal">
                    {note}
                    {octave}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TOOL 2: REHEARSAL METRONOME */}
        <div className="relative mb-6 p-4 rounded-2xl bg-white/[0.035] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base">⏱️</span>

              <h3 className="text-sm font-bold text-white">
                Rehearsal Metronome & Tap Tempo
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((beat) => (
                <div
                  key={beat}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isPlayingMetronome &&
                    currentBeatVisual === beat
                      ? beat === 0
                        ? 'bg-[#007aff] scale-125 shadow-[0_0_12px_rgba(0,122,255,0.7)]'
                        : 'bg-[#7c3aed] scale-110 shadow-[0_0_10px_rgba(124,58,237,0.6)]'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {bpm}
              </span>

              <span className="text-xs text-white/40 font-semibold">
                BPM
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTapTempo}
                className="px-3.5 py-2.5 rounded-xl bg-white/[0.055] border border-white/10 hover:bg-white/[0.10] text-white/80 hover:text-white text-xs font-bold active:scale-95 transition-all"
              >
                👆 Tap Tempo
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsPlayingMetronome(!isPlayingMetronome)
                }
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all active:scale-95 ${
                  isPlayingMetronome
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                    : 'bg-[#007aff] hover:bg-[#006fe6] text-white shadow-[#007aff]/20'
                }`}
              >
                {isPlayingMetronome ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Click</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <input
            type="range"
            min="40"
            max="220"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-[#007aff] cursor-pointer"
          />

          <div className="flex justify-between text-[9px] sm:text-[10px] text-white/30 mt-2 font-semibold gap-2">
            <span>40 · Grave</span>
            <span>68 · Worship</span>
            <span>95 · Gospel</span>
            <span>128 · Afropraise</span>
            <span>220 · Presto</span>
          </div>
        </div>

        {/* TOOL 3: TRANSPOSITION */}
        <div className="relative p-4 rounded-2xl bg-white/[0.035] border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">🔄</span>

            <h3 className="text-sm font-bold text-white">
              Quick Transposition Helper
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            {/* Current Key */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-2">
                Current Key
              </label>

              <select
                value={sourceKey}
                onChange={(e) => setSourceKey(e.target.value)}
                className={inputClass}
              >
                {CHROMATIC_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k} Major
                  </option>
                ))}
              </select>
            </div>

            {/* Modulation */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-2">
                Modulation
              </label>

              <div className="flex items-center gap-1 bg-white/[0.055] border border-white/10 rounded-xl p-1 justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setSemitones((prev) => prev - 1)
                  }
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/80 text-xs font-bold transition-all"
                >
                  −
                </button>

                <span className="text-xs font-bold text-[#4da3ff] whitespace-nowrap">
                  {semitones > 0
                    ? `+${semitones}`
                    : semitones}{' '}
                  semi
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSemitones((prev) => prev + 1)
                  }
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/80 text-xs font-bold transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Target Key */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-2">
                Target Key
              </label>

              <div className="bg-gradient-to-r from-[#007aff]/15 to-[#7c3aed]/15 border border-[#007aff]/25 rounded-xl p-2.5 text-center shadow-lg shadow-[#007aff]/5">
                <span className="text-lg font-extrabold text-[#4da3ff]">
                  {transposeKey(sourceKey, semitones)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
