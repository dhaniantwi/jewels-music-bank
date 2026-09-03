```tsx
import React, { useEffect, useState } from 'react';
import { Song } from '../types';
import { X, Save, Upload, Music } from 'lucide-react';
import { CHROMATIC_KEYS } from '../utils/audioUtils';

interface AddEditSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    songData: Omit<Song, 'id'> & { id?: number },
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
       * IMPORTANT:
       * The parent App now controls the modal closing.
       *
       * We intentionally DO NOT call onClose() here.
       */
    } catch (error) {
      console.error(
        'Error submitting song:',
        error
      );

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-md">

      <div className="ios-glass bg-white/95 rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-white/80 max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between pb-4 border-b border-black/5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-[#007aff] flex items-center justify-center text-white text-xl">
              {editingSong ? '✏️' : '➕'}
            </div>

            <div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-[#007aff]">
                SONG BANK
              </span>

              <h2 className="text-xl font-bold text-[#1d1d1f]">

             {editingSong
  ? <>Edit Song: {editingSong.title}</>
  : 'Add New Song'}

              </h2>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto py-5 space-y-5"
        >

          {/* Basic Information */}

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">

            <div className="sm:col-span-6">

              <label className="text-xs font-bold block mb-1">
                Song Title *
              </label>

              <input
                type="text"
                required
                placeholder="e.g. Satisfy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
                className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#007aff] disabled:opacity-60"
              />

            </div>

            <div className="sm:col-span-4">

              <label className="text-xs font-bold block mb-1">
                Artist / Source
              </label>

              <input
                type="text"
                placeholder="e.g. Joe Mettle"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                disabled={isSaving}
                className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#007aff] disabled:opacity-60"
              />

            </div>

            <div className="sm:col-span-2">

              <label className="text-xs font-bold block mb-1">
                Icon
              </label>

              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                disabled={isSaving}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2.5 text-base outline-none disabled:opacity-60"
              >

                {emojiIcons.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* Musical Key */}

          <div>

            <label className="text-xs font-bold block mb-1">
              Musical Key
            </label>

            <select
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={isSaving}
              className="w-full bg-white border border-black/10 rounded-xl px-3 py-2.5 text-sm font-bold text-[#007aff] outline-none disabled:opacity-60"
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

          </div>

          {/* Audio Upload */}

          <div className="p-5 rounded-2xl bg-[#007aff]/5 border border-[#007aff]/15">

            <div className="flex items-center gap-2 mb-3">

              <Music className="w-5 h-5 text-[#007aff]" />

              <div>

                <h3 className="text-sm font-bold">
                  Song Audio
                </h3>

                <p className="text-[11px] text-[#6e6e73]">
                  Upload the actual rehearsal or reference recording.
                </p>

              </div>

            </div>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#007aff]/30 rounded-2xl p-6 cursor-pointer hover:bg-[#007aff]/5 transition-all">

              <Upload className="w-7 h-7 text-[#007aff] mb-2" />

              <span className="text-sm font-bold text-[#007aff]">

                {audioFileName
                  ? 'Choose another audio file'
                  : 'Upload Audio File'}

              </span>

              <span className="text-[11px] text-[#6e6e73] mt-1">
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

              <div className="mt-3 flex items-center gap-2 bg-white rounded-xl p-3 border border-black/5">

                <Music className="w-4 h-4 text-[#007aff]" />

                <span className="text-xs font-semibold truncate">
                  {audioFileName}
                </span>

              </div>

            )}

          </div>

          {/* Lyrics */}

          <div>

            <label className="text-xs font-bold block mb-1">
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
              className="w-full bg-white border border-black/10 rounded-xl p-3 text-sm outline-none focus:border-[#007aff] leading-relaxed resize-y disabled:opacity-60"
            />

          </div>

          {/* Chords */}

          <div>

            <label className="text-xs font-bold block mb-1">
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
              className="w-full bg-white border border-black/10 rounded-xl p-3 text-sm font-mono outline-none focus:border-[#007aff] leading-relaxed resize-y disabled:opacity-60"
            />

          </div>

          {/* Footer */}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/5">

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
```
