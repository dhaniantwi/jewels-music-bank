import React, { useMemo, useState } from 'react';
import { Song, ActiveRole } from '../types';
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
  SlidersHorizontal,
  Library,
  ChevronRight,
} from 'lucide-react';
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
  onDeleteSong,
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

      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        title.toLowerCase().includes(search) ||
        artist.toLowerCase().includes(search) ||
        lyrics.toLowerCase().includes(search) ||
        tags.some(tag =>
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
    selectedKey,
  ]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedKey !== 'All';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedKey('All');
  };

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

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 bg-[#0f0f11] text-white animate-in fade-in duration-300">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section
        className="
          relative
          overflow-hidden
          rounded-[30px]
          border border-white/10
          bg-[#111113]
          p-5
          shadow-2xl
          shadow-black/20
          backdrop-blur-2xl
          sm:p-7
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-28
            h-64
            w-64
            rounded-full
            bg-[#007aff]/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-32
            left-1/3
            h-56
            w-56
            rounded-full
            bg-blue-500/[0.04]
            blur-3xl
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div className="min-w-0">
            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-xl
                border border-[#007aff]/20
                bg-[#007aff]/10
                px-3
                py-1.5
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.16em]
                text-[#4da3ff]
              "
            >
              <Library className="h-3.5 w-3.5" />
              Music Ministry Repertoire
            </div>

            <h1
              className="
                text-3xl
                font-black
                tracking-tight
                text-white
                sm:text-4xl
              "
            >
              Song Bank
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                font-medium
                leading-6
                text-white/40
              "
            >
              Your central ministry library for lyrics,
              keys, arrangements, harmonies, and
              performance-ready song information.
            </p>
          </div>

          <div className="relative shrink-0">
            {isMD ? (
              <button
                type="button"
                onClick={onAddNewSong}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#007aff]
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-xl
                  shadow-blue-500/20
                  transition-all
                  hover:bg-[#006fe6]
                  hover:shadow-blue-500/30
                  active:scale-[0.98]
                  sm:w-auto
                "
              >
                <Plus className="h-4 w-4" />
                Upload New Song
              </button>
            ) : (
              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.035]
                  px-4
                  py-3
                  text-xs
                  font-semibold
                  text-white/35
                "
              >
                <Lock className="h-3.5 w-3.5" />
                MD uploads only
              </div>
            )}
          </div>
        </div>

        {/* MINI STATS */}
        <div
          className="
            relative
            mt-7
            grid
            grid-cols-2
            gap-2
            sm:grid-cols-4
          "
        >
          <div
            className="
              rounded-2xl
              border border-white/10
              bg-black/20
              px-4
              py-3
            "
          >
            <p
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.16em]
                text-white/30
              "
            >
              Total Songs
            </p>

            <p
              className="
                mt-1
                text-lg
                font-black
                text-white
              "
            >
              {songs.length}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border border-white/10
              bg-black/20
              px-4
              py-3
            "
          >
            <p
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.16em]
                text-white/30
              "
            >
              Showing
            </p>

            <p
              className="
                mt-1
                text-lg
                font-black
                text-[#4da3ff]
              "
            >
              {filteredSongs.length}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border border-white/10
              bg-black/20
              px-4
              py-3
            "
          >
            <p
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.16em]
                text-white/30
              "
            >
              Categories
            </p>

            <p
              className="
                mt-1
                text-lg
                font-black
                text-white
              "
            >
              {categories.length - 1}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border border-white/10
              bg-black/20
              px-4
              py-3
            "
          >
            <p
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.16em]
                text-white/30
              "
            >
              Access
            </p>

            <p
              className="
                mt-1
                text-lg
                font-black
                text-white
              "
            >
              {isMD ? 'MD' : 'Member'}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEARCH / FILTERS
      ========================================================= */}
      <section
        className="
          rounded-[28px]
          border border-white/10
          bg-[#111113]/95
          p-4
          shadow-2xl
          shadow-black/15
          backdrop-blur-2xl
          sm:p-5
        "
      >
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border border-white/10
              bg-white/[0.035]
              text-white/35
            "
          >
            <SlidersHorizontal className="h-4 w-4" />
          </div>

          <div>
            <p
              className="
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.16em]
                text-white/30
              "
            >
              Find a Song
            </p>

            <p
              className="
                mt-0.5
                text-xs
                font-medium
                text-white/45
              "
            >
              Search and refine the repertoire
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mt-4">
          <Search
            className="
              absolute
              left-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-white/25
            "
          />

          <input
            type="text"
            placeholder="Search title, artist, lyrics, or tags..."
            value={searchTerm}
            onChange={e =>
              setSearchTerm(e.target.value)
            }
            className="
              w-full
              rounded-2xl
              border border-white/10
              bg-[#0c0c0e]
              py-3.5
              pl-11
              pr-12
              text-sm
              font-medium
              text-white
              outline-none
              transition-all
              placeholder:text-white/25
              focus:border-[#007aff]/50
              focus:bg-[#0e0e10]
              focus:ring-2
              focus:ring-[#007aff]/10
            "
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="
                absolute
                right-3
                top-1/2
                flex
                h-8
                w-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-xl
                border border-white/5
                bg-white/[0.06]
                text-white/40
                transition-colors
                hover:bg-white/[0.1]
                hover:text-white
              "
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mt-4">
          <div
            className="
              mb-2
              flex
              items-center
              justify-between
            "
          >
            <span
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.16em]
                text-white/25
              "
            >
              Category
            </span>

            <span
              className="
                text-[9px]
                font-bold
                text-white/20
              "
            >
              {selectedCategory}
            </span>
          </div>

          <div
            className="
              flex
              min-w-0
              gap-1.5
              overflow-x-auto
              pb-1
              scrollbar-none
            "
          >
            {categories.map(category => {
              const active =
                selectedCategory === category;

              return (
                <button
                  type="button"
                  key={category}
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`
                    whitespace-nowrap
                    rounded-xl
                    border
                    px-3.5
                    py-2
                    text-xs
                    font-bold
                    transition-all
                    active:scale-[0.97]
                    ${
                      active
                        ? `
                          border-[#007aff]/40
                          bg-[#007aff]
                          text-white
                          shadow-lg
                          shadow-blue-500/15
                        `
                        : `
                          border-white/5
                          bg-white/[0.035]
                          text-white/40
                          hover:border-white/10
                          hover:bg-white/[0.07]
                          hover:text-white/80
                        `
                    }
                  `}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* KEY FILTER */}
        <div
          className="
            mt-4
            flex
            flex-col
            gap-2
            border-t
            border-white/5
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <span
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.16em]
                text-white/25
              "
            >
              Musical Key
            </span>

            <p
              className="
                mt-0.5
                text-[11px]
                font-medium
                text-white/30
              "
            >
              Filter songs by their original key
            </p>
          </div>

          <select
            value={selectedKey}
            onChange={e =>
              setSelectedKey(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border border-white/10
              bg-[#0c0c0e]
              px-3
              py-2.5
              text-xs
              font-bold
              text-white
              outline-none
              transition-colors
              focus:border-[#007aff]/50
              sm:w-auto
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
      </section>

      {/* =========================================================
          RESULTS BAR
      ========================================================= */}
      <div
        className="
          flex
          flex-col
          gap-3
          px-1
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#007aff]
                shadow-[0_0_10px_rgba(0,122,255,0.7)]
              "
            />

            <span
              className="
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.18em]
                text-[#4da3ff]
              "
            >
              Repertoire
            </span>
          </div>

          <p
            className="
              mt-1
              text-xs
              font-medium
              text-white/30
            "
          >
            Showing {filteredSongs.length} of{' '}
            {songs.length} songs
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="
              flex
              w-fit
              items-center
              gap-1.5
              rounded-xl
              border border-white/5
              bg-white/[0.035]
              px-3
              py-2
              text-xs
              font-bold
              text-white/40
              transition-all
              hover:border-white/10
              hover:bg-white/[0.07]
              hover:text-white
            "
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        )}
      </div>

      {/* =========================================================
          SONG GRID
      ========================================================= */}
      {filteredSongs.length > 0 ? (
        <div
          className="
            grid
            grid-cols-1
            gap-4
            xl:grid-cols-2
          "
        >
          {filteredSongs.map(song => {
            const isPlayingThis =
              playingSongId === song.id;

            const songTitle =
              song.title || 'Untitled Song';

            const songArtist =
              song.artist || 'Unknown Artist';

            const songCategory =
              song.category || 'Other';

            const songKey =
              song.key || '—';

            const tempoDisplay =
              typeof song.tempo === 'string'
                ? song.tempo.split(' ')[0]
                : 'Tempo N/A';

            return (
              <article
                key={song.id}
                onClick={() =>
                  onSelectSong(song)
                }
                className="
                  group
                  relative
                  cursor-pointer
                  overflow-hidden
                  rounded-[28px]
                  border border-white/10
                  bg-[#111113]
                  p-5
                  shadow-2xl
                  shadow-black/15
                  backdrop-blur-2xl
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-white/[0.16]
                  hover:bg-[#131315]
                  hover:shadow-black/30
                "
              >
                {/* BLUE EDGE GLOW */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    bg-[#007aff]/[0.045]
                    blur-3xl
                    transition-opacity
                    group-hover:opacity-100
                  "
                />

                {/* TOP ROW */}
                <div
                  className="
                    relative
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3.5
                    "
                  >
                    <div
                      className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        border border-white/10
                        bg-[#0b0b0d]
                        shadow-inner
                        shadow-white/[0.02]
                        transition-colors
                        group-hover:border-[#007aff]/20
                      "
                    >
                      {song.icon ? (
                        <span className="text-xl">
                          {song.icon}
                        </span>
                      ) : (
                        <Music
                          className="
                            h-5
                            w-5
                            text-white/30
                            transition-colors
                            group-hover:text-[#4da3ff]
                          "
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div
                        className="
                          mb-1
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <span
                          className="
                            truncate
                            text-[9px]
                            font-extrabold
                            uppercase
                            tracking-[0.16em]
                            text-[#4da3ff]
                          "
                        >
                          {songCategory}
                        </span>
                      </div>

                      <h3
                        className="
                          truncate
                          text-lg
                          font-extrabold
                          tracking-tight
                          text-white
                          sm:text-xl
                        "
                      >
                        {songTitle}
                      </h3>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-xs
                          font-semibold
                          text-white/35
                        "
                      >
                        {songArtist}
                      </p>
                    </div>
                  </div>

                  {/* KEY / TEMPO */}
                  <div
                    className="
                      flex
                      shrink-0
                      flex-col
                      items-end
                      gap-1.5
                    "
                  >
                    <span
                      className="
                        rounded-xl
                        border border-[#007aff]/20
                        bg-[#007aff]/10
                        px-2.5
                        py-1
                        text-[10px]
                        font-extrabold
                        text-[#4da3ff]
                      "
                    >
                      {songKey}
                    </span>

                    <span
                      className="
                        text-[10px]
                        font-bold
                        text-white/25
                      "
                    >
                      {tempoDisplay}
                    </span>
                  </div>
                </div>

                {/* SONG CAPABILITIES */}
                <div
                  className="
                    relative
                    my-4
                    grid
                    grid-cols-3
                    gap-1.5
                    rounded-2xl
                    border border-white/5
                    bg-black/25
                    p-1.5
                  "
                >
                  <div
                    className="
                      rounded-xl
                      bg-white/[0.025]
                      px-2
                      py-2
                      text-center
                    "
                  >
                    <span
                      className="
                        block
                        text-[8px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-white/20
                      "
                    >
                      Lead
                    </span>

                    <span
                      className="
                        mt-0.5
                        block
                        truncate
                        text-[10px]
                        font-bold
                        text-white/45
                      "
                    >
                      {song.arrangement?.lead
                        ? 'Ready'
                        : '—'}
                    </span>
                  </div>

                  <div
                    className="
                      rounded-xl
                      bg-white/[0.025]
                      px-2
                      py-2
                      text-center
                    "
                  >
                    <span
                      className="
                        block
                        text-[8px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-white/20
                      "
                    >
                      Harmony
                    </span>

                    <span
                      className="
                        mt-0.5
                        block
                        truncate
                        text-[10px]
                        font-bold
                        text-amber-300/70
                      "
                    >
                      SAT
                    </span>
                  </div>

                  <div
                    className="
                      rounded-xl
                      bg-white/[0.025]
                      px-2
                      py-2
                      text-center
                    "
                  >
                    <span
                      className="
                        block
                        text-[8px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-white/20
                      "
                    >
                      Band
                    </span>

                    <span
                      className="
                        mt-0.5
                        block
                        truncate
                        text-[10px]
                        font-bold
                        text-white/45
                      "
                    >
                      Chart
                    </span>
                  </div>
                </div>

                {/* FOOTER */}
                <div
                  className="
                    relative
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-white/5
                    pt-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  {/* KEY TONE */}
                  <button
                    type="button"
                    onClick={e =>
                      handleQuickPlay(e, song)
                    }
                    className={`
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      rounded-xl
                      border
                      px-3
                      py-2
                      text-xs
                      font-bold
                      transition-all
                      active:scale-[0.97]
                      ${
                        isPlayingThis
                          ? `
                            border-[#007aff]/40
                            bg-[#007aff]
                            text-white
                            shadow-lg
                            shadow-blue-500/20
                          `
                          : `
                            border-white/5
                            bg-white/[0.035]
                            text-[#4da3ff]
                            hover:border-[#007aff]/20
                            hover:bg-[#007aff]/10
                          `
                      }
                    `}
                  >
                    {isPlayingThis ? (
                      <Pause className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <Play className="h-3.5 w-3.5 fill-current" />
                    )}

                    {isPlayingThis
                      ? 'Playing Key...'
                      : 'Key Tone'}
                  </button>

                  {/* ACTIONS */}
                  <div
                    className="
                      flex
                      items-center
                      justify-end
                      gap-1.5
                    "
                  >
                    {isMD && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onEditSong(song);
                        }}
                        title="Edit Song"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          border border-white/5
                          bg-white/[0.035]
                          text-white/35
                          transition-all
                          hover:border-white/10
                          hover:bg-white/[0.08]
                          hover:text-white
                        "
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onSelectSong(song);
                      }}
                      className="
                        flex
                        items-center
                        gap-1
                        rounded-xl
                        border border-white/5
                        bg-white/[0.035]
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-white/55
                        transition-all
                        hover:border-[#007aff]/20
                        hover:bg-[#007aff]/10
                        hover:text-[#4da3ff]
                      "
                    >
                      View Song
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* =======================================================
           EMPTY STATE
        ======================================================= */
        <section
          className="
            rounded-[30px]
            border border-white/10
            bg-[#111113]
            px-5
            py-20
            text-center
            shadow-2xl
            shadow-black/15
            backdrop-blur-2xl
          "
        >
          <div
            className="
              mx-auto
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              border border-white/10
              bg-[#0b0b0d]
              shadow-inner
              shadow-white/[0.02]
            "
          >
            <Music className="h-7 w-7 text-white/25" />
          </div>

          <div
            className="
              mx-auto
              mb-2
              w-fit
              rounded-lg
              border border-white/5
              bg-white/[0.025]
              px-2.5
              py-1
              text-[9px]
              font-extrabold
              uppercase
              tracking-[0.16em]
              text-white/25
            "
          >
            Song Bank
          </div>

          <h3
            className="
              text-xl
              font-extrabold
              tracking-tight
              text-white
            "
          >
            No songs found
          </h3>

          <p
            className="
              mx-auto
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-white/35
            "
          >
            No songs match your current search
            or filters. Try another title, artist,
            category, or key.
          </p>

          <div
            className="
              mt-6
              flex
              flex-col
              justify-center
              gap-2
              sm:flex-row
            "
          >
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  border border-white/5
                  bg-white/[0.035]
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-white/55
                  transition-all
                  hover:border-white/10
                  hover:bg-white/[0.08]
                  hover:text-white
                "
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </button>
            )}

            {isMD && (
              <button
                type="button"
                onClick={onAddNewSong}
                className="
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  bg-[#007aff]
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-white
                  shadow-lg
                  shadow-blue-500/20
                  transition-all
                  hover:bg-[#006fe6]
                  active:scale-[0.98]
                "
              >
                <Plus className="h-3.5 w-3.5" />
                Add New Song
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
