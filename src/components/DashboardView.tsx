import React from 'react';
import { Song, Ministration, TeamMember, ActiveTab, ActiveRole } from '../types';
import { Music, Calendar, Users, Radio, Wrench, Sparkles, ArrowRight, Play, Mic, Clock, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

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

  // Get primary next ministration (BaselFest 2026 or first upcoming)
  const nextMinistration = ministrations.find(m => m.status === 'Upcoming') || ministrations[0];

  const totalAssignedLeads = nextMinistration?.songs.filter(s => s.lead !== null).length || 0;
  const totalMinSongs = nextMinistration?.songs.length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* =========================================================
          1. WELCOME HERO (iOS Styled)
          ========================================================= */}
      <section className="text-center sm:text-left py-6 sm:py-8 px-4 sm:px-6 rounded-[32px] ios-glass bg-white/70 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-[#007aff]/15 to-[#7c3aed]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007aff]/10 border border-[#007aff]/20 text-[#007aff] text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JEWELS MUSIC MINISTRY PORTAL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1d1d1f] tracking-tight leading-[1.08] mb-3">
            Welcome, Music Team 👋
          </h1>

          <p className="text-base sm:text-lg text-[#6e6e73] font-medium leading-relaxed max-w-2xl">
            Everything you need to prepare, organize, and deliver our ministrations in one place.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => setActiveTab('songs')}
              className="px-5 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-[#007aff]/25 transition-all active:scale-95"
            >
              <span>🎵 Explore Song Bank</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (nextMinistration) {
                  onSelectMinistration(nextMinistration);
                  setActiveTab('ministrations');
                }
              }}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-black/5 text-[#1d1d1f] border border-black/10 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xs"
            >
              <span>📋 View {nextMinistration?.name || 'Setlist'}</span>
            </button>

            <button
              onClick={openToolsModal}
              className="px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-[#6e6e73] hover:text-[#1d1d1f] border border-black/10 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-[#007aff]" />
              <span>Pitch Pipe & Metronome</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. NEXT MINISTRATION SPOTLIGHT (BaselFest)
          Note: Instrument block removed as requested by user!
          ========================================================= */}
      {nextMinistration && (
        <section className="ios-glass rounded-[32px] p-6 sm:p-8 bg-white/85 shadow-xl border border-white/90 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-black/5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#007aff] bg-[#007aff]/10 px-2.5 py-0.5 rounded-full">
                  NEXT MINISTRATION
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {nextMinistration.status}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
                {nextMinistration.name}
              </h2>

              <p className="text-sm text-[#6e6e73] font-medium mt-1 max-w-xl">
                {nextMinistration.description}
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs text-[#86868b] font-semibold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#007aff]" />
                  <span>{nextMinistration.date}</span>
                </div>
                {nextMinistration.time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#7c3aed]" />
                    <span>{nextMinistration.time}</span>
                  </div>
                )}
                {nextMinistration.venue && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{nextMinistration.venue}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={() => {
                  onSelectMinistration(nextMinistration);
                  setActiveTab('ministrations');
                }}
                className="px-5 py-3 rounded-2xl bg-[#1d1d1f] hover:bg-black text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>View Setlist & Allocations</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={openStageMode}
                title="Rehearse setlist in stage mode"
                className="px-4 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/20 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Radio className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Stage Mode</span>
              </button>
            </div>
          </div>

          {/* Clean 2-Stat Row: (Instrument block removed as requested) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.03] border border-black/5 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#007aff]/15 to-[#007aff]/5 flex items-center justify-center text-2xl flex-shrink-0">
                🎵
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] block leading-tight">
                  {totalMinSongs}
                </span>
                <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
                  Repertoire Songs
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.03] border border-black/5 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#7c3aed]/15 to-[#7c3aed]/5 flex items-center justify-center text-2xl flex-shrink-0">
                🎤
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#7c3aed] block leading-tight">
                  {totalAssignedLeads} / {totalMinSongs}
                </span>
                <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
                  Lead Vocalists Allocated
                </span>
              </div>
            </div>

          </div>

          {/* Quick Song Preview Strip */}
          <div className="mt-6 pt-5 border-t border-black/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
                Planned Setlist Order
              </span>
              <button
                onClick={() => {
                  onSelectMinistration(nextMinistration);
                  setActiveTab('ministrations');
                }}
                className="text-xs font-bold text-[#007aff] hover:underline"
              >
                Manage Setlist & Leads →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {nextMinistration.songs.slice(0, 4).map((item, idx) => {
                const song = songs.find(s => s.id === item.songId);
                const leadMember = team.find(m => m.id === item.lead);
                if (!song) return null;
                return (
                  <div
                    key={item.songId}
                    onClick={() => onSelectSong(song)}
                    className="p-3 rounded-2xl bg-white/80 border border-black/5 hover:border-[#007aff]/30 hover:bg-white transition-all cursor-pointer group shadow-2xs flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-black/5 text-[11px] font-extrabold text-[#007aff] flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#1d1d1f] truncate group-hover:text-[#007aff] transition-colors">
                          {song.title}
                        </h4>
                        <p className="text-[10px] text-[#86868b] truncate">
                          {leadMember ? `🎤 Lead: ${leadMember.name}` : '🎤 Lead: Unassigned'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#007aff] bg-[#007aff]/10 px-1.5 py-0.5 rounded-md flex-shrink-0">
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
          3. QUICK ACCESS SECTION
          (Clean 3-card layout: Song Bank, Ministrations, Music Team
           — Lead Vocalist card removed from here as requested!)
          ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#007aff]">
              QUICK ACCESS
            </span>
            <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
              Ministry Departments
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Song Bank */}
          <div
            onClick={() => setActiveTab('songs')}
            className="ios-card p-6 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#007aff]/15 to-[#007aff]/5 flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform">
                🎵
              </div>
              <span className="text-[10px] font-extrabold text-[#007aff] uppercase tracking-wider block mb-1">
                REPERTOIRE LIBRARY
              </span>
              <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Song Bank
              </h3>
              <p className="text-xs text-[#6e6e73] font-medium mt-1 leading-relaxed">
                Browse praise and worship songs, lyrics, multi-part vocal charts, band cues, and audio references.
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/5">
              <span className="text-xs font-bold text-[#1d1d1f]">
                {songs.length} Songs Loaded
              </span>
              <div className="w-8 h-8 rounded-full bg-black/5 group-hover:bg-[#007aff] group-hover:text-white flex items-center justify-center text-[#6e6e73] transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Ministrations */}
          <div
            onClick={() => setActiveTab('ministrations')}
            className="ios-card p-6 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7c3aed]/15 to-[#7c3aed]/5 flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform">
                📋
              </div>
              <span className="text-[10px] font-extrabold text-[#7c3aed] uppercase tracking-wider block mb-1">
                SERVICES & EVENTS
              </span>
              <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Ministrations & Setlists
              </h3>
              <p className="text-xs text-[#6e6e73] font-medium mt-1 leading-relaxed">
                Build Sunday setlists, assign lead vocalists on the allocation bar, configure key modulations and notes.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/5">
              <span className="text-xs font-bold text-[#1d1d1f]">
                {ministrations.length} Events Scheduled
              </span>
              <div className="w-8 h-8 rounded-full bg-black/5 group-hover:bg-[#7c3aed] group-hover:text-white flex items-center justify-center text-[#6e6e73] transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Music Team */}
          <div
            onClick={() => setActiveTab('team')}
            className="ios-card p-6 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/15 to-orange-500/5 flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform">
                👥
              </div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block mb-1">
                PEOPLE & ROSTER
              </span>
              <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Music Team
              </h3>
              <p className="text-xs text-[#6e6e73] font-medium mt-1 leading-relaxed">
                View vocal team (Soprano, Alto, Tenor), band instrumentalists, manage contacts, and add new members.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/5">
              <span className="text-xs font-bold text-[#1d1d1f]">
                {team.length} Active Members
              </span>
              <div className="w-8 h-8 rounded-full bg-black/5 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center text-[#6e6e73] transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          4. RECENT SONG REPERTOIRE HIGHLIGHTS
          ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#007aff]">
              RECENT ADDITIONS
            </span>
            <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
              Featured Ministry Songs
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('songs')}
            className="text-xs font-bold text-[#007aff] hover:underline"
          >
            View All {songs.length} Songs →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {songs.slice(0, 3).map((song) => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="ios-card p-4.5 cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-black/[0.04] flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                  {song.icon || '🎵'}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#007aff] block">
                    {song.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#1d1d1f] truncate group-hover:text-[#007aff] transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-xs text-[#86868b] truncate">
                    {song.artist}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs font-extrabold text-[#007aff] block">
                  Key: {song.key}
                </span>
                <span className="text-[10px] text-[#86868b] font-medium">
                  {song.tempo.split(' ')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
