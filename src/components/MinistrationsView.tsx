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
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
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

    const allAssigned = updatedSongs.every(
      s => s.lead !== null
    );

    if (allAssigned && updatedSongs.length > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch {}
    }
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

    const updatedSongs =
      currentMin.songs.filter(
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
        s => s.songId === songId
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
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="space-y-5">

        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff] bg-[#007aff]/10 border border-[#007aff]/20 px-3 py-1 rounded-full">
                Ministry Services & Events
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Setlist Control
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ministrations & Setlists
            </h1>

            <p className="text-sm text-white/45 font-medium mt-2 max-w-2xl">
              Manage event song orders, assign lead vocalists,
              prepare performance keys, and direct rehearsals.
            </p>
          </div>

          {/* MD Status */}
          <div className="ios-glass rounded-2xl px-4 py-3 flex items-center gap-3 w-fit">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isMD
                  ? 'bg-[#007aff] shadow-[0_0_12px_rgba(0,122,255,0.8)]'
                  : 'bg-white/30'
              }`}
            />

            <div>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-white/35">
                Access
              </p>

              <p className="text-xs font-bold text-white">
                {isMD
                  ? 'Music Director Control'
                  : 'Read-only Member View'}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            MINISTRATION SWITCHER
        ===================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {ministrations.map(m => (
            <button
              key={m.id}
              onClick={() => {
                setCurrentMin(m);
                onSelectMinistration(m);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                currentMin.id === m.id
                  ? 'bg-[#007aff] text-white border-[#007aff] shadow-[0_8px_24px_rgba(0,122,255,0.25)]'
                  : 'bg-white/[0.045] text-white/50 border-white/10 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <span>{m.name}</span>

              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  currentMin.id === m.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/[0.08] text-white/40'
                }`}
              >
                {m.songs.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================
          MAIN WORKSPACE
      ========================================================= */}
      <div className="ios-glass rounded-[32px] p-5 sm:p-7 lg:p-8 space-y-7">

        {/* =====================================================
            EVENT HERO
        ===================================================== */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-7 border-b border-white/[0.08]">

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2 mb-3">

              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4da3ff] bg-[#007aff]/10 border border-[#007aff]/15 px-2.5 py-1 rounded-full">
                {currentMin.status}
              </span>

              {currentMin.theme && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b18cff] bg-[#7c3aed]/10 border border-[#7c3aed]/15 px-2.5 py-1 rounded-full">
                  Theme: {currentMin.theme}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentMin.name}
            </h2>

            <p className="text-sm text-white/45 font-medium mt-2 max-w-2xl leading-relaxed">
              {currentMin.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-white/40 font-semibold">

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#007aff]" />
                <span>{currentMin.date}</span>
              </div>

              {currentMin.time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#7c3aed]" />
                  <span>{currentMin.time}</span>
                </div>
              )}

              {currentMin.venue && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{currentMin.venue}</span>
                </div>
              )}

            </div>
          </div>

          {/* =================================================
              ACTION BAR
          ================================================= */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">

            <button
              onClick={openStageMode}
              className="px-4 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#1685ff] text-white text-xs font-bold flex items-center gap-2 shadow-[0_10px_30px_rgba(0,122,255,0.25)] active:scale-95 transition-all"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Launch Stage Mode</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-2xl bg-white/[0.06] border border-white/10 text-white/65 hover:text-white hover:bg-white/[0.10] text-xs font-bold flex items-center gap-1.5 transition-all"
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
                className="px-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.10] text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 text-[#4da3ff]" />
                <span>Add Song to Set</span>
              </button>
            )}

          </div>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="jewels-surface rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/35">
                Repertoire Size
              </p>

              <p className="text-xl font-extrabold text-white mt-1">
                {currentMin.songs.length}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-[#007aff]/10 border border-[#007aff]/15 flex items-center justify-center text-[#4da3ff]">
              🎵
            </div>
          </div>

          <div className="jewels-surface rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#b18cff]">
                Lead Vocalists Allocated
              </p>

              <p className="text-xl font-extrabold text-white mt-1">
                {assignedLeadsCount}
                <span className="text-sm text-white/35">
                  {' '}
                  / {currentMin.songs.length}
                </span>
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/15 flex items-center justify-center">
              🎤
            </div>
          </div>

        </div>

        {/* =====================================================
            SETLIST
        ===================================================== */}
        <div className="space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#4da3ff]">♪</span>
                <span>Setlist Repertoire</span>
              </h3>

              <p className="text-xs text-white/35 mt-1">
                Direct song order, vocalist allocation,
                performance key and transition cues.
              </p>
            </div>

            <span className="text-[10px] font-bold text-white/35 bg-white/[0.045] border border-white/10 px-3 py-1.5 rounded-full">
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
                    <div
                      key={item.songId}
                      className="ios-card p-4 sm:p-5 space-y-4"
                    >

                      {/* SONG HEADER */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="flex items-center gap-1">

                            <span className="w-8 h-8 rounded-xl bg-[#007aff]/10 border border-[#007aff]/15 text-xs font-extrabold text-[#4da3ff] flex items-center justify-center flex-shrink-0">
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
                                  className="w-5 h-4 flex items-center justify-center text-white/30 hover:text-[#4da3ff] disabled:opacity-10"
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
                                    currentMin
                                      .songs
                                      .length -
                                      1
                                  }
                                  title="Move down in order"
                                  className="w-5 h-4 flex items-center justify-center text-white/30 hover:text-[#4da3ff] disabled:opacity-10"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>

                              </div>
                            )}

                          </div>

                          <div className="min-w-0">

                            <div className="flex items-center gap-2 min-w-0">

                              <h4
                                onClick={() =>
                                  onSelectSong(
                                    song
                                  )
                                }
                                className="text-base font-bold text-white hover:text-[#4da3ff] cursor-pointer transition-colors truncate"
                              >
                                {song.title}
                              </h4>

                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#4da3ff] bg-[#007aff]/10 border border-[#007aff]/15 px-2 py-0.5 rounded-full flex-shrink-0">
                                {song.category}
                              </span>

                            </div>

                            <p className="text-xs text-white/35 font-medium truncate mt-0.5">
                              {song.artist} •{' '}
                              {song.tempo}
                            </p>

                          </div>

                        </div>

                        <div className="flex items-center gap-2 self-start lg:self-auto">

                          <button
                            onClick={() =>
                              onSelectSong(
                                song
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-[#007aff]/10 hover:border-[#007aff]/20 text-[#4da3ff] text-xs font-bold transition-all"
                          >
                            View Arrangement →
                          </button>

                          {isMD && (
                            <button
                              onClick={() =>
                                handleRemoveSong(
                                  item.songId
                                )
                              }
                              title="Remove from setlist"
                              className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/15 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                        </div>
                      </div>

                      {/* =================================================
                          ALLOCATION BAR
                      ================================================= */}
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-black/20 border border-white/[0.07] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                        {/* LEAD */}
                        <div className="md:col-span-5 flex items-center gap-3">

                          <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/15 flex items-center justify-center text-sm flex-shrink-0">
                            🎤
                          </div>

                          <div className="flex-1 min-w-0">

                            <label className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#b18cff] block mb-1">
                              Lead Vocalist
                            </label>

                            {isMD ? (
                              <select
                                value={
                                  item.lead ||
                                  ''
                                }
                                onChange={e =>
                                  handleAssignLead(
                                    item.songId,
                                    e.target.value
                                      ? Number(
                                          e.target
                                            .value
                                        )
                                      : null
                                  )
                                }
                                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30"
                              >
                                <option
                                  value=""
                                  className="bg-[#17171a]"
                                >
                                  -- Not Assigned --
                                </option>

                                {vocalMembers.map(
                                  vm => (
                                    <option
                                      key={
                                        vm.id
                                      }
                                      value={
                                        vm.id
                                      }
                                      className="bg-[#17171a]"
                                    >
                                      {vm.icon}{' '}
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
                                  ? `${leadMember.icon} ${leadMember.name}`
                                  : '⚠️ Pending MD Assignment'}
                              </span>
                            )}

                          </div>
                        </div>

                        {/* KEY */}
                        <div className="md:col-span-3">

                          <label className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#4da3ff] block mb-1">
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
                              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-[#4da3ff] outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30"
                            >
                              {CHROMATIC_KEYS.map(
                                k => (
                                  <option
                                    key={k}
                                    value={k}
                                    className="bg-[#17171a]"
                                  >
                                    {k} Major
                                  </option>
                                )
                              )}
                            </select>
                          ) : (
                            <span className="text-xs font-extrabold text-[#4da3ff]">
                              Key of{' '}
                              {effectiveKey}
                            </span>
                          )}

                        </div>

                        {/* TRANSITION */}
                        <div className="md:col-span-4">

                          <label className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-white/30 block mb-1">
                            Transition Cue
                          </label>

                          {isMD ? (
                            <input
                              type="text"
                              placeholder="e.g. Drum swell transition"
                              value={
                                item.orderNote ||
                                ''
                              }
                              onChange={e =>
                                handleNoteChange(
                                  item.songId,
                                  e.target.value
                                )
                              }
                              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30"
                            />
                          ) : (
                            <p className="text-xs text-white/40 truncate">
                              {item.orderNote ||
                                'Standard transition.'}
                            </p>
                          )}

                        </div>

                      </div>
                    </div>
                  );
                }
              )}

            </div>
          ) : (
            <div className="text-center py-14 px-4 rounded-3xl bg-white/[0.025] border border-dashed border-white/10">

              <div className="w-14 h-14 rounded-2xl bg-[#007aff]/10 border border-[#007aff]/15 flex items-center justify-center mx-auto mb-4 text-2xl">
                🎵
              </div>

              <p className="text-sm font-bold text-white">
                No songs in this setlist yet
              </p>

              <p className="text-xs text-white/35 mt-1">
                Add songs from the repertoire to
                build this service setlist.
              </p>

              {isMD && (
                <button
                  onClick={() =>
                    setIsAddSongModalOpen(true)
                  }
                  className="mt-4 px-4 py-2.5 rounded-xl bg-[#007aff] hover:bg-[#1685ff] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Songs Now</span>
                </button>
              )}

            </div>
          )}

        </div>

        {/* =====================================================
            MUSIC DIRECTOR NOTES
        ===================================================== */}
        <div className="p-5 rounded-2xl bg-amber-400/[0.06] border border-amber-400/15">

          <div className="flex items-center justify-between mb-3">

            <div className="flex items-center gap-2">
              <span className="text-lg">🎼</span>

              <div>
                <h4 className="text-sm font-bold text-amber-200">
                  Music Director Ministry Notes
                </h4>

                <p className="text-[10px] text-amber-200/35 uppercase tracking-wider font-bold mt-0.5">
                  Global directives for this ministration
                </p>
              </div>
            </div>

            {isMD && !isEditingDetails && (
              <button
                onClick={() =>
                  setIsEditingDetails(true)
                }
                className="text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                Edit Directives
              </button>
            )}

          </div>

          {isEditingDetails && isMD ? (
            <div className="space-y-3">

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
                className="w-full bg-black/20 border border-amber-400/20 rounded-xl p-3 text-xs text-white placeholder:text-white/20 outline-none focus:border-amber-400/40"
              />

              <button
                onClick={() =>
                  setIsEditingDetails(false)
                }
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-black text-xs font-extrabold hover:bg-amber-400 transition-colors"
              >
                Done Editing
              </button>

            </div>
          ) : (
            <p className="text-xs sm:text-sm text-amber-100/60 leading-relaxed whitespace-pre-wrap">
              {currentMin.mdGlobalNotes ||
                'Arrival: 1 hour before start time. Sound check, in-ear monitor configuration, and prayer before step up to stage.'}
            </p>
          )}

        </div>

      </div>

      {/* =========================================================
          ADD SONG MODAL
      ========================================================= */}
      {isAddSongModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in">

          <div className="ios-glass bg-[#151518]/95 rounded-[30px] max-w-lg w-full p-6 shadow-2xl border border-white/10 max-h-[85vh] flex flex-col">

            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4da3ff]">
                  Add to Setlist
                </span>

                <h3 className="text-lg font-bold text-white mt-0.5">
                  Select Repertoire Song
                </h3>
              </div>

              <button
                onClick={() =>
                  setIsAddSongModalOpen(false)
                }
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
              >
                ✕
              </button>

            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2">

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
                        ? 'bg-white/[0.02] border-white/[0.05] opacity-50'
                        : 'bg-white/[0.035] border-white/10 hover:border-[#007aff]/30 hover:bg-white/[0.06]'
                    }`}
                  >

                    <div className="min-w-0">

                      <h4 className="text-xs font-bold text-white truncate">
                        {s.title}
                      </h4>

                      <p className="text-[10px] text-white/35 truncate mt-0.5">
                        {s.artist} • Key:{' '}
                        {s.key} •{' '}
                        {s.category}
                      </p>

                    </div>

                    <button
                      disabled={isAlreadyIn}
                      onClick={() =>
                        handleAddSongToMin(
                          s.id
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isAlreadyIn
                          ? 'bg-white/[0.05] text-white/25'
                          : 'bg-[#007aff] hover:bg-[#1685ff] text-white shadow-[0_6px_18px_rgba(0,122,255,0.2)]'
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
