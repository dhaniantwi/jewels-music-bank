import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  ListMusic,
  Gauge,
} from 'lucide-react';
import { Song } from '../types';

interface SongAudioPlayerProps {
  songs: Song[];
  initialSongIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

type RepeatMode = 'off' | 'one' | 'all';

const SPEED_OPTIONS = [
  0.5,
  0.75,
  1,
  1.25,
  1.5,
  2,
];

const SongAudioPlayer: React.FC<SongAudioPlayerProps> = ({
  songs,
  initialSongIndex,
  isOpen,
  onClose,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const validSongs = useMemo(
    () => songs.filter(song => Boolean(song.audioUrl)),
    [songs]
  );

  const safeInitialIndex =
    initialSongIndex >= 0 &&
    initialSongIndex < validSongs.length
      ? initialSongIndex
      : 0;

  const [currentIndex, setCurrentIndex] =
    useState(safeInitialIndex);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(1);

  const [speed, setSpeed] =
    useState(1);

  const [isMuted, setIsMuted] =
    useState(false);

  const [shuffle, setShuffle] =
    useState(false);

  const [repeatMode, setRepeatMode] =
    useState<RepeatMode>('off');

  const currentSong =
    validSongs[currentIndex];

  /*
   * Keep the index valid if the filtered
   * playlist changes.
   */
  useEffect(() => {
    if (!validSongs.length) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex(previous => {
      if (
        previous >= 0 &&
        previous < validSongs.length
      ) {
        return previous;
      }

      return 0;
    });
  }, [validSongs.length]);

  /*
   * When the player opens, start from
   * the selected song.
   */
  useEffect(() => {
    if (!isOpen || !validSongs.length) {
      return;
    }

    const nextIndex =
      initialSongIndex >= 0 &&
      initialSongIndex < validSongs.length
        ? initialSongIndex
        : 0;

    setCurrentIndex(nextIndex);
    setCurrentTime(0);
    setDuration(0);
  }, [
    isOpen,
    initialSongIndex,
    validSongs.length,
  ]);

  /*
   * Volume.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  /*
   * Playback speed.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.playbackRate = speed;
  }, [speed, currentIndex]);

  /*
   * Load and automatically play the
   * currently selected song.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (
      !audio ||
      !currentSong?.audioUrl ||
      !isOpen
    ) {
      return;
    }

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    audio.pause();
    audio.currentTime = 0;
    audio.src = currentSong.audioUrl;
    audio.load();

    const startPlayback = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    const handleCanPlay = () => {
      void startPlayback();
    };

    audio.addEventListener(
      'canplay',
      handleCanPlay,
      { once: true }
    );

    return () => {
      audio.removeEventListener(
        'canplay',
        handleCanPlay
      );
    };
  }, [
    currentIndex,
    currentSong?.audioUrl,
    isOpen,
  ]);

  /*
   * Cleanup.
   */
  useEffect(() => {
    return () => {
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  const handlePlayPause = async () => {
    const audio = audioRef.current;

    if (!audio || !currentSong?.audioUrl) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    setCurrentTime(0);

    if (audio.paused) {
      void audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handlePrevious = () => {
    if (!validSongs.length) {
      return;
    }

    const audio = audioRef.current;

    /*
     * If the song has already played for
     * more than 3 seconds, restart it.
     */
    if (
      audio &&
      audio.currentTime > 3
    ) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    setCurrentIndex(previous => {
      if (shuffle && validSongs.length > 1) {
        let nextIndex = previous;

        while (nextIndex === previous) {
          nextIndex = Math.floor(
            Math.random() * validSongs.length
          );
        }

        return nextIndex;
      }

      if (previous > 0) {
        return previous - 1;
      }

      return repeatMode === 'all'
        ? validSongs.length - 1
        : 0;
    });
  };

  const handleNext = () => {
    if (!validSongs.length) {
      return;
    }

    setCurrentIndex(previous => {
      if (
        shuffle &&
        validSongs.length > 1
      ) {
        let nextIndex = previous;

        while (nextIndex === previous) {
          nextIndex = Math.floor(
            Math.random() * validSongs.length
          );
        }

        return nextIndex;
      }

      if (
        previous <
        validSongs.length - 1
      ) {
        return previous + 1;
      }

      return repeatMode === 'all'
        ? 0
        : previous;
    });
  };

  const handleEnded = () => {
    setIsPlaying(false);

    if (repeatMode === 'one') {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      audio.currentTime = 0;
      setCurrentTime(0);

      void audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});

      return;
    }

    if (
      currentIndex <
      validSongs.length - 1
    ) {
      handleNext();
      return;
    }

    if (repeatMode === 'all') {
      handleNext();
      return;
    }

    setCurrentTime(duration);
  };

  const handleSeek = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolumeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);

    setVolume(value);

    if (value > 0) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(previous => !previous);
  };

  const handleSpeedChange = (
    newSpeed: number
  ) => {
    setSpeed(newSpeed);

    const audio = audioRef.current;

    if (audio) {
      audio.playbackRate = newSpeed;
    }
  };

  const handleRepeat = () => {
    setRepeatMode(previous => {
      if (previous === 'off') {
        return 'one';
      }

      if (previous === 'one') {
        return 'all';
      }

      return 'off';
    });
  };

  const handleShuffle = () => {
    setShuffle(previous => !previous);
  };

  const handleClose = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }

    onClose();
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) {
      return '0:00';
    }

    const minutes = Math.floor(
      time / 60
    );

    const seconds = Math.floor(
      time % 60
    );

    return `${minutes}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  if (
    !isOpen ||
    !currentSong ||
    !validSongs.length
  ) {
    return null;
  }

  const progressPercent =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  const repeatLabel =
    repeatMode === 'off'
      ? 'Repeat Off'
      : repeatMode === 'one'
        ? 'Repeat Song'
        : 'Repeat All';

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-[#007aff]/20
        bg-[#050609]
        shadow-2xl
        shadow-black/40
      "
    >
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={e => {
          const nextDuration =
            e.currentTarget.duration;

          setDuration(
            Number.isFinite(nextDuration)
              ? nextDuration
              : 0
          );
        }}
        onTimeUpdate={e => {
          setCurrentTime(
            e.currentTarget.currentTime
          );
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onEnded={handleEnded}
        onError={() => {
          setIsPlaying(false);
        }}
      />

      {/* PLAYER HEADER */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/[0.08]">
            <ListMusic className="h-4 w-4 text-[#4da3ff]" />
          </div>

          <div className="min-w-0">
            <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff]">
              Now Playing
            </p>

            <p className="truncate text-xs font-bold text-white sm:text-sm">
              {currentSong.title || 'Untitled Song'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5 text-[9px] font-bold text-white/25 sm:block">
            {currentIndex + 1} / {validSongs.length}
          </span>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close player"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              border
              border-white/[0.06]
              bg-white/[0.025]
              text-white/30
              transition-all
              hover:border-white/[0.12]
              hover:bg-white/[0.07]
              hover:text-white
            "
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="px-4 pt-4 sm:px-5">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(
            currentTime,
            duration || 0
          )}
          onChange={handleSeek}
          className="
            h-1.5
            w-full
            cursor-pointer
            appearance-none
            rounded-full
            bg-white/[0.08]
            accent-[#007aff]
          "
          style={{
            background: `linear-gradient(
              to right,
              #007aff ${progressPercent}%,
              rgba(255,255,255,0.08) ${progressPercent}%
            )`,
          }}
          aria-label="Song progress"
        />

        <div className="mt-1.5 flex items-center justify-between text-[9px] font-bold text-white/20">
          <span>
            {formatTime(currentTime)}
          </span>

          <span>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* MAIN CONTROLS */}
      <div className="flex items-center justify-center gap-2 px-4 py-4 sm:gap-3 sm:px-5">

        {/* SHUFFLE */}
        <button
          type="button"
          onClick={handleShuffle}
          title={
            shuffle
              ? 'Shuffle On'
              : 'Shuffle Off'
          }
          className={`
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            transition-all
            ${
              shuffle
                ? 'border-[#007aff]/30 bg-[#007aff]/10 text-[#4da3ff]'
                : 'border-white/[0.06] bg-white/[0.025] text-white/25 hover:text-white'
            }
          `}
        >
          <Shuffle className="h-3.5 w-3.5" />
        </button>

        {/* PREVIOUS */}
        <button
          type="button"
          onClick={handlePrevious}
          title="Previous Song"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.025]
            text-white/45
            transition-all
            hover:border-white/[0.12]
            hover:bg-white/[0.07]
            hover:text-white
          "
        >
          <SkipBack className="h-4 w-4 fill-current" />
        </button>

        {/* RESTART */}
        <button
          type="button"
          onClick={handleRestart}
          title="Restart Song"
          className="
            hidden
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.025]
            text-white/25
            transition-all
            hover:border-white/[0.12]
            hover:bg-white/[0.07]
            hover:text-white
            sm:flex
          "
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* PLAY / PAUSE */}
        <button
          type="button"
          onClick={handlePlayPause}
          title={
            isPlaying
              ? 'Pause'
              : 'Play'
          }
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-[#007aff]
            text-white
            shadow-xl
            shadow-blue-500/20
            transition-all
            hover:bg-[#087ff5]
            hover:shadow-blue-500/30
            active:scale-95
          "
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          )}
        </button>

        {/* NEXT */}
        <button
          type="button"
          onClick={handleNext}
          title="Next Song"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.025]
            text-white/45
            transition-all
            hover:border-white/[0.12]
            hover:bg-white/[0.07]
            hover:text-white
          "
        >
          <SkipForward className="h-4 w-4 fill-current" />
        </button>

        {/* REPEAT */}
        <button
          type="button"
          onClick={handleRepeat}
          title={repeatLabel}
          className={`
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            transition-all
            ${
              repeatMode !== 'off'
                ? 'border-[#007aff]/30 bg-[#007aff]/10 text-[#4da3ff]'
                : 'border-white/[0.06] bg-white/[0.025] text-white/25 hover:text-white'
            }
          `}
        >
          <Repeat className="h-3.5 w-3.5" />

          {repeatMode === 'one' && (
            <span className="absolute right-1 top-0.5 text-[7px] font-black">
              1
            </span>
          )}
        </button>
      </div>

      {/* SECONDARY CONTROLS */}
      <div className="flex flex-col gap-3 border-t border-white/[0.05] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">

        {/* VOLUME */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleMute}
            title={
              isMuted
                ? 'Unmute'
                : 'Mute'
            }
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-white/[0.06]
              bg-white/[0.025]
              text-white/30
              transition-all
              hover:text-white
            "
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={
              isMuted
                ? 0
                : volume
            }
            onChange={handleVolumeChange}
            className="
              h-1
              w-24
              cursor-pointer
              appearance-none
              rounded-full
              bg-white/[0.08]
              accent-[#007aff]
            "
            aria-label="Volume"
          />

          <span className="w-8 text-right text-[9px] font-bold text-white/20">
            {Math.round(
              (isMuted ? 0 : volume) * 100
            )}
          </span>
        </div>

        {/* SPEED */}
        <div className="flex items-center gap-2">
          <Gauge className="h-3.5 w-3.5 text-white/20" />

          <span className="mr-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-white/20">
            Speed
          </span>

          <div className="flex items-center gap-1">
            {SPEED_OPTIONS.map(option => {
              const active =
                speed === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    handleSpeedChange(option)
                  }
                  className={`
                    rounded-lg
                    border
                    px-2
                    py-1.5
                    text-[9px]
                    font-bold
                    transition-all
                    ${
                      active
                        ? 'border-[#007aff]/30 bg-[#007aff]/10 text-[#4da3ff]'
                        : 'border-white/[0.05] bg-white/[0.02] text-white/25 hover:text-white/60'
                    }
                  `}
                >
                  {option}x
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PLAYLIST STATUS */}
      <div className="flex items-center justify-between border-t border-white/[0.04] bg-white/[0.015] px-4 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`
              h-1.5
              w-1.5
              shrink-0
              rounded-full
              ${
                isPlaying
                  ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]'
                  : 'bg-white/20'
              }
            `}
          />

          <span className="truncate text-[8px] font-extrabold uppercase tracking-[0.16em] text-white/20">
            {isPlaying
              ? 'Playing'
              : 'Paused'}
          </span>
        </div>

        <span className="text-[8px] font-bold text-white/15">
          {shuffle
            ? 'Shuffle On'
            : 'Playlist Order'}
          {' · '}
          {repeatLabel}
        </span>
      </div>
    </div>
  );
};

export { SongAudioPlayer };
export default SongAudioPlayer;
