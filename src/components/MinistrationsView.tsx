import React, { useEffect, useMemo, useState } from 'react';
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
  Edit3,
  Settings2,
  BookOpen,
  Play,
  Pause,
  Download,
  Volume2,
  Headphones,
  CheckCircle2,
  Circle,
  ChevronRight,
  Save,
  Sparkles,
  ListMusic,
  MoreHorizontal,
  CalendarPlus,
  Pencil,
  RotateCcw
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
  onCreateMinistration: (
    newMin: Omit<Ministration, 'id'>
  ) => void;

  onSelectSong: (song: Song) => void;
  openStageMode: () => void;
}

/* =========================================================
   WEEKLY LEARNING TYPES
========================================================= */

interface WeeklyLearning {
  id: string;
  title: string;
  weekLabel: string;
  description: string;
  songIds: number[];
  updatedAt: string;
}

/* =========================================================
   HELPERS
========================================================= */

const WEEKLY_STORAGE_KEY =
  'jewels_music_hub_weekly_learning_v1';

const getSongAudioUrl = (song: Song): string => {
  const candidate = song as any;

  return (
    candidate.audioUrl ||
    candidate.audioURL ||
    candidate.audio ||
    candidate.audioSrc ||
    candidate.audioSource ||
    candidate.url ||
    ''
  );
};

