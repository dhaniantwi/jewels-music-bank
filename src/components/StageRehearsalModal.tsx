import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Ministration,
  Song,
  TeamMember,
} from '../types';

import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Gauge,
  Type,
  Volume2,
  Music2,
  CircleStop,
} from 'lucide-react';

import { playPitchTone } from '../utils/audioUtils';

interface StageRehearsalModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministration: Ministration;
  songs: Song[];
  team: TeamMember[];
}

type FontSize = 'normal' | 'large' | 'huge';

type PlaybackSpeed =
  | 0.5
  | 0.75
  | 1
  | 1.25
  | 1.5
  | 2;

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return (
    minutes +
    ':' +
    remainingSeconds.toString().padStart(2, '0')
  );
};

const getAudioUrl = (
  song: Song
): string | undefined => {
  const songWithAudio = song as Song & {
    audioUrl?: string;
    audio_url?: string;
    audio?: string;
    url?: string;
  };

  return (
    songWithAudio.audioUrl ||
    songWithAudio.audio_url ||
    songWithAudio.audio ||
    songWithAudio.url ||
    undefined
  );
};

export const StageRehearsalModal: React.FC<
  StageRehearsalModalProps
> = ({
  isOpen,
  onClose,
  ministration,
  songs,
  team,
}) => {
  const [currentSongIndex, setCurrentSongIndex] =
    useState(0);

  const [fontSize, setFontSize] =
    useState<FontSize>('large');

  const [isAutoScrolling, setIsAutoScrolling] =
    useState(false);

  const [scrollSpeed, setScrollSpeed] =
    useState<number>(1);

  const [showChords, setShowChords] =
    useState(true);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [playbackSpeed, setPlaybackSpeed] =
    useState<PlaybackSpeed>(1);

  const [isRepeat, setIsRepeat] =
    useState(false);

  const [isShuffle, setIsShuffle] =
    useState(false);

  const [isLooping, setIsLooping] =
    useState(false);

  const [loopStart, setLoopStart] =
    useState<number | null>(null);

  const [loopEnd, setLoopEnd] =
    useState<number | null>(null);

  const [showSpeedMenu, setShowSpeedMenu] =
    useState(false);

  const scrollContainerRef =
    useRef<HTMLDivElement>(null);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const currentItem =
    ministration.songs[currentSongIndex];

  const normalizeSongTitle = (
    title: string
  ): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\p{L}\p{N}\s]/gu, '');
  };

  const currentSong = useMemo(() => {
    if (!currentItem) {
      return undefined;
    }

    const directMatch = songs.find(
      song =>
        String(song.id) ===
        String(currentItem.songId)
    );

    if (directMatch) {
      return directMatch;
    }

    const legacySongTitles: Record<string, string> = {
      '1': 'Satisfy',
      '2': 'Ogya Fire',
      '3': 'Afropraise Medley',
      '4': 'Wo Ne Nyame',
      '5': 'You Are Great',
      '6': 'Awesome God',
    };

    const legacyTitle =
      legacySongTitles[
        String(currentItem.songId)
      ];

    if (!legacyTitle) {
      return undefined;
    }

    const normalizedLegacyTitle =
      normalizeSongTitle(legacyTitle);

    const exactTitleMatch = songs.find(
      song =>
        normalizeSongTitle(song.title) ===
        normalizedLegacyTitle
    );

    if (exactTitleMatch) {
      return exactTitleMatch;
    }

    const aliases: Record<string, string[]> = {
      'Afropraise Medley': [
        'Afro Praise Medley',
        'GHANA PRAISE MEDLEY',
      ],
      'Ogya Fire': ['Ogya'],
    };

    const possibleAliases =
      aliases[legacyTitle] || [];

    for (const alias of possibleAliases) {
      const aliasMatch = songs.find(
        song =>
          normalizeSongTitle(song.title) ===
          normalizeSongTitle(alias)
      );

      if (aliasMatch) {
        return aliasMatch;
      }
    }

    return undefined;
  }, [songs, currentItem]);

  const leadMember = team.find(
    member => member.id === currentItem?.lead
  );

  const audioUrl = currentSong
    ? getAudioUrl(currentSong)
    : undefined;

  const effectiveKey =
    currentItem?.keyOverride ||
    currentSong?.key ||
    '';

  const fontClass =
    fontSize === 'normal'
      ? 'text-base sm:text-lg'
      : fontSize === 'large'
        ? 'text-lg sm:text-2xl'
        : 'text-2xl sm:text-3xl';

  const hasAudio = Boolean(audioUrl);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setLoopStart(null);
    setLoopEnd(null);
    setIsLooping(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentSong?.id]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      return;
    }

    audio.src = audioUrl;
    audio.load();
    audio.playbackRate = playbackSpeed;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      const time = audio.currentTime;

      setCurrentTime(time);

      if (
        isLooping &&
        loopStart !== null &&
        loopEnd !== null &&
        time >= loopEnd
      ) {
        audio.currentTime = loopStart;
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);

      if (isRepeat) {
        audio.currentTime = 0;
        void audio.play();
        return;
      }

      goToNextSong();
    };

    audio.addEventListener(
      'loadedmetadata',
      handleLoadedMetadata
    );

    audio.addEventListener(
      'timeupdate',
      handleTimeUpdate
    );

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata
      );

      audio.removeEventListener(
        'timeupdate',
        handleTimeUpdate
      );

      audio.removeEventListener(
        'play',
        handlePlay
      );

      audio.removeEventListener(
        'pause',
        handlePause
      );

      audio.removeEventListener(
        'ended',
        handleEnded
      );
    };
  }, [
    audioUrl,
    isRepeat,
    isLooping,
    loopStart,
    loopEnd,
  ]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate =
        playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (
      !currentSong ||
      typeof navigator === 'undefined' ||
      !('mediaSession' in navigator)
    ) {
      return;
    }

    try {
      navigator.mediaSession.metadata =
        new MediaMetadata({
          title: currentSong.title,
          artist:
            currentSong.artist ||
            'Jewels of His Crown',
          album:
            ministration.name ||
            'Jewels of His Crown',
        });

      navigator.mediaSession.setActionHandler(
        'play',
        () => {
          void audioRef.current?.play();
        }
      );

      navigator.mediaSession.setActionHandler(
        'pause',
        () => {
          audioRef.current?.pause();
        }
      );

      navigator.mediaSession.setActionHandler(
        'previoustrack',
        () => {
          goToPreviousSong();
        }
      );

      navigator.mediaSession.setActionHandler(
        'nexttrack',
        () => {
          goToNextSong();
        }
      );

      navigator.mediaSession.setActionHandler(
        'seekbackward',
        () => {
          skipBackward();
        }
      );

      navigator.mediaSession.setActionHandler(
        'seekforward',
        () => {
          skipForward();
        }
      );
    } catch (error) {
      console.warn(
        'Media Session controls unavailable:',
        error
      );
    }
  }, [
    currentSong?.id,
    ministration.name,
  ]);

  useEffect(() => {
    if (
      typeof navigator === 'undefined' ||
      !('mediaSession' in navigator)
    ) {
      return;
    }

    try {
      navigator.mediaSession.playbackState =
        isPlaying ? 'playing' : 'paused';
    } catch {
      // Browser does not support playbackState.
    }
  }, [isPlaying]);

  useEffect(() => {
    let scrollTimer: number | undefined;

    if (
      isAutoScrolling &&
      scrollContainerRef.current
    ) {
      scrollTimer = window.setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop +=
            scrollSpeed;
        }
      }, 40);
    }

    return () => {
      if (scrollTimer !== undefined) {
        clearInterval(scrollTimer);
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  function goToPreviousSong() {
    setCurrentSongIndex(prev =>
      Math.max(0, prev - 1)
    );
  }

  function goToNextSong() {
    if (ministration.songs.length === 0) {
      return;
    }

    if (
      isShuffle &&
      ministration.songs.length > 1
    ) {
      let nextIndex = currentSongIndex;

      while (nextIndex === currentSongIndex) {
        nextIndex = Math.floor(
          Math.random() *
            ministration.songs.length
        );
      }

      setCurrentSongIndex(nextIndex);
      return;
    }

    if (
      currentSongIndex <
      ministration.songs.length - 1
    ) {
      setCurrentSongIndex(prev => prev + 1);
      return;
    }

    if (isRepeat) {
      setCurrentSongIndex(0);
    }
  }

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio || !hasAudio) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error(
        'Could not control audio playback:',
        error
      );
    }
  };

  const skipBackward = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime - 10
    );
  };

  const skipForward = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = Math.min(
      audioRef.current.duration || Infinity,
      audioRef.current.currentTime + 10
    );
  };

  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTime = Number(event.target.value);

    if (
      !Number.isFinite(newTime) ||
      !audioRef.current
    ) {
      return;
    }

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const setLoopStartPoint = () => {
    if (!audioRef.current) {
      return;
    }

    setLoopStart(
      audioRef.current.currentTime
    );

    setIsLooping(false);
  };

  const setLoopEndPoint = () => {
    if (!audioRef.current) {
      return;
    }

    const end =
      audioRef.current.currentTime;

    if (
      loopStart !== null &&
      end > loopStart
    ) {
      setLoopEnd(end);
      setIsLooping(true);
    }
  };

  const clearLoop = () => {
    setLoopStart(null);
    setLoopEnd(null);
    setIsLooping(false);
  };

  const playKeyTone = () => {
    if (!effectiveKey) {
      return;
    }

    void playPitchTone(
      `${effectiveKey.replace('m', '')}4`,
      2.5
    );
  };

  const progressPercent =
    duration > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (currentTime / duration) * 100
          )
        )
      : 0;

  if (!isOpen || !currentSong) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-50 flex flex-col overflow-hidden
        text-white
        animate-in fade-in duration-200
        bg-[#07080b]
        bg-[radial-gradient(circle_at_12%_8%,rgba(0,122,255,0.18),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.14),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(0,122,255,0.10),transparent_40%)]
      "
    >
      <audio
        ref={audioRef}
        preload="metadata"
      />

      {/* ==================================================
          TOP BAR — GLASS
      ================================================== */}

      <header
        className="
          relative z-30
          mx-2 mt-2
          flex flex-shrink-0 items-center justify-between gap-3
          rounded-[24px]
          border border-white/[0.12]
          bg-white/[0.055]
          p-2.5
          shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]
          backdrop-blur-3xl
          sm:mx-3 sm:mt-3 sm:p-3
        "
      >
        <div className="flex min-w-0 items-center gap-2">

          <div
            className="
              flex items-center gap-1
              rounded-2xl
              border border-white/[0.10]
              bg-black/20
              p-1
              shadow-inner
              backdrop-blur-xl
            "
          >
            <button
              type="button"
              onClick={goToPreviousSong}
              disabled={currentSongIndex === 0}
              className="
                rounded-xl p-2
                text-white/65
                transition-all
                hover:bg-white/10
                hover:text-white
                active:scale-95
                disabled:opacity-25
              "
              title="Previous song"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="px-2 text-xs font-bold text-white/80">
              {currentSongIndex + 1} /{' '}
              {ministration.songs.length}
            </span>

            <button
              type="button"
              onClick={goToNextSong}
              disabled={
                !isRepeat &&
                currentSongIndex ===
                  ministration.songs.length - 1
              }
              className="
                rounded-xl p-2
                text-white/65
                transition-all
                hover:bg-white/10
                hover:text-white
                active:scale-95
                disabled:opacity-25
              "
              title="Next song"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="hidden min-w-0 sm:block">
            <h2 className="truncate text-sm font-bold text-white/90">
              {currentSong.title}
            </h2>

            <p className="truncate text-[10px] text-white/40">
              {ministration.name} •{' '}
              {currentSong.artist}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={playKeyTone}
            title="Play starting key pitch"
            className="
              flex items-center gap-1.5
              rounded-xl
              border border-amber-400/25
              bg-amber-400/[0.10]
              px-3 py-2
              text-xs font-bold text-amber-300
              shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
              backdrop-blur-xl
              transition-all
              hover:border-amber-300/40
              hover:bg-amber-400/[0.17]
              active:scale-95
            "
          >
            <Volume2 className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">
              Key {effectiveKey}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setIsAutoScrolling(
                previous => !previous
              )
            }
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold backdrop-blur-xl transition-all active:scale-95 ${
              isAutoScrolling
                ? 'border-emerald-400/30 bg-emerald-400/[0.14] text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.10)]'
                : 'border-white/[0.10] bg-white/[0.055] text-white/70 hover:bg-white/[0.10] hover:text-white'
            }`}
          >
            {isAutoScrolling ? (
              <Pause className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}

            <span className="hidden sm:inline">
              {isAutoScrolling
                ? 'Pause Scroll'
                : 'Auto Scroll'}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setShowChords(
                previous => !previous
              )
            }
            className={`rounded-xl border px-3 py-2 text-xs font-bold backdrop-blur-xl transition-all active:scale-95 ${
              showChords
                ? 'border-amber-400/25 bg-amber-400/[0.11] text-amber-300'
                : 'border-white/[0.10] bg-white/[0.055] text-white/55 hover:bg-white/[0.10]'
            }`}
          >
            Chords
          </button>

          <div
            className="
              hidden items-center
              rounded-xl
              border border-white/[0.10]
              bg-black/20
              p-0.5
              text-xs font-bold
              backdrop-blur-xl
              sm:flex
            "
          >
            {(['normal', 'large', 'huge'] as FontSize[]).map(
              size => (
                <button
                  type="button"
                  key={size}
                  onClick={() =>
                    setFontSize(size)
                  }
                  className={`rounded-lg px-2 py-1 transition-all ${
                    fontSize === size
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {size === 'normal'
                    ? 'A'
                    : size === 'large'
                      ? 'A+'
                      : 'A++'}
                </button>
              )
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            flex h-10 w-10 flex-shrink-0
            items-center justify-center
            rounded-full
            border border-white/[0.12]
            bg-white/[0.055]
            text-white/80
            shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
            backdrop-blur-xl
            transition-all
            hover:bg-white/[0.12]
            hover:text-white
            active:scale-95
          "
          title="Close Stage Mode"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* ==================================================
          SETLIST — FLOATING GLASS STRIP
      ================================================== */}

      <div
        className="
          relative z-20
          mx-2 mt-2
          flex flex-shrink-0 items-center gap-2
          overflow-x-auto
          rounded-[20px]
          border border-white/[0.08]
          bg-white/[0.025]
          px-3 py-2
          shadow-[0_12px_35px_rgba(0,0,0,0.25)]
          backdrop-blur-3xl
          sm:mx-3
        "
      >
        {ministration.songs.map(
          (item, index) => {
            const song = songs.find(
              current =>
                String(current.id) ===
                String(item.songId)
            );

            if (!song) {
              return null;
            }

            return (
              <button
                type="button"
                key={`${item.songId}-${index}`}
                onClick={() =>
                  setCurrentSongIndex(index)
                }
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-2xl border px-3 py-2 text-xs font-bold backdrop-blur-xl transition-all active:scale-[0.98] ${
                  currentSongIndex === index
                    ? 'border-[#4da3ff]/40 bg-[#007aff]/20 text-white shadow-[0_8px_30px_rgba(0,122,255,0.16),inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'border-white/[0.07] bg-white/[0.035] text-white/50 hover:border-white/[0.14] hover:bg-white/[0.075] hover:text-white'
                }`}
              >
                <span className="opacity-50">
                  {index + 1}.
                </span>

                <span>{song.title}</span>

                <span className="font-mono text-[10px] opacity-60">
                  (
                  {item.keyOverride ||
                    song.key}
                  )
                </span>
              </button>
            );
          }
        )}
      </div>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div
        ref={scrollContainerRef}
        className="
          mx-auto
          w-full max-w-6xl
          flex-1
          space-y-5
          overflow-y-auto
          px-3 py-4
          sm:space-y-6 sm:px-6 sm:py-7
          lg:px-10 lg:py-10
        "
      >

        {/* ==================================================
            NOW PLAYING — HERO GLASS
        ================================================== */}

        <section
          className="
            relative overflow-hidden
            rounded-[30px]
            border border-white/[0.12]
            bg-white/[0.055]
            p-5
            shadow-[0_30px_90px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)]
            backdrop-blur-3xl
            sm:p-7
          "
        >
          {/* Ambient glow inside hero */}
          <div
            className="
              pointer-events-none absolute
              -right-24 -top-24
              h-64 w-64
              rounded-full
              bg-[#007aff]/[0.10]
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none absolute
              -bottom-32 -left-20
              h-72 w-72
              rounded-full
              bg-violet-500/[0.07]
              blur-3xl
            "
          />

          <div className="relative">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

              <div className="min-w-0 flex-1">

                <div className="mb-3 flex flex-wrap items-center gap-2">

                  <span
                    className="
                      rounded-full
                      border border-[#4da3ff]/30
                      bg-[#007aff]/[0.13]
                      px-3 py-1.5
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-[#63adff]
                      shadow-[0_0_25px_rgba(0,122,255,0.08)]
                    "
                  >
                    Now Playing
                  </span>

                  <span
                    className="
                      rounded-full
                      border border-amber-400/25
                      bg-amber-400/[0.10]
                      px-3 py-1.5
                      text-[10px]
                      font-extrabold
                      text-amber-300
                    "
                  >
                    KEY: {effectiveKey}
                  </span>

                  {currentSong.tempo && (
                    <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold text-white/40">
                      {currentSong.tempo}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                  {currentSong.title}
                </h1>

                <p className="mt-1 text-sm font-semibold text-white/40 sm:text-base">
                  {currentSong.artist ||
                    'Jewels of His Crown'}
                </p>
              </div>

              {/* Lead vocalist glass card */}

              <div
                className="
                  flex items-center gap-3
                  rounded-[22px]
                  border border-white/[0.10]
                  bg-black/[0.16]
                  p-3.5
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                  backdrop-blur-2xl
                  lg:min-w-[245px]
                "
              >
                <div
                  className="
                    flex h-12 w-12 flex-shrink-0
                    items-center justify-center
                    rounded-2xl
                    border border-[#4da3ff]/20
                    bg-[#007aff]/[0.12]
                    shadow-[0_8px_25px_rgba(0,122,255,0.10)]
                  "
                >
                  <Music2 className="h-6 w-6 text-[#4da3ff]" />
                </div>

                <div>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#4da3ff]">
                    Lead Vocalist
                  </span>

                  <p className="mt-0.5 text-sm font-bold text-white">
                    {leadMember
                      ? leadMember.name
                      : 'Unassigned'}
                  </p>
                </div>
              </div>
            </div>

            {/* AUDIO PLAYER */}

            <div className="mt-7 border-t border-white/[0.08] pt-6">

              {!hasAudio ? (
                <div
                  className="
                    rounded-2xl
                    border border-amber-400/20
                    bg-amber-400/[0.07]
                    p-4
                    backdrop-blur-xl
                  "
                >
                  <div className="flex items-center gap-2 font-bold text-amber-200">
                    <Music2 className="h-4 w-4" />
                    No audio file attached to this song yet.
                  </div>

                  <p className="mt-1 text-xs text-amber-200/50">
                    The player controls will become
                    active once an audio URL is added
                    to the song.
                  </p>
                </div>
              ) : (
                <>
                  {/* Progress */}

                  <div className="flex items-center gap-3">

                    <span className="w-10 text-right font-mono text-xs text-white/40">
                      {formatTime(currentTime)}
                    </span>

                    <input
                      type="range"
                      min="0"
                      max={
                        duration > 0
                          ? duration
                          : 0
                      }
                      step="0.1"
                      value={Math.min(
                        currentTime,
                        duration || currentTime
                      )}
                      onChange={handleSeek}
                      className="
                        stage-progress
                        flex-1
                        cursor-pointer
                      "
                      aria-label="Song progress"
                      style={{
                        background: `linear-gradient(to right, #1687ff ${progressPercent}%, rgba(255,255,255,0.10) ${progressPercent}%)`,
                      }}
                    />

                    <span className="w-10 font-mono text-xs text-white/40">
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Main controls */}

                  <div className="mt-6 flex items-center justify-center gap-1.5 sm:gap-3">

                    <button
                      type="button"
                      onClick={goToPreviousSong}
                      className="
                        flex h-11 w-11
                        items-center justify-center
                        rounded-full
                        border border-white/[0.06]
                        bg-white/[0.025]
                        text-white/65
                        backdrop-blur-xl
                        transition-all
                        hover:bg-white/[0.08]
                        hover:text-white
                        active:scale-90
                      "
                      title="Previous song"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={skipBackward}
                      className="
                        flex h-11 w-11
                        items-center justify-center
                        rounded-full
                        border border-white/[0.06]
                        bg-white/[0.025]
                        text-white/65
                        backdrop-blur-xl
                        transition-all
                        hover:bg-white/[0.08]
                        hover:text-white
                        active:scale-90
                      "
                      title="Back 10 seconds"
                    >
                      <SkipBack className="h-5 w-5" />
                    </button>

                    {/* HERO PLAY BUTTON */}

                    <button
                      type="button"
                      onClick={togglePlayback}
                      className="
                        relative
                        mx-2
                        flex h-16 w-16
                        items-center justify-center
                        rounded-full
                        border border-[#65b5ff]/40
                        bg-[#087fff]
                        text-white
                        shadow-[0_0_0_6px_rgba(0,122,255,0.07),0_15px_45px_rgba(0,122,255,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]
                        transition-all
                        hover:bg-[#1687ff]
                        hover:shadow-[0_0_0_8px_rgba(0,122,255,0.08),0_20px_55px_rgba(0,122,255,0.42)]
                        active:scale-90
                        sm:h-[68px] sm:w-[68px]
                      "
                      title={
                        isPlaying
                          ? 'Pause'
                          : 'Play'
                      }
                    >
                      {isPlaying ? (
                        <Pause className="h-7 w-7 fill-current" />
                      ) : (
                        <Play className="ml-1 h-7 w-7 fill-current" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={skipForward}
                      className="
                        flex h-11 w-11
                        items-center justify-center
                        rounded-full
                        border border-white/[0.06]
                        bg-white/[0.025]
                        text-white/65
                        backdrop-blur-xl
                        transition-all
                        hover:bg-white/[0.08]
                        hover:text-white
                        active:scale-90
                      "
                      title="Forward 10 seconds"
                    >
                      <SkipForward className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={goToNextSong}
                      className="
                        flex h-11 w-11
                        items-center justify-center
                        rounded-full
                        border border-white/[0.06]
                        bg-white/[0.025]
                        text-white/65
                        backdrop-blur-xl
                        transition-all
                        hover:bg-white/[0.08]
                        hover:text-white
                        active:scale-90
                      "
                      title="Next song"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Secondary controls */}

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setIsShuffle(
                          previous => !previous
                        )
                      }
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold backdrop-blur-xl transition-all active:scale-95 ${
                        isShuffle
                          ? 'border-[#4da3ff]/35 bg-[#007aff]/[0.14] text-[#62b0ff] shadow-[0_0_20px_rgba(0,122,255,0.08)]'
                          : 'border-white/[0.07] bg-white/[0.035] text-white/50 hover:bg-white/[0.075] hover:text-white'
                      }`}
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      Shuffle
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setIsRepeat(
                          previous => !previous
                        )
                      }
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold backdrop-blur-xl transition-all active:scale-95 ${
                        isRepeat
                          ? 'border-[#4da3ff]/35 bg-[#007aff]/[0.14] text-[#62b0ff] shadow-[0_0_20px_rgba(0,122,255,0.08)]'
                          : 'border-white/[0.07] bg-white/[0.035] text-white/50 hover:bg-white/[0.075] hover:text-white'
                      }`}
                    >
                      <Repeat className="h-3.5 w-3.5" />
                      Repeat
                    </button>

                    <div className="relative">

                      <button
                        type="button"
                        onClick={() =>
                          setShowSpeedMenu(
                            previous => !previous
                          )
                        }
                        className="
                          flex items-center gap-1.5
                          rounded-xl
                          border border-white/[0.07]
                          bg-white/[0.035]
                          px-3 py-2
                          text-xs font-bold text-white/50
                          backdrop-blur-xl
                          transition-all
                          hover:bg-white/[0.075]
                          hover:text-white
                        "
                      >
                        <Gauge className="h-3.5 w-3.5" />
                        {playbackSpeed}×
                      </button>

                      {showSpeedMenu && (
                        <div
                          className="
                            absolute bottom-full left-1/2 z-40 mb-2
                            -translate-x-1/2
                            rounded-2xl
                            border border-white/[0.12]
                            bg-[#101114]/80
                            p-2
                            shadow-[0_25px_70px_rgba(0,0,0,0.55)]
                            backdrop-blur-3xl
                          "
                        >
                          {[
                            0.5,
                            0.75,
                            1,
                            1.25,
                            1.5,
                            2,
                          ].map(speed => (
                            <button
                              type="button"
                              key={speed}
                              onClick={() => {
                                setPlaybackSpeed(
                                  speed as PlaybackSpeed
                                );
                                setShowSpeedMenu(
                                  false
                                );
                              }}
                              className={`block w-20 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                                playbackSpeed ===
                                speed
                                  ? 'bg-[#007aff] text-white shadow-[0_6px_20px_rgba(0,122,255,0.25)]'
                                  : 'text-white/65 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {speed}×
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* A-B LOOP */}

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">

                    <button
                      type="button"
                      onClick={
                        setLoopStartPoint
                      }
                      className={`rounded-xl border px-3 py-2 text-xs font-bold backdrop-blur-xl transition-all active:scale-95 ${
                        loopStart !== null
                          ? 'border-amber-400/30 bg-amber-400/[0.12] text-amber-300'
                          : 'border-white/[0.07] bg-white/[0.035] text-white/50 hover:bg-white/[0.075] hover:text-white'
                      }`}
                    >
                      A
                      {loopStart !== null
                        ? ` ${formatTime(loopStart)}`
                        : ''}
                    </button>

                    <button
                      type="button"
                      onClick={
                        setLoopEndPoint
                      }
                      disabled={
                        loopStart === null
                      }
                      className={`rounded-xl border px-3 py-2 text-xs font-bold backdrop-blur-xl transition-all ${
                        loopEnd !== null
                          ? 'border-amber-400/30 bg-amber-400/[0.12] text-amber-300'
                          : 'border-white/[0.07] bg-white/[0.035] text-white/50 hover:bg-white/[0.075] hover:text-white disabled:opacity-25'
                      }`}
                    >
                      B
                      {loopEnd !== null
                        ? ` ${formatTime(loopEnd)}`
                        : ''}
                    </button>

                    {(loopStart !== null ||
                      loopEnd !== null) && (
                      <button
                        type="button"
                        onClick={clearLoop}
                        className="
                          flex items-center gap-1
                          rounded-xl
                          border border-white/[0.07]
                          bg-white/[0.035]
                          px-3 py-2
                          text-xs font-bold text-white/50
                          backdrop-blur-xl
                          transition-all
                          hover:bg-white/[0.075]
                          hover:text-white
                        "
                      >
                        <CircleStop className="h-3.5 w-3.5" />
                        Clear Loop
                      </button>
                    )}

                    {isLooping && (
                      <span
                        className="
                          rounded-xl
                          border border-emerald-400/20
                          bg-emerald-400/[0.08]
                          px-3 py-2
                          text-xs font-bold
                          text-emerald-300
                          backdrop-blur-xl
                        "
                      >
                        A–B Loop Active
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            DIRECTOR NOTES — GLASS AMBER
        ================================================== */}

        {(currentItem?.orderNote ||
          currentSong.mdNotes) && (
          <div
            className="
              rounded-[24px]
              border border-amber-400/20
              bg-amber-400/[0.06]
              p-4
              text-amber-200
              shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
              backdrop-blur-2xl
            "
          >
            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
              🎼 Transition Cue & Director Notes
            </span>

            <p className="text-xs font-medium text-amber-100/80 sm:text-sm">
              {currentItem?.orderNote
                ? `${currentItem.orderNote} • `
                : ''}

              {currentSong.mdNotes}
            </p>
          </div>
        )}

        {/* ==================================================
            CHORDS — GLASS DARK PANEL
        ================================================== */}

        {showChords &&
          currentSong.chords && (
            <div
              className="
                rounded-[24px]
                border border-white/[0.09]
                bg-black/[0.22]
                p-5
                font-mono
                text-xs
                leading-relaxed
                text-amber-300
                whitespace-pre-wrap
                shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
                backdrop-blur-2xl
              "
            >
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-white/30">
                Chords Progression (Key of{' '}
                {effectiveKey})
              </span>

              {currentSong.chords}
            </div>
          )}

        {/* ==================================================
            LYRICS
        ================================================== */}

        <section>

          <div className="mb-3 flex items-center justify-between px-1">

            <div className="flex items-center gap-2 text-white/45">
              <Type className="h-4 w-4" />

              <span className="text-xs font-bold uppercase tracking-wider">
                Lyrics
              </span>
            </div>

            <div
              className="
                flex items-center
                rounded-xl
                border border-white/[0.10]
                bg-white/[0.035]
                p-0.5
                text-xs font-bold
                shadow-inner
                backdrop-blur-xl
                sm:hidden
              "
            >
              {(['normal', 'large', 'huge'] as FontSize[]).map(
                size => (
                  <button
                    type="button"
                    key={size}
                    onClick={() =>
                      setFontSize(size)
                    }
                    className={`rounded-lg px-2 py-1 transition-all ${
                      fontSize === size
                        ? 'bg-white text-black shadow-lg'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {size === 'normal'
                      ? 'A'
                      : size === 'large'
                        ? 'A+'
                        : 'A++'}
                  </button>
                )
              )}
            </div>
          </div>

          <div
            className={`
              relative overflow-hidden
              rounded-[30px]
              border border-white/[0.09]
              bg-white/[0.035]
              p-5
              font-sans
              font-medium
              leading-loose
              text-white/90
              whitespace-pre-wrap
              shadow-[0_25px_70px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.04)]
              backdrop-blur-3xl
              sm:p-8
              ${fontClass}
            `}
          >
            <div
              className="
                pointer-events-none absolute
                -right-24 -top-24
                h-56 w-56
                rounded-full
                bg-[#007aff]/[0.045]
                blur-3xl
              "
            />

            <div className="relative">
              {currentSong.lyrics ||
                'No lyrics text provided for this song.'}
            </div>
          </div>
        </section>

        {/* ==================================================
            TELEPROMPTER — GLASS
        ================================================== */}

        <section
          className="
            rounded-[24px]
            border border-white/[0.09]
            bg-white/[0.035]
            p-4
            shadow-[0_20px_50px_rgba(0,0,0,0.20),inset_0_1px_0_rgba(255,255,255,0.04)]
            backdrop-blur-2xl
          "
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h3 className="text-sm font-bold text-white">
                Teleprompter Scroll
              </h3>

              <p className="mt-1 text-xs text-white/35">
                Automatically move through the lyrics
                during rehearsal.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  setIsAutoScrolling(
                    previous => !previous
                  )
                }
                className={`rounded-xl border px-4 py-2 text-xs font-bold backdrop-blur-xl transition-all active:scale-95 ${
                  isAutoScrolling
                    ? 'border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-300'
                    : 'border-white/[0.09] bg-white/[0.045] text-white/70 hover:bg-white/[0.09] hover:text-white'
                }`}
              >
                {isAutoScrolling
                  ? 'Pause Scroll'
                  : 'Start Scroll'}
              </button>

              <select
                value={scrollSpeed}
                onChange={event =>
                  setScrollSpeed(
                    Number(event.target.value)
                  )
                }
                className="
                  rounded-xl
                  border border-white/[0.09]
                  bg-white/[0.045]
                  px-3 py-2
                  text-xs font-bold text-white
                  outline-none
                  backdrop-blur-xl
                "
              >
                <option
                  value="0.5"
                  className="bg-[#15161a]"
                >
                  Slow
                </option>

                <option
                  value="1"
                  className="bg-[#15161a]"
                >
                  Normal
                </option>

                <option
                  value="2"
                  className="bg-[#15161a]"
                >
                  Fast
                </option>

                <option
                  value="3"
                  className="bg-[#15161a]"
                >
                  Very Fast
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* ==================================================
            BOTTOM NAVIGATION
        ================================================== */}

        <div
          className="
            flex items-center justify-between gap-3
            border-t border-white/[0.08]
            pb-12 pt-5
          "
        >
          <button
            type="button"
            onClick={goToPreviousSong}
            disabled={currentSongIndex === 0}
            className="
              flex items-center gap-2
              rounded-2xl
              border border-white/[0.09]
              bg-white/[0.045]
              px-4 py-3
              text-sm font-bold text-white/70
              shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
              backdrop-blur-xl
              transition-all
              hover:bg-white/[0.09]
              hover:text-white
              active:scale-95
              disabled:opacity-20
              sm:px-6
            "
          >
            <ChevronLeft className="h-4 w-4" />

            <span className="hidden sm:inline">
              Previous Song
            </span>

            <span className="sm:hidden">
              Previous
            </span>
          </button>

          <button
            type="button"
            onClick={goToNextSong}
            disabled={
              !isRepeat &&
              currentSongIndex ===
                ministration.songs.length - 1
            }
            className="
              flex items-center gap-2
              rounded-2xl
              border border-[#4da3ff]/30
              bg-[#007aff]/[0.16]
              px-4 py-3
              text-sm font-bold text-[#70b8ff]
              shadow-[0_12px_35px_rgba(0,122,255,0.16),inset_0_1px_0_rgba(255,255,255,0.07)]
              backdrop-blur-xl
              transition-all
              hover:bg-[#007aff]/[0.23]
              hover:text-white
              active:scale-95
              disabled:opacity-20
              sm:px-6
            "
          >
            <span className="hidden sm:inline">
              Next Song
            </span>

            <span className="sm:hidden">
              Next
            </span>

            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ==================================================
          STAGE RANGE CONTROL
      ================================================== */}

      <style>{`
        .stage-progress {
          height: 5px;
          appearance: none;
          -webkit-appearance: none;
          border-radius: 9999px;
          outline: none;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow:
            0 0 18px rgba(0,122,255,0.06),
            inset 0 1px 2px rgba(0,0,0,0.25);
        }

        .stage-progress::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.72);
          background: #087fff;
          box-shadow:
            0 0 0 4px rgba(0,122,255,0.10),
            0 5px 18px rgba(0,122,255,0.35);
          cursor: pointer;
        }

        .stage-progress::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.72);
          background: #087fff;
          box-shadow:
            0 0 0 4px rgba(0,122,255,0.10),
            0 5px 18px rgba(0,122,255,0.35);
          cursor: pointer;
        }

        .stage-progress::-webkit-slider-runnable-track {
          height: 5px;
          border-radius: 9999px;
        }

        .stage-progress::-moz-range-track {
          height: 5px;
          border-radius: 9999px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};
