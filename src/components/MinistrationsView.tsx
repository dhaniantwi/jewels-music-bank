import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

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
  ChevronRight,
  Save,
  Sparkles,
  ListMusic,
  CalendarPlus,
  Pencil,
  RotateCcw,
  MoreHorizontal,
  FileMusic,
  SlidersHorizontal,
  Zap,
  Users,
  Timer,
  Eye,
  EyeOff
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
   WEEKLY LEARNING
========================================================= */

interface WeeklyLearning {
  id: string;
  title: string;
  weekLabel: string;
  description: string;
  songIds: number[];
  updatedAt: string;
}

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
   MAIN COMPONENT
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

  const [expandedSongId, setExpandedSongId] =
    useState<number | null>(null);

  /* =======================================================
     WEEKLY LEARNING
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
     CREATE FORM
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
     SYNC
  ======================================================= */

  useEffect(() => {
    if (selectedMinistration) {
      setCurrentMin(selectedMinistration);
    }
  }, [selectedMinistration]);

  useEffect(() => {
    if (!currentMin && ministrations.length > 0) {
      setCurrentMin(ministrations[0]);
    }
  }, [ministrations, currentMin]);

  useEffect(() => {
    if (
      currentMin &&
      !ministrations.some(
        min => min.id === currentMin.id
      )
    ) {
      if (ministrations.length > 0) {
        setCurrentMin(ministrations[0]);
      }
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
     DERIVED DATA
  ======================================================= */

  const vocalMembers = useMemo(
    () =>
      team.filter(
        member =>
          member.type === 'vocal' ||
          member.type === 'director'
      ),
    [team]
  );

  const currentSongCount =
    currentMin?.songs.length || 0;

  const assignedLeadsCount =
    currentMin?.songs.filter(
      song => song.lead !== null
    ).length || 0;

  const assignmentPercentage =
    currentSongCount > 0
      ? Math.round(
          (assignedLeadsCount /
            currentSongCount) *
            100
        )
      : 0;

  const isReady =
    currentSongCount > 0 &&
    assignmentPercentage === 100;

  const currentSongs = useMemo(() => {
    if (!currentMin) return [];

    return currentMin.songs
      .map(item => {
        const song = songs.find(
          s => s.id === item.songId
        );

        if (!song) return null;

        return {
          item,
          song
        };
      })
      .filter(Boolean) as {
      item: SetlistSongItem;
      song: Song;
    }[];
  }, [currentMin, songs]);

  const weeklySongs = useMemo(() => {
    if (!weeklyLearning) return [];

    return weeklyLearning.songIds
      .map(id =>
        songs.find(song => song.id === id)
      )
      .filter(Boolean) as Song[];
  }, [weeklyLearning, songs]);

  /* =======================================================
     SELECT MINISTRATION
  ======================================================= */

  const selectMinistration = (
    min: Ministration
  ) => {
    setCurrentMin(min);
    setExpandedSongId(null);
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
     UPDATE MINISTRATION
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

  const saveMinistrationDetails = () => {
    if (!currentMin || !isMD) return;

    onUpdateMinistration(currentMin);
    setIsEditDetailsOpen(false);
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
      currentMin.songs.map(item =>
        item.songId === songId
          ? {
              ...item,
              lead: memberId
            }
          : item
      );

    const updatedMin = {
      ...currentMin,
      songs: updatedSongs
    };

    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  /* =======================================================
     KEY
  ======================================================= */

  const handleKeyOverride = (
    songId: number,
    newKey: string
  ) => {
    if (!isMD || !currentMin) return;

    const updatedSongs =
      currentMin.songs.map(item =>
        item.songId === songId
          ? {
              ...item,
              keyOverride: newKey
            }
          : item
      );

    const updatedMin = {
      ...currentMin,
      songs: updatedSongs
    };

    setCurrentMin(updatedMin);
    onUpdateMinistration(updatedMin);
  };

  /* =======================================================
     TRANSITION NOTE
  ======================================================= */

  const handleNoteChange = (
    songId: number,
    note: string
  ) => {
    if (!isMD || !currentMin) return;

    const updatedSongs =
      currentMin.songs.map(item =>
        item.songId === songId
          ? {
              ...item,
              orderNote: note
            }
          : item
      );

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

    [
      newSongs[index],
      newSongs[targetIdx]
    ] = [
      newSongs[targetIdx],
      newSongs[index]
    ];

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

    const updatedMin = {
      ...currentMin,
      songs: currentMin.songs.filter(
        item => item.songId !== songId
      )
    };

    setCurrentMin(updatedMin);
    setExpandedSongId(null);
    onUpdateMinistration(updatedMin);
  };

  /* =======================================================
     ADD SONG
  ======================================================= */

  const handleAddSongToMin = (
    songId: number
  ) => {
    if (!isMD || !currentMin) return;

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
      item => item.id === songId
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
     WEEKLY LEARNING
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

    [
      ids[index],
      ids[target]
    ] = [
      ids[target],
      ids[index]
    ];

    saveWeeklyLearning({
      ...weeklyLearning,
      songIds: ids,
      updatedAt:
        new Date().toISOString()
    });
  };

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!currentMin) {
    return (
      <div className="relative w-full min-w-0 max-w-full overflow-hidden text-white">

        <AmbientGlow />

        <div className="relative space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0d0d0f]/95 p-6 sm:p-8 shadow-2xl shadow-black/20">

            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#007aff]/10 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10">
                    <Music2 className="h-4 w-4 text-[#4da3ff]" />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff]">
                    Ministry Services
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em]">
                  Ministrations
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/40">
                  Build services, organize
                  setlists and keep the music
                  ministry prepared for every
                  performance.
                </p>
              </div>

              {isMD && (
                <button
                  onClick={openCreateForm}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007aff] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0062cc]"
                >
                  <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                  Create Ministration
                </button>
              )}

            </div>

            <div className="relative mt-10 rounded-[28px] border border-dashed border-white/10 bg-white/[0.015] px-5 py-16 text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035]">
                <CalendarPlus className="h-7 w-7 text-white/25" />
              </div>

              <h3 className="text-sm font-bold">
                No ministrations yet
              </h3>

              <p className="mt-2 text-xs text-white/30">
                Start by creating a Sunday Service,
                BaselFest event or another ministry
                performance.
              </p>

              {isMD && (
                <button
                  onClick={openCreateForm}
                  className="mt-5 rounded-xl bg-[#007aff] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#0062cc]"
                >
                  Create First Ministration
                </button>
              )}

            </div>

          </section>

        </div>

        {isCreateModalOpen &&
          renderCreateModal()}

      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden text-white">

      <AmbientGlow />

      <div className="relative space-y-7 animate-in fade-in slide-in-from-bottom-2 duration-500">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0d0d0f]/95 p-5 sm:p-7 lg:p-8 shadow-2xl shadow-black/20">

          <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-[#007aff]/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/[0.035] blur-3xl" />

          <div className="relative flex flex-col xl:flex-row xl:items-end xl:justify-between gap-7">

            <div className="min-w-0">

              <div className="mb-4 flex flex-wrap items-center gap-2">

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff]">
                  <Music2 className="h-3 w-3" />
                  Ministry Services
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/20">
                  Performance Management
                </span>

              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.04em]">
                Ministrations
              </h1>

              <p className="mt-3 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-white/40">
                Prepare every service from one
                place — event details, setlists,
                vocal assignments, transitions and
                weekly learning.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              {isMD && (
                <button
                  onClick={openCreateForm}
                  className="group inline-flex items-center gap-2 rounded-2xl bg-[#007aff] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0062cc]"
                >
                  <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                  New Ministration
                </button>
              )}

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-xl">

                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    isMD
                      ? 'bg-[#007aff] shadow-[0_0_15px_rgba(0,122,255,.7)]'
                      : 'bg-white/30'
                  }`}
                />

                <div>
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-white/20">
                    Access
                  </p>

                  <p className="mt-0.5 text-xs font-bold">
                    {isMD
                      ? 'Admin / MD Control'
                      : 'Member View'}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            EVENT SELECTOR
        ================================================= */}

        <section>

          <div className="mb-4 flex items-end justify-between gap-4">

            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff]">
                Ministry Calendar
              </p>

              <h2 className="mt-1 text-xl sm:text-2xl font-extrabold">
                Upcoming Services
              </h2>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-[9px] font-bold text-white/30">
              {ministrations.length}{' '}
              {ministrations.length === 1
                ? 'event'
                : 'events'}
            </span>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            {ministrations.map(min => (
              <EventCard
                key={min.id}
                min={min}
                active={
                  currentMin.id === min.id
                }
                onClick={() =>
                  selectMinistration(min)
                }
              />
            ))}

          </div>

        </section>

        {/* =================================================
            CURRENT EVENT
        ================================================= */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111113]/95 p-5 sm:p-7 shadow-2xl shadow-black/20">

          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#007aff]/[0.07] blur-3xl" />

          <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-7">

            <div className="min-w-0">

              <div className="mb-3 flex flex-wrap items-center gap-2">

                <span className="rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#4da3ff]">
                  {currentMin.status}
                </span>

                {currentMin.theme && (
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
                    {currentMin.theme}
                  </span>
                )}

              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentMin.name}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/35">
                {currentMin.description ||
                  'No description has been added for this ministration.'}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs font-semibold text-white/35">

                <MetaItem
                  icon={
                    <Calendar className="h-3.5 w-3.5" />
                  }
                  value={
                    currentMin.date ||
                    'Date not set'
                  }
                />

                {currentMin.time && (
                  <MetaItem
                    icon={
                      <Clock className="h-3.5 w-3.5" />
                    }
                    value={currentMin.time}
                  />
                )}

                {currentMin.venue && (
                  <MetaItem
                    icon={
                      <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    }
                    value={currentMin.venue}
                  />
                )}

              </div>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              {isMD && (
                <button
                  onClick={() =>
                    setIsEditDetailsOpen(true)
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/[0.08]"
                >
                  <Pencil className="h-3.5 w-3.5 text-[#4da3ff]" />
                  Edit Details
                </button>
              )}

              <button
                onClick={openStageMode}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#007aff] px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0062cc]"
              >
                <Radio className="h-4 w-4" />
                Stage Mode
              </button>

              <button
                onClick={() =>
                  window.print()
                }
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-xs font-bold text-white/45 transition-all hover:bg-white/[0.08] hover:text-white"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Print
                </span>
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            DASHBOARD-STYLE STATS
        ================================================= */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <PreparationCard
            icon={
              <ListMusic className="h-5 w-5" />
            }
            label="Setlist"
            value={String(
              currentSongCount
            ).padStart(2, '0')}
            description="Songs prepared"
            progress={
              currentSongCount > 0
                ? 100
                : 0
            }
          />

          <PreparationCard
            icon={
              <Mic2 className="h-5 w-5" />
            }
            label="Vocals"
            value={`${assignedLeadsCount}/${currentSongCount}`}
            description={
              currentSongCount > 0
                ? `${assignmentPercentage}% assigned`
                : 'No assignments'
            }
            progress={
              assignmentPercentage
            }
          />

          <PreparationCard
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            label="Readiness"
            value={
              isReady
                ? '100%'
                : `${assignmentPercentage}%`
            }
            description={
              isReady
                ? 'Ready for rehearsal'
                : 'Still preparing'
            }
            progress={
              assignmentPercentage
            }
          />

          <PreparationCard
            icon={
              <Users className="h-5 w-5" />
            }
            label="Team"
            value={String(
              vocalMembers.length
            ).padStart(2, '0')}
            description="Vocal / director team"
            progress={100}
          />

        </section>

        {/* =================================================
            SETLIST
        ================================================= */}

        <section className="rounded-[30px] border border-white/10 bg-[#111113]/95 p-4 sm:p-6 lg:p-7 shadow-2xl shadow-black/10">

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-[#007aff]/20 bg-[#007aff]/10">
                <ListMusic className="h-5 w-5 text-[#4da3ff]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold">
                    Performance Setlist
                  </h3>

                  <span className="rounded-full bg-white/[0.04] px-2 py-1 text-[8px] font-extrabold text-white/30">
                    {currentSongCount}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-white/25">
                  Songs, vocal assignments,
                  performance keys and transition
                  cues for this service.
                </p>
              </div>

            </div>

            {isMD && (
              <button
                onClick={() =>
                  setIsAddSongModalOpen(true)
                }
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-bold transition-all hover:bg-white/[0.08]"
              >
                <Plus className="h-4 w-4 text-[#4da3ff] transition-transform group-hover:rotate-90" />
                Add Song
              </button>
            )}

          </div>

          {currentSongs.length > 0 ? (
            <div className="space-y-3">

              {currentSongs.map(
                ({ item, song }, index) => (
                  <SetlistCard
                    key={`${item.songId}-${index}`}
                    item={item}
                    song={song}
                    index={index}
                    isMD={isMD}
                    expanded={
                      expandedSongId ===
                      song.id
                    }
                    leadMember={team.find(
                      member =>
                        member.id ===
                        item.lead
                    )}
                    vocalMembers={
                      vocalMembers
                    }
                    onToggle={() =>
                      setExpandedSongId(
                        expandedSongId ===
                          song.id
                          ? null
                          : song.id
                      )
                    }
                    onSelectSong={() =>
                      onSelectSong(song)
                    }
                    onMoveUp={() =>
                      handleMoveSong(
                        index,
                        'up'
                      )
                    }
                    onMoveDown={() =>
                      handleMoveSong(
                        index,
                        'down'
                      )
                    }
                    onRemove={() =>
                      handleRemoveSong(
                        item.songId
                      )
                    }
                    onAssignLead={memberId =>
                      handleAssignLead(
                        item.songId,
                        memberId
                      )
                    }
                    onChangeKey={key =>
                      handleKeyOverride(
                        item.songId,
                        key
                      )
                    }
                    onChangeNote={note =>
                      handleNoteChange(
                        item.songId,
                        note
                      )
                    }
                  />
                )
              )}

            </div>
          ) : (
            <div className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.015] py-16 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <FileMusic className="h-6 w-6 text-white/20" />
              </div>

              <p className="text-sm font-bold">
                No songs in this setlist
              </p>

              <p className="mt-1 text-xs text-white/25">
                Build the performance repertoire
                from the Song Bank.
              </p>

              {isMD && (
                <button
                  onClick={() =>
                    setIsAddSongModalOpen(true)
                  }
                  className="mt-5 rounded-xl bg-[#007aff] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#0062cc]"
                >
                  Add Songs
                </button>
              )}

            </div>
          )}

        </section>

        {/* =================================================
            WEEKLY LEARNING
        ================================================= */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111113]/95 p-5 sm:p-7 shadow-2xl shadow-black/10">

          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#007aff]/[0.045] blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-[#007aff]/20 bg-[#007aff]/10">
                <BookOpen className="h-5 w-5 text-[#4da3ff]" />
              </div>

              <div>

                <div className="flex items-center gap-2">

                  <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff]">
                    Weekly Learning
                  </span>

                  <Sparkles className="h-3.5 w-3.5 text-[#4da3ff]" />

                </div>

                <h2 className="mt-1 text-xl font-extrabold">
                  {weeklyLearning?.title ||
                    'This Week\'s Learning'}
                </h2>

                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-white/30">
                  {weeklyLearning?.description ||
                    'Songs selected for members to learn, listen to and prepare throughout the week.'}
                </p>

                {weeklyLearning?.weekLabel && (
                  <p className="mt-2 text-[10px] font-bold text-[#4da3ff]/70">
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
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-bold transition-all hover:bg-white/[0.08]"
                >
                  <Plus className="h-3.5 w-3.5 text-[#4da3ff]" />
                  Add Songs
                </button>

                <button
                  onClick={openWeeklyEditor}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#007aff] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/15 transition-all hover:bg-[#0062cc]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Week
                </button>

              </div>
            )}

          </div>

          {weeklySongs.length > 0 ? (
            <div className="relative mt-6 space-y-3">

              {weeklySongs.map(
                (song, index) => (
                  <WeeklySongCard
                    key={song.id}
                    song={song}
                    index={index}
                    audioUrl={getSongAudioUrl(
                      song
                    )}
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
                )
              )}

            </div>
          ) : (
            <div className="relative mt-6 rounded-[24px] border border-dashed border-white/10 bg-white/[0.015] py-12 text-center">

              <Headphones className="mx-auto mb-3 h-8 w-8 text-white/15" />

              <p className="text-sm font-bold">
                No weekly songs yet
              </p>

              <p className="mt-1 text-xs text-white/25">
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
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#007aff] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#0062cc]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Weekly Songs
                </button>
              )}

            </div>
          )}

        </section>

        {/* =================================================
            MINISTRY BRIEF
        ================================================= */}

        <section className="relative overflow-hidden rounded-[30px] border border-amber-500/15 bg-[#111113]/95 p-5 sm:p-7">

          <div className="absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-amber-500/[0.035] blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <Edit3 className="h-5 w-5" />
              </div>

              <div>

                <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-amber-300">
                  Ministry Brief
                </span>

                <h3 className="mt-1 text-lg font-extrabold">
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
                className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-2 text-[10px] font-bold text-amber-300 transition-all hover:bg-amber-500/15"
              >
                {isEditingBrief
                  ? 'Done'
                  : 'Edit Brief'}
              </button>
            )}

          </div>

          <div className="relative mt-5">

            {isEditingBrief && isMD ? (
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
                className="w-full resize-none rounded-2xl border border-amber-500/20 bg-black/25 p-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-amber-400/40"
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[190px_1fr]">

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

                  <p className="mb-2 text-[8px] font-extrabold uppercase tracking-[0.16em] text-amber-300/50">
                    Important Instructions
                  </p>

                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-amber-100/55">
                    {currentMin.mdGlobalNotes ||
                      'No special instructions have been added for this ministration yet.'}
                  </p>

                </div>

              </div>
            )}

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="border-t border-white/[0.06] pb-8 pt-5 text-center">

          <div className="flex items-center justify-center gap-2">

            <Music2 className="h-3.5 w-3.5 text-[#4da3ff]" />

            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/30">
              Jewels Music Hub
            </span>

          </div>

          <p className="mt-2 text-[9px] tracking-[0.12em] text-white/15">
            MUSIC • EXCELLENCE • SERVICE
          </p>

        </footer>

      </div>

      {/* =================================================
          MODALS
      ================================================= */}

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

  /* =======================================================
     CREATE MODAL
  ======================================================= */

  function renderCreateModal() {
    return (
      <ModalShell
        onClose={() =>
          setIsCreateModalOpen(false)
        }
      >
        <ModalHeader
          eyebrow="Ministry Calendar"
          title="Create Ministration"
          icon={
            <CalendarPlus className="h-4 w-4" />
          }
          onClose={() =>
            setIsCreateModalOpen(false)
          }
        />

        <div className="space-y-4 overflow-y-auto p-5">

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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <FormField
              label="Date"
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <FormField
              label="Theme"
              value={newTheme}
              onChange={setNewTheme}
              placeholder="Optional"
            />

            <div>

              <label className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-white/30">
                Status
              </label>

              <select
                value={newStatus}
                onChange={e =>
                  setNewStatus(
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#1a1a1d] px-3 py-3 text-xs font-bold text-white outline-none transition-colors focus:border-[#007aff]/40"
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

  /* =======================================================
     EDIT DETAILS
  ======================================================= */

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
            <Settings2 className="h-4 w-4" />
          }
          onClose={() =>
            setIsEditDetailsOpen(false)
          }
        />

        <div className="space-y-4 overflow-y-auto p-5">

          <FormField
            label="Ministration Name"
            value={currentMin.name}
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <FormField
              label="Date"
              value={
                currentMin.date || ''
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
                currentMin.time || ''
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
              currentMin.venue || ''
            }
            onChange={value =>
              updateCurrentMinField(
                'venue',
                value
              )
            }
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <FormField
              label="Theme"
              value={
                currentMin.theme || ''
              }
              onChange={value =>
                updateCurrentMinField(
                  'theme',
                  value
                )
              }
            />

            <div>

              <label className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-white/30">
                Status
              </label>

              <select
                value={currentMin.status}
                onChange={e =>
                  updateCurrentMinField(
                    'status',
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#1a1a1d] px-3 py-3 text-xs font-bold text-white outline-none focus:border-[#007aff]/40"
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

  /* =======================================================
     ADD SONG
  ======================================================= */

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
            <Music2 className="h-4 w-4" />
          }
          onClose={() =>
            setIsAddSongModalOpen(false)
          }
        />

        <div className="max-h-[70vh] space-y-2 overflow-y-auto p-4">

          {songs.map(song => {

            const exists =
              currentMin?.songs.some(
                item =>
                  item.songId === song.id
              );

            return (
              <div
                key={song.id}
                className={`group flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                  exists
                    ? 'border-white/[0.05] bg-white/[0.01] opacity-40'
                    : 'border-white/10 bg-white/[0.025] hover:-translate-y-0.5 hover:bg-white/[0.05]'
                }`}
              >

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[#007aff]/15 bg-[#007aff]/10">
                    <Music2 className="h-4 w-4 text-[#4da3ff]" />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-xs font-bold">
                      {song.title}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-white/25">
                      {song.artist} • Key:{' '}
                      {song.key} •{' '}
                      {song.category}
                    </p>

                  </div>

                </div>

                <button
                  disabled={exists}
                  onClick={() =>
                    handleAddSongToMin(
                      song.id
                    )
                  }
                  className={`flex-shrink-0 rounded-xl px-3 py-2 text-[10px] font-bold transition-all ${
                    exists
                      ? 'bg-white/[0.04] text-white/20'
                      : 'bg-[#007aff] text-white hover:bg-[#0062cc]'
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

  /* =======================================================
     WEEKLY EDITOR
  ======================================================= */

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
            <BookOpen className="h-4 w-4" />
          }
          onClose={() =>
            setIsWeeklyEditorOpen(false)
          }
        />

        <div className="space-y-4 p-5">

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

        <div className="flex justify-between gap-2 border-t border-white/[0.07] p-5">

          {weeklyLearning ? (
            <button
              onClick={
                clearWeeklyLearning
              }
              className="rounded-xl px-3 py-2.5 text-xs font-bold text-red-300 transition-all hover:bg-red-500/10"
            >
              Remove Week
            </button>
          ) : (
            <div />
          )}

          <div className="ml-auto flex gap-2">

            <button
              onClick={() =>
                setIsWeeklyEditorOpen(
                  false
                )
              }
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-white/45 transition-all hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={
                saveWeeklyDetails
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#007aff] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#0062cc]"
            >
              <Save className="h-3.5 w-3.5" />
              Save Week
            </button>

          </div>

        </div>
      </ModalShell>
    );
  }

  /* =======================================================
     WEEKLY SONG MODAL
  ======================================================= */

  function renderWeeklySongModal() {
    const weeklyIds =
      weeklyLearning?.songIds || [];

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
            <Headphones className="h-4 w-4" />
          }
          onClose={() =>
            setIsWeeklySongModalOpen(
              false
            )
          }
        />

        <div className="max-h-[70vh] space-y-2 overflow-y-auto p-4">

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
                className={`flex items-center gap-3 rounded-2xl border p-3.5 transition-all ${
                  added
                    ? 'border-[#007aff]/20 bg-[#007aff]/[0.05]'
                    : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.05]'
                }`}
              >

                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/30">
                  <Music2 className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="truncate text-xs font-bold">
                    {song.title}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-white/25">
                    {song.artist} • Key{' '}
                    {song.key}
                  </p>

                  {audio && (
                    <span className="text-[8px] font-bold text-emerald-400">
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
                  className={`flex-shrink-0 rounded-xl px-3 py-2 text-[10px] font-bold transition-all ${
                    added
                      ? 'bg-[#007aff]/10 text-[#4da3ff]'
                      : 'bg-[#007aff] text-white hover:bg-[#0062cc]'
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
   AMBIENT BACKGROUND
=========================================================== */

const AmbientGlow: React.FC = () => (
  <>
    <div className="pointer-events-none fixed -left-32 top-1/3 h-72 w-72 rounded-full bg-[#007aff]/[0.025] blur-3xl" />
    <div className="pointer-events-none fixed -right-32 bottom-0 h-80 w-80 rounded-full bg-blue-500/[0.02] blur-3xl" />
  </>
);

/* ===========================================================
   EVENT CARD
=========================================================== */

const EventCard: React.FC<{
  min: Ministration;
  active: boolean;
  onClick: () => void;
}> = ({
  min,
  active,
  onClick
}) => {
  const assigned =
    min.songs.filter(
      song => song.lead !== null
    ).length;

  const total =
    min.songs.length;

  const percentage =
    total > 0
      ? Math.round(
          (assigned / total) * 100
        )
      : 0;

  const ready =
    total > 0 &&
    percentage === 100;

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[26px] border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
        active
          ? 'border-[#007aff]/40 bg-[#007aff]/[0.07] shadow-xl shadow-blue-500/[0.08]'
          : 'border-white/10 bg-[#111113]/90 hover:border-white/20 hover:bg-white/[0.04]'
      }`}
    >

      {active && (
        <div className="absolute inset-y-0 left-0 w-0.5 bg-[#007aff] shadow-[0_0_15px_rgba(0,122,255,.8)]" />
      )}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <span className="inline-flex rounded-lg border border-white/[0.07] bg-white/[0.04] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-white/35">
            {min.status}
          </span>

          <h3 className="mt-3 truncate text-base font-extrabold">
            {min.name}
          </h3>

        </div>

        <ChevronRight
          className={`h-4 w-4 flex-shrink-0 transition-all duration-300 ${
            active
              ? 'translate-x-0.5 text-[#4da3ff]'
              : 'text-white/15 group-hover:translate-x-0.5 group-hover:text-white/45'
          }`}
        />

      </div>

      <div className="mt-4 space-y-2">

        <SmallMeta
          icon={
            <Calendar className="h-3.5 w-3.5" />
          }
          value={
            min.date || 'Date not set'
          }
        />

        {min.time && (
          <SmallMeta
            icon={
              <Clock className="h-3.5 w-3.5" />
            }
            value={min.time}
          />
        )}

        {min.venue && (
          <SmallMeta
            icon={
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
            }
            value={min.venue}
          />
        )}

      </div>

      <div className="mt-5 border-t border-white/[0.07] pt-4">

        <div className="flex items-center justify-between">

          <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/20">
            Setlist
          </span>

          <span className="text-xs font-extrabold">
            {total}{' '}
            <span className="font-medium text-white/25">
              songs
            </span>
          </span>

        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

          <div
            className="h-full rounded-full bg-[#007aff] transition-all duration-500"
            style={{
              width: `${percentage}%`
            }}
          />

        </div>

        <div className="mt-2 flex items-center justify-between">

          <span className="text-[9px] text-white/20">
            {percentage}% leads assigned
          </span>

          <span
            className={`text-[9px] font-bold ${
              ready
                ? 'text-emerald-400'
                : 'text-white/20'
            }`}
          >
            {ready
              ? 'Ready'
              : 'Preparing'}
          </span>

        </div>

      </div>

    </button>
  );
};

