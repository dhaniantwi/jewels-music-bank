import React, { useState } from 'react';
import { Ministration, Song, TeamMember, ActiveRole, SetlistSongItem } from '../types';
import { Calendar, Clock, MapPin, Plus, ArrowUp, ArrowDown, Trash2, Mic, Play, Radio, Printer, CheckCircle2, ChevronRight, Edit, Sparkles, Music } from 'lucide-react';
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
  onCreateMinistration,
  onSelectSong,
  openStageMode
}) => {
  const [currentMin, setCurrentMin] = useState<Ministration>(
    selectedMinistration || ministrations[0]
  );
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [isCreateMinModalOpen, setIsCreateMinModalOpen] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  // Sync when selectedMinistration prop changes
  React.useEffect(() => {
    if (selectedMinistration) {
      setCurrentMin(selectedMinistration);
    }
  }, [selectedMinistration]);

  const isMD = activeRole === 'admin_md';

  // Lead vocalist candidates (Vocalists + Music Director)
  const vocalMembers = team.filter(m => m.type === 'vocal' || m.type === 'director');

  // Handle lead vocalist assignment on the song allocation bar
  const handleAssignLead = (songId: number, memberId: number | null) => {
    if (!isMD) return;
    const updatedSongs = currentMin.songs.map(item => {
      if (item.songId === songId) {
        return { ...item, lead: memberId };
      }
      return item;
    });

    const updatedMin = { ...currentMin, songs: updatedSongs };
    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);

    // If all leads assigned, celebrate
    const allAssigned = updatedSongs.every(s => s.lead !== null);
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

  // Handle key override change
  const handleKeyOverride = (songId: number, newKey: string) => {
    if (!isMD) return;
    const updatedSongs = currentMin.songs.map(item => {
      if (item.songId === songId) {
        return { ...item, keyOverride: newKey };
      }
      return item;
    });
    const updatedMin = { ...currentMin, songs: updatedSongs };
    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  // Handle transition note change
  const handleNoteChange = (songId: number, note: string) => {
    if (!isMD) return;
    const updatedSongs = currentMin.songs.map(item => {
      if (item.songId === songId) {
        return { ...item, orderNote: note };
      }
      return item;
    });
    const updatedMin = { ...currentMin, songs: updatedSongs };
    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  // Move song up in setlist
  const handleMoveSong = (index: number, direction: 'up' | 'down') => {
    if (!isMD) return;
    const newSongs = [...currentMin.songs];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSongs.length) return;

    const temp = newSongs[index];
    newSongs[index] = newSongs[targetIdx];
    newSongs[targetIdx] = temp;

    const updatedMin = { ...currentMin, songs: newSongs };
    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  // Remove song from ministration setlist
  const handleRemoveSong = (songId: number) => {
    if (!isMD) return;
    const updatedSongs = currentMin.songs.filter(s => s.songId !== songId);
    const updatedMin = { ...currentMin, songs: updatedSongs };
    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  // Add song to current ministration
  const handleAddSongToMin = (songId: number) => {
    if (currentMin.songs.some(s => s.songId === songId)) {
      alert('This song is already in this ministration setlist.');
      return;
    }
    const song = songs.find(s => s.id === songId);
    const newItem: SetlistSongItem = {
      songId,
      lead: null,
      keyOverride: song?.key || 'G',
      orderNote: 'Rehearse transition into this song.'
    };
    const updatedMin = { ...currentMin, songs: [...currentMin.songs, newItem] };
    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
    setIsAddSongModalOpen(false);
  };

  // Handle printing
  const handlePrint = () => {
    window.print();
  };

  const assignedLeadsCount = currentMin.songs.filter(s => s.lead !== null).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Ministration Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7c3aed] bg-[#7c3aed]/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
            MINISTRY SERVICES & EVENTS
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
            Ministrations & Setlists
          </h1>
          <p className="text-sm text-[#6e6e73] font-medium mt-0.5">
            Manage event song orders, assign lead vocalists on the allocation bar, and direct rehearsals.
          </p>
        </div>

        {/* Ministration Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {ministrations.map(m => (
            <button
              key={m.id}
              onClick={() => {
                setCurrentMin(m);
                onSelectMinistration(m);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                currentMin.id === m.id
                  ? 'bg-[#1d1d1f] text-white shadow-md'
                  : 'bg-white text-[#6e6e73] hover:text-[#1d1d1f] border border-black/5'
              }`}
            >
              <span>{m.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {m.songs.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Setlist Workspace */}
      <div className="ios-glass rounded-[32px] p-6 sm:p-8 bg-white/85 shadow-xl border border-white/90 space-y-6">
        
        {/* Setlist Event Details Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#007aff] bg-[#007aff]/10 px-2.5 py-0.5 rounded-full">
                {currentMin.status}
              </span>
              {currentMin.theme && (
                <span className="text-xs font-bold text-[#7c3aed] bg-[#7c3aed]/10 px-2.5 py-0.5 rounded-full">
                  Theme: {currentMin.theme}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
              {currentMin.name}
            </h2>

            <p className="text-sm text-[#6e6e73] font-medium mt-1 max-w-xl">
              {currentMin.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#86868b] font-semibold">
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
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{currentMin.venue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar (Rehearse, Print, Add Song) */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={openStageMode}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#1d1d1f] to-[#3a3a3c] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Launch Stage Mode</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-2xl bg-white border border-black/10 text-[#1d1d1f] hover:bg-black/5 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Printer className="w-4 h-4 text-[#6e6e73]" />
              <span className="hidden sm:inline">Print Sheet</span>
            </button>

            {isMD && (
              <button
                onClick={() => setIsAddSongModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#007aff]/30 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Song to Set</span>
              </button>
            )}
          </div>
        </div>

        {/* Setlist Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-black/[0.03] border border-black/5 flex items-center justify-between">
            <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
              Repertoire Size
            </span>
            <span className="text-xl font-extrabold text-[#1d1d1f]">
              {currentMin.songs.length} Songs
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#7c3aed]/5 border border-[#7c3aed]/15 flex items-center justify-between">
            <span className="text-xs font-bold text-[#7c3aed] uppercase tracking-wider">
              Lead Vocalists Allocated
            </span>
            <span className="text-xl font-extrabold text-[#7c3aed]">
              {assignedLeadsCount} / {currentMin.songs.length} Ready
            </span>
          </div>
        </div>

        {/* =========================================================
            SONG ALLOCATIONS BAR & SETLIST LIST
            (Direct Lead Vocalist Allocation by MD)
            ========================================================= */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2">
              <span>🎵</span>
              <span>Setlist Repertoire & Vocal Allocations</span>
            </h3>
            <span className="text-xs font-semibold text-[#86868b]">
              {isMD ? '👑 MD Control: Edit leads, key overrides & song orders' : '🔒 Read-only view (Assigned by MD)'}
            </span>
          </div>

          {currentMin.songs.length > 0 ? (
            <div className="space-y-3">
              {currentMin.songs.map((item, index) => {
                const song = songs.find(s => s.id === item.songId);
                const leadMember = team.find(m => m.id === item.lead);
                if (!song) return null;

                const effectiveKey = item.keyOverride || song.key;

                return (
                  <div
                    key={item.songId}
                    className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-black/10 shadow-xs hover:border-[#007aff]/30 transition-all space-y-3"
                  >
                    {/* Song Top Info Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Reorder Buttons & Index */}
                        <div className="flex items-center gap-1">
                          <span className="w-7 h-7 rounded-xl bg-[#007aff]/10 text-xs font-extrabold text-[#007aff] flex items-center justify-center flex-shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          {isMD && (
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleMoveSong(index, 'up')}
                                disabled={index === 0}
                                title="Move up in order"
                                className="w-5 h-3.5 flex items-center justify-center text-[#86868b] hover:text-[#007aff] disabled:opacity-20"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveSong(index, 'down')}
                                disabled={index === currentMin.songs.length - 1}
                                title="Move down in order"
                                className="w-5 h-3.5 flex items-center justify-center text-[#86868b] hover:text-[#007aff] disabled:opacity-20"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Song Title & Category */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              onClick={() => onSelectSong(song)}
                              className="text-base font-bold text-[#1d1d1f] hover:text-[#007aff] cursor-pointer transition-colors truncate"
                            >
                              {song.title}
                            </h4>
                            <span className="text-[10px] font-bold text-[#007aff] bg-[#007aff]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                              {song.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#6e6e73] font-medium truncate">
                            {song.artist} • {song.tempo}
                          </p>
                        </div>
                      </div>

                      {/* Right Controls: View Song & Delete from set */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => onSelectSong(song)}
                          className="px-3 py-1.5 rounded-xl bg-black/5 hover:bg-[#007aff]/10 text-[#007aff] text-xs font-bold transition-colors"
                        >
                          View Arrangement →
                        </button>
                        {isMD && (
                          <button
                            onClick={() => handleRemoveSong(item.songId)}
                            title="Remove from setlist"
                            className="w-8 h-8 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>

                    {/* DIRECT SONG ALLOCATION BAR */}
                    <div className="p-3 rounded-xl bg-black/[0.025] border border-black/5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      
                      {/* 1. Lead Vocalist Assignment */}
                      <div className="sm:col-span-6 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7c3aed]/20 to-[#007aff]/20 flex items-center justify-center text-xs flex-shrink-0">
                          🎤
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#7c3aed] block mb-0.5">
                            Lead Vocalist Allocation
                          </label>
                          {isMD ? (
                            <select
                              value={item.lead || ''}
                              onChange={(e) => handleAssignLead(item.songId, e.target.value ? Number(e.target.value) : null)}
                              className="w-full bg-white border border-black/15 rounded-lg px-2.5 py-1 text-xs font-bold text-[#1d1d1f] outline-none focus:border-[#7c3aed]"
                            >
                              <option value="">-- Not Assigned (Select Lead) --</option>
                              {vocalMembers.map(vm => (
                                <option key={vm.id} value={vm.id}>
                                  {vm.icon} {vm.name} ({vm.voicePart || vm.role})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs font-bold text-[#1d1d1f]">
                              {leadMember ? `${leadMember.icon} ${leadMember.name}` : '⚠️ Pending MD Assignment'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 2. Key Override */}
                      <div className="sm:col-span-3 flex items-center gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#007aff] block mb-0.5">
                            Performance Key
                          </label>
                          {isMD ? (
                            <select
                              value={effectiveKey}
                              onChange={(e) => handleKeyOverride(item.songId, e.target.value)}
                              className="w-full bg-white border border-black/15 rounded-lg px-2 py-1 text-xs font-bold text-[#007aff] outline-none focus:border-[#007aff]"
                            >
                              {CHROMATIC_KEYS.map(k => (
                                <option key={k} value={k}>{k} Major</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs font-extrabold text-[#007aff]">
                              Key of {effectiveKey}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 3. Transition Note / Cue */}
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#86868b] block mb-0.5">
                          Transition Cue
                        </label>
                        {isMD ? (
                          <input
                            type="text"
                            placeholder="e.g. Drum swell transition"
                            value={item.orderNote || ''}
                            onChange={(e) => handleNoteChange(item.songId, e.target.value)}
                            className="w-full bg-white border border-black/15 rounded-lg px-2 py-1 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
                          />
                        ) : (
                          <p className="text-xs text-[#6e6e73] truncate">
                            {item.orderNote || 'Standard transition.'}
                          </p>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-black/[0.02] border border-dashed border-black/15">
              <span className="text-3xl block mb-2">📋</span>
              <p className="text-sm font-bold text-[#1d1d1f]">No songs in this setlist yet</p>
              <p className="text-xs text-[#86868b] mt-0.5">Add songs from the repertoire to build this service setlist.</p>
              {isMD && (
                <button
                  onClick={() => setIsAddSongModalOpen(true)}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#007aff] text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Songs Now</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Music Director Global Directives */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-[#1d1d1f]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎼</span>
              <h4 className="text-sm font-bold text-amber-950">Music Director Ministry Notes</h4>
            </div>
            {isMD && !isEditingDetails && (
              <button
                onClick={() => setIsEditingDetails(true)}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 underline"
              >
                Edit Directives
              </button>
            )}
          </div>

          {isEditingDetails && isMD ? (
            <div className="space-y-2">
              <textarea
                rows={3}
                value={currentMin.mdGlobalNotes || ''}
                onChange={(e) => {
                  const updated = { ...currentMin, mdGlobalNotes: e.target.value };
                  setCurrentMin(updated);
                  onUpdateMinistration(updated);
                }}
                className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs text-amber-950 outline-none"
              />
              <button
                onClick={() => setIsEditingDetails(false)}
                className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold"
              >
                Done Editing
              </button>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed whitespace-pre-wrap">
              {currentMin.mdGlobalNotes || 'Arrival: 1 hour before start time. Sound check, in-ear monitor configuration, and prayer before step up to stage.'}
            </p>
          )}
        </div>

      </div>

      {/* ADD SONG TO MINISTRATION MODAL */}
      {isAddSongModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
          <div className="ios-glass bg-white/95 rounded-[32px] max-w-lg w-full p-6 shadow-2xl border border-white/80 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#007aff]">Add to Setlist</span>
                <h3 className="text-lg font-bold text-[#1d1d1f]">Select Repertoire Song</h3>
              </div>
              <button
                onClick={() => setIsAddSongModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {songs.map(s => {
                const isAlreadyIn = currentMin.songs.some(item => item.songId === s.id);
                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isAlreadyIn ? 'bg-black/[0.02] border-black/5 opacity-60' : 'bg-white border-black/10 hover:border-[#007aff]'
                    }`}
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#1d1d1f] truncate">{s.title}</h4>
                      <p className="text-[10px] text-[#6e6e73] truncate">{s.artist} • Key: {s.key} • {s.category}</p>
                    </div>

                    <button
                      disabled={isAlreadyIn}
                      onClick={() => handleAddSongToMin(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isAlreadyIn
                          ? 'bg-black/5 text-[#86868b]'
                          : 'bg-[#007aff] hover:bg-[#0062cc] text-white shadow-xs'
                      }`}
                    >
                      {isAlreadyIn ? 'Added' : '+ Add'}
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
