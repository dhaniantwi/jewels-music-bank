import React, { useEffect, useState } from 'react';
import { Song } from '../types';
import {
  X,
  Save,
  Upload,
  Music,
  FileAudio,
  CheckCircle2
} from 'lucide-react';
import { CHROMATIC_KEYS } from '../utils/audioUtils';

interface AddEditSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    songData: Omit<Song, 'id'> & { id?: string },
    audioFile?: File
  ) => void | Promise<void>;
  editingSong: Song | null;
}

export const AddEditSongModal: React.FC<AddEditSongModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSong
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [key, setKey] = useState('G');
  const [icon, setIcon] = useState('🎵');

  const [lyrics, setLyrics] = useState('');
  const [chords, setChords] = useState('');

  const [audioFile, setAudioFile] = useState<File | undefined>();
  const [audioFileName, setAudioFileName] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingSong) {
      setTitle(editingSong.title);
      setArtist(editingSong.artist);
      setKey(editingSong.key);
      setIcon(editingSong.icon || '🎵');

      setLyrics(editingSong.lyrics || '');
      setChords(editingSong.chords || '');

      setAudioFile(undefined);
      setAudioFileName(editingSong.audioFileName || '');
    } else {
      setTitle('');
      setArtist('');
      setKey('G');
      setIcon('🎵');

      setLyrics('');
      setChords('');

      setAudioFile(undefined);
      setAudioFileName('');
    }

    setIsSaving(false);
  }, [editingSong, isOpen]);

  if (!isOpen) return null;

  const handleAudioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file.');
      return;
    }

    setAudioFile(file);
    setAudioFileName(file.name);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (isSaving) return;

    if (!title.trim()) {
      alert('Please enter a song title.');
      return;
    }

    setIsSaving(true);

    try {
      await onSave(
        {
          id: editingSong?.id,
          title: title.trim(),
          artist: artist.trim() || 'Unknown Artist',
          key,
          icon,
          lyrics: lyrics.trim(),
          chords: chords.trim(),

          audioFileName:
            audioFile?.name ||
            editingSong?.audioFileName ||
            undefined,

          audioFileType:
            audioFile?.type ||
            editingSong?.audioFileType ||
            undefined,

          audioFileSize:
            audioFile?.size ||
            editingSong?.audioFileSize ||
            undefined
        },
        audioFile
      );

      /*
       * The parent App controls the modal closing.
       * Do not call onClose() here.
       */
    } catch (error) {
      console.error('Error submitting song:', error);

      alert(
        'The song could not be saved. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const emojiIcons = [
    '🎵',
    '🔥',
    '🌍',
    '🎤',
    '👑',
    '⚡',
    '✨',
    '🕊️',
    '🎷',
    '🎹',
    '🎸',
    '🥁'
  ];

  const inputClass =
    'w-full bg-white/[0.055] border border-white/10 rounded-2xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-[#007aff]/60 focus:bg-white/[0.075] focus:ring-2 focus:ring-[#007aff]/10 disabled:opacity-50';

  const selectClass =
    'w-full bg-[#17171a] border border-white/10 rounded-2xl px-3 py-3 text-sm text-white outline-none transition-all focus:border-[#007aff]/60 disabled:opacity-50';

  const labelClass =
    'text-[11px] font-bold uppercase tracking-wider text-white/45 block mb-2';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200">

      <div className="ios-glass bg-[#111114]/95 rounded-[30px] max-w-2xl w-full shadow-2xl border border-white/10 max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-7 py-5 border-b border-white/[0.08] flex-shrink-0">

          <div className="flex items-center gap-3 min-w-0">

            <div className="w-11 h-11 rounded-2xl bg-[#007aff]/15 border border-[#007aff]/20 flex items-center justify-center text-xl shadow-[0_8px_25px_rgba(0,122,255,0.15)] flex-shrink-0">
              {editingSong ? '✏️' : '➕'}
            </div>

            <div className="min-w-0">

              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff]">
                Song Bank Management
              </span>

              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight truncate mt-0.5">
                {editingSong
                  ? `Edit Song: ${editingSong.title}`
                  : 'Add New Song'}
              </h2>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-9 h-9 rounded-xl bg-white/[0.055] border border-white/10 hover:bg-white/[0.10] flex items-center justify-center text-white/50 hover:text-white transition-all disabled:opacity-40 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 sm:px-7 py-5 space-y-5"
        >

          {/* Basic Information */}
          <section className="space-y-3">

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007aff]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/55">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">

              <div className="sm:col-span-6">
                <label className={labelClass}>
                  Song Title *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Satisfy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSaving}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-4">
                <label className={labelClass}>
                  Artist / Source
                </label>

                <input
                  type="text"
                  placeholder="e.g. Joe Mettle"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  disabled={isSaving}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Icon
                </label>

                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  disabled={isSaving}
                  className={`${selectClass} text-base`}
                >
                  {emojiIcons.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>

            </div>

          </section>

          {/* Musical Key */}
          <section className="space-y-3">

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/55">
                Musical Key
              </h3>
            </div>

            <select
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={isSaving}
              className={`${selectClass} font-bold text-[#4da3ff]`}
            >
              {CHROMATIC_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k} Major
                </option>
              ))}

              {CHROMATIC_KEYS.map((k) => (
                <option
                  key={`${k}m`}
                  value={`${k}m`}
                >
                  {k} Minor
                </option>
              ))}
            </select>

          </section>

          {/* Audio Upload */}
          <section className="rounded-2xl bg-[#007aff]/[0.07] border border-[#007aff]/15 p-4 sm:p-5">

            <div className="flex items-start justify-between gap-3 mb-4">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#007aff]/10 border border-[#007aff]/15 flex items-center justify-center flex-shrink-0">
                  <Music className="w-4 h-4 text-[#4da3ff]" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Song Audio
                  </h3>

                  <p className="text-[11px] text-white/35 mt-1 leading-relaxed">
                    Upload the rehearsal or reference recording.
                  </p>
                </div>

              </div>

              {audioFileName && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}

            </div>

            <label className="flex flex-col items-center justify-center border border-dashed border-[#007aff]/30 rounded-2xl p-6 cursor-pointer bg-black/10 hover:bg-[#007aff]/[0.06] hover:border-[#007aff]/50 transition-all">

              <div className="w-12 h-12 rounded-2xl bg-[#007aff]/10 border border-[#007aff]/15 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-[#4da3ff]" />
              </div>

              <span className="text-sm font-bold text-[#4da3ff]">
                {audioFileName
                  ? 'Choose another audio file'
                  : 'Upload Audio File'}
              </span>

              <span className="text-[10px] text-white/30 mt-1 text-center">
                MP3, WAV, M4A, OGG and other audio formats
              </span>

              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                disabled={isSaving}
                className="hidden"
              />

            </label>

            {audioFileName && (
              <div className="mt-3 flex items-center gap-3 bg-white/[0.045] border border-white/10 rounded-xl p-3">

                <div className="w-8 h-8 rounded-lg bg-[#007aff]/10 flex items-center justify-center flex-shrink-0">
                  <FileAudio className="w-4 h-4 text-[#4da3ff]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white/75 truncate">
                    {audioFileName}
                  </p>

                  <p className="text-[10px] text-emerald-300 mt-0.5">
                    Audio file selected
                  </p>
                </div>

              </div>
            )}

          </section>

          {/* Lyrics */}
          <section className="space-y-2">

            <label className={labelClass}>
              Song Lyrics
            </label>

            <textarea
              rows={8}
              placeholder={`[Verse 1]

Enter lyrics here...

[Chorus]
Enter chorus here...`}
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              disabled={isSaving}
              className={`${inputClass} leading-relaxed resize-y`}
            />

          </section>

          {/* Chords */}
          <section className="space-y-2">

            <label className={labelClass}>
              Chords
            </label>

            <textarea
              rows={6}
              placeholder={`[Intro]
G  C  Em  D

[Verse]
G  C  Em  D

[Chorus]
C  D  G`}
              value={chords}
              onChange={(e) => setChords(e.target.value)}
              disabled={isSaving}
              className={`${inputClass} font-mono leading-relaxed resize-y`}
            />

          </section>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/[0.08]">

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] text-xs font-bold text-white/60 hover:text-white transition-all disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#007aff] hover:bg-[#1685ff] text-white text-xs font-bold flex items-center gap-2 shadow-[0_10px_30px_rgba(0,122,255,0.25)] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >

              <Save className="w-4 h-4" />

              {isSaving
                ? 'Saving...'
                : editingSong
                  ? 'Save Changes'
                  : 'Add Song to Bank'}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};
