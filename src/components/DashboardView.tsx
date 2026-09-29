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
          CINEMATIC JEWELS HERO
      ========================================================= */}
      <section
        className="
          jewels-hero
          group
          relative
          min-h-[650px]
          overflow-hidden
          rounded-[36px]
          border
          border-white/[0.07]
          bg-[#050507]
          shadow-[0_30px_100px_rgba(0,0,0,0.55)]
        "
      >
        {/* BACKGROUND LIGHT FIELD */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          {/* Main blue atmosphere */}
          <div
            className="
              absolute
              left-1/2
              top-[42%]
              h-[520px]
              w-[520px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#006eff]/[0.09]
              blur-[110px]
              transition-all
              duration-[1500ms]
              group-hover:bg-[#007aff]/[0.15]
              group-hover:scale-125
            "
          />

          {/* Upper spotlight */}
          <div
            className="
              jewels-spotlight
              absolute
              left-1/2
              top-[-280px]
              h-[600px]
              w-[600px]
              -translate-x-1/2
              rounded-full
              bg-[#007aff]/[0.06]
              blur-[100px]
            "
          />

          {/* Left atmosphere */}
          <div
            className="
              absolute
              -left-[220px]
              top-[20%]
              h-[500px]
              w-[500px]
              rounded-full
              bg-blue-600/[0.045]
              blur-[120px]
            "
          />

          {/* Right atmosphere */}
          <div
            className="
              absolute
              -right-[220px]
              bottom-[-100px]
              h-[500px]
              w-[500px]
              rounded-full
              bg-[#007aff]/[0.04]
              blur-[120px]
            "
          />

          {/* Horizon glow */}
          <div
            className="
              absolute
              bottom-[18%]
              left-1/2
              h-px
              w-[70%]
              -translate-x-1/2
              bg-gradient-to-r
              from-transparent
              via-[#007aff]/30
              to-transparent
              blur-[1px]
            "
          />

          {/* Fine grid */}
          <div
            className="
              absolute
              inset-0
              opacity-[0.025]
              [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
              [background-size:52px_52px]
            "
          />

          {/* Vignette */}
          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.48)_100%)]
            "
          />
        </div>

        {/* FLOATING PARTICLES */}
        <span className="jewel-particle jewel-particle-1" />
        <span className="jewel-particle jewel-particle-2" />
        <span className="jewel-particle jewel-particle-3" />
        <span className="jewel-particle jewel-particle-4" />
        <span className="jewel-particle jewel-particle-5" />
        <span className="jewel-particle jewel-particle-6" />
        <span className="jewel-particle jewel-particle-7" />
        <span className="jewel-particle jewel-particle-8" />

        {/* TOP EDGE LIGHT */}
        <div
          className="
            absolute
            left-1/2
            top-0
            h-px
            w-[45%]
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-[#1687ff]
            to-transparent
            shadow-[0_0_18px_rgba(0,122,255,0.9)]
            transition-all
            duration-1000
            group-hover:w-[70%]
          "
        />

        {/* MAIN HERO CONTENT */}
        <div
          className="
            relative
            z-10
            flex
            min-h-[650px]
            flex-col
            items-center
            justify-center
            px-5
            py-20
            text-center
            sm:px-8
            lg:py-24
          "
        >

          {/* MINISTRY LABEL */}
          <div className="jewels-reveal jewels-reveal-1">
            <div className="flex items-center gap-3">

              <div
                className="
                  h-px
                  w-12
                  bg-gradient-to-r
                  from-transparent
                  to-[#007aff]/60
                  sm:w-20
                "
              />

              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-[#007aff]/20
                  bg-[#007aff]/[0.06]
                  px-4
                  py-2
                  shadow-[0_0_30px_rgba(0,122,255,0.06)]
                  backdrop-blur-xl
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#4da3ff]
                    shadow-[0_0_10px_rgba(77,163,255,1)]
                  "
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.34em]
                    text-[#7abaff]
                    sm:text-[10px]
                  "
                >
                  Jewels of His Crown
                </span>
              </div>

              <div
                className="
                  h-px
                  w-12
                  bg-gradient-to-l
                  from-transparent
                  to-[#007aff]/60
                  sm:w-20
                "
              />

            </div>
          </div>

          {/* GIANT JEWELS WORDMARK */}
          <div
            className="
              jewels-wordmark
              relative
              mt-10
              sm:mt-12
            "
          >
            {/* Huge glow */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[220px]
                w-[650px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#007aff]/[0.075]
                blur-[90px]
                transition-all
                duration-1000
                group-hover:bg-[#007aff]/[0.13]
                group-hover:scale-110
              "
            />

            {/* Inner glow */}
            <div
              className="
                pointer-events-none
                absolute
                inset-[15%]
                rounded-full
                bg-[#1687ff]/10
                blur-[45px]
              "
            />

            <h1
              className="
                jewels-title
                relative
                select-none
                text-[88px]
                font-black
                uppercase
                leading-[0.72]
                tracking-[-0.085em]
                text-white
                sm:text-[130px]
                lg:text-[175px]
                xl:text-[195px]
              "
            >
              JEWELS

              {/* Light sweep */}
              <span
                className="
                  jewels-light-sweep
                  pointer-events-none
                  absolute
                  inset-y-[-15%]
                  left-[-20%]
                  w-[12%]
                  skew-x-[-18deg]
                  bg-gradient-to-r
                  from-transparent
                  via-white/50
                  to-transparent
                  blur-[4px]
                "
              />
            </h1>

            {/* Wordmark underline */}
            <div
              className="
                absolute
                -bottom-8
                left-1/2
                flex
                -translate-x-1/2
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-16
                  bg-gradient-to-r
                  from-transparent
                  to-[#007aff]/70
                  sm:w-24
                "
              />

              <span
                className="
                  h-2
                  w-2
                  rotate-45
                  border
                  border-[#4da3ff]
                  bg-[#007aff]/20
                  shadow-[0_0_14px_rgba(77,163,255,0.8)]
                "
              />

              <span
                className="
                  h-px
                  w-16
                  bg-gradient-to-l
                  from-transparent
                  to-[#007aff]/70
                  sm:w-24
                "
              />
            </div>
          </div>

          {/* SLOGAN */}
          <div
            className="
              jewels-reveal
              jewels-reveal-2
              mt-16
              flex
              items-center
              gap-3
              sm:mt-20
              sm:gap-5
            "
          >
            <div className="flex items-center gap-2">
              <span
                className="
                  h-px
                  w-8
                  bg-gradient-to-r
                  from-transparent
                  to-[#007aff]/50
                  sm:w-14
                "
              />

              <span
                className="
                  h-1.5
                  w-1.5
                  rotate-45
                  bg-[#4da3ff]
                  shadow-[0_0_12px_rgba(77,163,255,0.9)]
                "
              />
            </div>

            <div className="relative">
              <div
                className="
                  absolute
                  inset-x-0
                  top-1/2
                  h-10
                  -translate-y-1/2
                  rounded-full
                  bg-[#007aff]/10
                  blur-2xl
                "
              />

              <span
                className="
                  relative
                  text-[11px]
                  font-black
                  uppercase
                  tracking-[0.4em]
                  text-[#7abaff]
                  transition-all
                  duration-500
                  group-hover:text-white
                  sm:text-sm
                  sm:tracking-[0.5em]
                "
              >
                We Sing to Convert
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rotate-45
                  bg-[#4da3ff]
                  shadow-[0_0_12px_rgba(77,163,255,0.9)]
                "
              />

              <span
                className="
                  h-px
                  w-8
                  bg-gradient-to-l
                  from-transparent
                  to-[#007aff]/50
                  sm:w-14
                "
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <p
            className="
              jewels-reveal
              jewels-reveal-3
              mt-7
              max-w-xl
              text-xs
              leading-7
              text-white/30
              sm:text-sm
            "
          >
            A dedicated space for the music team to prepare,
            organise, and minister with excellence.
          </p>

          {/* ACTIONS */}
          <div
            className="
              jewels-reveal
              jewels-reveal-4
              mt-9
              flex
              flex-wrap
              justify-center
              gap-3
            "
          >
            {/* Song Bank */}
            <button
              type="button"
              onClick={() => setActiveTab('songs')}
              className="
                group/button
                relative
                flex
                items-center
                gap-2.5
                overflow-hidden
                rounded-2xl
                bg-[#007aff]
                px-6
                py-3.5
                text-xs
                font-bold
                text-white
                shadow-[0_10px_35px_rgba(0,122,255,0.25)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#087ff2]
                hover:shadow-[0_15px_45px_rgba(0,122,255,0.35)]
                active:scale-[0.97]
                sm:px-7
                sm:text-sm
              "
            >
              <span
                className="
                  absolute
                  inset-y-0
                  -left-20
                  w-14
                  rotate-12
                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover/button:translate-x-[240px]
                "
              />

              <Music className="relative h-4 w-4" />

              <span className="relative">
                Explore Song Bank
              </span>

              <ArrowRight
                className="
                  relative
                  h-4
                  w-4
                  transition-transform
                  duration-300
                  group-hover/button:translate-x-1
                "
              />
            </button>

            {/* Ministration */}
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
                gap-2.5
                rounded-2xl
                border
                border-white/10
                bg-white/[0.045]
                px-6
                py-3.5
                text-xs
                font-bold
                text-white/65
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#007aff]/25
                hover:bg-white/[0.07]
                hover:text-white
                active:scale-[0.97]
                sm:px-7
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

            {/* Tools */}
            <button
              type="button"
              onClick={openToolsModal}
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                px-5
                py-3.5
                text-xs
                font-bold
                text-white/35
                transition-all
                duration-300
                hover:border-white/15
                hover:bg-white/[0.05]
                hover:text-white
                active:scale-[0.97]
              "
            >
              <Wrench className="h-3.5 w-3.5 text-[#4da3ff]" />
              Music Tools
            </button>
          </div>

          {/* Bottom status */}
          <div
            className="
              absolute
              bottom-7
              left-1/2
              flex
              -translate-x-1/2
              items-center
              gap-2
              whitespace-nowrap
              text-[8px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-white/15
            "
          >
            <span
              className="
                h-1
                w-1
                rounded-full
                bg-emerald-400/60
                shadow-[0_0_8px_rgba(74,222,128,0.7)]
              "
            />

            Ministry Music Hub
          </div>
        </div>

        {/* HERO ANIMATIONS */}
        <style>{`
          .jewels-hero {
            isolation: isolate;
          }

          .jewels-hero::before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            border-radius: inherit;
            background:
              radial-gradient(
                ellipse at 50% 45%,
                rgba(0, 122, 255, 0.08),
                transparent 45%
              );
            animation: jewelsBreath 6s ease-in-out infinite;
          }

          .jewels-wordmark {
            animation: jewelsRise 1.1s cubic-bezier(.16,1,.3,1) both;
          }

          .jewels-title {
            text-shadow:
              0 0 20px rgba(0,122,255,0.10),
              0 0 55px rgba(0,122,255,0.08);
          }

          .jewels-light-sweep {
            animation: jewelsSweep 5s ease-in-out 1.5s infinite;
          }

          .jewels-spotlight {
            animation: spotlightFloat 8s ease-in-out infinite;
          }

          .jewels-reveal {
            opacity: 0;
            animation: jewelsReveal 0.9s cubic-bezier(.16,1,.3,1) forwards;
          }

          .jewels-reveal-1 {
            animation-delay: 0.1s;
          }

          .jewels-reveal-2 {
            animation-delay: 0.55s;
          }

          .jewels-reveal-3 {
            animation-delay: 0.8s;
          }

          .jewels-reveal-4 {
            animation-delay: 1.05s;
          }

          .jewel-particle {
            position: absolute;
            z-index: 2;
            width: 3px;
            height: 3px;
            border-radius: 9999px;
            background: #4da3ff;
            box-shadow:
              0 0 8px rgba(77,163,255,0.9),
              0 0 18px rgba(0,122,255,0.35);
            opacity: 0;
            pointer-events: none;
          }

          .jewel-particle-1 {
            left: 13%;
            top: 30%;
            animation: particleFloat 7s ease-in-out 1s infinite;
          }

          .jewel-particle-2 {
            left: 22%;
            top: 65%;
            animation: particleFloat 8s ease-in-out 2.5s infinite;
          }

          .jewel-particle-3 {
            left: 31%;
            top: 20%;
            animation: particleFloat 6s ease-in-out 1.8s infinite;
          }

          .jewel-particle-4 {
            right: 17%;
            top: 28%;
            animation: particleFloat 9s ease-in-out 0.5s infinite;
          }

          .jewel-particle-5 {
            right: 25%;
            top: 63%;
            animation: particleFloat 7s ease-in-out 3s infinite;
          }

          .jewel-particle-6 {
            right: 10%;
            top: 48%;
            animation: particleFloat 8s ease-in-out 2s infinite;
          }

          .jewel-particle-7 {
            left: 18%;
            top: 47%;
            animation: particleFloat 10s ease-in-out 4s infinite;
          }

          .jewel-particle-8 {
            right: 32%;
            top: 18%;
            animation: particleFloat 7s ease-in-out 3.5s infinite;
          }

          @keyframes jewelsReveal {
            0% {
              opacity: 0;
              transform: translateY(24px);
              filter: blur(8px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          @keyframes jewelsRise {
            0% {
              opacity: 0;
              transform: translateY(35px) scale(0.94);
              filter: blur(12px);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes jewelsSweep {
            0%,
            55%,
            100% {
              transform: translateX(-120px) skewX(-18deg);
              opacity: 0;
            }

            65% {
              opacity: 0.8;
            }

            78% {
              transform: translateX(1000px) skewX(-18deg);
              opacity: 0;
            }
          }

          @keyframes spotlightFloat {
            0%,
            100% {
              transform: translateX(-50%) translateY(0) scale(1);
              opacity: 0.7;
            }

            50% {
              transform: translateX(-50%) translateY(35px) scale(1.08);
              opacity: 1;
            }
          }

          @keyframes jewelsBreath {
            0%,
            100% {
              opacity: 0.65;
            }

            50% {
              opacity: 1;
            }
          }

          @keyframes particleFloat {
            0% {
              opacity: 0;
              transform: translate3d(0, 15px, 0) scale(0.5);
            }

            20% {
              opacity: 0.55;
            }

            50% {
              opacity: 0.2;
              transform: translate3d(12px, -35px, 0) scale(1);
            }

            80% {
              opacity: 0.45;
            }

            100% {
              opacity: 0;
              transform: translate3d(-8px, -70px, 0) scale(0.4);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .jewels-reveal,
            .jewels-wordmark,
            .jewels-light-sweep,
            .jewels-spotlight,
            .jewels-hero::before,
            .jewel-particle {
              animation: none !important;
            }

            .jewels-reveal {
              opacity: 1;
            }
          }
        `}</style>
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

          {/* Statistics */}
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

          {/* Planned Setlist */}
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

          {/* SONG BANK */}
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

          {/* MINISTRATIONS */}
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

          {/* MUSIC TEAM */}
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

        {/* Mobile View All */}
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
