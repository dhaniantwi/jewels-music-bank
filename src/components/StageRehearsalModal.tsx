import React, { useState, useEffect, useRef } from 'react';
import { Ministration, Song, TeamMember } from '../types';
import { X, Play, Pause, ChevronLeft, ChevronRight, Type, Activity, Radio, Volume2 } from 'lucide-react';
import { playPitchTone } from '../utils/audioUtils';

interface StageRehearsalModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministration: Ministration;
  songs: Song[];
  team: TeamMember[];
}

export const StageRehearsalModal: React.FC<StageRehearsalModalProps> = ({
  isOpen,
  onClose,
  ministration,
  songs,
  team
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1);
  const [showChords, setShowChords] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentItem = ministration.songs[currentSongIndex];
  const currentSong = songs.find(s => s.id === currentItem?.songId);
  const leadMember = team.find(m => m.id === currentItem?.lead);

  // Auto-scroll loop
  useEffect(() => {
    let scrollTimer: number;
    if (isAutoScrolling && scrollContainerRef.current) {
      scrollTimer = window.setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += scrollSpeed;
        }
      }, 40);
    }
    return () => {
      if (scrollTimer) clearInterval(scrollTimer);
    };
  }, [isAutoScrolling, scrollSpeed]);

  if (!isOpen || !currentSong) return null;

  const effectiveKey = currentItem?.keyOverride || currentSong.key;

  const fontClass = 
    fontSize === 'normal' ? 'text-base sm:text-lg' :
    fontSize === 'large' ? 'text-lg sm:text-2xl' : 'text-2xl sm:text-3xl';

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f11] text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Rehearsal Bar */}
      <header className="p-3 sm:p-4 bg-black/60 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-3 flex-shrink-0">
        
        {/* Setlist Navigation */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
            <button
              onClick={() => setCurrentSongIndex(prev => Math.max(0, prev - 1))}
              disabled={currentSongIndex === 0}
              className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold px-2">
              {currentSongIndex + 1} / {ministration.songs.length}
            </span>
            <button
              onClick={() => setCurrentSongIndex(prev => Math.min(ministration.songs.length - 1, prev + 1))}
              disabled={currentSongIndex === ministration.songs.length - 1}
              className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="min-w-0 hidden sm:block">
            <h2 className="text-sm font-bold truncate text-white/90">
              {currentSong.title}
            </h2>
            <p className="text-[10px] text-white/50 truncate">
              {ministration.name} • {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Center Live Controls */}
        <div className="flex items-center gap-2">
          
          {/* Key Reference Tone */}
          <button
            onClick={() => playPitchTone(`${effectiveKey.replace('m', '')}4`, 2.5)}
            title="Play starting key pitch"
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Key Tone ({effectiveKey})</span>
          </button>

          {/* Auto Scroll Toggle */}
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isAutoScrolling
                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isAutoScrolling ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline">{isAutoScrolling ? 'Pause Scroll' : 'Auto Scroll'}</span>
          </button>

          {/* Font Size Adjust */}
          <div className="flex items-center bg-white/10 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg ${fontSize === 'normal' ? 'bg-white text-black' : 'text-white/70'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-lg ${fontSize === 'large' ? 'bg-white text-black' : 'text-white/70'}`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('huge')}
              className={`px-2 py-1 rounded-lg ${fontSize === 'huge' ? 'bg-white text-black' : 'text-white/70'}`}
            >
              A++
            </button>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Setlist Jump Tabs */}
      <div className="bg-black/40 px-4 py-2 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
        {ministration.songs.map((item, idx) => {
          const s = songs.find(x => x.id === item.songId);
          if (!s) return null;
          return (
            <button
              key={item.songId}
              onClick={() => setCurrentSongIndex(idx)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentSongIndex === idx
                  ? 'bg-[#007aff] text-white shadow-sm'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="opacity-60">{idx + 1}.</span>
              <span>{s.title}</span>
              <span className="text-[10px] opacity-75 font-mono">({item.keyOverride || s.key})</span>
            </button>
          );
        })}
      </div>

      {/* Main Teleprompter Content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 sm:p-12 max-w-4xl mx-auto w-full space-y-8"
      >
        {/* Song Spotlight Banner */}
        <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#007aff] bg-[#007aff]/20 px-2.5 py-0.5 rounded-full">
                {currentSong.category}
              </span>
              <span className="text-xs font-extrabold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full">
                KEY: {effectiveKey}
              </span>
              <span className="text-xs font-bold text-white/60">
                {currentSong.tempo}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {currentSong.title}
            </h1>
            <p className="text-sm font-semibold text-white/60 mt-0.5">
              {currentSong.artist}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/20 flex items-center justify-center text-xl">
              🎤
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7c3aed] block">
                Lead Vocalist
              </span>
              <p className="text-sm font-bold text-white">
                {leadMember ? leadMember.name : 'Unassigned'}
              </p>
            </div>
          </div>
        </div>

        {/* Transition / MD Cue */}
        {(currentItem?.orderNote || currentSong.mdNotes) && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <span className="text-[10px] font-extrabold uppercase tracking-wider block text-amber-400 mb-1">
              🎼 Transition Cue & Director Notes
            </span>
            <p className="text-xs sm:text-sm font-medium">
              {currentItem?.orderNote ? `${currentItem.orderNote} • ` : ''}
              {currentSong.mdNotes}
            </p>
          </div>
        )}

        {/* Chords Bar */}
        {showChords && currentSong.chords && (
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-amber-300 whitespace-pre-wrap leading-relaxed">
            <span className="text-[10px] font-bold uppercase text-white/40 block mb-1">
              Chords Progression (Key of {effectiveKey})
            </span>
            {currentSong.chords}
          </div>
        )}

        {/* Large Prompter Lyrics */}
        <div className={`font-sans font-medium leading-loose whitespace-pre-wrap ${fontClass} text-white/90 p-4 rounded-3xl bg-white/[0.02]`}>
          {currentSong.lyrics || 'No lyrics text provided for this song.'}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 pb-12 border-t border-white/10">
          <button
            onClick={() => setCurrentSongIndex(prev => Math.max(0, prev - 1))}
            disabled={currentSongIndex === 0}
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-20 text-sm font-bold flex items-center gap-2 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Song</span>
          </button>

          <button
            onClick={() => setCurrentSongIndex(prev => Math.min(ministration.songs.length - 1, prev + 1))}
            disabled={currentSongIndex === ministration.songs.length - 1}
            className="px-6 py-3 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] disabled:opacity-20 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <span>Next Song</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
