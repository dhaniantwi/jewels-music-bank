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
  CheckCircle2,
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
    <div className="w-full min-w-0 max-w-full space-y-5 bg-[#0f0f11] text-white animate-in fade-in duration-200">

      {/* WELCOME HERO */}
      <section
        className="
          rounded-[28px]
          border border-white/10
          bg-[#111113]/90
          p-5
          shadow-2xl
          shadow-black/10
          backdrop-blur-2xl
          sm:p-6
        "
      >
        <div className="max-w-3xl">
          <div
            className="
              mb-3
              inline-flex
              items-center
              gap-2
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
            <Sparkles className="h-3.5 w-3.5" />
            <span>JEWELS MUSIC MINISTRY PORTAL</span>
          </div>

          <h1
            className="
              text-3xl
              font-extrabold
              leading-tight
              tracking-tight
              text-white
              sm:text-5xl
            "
          >
            Welcome, Music Team
          </h1>

          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              font-medium
              leading-relaxed
              text-white/45
              sm:text-base
            "
          >
            Everything you need to prepare,
            organize, and deliver our
            ministrations in one place.
          </p>

          <div
            className="
              mt-5
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <button
              type="button"
              onClick={() =>
                setActiveTab('songs')
              }
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
              <Music className="h-4 w-4" />
              <span>Explore Song Bank</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (nextMinistration) {
                  onSelectMinistration(
                    nextMinistration
                  );
                  setActiveTab('ministrations');
                }
              }}
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                border border-white/5
                bg-[#1c1c1f]
                px-5
                py-3
                text-xs
                font-bold
                text-white/70
                transition-colors
                hover:bg-white/[0.08]
                hover:text-white
                active:scale-95
                sm:text-sm
              "
            >
              <Calendar className="h-4 w-4 text-[#4da3ff]" />
              <span>
                View {nextMinistration?.name || 'Setlist'}
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
                border border-white/5
                bg-[#1c1c1f]
                px-4
                py-3
                text-xs
                font-bold
                text-white/55
                transition-colors
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              <Wrench className="h-3.5 w-3.5 text-[#4da3ff]" />
              <span>Pitch Pipe & Metronome</span>
            </button>
          </div>
        </div>
      </section>

      {/* NEXT MINISTRATION */}
      {nextMinistration && (
        <section
          className="
            rounded-[28px]
            border border-white/10
            bg-[#111113]
            p-5
            shadow-2xl
            shadow-black/10
            backdrop-blur-2xl
            sm:p-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              border-b
              border-white/10
              pb-5
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div className="min-w-0">
              <div
                className="
                  mb-2
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    rounded-xl
                    border border-[#007aff]/20
                    bg-[#007aff]/15
                    px-2.5
                    py-1
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-wider
                    text-[#4da3ff]
                  "
                >
                  NEXT MINISTRATION
                </span>

                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-xl
                    border border-emerald-500/20
                    bg-emerald-500/10
                    px-2.5
                    py-1
                    text-[11px]
                    font-bold
                    text-emerald-300
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-emerald-400
                    "
                  />
                  {nextMinistration.status}
                </span>
              </div>

              <h2
                className="
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-white
                  sm:text-3xl
                "
              >
                {nextMinistration.name}
              </h2>

              <p
                className="
                  mt-1
                  max-w-xl
                  text-sm
                  font-medium
                  text-white/45
                "
              >
                {nextMinistration.description}
              </p>

              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                  text-xs
                  font-semibold
                  text-white/40
                "
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#4da3ff]" />
                  <span>{nextMinistration.date}</span>
                </div>

                {nextMinistration.time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-300" />
                    <span>
                      {nextMinistration.time}
                    </span>
                  </div>
                )}

                {nextMinistration.venue && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-white/55" />
                    <span>
                      {nextMinistration.venue}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              className="
                flex
                shrink-0
                flex-wrap
                items-center
                gap-2
              "
            >
              <button
                type="button"
                onClick={() => {
                  onSelectMinistration(
                    nextMinistration
                  );
                  setActiveTab('ministrations');
                }}
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
                <span>View Setlist & Allocations</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={openStageMode}
                title="Rehearse setlist in stage mode"
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-2xl
                  border border-amber-500/20
                  bg-amber-500/15
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-amber-200
                  transition-colors
                  hover:bg-amber-500/20
                  active:scale-95
                  sm:text-sm
                "
              >
                <Radio className="h-4 w-4 text-amber-300" />
                <span className="hidden sm:inline">
                  Stage Mode
                </span>
              </button>
            </div>
          </div>

          {/* STATS */}
          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-3.5
                rounded-2xl
                border border-white/10
                bg-black/35
                p-4
                sm:p-5
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border border-white/10
                  bg-[#0f0f11]
                "
              >
                <Music className="h-5 w-5 text-[#4da3ff]" />
              </div>

              <div className="min-w-0">
                <span
                  className="
                    block
                    text-2xl
                    font-extrabold
                    leading-tight
                    text-white
                    sm:text-3xl
                  "
                >
                  {totalMinSongs}
                </span>

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-white/40
                    sm:text-xs
                  "
                >
                  Repertoire Songs
                </span>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-3.5
                rounded-2xl
                border border-white/10
                bg-black/35
                p-4
                sm:p-5
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border border-amber-500/20
                  bg-amber-500/15
                "
              >
                <Mic className="h-5 w-5 text-amber-300" />
              </div>

              <div className="min-w-0">
                <span
                  className="
                    block
                    text-2xl
                    font-extrabold
                    leading-tight
                    text-amber-200
                    sm:text-3xl
                  "
                >
                  {totalAssignedLeads} / {totalMinSongs}
                </span>

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-white/40
                    sm:text-xs
                  "
                >
                  Lead Vocalists Allocated
                </span>
              </div>
            </div>
          </div>

          {/* PLANNED SETLIST */}
          <div
            className="
              mt-5
              border-t
              border-white/10
              pt-5
            "
          >
            <div
              className="
                mb-3
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <span
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-wider
                  text-white/40
                "
              >
                Planned Setlist Order
              </span>

              <button
                type="button"
                onClick={() => {
                  onSelectMinistration(
                    nextMinistration
                  );
                  setActiveTab('ministrations');
                }}
                className="
                  rounded-xl
                  border border-white/5
                  bg-[#1c1c1f]
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-[#4da3ff]
                  hover:bg-white/[0.08]
                  hover:text-white
                "
              >
                Manage Setlist & Leads
              </button>
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-2.5
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
                      onClick={() =>
                        onSelectSong(song)
                      }
                      className="
                        flex
                        cursor-pointer
                        items-center
                        justify-between
                        gap-2
                        rounded-2xl
                        border border-white/10
                        bg-black/35
                        p-3
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
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border border-white/10
                            bg-[#111113]
                            text-[11px]
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
                              truncate
                              text-[10px]
                              text-white/40
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
                          border border-[#007aff]/20
                          bg-[#007aff]/15
                          px-2
                          py-1
                          text-[10px]
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

      {/* QUICK ACCESS */}
      <section className="space-y-4">
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
              mt-1
              text-2xl
              font-bold
              tracking-tight
              text-white
            "
          >
            Ministry Departments
          </h2>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >
          {/* SONG BANK */}
          <div
            onClick={() =>
              setActiveTab('songs')
            }
            className="
              flex
              cursor-pointer
              flex-col
              justify-between
              rounded-[28px]
              border border-white/10
              bg-[#111113]
              p-5
              shadow-2xl
              shadow-black/10
              backdrop-blur-2xl
            "
          >
            <div>
              <div
                className="
                  mb-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border border-white/10
                  bg-[#0f0f11]
                "
              >
                <Music className="h-5 w-5 text-[#4da3ff]" />
              </div>

              <span
                className="
                  mb-1
                  block
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-wider
                  text-[#4da3ff]
                "
              >
                REPERTOIRE LIBRARY
              </span>

              <h3
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Song Bank
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  font-medium
                  leading-relaxed
                  text-white/45
                "
              >
                Browse praise and worship songs,
                lyrics, vocal charts, band cues,
                and audio references.
              </p>
            </div>

            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                border-t
                border-white/10
                pt-4
              "
            >
              <span
                className="
                  text-xs
                  font-bold
                  text-white/55
                "
              >
                {songs.length} Songs Loaded
              </span>

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-xl
                  border border-white/5
                  bg-[#1c1c1f]
                  text-white/45
                "
              >
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* MINISTRATIONS */}
          <div
            onClick={() =>
              setActiveTab('ministrations')
            }
            className="
              flex
              cursor-pointer
              flex-col
              justify-between
              rounded-[28px]
              border border-white/10
              bg-[#111113]
              p-5
              shadow-2xl
              shadow-black/10
              backdrop-blur-2xl
            "
          >
            <div>
              <div
                className="
                  mb-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border border-amber-500/20
                  bg-amber-500/15
                "
              >
                <Calendar className="h-5 w-5 text-amber-300" />
              </div>

              <span
                className="
                  mb-1
                  block
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-wider
                  text-amber-300
                "
              >
                SERVICES & EVENTS
              </span>

              <h3
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Ministrations & Setlists
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  font-medium
                  leading-relaxed
                  text-white/45
                "
              >
                Build service setlists, assign
                lead vocalists, configure keys,
                and manage ministry notes.
              </p>
            </div>

            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                border-t
                border-white/10
                pt-4
              "
            >
              <span
                className="
                  text-xs
                  font-bold
                  text-white/55
                "
              >
                {ministrations.length} Events Scheduled
              </span>

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-xl
                  border border-white/5
                  bg-[#1c1c1f]
                  text-white/45
                "
              >
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* MUSIC TEAM */}
          <div
            onClick={() =>
              setActiveTab('team')
            }
            className="
              flex
              cursor-pointer
              flex-col
              justify-between
              rounded-[28px]
              border border-white/10
              bg-[#111113]
              p-5
              shadow-2xl
              shadow-black/10
              backdrop-blur-2xl
            "
          >
            <div>
              <div
                className="
                  mb-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border border-white/10
                  bg-[#0f0f11]
                "
              >
                <Users className="h-5 w-5 text-[#4da3ff]" />
              </div>

              <span
                className="
                  mb-1
                  block
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-wider
                  text-[#4da3ff]
                "
              >
                PEOPLE & ROSTER
              </span>

              <h3
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Music Team
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  font-medium
                  leading-relaxed
                  text-white/45
                "
              >
                View vocalists, instrumentalists,
                contacts, roles, and team members.
              </p>
            </div>

            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                border-t
                border-white/10
                pt-4
              "
            >
              <span
                className="
                  text-xs
                  font-bold
                  text-white/55
                "
              >
                {team.length} Active Members
              </span>

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-xl
                  border border-white/5
                  bg-[#1c1c1f]
                  text-white/45
                "
              >
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT SONGS */}
      <section className="space-y-4">
        <div
          className="
            flex
            items-end
            justify-between
            gap-3
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
                mt-1
                text-2xl
                font-bold
                tracking-tight
                text-white
              "
            >
              Featured Ministry Songs
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveTab('songs')
            }
            className="
              rounded-xl
              border border-white/5
              bg-[#1c1c1f]
              px-3
              py-2
              text-xs
              font-bold
              text-[#4da3ff]
              hover:bg-white/[0.08]
              hover:text-white
            "
          >
            View All {songs.length} Songs
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
              onClick={() =>
                onSelectSong(song)
              }
              className="
                flex
                cursor-pointer
                items-center
                justify-between
                gap-3
                rounded-[28px]
                border border-white/10
                bg-[#111113]
                p-4
                shadow-2xl
                shadow-black/10
                backdrop-blur-2xl
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
                    h-12
                    w-12
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
                    <Music className="h-5 w-5 text-white/40" />
                  )}
                </div>

                <div className="min-w-0">
                  <span
                    className="
                      block
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#4da3ff]
                    "
                  >
                    {song.category}
                  </span>

                  <h4
                    className="
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
                      text-xs
                      text-white/40
                    "
                  >
                    {song.artist}
                  </p>
                </div>
              </div>

              <div
                className="
                  shrink-0
                  text-right
                "
              >
                <span
                  className="
                    block
                    text-xs
                    font-extrabold
                    text-[#4da3ff]
                  "
                >
                  Key: {song.key}
                </span>

                <span
                  className="
                    text-[10px]
                    font-medium
                    text-white/35
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