const createWeeklyId = () =>
  `weekly-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

/* =========================================================
   COMPONENT
========================================================= */

export const MinistrationsView: React.FC<
  MinistrationsViewProps
> = ({
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
  const isMD = activeRole === 'admin_md';

  /* =======================================================
     MINISTRATION STATE
  ======================================================= */

  const [currentMin, setCurrentMin] =
    useState<Ministration | null>(
      selectedMinistration ||
        ministrations[0] ||
        null
    );

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [isEditDetailsOpen, setIsEditDetailsOpen] =
    useState(false);

  const [isAddSongModalOpen, setIsAddSongModalOpen] =
    useState(false);

  const [isEditingBrief, setIsEditingBrief] =
    useState(false);

  const [isEditingMinistration, setIsEditingMinistration] =
    useState(false);

  /* =======================================================
     WEEKLY LEARNING STATE
  ======================================================= */

  const [weeklyLearning, setWeeklyLearning] =
    useState<WeeklyLearning | null>(null);

  const [isWeeklyEditorOpen, setIsWeeklyEditorOpen] =
    useState(false);

  const [weeklyTitle, setWeeklyTitle] =
    useState('This Week\'s Learning');

  const [weeklyWeekLabel, setWeeklyWeekLabel] =
    useState('');

  const [weeklyDescription, setWeeklyDescription] =
    useState('');

  const [isWeeklySongModalOpen, setIsWeeklySongModalOpen] =
    useState(false);

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] =
    useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newStatus, setNewStatus] =
    useState('Upcoming');

  /* =======================================================
     SYNC SELECTED MINISTRATION
  ======================================================= */

  useEffect(() => {
    if (selectedMinistration) {
      setCurrentMin(selectedMinistration);
    }
  }, [selectedMinistration]);

  useEffect(() => {
    if (
      !currentMin &&
      ministrations.length > 0
    ) {
      setCurrentMin(ministrations[0]);
    }
  }, [ministrations, currentMin]);

  /* =======================================================
     LOAD WEEKLY LEARNING
  ======================================================= */

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          WEEKLY_STORAGE_KEY
        );

      if (stored) {
        setWeeklyLearning(
          JSON.parse(stored)
        );
      }
    } catch (error) {
      console.error(
        'Unable to load weekly learning:',
        error
      );
    }
  }, []);

  /* =======================================================
     SAVE WEEKLY LEARNING
  ======================================================= */

  const saveWeeklyLearning = (
    updated: WeeklyLearning
  ) => {
    setWeeklyLearning(updated);

    localStorage.setItem(
      WEEKLY_STORAGE_KEY,
      JSON.stringify(updated)
    );
  };

  /* =======================================================
     VOCAL MEMBERS
  ======================================================= */

  const vocalMembers = team.filter(
    m =>
      m.type === 'vocal' ||
      m.type === 'director'
  );

  /* =======================================================
     CURRENT SONG COUNT
  ======================================================= */

  const assignedLeadsCount =
    currentMin?.songs.filter(
      s => s.lead !== null
    ).length || 0;

  const currentSongCount =
    currentMin?.songs.length || 0;

  const assignmentPercentage =
    currentSongCount > 0
      ? Math.round(
          (assignedLeadsCount /
            currentSongCount) *
            100
        )
      : 0;

  /* =======================================================
     SELECT MINISTRATION
  ======================================================= */

  const selectMinistration = (
    min: Ministration
  ) => {
    setCurrentMin(min);
    onSelectMinistration(min);
  };

  /* =======================================================
     CREATE MINISTRATION
  ======================================================= */

  const handleCreateMinistration = () => {
    if (!isMD) return;

    if (!newName.trim()) {
      alert(
        'Please enter a name for the ministration.'
      );
      return;
    }

    const newMin: Omit<
      Ministration,
      'id'
    > = {
      name: newName.trim(),
      description:
        newDescription.trim(),
      date: newDate,
      time: newTime,
      venue: newVenue.trim(),
      theme: newTheme.trim(),
      status: newStatus,
      songs: [],
      mdGlobalNotes: ''
    };

    onCreateMinistration(newMin);

    setIsCreateModalOpen(false);

    setNewName('');
    setNewDescription('');
    setNewDate('');
    setNewTime('');
    setNewVenue('');
    setNewTheme('');
    setNewStatus('Upcoming');
  };

  /* =======================================================
     OPEN CREATE FORM
  ======================================================= */

  const openCreateForm = () => {
    if (!isMD) return;

    setNewName('');
    setNewDescription('');
    setNewDate('');
    setNewTime('');
    setNewVenue('');
    setNewTheme('');
    setNewStatus('Upcoming');

    setIsCreateModalOpen(true);
  };

  /* =======================================================
     EDIT MINISTRATION
  ======================================================= */

  const saveMinistrationDetails = () => {
    if (!currentMin || !isMD) return;

    const updated = {
      ...currentMin
    };

    onUpdateMinistration(updated);
    setCurrentMin(updated);

    setIsEditDetailsOpen(false);
  };

  /* =======================================================
     UPDATE FIELD DIRECTLY
  ======================================================= */

  const updateCurrentMinField = (
    field: keyof Ministration,
    value: any
  ) => {
    if (!currentMin || !isMD) return;

    const updated = {
      ...currentMin,
      [field]: value
    };

    setCurrentMin(updated);
    onUpdateMinistration(updated);
  };

  /* =======================================================
     ASSIGN LEAD
  ======================================================= */

  const handleAssignLead = (
    songId: number,
    memberId: number | null
  ) => {
    if (!isMD || !currentMin) return;

    const updatedSongs =
      currentMin.songs.map(item => {
        if (item.songId === songId) {
          return {
            ...item,
            lead: memberId
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

  /* =======================================================
     KEY OVERRIDE
  ======================================================= */

  const handleKeyOverride = (
    songId: number,
    newKey: string
  ) => {
    if (!isMD || !currentMin) return;

    const updatedSongs =
      currentMin.songs.map(item => {
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

  /* =======================================================
     NOTE CHANGE
  ======================================================= */

  const handleNoteChange = (
    songId: number,
    note: string
  ) => {
    if (!isMD || !currentMin) return;

    const updatedSongs =
      currentMin.songs.map(item => {
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

  /* =======================================================
     MOVE SONG
  ======================================================= */

  const handleMoveSong = (
    index: number,
    direction: 'up' | 'down'
  ) => {
    if (!isMD || !currentMin) return;

    const newSongs = [
      ...currentMin.songs
    ];

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

    newSongs[index] =
      newSongs[targetIdx];

    newSongs[targetIdx] = temp;

    const updatedMin = {
      ...currentMin,
      songs: newSongs
    };

    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  /* =======================================================
     REMOVE SONG
  ======================================================= */

  const handleRemoveSong = (
    songId: number
  ) => {
    if (!isMD || !currentMin) return;

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

  /* =======================================================
     ADD SONG TO MINISTRATION
  ======================================================= */

  const handleAddSongToMin = (
    songId: number
  ) => {
    if (!currentMin) return;

    if (
      currentMin.songs.some(
        item =>
          item.songId === songId
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
      keyOverride:
        song?.key || 'G',
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

  /* =======================================================
     PRINT
  ======================================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =======================================================
     WEEKLY LEARNING CREATE / EDIT
  ======================================================= */

  const openWeeklyEditor = () => {
    if (!isMD) return;

    if (weeklyLearning) {
      setWeeklyTitle(
        weeklyLearning.title
      );

      setWeeklyWeekLabel(
        weeklyLearning.weekLabel
      );

      setWeeklyDescription(
        weeklyLearning.description
      );
    } else {
      setWeeklyTitle(
        'This Week\'s Learning'
      );

      setWeeklyWeekLabel('');
      setWeeklyDescription('');
    }

    setIsWeeklyEditorOpen(true);
  };

  const saveWeeklyDetails = () => {
    if (!isMD) return;

    const updated: WeeklyLearning = {
      id:
        weeklyLearning?.id ||
        createWeeklyId(),

      title:
        weeklyTitle.trim() ||
        'This Week\'s Learning',

      weekLabel:
        weeklyWeekLabel.trim(),

      description:
        weeklyDescription.trim(),

      songIds:
        weeklyLearning?.songIds ||
        [],

      updatedAt:
        new Date().toISOString()
    };

    saveWeeklyLearning(updated);
    setIsWeeklyEditorOpen(false);
  };

  /* =======================================================
     DELETE WEEKLY LEARNING
  ======================================================= */

  const clearWeeklyLearning = () => {
    if (!isMD) return;

    const confirmed =
      window.confirm(
        'Remove this week\'s learning session?'
      );

    if (!confirmed) return;

    localStorage.removeItem(
      WEEKLY_STORAGE_KEY
    );

    setWeeklyLearning(null);
  };

  /* =======================================================
     ADD SONG TO WEEKLY
  ======================================================= */

  const addSongToWeekly = (
    songId: number
  ) => {
    if (!isMD) return;

    const base =
      weeklyLearning || {
        id: createWeeklyId(),
        title:
          'This Week\'s Learning',
        weekLabel: '',
        description: '',
        songIds: [],
        updatedAt:
          new Date().toISOString()
      };

    if (
      base.songIds.includes(songId)
    ) {
      return;
    }

    saveWeeklyLearning({
      ...base,
      songIds: [
        ...base.songIds,
        songId
      ],
      updatedAt:
        new Date().toISOString()
    });
  };

  /* =======================================================
     REMOVE WEEKLY SONG
  ======================================================= */

  const removeWeeklySong = (
    songId: number
  ) => {
    if (!isMD || !weeklyLearning)
      return;

    saveWeeklyLearning({
      ...weeklyLearning,
      songIds:
        weeklyLearning.songIds.filter(
          id => id !== songId
        ),
      updatedAt:
        new Date().toISOString()
    });
  };

  /* =======================================================
     MOVE WEEKLY SONG
  ======================================================= */

  const moveWeeklySong = (
    index: number,
    direction: 'up' | 'down'
  ) => {
    if (!isMD || !weeklyLearning)
      return;

    const ids = [
      ...weeklyLearning.songIds
    ];

    const target =
      direction === 'up'
        ? index - 1
        : index + 1;

    if (
      target < 0 ||
      target >= ids.length
    ) {
      return;
    }

    const temp = ids[index];

    ids[index] = ids[target];
    ids[target] = temp;

    saveWeeklyLearning({
      ...weeklyLearning,
      songIds: ids,
      updatedAt:
        new Date().toISOString()
    });
  };

  /* =======================================================
     RENDER EMPTY STATE
  ======================================================= */

  if (!currentMin) {
    return (
      <div className="w-full space-y-7 animate-in fade-in duration-300">

        <section className="rounded-[30px] border border-white/10 bg-[#0d0d0f]/95 p-6 sm:p-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-xl bg-[#007aff]/10 border border-[#007aff]/20 flex items-center justify-center">
                  <Music2 className="w-4 h-4 text-[#4da3ff]" />
                </span>

                <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-[#4da3ff]">
                  Ministry Services
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ministrations
              </h1>

              <p className="text-sm text-white/40 mt-3 max-w-xl">
                Create and organize every ministry
                service, rehearsal set and
                performance.
              </p>
            </div>

            {isMD && (
              <button
                onClick={openCreateForm}
                className="px-5 py-3 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Ministration
              </button>
            )}

          </div>

          <div className="mt-10 text-center py-16 border border-dashed border-white/10 rounded-[28px]">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.035] border border-white/10 flex items-center justify-center mb-4">
              <CalendarPlus className="w-7 h-7 text-white/30" />
            </div>

            <h3 className="text-sm font-bold text-white">
              No ministrations yet
            </h3>

            <p className="text-xs text-white/30 mt-2">
              Create the first ministration
              for the ministry.
            </p>

            {isMD && (
              <button
                onClick={openCreateForm}
                className="mt-5 px-4 py-2.5 rounded-xl bg-[#007aff] text-white text-xs font-bold"
              >
                Create First Ministration
              </button>
            )}

          </div>

        </section>

        {isCreateModalOpen &&
          renderCreateModal()}

      </div>
    );
  }

  /* =======================================================
     MAIN RENDER
  ======================================================= */

  return (
    <div className="w-full min-w-0 max-w-full space-y-7 animate-in fade-in duration-300">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0d0d0f]/95 p-5 sm:p-7 lg:p-8 shadow-2xl shadow-black/20">

        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#007aff]/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">

              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff] bg-[#007aff]/10 border border-[#007aff]/20 px-3 py-1.5 rounded-full">
                <Music2 className="w-3 h-3" />
                Ministry Services
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/25">
                Performance Management
              </span>

            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-[-0.03em]">
              Ministrations
            </h1>

            <p className="text-sm sm:text-[15px] text-white/40 mt-3 max-w-2xl leading-relaxed">
              Plan services, organize setlists,
              prepare the ministry team and
              keep everyone ready for
              performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            {isMD && (
              <button
                onClick={openCreateForm}
                className="px-4 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                New Ministration
              </button>
            )}

            <div className="px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.035] flex items-center gap-3">

              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isMD
                    ? 'bg-[#007aff] shadow-[0_0_15px_rgba(0,122,255,.6)]'
                    : 'bg-white/30'
                }`}
              />

              <div>
                <p className="text-[8px] uppercase tracking-[0.16em] text-white/25 font-extrabold">
                  Access
                </p>

                <p className="text-xs font-bold text-white mt-0.5">
                  {isMD
                    ? 'Admin / MD Control'
                    : 'Member View'}
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MINISTRATION CARDS
      ====================================================== */}

      <section>

        <div className="flex items-end justify-between mb-4">

          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] font-extrabold text-[#4da3ff]">
              Your Ministry Calendar
            </p>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Upcoming Ministrations
            </h2>
          </div>

          <span className="text-[10px] font-bold text-white/30">
            {ministrations.length} events
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {ministrations.map(min => {

            const ready =
              min.songs.length > 0 &&
              min.songs.every(
                song =>
                  song.lead !== null
              );

            const percentage =
              min.songs.length > 0
                ? Math.round(
                    (min.songs.filter(
                      song =>
                        song.lead !== null
                    ).length /
                      min.songs.length) *
                      100
                  )
                : 0;

            return (
              <button
                key={min.id}
                onClick={() =>
                  selectMinistration(min)
                }
                className={`text-left group rounded-[26px] border p-5 transition-all duration-200 ${
                  currentMin.id === min.id
                    ? 'border-[#007aff]/40 bg-[#007aff]/[0.08] shadow-xl shadow-blue-500/[0.08]'
                    : 'border-white/10 bg-[#111113]/90 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <span className="inline-flex text-[8px] uppercase tracking-[0.15em] font-extrabold px-2 py-1 rounded-lg bg-white/[0.05] text-white/40 border border-white/[0.07]">
                      {min.status}
                    </span>

                    <h3 className="text-base font-extrabold text-white mt-3 truncate">
                      {min.name}
                    </h3>

                  </div>

                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      currentMin.id === min.id
                        ? 'text-[#4da3ff] translate-x-0.5'
                        : 'text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5'
                    }`}
                  />

                </div>

                <div className="mt-4 space-y-2">

                  <div className="flex items-center gap-2 text-[11px] text-white/35">
                    <Calendar className="w-3.5 h-3.5 text-[#4da3ff]" />
                    {min.date || 'Date not set'}
                  </div>

                  {min.time && (
                    <div className="flex items-center gap-2 text-[11px] text-white/35">
                      <Clock className="w-3.5 h-3.5 text-[#4da3ff]" />
                      {min.time}
                    </div>
                  )}

                  {min.venue && (
                    <div className="flex items-center gap-2 text-[11px] text-white/35 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">
                        {min.venue}
                      </span>
                    </div>
                  )}

                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.07]">

                  <div className="flex items-center justify-between">

                    <span className="text-[9px] uppercase tracking-[0.14em] font-extrabold text-white/25">
                      Setlist
                    </span>

                    <span className="text-xs font-extrabold text-white">
                      {min.songs.length}{' '}
                      <span className="text-white/25 font-medium">
                        songs
                      </span>
                    </span>

                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#007aff] transition-all"
                      style={{
                        width: `${percentage}%`
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-2">

                    <span className="text-[9px] text-white/25">
                      {percentage}% leads assigned
                    </span>

                    <span
                      className={`text-[9px] font-bold ${
                        ready
                          ? 'text-emerald-400'
                          : 'text-white/25'
                      }`}
                    >
                      {ready
                        ? 'Ready'
                        : 'In preparation'}
                    </span>

                  </div>

                </div>

              </button>
            );
          })}

        </div>

      </section>

      {/* =====================================================
          WEEKLY LEARNING
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111113]/95 p-5 sm:p-7 shadow-2xl shadow-black/20">

        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-purple-500/[0.06] blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 rounded-2xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center text-purple-300 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <span className="text-[9px] uppercase tracking-[0.18em] font-extrabold text-purple-300">
                  Weekly Learning
                </span>

                <Sparkles className="w-3.5 h-3.5 text-purple-300" />

              </div>

              <h2 className="text-xl font-extrabold text-white mt-1">
                {weeklyLearning?.title ||
                  'This Week\'s Learning'}
              </h2>

              <p className="text-xs text-white/30 mt-1.5 max-w-xl">
                {weeklyLearning?.description ||
                  'Songs selected for members to learn, listen to and prepare throughout the week.'}
              </p>

              {weeklyLearning?.weekLabel && (
                <p className="text-[10px] text-purple-300/70 font-bold mt-2">
                  {weeklyLearning.weekLabel}
                </p>
              )}

            </div>

          </div>

          {isMD && (
            <div className="flex flex-wrap gap-2">

              <button
                onClick={() =>
                  setIsWeeklySongModalOpen(
                    true
                  )
                }
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.035] hover:bg-white/[0.07] text-white text-xs font-bold flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Songs
              </button>

              <button
                onClick={openWeeklyEditor}
                className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold flex items-center gap-2"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Week
              </button>

            </div>
          )}

        </div>

        {/* WEEKLY SONGS */}

        {weeklyLearning &&
        weeklyLearning.songIds.length > 0 ? (

          <div className="relative mt-6 space-y-3">

            {weeklyLearning.songIds.map(
              (songId, index) => {

                const song =
                  songs.find(
                    s => s.id === songId
                  );

                if (!song) return null;

                const audioUrl =
                  getSongAudioUrl(song);

                return (
                  <WeeklySongCard
                    key={song.id}
                    song={song}
                    index={index}
                    audioUrl={audioUrl}
                    isMD={isMD}
                    onRemove={() =>
                      removeWeeklySong(
                        song.id
                      )
                    }
                    onMoveUp={() =>
                      moveWeeklySong(
                        index,
                        'up'
                      )
                    }
                    onMoveDown={() =>
                      moveWeeklySong(
                        index,
                        'down'
                      )
                    }
                    onSelectSong={() =>
                      onSelectSong(song)
                    }
                  />
                );
              }
            )}

          </div>

        ) : (

          <div className="relative mt-6 py-12 text-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.015]">

            <Headphones className="w-8 h-8 text-white/15 mx-auto mb-3" />

            <p className="text-sm font-bold text-white">
              No weekly songs yet
            </p>

            <p className="text-xs text-white/25 mt-1">
              {isMD
                ? 'Add songs from the Song Bank for members to learn this week.'
                : 'The Music Director has not published this week\'s songs yet.'}
            </p>

            {isMD && (
              <button
                onClick={() =>
                  setIsWeeklySongModalOpen(
                    true
                  )
                }
                className="mt-5 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Weekly Songs
              </button>
            )}

          </div>

        )}

      </section>

      {/* =====================================================
          CURRENT MINISTRATION HEADER
      ====================================================== */}

      <section className="rounded-[30px] border border-white/10 bg-[#111113]/95 p-5 sm:p-7 shadow-2xl shadow-black/20">

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2 mb-3">

              <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#4da3ff] bg-[#007aff]/10 border border-[#007aff]/20 px-2.5 py-1.5 rounded-full">
                {currentMin.status}
              </span>

              {currentMin.theme && (
                <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-full">
                  {currentMin.theme}
                </span>
              )}

            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentMin.name}
            </h2>

            <p className="text-sm text-white/35 mt-2 max-w-2xl">
              {currentMin.description ||
                'No description has been added for this ministration.'}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 mt-4 text-xs text-white/35 font-semibold">

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#4da3ff]" />
                {currentMin.date ||
                  'Date not set'}
              </div>

              {currentMin.time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#4da3ff]" />
                  {currentMin.time}
                </div>
              )}

              {currentMin.venue && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {currentMin.venue}
                </div>
              )}

            </div>

          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">

            {isMD && (
              <button
                onClick={() =>
                  setIsEditDetailsOpen(
                    true
                  )
                }
                className="px-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.035] hover:bg-white/[0.08] text-white text-xs font-bold flex items-center gap-2"
              >
                <Pencil className="w-3.5 h-3.5 text-[#4da3ff]" />
                Edit Details
              </button>
            )}

            <button
              onClick={openStageMode}
              className="px-4 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-2 shadow-xl shadow-blue-500/20"
            >
              <Radio className="w-4 h-4" />
              Stage Mode
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-2xl border border-white/10 bg-white/[0.035] hover:bg-white/[0.08] text-white/50 hover:text-white text-xs font-bold flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">
                Print
              </span>
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          PREPARATION STATS
      ====================================================== */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <PreparationCard
          icon={
            <ListMusic className="w-5 h-5" />
          }
          label="Setlist"
          value={String(currentSongCount).padStart(2, '0')}
          description="Songs prepared"
          progress={
            currentSongCount > 0
              ? 100
              : 0
          }
        />

        <PreparationCard
          icon={
            <Mic2 className="w-5 h-5" />
          }
          label="Lead Assignments"
          value={`${assignedLeadsCount}/${currentSongCount}`}
          description={
            currentSongCount > 0
              ? `${assignmentPercentage}% complete`
              : 'No songs assigned'
          }
          progress={
            assignmentPercentage
          }
        />

        <PreparationCard
          icon={
            <CheckCircle2 className="w-5 h-5" />
          }
          label="Preparation"
          value={
            currentSongCount > 0 &&
            assignmentPercentage === 100
              ? 'READY'
              : 'IN PROGRESS'
          }
          description={
            currentSongCount > 0 &&
            assignmentPercentage === 100
              ? 'Setlist ready for rehearsal'
              : 'Complete remaining assignments'
          }
          progress={
            assignmentPercentage
          }
        />

      </section>

      {/* =====================================================
          SETLIST
      ====================================================== */}

      <section className="rounded-[30px] border border-white/10 bg-[#111113]/95 p-4 sm:p-6 lg:p-7">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

          <div>

            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-xl bg-[#007aff]/10 border border-[#007aff]/20 flex items-center justify-center">
                <Music2 className="w-4 h-4 text-[#4da3ff]" />
              </div>

              <h3 className="text-lg font-extrabold text-white">
                Setlist
              </h3>

            </div>

            <p className="text-xs text-white/25 mt-2">
              Arrange songs, assign vocalists,
              set performance keys and prepare
              transitions.
            </p>

          </div>

          {isMD && (
            <button
              onClick={() =>
                setIsAddSongModalOpen(
                  true
                )
              }
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.035] hover:bg-white/[0.08] text-white text-xs font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#4da3ff]" />
              Add Song
            </button>
          )}

        </div>

        {currentMin.songs.length > 0 ? (

          <div className="space-y-3">

            {currentMin.songs.map(
              (item, index) => {

                const song =
                  songs.find(
                    s =>
                      s.id ===
                      item.songId
                  );

                const leadMember =
                  team.find(
                    m =>
                      m.id ===
                      item.lead
                  );

                if (!song) return null;

                const effectiveKey =
                  item.keyOverride ||
                  song.key;

                return (
                  <article
                    key={`${item.songId}-${index}`}
                    className="rounded-[24px] border border-white/10 bg-white/[0.025] hover:bg-white/[0.04] p-4 sm:p-5 transition-all"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="flex items-center gap-1">

                          <span className="w-9 h-9 rounded-xl bg-[#007aff]/10 border border-[#007aff]/20 text-[#4da3ff] text-[10px] font-extrabold flex items-center justify-center">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              '0'
                            )}
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
                                  index ===
                                  0
                                }
                                className="text-white/20 hover:text-[#4da3ff] disabled:opacity-10"
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
                                className="text-white/20 hover:text-[#4da3ff] disabled:opacity-10"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>

                            </div>
                          )}

                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <button
                              onClick={() =>
                                onSelectSong(
                                  song
                                )
                              }
                              className="text-sm sm:text-base font-bold text-white hover:text-[#4da3ff] truncate text-left"
                            >
                              {song.title}
                            </button>

                            <span className="text-[8px] uppercase tracking-[0.12em] font-extrabold text-[#4da3ff] bg-[#007aff]/10 border border-[#007aff]/20 px-2 py-1 rounded-lg">
                              {song.category}
                            </span>

                          </div>

                          <p className="text-[10px] text-white/25 mt-1">
                            {song.artist} •{' '}
                            {song.tempo}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-2">

                        <button
                          onClick={() =>
                            onSelectSong(
                              song
                            )
                          }
                          className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.07] text-[#4da3ff] text-[10px] font-bold"
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
                            className="w-9 h-9 rounded-xl border border-white/10 text-white/25 hover:text-red-300 hover:bg-red-500/10 flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                      </div>

                    </div>

                    <div className="mt-4 p-3.5 rounded-2xl bg-black/25 border border-white/[0.06] grid grid-cols-1 md:grid-cols-12 gap-4">

                      <div className="md:col-span-5">

                        <label className="text-[8px] uppercase tracking-[0.16em] font-extrabold text-amber-300">
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
                                e.target
                                  .value
                                  ? Number(
                                      e
                                        .target
                                        .value
                                    )
                                  : null
                              )
                            }
                            className="mt-2 w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none"
                          >

                            <option value="">
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
                                >
                                  {
                                    vm.name
                                  }{' '}
                                  (
                                  {vm.voicePart ||
                                    vm.role}
                                  )
                                </option>
                              )
                            )}

                          </select>
                        ) : (
                          <p className="text-xs font-bold text-white mt-2">
                            {leadMember?.name ||
                              'Pending MD Assignment'}
                          </p>
                        )}

                      </div>

                      <div className="md:col-span-3">

                        <label className="text-[8px] uppercase tracking-[0.16em] font-extrabold text-[#4da3ff]">
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
                                e.target
                                  .value
                              )
                            }
                            className="mt-2 w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-[#4da3ff] outline-none"
                          >
                            {CHROMATIC_KEYS.map(
                              k => (
                                <option
                                  key={k}
                                  value={k}
                                >
                                  {k}{' '}
                                  Major
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          <p className="text-xs font-extrabold text-[#4da3ff] mt-2">
                            Key of{' '}
                            {
                              effectiveKey
                            }
                          </p>
                        )}

                      </div>

                      <div className="md:col-span-4">

                        <label className="text-[8px] uppercase tracking-[0.16em] font-extrabold text-white/25">
                          Transition Cue
                        </label>

                        {isMD ? (
                          <input
                            value={
                              item.orderNote ||
                              ''
                            }
                            onChange={e =>
                              handleNoteChange(
                                item.songId,
                                e.target
                                  .value
                              )
                            }
                            placeholder="Transition instruction..."
                            className="mt-2 w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                          />
                        ) : (
                          <p className="text-xs text-white/35 mt-2">
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

          <div className="py-16 text-center border border-dashed border-white/10 rounded-[26px]">

            <Music2 className="w-8 h-8 text-white/15 mx-auto mb-3" />

            <p className="text-sm font-bold text-white">
              No songs in this setlist
            </p>

            <p className="text-xs text-white/25 mt-1">
              Build the performance repertoire
              from the Song Bank.
            </p>

            {isMD && (
              <button
                onClick={() =>
                  setIsAddSongModalOpen(
                    true
                  )
                }
                className="mt-5 px-4 py-2.5 rounded-xl bg-[#007aff] text-white text-xs font-bold"
              >
                Add Songs
              </button>
            )}

          </div>

        )}

      </section>

      {/* =====================================================
          MINISTRY BRIEF
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[30px] border border-amber-500/15 bg-amber-500/[0.045] p-5 sm:p-7">

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-300">
              <Edit3 className="w-5 h-5" />
            </div>

            <div>

              <span className="text-[9px] uppercase tracking-[0.18em] font-extrabold text-amber-300">
                Ministry Brief
              </span>

              <h3 className="text-lg font-extrabold text-white mt-1">
                Instructions for this ministration
              </h3>

            </div>

          </div>

          {isMD && (
            <button
              onClick={() =>
                setIsEditingBrief(
                  !isEditingBrief
                )
              }
              className="px-3.5 py-2 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300 text-[10px] font-bold"
            >
              {isEditingBrief
                ? 'Done'
                : 'Edit Brief'}
            </button>
          )}

        </div>

        <div className="mt-5">

          {isEditingBrief &&
          isMD ? (
            <textarea
              rows={5}
              value={
                currentMin.mdGlobalNotes ||
                ''
              }
              onChange={e =>
                updateCurrentMinField(
                  'mdGlobalNotes',
                  e.target.value
                )
              }
              placeholder="Arrival time, dress code, sound check, instruments, prayer, special instructions..."
              className="w-full bg-black/25 border border-amber-500/20 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 outline-none"
            />
          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-5">

              <div className="space-y-3">

                <BriefItem
                  label="Arrival"
                  value="As instructed by MD"
                />

                <BriefItem
                  label="Dress"
                  value="Ministry standard"
                />

              </div>

              <div className="rounded-2xl border border-amber-500/10 bg-black/20 p-4">

                <p className="text-[8px] uppercase tracking-[0.16em] font-extrabold text-amber-300/50 mb-2">
                  Important Instructions
                </p>

                <p className="text-sm text-amber-100/55 leading-relaxed whitespace-pre-wrap">
                  {currentMin.mdGlobalNotes ||
                    'No special instructions have been added for this ministration yet.'}
                </p>

              </div>

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="pt-5 pb-8 border-t border-white/[0.06] text-center">

        <div className="flex items-center justify-center gap-2">

          <Music2 className="w-3.5 h-3.5 text-[#4da3ff]" />

          <span className="text-[10px] font-extrabold tracking-[0.18em] text-white/30 uppercase">
            Jewels Music Hub
          </span>

        </div>

        <p className="text-[9px] text-white/15 mt-2 tracking-[0.12em]">
          MUSIC • EXCELLENCE • SERVICE
        </p>

        <p className="text-[9px] text-white/15 mt-1">
          Jewels Music Ministry Portal
        </p>

      </footer>

      {/* =====================================================
          MODALS
      ====================================================== */}

      {isCreateModalOpen &&
        renderCreateModal()}

      {isEditDetailsOpen &&
        currentMin &&
        renderEditDetailsModal()}

      {isAddSongModalOpen &&
        renderAddSongModal()}

      {isWeeklyEditorOpen &&
        renderWeeklyEditorModal()}

      {isWeeklySongModalOpen &&
        renderWeeklySongModal()}

    </div>
  );

  /* =========================================================
     CREATE MODAL
  ========================================================= */

  function renderCreateModal() {
    return (
      <ModalShell
        onClose={() =>
          setIsCreateModalOpen(false)
        }
      >

        <ModalHeader
          eyebrow="New Ministry Event"
          title="Create Ministration"
          icon={
            <CalendarPlus className="w-4 h-4" />
          }
          onClose={() =>
            setIsCreateModalOpen(false)
          }
        />

        <div className="p-5 space-y-4 overflow-y-auto">

          <FormField
            label="Ministration Name"
            value={newName}
            onChange={setNewName}
            placeholder="e.g. Sunday Service"
          />

          <FormTextarea
            label="Description"
            value={newDescription}
            onChange={setNewDescription}
            placeholder="Describe the ministration..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <FormField
              label="Date"
              type="text"
              value={newDate}
              onChange={setNewDate}
              placeholder="Sunday, 4th October 2026"
            />

            <FormField
              label="Time"
              value={newTime}
              onChange={setNewTime}
              placeholder="9:00 AM GMT"
            />

          </div>

          <FormField
            label="Venue"
            value={newVenue}
            onChange={setNewVenue}
            placeholder="Main Worship Auditorium"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <FormField
              label="Theme"
              value={newTheme}
              onChange={setNewTheme}
              placeholder="Optional"
            />

            <div>

              <label className="text-[9px] uppercase tracking-[0.15em] font-extrabold text-white/30">
                Status
              </label>

              <select
                value={newStatus}
                onChange={e =>
                  setNewStatus(
                    e.target.value
                  )
                }
                className="mt-2 w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-3 py-3 text-xs font-bold text-white outline-none"
              >
                <option>
                  Upcoming
                </option>
                <option>
                  Rehearsing
                </option>
                <option>
                  Active
                </option>
                <option>
                  Completed
                </option>
              </select>

            </div>

          </div>

        </div>

        <ModalFooter
          onCancel={() =>
            setIsCreateModalOpen(false)
          }
          onSave={
            handleCreateMinistration
          }
          saveText="Create Ministration"
        />

      </ModalShell>
    );
  }

  /* =========================================================
     EDIT DETAILS MODAL
  ========================================================= */

  function renderEditDetailsModal() {
    if (!currentMin) return null;

    return (
      <ModalShell
        onClose={() =>
          setIsEditDetailsOpen(false)
        }
      >

        <ModalHeader
          eyebrow="Ministration Settings"
          title="Edit Event Details"
          icon={
            <Settings2 className="w-4 h-4" />
          }
          onClose={() =>
            setIsEditDetailsOpen(false)
          }
        />

        <div className="p-5 space-y-4 overflow-y-auto">

          <FormField
            label="Ministration Name"
            value={
              currentMin.name
            }
            onChange={value =>
              updateCurrentMinField(
                'name',
                value
              )
            }
          />

          <FormTextarea
            label="Description"
            value={
              currentMin.description ||
              ''
            }
            onChange={value =>
              updateCurrentMinField(
                'description',
                value
              )
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <FormField
              label="Date"
              value={
                currentMin.date ||
                ''
              }
              onChange={value =>
                updateCurrentMinField(
                  'date',
                  value
                )
              }
            />

            <FormField
              label="Time"
              value={
                currentMin.time ||
                ''
              }
              onChange={value =>
                updateCurrentMinField(
                  'time',
                  value
                )
              }
            />

          </div>

          <FormField
            label="Venue"
            value={
              currentMin.venue ||
              ''
            }
            onChange={value =>
              updateCurrentMinField(
                'venue',
                value
              )
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <FormField
              label="Theme"
              value={
                currentMin.theme ||
                ''
              }
              onChange={value =>
                updateCurrentMinField(
                  'theme',
                  value
                )
              }
            />

            <div>

              <label className="text-[9px] uppercase tracking-[0.15em] font-extrabold text-white/30">
                Status
              </label>

              <select
                value={
                  currentMin.status
                }
                onChange={e =>
                  updateCurrentMinField(
                    'status',
                    e.target.value
                  )
                }
                className="mt-2 w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-3 py-3 text-xs font-bold text-white outline-none"
              >
                <option>
                  Upcoming
                </option>
                <option>
                  Rehearsing
                </option>
                <option>
                  Active
                </option>
                <option>
                  Completed
                </option>
              </select>

            </div>

          </div>

        </div>

        <ModalFooter
          onCancel={() =>
            setIsEditDetailsOpen(false)
          }
          onSave={
            saveMinistrationDetails
          }
          saveText="Save Changes"
        />

      </ModalShell>
    );
  }

  /* =========================================================
     ADD SONG MODAL
  ========================================================= */

  function renderAddSongModal() {
    return (
      <ModalShell
        onClose={() =>
          setIsAddSongModalOpen(false)
        }
      >

        <ModalHeader
          eyebrow="Song Bank"
          title="Add Song to Setlist"
          icon={
            <Music2 className="w-4 h-4" />
          }
          onClose={() =>
            setIsAddSongModalOpen(false)
          }
        />

        <div className="p-4 overflow-y-auto max-h-[65vh] space-y-2">

          {songs.map(song => {

            const exists =
              currentMin?.songs.some(
                item =>
                  item.songId ===
                  song.id
              );

            return (
              <div
                key={song.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  exists
                    ? 'opacity-40 border-white/[0.05] bg-white/[0.01]'
                    : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.05]'
                }`}
              >

                <div className="min-w-0">

                  <p className="text-xs font-bold text-white truncate">
                    {song.title}
                  </p>

                  <p className="text-[10px] text-white/25 mt-1 truncate">
                    {song.artist} • Key:{' '}
                    {song.key} •{' '}
                    {song.category}
                  </p>

                </div>

                <button
                  disabled={exists}
                  onClick={() =>
                    handleAddSongToMin(
                      song.id
                    )
                  }
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold ${
                    exists
                      ? 'bg-white/[0.04] text-white/20'
                      : 'bg-[#007aff] text-white'
                  }`}
                >
                  {exists
                    ? 'Added'
                    : '+ Add'}
                </button>

              </div>
            );
          })}

        </div>

      </ModalShell>
    );
  }

  /* =========================================================
     WEEKLY EDITOR
  ========================================================= */

  function renderWeeklyEditorModal() {
    return (
      <ModalShell
        onClose={() =>
          setIsWeeklyEditorOpen(false)
        }
      >

        <ModalHeader
          eyebrow="Weekly Learning"
          title="Configure This Week"
          icon={
            <BookOpen className="w-4 h-4" />
          }
          onClose={() =>
            setIsWeeklyEditorOpen(false)
          }
        />

        <div className="p-5 space-y-4">

          <FormField
            label="Title"
            value={weeklyTitle}
            onChange={setWeeklyTitle}
            placeholder="This Week's Learning"
          />

          <FormField
            label="Week"
            value={weeklyWeekLabel}
            onChange={setWeeklyWeekLabel}
            placeholder="October 1 – October 7, 2026"
          />

          <FormTextarea
            label="Instructions"
            value={weeklyDescription}
            onChange={setWeeklyDescription}
            placeholder="Tell members what they should prepare this week..."
          />

        </div>

        <div className="p-5 border-t border-white/[0.07] flex justify-between gap-2">

          {weeklyLearning && (
            <button
              onClick={clearWeeklyLearning}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:bg-red-500/10"
            >
              Remove Week
            </button>
          )}

          <div className="flex gap-2 ml-auto">

            <button
              onClick={() =>
                setIsWeeklyEditorOpen(
                  false
                )
              }
              className="px-4 py-2.5 rounded-xl border border-white/10 text-white/50 text-xs font-bold"
            >
              Cancel
            </button>

            <button
              onClick={
                saveWeeklyDetails
              }
              className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              Save Week
            </button>

          </div>

        </div>

      </ModalShell>
    );
  }

  /* =========================================================
     WEEKLY SONG MODAL
  ========================================================= */

  function renderWeeklySongModal() {
    const weeklyIds =
      weeklyLearning?.songIds ||
      [];

    return (
      <ModalShell
        onClose={() =>
          setIsWeeklySongModalOpen(
            false
          )
        }
      >

        <ModalHeader
          eyebrow="Weekly Learning"
          title="Select Songs"
          icon={
            <Headphones className="w-4 h-4" />
          }
          onClose={() =>
            setIsWeeklySongModalOpen(
              false
            )
          }
        />

        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-2">

          {songs.map(song => {

            const added =
              weeklyIds.includes(
                song.id
              );

            const audio =
              getSongAudioUrl(song);

            return (
              <div
                key={song.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                  added
                    ? 'border-purple-500/20 bg-purple-500/[0.05]'
                    : 'border-white/10 bg-white/[0.025]'
                }`}
              >

                <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-white/30">
                  <Music2 className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-xs font-bold text-white truncate">
                    {song.title}
                  </p>

                  <p className="text-[10px] text-white/25 mt-1 truncate">
                    {song.artist} •{' '}
                    Key {song.key}
                  </p>

                  {audio && (
                    <span className="text-[8px] text-emerald-400 font-bold">
                      AUDIO AVAILABLE
                    </span>
                  )}

                </div>

                <button
                  onClick={() =>
                    added
                      ? removeWeeklySong(
                          song.id
                        )
                      : addSongToWeekly(
                          song.id
                        )
                  }
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold ${
                    added
                      ? 'bg-purple-500/10 text-purple-300'
                      : 'bg-[#007aff] text-white'
                  }`}
                >
                  {added
                    ? 'Added'
                    : '+ Add'}
                </button>

              </div>
            );
          })}

        </div>

      </ModalShell>
    );
  }
};

