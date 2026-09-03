import React, { useState, useMemo } from 'react';
import { Song, ActiveRole } from '../types';
import {
  Search,
  Plus,
  Play,
  Pause,
  Edit
} from 'lucide-react';
import {
  CHROMATIC_KEYS,
  playPitchTone
} from '../utils/audioUtils';

interface SongBankViewProps {
  songs: Song[];
  activeRole: ActiveRole;
  onSelectSong: (song: Song) => void;
  onAddNewSong: () => void;
  onEditSong: (song: Song) => void;
  onDeleteSong: (songId: string) => void;
}

export const SongBankView: React.FC<SongBankViewProps> = ({
  songs,
  activeRole,
  onSelectSong,
  onAddNewSong,
  onEditSong,
  onDeleteSong
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedKey, setSelectedKey] = useState('All');
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  const isMD = activeRole === 'admin_md';

  const categories = [
    'All',
    'Worship',
    'Praise',
    'Gospel',
    'Afropraise',
    'Medleys',
    'Choir',
    'Contemporary',
    'Other'
  ];

  /* =========================================
     FILTER SONGS SAFELY
  ========================================= */

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const title = song.title || '';
      const artist = song.artist || '';
      const lyrics = song.lyrics || '';
      const tags = song.tags || [];
      const category = song.category || '';
      const key = song.key || '';

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        title.toLowerCase().includes(search) ||
        artist.toLowerCase().includes(search) ||
        lyrics.toLowerCase().includes(search) ||
        tags.some((tag) =>
          tag.toLowerCase().includes(search)
        );

      const matchesCategory =
        selectedCategory === 'All' ||
        category === selectedCategory;

      const matchesKey =
        selectedKey === 'All' ||
        key.toLowerCase() === selectedKey.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesKey
      );
    });
  }, [
    songs,
    searchTerm,
    selectedCategory,
    selectedKey
  ]);

  /* =========================================
     PLAY KEY TONE SAFELY
  ========================================= */

  const handleQuickPlay = (
    e: React.MouseEvent,
    song: Song
  ) => {
    e.stopPropagation();

    if (playingSongId === song.id) {
      setPlayingSongId(null);
      return;
    }

    setPlayingSongId(song.id);

    const songKey = song.key || 'C';

    playPitchTone(
      `${songKey.replace('m', '')}4`,
      3
    );

    setTimeout(() => {
      setPlayingSongId((prev) =>
        prev === song.id ? null : prev
      );
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* =========================================
          TOP HEADER
      ========================================= */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#007aff] bg-[#007aff]/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
            MUSIC MINISTRY REPERTOIRE
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
            Song Bank Library
          </h1>

          <p className="text-sm text-[#6e6e73] font-medium mt-0.5">
            {songs.length} ministry songs loaded with lyrics,
            chord charts, vocal harmonies, and MD notes.
          </p>

        </div>


        {/* ADD SONG */}

        <div className="flex items-center gap-2">

          {isMD ? (

            <button
              onClick={onAddNewSong}
              className="px-5 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-[#007aff]/30 transition-all active:scale-95 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />

              <span>
                Upload New Song
              </span>

            </button>

          ) : (

            <div className="px-3.5 py-2 rounded-2xl bg-black/5 text-[#86868b] text-xs font-semibold flex items-center gap-1.5 border border-black/5">

              <span>
                🔒 Song uploads restricted to MD
              </span>

            </div>

          )}

        </div>

      </div>


      {/* =========================================
          SEARCH AND FILTERS
      ========================================= */}

      <div className="ios-glass rounded-[28px] p-4 sm:p-5 bg-white/80 space-y-3.5 border border-white/90 shadow-sm">


        {/* SEARCH */}

        <div className="relative">

          <Search className="w-4 h-4 text-[#86868b] absolute left-4 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Search by song title, artist, or lyrics..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full bg-white/90 border border-black/10 rounded-2xl pl-11 pr-16 py-3 text-sm text-[#1d1d1f] placeholder:text-[#86868b] outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/10 transition-all font-medium"
          />

          {searchTerm && (

            <button
              onClick={() =>
                setSearchTerm('')
              }
              className="text-xs font-bold text-[#86868b] hover:text-[#1d1d1f] absolute right-4 top-1/2 -translate-y-1/2"
            >
              Clear
            </button>

          )}

        </div>


        {/* FILTERS */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">


          {/* CATEGORY FILTER */}

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">

            {categories.map((category) => (

              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#007aff] text-white shadow-xs'
                    : 'bg-black/[0.04] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.08]'
                }`}
              >
                {category}
              </button>

            ))}

          </div>


          {/* KEY FILTER */}

          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">

            <span className="text-xs font-bold text-[#86868b]">
              Key:
            </span>

            <select
              value={selectedKey}
              onChange={(e) =>
                setSelectedKey(e.target.value)
              }
              className="bg-white border border-black/10 rounded-xl px-2.5 py-1 text-xs font-bold text-[#1d1d1f] outline-none focus:border-[#007aff]"
            >

              <option value="All">
                All Keys
              </option>

              {CHROMATIC_KEYS.map((key) => (

                <option
                  key={key}
                  value={key}
                >
                  {key}
                </option>

              ))}

            </select>

          </div>

        </div>

      </div>


      {/* =========================================
          SONG GRID
      ========================================= */}

      {filteredSongs.length > 0 ? (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {filteredSongs.map((song) => {

            const isPlayingThis =
              playingSongId === song.id;

            const songTitle =
              song.title || 'Untitled Song';

            const songArtist =
              (song.artist || '').toLowerCase()

            const songCategory =
              song.category || 'Other';

            const songKey =
              (song.key || '').toLowerCase()

            const songTempo =
              song.tempo || 'Tempo N/A';

            const tempoDisplay =
              {(song.tempo || 'Tempo N/A').split(' ')[0]}

            return (

              <div
                key={song.id}
                onClick={() =>
                  onSelectSong(song)
                }
                className="ios-card p-5 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >


                {/* SONG HEADER */}

                <div className="flex items-start justify-between gap-3 mb-3">

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#007aff]/15 to-[#7c3aed]/15 flex items-center justify-center text-2xl flex-shrink-0 border border-black/5 group-hover:scale-105 transition-transform">

                      {song.icon || '🎵'}

                    </div>


                    <div className="min-w-0">

                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#007aff] block">

                        {songCategory}

                      </span>


                      <h3 className="text-lg font-bold text-[#1d1d1f] tracking-tight truncate group-hover:text-[#007aff] transition-colors">

                        {songTitle}

                      </h3>


                      <p className="text-xs font-semibold text-[#6e6e73] truncate">

                        {songArtist}

                      </p>

                    </div>

                  </div>


                  {/* MUSICAL BADGES */}

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">

                    <span className="text-xs font-extrabold text-[#007aff] bg-[#007aff]/10 px-2 py-0.5 rounded-lg">

                      Key: {songKey}

                    </span>


                    <span className="text-[11px] font-medium text-[#86868b]">

                      {tempoDisplay}

                    </span>

                  </div>

                </div>


                {/* VOCAL SUMMARY */}

                <div className="grid grid-cols-3 gap-1.5 my-2 p-2 rounded-xl bg-black/[0.025] text-center text-[10px] font-semibold text-[#6e6e73]">

                  <div className="truncate">

                    👑 Lead:{' '}
                    {song.arrangement?.lead
                      ? 'Ready'
                      : '—'}

                  </div>


                  <div className="truncate text-[#7c3aed]">

                    🎶 SAT Harmonies

                  </div>


                  <div className="truncate">

                    🎹 Band Chart

                  </div>

                </div>


                {/* FOOTER */}

                <div className="flex items-center justify-between pt-3 mt-1 border-t border-black/5">


                  {/* PLAY KEY */}

                  <button
                    onClick={(e) =>
                      handleQuickPlay(e, song)
                    }
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isPlayingThis
                        ? 'bg-[#007aff] text-white shadow-sm scale-105'
                        : 'bg-black/5 hover:bg-[#007aff]/10 text-[#007aff]'
                    }`}
                  >

                    {isPlayingThis ? (

                      <Pause className="w-3.5 h-3.5 fill-current" />

                    ) : (

                      <Play className="w-3.5 h-3.5 fill-current" />

                    )}

                    <span>

                      {isPlayingThis
                        ? 'Playing Key...'
                        : 'Key Tone'}

                    </span>

                  </button>


                  {/* ACTIONS */}

                  <div className="flex items-center gap-1.5">

                    {isMD && (

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditSong(song);
                        }}
                        title="Edit Song"
                        className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#6e6e73]"
                      >

                        <Edit className="w-3.5 h-3.5" />

                      </button>

                    )}


                    <span className="text-xs font-bold text-[#007aff] group-hover:translate-x-1 transition-transform flex items-center gap-1">

                      View Song →

                    </span>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      ) : (

        /* =========================================
            EMPTY STATE
        ========================================= */

        <div className="text-center py-16 px-4 ios-glass rounded-[32px] bg-white/70">

          <div className="w-16 h-16 rounded-3xl bg-black/5 flex items-center justify-center text-3xl mx-auto mb-4">

            😔

          </div>


          <h3 className="text-xl font-bold text-[#1d1d1f]">

            No songs found

          </h3>


          <p className="text-sm text-[#6e6e73] mt-1 max-w-sm mx-auto">

            Try searching for another song title or artist,
            or clear your active filters.

          </p>


          <div className="flex justify-center gap-3 mt-4">

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedKey('All');
              }}
              className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold text-[#1d1d1f]"
            >

              Reset Filters

            </button>


            {isMD && (

              <button
                onClick={onAddNewSong}
                className="px-4 py-2 rounded-xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold"
              >

                + Add New Song

              </button>

            )}

          </div>

        </div>

      )}

    </div>
  );
};
