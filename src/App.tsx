/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Song, Ministration, TeamMember, ActiveTab, ActiveRole } from './types';
import { 
  loadStoredSongs, saveStoredSongs, 
  loadStoredMinistrations, saveStoredMinistrations, 
  loadStoredTeam, saveStoredTeam,
  resetAllToDefaults 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SongBankView } from './components/SongBankView';
import { MinistrationsView } from './components/MinistrationsView';
import { MusicTeamView } from './components/MusicTeamView';
import { SongDetailModal } from './components/SongDetailModal';
import { AddEditSongModal } from './components/AddEditSongModal';
import { AddEditMemberModal } from './components/AddEditMemberModal';
import { ToolsModal } from './components/ToolsModal';
import { StageRehearsalModal } from './components/StageRehearsalModal';
import { Music, RefreshCw, Sparkles, Heart } from 'lucide-react';

export default function App() {
  // Primary Application State with LocalStorage persistence
  const [songs, setSongs] = useState<Song[]>(() => loadStoredSongs());
  const [ministrations, setMinistrations] = useState<Ministration[]>(() => loadStoredMinistrations());
  const [team, setTeam] = useState<TeamMember[]>(() => loadStoredTeam());

  // Active View & Role
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeRole, setActiveRole] = useState<ActiveRole>('admin_md'); // Defaults to Daniel Antwi (Music Director & Admin)

  // Modals state
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isAddEditSongOpen, setIsAddEditSongOpen] = useState(false);

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAddEditMemberOpen, setIsAddEditMemberOpen] = useState(false);

  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isStageModeOpen, setIsStageModeOpen] = useState(false);

  const [selectedMinistration, setSelectedMinistration] = useState<Ministration | null>(
    () => ministrations.find(m => m.status === 'Upcoming') || ministrations[0]
  );

  // Sync to storage on updates
  useEffect(() => {
    saveStoredSongs(songs);
  }, [songs]);

  useEffect(() => {
    saveStoredMinistrations(ministrations);
  }, [ministrations]);

  useEffect(() => {
    saveStoredTeam(team);
  }, [team]);

  // Keep selectedMinistration fresh
  useEffect(() => {
    if (selectedMinistration) {
      const refreshed = ministrations.find(m => m.id === selectedMinistration.id);
      if (refreshed) setSelectedMinistration(refreshed);
    }
  }, [ministrations]);

  // -------------------------------------------------------------
  // SONG BANK ACTIONS
  // -------------------------------------------------------------
  const handleSaveSong = (songData: Omit<Song, 'id'> & { id?: number }) => {
    if (songData.id) {
      // Edit existing
      setSongs(prev => prev.map(s => s.id === songData.id ? (songData as Song) : s));
      if (selectedSong?.id === songData.id) {
        setSelectedSong(songData as Song);
      }
    } else {
      // Add new
      const newId = Date.now();
      const newSong: Song = {
        ...songData,
        id: newId,
        createdAt: new Date().toISOString()
      };
      setSongs(prev => [newSong, ...prev]);
    }
  };

  const handleDeleteSong = (songId: number) => {
    setSongs(prev => prev.filter(s => s.id !== songId));
    // Remove from ministrations if present
    setMinistrations(prev => prev.map(m => ({
      ...m,
      songs: m.songs.filter(item => item.songId !== songId)
    })));
  };

  // -------------------------------------------------------------
  // TEAM ACTIONS
  // -------------------------------------------------------------
  const handleSaveMember = (memberData: Omit<TeamMember, 'id'> & { id?: number }) => {
    if (memberData.id) {
      // Edit
      setTeam(prev => prev.map(m => m.id === memberData.id ? (memberData as TeamMember) : m));
    } else {
      // Add new
      const newId = Date.now();
      const newMember: TeamMember = {
        ...memberData,
        id: newId
      };
      setTeam(prev => [...prev, newMember]);
    }
  };

  const handleDeleteMember = (memberId: number) => {
    setTeam(prev => prev.filter(m => m.id !== memberId));
    // Unassign as lead if assigned
    setMinistrations(prev => prev.map(m => ({
      ...m,
      songs: m.songs.map(item => item.lead === memberId ? { ...item, lead: null } : item)
    })));
  };

  const handleTogglePermission = (memberId: number) => {
    setTeam(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, canEdit: !m.canEdit };
      }
      return m;
    }));
  };

  // -------------------------------------------------------------
  // MINISTRATION SETLIST ACTIONS
  // -------------------------------------------------------------
  const handleUpdateMinistration = (updated: Ministration) => {
    setMinistrations(prev => prev.map(m => m.id === updated.id ? updated : m));
    setSelectedMinistration(updated);
  };

  const handleCreateMinistration = (newMinData: Omit<Ministration, 'id'>) => {
    const newId = Date.now();
    const created: Ministration = { ...newMinData, id: newId };
    setMinistrations(prev => [created, ...prev]);
    setSelectedMinistration(created);
  };

  const handleResetData = () => {
    if (confirm('Reset all songs, ministrations, and team roster to initial church defaults?')) {
      resetAllToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-[#1d1d1f] font-sans pb-12 sm:pb-16 selection:bg-[#007aff]/20 selection:text-[#007aff]">
      
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          team={team}
          songsCount={songs.length}
          openToolsModal={() => setIsToolsModalOpen(true)}
          openStageMode={() => setIsStageModeOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">
          
          {/* TAB 1: HOME DASHBOARD */}
          {activeTab === 'home' && (
            <DashboardView
              songs={songs}
              ministrations={ministrations}
              team={team}
              activeRole={activeRole}
              setActiveTab={setActiveTab}
              onSelectSong={(song) => setSelectedSong(song)}
              onSelectMinistration={(min) => {
                setSelectedMinistration(min);
                setActiveTab('ministrations');
              }}
              openToolsModal={() => setIsToolsModalOpen(true)}
              openStageMode={() => setIsStageModeOpen(true)}
            />
          )}

          {/* TAB 2: SONG BANK */}
          {activeTab === 'songs' && (
            <SongBankView
              songs={songs}
              activeRole={activeRole}
              onSelectSong={(song) => setSelectedSong(song)}
              onAddNewSong={() => {
                setEditingSong(null);
                setIsAddEditSongOpen(true);
              }}
              onEditSong={(song) => {
                setEditingSong(song);
                setIsAddEditSongOpen(true);
              }}
              onDeleteSong={handleDeleteSong}
            />
          )}

          {/* TAB 3: MINISTRATIONS & SETLISTS */}
          {activeTab === 'ministrations' && (
            <MinistrationsView
              ministrations={ministrations}
              songs={songs}
              team={team}
              activeRole={activeRole}
              selectedMinistration={selectedMinistration}
              onSelectMinistration={(min) => setSelectedMinistration(min)}
              onUpdateMinistration={handleUpdateMinistration}
              onCreateMinistration={handleCreateMinistration}
              onSelectSong={(song) => setSelectedSong(song)}
              openStageMode={() => setIsStageModeOpen(true)}
            />
          )}

          {/* TAB 4: MUSIC TEAM */}
          {activeTab === 'team' && (
            <MusicTeamView
              team={team}
              activeRole={activeRole}
              onAddNewMember={() => {
                setEditingMember(null);
                setIsAddEditMemberOpen(true);
              }}
              onEditMember={(member) => {
                setEditingMember(member);
                setIsAddEditMemberOpen(true);
              }}
              onDeleteMember={handleDeleteMember}
              onTogglePermission={handleTogglePermission}
            />
          )}

        </main>
      </div>

      {/* =========================================================
          PRINTABLE SHEET VIEW (Rendered only on window.print())
          ========================================================= */}
      {selectedMinistration && (
        <div className="hidden print-only p-8 text-black bg-white">
          <div className="border-b-2 border-black pb-4 mb-6">
            <h1 className="text-3xl font-extrabold">{selectedMinistration.name}</h1>
            <p className="text-base text-gray-700 mt-1">
              Jewels Music Ministry • Date: {selectedMinistration.date} {selectedMinistration.time ? `• ${selectedMinistration.time}` : ''}
            </p>
            {selectedMinistration.venue && <p className="text-sm text-gray-600">Venue: {selectedMinistration.venue}</p>}
          </div>

          <h2 className="text-xl font-bold mb-4">Official Service Setlist & Vocal Allocations</h2>

          <table className="w-full border-collapse border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-2 text-left">#</th>
                <th className="border border-gray-400 p-2 text-left">Song Title</th>
                <th className="border border-gray-400 p-2 text-left">Artist</th>
                <th className="border border-gray-400 p-2 text-left">Key</th>
                <th className="border border-gray-400 p-2 text-left">Lead Vocalist</th>
                <th className="border border-gray-400 p-2 text-left">Transition Cue</th>
              </tr>
            </thead>
            <tbody>
              {selectedMinistration.songs.map((item, idx) => {
                const s = songs.find(x => x.id === item.songId);
                const lead = team.find(x => x.id === item.lead);
                return (
                  <tr key={item.songId}>
                    <td className="border border-gray-400 p-2 font-bold">{idx + 1}</td>
                    <td className="border border-gray-400 p-2 font-bold">{s?.title}</td>
                    <td className="border border-gray-400 p-2">{s?.artist}</td>
                    <td className="border border-gray-400 p-2 font-bold">{item.keyOverride || s?.key}</td>
                    <td className="border border-gray-400 p-2 font-bold">{lead ? lead.name : 'Unassigned'}</td>
                    <td className="border border-gray-400 p-2">{item.orderNote || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {selectedMinistration.mdGlobalNotes && (
            <div className="mt-6 p-4 border border-gray-400">
              <h3 className="font-bold text-sm">Music Director Directives:</h3>
              <p className="text-xs mt-1">{selectedMinistration.mdGlobalNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          GLOBAL MODALS
          ========================================================= */}

      {/* 1. Song Detail Modal */}
      <SongDetailModal
        song={selectedSong}
        isOpen={!!selectedSong}
        onClose={() => setSelectedSong(null)}
        activeRole={activeRole}
        onEdit={(song) => {
          setEditingSong(song);
          setIsAddEditSongOpen(true);
        }}
        onDelete={handleDeleteSong}
      />

      {/* 2. Add / Edit Song Modal */}
      <AddEditSongModal
        isOpen={isAddEditSongOpen}
        onClose={() => setIsAddEditSongOpen(false)}
        onSave={handleSaveSong}
        editingSong={editingSong}
      />

      {/* 3. Add / Edit Member Modal */}
      <AddEditMemberModal
        isOpen={isAddEditMemberOpen}
        onClose={() => setIsAddEditMemberOpen(false)}
        onSave={handleSaveMember}
        editingMember={editingMember}
      />

      {/* 4. Music Director Tools (Pitch Pipe, Metronome, Transpose) */}
      <ToolsModal
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
      />

      {/* 5. Stage Rehearsal & Live Practice Prompter */}
      {selectedMinistration && (
        <StageRehearsalModal
          isOpen={isStageModeOpen}
          onClose={() => setIsStageModeOpen(false)}
          ministration={selectedMinistration}
          songs={songs}
          team={team}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-[#86868b] space-y-2 no-print">
        <div className="flex items-center justify-center gap-1 font-semibold">
          <span>Jewels Music Hub</span>
          <span>•</span>
          <span>Music • Excellence • Service</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-[11px]">
          <span>Logged in as: <strong className="text-[#1d1d1f]">{activeRole === 'admin_md' ? 'Daniel Antwi (MD & Admin)' : activeRole}</strong></span>
          <span>•</span>
          <button 
            onClick={handleResetData}
            className="text-[#86868b] hover:text-rose-600 underline transition-colors"
          >
            Reset Defaults
          </button>
        </div>
      </footer>

    </div>
  );
}
