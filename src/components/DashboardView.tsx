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

  const recentSongs = [...(songs || [])].slice(-6).reverse();
  const featuredTeam = [...(team || [])].slice(0, 6);

  const nextMinistration = ministrations?.[0];

  const getInitials = (name: string = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (!parts.length) return '?';

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const getSongAccent = (index: number) => {
    const accents = [
      'from-blue-500/30 via-cyan-400/10 to-transparent',
      'from-indigo-500/30 via-blue-400/10 to-transparent',
      'from-violet-500/25 via-indigo-400/10 to-transparent',
      'from-cyan-500/25 via-blue-500/10 to-transparent',
      'from-sky-500/30 via-indigo-500/10 to-transparent',
      'from-blue-600/30 via-slate-400/10 to-transparent',
    ];

    return accents[index % accents.length];
  };

  const getTeamRoleLabel = (member: TeamMember) => {
    return member.role || 'Music Team';
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#000000] text-white">
      {/* =========================================================
          GLOBAL ATMOSPHERE
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-40 top-0 h-[620px] w-[620px] rounded-full blur-[150px]"
          style={{
            background:
              'radial-gradient(circle, rgba(37,99,235,0.16) 0%, rgba(37,99,235,0.05) 38%, transparent 72%)',
          }}
        />

        <div
          className="absolute right-[-180px] top-[360px] h-[620px] w-[620px] rounded-full blur-[160px]"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(30,64,175,0.04) 42%, transparent 72%)',
          }}
        />

        <div
          className="absolute left-[35%] top-[1000px] h-[500px] w-[500px] rounded-full blur-[150px]"
          style={{
            background:
              'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, white 0.7px, transparent 0.7px)',
            backgroundSize: '5px 5px',
          }}
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-10">
        {/* =======================================================
            HERO
        ======================================================= */}

        <section className="relative flex min-h-[650px] items-center overflow-hidden">
          {/* Decorative rings */}
          <div className="pointer-events-none absolute right-[-120px] top-[40px] hidden h-[520px] w-[520px] rounded-full border border-blue-500/10 lg:block">
            <div className="absolute inset-[45px] rounded-full border border-blue-400/10" />
            <div className="absolute inset-[105px] rounded-full border border-blue-300/[0.08]" />
            <div className="absolute inset-[165px] rounded-full border border-white/[0.04]" />

            <div className="absolute left-1/2 top-[-4px] h-2 w-2 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_30px_8px_rgba(59,130,246,0.35)]" />
          </div>

          {/* Orbiting line */}
          <div className="pointer-events-none absolute right-[80px] top-[280px] hidden h-px w-[600px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent lg:block" />

          {/* Floating particles */}
          <div className="pointer-events-none absolute right-[28%] top-[20%] h-1 w-1 animate-pulse rounded-full bg-blue-300 shadow-[0_0_15px_5px_rgba(96,165,250,0.35)]" />
          <div className="pointer-events-none absolute right-[18%] top-[60%] h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_20px_6px_rgba(34,211,238,0.2)] [animation-delay:800ms]" />
          <div className="pointer-events-none absolute right-[42%] top-[30%] h-1 w-1 animate-pulse rounded-full bg-indigo-300 shadow-[0_0_15px_5px_rgba(129,140,248,0.25)] [animation-delay:1200ms]" />

          <div className="relative z-10 grid w-full gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* LEFT */}
            <div className="max-w-4xl pt-12 lg:pt-0">
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-blue-300/80">
                  Jewels of His Crown
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_4px_rgba(59,130,246,0.3)]" />
              </div>

              <div className="relative">
                <div
                  className="pointer-events-none absolute -left-6 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full blur-[90px]"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(37,99,235,0.18), transparent 70%)',
                  }}
                />

                <h1 className="relative text-[clamp(5rem,13vw,12rem)] font-black leading-[0.72] tracking-[-0.075em] text-white">
                  JEWELS
                </h1>

                <div className="mt-7 flex items-center gap-4">
                  <div className="h-px w-16 bg-gradient-to-r from-blue-400 to-transparent sm:w-24" />

                  <p className="text-sm font-medium tracking-[0.22em] text-white/45 sm:text-base">
                    WE SING TO CONVERT.
                  </p>
                </div>
              </div>

              <p className="mt-9 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
                Your ministry sound, organised in one place. Prepare songs,
                coordinate ministrations, equip the team, and carry the sound
                of the ministry wherever it goes.
              </p>

              {/* Hero buttons */}
              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('songs')}
                  className="group relative overflow-hidden rounded-2xl border border-blue-400/30 bg-blue-500/10 px-6 py-3.5 text-sm font-semibold text-blue-100 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/60 hover:bg-blue-500/15 hover:shadow-[0_18px_50px_rgba(37,99,235,0.16)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Music2 className="h-4 w-4" />
                    Song Bank
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>

                  <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </button>

                <button
                  onClick={openStageMode}
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-white/75 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Play className="h-4 w-4 fill-current" />
                    Stage Mode
                  </span>
                </button>
              </div>
            </div>

            {/* RIGHT SYSTEM PANEL */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-12 rounded-full bg-blue-500/[0.035] blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30">
                      Ministry System
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      Command Overview
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.25)]" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
                      Online
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      icon: Music2,
                      value: totalSongs,
                      label: 'Songs',
                    },
                    {
                      icon: Radio,
                      value: totalMinistrations,
                      label: 'Ministrations',
                    },
                    {
                      icon: Users,
                      value: totalTeam,
                      label: 'Team',
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-black/30 p-4 transition-all duration-300 hover:border-blue-400/20 hover:bg-blue-500/[0.035]"
                      >
                        <Icon className="mb-5 h-4 w-4 text-blue-300/55 transition-colors group-hover:text-blue-300" />

                        <div className="text-2xl font-bold tracking-tight text-white">
                          {item.value}
                        </div>

                        <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-white/25">
                          {item.label}
                        </div>

                        <div
                          className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl transition-opacity group-hover:opacity-100"
                          style={{ opacity: index === 0 ? 1 : 0.5 }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                        <Waves className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-white/75">
                          Ministry Workspace
                        </p>
                        <p className="mt-0.5 text-[10px] text-white/25">
                          {isMD
                            ? 'Music Director access'
                            : 'Music team access'}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            COMMAND CENTER
        ======================================================= */}

        <section className="relative py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-8 bg-blue-400/60" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-blue-300/60">
                  Command Center
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Everything the ministry needs.
              </h2>
            </div>

            <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/20 sm:flex">
              <span>JHC</span>
              <span className="h-1 w-1 rounded-full bg-blue-400/50" />
              <span>Music Hub</span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            {/* SONG BANK */}
            <button
              onClick={() => setActiveTab('songs')}
              className="group relative min-h-[320px] overflow-hidden rounded-[30px] border border-blue-400/15 bg-gradient-to-br from-blue-950/30 via-black to-black p-7 text-left transition-all duration-500 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-[0_30px_90px_rgba(37,99,235,0.12)] lg:col-span-7"
            >
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-400/10 transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-blue-300/[0.07]" />

              <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-blue-500/[0.07] blur-[80px]" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-400/[0.07] text-blue-300">
                    <Disc3 className="h-5 w-5 transition-transform duration-700 group-hover:rotate-180" />
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">
                      {totalSongs} tracks
                    </span>
                  </div>
                </div>

                <div className="mt-20">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-300/60">
                    The Library
                  </p>

                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <h3 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                        Song Bank
                      </h3>

                      <p className="mt-3 max-w-md text-sm leading-6 text-white/35">
                        Every song prepared, organised and ready for the next
                        ministration.
                      </p>
                    </div>

                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-all duration-300 group-hover:border-blue-300/30 group-hover:bg-blue-500/10 sm:flex">
                      <ArrowRight className="h-4 w-4 text-white/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-300" />
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* MINISTRATIONS */}
            <button
              onClick={() => setActiveTab('ministrations')}
              className="group relative min-h-[320px] overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-7 text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-white/[0.035] lg:col-span-5"
            >
              <div className="absolute right-[-50px] top-[-50px] h-52 w-52 rounded-full bg-indigo-500/[0.08] blur-3xl" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-white/55">
                    <Radio className="h-5 w-5" />
                  </div>

                  <span className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                    Schedule
                  </span>
                </div>

                <div className="mt-20">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/25">
                    Ministry Calendar
                  </p>

                  <h3 className="text-3xl font-black tracking-[-0.04em] text-white">
                    Ministrations
                  </h3>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-sm text-white/35">
                      {totalMinistrations} upcoming assignment
                      {totalMinistrations === 1 ? '' : 's'}
                    </p>

                    <ArrowUpRight className="h-4 w-4 text-white/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/60" />
                  </div>
                </div>
              </div>
            </button>

            {/* MUSIC TOOLS */}
            <button
              onClick={openToolsModal}
              className="group relative min-h-[220px] overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.02] p-7 text-left transition-all duration-500 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-cyan-400/[0.025] lg:col-span-4"
            >
              <div className="absolute bottom-[-70px] right-[-70px] h-48 w-48 rounded-full bg-cyan-400/[0.08] blur-3xl" />

              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-cyan-300/70">
                  <Headphones className="h-5 w-5" />
                </div>

                <h3 className="mt-8 text-xl font-bold text-white">
                  Music Tools
                </h3>

                <p className="mt-2 max-w-xs text-xs leading-5 text-white/30">
                  Pitch pipe, metronome and tools built for rehearsal.
                </p>

                <div className="mt-6 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-cyan-300/60">
                  Open tools
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>

            {/* STAGE MODE */}
            <button
              onClick={openStageMode}
              className="group relative min-h-[220px] overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.02] p-7 text-left transition-all duration-500 hover:-translate-y-1 hover:border-blue-300/20 hover:bg-blue-500/[0.025] lg:col-span-4"
            >
              <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-blue-500/[0.08] blur-3xl" />

              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-blue-300/70">
                  <Zap className="h-5 w-5" />
                </div>

                <h3 className="mt-8 text-xl font-bold text-white">
                  Stage Mode
                </h3>

                <p className="mt-2 max-w-xs text-xs leading-5 text-white/30">
                  Put the selected song or ministration into performance
                  view.
                </p>

                <div className="mt-6 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/60">
                  Enter stage mode
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>

            {/* TEAM */}
            <button
              onClick={() => setActiveTab('team')}
              className="group relative min-h-[220px] overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.02] p-7 text-left transition-all duration-500 hover:-translate-y-1 hover:border-violet-300/20 hover:bg-violet-500/[0.025] lg:col-span-4"
            >
              <div className="absolute bottom-[-60px] left-[-60px] h-48 w-48 rounded-full bg-violet-500/[0.06] blur-3xl" />

              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-violet-300/70">
                  <Users className="h-5 w-5" />
                </div>

                <h3 className="mt-8 text-xl font-bold text-white">
                  Music Team
                </h3>

                <p className="mt-2 max-w-xs text-xs leading-5 text-white/30">
                  The people carrying the sound of Jewels of His Crown.
                </p>

                <div className="mt-6 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-violet-300/60">
                  View team
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* =======================================================
            UPCOMING NEXT
        ======================================================= */}

        <section className="relative py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-8 bg-blue-400/60" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-blue-300/60">
                  Upcoming Next
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                What is coming up.
              </h2>
            </div>

            <button
              onClick={() => setActiveTab('ministrations')}
              className="hidden items-center gap-2 text-xs font-medium text-white/30 transition-colors hover:text-white sm:flex"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {nextMinistration ? (
            <button
              onClick={() => onSelectMinistration(nextMinistration)}
              className="group relative w-full overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-blue-950/20 via-white/[0.02] to-black p-6 text-left transition-all duration-500 hover:border-blue-400/20 hover:shadow-[0_30px_100px_rgba(37,99,235,0.08)] sm:p-8"
            >
              <div className="absolute right-[-100px] top-[-120px] h-[380px] w-[380px] rounded-full border border-blue-400/[0.06]" />
              <div className="absolute right-[-50px] top-[-70px] h-[260px] w-[260px] rounded-full border border-blue-300/[0.05]" />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-300/70">
                      Next Assignment
                    </span>

                    <span className="h-1 w-1 rounded-full bg-white/20" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                      Ready
                    </span>
                  </div>

                  <h3 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                    {nextMinistration.title || 'Upcoming Ministration'}
                  </h3>

                  <div className="mt-5 flex flex-wrap gap-5">
                    <div className="flex items-center gap-2 text-xs text-white/35">
                      <CalendarDays className="h-4 w-4 text-blue-300/50" />
                      {nextMinistration.date || 'Date to be announced'}
                    </div>

                    {nextMinistration.time && (
                      <div className="flex items-center gap-2 text-xs text-white/35">
                        <Clock3 className="h-4 w-4 text-blue-300/50" />
                        {nextMinistration.time}
                      </div>
                    )}

                    {nextMinistration.venue && (
                      <div className="flex items-center gap-2 text-xs text-white/35">
                        <MapPin className="h-4 w-4 text-blue-300/50" />
                        {nextMinistration.venue}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] transition-all duration-300 group-hover:border-blue-300/30 group-hover:bg-blue-500/10">
                  <ArrowUpRight className="h-5 w-5 text-white/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-300" />
                </div>
              </div>
            </button>
          ) : (
            <div className="rounded-[32px] border border-white/[0.07] bg-white/[0.02] p-10 text-center">
              <CalendarDays className="mx-auto h-7 w-7 text-white/15" />

              <h3 className="mt-4 text-lg font-semibold text-white/60">
                No upcoming ministrations
              </h3>

              <p className="mt-2 text-sm text-white/25">
                New assignments will appear here when they are added.
              </p>
            </div>
          )}
        </section>

        {/* =======================================================
            RECENT ADDITIONS + MUSIC TEAM
        ======================================================= */}

        <section className="relative py-16">
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-blue-400/60" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-blue-300/60">
                Inside the Ministry
              </span>
            </div>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                  The sound is always moving.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/30">
                  New songs enter the bank. New assignments take shape. And
                  behind every ministration is a team preparing together.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
            {/* ===================================================
                RECENT ADDITIONS
            =================================================== */}

            <div className="relative overflow-hidden rounded-[34px] border border-white/[0.08] bg-white/[0.018] p-5 sm:p-7">
              <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-blue-500/[0.045] blur-3xl" />

              <div className="relative z-10 mb-7 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.06]">
                      <Sparkles className="h-4 w-4 text-blue-300/70" />
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/25">
                        Library Activity
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-white">
                        Recent Additions
                      </h3>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('songs')}
                  className="group flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-blue-300"
                >
                  View bank
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {recentSongs.length > 0 ? (
                <div className="relative z-10 grid gap-3 sm:grid-cols-2">
                  {recentSongs.map((song, index) => (
                    <button
                      key={song.id}
                      onClick={() => onSelectSong(song)}
                      className="group relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-black/30 p-4 text-left transition-all duration-400 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.035] hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${getSongAccent(
                          index,
                        )} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-black/30 text-blue-300/70 transition-all duration-300 group-hover:border-blue-300/20 group-hover:bg-blue-500/10">
                            <Music2 className="h-4 w-4" />
                          </div>

                          <span className="rounded-full border border-white/[0.07] bg-black/20 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/20">
                            New
                          </span>
                        </div>

                        <div className="mt-9">
                          <h4 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-blue-100">
                            {song.title || 'Untitled Song'}
                          </h4>

                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                              Song Bank
                            </p>

                            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] transition-all duration-300 group-hover:border-blue-300/20 group-hover:bg-blue-500/10">
                              <ArrowUpRight className="h-3 w-3 text-white/25 transition-colors group-hover:text-blue-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="relative z-10 rounded-[24px] border border-dashed border-white/[0.08] p-10 text-center">
                  <Music2 className="mx-auto h-6 w-6 text-white/15" />
                  <p className="mt-3 text-sm text-white/30">
                    No songs have been added yet.
                  </p>
                </div>
              )}
            </div>

            {/* ===================================================
                MUSIC TEAM SHOWCASE
            =================================================== */}

            <div className="relative overflow-hidden rounded-[34px] border border-white/[0.08] bg-gradient-to-br from-white/[0.025] to-white/[0.012] p-5 sm:p-7">
              <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-indigo-500/[0.06] blur-3xl" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025]">
                      <Users className="h-4 w-4 text-violet-300/70" />
                    </div>

                    <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/25">
                      The People
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-white">
                      Music Team
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveTab('team')}
                    className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.02] transition-all hover:border-violet-300/20 hover:bg-violet-500/10"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/25 transition-colors group-hover:text-violet-300" />
                  </button>
                </div>

                {featuredTeam.length > 0 ? (
                  <>
                    {/* Team visual stack */}
                    <div className="relative mb-8 flex h-[92px] items-center">
                      {featuredTeam.slice(0, 5).map((member, index) => (
                        <div
                          key={member.id}
                          className="absolute transition-transform duration-500 hover:z-20 hover:-translate-y-2"
                          style={{
                            left: `${index * 18}%`,
                            zIndex: 10 - index,
                          }}
                        >
                          <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-[#080808] bg-gradient-to-br from-blue-400/30 via-indigo-500/20 to-white/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.4)] sm:h-[74px] sm:w-[74px]">
                            <span className="text-sm font-bold tracking-tight text-white/80">
                              {getInitials(member.name)}
                            </span>

                            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#080808] bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.15)]" />
                          </div>
                        </div>
                      ))}

                      {totalTeam > 5 && (
                        <div
                          className="absolute flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-[#080808] bg-white/[0.06] text-xs font-bold text-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)] sm:h-[74px] sm:w-[74px]"
                          style={{
                            left: '72%',
                            zIndex: 2,
                          }}
                        >
                          +{totalTeam - 5}
                        </div>
                      )}
                    </div>

                    {/* Team members */}
                    <div className="flex-1 space-y-2">
                      {featuredTeam.slice(0, 4).map((member) => (
                        <button
                          key={member.id}
                          onClick={() => setActiveTab('team')}
                          className="group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-left transition-all duration-300 hover:border-white/[0.07] hover:bg-white/[0.025]"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-[9px] font-bold text-white/45">
                            {getInitials(member.name)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-white/70 group-hover:text-white">
                              {member.name}
                            </p>

                            <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.13em] text-white/20">
                              {getTeamRoleLabel(member)}
                            </p>
                          </div>

                          <ChevronRight className="h-3.5 w-3.5 text-white/15 transition-all group-hover:translate-x-0.5 group-hover:text-white/40" />
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveTab('team')}
                      className="mt-5 flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-left transition-all hover:border-violet-300/15 hover:bg-violet-500/[0.03]"
                    >
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                        {totalTeam} team member
                        {totalTeam === 1 ? '' : 's'}
                      </span>

                      <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-300/60">
                        View team
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/[0.08] p-8 text-center">
                    <div>
                      <Users className="mx-auto h-6 w-6 text-white/15" />

                      <p className="mt-3 text-sm text-white/30">
                        No team members yet.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            FINAL BRAND SECTION
        ======================================================= */}

        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.045] blur-[130px]" />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-blue-400/50" />

              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_16px_5px_rgba(59,130,246,0.25)]" />

              <span className="h-px w-16 bg-gradient-to-l from-transparent to-blue-400/50" />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-blue-300/55">
              Jewels of His Crown
            </p>

            <h2 className="mt-7 text-5xl font-black tracking-[-0.06em] text-white sm:text-7xl">
              We Sing to Convert.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/25">
              Prepared in unity. Delivered with purpose. A digital home for
              the songs, people and ministrations that carry the ministry's
              sound.
            </p>

            <div className="mt-10 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-4 py-2">
                <Volume2 className="h-3.5 w-3.5 text-blue-300/60" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Music Ministry
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-4 py-2">
                <Mic2 className="h-3.5 w-3.5 text-blue-300/60" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Jewels
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================
          ANIMATION STYLES
      ========================================================= */}

      <style>{`
        @keyframes jewels-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes jewels-pulse {
          0%, 100% {
            opacity: 0.45;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes jewels-spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .jewels-float {
          animation: jewels-float 5s ease-in-out infinite;
        }

        .jewels-pulse {
          animation: jewels-pulse 3s ease-in-out infinite;
        }

        .jewels-spin-slow {
          animation: jewels-spin-slow 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardView;
