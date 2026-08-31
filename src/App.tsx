/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Song,
  Ministration,
  TeamMember,
  ActiveTab,
  ActiveRole
} from './types';

import {
  loadStoredSongs,
  saveStoredSongs,
  loadStoredMinistrations,
  saveStoredMinistrations,
  loadStoredTeam,
  saveStoredTeam,
  resetAllToDefaults
} from './utils/storage';

import { saveAudioFile, deleteAudioFile } from './utils/audioStorage';

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

export default function App() {
  // ============================================================
  // MAIN DATA
  // ============================================================

  const [songs, setSongs] = useState<Song[]>(() => loadStoredSongs());

  const [ministrations, setMinistrations] =
    useState<Ministration[]>(() => loadStoredMinistrations());

  const [team, setTeam] =
    useState<TeamMember[]>(() => loadStoredTeam());

  // ============================================================
  // NAVIGATION
  // ============================================================

  const [activeTab, setActiveTab] =
    useState<ActiveTab>('home');

  const [activeRole, setActiveRole] =
    useState<ActiveRole>('admin_md');

  // ============================================================
  // SONG MODALS
  // ============================================================

  const [selectedSong, setSelectedSong] =
    useState<Song | null>(null);

  const [editingSong, setEditingSong] =
    useState<Song | null>(null);

  const [isAddEditSongOpen, setIsAddEditSongOpen] =
    useState(false);

  // ============================================================
  // MEMBER MODALS
  // ============================================================

  const [editingMember, setEditingMember] =
    useState<TeamMember | null>(null);

  const [isAddEditMemberOpen, setIsAddEditMemberOpen] =
    useState(false);

  // ============================================================
  // OTHER MODALS
  // ============================================================

  const [isToolsModalOpen, setIsToolsModalOpen] =
    useState(false);

  const [isStageModeOpen, setIsStageModeOpen] =
    useState(false);

  // ============================================================
  // SELECTED MINISTRATION
  // ============================================================

  const [selectedMinistration, setSelectedMinistration] =
    useState<Ministration | null>(
      () =>
        ministrations.find(
          (m) => m.status === 'Upcoming'
        ) || ministrations[0] || null
    );

  // ============================================================
  // SAVE DATA TO LOCAL STORAGE
  // ============================================================

  useEffect(() => {
    saveStoredSongs(songs);
  }, [songs]);

  useEffect(() => {
    saveStoredMinistrations(ministrations);
  }, [ministrations]);

  useEffect(() => {
    saveStoredTeam(team);
  }, [team]);

  // ============================================================
  // KEEP SELECTED MINISTRATION UPDATED
  // ============================================================

  useEffect(() => {
    if (!selectedMinistration) return;

    const refreshed = ministrations.find(
      (m) => m.id === selectedMinistration.id
    );

    if (refreshed) {
      setSelectedMinistration(refreshed);
    }
  }, [ministrations]);

  // ============================================================
  // SONG BANK
  // ============================================================

  const handleSaveSong = async (
    songData: Omit<Song, 'id'> & { id?: number },
    audioFile?: File
  ) => {
    try {
      let songId: number;

      // --------------------------------------------------------
      // EDIT EXISTING SONG
      // --------------------------------------------------------

      if (songData.id) {
        songId = songData.id;

        const updatedSong: Song = {
          ...songData,
          id: songId
        } as Song;

        setSongs((prev) =>
          prev.map((song) =>
            song.id === songId ? updatedSong : song
          )
        );

        // Save newly selected audio if there is one.
        if (audioFile) {
          await saveAudioFile(songId, audioFile);
        }

        // Refresh selected song if currently open.
        if (selectedSong?.id === songId) {
          setSelectedSong(updatedSong);
        }

        return;
      }

      // --------------------------------------------------------
      // ADD NEW SONG
      // --------------------------------------------------------

      songId = Date.now();

      const newSong: Song = {
        ...songData,
        id: songId,
        createdAt: new Date().toISOString()
      } as Song;

      // IMPORTANT:
      // Save the audio first.
      //
      // If IndexedDB fails, we don't add a broken song to
      // the Song Bank.
      if (audioFile) {
        await saveAudioFile(songId, audioFile);
      }

      // Now save the song information.
      setSongs((prev) => [
        newSong,
        ...prev
      ]);

    } catch (error) {
      console.error(
        'Error saving song:',
        error
      );

      alert(
        'The song could not be saved. Please try again.'
      );
    }
  };

  // ============================================================
  // DELETE SONG
  // ============================================================

  const handleDeleteSong = async (
    songId: number
  ) => {
    try {
      // Delete associated audio.
      await deleteAudioFile(songId);
    } catch (error) {
      console.warn(
        'Audio file could not be deleted:',
        error
      );
    }

    // Delete song.
    setSongs((prev) =>
      prev.filter(
        (song) => song.id !== songId
      )
    );

    // Remove song from ministrations.
    setMinistrations((prev) =>
      prev.map((ministration) => ({
        ...ministration,
        songs: ministration.songs.filter(
          (item) => item.songId !== songId
        )
      }))
    );

    // Close selected song if necessary.
    if (selectedSong?.id === songId) {
      setSelectedSong(null);
    }
  };

  // ============================================================
  // TEAM
  // ============================================================

  const handleSaveMember = (
    memberData: Omit<TeamMember, 'id'> & {
      id?: number;
    }
  ) => {
    if (memberData.id) {
      setTeam((prev) =>
        prev.map((member) =>
          member.id === memberData.id
            ? (memberData as TeamMember)
            : member
        )
      );
    } else {
      const newId = Date.now();

      const newMember: TeamMember = {
        ...memberData,
        id: newId
      };

      setTeam((prev) => [
        ...prev,
        newMember
      ]);
    }
  };

  // ============================================================
  // DELETE MEMBER
  // ============================================================

  const handleDeleteMember = (
    memberId: number
  ) => {
    setTeam((prev) =>
      prev.filter(
        (member) => member.id !== memberId
      )
    );

    setMinistrations((prev) =>
      prev.map((ministration) => ({
        ...ministration,
        songs: ministration.songs.map(
          (item) =>
            item.lead === memberId
              ? {
                  ...item,
                  lead: null
                }
              : item
        )
      }))
    );
  };

  // ============================================================
  // MEMBER PERMISSIONS
  // ============================================================

  const handleTogglePermission = (
    memberId: number
  ) => {
    setTeam((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              canEdit: !member.canEdit
            }
          : member
      )
    );
  };

  // ============================================================
  // MINISTRATIONS
  // ============================================================

  const handleUpdateMinistration = (
    updated: Ministration
  ) => {
    setMinistrations((prev) =>
      prev.map((ministration) =>
        ministration.id === updated.id
          ? updated
          : ministration
      )
    );

    setSelectedMinistration(updated);
  };

  // ============================================================
  // CREATE MINISTRATION
  // ============================================================

  const handleCreateMinistration = (
    newMinData: Omit<Ministration, 'id'>
  ) => {
    const newId = Date.now();

    const created: Ministration = {
      ...newMinData,
      id: newId
    };

    setMinistrations((prev) => [
      created,
      ...prev
    ]);

    setSelectedMinistration(created);
  };

  // ============================================================
  // RESET
  // ============================================================

  const handleResetData = () => {
    const confirmed = window.confirm(
      'Reset all songs, ministrations, and team roster to initial church defaults?'
    );

    if (!confirmed) return;

    resetAllToDefaults();

    window.location.reload();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen flex flex-col justify-between text-[#1d1d1f] font-sans pb-12 sm:pb-16 selection:bg-[#007aff]/20 selection:text-[#007aff]">

      <div>

        {/* ======================================================
            NAVBAR
        ====================================================== */}

        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          team={team}
          songsCount={songs.length}
          openToolsModal={() =>
            setIsToolsModalOpen(true)
          }
          openStageMode={() =>
            setIsStageModeOpen(true)
          }
        />

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">

          {/* HOME */}

          {activeTab === 'home' && (
            <DashboardView
              songs={songs}
              ministrations={ministrations}
              team={team}
              activeRole={activeRole}
              setActiveTab={setActiveTab}
              onSelectSong={(song) =>
                setSelectedSong(song)
              }
              onSelectMinistration={(ministration) => {
                setSelectedMinistration(
                  ministration
                );

                setActiveTab(
                  'ministrations'
                );
              }}
              openToolsModal={() =>
                setIsToolsModalOpen(true)
              }
              openStageMode={() =>
                setIsStageModeOpen(true)
              }
            />
          )}

          {/* SONG BANK */}

          {activeTab === 'songs' && (
            <SongBankView
              songs={songs}
              activeRole={activeRole}
              onSelectSong={(song) =>
                setSelectedSong(song)
              }
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

          {/* MINISTRATIONS */}

          {activeTab === 'ministrations' && (
            <MinistrationsView
              ministrations={ministrations}
              songs={songs}
              team={team}
              activeRole={activeRole}
              selectedMinistration={
                selectedMinistration
              }
              onSelectMinistration={(ministration) =>
                setSelectedMinistration(
                  ministration
                )
              }
              onUpdateMinistration={
                handleUpdateMinistration
              }
              onCreateMinistration={
                handleCreateMinistration
              }
              onSelectSong={(song) =>
                setSelectedSong(song)
              }
              openStageMode={() =>
                setIsStageModeOpen(true)
              }
            />
          )}

          {/* MUSIC TEAM */}

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
              onDeleteMember={
                handleDeleteMember
              }
              onTogglePermission={
                handleTogglePermission
              }
            />
          )}

        </main>
      </div>

      {/* ========================================================
          PRINTABLE SERVICE SHEET
      ======================================================== */}

      {selectedMinistration && (
        <div className="hidden print-only p-8 text-black bg-white">

          <div className="border-b-2 border-black pb-4 mb-6">

            <h1 className="text-3xl font-extrabold">
              {selectedMinistration.name}
            </h1>

            <p className="text-base text-gray-700 mt-1">
              Jewels Music Ministry • Date:{' '}
              {selectedMinistration.date}{' '}
              {selectedMinistration.time
                ? `• ${selectedMinistration.time}`
                : ''}
            </p>

            {selectedMinistration.venue && (
              <p className="text-sm text-gray-600">
                Venue: {selectedMinistration.venue}
              </p>
            )}

          </div>

          <h2 className="text-xl font-bold mb-4">
            Official Service Setlist & Vocal Allocations
          </h2>

          <table className="w-full border-collapse border border-gray-400 text-sm">

            <thead>

              <tr className="bg-gray-100">

                <th className="border border-gray-400 p-2 text-left">
                  #
                </th>

                <th className="border border-gray-400 p-2 text-left">
                  Song Title
                </th>

                <th className="border border-gray-400 p-2 text-left">
                  Artist
                </th>

                <th className="border border-gray-400 p-2 text-left">
                  Key
                </th>

                <th className="border border-gray-400 p-2 text-left">
                  Lead Vocalist
                </th>

                <th className="border border-gray-400 p-2 text-left">
                  Transition Cue
                </th>

              </tr>

            </thead>

            <tbody>

              {selectedMinistration.songs.map(
                (item, idx) => {

                  const song = songs.find(
                    (s) =>
                      s.id === item.songId
                  );

                  const lead = team.find(
                    (member) =>
                      member.id === item.lead
                  );

                  return (
                    <tr key={item.songId}>

                      <td className="border border-gray-400 p-2 font-bold">
                        {idx + 1}
                      </td>

                      <td className="border border-gray-400 p-2 font-bold">
                        {song?.title}
                      </td>

                      <td className="border border-gray-400 p-2">
                        {song?.artist}
                      </td>

                      <td className="border border-gray-400 p-2 font-bold">
                        {item.keyOverride ||
                          song?.key}
                      </td>

                      <td className="border border-gray-400 p-2 font-bold">
                        {lead
                          ? lead.name
                          : 'Unassigned'}
                      </td>

                      <td className="border border-gray-400 p-2">
                        {item.orderNote || '—'}
                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

          {selectedMinistration.mdGlobalNotes && (
            <div className="mt-6 p-4 border border-gray-400">

              <h3 className="font-bold text-sm">
                Music Director Directives:
              </h3>

              <p className="text-xs mt-1">
                {selectedMinistration.mdGlobalNotes}
              </p>

            </div>
          )}

        </div>
      )}

      {/* ========================================================
          GLOBAL MODALS
      ======================================================== */}

      {/* SONG DETAILS */}

      <SongDetailModal
        song={selectedSong}
        isOpen={!!selectedSong}
        onClose={() =>
          setSelectedSong(null)
        }
        activeRole={activeRole}
        onEdit={(song) => {
          setSelectedSong(null);
          setEditingSong(song);
          setIsAddEditSongOpen(true);
        }}
        onDelete={handleDeleteSong}
      />

      {/* ADD / EDIT SONG */}

      <AddEditSongModal
        isOpen={isAddEditSongOpen}
        onClose={() =>
          setIsAddEditSongOpen(false)
        }
        onSave={handleSaveSong}
        editingSong={editingSong}
      />

      {/* ADD / EDIT MEMBER */}

      <AddEditMemberModal
        isOpen={isAddEditMemberOpen}
        onClose={() =>
          setIsAddEditMemberOpen(false)
        }
        onSave={handleSaveMember}
        editingMember={editingMember}
      />

      {/* TOOLS */}

      <ToolsModal
        isOpen={isToolsModalOpen}
        onClose={() =>
          setIsToolsModalOpen(false)
        }
      />

      {/* STAGE MODE */}

      {selectedMinistration && (
        <StageRehearsalModal
          isOpen={isStageModeOpen}
          onClose={() =>
            setIsStageModeOpen(false)
          }
          ministration={
            selectedMinistration
          }
          songs={songs}
          team={team}
        />
      )}

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <footer className="mt-16 text-center text-xs text-[#86868b] space-y-2 no-print">

        <div className="flex items-center justify-center gap-1 font-semibold">

          <span>Jewels Music Hub</span>

          <span>•</span>

          <span>
            Music • Excellence • Service
          </span>

        </div>

        <div className="flex items-center justify-center gap-3 text-[11px]">

          <span>
            Logged in as:{' '}
            <strong className="text-[#1d1d1f]">
              {activeRole === 'admin_md'
                ? 'Daniel Antwi (MD & Admin)'
                : activeRole}
            </strong>
          </span>

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
