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

    // 1. First try the current Supabase ID.
    const directMatch = songs.find(
      song =>
        String(song.id) ===
        String(currentItem.songId)
    );

    if (directMatch) {
      return directMatch;
    }

    // 2. Legacy ministrations used numeric IDs.
    // Match those IDs against the original song
    // catalogue by position/reference.
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

    // 3. Exact normalized title match.
    const exactTitleMatch = songs.find(
      song =>
        normalizeSongTitle(song.title) ===
        normalizedLegacyTitle
    );

    if (exactTitleMatch) {
      return exactTitleMatch;
    }

    // 4. Handle small title differences such as:
    // "Afropraise Medley" vs "Afro Praise Medley"
    // and "Ogya Fire" vs "Ogya".
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

  /*
   * ------------------------------------------------------
   * RESET SONG STATE WHEN CURRENT SONG CHANGES
   * ------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------
   * AUDIO SOURCE
   * ------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------
   * PLAYBACK SPEED
   * ------------------------------------------------------
   */

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate =
        playbackSpeed;
    }
  }, [playbackSpeed]);

  /*
   * ------------------------------------------------------
   * MEDIA SESSION / PHONE LOCK SCREEN
   * ------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------
   * AUTO SCROLL
   * ------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------
   * NAVIGATION
   * ------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------
   * AUDIO CONTROLS
   * ------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------
   * A-B LOOP
   * ------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------
   * KEY TONE
   * ------------------------------------------------------
   */

  const playKeyTone = () => {
    if (!effectiveKey) {
      return;
    }

    void playPitchTone(
      `${effectiveKey.replace('m', '')}4`,
      2.5
    );
  };

  /*
   * ------------------------------------------------------
   * NOW PLAYING PROGRESS
   * ------------------------------------------------------
   */

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
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0f0f11] text-white animate-in fade-in duration-200">

      <audio
        ref={audioRef}
        preload="metadata"
      />

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <header className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#111113]/90 p-3 backdrop-blur-2xl sm:p-4">

        <div className="flex min-w-0 items-center gap-2">

          <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.055] p-1 shadow-lg shadow-black/10">

            <button
              type="button"
              onClick={goToPreviousSong}
              disabled={currentSongIndex === 0}
              className="rounded-xl p-2 transition-colors hover:bg-white/10 disabled:opacity-30"
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
              className="rounded-xl p-2 transition-colors hover:bg-white/10 disabled:opacity-30"
              title="Next song"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

          </div>

          <div className="hidden min-w-0 sm:block">
            <h2 className="truncate text-sm font-bold text-white/90">
              {currentSong.title}
            </h2>

            <p className="truncate text-[10px] text-white/45">
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
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3 py-2 text-xs font-bold text-amber-300 transition-all hover:bg-amber-500/25"
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
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              isAutoScrolling
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10'
                : 'border border-white/10 bg-white/[0.055] text-white hover:bg-white/10'
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
            className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              showChords
                ? 'border border-amber-500/30 bg-amber-500/15 text-amber-300'
                : 'border border-white/10 bg-white/[0.055] text-white/55'
            }`}
          >
            Chords
          </button>

          <div className="hidden items-center rounded-xl border border-white/10 bg-white/[0.055] p-0.5 text-xs font-bold sm:flex">

            <button
              type="button"
              onClick={() =>
                setFontSize('normal')
              }
              className={`rounded-lg px-2 py-1 ${
                fontSize === 'normal'
                  ? 'bg-white text-black'
                  : 'text-white/70'
              }`}
            >
              A
            </button>

            <button
              type="button"
              onClick={() =>
                setFontSize('large')
              }
              className={`rounded-lg px-2 py-1 ${
                fontSize === 'large'
                  ? 'bg-white text-black'
                  : 'text-white/70'
              }`}
            >
              A+
            </button>

            <button
              type="button"
              onClick={() =>
                setFontSize('huge')
              }
              className={`rounded-lg px-2 py-1 ${
                fontSize === 'huge'
                  ? 'bg-white text-black'
                  : 'text-white/70'
              }`}
            >
              A++
            </button>

          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-white transition-colors hover:bg-white/15"
          title="Close Stage Mode"
        >
          <X className="h-5 w-5" />
        </button>

      </header>

      {/* ==================================================
          SETLIST
      ================================================== */}

      <div className="flex flex-shrink-0 items-center gap-2 overflow-x-auto border-b border-white/5 bg-black/35 px-4 py-2">

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
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                  currentSongIndex === index
                    ? 'border-[#007aff]/40 bg-[#007aff] text-white shadow-lg shadow-blue-500/20'
                    : 'border-white/5 bg-white/[0.035] text-white/55 hover:border-white/10 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <span className="opacity-60">
                  {index + 1}.
                </span>

                <span>{song.title}</span>

                <span className="font-mono text-[10px] opacity-75">
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
        className="mx-auto w-full max-w-5xl flex-1 space-y-6 overflow-y-auto p-4 sm:p-8 lg:p-12"
      >

        {/* ==================================================
            NOW PLAYING
        ================================================== */}

        <section className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-7">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

            <div className="min-w-0 flex-1">

              <div className="mb-3 flex flex-wrap items-center gap-2">

                <span className="rounded-full border border-[#007aff]/20 bg-[#007aff]/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#4da3ff]">
                  Now Playing
                </span>

                <span className="rounded-full border border-amber-500/20 bg-amber-500/15 px-2.5 py-1 text-[10px] font-extrabold text-amber-300">
                  KEY: {effectiveKey}
                </span>

                <span className="text-[10px] font-bold text-white/40">
                  {currentSong.tempo}
                </span>

              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                {currentSong.title}
              </h1>

              <p className="mt-1 text-sm font-semibold text-white/45 sm:text-base">
                {currentSong.artist ||
                  'Jewels of His Crown'}
              </p>

            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#007aff]/15">
                <Music2 className="h-6 w-6 text-[#4da3ff]" />
              </div>

              <div>
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#4da3ff]">
                  Lead Vocalist
                </span>

                <p className="text-sm font-bold text-white">
                  {leadMember
                    ? leadMember.name
                    : 'Unassigned'}
                </p>
              </div>

            </div>

          </div>

          {/* AUDIO PLAYER */}

          <div className="mt-6 border-t border-white/10 pt-5">

            {!hasAudio ? (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
                <div className="flex items-center gap-2 font-bold">
                  <Music2 className="h-4 w-4" />
                  No audio file attached to this song yet.
                </div>

                <p className="mt-1 text-xs text-amber-200/55">
                  The player controls will become
                  active once an audio URL is added
                  to the song.
                </p>
              </div>
            ) : (
              <>
                {/* Progress */}

                <div className="flex items-center gap-3">

                  <span className="w-10 text-right font-mono text-xs text-white/45">
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
                    className="flex-1 cursor-pointer accent-[#007aff]"
                    aria-label="Song progress"
                    style={{
                      background: `linear-gradient(to right, #007aff ${progressPercent}%, rgba(255,255,255,0.12) ${progressPercent}%)`,
                    }}
                  />

                  <span className="w-10 font-mono text-xs text-white/45">
                    {formatTime(duration)}
                  </span>

                </div>

                {/* Main controls */}

                <div className="mt-4 flex items-center justify-center gap-2 sm:gap-4">

                  <button
                    type="button"
                    onClick={goToPreviousSong}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                    title="Previous song"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={skipBackward}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                    title="Back 10 seconds"
                  >
                    <SkipBack className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#007aff] shadow-xl shadow-blue-500/20 transition-transform hover:bg-[#0062cc] active:scale-95 sm:h-16 sm:w-16"
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
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                    title="Forward 10 seconds"
                  >
                    <SkipForward className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={goToNextSong}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                    title="Next song"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                </div>

                {/* Secondary controls */}

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setIsShuffle(
                        previous => !previous
                      )
                    }
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold ${
                      isShuffle
                        ? 'border-[#007aff]/30 bg-[#007aff]/15 text-[#4da3ff]'
                        : 'border-white/5 bg-white/[0.035] text-white/55 hover:bg-white/[0.08]'
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
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold ${
                      isRepeat
                        ? 'border-[#007aff]/30 bg-[#007aff]/15 text-[#4da3ff]'
                        : 'border-white/5 bg-white/[0.035] text-white/55 hover:bg-white/[0.08]'
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
                      className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.035] px-3 py-2 text-xs font-bold text-white/55 hover:bg-white/[0.08]"
                    >
                      <Gauge className="h-3.5 w-3.5" />
                      {playbackSpeed}×
                    </button>

                    {showSpeedMenu && (
                      <div className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#1c1c1f]/95 p-2 shadow-2xl backdrop-blur-2xl">

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
                            className={`block w-20 rounded-xl px-3 py-2 text-xs font-bold ${
                              playbackSpeed ===
                              speed
                                ? 'bg-[#007aff] text-white'
                                : 'text-white/70 hover:bg-white/10'
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
                    className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                      loopStart !== null
                        ? 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                        : 'border-white/5 bg-white/[0.035] text-white/55 hover:bg-white/[0.08]'
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
                    className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                      loopEnd !== null
                        ? 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                        : 'border-white/5 bg-white/[0.035] text-white/55 disabled:opacity-30'
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
                      className="flex items-center gap-1 rounded-xl border border-white/5 bg-white/[0.035] px-3 py-2 text-xs font-bold text-white/55 hover:bg-white/[0.08]"
                    >
                      <CircleStop className="h-3.5 w-3.5" />
                      Clear Loop
                    </button>
                  )}

                  {isLooping && (
                    <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300">
                      A–B Loop Active
                    </span>
                  )}

                </div>
              </>
            )}

          </div>

        </section>

        {/* ==================================================
            CUE / NOTES
        ================================================== */}

        {(currentItem?.orderNote ||
          currentSong.mdNotes) && (
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-amber-200">

            <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
              🎼 Transition Cue & Director Notes
            </span>

            <p className="text-xs font-medium sm:text-sm">
              {currentItem?.orderNote
                ? `${currentItem.orderNote} • `
                : ''}

              {currentSong.mdNotes}
            </p>

          </div>
        )}

        {/* ==================================================
            CHORDS
        ================================================== */}

        {showChords &&
          currentSong.chords && (
            <div className="rounded-2xl border border-white/10 bg-black/55 p-4 font-mono text-xs leading-relaxed text-amber-300 whitespace-pre-wrap">

              <span className="mb-1 block text-[10px] font-bold uppercase text-white/35">
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

          <div className="mb-3 flex items-center justify-between">

            <div className="flex items-center gap-2 text-white/45">
              <Type className="h-4 w-4" />

              <span className="text-xs font-bold uppercase tracking-wider">
                Lyrics
              </span>
            </div>

            <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.055] p-0.5 text-xs font-bold sm:hidden">

              <button
                type="button"
                onClick={() =>
                  setFontSize('normal')
                }
                className={`rounded-lg px-2 py-1 ${
                  fontSize === 'normal'
                    ? 'bg-white text-black'
                    : 'text-white/70'
                }`}
              >
                A
              </button>

              <button
                type="button"
                onClick={() =>
                  setFontSize('large')
                }
                className={`rounded-lg px-2 py-1 ${
                  fontSize === 'large'
                    ? 'bg-white text-black'
                    : 'text-white/70'
                }`}
              >
                A+
              </button>

              <button
                type="button"
                onClick={() =>
                  setFontSize('huge')
                }
                className={`rounded-lg px-2 py-1 ${
                  fontSize === 'huge'
                    ? 'bg-white text-black'
                    : 'text-white/70'
                }`}
              >
                A++
              </button>

            </div>

          </div>

          <div
            className={`rounded-[28px] border border-white/[0.05] bg-white/[0.02] p-5 font-sans font-medium leading-loose text-white/90 whitespace-pre-wrap sm:p-7 ${fontClass}`}
          >
            {currentSong.lyrics ||
              'No lyrics text provided for this song.'}
          </div>

        </section>

        {/* ==================================================
            AUTO SCROLL CONTROLS
        ================================================== */}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h3 className="text-sm font-bold">
                Teleprompter Scroll
              </h3>

              <p className="mt-1 text-xs text-white/40">
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
                className={`rounded-xl px-4 py-2 text-xs font-bold ${
                  isAutoScrolling
                    ? 'bg-emerald-500 text-black'
                    : 'border border-white/10 bg-white/[0.055] text-white hover:bg-white/10'
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
                className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-bold text-white outline-none"
              >
                <option
                  value="0.5"
                  className="bg-[#1c1c1f]"
                >
                  Slow
                </option>

                <option
                  value="1"
                  className="bg-[#1c1c1f]"
                >
                  Normal
                </option>

                <option
                  value="2"
                  className="bg-[#1c1c1f]"
                >
                  Fast
                </option>

                <option
                  value="3"
                  className="bg-[#1c1c1f]"
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

        <div className="flex items-center justify-between gap-3 border-t border-white/10 pb-12 pt-5">

          <button
            type="button"
            onClick={goToPreviousSong}
            disabled={currentSongIndex === 0}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-bold transition-all hover:bg-white/10 disabled:opacity-20 sm:px-6"
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
            className="flex items-center gap-2 rounded-2xl bg-[#007aff] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/15 transition-all hover:bg-[#0062cc] disabled:opacity-20 sm:px-6"
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

    </div>
  );
};
