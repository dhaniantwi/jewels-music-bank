 import React, {
  useMemo,
  useState,
} from 'react';
import { Song, ActiveRole } from '../types';
import {
  Search,
  Plus,
  Play,
  Edit,
  Music,
  Lock,
  X,
  RotateCcw,
  SlidersHorizontal,
  Library,
  ChevronRight,
  Sparkles,
  Disc3,
  Mic2,
  Music2,
  AudioLines,
  Command,
} from 'lucide-react';
import { CHROMATIC_KEYS } from '../utils/audioUtils';
import SongAudioPlayer from './SongAudioPlayer';

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
    const search = searchTerm.toLowerCase().trim();

    return songs.filter(song => {
      const title = song.title || '';
      const artist = song.artist || '';
      const lyrics = song.lyrics || '';
      const tags = song.tags || [];
      const category = song.category || '';
      const key = song.key || '';

      const matchesSearch =
        !search ||
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

    if (!song.audioUrl) {
      return;
    }

    /*
     * Pressing the same song's button closes
     * the expanded player.
     */
    if (playingSongId === song.id) {
      setPlayingSongId(null);
      return;
    }

    /*
     * Opening another song automatically
     * replaces the previous player.
     */
    setPlayingSongId(song.id);
  };

  const handleClosePlayer = () => {
    setPlayingSongId(null);
  };

  const getSongCapabilities = (song: Song) => {
    const arrangement = song.arrangement;

    return {
      lead: Boolean(arrangement?.lead),

      harmony: Boolean(
        arrangement &&
        (
          'soprano' in arrangement ||
          'alto' in arrangement ||
          'tenor' in arrangement
        )
      ),

      band: Boolean(
        arrangement &&
        (
          'instrumentation' in arrangement ||
          'instruments' in arrangement ||
          'band' in arrangement
        )
      ),
    };
  };

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-[32px] bg-[#000000] text-white">

      {/* =========================================================
          PAGE ATMOSPHERE
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#007aff]/[0.055] blur-[110px]" />

        <div className="absolute left-[20%] top-[420px] h-[300px] w-[300px] rounded-full bg-blue-500/[0.025] blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage:
              'linear-gradient(to bottom, black, transparent 75%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black, transparent 75%)',
          }}
        />
      </div>

      <div className="relative space-y-6">

        {/* =========================================================
            HERO
        ========================================================= */}

        <section
          className="
            group
            relative
            min-h-[430px]
            overflow-hidden
            rounded-[34px]
            border
            border-white/[0.09]
            bg-[#08090c]
            shadow-2xl
            shadow-black/30
          "
        >
          <div className="pointer-events-none absolute -right-28 -top-28 h-[360px] w-[360px] rounded-full bg-[#007aff]/[0.09] blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-40 left-[30%] h-[280px] w-[280px] rounded-full bg-blue-500/[0.045] blur-[100px]" />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              transform:
                'perspective(700px) rotateX(58deg) scale(1.45) translateY(24%)',
              transformOrigin: 'center bottom',
            }}
          />

          <div className="pointer-events-none absolute left-0 right-0 top-[57%] h-px bg-gradient-to-r from-transparent via-[#007aff]/30 to-transparent" />

          <div className="pointer-events-none absolute right-[8%] top-[13%] hidden h-[230px] w-[230px] items-center justify-center rounded-full border border-white/[0.06] md:flex">
            <div className="absolute inset-5 rounded-full border border-white/[0.045]" />
            <div className="absolute inset-12 rounded-full border border-[#007aff]/10" />

            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02]">
              <Disc3 className="h-8 w-8 text-[#4da3ff]/50" />
            </div>
          </div>

          <div className="relative flex min-h-[430px] flex-col justify-between p-6 sm:p-8 lg:p-10">

            <div className="flex items-center justify-between gap-4">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#007aff]/20
                  bg-[#007aff]/[0.08]
                  px-3
                  py-1.5
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[0.2em]
                  text-[#4da3ff]
                "
              >
                <Library className="h-3.5 w-3.5" />
                Jewels Music Library
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

                <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-white/30">
                  Repertoire Online
                </span>
              </div>
            </div>

            <div className="relative max-w-3xl py-10">

              <div className="mb-4 flex items-center gap-2 text-[#4da3ff]">
                <Sparkles className="h-4 w-4" />

                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]">
                  Music Ministry
                </span>
              </div>

              <h1
                className="
                  text-5xl
                  font-black
                  leading-[0.9]
                  tracking-[-0.06em]
                  text-white
                  sm:text-6xl
                  lg:text-8xl
                "
              >
                SONG
                <span className="block text-white/20">
                  BANK.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm font-medium leading-6 text-white/40 sm:text-base">
                The central repertoire of Jewels of His Crown —
                songs, keys, arrangements and performance
                information prepared for ministry.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-2.5">
                  <Music2 className="h-4 w-4 text-[#4da3ff]" />

                  <span className="text-xs font-bold text-white/70">
                    {songs.length} songs
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-2.5">
                  <Command className="h-4 w-4 text-white/35" />

                  <span className="text-xs font-bold text-white/45">
                    {isMD ? 'MD Access' : 'Member Access'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/20">
                  We Sing to Convert.
                </p>

                <p className="mt-1 text-xs font-medium text-white/30">
                  Every song prepared for the ministry.
                </p>
              </div>

              {isMD ? (
                <button
                  type="button"
                  onClick={onAddNewSong}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#007aff]
                    px-5
                    py-3
                    text-xs
                    font-extrabold
                    text-white
                    shadow-xl
                    shadow-blue-500/20
                    transition-all
                    hover:bg-[#087ff5]
                    hover:shadow-blue-500/30
                    active:scale-[0.98]
                  "
                >
                  <Plus className="h-4 w-4" />
                  Upload New Song
                </button>
              ) : (
                <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-xs font-bold text-white/30">
                  <Lock className="h-3.5 w-3.5" />
                  MD uploads only
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            LIBRARY SNAPSHOT
        ========================================================= */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="group rounded-[24px] border border-white/[0.07] bg-[#090a0d] p-4 transition-all hover:border-white/[0.12]">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
              <Library className="h-4 w-4 text-[#4da3ff]" />
            </div>

            <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-white/25">
              Total Songs
            </p>

            <p className="mt-1 text-2xl font-black tracking-tight text-white">
              {songs.length}
            </p>
          </div>

          <div className="group rounded-[24px] border border-white/[0.07] bg-[#090a0d] p-4 transition-all hover:border-white/[0.12]">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
              <Search className="h-4 w-4 text-[#4da3ff]" />
            </div>

            <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-white/25">
              Showing
            </p>

            <p className="mt-1 text-2xl font-black tracking-tight text-[#4da3ff]">
              {filteredSongs.length}
            </p>
          </div>

          <div className="group rounded-[24px] border border-white/[0.07] bg-[#090a0d] p-4 transition-all hover:border-white/[0.12]">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
              <Music2 className="h-4 w-4 text-white/35" />
            </div>

            <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-white/25">
              Categories
            </p>

            <p className="mt-1 text-2xl font-black tracking-tight text-white">
              {categories.length - 1}
            </p>
          </div>

          <div className="group rounded-[24px] border border-white/[0.07] bg-[#090a0d] p-4 transition-all hover:border-white/[0.12]">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
              <Mic2 className="h-4 w-4 text-white/35" />
            </div>

            <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-white/25">
              Access
            </p>

            <p className="mt-1 text-2xl font-black tracking-tight text-white">
              {isMD ? 'MD' : 'OPEN'}
            </p>
          </div>
        </section>

        {/* =========================================================
            SEARCH COMMAND BAR
        ========================================================= */}

        <section
          className="
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.08]
            bg-[#090a0d]
            shadow-2xl
            shadow-black/20
          "
        >
          <div className="border-b border-white/[0.06] p-5 sm:p-6">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                  <SlidersHorizontal className="h-4 w-4 text-[#4da3ff]" />
                </div>

                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/25">
                    Repertoire Control
                  </p>

                  <p className="mt-1 text-sm font-bold text-white/80">
                    Find your song
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#007aff] shadow-[0_0_10px_rgba(0,122,255,0.8)]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/25">
                  {filteredSongs.length} results
                </span>
              </div>
            </div>

            <div className="relative mt-5">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

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
                  border
                  border-white/[0.08]
                  bg-[#050609]
                  py-4
                  pl-11
                  pr-12
                  text-sm
                  font-medium
                  text-white
                  outline-none
                  transition-all
                  placeholder:text-white/20
                  focus:border-[#007aff]/40
                  focus:ring-4
                  focus:ring-[#007aff]/[0.07]
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
                    bg-white/[0.05]
                    text-white/35
                    transition-all
                    hover:bg-white/[0.09]
                    hover:text-white
                  "
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="mt-5">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-white/20">
                  Category
                </span>

                <span className="text-[9px] font-bold text-[#4da3ff]/60">
                  {selectedCategory}
                </span>
              </div>

              <div className="flex min-w-0 gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
                        shrink-0
                        rounded-xl
                        border
                        px-3.5
                        py-2
                        text-[11px]
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
                              border-white/[0.06]
                              bg-white/[0.025]
                              text-white/35
                              hover:border-white/[0.12]
                              hover:bg-white/[0.06]
                              hover:text-white/75
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
          </div>

          <div className="flex flex-col gap-3 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
                <AudioLines className="h-4 w-4 text-white/30" />
              </div>

              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-white/20">
                  Musical Key
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-white/30">
                  Filter by original key
                </p>
              </div>
            </div>

            <select
              value={selectedKey}
              onChange={e =>
                setSelectedKey(e.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-white/[0.08]
                bg-[#050609]
                px-3
                py-3
                text-xs
                font-bold
                text-white
                outline-none
                transition-all
                focus:border-[#007aff]/40
                lg:w-[180px]
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
            RESULTS HEADER
        ========================================================= */}

        <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#007aff] shadow-[0_0_10px_rgba(0,122,255,0.7)]" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#4da3ff]">
                Repertoire
              </span>
            </div>

            <h2 className="mt-1.5 text-2xl font-black tracking-tight text-white">
              Your songs
            </h2>

            <p className="mt-1 text-xs font-medium text-white/25">
              Showing {filteredSongs.length} of {songs.length} songs
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
                border
                border-white/[0.07]
                bg-white/[0.03]
                px-3
                py-2
                text-xs
                font-bold
                text-white/40
                transition-all
                hover:border-white/[0.12]
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
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredSongs.map((song, index) => {
              const isPlayingThis =
                playingSongId === song.id;

              const songTitle =
                song.title || 'Untitled Song';

              const songArtist =
                song.artist || 'Unknown Artist';

              const songCategory =
                song.category || 'Other';

              const songKey =
                song.key || 'C';

              const tempoDisplay =
                typeof song.tempo === 'string'
                  ? song.tempo.split(' ')[0]
                  : '—';

              const capabilities =
                getSongCapabilities(song);

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
                    border
                    border-white/[0.08]
                    bg-[#090a0d]
                    p-5
                    shadow-2xl
                    shadow-black/15
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:border-white/[0.14]
                    hover:bg-[#0b0c10]
                    hover:shadow-black/35
                  "
                  style={{
                    animationDelay: `${Math.min(
                      index * 35,
                      220
                    )}ms`,
                  }}
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-20
                      -top-20
                      h-40
                      w-40
                      rounded-full
                      bg-[#007aff]/[0.055]
                      opacity-0
                      blur-3xl
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />

                  <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-[#007aff]/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* TOP */}
                  <div className="relative flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3.5">

                      <div
                        className="
                          relative
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-2xl
                          border
                          border-white/[0.08]
                          bg-[#050609]
                          shadow-inner
                          shadow-white/[0.02]
                          transition-all
                          group-hover:border-[#007aff]/25
                        "
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />

                        {song.icon ? (
                          <span className="relative text-xl">
                            {song.icon}
                          </span>
                        ) : (
                          <Music className="relative h-5 w-5 text-white/25 transition-colors group-hover:text-[#4da3ff]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="truncate text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#4da3ff]">
                            {songCategory}
                          </span>
                        </div>

                        <h3 className="truncate text-lg font-black tracking-tight text-white sm:text-xl">
                          {songTitle}
                        </h3>

                        <p className="mt-0.5 truncate text-xs font-semibold text-white/30">
                          {songArtist}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="rounded-xl border border-[#007aff]/20 bg-[#007aff]/[0.09] px-2.5 py-1 text-[10px] font-extrabold text-[#4da3ff]">
                        {songKey}
                      </span>

                      <span className="text-[10px] font-bold text-white/20">
                        {tempoDisplay !== '—'
                          ? `${tempoDisplay} BPM`
                          : 'Tempo —'}
                      </span>
                    </div>
                  </div>

                  {/* CAPABILITIES */}
                  <div
                    className="
                      relative
                      my-4
                      grid
                      grid-cols-3
                      gap-1.5
                      rounded-2xl
                      border
                      border-white/[0.05]
                      bg-black/25
                      p-1.5
                    "
                  >
                    <div className="rounded-xl bg-white/[0.025] px-2 py-2.5 text-center">
                      <span className="block text-[8px] font-extrabold uppercase tracking-[0.15em] text-white/20">
                        Lead
                      </span>

                      <span
                        className={`mt-1 block truncate text-[10px] font-bold ${
                          capabilities.lead
                            ? 'text-emerald-300/70'
                            : 'text-white/25'
                        }`}
                      >
                        {capabilities.lead
                          ? 'Ready'
                          : 'Not set'}
                      </span>
                    </div>

                    <div className="rounded-xl bg-white/[0.025] px-2 py-2.5 text-center">
                      <span className="block text-[8px] font-extrabold uppercase tracking-[0.15em] text-white/20">
                        Harmony
                      </span>

                      <span
                        className={`mt-1 block truncate text-[10px] font-bold ${
                          capabilities.harmony
                            ? 'text-amber-300/70'
                            : 'text-white/25'
                        }`}
                      >
                        {capabilities.harmony
                          ? 'Ready'
                          : 'Not set'}
                      </span>
                    </div>

                    <div className="rounded-xl bg-white/[0.025] px-2 py-2.5 text-center">
                      <span className="block text-[8px] font-extrabold uppercase tracking-[0.15em] text-white/20">
                        Band
                      </span>

                      <span
                        className={`mt-1 block truncate text-[10px] font-bold ${
                          capabilities.band
                            ? 'text-[#4da3ff]'
                            : 'text-white/25'
                        }`}
                      >
                        {capabilities.band
                          ? 'Chart'
                          : 'Not set'}
                      </span>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="relative flex flex-col gap-3 border-t border-white/[0.05] pt-3">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <button
                        type="button"
                        disabled={!song.audioUrl}
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
                            !song.audioUrl
                              ? `
                                cursor-not-allowed
                                border-white/[0.05]
                                bg-white/[0.02]
                                text-white/20
                              `
                              : isPlayingThis
                                ? `
                                  border-[#007aff]/40
                                  bg-[#007aff]
                                  text-white
                                  shadow-lg
                                  shadow-blue-500/20
                                `
                                : `
                                  border-white/[0.06]
                                  bg-white/[0.03]
                                  text-[#4da3ff]
                                  hover:border-[#007aff]/25
                                  hover:bg-[#007aff]/[0.09]
                                `
                          }
                        `}
                      >
                        {isPlayingThis ? (
                          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                          <Play className="h-3.5 w-3.5 fill-current" />
                        )}

                        {!song.audioUrl
                          ? 'No Audio'
                          : isPlayingThis
                            ? 'Playing...'
                            : 'Play Song'}
                      </button>

                      <div className="flex items-center justify-end gap-1.5">

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
                              border
                              border-white/[0.06]
                              bg-white/[0.03]
                              text-white/30
                              transition-all
                              hover:border-white/[0.12]
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
                            border
                            border-white/[0.06]
                            bg-white/[0.03]
                            px-3
                            py-2
                            text-xs
                            font-bold
                            text-white/50
                            transition-all
                            hover:border-[#007aff]/25
                            hover:bg-[#007aff]/[0.09]
                            hover:text-[#4da3ff]
                          "
                        >
                          View Song
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* =====================================================
                        EXPANDED AUDIO PLAYER
                    ===================================================== */}

                    {isPlayingThis && song.audioUrl && (
                      <div
                        onClick={e => e.stopPropagation()}
                      >
                        <SongAudioPlayer
                          audioUrl={song.audioUrl}
                          title={songTitle}
                          originalKey={song.key || 'C'}
                          isOpen={true}
                          onClose={handleClosePlayer}
                        />
                      </div>
                    )}
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
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-white/[0.08]
              bg-[#090a0d]
              px-5
              py-24
              text-center
              shadow-2xl
              shadow-black/20
            "
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#007aff]/[0.045] blur-[90px]" />

            <div className="relative">

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/[0.08] bg-[#050609] shadow-inner shadow-white/[0.02]">
                <Music className="h-8 w-8 text-white/20" />
              </div>

              <div className="mx-auto mb-3 w-fit rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-white/25">
                Song Bank
              </div>

              <h3 className="text-2xl font-black tracking-tight text-white">
                No songs found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
                Nothing in the repertoire matches your
                current search or filters.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">

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
                      border
                      border-white/[0.07]
                      bg-white/[0.035]
                      px-4
                      py-2.5
                      text-xs
                      font-bold
                      text-white/50
                      transition-all
                      hover:border-white/[0.12]
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
                      hover:bg-[#087ff5]
                      active:scale-[0.98]
                    "
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add New Song
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            FOOTER BRAND
        ========================================================= */}

        <section className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-[#06070a] px-6 py-10 text-center sm:px-10">

          <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-80 -translate-x-1/2 rounded-full bg-[#007aff]/[0.04] blur-[70px]" />

          <div className="relative">
            <div className="mx-auto mb-3 flex w-fit items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#4da3ff]" />

              <span className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-white/25">
                Jewels of His Crown
              </span>

              <span className="h-1 w-1 rounded-full bg-[#4da3ff]" />
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              We Sing to{' '}
              <span className="text-[#4da3ff]">
                Convert.
              </span>
            </h2>

            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/15">
              Music prepared for ministry
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SongBankView;
 
