import React, { useState, useMemo } from 'react';
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
  RotateCcw
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
        tags.some(tag =>
          tag.toLowerCase().includes(search)
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
    <div className="w-full min-w-0 max-w-full space-y-5 bg-[#0f0f11] text-white animate-in fade-in duration-200">

      {/* HEADER */}
      <section
        className="
          rounded-[28px]
          border border-white/10
          bg-[#111113]/90
          p-5
          sm:p-6
          shadow-2xl
          shadow-black/10
          backdrop-blur-2xl
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div className="min-w-0">
            <div
              className="
                mb-3
                inline-flex
                items-center
                rounded-xl
                border border-[#007aff]/20
                bg-[#007aff]/15
                px-3
                py-1.5
                text-[11px]
                font-extrabold
                uppercase
                tracking-wider
                text-[#4da3ff]
              "
            >
              MUSIC MINISTRY REPERTOIRE
            </div>

            <h1
              className="
                text-3xl
                font-extrabold
                tracking-tight
                text-white
                sm:text-4xl
              "
            >
              Song Bank Library
            </h1>

            <p
              className="
                mt-1
                max-w-2xl
                text-sm
                font-medium
                text-white/45
              "
            >
              {songs.length} ministry songs loaded
              with lyrics, chord charts, vocal
              harmonies, and MD notes.
            </p>
          </div>

          <div className="flex shrink-0 items-center">
            {isMD ? (
              <button
                type="button"
                onClick={onAddNewSong}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-[#007aff]
                  px-5
                  py-3
                  text-xs
                  font-bold
                  text-white
                  shadow-xl
                  shadow-blue-500/20
                  transition-colors
                  hover:bg-[#0062cc]
                  active:scale-95
                  sm:text-sm
                "
              >
                <Plus className="h-4 w-4" />
                <span>Upload New Song</span>
              </button>
            ) : (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border border-white/10
                  bg-[#1c1c1f]
                  px-3.5
                  py-2.5
                  text-xs
                  font-semibold
                  text-white/40
                "
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Song uploads restricted to MD</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section
        className="
          rounded-[28px]
          border border-white/10
          bg-[#111113]/90
          p-4
          shadow-2xl
          shadow-black/10
          backdrop-blur-2xl
          sm:p-5
        "
      >
        <div className="relative">
          <Search
            className="
              absolute
              left-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-white/35
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
              rounded-2xl
              border border-white/10
              bg-[#0f0f11]
              py-3
              pl-11
              pr-16
              text-sm
              font-medium
              text-white
              outline-none
              placeholder:text-white/30
              focus:border-[#007aff]/60
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
                bg-[#1c1c1f]
                text-white/45
                hover:bg-white/[0.08]
                hover:text-white
              "
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div
          className="
            mt-4
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
              overflow-x-auto
              pb-1
              scrollbar-none
            "
          >
            {categories.map(category => (
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
                  transition-colors
                  ${
                    selectedCategory === category
                      ? `
                        border-[#007aff]/40
                        bg-[#007aff]
                        text-white
                        shadow-lg
                        shadow-blue-500/20
                      `
                      : `
                        border-white/5
                        bg-[#1c1c1f]
                        text-white/45
                        hover:bg-white/[0.08]
                        hover:text-white
                      `
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
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
                setSelectedKey(e.target.value)
              }
              className="
                rounded-xl
                border border-white/10
                bg-[#1c1c1f]
                px-2.5
                py-1.5
                text-xs
                font-bold
                text-white
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
              mt-0.5
              text-xs
              font-medium
              text-white/35
            "
          >
            Showing {filteredSongs.length} of{' '}
            {songs.length} songs
          </p>
        </div>

        {(searchTerm ||
          selectedCategory !== 'All' ||
          selectedKey !== 'All') && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedKey('All');
            }}
            className="
              flex
              items-center
              gap-1.5
              rounded-xl
              border border-white/5
              bg-[#111113]
              px-3
              py-2
              text-xs
              font-bold
              text-white/45
              hover:bg-white/[0.08]
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
        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
          "
        >
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
                onClick={() =>
                  onSelectSong(song)
                }
                className="
                  group
                  relative
                  flex
                  cursor-pointer
                  flex-col
                  justify-between
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-white/10
                  bg-[#111113]
                  p-5
                  shadow-2xl
                  shadow-black/10
                  backdrop-blur-2xl
                "
              >
                {/* SONG HEADER */}
                <div
                  className="
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
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-13
                        w-13
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        border border-white/10
                        bg-[#0f0f11]
                      "
                    >
                      {song.icon ? (
                        <span className="text-xl">
                          {song.icon}
                        </span>
                      ) : (
                        <Music className="h-5 w-5 text-white/45" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <span
                        className="
                          block
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-wider
                          text-[#4da3ff]
                        "
                      >
                        {songCategory}
                      </span>

                      <h3
                        className="
                          truncate
                          text-lg
                          font-bold
                          tracking-tight
                          text-white
                        "
                      >
                        {songTitle}
                      </h3>

                      <p
                        className="
                          truncate
                          text-xs
                          font-semibold
                          text-white/40
                        "
                      >
                        {songArtist}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      shrink-0
                      flex-col
                      items-end
                      gap-1
                    "
                  >
                    <span
                      className="
                        rounded-lg
                        border border-[#007aff]/20
                        bg-[#007aff]/15
                        px-2
                        py-0.5
                        text-xs
                        font-extrabold
                        text-[#4da3ff]
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
                    my-3
                    grid
                    grid-cols-3
                    gap-1.5
                    rounded-2xl
                    border border-white/10
                    bg-black/35
                    p-2.5
                    text-center
                    text-[10px]
                    font-semibold
                    text-white/40
                  "
                >
                  <div className="truncate">
                    Lead:{' '}
                    {song.arrangement?.lead
                      ? 'Ready'
                      : '—'}
                  </div>

                  <div
                    className="
                      truncate
                      text-amber-300
                    "
                  >
                    SAT Harmonies
                  </div>

                  <div className="truncate">
                    Band Chart
                  </div>
                </div>

                {/* FOOTER */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-white/10
                    pt-3
                  "
                >
                  <button
                    type="button"
                    onClick={e =>
                      handleQuickPlay(e, song)
                    }
                    className={`
                      flex
                      items-center
                      gap-1.5
                      rounded-xl
                      border
                      px-3
                      py-2
                      text-xs
                      font-bold
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
                            bg-[#1c1c1f]
                            text-[#4da3ff]
                            hover:bg-white/[0.08]
                          `
                      }
                    `}
                  >
                    {isPlayingThis ? (
                      <Pause
                        className="h-3.5 w-3.5 fill-current"
                      />
                    ) : (
                      <Play
                        className="h-3.5 w-3.5 fill-current"
                      />
                    )}

                    <span>
                      {isPlayingThis
                        ? 'Playing Key...'
                        : 'Key Tone'}
                    </span>
                  </button>

                  <div
                    className="
                      flex
                      items-center
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
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-xl
                          border border-white/5
                          bg-[#1c1c1f]
                          text-white/40
                          hover:bg-white/[0.08]
                          hover:text-white
                        "
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <span
                      className="
                        flex
                        items-center
                        gap-1
                        rounded-xl
                        border border-white/5
                        bg-[#1c1c1f]
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-[#4da3ff]
                      "
                    >
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
        <div
          className="
            rounded-[28px]
            border border-white/10
            bg-[#111113]
            px-4
            py-16
            text-center
            shadow-2xl
            shadow-black/10
            backdrop-blur-2xl
          "
        >
          <div
            className="
              mx-auto
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              border border-white/10
              bg-[#0f0f11]
            "
          >
            <Music className="h-7 w-7 text-white/35" />
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
              mx-auto
              mt-1
              max-w-sm
              text-sm
              text-white/40
            "
          >
            Try searching for another song
            title or artist, or clear your
            active filters.
          </p>

          <div
            className="
              mt-5
              flex
              justify-center
              gap-3
            "
          >
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedKey('All');
              }}
              className="
                flex
                items-center
                gap-1.5
                rounded-xl
                border border-white/5
                bg-[#1c1c1f]
                px-4
                py-2
                text-xs
                font-bold
                text-white/70
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
                  flex
                  items-center
                  gap-1.5
                  rounded-xl
                  bg-[#007aff]
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-white
                  shadow-lg
                  shadow-blue-500/20
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
