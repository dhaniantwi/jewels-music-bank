
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

  const [songs, setSongs] = useState<Song[]>([]);

  const [ministrations, setMinistrations] = useState<Ministration[]>(() =>
    loadStoredMinistrations()
  );

 const [team, setTeam] = useState<TeamMember[]>([]);
  // ============================================================
  // THEME
  // ============================================================

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('jewels-theme');

    if (savedTheme) {
      return savedTheme === 'dark';
    }

    // First-time visitors get Dark Mode by default.
    return true;
  });

  useEffect(() => {
    localStorage.setItem(
      'jewels-theme',
      darkMode ? 'dark' : 'light'
    );

    document.documentElement.classList.toggle(
      'dark',
      darkMode
    );
  }, [darkMode]);
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
    const checkMDSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setIsMDPortalOpen(false);
        setActiveRole('vocalist');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      console.log('MD AUTH CHECK:', {
        userId: data.session.user.id,
        profile,
        error,
      });

      if (error || profile?.role !== 'admin_md') {
        await supabase.auth.signOut({ scope: 'local' });
        setIsMDPortalOpen(false);
        setActiveRole('vocalist');
        return;
      }

      setActiveRole('admin_md');
      setIsMDPortalOpen(true);
    };

    checkMDSession();
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {

      if (event === 'SIGNED_OUT' || !session) {
        setIsMDPortalOpen(false);
        setActiveRole('vocalist');
        return;
      }

      setTimeout(async () => {

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || profile?.role !== 'admin_md') {
          await supabase.auth.signOut({ scope: 'local' });
          setIsMDPortalOpen(false);
          setActiveRole('vocalist');
          return;
        }

        setActiveRole('admin_md');
        setIsMDPortalOpen(true);

      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
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
  // LOAD SONGS FROM SUPABASE
  // ============================================================

  useEffect(() => {

    const loadSongsFromSupabase = async () => {

      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(
          'Could not load songs from Supabase:',
          error
        );
        return;
      }

      if (!data) {
        setSongs([]);
        return;
      }

      const mappedSongs: Song[] = data.map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        category: song.category,

        key: song.song_key,
        originalKey: song.original_key,

        tempo: song.tempo,
        bpm: song.bpm,

        timeSignature: song.time_signature,

        icon: song.icon,

        audioUrl: song.audio_url,

        lyrics: song.lyrics,
        chords: song.chords,

        arrangement: song.arrangment,
        instruments: song.instrument,

        mdNotes: song.md_notes,

        duration: song.duration,
        tags: song.tags,

        createdAt: song.created_at
      }));

          setSongs(mappedSongs);
  };

  loadSongsFromSupabase();

}, []);

// ============================================================
// LOAD TEAM FROM SUPABASE
// ============================================================

useEffect(() => {

  const loadTeamFromSupabase = async () => {

    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error(
        'Could not load team from Supabase:',
        error
      );
      return;
    }

    if (!data) {
      setTeam([]);
      return;
    }

    const mappedTeam: TeamMember[] = data.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role || '',
      type:
        member.role === 'Vocalist'
          ? 'vocal'
          : member.role === 'Instrumentalist'
            ? 'instrument'
            : 'director',
      voicePart:
        member.role === 'Vocalist'
          ? member.instrument || undefined
          : undefined,
      instrumentType:
        member.role === 'Instrumentalist'
          ? member.instrument || undefined
          : undefined,
      phone: member.phone || undefined,
      email: member.email || undefined,
      isAvailable: true,
      photoUrl: member.photo_url || undefined,
canEdit: member.name === 'Daniel Antwi'
    }));

    setTeam(mappedTeam);
  };

  loadTeamFromSupabase();

}, []);
 

  // ============================================================
  // SAVE MINISTRATIONS
  // ============================================================

  useEffect(() => {
    saveStoredMinistrations(ministrations);
  }, [ministrations]);

  // ============================================================
  // SAVE TEAM
  // ============================================================

  // ============================================================
