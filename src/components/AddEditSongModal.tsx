import React, { useState, useEffect } from 'react';
import { Song, SongCategory, VocalArrangement, InstrumentArrangement } from '../types';
import { X, Save, Plus, Music, Sparkles } from 'lucide-react';
import { CHROMATIC_KEYS } from '../utils/audioUtils';

interface AddEditSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (songData: Omit<Song, 'id'> & { id?: number }) => void;
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
  const [category, setCategory] = useState<SongCategory>('Worship');
  const [key, setKey] = useState('G');
  const [tempo, setTempo] = useState('Slow (68 BPM)');
  const [bpm, setBpm] = useState<number>(68);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [icon, setIcon] = useState('🎵');
  const [audioUrl, setAudioUrl] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [chords, setChords] = useState('');
  const [leadArrangement, setLeadArrangement] = useState('');
  const [sopranoArrangement, setSopranoArrangement] = useState('');
  const [altoArrangement, setAltoArrangement] = useState('');
  const [tenorArrangement, setTenorArrangement] = useState('');
  
  const [keyboardInst, setKeyboardInst] = useState('');
  const [guitarInst, setGuitarInst] = useState('');
  const [bassInst, setBassInst] = useState('');
  const [drumsInst, setDrumsInst] = useState('');
  const [brassInst, setBrassInst] = useState('');
  
  const [mdNotes, setMdNotes] = useState('');
  const [duration, setDuration] = useState('5:30');

  useEffect(() => {
    if (editingSong) {
      setTitle(editingSong.title);
      setArtist(editingSong.artist);
      setCategory(editingSong.category);
      setKey(editingSong.key);
      setTempo(editingSong.tempo);
      setBpm(editingSong.bpm || 80);
      setTimeSignature(editingSong.timeSignature || '4/4');
      setIcon(editingSong.icon || '🎵');
      setAudioUrl(editingSong.audioUrl || '');
      setLyrics(editingSong.lyrics || '');
      setChords(editingSong.chords || '');
      setLeadArrangement(editingSong.arrangement?.lead || '');
      setSopranoArrangement(editingSong.arrangement?.soprano || '');
      setAltoArrangement(editingSong.arrangement?.alto || '');
      setTenorArrangement(editingSong.arrangement?.tenor || '');
      setKeyboardInst(editingSong.instruments?.keyboard || '');
      setGuitarInst(editingSong.instruments?.guitar || '');
      setBassInst(editingSong.instruments?.bass || '');
      setDrumsInst(editingSong.instruments?.drums || '');
      setBrassInst(editingSong.instruments?.brass || '');
      setMdNotes(editingSong.mdNotes || '');
      setDuration(editingSong.duration || '5:30');
    } else {
      // Default blank/clean state for new song
      setTitle('');
      setArtist('');
      setCategory('Worship');
      setKey('G');
      setTempo('Slow (68 BPM)');
      setBpm(68);
      setTimeSignature('4/4');
      setIcon('🎵');
      setAudioUrl('');
      setLyrics('');
      setChords('');
      setLeadArrangement('Lead vocalist carries the main melody with devotional phrasing.');
      setSopranoArrangement('Soprano joins on Chorus in upper harmony.');
      setAltoArrangement('Alto supports the middle vocal harmony.');
      setTenorArrangement('Tenor provides lower harmonic foundation.');
      setKeyboardInst('Warm grand piano & ambient pads.');
      setGuitarInst('Acoustic rhythm and ambient volume swells.');
      setBassInst('Solid root movement and dynamic groove.');
      setDrumsInst('Gentle cymbal swells building into full praise/worship rhythm.');
      setBrassInst('');
      setMdNotes('Begin softly. Keep transitions between sections tight.');
      setDuration('5:30');
    }
  }, [editingSong, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a song title');
      return;
    }

    const arrangement: VocalArrangement = {
      lead: leadArrangement,
      soprano: sopranoArrangement,
      alto: altoArrangement,
      tenor: tenorArrangement
    };

    const instruments: InstrumentArrangement = {
      keyboard: keyboardInst,
      guitar: guitarInst,
      bass: bassInst,
      drums: drumsInst,
      brass: brassInst || undefined
    };

    onSave({
      id: editingSong?.id,
      title: title.trim(),
      artist: artist.trim() || 'Traditional / Ministry Arrangement',
      category,
      key,
      originalKey: key,
      tempo,
      bpm,
      timeSignature,
      icon,
      audioUrl: audioUrl.trim(),
      lyrics: lyrics.trim(),
      chords: chords.trim(),
      arrangement,
      instruments,
      mdNotes: mdNotes.trim(),
      duration
    });

    onClose();
  };

  const emojiIcons = ['🎵', '🔥', '🌍', '🎤', '👑', '⚡', '✨', '🕊️', '🎷', '🎹', '🎸', '🥁'];
  const categoriesList: SongCategory[] = ['Worship', 'Praise', 'Gospel', 'Afropraise', 'Medleys', 'Choir', 'Contemporary'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="ios-glass bg-white/95 rounded-[32px] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-white/80 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#007aff] to-[#7c3aed] flex items-center justify-center text-white text-xl shadow-md shadow-[#007aff]/20">
              {editingSong ? '✏️' : '➕'}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#007aff]">
                MD CONTROL CENTER
              </span>
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                {editingSong ? `Edit Song: ${editingSong.title}` : 'Upload & Add New Song to Bank'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#6e6e73] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          
          {/* Row 1: Title, Artist, Icon */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Song Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Satisfy, Ogya Fire, Total Praise"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#1d1d1f] outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/10 transition-all"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Artist / Ministry Source
              </label>
              <input
                type="text"
                placeholder="e.g. Joe Mettle, Siisi Baidoo"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#1d1d1f] outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/10 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Icon
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2.5 text-base outline-none cursor-pointer focus:border-[#007aff]"
              >
                {emojiIcons.map(ic => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Category, Key, Tempo, Time Sig */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SongCategory)}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs font-bold text-[#1d1d1f] outline-none focus:border-[#007aff]"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Musical Key
              </label>
              <select
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs font-bold text-[#007aff] outline-none focus:border-[#007aff]"
              >
                {CHROMATIC_KEYS.map(k => (
                  <option key={k} value={k}>{k} Major</option>
                ))}
                {CHROMATIC_KEYS.map(k => (
                  <option key={`${k}m`} value={`${k}m`}>{k} Minor</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Tempo Style
              </label>
              <input
                type="text"
                placeholder="e.g. Slow (68 BPM), Fast"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs font-medium text-[#1d1d1f] outline-none focus:border-[#007aff]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Time Signature & Dur
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="4/4"
                  value={timeSignature}
                  onChange={(e) => setTimeSignature(e.target.value)}
                  className="w-1/2 bg-white border border-black/10 rounded-xl px-2 py-2 text-xs text-center font-bold text-[#1d1d1f] outline-none focus:border-[#007aff]"
                />
                <input
                  type="text"
                  placeholder="5:30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-1/2 bg-white border border-black/10 rounded-xl px-2 py-2 text-xs text-center font-bold text-[#1d1d1f] outline-none focus:border-[#007aff]"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Audio Reference URL or file */}
          <div>
            <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
              Audio Recording Link (MP3 / Stream / YouTube Reference)
            </label>
            <input
              type="url"
              placeholder="https://example.com/audio/satisfy-rehearsal.mp3 (Optional)"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
            />
          </div>

          {/* Row 4: Lyrics and Chords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Song Lyrics (Formatted by Verses / Chorus)
              </label>
              <textarea
                rows={6}
                placeholder="[Verse 1]&#10;Words of the song...&#10;&#10;[Chorus]&#10;Chorus lyrics..."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl p-3 text-xs font-sans text-[#1d1d1f] outline-none focus:border-[#007aff] leading-relaxed resize-y"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Chord Progression & Chart (Key of {key})
              </label>
              <textarea
                rows={6}
                placeholder="[Intro] | G | C | Em | D |&#10;[Verse] G - C/E - G/B - D&#10;[Chorus] C - D/C - Bm7 - Em7"
                value={chords}
                onChange={(e) => setChords(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl p-3 text-xs font-mono text-[#1d1d1f] outline-none focus:border-[#007aff] leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Row 5: Vocal Arrangements */}
          <div className="p-4 rounded-2xl bg-[#007aff]/5 border border-[#007aff]/15 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#007aff] flex items-center gap-1.5">
              <span>🎤</span> Vocal Harmonies & Voice Parts
            </h4>

            <div>
              <label className="text-[11px] font-bold text-[#1d1d1f] block mb-0.5">Lead Vocalist Direction</label>
              <input
                type="text"
                placeholder="Lead vocal guidance..."
                value={leadArrangement}
                onChange={(e) => setLeadArrangement(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-bold text-[#7c3aed] block mb-0.5">Soprano Note/Harmony</label>
                <input
                  type="text"
                  placeholder="Upper harmony details"
                  value={sopranoArrangement}
                  onChange={(e) => setSopranoArrangement(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#007aff] block mb-0.5">Alto Note/Harmony</label>
                <input
                  type="text"
                  placeholder="Middle harmony details"
                  value={altoArrangement}
                  onChange={(e) => setAltoArrangement(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#1d1d1f] block mb-0.5">Tenor Note/Harmony</label>
                <input
                  type="text"
                  placeholder="Lower harmony details"
                  value={tenorArrangement}
                  onChange={(e) => setTenorArrangement(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
                />
              </div>
            </div>
          </div>

          {/* Row 6: Instrumental Instructions */}
          <div className="p-4 rounded-2xl bg-black/[0.025] border border-black/5 space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1d1d1f] flex items-center gap-1.5">
              <span>🎹</span> Band & Instrumentation Guidelines
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-[#6e6e73] block mb-0.5">Keyboard / Pads</label>
                <input
                  type="text"
                  value={keyboardInst}
                  onChange={(e) => setKeyboardInst(e.target.value)}
                  placeholder="Piano voicings & pads"
                  className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6e6e73] block mb-0.5">Guitars</label>
                <input
                  type="text"
                  value={guitarInst}
                  onChange={(e) => setGuitarInst(e.target.value)}
                  placeholder="Acoustic / Electric guitar role"
                  className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6e6e73] block mb-0.5">Bass Guitar</label>
                <input
                  type="text"
                  value={bassInst}
                  onChange={(e) => setBassInst(e.target.value)}
                  placeholder="Bass groove & line"
                  className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6e6e73] block mb-0.5">Drums & Percussion</label>
                <input
                  type="text"
                  value={drumsInst}
                  onChange={(e) => setDrumsInst(e.target.value)}
                  placeholder="Drum rhythm & dynamics"
                  className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
                />
              </div>
            </div>
          </div>

          {/* Row 7: Music Director Rehearsal Directives */}
          <div>
            <label className="text-xs font-bold text-amber-900 block mb-1 flex items-center gap-1">
              <span>🎼</span> Music Director Directives & Rehearsal Cues
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Begin softly on piano. Modulation to Ab on chorus 3. Tight cut on beat 4."
              value={mdNotes}
              onChange={(e) => setMdNotes(e.target.value)}
              className="w-full bg-amber-50/50 border border-amber-300/60 rounded-xl p-3 text-xs text-amber-950 outline-none focus:border-amber-500 leading-relaxed resize-y"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold text-[#1d1d1f] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007aff]/30 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{editingSong ? 'Save Song Changes' : 'Publish Song to Bank'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