/* ===========================================================
   SETLIST CARD
=========================================================== */

interface SetlistCardProps {
  item: SetlistSongItem;
  song: Song;
  index: number;
  isMD: boolean;
  expanded: boolean;
  leadMember?: TeamMember;
  vocalMembers: TeamMember[];

  onToggle: () => void;
  onSelectSong: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onAssignLead: (
    memberId: number | null
  ) => void;
  onChangeKey: (
    key: string
  ) => void;
  onChangeNote: (
    note: string
  ) => void;
}

const SetlistCard: React.FC<
  SetlistCardProps
> = ({
  item,
  song,
  index,
  isMD,
  expanded,
  leadMember,
  vocalMembers,
  onToggle,
  onSelectSong,
  onMoveUp,
  onMoveDown,
  onRemove,
  onAssignLead,
  onChangeKey,
  onChangeNote
}) => {
  const effectiveKey =
    item.keyOverride ||
    song.key;

  const audioUrl =
    getSongAudioUrl(song);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null
    );

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <article
      className={`overflow-hidden rounded-[24px] border transition-all duration-300 ${
        expanded
          ? 'border-[#007aff]/30 bg-[#007aff]/[0.045] shadow-xl shadow-blue-500/[0.04]'
          : 'border-white/10 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.035]'
      }`}
    >

      <div className="flex items-center gap-3 p-4 sm:p-5">

        <div className="flex flex-shrink-0 items-center gap-1">

          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-[10px] font-extrabold transition-all ${
              expanded
                ? 'border-[#007aff]/30 bg-[#007aff]/10 text-[#4da3ff]'
                : 'border-white/10 bg-white/[0.035] text-white/30'
            }`}
          >
            {String(index + 1).padStart(
              2,
              '0'
            )}
          </span>

          {isMD && (
            <div className="flex flex-col">

              <button
                onClick={onMoveUp}
                disabled={index === 0}
                className="rounded text-white/15 transition-colors hover:text-[#4da3ff] disabled:opacity-10"
              >
                <ArrowUp className="h-3 w-3" />
              </button>

              <button
                onClick={onMoveDown}
                className="rounded text-white/15 transition-colors hover:text-[#4da3ff]"
              >
                <ArrowDown className="h-3 w-3" />
              </button>

            </div>
          )}

        </div>

        <button
          onClick={onToggle}
          className="min-w-0 flex-1 text-left"
        >

          <div className="flex flex-wrap items-center gap-2">

            <span className="truncate text-sm sm:text-base font-extrabold">
              {song.title}
            </span>

            <span className="rounded-lg border border-[#007aff]/20 bg-[#007aff]/10 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#4da3ff]">
              {song.category}
            </span>

          </div>

          <p className="mt-1 truncate text-[10px] text-white/25">
            {song.artist} • {song.tempo}
          </p>

        </button>

        <div className="hidden items-center gap-2 sm:flex">

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-right">

            <p className="text-[7px] font-extrabold uppercase tracking-[0.15em] text-white/20">
              Key
            </p>

            <p className="mt-0.5 text-xs font-extrabold text-[#4da3ff]">
              {effectiveKey}
            </p>

          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-right">

            <p className="text-[7px] font-extrabold uppercase tracking-[0.15em] text-white/20">
              Lead
            </p>

            <p className="mt-0.5 max-w-[90px] truncate text-xs font-bold text-white/60">
              {leadMember?.name ||
                'Pending'}
            </p>

          </div>

        </div>

        <button
          onClick={onToggle}
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border transition-all ${
            expanded
              ? 'border-[#007aff]/20 bg-[#007aff]/10 text-[#4da3ff]'
              : 'border-white/10 bg-white/[0.03] text-white/30 hover:text-white'
          }`}
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-300 ${
              expanded
                ? 'rotate-90'
                : ''
            }`}
          />
        </button>

      </div>

      {/* EXPANDED PERFORMANCE PANEL */}

      <div
        className={`grid transition-all duration-300 ${
          expanded
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >

        <div className="overflow-hidden">

          <div className="border-t border-white/[0.07] px-4 pb-4 pt-4 sm:px-5 sm:pb-5">

            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#007aff]/15 bg-[#007aff]/10">
                  <Music2 className="h-4 w-4 text-[#4da3ff]" />
                </div>

                <div>
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-white/20">
                    Arrangement
                  </p>

                  <p className="mt-0.5 text-xs font-bold">
                    {song.title}
                  </p>
                </div>

              </div>

              <div className="flex flex-wrap gap-2">

                {audioUrl && (
                  <>
                    <audio
                      ref={audioRef}
                      src={audioUrl}
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
                      className="hidden"
                    />

                    <button
                      onClick={
                        toggleAudio
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-[#007aff] px-3 py-2 text-[10px] font-bold text-white transition-all hover:bg-[#0062cc]"
                    >
                      {isPlaying ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5 fill-current" />
                      )}

                      {isPlaying
                        ? 'Pause'
                        : 'Listen'}
                    </button>

                    <a
                      href={audioUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-bold text-white/50 transition-all hover:bg-white/[0.08] hover:text-white"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </>
                )}

                <button
                  onClick={onSelectSong}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-bold text-white/50 transition-all hover:bg-white/[0.08] hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Arrangement
                </button>

              </div>

            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-12">

              <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-3 md:col-span-5">

                <label className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
                  Lead Vocalist
                </label>

                {isMD ? (
                  <select
                    value={
                      item.lead || ''
                    }
                    onChange={e =>
                      onAssignLead(
                        e.target.value
                          ? Number(
                              e.target
                                .value
                            )
                          : null
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#1a1a1d] px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-amber-400/30"
                  >
                    <option value="">
                      -- Not Assigned --
                    </option>

                    {vocalMembers.map(
                      member => (
                        <option
                          key={
                            member.id
                          }
                          value={
                            member.id
                          }
                        >
                          {
                            member.name
                          }{' '}
                          (
                          {member.voicePart ||
                            member.role}
                          )
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <p className="mt-2 text-xs font-bold text-white/70">
                    {leadMember?.name ||
                      'Pending MD Assignment'}
                  </p>
                )}

              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-3 md:col-span-3">

                <label className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#4da3ff]">
                  Performance Key
                </label>

                {isMD ? (
                  <select
                    value={
                      effectiveKey
                    }
                    onChange={e =>
                      onChangeKey(
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#1a1a1d] px-3 py-2.5 text-xs font-bold text-[#4da3ff] outline-none focus:border-[#007aff]/40"
                  >
                    {CHROMATIC_KEYS.map(
                      key => (
                        <option
                          key={key}
                          value={key}
                        >
                          {key} Major
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <p className="mt-2 text-xs font-extrabold text-[#4da3ff]">
                    Key of {effectiveKey}
                  </p>
                )}

              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-3 md:col-span-4">

                <label className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-white/25">
                  Transition Cue
                </label>

                {isMD ? (
                  <input
                    value={
                      item.orderNote ||
                      ''
                    }
                    onChange={e =>
                      onChangeNote(
                        e.target.value
                      )
                    }
                    placeholder="Transition instruction..."
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#1a1a1d] px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/15 focus:border-[#007aff]/40"
                  />
                ) : (
                  <p className="mt-2 text-xs leading-relaxed text-white/35">
                    {item.orderNote ||
                      'Standard transition.'}
                  </p>
                )}

              </div>

            </div>

            {isMD && (
              <div className="mt-3 flex justify-end">

                <button
                  onClick={onRemove}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/15 bg-red-500/[0.04] px-3 py-2 text-[10px] font-bold text-red-300 transition-all hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove Song
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </article>
  );
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
    useRef<HTMLAudioElement | null>(
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
    <article className="group rounded-[24px] border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.035]">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

        <div className="flex min-w-0 flex-1 items-center gap-3">

          <div className="flex flex-shrink-0 items-center gap-1">

            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10 text-[10px] font-extrabold text-[#4da3ff]">
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
                  className="text-white/15 transition-colors hover:text-[#4da3ff] disabled:opacity-10"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>

                <button
                  onClick={
                    onMoveDown
                  }
                  className="text-white/15 transition-colors hover:text-[#4da3ff]"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>

              </div>
            )}

          </div>

          <div className="min-w-0">

            <button
              onClick={onSelectSong}
              className="block max-w-full truncate text-sm font-bold text-white transition-colors hover:text-[#4da3ff]"
            >
              {song.title}
            </button>

            <p className="mt-1 truncate text-[10px] text-white/25">
              {song.artist} • Key{' '}
              {song.key}
            </p>

          </div>

        </div>

        <div className="flex flex-wrap items-center gap-2">

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
                className="h-9 max-w-[280px]"
              />

              <button
                onClick={togglePlay}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007aff] text-white transition-all hover:bg-[#0062cc]"
                title={
                  isPlaying
                    ? 'Pause'
                    : 'Play'
                }
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
              </button>

              <a
                href={audioUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/45 transition-all hover:bg-white/[0.08] hover:text-white"
                title="Download audio"
              >
                <Download className="h-4 w-4" />
              </a>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] px-3 py-2 text-[9px] font-bold text-white/20">
              <Volume2 className="h-3.5 w-3.5" />
              Audio not available
            </span>
          )}

          {isMD && (
            <button
              onClick={onRemove}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/20 transition-all hover:bg-red-500/10 hover:text-red-300"
              title="Remove from weekly learning"
            >
              <Trash2 className="h-4 w-4" />
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
  <div className="group rounded-[24px] border border-white/10 bg-[#111113]/95 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-[#141416]">

    <div className="flex items-start justify-between gap-3">

      <div className="min-w-0">

        <p className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-white/25">
          {label}
        </p>

        <p className="mt-2 truncate text-xl sm:text-2xl font-extrabold tracking-tight">
          {value}
        </p>

      </div>

      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#007aff]/15 bg-[#007aff]/10 text-[#4da3ff] transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>

    </div>

    <p className="mt-2 truncate text-[10px] text-white/25">
      {description}
    </p>

    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">

      <div
        className="h-full rounded-full bg-[#007aff] shadow-[0_0_12px_rgba(0,122,255,.25)] transition-all duration-500"
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
   META
=========================================================== */

const MetaItem: React.FC<{
  icon: React.ReactNode;
  value: string;
}> = ({
  icon,
  value
}) => (
  <div className="flex items-center gap-1.5">
    <span className="text-[#4da3ff]">
      {icon}
    </span>
    {value}
  </div>
);

const SmallMeta: React.FC<{
  icon: React.ReactNode;
  value: string;
}> = ({
  icon,
  value
}) => (
  <div className="flex min-w-0 items-center gap-2 text-[11px] text-white/30">
    <span className="flex-shrink-0 text-[#4da3ff]">
      {icon}
    </span>
    <span className="truncate">
      {value}
    </span>
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

    <p className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-amber-300/40">
      {label}
    </p>

    <p className="mt-1 text-xs font-bold text-white/60">
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
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-xl sm:p-5"
    onMouseDown={e => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
  >

    <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#101012] shadow-2xl shadow-black/50">

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
  <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] p-5">

    <div className="flex items-center gap-3">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10 text-[#4da3ff]">
        {icon}
      </div>

      <div>

        <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#4da3ff]">
          {eyebrow}
        </p>

        <h3 className="mt-1 text-base font-extrabold">
          {title}
        </h3>

      </div>

    </div>

    <button
      onClick={onClose}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/35 transition-all hover:bg-white/[0.08] hover:text-white"
    >
      <X className="h-4 w-4" />
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
  <div className="flex justify-end gap-2 border-t border-white/[0.07] p-5">

    <button
      onClick={onCancel}
      className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-white/45 transition-all hover:bg-white/[0.04] hover:text-white"
    >
      Cancel
    </button>

    <button
      onClick={onSave}
      className="inline-flex items-center gap-2 rounded-xl bg-[#007aff] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#0062cc]"
    >
      <Save className="h-3.5 w-3.5" />
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
  onChange: (
    value: string
  ) => void;
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

    <label className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-white/30">
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
      className="mt-2 w-full rounded-xl border border-white/10 bg-[#1a1a1d] px-3.5 py-3 text-xs font-bold text-white outline-none transition-all placeholder:text-white/15 focus:border-[#007aff]/40 focus:bg-[#1c1c1f]"
    />

  </div>
);

/* ===========================================================
   FORM TEXTAREA
=========================================================== */

const FormTextarea: React.FC<{
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
}> = ({
  label,
  value,
  onChange,
  placeholder
}) => (
  <div>

    <label className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-white/30">
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
      className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#1a1a1d] px-3.5 py-3 text-xs text-white outline-none transition-all placeholder:text-white/15 focus:border-[#007aff]/40 focus:bg-[#1c1c1f]"
    />

  </div>
);
