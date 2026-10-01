import React, { useMemo, useRef, useState } from 'react';
import { TeamMember, ActiveRole } from '../types';
import {
  Phone,
  Mail,
  Edit,
  Trash2,
  ShieldCheck,
  UserPlus,
  Camera,
  Image as ImageIcon,
  Users,
  Mic2,
  Piano,
  Music2,
  Lock,
  ChevronRight,
  Search,
  Crown,
  CheckCircle2,
  UserRound,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';

interface MusicTeamViewProps {
  team: TeamMember[];
  activeRole: ActiveRole;
  onAddNewMember: () => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: number) => void;
  onTogglePermission: (memberId: number) => void;
  onPhotoSelected?: (member: TeamMember, file: File) => void;
}

type FilterType = 'all' | 'vocal' | 'instrument' | 'director';

export const MusicTeamView: React.FC<MusicTeamViewProps> = ({
  team,
  activeRole,
  onAddNewMember,
  onEditMember,
  onDeleteMember,
  onTogglePermission,
  onPhotoSelected,
}) => {
  const [activeFilter, setActiveFilter] =
    useState<FilterType>('all');

  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [photoTarget, setPhotoTarget] =
    useState<TeamMember | null>(null);

  const [showPhotoTip, setShowPhotoTip] =
    useState(false);

  const isMD = activeRole === 'admin_md';

  /* --------------------------------------------------
     TEAM COUNTS
  -------------------------------------------------- */

  const directors = team.filter(
    member => member.type === 'director'
  );

  const vocalists = team.filter(
    member => member.type === 'vocal'
  );

  const instrumentalists = team.filter(
    member => member.type === 'instrument'
  );

  const uploadEnabledCount = team.filter(
    member => member.canEdit
  ).length;

  /* --------------------------------------------------
     SEARCH + FILTER
  -------------------------------------------------- */

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return team.filter(member => {
      const matchesFilter =
        activeFilter === 'all' ||
        member.type === activeFilter;

      if (!matchesFilter) return false;

      if (!query) return true;

      return [
        member.name,
        member.role,
        member.voicePart,
        member.instrumentType,
        member.phone,
        member.email,
      ]
        .filter(Boolean)
        .some(value =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });
  }, [
    team,
    activeFilter,
    searchQuery,
  ]);

  const filteredDirectors = filteredMembers.filter(
    member => member.type === 'director'
  );

  const filteredVocalists = filteredMembers.filter(
    member => member.type === 'vocal'
  );

  const filteredInstrumentalists =
    filteredMembers.filter(
      member => member.type === 'instrument'
    );

  /* --------------------------------------------------
     PHOTO HANDLING
  -------------------------------------------------- */

  const handlePhotoClick = (member: TeamMember) => {
    if (!isMD) return;

    setPhotoTarget(member);
    setShowPhotoTip(true);

    window.setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !photoTarget) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    onPhotoSelected?.(
      photoTarget,
      file
    );

    event.target.value = '';
    setPhotoTarget(null);
    setShowPhotoTip(false);
  };

  /* --------------------------------------------------
     PHOTO
  -------------------------------------------------- */

  const renderMemberPhoto = (
    member: TeamMember,
    variant: 'director' | 'vocal' | 'instrument'
  ) => {
    const isDirector =
      variant === 'director';

    return (
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() =>
            handlePhotoClick(member)
          }
          disabled={!isMD}
          title={
            isMD
              ? `Change photo for ${member.name}`
              : `${member.name}'s profile photo`
          }
          className={`
            group relative flex h-[72px] w-[72px]
            items-center justify-center overflow-hidden
            rounded-[24px] border
            shadow-xl transition-all duration-300
            ${
              isDirector
                ? 'border-amber-400/25 bg-amber-400/10 shadow-amber-500/10'
                : 'border-[#4da3ff]/15 bg-[#007aff]/10 shadow-blue-500/10'
            }
            ${
              isMD
                ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#4da3ff]/50 hover:shadow-blue-500/20'
                : 'cursor-default'
            }
          `}
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : member.icon ? (
            <span className="text-3xl">
              {member.icon}
            </span>
          ) : (
            <UserRound
              className={`h-7 w-7 ${
                isDirector
                  ? 'text-amber-300/60'
                  : 'text-[#4da3ff]/60'
              }`}
            />
          )}

          {isMD && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/45">
              <div className="flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <Camera className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
        </button>

        {isMD && (
          <div className="pointer-events-none absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-black bg-[#15171c] shadow-xl">
            <Camera className="h-3 w-3 text-[#4da3ff]" />
          </div>
        )}
      </div>
    );
  };

  /* --------------------------------------------------
     CONTACT
  -------------------------------------------------- */

  const renderContactInfo = (
    member: TeamMember
  ) => {
    if (!member.phone && !member.email) {
      return (
        <div className="pt-3 text-[11px] font-medium text-white/20">
          No contact information added
        </div>
      );
    }

    return (
      <div className="space-y-2.5 pt-3">
        {member.phone && (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-[#007aff]/10 bg-[#007aff]/10">
              <Phone className="h-3 w-3 text-[#4da3ff]" />
            </div>

            <span className="truncate text-xs font-medium text-white/45">
              {member.phone}
            </span>
          </div>
        )}

        {member.email && (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <Mail className="h-3 w-3 text-white/45" />
            </div>

            <span className="truncate text-xs font-medium text-white/45">
              {member.email}
            </span>
          </div>
        )}
      </div>
    );
  };

  /* --------------------------------------------------
     ACTIONS
  -------------------------------------------------- */

  const renderMemberActions = (
    member: TeamMember,
    allowDelete: boolean
  ) => {
    if (!isMD) return null;

    return (
      <div className="flex flex-shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() =>
            onEditMember(member)
          }
          title="Edit member"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/40 transition-all hover:border-[#007aff]/30 hover:bg-[#007aff]/10 hover:text-[#4da3ff] active:scale-95"
        >
          <Edit className="h-3.5 w-3.5" />
        </button>

        {allowDelete && (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  `Remove ${member.name} from the ${
                    member.type === 'vocal'
                      ? 'vocal'
                      : 'band'
                  } roster?`
                )
              ) {
                onDeleteMember(member.id);
              }
            }}
            title="Delete member"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/40 transition-all hover:border-rose-500/25 hover:bg-rose-500/10 hover:text-rose-300 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  };

  /* --------------------------------------------------
     PERMISSION
  -------------------------------------------------- */

  const renderPermissionButton = (
    member: TeamMember
  ) => {
    if (!isMD) return null;

    return (
      <button
        type="button"
        onClick={() =>
          onTogglePermission(member.id)
        }
        className={`
          flex items-center gap-1.5
          rounded-xl border px-2.5 py-1.5
          text-[9px] font-extrabold
          uppercase tracking-[0.08em]
          transition-all active:scale-95
          ${
            member.canEdit
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15'
              : 'border-white/10 bg-white/[0.035] text-white/35 hover:bg-white/[0.07] hover:text-white/70'
          }
        `}
      >
        <ShieldCheck className="h-3 w-3" />

        {member.canEdit
          ? 'Upload Access'
          : 'Grant Uploads'}
      </button>
    );
  };

  /* --------------------------------------------------
     FILTER BUTTON
  -------------------------------------------------- */

  const filterClass = (
    active: boolean,
    amber = false
  ) =>
    active
      ? amber
        ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
        : 'bg-[#007aff] text-white shadow-lg shadow-blue-500/25'
      : 'bg-transparent text-white/40 hover:bg-white/[0.07] hover:text-white';

  /* --------------------------------------------------
     SECTION HEADER
  -------------------------------------------------- */

  const renderSectionHeader = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    count: number,
    accent: 'blue' | 'amber'
  ) => (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`
            flex h-11 w-11 flex-shrink-0
            items-center justify-center
            rounded-2xl border
            ${
              accent === 'amber'
                ? 'border-amber-400/20 bg-amber-400/10'
                : 'border-[#007aff]/20 bg-[#007aff]/10'
            }
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-extrabold tracking-tight text-white sm:text-xl">
            {title}
          </h2>

          <p className="mt-0.5 truncate text-[11px] font-medium text-white/25">
            {subtitle}
          </p>
        </div>
      </div>

      <span
        className={`
          flex-shrink-0 rounded-full border px-3 py-1.5
          text-[9px] font-extrabold uppercase tracking-[0.12em]
          ${
            accent === 'amber'
              ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
              : 'border-white/10 bg-white/[0.035] text-white/40'
          }
        `}
      >
        {count} {count === 1 ? 'Member' : 'Members'}
      </span>
    </div>
  );

  /* --------------------------------------------------
     MEMBER CARD
  -------------------------------------------------- */

  const renderMemberCard = (
    member: TeamMember,
    variant: 'vocal' | 'instrument'
  ) => {
    const isVocal =
      variant === 'vocal';

    return (
      <article
        key={member.id}
        className="
          group relative overflow-hidden
          rounded-[28px] border border-white/10
          bg-[#15161a]/90 p-5
          shadow-xl shadow-black/10
          backdrop-blur-2xl
          transition-all duration-300
          hover:-translate-y-1
          hover:border-[#4da3ff]/25
          hover:bg-[#181a1f]
          hover:shadow-2xl hover:shadow-blue-950/20
        "
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#007aff]/[0.07] blur-3xl transition-opacity duration-300 group-hover:bg-[#007aff]/[0.12]" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-20 w-32 rounded-full bg-[#007aff]/[0.035] blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {renderMemberPhoto(
                member,
                variant
              )}

              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-extrabold text-white sm:text-base">
                  {member.name}
                </h3>

                <p className="mt-1 truncate text-xs font-semibold text-[#4da3ff]">
                  {isVocal
                    ? member.voicePart ||
                      member.role ||
                      'Vocalist'
                    : member.instrumentType ||
                      member.role ||
                      'Musician'}
                </p>
              </div>
            </div>

            {renderMemberActions(
              member,
              true
            )}
          </div>

          {renderContactInfo(member)}

          <div className="mt-5 border-t border-white/[0.07] pt-3.5">
            <div className="flex min-h-[30px] items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-[#007aff]/15 bg-[#007aff]/10 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#4da3ff]">
                {isVocal ? (
                  <Mic2 className="h-3 w-3" />
                ) : (
                  <Piano className="h-3 w-3" />
                )}

                {isVocal
                  ? member.voicePart ||
                    'Vocal Section'
                  : member.instrumentType ||
                    'Band'}
              </span>

              {renderPermissionButton(
                member
              )}
            </div>
          </div>
        </div>
      </article>
    );
  };

  /* --------------------------------------------------
     LEADERSHIP CARD
  -------------------------------------------------- */

  const renderDirectorCard = (
    member: TeamMember
  ) => (
    <article
      key={member.id}
      className="
        group relative overflow-hidden
        rounded-[28px] border border-amber-400/15
        bg-[#171611]/90 p-5
        shadow-xl shadow-black/10
        backdrop-blur-2xl
        transition-all duration-300
        hover:-translate-y-1
        hover:border-amber-400/30
        hover:bg-[#1b1913]
        hover:shadow-2xl hover:shadow-amber-950/20
      "
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-amber-400/[0.08] blur-3xl transition-all duration-500 group-hover:bg-amber-400/[0.13]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {renderMemberPhoto(
              member,
              'director'
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-base font-extrabold text-white">
                  {member.name}
                </h3>

                <span className="flex h-5 items-center rounded-full bg-amber-400 px-2 text-[8px] font-black uppercase tracking-wider text-black">
                  MD
                </span>
              </div>

              <p className="mt-1 truncate text-xs font-semibold text-amber-300">
                {member.role ||
                  'Music Leadership'}
              </p>
            </div>
          </div>

          {renderMemberActions(
            member,
            false
          )}
        </div>

        {renderContactInfo(member)}

        <div className="mt-5 border-t border-amber-400/10 pt-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-amber-300">
              <Crown className="h-3.5 w-3.5" />
              Full Admin Rights
            </span>

            <span className="flex items-center gap-1 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold text-emerald-300">
              <CheckCircle2 className="h-3 w-3" />
              Active
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  /* --------------------------------------------------
     MAIN
  -------------------------------------------------- */

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#07080a] text-white shadow-2xl shadow-black/40">
      {/* Ambient page lighting */}
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[#007aff]/[0.07] blur-[120px]" />

      <div className="pointer-events-none absolute -left-40 top-[500px] h-[350px] w-[350px] rounded-full bg-[#007aff]/[0.035] blur-[100px]" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handlePhotoChange}
      />

      <div className="relative space-y-6 p-4 sm:p-6 lg:p-7">

        {/* =========================================
            HERO
        ========================================== */}
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#101216]/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7">
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#007aff]/[0.11] blur-[80px]" />

          <div className="pointer-events-none absolute bottom-[-100px] left-[25%] h-60 w-60 rounded-full bg-[#007aff]/[0.045] blur-[70px]" />

          <div className="relative">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-[#007aff]/25 bg-[#007aff]/10 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#69b3ff]">
                    <Sparkles className="h-3 w-3" />
                    Music Ministry
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                    Team Directory
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl lg:text-[42px]">
                  Jewels Music Team
                </h1>

                <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-white/40">
                  Your ministry roster for vocalists,
                  musicians and music leadership —
                  all in one place.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">
                    <Users className="h-3.5 w-3.5 text-[#4da3ff]" />
                    <span className="text-[10px] font-bold text-white/55">
                      {team.length} Total Members
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold text-white/55">
                      {uploadEnabledCount} Upload-enabled
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0">
                {isMD ? (
                  <button
                    type="button"
                    onClick={onAddNewMember}
                    className="group flex items-center gap-2.5 rounded-2xl bg-[#007aff] px-5 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-blue-500/25 transition-all duration-200 hover:bg-[#1685ff] hover:shadow-blue-500/35 active:scale-95 sm:px-6 sm:text-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Team Member
                    <ChevronRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-xs font-semibold text-white/35">
                    <Lock className="h-3.5 w-3.5" />
                    MD-only management
                  </div>
                )}
              </div>
            </div>

            {/* SEARCH + FILTER */}
            <div className="mt-7 flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                <input
                  value={searchQuery}
                  onChange={event =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search team members..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-10 text-sm font-medium text-white outline-none transition-all placeholder:text-white/20 focus:border-[#007aff]/40 focus:bg-black/40 focus:ring-2 focus:ring-[#007aff]/10"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery('')
                    }
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <div className="flex min-w-max items-center gap-1.5 rounded-2xl border border-white/10 bg-black/30 p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFilter('all')
                    }
                    className={`rounded-xl px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${filterClass(
                      activeFilter === 'all'
                    )}`}
                  >
                    All ({team.length})
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveFilter('vocal')
                    }
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${filterClass(
                      activeFilter === 'vocal'
                    )}`}
                  >
                    <Mic2 className="h-3.5 w-3.5" />
                    Vocals ({vocalists.length})
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveFilter(
                        'instrument'
                      )
                    }
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${filterClass(
                      activeFilter === 'instrument'
                    )}`}
                  >
                    <Piano className="h-3.5 w-3.5" />
                    Musicians ({instrumentalists.length})
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveFilter('director')
                    }
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${filterClass(
                      activeFilter === 'director',
                      true
                    )}`}
                  >
                    <Music2 className="h-3.5 w-3.5" />
                    Leadership ({directors.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            STAT CARDS
        ========================================== */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#111317]/90 p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#007aff]/25">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#007aff]/10 blur-2xl" />

            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10">
                <Users className="h-4 w-4 text-[#4da3ff]" />
              </div>

              <p className="mt-4 text-2xl font-black text-white">
                {team.length}
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                Total Members
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#111317]/90 p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#007aff]/25">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#007aff]/10 blur-2xl" />

            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10">
                <Mic2 className="h-4 w-4 text-[#4da3ff]" />
              </div>

              <p className="mt-4 text-2xl font-black text-white">
                {vocalists.length}
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                Vocalists
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#111317]/90 p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#007aff]/25">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#007aff]/10 blur-2xl" />

            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10">
                <Piano className="h-4 w-4 text-[#4da3ff]" />
              </div>

              <p className="mt-4 text-2xl font-black text-white">
                {instrumentalists.length}
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                Musicians
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[24px] border border-amber-400/15 bg-[#15130f]/90 p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/30">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl" />

            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
                <Crown className="h-4 w-4 text-amber-300" />
              </div>

              <p className="mt-4 text-2xl font-black text-white">
                {directors.length}
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                Leadership
              </p>
            </div>
          </div>
        </section>

        {/* SEARCH RESULT MESSAGE */}
        {searchQuery && (
          <div className="flex items-center justify-between rounded-2xl border border-[#007aff]/15 bg-[#007aff]/[0.05] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-[#4da3ff]" />

              <span className="text-xs font-semibold text-white/50">
                Showing{' '}
                <span className="font-extrabold text-white">
                  {filteredMembers.length}
                </span>{' '}
                matching member
                {filteredMembers.length !== 1
                  ? 's'
                  : ''}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setSearchQuery('')
              }
              className="text-[10px] font-bold text-[#4da3ff] hover:text-white"
            >
              Clear search
            </button>
          </div>
        )}

        {/* =========================================
            LEADERSHIP
        ========================================== */}
        {(activeFilter === 'all' ||
          activeFilter === 'director') &&
          filteredDirectors.length > 0 && (
            <section className="relative overflow-hidden rounded-[30px] border border-amber-400/10 bg-[#10100e]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/[0.05] blur-[70px]" />

              <div className="relative">
                {renderSectionHeader(
                  <Crown className="h-5 w-5 text-amber-300" />,
                  'Music Leadership',
                  'Ministry direction and administration',
                  filteredDirectors.length,
                  'amber'
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDirectors.map(
                    renderDirectorCard
                  )}
                </div>
              </div>
            </section>
          )}

        {/* =========================================
            VOCALS
        ========================================== */}
        {(activeFilter === 'all' ||
          activeFilter === 'vocal') &&
          filteredVocalists.length > 0 && (
            <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#101216]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6">
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#007aff]/[0.045] blur-[70px]" />

              <div className="relative">
                {renderSectionHeader(
                  <Mic2 className="h-5 w-5 text-[#4da3ff]" />,
                  'Vocal Team',
                  'Harmonies, solos and lead vocal assignments',
                  filteredVocalists.length,
                  'blue'
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredVocalists.map(
                    member =>
                      renderMemberCard(
                        member,
                        'vocal'
                      )
                  )}
                </div>
              </div>
            </section>
          )}

        {/* =========================================
            INSTRUMENTALISTS
        ========================================== */}
        {(activeFilter === 'all' ||
          activeFilter === 'instrument') &&
          filteredInstrumentalists.length > 0 && (
            <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#101216]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#007aff]/[0.045] blur-[70px]" />

              <div className="relative">
                {renderSectionHeader(
                  <Piano className="h-5 w-5 text-[#4da3ff]" />,
                  'Band & Instrumentalists',
                  'Musicians and instrumental sections',
                  filteredInstrumentalists.length,
                  'blue'
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredInstrumentalists.map(
                    member =>
                      renderMemberCard(
                        member,
                        'instrument'
                      )
                  )}
                </div>
              </div>
            </section>
          )}

        {/* =========================================
            NO SEARCH RESULTS
        ========================================== */}
        {team.length > 0 &&
          filteredMembers.length === 0 && (
            <section className="rounded-[30px] border border-white/10 bg-[#101216]/90 p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-2xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#007aff]/20 bg-[#007aff]/10">
                <Search className="h-7 w-7 text-[#4da3ff]" />
              </div>

              <h2 className="mt-5 text-xl font-extrabold text-white">
                No members found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/35">
                No team member matches your
                current search or filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-xs font-extrabold text-white transition-all hover:bg-white/[0.08]"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            </section>
          )}

        {/* =========================================
            EMPTY TEAM
        ========================================== */}
        {team.length === 0 && (
          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#101216]/90 p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-2xl">
            <div className="pointer-events-none absolute left-1/2 top-[-100px] h-60 w-60 -translate-x-1/2 rounded-full bg-[#007aff]/10 blur-[70px]" />

            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] border border-[#007aff]/20 bg-[#007aff]/10 shadow-xl shadow-blue-500/10">
                <Users className="h-8 w-8 text-[#4da3ff]" />
              </div>

              <h2 className="mt-6 text-2xl font-black text-white">
                Your team starts here
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/35">
                Add your first vocalist,
                instrumentalist or music leader
                to begin building the Jewels Music
                Ministry roster.
              </p>

              {isMD && (
                <button
                  type="button"
                  onClick={onAddNewMember}
                  className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#007aff] px-6 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-[#1685ff] active:scale-95"
                >
                  <UserPlus className="h-4 w-4" />
                  Add First Member
                </button>
              )}
            </div>
          </section>
        )}

        {/* =========================================
            PHOTO INFO
        ========================================== */}
        {isMD && team.length > 0 && (
          <section className="relative overflow-hidden rounded-[26px] border border-[#007aff]/10 bg-[#0d1117]/80 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-5">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#007aff]/[0.06] blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[#007aff]/20 bg-[#007aff]/10">
                  <ImageIcon className="h-4.5 w-4.5 text-[#4da3ff]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-extrabold text-white">
                      Team profile photos
                    </p>

                    <span className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-emerald-300">
                      MD Access
                    </span>
                  </div>

                  <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-white/30">
                    Click any member's profile photo
                    to upload a new image. JPG, PNG,
                    WebP and GIF are supported up to
                    5 MB.
                  </p>
                </div>
              </div>

              <div className="hidden flex-shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 sm:flex">
                <Upload className="h-3.5 w-3.5 text-[#4da3ff]" />
                <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-white/35">
                  Upload
                </span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================
            FOOTER
        ========================================== */}
        <footer className="flex flex-col gap-2 border-t border-white/[0.06] px-1 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold text-white/50">
              Jewels Music Hub
            </p>

            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/15">
              MUSIC • EXCELLENCE • SERVICE
            </p>
          </div>

          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-white/15">
            <ShieldCheck className="h-3 w-3" />
            Ministry Team Directory
          </div>
        </footer>
      </div>

      {/* =========================================
          PHOTO UPLOAD OVERLAY
      ========================================== */}
      {showPhotoTip && photoTarget && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border border-[#007aff]/25 bg-[#11151c]/95 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-2xl">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#007aff]/10">
              <Camera className="h-4 w-4 text-[#4da3ff]" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-white">
                Update {photoTarget.name}'s photo
              </p>

              <p className="mt-0.5 text-[10px] text-white/35">
                Choose an image from your device.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowPhotoTip(false);
                setPhotoTarget(null);
              }}
              className="ml-auto flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.06] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
