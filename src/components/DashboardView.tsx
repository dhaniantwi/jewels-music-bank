import React from 'react';
import {
  Song,
  Ministration,
  TeamMember,
  ActiveTab,
  ActiveRole,
} from '../types';
import {
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

const DashboardView: React.FC<DashboardViewProps> = ({
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

  const nextMinistration = ministrations?.[0];
  const recentSongs = [...(songs || [])].slice(-6).reverse();
  const featuredTeam = [...(team || [])].slice(0, 6);

  const totalSongs = songs?.length || 0;
  const totalMinistrations = ministrations?.length || 0;
  const totalTeam = team?.length || 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#000000] text-white">
      {/* =========================================================
          GLOBAL ATMOSPHERE
      ========================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -left-[20%] top-[5%] h-[700px] w-[700px] rounded-full opacity-20 blur-[140px]"
          style={{
            background:
              'radial-gradient(circle, rgba(37,99,235,0.45) 0%, rgba(37,99,235,0) 70%)',
          }}
        />

        <div
          className="absolute -right-[15%] top-[30%] h-[600px] w-[600px] rounded-full opacity-15 blur-[150px]"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0) 70%)',
          }}
        />

        <div
          className="absolute left-[35%] top-[55%] h-[500px] w-[500px] rounded-full opacity-10 blur-[150px]"
          style={{
            background:
              'radial-gradient(circle, rgba(96,165,250,0.4) 0%, rgba(96,165,250,0) 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1700px] px-4 pb-20 pt-5 sm:px-6 lg:px-8">

        {/* =========================================================
            HERO
        ========================================================== */}

        <section className="group relative min-h-[700px] overflow-hidden rounded-[40px] border border-white/[0.08] bg-[#050507] shadow-[0_30px_120px_rgba(0,0,0,0.75)]">

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '55px 55px',
            }}
          />

          {/* Main spotlight */}
          <div
            className="absolute left-1/2 top-[-300px] h-[750px] w-[750px] -translate-x-1/2 rounded-full opacity-40 blur-[100px]"
            style={{
              background:
                'radial-gradient(circle, rgba(59,130,246,0.32) 0%, rgba(37,99,235,0.12) 35%, transparent 70%)',
              animation: 'spotlightFloat 8s ease-in-out infinite',
            }}
          />

          {/* Horizontal atmospheric light */}
          <div
            className="absolute left-[-20%] top-[45%] h-[1px] w-[140%] opacity-30 blur-[1px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(96,165,250,0.9), transparent)',
              animation: 'lightDrift 9s ease-in-out infinite',
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.82) 100%)',
            }}
          />

          {/* Floating particles */}
          {[
            ['left-[11%]', 'top-[18%]', 'delay-0'],
            ['left-[22%]', 'top-[70%]', 'delay-1'],
            ['left-[78%]', 'top-[20%]', 'delay-2'],
            ['left-[88%]', 'top-[58%]', 'delay-3'],
            ['left-[65%]', 'top-[78%]', 'delay-4'],
            ['left-[35%]', 'top-[12%]', 'delay-5'],
            ['left-[52%]', 'top-[88%]', 'delay-6'],
            ['left-[7%]', 'top-[48%]', 'delay-7'],
          ].map(([position, vertical, delay], index) => (
            <span
              key={index}
              className={`absolute ${position} ${vertical} h-[3px] w-[3px] rounded-full bg-blue-300 shadow-[0_0_14px_rgba(96,165,250,0.9)] ${delay}`}
              style={{
                animation: `particleFloat ${5 + (index % 4)}s ease-in-out infinite`,
                animationDelay: `${index * 0.65}s`,
              }}
            />
          ))}

          {/* Top edge highlight */}
          <div className="absolute left-1/2 top-0 h-px w-[75%] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          {/* HERO CONTENT */}
          <div className="relative z-10 flex min-h-[700px] flex-col items-center justify-center px-6 py-20 text-center">

            {/* Ministry identity */}
            <div
              className="mb-9 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.45em] text-blue-300/80 sm:text-xs"
              style={{ animation: 'fadeUp 1s ease-out both' }}
            >
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-blue-400/60 sm:w-16" />

              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-300" />
                </span>

                Jewels of His Crown
              </span>

              <span className="h-px w-10 bg-gradient-to-l from-transparent to-blue-400/60 sm:w-16" />
            </div>

            {/* Giant wordmark */}
            <div className="relative">
              <h1
                className="select-none text-[72px] font-black leading-[0.78] tracking-[-0.075em] text-white sm:text-[115px] md:text-[145px] lg:text-[185px] xl:text-[215px]"
                style={{
                  animation: 'jewelsReveal 1.5s cubic-bezier(.16,1,.3,1) both',
                  textShadow:
                    '0 0 30px rgba(59,130,246,0.08), 0 0 100px rgba(37,99,235,0.08)',
                }}
              >
                JEWELS
              </h1>

              {/* Light sweep */}
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
                  maskImage:
                    'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
                }}
              >
                <div
                  className="absolute -left-[40%] top-0 h-full w-[22%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent blur-md"
                  style={{
                    animation: 'wordSweep 5s ease-in-out infinite',
                    animationDelay: '1.5s',
                  }}
                />
              </div>
            </div>

            {/* Signature line */}
            <div
              className="mt-8 flex items-center gap-4"
              style={{ animation: 'fadeUp 1s ease-out 0.4s both' }}
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400/60 sm:w-20" />

              <div className="relative flex items-center gap-3">
                <span className="text-sm font-medium uppercase tracking-[0.38em] text-white/75 sm:text-base">
                  We Sing to Convert
                </span>

                <Sparkles className="h-4 w-4 text-blue-300" />
              </div>

              <span className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400/60 sm:w-20" />
            </div>

            {/* Description */}
            <p
              className="mt-7 max-w-2xl text-sm leading-7 text-white/45 sm:text-base"
              style={{ animation: 'fadeUp 1s ease-out 0.55s both' }}
            >
              The digital home of the Jewels music ministry —
              where songs, ministrations, voices and worship
              come together as one sound.
            </p>

            {/* Hero actions */}
            <div
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
              style={{ animation: 'fadeUp 1s ease-out 0.7s both' }}
            >
              <button
                onClick={() => setActiveTab('songs')}
                className="group/btn relative flex h-12 items-center gap-3 overflow-hidden rounded-full bg-white px-6 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(96,165,250,0.2)]"
              >
                <Music2 className="h-4 w-4" />

                <span>Explore Song Bank</span>

                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
              </button>

              <button
                onClick={openStageMode}
                className="group/btn flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/[0.08] hover:text-white"
              >
                <Play className="h-4 w-4 text-blue-300" />

                <span>Stage Mode</span>

                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>

            {/* Bottom hero status */}
            <div
              className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.35em] text-white/25 sm:text-[10px]"
              style={{ animation: 'fadeUp 1s ease-out 1s both' }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              Ministry Music Hub
              <span className="text-white/10">•</span>
              Digital Worship Environment
            </div>
          </div>
        </section>

        {/* =========================================================
            LIVE STRIP
        ========================================================== */}

        <div className="relative -mt-5 px-3 sm:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08090c]/90 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-blue-500/10 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blue-500/10 to-transparent" />

            <div className="relative flex min-h-[62px] flex-wrap items-center justify-center gap-x-7 gap-y-3 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 sm:justify-between sm:px-7">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
                </span>
                <span className="text-blue-300/80">System Live</span>
              </div>

              <div className="hidden h-4 w-px bg-white/10 sm:block" />

              <div className="flex items-center gap-2">
                <Music2 className="h-3.5 w-3.5 text-white/30" />
                {totalSongs} Songs
              </div>

              <div className="hidden h-4 w-px bg-white/10 sm:block" />

              <div className="flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-white/30" />
                {totalMinistrations} Ministrations
              </div>

              <div className="hidden h-4 w-px bg-white/10 sm:block" />

              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-white/30" />
                {totalTeam} Team Members
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            SECTION HEADER
        ========================================================== */}

        <div className="mt-20 flex items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-blue-400/70">
              Command Center
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Everything for the sound.
            </h2>
          </div>

          <div className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/20 sm:flex">
            <Waves className="h-3.5 w-3.5" />
            Jewels Music Hub
          </div>
        </div>

        {/* =========================================================
            COMMAND CARDS
        ========================================================== */}

        <div className="mt-7 grid gap-4 md:grid-cols-3">

          {/* SONG BANK */}
          <button
            onClick={() => setActiveTab('songs')}
            className="group relative min-h-[190px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#08090c] p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-blue-400/25 hover:bg-[#0a0d12]"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-[60px] transition-all duration-500 group-hover:bg-blue-500/20" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
                  <Disc3 className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-5 w-5 text-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-300" />
              </div>

              <div className="mt-10">
                <div className="text-2xl font-bold text-white">
                  Song Bank
                </div>

                <p className="mt-1 text-sm text-white/35">
                  Browse the ministry repertoire
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/60">
                {totalSongs} available songs
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </button>

          {/* MINISTRATIONS */}
          <button
            onClick={() => setActiveTab('ministrations')}
            className="group relative min-h-[190px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#08090c] p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-purple-400/25 hover:bg-[#0b090f]"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-[60px] transition-all duration-500 group-hover:bg-purple-500/20" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-500/10 text-purple-300">
                  <Radio className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-5 w-5 text-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-purple-300" />
              </div>

              <div className="mt-10">
                <div className="text-2xl font-bold text-white">
                  Ministrations
                </div>

                <p className="mt-1 text-sm text-white/35">
                  Prepare the next sound
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300/60">
                {totalMinistrations} scheduled
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </button>

          {/* TOOLS */}
          <button
            onClick={openToolsModal}
            className="group relative min-h-[190px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#08090c] p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-[#080d0f]"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-[60px] transition-all duration-500 group-hover:bg-cyan-500/20" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-500/10 text-cyan-300">
                  <Headphones className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-5 w-5 text-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300" />
              </div>

              <div className="mt-10">
                <div className="text-2xl font-bold text-white">
                  Music Tools
                </div>

                <p className="mt-1 text-sm text-white/35">
                  Tune, transpose and rehearse
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/60">
                Pitch • Tempo • Key
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </button>
        </div>

        {/* =========================================================
            NEXT MINISTRATION
        ========================================================== */}

        <div className="mt-20 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-blue-400/70">
              Upcoming
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Next ministration
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('ministrations')}
            className="hidden items-center gap-1 text-xs font-semibold text-white/30 transition-colors hover:text-white sm:flex"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {nextMinistration ? (
          <button
            onClick={() => onSelectMinistration(nextMinistration)}
            className="group relative mt-7 block w-full overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#08090c] text-left transition-all duration-500 hover:border-blue-400/25"
          >
            {/* Background glow */}
            <div className="absolute right-[-10%] top-[-100%] h-[600px] w-[600px] rounded-full bg-blue-500/[0.08] blur-[120px] transition-all duration-700 group-hover:bg-blue-500/[0.13]" />

            {/* Decorative waveform */}
            <div className="absolute bottom-0 right-0 flex h-full w-[45%] items-center justify-end gap-[5px] overflow-hidden opacity-[0.07]">
              {Array.from({ length: 45 }).map((_, index) => (
                <span
                  key={index}
                  className="w-[3px] rounded-full bg-blue-300"
                  style={{
                    height: `${18 + ((index * 17) % 85)}px`,
                    animation: `wavePulse ${1.5 + (index % 5) * 0.2}s ease-in-out infinite`,
                    animationDelay: `${index * 0.05}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-8 items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.08] px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-blue-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                    Upcoming
                  </span>

                  {isMD && (
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      MD View
                    </span>
                  )}
                </div>

                <h3 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {nextMinistration.title || 'Upcoming Ministration'}
                </h3>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/40">
                  {nextMinistration.date && (
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-blue-300/70" />
                      {nextMinistration.date}
                    </span>
                  )}

                  {nextMinistration.time && (
                    <span className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-blue-300/70" />
                      {nextMinistration.time}
                    </span>
                  )}

                  {nextMinistration.venue && (
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-300/70" />
                      {nextMinistration.venue}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex h-14 w-14 items-center justify-center self-end rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:border-blue-400/30 group-hover:bg-blue-500/10 lg:self-center">
                <ChevronRight className="h-5 w-5 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-300" />
              </div>
            </div>
          </button>
        ) : (
          <div className="mt-7 rounded-[32px] border border-dashed border-white/[0.08] bg-[#08090c] p-12 text-center">
            <Radio className="mx-auto h-8 w-8 text-white/15" />

            <p className="mt-4 text-sm text-white/30">
              No upcoming ministration yet.
            </p>
          </div>
        )}

        {/* =========================================================
            SONG BANK + TEAM
        ========================================================== */}

        <div className="mt-20 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

          {/* RECENT SONGS */}
          <section className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#08090c]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5 sm:px-7">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-400/60">
                  Repertoire
                </p>

                <h2 className="mt-1 text-lg font-bold text-white">
                  Recent songs
                </h2>
              </div>

              <button
                onClick={() => setActiveTab('songs')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 transition-colors hover:text-blue-300"
              >
                Song bank
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-white/[0.05]">
              {recentSongs.length > 0 ? (
                recentSongs.map((song, index) => (
                  <button
                    key={song.id}
                    onClick={() => onSelectSong(song)}
                    className="group flex w-full items-center gap-4 px-6 py-4 text-left transition-colors duration-300 hover:bg-white/[0.025] sm:px-7"
                  >
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025]">
                      <span className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />

                      <Music2 className="relative h-4 w-4 text-white/35 transition-colors group-hover:text-blue-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-white/80 transition-colors group-hover:text-white">
                        {song.title}
                      </div>

                      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/25">
                        Song {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-white/15 transition-all group-hover:bg-blue-500/10 group-hover:text-blue-300">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-7 py-12 text-center text-sm text-white/25">
                  No songs available yet.
                </div>
              )}
            </div>
          </section>

          {/* TEAM */}
          <section className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#08090c]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-purple-400/60">
                  The Sound
                </p>

                <h2 className="mt-1 text-lg font-bold text-white">
                  Music team
                </h2>
              </div>

              <button
                onClick={() => setActiveTab('team')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 transition-colors hover:text-purple-300"
              >
                View
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="p-6">
              {featuredTeam.length > 0 ? (
                <div className="space-y-3">
                  {featuredTeam.map((member, index) => (
                    <div
                      key={member.id || index}
                      className="group flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-3 transition-all duration-300 hover:border-purple-400/15 hover:bg-purple-500/[0.03]"
                    >
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
                        <Mic2 className="h-4 w-4 text-white/35 group-hover:text-purple-300" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white/75">
                          {member.name}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.16em] text-white/25">
                          {member.role || 'Music Team'}
                        </p>
                      </div>

                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70 shadow-[0_0_10px_rgba(52,211,153,0.35)]" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                  <Users className="h-8 w-8 text-white/10" />

                  <p className="mt-4 text-sm text-white/25">
                    No team members available.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =========================================================
            FINAL CTA / IDENTITY
        ========================================================== */}

        <section className="relative mt-20 overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#050507] px-6 py-14 text-center sm:px-10">
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.07] blur-[100px]" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
              <Zap className="h-5 w-5" />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.4em] text-blue-300/50">
              Jewels of His Crown
            </p>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              One ministry.
              <span className="text-white/35"> One sound.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/30">
              Every rehearsal, every song, every voice and every
              ministration working together for one purpose.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-[0.35em] text-white/20">
              <span className="h-px w-10 bg-white/10" />
              We Sing to Convert
              <span className="h-px w-10 bg-white/10" />
            </div>
          </div>
        </section>

      </div>

      {/* =========================================================
          ANIMATION SYSTEM
      ========================================================== */}

      <style>{`
        @keyframes jewelsReveal {
          0% {
            opacity: 0;
            transform: translateY(45px) scale(0.94);
            letter-spacing: -0.12em;
            filter: blur(12px);
          }
          55% {
            opacity: 1;
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            letter-spacing: -0.075em;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spotlightFloat {
          0%,
          100% {
            transform: translateX(-50%) translateY(0) scale(1);
          }
          50% {
            transform: translateX(-50%) translateY(35px) scale(1.08);
          }
        }

        @keyframes wordSweep {
          0% {
            transform: translateX(-100%) skewX(-20deg);
          }
          30%,
          100% {
            transform: translateX(650%) skewX(-20deg);
          }
        }

        @keyframes lightDrift {
          0%,
          100% {
            transform: translateX(-8%);
            opacity: 0.15;
          }
          50% {
            transform: translateX(8%);
            opacity: 0.35;
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.15;
          }
          25% {
            transform: translate3d(10px, -18px, 0);
            opacity: 0.65;
          }
          50% {
            transform: translate3d(-8px, -35px, 0);
            opacity: 0.25;
          }
          75% {
            transform: translate3d(14px, -18px, 0);
            opacity: 0.55;
          }
        }

        @keyframes wavePulse {
          0%,
          100% {
            transform: scaleY(0.55);
            opacity: 0.35;
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
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardView;
