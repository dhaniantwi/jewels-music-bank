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

import {
  saveAudioFile,
  deleteAudioFile
} from './utils/audioStorage';
import { supabase } from './supabaseClient';
import { Navbar } from './components/Navbar';
import { MDLogin } from './components/MDLogin';
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
  // MAIN APPLICATION STATE
  // ============================================================

  const [songs, setSongs] = useState<Song[]>(() =>
    loadStoredSongs()
  );

  const [ministrations, setMinistrations] = useState<Ministration[]>(() =>
    loadStoredMinistrations()
  );

  const [team, setTeam] = useState<TeamMember[]>(() =>
    loadStoredTeam()
  );

  // ============================================================
  // ACTIVE VIEW & ROLE
  // ============================================================

  const [activeTab, setActiveTab] =
  useState<ActiveTab>('home');

const [activeRole, setActiveRole] =
  useState<ActiveRole>('vocalist');

const [showMDLogin, setShowMDLogin] =
  useState(false);
const [isMDPortalOpen, setIsMDPortalOpen] =
  useState(false);
  useEffect(() => {
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      setIsMDPortalOpen(true);
    }
  };

  checkSession();
}, []);
  
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
    useState<Ministration | null>(() =>
      ministrations.find(
        m => m.status === 'Upcoming'
      ) || ministrations[0] || null
    );

  // ============================================================
  // SAVE SONGS
  // ============================================================

  useEffect(() => {
    saveStoredSongs(songs);
  }, [songs]);

  // ============================================================
  // SAVE MINISTRATIONS
  // ============================================================

  useEffect(() => {
    saveStoredMinistrations(ministrations);
  }, [ministrations]);

  // ============================================================
  // SAVE TEAM
  // ============================================================

  useEffect(() => {
    saveStoredTeam(team);
  }, [team]);

  // ============================================================
  // KEEP SELECTED MINISTRATION UPDATED
  // ============================================================

  useEffect(() => {
    if (!selectedMinistration) return;

    const refreshed = ministrations.find(
      m => m.id === selectedMinistration.id
    );

    if (refreshed) {
      setSelectedMinistration(refreshed);
    }
  }, [ministrations, selectedMinistration]);

  // ============================================================
  // SONG BANK - SAVE SONG
  // ============================================================

  const handleSaveSong = async (
    songData: Omit<Song, 'id'> & { id?: number },
    audioFile?: File
  ): Promise<void> => {

    try {

      // ----------------------------------------------------------
      // EDIT EXISTING SONG
      // ----------------------------------------------------------

      if (songData.id !== undefined) {

        const updatedSong: Song = {
          ...songData,
          id: songData.id
        };

        // Update React state first.
        setSongs(prev =>
          prev.map(song =>
            song.id === updatedSong.id
              ? updatedSong
              : song
          )
        );

        // Update currently selected song.
        setSelectedSong(prev =>
          prev && prev.id === updatedSong.id
            ? updatedSong
            : prev
        );

        // Save replacement audio if supplied.
        if (audioFile) {
          await saveAudioFile(
            updatedSong.id,
            audioFile
          );
        }

        console.log(
          'Song updated successfully:',
          updatedSong.title
        );

        return;
      }

      // ----------------------------------------------------------
      // ADD NEW SONG
      // ----------------------------------------------------------

      const newId = Date.now();

      const newSong: Song = {
        ...songData,
        id: newId,
        createdAt: new Date().toISOString()
      };

      // ----------------------------------------------------------
      // ADD SONG TO STATE
      // ----------------------------------------------------------

      setSongs(prev => [
        newSong,
        ...prev
      ]);

      // ----------------------------------------------------------
      // SAVE AUDIO SEPARATELY
      // ----------------------------------------------------------

      if (audioFile) {

        try {

          await saveAudioFile(
            newId,
            audioFile
          );

          console.log(
            'Audio saved successfully:',
            audioFile.name
          );

        } catch (audioError) {

          console.error(
            'Audio could not be saved:',
            audioError
          );

          /*
           * IMPORTANT:
           * Do not throw here.
           *
           * The song itself has already been saved.
           * If IndexedDB fails, we keep the song instead
           * of making the entire application crash.
           */

          alert(
            'The song was added, but the audio file could not be stored. You can try adding the audio again by editing the song.'
          );
        }
      }

      console.log(
        'Song added successfully:',
        newSong.title
      );

    } catch (error) {

      console.error(
        'Unexpected error while saving song:',
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
  ): Promise<void> => {

    try {

      await deleteAudioFile(songId);

    } catch (error) {

      console.error(
        'Error deleting audio file:',
        error
      );

    } finally {

      // Remove song.
      setSongs(prev =>
        prev.filter(song =>
          song.id !== songId
        )
      );

      // Remove song from ministrations.
      setMinistrations(prev =>
        prev.map(ministration => ({
          ...ministration,
          songs:
            ministration.songs.filter(
              item =>
                item.songId !== songId
            )
        }))
      );

      // Close selected song.
      setSelectedSong(prev =>
        prev && prev.id === songId
          ? null
          : prev
      );
    }
  };

  // ============================================================
  // TEAM - SAVE MEMBER
  // ============================================================

  const handleSaveMember = (
    memberData:
      Omit<TeamMember, 'id'> & {
        id?: number;
      }
  ): void => {

    if (memberData.id !== undefined) {

      const updatedMember: TeamMember = {
        ...memberData,
        id: memberData.id
      };

      setTeam(prev =>
        prev.map(member =>
          member.id === updatedMember.id
            ? updatedMember
            : member
        )
      );

    } else {

      const newMember: TeamMember = {
        ...memberData,
        id: Date.now()
      };

      setTeam(prev => [
        ...prev,
        newMember
      ]);
    }
  };

  // ============================================================
  // DELETE TEAM MEMBER
  // ============================================================

  const handleDeleteMember = (
    memberId: number
  ): void => {

    setTeam(prev =>
      prev.filter(member =>
        member.id !== memberId
      )
    );

    setMinistrations(prev =>
      prev.map(ministration => ({
        ...ministration,

        songs:
          ministration.songs.map(item =>
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
  // TOGGLE MEMBER PERMISSION
  // ============================================================

  const handleTogglePermission = (
    memberId: number
  ): void => {

    setTeam(prev =>
      prev.map(member =>
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
  // UPDATE MINISTRATION
  // ============================================================

  const handleUpdateMinistration = (
    updated: Ministration
  ): void => {

    setMinistrations(prev =>
      prev.map(ministration =>
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
  ): void => {

    const created: Ministration = {
      ...newMinData,
      id: Date.now()
    };

    setMinistrations(prev => [
      created,
      ...prev
    ]);

    setSelectedMinistration(created);
  };

  // ============================================================
  // RESET DATA
  // ============================================================

  const handleResetData = (): void => {

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
{showMDLogin && (
  <MDLogin
    onLoginSuccess={() => {
  setShowMDLogin(false);
  setIsMDPortalOpen(true);
}}
    
  />
)} 
      {isMDPortalOpen ? (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="text-center">
      <div className="text-5xl mb-4">🔐</div>

      <h1 className="text-3xl font-extrabold">
        MD Admin Portal
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome, Music Director.
      </p>

      <button
        onClick={() => setIsMDPortalOpen(false)}
        className="mt-8 px-5 py-3 rounded-xl bg-[#1d1d1f] text-white text-sm font-bold hover:bg-black transition"
      >
        ← Return to General Music Hub
      </button>
    </div>
  </div>
) : (
  <div>
    

        {/* ======================================================
            NAVIGATION
        ====================================================== */}

        <Navbar
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  activeRole={activeRole}
  onOpenMDLogin={() => setShowMDLogin(true)}
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

          {/* ====================================================
              HOME
          ==================================================== */}

          {activeTab === 'home' && (
            <DashboardView
              songs={songs}
              ministrations={ministrations}
              team={team}
              activeRole={activeRole}
              setActiveTab={setActiveTab}

              onSelectSong={song =>
                setSelectedSong(song)
              }

              onSelectMinistration={ministration => {
                setSelectedMinistration(ministration);
                setActiveTab('ministrations');
              }}

              openToolsModal={() =>
                setIsToolsModalOpen(true)
              }

              openStageMode={() =>
                setIsStageModeOpen(true)
              }
            />
          )}

          {/* ====================================================
              SONG BANK
          ==================================================== */}

          {activeTab === 'songs' && (
            <SongBankView
              songs={songs}
              activeRole={activeRole}

              onSelectSong={song =>
                setSelectedSong(song)
              }

              onAddNewSong={() => {
                setEditingSong(null);
                setIsAddEditSongOpen(true);
              }}

              onEditSong={song => {
                setEditingSong(song);
                setIsAddEditSongOpen(true);
              }}

              onDeleteSong={handleDeleteSong}
            />
          )}

          {/* ====================================================
              MINISTRATIONS
          ==================================================== */}

          {activeTab === 'ministrations' && (
            <MinistrationsView
              ministrations={ministrations}
              songs={songs}
              team={team}
              activeRole={activeRole}
              selectedMinistration={selectedMinistration}

              onSelectMinistration={ministration =>
                setSelectedMinistration(ministration)
              }

              onUpdateMinistration={
                handleUpdateMinistration
              }

              onCreateMinistration={
                handleCreateMinistration
              }

              onSelectSong={song =>
                setSelectedSong(song)
              }

              openStageMode={() =>
                setIsStageModeOpen(true)
              }
            />
          )}

          {/* ====================================================
              MUSIC TEAM
          ==================================================== */}

          {activeTab === 'team' && (
            <MusicTeamView
              team={team}
              activeRole={activeRole}

              onAddNewMember={() => {
                setEditingMember(null);
                setIsAddEditMemberOpen(true);
              }}

              onEditMember={member => {
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
    )}

      {/* ========================================================
          PRINTABLE MINISTRATION SHEET
      ======================================================== */}
      {selectedMinistration && (
        <div className="hidden print-only p-8 text-black bg-white">

          <div className="border-b-2 border-black pb-4 mb-6">

            <h1 className="text-3xl font-extrabold">
              {selectedMinistration.name}
            </h1>

           <p className="text-base text-gray-700 mt-1">
  Jewels Music Ministry • Date: {selectedMinistration.date}
  {selectedMinistration.time ? (
    <> • {selectedMinistration.time}</>
  ) : null}
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
                (item, index) => {

                  const song =
                    songs.find(
                      s =>
                        s.id === item.songId
                    );

                  const lead =
                    team.find(
                      member =>
                        member.id === item.lead
                    );

                  return (
                    <tr key={item.songId}>

                      <td className="border border-gray-400 p-2 font-bold">
                        {index + 1}
                      </td>

                      <td className="border border-gray-400 p-2 font-bold">
                        {song?.title}
                      </td>

                      <td className="border border-gray-400 p-2">
                        {song?.artist}
                      </td>

                      <td className="border border-gray-400 p-2 font-bold">
                        {item.keyOverride || song?.key}
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

      <SongDetailModal
        song={selectedSong}
        isOpen={!!selectedSong}

        onClose={() =>
          setSelectedSong(null)
        }

        activeRole={activeRole}

        onEdit={song => {
          setSelectedSong(null);
          setEditingSong(song);
          setIsAddEditSongOpen(true);
        }}

        onDelete={handleDeleteSong}
      />

      {/* ========================================================
          ADD / EDIT SONG
      ======================================================== */}

      <AddEditSongModal
        isOpen={isAddEditSongOpen}

        onClose={() => {
          setIsAddEditSongOpen(false);
          setEditingSong(null);
        }}

        onSave={async (
          songData,
          audioFile
        ) => {

          await handleSaveSong(
            songData,
            audioFile
          );

          setIsAddEditSongOpen(false);
          setEditingSong(null);
        }}

        editingSong={editingSong}
      />

      {/* ========================================================
          ADD / EDIT MEMBER
      ======================================================== */}

      <AddEditMemberModal
        isOpen={isAddEditMemberOpen}

        onClose={() => {
          setIsAddEditMemberOpen(false);
          setEditingMember(null);
        }}

        onSave={handleSaveMember}

        editingMember={editingMember}
      />

      {/* ========================================================
          TOOLS
      ======================================================== */}

      <ToolsModal
        isOpen={isToolsModalOpen}

        onClose={() =>
          setIsToolsModalOpen(false)
        }
      />

      {/* ========================================================
          STAGE REHEARSAL
      ======================================================== */}

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

          <span>
            Jewels Music Hub
          </span>

          <span>•</span>

          <span>
            Music • Excellence • Service
          </span>

        </div>

        <div className="flex items-center justify-center gap-3 text-[11px]">

          <span>
  Jewels Music Ministry Portal
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
