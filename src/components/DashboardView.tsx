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

  const recentSongs = [...(songs || [])].slice(-5).reverse();
  const featuredTeam = [...(team || [])].slice(0, 5);
  const nextMinistration = ministrations?.[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* ============================================================
          AMBIENT WORLD
      ============================================================ */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div
          className="absolute left-1/2 top-[-450px] h-[1000px] w-[1000px] -translate-x-1/2 rounded-full blur-[160px]"
          style={{
            background:
              'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.05) 42%, transparent 70%)',
          }}
        />

        <div
          className="absolute -left-[350px] top-[35%] h-[700px] w-[700px] rounded-full blur-[150px]"
          style={{
            background:
              'radial-gradient(circle, rgba(29,78,216,0.13) 0%, transparent 68%)',
          }}
        />

        <div
          className="absolute -right-[350px] top-[55%] h-[750px] w-[750px] rounded-full blur-[160px]"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.11) 0%, transparent 68%)',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.55%27/%3E%3C/svg%3E")',
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-[1800px] px-4 pb-24 pt-5 sm:px-6 lg:px-8">

        {/* ============================================================
            HERO — JEWELS EXPERIENCE
        ============================================================ */}

        <section className="relative min-h-[760px] overflow-hidden rounded-[42px] border border-white/[0.09] bg-[#030406] shadow-[0_40px_140px_rgba(0,0,0,0.8)]">

          {/* Perspective grid */}
          <div
            className="absolute inset-x-[-20%] bottom-[-38%] h-[75%] opacity-[0.12]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
              backgroundSize: '70px 70px',
              transform: 'perspective(500px) rotateX(62deg)',
              transformOrigin: 'center top',
              maskImage:
                'linear-gradient(to bottom, transparent, black 25%, black 70%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent, black 25%, black 70%, transparent)',
            }}
          />

          {/* Top atmosphere */}
          <div
            className="absolute left-1/2 top-[-420px] h-[900px] w-[900px] -translate-x-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(59,130,246,0.23) 0%, rgba(37,99,235,0.09) 34%, transparent 68%)',
              filter: 'blur(40px)',
              animation: 'heroBreath 7s ease-in-out infinite',
            }}
          />

          {/* Ring 1 */}
          <div
            className="absolute left-1/2 top-[45%] h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-blue-400/[0.06]"
            style={{
              transform: 'translate(-50%, -50%) rotate(-7deg)',
              animation: 'ringFloat 12s ease-in-out infinite',
            }}
          />

          {/* Ring 2 */}
          <div
            className="absolute left-1/2 top-[45%] h-[350px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.04]"
            style={{
              transform: 'translate(-50%, -50%) rotate(12deg)',
              animation: 'ringFloatReverse 15s ease-in-out infinite',
            }}
          />

          {/* Horizontal laser */}
          <div
            className="absolute left-[-30%] top-[49%] h-px w-[160%]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(96,165,250,0.65), rgba(255,255,255,0.18), rgba(96,165,250,0.65), transparent)',
              boxShadow: '0 0 20px rgba(59,130,246,0.3)',
              animation: 'laserMove 8s ease-in-out infinite',
            }}
          />

          {/* Corner lines */}
          <div className="absolute left-7 top-7 h-16 w-16 border-l border-t border-blue-400/20 sm:left-10 sm:top-10" />
          <div className="absolute right-7 top-7 h-16 w-16 border-r border-t border-blue-400/20 sm:right-10 sm:top-10" />
          <div className="absolute bottom-7 left-7 h-16 w-16 border-b border-l border-blue-400/10 sm:bottom-10 sm:left-10" />
          <div className="absolute bottom-7 right-7 h-16 w-16 border-b border-r border-blue-400/10 sm:bottom-10 sm:right-10" />

          {/* Floating particles */}
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-[2px] w-[2px] rounded-full bg-blue-200"
              style={{
                left: `${5 + ((index * 17) % 90)}%`,
                top: `${8 + ((index * 29) % 82)}%`,
                opacity: 0.15 + (index % 4) * 0.1,
                boxShadow: '0 0 12px rgba(96,165,250,0.8)',
                animation: `particle ${5 + (index % 5)}s ease-in-out infinite`,
                animationDelay: `${index * 0.35}s`,
              }}
            />
          ))}

          {/* Main vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, transparent 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.72) 100%)',
            }}
          />

          {/* ========================================================
              HERO CONTENT
          ======================================================== */}

          <div className="relative z-10 flex min-h-[760px] flex-col items-center justify-center px-5 py-24 text-center">

            {/* Tiny top identity */}
            <div
              className="mb-10 flex items-center gap-3"
              style={{ animation: 'rise 1s ease-out both' }}
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400/50 sm:w-20" />

              <span className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.38em] text-white/45 backdrop-blur-xl">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-blue-300" />
                </span>
                Jewels of His Crown
              </span>

              <span className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400/50 sm:w-20" />
            </div>

            {/* Small label */}
            <div
              className="mb-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.5em] text-blue-300/45"
              style={{ animation: 'rise 1s ease-out 0.15s both' }}
            >
              <Sparkles className="h-3 w-3" />
              Music Ministry
              <Sparkles className="h-3 w-3" />
            </div>

            {/* MAIN WORD */}
            <div className="relative">

              <h1
                className="relative select-none text-[74px] font-black leading-[0.75] tracking-[-0.09em] text-white sm:text-[120px] md:text-[160px] lg:text-[205px] xl:text-[235px]"
                style={{
                  animation:
                    'jewelReveal 1.6s cubic-bezier(.16,1,.3,1) both',
                  textShadow:
                    '0 0 35px rgba(255,255,255,0.04), 0 0 120px rgba(37,99,235,0.12)',
                }}
              >
                JEWELS
              </h1>

              {/* Gradient edge */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white/80 to-blue-300/50 bg-clip-text text-transparent opacity-0"
                style={{
                  animation: 'edgeReveal 1.8s ease-out 0.6s forwards',
                }}
              >
                JEWELS
              </div>

              {/* Moving shine */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                  className="absolute top-[-20%] h-[150%] w-[15%] -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-lg"
                  style={{
                    left: '-30%',
                    animation: 'shine 5s ease-in-out 1.7s infinite',
                  }}
                />
              </div>
            </div>

            {/* Decorative line */}
            <div
              className="mt-9 flex items-center gap-4"
              style={{ animation: 'rise 1s ease-out 0.55s both' }}
            >
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-blue-400/50 sm:w-24" />

              <span className="relative h-2 w-2 rotate-45 border border-blue-300/70 bg-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.6)]" />

              <span className="h-px w-14 bg-gradient-to-l from-transparent to-blue-400/50 sm:w-24" />
            </div>

            {/* SLOGAN */}
            <h2
              className="mt-7 text-sm font-medium uppercase tracking-[0.42em] text-white/70 sm:text-base md:text-lg"
              style={{ animation: 'rise 1s ease-out 0.65s both' }}
            >
              We Sing to Convert.
            </h2>

            {/* Description */}
            <p
              className="mt-6 max-w-2xl text-xs leading-7 text-white/30 sm:text-sm sm:leading-8"
              style={{ animation: 'rise 1s ease-out 0.8s both' }}
            >
              Songs prepared with purpose. Voices aligned with purpose.
              A digital environment built for the sound of
              <span className="text-white/55"> Jewels of His Crown.</span>
            </p>

            {/* Buttons */}
            <div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animation: 'rise 1s ease-out 0.95s both' }}
            >

              <button
                onClick={() => setActiveTab('songs')}
                className="group relative flex h-12 items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-7 text-xs font-bold text-black transition-all duration-500 hover:scale-[1.04] hover:shadow-[0_0_45px_rgba(96,165,250,0.22)]"
              >
                <Music2 className="h-4 w-4" />
                Song Bank
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

                <span className="absolute inset-y-0 left-[-100%] w-[60%] skew-x-[-20deg] bg-white/60 blur-md transition-all duration-700 group-hover:left-[130%]" />
              </button>

              <button
                onClick={openStageMode}
                className="group flex h-12 items-center justify-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.035] px-7 text-xs font-semibold text-white/75 backdrop-blur-xl transition-all duration-500 hover:border-blue-400/30 hover:bg-blue-500/[0.08] hover:text-white"
              >
                <Play className="h-4 w-4 text-blue-300" />
                Enter Stage Mode
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Hero bottom information */}
            <div
              className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.4em] text-white/20 sm:text-[9px]"
              style={{ animation: 'rise 1s ease-out 1.2s both' }}
            >
              <span className="flex items-center gap-2">
                <Volume2 className="h-3 w-3" />
                Ministry Sound
              </span>

              <span className="h-3 w-px bg-white/10" />

              <span>{totalSongs} Songs</span>

              <span className="h-3 w-px bg-white/10" />

              <span>Live Environment</span>
            </div>
          </div>
        </section>

        {/* ============================================================
            FLOATING SYSTEM PANEL
        ============================================================ */}

        <div className="relative -mt-7 px-3 sm:px-10">

          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#080a0e]/95 shadow-[0_25px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl">

            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  'linear-gradient(90deg, rgba(37,99,235,0.06), transparent 30%, transparent 70%, rgba(37,99,235,0.05))',
              }}
            />

            <div className="relative grid min-h-[78px] grid-cols-2 divide-white/[0.06] sm:grid-cols-4 sm:divide-x">

              <div className="flex items-center justify-center gap-3 px-4 py-4">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">
                    Status
                  </p>
                  <p className="mt-1 text-xs font-semibold text-emerald-300/75">
                    System Live
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 px-4 py-4">
                <Music2 className="h-4 w-4 text-blue-300/60" />

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">
                    Repertoire
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white/65">
                    {totalSongs} Songs
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 px-4 py-4">
                <Radio className="h-4 w-4 text-purple-300/60" />

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">
                    Schedule
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white/65">
                    {totalMinistrations} Ministrations
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 px-4 py-4">
                <Users className="h-4 w-4 text-cyan-300/60" />

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">
                    Team
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white/65">
                    {totalTeam} Members
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ============================================================
            COMMAND CENTER
        ============================================================ */}

        <section className="mt-24">

          <div className="flex items-end justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-blue-400/55">
                <span className="h-px w-6 bg-blue-400/40" />
                Command Center
              </div>

              <h2 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
                The sound starts here.
              </h2>
            </div>

            <div className="hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/15 sm:flex">
              <Waves className="h-4 w-4" />
              Jewels System
            </div>
          </div>

          {/* Big command grid */}
          <div className="mt-9 grid gap-4 lg:grid-cols-12">

            {/* SONG BANK — LARGE */}
            <button
              onClick={() => setActiveTab('songs')}
              className="group relative min-h-[320px] overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#07090d] p-7 text-left lg:col-span-7"
            >

              <div
                className="absolute right-[-15%] top-[-30%] h-[500px] w-[500px] rounded-full blur-[100px]"
                style={{
                  background:
                    'radial-gradient(circle, rgba(37,99,235,0.16), transparent 68%)',
                }}
              />

              {/* Decorative waveform */}
              <div className="absolute bottom-0 right-0 flex h-[75%] w-[55%] items-end justify-end gap-[4px] opacity-[0.08]">

                {Array.from({ length: 40 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-[4px] rounded-full bg-blue-300"
                    style={{
                      height: `${25 + ((i * 31) % 130)}px`,
                      animation: `wave ${1.5 + (i % 4) * 0.25}s ease-in-out infinite`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}

              </div>

              <div className="relative flex h-full flex-col justify-between">

                <div className="flex items-start justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300 shadow-[0_0_35px_rgba(37,99,235,0.08)]">
                    <Disc3 className="h-6 w-6" />
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.025] transition-all duration-300 group-hover:border-blue-400/30 group-hover:bg-blue-500/10">
                    <ArrowUpRight className="h-4 w-4 text-white/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-300" />
                  </div>

                </div>

                <div>

                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.35em] text-blue-300/50">
                    Repertoire
                  </p>

                  <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Song Bank
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/30">
                    Every song prepared, organized and ready
                    for the next sound.
                  </p>

                  <div className="mt-7 flex items-center gap-3">

                    <span className="flex h-8 items-center rounded-full border border-white/[0.07] bg-white/[0.025] px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                      {totalSongs} Songs
                    </span>

                    <span className="text-[10px] font-semibold text-blue-300/60">
                      Explore →
                    </span>

                  </div>
                </div>
              </div>
            </button>

            {/* MINISTRATIONS */}
            <button
              onClick={() => setActiveTab('ministrations')}
              className="group relative min-h-[320px] overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#07080c] p-7 text-left lg:col-span-5"
            >

              <div
                className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-[90px]"
                style={{
                  background:
                    'radial-gradient(circle, rgba(168,85,247,0.15), transparent 68%)',
                }}
              />

              <div className="relative flex h-full flex-col justify-between">

                <div className="flex items-start justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-500/[0.08] text-purple-300">
                    <Radio className="h-6 w-6" />
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-white/20 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-purple-300" />

                </div>

                <div>

                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.35em] text-purple-300/50">
                    Schedule
                  </p>

                  <h3 className="text-3xl font-bold tracking-tight text-white">
                    Ministrations
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/30">
                    Know where the sound is going next.
                  </p>

                  <div className="mt-7 flex items-center gap-3">

                    <span className="flex h-8 items-center rounded-full border border-white/[0.07] bg-white/[0.025] px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                      {totalMinistrations} Scheduled
                    </span>

                    <span className="text-[10px] font-semibold text-purple-300/60">
                      Open →
                    </span>

                  </div>

                </div>
              </div>
            </button>

            {/* MUSIC TOOLS */}
            <button
              onClick={openToolsModal}
              className="group relative min-h-[190px] overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#07090b] p-7 text-left lg:col-span-5"
            >

              <div
                className="absolute -right-10 -top-10 h-60 w-60 rounded-full blur-[80px]"
                style={{
                  background:
                    'radial-gradient(circle, rgba(34,211,238,0.12), transparent 68%)',
                }}
              />

              <div className="relative flex h-full items-center gap-6">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.07] text-cyan-300">
                  <Headphones className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-cyan-300/50">
                    Studio
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Music Tools
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/30">
                    Pitch • tempo • transpose • rehearsal
                  </p>

                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-cyan-300" />

              </div>
            </button>

            {/* STAGE MODE */}
            <button
              onClick={openStageMode}
              className="group relative min-h-[190px] overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#07090b] p-7 text-left lg:col-span-7"
            >

              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.04] via-transparent to-transparent" />

              <div className="relative flex h-full items-center justify-between gap-6">

                <div className="flex items-center gap-5">

                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/[0.08]">

                    <span className="absolute h-8 w-8 animate-ping rounded-full bg-blue-400/10" />

                    <Play className="relative ml-0.5 h-5 w-5 fill-blue-300 text-blue-300" />

                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-blue-300/50">
                      Live Environment
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-white">
                      Stage Mode
                    </h3>

                    <p className="mt-2 text-xs text-white/30">
                      Put the next ministration on stage.
                    </p>

                  </div>

                </div>

                <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.025] sm:flex">
                  <ArrowRight className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-blue-300" />
                </div>

              </div>
            </button>

          </div>
        </section>

        {/* ============================================================
            NEXT MINISTRATION
        ============================================================ */}

        <section className="mt-24">

          <div className="flex items-end justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-blue-400/55">
                <span className="h-px w-6 bg-blue-400/40" />
                Next Assignment
              </div>

              <h2 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
                What are we singing next?
              </h2>
            </div>

            <button
              onClick={() => setActiveTab('ministrations')}
              className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/25 transition-colors hover:text-white sm:flex"
            >
              All ministrations
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

          </div>

          {nextMinistration ? (
            <button
              onClick={() => onSelectMinistration(nextMinistration)}
              className="group relative mt-9 block w-full overflow-hidden rounded-[36px] border border-white/[0.08] bg-[#06080c] text-left transition-all duration-500 hover:border-blue-400/25"
            >

              {/* Large glow */}
              <div
                className="absolute right-[-10%] top-[-120%] h-[700px] w-[700px] rounded-full blur-[130px] transition-all duration-700 group-hover:scale-110"
                style={{
                  background:
                    'radial-gradient(circle, rgba(37,99,235,0.15), transparent 68%)',
                }}
              />

              {/* Wave architecture */}
              <div className="absolute bottom-0 right-0 flex h-full w-[50%] items-center justify-end gap-[4px] opacity-[0.06]">

                {Array.from({ length: 55 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-blue-300"
                    style={{
                      height: `${20 + ((i * 19) % 150)}px`,
                      animation: `wave ${1.8 + (i % 5) * 0.2}s ease-in-out infinite`,
                      animationDelay: `${i * 0.04}s`,
                    }}
                  />
                ))}

              </div>

              {/* Number */}
              <div className="absolute right-8 top-6 select-none text-[90px] font-black leading-none text-white/[0.025] sm:right-12 sm:text-[130px]">
                01
              </div>

              <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">

                <div>

                  <div className="mb-6 flex flex-wrap items-center gap-3">

                    <span className="flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.3em] text-blue-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                      Upcoming
                    </span>

                    {isMD && (
                      <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">
                        Music Director
                      </span>
                    )}

                  </div>

                  <h3 className="max-w-3xl text-3xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
                    {nextMinistration.title || 'Upcoming Ministration'}
                  </h3>

                  <div className="mt-7 flex flex-wrap gap-x-7 gap-y-4 text-xs text-white/35">

                    {nextMinistration.date && (
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-blue-300/60" />
                        {nextMinistration.date}
                      </span>
                    )}

                    {nextMinistration.time && (
                      <span className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-blue-300/60" />
                        {nextMinistration.time}
                      </span>
                    )}

                    {nextMinistration.venue && (
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-300/60" />
                        {nextMinistration.venue}
                      </span>
                    )}

                  </div>

                </div>

                <div className="flex h-16 w-16 items-center justify-center self-end rounded-full border border-white/[0.08] bg-white/[0.025] transition-all duration-500 group-hover:border-blue-400/30 group-hover:bg-blue-500/10 lg:self-center">

                  <ChevronRight className="h-5 w-5 text-white/30 transition-all duration-500 group-hover:translate-x-1 group-hover:text-blue-300" />

                </div>

              </div>
            </button>
          ) : (
            <div className="mt-9 rounded-[36px] border border-dashed border-white/[0.08] bg-[#06080c] p-16 text-center">

              <Radio className="mx-auto h-10 w-10 text-white/10" />

              <p className="mt-5 text-sm text-white/25">
                No upcoming ministration yet.
              </p>

            </div>
          )}

        </section>

        {/* ============================================================
            REPERTOIRE + TEAM
        ============================================================ */}

        <section className="mt-24 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">

          {/* RECENT SONGS */}
          <div className="overflow-hidden rounded-[36px] border border-white/[0.08] bg-[#06080c]">

            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-6 sm:px-8">

              <div>

                <div className="mb-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.35em] text-blue-400/50">
                  <Music2 className="h-3 w-3" />
                  Repertoire
                </div>

                <h2 className="text-xl font-bold text-white">
                  Recent additions
                </h2>

              </div>

              <button
                onClick={() => setActiveTab('songs')}
                className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-blue-300"
              >
                View all
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

            </div>

            <div className="divide-y divide-white/[0.05]">

              {recentSongs.length > 0 ? (
                recentSongs.map((song, index) => (
                  <button
                    key={song.id}
                    onClick={() => onSelectSong(song)}
                    className="group flex w-full items-center gap-5 px-6 py-5 text-left transition-all duration-300 hover:bg-blue-500/[0.025] sm:px-8"
                  >

                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">

                      <span className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />

                      <span className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-blue-400/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                      <Music2 className="relative h-4 w-4 text-white/30 transition-colors group-hover:text-blue-300" />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-white/70 transition-colors group-hover:text-white">
                        {song.title}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/20">
                          Track {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-blue-400/30" />

                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-300/30">
                          Jewels
                        </span>
                      </div>

                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-white/10 transition-all group-hover:border-white/[0.07] group-hover:bg-white/[0.025] group-hover:text-blue-300">

                      <ChevronRight className="h-4 w-4" />

                    </div>

                  </button>
                ))
              ) : (
                <div className="px-8 py-16 text-center">
                  <Music2 className="mx-auto h-8 w-8 text-white/10" />
                  <p className="mt-4 text-sm text-white/25">
                    No songs available yet.
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* TEAM */}
          <div className="overflow-hidden rounded-[36px] border border-white/[0.08] bg-[#06080c]">

            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-6">

              <div>

                <div className="mb-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.35em] text-purple-400/50">
                  <Mic2 className="h-3 w-3" />
                  The voices
                </div>

                <h2 className="text-xl font-bold text-white">
                  Music team
                </h2>

              </div>

              <button
                onClick={() => setActiveTab('team')}
                className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-purple-300"
              >
                Team
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

            </div>

            <div className="p-6">

              {featuredTeam.length > 0 ? (
                <div className="space-y-2">

                  {featuredTeam.map((member, index) => (
                    <div
                      key={member.id || index}
                      className="group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:border-white/[0.06] hover:bg-white/[0.02]"
                    >

                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-gradient-to-br from-white/[0.07] to-transparent">

                        <Mic2 className="h-4 w-4 text-white/25 transition-colors group-hover:text-purple-300" />

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-xs font-semibold text-white/65 group-hover:text-white/80">
                          {member.name}
                        </p>

                        <p className="mt-1 truncate text-[8px] font-bold uppercase tracking-[0.2em] text-white/20">
                          {member.role || 'Music Team'}
                        </p>

                      </div>

                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60 shadow-[0_0_9px_rgba(52,211,153,0.4)]" />

                    </div>
                  ))}

                </div>
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center text-center">

                  <Users className="h-9 w-9 text-white/10" />

                  <p className="mt-4 text-sm text-white/25">
                    No team members available.
                  </p>

                </div>
              )}

            </div>
          </div>

        </section>

        {/* ============================================================
            FINAL BRAND STATEMENT
        ============================================================ */}

        <section className="relative mt-24 overflow-hidden rounded-[38px] border border-white/[0.07] bg-[#030406] px-6 py-20 text-center sm:px-10">

          <div
            className="absolute left-1/2 top-1/2 h-[450px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            style={{
              background:
                'radial-gradient(circle, rgba(37,99,235,0.1), transparent 68%)',
            }}
          />

          <div className="relative">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.07] text-blue-300 shadow-[0_0_40px_rgba(37,99,235,0.08)]">
              <Zap className="h-5 w-5" />
            </div>

            <p className="mt-7 text-[8px] font-bold uppercase tracking-[0.5em] text-blue-300/45">
              Jewels of His Crown
            </p>

            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              One ministry.
              <span className="text-white/25"> One sound.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-xs leading-7 text-white/25 sm:text-sm">
              Prepared in unity. Delivered with purpose.
              Built to help the ministry carry its sound wherever it goes.
            </p>

            <div className="mt-9 flex items-center justify-center gap-4 text-[8px] font-bold uppercase tracking-[0.45em] text-white/15">
              <span className="h-px w-12 bg-white/[0.08]" />
              We Sing to Convert
              <span className="h-px w-12 bg-white/[0.08]" />
            </div>

          </div>
        </section>

      </main>

      {/* ============================================================
          ANIMATION ENGINE
      ============================================================ */}

      <style>{`
        @keyframes jewelReveal {
          0% {
            opacity: 0;
            transform: translateY(55px) scale(0.9);
            filter: blur(16px);
            letter-spacing: -0.14em;
          }

          45% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            letter-spacing: -0.09em;
          }
        }

        @keyframes edgeReveal {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 0.18;
            transform: translateY(0);
          }
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroBreath {
          0%,
          100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.8;
          }

          50% {
            transform: translateX(-50%) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes ringFloat {
          0%,
          100% {
            transform: translate(-50%, -50%) rotate(-7deg) scale(1);
          }

          50% {
            transform: translate(-50%, -50%) rotate(1deg) scale(1.05);
          }
        }

        @keyframes ringFloatReverse {
          0%,
          100% {
            transform: translate(-50%, -50%) rotate(12deg) scale(1);
          }

          50% {
            transform: translate(-50%, -50%) rotate(4deg) scale(0.96);
          }
        }

        @keyframes laserMove {
          0%,
          100% {
            transform: translateX(-5%);
            opacity: 0.2;
          }

          50% {
            transform: translateX(5%);
            opacity: 0.7;
          }
        }

        @keyframes shine {
          0% {
            left: -30%;
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          42% {
            left: 120%;
            opacity: 0;
          }

          100% {
            left: 120%;
            opacity: 0;
          }
        }

        @keyframes particle {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          25% {
            transform: translate3d(12px, -20px, 0);
          }

          50% {
            transform: translate3d(-8px, -40px, 0);
          }

          75% {
            transform: translate3d(16px, -15px, 0);
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: scaleY(0.45);
            opacity: 0.25;
          }

          50% {
            transform: scaleY(1);
            opacity: 0.8;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardView;