/* ===========================================================
   WEEKLY SONG CARD
=========================================================== */

interface WeeklySongCardProps {
  song: Song;
  index: number;
  audioUrl: string;
  isMD: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSelectSong: () => void;
}

const WeeklySongCard: React.FC<
  WeeklySongCardProps
> = ({
  song,
  index,
  audioUrl,
  isMD,
  onRemove,
  onMoveUp,
  onMoveDown,
  onSelectSong
}) => {
  const [isPlaying, setIsPlaying] =
    useState(false);

  const audioRef =
    React.useRef<HTMLAudioElement | null>(
      null
    );

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <article className="rounded-[24px] border border-white/10 bg-white/[0.025] hover:bg-white/[0.04] p-4 transition-all">

      <div className="flex flex-col lg:flex-row lg:items-center gap-4">

        <div className="flex items-center gap-3 min-w-0 flex-1">

          <div className="flex items-center gap-1">

            <span className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-extrabold flex items-center justify-center">
              {String(
                index + 1
              ).padStart(2, '0')}
            </span>

            {isMD && (
              <div className="flex flex-col">

                <button
                  onClick={
                    onMoveUp
                  }
                  disabled={
                    index === 0
                  }
                  className="text-white/20 hover:text-purple-300 disabled:opacity-10"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>

                <button
                  onClick={
                    onMoveDown
                  }
                  className="text-white/20 hover:text-purple-300"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>

              </div>
            )}

          </div>

          <div className="min-w-0">

            <button
              onClick={
                onSelectSong
              }
              className="text-sm font-bold text-white hover:text-purple-300 truncate text-left"
            >
              {song.title}
            </button>

            <p className="text-[10px] text-white/25 mt-1">
              {song.artist} •{' '}
              Key {song.key}
            </p>

          </div>

        </div>

        {/* AUDIO */}

        <div className="flex items-center gap-2 flex-wrap">

          {audioUrl ? (

            <>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                preload="none"
                onPlay={() =>
                  setIsPlaying(true)
                }
                onPause={() =>
                  setIsPlaying(false)
                }
                onEnded={() =>
                  setIsPlaying(false)
                }
                className="h-9 max-w-[320px]"
              />

              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-xl bg-purple-500 hover:bg-purple-400 text-white flex items-center justify-center"
                title={
                  isPlaying
                    ? 'Pause'
                    : 'Play'
                }
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
              </button>

              <a
                href={audioUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.035] hover:bg-white/[0.08] text-white/50 hover:text-white flex items-center justify-center"
                title="Download audio"
              >
                <Download className="w-4 h-4" />
              </a>
            </>

          ) : (

            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-white/20 border border-white/[0.06] px-3 py-2 rounded-xl">
              <Volume2 className="w-3.5 h-3.5" />
              Audio not available
            </span>

          )}

          {isMD && (
            <button
              onClick={
                onRemove
              }
              className="w-9 h-9 rounded-xl border border-white/10 text-white/25 hover:text-red-300 hover:bg-red-500/10 flex items-center justify-center"
              title="Remove from weekly learning"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>

    </article>
  );
};

/* ===========================================================
   PREPARATION CARD
=========================================================== */

const PreparationCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  progress: number;
}> = ({
  icon,
  label,
  value,
  description,
  progress
}) => (
  <div className="rounded-[24px] border border-white/10 bg-[#111113]/95 p-5">

    <div className="flex items-start justify-between">

      <div>

        <p className="text-[8px] uppercase tracking-[0.17em] font-extrabold text-white/25">
          {label}
        </p>

        <p className="text-2xl font-extrabold text-white mt-2 tracking-tight">
          {value}
        </p>

      </div>

      <div className="w-10 h-10 rounded-xl bg-[#007aff]/10 border border-[#007aff]/15 text-[#4da3ff] flex items-center justify-center">
        {icon}
      </div>

    </div>

    <p className="text-[10px] text-white/25 mt-2">
      {description}
    </p>

    <div className="mt-4 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">

      <div
        className="h-full rounded-full bg-[#007aff] transition-all"
        style={{
          width: `${Math.min(
            Math.max(progress, 0),
            100
          )}%`
        }}
      />

    </div>

  </div>
);

