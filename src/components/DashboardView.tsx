import React from 'react';
import {
  Song,
  Ministration,
  TeamMember,
  ActiveTab,
  ActiveRole,
} from '../types';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Disc3,
  Headphones,
  MapPin,
  Mic2,
  Music2,
  Play,
  Radio,
  Sparkles,
  Users,
  Volume2,
  Waves,
  Zap,
} from 'lucide-react';

interface DashboardViewProps {
  songs: Song[];
  ministrations: Ministration[];
  team: TeamMember[];
  activeRole: ActiveRole;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectSong: (song: Song) => void;
  onSelectMinistration: (ministration: Ministration) => void;
  openToolsModal: () => void;
  openStageMode: () => void;
}

/* ================================================================
   SMALL REUSABLE COMPONENTS
   ================================================================ */

interface SectionLabelProps {
  children: React.ReactNode;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="h-px w-8 bg-blue-400/60" />
    <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-blue-300/60">
      {children}
    </span>
  </div>
);

interface ArrowButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-blue-300"
  >
    {children || 'View all'}
    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
  </button>
);

/* ================================================================
   MAIN DASHBOARD
   ================================================================ */

export const DashboardView: React.FC<DashboardViewProps> = ({
  songs,
  ministrations,
  team,
  activeRole,
  setActiveTab,
  onSelectSong,
  onSelectMinistration,
  openToolsModal,
  openStageMode,
}) => {
  const isMD = activeRole === 'admin_md';

  const totalSongs = songs?.length || 0;
  const totalMinistrations = ministrations?.length || 0;
  const totalTeam = team?.length || 0;

  /*
   * Keep these previews deliberately small.
   *
   * The dashboard is not the actual Song Bank or Music Team page.
   * Those pages already exist, so the dashboard only needs a
   * lightweight snapshot.
   */
  const recentSongs = React.useMemo(
    () => [...(songs || [])].slice(-4).reverse(),
    [songs],
  );

  const featuredTeam = React.useMemo(
    () => [...(team || [])].slice(0, 4),
    [team],
  );

  const nextMinistration = ministrations?.[0];

  const getInitials = React.useCallback((name: string = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return '?';

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, []);

  const getSongNumber = (index: number) =>
    String(index + 1).padStart(2, '0');

  return (
    <div className="min-h-screen overflow-hidden bg-[#000000] text-white">
      {/* ==========================================================
          LIGHTWEIGHT PAGE ATMOSPHERE
      ========================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-blue-600/[0.045] blur-[110px]" />

        <div className="absolute right-[-220px] top-[500px] h-[520px] w-[520px] rounded-full bg-blue-500/[0.035] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-[1550px] px-4 pb-20 sm:px-6 lg:px-10">
        {/* ========================================================
            HERO
        ======================================================== */}

        <section className="relative flex min-h-[610px] items-center">
          {/* Small decorative orbit */}
          <div className="pointer-events-none absolute right-[5%] top-[14%] hidden h-[390px] w-[390px] rounded-full border border-blue-400/[0.07] lg:block">
            <div className="absolute inset-[65px] rounded-full border border-blue-400/[0.05]" />

            <div className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_16px_5px_rgba(59,130,246,0.25)]" />
          </div>

          <div className="grid w-full gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            {/* ----------------------------------------------------
                HERO COPY
            ---------------------------------------------------- */}

            <div className="max-w-4xl pt-12 lg:pt-0">
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-blue-300/75">
                  Jewels of His Crown
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_3px_rgba(59,130,246,0.3)]" />
              </div>

              <h1 className="relative text-[clamp(5rem,12vw,11rem)] font-black leading-[0.74] tracking-[-0.075em] text-white">
                JEWELS
              </h1>

              <div className="mt-7 flex items-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-blue-400 to-transparent sm:w-24" />

                <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/45 sm:text-base">
                  We Sing to Convert.
                </p>
              </div>

              <p className="mt-9 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
                Your ministry sound, organised in one place. Prepare songs,
                coordinate ministrations, equip the team, and carry the sound
                of the ministry wherever it goes.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('songs')}
                  className="group rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3.5 text-sm font-semibold text-blue-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/45 hover:bg-blue-500/15"
                >
                  <span className="flex items-center gap-2">
                    <Music2 className="h-4 w-4" />
                    Song Bank
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={openStageMode}
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Play className="h-4 w-4 fill-current" />
                    Stage Mode
                  </span>
                </button>
              </div>
            </div>

            {/* ----------------------------------------------------
                HERO OVERVIEW
            ---------------------------------------------------- */}

            <div className="hidden lg:block">
              <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/25">
                      Ministry System
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-white">
                      Command Overview
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-300/70">
                      Online
                    </span>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-4">
                    <Music2 className="h-4 w-4 text-blue-300/60" />

                    <p className="mt-5 text-2xl font-bold text-white">
                      {totalSongs}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/25">
                      Songs
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-4">
                    <Radio className="h-4 w-4 text-blue-300/60" />

                    <p className="mt-5 text-2xl font-bold text-white">
                      {totalMinistrations}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/25">
                      Events
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-4">
                    <Users className="h-4 w-4 text-blue-300/60" />

                    <p className="mt-5 text-2xl font-bold text-white">
                      {totalTeam}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/25">
                      Team
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-300">
                      <Waves className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white/70">
                        Ministry Workspace
                      </p>

                      <p className="mt-1 text-[10px] text-white/25">
                        {isMD
                          ? 'Music Director access'
                          : 'Music team access'}
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-white/15" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            COMMAND CENTER
        ======================================================== */}

        <section className="py-14">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <SectionLabel>Command Center</SectionLabel>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Everything the ministry needs.
              </h2>
            </div>

            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.25em] text-white/15 sm:block">
              JHC / MUSIC HUB
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            {/* SONG BANK CARD */}

            <button
              type="button"
              onClick={() => setActiveTab('songs')}
              className="group relative min-h-[310px] overflow-hidden rounded-[30px] border border-blue-400/15 bg-gradient-to-br from-blue-950/25 via-black to-black p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 lg:col-span-7"
            >
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-blue-400/[0.08]" />

              <div className="absolute -right-4 -top-4 h-36 w-36 rounded-full border border-blue-400/[0.05]" />

              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-blue-500/[0.05] blur-3xl" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-400/[0.07] text-blue-300">
                    <Disc3 className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
                  </div>

                  <div className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                      {totalSongs} tracks
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-300/55">
                    The Library
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-5">
                    <div>
                      <h3 className="text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">
                        Song Bank
                      </h3>

                      <p className="mt-3 max-w-md text-sm leading-6 text-white/30">
                        Every song prepared, organised and ready for the next
                        ministration.
                      </p>
                    </div>

                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] sm:flex">
                      <ArrowRight className="h-4 w-4 text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-blue-300" />
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* MINISTRATIONS CARD */}

            <button
              type="button"
              onClick={() => setActiveTab('ministrations')}
              className="group relative min-h-[310px] overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.02] p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] lg:col-span-5"
            >
              <div className="absolute right-[-70px] top-[-70px] h-56 w-56 rounded-full bg-indigo-500/[0.06] blur-3xl" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-white/50">
                    <Radio className="h-5 w-5" />
                  </div>

                  <span className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                    Schedule
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/25">
                    Ministry Calendar
                  </p>

                  <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
                    Ministrations
                  </h3>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-sm text-white/30">
                      {totalMinistrations} upcoming assignment
                      {totalMinistrations === 1 ? '' : 's'}
                    </p>

                    <ArrowUpRight className="h-4 w-4 text-white/20 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/60" />
                  </div>
                </div>
              </div>
            </button>

            {/* MUSIC TOOLS */}

            <button
              type="button"
              onClick={openToolsModal}
              className="group relative min-h-[205px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.018] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 lg:col-span-4"
            >
              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-cyan-300/65">
                  <Headphones className="h-5 w-5" />
                </div>

                <h3 className="mt-7 text-xl font-bold text-white">
                  Music Tools
                </h3>

                <p className="mt-2 max-w-xs text-xs leading-5 text-white/25">
                  Pitch pipe, metronome and tools for rehearsal.
                </p>

                <div className="mt-5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-300/55">
                  Open tools
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>

            {/* STAGE MODE */}

            <button
              type="button"
              onClick={openStageMode}
              className="group relative min-h-[205px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.018] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/20 lg:col-span-4"
            >
              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-blue-300/65">
                  <Zap className="h-5 w-5" />
                </div>

                <h3 className="mt-7 text-xl font-bold text-white">
                  Stage Mode
                </h3>

                <p className="mt-2 max-w-xs text-xs leading-5 text-white/25">
                  Enter the performance view for the selected item.
                </p>

                <div className="mt-5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-300/55">
                  Enter stage mode
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>

            {/* MUSIC TEAM */}

            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className="group relative min-h-[205px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.018] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/20 lg:col-span-4"
            >
              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-violet-300/65">
                  <Users className="h-5 w-5" />
                </div>

                <h3 className="mt-7 text-xl font-bold text-white">
                  Music Team
                </h3>

                <p className="mt-2 max-w-xs text-xs leading-5 text-white/25">
                  The people carrying the sound of the ministry.
                </p>

                <div className="mt-5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-300/55">
                  View team
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* ========================================================
            UPCOMING NEXT
        ======================================================== */}

        <section className="py-14">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <SectionLabel>Upcoming Next</SectionLabel>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                What is coming up.
              </h2>
            </div>

            <ArrowButton
              onClick={() => setActiveTab('ministrations')}
            />
          </div>

          {nextMinistration ? (
            <button
              type="button"
              onClick={() => onSelectMinistration(nextMinistration)}
              className="group relative w-full overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-blue-950/20 via-white/[0.018] to-black p-6 text-left transition-all duration-300 hover:border-blue-400/20 sm:p-8"
            >
              <div className="absolute right-[-100px] top-[-110px] h-[330px] w-[330px] rounded-full border border-blue-400/[0.05]" />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-300/70">
                      Next Assignment
                    </span>

                    <span className="h-1 w-1 rounded-full bg-white/15" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
                      Ready
                    </span>
                  </div>

                  <h3 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                    {nextMinistration.title || 'Upcoming Ministration'}
                  </h3>

                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2 text-xs text-white/30">
                      <CalendarDays className="h-4 w-4 text-blue-300/50" />
                      {nextMinistration.date || 'Date to be announced'}
                    </div>

                    {nextMinistration.time && (
                      <div className="flex items-center gap-2 text-xs text-white/30">
                        <Clock3 className="h-4 w-4 text-blue-300/50" />
                        {nextMinistration.time}
                      </div>
                    )}

                    {nextMinistration.venue && (
                      <div className="flex items-center gap-2 text-xs text-white/30">
                        <MapPin className="h-4 w-4 text-blue-300/50" />
                        {nextMinistration.venue}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.025]">
                  <ArrowUpRight className="h-5 w-5 text-white/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-300" />
                </div>
              </div>
            </button>
          ) : (
            <div className="rounded-[30px] border border-white/[0.07] bg-white/[0.018] p-10 text-center">
              <CalendarDays className="mx-auto h-7 w-7 text-white/15" />

              <h3 className="mt-4 text-lg font-semibold text-white/55">
                No upcoming ministrations
              </h3>

              <p className="mt-2 text-sm text-white/25">
                New assignments will appear here when they are added.
              </p>
            </div>
          )}
        </section>

        {/* ========================================================
            LOWER PREVIEWS
            IMPORTANT:
            These remain previews, not full pages.
        ======================================================== */}

        <section className="py-14">
          <div className="mb-8">
            <SectionLabel>Ministry Activity</SectionLabel>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  A glimpse of what is happening.
                </h2>

                <p className="mt-2 max-w-2xl text-sm text-white/25">
                  A quick preview of the latest songs and the people behind
                  the ministry sound.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* ====================================================
                RECENT ADDITIONS
                COMPACT PREVIEW
            ==================================================== */}

            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.018] p-6 sm:p-7">
              <div className="absolute right-[-100px] top-[-100px] h-60 w-60 rounded-full bg-blue-500/[0.04] blur-3xl" />

              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.06]">
                      <Sparkles className="h-4 w-4 text-blue-300/65" />
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/20">
                        Latest
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-white">
                        Recent Additions
                      </h3>
                    </div>
                  </div>

                  <ArrowButton onClick={() => setActiveTab('songs')}>
                    Song Bank
                  </ArrowButton>
                </div>

                {recentSongs.length > 0 ? (
                  <div className="divide-y divide-white/[0.06]">
                    {recentSongs.map((song, index) => (
                      <button
                        type="button"
                        key={song.id}
                        onClick={() => onSelectSong(song)}
                        className="group flex w-full items-center gap-4 py-4 text-left first:pt-0 last:pb-0"
                      >
                        <span className="w-7 shrink-0 text-[10px] font-semibold tabular-nums text-white/15">
                          {getSongNumber(index)}
                        </span>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-black/30 text-blue-300/55 transition-colors group-hover:border-blue-400/20 group-hover:bg-blue-500/[0.06] group-hover:text-blue-300">
                          <Music2 className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white/70 transition-colors group-hover:text-white">
                            {song.title || 'Untitled Song'}
                          </p>

                          <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/20">
                            Song Bank
                          </p>
                        </div>

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.015] transition-all group-hover:border-blue-300/20 group-hover:bg-blue-500/[0.06]">
                          <ChevronRight className="h-3.5 w-3.5 text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-300" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/[0.07] p-8 text-center">
                    <Music2 className="mx-auto h-5 w-5 text-white/15" />

                    <p className="mt-3 text-sm text-white/25">
                      No recent additions yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ====================================================
                MUSIC TEAM
                COMPACT PREVIEW
            ==================================================== */}

            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.018] p-6 sm:p-7">
              <div className="absolute bottom-[-100px] right-[-100px] h-60 w-60 rounded-full bg-violet-500/[0.035] blur-3xl" />

              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.05]">
                      <Users className="h-4 w-4 text-violet-300/65" />
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/20">
                        The People
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-white">
                        Music Team
                      </h3>
                    </div>
                  </div>

                  <ArrowButton onClick={() => setActiveTab('team')}>
                    View team
                  </ArrowButton>
                </div>

                {featuredTeam.length > 0 ? (
                  <div className="space-y-2">
                    {featuredTeam.map((member) => (
                      <button
                        type="button"
                        key={member.id}
                        onClick={() => setActiveTab('team')}
                        className="group flex w-full items-center gap-4 rounded-2xl border border-transparent p-2 text-left transition-all duration-200 hover:border-white/[0.06] hover:bg-white/[0.025]"
                      >
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-gradient-to-br from-blue-500/[0.12] to-violet-500/[0.05] text-[10px] font-bold text-white/55">
                          {getInitials(member.name)}

                          <span className="absolute bottom-[-2px] right-[-2px] h-2.5 w-2.5 rounded-full border-2 border-[#080808] bg-emerald-400" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white/70 transition-colors group-hover:text-white">
                            {member.name}
                          </p>

                          <p className="mt-1 truncate text-[9px] uppercase tracking-[0.15em] text-white/20">
                            {member.role || 'Music Team'}
                          </p>
                        </div>

                        <ChevronRight className="h-4 w-4 shrink-0 text-white/15 transition-all group-hover:translate-x-0.5 group-hover:text-white/40" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/[0.07] p-8 text-center">
                    <Users className="mx-auto h-5 w-5 text-white/15" />

                    <p className="mt-3 text-sm text-white/25">
                      No team members yet.
                    </p>
                  </div>
                )}

                {totalTeam > featuredTeam.length && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('team')}
                    className="mt-4 flex w-full items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 transition-colors hover:border-violet-300/15 hover:bg-violet-500/[0.025]"
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                      +{totalTeam - featuredTeam.length} more member
                      {totalTeam - featuredTeam.length === 1 ? '' : 's'}
                    </span>

                    <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-300/55">
                      Open team
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            BRAND FOOTER
        ======================================================== */}

        <section className="relative py-24 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-blue-400/40" />

              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_14px_4px_rgba(59,130,246,0.2)]" />

              <span className="h-px w-14 bg-gradient-to-l from-transparent to-blue-400/40" />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-blue-300/50">
              Jewels of His Crown
            </p>

            <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
              We Sing to Convert.
            </h2>

            <div className="mt-7 flex items-center justify-center gap-2 text-white/15">
              <Volume2 className="h-4 w-4" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.25em]">
                Music Ministry
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardView;