// TEAM IS SAVED DIRECTLY TO SUPABASE
// ============================================================

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
  songData: Omit<Song, 'id'> & { id?: string },
  audioFile?: File
): Promise<void> => {

  try {

    // ============================================================
    // EDIT EXISTING SONG
    // ============================================================

    if (songData.id !== undefined) {

      // ----------------------------------------------------------
      // 1. Update song metadata
      // ----------------------------------------------------------

      const { data, error } = await supabase
        .from('songs')
        .update({
          title: songData.title,
          artist: songData.artist,
          category: songData.category,
          song_key: songData.key,
          original_key: songData.originalKey,
          tempo: songData.tempo,
          bpm: songData.bpm,
          time_signature: songData.timeSignature,
          icon: songData.icon,
          lyrics: songData.lyrics,
          chords: songData.chords,
          arrangment: songData.arrangement,
          instrument: songData.instruments,
          md_notes: songData.mdNotes,
          duration: songData.duration,
          tags: songData.tags
        })
        .eq('id', songData.id)
        .select()
        .single();

      if (error) {

        console.error(
          'Error updating song:',
          error
        );

        alert(
          'The song could not be updated. Please try again.'
        );

        return;
      }

      let finalAudioUrl = data.audio_url;

      // ----------------------------------------------------------
      // 2. Upload replacement audio if provided
      // ----------------------------------------------------------

      if (audioFile) {

        try {

          finalAudioUrl = await saveAudioFile(
            data.id,
            audioFile
          );

          // Save the new public URL in Supabase.
          const {
            error: audioUrlError
          } = await supabase
            .from('songs')
            .update({
              audio_url: finalAudioUrl
            })
            .eq('id', data.id);

          if (audioUrlError) {

            console.error(
              'Error saving audio URL:',
              audioUrlError
            );

            alert(
              'The song was updated, but the audio URL could not be saved.'
            );
          }

        } catch (audioError) {

          console.error(
            'Error uploading replacement audio:',
            audioError
          );

          alert(
            'The song was updated, but the new audio file could not be uploaded.'
          );
        }
      }

      // ----------------------------------------------------------
      // 3. Build final song object
      // ----------------------------------------------------------

      const updatedSong: Song = {
        id: data.id,
        title: data.title,
        artist: data.artist,
        category: data.category,

        key: data.song_key,
        originalKey: data.original_key,

        tempo: data.tempo,
        bpm: data.bpm,

        timeSignature: data.time_signature,

        icon: data.icon,

        audioUrl: finalAudioUrl,

        lyrics: data.lyrics,
        chords: data.chords,

        arrangement: data.arrangment,
        instruments: data.instrument,

        mdNotes: data.md_notes,

        duration: data.duration,
        tags: data.tags,

        createdAt: data.created_at
      };

      // ----------------------------------------------------------
      // 4. Update React state
      // ----------------------------------------------------------

      setSongs(prev =>
        prev.map(song =>
          song.id === updatedSong.id
            ? updatedSong
            : song
        )
      );

      setSelectedSong(prev =>
        prev && prev.id === updatedSong.id
          ? updatedSong
          : prev
      );

      console.log(
        'Song updated successfully:',
        updatedSong.title
      );

      return;
    }

    // ============================================================
    // ADD NEW SONG
    // ============================================================

    // ------------------------------------------------------------
    // 1. Create song metadata first.
    // Supabase generates the UUID.
    // ------------------------------------------------------------

    const { data, error } = await supabase
      .from('songs')
      .insert({
        title: songData.title,
        artist: songData.artist,
        category: songData.category,
        song_key: songData.key,
        original_key: songData.originalKey,
        tempo: songData.tempo,
        bpm: songData.bpm,
        time_signature: songData.timeSignature,
        icon: songData.icon,
        lyrics: songData.lyrics,
        chords: songData.chords,
        arrangment: songData.arrangement,
        instrument: songData.instruments,
        md_notes: songData.mdNotes,
        duration: songData.duration,
        tags: songData.tags
      })
      .select()
      .single();

    if (error) {

      console.error(
        'Error adding song:',
        error
      );

      alert(
        'The song could not be added. Please try again.'
      );

      return;
    }

    // ------------------------------------------------------------
    // 2. Upload audio using the new Supabase UUID.
    // ------------------------------------------------------------

    let finalAudioUrl = data.audio_url;

    if (audioFile) {

      try {

        finalAudioUrl = await saveAudioFile(
          data.id,
          audioFile
        );

        // Save the public URL to the song record.
        const {
          error: audioUrlError
        } = await supabase
          .from('songs')
          .update({
            audio_url: finalAudioUrl
          })
          .eq('id', data.id);

        if (audioUrlError) {

          console.error(
            'Error saving audio URL:',
            audioUrlError
          );

          alert(
            'The song was added, but its audio URL could not be saved.'
          );
        }

      } catch (audioError) {

        console.error(
          'Audio could not be uploaded:',
          audioError
        );

        alert(
          'The song was added, but the audio file could not be uploaded.'
        );
      }
    }

    // ------------------------------------------------------------
    // 3. Build final song object
    // ------------------------------------------------------------

    const newSong: Song = {
      id: data.id,
      title: data.title,
      artist: data.artist,
      category: data.category,

      key: data.song_key,
      originalKey: data.original_key,

      tempo: data.tempo,
      bpm: data.bpm,

      timeSignature: data.time_signature,

      icon: data.icon,

      audioUrl: finalAudioUrl,

      lyrics: data.lyrics,
      chords: data.chords,

      arrangement: data.arrangment,
      instruments: data.instrument,

      mdNotes: data.md_notes,

      duration: data.duration,
      tags: data.tags,

      createdAt: data.created_at
    };

    // ------------------------------------------------------------
    // 4. Add final song to React state
    // ------------------------------------------------------------

    setSongs(prev => [
      newSong,
      ...prev
    ]);

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
  songId: string
): Promise<void> => {

  try {

    // ----------------------------------------------------------
    // 1. Delete the song's audio from Supabase Storage
    // ----------------------------------------------------------

    try {

      await deleteAudioFile(songId);

    } catch (audioError) {

      console.error(
        'Error deleting song audio:',
        audioError
      );

      // Continue with song deletion even if the
      // audio file could not be removed.
    }

    // ----------------------------------------------------------
    // 2. Delete the song record from Supabase
    // ----------------------------------------------------------

    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', songId);

    if (error) {

      console.error(
        'Error deleting song:',
        error
      );

      alert(
        'The song could not be deleted. Please try again.'
      );

      return;
    }

    // ----------------------------------------------------------
    // 3. Remove song from React state
    // ----------------------------------------------------------

    setSongs(prev =>
      prev.filter(song =>
        song.id !== songId
      )
    );

    // ----------------------------------------------------------
    // 4. Remove song from local ministration data
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // 5. Close selected song if necessary
    // ----------------------------------------------------------

    setSelectedSong(prev =>
      prev && prev.id === songId
        ? null
        : prev
    );

    console.log(
      'Song deleted successfully:',
      songId
    );

  } catch (error) {

    console.error(
      'Unexpected error while deleting song:',
      error
    );

    alert(
      'The song could not be deleted. Please try again.'
    );
  }
};

  // ============================================================
  // TEAM - SAVE MEMBER
  // ============================================================
const handlePhotoSelected = async (
  member: TeamMember,
  file: File
): Promise<void> => {
  try {
    console.log('Uploading team photo:', {
      memberId: member.id,
      memberName: member.name,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    const fileExtension =
      file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const filePath = `team-members/${member.id}-${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('team-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error(
        'Could not upload team photo:',
        uploadError
      );
      alert(
        `Photo upload failed: ${uploadError.message}`
      );
      return;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from('team-photos')
      .getPublicUrl(filePath);

    const photoUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from('team_members')
      .update({
        photo_url: photoUrl,
      })
      .eq('id', member.id);

    if (updateError) {
      console.error(
        'Could not save team photo URL:',
        updateError
      );
      alert(
        `Photo was uploaded, but the database update failed: ${updateError.message}`
      );
      return;
    }

    setTeam(prev =>
      prev.map(currentMember =>
        currentMember.id === member.id
          ? {
              ...currentMember,
              photoUrl,
            }
          : currentMember
      )
    );

    console.log(
      'Team photo uploaded successfully:',
      photoUrl
    );

    alert(
      `${member.name}'s photo has been updated successfully.`
    );
  } catch (error) {
    console.error(
      'Unexpected team photo upload error:',
      error
    );

    alert(
      'Something went wrong while uploading the photo.'
    );
  }
};
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
    <div
  className={`min-h-screen flex flex-col justify-between font-sans pb-12 sm:pb-16 transition-colors duration-300 ${
    darkMode
      ? 'text-white selection:bg-[#007aff]/30 selection:text-white'
      : 'text-[#1d1d1f] selection:bg-[#007aff]/20 selection:text-[#007aff]'
  }`}
>

      {isMDPortalOpen ? (

        <div>

          {/* ======================================================
              MD ADMIN PORTAL
          ====================================================== */}

          <div className="bg-[#1d1d1f] text-white px-4 py-3 flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-wider text-gray-400">
                Jewels Music Ministry
              </p>

              <h1 className="text-lg font-extrabold">
                🔐 MD Admin Portal
              </h1>

            </div>

            <button
              onClick={async () => {

                await supabase.auth.signOut({
                  scope: 'local'
                });

                setIsMDPortalOpen(false);
                setActiveRole('vocalist');

              }}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold transition"
            >
              Logout
            </button>

          </div>

          {/* ======================================================
              MD ADMIN MUSIC HUB
          ====================================================== */}

          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeRole="admin_md"
              
            onOpenMDLogin={() =>
              setShowMDLogin(true)
            }
            team={team}
            songsCount={songs.length}
            openToolsModal={() =>
              setIsToolsModalOpen(true)
            }
            openStageMode={() => {
  const stageMinistration =
    selectedMinistration ||
    ministrations.find(
      m => m.status === 'Upcoming'
    ) ||
    ministrations[0] ||
    null;

  if (!stageMinistration) {
    alert('No ministration is available for Stage Mode yet.');
    return;
  }

  setSelectedMinistration(stageMinistration);
  setIsStageModeOpen(true);
}}
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
                activeRole="admin_md"
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

                openStageMode={() => {
  const stageMinistration =
    selectedMinistration ||
    ministrations.find(
      m => m.status === 'Upcoming'
    ) ||
    ministrations[0] ||
    null;

  if (!stageMinistration) {
    alert('No ministration is available for Stage Mode yet.');
    return;
  }

  setSelectedMinistration(stageMinistration);
  setIsStageModeOpen(true);
}}
              />

            )}

            {/* SONG BANK */}

            {activeTab === 'songs' && (

              <SongBankView
                songs={songs}
                activeRole="admin_md"

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

            {/* MINISTRATIONS */}

            {activeTab === 'ministrations' && (

              <MinistrationsView
                ministrations={ministrations}
                songs={songs}
                team={team}
                activeRole="admin_md"
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

                openStageMode={() => {
  const stageMinistration =
    selectedMinistration ||
    ministrations.find(
      m => m.status === 'Upcoming'
    ) ||
    ministrations[0] ||
    null;

  if (!stageMinistration) {
    alert('No ministration is available for Stage Mode yet.');
    return;
  }

  setSelectedMinistration(stageMinistration);
  setIsStageModeOpen(true);
}}
              />

            )}

            {/* MUSIC TEAM */}

            {activeTab === 'team' && (

              <MusicTeamView
                team={team}
                activeRole="admin_md"
                onPhotoSelected={handlePhotoSelected}

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

      ) : showMDLogin ? (

        <MDLogin
          onLoginSuccess={() => {
            setShowMDLogin(false);
          }}
        />

      ) : (

        <div>

          {/* ======================================================
              NAVIGATION
          ====================================================== */}

          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeRole={activeRole}
              darkMode={darkMode}
             setDarkMode={setDarkMode}
            onOpenMDLogin={() =>
              setShowMDLogin(true)
            }
            team={team}
            songsCount={songs.length}
            openToolsModal={() =>
              setIsToolsModalOpen(true)
            }
            openStageMode={() => {
  const stageMinistration =
    selectedMinistration ||
    ministrations.find(
      m => m.status === 'Upcoming'
    ) ||
    ministrations[0] ||
    null;

  if (!stageMinistration) {
    alert('No ministration is available for Stage Mode yet.');
    return;
  }

  setSelectedMinistration(stageMinistration);
  setIsStageModeOpen(true);
}}
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

               openStageMode={() => {
  const stageMinistration =
    selectedMinistration ||
    ministrations.find(
      m => m.status === 'Upcoming'
    ) ||
    ministrations[0] ||
    null;

  if (!stageMinistration) {
    alert('No ministration is available for Stage Mode yet.');
    return;
  }

  setSelectedMinistration(stageMinistration);
  setIsStageModeOpen(true);
}}
              />

            )}

            {/* SONG BANK */}

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

            {/* MINISTRATIONS */}

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

                openStageMode={() => {
  console.log('STAGE MODE BUTTON CLICKED');
  setIsStageModeOpen(true);
}}
              />

            )}

            {/* MUSIC TEAM */}

            {activeTab === 'team' && (

              <MusicTeamView
                team={team}
                activeRole={activeRole}
                onPhotoSelected={handlePhotoSelected}

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

