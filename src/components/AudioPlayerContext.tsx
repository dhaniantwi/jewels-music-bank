import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Song } from '../types';

interface AudioPlayerContextValue {
  songs: Song[];
  currentSong: Song | null;
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  speed: number;
  isMuted: boolean;
  shuffle: boolean;
  repeatMode: RepeatMode;

  playSong: (
    song: Song,
    playlist?: Song[]
  ) => void;

  playPause: () => Promise<void>;
  next: () => void;
  previous: () => void;
  restart: () => void;

  seek: (time: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  setSpeed: (value: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;

  closePlayer: () => void;
}

type RepeatMode =
  | 'off'
  | 'one'
  | 'all';

const AudioPlayerContext =
  createContext<
    AudioPlayerContextValue | undefined
  >(undefined);

interface AudioPlayerProviderProps {
  children: React.ReactNode;
}

export const AudioPlayerProvider: React.FC<
  AudioPlayerProviderProps
> = ({ children }) => {
  /*
   * ============================================================
   * PERMANENT AUDIO ELEMENT
   * ============================================================
   *
   * This element belongs to the whole application.
   *
   * It does NOT live inside SongBankView.
   * It does NOT get destroyed when the player changes cards.
   */

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  /*
   * ============================================================
   * STATE
   * ============================================================
   */

  const [songs, setSongs] =
    useState<Song[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [currentSong, setCurrentSong] =
    useState<Song | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolumeState] =
    useState(1);

  const [speed, setSpeedState] =
    useState(1);

  const [isMuted, setIsMuted] =
    useState(false);

  const [shuffle, setShuffle] =
    useState(false);

  const [repeatMode, setRepeatMode] =
    useState<RepeatMode>('off');

  /*
   * Used to prevent an automatic song load
   * from starting unexpectedly.
   */
  const shouldAutoPlayRef =
    useRef(false);

  /*
   * ============================================================
   * MEDIA SESSION SUPPORT
   * ============================================================
   */

  const hasMediaSession =
    typeof navigator !== 'undefined' &&
    'mediaSession' in navigator;

  /*
   * ============================================================
   * LOAD SONG INTO THE PERMANENT AUDIO ENGINE
   * ============================================================
   */

  const loadSong = useCallback(
    (
      song: Song,
      playlist: Song[],
      index: number,
      autoPlay: boolean
    ) => {
      const audio =
        audioRef.current;

      if (!audio || !song.audioUrl) {
        return;
      }

      setSongs(playlist);
      setCurrentIndex(index);
      setCurrentSong(song);
      setCurrentTime(0);
      setDuration(0);

      shouldAutoPlayRef.current =
        autoPlay;

      audio.pause();
      audio.currentTime = 0;
      audio.src = song.audioUrl;
      audio.load();
    },
    []
  );

  /*
   * ============================================================
   * PLAY A SONG
   * ============================================================
   */

  const playSong = useCallback(
    (
      song: Song,
      playlist?: Song[]
    ) => {
      const nextPlaylist =
        playlist?.filter(item =>
          Boolean(item.audioUrl)
        ) || [song];

      const index =
        nextPlaylist.findIndex(
          item => item.id === song.id
        );

      loadSong(
        song,
        nextPlaylist,
        index >= 0 ? index : 0,
        true
      );
    },
    [loadSong]
  );

  /*
   * ============================================================
   * PLAY / PAUSE
   * ============================================================
   */

  const playPause =
    useCallback(async () => {
      const audio =
        audioRef.current;

      if (!audio || !currentSong) {
        return;
      }

      try {
        if (audio.paused) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch {
        setIsPlaying(false);
      }
    }, [currentSong]);

  /*
   * ============================================================
   * NEXT
   * ============================================================
   */

  const next =
    useCallback(() => {
      if (!songs.length) {
        return;
      }

      let nextIndex =
        currentIndex;

      if (
        shuffle &&
        songs.length > 1
      ) {
        do {
          nextIndex =
            Math.floor(
              Math.random() *
                songs.length
            );
        } while (
          nextIndex === currentIndex
        );
      } else if (
        currentIndex <
        songs.length - 1
      ) {
        nextIndex =
          currentIndex + 1;
      } else if (
        repeatMode === 'all'
      ) {
        nextIndex = 0;
      } else {
        return;
      }

      const nextSong =
        songs[nextIndex];

      if (!nextSong?.audioUrl) {
        return;
      }

      loadSong(
        nextSong,
        songs,
        nextIndex,
        true
      );
    }, [
      songs,
      currentIndex,
      shuffle,
      repeatMode,
      loadSong,
    ]);

  /*
   * ============================================================
   * PREVIOUS
   * ============================================================
   */

  const previous =
    useCallback(() => {
      const audio =
        audioRef.current;

      if (!songs.length) {
        return;
      }

      /*
       * Standard music-player behavior:
       * if we're more than 3 seconds into
       * the song, restart instead.
       */
      if (
        audio &&
        audio.currentTime > 3
      ) {
        audio.currentTime = 0;
        setCurrentTime(0);
        return;
      }

      let previousIndex =
        currentIndex;

      if (
        shuffle &&
        songs.length > 1
      ) {
        do {
          previousIndex =
            Math.floor(
              Math.random() *
                songs.length
            );
        } while (
          previousIndex ===
          currentIndex
        );
      } else if (
        currentIndex > 0
      ) {
        previousIndex =
          currentIndex - 1;
      } else if (
        repeatMode === 'all'
      ) {
        previousIndex =
          songs.length - 1;
      } else {
        return;
      }

      const previousSong =
        songs[previousIndex];

      if (
        !previousSong?.audioUrl
      ) {
        return;
      }

      loadSong(
        previousSong,
        songs,
        previousIndex,
        true
      );
    }, [
      songs,
      currentIndex,
      shuffle,
      repeatMode,
      loadSong,
    ]);

  /*
   * ============================================================
   * RESTART
   * ============================================================
   */

  const restart =
    useCallback(() => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      audio.currentTime = 0;
      setCurrentTime(0);

      if (audio.paused) {
        void audio.play().catch(() => {});
      }
    }, []);

  /*
   * ============================================================
   * SEEK
   * ============================================================
   */

  const seek =
    useCallback((time: number) => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      const safeTime =
        Math.max(
          0,
          Math.min(
            time,
            Number.isFinite(
              audio.duration
            )
              ? audio.duration
              : time
          )
        );

      audio.currentTime =
        safeTime;

      setCurrentTime(
        safeTime
      );
    }, []);

  /*
   * ============================================================
   * VOLUME
   * ============================================================
   */

  const setVolume =
    useCallback((value: number) => {
      const safeValue =
        Math.max(
          0,
          Math.min(1, value)
        );

      setVolumeState(
        safeValue
      );

      const audio =
        audioRef.current;

      if (audio) {
        audio.volume =
          safeValue;
      }

      if (safeValue > 0) {
        setIsMuted(false);
      }
    }, []);

  /*
   * ============================================================
   * MUTE
   * ============================================================
   */

  const toggleMute =
    useCallback(() => {
      setIsMuted(previous => {
        const nextValue =
          !previous;

        const audio =
          audioRef.current;

        if (audio) {
          audio.muted =
            nextValue;
        }

        return nextValue;
      });
    }, []);

  /*
   * ============================================================
   * SPEED
   * ============================================================
   */

  const setSpeed =
    useCallback((value: number) => {
      setSpeedState(value);

      const audio =
        audioRef.current;

      if (audio) {
        audio.playbackRate =
          value;
      }
    }, []);

  /*
   * ============================================================
   * SHUFFLE
   * ============================================================
   */

  const toggleShuffle =
    useCallback(() => {
      setShuffle(
        previous => !previous
      );
    }, []);

  /*
   * ============================================================
   * REPEAT
   * ============================================================
   */

  const cycleRepeat =
    useCallback(() => {
      setRepeatMode(
        previous => {
          if (
            previous === 'off'
          ) {
            return 'one';
          }

          if (
            previous === 'one'
          ) {
            return 'all';
          }

          return 'off';
        }
      );
    }, []);

  /*
   * ============================================================
   * CLOSE
   * ============================================================
   */

  const closePlayer =
    useCallback(() => {
      const audio =
        audioRef.current;

      if (audio) {
        audio.pause();
        audio.removeAttribute(
          'src'
        );
        audio.load();
      }

      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setCurrentSong(null);
      setSongs([]);
      setCurrentIndex(0);

      if (hasMediaSession) {
        try {
          navigator.mediaSession.metadata =
            null;

          navigator.mediaSession.playbackState =
            'none';
        } catch {
          // Ignore.
        }
      }
    }, [hasMediaSession]);

  /*
   * ============================================================
   * AUDIO EVENTS
   * ============================================================
   */

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const handleLoadedMetadata =
      () => {
        const nextDuration =
          audio.duration;

        if (
          Number.isFinite(
            nextDuration
          )
        ) {
          setDuration(
            nextDuration
          );
        }

        audio.volume =
          volume;

        audio.muted =
          isMuted;

        audio.playbackRate =
          speed;
      };

    const handleTimeUpdate =
      () => {
        setCurrentTime(
          audio.currentTime
        );
      };

    const handlePlay =
      () => {
        setIsPlaying(true);

        if (hasMediaSession) {
          try {
            navigator.mediaSession.playbackState =
              'playing';
          } catch {
            // Ignore.
          }
        }
      };

    const handlePause =
      () => {
        setIsPlaying(false);

        if (hasMediaSession) {
          try {
            navigator.mediaSession.playbackState =
              'paused';
          } catch {
            // Ignore.
          }
        }
      };

    const handleEnded =
      () => {
        if (
          repeatMode === 'one'
        ) {
          audio.currentTime = 0;

          void audio
            .play()
            .catch(() => {});

          return;
        }

        if (
          currentIndex <
          songs.length - 1
        ) {
          next();
          return;
        }

        if (
          repeatMode === 'all'
        ) {
          next();
          return;
        }

        setIsPlaying(false);

        if (hasMediaSession) {
          try {
            navigator.mediaSession.playbackState =
              'none';
          } catch {
            // Ignore.
          }
        }
      };

    const handleError =
      () => {
        setIsPlaying(false);
      };

    audio.addEventListener(
      'loadedmetadata',
      handleLoadedMetadata
    );

    audio.addEventListener(
      'timeupdate',
      handleTimeUpdate
    );

    audio.addEventListener(
      'play',
      handlePlay
    );

    audio.addEventListener(
      'pause',
      handlePause
    );

    audio.addEventListener(
      'ended',
      handleEnded
    );

    audio.addEventListener(
      'error',
      handleError
    );

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

      audio.removeEventListener(
        'error',
        handleError
      );
    };
  }, [
    volume,
    speed,
    isMuted,
    repeatMode,
    currentIndex,
    songs.length,
    next,
    hasMediaSession,
  ]);

  /*
   * ============================================================
   * AUTO PLAY AFTER SONG LOAD
   * ============================================================
   */

  useEffect(() => {
    const audio =
      audioRef.current;

    if (
      !audio ||
      !currentSong ||
      !shouldAutoPlayRef.current
    ) {
      return;
    }

    const handleCanPlay =
      () => {
        if (
          !shouldAutoPlayRef.current
        ) {
          return;
        }

        shouldAutoPlayRef.current =
          false;

        void audio
          .play()
          .catch(() => {});
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
    currentSong?.id,
  ]);

  /*
   * ============================================================
   * MEDIA SESSION METADATA
   * ============================================================
   */

  useEffect(() => {
    if (
      !hasMediaSession ||
      !currentSong
    ) {
      return;
    }

    try {
      navigator.mediaSession.metadata =
        new MediaMetadata({
          title:
            currentSong.title ||
            'Untitled Song',

          artist:
            currentSong.artist ||
            'Jewels of His Crown',

          album:
            'Jewels Music Library',
        });
    } catch {
      // Ignore.
    }
  }, [
    currentSong?.id,
    currentSong?.title,
    currentSong?.artist,
    hasMediaSession,
  ]);

  /*
   * ============================================================
   * MEDIA SESSION ACTIONS
   * ============================================================
   */

  useEffect(() => {
    if (
      !hasMediaSession
    ) {
      return;
    }

    const session =
      navigator.mediaSession;

    const register = (
      action: MediaSessionAction,
      handler: (
        details?: any
      ) => void
    ) => {
      try {
        session.setActionHandler(
          action,
          handler
        );
      } catch {
        // Unsupported action.
      }
    };

    register(
      'play',
      () => {
        void playPause();
      }
    );

    register(
      'pause',
      () => {
        const audio =
          audioRef.current;

        if (audio) {
          audio.pause();
        }
      }
    );

    register(
      'previoustrack',
      () => {
        previous();
      }
    );

    register(
      'nexttrack',
      () => {
        next();
      }
    );

    register(
      'seekbackward',
      details => {
        const audio =
          audioRef.current;

        if (!audio) {
          return;
        }

        const offset =
          details?.seekOffset ||
          10;

        seek(
          audio.currentTime -
            offset
        );
      }
    );

    register(
      'seekforward',
      details => {
        const audio =
          audioRef.current;

        if (!audio) {
          return;
        }

        const offset =
          details?.seekOffset ||
          10;

        seek(
          audio.currentTime +
            offset
        );
      }
    );

    register(
      'seekto',
      details => {
        if (
          typeof details?.seekTime ===
          'number'
        ) {
          seek(
            details.seekTime
          );
        }
      }
    );

    register(
      'stop',
      () => {
        closePlayer();
      }
    );

    return () => {
      const actions:
        MediaSessionAction[] = [
        'play',
        'pause',
        'previoustrack',
        'nexttrack',
        'seekbackward',
        'seekforward',
        'seekto',
        'stop',
      ];

      actions.forEach(
        action => {
          try {
            session.setActionHandler(
              action,
              null
            );
          } catch {
            // Ignore.
          }
        }
      );
    };
  }, [
    hasMediaSession,
    playPause,
    previous,
    next,
    seek,
    closePlayer,
  ]);

  /*
   * ============================================================
   * MEDIA SESSION POSITION
   * ============================================================
   */

  useEffect(() => {
    if (
      !hasMediaSession ||
      !duration ||
      !Number.isFinite(
        duration
      )
    ) {
      return;
    }

    const safePosition =
      Math.min(
        Math.max(
          currentTime,
          0
        ),
        duration
      );

    try {
      navigator.mediaSession.setPositionState?.(
        {
          duration,
          playbackRate:
            speed || 1,
          position:
            safePosition,
        }
      );
    } catch {
      // Ignore.
    }
  }, [
    currentTime,
    duration,
    speed,
    hasMediaSession,
  ]);

  /*
   * ============================================================
   * PERMANENT AUDIO ELEMENT
   * ============================================================
   */

  const contextValue =
    useMemo<AudioPlayerContextValue>(
      () => ({
        songs,
        currentSong,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        speed,
        isMuted,
        shuffle,
        repeatMode,

        playSong,
        playPause,
        next,
        previous,
        restart,

        seek,
        setVolume,
        toggleMute,
        setSpeed,
        toggleShuffle,
        cycleRepeat,

        closePlayer,
      }),
      [
        songs,
        currentSong,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        speed,
        isMuted,
        shuffle,
        repeatMode,

        playSong,
        playPause,
        next,
        previous,
        restart,

        seek,
        setVolume,
        toggleMute,
        setSpeed,
        toggleShuffle,
        cycleRepeat,

        closePlayer,
      ]
    );

  return (
    <AudioPlayerContext.Provider
      value={contextValue}
    >
      {children}

      {/*
       * THIS IS THE IMPORTANT PART.
       *
       * This audio element belongs to the
       * provider, NOT the Song Bank card.
       *
       * It stays alive while the user:
       *
       * - changes songs
       * - changes tabs
       * - searches
       * - locks the phone
       * - leaves the Song Bank
       */}
      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
      />
    </AudioPlayerContext.Provider>
  );
};

/*
 * ==============================================================
 * HOOK
 * ==============================================================
 */

export const useAudioPlayer =
  () => {
    const context =
      useContext(
        AudioPlayerContext
      );

    if (!context) {
      throw new Error(
        'useAudioPlayer must be used inside AudioPlayerProvider'
      );
    }

    return context;
  };

export default AudioPlayerProvider;