/* ===========================================================
   BRIEF ITEM
=========================================================== */

const BriefItem: React.FC<{
  label: string;
  value: string;
}> = ({
  label,
  value
}) => (
  <div className="rounded-xl border border-amber-500/10 bg-black/15 p-3">

    <p className="text-[8px] uppercase tracking-[0.15em] font-extrabold text-amber-300/40">
      {label}
    </p>

    <p className="text-xs font-bold text-white/60 mt-1">
      {value}
    </p>

  </div>
);

/* ===========================================================
   MODAL SHELL
=========================================================== */

const ModalShell: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
}> = ({
  children,
  onClose
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl">

    <div className="w-full max-w-xl max-h-[90vh] overflow-hidden rounded-[28px] border border-white/10 bg-[#101012] shadow-2xl flex flex-col">

      {children}

    </div>

  </div>
);

/* ===========================================================
   MODAL HEADER
=========================================================== */

const ModalHeader: React.FC<{
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
}> = ({
  eyebrow,
  title,
  icon,
  onClose
}) => (
  <div className="p-5 border-b border-white/[0.07] flex items-center justify-between gap-4">

    <div className="flex items-center gap-3">

      <div className="w-9 h-9 rounded-xl bg-[#007aff]/10 border border-[#007aff]/20 text-[#4da3ff] flex items-center justify-center">
        {icon}
      </div>

      <div>

        <p className="text-[8px] uppercase tracking-[0.18em] font-extrabold text-[#4da3ff]">
          {eyebrow}
        </p>

        <h3 className="text-base font-extrabold text-white mt-1">
          {title}
        </h3>

      </div>

    </div>

    <button
      onClick={onClose}
      className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.035] text-white/35 hover:text-white flex items-center justify-center"
    >
      <X className="w-4 h-4" />
    </button>

  </div>
);

