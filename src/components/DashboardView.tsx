import React from 'react';
import {
  Song,
  Ministration,
  TeamMember,
  ActiveTab,
  ActiveRole
} from '../types';
import {
  Radio,
  Wrench,
  Sparkles,
  ArrowRight,
  Calendar,
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
  openStageMode
}) => {
  const isMD = activeRole === 'admin_md';

  const nextMinistration =
    ministrations.find(
      m => m.status === 'Upcoming'
    ) || ministrations[0];

  const totalAssignedLeads =
    nextMinistration?.songs.filter(
      s => s.lead !== null
    ).length || 0;

  const totalMinSongs =
    nextMinistration?.songs.length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* =========================================================
          1. WELCOME HERO
      ========================================================= */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-white/[0.045]
          border border-white/10
          backdrop-blur-xl
          p-6 sm:p-8 lg:p-10
          shadow-2xl
          shadow-black/20
        "
      >

        <div
          className="
            absolute
            -top-24
            -right-24
            w-80
            h-80
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
            w-72
            h-72
            rounded-full
            bg-[#7c3aed]/10
            blur-3xl
            pointer-events-none
          "
        />

        <div className="relative z-10 max-w-4xl">

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
              bg-[#007aff]/10
              border border-[#007aff]/20
              text-[#4da3ff]
              text-xs
              font-extrabold
              uppercase
              tracking-wider
              mb-4
            "
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              JEWELS MUSIC MINISTRY PORTAL
            </span>
          </div>

          <h1
            className="
              text-3xl
              sm:text-5xl
              font-extrabold
              text-white
              tracking-tight
              leading-[1.08]
              mb-3
            "
          >
            Welcome, Music Team 👋
          </h1>

          <p
            className="
              text-base
              sm:text-lg
              text-white/55
              font-medium
              leading-relaxed
              max-w-2xl
            "
          >
            Everything you need to prepare,
            organize, and deliver our
            ministrations in one place.
          </p>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
              mt-6
            "
          >

            {/* SONG BANK */}

            <button
              onClick={() =>
                setActiveTab('songs')
              }
              className="
                px-5
                py-2.5
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
              <span>
                🎵 Explore Song Bank
              </span>

              <ArrowRight className="w-4 h-4" />
            </button>


            {/* NEXT SETLIST */}

            <button
              onClick={() => {
                if (nextMinistration) {
                  onSelectMinistration(
                    nextMinistration
                  );
                  setActiveTab(
                    'ministrations'
                  );
                }
              }}
              className="
                px-5
                py-2.5
                rounded-2xl
                bg-white/[0.06]
                hover:bg-white/10
                text-white
                border border-white/10
                text-xs
                sm:text-sm
                font-bold
                flex
                items-center
                gap-2
                transition-all
                active:scale-95
              "
            >
              <span>
                📋 View{' '}
                {nextMinistration?.name ||
                  'Setlist'}
              </span>
            </button>


            {/* TOOLS */}

            <button
              onClick={openToolsModal}
              className="
                px-4
                py-2.5
                rounded-2xl
                bg-white/[0.04]
                hover:bg-white/10
                text-white/60
                hover:text-white
                border border-white/10
                text-xs
                sm:text-sm
                font-bold
                flex
                items-center
                gap-2
                transition-all
              "
            >
              <Wrench
                className="
                  w-3.5
                  h-3.5
                  text-[#4da3ff]
                "
              />

              <span>
                Pitch Pipe & Metronome
              </span>
            </button>

          </div>
        </div>
      </section>


      {/* =========================================================
          2. NEXT MINISTRATION
      ========================================================= */}

      {nextMinistration && (

        <section
          className="
            rounded-[32px]
            bg-white/[0.045]
            border border-white/10
            backdrop-blur-xl
            p-6
            sm:p-8
            shadow-2xl
            shadow-black/20
            relative
            overflow-hidden
          "
        >

          <div
            className="
              absolute
              top-0
              right-0
              w-64
              h-64
              bg-[#007aff]/5
              rounded-full
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
              pb-6
              border-b
              border-white/10
            "
          >

            <div>

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  mb-2
                "
              >

                <span
                  className="
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-wider
                    text-[#4da3ff]
                    bg-[#007aff]/10
                    border border-[#007aff]/10
                    px-2.5
                    py-1
                    rounded-full
                  "
                >
                  NEXT MINISTRATION
                </span>

                <span
                  className="
                    text-[11px]
                    font-bold
                    text-emerald-300
                    bg-emerald-500/10
                    border border-emerald-500/10
                    px-2
                    py-1
                    rounded-full
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <span
                    className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-emerald-400
                      animate-pulse
                    "
                  />

                  {nextMinistration.status}
                </span>

              </div>

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  text-white
                  tracking-tight
                "
              >
                {nextMinistration.name}
              </h2>

              <p
                className="
                  text-sm
                  text-white/50
                  font-medium
                  mt-1
                  max-w-xl
                "
              >
                {nextMinistration.description}
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-y-2
                  gap-x-4
                  mt-4
                  text-xs
                  text-white/40
                  font-semibold
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <Calendar
                    className="
                      w-3.5
                      h-3.5
                      text-[#4da3ff]
                    "
                  />

                  <span>
                    {nextMinistration.date}
                  </span>
                </div>

                {nextMinistration.time && (
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <Clock
                      className="
                        w-3.5
                        h-3.5
                        text-[#a78bfa]
                      "
                    />

                    <span>
                      {nextMinistration.time}
                    </span>
                  </div>
                )}

                {nextMinistration.venue && (
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <MapPin
                      className="
                        w-3.5
                        h-3.5
                        text-rose-400
                      "
                    />

                    <span>
                      {nextMinistration.venue}
                    </span>
                  </div>
                )}

              </div>
            </div>


            {/* ACTIONS */}

            <div
              className="
                flex
                items-center
                gap-2.5
                flex-shrink-0
              "
            >

              <button
                onClick={() => {
                  onSelectMinistration(
                    nextMinistration
                  );
                  setActiveTab(
                    'ministrations'
                  );
                }}
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-white/[0.08]
                  hover:bg-white/[0.13]
                  border border-white/10
                  text-white
                  text-xs
                  sm:text-sm
                  font-bold
                  flex
                  items-center
                  gap-2
                  shadow-lg
                  transition-all
                  active:scale-95
                "
              >
                <span>
                  View Setlist & Allocations
                </span>

                <ArrowRight className="w-4 h-4" />
              </button>


              <button
                onClick={openStageMode}
                title="Rehearse setlist in stage mode"
                className="
                  px-4
                  py-3
                  rounded-2xl
                  bg-[#007aff]/10
                  hover:bg-[#007aff]/20
                  text-[#4da3ff]
                  border border-[#007aff]/20
                  text-xs
                  sm:text-sm
                  font-bold
                  flex
                  items-center
                  gap-1.5
                  transition-all
                  active:scale-95
                "
              >
                <Radio
                  className="
                    w-4
                    h-4
                    text-[#ff9500]
                  "
                />

                <span className="hidden sm:inline">
                  Stage Mode
                </span>
              </button>

            </div>

          </div>


          {/* =====================================================
              STATS
          ====================================================== */}

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:gap-4
              mt-6
            "
          >

            <div
              className="
                p-4
                sm:p-5
                rounded-2xl
                bg-white/[0.035]
                border border-white/[0.07]
                flex
                items-center
                gap-3.5
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-[#007aff]/10
                  border border-[#007aff]/10
                  flex
                  items-center
                  justify-center
                  text-2xl
                  flex-shrink-0
                "
              >
                🎵
              </div>

              <div>

                <span
                  className="
                    text-2xl
                    sm:text-3xl
                    font-extrabold
                    text-white
                    block
                    leading-tight
                  "
                >
                  {totalMinSongs}
                </span>

                <span
                  className="
                    text-xs
                    font-bold
                    text-white/35
                    uppercase
                    tracking-wider
                  "
                >
                  Repertoire Songs
                </span>

              </div>

            </div>


            <div
              className="
                p-4
                sm:p-5
                rounded-2xl
                bg-white/[0.035]
                border border-white/[0.07]
                flex
                items-center
                gap-3.5
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-[#7c3aed]/10
                  border border-[#7c3aed]/10
                  flex
                  items-center
                  justify-center
                  text-2xl
                  flex-shrink-0
                "
              >
                🎤
              </div>

              <div>

                <span
                  className="
                    text-2xl
                    sm:text-3xl
                    font-extrabold
                    text-[#a78bfa]
                    block
                    leading-tight
                  "
                >
                  {totalAssignedLeads} /{' '}
                  {totalMinSongs}
                </span>

                <span
                  className="
                    text-xs
                    font-bold
                    text-white/35
                    uppercase
                    tracking-wider
                  "
                >
                  Lead Vocalists Allocated
                </span>

              </div>

            </div>

          </div>


          {/* =====================================================
              SETLIST PREVIEW
          ====================================================== */}

          <div
            className="
              mt-6
              pt-5
              border-t
              border-white/10
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                mb-3
              "
            >

              <span
                className="
                  text-xs
                  font-bold
                  text-white/35
                  uppercase
                  tracking-wider
                "
              >
                Planned Setlist Order
              </span>

              <button
                onClick={() => {
                  onSelectMinistration(
                    nextMinistration
                  );
                  setActiveTab(
                    'ministrations'
                  );
                }}
                className="
                  text-xs
                  font-bold
                  text-[#4da3ff]
                  hover:text-white
                  transition-colors
                "
              >
                Manage Setlist & Leads →
              </button>

            </div>


            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-2.5
              "
            >

              {nextMinistration.songs
                .slice(0, 4)
                .map((item, idx) => {

                  const song =
                    songs.find(
                      s => s.id === item.songId
                    );

                  const leadMember =
                    team.find(
                      m => m.id === item.lead
                    );

                  if (!song) return null;

                  return (
                    <div
                      key={item.songId}
                      onClick={() =>
                        onSelectSong(song)
                      }
                      className="
                        p-3
                        rounded-2xl
                        bg-white/[0.035]
                        border border-white/[0.07]
                        hover:border-[#007aff]/30
                        hover:bg-white/[0.07]
                        transition-all
                        cursor-pointer
                        group
                        flex
                        items-center
                        justify-between
                        gap-2
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2.5
                          min-w-0
                        "
                      >

                        <span
                          className="
                            w-6
                            h-6
                            rounded-lg
                            bg-[#007aff]/10
                            text-[11px]
                            font-extrabold
                            text-[#4da3ff]
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                          "
                        >
                          {idx + 1}
                        </span>

                        <div className="min-w-0">

                          <h4
                            className="
                              text-xs
                              font-bold
                              text-white
                              truncate
                              group-hover:text-[#4da3ff]
                              transition-colors
                            "
                          >
                            {song.title}
                          </h4>

                          <p
                            className="
                              text-[10px]
                              text-white/35
                              truncate
                            "
                          >
                            {leadMember
                              ? `🎤 Lead: ${leadMember.name}`
                              : '🎤 Lead: Unassigned'}
                          </p>

                        </div>

                      </div>

                      <span
                        className="
                          text-[10px]
                          font-bold
                          text-[#4da3ff]
                          bg-[#007aff]/10
                          px-1.5
                          py-0.5
                          rounded-md
                          flex-shrink-0
                        "
                      >
                        {item.keyOverride ||
                          song.key}
                      </span>

                    </div>
                  );
                })}

            </div>
          </div>

        </section>
      )}


      {/* =========================================================
          3. QUICK ACCESS
      ========================================================= */}

      <section className="space-y-4">

        <div
          className="
            flex
            items-center
            justify-between
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
              QUICK ACCESS
            </span>

            <h2
              className="
                text-2xl
                font-bold
                text-white
                tracking-tight
              "
            >
              Ministry Departments
            </h2>

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
        >

          {/* SONG BANK */}

          <div
            onClick={() =>
              setActiveTab('songs')
            }
            className="
              ios-card
              p-6
              cursor-pointer
              group
              flex
              flex-col
              justify-between
            "
          >

            <div>

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#007aff]/10
                  border border-[#007aff]/10
                  flex
                  items-center
                  justify-center
                  text-3xl
                  mb-4
                  group-hover:scale-105
                  transition-transform
                "
              >
                🎵
              </div>

              <span
                className="
                  text-[10px]
                  font-extrabold
                  text-[#4da3ff]
                  uppercase
                  tracking-wider
                  block
                  mb-1
                "
              >
                REPERTOIRE LIBRARY
              </span>

              <h3
                className="
                  text-xl
                  font-bold
                  text-white
                  tracking-tight
                "
              >
                Song Bank
              </h3>

              <p
                className="
                  text-xs
                  text-white/45
                  font-medium
                  mt-1
                  leading-relaxed
                "
              >
                Browse praise and worship songs,
                lyrics, multi-part vocal charts,
                band cues, and audio references.
              </p>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                pt-4
                mt-4
                border-t
                border-white/10
              "
            >

              <span
                className="
                  text-xs
                  font-bold
                  text-white/70
                "
              >
                {songs.length} Songs Loaded
              </span>

              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-white/5
                  group-hover:bg-[#007aff]
                  group-hover:text-white
                  flex
                  items-center
                  justify-center
                  text-white/40
                  transition-all
                "
              >
                <ChevronRight className="w-4 h-4" />
              </div>

            </div>

          </div>


          {/* MINISTRATIONS */}

          <div
            onClick={() =>
              setActiveTab('ministrations')
            }
            className="
              ios-card
              p-6
              cursor-pointer
              group
              flex
              flex-col
              justify-between
            "
          >

            <div>

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#7c3aed]/10
                  border border-[#7c3aed]/10
                  flex
                  items-center
                  justify-center
                  text-3xl
                  mb-4
                  group-hover:scale-105
                  transition-transform
                "
              >
                📋
              </div>

              <span
                className="
                  text-[10px]
                  font-extrabold
                  text-[#a78bfa]
                  uppercase
                  tracking-wider
                  block
                  mb-1
                "
              >
                SERVICES & EVENTS
              </span>

              <h3
                className="
                  text-xl
                  font-bold
                  text-white
                  tracking-tight
                "
              >
                Ministrations & Setlists
              </h3>

              <p
                className="
                  text-xs
                  text-white/45
                  font-medium
                  mt-1
                  leading-relaxed
                "
              >
                Build Sunday setlists,
                assign lead vocalists,
                configure key modulations
                and notes.
              </p>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                pt-4
                mt-4
                border-t
                border-white/10
              "
            >

              <span
                className="
                  text-xs
                  font-bold
                  text-white/70
                "
              >
                {ministrations.length}
                {' '}
                Events Scheduled
              </span>

              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-white/5
                  group-hover:bg-[#7c3aed]
                  group-hover:text-white
                  flex
                  items-center
                  justify-center
                  text-white/40
                  transition-all
                "
              >
                <ChevronRight className="w-4 h-4" />
              </div>

            </div>

          </div>


          {/* MUSIC TEAM */}

          <div
            onClick={() =>
              setActiveTab('team')
            }
            className="
              ios-card
              p-6
              cursor-pointer
              group
              flex
              flex-col
              justify-between
            "
          >

            <div>

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-amber-500/10
                  border border-amber-500/10
                  flex
                  items-center
                  justify-center
                  text-3xl
                  mb-4
                  group-hover:scale-105
                  transition-transform
                "
              >
                👥
              </div>

              <span
                className="
                  text-[10px]
                  font-extrabold
                  text-amber-300
                  uppercase
                  tracking-wider
                  block
                  mb-1
                "
              >
                PEOPLE & ROSTER
              </span>

              <h3
                className="
                  text-xl
                  font-bold
                  text-white
                  tracking-tight
                "
              >
                Music Team
              </h3>

              <p
                className="
                  text-xs
                  text-white/45
                  font-medium
                  mt-1
                  leading-relaxed
                "
              >
                View vocal team,
                band instrumentalists,
                manage contacts,
                and add new members.
              </p>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                pt-4
                mt-4
                border-t
                border-white/10
              "
            >

              <span
                className="
                  text-xs
                  font-bold
                  text-white/70
                "
              >
                {team.length} Active Members
              </span>

              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-white/5
                  group-hover:bg-amber-500
                  group-hover:text-white
                  flex
                  items-center
                  justify-center
                  text-white/40
                  transition-all
                "
              >
                <ChevronRight className="w-4 h-4" />
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          4. RECENT SONG REPERTOIRE
      ========================================================= */}

      <section className="space-y-4">

        <div
          className="
            flex
            items-center
            justify-between
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
              RECENT ADDITIONS
            </span>

            <h2
              className="
                text-2xl
                font-bold
                text-white
                tracking-tight
              "
            >
              Featured Ministry Songs
            </h2>

          </div>

          <button
            onClick={() =>
              setActiveTab('songs')
            }
            className="
              text-xs
              font-bold
              text-[#4da3ff]
              hover:text-white
              transition-colors
            "
          >
            View All {songs.length} Songs →
          </button>

        </div>


        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-3.5
          "
        >

          {songs
            .slice(0, 3)
            .map(song => (

              <div
                key={song.id}
                onClick={() =>
                  onSelectSong(song)
                }
                className="
                  ios-card
                  p-4
                  cursor-pointer
                  flex
                  items-center
                  justify-between
                  gap-3
                  group
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
                      w-12
                      h-12
                      rounded-2xl
                      bg-white/[0.05]
                      border border-white/[0.07]
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
                        font-bold
                        uppercase
                        tracking-wider
                        text-[#4da3ff]
                        block
                      "
                    >
                      {song.category}
                    </span>

                    <h4
                      className="
                        text-sm
                        font-bold
                        text-white
                        truncate
                        group-hover:text-[#4da3ff]
                        transition-colors
                      "
                    >
                      {song.title}
                    </h4>

                    <p
                      className="
                        text-xs
                        text-white/35
                        truncate
                      "
                    >
                      {song.artist}
                    </p>

                  </div>

                </div>


                <div
                  className="
                    text-right
                    flex-shrink-0
                  "
                >

                  <span
                    className="
                      text-xs
                      font-extrabold
                      text-[#4da3ff]
                      block
                    "
                  >
                    Key: {song.key}
                  </span>

                  <span
                    className="
                      text-[10px]
                      text-white/35
                      font-medium
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

      </section>

    </div>
  );
};
