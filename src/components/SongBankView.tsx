import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Play,
  Pause,
  Edit,
  Music,
  Lock,
  X,
  RotateCcw,
} from 'lucide-react';
import { Song, ActiveRole } from '../types';
import {
  CHROMATIC_KEYS,
  playPitchTone,
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
    'Other',
  ];

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
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
        tags.some(tag => tag.toLowerCase().includes(search));

      const matchesCategory =
        selectedCategory === 'All' ||
        category === selectedCategory;

      const matchesKey =
        selectedKey === 'All' ||
        key.toLowerCase() === selectedKey.toLowerCase();

      return matchesSearch && matchesCategory && matchesKey;
    });
  }, [
    songs,
    searchTerm,
    selectedCategory,
    selectedKey,
  ]);

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
      setPlayingSongId(prev =>
        prev === song.id ? null : prev
      );
    }, 3000);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedKey('All');
  };

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 animate-in fade-in duration-200">

      {/* HEADER */}
      <section className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#4da3ff]">
              Music Ministry Repertoire
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Song Bank
            </h1>

            <p className="mt-1 max-w-2xl text-sm font-medium text-white/45">
              {songs.length} ministry songs loaded with lyrics,
              chord charts, vocal harmonies, and MD notes.
            </p>
          </div>

          <div className="shrink-0">
            {isMD ? (
              <button
                type="button"
                onClick={onAddNewSong}
                className="
                  flex min-h-11 items-center gap-2 rounded-2xl
                  bg-[#007aff] px-5 py-3
                  text-xs font-bold text-white
                  shadow-xl shadow-blue-500/20
                  transition-colors hover:bg-[#0062cc]
                  active:scale-95
                "
              >
                <Plus className="h-4 w-4" />
                <span>Upload New Song</span>
              </button>
            ) : (
              <div className="
                flex min-h-11 items-center gap-2
                rounded-2xl border border-white/10
                bg-white/[0.035] px-4 py-3
                text-xs font-semibold text-white/40
              ">
                <Lock className="h-3.5 w-3.5" />
                <span>Song uploads restricted to MD</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="
        rounded-[28px]
        border border-white/10
        bg-white/[0.045]
        p-4
        backdrop-blur-2xl
        sm:p-5
      ">
        <div className="relative">
          <Search className="
            absolute left-4 top-1/2
            h-4 w-4 -translate-y-1/2
            text-white/35
          " />

          <input
            type="text"
            placeholder="Search by song title, artist, or lyrics..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="
              w-full rounded-2xl
              border border-white/10
              bg-white/[0.035]
              py-3 pl-11 pr-12
              text-sm font-medium text-white
              outline-none
              placeholder:text-white/30
              focus:border-[#007aff]/60
              focus:ring-2 focus:ring-[#007aff]/10
            "
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="
                absolute right-3 top-1/2
                flex h-8 w-8 -translate-y-1/2
                items-center justify-center
                rounded-xl
                text-white/40
                transition-colors
                hover:bg-white/10
                hover:text-white
              "
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          {/* CATEGORIES */}
          <div className="
            flex min-w-0 items-center gap-1.5
            overflow-x-auto pb-1
            scrollbar-none
          ">
            {categories.map(category => {
              const selected =
                selectedCategory === category;

              return (
                <button
                  type="button"
                  key={category}
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`
                    shrink-0 rounded-xl border px-3.5 py-2
                    text-xs font-bold
                    transition-colors
                    ${
                      selected
                        ? `
                          border-[#007aff]/20
                          bg-[#007aff]
                          text-white
                        `
                        : `
                          border-white/5
                          bg-white/[0.035]
                          text-white/45
                          hover:bg-white/[0.08]
                          hover:text-white
                        `
                    }
                  `}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* KEY FILTER */}
          <div className="
            flex shrink-0 items-center gap-2
            self-start sm:self-auto
          ">
            <span className="text-xs font-bold text-white/40">
              Key:
            </span>

            <select
              value={selectedKey}
              onChange={e => setSelectedKey(e.target.value)}
              className="
                rounded-xl
                border border-white/10
                bg-[#1c1c1f]
                px-3 py-2
                text-xs font-bold text-white
                outline-none
                focus:border-[#007aff]/60
              "
            >
              <option value="All">All Keys</option>

              {CHROMATIC_KEYS.map(key => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* RESULTS SUMMARY */}
      <div className="
        flex items-center justify-between
        px-1
      ">
        <div>
          <span className="
            text-[11px]
            font-extrabold
            uppercase
            tracking-wider
            text-[#4da3ff]
          ">
            Repertoire
          </span>

          <p className="mt-0.5 text-xs font-medium text-white/35">
            Showing {filteredSongs.length} of {songs.length} songs
          </p>
        </div>

        {(searchTerm ||
          selectedCategory !== 'All' ||
          selectedKey !== 'All') && (
          <button
            type="button"
            onClick={resetFilters}
            className="
              flex items-center gap-1.5
              rounded-xl
              px-3 py-2
              text-xs font-bold
              text-[#4da3ff]
              transition-colors
              hover:bg-white/[0.055]
              hover:text-white
            "
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        )}
      </div>

      {/* SONG GRID */}
      {filteredSongs.length > 0 ? (
        <div className="
          grid min-w-0
          grid-cols-1 gap-4
          md:grid-cols-2
        ">
          {filteredSongs.map(song => {
            const isPlayingThis =
              playingSongId === song.id;

            const songTitle =
              song.title || 'Untitled Song';

            const songArtist =
              song.artist || '';

            const songCategory =
              song.category || 'Other';

            const songKey =
              song.key || '';

            const tempoDisplay =
              typeof song.tempo === 'string'
                ? song.tempo.split(' ')[0]
                : 'Tempo N/A';

            return (
              <div
                key={song.id}
                onClick={() => onSelectSong(song)}
                className="
                  group flex cursor-pointer
                  min-w-0 flex-col
                  overflow-hidden
                  rounded-[28px]
                  border border-white/10
                  bg-white/[0.05]
                  p-5
                  shadow-2xl shadow-black/10
                  backdrop-blur-2xl
                  transition-colors
                  hover:bg-white/[0.07]
                "
              >
                {/* SONG HEADER */}
                <div className="
                  flex min-w-0 items-start
                  justify-between gap-3
                ">
                  <div className="
                    flex min-w-0 items-center gap-3
                  ">
                    <div className="
                      flex h-12 w-12 shrink-0
                      items-center justify-center
                      rounded-2xl
                      border border-white/10
                      bg-white/[0.035]
                      text-[#4da3ff]
                    ">
                      <Music className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <span className="
                        block
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-[#4da3ff]
                      ">
                        {songCategory}
                      </span>

                      <h3 className="
                        truncate
                        text-lg
                        font-bold
                        tracking-tight
                        text-white
                      ">
                        {songTitle}
                      </h3>

                      <p className="
                        truncate
                        text-xs
                        font-semibold
                        text-white/40
                      ">
                        {songArtist}
                      </p>
                    </div>
                  </div>

                  {/* MUSICAL INFO */}
                  <div className="
                    flex shrink-0 flex-col
                    items-end gap-1
                  ">
                    {songKey && (
                      <span className="
                        rounded-xl
                        border border-[#007aff]/20
                        bg-[#007aff]/15
                        px-2.5 py-1
                        text-xs font-bold
                        text-[#4da3ff]
                      ">
                        Key: {songKey}
                      </span>
                    )}

                    <span className="
                      text-[11px]
                      font-medium
                      text-white/35
                    ">
                      {tempoDisplay}
                    </span>
                  </div>
                </div>

                {/* SONG DETAILS */}
                <div className="
                  my-4 grid grid-cols-3 gap-1.5
                  rounded-2xl
                  border border-white/5
                  bg-black/35
                  p-2.5
                  text-center
                  text-[10px]
                  font-semibold
                  text-white/45
                ">
                  <div className="truncate">
                    Lead:{' '}
                    <span className="text-emerald-300">
                      {song.arrangement?.lead
                        ? 'Ready'
                        : '—'}
                    </span>
                  </div>

                  <div className="truncate">
                    SAT Harmonies
                  </div>

                  <div className="truncate">
                    Band Chart
                  </div>
                </div>

                {/* FOOTER */}
                <div className="
                  mt-auto flex
                  items-center justify-between
                  gap-3
                  border-t border-white/10
                  pt-3
                ">
                  <button
                    type="button"
                    onClick={e =>
                      handleQuickPlay(e, song)
                    }
                    className={`
                      flex min-h-9 items-center
                      gap-1.5 rounded-xl
                      border px-3 py-1.5
                      text-xs font-bold
                      transition-colors
                      ${
                        isPlayingThis
                          ? `
                            border-[#007aff]/20
                            bg-[#007aff]
                            text-white
                            shadow-lg
                            shadow-blue-500/20
                          `
                          : `
                            border-white/5
                            bg-white/[0.035]
                            text-[#4da3ff]
                            hover:bg-white/[0.08]
                          `
                      }
                    `}
                  >
                    {isPlayingThis ? (
                      <Pause className="
                        h-3.5 w-3.5 fill-current
                      " />
                    ) : (
                      <Play className="
                        h-3.5 w-3.5 fill-current
                      " />
                    )}

                    <span>
                      {isPlayingThis
                        ? 'Playing Key...'
                        : 'Key Tone'}
                    </span>
                  </button>

                  <div className="
                    flex min-w-0
                    items-center gap-1.5
                  ">
                    {isMD && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onEditSong(song);
                        }}
                        title="Edit Song"
                        aria-label={`Edit ${songTitle}`}
                        className="
                          flex h-9 w-9
                          shrink-0 items-center
                          justify-center
                          rounded-xl
                          border border-white/5
                          bg-white/[0.035]
                          text-white/45
                          transition-colors
                          hover:bg-white/[0.08]
                          hover:text-white
                        "
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}

                    <span className="
                      hidden
                      truncate
                      rounded-xl
                      border border-white/5
                      bg-white/[0.035]
                      px-3 py-2
                      text-xs font-bold
                      text-[#4da3ff]
                      sm:inline-flex
                    ">
                      View Song
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="
          rounded-[28px]
          border border-white/10
          bg-white/[0.045]
          p-10
          text-center
          shadow-2xl shadow-black/10
          backdrop-blur-2xl
        ">
          <div className="
            mx-auto mb-4
            flex h-14 w-14
            items-center justify-center
            rounded-2xl
            border border-white/10
            bg-white/[0.035]
          ">
            <Search className="
              h-6 w-6
              text-white/35
            " />
          </div>

          <h3 className="
            text-xl
            font-bold
            text-white
          ">
            No songs found
          </h3>

          <p className="
            mx-auto mt-1
            max-w-sm
            text-sm
            text-white/40
          ">
            Try searching for another song title
            or artist, or clear your active filters.
          </p>

          <div className="
            mt-5 flex
            flex-wrap justify-center
            gap-3
          ">
            <button
              type="button"
              onClick={resetFilters}
              className="
                flex items-center gap-2
                rounded-2xl
                border border-white/5
                bg-white/[0.035]
                px-4 py-2.5
                text-xs font-bold
                text-white/70
                transition-colors
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filters
            </button>

            {isMD && (
              <button
                type="button"
                onClick={onAddNewSong}
                className="
                  flex items-center gap-2
                  rounded-2xl
                  bg-[#007aff]
                  px-4 py-2.5
                  text-xs font-bold
                  text-white
                  shadow-lg
                  shadow-blue-500/20
                  transition-colors
                  hover:bg-[#0062cc]
                "
              >
                <Plus className="h-3.5 w-3.5" />
                Add New Song
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