/* ===========================================================
   MODAL FOOTER
=========================================================== */

const ModalFooter: React.FC<{
  onCancel: () => void;
  onSave: () => void;
  saveText: string;
}> = ({
  onCancel,
  onSave,
  saveText
}) => (
  <div className="p-5 border-t border-white/[0.07] flex justify-end gap-2">

    <button
      onClick={onCancel}
      className="px-4 py-2.5 rounded-xl border border-white/10 text-white/45 hover:text-white text-xs font-bold"
    >
      Cancel
    </button>

    <button
      onClick={onSave}
      className="px-4 py-2.5 rounded-xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-2"
    >
      <Save className="w-3.5 h-3.5" />
      {saveText}
    </button>

  </div>
);

/* ===========================================================
   FORM FIELD
=========================================================== */

const FormField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text'
}) => (
  <div>

    <label className="text-[9px] uppercase tracking-[0.15em] font-extrabold text-white/30">
      {label}
    </label>

    <input
      type={type}
      value={value}
      onChange={e =>
        onChange(
          e.target.value
        )
      }
      placeholder={placeholder}
      className="mt-2 w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-3.5 py-3 text-xs font-bold text-white placeholder:text-white/15 outline-none focus:border-[#007aff]/40"
    />

  </div>
);

/* ===========================================================
   FORM TEXTAREA
=========================================================== */

const FormTextarea: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({
  label,
  value,
  onChange,
  placeholder
}) => (
  <div>

    <label className="text-[9px] uppercase tracking-[0.15em] font-extrabold text-white/30">
      {label}
    </label>

    <textarea
      rows={4}
      value={value}
      onChange={e =>
        onChange(
          e.target.value
        )
      }
      placeholder={placeholder}
      className="mt-2 w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white placeholder:text-white/15 outline-none focus:border-[#007aff]/40 resize-none"
    />

  </div>
);
