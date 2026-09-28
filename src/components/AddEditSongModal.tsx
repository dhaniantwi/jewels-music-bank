import React, { useEffect, useState } from 'react';
import { Song } from '../types';
import {
  X,
  Save,
  Upload,
  Music2,
  FileAudio,
  CheckCircle2,
  FileText,
  Piano,
  KeyRound
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
  const [icon, setIcon] = useState('music');

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
      setIcon(editingSong.icon || 'music');

      setLyrics(editingSong.lyrics || '');
      setChords(editingSong.chords || '');

      setAudioFile(undefined);
      setAudioFileName(editingSong.audioFileName || '');
    } else {
      setTitle('');
      setArtist('');
      setKey('G');
      setIcon('music');

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

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-white/[0.045] px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-[#007aff]/40 focus:bg-white/[0.055] disabled:opacity-50';

  const selectClass =
    'w-full rounded-2xl border border-white/10 bg-[#1c1c1f] px-3 py-3 text-sm text-white outline-none transition-all focus:border-[#007aff]/40 disabled:opacity-50';

  const labelClass =
    'mb-2 block text-[10px] font-bold uppercase tracking-wider text-white/40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/75 p-3 backdrop-blur-2xl animate-in fade-in duration-200 sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#111113]/95 text-white shadow-2xl shadow-black/20 backdrop-blur-2xl">

        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 bg-[#111113]/90 p-4 backdrop-blur-2xl sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[#007aff]/20 bg-[#007aff]/15 text-[#4da3ff]">
              {editingSong ? (
                <FileText className="h-5 w-5" />
              ) : (
                <Music2 className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff]">
                Song Bank Management
              </span>

              <h2 className="mt-0.5 truncate text-lg font-extrabold tracking-tight text-white sm:text-xl">
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
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] text-white/45 transition-all hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5"
        >

          {/* Basic Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Music2 className="h-3.5 w-3.5 text-[#4da3ff]" />

              <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
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

              <div className="sm:col-span-6">
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
            </div>
          </section>

          {/* Musical Key */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-3.5 w-3.5 text-[#4da3ff]" />

              <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/45">
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
          <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/15">
                  <Music2 className="h-4 w-4 text-[#4da3ff]" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Song Audio
                  </h3>

                  <p className="mt-1 text-[11px] leading-relaxed text-white/35">
                    Upload the rehearsal or reference recording.
                  </p>
                </div>
              </div>

              {audioFileName && (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-300" />
              )}
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/35 p-6 transition-all hover:bg-white/[0.055]">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#007aff]/20 bg-[#007aff]/15">
                <Upload className="h-5 w-5 text-[#4da3ff]" />
              </div>

              <span className="text-sm font-bold text-[#4da3ff]">
                {audioFileName
                  ? 'Choose another audio file'
                  : 'Upload Audio File'}
              </span>

              <span className="mt-1 text-center text-[10px] text-white/30">
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
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 p-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045]">
                  <FileAudio className="h-4 w-4 text-[#4da3ff]" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-white/75">
                    {audioFileName}
                  </p>

                  <p className="mt-0.5 text-[10px] text-emerald-300">
                    Audio file selected
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Lyrics */}
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-white/45" />

              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Song Lyrics
              </label>
            </div>

            <textarea
              rows={8}
              placeholder={`[Verse 1]

Enter lyrics here...

[Chorus]
Enter chorus here...`}
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              disabled={isSaving}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </section>

          {/* Chords */}
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <Piano className="h-3.5 w-3.5 text-amber-300" />

              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Chords
              </label>
            </div>

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
              className={`${inputClass} resize-y font-mono leading-relaxed`}
            />
          </section>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-white/10 bg-white/[0.035] px-5 py-2.5 text-xs font-bold text-white/55 transition-all hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#007aff] px-6 py-2.5 text-xs font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-[#0062cc] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />

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
