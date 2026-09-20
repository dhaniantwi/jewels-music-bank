
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
  RotateCcw,
  RotateCw,
  Music2,
  Clock3,
  Repeat2,
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

  return minutes + ':' + remainingSeconds.toString().padStart(2, '0');
};

const getAudioUrl = (song: Song): string | undefined => {
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

  const currentSong = songs.find(
    song => song.id === currentItem?.songId
  );
console.log('STAGE ID DEBUG:', {
  currentItemSongId: currentItem?.songId,
  currentItemSongIdType: typeof currentItem?.songId,
  availableSongIds: songs.map(song => ({
    id: song.id,
    idType: typeof song.id,
    title: song.title,
  })),
});
  
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
  }, [
    isAutoScrolling,
    scrollSpeed,
  ]);

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

    if (isShuffle && ministration.songs.length > 1) {
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

    audioRef.current.currentTime =
      Math.max(
        0,
        audioRef.current.currentTime - 10
      );
  };

  const skipForward = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime =
      Math.min(
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
    <div className="fixed inset-0 z-50 bg-[#0f0f11] text-white flex flex-col overflow-hidden animate-in fade-in duration-200">

      <audio
        ref={audioRef}
        preload="metadata"
      />

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <header className="p-3 sm:p-4 bg-black/70 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-3 flex-shrink-0">

        <div className="flex items-center gap-2 min-w-0">

          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">

            <button
              type="button"
              onClick={goToPreviousSong}
              disabled={currentSongIndex === 0}
              className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
              title="Previous song"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold px-2">
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
              className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
              title="Next song"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          <div className="min-w-0 hidden sm:block">
            <h2 className="text-sm font-bold truncate text-white/90">
              {currentSong.title}
            </h2>

            <p className="text-[10px] text-white/50 truncate">
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
            className="px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5" />

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
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isAutoScrolling
                ? 'bg-emerald-500 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isAutoScrolling ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
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
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              showChords
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-white/10 text-white/60'
            }`}
          >
            Chords
          </button>

          <div className="hidden sm:flex items-center bg-white/10 p-0.5 rounded-xl text-xs font-bold">

            <button
              type="button"
              onClick={() =>
                setFontSize('normal')
              }
              className={`px-2 py-1 rounded-lg ${
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
              className={`px-2 py-1 rounded-lg ${
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
              className={`px-2 py-1 rounded-lg ${
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
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors flex-shrink-0"
          title="Close Stage Mode"
        >
          <X className="w-5 h-5" />
        </button>

      </header>

      {/* ==================================================
          SETLIST
      ================================================== */}

      <div className="bg-black/50 px-4 py-2 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">

        {ministration.songs.map(
          (item, index) => {
            const song = songs.find(
              current =>
                current.id === item.songId
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
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  currentSongIndex === index
                    ? 'bg-[#007aff] text-white shadow-sm'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="opacity-60">
                  {index + 1}.
                </span>

                <span>{song.title}</span>

                <span className="text-[10px] opacity-75 font-mono">
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
        className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto w-full space-y-6"
      >

        {/* ==================================================
            NOW PLAYING
        ================================================== */}

        <section className="rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-md p-5 sm:p-7">

          <div className="flex flex-col lg:flex-row gap-6 lg:items-center">

            <div className="flex-1 min-w-0">

              <div className="flex items-center gap-2 mb-3 flex-wrap">

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#007aff] bg-[#007aff]/20 px-2.5 py-1 rounded-full">
                  Now Playing
                </span>

                <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full">
                  KEY: {effectiveKey}
                </span>

                <span className="text-[10px] font-bold text-white/50">
                  {currentSong.tempo}
                </span>

              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {currentSong.title}
              </h1>

              <p className="text-sm sm:text-base font-semibold text-white/50 mt-1">
                {currentSong.artist ||
                  'Jewels of His Crown'}
              </p>

            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">

              <div className="w-12 h-12 rounded-2xl bg-[#007aff]/15 flex items-center justify-center">
                <Music2 className="w-6 h-6 text-[#007aff]" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#007aff] block">
                  Lead Vocalist
                </span>

                <p className="text-sm font-bold">
                  {leadMember
                    ? leadMember.name
                    : 'Unassigned'}
                </p>
              </div>

            </div>

          </div>

          {/* AUDIO PLAYER */}

          <div className="mt-6 pt-5 border-t border-white/10">

            {!hasAudio ? (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-200 text-sm">
                <div className="flex items-center gap-2 font-bold">
                  <Music2 className="w-4 h-4" />
                  No audio file attached to this song yet.
                </div>

                <p className="text-xs text-amber-200/60 mt-1">
                  The player controls will become
                  active once an audio URL is added
                  to the song.
                </p>
              </div>
            ) : (
              <>
                {/* Progress */}

                <div className="flex items-center gap-3">

                  <span className="text-xs font-mono text-white/50 w-10 text-right">
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
                    value={
                      Math.min(
                        currentTime,
                        duration || currentTime
                      )
                    }
                    onChange={handleSeek}
                    className="flex-1 accent-[#007aff] cursor-pointer"
                    aria-label="Song progress"
                  />

                  <span className="text-xs font-mono text-white/50 w-10">
                    {formatTime(duration)}
                  </span>

                </div>

                {/* Main controls */}

                <div className="mt-4 flex items-center justify-center gap-2 sm:gap-4">

                  <button
                    type="button"
                    onClick={goToPreviousSong}
                    className="w-11 h-11 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    title="Previous song"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={skipBackward}
                    className="w-11 h-11 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    title="Back 10 seconds"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#007aff] hover:bg-[#0062cc] flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
                    title={
                      isPlaying
                        ? 'Pause'
                        : 'Play'
                    }
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 fill-current ml-1" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={skipForward}
                    className="w-11 h-11 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    title="Forward 10 seconds"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={goToNextSong}
                    className="w-11 h-11 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    title="Next song"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                </div>

                {/* Secondary controls */}

                <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">

                  <button
                    type="button"
                    onClick={() =>
                      setIsShuffle(
                        previous => !previous
                      )
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      isShuffle
                        ? 'bg-[#007aff]/20 text-[#4da3ff] border border-[#007aff]/30'
                        : 'bg-white/5 text-white/60'
                    }`}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    Shuffle
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setIsRepeat(
                        previous => !previous
                      )
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      isRepeat
                        ? 'bg-[#007aff]/20 text-[#4da3ff] border border-[#007aff]/30'
                        : 'bg-white/5 text-white/60'
                    }`}
                  >
                    <Repeat className="w-3.5 h-3.5" />
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
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-white/5 text-white/60 flex items-center gap-1.5"
                    >
                      <Gauge className="w-3.5 h-3.5" />
                      {playbackSpeed}×
                    </button>

                    {showSpeedMenu && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1c1c1f] border border-white/10 rounded-2xl p-2 shadow-2xl z-20">

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
                            className={`block w-20 px-3 py-2 rounded-xl text-xs font-bold ${
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
                    className={`px-3 py-2 rounded-xl text-xs font-bold ${
                      loopStart !== null
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-white/5 text-white/60'
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
                    className={`px-3 py-2 rounded-xl text-xs font-bold ${
                      loopEnd !== null
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-white/5 text-white/60 disabled:opacity-30'
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
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-white/5 text-white/60 hover:bg-white/10 flex items-center gap-1"
                    >
                      <CircleStop className="w-3.5 h-3.5" />
                      Clear Loop
                    </button>
                  )}

                  {isLooping && (
                    <span className="px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-bold">
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
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">

            <span className="text-[10px] font-extrabold uppercase tracking-wider block text-amber-400 mb-1">
              🎼 Transition Cue & Director
              Notes
            </span>

            <p className="text-xs sm:text-sm font-medium">
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
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-amber-300 whitespace-pre-wrap leading-relaxed">

              <span className="text-[10px] font-bold uppercase text-white/40 block mb-1">
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

          <div className="flex items-center justify-between mb-3">

            <div className="flex items-center gap-2 text-white/50">
              <Type className="w-4 h-4" />

              <span className="text-xs font-bold uppercase tracking-wider">
                Lyrics
              </span>
            </div>

            <div className="sm:hidden flex items-center bg-white/10 p-0.5 rounded-xl text-xs font-bold">

              <button
                type="button"
                onClick={() =>
                  setFontSize('normal')
                }
                className={`px-2 py-1 rounded-lg ${
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
                className={`px-2 py-1 rounded-lg ${
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
                className={`px-2 py-1 rounded-lg ${
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
            className={`font-sans font-medium leading-loose whitespace-pre-wrap ${fontClass} text-white/90 p-5 sm:p-7 rounded-3xl bg-white/[0.02] border border-white/[0.04]`}
          >
            {currentSong.lyrics ||
              'No lyrics text provided for this song.'}
          </div>

        </section>

        {/* ==================================================
            AUTO SCROLL CONTROLS
        ================================================== */}

        <section className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>
              <h3 className="text-sm font-bold">
                Teleprompter Scroll
              </h3>

              <p className="text-xs text-white/40 mt-1">
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
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  isAutoScrolling
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white/10 text-white'
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
                className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
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

        <div className="flex items-center justify-between pt-5 pb-12 border-t border-white/10 gap-3">

          <button
            type="button"
            onClick={goToPreviousSong}
            disabled={currentSongIndex === 0}
            className="px-4 sm:px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-20 text-sm font-bold flex items-center gap-2 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />

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
            className="px-4 sm:px-6 py-3 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] disabled:opacity-20 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <span className="hidden sm:inline">
              Next Song
            </span>

            <span className="sm:hidden">
              Next
            </span>

            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};

