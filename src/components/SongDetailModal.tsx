import React, { useState } from 'react';
import { Song, ActiveRole } from '../types';
import { X, Play, Pause, Volume2, Music, Mic, Layers, Edit, Trash2, ArrowRight, Share2, Printer, Sparkles } from 'lucide-react';
import { transposeKey, playPitchTone } from '../utils/audioUtils';

interface SongDetailModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  activeRole: ActiveRole;
  onEdit: (song: Song) => void;
  onDelete: (songId: number) => void;
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({
  song,
  isOpen,
  onClose,
  activeRole,
  onEdit,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<'lyrics' | 'vocal' | 'instruments' | 'mdNotes'>('lyrics');
  const [showChords, setShowChords] = useState<boolean>(true);
  const [transposeOffset, setTransposeOffset] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  if (!isOpen || !song) return null;

  const isMD = activeRole === 'admin_md';
  const effectiveKey = transposeKey(song.key, transposeOffset);

  const handleTogglePlay = () => {
    if (audioRef.current && song.audioUrl) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play();
        setIsPlayingAudio(true);
      }
    } else {
      // Synthesize starting reference chord / key tone for rehearsal
      setIsPlayingAudio(true);
      playPitchTone(`${effectiveKey.replace('m', '')}4`, 3);
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="ios-glass bg-white/95 rounded-[32px] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-white/80 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-black/5 flex-shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#007aff]/15 to-[#7c3aed]/15 flex items-center justify-center text-3xl shadow-sm flex-shrink-0 border border-black/5">
              {song.icon || '🎵'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#007aff]/10 text-[#007aff]">
                  {song.category}
                </span>
                {song.timeSignature && (
                  <span className="text-[11px] font-bold text-[#86868b] bg-black/5 px-2 py-0.5 rounded-full">
                    {song.timeSignature}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight truncate mt-0.5">
                {song.title}
              </h2>
              <p className="text-sm font-semibold text-[#6e6e73]">
                {song.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isMD && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEdit(song);
                  }}
                  title="Edit Song (MD Control)"
                  className="w-9 h-9 rounded-full bg-[#007aff]/10 hover:bg-[#007aff]/20 text-[#007aff] flex items-center justify-center transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${song.title}" from the Song Bank?`)) {
                      onDelete(song.id);
                      onClose();
                    }
                  }}
                  title="Delete Song (MD Control)"
                  className="w-9 h-9 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 flex items-center justify-center transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#6e6e73] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Musical Metatags & Transpose Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4 flex-shrink-0">
          
          {/* Key & Transpose */}
          <div className="p-3 rounded-2xl bg-black/[0.03] border border-black/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">
              Musical Key
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-extrabold text-[#007aff]">
                {effectiveKey}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTransposeOffset(prev => prev - 1)}
                  title="Transpose Down"
                  className="w-6 h-6 rounded-md bg-white text-xs font-bold shadow-xs hover:bg-black/5"
                >
                  -
                </button>
                <button
                  onClick={() => setTransposeOffset(0)}
                  title="Reset to Original Key"
                  className="text-[9px] px-1 text-[#86868b] font-bold hover:text-[#007aff]"
                >
                  {transposeOffset !== 0 ? `${transposeOffset > 0 ? '+' : ''}${transposeOffset}` : 'Orig'}
                </button>
                <button
                  onClick={() => setTransposeOffset(prev => prev + 1)}
                  title="Transpose Up"
                  className="w-6 h-6 rounded-md bg-white text-xs font-bold shadow-xs hover:bg-black/5"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Tempo */}
          <div className="p-3 rounded-2xl bg-black/[0.03] border border-black/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">
              Tempo
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-[#1d1d1f] truncate">
                {song.tempo}
              </span>
            </div>
          </div>

          {/* Reference Audio Preview */}
          <div className="col-span-2 p-3 rounded-2xl bg-gradient-to-r from-[#007aff]/5 to-[#7c3aed]/5 border border-[#007aff]/15 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#007aff] uppercase tracking-wider block">
                Audio Reference
              </span>
              <p className="text-xs font-semibold text-[#1d1d1f] truncate">
                {song.audioUrl ? 'Ministry Practice Recording' : `Key Tone Guide (${effectiveKey})`}
              </p>
            </div>
            
            {song.audioUrl && (
              <audio ref={audioRef} src={song.audioUrl} onEnded={() => setIsPlayingAudio(false)} className="hidden" />
            )}

            <button
              onClick={handleTogglePlay}
              className="px-3.5 py-1.5 rounded-xl bg-[#007aff] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-[#007aff]/25 hover:bg-[#0062cc] transition-all flex-shrink-0 active:scale-95"
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Tone</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* View Tabs */}
        <div className="flex items-center border-b border-black/5 pb-2 gap-1.5 flex-shrink-0">
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'lyrics'
                ? 'bg-[#007aff] text-white shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5'
            }`}
          >
            <span>📝</span>
            <span>Lyrics & Chords</span>
          </button>

          <button
            onClick={() => setActiveTab('vocal')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'vocal'
                ? 'bg-[#7c3aed] text-white shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5'
            }`}
          >
            <span>🎤</span>
            <span>Vocal Harmonies</span>
          </button>

          <button
            onClick={() => setActiveTab('instruments')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'instruments'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5'
            }`}
          >
            <span>🎹</span>
            <span>Band & Instruments</span>
          </button>

          <button
            onClick={() => setActiveTab('mdNotes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'mdNotes'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5'
            }`}
          >
            <span>🎼</span>
            <span>MD Notes</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-4 pr-1">
          
          {/* TAB 1: LYRICS & CHORDS */}
          {activeTab === 'lyrics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#86868b]">
                  {showChords && song.chords ? 'Chords & Lyrics View' : 'Lyrics View'}
                </span>
                {song.chords && (
                  <button
                    onClick={() => setShowChords(!showChords)}
                    className="text-xs font-bold text-[#007aff] px-2.5 py-1 rounded-lg bg-[#007aff]/10 hover:bg-[#007aff]/15 transition-colors"
                  >
                    {showChords ? 'Hide Chord Chart' : 'Show Chord Chart'}
                  </button>
                )}
              </div>

              {showChords && song.chords && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 font-mono text-xs text-amber-950 whitespace-pre-wrap leading-relaxed">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                    Chord Chart / Progression (Key of {effectiveKey})
                  </div>
                  {song.chords}
                </div>
              )}

              <div className="p-5 rounded-2xl bg-black/[0.025] border border-black/5 text-[#1d1d1f] text-sm sm:text-base font-normal leading-relaxed whitespace-pre-wrap font-sans">
                {song.lyrics || 'No lyrics available yet for this song.'}
              </div>
            </div>
          )}

          {/* TAB 2: VOCAL ARRANGEMENT */}
          {activeTab === 'vocal' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#007aff]/5 border border-[#007aff]/15">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">👑</span>
                  <h4 className="text-sm font-bold text-[#007aff]">Lead Vocalist Role</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#1d1d1f] leading-relaxed">
                  {song.arrangement.lead || 'Lead vocalist establishes the melody and sets the prayer atmosphere.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-xs">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-base">🎶</span>
                    <h5 className="text-xs font-bold text-[#7c3aed]">Soprano (Upper)</h5>
                  </div>
                  <p className="text-xs text-[#6e6e73] leading-relaxed">
                    {song.arrangement.soprano || 'Upper harmony support.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-xs">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-base">🎶</span>
                    <h5 className="text-xs font-bold text-[#007aff]">Alto (Middle)</h5>
                  </div>
                  <p className="text-xs text-[#6e6e73] leading-relaxed">
                    {song.arrangement.alto || 'Middle harmonic foundation.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-xs">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-base">🎶</span>
                    <h5 className="text-xs font-bold text-[#1d1d1f]">Tenor (Lower)</h5>
                  </div>
                  <p className="text-xs text-[#6e6e73] leading-relaxed">
                    {song.arrangement.tenor || 'Lower male harmony and foundation.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BAND & INSTRUMENTATION */}
          {activeTab === 'instruments' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">🎹</span>
                  <h4 className="text-xs font-bold text-[#1d1d1f]">Keyboard & Synth Pads</h4>
                </div>
                <p className="text-xs text-[#6e6e73] leading-relaxed">
                  {song.instruments.keyboard || 'Main harmonic accompaniment.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">🎸</span>
                  <h4 className="text-xs font-bold text-[#1d1d1f]">Guitars (Lead & Acoustic)</h4>
                </div>
                <p className="text-xs text-[#6e6e73] leading-relaxed">
                  {song.instruments.guitar || 'Rhythmic support and melodic fills.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">🎸</span>
                  <h4 className="text-xs font-bold text-[#1d1d1f]">Bass Guitar</h4>
                </div>
                <p className="text-xs text-[#6e6e73] leading-relaxed">
                  {song.instruments.bass || 'Root note foundations and groove.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">🥁</span>
                  <h4 className="text-xs font-bold text-[#1d1d1f]">Drums & Percussion</h4>
                </div>
                <p className="text-xs text-[#6e6e73] leading-relaxed">
                  {song.instruments.drums || 'Dynamic praise and worship groove.'}
                </p>
              </div>

              {song.instruments.brass && (
                <div className="col-span-1 sm:col-span-2 p-4 rounded-2xl bg-white border border-black/5 shadow-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">🎷</span>
                    <h4 className="text-xs font-bold text-[#1d1d1f]">Brass & Auxiliary</h4>
                  </div>
                  <p className="text-xs text-[#6e6e73] leading-relaxed">
                    {song.instruments.brass}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MUSIC DIRECTOR REHEARSAL NOTES */}
          {activeTab === 'mdNotes' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-[#1d1d1f]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎼</span>
                <div>
                  <h4 className="text-sm font-bold text-amber-950">Music Director Directives</h4>
                  <p className="text-[11px] text-amber-800">Directorial notes for rehearsals and Sunday service</p>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-[#1d1d1f] leading-relaxed whitespace-pre-wrap">
                {song.mdNotes || 'No specific MD notes added yet for this song.'}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
