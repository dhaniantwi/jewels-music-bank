
import React, { useEffect, useRef, useState } from 'react';
import { getAudioFile, getAudioUrl } from '../utils/audioStorage';
import { Song, ActiveRole } from '../types';
import {
  X,
  Play,
  Pause,
  Edit,
  Trash2
} from 'lucide-react';
import {
  transposeKey,
  playPitchTone
} from '../utils/audioUtils';

interface SongDetailModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  activeRole: ActiveRole;
  onEdit: (song: Song) => void;
onDelete: (songId: string) => void;
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({
  song,
  isOpen,
  onClose,
  activeRole,
  onEdit,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<
    'lyrics' | 'vocal' | 'instruments' | 'mdNotes'
  >('lyrics');

  const [showChords, setShowChords] = useState(true);
  const [transposeOffset, setTransposeOffset] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /*
   * IMPORTANT:
   * If there is no song, do not try to read its properties.
   */
  useEffect(() => {
  let objectUrl: string | null = null;
  let cancelled = false;

  const loadAudio = async () => {
    if (!isOpen || !song) {
      setAudioUrl(null);
      return;
    }

    try {
      const url = await getAudioUrl(song.id);

      if (cancelled) {
        if (url) URL.revokeObjectURL(url);
        return;
      }

      objectUrl = url;
      setAudioUrl(url);
    } catch (error) {
      console.error('Could not load stored song audio:', error);
      setAudioUrl(null);
    }
  };

  loadAudio();

  return () => {
    cancelled = true;

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }

    setAudioUrl(null);
  };
}, [isOpen, song?.id]);
  if (!isOpen || !song) {
    return null;
  }

  const isMD = activeRole === 'admin_md';

  const effectiveKey = transposeKey(
    song.key || 'C',
    transposeOffset
  );

  /*
   * Safely handle optional song data.
   * This prevents the modal from crashing when an older
   * song does not have all the newer fields.
   */
  const arrangement = song.arrangement || {
    lead: '',
    soprano: '',
    alto: '',
    tenor: ''
  };

  const instruments = song.instruments || {
    keyboard: '',
    guitar: '',
    bass: '',
    drums: '',
    brass: ''
  };

  const lyrics =
    song.lyrics || 'No lyrics available yet for this song.';

  const chords =
    song.chords || '';

  const tempo =
    song.tempo || 'Not specified';

  const category =
    song.category || 'Song';

  const icon =
    song.icon || '🎵';

  const artist =
    song.artist || 'Unknown Artist';

  const handleTogglePlay = () => {
    /*
     * Play uploaded audio if available.
     */
    if (audioRef.current && audioUrl) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlayingAudio(true);
          })
          .catch((error) => {
            console.error(
              'Could not play audio:',
              error
            );
          });
      }

      return;
    }

    /*
     * Otherwise play a simple reference key tone.
     */
    setIsPlayingAudio(true);

    playPitchTone(
      `${effectiveKey.replace('m', '')}4`,
      3
    );

    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3000);
  };
  const handleDownloadAudio = async () => {
  if (!song) return;

  try {
    const storedAudio = await getAudioFile(song.id);

    if (!storedAudio) {
      alert('No uploaded recording was found for this song.');
      return;
    }

    const url = URL.createObjectURL(storedAudio.file);

    const link = document.createElement('a');
    link.href = url;
    link.download = storedAudio.fileName || `${song.title}.mp3`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Could not download song audio:', error);
    alert('Unable to download the recording.');
  }
};

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${song.title}" from the Song Bank?`
    );

    if (!confirmed) {
      return;
    }

    onDelete(song.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-md">
      
      <div className="ios-glass bg-white/95 rounded-[32px] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-white/80 max-h-[92vh] flex flex-col overflow-hidden">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-start justify-between gap-4 pb-4 border-b border-black/5">

          <div className="flex items-center gap-3 min-w-0">

            <div className="w-14 h-14 rounded-2xl bg-[#007aff]/10 flex items-center justify-center text-3xl flex-shrink-0">
              {icon}
            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2 flex-wrap">

                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#007aff]/10 text-[#007aff]">
                  {category}
                </span>

                {song.timeSignature && (
                  <span className="text-[11px] font-bold text-[#86868b] bg-black/5 px-2 py-0.5 rounded-full">
                    {song.timeSignature}
                  </span>
                )}

              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] truncate">
                {song.title}
              </h2>

              <p className="text-sm font-semibold text-[#6e6e73]">
                {artist}
              </p>

            </div>

          </div>

          {/* HEADER BUTTONS */}

          <div className="flex items-center gap-1.5 flex-shrink-0">

            {isMD && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEdit(song);
                  }}
                  title="Edit Song"
                  className="w-9 h-9 rounded-full bg-[#007aff]/10 hover:bg-[#007aff]/20 text-[#007aff] flex items-center justify-center"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDelete}
                  title="Delete Song"
                  className="w-9 h-9 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>


        {/* =====================================================
            SONG INFORMATION
        ===================================================== */}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4">

          {/* KEY */}

          <div className="p-3 rounded-2xl bg-black/[0.03] border border-black/5">

            <span className="text-[10px] font-bold text-[#86868b] uppercase">
              Musical Key
            </span>

            <div className="flex items-center justify-between mt-1">

              <span className="text-xl font-extrabold text-[#007aff]">
                {effectiveKey}
              </span>

              <div className="flex items-center gap-1">

                <button
                  onClick={() =>
                    setTransposeOffset(
                      prev => prev - 1
                    )
                  }
                  className="w-6 h-6 rounded-md bg-white text-xs font-bold"
                >
                  -
                </button>

                <button
                  onClick={() =>
                    setTransposeOffset(0)
                  }
                  className="text-[9px] px-1 text-[#86868b] font-bold"
                >
                  {transposeOffset !== 0
                    ? `${transposeOffset > 0 ? '+' : ''}${transposeOffset}`
                    : 'Orig'}
                </button>

                <button
                  onClick={() =>
                    setTransposeOffset(
                      prev => prev + 1
                    )
                  }
                  className="w-6 h-6 rounded-md bg-white text-xs font-bold"
                >
                  +
                </button>

              </div>

            </div>

          </div>


          {/* TEMPO */}

          <div className="p-3 rounded-2xl bg-black/[0.03] border border-black/5">

            <span className="text-[10px] font-bold text-[#86868b] uppercase">
              Tempo
            </span>

            <p className="text-lg font-bold mt-1 truncate">
              {tempo}
            </p>

          </div>


          {/* AUDIO */}

          <div className="col-span-2 p-3 rounded-2xl bg-[#007aff]/5 border border-[#007aff]/15 flex items-center justify-between gap-3">

            <div className="min-w-0">

              <span className="text-[10px] font-bold text-[#007aff] uppercase">
                Audio Reference
              </span>

              <p className="text-xs font-semibold truncate">

                {audioUrl
  ? 'Ministry Practice Recording'
  : `Key Tone Guide (${effectiveKey})`}

              </p>

            </div>

            {audioUrl && (
  <audio
    ref={audioRef}
    src={audioUrl}
    onEnded={() => setIsPlayingAudio(false)}
    className="hidden"
  />
)}

            <button
              onClick={handleTogglePlay}
              className="px-3.5 py-1.5 rounded-xl bg-[#007aff] text-white text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
            >

              {isPlayingAudio ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Play
                </>
              )}

            </button>

          </div>

        </div>


        {/* =====================================================
            TABS
        ===================================================== */}

        <div className="flex items-center border-b border-black/5 pb-2 gap-1.5 overflow-x-auto">

          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              activeTab === 'lyrics'
                ? 'bg-[#007aff] text-white'
                : 'text-[#6e6e73] hover:bg-black/5'
            }`}
          >
            📝 Lyrics & Chords
          </button>

          <button
            onClick={() => setActiveTab('vocal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              activeTab === 'vocal'
                ? 'bg-[#7c3aed] text-white'
                : 'text-[#6e6e73] hover:bg-black/5'
            }`}
          >
            🎤 Vocal
          </button>

          <button
            onClick={() => setActiveTab('instruments')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              activeTab === 'instruments'
                ? 'bg-[#1d1d1f] text-white'
                : 'text-[#6e6e73] hover:bg-black/5'
            }`}
          >
            🎹 Band
          </button>

          <button
            onClick={() => setActiveTab('mdNotes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              activeTab === 'mdNotes'
                ? 'bg-amber-500 text-white'
                : 'text-[#6e6e73] hover:bg-black/5'
            }`}
          >
            🎼 MD Notes
          </button>

        </div>


        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="flex-1 overflow-y-auto py-4">


          {/* =================================================
              LYRICS
          ================================================= */}

          {activeTab === 'lyrics' && (

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold text-[#86868b]">
                  {showChords && chords
                    ? 'Chords & Lyrics View'
                    : 'Lyrics View'}
                </span>

                {chords && (
                  <button
                    onClick={() =>
                      setShowChords(!showChords)
                    }
                    className="text-xs font-bold text-[#007aff] px-2.5 py-1 rounded-lg bg-[#007aff]/10"
                  >
                    {showChords
                      ? 'Hide Chord Chart'
                      : 'Show Chord Chart'}
                  </button>
                )}

              </div>


              {showChords && chords && (

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 font-mono text-xs text-amber-950 whitespace-pre-wrap">

                  <div className="text-[10px] font-bold uppercase text-amber-700 mb-2">
                    Chord Chart — Key of {effectiveKey}
                  </div>

                  {chords}

                </div>

              )}


              <div className="p-5 rounded-2xl bg-black/[0.025] border border-black/5 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">

                {lyrics}

              </div>

            </div>

          )}


          {/* =================================================
              VOCAL
          ================================================= */}

          {activeTab === 'vocal' && (

            <div className="space-y-3">

              <div className="p-4 rounded-2xl bg-[#007aff]/5 border border-[#007aff]/15">

                <h4 className="text-sm font-bold text-[#007aff]">
                  👑 Lead Vocalist
                </h4>

                <p className="text-xs sm:text-sm mt-1">
                  {arrangement.lead ||
                    'Lead vocalist establishes the melody and sets the prayer atmosphere.'}
                </p>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="p-4 rounded-2xl bg-white border border-black/5">
                  <h5 className="text-xs font-bold text-[#7c3aed]">
                    🎶 Soprano
                  </h5>
                  <p className="text-xs text-[#6e6e73] mt-1">
                    {arrangement.soprano ||
                      'Upper harmony support.'}
                  </p>
                </div>


                <div className="p-4 rounded-2xl bg-white border border-black/5">
                  <h5 className="text-xs font-bold text-[#007aff]">
                    🎶 Alto
                  </h5>
                  <p className="text-xs text-[#6e6e73] mt-1">
                    {arrangement.alto ||
                      'Middle harmonic foundation.'}
                  </p>
                </div>


                <div className="p-4 rounded-2xl bg-white border border-black/5">
                  <h5 className="text-xs font-bold">
                    🎶 Tenor
                  </h5>
                  <p className="text-xs text-[#6e6e73] mt-1">
                    {arrangement.tenor ||
                      'Lower male harmony and foundation.'}
                  </p>
                </div>

              </div>

            </div>

          )}


          {/* =================================================
              INSTRUMENTS
          ================================================= */}

          {activeTab === 'instruments' && (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="p-4 rounded-2xl bg-white border border-black/5">
                <h4 className="text-xs font-bold">
                  🎹 Keyboard & Synth Pads
                </h4>
                <p className="text-xs text-[#6e6e73] mt-1">
                  {instruments.keyboard ||
                    'Main harmonic accompaniment.'}
                </p>
              </div>


              <div className="p-4 rounded-2xl bg-white border border-black/5">
                <h4 className="text-xs font-bold">
                  🎸 Guitars
                </h4>
                <p className="text-xs text-[#6e6e73] mt-1">
                  {instruments.guitar ||
                    'Rhythmic support and melodic fills.'}
                </p>
              </div>


              <div className="p-4 rounded-2xl bg-white border border-black/5">
                <h4 className="text-xs font-bold">
                  🎸 Bass Guitar
                </h4>
                <p className="text-xs text-[#6e6e73] mt-1">
                  {instruments.bass ||
                    'Root note foundations and groove.'}
                </p>
              </div>


              <div className="p-4 rounded-2xl bg-white border border-black/5">
                <h4 className="text-xs font-bold">
                  🥁 Drums & Percussion
                </h4>
                <p className="text-xs text-[#6e6e73] mt-1">
                  {instruments.drums ||
                    'Dynamic praise and worship groove.'}
                </p>
              </div>


              {instruments.brass && (

                <div className="p-4 rounded-2xl bg-white border border-black/5 sm:col-span-2">

                  <h4 className="text-xs font-bold">
                    🎷 Brass & Auxiliary
                  </h4>

                  <p className="text-xs text-[#6e6e73] mt-1">
                    {instruments.brass}
                  </p>

                </div>

              )}

            </div>

          )}


          {/* =================================================
              MD NOTES
          ================================================= */}

          {activeTab === 'mdNotes' && (

            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">

              <h4 className="text-sm font-bold text-amber-950">
                🎼 Music Director Directives
              </h4>

              <p className="text-[11px] text-amber-800 mt-1">
                Directorial notes for rehearsals and Sunday service
              </p>

              <div className="text-sm mt-4 leading-relaxed whitespace-pre-wrap">

                {song.mdNotes ||
                  'No specific MD notes added yet for this song.'}

              </div>

            </div>

          )}

        </div>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="flex justify-end pt-3 border-t border-black/5">

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
 
};
