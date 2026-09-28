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
  Mic2,
  Piano,
  Guitar,
  Drum,
  FileMusic,
  Minus,
  Plus,
  RotateCcw,
  Crown,
  StickyNote
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

  useEffect(() => {
    if (!isOpen) {
      setTransposeOffset(0);
      setShowChords(true);
      setActiveTab('lyrics');
      setIsPlayingAudio(false);
    }
  }, [isOpen]);

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
            console.error('Could not play audio:', error);
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
      icon: FileMusic
    },
    {
      id: 'vocal' as const,
      label: 'Vocal',
      icon: Mic2
    },
    {
      id: 'instruments' as const,
      label: 'Band',
      icon: Piano
    },
    {
      id: 'mdNotes' as const,
      label: 'MD Notes',
      icon: StickyNote
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/75 p-3 backdrop-blur-2xl animate-in fade-in duration-200 sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#111113]/95 text-white shadow-2xl shadow-black/20 backdrop-blur-2xl">

        {/* Header */}
        <div className="flex-shrink-0 border-b border-white/10 bg-[#111113]/90 p-3 backdrop-blur-2xl sm:p-4">
          <div className="flex items-start justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-[#007aff]/20 bg-[#007aff]/15 text-[#4da3ff]">
                <Music2 className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#007aff]/20 bg-[#007aff]/15 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#4da3ff]">
                    {category}
                  </span>

                  {song.timeSignature && (
                    <span className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[9px] font-bold text-white/45">
                      {song.timeSignature}
                    </span>
                  )}
                </div>

                <h2 className="truncate text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {song.title}
                </h2>

                <p className="mt-0.5 truncate text-sm font-semibold text-white/40">
                  {artist}
                </p>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1.5">
              {isMD && (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(song);
                    }}
                    title="Edit Song"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] text-[#4da3ff] transition-all hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleDelete}
                    title="Delete Song"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300 transition-all hover:bg-amber-500/15"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                title="Close"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] text-white/45 transition-all hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Song Information */}
        <div className="grid flex-shrink-0 grid-cols-2 gap-2.5 p-4 sm:grid-cols-4 sm:px-5">

          {/* Key */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/35">
              Musical Key
            </span>

            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-xl font-extrabold text-[#4da3ff]">
                {effectiveKey}
              </span>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={() =>
                    setTransposeOffset(prev => prev - 1)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-white/[0.035] text-white/55 transition-all hover:bg-white/10"
                  title="Transpose down"
                >
                  <Minus className="h-3 w-3" />
                </button>

                <button
                  onClick={() => setTransposeOffset(0)}
                  className="min-w-[30px] text-[9px] font-bold text-white/35 transition-all hover:text-white"
                  title="Reset transpose"
                >
                  {transposeOffset !== 0
                    ? `${transposeOffset > 0 ? '+' : ''}${transposeOffset}`
                    : 'Orig'}
                </button>

                <button
                  onClick={() =>
                    setTransposeOffset(prev => prev + 1)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-white/[0.035] text-white/55 transition-all hover:bg-white/10"
                  title="Transpose up"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Tempo */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/35">
              Tempo
            </span>

            <p className="mt-1 truncate text-lg font-bold text-white">
              {tempo}
            </p>
          </div>

          {/* Audio */}
          <div className="col-span-2 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Music2 className="h-3.5 w-3.5 text-[#4da3ff]" />

                <span className="text-[9px] font-bold uppercase tracking-wider text-[#4da3ff]">
                  Audio Reference
                </span>
              </div>

              <p className="mt-1 truncate text-xs font-semibold text-white/55">
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

            <div className="flex flex-shrink-0 items-center gap-1.5">
              <button
                onClick={handleTogglePlay}
                className="flex items-center gap-1.5 rounded-xl bg-[#007aff] px-3.5 py-2 text-[11px] font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-[#0062cc] active:scale-95"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    Play
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  playKeyChord(effectiveKey, 3)
                }
                title="Play key tone"
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2 text-[11px] font-bold text-white/55 transition-all hover:bg-white/10 hover:text-white"
              >
                <Piano className="h-3.5 w-3.5" />

                <span className="hidden sm:inline">
                  Key Tone
                </span>
              </button>

              {audioUrl && (
                <button
                  onClick={handleDownloadAudio}
                  title="Download recording"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/45 transition-all hover:bg-white/10 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 px-4 sm:px-5">
          <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.035] p-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-[11px] font-bold transition-all ${
                    isActive
                      ? 'bg-[#007aff] text-white shadow-lg shadow-blue-500/20'
                      : 'text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">

          {/* Lyrics */}
          {activeTab === 'lyrics' && (
            <div className="space-y-4">

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-white/40">
                  {showChords && chords
                    ? 'Chords & Lyrics View'
                    : 'Lyrics View'}
                </span>

                {chords && (
                  <button
                    onClick={() =>
                      setShowChords(!showChords)
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold text-[#4da3ff] transition-all hover:bg-white/10"
                  >
                    {showChords
                      ? 'Hide Chord Chart'
                      : 'Show Chord Chart'}
                  </button>
                )}
              </div>

              {showChords && chords && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 font-mono text-xs text-amber-200/80">
                  <div className="mb-2 flex items-center gap-2">
                    <Music2 className="h-3.5 w-3.5 text-amber-300" />

                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                      Chord Chart — Key of {effectiveKey}
                    </span>
                  </div>

                  <div className="whitespace-pre-wrap">
                    {chords}
                  </div>
                </div>
              )}

              <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 text-sm leading-relaxed text-white/80 sm:text-base">
                <div className="whitespace-pre-wrap">
                  {lyrics}
                </div>
              </div>

            </div>
          )}

          {/* Vocal */}
          {activeTab === 'vocal' && (
            <div className="space-y-3">

              <div className="rounded-2xl border border-[#007aff]/20 bg-[#007aff]/10 p-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-[#4da3ff]" />

                  <h4 className="text-sm font-bold text-[#4da3ff]">
                    Lead Vocalist
                  </h4>
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-white/65 sm:text-sm">
                  {arrangement.lead ||
                    'Lead vocalist establishes the melody and sets the prayer atmosphere.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex items-center gap-2">
                    <Mic2 className="h-4 w-4 text-white/70" />

                    <h5 className="text-xs font-bold text-white/80">
                      Soprano
                    </h5>
                  </div>

                  <p className="mt-1.5 text-xs leading-relaxed text-white/45">
                    {arrangement.soprano ||
                      'Upper harmony support.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex items-center gap-2">
                    <Mic2 className="h-4 w-4 text-[#4da3ff]" />

                    <h5 className="text-xs font-bold text-[#4da3ff]">
                      Alto
                    </h5>
                  </div>

                  <p className="mt-1.5 text-xs leading-relaxed text-white/45">
                    {arrangement.alto ||
                      'Middle harmonic foundation.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex items-center gap-2">
                    <Mic2 className="h-4 w-4 text-white/55" />

                    <h5 className="text-xs font-bold text-white/75">
                      Tenor
                    </h5>
                  </div>

                  <p className="mt-1.5 text-xs leading-relaxed text-white/45">
                    {arrangement.tenor ||
                      'Lower male harmony and foundation.'}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Instruments */}
          {activeTab === 'instruments' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-center gap-2">
                  <Piano className="h-4 w-4 text-[#4da3ff]" />

                  <h4 className="text-xs font-bold text-white/80">
                    Keyboard & Synth Pads
                  </h4>
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                  {instruments.keyboard ||
                    'Main harmonic accompaniment.'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-center gap-2">
                  <Guitar className="h-4 w-4 text-white/70" />

                  <h4 className="text-xs font-bold text-white/80">
                    Guitars
                  </h4>
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                  {instruments.guitar ||
                    'Rhythmic support and melodic fills.'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-center gap-2">
                  <Guitar className="h-4 w-4 text-[#4da3ff]" />

                  <h4 className="text-xs font-bold text-white/80">
                    Bass Guitar
                  </h4>
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                  {instruments.bass ||
                    'Root note foundations and groove.'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-center gap-2">
                  <Drum className="h-4 w-4 text-white/70" />

                  <h4 className="text-xs font-bold text-white/80">
                    Drums & Percussion
                  </h4>
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                  {instruments.drums ||
                    'Dynamic praise and worship groove.'}
                </p>
              </div>

              {instruments.brass && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <Music2 className="h-4 w-4 text-amber-300" />

                    <h4 className="text-xs font-bold text-white/80">
                      Brass & Auxiliary
                    </h4>
                  </div>

                  <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                    {instruments.brass}
                  </p>
                </div>
              )}

            </div>
          )}

          {/* MD Notes */}
          {activeTab === 'mdNotes' && (
            <div className="rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-5">

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/15">
                  <StickyNote className="h-4 w-4 text-amber-300" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-amber-200">
                    Music Director Directives
                  </h4>

                  <p className="mt-0.5 text-[10px] text-amber-200/40">
                    Directorial notes for rehearsals and Sunday service
                  </p>
                </div>
              </div>

              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
                {song.mdNotes ||
                  'No specific MD notes added yet for this song.'}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#111113]/90 px-4 py-3 backdrop-blur-2xl sm:px-5">

          <div className="flex items-center gap-1.5 text-[10px] text-white/35">
            <RotateCcw className="h-3 w-3" />

            <span>
              Transpose:{' '}
              {transposeOffset === 0
                ? 'Original'
                : `${transposeOffset > 0 ? '+' : ''}${transposeOffset} semitone${Math.abs(transposeOffset) === 1 ? '' : 's'}`}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.035] px-5 py-2.5 text-xs font-bold text-white/55 transition-all hover:bg-white/10 hover:text-white"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};
