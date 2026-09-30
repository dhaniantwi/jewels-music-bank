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
  Repeat1,
  Music2,
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

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export const SongAudioPlayer: React.FC<SongAudioPlayerProps> = ({
  songs,
  initialSongIndex,
  isOpen,
  onClose,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIndex, setCurrentIndex] =
    useState(initialSongIndex);

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

  const [shuffle, setShuffle] =
    useState(false);

  const [repeatMode, setRepeatMode] =
    useState<RepeatMode>('off');

  const [isMuted, setIsMuted] =
    useState(false);

  const currentSong = songs[currentIndex];

  /*
   * Keep the selected song valid if the
   * playlist changes.
   */
  useEffect(() => {
    if (!songs.length) return;

    if (
      initialSongIndex >= 0 &&
      initialSongIndex < songs.length
    ) {
      setCurrentIndex(initialSongIndex);
    }
  }, [initialSongIndex, songs.length]);

  /*
   * Reset player when opened.
   */
  useEffect(() => {
    if (!isOpen) return;

    setCurrentIndex(
      Math.min(
        Math.max(initialSongIndex, 0),
        Math.max(songs.length - 1, 0)
      )
    );

    setCurrentTime(0);
    setDuration(0);
    setSpeed(1);
    setRepeatMode('off');
    setShuffle(false);
    setIsPlaying(false);
  }, [isOpen, initialSongIndex, songs.length]);

  /*
   * Apply volume.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  /*
   * Apply playback speed.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.playbackRate = speed;
  }, [speed, currentIndex]);

  /*
   * Automatically start the selected song
   * whenever the player changes songs.
   */
  useEffect(() => {
    if (!isOpen || !currentSong?.audioUrl) {
      return;
    }

    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = speed;

    setCurrentTime(0);
    setDuration(0);

    const startPlayback = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error(
          'Unable to start song:',
          error
        );

        setIsPlaying(false);
      }
    };

    /*
     * Give the browser a moment to load
     * the newly selected audio source.
     */
    const timer = window.setTimeout(
      startPlayback,
      80
    );

    return () => {
      window.clearTimeout(timer);
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
        audio.currentTime = 0;
      }
    };
  }, []);

  /*
   * Play / Pause.
   */
  const handlePlayPause = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error(
          'Audio playback failed:',
          error
        );

        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  /*
   * Restart current song.
   */
  const handleRestart = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error(
        'Audio restart failed:',
        error
      );
    }
  };

  /*
   * Previous song.
   *
   * If the song has already played for more
   * than 3 seconds, pressing Previous restarts
   * the current song first.
   */
  const handlePrevious = async () => {
    const audio = audioRef.current;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);

      try {
        await audio.play();
      } catch {
        // ignore
      }

      return;
    }

    if (songs.length <= 1) {
      await handleRestart();
      return;
    }

    setCurrentIndex((previous) => {
      if (previous > 0) {
        return previous - 1;
      }

      return songs.length - 1;
    });
  };

  /*
   * Pick the next song.
   */
  const handleNext = () => {
    if (songs.length <= 1) {
      if (repeatMode === 'one') {
        handleRestart();
      }

      return;
    }

    if (shuffle) {
      let nextIndex = currentIndex;

      while (
        nextIndex === currentIndex
      ) {
        nextIndex =
          Math.floor(
            Math.random() * songs.length
          );
      }

      setCurrentIndex(nextIndex);
      return;
    }

    if (currentIndex < songs.length - 1) {
      setCurrentIndex(
        currentIndex + 1
      );
      return;
    }

    /*
     * We reached the end.
     */
    if (repeatMode === 'all') {
      setCurrentIndex(0);
    } else {
      setIsPlaying(false);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }

      setCurrentTime(0);
    }
  };

  /*
   * Handle song ending.
   */
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);

    if (repeatMode === 'one') {
      const audio = audioRef.current;

      if (!audio) return;

      audio.currentTime = 0;

      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error(
            'Repeat playback failed:',
            error
          );
        });

      return;
    }

    handleNext();
  };

  /*
   * Seek.
   */
  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const audio = audioRef.current;

    if (!audio) return;

    const newTime = Number(
      event.target.value
    );

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  /*
   * Volume.
   */
  const handleVolumeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVolume = Number(
      event.target.value
    );

    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }

    if (audioRef.current) {
      audioRef.current.volume =
        newVolume;
    }
  };

  /*
   * Mute / unmute.
   */
  const handleToggleMute = () => {
    setIsMuted((previous) => !previous);
  };

  /*
   * Playback speed.
   */
  const handleSpeedChange = (
    newSpeed: number
  ) => {
    setSpeed(newSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate =
        newSpeed;
    }
  };

  /*
   * Repeat cycle:
   *
   * Off → Repeat One → Repeat All → Off
   */
  const handleRepeat = () => {
    setRepeatMode((previous) => {
      if (previous === 'off') {
        return 'one';
      }

      if (previous === 'one') {
        return 'all';
      }

      return 'off';
    });
  };

  /*
   * Close player.
   */
  const handleClose = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
    setCurrentTime(0);

    onClose();
  };

  const repeatLabel = useMemo(() => {
    if (repeatMode === 'one') {
      return 'Repeat current song';
    }

    if (repeatMode === 'all') {
      return 'Repeat playlist';
    }

    return 'Repeat off';
  }, [repeatMode]);

  if (
    !isOpen ||
    !currentSong
  ) {
    return null;
  }

  return (
    <div
      className="
        mt-4 overflow-hidden rounded-2xl
        border border-white/10
        bg-[#09090b]
        shadow-2xl
      "
    >
      {/* AUDIO ELEMENT */}
      <audio
        key={currentSong.id}
        ref={audioRef}
        src={currentSong.audioUrl}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const audio =
            event.currentTarget;

          setDuration(
            Number.isFinite(
              audio.duration
            )
              ? audio.duration
              : 0
          );

          audio.volume =
            isMuted ? 0 : volume;

          audio.playbackRate =
            speed;
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(
            event.currentTarget
              .currentTime
          );
        }}
        onPlay={() =>
          setIsPlaying(true)
        }
        onPause={() =>
          setIsPlaying(false)
        }
        onEnded={handleEnded}
        onError={() => {
          setIsPlaying(false);

          console.error(
            'Unable to load song audio.'
          );
        }}
      />

      {/* PLAYER HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Music2 size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-blue-400">
              Now Playing
            </p>

            <p className="truncate text-sm font-semibold text-white">
              {currentSong.title}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="
            ml-3 flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-lg text-white/40
            transition
            hover:bg-white/10
            hover:text-white
          "
          aria-label="Close player"
        >
          <X size={16} />
        </button>
      </div>

      {/* PROGRESS */}
      <div className="px-4 pt-4 sm:px-5">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={Math.min(
            currentTime,
            duration || 0
          )}
          onChange={handleSeek}
          className="
            h-1.5 w-full cursor-pointer
            appearance-none rounded-full
            accent-blue-500
          "
          aria-label="Song progress"
        />

        <div className="mt-1 flex justify-between text-[10px] font-medium text-white/35">
          <span>
            {formatTime(currentTime)}
          </span>

          <span>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* MAIN CONTROLS */}
      <div className="flex items-center justify-center gap-1 px-4 py-4 sm:gap-2">
        {/* SHUFFLE */}
        <button
          type="button"
          onClick={() =>
            setShuffle(
              (previous) => !previous
            )
          }
          className={`
            flex h-9 w-9 items-center
            justify-center rounded-full
            transition
            ${
              shuffle
                ? 'bg-blue-500/15 text-blue-400'
                : 'text-white/40 hover:bg-white/10 hover:text-white'
            }
          `}
          title={
            shuffle
              ? 'Shuffle on'
              : 'Shuffle off'
          }
          aria-label="Shuffle"
        >
          <Shuffle size={16} />
        </button>

        {/* PREVIOUS */}
        <button
          type="button"
          onClick={handlePrevious}
          className="
            flex h-10 w-10 items-center
            justify-center rounded-full
            text-white/55 transition
            hover:bg-white/10
            hover:text-white
          "
          title="Previous song"
          aria-label="Previous song"
        >
          <SkipBack size={18} />
        </button>

        {/* RESTART */}
        <button
          type="button"
          onClick={handleRestart}
          className="
            flex h-9 w-9 items-center
            justify-center rounded-full
            text-white/45 transition
            hover:bg-white/10
            hover:text-white
          "
          title="Restart"
          aria-label="Restart song"
        >
          <RotateCcw size={15} />
        </button>

        {/* PLAY / PAUSE */}
        <button
          type="button"
          onClick={handlePlayPause}
          className="
            flex h-12 w-12 items-center
            justify-center rounded-full
            bg-blue-500 text-white
            shadow-lg shadow-blue-500/20
            transition
            hover:scale-105
            hover:bg-blue-400
          "
          title={
            isPlaying
              ? 'Pause'
              : 'Play'
          }
          aria-label={
            isPlaying
              ? 'Pause'
              : 'Play'
          }
        >
          {isPlaying ? (
            <Pause
              size={19}
            />
          ) : (
            <Play
              size={19}
              className="ml-0.5"
            />
          )}
        </button>

        {/* NEXT */}
        <button
          type="button"
          onClick={handleNext}
          className="
            flex h-10 w-10 items-center
            justify-center rounded-full
            text-white/55 transition
            hover:bg-white/10
            hover:text-white
          "
          title="Next song"
          aria-label="Next song"
        >
          <SkipForward size={18} />
        </button>

        {/* REPEAT */}
        <button
          type="button"
          onClick={handleRepeat}
          className={`
            relative flex h-9 w-9
            items-center justify-center
            rounded-full transition
            ${
              repeatMode !== 'off'
                ? 'bg-blue-500/15 text-blue-400'
                : 'text-white/40 hover:bg-white/10 hover:text-white'
            }
          `}
          title={repeatLabel}
          aria-label={repeatLabel}
        >
          {repeatMode === 'one' ? (
            <Repeat1 size={16} />
          ) : (
            <Repeat size={16} />
          )}
        </button>
      </div>

      {/* VOLUME + PLAYLIST STATUS */}
      <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        {/* VOLUME */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMute}
            className="
              flex h-8 w-8 items-center
              justify-center rounded-lg
              text-white/45 transition
              hover:bg-white/10
              hover:text-white
            "
            title={
              isMuted
                ? 'Unmute'
                : 'Mute'
            }
          >
            {isMuted ||
            volume === 0 ? (
              <VolumeX size={15} />
            ) : (
              <Volume2 size={15} />
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
            onChange={
              handleVolumeChange
            }
            className="
              w-24 cursor-pointer
              accent-blue-500
              sm:w-28
            "
            aria-label="Volume"
          />

          <span className="w-8 text-right text-[10px] font-semibold text-white/30">
            {Math.round(
              (isMuted
                ? 0
                : volume) * 100
            )}
          </span>
        </div>

        {/* PLAYLIST STATUS */}
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
          <span>
            {currentIndex + 1}
          </span>

          <span>/</span>

          <span>
            {songs.length}
          </span>

          {shuffle && (
            <>
              <span className="mx-1 text-white/10">
                •
              </span>

              <span className="text-blue-400">
                Shuffle
              </span>
            </>
          )}
        </div>
      </div>

      {/* SPEED */}
      <div className="border-t border-white/10 px-4 py-4 sm:px-5">
        <div className="mb-2 flex items-center gap-2">
          <Gauge
            size={14}
            className="text-white/40"
          />

          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
            Playback Speed
          </span>

          <span className="ml-auto text-[10px] font-bold text-blue-400">
            {speed}x
          </span>
        </div>

        <div className="flex gap-1.5">
          {SPEED_OPTIONS.map(
            (option) => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  handleSpeedChange(
                    option
                  )
                }
                className={`
                  flex-1 rounded-lg
                  px-2 py-1.5
                  text-[10px]
                  font-bold transition
                  ${
                    speed === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-white/45 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                {option}x
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SongAudioPlayer;
