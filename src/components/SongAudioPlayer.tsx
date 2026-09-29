 import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Minus,
  Plus,
  Music2,
  Gauge,
} from 'lucide-react';
import { transposeKey } from '../utils/audioUtils';

interface SongAudioPlayerProps {
  audioUrl: string;
  title: string;
  originalKey?: string;
  isOpen: boolean;
  onClose: () => void;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export const SongAudioPlayer: React.FC<SongAudioPlayerProps> = ({
  audioUrl,
  title,
  originalKey = 'C',
  isOpen,
  onClose,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [transposeOffset, setTransposeOffset] = useState(0);

  const currentKey = useMemo(
    () => transposeKey(originalKey, transposeOffset),
    [originalKey, transposeOffset]
  );

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;
    audio.playbackRate = speed;
  }, [volume, speed]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setSpeed(1);
    setTransposeOffset(0);
  }, [audioUrl]);

  useEffect(() => {
    if (!isOpen) {
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      setIsPlaying(false);
      setCurrentTime(0);
      setTransposeOffset(0);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const handlePlayPause = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = 0;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Audio restart failed:', error);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;

    if (!audio) return;

    const newTime = Number(event.target.value);

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVolume = Number(event.target.value);

    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleTranspose = (amount: number) => {
    setTransposeOffset((previous) => previous + amount);
  };

  const handleResetTranspose = () => {
    setTransposeOffset(0);
  };

  const handleClose = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
    setCurrentTime(0);
    setTransposeOffset(0);

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] shadow-2xl">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const audio = event.currentTarget;

          setDuration(
            Number.isFinite(audio.duration) ? audio.duration : 0
          );
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
        }}
        onError={() => {
          setIsPlaying(false);
          console.error('Unable to load song audio.');
        }}
      />

      {/* Player Header */}
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
              {title}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
          aria-label="Close player"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4 sm:px-5">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={Math.min(currentTime, duration || 0)}
          onChange={handleSeek}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-blue-500"
          aria-label="Song progress"
        />

        <div className="mt-1 flex justify-between text-[10px] font-medium text-white/35">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2 px-4 py-3 sm:gap-3">
        <button
          type="button"
          onClick={handleRestart}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
          title="Restart"
        >
          <RotateCcw size={16} />
        </button>

        <button
          type="button"
          onClick={handlePlayPause}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition hover:scale-105 hover:bg-blue-400"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={19} /> : <Play size={19} className="ml-0.5" />}
        </button>

        <div className="ml-2 flex items-center gap-2">
          {volume === 0 ? (
            <VolumeX size={16} className="text-white/40" />
          ) : (
            <Volume2 size={16} className="text-white/40" />
          )}

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 cursor-pointer accent-blue-500 sm:w-24"
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="grid grid-cols-1 gap-3 border-t border-white/10 px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
        {/* Speed */}
        <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
          <div className="mb-2 flex items-center gap-2">
            <Gauge size={14} className="text-white/40" />
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
              Speed
            </span>
          </div>

          <div className="flex gap-1.5">
            {SPEED_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSpeedChange(option)}
                className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-bold transition ${
                  speed === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-white/45 hover:bg-white/10 hover:text-white'
                }`}
              >
                {option}x
              </button>
            ))}
          </div>
        </div>

        {/* Transpose */}
        <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
              Transpose
            </span>

            <span className="text-xs font-bold text-blue-400">
              {currentKey}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTranspose(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              title="Transpose down one semitone"
            >
              <Minus size={14} />
            </button>

            <button
              type="button"
              onClick={handleResetTranspose}
              className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              {transposeOffset === 0
                ? `Original · ${originalKey}`
                : `${transposeOffset > 0 ? '+' : ''}${transposeOffset} semitone${
                    Math.abs(transposeOffset) === 1 ? '' : 's'
                  }`}
            </button>

            <button
              type="button"
              onClick={() => handleTranspose(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              title="Transpose up one semitone"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Current Key */}
        <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.035] p-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-400/60">
            Current Key
          </span>

          <div className="mt-1 flex items-end justify-between">
            <span className="text-xl font-black tracking-tight text-white">
              {currentKey}
            </span>

            {transposeOffset !== 0 && (
              <span className="text-[9px] font-medium text-white/30">
                from {originalKey}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongAudioPlayer;
 
