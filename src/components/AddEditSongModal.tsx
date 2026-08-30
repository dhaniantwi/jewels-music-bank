import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Play,
  Pause,
  Download,
  Edit,
  Trash2,
  Music
} from 'lucide-react';

import { Song, ActiveRole } from '../types';
import { transposeKey } from '../utils/audioUtils';
import {
  getAudioFile,
  deleteAudioFile
} from '../utils/audioStorage';

interface SongDetailModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  activeRole: ActiveRole;
  onEdit: (song: Song) => void;
  onDelete: (songId: number) => void;
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({
  song,
  isOpen,
  onClose,
  activeRole,
  onEdit,
  onDelete
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transposeOffset, setTransposeOffset] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isMD = activeRole === 'admin_md';

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadAudio = async () => {
      if (!song) {
        setAudioUrl(null);
        return;
      }

      const file = await getAudioFile(song.id);

      if (file) {
        objectUrl = URL.createObjectURL(file);
        setAudioUrl(objectUrl);
      } else {
        setAudioUrl(null);
      }
    };

    loadAudio();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [song]);

  if (!isOpen || !song) return null;

  const effectiveKey = transposeKey(song.key, transposeOffset);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Unable to play audio:', error);
      }
    }
  };

  const handleDownload = () => {
    if (!audioUrl || !song.audioFileName) return;

    const link = document.createElement('a');

    link.href = audioUrl;
    link.download = song.audioFileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${song.title}" from the Song Bank?`
      )
    ) {
      return;
    }

    await deleteAudioFile(song.id);

    onDelete(song.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-md">

      <div className="ios-glass bg-white/95 rounded-[32px] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-white/80 max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-black/5">

          <div className="flex items-center gap-4 min-w-0">

            <div className="w-14 h-14 rounded-2xl bg-[#007aff]/10 flex items-center justify-center text-3xl border border-[#007aff]/10">
              {song.icon || '🎵'}
            </div>

            <div className="min-w-0">

              <h2 className="text-2xl font-extrabold text-[#1d1d1f] truncate">
                {song.title}
              </h2>

              <p className="text-sm font-semibold text-[#6e6e73]">
                {song.artist}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-1.5">

            {isMD && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEdit(song);
                  }}
                  title="Edit Song"
                  className="w-9 h-9 rounded-full bg-[#007aff]/10 text-[#007aff] flex items-center justify-center"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDelete}
                  title="Delete Song"
                  className="w-9 h-9 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Song Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-5">

          {/* Key */}
          <div className="p-4 rounded-2xl bg-[#007aff]/5 border border-[#007aff]/10">

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
              Musical Key
            </span>

            <div className="flex items-center justify-between mt-1">

              <span className="text-2xl font-extrabold text-[#007aff]">
                {effectiveKey}
              </span>

              <div className="flex items-center gap-1">

                <button
                  onClick={() =>
                    setTransposeOffset((prev) => prev - 1)
                  }
                  className="w-7 h-7 rounded-lg bg-white border border-black/5 font-bold"
                >
                  −
                </button>

                <button
                  onClick={() => setTransposeOffset(0)}
                  className="text-[10px] px-2 font-bold text-[#86868b]"
                >
                  {transposeOffset === 0
                    ? 'Original'
                    : `${transposeOffset > 0 ? '+' : ''}${transposeOffset}`}
                </button>

                <button
                  onClick={() =>
                    setTransposeOffset((prev) => prev + 1)
                  }
                  className="w-7 h-7 rounded-lg bg-white border border-black/5 font-bold"
                >
                  +
                </button>

              </div>

            </div>

          </div>

          {/* Audio */}
          <div className="p-4 rounded-2xl bg-black/[0.025] border border-black/5">

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
                  Audio
                </span>

                <p className="text-xs font-semibold truncate mt-1">
                  {song.audioFileName || 'No audio uploaded'}
                </p>

              </div>

              <div className="flex items-center gap-2">

                {audioUrl && (
                  <>
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 rounded-full bg-[#007aff] text-white flex items-center justify-center"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>

                    <button
                      onClick={handleDownload}
                      title="Download song"
                      className="w-10 h-10 rounded-full bg-black/5 text-[#1d1d1f] flex items-center justify-center"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                )}

              </div>

            </div>

            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="w-full mt-3"
                controls
              />
            )}

          </div>

        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">

          {/* Lyrics */}
          <section>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📝</span>

              <h3 className="text-sm font-bold">
                Lyrics
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-black/[0.025] border border-black/5 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {song.lyrics || 'No lyrics have been added yet.'}
            </div>

          </section>

          {/* Chords */}
          {song.chords && (
            <section>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎼</span>

                <h3 className="text-sm font-bold">
                  Chords
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {song.chords}
              </div>

            </section>
          )}

        </div>

      </div>
    </div>
  );
};
