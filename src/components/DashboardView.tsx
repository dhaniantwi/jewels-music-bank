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
  Music2,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ClipboardList,
  Users,
  Mic2
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
    ministrations.find(m => m.status === 'Upcoming') ||
    ministrations[0];

  const totalAssignedLeads =
    nextMinistration?.songs.filter(
      s => s.lead !== null
    ).length || 0;

  const totalMinSongs =
    nextMinistration?.songs.length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* =========================================================
          WELCOME
      ========================================================= */}

      <section className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 sm:p-6 shadow-2xl shadow-black/10 backdrop-blur-2xl">

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-2xl border border-[#007aff]/20 bg-[#007aff]/15 text-[#4da3ff] flex items-center justify-center flex-shrink-0">
            <Music2 className="w-6 h-6" />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2 mb-2">

              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4da3ff]">
                JEWELS MUSIC MINISTRY PORTAL
              </span>

              {isMD && (
                <span className="text-[10px] font-bold text-amber-300 border border-amber-500/20 bg-amber-500/15 px-2 py-1 rounded-lg">
                  MD ADMIN
                </span>
              )}

            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome, Music Team
            </h1>

            <p className="text-sm sm:text-base text-white/55 font-medium leading-relaxed max-w-2xl mt-2">
              Everything you need to prepare,
              organize, and deliver our
              ministrations in one place.
            </p>

          </div>

        </div>

        <div className="flex flex-wrap items-center gap-2.5 mt-5">

          <button
            onClick={() => setActiveTab('songs')}
            className="px-4 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Music2 className="w-4 h-4" />
            <span>Explore Song Bank</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (nextMinistration) {
                onSelectMinistration(nextMinistration);
                setActiveTab('ministrations');
              }
            }}
            disabled={!nextMinistration}
            className="px-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.055] hover:bg-white/10 text-white/80 text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ClipboardList className="w-4 h-4" />
            <span>
              View {nextMinistration?.name || 'Setlist'}
            </span>
          </button>

          <button
            onClick={openToolsModal}
            className="px-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.035] hover:bg-white/[0.08] text-white/55 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
          >
            <Wrench className="w-4 h-4 text-[#4da3ff]" />
            <span>Pitch Pipe & Metronome</span>
          </button>

        </div>

      </section>


      {/* =========================================================
          NEXT MINISTRATION
      ========================================================= */}

      {nextMinistration && (
        <section className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 sm:p-6 shadow-2xl shadow-black/10 backdrop-blur-2xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 pb-5 border-b border-white/10">

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2 mb-2">

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4da3ff] border border-[#007aff]/20 bg-[#007aff]/15 px-2.5 py-1 rounded-lg">
                  NEXT MINISTRATION
                </span>

                <span className="text-[10px] font-bold text-emerald-300 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {nextMinistration.status}
                </span>

              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {nextMinistration.name}
              </h2>

              <p className="text-sm text-white/50 font-medium mt-1 max-w-xl">
                {nextMinistration.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-white/40 font-semibold">

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#4da3ff]" />
                  <span>{nextMinistration.date}</span>
                </div>

                {nextMinistration.time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>{nextMinistration.time}</span>
                  </div>
                )}

                {nextMinistration.venue && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span>{nextMinistration.venue}</span>
                  </div>
                )}

              </div>

            </div>


            <div className="flex items-center gap-2 flex-shrink-0">

              <button
                onClick={() => {
                  onSelectMinistration(nextMinistration);
                  setActiveTab('ministrations');
                }}
                className="px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.055] hover:bg-white/10 text-white/80 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
              >
                <span className="hidden sm:inline">
                  View Setlist & Allocations
                </span>

                <span className="sm:hidden">
                  Setlist
                </span>

                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={openStageMode}
                title="Rehearse setlist in stage mode"
                className="px-4 py-3 rounded-2xl border border-[#007aff]/20 bg-[#007aff]/15 hover:bg-[#007aff]/25 text-[#4da3ff] text-xs sm:text-sm font-bold flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Radio className="w-4 h-4" />

                <span className="hidden sm:inline">
                  Stage Mode
                </span>
              </button>

            </div>

          </div>


          {/* STATS */}

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-5">

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl border border-[#007aff]/20 bg-[#007aff]/15 text-[#4da3ff] flex items-center justify-center flex-shrink-0">
                <Music2 className="w-5 h-5" />
              </div>

              <div>

                <span className="text-2xl sm:text-3xl font-extrabold text-white block leading-tight">
                  {totalMinSongs}
                </span>

                <span className="text-[10px] sm:text-xs font-bold text-white/35 uppercase tracking-wider">
                  Repertoire Songs
                </span>

              </div>

            </div>


            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl border border-amber-500/20 bg-amber-500/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                <Mic2 className="w-5 h-5" />
              </div>

              <div>

                <span className="text-2xl sm:text-3xl font-extrabold text-white block leading-tight">
                  {totalAssignedLeads} / {totalMinSongs}
                </span>

                <span className="text-[10px] sm:text-xs font-bold text-white/35 uppercase tracking-wider">
                  Lead Vocalists Allocated
                </span>

              </div>

            </div>

          </div>


          {/* SETLIST PREVIEW */}

          <div className="mt-5 pt-5 border-t border-white/10">

            <div className="flex items-center justify-between gap-3 mb-3">

              <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider">
                Planned Setlist Order
              </span>

              <button
                onClick={() => {
                  onSelectMinistration(nextMinistration);
                  setActiveTab('ministrations');
                }}
                className="text-xs font-bold text-[#4da3ff] hover:text-white transition-colors"
              >
                Manage Setlist & Leads
              </button>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">

              {nextMinistration.songs
                .slice(0, 4)
                .map((item, idx) => {

                  const song = songs.find(
                    s => s.id === item.songId
                  );

                  const leadMember = team.find(
                    m => m.id === item.lead
                  );

                  if (!song) return null;

                  return (
                    <button
                      type="button"
                      key={item.songId}
                      onClick={() => onSelectSong(song)}
                      className="text-left p-3 rounded-2xl border border-white/10 bg-white/[0.035] hover:bg-white/[0.08] transition-all cursor-pointer flex items-center justify-between gap-2"
                    >

                      <div className="flex items-center gap-2.5 min-w-0">

                        <span className="w-6 h-6 rounded-lg border border-[#007aff]/20 bg-[#007aff]/15 text-[11px] font-extrabold text-[#4da3ff] flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>

                        <div className="min-w-0">

                          <h4 className="text-xs font-bold text-white truncate">
                            {song.title}
                          </h4>

                          <p className="text-[10px] text-white/35 truncate flex items-center gap-1">
                            <Mic2 className="w-3 h-3 flex-shrink-0" />

                            {leadMember
                              ? `Lead: ${leadMember.name}`
                              : 'Lead: Unassigned'}
                          </p>

                        </div>

                      </div>

                      <span className="text-[10px] font-bold text-[#4da3ff] border border-[#007aff]/20 bg-[#007aff]/15 px-1.5 py-0.5 rounded-md flex-shrink-0">
                        {item.keyOverride || song.key}
                      </span>

                    </button>
                  );
                })}

            </div>

          </div>

        </section>
      )}


      {/* =========================================================
          QUICK ACCESS
      ========================================================= */}

      <section className="space-y-4">

        <div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4da3ff]">
            QUICK ACCESS
          </span>

          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Ministry Departments
          </h2>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* SONG BANK */}

          <button
            type="button"
            onClick={() => setActiveTab('songs')}
            className="text-left rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl hover:bg-white/[0.07] transition-all"
          >

            <div className="w-12 h-12 rounded-2xl border border-[#007aff]/20 bg-[#007aff]/15 text-[#4da3ff] flex items-center justify-center mb-4">
              <Music2 className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-extrabold text-[#4da3ff] uppercase tracking-wider block mb-1">
              REPERTOIRE LIBRARY
            </span>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Song Bank
            </h3>

            <p className="text-xs text-white/45 font-medium mt-1 leading-relaxed">
              Browse praise and worship songs,
              lyrics, multi-part vocal charts,
              band cues, and audio references.
            </p>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">

              <span className="text-xs font-bold text-white/70">
                {songs.length} Songs Loaded
              </span>

              <ChevronRight className="w-4 h-4 text-white/40" />

            </div>

          </button>


          {/* MINISTRATIONS */}

          <button
            type="button"
            onClick={() => setActiveTab('ministrations')}
            className="text-left rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl hover:bg-white/[0.07] transition-all"
          >

            <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.055] text-white/80 flex items-center justify-center mb-4">
              <ClipboardList className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-extrabold text-white/55 uppercase tracking-wider block mb-1">
              SERVICES & EVENTS
            </span>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Ministrations & Setlists
            </h3>

            <p className="text-xs text-white/45 font-medium mt-1 leading-relaxed">
              Build Sunday setlists,
              assign lead vocalists,
              configure key modulations
              and notes.
            </p>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">

              <span className="text-xs font-bold text-white/70">
                {ministrations.length} Events Scheduled
              </span>

              <ChevronRight className="w-4 h-4 text-white/40" />

            </div>

          </button>


          {/* MUSIC TEAM */}

          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className="text-left rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl hover:bg-white/[0.07] transition-all"
          >

            <div className="w-12 h-12 rounded-2xl border border-amber-500/20 bg-amber-500/15 text-amber-300 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block mb-1">
              PEOPLE & ROSTER
            </span>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Music Team
            </h3>

            <p className="text-xs text-white/45 font-medium mt-1 leading-relaxed">
              View vocal team,
              band instrumentalists,
              manage contacts,
              and add new members.
            </p>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">

              <span className="text-xs font-bold text-white/70">
                {team.length} Active Members
              </span>

              <ChevronRight className="w-4 h-4 text-white/40" />

            </div>

          </button>

        </div>

      </section>


      {/* =========================================================
          RECENT SONG REPERTOIRE
      ========================================================= */}

      <section className="space-y-4">

        <div className="flex items-center justify-between gap-3">

          <div>

            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4da3ff]">
              RECENT ADDITIONS
            </span>

            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Featured Ministry Songs
            </h2>

          </div>

          <button
            onClick={() => setActiveTab('songs')}
            className="text-xs font-bold text-[#4da3ff] hover:text-white transition-colors"
          >
            View All {songs.length} Songs
          </button>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {songs.slice(0, 3).map(song => (

            <button
              type="button"
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="text-left rounded-2xl border border-white/10 bg-white/[0.045] p-4 hover:bg-white/[0.08] transition-all flex items-center justify-between gap-3"
            >

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.055] flex items-center justify-center text-white/80 flex-shrink-0">
                  <Music2 className="w-5 h-5" />
                </div>

                <div className="min-w-0">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4da3ff] block">
                    {song.category}
                  </span>

                  <h4 className="text-sm font-bold text-white truncate">
                    {song.title}
                  </h4>

                  <p className="text-xs text-white/35 truncate">
                    {song.artist}
                  </p>

                </div>

              </div>


              <div className="text-right flex-shrink-0">

                <span className="text-xs font-extrabold text-[#4da3ff] block">
                  Key: {song.key}
                </span>

                <span className="text-[10px] text-white/35 font-medium">
                  {typeof song.tempo === 'string'
                    ? song.tempo.split(' ')[0]
                    : 'Tempo N/A'}
                </span>

              </div>

            </button>

          ))}

        </div>

      </section>

    </div>
  );
};
