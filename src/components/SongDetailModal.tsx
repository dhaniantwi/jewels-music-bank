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
  StickyNote,
} from 'lucide-react';
import {
  transposeKey,
  playKeyChord,
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
  onDelete,
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
    tenor: '',
  };

  const instruments = song.instruments || {
    keyboard: '',
    guitar: '',
    bass: '',
    drums: '',
    brass: '',
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
          .catch(error => {
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
      shortLabel: 'Lyrics',
      icon: FileMusic,
    },
    {
      id: 'vocal' as const,
      label: 'Vocal',
      shortLabel: 'Vocal',
      icon: Mic2,
    },
    {
      id: 'instruments' as const,
      label: 'Band',
      shortLabel: 'Band',
      icon: Piano,
    },
    {
      id: 'mdNotes' as const,
      label: 'MD Notes',
      shortLabel: 'MD Notes',
      icon: StickyNote,
    },
  ];

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        overflow-hidden
        bg-black/80
        p-2
        backdrop-blur-2xl
        animate-in
        fade-in
        duration-200
        sm:p-4
      "
    >
      <div
        className="
          relative
          flex
          max-h-[95vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-[30px]
          border
          border-white/10
          bg-[#0f0f11]/[0.98]
          text-white
          shadow-2xl
          shadow-black/50
          backdrop-blur-3xl
        "
      >
        {/* TOP AMBIENT GLOW */}
        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-72
            w-72
            rounded-full
            bg-[#007aff]/[0.055]
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-32
            top-1/3
            h-56
            w-56
            rounded-full
            bg-blue-500/[0.025]
            blur-3xl
          "
        />

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div
          className="
            relative
            flex-shrink-0
            border-b
            border-white/10
            bg-[#111113]/90
            px-4
            py-3.5
            backdrop-blur-2xl
            sm:px-5
            sm:py-4
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#007aff]/20
                  bg-[#007aff]/10
                  text-[#4da3ff]
                  shadow-lg
                  shadow-blue-500/5
                  sm:h-14
                  sm:w-14
                "
              >
                {song.icon ? (
                  <span className="text-xl sm:text-2xl">
                    {song.icon}
                  </span>
                ) : (
                  <Music2 className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </div>

              <div className="min-w-0">
                <div
                  className="
                    mb-1.5
                    flex
                    flex-wrap
                    items-center
                    gap-1.5
                  "
                >
                  <span
                    className="
                      rounded-lg
                      border
                      border-[#007aff]/20
                      bg-[#007aff]/10
                      px-2
                      py-1
                      text-[8px]
                      font-extrabold
                      uppercase
                      tracking-[0.16em]
                      text-[#4da3ff]
                    "
                  >
                    {category}
                  </span>

                  {song.timeSignature && (
                    <span
                      className="
                        rounded-lg
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-2
                        py-1
                        text-[8px]
                        font-bold
                        text-white/35
                      "
                    >
                      {song.timeSignature}
                    </span>
                  )}
                </div>

                <h2
                  className="
                    truncate
                    text-xl
                    font-black
                    tracking-tight
                    text-white
                    sm:text-2xl
                  "
                >
                  {song.title}
                </h2>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    font-semibold
                    text-white/35
                    sm:text-sm
                  "
                >
                  {artist}
                </p>
              </div>
            </div>

            <div
              className="
                flex
                shrink-0
                items-center
                gap-1
              "
            >
              {isMD && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEdit(song);
                    }}
                    title="Edit Song"
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.035]
                      text-[#4da3ff]
                      transition-all
                      hover:border-[#007aff]/20
                      hover:bg-[#007aff]/10
                      active:scale-95
                    "
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    title="Delete Song"
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-amber-500/15
                      bg-amber-500/[0.07]
                      text-amber-300/80
                      transition-all
                      hover:border-amber-500/25
                      hover:bg-amber-500/15
                      hover:text-amber-300
                      active:scale-95
                    "
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
                title="Close"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.035]
                  text-white/35
                  transition-all
                  hover:border-white/15
                  hover:bg-white/[0.08]
                  hover:text-white
                  active:scale-95
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            PERFORMANCE CONTROLS
        ===================================================== */}
        <div
          className="
            relative
            flex-shrink-0
            px-3
            pt-3
            sm:px-5
            sm:pt-4
          "
        >
          <div
            className="
              grid
              grid-cols-2
              gap-2
              lg:grid-cols-4
            "
          >
            {/* KEY */}
            <div
              className="
                rounded-2xl
                border
                border-[#007aff]/15
                bg-[#007aff]/[0.055]
                p-3
                sm:p-3.5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-2
                "
              >
                <span
                  className="
                    text-[8px]
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-white/30
                  "
                >
                  Musical Key
                </span>

                <span
                  className="
                    rounded-lg
                    bg-[#007aff]/10
                    px-1.5
                    py-0.5
                    text-[8px]
                    font-bold
                    text-[#4da3ff]
                  "
                >
                  {transposeOffset === 0
                    ? 'ORIGINAL'
                    : `${transposeOffset > 0 ? '+' : ''}${transposeOffset}`}
                </span>
              </div>

              <div
                className="
                  mt-1
                  flex
                  items-center
                  justify-between
                  gap-2
                "
              >
                <span
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-[#4da3ff]
                  "
                >
                  {effectiveKey}
                </span>

                <div
                  className="
                    flex
                    items-center
                    gap-0.5
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setTransposeOffset(prev => prev - 1)
                    }
                    title="Transpose down"
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white/5
                      bg-black/20
                      text-white/40
                      transition-all
                      hover:bg-white/[0.08]
                      hover:text-white
                    "
                  >
                    <Minus className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransposeOffset(0)}
                    title="Reset transpose"
                    className="
                      min-w-[28px]
                      text-[8px]
                      font-extrabold
                      uppercase
                      text-white/25
                      transition-colors
                      hover:text-white
                    "
                  >
                    {transposeOffset !== 0
                      ? 'RST'
                      : 'Orig'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTransposeOffset(prev => prev + 1)
                    }
                    title="Transpose up"
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white/5
                      bg-black/20
                      text-white/40
                      transition-all
                      hover:bg-white/[0.08]
                      hover:text-white
                    "
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* TEMPO */}
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                p-3
                sm:p-3.5
              "
            >
              <span
                className="
                  text-[8px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-white/25
                "
              >
                Tempo
              </span>

              <p
                className="
                  mt-2
                  truncate
                  text-xl
                  font-black
                  tracking-tight
                  text-white
                "
              >
                {tempo}
              </p>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  font-medium
                  text-white/20
                "
              >
                Performance tempo
              </p>
            </div>

            {/* TIME SIGNATURE */}
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                p-3
                sm:p-3.5
              "
            >
              <span
                className="
                  text-[8px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-white/25
                "
              >
                Time Signature
              </span>

              <p
                className="
                  mt-2
                  text-xl
                  font-black
                  tracking-tight
                  text-white
                "
              >
                {song.timeSignature || '—'}
              </p>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  font-medium
                  text-white/20
                "
              >
                Arrangement meter
              </p>
            </div>

            {/* AUDIO */}
            <div
              className="
                col-span-2
                flex
                items-center
                justify-between
                gap-3
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                p-3
                sm:p-3.5
                lg:col-span-1
              "
            >
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlayingAudio(false)}
                  className="hidden"
                />
              )}

              <div className="min-w-0">
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <Music2 className="h-3 w-3 text-[#4da3ff]" />

                  <span
                    className="
                      text-[8px]
                      font-extrabold
                      uppercase
                      tracking-[0.16em]
                      text-[#4da3ff]
                    "
                  >
                    Audio
                  </span>
                </div>

                <p
                  className="
                    mt-1
                    truncate
                    text-[10px]
                    font-semibold
                    text-white/40
                  "
                >
                  {audioUrl
                    ? 'Practice Recording'
                    : `Key Tone · ${effectiveKey}`}
                </p>
              </div>

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                "
              >
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className={`
                    flex
                    h-9
                    items-center
                    gap-1.5
                    rounded-xl
                    px-3
                    text-[10px]
                    font-extrabold
                    transition-all
                    active:scale-95
                    ${
                      isPlayingAudio
                        ? `
                          bg-white/[0.08]
                          text-white
                        `
                        : `
                          bg-[#007aff]
                          text-white
                          shadow-lg
                          shadow-blue-500/15
                          hover:bg-[#006fe6]
                        `
                    }
                  `}
                >
                  {isPlayingAudio ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-current" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    playKeyChord(effectiveKey, 3)
                  }
                  title="Play key tone"
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.035]
                    text-white/35
                    transition-all
                    hover:bg-white/[0.08]
                    hover:text-white
                  "
                >
                  <Piano className="h-3.5 w-3.5" />
                </button>

                {audioUrl && (
                  <button
                    type="button"
                    onClick={handleDownloadAudio}
                    title="Download recording"
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/5
                      bg-white/[0.035]
                      text-white/35
                      transition-all
                      hover:bg-white/[0.08]
                      hover:text-white
                    "
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            TABS
        ===================================================== */}
        <div
          className="
            relative
            flex-shrink-0
            px-3
            pt-3
            sm:px-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-1
              overflow-x-auto
              rounded-2xl
              border
              border-white/10
              bg-white/[0.025]
              p-1
              scrollbar-none
            "
          >
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-1.5
                    whitespace-nowrap
                    rounded-xl
                    px-3
                    py-2.5
                    text-[10px]
                    font-extrabold
                    transition-all
                    ${
                      isActive
                        ? `
                          bg-[#007aff]
                          text-white
                          shadow-lg
                          shadow-blue-500/15
                        `
                        : `
                          text-white/30
                          hover:bg-white/[0.06]
                          hover:text-white/75
                        `
                    }
                  `}
                >
                  <Icon className="h-3.5 w-3.5" />

                  <span className="hidden xs:inline sm:inline">
                    {tab.label}
                  </span>

                  <span className="xs:hidden">
                    {tab.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div
          className="
            relative
            min-h-0
            flex-1
            overflow-y-auto
            px-3
            py-4
            sm:px-5
          "
        >
          {/* ===================================================
              LYRICS
          =================================================== */}
          {activeTab === 'lyrics' && (
            <div className="space-y-4">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <div>
                  <span
                    className="
                      text-[9px]
                      font-extrabold
                      uppercase
                      tracking-[0.16em]
                      text-[#4da3ff]
                    "
                  >
                    Performance Sheet
                  </span>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-medium
                      text-white/30
                    "
                  >
                    {showChords && chords
                      ? `Chords & lyrics · Key of ${effectiveKey}`
                      : 'Lyrics view'}
                  </p>
                </div>

                {chords && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowChords(!showChords)
                    }
                    className="
                      shrink-0
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.035]
                      px-3
                      py-2
                      text-[9px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-[#4da3ff]
                      transition-all
                      hover:border-[#007aff]/20
                      hover:bg-[#007aff]/10
                    "
                  >
                    {showChords
                      ? 'Hide Chords'
                      : 'Show Chords'}
                  </button>
                )}
              </div>

              {showChords && chords && (
                <div
                  className="
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-amber-500/15
                    bg-amber-500/[0.055]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-amber-500/10
                      px-4
                      py-3
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-lg
                          bg-amber-500/10
                        "
                      >
                        <Music2 className="h-3.5 w-3.5 text-amber-300" />
                      </div>

                      <span
                        className="
                          text-[9px]
                          font-extrabold
                          uppercase
                          tracking-[0.15em]
                          text-amber-300
                        "
                      >
                        Chord Chart
                      </span>
                    </div>

                    <span
                      className="
                        text-[9px]
                        font-bold
                        text-amber-200/35
                      "
                    >
                      Key of {effectiveKey}
                    </span>
                  </div>

                  <div
                    className="
                      whitespace-pre-wrap
                      overflow-x-auto
                      p-4
                      font-mono
                      text-xs
                      leading-6
                      text-amber-100/70
                    "
                  >
                    {chords}
                  </div>
                </div>
              )}

              <div
                className="
                  rounded-[26px]
                  border
                  border-white/10
                  bg-white/[0.025]
                  p-5
                  shadow-inner
                  shadow-white/[0.01]
                  sm:p-6
                "
              >
                <div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-2
                  "
                >
                  <div
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-[#007aff]
                      shadow-[0_0_9px_rgba(0,122,255,0.8)]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-extrabold
                      uppercase
                      tracking-[0.16em]
                      text-white/25
                    "
                  >
                    Lyrics
                  </span>
                </div>

                <div
                  className="
                    whitespace-pre-wrap
                    text-sm
                    leading-7
                    text-white/75
                    sm:text-base
                    sm:leading-8
                  "
                >
                  {lyrics}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              VOCAL
          =================================================== */}
          {activeTab === 'vocal' && (
            <div className="space-y-3">
              <div
                className="
                  rounded-[24px]
                  border
                  border-[#007aff]/15
                  bg-[#007aff]/[0.055]
                  p-4
                  sm:p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[#007aff]/20
                      bg-[#007aff]/10
                    "
                  >
                    <Crown className="h-4 w-4 text-[#4da3ff]" />
                  </div>

                  <div>
                    <span
                      className="
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-[0.16em]
                        text-[#4da3ff]
                      "
                    >
                      Lead Vocal
                    </span>

                    <h4
                      className="
                        mt-0.5
                        text-sm
                        font-extrabold
                        text-white
                      "
                    >
                      Lead Vocalist
                    </h4>
                  </div>
                </div>

                <p
                  className="
                    mt-4
                    text-xs
                    leading-6
                    text-white/60
                    sm:text-sm
                  "
                >
                  {arrangement.lead ||
                    'Lead vocalist establishes the melody and sets the prayer atmosphere.'}
                </p>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-3
                "
              >
                {[
                  {
                    label: 'Soprano',
                    value: arrangement.soprano,
                    description: 'Upper harmony support.',
                    accent: false,
                  },
                  {
                    label: 'Alto',
                    value: arrangement.alto,
                    description: 'Middle harmonic foundation.',
                    accent: true,
                  },
                  {
                    label: 'Tenor',
                    value: arrangement.tenor,
                    description: 'Lower male harmony and foundation.',
                    accent: false,
                  },
                ].map(vocal => (
                  <div
                    key={vocal.label}
                    className="
                      rounded-[22px]
                      border
                      border-white/10
                      bg-white/[0.025]
                      p-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <Mic2
                        className={`h-4 w-4 ${
                          vocal.accent
                            ? 'text-[#4da3ff]'
                            : 'text-white/40'
                        }`}
                      />

                      <h5
                        className="
                          text-xs
                          font-extrabold
                          text-white/75
                        "
                      >
                        {vocal.label}
                      </h5>
                    </div>

                    <p
                      className="
                        mt-3
                        text-xs
                        leading-6
                        text-white/40
                      "
                    >
                      {vocal.value ||
                        vocal.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================
              INSTRUMENTS
          =================================================== */}
          {activeTab === 'instruments' && (
            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >
              {[
                {
                  label: 'Keyboard & Synth Pads',
                  value: instruments.keyboard,
                  fallback: 'Main harmonic accompaniment.',
                  icon: Piano,
                  accent: true,
                },
                {
                  label: 'Guitars',
                  value: instruments.guitar,
                  fallback: 'Rhythmic support and melodic fills.',
                  icon: Guitar,
                  accent: false,
                },
                {
                  label: 'Bass Guitar',
                  value: instruments.bass,
                  fallback: 'Root note foundations and groove.',
                  icon: Guitar,
                  accent: true,
                },
                {
                  label: 'Drums & Percussion',
                  value: instruments.drums,
                  fallback: 'Dynamic praise and worship groove.',
                  icon: Drum,
                  accent: false,
                },
              ].map(instrument => {
                const Icon = instrument.icon;

                return (
                  <div
                    key={instrument.label}
                    className="
                      rounded-[22px]
                      border
                      border-white/10
                      bg-white/[0.025]
                      p-4
                      transition-colors
                      hover:bg-white/[0.04]
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2.5
                      "
                    >
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-xl
                          bg-white/[0.035]
                        "
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            instrument.accent
                              ? 'text-[#4da3ff]'
                              : 'text-white/40'
                          }`}
                        />
                      </div>

                      <h4
                        className="
                          text-xs
                          font-extrabold
                          text-white/75
                        "
                      >
                        {instrument.label}
                      </h4>
                    </div>

                    <p
                      className="
                        mt-3
                        text-xs
                        leading-6
                        text-white/40
                      "
                    >
                      {instrument.value ||
                        instrument.fallback}
                    </p>
                  </div>
                );
              })}

              {instruments.brass && (
                <div
                  className="
                    rounded-[22px]
                    border
                    border-amber-500/15
                    bg-amber-500/[0.045]
                    p-4
                    sm:col-span-2
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-xl
                        bg-amber-500/10
                      "
                    >
                      <Music2 className="h-4 w-4 text-amber-300" />
                    </div>

                    <h4
                      className="
                        text-xs
                        font-extrabold
                        text-white/75
                      "
                    >
                      Brass & Auxiliary
                    </h4>
                  </div>

                  <p
                    className="
                      mt-3
                      text-xs
                      leading-6
                      text-white/40
                    "
                  >
                    {instruments.brass}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===================================================
              MD NOTES
          =================================================== */}
          {activeTab === 'mdNotes' && (
            <div
              className="
                overflow-hidden
                rounded-[26px]
                border
                border-amber-500/15
                bg-amber-500/[0.045]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-amber-500/10
                  p-4
                  sm:p-5
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-amber-500/15
                    bg-amber-500/10
                  "
                >
                  <StickyNote className="h-4 w-4 text-amber-300" />
                </div>

                <div>
                  <span
                    className="
                      text-[9px]
                      font-extrabold
                      uppercase
                      tracking-[0.16em]
                      text-amber-300/60
                    "
                  >
                    Music Director
                  </span>

                  <h4
                    className="
                      mt-0.5
                      text-sm
                      font-extrabold
                      text-amber-100
                    "
                  >
                    Performance Directives
                  </h4>
                </div>
              </div>

              <div
                className="
                  whitespace-pre-wrap
                  p-5
                  text-sm
                  leading-7
                  text-white/65
                  sm:p-6
                "
              >
                {song.mdNotes ||
                  'No specific MD notes added yet for this song.'}
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}
        <div
          className="
            relative
            flex
            flex-shrink-0
            items-center
            justify-between
            gap-3
            border-t
            border-white/10
            bg-[#111113]/90
            px-3
            py-3
            backdrop-blur-2xl
            sm:px-5
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
              text-[9px]
              font-bold
              text-white/25
            "
          >
            <RotateCcw className="h-3 w-3 shrink-0" />

            <span className="truncate">
              {transposeOffset === 0
                ? 'Original key'
                : `Transposed ${transposeOffset > 0 ? '+' : ''}${transposeOffset} semitone${
                    Math.abs(transposeOffset) === 1
                      ? ''
                      : 's'
                  }`}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              shrink-0
              rounded-xl
              border
              border-white/10
              bg-white/[0.035]
              px-5
              py-2.5
              text-[10px]
              font-extrabold
              uppercase
              tracking-wider
              text-white/45
              transition-all
              hover:border-white/15
              hover:bg-white/[0.08]
              hover:text-white
              active:scale-[0.98]
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
