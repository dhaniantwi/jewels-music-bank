import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Ministration,
  Song,
  TeamMember,
  ActiveRole,
  SetlistSongItem,
} from '../types';

import {
  Calendar,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  FileMusic,
  Headphones,
  ListMusic,
  MapPin,
  Mic2,
  Music2,
  Pause,
  Pencil,
  Play,
  Plus,
  Printer,
  Radio,
  Save,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Users,
  Volume1,
  Volume2,
  VolumeX,
  X,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Eye,
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

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const getSongAudioUrl = (song?: Song | null): string => {
  if (!song) return '';

  const candidate = [
    (song as any).audioUrl,
    (song as any).audioURL,
    (song as any).audio,
    (song as any).audioSrc,
    (song as any).audioSource,
    (song as any).url,
  ].find(
    (value) =>
      typeof value === 'string' && value.trim().length > 0
  );

  return candidate || '';
};

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${secs}`;
};

const safeDateLabel = (date?: string): string => {
  if (!date) return 'Date not set';

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const statusLabel = (status?: string): string => {
  if (!status) return 'Upcoming';

  return status
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

const MinistrationsView: React.FC<MinistrationsViewProps> = ({
  ministrations,
  songs,
  team,
  activeRole,
  selectedMinistration,
  onSelectMinistration,
  onUpdateMinistration,
  onCreateMinistration,
  onSelectSong,
  openStageMode,
}) => {
  const isMD = activeRole === 'admin_md';

  const [currentMin, setCurrentMin] =
    useState<Ministration | null>(
      selectedMinistration || ministrations[0] || null
    );

  const [expandedSongId, setExpandedSongId] =
    useState<number | string | null>(null);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showAddSongModal, setShowAddSongModal] =
    useState(false);

  const [showWeeklyEditor, setShowWeeklyEditor] =
    useState(false);

  const [showWeeklySongModal, setShowWeeklySongModal] =
    useState(false);

  const [editingBrief, setEditingBrief] =
    useState(false);

  const [activeAudioId, setActiveAudioId] =
    useState<string | null>(null);

  const [songSearch, setSongSearch] =
    useState('');

  const [weeklySongSearch, setWeeklySongSearch] =
    useState('');

  const [weeklyLearning, setWeeklyLearning] =
    useState<WeeklyLearning[]>([]);

  const [selectedWeeklyId, setSelectedWeeklyId] =
    useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Sync current ministration                                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (selectedMinistration) {
      setCurrentMin(selectedMinistration);
      return;
    }

    if (!currentMin && ministrations.length > 0) {
      setCurrentMin(ministrations[0]);
    }
  }, [selectedMinistration, ministrations]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        WEEKLY_STORAGE_KEY
      );

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setWeeklyLearning(parsed);

        if (parsed.length > 0) {
          setSelectedWeeklyId(parsed[0].id);
        }
      }
    } catch (error) {
      console.error(
        'Unable to load weekly learning:',
        error
      );
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        WEEKLY_STORAGE_KEY,
        JSON.stringify(weeklyLearning)
      );
    } catch (error) {
      console.error(
        'Unable to save weekly learning:',
        error
      );
    }
  }, [weeklyLearning]);

  /* ------------------------------------------------------------------------ */
  /* Derived data                                                             */
  /* ------------------------------------------------------------------------ */

  const vocalMembers = useMemo(
    () =>
      team.filter(
        (member) =>
          member.type === 'vocal' ||
          member.type === 'director'
      ),
    [team]
  );

  const currentSetlist =
    currentMin?.songs || [];

  const currentSongs = useMemo(() => {
    return currentSetlist
      .map((item) => ({
        item,
        song: songs.find(
          (song) =>
            String(song.id) === String(item.songId)
        ),
      }))
      .filter(
        (
          entry
        ): entry is {
          item: SetlistSongItem;
          song: Song;
        } => Boolean(entry.song)
      );
  }, [currentSetlist, songs]);

  const assignedLeads = useMemo(
    () =>
      currentSetlist.filter(
        (item) => item.lead !== null && item.lead !== undefined
      ).length,
    [currentSetlist]
  );

  const assignmentPercent =
    currentSetlist.length > 0
      ? Math.round(
          (assignedLeads / currentSetlist.length) * 100
        )
      : 0;

  const readiness =
    currentSetlist.length > 0
      ? assignmentPercent
      : 0;

  const selectedWeekly =
    weeklyLearning.find(
      (item) => item.id === selectedWeeklyId
    ) || weeklyLearning[0] || null;

  const weeklySongs = useMemo(() => {
    if (!selectedWeekly) return [];

    return selectedWeekly.songIds
      .map((songId) =>
        songs.find(
          (song) =>
            Number(song.id) === Number(songId)
        )
      )
      .filter(Boolean) as Song[];
  }, [selectedWeekly, songs]);

  const filteredSongs = useMemo(() => {
    const query = songSearch.trim().toLowerCase();

    if (!query) return songs;

    return songs.filter((song) => {
      const title =
        String((song as any).title || '').toLowerCase();

      const category =
        String(
          (song as any).category ||
            (song as any).genre ||
            ''
        ).toLowerCase();

      return (
        title.includes(query) ||
        category.includes(query)
      );
    });
  }, [songs, songSearch]);

  const filteredWeeklySongs = useMemo(() => {
    const query =
      weeklySongSearch.trim().toLowerCase();

    if (!query) return songs;

    return songs.filter((song) => {
      const title =
        String((song as any).title || '').toLowerCase();

      const category =
        String(
          (song as any).category ||
            (song as any).genre ||
            ''
        ).toLowerCase();

      return (
        title.includes(query) ||
        category.includes(query)
      );
    });
  }, [songs, weeklySongSearch]);

  /* ------------------------------------------------------------------------ */
  /* Update helpers                                                           */
  /* ------------------------------------------------------------------------ */

  const updateCurrentMin = (
    changes: Partial<Ministration>
  ) => {
    if (!currentMin) return;

    const updated = {
      ...currentMin,
      ...changes,
    };

    setCurrentMin(updated);
    onUpdateMinistration(updated);
  };

  const selectMinistration = (
    ministration: Ministration
  ) => {
    setCurrentMin(ministration);
    setExpandedSongId(null);
    setActiveAudioId(null);
    onSelectMinistration(ministration);
  };

  /* ------------------------------------------------------------------------ */
  /* Create event                                                             */
  /* ------------------------------------------------------------------------ */

  const createMinistration = (
    form: {
      name: string;
      description: string;
      date: string;
      time: string;
      venue: string;
      theme: string;
      status: string;
    }
  ) => {
    onCreateMinistration({
      name: form.name || 'Sunday Service',
      description: form.description,
      date: form.date,
      time: form.time,
      venue: form.venue,
      theme: form.theme,
      status: form.status || 'upcoming',
      songs: [],
      mdGlobalNotes: '',
    });

    setShowCreateModal(false);
  };

  /* ------------------------------------------------------------------------ */
  /* Setlist controls                                                         */
  /* ------------------------------------------------------------------------ */

  const assignLead = (
    songId: number | string,
    memberId: number | null
  ) => {
    if (!currentMin) return;

    const updatedSongs =
      currentSetlist.map((item) =>
        String(item.songId) === String(songId)
          ? {
              ...item,
              lead: memberId,
            }
          : item
      );

    updateCurrentMin({
      songs: updatedSongs,
    });
  };

  const changeSongKey = (
    songId: number | string,
    key: string
  ) => {
    if (!currentMin) return;

    const updatedSongs =
      currentSetlist.map((item) =>
        String(item.songId) === String(songId)
          ? {
              ...item,
              keyOverride: key,
            }
          : item
      );

    updateCurrentMin({
      songs: updatedSongs,
    });
  };

  const changeSongNote = (
    songId: number | string,
    note: string
  ) => {
    if (!currentMin) return;

    const updatedSongs =
      currentSetlist.map((item) =>
        String(item.songId) === String(songId)
          ? {
              ...item,
              orderNote: note,
            }
          : item
      );

    updateCurrentMin({
      songs: updatedSongs,
    });
  };

  const moveSong = (
    index: number,
    direction: -1 | 1
  ) => {
    if (!currentMin) return;

    const nextIndex = index + direction;

    if (
      nextIndex < 0 ||
      nextIndex >= currentSetlist.length
    ) {
      return;
    }

    const reordered = [...currentSetlist];

    const temp = reordered[index];
    reordered[index] = reordered[nextIndex];
    reordered[nextIndex] = temp;

    updateCurrentMin({
      songs: reordered,
    });
  };

  const removeSong = (
    songId: number | string
  ) => {
    if (!currentMin) return;

    const updatedSongs =
      currentSetlist.filter(
        (item) =>
          String(item.songId) !== String(songId)
      );

    updateCurrentMin({
      songs: updatedSongs,
    });

    if (
      String(expandedSongId) === String(songId)
    ) {
      setExpandedSongId(null);
    }
  };

  const addSongToSetlist = (song: Song) => {
    if (!currentMin) return;

    const exists = currentSetlist.some(
      (item) =>
        String(item.songId) === String(song.id)
    );

    if (exists) return;

    const newItem: SetlistSongItem = {
      songId: song.id,
      lead: null,
      keyOverride:
        (song as any).key || 'G',
      orderNote:
        'Rehearse transition into this song.',
    };

    updateCurrentMin({
      songs: [
        ...currentSetlist,
        newItem,
      ],
    });

    setShowAddSongModal(false);
    setSongSearch('');
  };

  /* ------------------------------------------------------------------------ */
  /* Weekly learning                                                          */
  /* ------------------------------------------------------------------------ */

  const createWeeklyLearning = () => {
    const now = new Date();

    const newWeek: WeeklyLearning = {
      id: `week-${Date.now()}`,
      title: 'Weekly Ministration',
      weekLabel: `Week of ${now.toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      )}`,
      description:
        'Songs and preparation materials for this week’s ministration.',
      songIds: [],
      updatedAt: now.toISOString(),
    };

    setWeeklyLearning((previous) => [
      newWeek,
      ...previous,
    ]);

    setSelectedWeeklyId(newWeek.id);
    setShowWeeklyEditor(true);
  };

  const updateWeekly = (
    changes: Partial<WeeklyLearning>
  ) => {
    if (!selectedWeekly) return;

    setWeeklyLearning((previous) =>
      previous.map((item) =>
        item.id === selectedWeekly.id
          ? {
              ...item,
              ...changes,
              updatedAt:
                new Date().toISOString(),
            }
          : item
      )
    );
  };

  const removeWeekly = () => {
    if (!selectedWeekly) return;

    const remaining =
      weeklyLearning.filter(
        (item) =>
          item.id !== selectedWeekly.id
      );

    setWeeklyLearning(remaining);
    setSelectedWeeklyId(
      remaining[0]?.id || null
    );
    setShowWeeklyEditor(false);
  };

  const addSongToWeekly = (song: Song) => {
    if (!selectedWeekly) return;

    const exists =
      selectedWeekly.songIds.some(
        (id) =>
          Number(id) === Number(song.id)
      );

    if (exists) return;

    updateWeekly({
      songIds: [
        ...selectedWeekly.songIds,
        Number(song.id),
      ],
    });

    setShowWeeklySongModal(false);
    setWeeklySongSearch('');
  };

  const removeSongFromWeekly = (
    songId: number
  ) => {
    if (!selectedWeekly) return;

    updateWeekly({
      songIds:
        selectedWeekly.songIds.filter(
          (id) => Number(id) !== Number(songId)
        ),
    });
  };

  const moveWeeklySong = (
    index: number,
    direction: -1 | 1
  ) => {
    if (!selectedWeekly) return;

    const nextIndex = index + direction;

    if (
      nextIndex < 0 ||
      nextIndex >=
        selectedWeekly.songIds.length
    ) {
      return;
    }

    const reordered = [
      ...selectedWeekly.songIds,
    ];

    const temp = reordered[index];
    reordered[index] =
      reordered[nextIndex];
    reordered[nextIndex] = temp;

    updateWeekly({
      songIds: reordered,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* Empty state                                                              */
  /* ------------------------------------------------------------------------ */

  if (!currentMin) {
    return (
      <div className="relative min-h-full overflow-hidden bg-black text-white">
        <AmbientGlow />

        <div className="relative mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-16 sm:px-6">
          <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[#101114]/90 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
              <Music2 size={30} />
            </div>

            <h2 className="text-2xl font-black tracking-tight">
              No ministrations yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
              Create your first Sunday Service or
              ministry event and build its setlist,
              vocal assignments and preparation notes.
            </p>

            {isMD && (
              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(true)
                }
                className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 active:scale-[0.98]"
              >
                <Plus size={17} />
                Create Ministration
              </button>
            )}
          </div>
        </div>

        {showCreateModal &&
          renderCreateModal({
            onClose: () =>
              setShowCreateModal(false),
            onCreate: createMinistration,
          })}
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Main UI                                                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="relative min-h-full overflow-hidden bg-black text-white">
      <AmbientGlow />

      <div className="relative mx-auto w-full max-w-[1500px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300">
              <Music2 size={13} />
              Music Ministry
            </div>

            <h1 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Ministrations
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45 sm:text-[15px]">
              Plan services, build setlists, assign
              vocalists and prepare the ministry for
              every performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                isMD
                  ? 'border-blue-400/20 bg-blue-500/10 text-blue-300'
                  : 'border-white/10 bg-white/[0.04] text-white/55'
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  isMD
                    ? 'bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,.9)]'
                    : 'bg-white/30'
                }`}
              />

              {isMD
                ? 'MD Access'
                : 'Member Access'}
            </div>

            {isMD && (
              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(true)
                }
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-bold text-white transition hover:border-blue-400/30 hover:bg-blue-500/10"
              >
                <CalendarPlus size={16} />
                New Event
              </button>
            )}
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Event selector                                                     */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-7">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
                Your Events
              </p>
              <h2 className="mt-1 text-lg font-black">
                Upcoming Ministrations
              </h2>
            </div>

            <span className="text-xs text-white/30">
              {ministrations.length}{' '}
              {ministrations.length === 1
                ? 'event'
                : 'events'}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {ministrations.map((ministration) => (
              <EventCard
                key={ministration.id}
                ministration={ministration}
                selected={
                  String(
                    currentMin.id
                  ) ===
                  String(
                    ministration.id
                  )
                }
                onSelect={() =>
                  selectMinistration(
                    ministration
                  )
                }
              />
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Current event hero                                                 */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative mb-7 overflow-hidden rounded-[30px] border border-white/10 bg-[#0d0f12] shadow-2xl shadow-black/40">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />

          <div className="relative grid lg:grid-cols-[1fr_auto]">
            <div className="p-6 sm:p-8 lg:p-9">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-blue-300">
                  <Radio size={12} />
                  {statusLabel(
                    currentMin.status
                  )}
                </span>

                {currentMin.theme && (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                    {currentMin.theme}
                  </span>
                )}
              </div>

              <div className="max-w-3xl">
                <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  {currentMin.name}
                </h2>

                {currentMin.description && (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
                    {currentMin.description}
                  </p>
                )}
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <MetaItem
                  icon={<Calendar size={16} />}
                  label="Date"
                  value={safeDateLabel(
                    currentMin.date
                  )}
                />

                <MetaItem
                  icon={<Clock size={16} />}
                  label="Time"
                  value={
                    currentMin.time ||
                    'Time not set'
                  }
                />

                <MetaItem
                  icon={<MapPin size={16} />}
                  label="Venue"
                  value={
                    currentMin.venue ||
                    'Venue not set'
                  }
                />
              </div>
            </div>

            <div className="flex flex-col justify-between border-t border-white/10 bg-white/[0.025] p-5 lg:w-[280px] lg:border-l lg:border-t-0 lg:p-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
                  Event Control
                </p>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={openStageMode}
                    className="flex w-full items-center justify-between rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-left transition hover:bg-blue-500/15"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                        <Radio size={17} />
                      </span>

                      <span>
                        <span className="block text-sm font-bold text-white">
                          Stage Mode
                        </span>
                        <span className="block text-[11px] text-white/35">
                          Launch performance view
                        </span>
                      </span>
                    </span>

                    <ChevronRight
                      size={17}
                      className="text-white/30"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left transition hover:bg-white/[0.06]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white/60">
                        <Printer size={17} />
                      </span>

                      <span>
                        <span className="block text-sm font-bold text-white">
                          Print Setlist
                        </span>
                        <span className="block text-[11px] text-white/35">
                          Prepare a hard copy
                        </span>
                      </span>
                    </span>

                    <ChevronRight
                      size={17}
                      className="text-white/30"
                    />
                  </button>
                </div>
              </div>

              {isMD && (
                <button
                  type="button"
                  onClick={() =>
                    setShowEditModal(true)
                  }
                  className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <Edit3 size={15} />
                  Edit Event Details
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Stats                                                              */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<ListMusic size={19} />}
            label="Setlist"
            value={String(currentSetlist.length).padStart(
              2,
              '0'
            )}
            caption="Songs in performance order"
            accent="blue"
          />

          <StatCard
            icon={<Mic2 size={19} />}
            label="Vocal Assignments"
            value={`${assignedLeads}/${currentSetlist.length}`}
            caption={
              currentSetlist.length
                ? `${assignmentPercent}% assigned`
                : 'No songs added'
            }
            accent="violet"
            progress={assignmentPercent}
          />

          <StatCard
            icon={<CheckCircle2 size={19} />}
            label="Readiness"
            value={`${readiness}%`}
            caption={
              readiness === 100
                ? 'Setlist assignments complete'
                : 'Continue preparing the set'
            }
            accent="green"
            progress={readiness}
          />

          <StatCard
            icon={<Users size={19} />}
            label="Ministry Team"
            value={String(team.length).padStart(
              2,
              '0'
            )}
            caption={`${vocalMembers.length} vocal/director members`}
            accent="amber"
          />
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Setlist                                                            */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ListMusic
                  size={18}
                  className="text-blue-300"
                />

                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
                  Performance Plan
                </p>
              </div>

              <h2 className="mt-1 text-2xl font-black tracking-tight">
                Setlist
              </h2>

              <p className="mt-1 text-xs text-white/35">
                Arrange the order, assign leads and
                rehearse every transition.
              </p>
            </div>

            {isMD && (
              <button
                type="button"
                onClick={() =>
                  setShowAddSongModal(true)
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-xs font-black text-white shadow-lg shadow-blue-500/15 transition hover:bg-blue-400 active:scale-[0.98]"
              >
                <Plus size={16} />
                Add Song
              </button>
            )}
          </div>

          {currentSongs.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-[#0c0e11] p-8 text-center sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
                <FileMusic size={24} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Your setlist is empty
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
                Add songs from the Song Bank to
                start building this ministration.
              </p>

              {isMD && (
                <button
                  type="button"
                  onClick={() =>
                    setShowAddSongModal(true)
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-2.5 text-xs font-bold text-blue-300 transition hover:bg-blue-500/15"
                >
                  <Plus size={15} />
                  Add First Song
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {currentSongs.map(
                ({
                  item,
                  song,
                }, index) => (
                  <SetlistCard
                    key={`${song.id}-${index}`}
                    item={item}
                    song={song}
                    index={index}
                    isMD={isMD}
                    expanded={
                      String(expandedSongId) ===
                      String(song.id)
                    }
                    leadMember={team.find(
                      (member) =>
                        Number(member.id) ===
                        Number(item.lead)
                    )}
                    vocalMembers={
                      vocalMembers
                    }
                    activeAudioId={
                      activeAudioId
                    }
                    onActiveAudioChange={
                      setActiveAudioId
                    }
                    onToggle={() =>
                      setExpandedSongId(
                        (
                          previous
                        ) =>
                          String(previous) ===
                          String(song.id)
                            ? null
                            : song.id
                      )
                    }
                    onSelectSong={() =>
                      onSelectSong(song)
                    }
                    onMoveUp={() =>
                      moveSong(index, -1)
                    }
                    onMoveDown={() =>
                      moveSong(index, 1)
                    }
                    onRemove={() =>
                      removeSong(song.id)
                    }
                    onAssignLead={(
                      memberId
                    ) =>
                      assignLead(
                        song.id,
                        memberId
                      )
                    }
                    onChangeKey={(key) =>
                      changeSongKey(
                        song.id,
                        key
                      )
                    }
                    onChangeNote={(note) =>
                      changeSongNote(
                        song.id,
                        note
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Weekly Learning                                                   */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen
                  size={18}
                  className="text-blue-300"
                />

                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
                  Weekly Preparation
                </p>
              </div>

              <h2 className="mt-1 text-2xl font-black tracking-tight">
                Weekly Ministration
              </h2>

              <p className="mt-1 text-xs text-white/35">
                Give members the songs they need to
                listen to and practise each week.
              </p>
            </div>

            {isMD && (
              <button
                type="button"
                onClick={createWeeklyLearning}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-black text-white transition hover:border-blue-400/20 hover:bg-blue-500/10"
              >
                <Plus size={16} />
                New Weekly Set
              </button>
            )}
          </div>

          {weeklyLearning.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-[#0d0f12] p-8 text-center sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                <Headphones size={24} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                No weekly set published
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/40">
                Create a weekly ministration and
                members will be able to listen to and
                download the selected songs.
              </p>

              {isMD && (
                <button
                  type="button"
                  onClick={createWeeklyLearning}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-400"
                >
                  <Plus size={15} />
                  Create Weekly Set
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0d0f12]">
              <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
                    <Headphones size={19} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-black">
                        {selectedWeekly?.title}
                      </h3>

                      <span className="rounded-full border border-green-400/15 bg-green-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-green-300">
                        Published
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-white/35">
                      {selectedWeekly?.weekLabel}
                      {' · '}
                      {weeklySongs.length}{' '}
                      {weeklySongs.length === 1
                        ? 'song'
                        : 'songs'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {weeklyLearning.map(
                    (week) => (
                      <button
                        key={week.id}
                        type="button"
                        onClick={() =>
                          setSelectedWeeklyId(
                            week.id
                          )
                        }
                        className={`rounded-xl px-3 py-2 text-[11px] font-bold transition ${
                          week.id ===
                          selectedWeekly?.id
                            ? 'bg-blue-500 text-white'
                            : 'border border-white/10 bg-white/[0.035] text-white/40 hover:bg-white/[0.06] hover:text-white/70'
                        }`}
                      >
                        {week.weekLabel}
                      </button>
                    )
                  )}

                  {isMD && selectedWeekly && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowWeeklyEditor(
                          true
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/45 transition hover:bg-white/[0.07] hover:text-white"
                      title="Edit weekly set"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              </div>

              {selectedWeekly?.description && (
                <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                  <p className="text-sm leading-6 text-white/45">
                    {selectedWeekly.description}
                  </p>
                </div>
              )}

              <div className="p-4 sm:p-5">
                {weeklySongs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                    <Music2
                      size={22}
                      className="mx-auto text-white/20"
                    />

                    <p className="mt-3 text-sm font-bold text-white/60">
                      No songs added yet
                    </p>

                    {isMD && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowWeeklySongModal(
                            true
                          )
                        }
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-3 py-2 text-xs font-bold text-white"
                      >
                        <Plus size={14} />
                        Add Songs
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {weeklySongs.map(
                      (song, index) => (
                        <WeeklySongCard
                          key={`${song.id}-${index}`}
                          song={song}
                          index={index}
                          isMD={isMD}
                          activeAudioId={
                            activeAudioId
                          }
                          onActiveAudioChange={
                            setActiveAudioId
                          }
                          onRemove={() =>
                            removeSongFromWeekly(
                              Number(song.id)
                            )
                          }
                          onMoveUp={() =>
                            moveWeeklySong(
                              index,
                              -1
                            )
                          }
                          onMoveDown={() =>
                            moveWeeklySong(
                              index,
                              1
                            )
                          }
                        />
                      )
                    )}
                  </div>
                )}

                {isMD && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowWeeklySongModal(
                        true
                      )
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-3 text-xs font-bold text-white/35 transition hover:border-blue-400/20 hover:bg-blue-500/[0.04] hover:text-blue-300"
                  >
                    <Plus size={15} />
                    Add Another Song
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Ministry brief                                                    */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-8 overflow-hidden rounded-[30px] border border-amber-400/10 bg-[#0e0e0d]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/15 bg-amber-500/10 text-amber-300">
                <Sparkles size={19} />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300/60">
                  Ministry Brief
                </p>

                <h2 className="mt-0.5 text-lg font-black">
                  MD Instructions
                </h2>
              </div>
            </div>

            {isMD && (
              <button
                type="button"
                onClick={() =>
                  setEditingBrief(
                    (previous) => !previous
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white/55 transition hover:bg-white/[0.07] hover:text-white"
              >
                {editingBrief ? (
                  <>
                    <Save size={14} />
                    Done
                  </>
                ) : (
                  <>
                    <Pencil size={14} />
                    Edit Brief
                  </>
                )}
              </button>
            )}
          </div>

          <div className="p-5 sm:p-6">
            {editingBrief && isMD ? (
              <textarea
                value={
                  currentMin.mdGlobalNotes ||
                  ''
                }
                onChange={(event) =>
                  updateCurrentMin({
                    mdGlobalNotes:
                      event.target.value,
                  })
                }
                rows={6}
                autoFocus
                placeholder="Add arrival instructions, dress code, sound check details, rehearsal notes and any other important ministry instructions..."
                className="w-full resize-none rounded-2xl border border-amber-400/15 bg-black/30 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-amber-400/30"
              />
            ) : currentMin.mdGlobalNotes ? (
              <div className="rounded-2xl border border-amber-400/10 bg-amber-500/[0.035] p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-white/60">
                  {currentMin.mdGlobalNotes}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center">
                <p className="text-sm text-white/35">
                  No MD instructions have been added
                  for this event yet.
                </p>

                {isMD && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingBrief(true)
                    }
                    className="mt-3 text-xs font-bold text-amber-300 hover:text-amber-200"
                  >
                    Add instructions
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Footer                                                             */}
        {/* ---------------------------------------------------------------- */}

        <footer className="border-t border-white/[0.06] pt-7 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-black tracking-wide text-white/30">
            <Music2 size={14} />
            Jewels Music Hub
          </div>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/15">
            MUSIC • EXCELLENCE • SERVICE
          </p>
        </footer>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Modals                                                               */}
      {/* ------------------------------------------------------------------ */}

      {showCreateModal &&
        renderCreateModal({
          onClose: () =>
            setShowCreateModal(false),
          onCreate: createMinistration,
        })}

      {showEditModal &&
        currentMin &&
        renderEditModal({
          ministration: currentMin,
          onClose: () =>
            setShowEditModal(false),
          onSave: (changes) => {
            updateCurrentMin(changes);
            setShowEditModal(false);
          },
        })}

      {showAddSongModal &&
        currentMin &&
        renderAddSongModal({
          songs: filteredSongs,
          search: songSearch,
          setSearch: setSongSearch,
          currentSetlist,
          onClose: () => {
            setShowAddSongModal(false);
            setSongSearch('');
          },
          onAdd: addSongToSetlist,
        })}

      {showWeeklyEditor &&
        selectedWeekly &&
        renderWeeklyEditorModal({
          weekly: selectedWeekly,
          onClose: () =>
            setShowWeeklyEditor(false),
          onSave: (changes) => {
            updateWeekly(changes);
            setShowWeeklyEditor(false);
          },
          onRemove: removeWeekly,
        })}

      {showWeeklySongModal &&
        selectedWeekly &&
        renderWeeklySongModal({
          songs: filteredWeeklySongs,
          search: weeklySongSearch,
          setSearch: setWeeklySongSearch,
          weeklySongIds:
            selectedWeekly.songIds,
          onClose: () => {
            setShowWeeklySongModal(false);
            setWeeklySongSearch('');
          },
          onAdd: addSongToWeekly,
        })}
    </div>
  );
};

export default MinistrationsView;

/* ========================================================================== */
/* Ambient background                                                         */
/* ========================================================================== */

const AmbientGlow: React.FC = () => (
  <>
    <div className="pointer-events-none absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-blue-600/[0.07] blur-[120px]" />
    <div className="pointer-events-none absolute right-[-180px] top-[30%] h-[420px] w-[420px] rounded-full bg-indigo-600/[0.045] blur-[120px]" />
    <div className="pointer-events-none absolute bottom-[-180px] left-[30%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.035] blur-[120px]" />
  </>
);

/* ========================================================================== */
/* Event card                                                                 */
/* ========================================================================== */

interface EventCardProps {
  ministration: Ministration;
  selected: boolean;
  onSelect: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  ministration,
  selected,
  onSelect,
}) => {
  const songCount =
    ministration.songs?.length || 0;

  const assigned =
    ministration.songs?.filter(
      (song) =>
        song.lead !== null &&
        song.lead !== undefined
    ).length || 0;

  const percentage =
    songCount > 0
      ? Math.round((assigned / songCount) * 100)
      : 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-[25px] border p-4 text-left transition duration-300 ${
        selected
          ? 'border-blue-400/30 bg-blue-500/[0.075] shadow-[0_0_35px_rgba(37,99,235,.08)]'
          : 'border-white/10 bg-[#0d0f12] hover:border-white/15 hover:bg-[#111317]'
      }`}
    >
      {selected && (
        <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,.8)]" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
              selected
                ? 'border-blue-400/20 bg-blue-500/10 text-blue-300'
                : 'border-white/10 bg-white/[0.035] text-white/35'
            }`}
          >
            <Calendar size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-white">
              {ministration.name}
            </h3>

            <p className="mt-1 truncate text-[11px] text-white/35">
              {safeDateLabel(
                ministration.date
              )}
            </p>
          </div>
        </div>

        {selected && (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20">
            <CheckCircle2 size={15} />
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <SmallMeta
          icon={<Clock size={12} />}
          value={
            ministration.time ||
            'No time'
          }
        />

        <SmallMeta
          icon={<MapPin size={12} />}
          value={
            ministration.venue ||
            'No venue'
          }
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="text-[10px] font-bold text-white/30">
          {songCount}{' '}
          {songCount === 1
            ? 'song'
            : 'songs'}
        </span>

        <span
          className={`text-[10px] font-black ${
            percentage === 100
              ? 'text-green-300'
              : 'text-white/35'
          }`}
        >
          {percentage}% assigned
        </span>
      </div>
    </button>
  );
};

/* ========================================================================== */
/* Stats                                                                      */
/* ========================================================================== */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: string;
  accent: 'blue' | 'violet' | 'green' | 'amber';
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  caption,
  accent,
  progress,
}) => {
  const accentClasses = {
    blue: 'bg-blue-500/10 text-blue-300 border-blue-400/15',
    violet:
      'bg-violet-500/10 text-violet-300 border-violet-400/15',
    green:
      'bg-green-500/10 text-green-300 border-green-400/15',
    amber:
      'bg-amber-500/10 text-amber-300 border-amber-400/15',
  };

  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0d0f12] p-5 transition duration-300 hover:border-white/15 hover:bg-[#101216]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accentClasses[accent]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-2 line-clamp-1 text-[11px] text-white/35">
        {caption}
      </p>

      {typeof progress === 'number' && (
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-blue-400 transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                Math.max(0, progress)
              )}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};

/* ========================================================================== */
/* Setlist card                                                               */
/* ========================================================================== */

interface SetlistCardProps {
  item: SetlistSongItem;
  song: Song;
  index: number;
  isMD: boolean;
  expanded: boolean;
  leadMember?: TeamMember;
  vocalMembers: TeamMember[];

  activeAudioId: string | null;
  onActiveAudioChange: (
    id: string | null
  ) => void;

  onToggle: () => void;
  onSelectSong: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onAssignLead: (
    memberId: number | null
  ) => void;
  onChangeKey: (key: string) => void;
  onChangeNote: (note: string) => void;
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
  activeAudioId,
  onActiveAudioChange,
  onToggle,
  onSelectSong,
  onMoveUp,
  onMoveDown,
  onRemove,
  onAssignLead,
  onChangeKey,
  onChangeNote,
}) => {
  const audioUrl = getSongAudioUrl(song);

  const title =
    String(
      (song as any).title ||
        (song as any).name ||
        'Untitled Song'
    );

  const category =
    (song as any).category ||
    (song as any).genre ||
    'Song';

  const bpm =
    (song as any).bpm ||
    (song as any).tempo;

  const originalKey =
    (song as any).key || 'G';

  const currentKey =
    item.keyOverride || originalKey;

  const playerId = `setlist-${song.id}`;

  return (
    <article
      className={`overflow-hidden rounded-[26px] border transition duration-300 ${
        expanded
          ? 'border-blue-400/25 bg-[#111419] shadow-[0_10px_40px_rgba(0,0,0,.3)]'
          : 'border-white/10 bg-[#0d0f12] hover:border-white/15'
      }`}
    >
      <div className="flex items-stretch">
        <div className="flex w-12 shrink-0 flex-col items-center justify-center border-r border-white/[0.06] bg-white/[0.015] sm:w-14">
          <span className="text-[10px] font-black text-white/25">
            {String(index + 1).padStart(
              2,
              '0'
            )}
          </span>

          {expanded && (
            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,.8)]" />
          )}
        </div>

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={onToggle}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
                  expanded
                    ? 'border-blue-400/20 bg-blue-500/10 text-blue-300'
                    : 'border-white/10 bg-white/[0.035] text-white/45 hover:text-white'
                }`}
              >
                {expanded ? (
                  <ChevronDown size={19} />
                ) : (
                  <ChevronRight size={19} />
                )}
              </button>

              <div className="min-w-0">
                <button
                  type="button"
                  onClick={onToggle}
                  className="block max-w-full truncate text-left text-sm font-black text-white sm:text-base"
                >
                  {title}
                </button>

                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] font-bold text-white/30">
                  <span>
                    {category}
                  </span>

                  <span className="text-white/10">
                    •
                  </span>

                  <span>
                    Key {currentKey}
                  </span>

                  {bpm && (
                    <>
                      <span className="text-white/10">
                        •
                      </span>

                      <span>
                        {bpm} BPM
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2">
                <Mic2
                  size={13}
                  className={
                    leadMember
                      ? 'text-blue-300'
                      : 'text-white/25'
                  }
                />

                <span
                  className={`max-w-[140px] truncate text-[10px] font-bold ${
                    leadMember
                      ? 'text-white/70'
                      : 'text-white/30'
                  }`}
                >
                  {leadMember
                    ? (leadMember as any)
                        .name ||
                      (leadMember as any)
                        .fullName ||
                      'Assigned'
                    : 'Lead not assigned'}
                </span>
              </div>

              {audioUrl && (
                <AudioPlayer
                  playerId={playerId}
                  src={audioUrl}
                  activePlayerId={
                    activeAudioId
                  }
                  onActiveChange={
                    onActiveAudioChange
                  }
                  compact
                />
              )}
            </div>
          </div>

          {expanded && (
            <div className="mt-5 border-t border-white/[0.07] pt-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300/60">
                        Song Arrangement
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        Prepare the team for this
                        performance.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onSelectSong}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-bold text-white/50 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <Eye size={13} />
                      Song Details
                    </button>
                  </div>

                  {audioUrl ? (
                    <AudioPlayer
                      playerId={`${playerId}-expanded`}
                      src={audioUrl}
                      activePlayerId={
                        activeAudioId
                      }
                      onActiveChange={
                        onActiveAudioChange
                      }
                    />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-xs text-white/30">
                      No audio file is attached
                      to this song.
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <ControlField label="Lead Vocalist">
                    <select
                      disabled={!isMD}
                      value={
                        item.lead === null ||
                        item.lead === undefined
                          ? ''
                          : String(item.lead)
                      }
                      onChange={(event) =>
                        onAssignLead(
                          event.target.value
                            ? Number(
                                event.target
                                  .value
                              )
                            : null
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-400/30 disabled:opacity-60"
                    >
                      <option
                        value=""
                        className="bg-[#111]"
                      >
                        Not assigned
                      </option>

                      {vocalMembers.map(
                        (member) => (
                          <option
                            key={member.id}
                            value={member.id}
                            className="bg-[#111]"
                          >
                            {(member as any)
                              .name ||
                              (member as any)
                                .fullName ||
                              `Member ${member.id}`}
                          </option>
                        )
                      )}
                    </select>
                  </ControlField>

                  <ControlField label="Performance Key">
                    <select
                      disabled={!isMD}
                      value={currentKey}
                      onChange={(event) =>
                        onChangeKey(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-400/30 disabled:opacity-60"
                    >
                      {CHROMATIC_KEYS.map(
                        (key) => (
                          <option
                            key={key}
                            value={key}
                            className="bg-[#111]"
                          >
                            {key}
                          </option>
                        )
                      )}
                    </select>
                  </ControlField>

                  <ControlField label="Transition Cue">
                    <input
                      disabled={!isMD}
                      value={
                        item.orderNote || ''
                      }
                      onChange={(event) =>
                        onChangeNote(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Go straight into chorus..."
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-xs font-medium text-white outline-none placeholder:text-white/20 focus:border-blue-400/30 disabled:opacity-60"
                    />
                  </ControlField>
                </div>
              </div>

              {isMD && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onMoveUp}
                      disabled={index === 0}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/45 transition hover:bg-white/[0.07] hover:text-white disabled:pointer-events-none disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={onMoveDown}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/45 transition hover:bg-white/[0.07] hover:text-white disabled:pointer-events-none disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onRemove}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-500/[0.05] px-3 py-2 text-[10px] font-bold text-red-300/70 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 size={13} />
                    Remove from Setlist
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

/* ========================================================================== */
/* Weekly song card                                                           */
/* ========================================================================== */

interface WeeklySongCardProps {
  song: Song;
  index: number;
  isMD: boolean;

  activeAudioId: string | null;
  onActiveAudioChange: (
    id: string | null
  ) => void;

  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const WeeklySongCard: React.FC<
  WeeklySongCardProps
> = ({
  song,
  index,
  isMD,
  activeAudioId,
  onActiveAudioChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const audioUrl = getSongAudioUrl(song);

  const title =
    String(
      (song as any).title ||
        (song as any).name ||
        'Untitled Song'
    );

  const category =
    (song as any).category ||
    (song as any).genre ||
    'Song';

  const playerId = `weekly-${song.id}`;

  return (
    <div className="rounded-[23px] border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/15 hover:bg-white/[0.03]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-[10px] font-black text-white/30">
            {String(index + 1).padStart(
              2,
              '0'
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-white">
              {title}
            </h3>

            <p className="mt-1 text-[10px] font-bold text-white/30">
              {category}
            </p>
          </div>
        </div>

        {isMD && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={index === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/30 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-20"
            >
              <ArrowUp size={13} />
            </button>

            <button
              type="button"
              onClick={onMoveDown}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/30 transition hover:bg-white/[0.05] hover:text-white"
            >
              <ArrowDown size={13} />
            </button>

            <button
              type="button"
              onClick={onRemove}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/10 text-red-300/50 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-4">
        {audioUrl ? (
          <AudioPlayer
            playerId={playerId}
            src={audioUrl}
            activePlayerId={activeAudioId}
            onActiveChange={
              onActiveAudioChange
            }
          />
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-3">
            <Music2
              size={16}
              className="text-white/20"
            />

            <span className="text-xs text-white/30">
              Audio not available for this song.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ========================================================================== */
/* Audio player                                                               */
/* ========================================================================== */

interface AudioPlayerProps {
  playerId: string;
  src: string;

  activePlayerId: string | null;
  onActiveChange: (
    id: string | null
  ) => void;

  compact?: boolean;
}

const AudioPlayer: React.FC<
  AudioPlayerProps
> = ({
  playerId,
  src,
  activePlayerId,
  onActiveChange,
  compact = false,
}) => {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(1);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0
      );
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);

      if (
        activePlayerId === playerId
      ) {
        onActiveChange(null);
      }
    };

    audio.addEventListener(
      'timeupdate',
      handleTimeUpdate
    );

    audio.addEventListener(
      'loadedmetadata',
      handleLoadedMetadata
    );

    audio.addEventListener(
      'ended',
      handleEnded
    );

    return () => {
      audio.removeEventListener(
        'timeupdate',
        handleTimeUpdate
      );

      audio.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata
      );

      audio.removeEventListener(
        'ended',
        handleEnded
      );
    };
  }, [
    activePlayerId,
    onActiveChange,
    playerId,
  ]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (
      activePlayerId !== playerId &&
      !audio.paused
    ) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [activePlayerId, playerId]);

  useEffect(() => {
    if (!src) return;

    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    setIsPlaying(false);
    setCurrentTime(0);
  }, [src]);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !src) return;

    if (audio.paused) {
      onActiveChange(playerId);

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error(
          'Unable to play audio:',
          error
        );

        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);

      if (
        activePlayerId === playerId
      ) {
        onActiveChange(null);
      }
    }
  };

  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      Number(event.target.value);

    if (!audioRef.current) return;

    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolume = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      Number(event.target.value);

    if (!audioRef.current) return;

    audioRef.current.volume = value;
    setVolume(value);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (volume > 0) {
      audioRef.current.volume = 0;
      setVolume(0);
    } else {
      audioRef.current.volume = 1;
      setVolume(1);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
        />

        <button
          type="button"
          onClick={togglePlay}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
            isPlaying
              ? 'border-blue-400/25 bg-blue-500/15 text-blue-300'
              : 'border-white/10 bg-white/[0.035] text-white/45 hover:bg-white/[0.07] hover:text-white'
          }`}
          title={
            isPlaying
              ? 'Pause'
              : 'Play'
          }
        >
          {isPlaying ? (
            <Pause size={14} />
          ) : (
            <Play size={14} className="ml-0.5" />
          )}
        </button>

        {isPlaying && (
          <div className="hidden w-20 items-center gap-1 sm:flex">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-blue-400"
                style={{
                  width: `${
                    duration
                      ? Math.min(
                          100,
                          (currentTime /
                            duration) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
            isPlaying
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'border border-white/10 bg-white/[0.05] text-white/70 hover:bg-white/[0.08] hover:text-white'
          }`}
        >
          {isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play
              size={16}
              className="ml-0.5"
            />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(
              currentTime,
              duration || 0
            )}
            onChange={handleSeek}
            className="h-1.5 w-full cursor-pointer accent-blue-500"
          />

          <div className="mt-1 flex items-center justify-between text-[9px] font-bold text-white/25">
            <span>
              {formatTime(currentTime)}
            </span>

            <span>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={toggleMute}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/[0.05] hover:text-white"
          >
            {volume === 0 ? (
              <VolumeX size={15} />
            ) : volume < 0.5 ? (
              <Volume1 size={15} />
            ) : (
              <Volume2 size={15} />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
            className="w-16 cursor-pointer accent-blue-500"
          />
        </div>

        <a
          href={src}
          download
          target="_blank"
          rel="noreferrer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/[0.05] hover:text-white"
          title="Download audio"
        >
          <Download size={15} />
        </a>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[9px] font-bold text-white/20 sm:hidden">
        <button
          type="button"
          onClick={toggleMute}
          className="inline-flex items-center gap-1"
        >
          {volume === 0 ? (
            <VolumeX size={12} />
          ) : (
            <Volume2 size={12} />
          )}
          Volume
        </button>

        <span>•</span>

        <span>
          {isPlaying
            ? 'Playing'
            : 'Ready'}
        </span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* Small components                                                           */
/* ========================================================================== */

interface MetaItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const MetaItem: React.FC<
  MetaItemProps
> = ({
  icon,
  label,
  value,
}) => (
  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
    <div className="flex items-center gap-2 text-white/25">
      {icon}

      <span className="text-[9px] font-black uppercase tracking-[0.15em]">
        {label}
      </span>
    </div>

    <p className="mt-2 truncate text-xs font-bold text-white/70">
      {value}
    </p>
  </div>
);

interface SmallMetaProps {
  icon: React.ReactNode;
  value: string;
}

const SmallMeta: React.FC<
  SmallMetaProps
> = ({
  icon,
  value,
}) => (
  <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
    <span className="shrink-0 text-white/20">
      {icon}
    </span>

    <span className="truncate text-[10px] font-bold text-white/35">
      {value}
    </span>
  </div>
);

interface ControlFieldProps {
  label: string;
  children: React.ReactNode;
}

const ControlField: React.FC<
  ControlFieldProps
> = ({
  label,
  children,
}) => (
  <label className="block">
    <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
      {label}
    </span>

    {children}
  </label>
);

/* ========================================================================== */
/* Modal helpers                                                              */
/* ========================================================================== */

interface ModalShellProps {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}

const ModalShell: React.FC<
  ModalShellProps
> = ({
  children,
  onClose,
  maxWidth = 'max-w-xl',
}) => (
  <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-5">
    <div
      className={`relative max-h-[92vh] w-full ${maxWidth} overflow-hidden rounded-t-[30px] border border-white/10 bg-[#0d0f12] shadow-2xl shadow-black/60 sm:rounded-[30px]`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/40 transition hover:bg-white/[0.08] hover:text-white"
      >
        <X size={16} />
      </button>

      {children}
    </div>
  </div>
);

interface ModalHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ModalHeader: React.FC<
  ModalHeaderProps
> = ({
  icon,
  title,
  description,
}) => (
  <div className="border-b border-white/10 p-6 pr-16">
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-black">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-white/35">
          {description}
        </p>
      </div>
    </div>
  </div>
);

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
}

const FormField: React.FC<
  FormFieldProps
> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => (
  <label className="block">
    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-white/30">
      {label}
    </span>

    <input
      type={type}
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      placeholder={placeholder}
      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-medium text-white outline-none placeholder:text-white/20 focus:border-blue-400/30 focus:bg-black/35"
    />
  </label>
);

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  rows?: number;
}

const FormTextarea: React.FC<
  FormTextareaProps
> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}) => (
  <label className="block">
    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-white/30">
      {label}
    </span>

    <textarea
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-blue-400/30 focus:bg-black/35"
    />
  </label>
);

/* ========================================================================== */
/* Create modal                                                               */
/* ========================================================================== */

interface CreateModalProps {
  onClose: () => void;
  onCreate: (form: {
    name: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    theme: string;
    status: string;
  }) => void;
}

const renderCreateModal = ({
  onClose,
  onCreate,
}: CreateModalProps) => {
  return (
    <CreateModal
      onClose={onClose}
      onCreate={onCreate}
    />
  );
};

const CreateModal: React.FC<
  CreateModalProps
> = ({
  onClose,
  onCreate,
}) => {
  const [form, setForm] = useState({
    name: 'Sunday Service',
    description: '',
    date: '',
    time: '',
    venue: '',
    theme: '',
    status: 'upcoming',
  });

  const update = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader
        icon={<CalendarPlus size={19} />}
        title="Create Ministration"
        description="Create a new service or ministry event."
      />

      <div className="max-h-[65vh] space-y-4 overflow-y-auto p-6">
        <FormField
          label="Event Name"
          value={form.name}
          onChange={(value) =>
            update('name', value)
          }
          placeholder="e.g. Sunday Service"
        />

        <FormTextarea
          label="Description"
          value={form.description}
          onChange={(value) =>
            update('description', value)
          }
          placeholder="Describe the ministration..."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Date"
            type="date"
            value={form.date}
            onChange={(value) =>
              update('date', value)
            }
          />

          <FormField
            label="Time"
            type="time"
            value={form.time}
            onChange={(value) =>
              update('time', value)
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Venue"
            value={form.venue}
            onChange={(value) =>
              update('venue', value)
            }
            placeholder="Main Worship Auditorium"
          />

          <FormField
            label="Theme"
            value={form.theme}
            onChange={(value) =>
              update('theme', value)
            }
            placeholder="Optional"
          />
        </div>

        <label className="block">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-white/30">
            Status
          </span>

          <select
            value={form.status}
            onChange={(event) =>
              update(
                'status',
                event.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-medium text-white outline-none focus:border-blue-400/30"
          >
            <option
              value="upcoming"
              className="bg-[#111]"
            >
              Upcoming
            </option>
            <option
              value="preparing"
              className="bg-[#111]"
            >
              Preparing
            </option>
            <option
              value="live"
              className="bg-[#111]"
            >
              Live
            </option>
            <option
              value="completed"
              className="bg-[#111]"
            >
              Completed
            </option>
          </select>
        </label>
      </div>

      <div className="flex gap-2 border-t border-white/10 p-5">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white/55 transition hover:bg-white/[0.07] hover:text-white"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => onCreate(form)}
          className="flex-1 rounded-2xl bg-blue-500 px-4 py-3 text-xs font-black text-white shadow-lg shadow-blue-500/15 transition hover:bg-blue-400"
        >
          Create Event
        </button>
      </div>
    </ModalShell>
  );
};

/* ========================================================================== */
/* Edit event modal                                                           */
/* ========================================================================== */

interface EditModalProps {
  ministration: Ministration;
  onClose: () => void;
  onSave: (
    changes: Partial<Ministration>
  ) => void;
}

const renderEditModal = ({
  ministration,
  onClose,
  onSave,
}: EditModalProps) => (
  <EditModal
    ministration={ministration}
    onClose={onClose}
    onSave={onSave}
  />
);

const EditModal: React.FC<
  EditModalProps
> = ({
  ministration,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({
    name: ministration.name || '',
    description:
      ministration.description || '',
    date: ministration.date || '',
    time: ministration.time || '',
    venue: ministration.venue || '',
    theme: ministration.theme || '',
    status:
      ministration.status || 'upcoming',
  });

  const update = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader
        icon={<Settings2 size={19} />}
        title="Edit Event Details"
        description="Update the information members see for this ministration."
      />

      <div className="max-h-[65vh] space-y-4 overflow-y-auto p-6">
        <FormField
          label="Event Name"
          value={form.name}
          onChange={(value) =>
            update('name', value)
          }
        />

        <FormTextarea
          label="Description"
          value={form.description}
          onChange={(value) =>
            update('description', value)
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Date"
            type="date"
            value={form.date}
            onChange={(value) =>
              update('date', value)
            }
          />

          <FormField
            label="Time"
            type="time"
            value={form.time}
            onChange={(value) =>
              update('time', value)
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Venue"
            value={form.venue}
            onChange={(value) =>
              update('venue', value)
            }
          />

          <FormField
            label="Theme"
            value={form.theme}
            onChange={(value) =>
              update('theme', value)
            }
          />
        </div>

        <label className="block">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-white/30">
            Status
          </span>

          <select
            value={form.status}
            onChange={(event) =>
              update(
                'status',
                event.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-medium text-white outline-none focus:border-blue-400/30"
          >
            <option
              value="upcoming"
              className="bg-[#111]"
            >
              Upcoming
            </option>
            <option
              value="preparing"
              className="bg-[#111]"
            >
              Preparing
            </option>
            <option
              value="live"
              className="bg-[#111]"
            >
              Live
            </option>
            <option
              value="completed"
              className="bg-[#111]"
            >
              Completed
            </option>
          </select>
        </label>
      </div>

      <div className="flex gap-2 border-t border-white/10 p-5">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white/55 transition hover:bg-white/[0.07] hover:text-white"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => onSave(form)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-xs font-black text-white shadow-lg shadow-blue-500/15 transition hover:bg-blue-400"
        >
          <Save size={15} />
          Save Changes
        </button>
      </div>
    </ModalShell>
  );
};

/* ========================================================================== */
/* Add song modal                                                             */
/* ========================================================================== */

interface AddSongModalProps {
  songs: Song[];
  search: string;
  setSearch: (
    value: string
  ) => void;
  currentSetlist: SetlistSongItem[];
  onClose: () => void;
  onAdd: (song: Song) => void;
}

const renderAddSongModal = (
  props: AddSongModalProps
) => (
  <AddSongModal {...props} />
);

const AddSongModal: React.FC<
  AddSongModalProps
> = ({
  songs,
  search,
  setSearch,
  currentSetlist,
  onClose,
  onAdd,
}) => {
  return (
    <ModalShell
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <ModalHeader
        icon={<Plus size={19} />}
        title="Add Song to Setlist"
        description="Choose a song from the Song Bank."
      />

      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3">
          <Search
            size={16}
            className="text-white/25"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search songs..."
            className="h-11 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
            autoFocus
          />
        </div>
      </div>

      <div className="max-h-[52vh] overflow-y-auto p-4">
        {songs.length === 0 ? (
          <div className="p-10 text-center text-sm text-white/30">
            No matching songs found.
          </div>
        ) : (
          <div className="space-y-2">
            {songs.map((song) => {
              const exists =
                currentSetlist.some(
                  (item) =>
                    String(item.songId) ===
                    String(song.id)
                );

              const title =
                String(
                  (song as any).title ||
                    (song as any).name ||
                    'Untitled Song'
                );

              const category =
                (song as any).category ||
                (song as any).genre ||
                'Song';

              return (
                <button
                  key={song.id}
                  type="button"
                  disabled={exists}
                  onClick={() =>
                    onAdd(song)
                  }
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    exists
                      ? 'cursor-not-allowed border-white/[0.05] bg-white/[0.015] opacity-40'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-blue-400/20 hover:bg-blue-500/[0.05]'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <Music2 size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">
                      {title}
                    </p>

                    <p className="mt-1 text-[10px] text-white/30">
                      {category}
                    </p>
                  </div>

                  <span className="shrink-0 text-[10px] font-bold">
                    {exists ? (
                      <span className="text-green-300/70">
                        Added
                      </span>
                    ) : (
                      <span className="text-blue-300">
                        Add
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </ModalShell>
  );
};

/* ========================================================================== */
/* Weekly editor modal                                                        */
/* ========================================================================== */

interface WeeklyEditorModalProps {
  weekly: WeeklyLearning;
  onClose: () => void;
  onSave: (
    changes: Partial<WeeklyLearning>
  ) => void;
  onRemove: () => void;
}

const renderWeeklyEditorModal = (
  props: WeeklyEditorModalProps
) => (
  <WeeklyEditorModal {...props} />
);

const WeeklyEditorModal: React.FC<
  WeeklyEditorModalProps
> = ({
  weekly,
  onClose,
  onSave,
  onRemove,
}) => {
  const [form, setForm] = useState({
    title: weekly.title,
    weekLabel: weekly.weekLabel,
    description: weekly.description,
  });

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader
        icon={<BookOpen size={19} />}
        title="Edit Weekly Set"
        description="Update the weekly preparation information."
      />

      <div className="space-y-4 p-6">
        <FormField
          label="Title"
          value={form.title}
          onChange={(value) =>
            setForm((previous) => ({
              ...previous,
              title: value,
            }))
          }
        />

        <FormField
          label="Week Label"
          value={form.weekLabel}
          onChange={(value) =>
            setForm((previous) => ({
              ...previous,
              weekLabel: value,
            }))
          }
        />

        <FormTextarea
          label="Instructions"
          value={form.description}
          onChange={(value) =>
            setForm((previous) => ({
              ...previous,
              description: value,
            }))
          }
          rows={5}
          placeholder="Tell the ministry what to focus on this week..."
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 p-5 sm:flex-row">
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/10 bg-red-500/[0.04] px-4 py-3 text-xs font-bold text-red-300/70 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <Trash2 size={14} />
          Remove Weekly Set
        </button>

        <div className="flex flex-1 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white/50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              onSave(form)
            }
            className="flex-1 rounded-2xl bg-blue-500 px-4 py-3 text-xs font-black text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

/* ========================================================================== */
/* Weekly song modal                                                          */
/* ========================================================================== */

interface WeeklySongModalProps {
  songs: Song[];
  search: string;
  setSearch: (
    value: string
  ) => void;
  weeklySongIds: number[];
  onClose: () => void;
  onAdd: (song: Song) => void;
}

const renderWeeklySongModal = (
  props: WeeklySongModalProps
) => (
  <WeeklySongModal {...props} />
);

const WeeklySongModal: React.FC<
  WeeklySongModalProps
> = ({
  songs,
  search,
  setSearch,
  weeklySongIds,
  onClose,
  onAdd,
}) => (
  <ModalShell
    onClose={onClose}
    maxWidth="max-w-2xl"
  >
    <ModalHeader
      icon={<Headphones size={19} />}
      title="Add Weekly Songs"
      description="Publish songs for members to listen to and practise."
    />

    <div className="border-b border-white/10 p-5">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3">
        <Search
          size={16}
          className="text-white/25"
        />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search songs..."
          className="h-11 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
          autoFocus
        />
      </div>
    </div>

    <div className="max-h-[52vh] overflow-y-auto p-4">
      {songs.length === 0 ? (
        <div className="p-10 text-center text-sm text-white/30">
          No matching songs found.
        </div>
      ) : (
        <div className="space-y-2">
          {songs.map((song) => {
            const exists =
              weeklySongIds.some(
                (id) =>
                  Number(id) ===
                  Number(song.id)
              );

            const title =
              String(
                (song as any).title ||
                  (song as any).name ||
                  'Untitled Song'
              );

            const category =
              (song as any).category ||
              (song as any).genre ||
              'Song';

            return (
              <button
                key={song.id}
                type="button"
                disabled={exists}
                onClick={() =>
                  onAdd(song)
                }
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  exists
                    ? 'cursor-not-allowed border-white/[0.05] bg-white/[0.015] opacity-40'
                    : 'border-white/[0.07] bg-white/[0.02] hover:border-blue-400/20 hover:bg-blue-500/[0.05]'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <Music2 size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {title}
                  </p>

                  <p className="mt-1 text-[10px] text-white/30">
                    {category}
                  </p>
                </div>

                <span className="text-[10px] font-bold">
                  {exists ? (
                    <span className="text-green-300/70">
                      Added
                    </span>
                  ) : (
                    <span className="text-blue-300">
                      Add
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  </ModalShell>
);
