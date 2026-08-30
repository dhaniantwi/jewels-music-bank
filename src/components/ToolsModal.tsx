import React, { useState, useEffect, useRef } from 'react';
import { playPitchTone, playMetronomeClick, CHROMATIC_KEYS, transposeKey } from '../utils/audioUtils';
import { X, Play, Square, Volume2, RotateCcw, Activity } from 'lucide-react';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({ isOpen, onClose }) => {
  // Pitch pipe state
  const [activeTone, setActiveTone] = useState<string | null>(null);
  const [octave, setOctave] = useState<'3' | '4'>('4');
  const stopToneRef = useRef<(() => void) | null>(null);

  // Metronome state
  const [bpm, setBpm] = useState<number>(100);
  const [isPlayingMetronome, setIsPlayingMetronome] = useState<boolean>(false);
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
      setActiveTone(prev => prev === note ? null : prev);
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
        beatCountRef.current = (beatCountRef.current + 1) % 4;
      };

      tick();
      metronomeIntervalRef.current = window.setInterval(tick, intervalMs);

      return () => {
        if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
      };
    } else {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
      setCurrentBeatVisual(0);
    }
  }, [isPlayingMetronome, bpm]);

  // Tap tempo handler
  const handleTapTempo = () => {
    const now = Date.now();
    const newTaps = [...tapTimes.filter(t => now - t < 3000), now];
    setTapTimes(newTaps);

    if (newTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        setBpm(calculatedBpm);
      }
    }
  };

  if (!isOpen) return null;

  const notesList = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="ios-glass bg-white/95 rounded-[32px] max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-white/80 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007aff] to-[#7c3aed] flex items-center justify-center text-white text-lg shadow-md shadow-[#007aff]/20">
              🛠️
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#007aff]">
                DIRECTOR & REHEARSAL SUITE
              </span>
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Ministry Musical Tools
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#6e6e73] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOOL 1: VOCAL PITCH PIPE */}
        <div className="mb-6 p-4 rounded-2xl bg-black/[0.025] border border-black/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🎵</span>
              <h3 className="text-sm font-bold text-[#1d1d1f]">Vocal Pitch Pipe</h3>
            </div>
            <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setOctave('3')}
                className={`px-2.5 py-0.5 rounded-lg transition-all ${octave === '3' ? 'bg-white text-[#007aff] shadow-xs' : 'text-[#6e6e73]'}`}
              >
                Octave 3 (Low)
              </button>
              <button
                onClick={() => setOctave('4')}
                className={`px-2.5 py-0.5 rounded-lg transition-all ${octave === '4' ? 'bg-white text-[#007aff] shadow-xs' : 'text-[#6e6e73]'}`}
              >
                Octave 4 (Mid)
              </button>
            </div>
          </div>

          <p className="text-xs text-[#86868b] mb-3">
            Tap a note to play reference pitch for vocal harmonies (Soprano, Alto, Tenor).
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {notesList.map(note => {
              const isPlaying = activeTone === note;
              return (
                <button
                  key={note}
                  onClick={() => handlePlayTone(note)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                    isPlaying
                      ? 'bg-[#007aff] text-white border-[#007aff] shadow-md shadow-[#007aff]/30 scale-105 animate-pulse'
                      : 'bg-white text-[#1d1d1f] border-black/5 hover:border-[#007aff]/30 hover:bg-[#007aff]/5'
                  }`}
                >
                  <span>{note}</span>
                  <span className="text-[10px] opacity-60 font-normal">{note}{octave}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TOOL 2: REHEARSAL METRONOME & TAP TEMPO */}
        <div className="mb-6 p-4 rounded-2xl bg-black/[0.025] border border-black/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">⏱️</span>
              <h3 className="text-sm font-bold text-[#1d1d1f]">Rehearsal Metronome & Tap Tempo</h3>
            </div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map(beat => (
                <div
                  key={beat}
                  className={`w-3 h-3 rounded-full transition-all ${
                    isPlayingMetronome && currentBeatVisual === beat
                      ? beat === 0 ? 'bg-[#007aff] scale-125' : 'bg-[#7c3aed] scale-110'
                      : 'bg-black/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#1d1d1f]">{bpm}</span>
              <span className="text-xs text-[#86868b] font-semibold">BPM</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTapTempo}
                className="px-3.5 py-2 rounded-xl bg-white border border-black/10 hover:bg-black/5 text-[#1d1d1f] text-xs font-bold active:scale-95 transition-all shadow-xs"
              >
                👆 Tap Tempo
              </button>

              <button
                onClick={() => setIsPlayingMetronome(!isPlayingMetronome)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                  isPlayingMetronome
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-[#007aff] hover:bg-[#0062cc] text-white'
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
          <div className="flex justify-between text-[10px] text-[#86868b] mt-1 font-semibold">
            <span>40 (Grave)</span>
            <span>68 (Slow Worship)</span>
            <span>95 (Mid Gospel)</span>
            <span>128 (Afropraise)</span>
            <span>220 (Presto)</span>
          </div>
        </div>

        {/* TOOL 3: KEY TRANSPOSITION CALCULATOR */}
        <div className="p-4 rounded-2xl bg-black/[0.025] border border-black/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔄</span>
            <h3 className="text-sm font-bold text-[#1d1d1f]">Quick Transposition Helper</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 items-center">
            <div>
              <label className="text-[11px] font-bold text-[#6e6e73] block mb-1">Current Key</label>
              <select
                value={sourceKey}
                onChange={(e) => setSourceKey(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl p-2 text-xs font-bold text-[#1d1d1f] outline-none focus:border-[#007aff]"
              >
                {CHROMATIC_KEYS.map(k => (
                  <option key={k} value={k}>{k} Major</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#6e6e73] block mb-1">Modulation</label>
              <div className="flex items-center gap-1 bg-white border border-black/10 rounded-xl p-1 justify-between">
                <button
                  onClick={() => setSemitones(prev => prev - 1)}
                  className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-bold"
                >
                  -
                </button>
                <span className="text-xs font-bold text-[#007aff]">
                  {semitones > 0 ? `+${semitones}` : semitones} semi
                </span>
                <button
                  onClick={() => setSemitones(prev => prev + 1)}
                  className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#6e6e73] block mb-1">Target Key</label>
              <div className="bg-gradient-to-r from-[#007aff]/10 to-[#7c3aed]/10 border border-[#007aff]/20 rounded-xl p-2 text-center">
                <span className="text-base font-extrabold text-[#007aff]">
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
