import React from 'react';
import {
  Song,
  Ministration,
  TeamMember,
  ActiveTab,
  ActiveRole
} from '../types';
import {
  Music,
  Calendar,
  Users,
  Radio,
  Wrench,
  Sparkles,
  ArrowRight,
  Mic,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  songs: Song[];
  ministrations: Ministration[];
  team: TeamMember[];
  activeRole: ActiveRole;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectSong: (song: Song) => void;
  onSelectMinistration: (min: Ministration) => void;
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
  openStageMode
}) => {
  const isMD = activeRole === 'admin_md';

  const nextMinistration =
    ministrations.find(m => m.status === 'Upcoming') ||
    ministrations[0];

  const totalAssignedLeads =
    nextMinistration?.songs.filter(
      song => song.lead !== null
    ).length || 0;

  const totalMinSongs =
    nextMinistration?.songs.length || 0;

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 pb-8 text-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section
        className="
          group
          relative
          min-h-[520px]
          overflow-hidden
          rounded-[32px]
          border
          border-white/[0.08]
          bg-[#09090b]
          shadow-2xl
          shadow-black/30
        "
      >

        {/* =====================================================
            CINEMATIC BACKGROUND LIGHTING
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_42%,rgba(0,122,255,0.13),transparent_38%)]
            transition-all
            duration-1000
            group-hover:bg-[radial-gradient(circle_at_50%_42%,rgba(0,122,255,0.19),transparent_42%)]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[34%]
            h-[360px]
            w-[360px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#007aff]/[0.055]
            blur-[90px]
            animate-pulse
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-40
            top-[-100px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#007aff]/[0.045]
            blur-[100px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -right-40
            h-[450px]
            w-[450px]
            rounded-full
            bg-blue-500/[0.035]
            blur-[110px]
          "
        />

        {/* =====================================================
            VERY SUBTLE GRID / STAGE EFFECT
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        {/* =====================================================
            FLOATING LIGHT PARTICLES
        ===================================================== */}

        <span
          className="
            pointer-events-none
            absolute
            left-[15%]
            top-[24%]
            h-1
            w-1
            rounded-full
            bg-[#4da3ff]
            opacity-40
            shadow-[0_0_12px_rgba(77,163,255,0.8)]
            animate-pulse
          "
        />

        <span
          className="
            pointer-events-none
            absolute
            right-[18%]
            top-[29%]
            h-1.5
            w-1.5
            rounded-full
            bg-white
            opacity-20
            shadow-[0_0_15px_rgba(255,255,255,0.8)]
            animate-pulse
          "
        />

        <span
          className="
            pointer-events-none
            absolute
            left-[24%]
            bottom-[27%]
            h-1
            w-1
            rounded-full
            bg-[#007aff]
            opacity-30
            shadow-[0_0_10px_rgba(0,122,255,0.8)]
            animate-pulse
          "
        />

        <span
          className="
            pointer-events-none
            absolute
            right-[27%]
            bottom-[23%]
            h-1
            w-1
            rounded-full
            bg-[#4da3ff]
            opacity-25
            shadow-[0_0_10px_rgba(77,163,255,0.8)]
            animate-pulse
          "
        />

        {/* =====================================================
            TOP LIGHT
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-px
            w-1/2
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-[#007aff]/70
            to-transparent
            transition-all
            duration-1000
            group-hover:w-3/4
          "
        />

        {/* =====================================================
            MAIN HERO CONTENT
        ===================================================== */}

        <div
          className="
            relative
            flex
            min-h-[520px]
            flex-col
            items-center
            justify-center
            px-5
            py-14
            text-center
            sm:px-8
            lg:py-16
          "
        >

          {/* ===================================================
              MINISTRY IDENTITY
          =================================================== */}

          <div
            className="
              mb-8
              flex
              items-center
              gap-3
              opacity-90
              transition-all
              duration-700
              group-hover:opacity-100
            "
          >
            <span
              className="
                h-px
                w-8
                bg-gradient-to-r
                from-transparent
                to-[#007aff]/50
                sm:w-12
              "
            />

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <Sparkles
                className="
                  h-3.5
                  w-3.5
                  text-[#4da3ff]
                  animate-pulse
                "
              />

              <span
                className="
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[0.28em]
                  text-[#7abaff]
                  sm:text-[10px]
                  sm:tracking-[0.32em]
                "
              >
                Jewels of His Crown
              </span>

              <Sparkles
                className="
                  h-3.5
                  w-3.5
                  text-[#4da3ff]
                  animate-pulse
                "
              />
            </div>

            <span
              className="
                h-px
                w-8
                bg-gradient-to-l
                from-transparent
                to-[#007aff]/50
                sm:w-12
              "
            />
          </div>

          {/* ===================================================
              JEWELS WORDMARK
          =================================================== */}

          <div className="relative">

            {/* large atmospheric glow */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-40
                w-[420px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#007aff]/[0.08]
                blur-[70px]
                transition-all
                duration-1000
                group-hover:bg-[#007aff]/[0.13]
                group-hover:scale-110
              "
            />

            {/* concentrated wordmark glow */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-full
                bg-[#007aff]/10
                blur-3xl
                opacity-50
                transition-opacity
                duration-700
                group-hover:opacity-90
              "
            />

            <h1
              className="
                relative
                text-[72px]
                font-black
                uppercase
                leading-[0.85]
                tracking-[-0.075em]
                text-white
                drop-shadow-[0_0_35px_rgba(0,122,255,0.22)]
                transition-all
                duration-700
                group-hover:scale-[1.02]
                group-hover:drop-shadow-[0_0_45px_rgba(0,122,255,0.32)]
                sm:text-[100px]
                sm:tracking-[-0.085em]
                lg:text-[128px]
              "
            >
              Jewels
            </h1>

            {/* subtle blue underline */}
            <div
              className="
                absolute
                -bottom-5
                left-1/2
                h-px
                w-24
                -translate-x-1/2
                bg-gradient-to-r
                from-transparent
                via-[#007aff]/70
                to-transparent
                transition-all
                duration-700
                group-hover:w-36
              "
            />
          </div>

          {/* ===================================================
              SIGNATURE SLOGAN
          =================================================== */}

          <div
            className="
              mt-12
              flex
              items-center
              justify-center
              gap-3
              sm:gap-5
            "
          >

            {/* left ornament */}
            <div className="flex items-center gap-2">
              <span
                className="
                  h-px
                  w-8
                  bg-gradient-to-r
                  from-transparent
                  to-[#007aff]/40
                  transition-all
                  duration-700
                  group-hover:w-14
                  sm:w-12
                  sm:group-hover:w-20
                "
              />

              <span
                className="
                  h-1.5
                  w-1.5
                  rotate-45
                  border
                  border-[#4da3ff]/70
                  shadow-[0_0_10px_rgba(77,163,255,0.7)]
                "
              />
            </div>

            {/* central slogan */}
            <div className="relative">

              {/* glow behind slogan */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  top-1/2
                  h-8
                  -translate-y-1/2
                  rounded-full
                  bg-[#007aff]/10
                  blur-2xl
                  transition-all
                  duration-700
                  group-hover:bg-[#007aff]/20
                "
              />

              <div
                className="
                  relative
                  flex
                  items-center
                  gap-2.5
                "
              >
                <Sparkles
                  className="
                    h-3
                    w-3
                    text-[#4da3ff]
                    opacity-70
                    transition-all
                    duration-500
                    group-hover:opacity-100
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.32em]
                    text-[#6eaeff]
                    transition-all
                    duration-500
                    group-hover:text-white
                    sm:text-xs
                    sm:tracking-[0.42em]
                  "
                >
                  We Sing to Convert
                </span>

                <Sparkles
                  className="
                    h-3
                    w-3
                    text-[#4da3ff]
                    opacity-70
                    transition-all
                    duration-500
                    group-hover:opacity-100
                  "
                />
              </div>
            </div>

            {/* right ornament */}
            <div className="flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rotate-45
                  border
                  border-[#4da3ff]/70
                  shadow-[0_0_10px_rgba(77,163,255,0.7)]
                "
              />

              <span
                className="
                  h-px
                  w-8
                  bg-gradient-to-l
                  from-transparent
                  to-[#007aff]/40
                  transition-all
                  duration-700
                  group-hover:w-14
                  sm:w-12
                  sm:group-hover:w-20
                "
              />
            </div>
          </div>

          {/* ===================================================
              DESCRIPTION
          =================================================== */}

          <p
            className="
              mt-7
              max-w-lg
              text-xs
              leading-6
              text-white/30
              transition-all
              duration-500
              group-hover:text-white/45
              sm:text-sm
            "
          >
            A dedicated space for the music team to prepare,
            organise, and minister with excellence.
          </p>

          {/* ===================================================
              ACTIONS
          =================================================== */}

          <div
            className="
              mt-8
              flex
              flex-wrap
              justify-center
              gap-2.5
            "
          >
            <button
              type="button"
              onClick={() => setActiveTab('songs')}
              className="
                group/button
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
                transition-all
                duration-200
                hover:bg-[#087ff2]
                hover:shadow-blue-500/30
                active:scale-[0.97]
                sm:text-sm
              "
            >
              <Music className="h-4 w-4" />

              <span>
                Explore Song Bank
              </span>

              <ArrowRight
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-200
                  group-hover/button:translate-x-1
                "
              />
            </button>

            <button
              type="button"
              onClick={() => {
                if (nextMinistration) {
                  onSelectMinistration(nextMinistration);
                  setActiveTab('ministrations');
                }
              }}
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-white/10
                bg-white/[0.045]
                px-5
                py-3
                text-xs
                font-bold
                text-white/65
                transition-all
                duration-200
                hover:border-white/15
                hover:bg-white/[0.07]
                hover:text-white
                active:scale-[0.97]
                sm:text-sm
              "
            >
              <Calendar className="h-4 w-4 text-[#4da3ff]" />

              <span>
                {nextMinistration
                  ? `View ${nextMinistration.name}`
                  : 'View Ministrations'}
              </span>
            </button>

            <button
              type="button"
              onClick={openToolsModal}
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                px-4
                py-3
                text-xs
                font-bold
                text-white/40
                transition-all
                duration-200
                hover:border-white/15
                hover:bg-white/[0.055]
                hover:text-white
                active:scale-[0.97]
              "
            >
              <Wrench className="h-3.5 w-3.5 text-[#4da3ff]" />

              <span>
                Music Tools
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          NEXT MINISTRATION
      ========================================================= */}
      {nextMinistration && (
        <section
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-white/10
            bg-[#111113]/90
            shadow-2xl
            shadow-black/20
            backdrop-blur-2xl
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              p-5
              sm:p-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="min-w-0">
              <div
                className="
                  mb-3
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    rounded-lg
                    border
                    border-[#007aff]/20
                    bg-[#007aff]/10
                    px-2.5
                    py-1
                    text-[9px]
                    font-extrabold
                    uppercase
                    tracking-[0.15em]
                    text-[#4da3ff]
                  "
                >
                  Next Ministration
                </span>

                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    px-2.5
                    py-1
                    text-[9px]
                    font-bold
                    text-emerald-300
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {nextMinistration.status}
                </span>
              </div>

              <h2
                className="
                  truncate
                  text-2xl
                  font-extrabold
                  tracking-[-0.03em]
                  text-white
                  sm:text-3xl
                "
              >
                {nextMinistration.name}
              </h2>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-white/35
                "
              >
                {nextMinistration.description}
              </p>

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    font-semibold
                    text-white/40
                  "
                >
                  <Calendar className="h-3.5 w-3.5 text-[#4da3ff]" />
                  {nextMinistration.date}
                </div>

                {nextMinistration.time && (
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-white/40
                    "
                  >
                    <Clock className="h-3.5 w-3.5 text-amber-300" />
                    {nextMinistration.time}
                  </div>
                )}

                {nextMinistration.venue && (
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-white/40
                    "
                  >
                    <MapPin className="h-3.5 w-3.5 text-white/30" />
                    {nextMinistration.venue}
                  </div>
                )}
              </div>
            </div>

            <div
              className="
                flex
                shrink-0
                flex-wrap
                gap-2
              "
            >
              <button
                type="button"
                onClick={() => {
                  onSelectMinistration(nextMinistration);
                  setActiveTab('ministrations');
                }}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-[#007aff]
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-white
                  shadow-lg
                  shadow-blue-500/15
                  transition-all
                  hover:bg-[#087ff2]
                  active:scale-[0.97]
                  sm:px-5
                "
              >
                <span>View Setlist</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={openStageMode}
                title="Rehearse setlist in stage mode"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-amber-500/20
                  bg-amber-500/10
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-amber-200
                  transition-all
                  hover:bg-amber-500/15
                  active:scale-[0.97]
                "
              >
                <Radio className="h-4 w-4 text-amber-300" />

                <span className="hidden sm:inline">
                  Stage Mode
                </span>
              </button>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-px
              border-y
              border-white/10
              bg-white/10
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                bg-[#0d0d0f]
                p-4
                sm:p-5
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#007aff]/15
                  bg-[#007aff]/10
                  sm:h-11
                  sm:w-11
                "
              >
                <Music className="h-5 w-5 text-[#4da3ff]" />
              </div>

              <div className="min-w-0">
                <div
                  className="
                    text-2xl
                    font-extrabold
                    leading-none
                    text-white
                    sm:text-3xl
                  "
                >
                  {totalMinSongs}
                </div>

                <div
                  className="
                    mt-1.5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-white/30
                    sm:text-[9px]
                  "
                >
                  Repertoire Songs
                </div>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                bg-[#0d0d0f]
                p-4
                sm:p-5
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-amber-500/20
                  bg-amber-500/10
                  sm:h-11
                  sm:w-11
                "
              >
                <Mic className="h-5 w-5 text-amber-300" />
              </div>

              <div className="min-w-0">
                <div
                  className="
                    text-2xl
                    font-extrabold
                    leading-none
                    text-amber-200
                    sm:text-3xl
                  "
                >
                  {totalAssignedLeads} / {totalMinSongs}
                </div>

                <div
                  className="
                    mt-1.5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-white/30
                    sm:text-[9px]
                  "
                >
                  Leads Allocated
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div
              className="
                mb-3
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <span
                  className="
                    text-[9px]
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-white/30
                  "
                >
                  Planned Setlist
                </span>

                <p className="mt-1 text-xs text-white/20">
                  First four songs in performance order
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectMinistration(nextMinistration);
                  setActiveTab('ministrations');
                }}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  px-3
                  py-2
                  text-[9px]
                  font-bold
                  text-[#4da3ff]
                  transition-all
                  hover:border-white/15
                  hover:bg-white/[0.06]
                  hover:text-white
                "
              >
                Manage Setlist
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-2
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              {nextMinistration.songs
                .slice(0, 4)
                .map((item, idx) => {
                  const song = songs.find(
                    s => s.id === item.songId
                  );

                  const leadMember = team.find(
                    member => member.id === item.lead
                  );

                  if (!song) return null;

                  return (
                    <div
                      key={item.songId}
                      onClick={() => onSelectSong(song)}
                      className="
                        group
                        flex
                        min-w-0
                        cursor-pointer
                        items-center
                        justify-between
                        gap-2
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.025]
                        p-3
                        transition-all
                        duration-200
                        hover:border-[#007aff]/20
                        hover:bg-white/[0.055]
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2.5
                        "
                      >
                        <span
                          className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-white/10
                            bg-[#0d0d0f]
                            text-[10px]
                            font-extrabold
                            text-[#4da3ff]
                          "
                        >
                          {idx + 1}
                        </span>

                        <div className="min-w-0">
                          <h4
                            className="
                              truncate
                              text-xs
                              font-bold
                              text-white
                            "
                          >
                            {song.title}
                          </h4>

                          <p
                            className="
                              mt-0.5
                              truncate
                              text-[9px]
                              text-white/30
                            "
                          >
                            {leadMember
                              ? `Lead: ${leadMember.name}`
                              : 'Lead: Unassigned'}
                          </p>
                        </div>
                      </div>

                      <span
                        className="
                          shrink-0
                          rounded-lg
                          border
                          border-[#007aff]/20
                          bg-[#007aff]/10
                          px-2
                          py-1
                          text-[9px]
                          font-bold
                          text-[#4da3ff]
                        "
                      >
                        {item.keyOverride || song.key}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          QUICK ACCESS
      ========================================================= */}
      <section>
        <div className="mb-4">
          <span
            className="
              text-[9px]
              font-extrabold
              uppercase
              tracking-[0.18em]
              text-[#4da3ff]
            "
          >
            Quick Access
          </span>

          <h2
            className="
              mt-1
              text-xl
              font-extrabold
              tracking-[-0.025em]
              text-white
              sm:text-2xl
            "
          >
            Ministry Departments
          </h2>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-3
            md:grid-cols-3
          "
        >
          {/* Song Bank */}
          <div
            onClick={() => setActiveTab('songs')}
            className="
              group
              flex
              cursor-pointer
              flex-col
              justify-between
              rounded-[24px]
              border
              border-white/10
              bg-[#111113]/85
              p-5
              shadow-xl
              shadow-black/10
              backdrop-blur-2xl
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-[#007aff]/25
              hover:bg-[#141416]
            "
          >
            <div>
              <div
                className="
                  mb-5
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#007aff]/15
                  bg-[#007aff]/10
                "
              >
                <Music className="h-5 w-5 text-[#4da3ff]" />
              </div>

              <span
                className="
                  text-[8px]
                  font-extrabold
                  uppercase
                  tracking-[0.17em]
                  text-[#4da3ff]
                "
              >
                Repertoire Library
              </span>

              <h3
                className="
                  mt-1
                  text-lg
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Song Bank
              </h3>

              <p
                className="
                  mt-2
                  text-xs
                  leading-6
                  text-white/35
                "
              >
                Browse praise and worship songs,
                lyrics, vocal charts, band cues,
                and audio references.
              </p>
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                border-t
                border-white/10
                pt-4
              "
            >
              <span className="text-[10px] font-bold text-white/35">
                {songs.length} Songs Loaded
              </span>

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/10
                  bg-white/[0.025]
                  text-white/25
                  transition-all
                  group-hover:border-[#007aff]/20
                  group-hover:bg-[#007aff]/10
                  group-hover:text-[#4da3ff]
                "
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Ministrations */}
          <div
            onClick={() => setActiveTab('ministrations')}
            className="
              group
              flex
              cursor-pointer
              flex-col
              justify-between
              rounded-[24px]
              border
              border-white/10
              bg-[#111113]/85
              p-5
              shadow-xl
              shadow-black/10
              backdrop-blur-2xl
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-amber-500/20
              hover:bg-[#141416]
            "
          >
            <div>
              <div
                className="
                  mb-5
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-amber-500/20
                  bg-amber-500/10
                "
              >
                <Calendar className="h-5 w-5 text-amber-300" />
              </div>

              <span
                className="
                  text-[8px]
                  font-extrabold
                  uppercase
                  tracking-[0.17em]
                  text-amber-300
                "
              >
                Services & Events
              </span>

              <h3
                className="
                  mt-1
                  text-lg
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Ministrations & Setlists
              </h3>

              <p
                className="
                  mt-2
                  text-xs
                  leading-6
                  text-white/35
                "
              >
                Build service setlists, assign
                lead vocalists, configure keys,
                and manage ministry notes.
              </p>
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                border-t
                border-white/10
                pt-4
              "
            >
              <span className="text-[10px] font-bold text-white/35">
                {ministrations.length} Events Scheduled
              </span>

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/10
                  bg-white/[0.025]
                  text-white/25
                  transition-all
                  group-hover:border-amber-500/20
                  group-hover:bg-amber-500/10
                  group-hover:text-amber-300
                "
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Music Team */}
          <div
            onClick={() => setActiveTab('team')}
            className="
              group
              flex
              cursor-pointer
              flex-col
              justify-between
              rounded-[24px]
              border
              border-white/10
              bg-[#111113]/85
              p-5
              shadow-xl
              shadow-black/10
              backdrop-blur-2xl
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-[#007aff]/25
              hover:bg-[#141416]
            "
          >
            <div>
              <div
                className="
                  mb-5
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#007aff]/15
                  bg-[#007aff]/10
                "
              >
                <Users className="h-5 w-5 text-[#4da3ff]" />
              </div>

              <span
                className="
                  text-[8px]
                  font-extrabold
                  uppercase
                  tracking-[0.17em]
                  text-[#4da3ff]
                "
              >
                People & Roster
              </span>

              <h3
                className="
                  mt-1
                  text-lg
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Music Team
              </h3>

              <p
                className="
                  mt-2
                  text-xs
                  leading-6
                  text-white/35
                "
              >
                View vocalists, instrumentalists,
                contacts, roles, and team members.
              </p>
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                border-t
                border-white/10
                pt-4
              "
            >
              <span className="text-[10px] font-bold text-white/35">
                {team.length} Active Members
              </span>

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/10
                  bg-white/[0.025]
                  text-white/25
                  transition-all
                  group-hover:border-[#007aff]/20
                  group-hover:bg-[#007aff]/10
                  group-hover:text-[#4da3ff]
                "
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RECENT SONGS
      ========================================================= */}
      <section>
        <div
          className="
            mb-4
            flex
            items-end
            justify-between
            gap-3
          "
        >
          <div>
            <span
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.18em]
                text-[#4da3ff]
              "
            >
              Recent Additions
            </span>

            <h2
              className="
                mt-1
                text-xl
                font-extrabold
                tracking-[-0.025em]
                text-white
                sm:text-2xl
              "
            >
              Featured Ministry Songs
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('songs')}
            className="
              hidden
              shrink-0
              items-center
              gap-1
              rounded-xl
              border
              border-white/10
              bg-white/[0.025]
              px-3
              py-2
              text-[9px]
              font-bold
              text-[#4da3ff]
              transition-all
              hover:border-white/15
              hover:bg-white/[0.06]
              hover:text-white
              sm:flex
            "
          >
            View All
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {songs.slice(0, 3).map(song => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="
                group
                flex
                cursor-pointer
                items-center
                justify-between
                gap-3
                rounded-[24px]
                border
                border-white/10
                bg-[#111113]/85
                p-4
                shadow-xl
                shadow-black/10
                backdrop-blur-2xl
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-white/15
                hover:bg-[#141416]
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
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-[#0d0d0f]
                  "
                >
                  {song.icon ? (
                    <span className="text-lg">
                      {song.icon}
                    </span>
                  ) : (
                    <Music className="h-5 w-5 text-white/25" />
                  )}
                </div>

                <div className="min-w-0">
                  <span
                    className="
                      block
                      text-[8px]
                      font-extrabold
                      uppercase
                      tracking-[0.14em]
                      text-[#4da3ff]
                    "
                  >
                    {song.category}
                  </span>

                  <h4
                    className="
                      mt-0.5
                      truncate
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    {song.title}
                  </h4>

                  <p
                    className="
                      truncate
                      text-[10px]
                      text-white/30
                    "
                  >
                    {song.artist}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span
                  className="
                    block
                    text-[10px]
                    font-extrabold
                    text-[#4da3ff]
                  "
                >
                  Key: {song.key}
                </span>

                <span
                  className="
                    text-[9px]
                    font-medium
                    text-white/25
                  "
                >
                  {typeof song.tempo === 'string'
                    ? song.tempo.split(' ')[0]
                    : 'Tempo N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view-all */}
        <button
          type="button"
          onClick={() => setActiveTab('songs')}
          className="
            mt-3
            flex
            w-full
            items-center
            justify-center
            gap-1.5
            rounded-xl
            border
            border-white/10
            bg-white/[0.025]
            px-3
            py-2.5
            text-[9px]
            font-bold
            text-[#4da3ff]
            transition-all
            hover:bg-white/[0.06]
            hover:text-white
            sm:hidden
          "
        >
          View All {songs.length} Songs
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </section>

    </div>
  );
};
