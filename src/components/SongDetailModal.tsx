import React, { useEffect, useRef, useState } from 'react';
import { getAudioUrl } from '../utils/audioStorage';
import { Song, ActiveRole } from '../types';
import {
  X,
  Play,
  Pause,
  Edit,
  Trash2,
  Download,
  Music2,
  Minus,
  Plus,
  RotateCcw
} from 'lucide-react';
import {
  transposeKey,
  playKeyChord
} from '../utils/audioUtils';

interface SongDetailModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  activeRole: ActiveRole;
  onEdit: (song: Song) => void;
  onDelete: (songId: string) => void;
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({
  song,
  isOpen,
  onClose,
  activeRole,
  onEdit,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<
    'lyrics' | 'vocal' | 'instruments' | 'mdNotes'
  >('lyrics');

  const [showChords, setShowChords] = useState(true);
  const [transposeOffset, setTransposeOffset] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen || !song) {
      setAudioUrl(null);
      return;
    }

    const url = getAudioUrl(song.audioUrl);

    setAudioUrl(url);

    return () => {
      setAudioUrl(null);
    };
  }, [isOpen, song?.id, song?.audioUrl]);

  if (!isOpen || !song) {
    return null;
  }

  const isMD = activeRole === 'admin_md';

  const effectiveKey = transposeKey(
    song.key || 'C',
    transposeOffset
  );

  const arrangement = song.arrangement || {
    lead: '',
    soprano: '',
    alto: '',
    tenor: ''
  };

  const instruments = song.instruments || {
    keyboard: '',
    guitar: '',
    bass: '',
    drums: '',
    brass: ''
  };

  const lyrics =
    song.lyrics || 'No lyrics available yet for this song.';

  const chords = song.chords || '';
  const tempo = song.tempo || 'Not specified';
  const category = song.category || 'Song';
  const icon = song.icon || '🎵';
  const artist = song.artist || 'Unknown Artist';

  const handleTogglePlay = () => {
    if (audioRef.current && audioUrl) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlayingAudio(true);
          })
          .catch((error) => {
            console.error(
              'Could not play audio:',
              error
            );
          });
      }

      return;
    }

    setIsPlayingAudio(true);

    playKeyChord(effectiveKey, 3);

    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3000);
  };

  const handleDownloadAudio = () => {
    if (!song?.audioUrl) {
      alert(
        'No uploaded recording was found for this song.'
      );
      return;
    }

    try {
      const link = document.createElement('a');

      link.href = song.audioUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(
        'Could not open song audio:',
        error
      );

      alert(
        'Unable to download the recording.'
      );
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${song.title}" from the Song Bank?`
    );

    if (!confirmed) {
      return;
    }

    onDelete(song.id);
    onClose();
  };

  const tabs = [
    {
      id: 'lyrics' as const,
      label: 'Lyrics & Chords',
      icon: '📝',
      activeClass: 'bg-[#007aff] text-white'
    },
    {
      id: 'vocal' as const,
      label: 'Vocal',
      icon: '🎤',
      activeClass: 'bg-[#7c3aed] text-white'
    },
    {
      id: 'instruments' as const,
      label: 'Band',
      icon: '🎹',
      activeClass: 'bg-white text-black'
    },
    {
      id: 'mdNotes' as const,
      label: 'MD Notes',
      icon: '🎼',
      activeClass: 'bg-amber-500 text-black'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200">

      <div className="ios-glass bg-[#111114]/95 rounded-[30px] max-w-3xl w-full shadow-2xl border border-white/10 max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-5 sm:px-7 pt-5 pb-4 border-b border-white/[0.08] flex-shrink-0">

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">

              <div className="w-14 h-14 rounded-2xl bg-[#007aff]/10 border border-[#007aff]/15 flex items-center justify-center text-3xl flex-shrink-0 shadow-[0_10px_30px_rgba(0,122,255,0.10)]">
                {icon}
              </div>

              <div className="min-w-0">

                <div className="flex items-center gap-2 flex-wrap mb-1">

                  <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-[#007aff]/10 border border-[#007aff]/15 text-[#4da3ff]">
                    {category}
                  </span>

                  {song.timeSignature && (
                    <span className="text-[9px] font-bold text-white/35 bg-white/[0.045] border border-white/10 px-2.5 py-1 rounded-full">
                      {song.timeSignature}
                    </span>
                  )}

                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight truncate">
                  {song.title}
                </h2>

                <p className="text-sm font-semibold text-white/40 truncate mt-0.5">
                  {artist}
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
                    title="Edit Song"
                    className="w-9 h-9 rounded-xl bg-[#007aff]/10 border border-[#007aff]/15 hover:bg-[#007aff]/20 text-[#4da3ff] flex items-center justify-center transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleDelete}
                    title="Delete Song"
                    className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/15 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                title="Close"
                className="w-9 h-9 rounded-xl bg-white/[0.055] border border-white/10 hover:bg-white/[0.10] text-white/45 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

          </div>

        </div>

        {/* Song Information */}
        <div className="px-5 sm:px-7 py-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-shrink-0">

          {/* Key */}
          <div className="p-3 rounded-2xl bg-white/[0.045] border border-white/[0.08]">

            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">
              Musical Key
            </span>

            <div className="flex items-center justify-between gap-2 mt-1">

              <span className="text-xl font-extrabold text-[#4da3ff]">
                {effectiveKey}
              </span>

              <div className="flex items-center gap-0.5">

                <button
                  onClick={() =>
                    setTransposeOffset(
                      prev => prev - 1
                    )
                  }
                  className="w-6 h-6 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-white/60 flex items-center justify-center transition-all"
                  title="Transpose down"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <button
                  onClick={() =>
                    setTransposeOffset(0)
                  }
                  className="min-w-[28px] text-[9px] text-white/35 hover:text-white font-bold transition-all"
                  title="Reset transpose"
                >
                  {transposeOffset !== 0
                    ? `${transposeOffset > 0 ? '+' : ''}${transposeOffset}`
                    : 'Orig'}
                </button>

                <button
                  onClick={() =>
                    setTransposeOffset(
                      prev => prev + 1
                    )
                  }
                  className="w-6 h-6 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-white/60 flex items-center justify-center transition-all"
                  title="Transpose up"
                >
                  <Plus className="w-3 h-3" />
                </button>

              </div>

            </div>

          </div>

          {/* Tempo */}
          <div className="p-3 rounded-2xl bg-white/[0.045] border border-white/[0.08]">

            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">
              Tempo
            </span>

            <p className="text-lg font-bold text-white mt-1 truncate">
              {tempo}
            </p>

          </div>

          {/* Audio */}
          <div className="col-span-2 p-3 rounded-2xl bg-[#007aff]/[0.07] border border-[#007aff]/15 flex items-center justify-between gap-3">

            <div className="min-w-0">

              <div className="flex items-center gap-1.5">
                <Music2 className="w-3.5 h-3.5 text-[#4da3ff]" />

                <span className="text-[9px] font-bold text-[#4da3ff] uppercase tracking-wider">
                  Audio Reference
                </span>
              </div>

              <p className="text-xs font-semibold text-white/65 truncate mt-1">
                {audioUrl
                  ? 'Ministry Practice Recording'
                  : `Key Tone Guide (${effectiveKey})`}
              </p>

            </div>

            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlayingAudio(false)}
                className="hidden"
              />
            )}

            <div className="flex items-center gap-1.5 flex-shrink-0">

              <button
                onClick={handleTogglePlay}
                className="px-3.5 py-2 rounded-xl bg-[#007aff] hover:bg-[#1685ff] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-[0_6px_20px_rgba(0,122,255,0.20)] transition-all"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Play
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  playKeyChord(effectiveKey, 3)
                }
                title="Play key tone"
                className="px-3.5 py-2 rounded-xl bg-white/[0.07] border border-white/10 hover:bg-white/[0.12] text-white/60 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all"
              >
                🎹
                <span className="hidden sm:inline">
                  Key Tone
                </span>
              </button>

              {audioUrl && (
                <button
                  onClick={handleDownloadAudio}
                  title="Download recording"
                  className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/10 hover:bg-white/[0.12] text-white/50 hover:text-white flex items-center justify-center transition-all"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}

            </div>

          </div>

        </div>

        {/* Tabs */}
        <div className="px-5 sm:px-7">

          <div className="flex items-center gap-1.5 bg-white/[0.035] border border-white/[0.08] p-1 rounded-2xl overflow-x-auto">

            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? tab.activeClass
                    : 'text-white/35 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}

          </div>

        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-4">

          {/* Lyrics */}
          {activeTab === 'lyrics' && (

            <div className="space-y-4">

              <div className="flex items-center justify-between gap-3">

                <span className="text-[11px] font-bold text-white/35">
                  {showChords && chords
                    ? 'Chords & Lyrics View'
                    : 'Lyrics View'}
                </span>

                {chords && (
                  <button
                    onClick={() =>
                      setShowChords(!showChords)
                    }
                    className="text-[10px] font-bold text-[#4da3ff] px-3 py-1.5 rounded-xl bg-[#007aff]/10 border border-[#007aff]/15 hover:bg-[#007aff]/15 transition-all"
                  >
                    {showChords
                      ? 'Hide Chord Chart'
                      : 'Show Chord Chart'}
                  </button>
                )}

              </div>

              {showChords && chords && (
                <div className="p-4 rounded-2xl bg-amber-400/[0.07] border border-amber-400/15 font-mono text-xs text-amber-100/80 whitespace-pre-wrap">

                  <div className="text-[9px] font-bold uppercase tracking-wider text-amber-300 mb-2">
                    Chord Chart — Key of {effectiveKey}
                  </div>

                  {chords}

                </div>
              )}

              <div className="p-5 rounded-2xl bg-white/[0.035] border border-white/[0.08] text-sm sm:text-base leading-relaxed text-white/80 whitespace-pre-wrap">

                {lyrics}

              </div>

            </div>
          )}

          {/* Vocal */}
          {activeTab === 'vocal' && (

            <div className="space-y-3">

              <div className="p-4 rounded-2xl bg-[#007aff]/[0.07] border border-[#007aff]/15">

                <h4 className="text-sm font-bold text-[#4da3ff]">
                  👑 Lead Vocalist
                </h4>

                <p className="text-xs sm:text-sm text-white/65 mt-1.5 leading-relaxed">
                  {arrangement.lead ||
                    'Lead vocalist establishes the melody and sets the prayer atmosphere.'}
                </p>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="p-4 rounded-2xl bg-[#7c3aed]/[0.07] border border-[#7c3aed]/15">
                  <h5 className="text-xs font-bold text-[#b18cff]">
                    🎶 Soprano
                  </h5>

                  <p className="text-xs text-white/45 mt-1.5 leading-relaxed">
                    {arrangement.soprano ||
                      'Upper harmony support.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#007aff]/[0.07] border border-[#007aff]/15">
                  <h5 className="text-xs font-bold text-[#4da3ff]">
                    🎶 Alto
                  </h5>

                  <p className="text-xs text-white/45 mt-1.5 leading-relaxed">
                    {arrangement.alto ||
                      'Middle harmonic foundation.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08]">
                  <h5 className="text-xs font-bold text-white/75">
                    🎶 Tenor
                  </h5>

                  <p className="text-xs text-white/45 mt-1.5 leading-relaxed">
                    {arrangement.tenor ||
                      'Lower male harmony and foundation.'}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* Instruments */}
          {activeTab === 'instruments' && (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08]">
                <h4 className="text-xs font-bold text-white/80">
                  🎹 Keyboard & Synth Pads
                </h4>

                <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                  {instruments.keyboard ||
                    'Main harmonic accompaniment.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08]">
                <h4 className="text-xs font-bold text-white/80">
                  🎸 Guitars
                </h4>

                <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                  {instruments.guitar ||
                    'Rhythmic support and melodic fills.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08]">
                <h4 className="text-xs font-bold text-white/80">
                  🎸 Bass Guitar
                </h4>

                <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                  {instruments.bass ||
                    'Root note foundations and groove.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08]">
                <h4 className="text-xs font-bold text-white/80">
                  🥁 Drums & Percussion
                </h4>

                <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                  {instruments.drums ||
                    'Dynamic praise and worship groove.'}
                </p>
              </div>

              {instruments.brass && (
                <div className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08] sm:col-span-2">

                  <h4 className="text-xs font-bold text-white/80">
                    🎷 Brass & Auxiliary
                  </h4>

                  <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                    {instruments.brass}
                  </p>

                </div>
              )}

            </div>
          )}

          {/* MD Notes */}
          {activeTab === 'mdNotes' && (

            <div className="p-5 rounded-2xl bg-amber-400/[0.07] border border-amber-400/15">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/15 flex items-center justify-center">
                  🎼
                </div>

                <div>
                  <h4 className="text-sm font-bold text-amber-200">
                    Music Director Directives
                  </h4>

                  <p className="text-[10px] text-amber-200/40 mt-0.5">
                    Directorial notes for rehearsals and Sunday service
                  </p>
                </div>

              </div>

              <div className="text-sm text-white/70 mt-4 leading-relaxed whitespace-pre-wrap">
                {song.mdNotes ||
                  'No specific MD notes added yet for this song.'}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3 border-t border-white/[0.08] flex justify-between items-center flex-shrink-0">

          <div className="flex items-center gap-1.5 text-[10px] text-white/25">
            <RotateCcw className="w-3 h-3" />
            <span>
              Transpose: {transposeOffset === 0
                ? 'Original'
                : `${transposeOffset > 0 ? '+' : ''}${transposeOffset} semitone${Math.abs(transposeOffset) === 1 ? '' : 's'}`}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/[0.055] border border-white/10 hover:bg-white/[0.10] text-xs font-bold text-white/60 hover:text-white transition-all"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};
