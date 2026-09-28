import React, { useState } from 'react';
import {
  Ministration,
  Song,
  TeamMember,
  ActiveRole,
  SetlistSongItem
} from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Printer,
  Radio,
  Music2,
  Mic2,
  X,
  Edit3
} from 'lucide-react';
import { CHROMATIC_KEYS } from '../utils/audioUtils';

interface MinistrationsViewProps {
  ministrations: Ministration[];
  songs: Song[];
  team: TeamMember[];
  activeRole: ActiveRole;
  selectedMinistration: Ministration | null;
  onSelectMinistration: (min: Ministration) => void;
  onUpdateMinistration: (updated: Ministration) => void;
  onCreateMinistration: (newMin: Omit<Ministration, 'id'>) => void;
  onSelectSong: (song: Song) => void;
  openStageMode: () => void;
}

export const MinistrationsView: React.FC<MinistrationsViewProps> = ({
  ministrations,
  songs,
  team,
  activeRole,
  selectedMinistration,
  onSelectMinistration,
  onUpdateMinistration,
  onSelectSong,
  openStageMode
}) => {
  const [currentMin, setCurrentMin] = useState<Ministration>(
    selectedMinistration || ministrations[0]
  );

  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  React.useEffect(() => {
    if (selectedMinistration) {
      setCurrentMin(selectedMinistration);
    }
  }, [selectedMinistration]);

  const isMD = activeRole === 'admin_md';

  const vocalMembers = team.filter(
    m => m.type === 'vocal' || m.type === 'director'
  );

  const handleAssignLead = (
    songId: number,
    memberId: number | null
  ) => {
    if (!isMD) return;

    const updatedSongs = currentMin.songs.map(item => {
      if (item.songId === songId) {
        return { ...item, lead: memberId };
      }

      return item;
    });

    const updatedMin = {
      ...currentMin,
      songs: updatedSongs
    };

    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  const handleKeyOverride = (
    songId: number,
    newKey: string
  ) => {
    if (!isMD) return;

    const updatedSongs = currentMin.songs.map(item => {
      if (item.songId === songId) {
        return {
          ...item,
          keyOverride: newKey
        };
      }

      return item;
    });

    const updatedMin = {
      ...currentMin,
      songs: updatedSongs
    };

    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  const handleNoteChange = (
    songId: number,
    note: string
  ) => {
    if (!isMD) return;

    const updatedSongs = currentMin.songs.map(item => {
      if (item.songId === songId) {
        return {
          ...item,
          orderNote: note
        };
      }

      return item;
    });

    const updatedMin = {
      ...currentMin,
      songs: updatedSongs
    };

    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  const handleMoveSong = (
    index: number,
    direction: 'up' | 'down'
  ) => {
    if (!isMD) return;

    const newSongs = [...currentMin.songs];

    const targetIdx =
      direction === 'up'
        ? index - 1
        : index + 1;

    if (
      targetIdx < 0 ||
      targetIdx >= newSongs.length
    ) {
      return;
    }

    const temp = newSongs[index];
    newSongs[index] = newSongs[targetIdx];
    newSongs[targetIdx] = temp;

    const updatedMin = {
      ...currentMin,
      songs: newSongs
    };

    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  const handleRemoveSong = (songId: number) => {
    if (!isMD) return;

    const updatedSongs = currentMin.songs.filter(
      s => s.songId !== songId
    );

    const updatedMin = {
      ...currentMin,
      songs: updatedSongs
    };

    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  const handleAddSongToMin = (songId: number) => {
    if (
      currentMin.songs.some(
        item => item.songId === songId
      )
    ) {
      alert(
        'This song is already in this ministration setlist.'
      );
      return;
    }

    const song = songs.find(
      s => s.id === songId
    );

    const newItem: SetlistSongItem = {
      songId,
      lead: null,
      keyOverride: song?.key || 'G',
      orderNote:
        'Rehearse transition into this song.'
    };

    const updatedMin = {
      ...currentMin,
      songs: [
        ...currentMin.songs,
        newItem
      ]
    };

    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
    setIsAddSongModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const assignedLeadsCount =
    currentMin.songs.filter(
      s => s.lead !== null
    ).length;

  return (
    <div className="w-full min-w-0 max-w-full space-y-7 animate-in fade-in duration-300">

      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0d0d0f]/90 p-5 sm:p-7 lg:p-8 backdrop-blur-2xl shadow-2xl shadow-black/20">

        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#007aff]/10 blur-3xl pointer-events-none" />

        <div className="absolute -bottom-28 left-1/3 w-64 h-64 rounded-full bg-amber-500/[0.04] blur-3xl pointer-events-none" />

        <div className="relative flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2 mb-4">

              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff] bg-[#007aff]/10 border border-[#007aff]/20 px-3 py-1.5 rounded-full">
                <Music2 className="w-3 h-3" />
                Ministry Services
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                Setlist Control
              </span>

            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-[-0.03em] leading-tight">
              Ministrations & Setlists
            </h1>

            <p className="text-sm sm:text-[15px] text-white/40 font-medium mt-3 max-w-2xl leading-relaxed">
              Manage event song orders, assign lead vocalists,
              prepare performance keys, and direct rehearsals.
            </p>

          </div>

          {/* ACCESS STATUS */}

          <div className="w-full xl:w-auto rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 flex items-center gap-3 backdrop-blur-xl">

            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                isMD
                  ? 'bg-[#007aff] shadow-[0_0_16px_rgba(0,122,255,0.55)]'
                  : 'bg-white/30'
              }`}
            />

            <div className="min-w-0">

              <p className="text-[9px] uppercase tracking-[0.18em] font-extrabold text-white/30">
                Current Access
              </p>

              <p className="text-xs font-bold text-white mt-0.5 truncate">
                {isMD
                  ? 'Music Director Control'
                  : 'Read-only Member View'}
              </p>

            </div>

          </div>

        </div>

        {/* MINISTRATION SWITCHER */}

        <div className="relative mt-7 pt-5 border-t border-white/[0.07]">

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">

            {ministrations.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setCurrentMin(m);
                  onSelectMinistration(m);
                }}
                className={`group px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap border ${
                  currentMin.id === m.id
                    ? 'bg-[#007aff] text-white border-[#007aff] shadow-lg shadow-blue-500/20'
                    : 'bg-white/[0.025] text-white/45 border-white/10 hover:bg-white/[0.07] hover:text-white hover:border-white/15'
                }`}
              >

                <span>{m.name}</span>

                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    currentMin.id === m.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white/[0.07] text-white/35 group-hover:text-white/60'
                  }`}
                >
                  {m.songs.length}
                </span>

              </button>
            ))}

          </div>

        </div>

      </section>

      {/* =========================================================
          MAIN WORKSPACE
      ========================================================== */}

      <section className="rounded-[30px] border border-white/10 bg-[#111113]/90 p-4 sm:p-6 lg:p-7 space-y-7 backdrop-blur-2xl shadow-2xl shadow-black/20">

        {/* EVENT HEADER */}

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2 mb-3">

              <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#4da3ff] bg-[#007aff]/10 border border-[#007aff]/20 px-2.5 py-1.5 rounded-full">
                {currentMin.status}
              </span>

              {currentMin.theme && (
                <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-full">
                  Theme: {currentMin.theme}
                </span>
              )}

            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.025em]">
              {currentMin.name}
            </h2>

            <p className="text-sm text-white/40 font-medium mt-2 max-w-2xl leading-relaxed">
              {currentMin.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 mt-4 text-xs text-white/35 font-semibold">

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#4da3ff]" />
                <span>{currentMin.date}</span>
              </div>

              {currentMin.time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#4da3ff]" />
                  <span>{currentMin.time}</span>
                </div>
              )}

              {currentMin.venue && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentMin.venue}</span>
                </div>
              )}

            </div>

          </div>

          {/* ACTION BAR */}

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">

            <button
              onClick={openStageMode}
              className="px-4 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-[0.97] transition-all"
            >
              <Radio className="w-4 h-4" />
              <span>Launch Stage Mode</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-2xl border border-white/10 bg-white/[0.035] text-white/50 hover:bg-white/[0.08] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">
                Print Sheet
              </span>
            </button>

            {isMD && (
              <button
                onClick={() =>
                  setIsAddSongModalOpen(true)
                }
                className="px-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.035] hover:bg-white/[0.08] hover:border-[#007aff]/30 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 text-[#4da3ff]" />
                <span>Add Song to Set</span>
              </button>
            )}

          </div>

        </div>

        {/* =========================================================
            STATS
        ========================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4.5 flex items-center justify-between hover:bg-white/[0.05] transition-colors">

            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/30">
                Repertoire Size
              </p>

              <p className="text-2xl font-extrabold text-white mt-1 tracking-tight">
                {currentMin.songs.length}
              </p>

              <p className="text-[10px] text-white/25 font-medium mt-0.5">
                Songs in current set
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl border border-[#007aff]/20 bg-[#007aff]/10 flex items-center justify-center text-[#4da3ff] group-hover:bg-[#007aff]/15 transition-colors">
              <Music2 className="w-5 h-5" />
            </div>

          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4.5 flex items-center justify-between hover:bg-white/[0.05] transition-colors">

            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/30">
                Lead Vocalists Allocated
              </p>

              <p className="text-2xl font-extrabold text-white mt-1 tracking-tight">
                {assignedLeadsCount}
                <span className="text-sm text-white/25">
                  {' '}
                  / {currentMin.songs.length}
                </span>
              </p>

              <p className="text-[10px] text-white/25 font-medium mt-0.5">
                Vocal assignments completed
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-300 group-hover:bg-amber-500/15 transition-colors">
              <Mic2 className="w-5 h-5" />
            </div>

          </div>

        </div>

        {/* =========================================================
            SETLIST
        ========================================================== */}

        <div className="space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div>

              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#007aff]/10 border border-[#007aff]/15 flex items-center justify-center">
                  <Music2 className="w-3.5 h-3.5 text-[#4da3ff]" />
                </span>

                <span>Setlist Repertoire</span>
              </h3>

              <p className="text-xs text-white/30 mt-1.5">
                Direct song order, vocalist allocation,
                performance key and transition cues.
              </p>

            </div>

            <span className="w-fit text-[9px] font-extrabold tracking-[0.15em] text-white/30 bg-white/[0.025] border border-white/10 px-3 py-1.5 rounded-full">
              {isMD
                ? 'MD CONTROL ENABLED'
                : 'READ-ONLY VIEW'}
            </span>

          </div>

          {currentMin.songs.length > 0 ? (

            <div className="space-y-3">

              {currentMin.songs.map(
                (item, index) => {

                  const song = songs.find(
                    s => s.id === item.songId
                  );

                  const leadMember =
                    team.find(
                      m => m.id === item.lead
                    );

                  if (!song) return null;

                  const effectiveKey =
                    item.keyOverride ||
                    song.key;

                  return (
                    <article
                      key={item.songId}
                      className="group rounded-[26px] border border-white/10 bg-white/[0.035] hover:bg-white/[0.045] hover:border-white/[0.14] p-4 sm:p-5 space-y-4 backdrop-blur-xl transition-all duration-200"
                    >

                      {/* SONG HEADER */}

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="flex items-center gap-1 flex-shrink-0">

                            <span className="w-9 h-9 rounded-xl border border-[#007aff]/20 bg-[#007aff]/10 text-[11px] font-extrabold text-[#4da3ff] flex items-center justify-center">
                              {String(
                                index + 1
                              ).padStart(2, '0')}
                            </span>

                            {isMD && (
                              <div className="flex flex-col">

                                <button
                                  onClick={() =>
                                    handleMoveSong(
                                      index,
                                      'up'
                                    )
                                  }
                                  disabled={
                                    index === 0
                                  }
                                  title="Move up in order"
                                  className="w-5 h-4 flex items-center justify-center text-white/25 hover:text-[#4da3ff] disabled:opacity-10 transition-colors"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleMoveSong(
                                      index,
                                      'down'
                                    )
                                  }
                                  disabled={
                                    index ===
                                    currentMin.songs.length - 1
                                  }
                                  title="Move down in order"
                                  className="w-5 h-4 flex items-center justify-center text-white/25 hover:text-[#4da3ff] disabled:opacity-10 transition-colors"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>

                              </div>
                            )}

                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2 min-w-0">

                              <h4
                                onClick={() =>
                                  onSelectSong(song)
                                }
                                className="text-base font-bold text-white hover:text-[#4da3ff] cursor-pointer transition-colors truncate"
                              >
                                {song.title}
                              </h4>

                              <span className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-[#4da3ff] bg-[#007aff]/10 border border-[#007aff]/20 px-2 py-1 rounded-full flex-shrink-0">
                                {song.category}
                              </span>

                            </div>

                            <p className="text-[11px] text-white/30 font-medium truncate mt-1">
                              {song.artist} • {song.tempo}
                            </p>

                          </div>

                        </div>

                        <div className="flex items-center gap-2 self-start lg:self-auto">

                          <button
                            onClick={() =>
                              onSelectSong(song)
                            }
                            className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.07] hover:border-[#007aff]/25 text-[#4da3ff] text-[11px] font-bold transition-all"
                          >
                            View Arrangement
                          </button>

                          {isMD && (
                            <button
                              onClick={() =>
                                handleRemoveSong(
                                  item.songId
                                )
                              }
                              title="Remove from setlist"
                              className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.025] hover:bg-red-500/10 hover:border-red-500/20 text-white/30 hover:text-red-300 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                        </div>

                      </div>

                      {/* ALLOCATION BAR */}

                      <div className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-black/30 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                        {/* LEAD */}

                        <div className="md:col-span-5 flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-300 flex-shrink-0">
                            <Mic2 className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">

                            <label className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-amber-300 block mb-1.5">
                              Lead Vocalist
                            </label>

                            {isMD ? (

                              <select
                                value={
                                  item.lead || ''
                                }
                                onChange={e =>
                                  handleAssignLead(
                                    item.songId,
                                    e.target.value
                                      ? Number(
                                          e.target.value
                                        )
                                      : null
                                  )
                                }
                                className="w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all"
                              >

                                <option
                                  value=""
                                  className="bg-[#1a1a1d]"
                                >
                                  -- Not Assigned --
                                </option>

                                {vocalMembers.map(
                                  vm => (
                                    <option
                                      key={vm.id}
                                      value={vm.id}
                                      className="bg-[#1a1a1d]"
                                    >
                                      {vm.name}{' '}
                                      (
                                      {vm.voicePart ||
                                        vm.role}
                                      )
                                    </option>
                                  )
                                )}

                              </select>

                            ) : (

                              <span className="text-xs font-bold text-white">
                                {leadMember
                                  ? leadMember.name
                                  : 'Pending MD Assignment'}
                              </span>

                            )}

                          </div>

                        </div>

                        {/* KEY */}

                        <div className="md:col-span-3">

                          <label className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#4da3ff] block mb-1.5">
                            Performance Key
                          </label>

                          {isMD ? (

                            <select
                              value={
                                effectiveKey
                              }
                              onChange={e =>
                                handleKeyOverride(
                                  item.songId,
                                  e.target.value
                                )
                              }
                              className="w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-[#4da3ff] outline-none focus:border-[#007aff]/50 focus:ring-1 focus:ring-[#007aff]/10 transition-all"
                            >
                              {CHROMATIC_KEYS.map(
                                k => (
                                  <option
                                    key={k}
                                    value={k}
                                    className="bg-[#1a1a1d]"
                                  >
                                    {k} Major
                                  </option>
                                )
                              )}
                            </select>

                          ) : (

                            <span className="text-xs font-extrabold text-[#4da3ff]">
                              Key of {effectiveKey}
                            </span>

                          )}

                        </div>

                        {/* TRANSITION */}

                        <div className="md:col-span-4">

                          <label className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-white/30 block mb-1.5">
                            Transition Cue
                          </label>

                          {isMD ? (

                            <input
                              type="text"
                              placeholder="e.g. Drum swell transition"
                              value={
                                item.orderNote || ''
                              }
                              onChange={e =>
                                handleNoteChange(
                                  item.songId,
                                  e.target.value
                                )
                              }
                              className="w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#007aff]/50 focus:ring-1 focus:ring-[#007aff]/10 transition-all"
                            />

                          ) : (

                            <p className="text-xs text-white/40 truncate">
                              {item.orderNote ||
                                'Standard transition.'}
                            </p>

                          )}

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          ) : (

            <div className="text-center py-16 px-4 rounded-[28px] bg-white/[0.02] border border-dashed border-white/10">

              <div className="w-16 h-16 rounded-2xl border border-[#007aff]/20 bg-[#007aff]/10 flex items-center justify-center mx-auto mb-4 text-[#4da3ff]">
                <Music2 className="w-7 h-7" />
              </div>

              <p className="text-sm font-bold text-white">
                No songs in this setlist yet
              </p>

              <p className="text-xs text-white/30 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Add songs from the repertoire to
                build this service setlist.
              </p>

              {isMD && (
                <button
                  onClick={() =>
                    setIsAddSongModalOpen(true)
                  }
                  className="mt-5 px-4 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xl shadow-blue-500/20 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Songs Now</span>
                </button>
              )}

            </div>

          )}

        </div>

        {/* =========================================================
            MUSIC DIRECTOR NOTES
        ========================================================== */}

        <div className="relative overflow-hidden p-5 sm:p-6 rounded-[24px] border border-amber-500/20 bg-amber-500/[0.07]">

          <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-amber-500/[0.06] blur-2xl pointer-events-none" />

          <div className="relative flex items-center justify-between gap-3 mb-4">

            <div className="flex items-center gap-3 min-w-0">

              <div className="w-9 h-9 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-300 flex-shrink-0">
                <Edit3 className="w-4 h-4" />
              </div>

              <div className="min-w-0">

                <h4 className="text-sm font-bold text-amber-200">
                  Music Director Ministry Notes
                </h4>

                <p className="text-[9px] text-amber-200/35 uppercase tracking-[0.15em] font-bold mt-1">
                  Global directives for this ministration
                </p>

              </div>

            </div>

            {isMD && !isEditingDetails && (
              <button
                onClick={() =>
                  setIsEditingDetails(true)
                }
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 transition-colors flex-shrink-0"
              >
                Edit Directives
              </button>
            )}

          </div>

          {isEditingDetails && isMD ? (

            <div className="relative space-y-3">

              <textarea
                rows={3}
                value={
                  currentMin.mdGlobalNotes || ''
                }
                onChange={e => {
                  const updated = {
                    ...currentMin,
                    mdGlobalNotes:
                      e.target.value
                  };

                  setCurrentMin(updated);
                  onUpdateMinistration(
                    updated
                  );
                }}
                className="w-full bg-black/30 border border-amber-500/20 rounded-xl p-3.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all"
              />

              <button
                onClick={() =>
                  setIsEditingDetails(false)
                }
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-extrabold hover:bg-amber-400 transition-colors"
              >
                Done Editing
              </button>

            </div>

          ) : (

            <p className="relative text-xs sm:text-sm text-amber-100/55 leading-relaxed whitespace-pre-wrap">
              {currentMin.mdGlobalNotes ||
                'Arrival: 1 hour before start time. Sound check, in-ear monitor configuration, and prayer before step up to stage.'}
            </p>

          )}

        </div>

      </section>

      {/* =========================================================
          ADD SONG MODAL
      ========================================================== */}

      {isAddSongModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200">

          <div className="relative rounded-[28px] border border-white/10 bg-[#101012]/95 max-w-lg w-full p-5 sm:p-6 shadow-2xl shadow-black/40 max-h-[88vh] flex flex-col backdrop-blur-2xl">

            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#007aff]/10 blur-3xl pointer-events-none" />

            <div className="relative flex items-center justify-between pb-5 border-b border-white/[0.08]">

              <div>

                <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff]">
                  Add to Setlist
                </span>

                <h3 className="text-lg font-extrabold text-white mt-1 tracking-tight">
                  Select Repertoire Song
                </h3>

              </div>

              <button
                onClick={() =>
                  setIsAddSongModalOpen(false)
                }
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.035] hover:bg-white/[0.08] hover:text-white flex items-center justify-center text-white/40 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <div className="relative flex-1 overflow-y-auto py-4 space-y-2">

              {songs.map(s => {

                const isAlreadyIn =
                  currentMin.songs.some(
                    item =>
                      item.songId === s.id
                  );

                return (
                  <div
                    key={s.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      isAlreadyIn
                        ? 'bg-white/[0.015] border-white/[0.05] opacity-45'
                        : 'bg-white/[0.03] border-white/10 hover:border-[#007aff]/30 hover:bg-white/[0.055]'
                    }`}
                  >

                    <div className="min-w-0">

                      <h4 className="text-xs font-bold text-white truncate">
                        {s.title}
                      </h4>

                      <p className="text-[10px] text-white/30 truncate mt-1">
                        {s.artist} • Key:{' '}
                        {s.key} • {s.category}
                      </p>

                    </div>

                    <button
                      disabled={isAlreadyIn}
                      onClick={() =>
                        handleAddSongToMin(
                          s.id
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex-shrink-0 ${
                        isAlreadyIn
                          ? 'bg-white/[0.05] text-white/20'
                          : 'bg-[#007aff] hover:bg-[#0062cc] text-white shadow-lg shadow-blue-500/20'
                      }`}
                    >
                      {isAlreadyIn
                        ? 'Added'
                        : '+ Add'}
                    </button>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};
