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
  const [selectedCategory, setSelectedCategory] =
    useState('All');
  const [selectedKey, setSelectedKey] =
    useState('All');
  const [playingSongId, setPlayingSongId] =
    useState<string | null>(null);

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
     FILTER SONGS
  ========================================= */

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const title = song.title || '';
      const artist = song.artist || '';
      const lyrics = song.lyrics || '';
      const tags = song.tags || [];
      const category = song.category || '';
      const key = song.key || '';

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        title
          .toLowerCase()
          .includes(search) ||
        artist
          .toLowerCase()
          .includes(search) ||
        lyrics
          .toLowerCase()
          .includes(search) ||
        tags.some(tag =>
          tag
            .toLowerCase()
            .includes(search)
        );

      const matchesCategory =
        selectedCategory === 'All' ||
        category === selectedCategory;

      const matchesKey =
        selectedKey === 'All' ||
        key.toLowerCase() ===
          selectedKey.toLowerCase();

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
     PLAY KEY TONE
  ========================================= */

  const handleQuickPlay = (
    e: React.MouseEvent,
    song: Song
  ) => {
    e.stopPropagation();

    if (
      playingSongId === song.id
    ) {
      setPlayingSongId(null);
      return;
    }

    setPlayingSongId(song.id);

    const songKey =
      song.key || 'C';

    playPitchTone(
      `${songKey.replace('m', '')}4`,
      3
    );

    setTimeout(() => {
      setPlayingSongId(prev =>
        prev === song.id
          ? null
          : prev
      );
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* =========================================
          HEADER
      ========================================= */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-white/[0.045]
          border border-white/10
          backdrop-blur-xl
          p-6
          sm:p-8
          shadow-2xl
          shadow-black/20
        "
      >

        <div
          className="
            absolute
            -top-24
            -right-24
            w-72
            h-72
            rounded-full
            bg-[#007aff]/10
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            -bottom-32
            left-1/3
            w-64
            h-64
            rounded-full
            bg-[#7c3aed]/8
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            relative
            z-10
            flex
            flex-col
            md:flex-row
            md:items-center
            justify-between
            gap-5
          "
        >

          <div>

            <span
              className="
                inline-flex
                items-center
                px-3
                py-1.5
                rounded-full
                bg-[#007aff]/10
                border border-[#007aff]/20
                text-[#4da3ff]
                text-[11px]
                font-extrabold
                uppercase
                tracking-wider
                mb-3
              "
            >
              MUSIC MINISTRY REPERTOIRE
            </span>

            <h1
              className="
                text-3xl
                sm:text-4xl
                font-extrabold
                text-white
                tracking-tight
              "
            >
              Song Bank Library
            </h1>

            <p
              className="
                text-sm
                text-white/45
                font-medium
                mt-1
                max-w-2xl
              "
            >
              {songs.length} ministry songs
              loaded with lyrics, chord charts,
              vocal harmonies, and MD notes.
            </p>

          </div>


          {/* ADD SONG */}

          <div
            className="
              flex
              items-center
              gap-2
              flex-shrink-0
            "
          >

            {isMD ? (

              <button
                onClick={onAddNewSong}
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-[#007aff]
                  hover:bg-[#007aff]/90
                  text-white
                  text-xs
                  sm:text-sm
                  font-bold
                  flex
                  items-center
                  gap-2
                  shadow-lg
                  shadow-[#007aff]/20
                  transition-all
                  active:scale-95
                "
              >
                <Plus className="w-4 h-4" />

                <span>
                  Upload New Song
                </span>
              </button>

            ) : (

              <div
                className="
                  px-3.5
                  py-2.5
                  rounded-2xl
                  bg-white/[0.04]
                  text-white/35
                  text-xs
                  font-semibold
                  flex
                  items-center
                  gap-1.5
                  border border-white/10
                "
              >
                <span>
                  🔒 Song uploads restricted to MD
                </span>
              </div>

            )}

          </div>

        </div>

      </section>


      {/* =========================================
          SEARCH + FILTERS
      ========================================= */}

      <section
        className="
          rounded-[28px]
          bg-white/[0.045]
          border border-white/10
          backdrop-blur-xl
          p-4
          sm:p-5
          space-y-4
          shadow-xl
          shadow-black/10
        "
      >

        {/* SEARCH */}

        <div className="relative">

          <Search
            className="
              w-4
              h-4
              text-white/35
              absolute
              left-4
              top-1/2
              -translate-y-1/2
            "
          />

          <input
            type="text"
            placeholder="Search by song title, artist, or lyrics..."
            value={searchTerm}
            onChange={e =>
              setSearchTerm(e.target.value)
            }
            className="
              w-full
              bg-white/[0.045]
              border border-white/10
              rounded-2xl
              pl-11
              pr-16
              py-3
              text-sm
              text-white
              placeholder:text-white/30
              outline-none
              focus:border-[#007aff]/60
              focus:ring-2
              focus:ring-[#007aff]/10
              transition-all
              font-medium
            "
          />

          {searchTerm && (

            <button
              onClick={() =>
                setSearchTerm('')
              }
              className="
                text-xs
                font-bold
                text-white/35
                hover:text-white
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                transition-colors
              "
            >
              Clear
            </button>

          )}

        </div>


        {/* FILTER ROW */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            justify-between
            gap-3
            pt-1
          "
        >

          {/* CATEGORIES */}

          <div
            className="
              flex
              items-center
              gap-1.5
              overflow-x-auto
              pb-1
              sm:pb-0
              scrollbar-none
            "
          >

            {categories.map(category => (

              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`
                  px-3.5
                  py-1.5
                  rounded-full
                  text-xs
                  font-bold
                  whitespace-nowrap
                  transition-all
                  ${
                    selectedCategory ===
                    category
                      ? `
                        bg-[#007aff]
                        text-white
                        shadow-lg
                        shadow-[#007aff]/20
                      `
                      : `
                        bg-white/[0.04]
                        text-white/45
                        border
                        border-white/[0.06]
                        hover:text-white
                        hover:bg-white/[0.08]
                      `
                  }
                `}
              >
                {category}
              </button>

            ))}

          </div>


          {/* KEY FILTER */}

          <div
            className="
              flex
              items-center
              gap-2
              flex-shrink-0
              self-end
              sm:self-auto
            "
          >

            <span
              className="
                text-xs
                font-bold
                text-white/35
              "
            >
              Key:
            </span>

            <select
              value={selectedKey}
              onChange={e =>
                setSelectedKey(
                  e.target.value
                )
              }
              className="
                bg-[#17171a]
                border border-white/10
                rounded-xl
                px-2.5
                py-1.5
                text-xs
                font-bold
                text-white
                outline-none
                focus:border-[#007aff]/60
              "
            >

              <option value="All">
                All Keys
              </option>

              {CHROMATIC_KEYS.map(key => (

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

      </section>


      {/* =========================================
          RESULTS SUMMARY
      ========================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          px-1
        "
      >

        <div>

          <span
            className="
              text-[11px]
              font-extrabold
              uppercase
              tracking-wider
              text-[#4da3ff]
            "
          >
            REPERTOIRE
          </span>

          <p
            className="
              text-xs
              text-white/35
              font-medium
              mt-0.5
            "
          >
            Showing {filteredSongs.length}
            {' '}
            of {songs.length} songs
          </p>

        </div>

        {(searchTerm ||
          selectedCategory !== 'All' ||
          selectedKey !== 'All') && (

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedKey('All');
            }}
            className="
              text-xs
              font-bold
              text-[#4da3ff]
              hover:text-white
              transition-colors
            "
          >
            Reset Filters
          </button>

        )}

      </div>


      {/* =========================================
          SONG GRID
      ========================================= */}

      {filteredSongs.length > 0 ? (

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >

          {filteredSongs.map(song => {

            const isPlayingThis =
              playingSongId === song.id;

            const songTitle =
              song.title ||
              'Untitled Song';

            const songArtist =
              song.artist || '';

            const songCategory =
              song.category ||
              'Other';

            const songKey =
              song.key || '';

            const tempoDisplay =
              typeof song.tempo === 'string'
                ? song.tempo.split(' ')[0]
                : 'Tempo N/A';

            return (

              <div
                key={song.id}
                onClick={() =>
                  onSelectSong(song)
                }
                className="
                  ios-card
                  p-5
                  cursor-pointer
                  group
                  flex
                  flex-col
                  justify-between
                  relative
                  overflow-hidden
                "
              >

                {/* SUBTLE BLUE GLOW */}

                <div
                  className="
                    absolute
                    -top-16
                    -right-16
                    w-32
                    h-32
                    rounded-full
                    bg-[#007aff]/5
                    blur-2xl
                    pointer-events-none
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                  "
                />


                {/* SONG HEADER */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    items-start
                    justify-between
                    gap-3
                    mb-3
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      min-w-0
                    "
                  >

                    <div
                      className="
                        w-13
                        h-13
                        rounded-2xl
                        bg-white/[0.05]
                        border border-white/[0.08]
                        flex
                        items-center
                        justify-center
                        text-2xl
                        flex-shrink-0
                        group-hover:scale-105
                        transition-transform
                      "
                    >
                      {song.icon || '🎵'}
                    </div>


                    <div className="min-w-0">

                      <span
                        className="
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-wider
                          text-[#4da3ff]
                          block
                        "
                      >
                        {songCategory}
                      </span>

                      <h3
                        className="
                          text-lg
                          font-bold
                          text-white
                          tracking-tight
                          truncate
                          group-hover:text-[#4da3ff]
                          transition-colors
                        "
                      >
                        {songTitle}
                      </h3>

                      <p
                        className="
                          text-xs
                          font-semibold
                          text-white/40
                          truncate
                        "
                      >
                        {songArtist}
                      </p>

                    </div>

                  </div>


                  {/* MUSICAL BADGES */}

                  <div
                    className="
                      flex
                      flex-col
                      items-end
                      gap-1
                      flex-shrink-0
                    "
                  >

                    <span
                      className="
                        text-xs
                        font-extrabold
                        text-[#4da3ff]
                        bg-[#007aff]/10
                        border border-[#007aff]/10
                        px-2
                        py-0.5
                        rounded-lg
                      "
                    >
                      Key: {songKey}
                    </span>

                    <span
                      className="
                        text-[11px]
                        font-medium
                        text-white/35
                      "
                    >
                      {tempoDisplay}
                    </span>

                  </div>

                </div>


                {/* VOCAL SUMMARY */}

                <div
                  className="
                    relative
                    z-10
                    grid
                    grid-cols-3
                    gap-1.5
                    my-2
                    p-2
                    rounded-xl
                    bg-white/[0.025]
                    border border-white/[0.05]
                    text-center
                    text-[10px]
                    font-semibold
                    text-white/40
                  "
                >

                  <div className="truncate">

                    👑 Lead:{' '}

                    {song.arrangement?.lead
                      ? 'Ready'
                      : '—'}

                  </div>

                  <div
                    className="
                      truncate
                      text-[#a78bfa]
                    "
                  >
                    🎶 SAT Harmonies
                  </div>

                  <div className="truncate">
                    🎹 Band Chart
                  </div>

                </div>


                {/* FOOTER */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    items-center
                    justify-between
                    pt-3
                    mt-1
                    border-t
                    border-white/10
                  "
                >

                  {/* PLAY KEY */}

                  <button
                    onClick={e =>
                      handleQuickPlay(
                        e,
                        song
                      )
                    }
                    className={`
                      px-3
                      py-1.5
                      rounded-xl
                      text-xs
                      font-bold
                      flex
                      items-center
                      gap-1.5
                      transition-all
                      ${
                        isPlayingThis
                          ? `
                            bg-[#007aff]
                            text-white
                            shadow-lg
                            shadow-[#007aff]/20
                            scale-105
                          `
                          : `
                            bg-white/[0.05]
                            hover:bg-[#007aff]/10
                            text-[#4da3ff]
                            border
                            border-white/[0.06]
                          `
                      }
                    `}
                  >

                    {isPlayingThis ? (

                      <Pause
                        className="
                          w-3.5
                          h-3.5
                          fill-current
                        "
                      />

                    ) : (

                      <Play
                        className="
                          w-3.5
                          h-3.5
                          fill-current
                        "
                      />

                    )}

                    <span>
                      {isPlayingThis
                        ? 'Playing Key...'
                        : 'Key Tone'}
                    </span>

                  </button>


                  {/* ACTIONS */}

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >

                    {isMD && (

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onEditSong(song);
                        }}
                        title="Edit Song"
                        className="
                          w-8
                          h-8
                          rounded-lg
                          bg-white/[0.05]
                          hover:bg-white/10
                          border border-white/[0.06]
                          flex
                          items-center
                          justify-center
                          text-white/40
                          hover:text-white
                          transition-all
                        "
                      >
                        <Edit
                          className="
                            w-3.5
                            h-3.5
                          "
                        />
                      </button>

                    )}

                    <span
                      className="
                        text-xs
                        font-bold
                        text-[#4da3ff]
                        group-hover:translate-x-1
                        transition-transform
                        flex
                        items-center
                        gap-1
                      "
                    >
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

        <div
          className="
            text-center
            py-16
            px-4
            rounded-[32px]
            bg-white/[0.045]
            border border-white/10
            backdrop-blur-xl
            shadow-xl
            shadow-black/10
          "
        >

          <div
            className="
              w-16
              h-16
              rounded-3xl
              bg-white/[0.05]
              border border-white/[0.07]
              flex
              items-center
              justify-center
              text-3xl
              mx-auto
              mb-4
            "
          >
            😔
          </div>

          <h3
            className="
              text-xl
              font-bold
              text-white
            "
          >
            No songs found
          </h3>

          <p
            className="
              text-sm
              text-white/40
              mt-1
              max-w-sm
              mx-auto
            "
          >
            Try searching for another song
            title or artist, or clear your
            active filters.
          </p>

          <div
            className="
              flex
              justify-center
              gap-3
              mt-4
            "
          >

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedKey('All');
              }}
              className="
                px-4
                py-2
                rounded-xl
                bg-white/[0.05]
                hover:bg-white/10
                border border-white/[0.06]
                text-xs
                font-bold
                text-white/70
                transition-all
              "
            >
              Reset Filters
            </button>


            {isMD && (

              <button
                onClick={onAddNewSong}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-[#007aff]
                  hover:bg-[#007aff]/90
                  text-white
                  text-xs
                  font-bold
                  shadow-lg
                  shadow-[#007aff]/20
                  transition-all
                "
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
