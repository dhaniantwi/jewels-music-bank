import React, { useRef, useState } from 'react';
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
  Sparkles,
  Crown,
  CheckCircle2,
  MoreHorizontal,
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

type TeamFilter =
  | 'all'
  | 'vocal'
  | 'instrument'
  | 'director';

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
    useState<TeamFilter>('all');

  const [photoTarget, setPhotoTarget] =
    useState<TeamMember | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  /*
   * IMPORTANT:
   * Management access is determined ONLY by the active role.
   *
   * Regular members can still view everything,
   * but they receive NO management controls.
   */
  const isMD = activeRole === 'admin_md';

  const directors = team.filter(
    member => member.type === 'director'
  );

  const vocalists = team.filter(
    member => member.type === 'vocal'
  );

  const instrumentalists = team.filter(
    member => member.type === 'instrument'
  );

  const visibleMembers =
    activeFilter === 'all'
      ? team
      : activeFilter === 'vocal'
      ? vocalists
      : activeFilter === 'instrument'
      ? instrumentalists
      : directors;

  const handlePhotoClick = (member: TeamMember) => {
    // HARD MD CHECK
    if (!isMD) return;

    setPhotoTarget(member);
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // HARD MD CHECK
    if (!isMD) {
      event.target.value = '';
      return;
    }

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

    onPhotoSelected?.(photoTarget, file);

    event.target.value = '';
    setPhotoTarget(null);
  };

  const handleAddMember = () => {
    if (!isMD) return;
    onAddNewMember();
  };

  const handleEditMember = (member: TeamMember) => {
    if (!isMD) return;
    onEditMember(member);
  };

  const handleDeleteMember = (member: TeamMember) => {
    if (!isMD) return;

    const label =
      member.type === 'vocal'
        ? 'vocal'
        : member.type === 'instrument'
        ? 'band'
        : 'leadership';

    if (
      confirm(
        `Remove ${member.name} from the ${label} roster?`
      )
    ) {
      onDeleteMember(member.id);
    }
  };

  const handleTogglePermission = (
    member: TeamMember
  ) => {
    if (!isMD) return;
    onTogglePermission(member.id);
  };

  const renderAvatar = (
    member: TeamMember,
    type: 'director' | 'vocal' | 'instrument'
  ) => {
    const isDirector = type === 'director';

    return (
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => handlePhotoClick(member)}
          disabled={!isMD}
          title={
            isMD
              ? `Change photo for ${member.name}`
              : member.name
          }
          className={`
            group relative flex h-[68px] w-[68px]
            items-center justify-center overflow-hidden
            rounded-[22px] border
            ${
              isDirector
                ? 'border-amber-400/20 bg-amber-400/10'
                : 'border-white/10 bg-white/[0.045]'
            }
            ${
              isMD
                ? 'cursor-pointer hover:border-[#4da3ff]/50 hover:bg-white/[0.08]'
                : 'cursor-default'
            }
            transition-all duration-300
          `}
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : member.icon ? (
            <span className="text-2xl">
              {member.icon}
            </span>
          ) : (
            <Users className="h-7 w-7 text-white/20" />
          )}

          {isMD && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/35">
              <Camera className="h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          )}
        </button>

        {isMD && (
          <div className="pointer-events-none absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#111113] bg-[#17191d] shadow-xl">
            <Camera className="h-3 w-3 text-[#4da3ff]" />
          </div>
        )}
      </div>
    );
  };

  const renderContact = (member: TeamMember) => {
    if (!member.phone && !member.email) {
      return (
        <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-white/20">
          <div className="h-px w-4 bg-white/10" />
          No contact information
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-2">
        {member.phone && (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-[#4da3ff]/10 bg-[#4da3ff]/[0.08]">
              <Phone className="h-3 w-3 text-[#4da3ff]" />
            </div>

            <span className="truncate text-[11px] font-medium text-white/40">
              {member.phone}
            </span>
          </div>
        )}

        {member.email && (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035]">
              <Mail className="h-3 w-3 text-white/40" />
            </div>

            <span className="truncate text-[11px] font-medium text-white/40">
              {member.email}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderActions = (
    member: TeamMember,
    allowDelete = true
  ) => {
    // NEVER expose management actions to regular members.
    if (!isMD) return null;

    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleEditMember(member)}
          title="Edit member"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/35 transition-all hover:border-[#4da3ff]/25 hover:bg-[#4da3ff]/10 hover:text-[#4da3ff] active:scale-95"
        >
          <Edit className="h-3.5 w-3.5" />
        </button>

        {allowDelete && (
          <button
            type="button"
            onClick={() => handleDeleteMember(member)}
            title="Remove member"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/35 transition-all hover:border-rose-400/20 hover:bg-rose-400/10 hover:text-rose-300 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  };

  const renderPermission = (member: TeamMember) => {
    // Permission management is MD-only.
    if (!isMD) return null;

    return (
      <button
        type="button"
        onClick={() =>
          handleTogglePermission(member)
        }
        className={`
          inline-flex items-center gap-1.5
          rounded-xl border px-3 py-1.5
          text-[9px] font-extrabold uppercase
          tracking-[0.1em] transition-all
          ${
            member.canEdit
              ? 'border-emerald-400/15 bg-emerald-400/10 text-emerald-300'
              : 'border-white/10 bg-white/[0.035] text-white/35 hover:bg-white/[0.07] hover:text-white/60'
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

  const filterButton = (
    filter: TeamFilter,
    label: string,
    count: number,
    icon: React.ReactNode,
    accent = false
  ) => {
    const active = activeFilter === filter;

    return (
      <button
        type="button"
        onClick={() => setActiveFilter(filter)}
        className={`
          flex items-center gap-2
          whitespace-nowrap rounded-xl
          px-3.5 py-2.5 text-[11px]
          font-bold transition-all
          ${
            active
              ? accent
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/10'
                : 'bg-[#007aff] text-white shadow-lg shadow-blue-500/20'
              : 'text-white/35 hover:bg-white/[0.06] hover:text-white'
          }
        `}
      >
        {icon}
        {label}
        <span
          className={
            active
              ? 'opacity-70'
              : 'text-white/20'
          }
        >
          {count}
        </span>
      </button>
    );
  };

  const renderMemberCard = (
    member: TeamMember,
    type: 'director' | 'vocal' | 'instrument'
  ) => {
    const isDirector = type === 'director';

    return (
      <div
        key={member.id}
        className={`
          group relative overflow-hidden
          rounded-[26px] border p-5
          transition-all duration-300
          ${
            isDirector
              ? 'border-amber-400/10 bg-amber-400/[0.025] hover:border-amber-400/25 hover:bg-amber-400/[0.04]'
              : 'border-white/[0.08] bg-white/[0.025] hover:border-[#4da3ff]/20 hover:bg-white/[0.045]'
          }
        `}
      >
        {/* CARD GLOW */}
        <div
          className={`
            pointer-events-none absolute
            -right-20 -top-20 h-40 w-40
            rounded-full blur-3xl
            ${
              isDirector
                ? 'bg-amber-400/[0.07]'
                : 'bg-[#007aff]/[0.05]'
            }
          `}
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3.5">
              {renderAvatar(member, type)}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-[15px] font-extrabold tracking-tight text-white">
                    {member.name}
                  </h3>

                  {isDirector && (
                    <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider text-black">
                      MD
                    </span>
                  )}
                </div>

                <p
                  className={`
                    mt-1 truncate text-[11px]
                    font-bold
                    ${
                      isDirector
                        ? 'text-amber-300'
                        : 'text-[#4da3ff]'
                    }
                  `}
                >
                  {isDirector
                    ? member.role
                    : member.type === 'vocal'
                    ? member.voicePart ||
                      member.role
                    : member.instrumentType ||
                      member.role}
                </p>
              </div>
            </div>

            {renderActions(
              member,
              !isDirector
            )}
          </div>

          {renderContact(member)}

          <div className="mt-5 flex min-h-[31px] items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
            <span
              className={`
                rounded-full border px-2.5 py-1
                text-[8px] font-extrabold
                uppercase tracking-[0.1em]
                ${
                  isDirector
                    ? 'border-amber-400/15 bg-amber-400/10 text-amber-300'
                    : 'border-[#4da3ff]/15 bg-[#4da3ff]/[0.08] text-[#4da3ff]'
                }
              `}
            >
              {isDirector
                ? 'Music Leadership'
                : member.type === 'vocal'
                ? member.voicePart ||
                  'Vocal Section'
                : member.instrumentType ||
                  'Band'}
            </span>

            {isDirector ? (
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </span>
            ) : (
              renderPermission(member)
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-w-0 max-w-full animate-in fade-in duration-300">
      {/* Hidden photo uploader */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handlePhotoChange}
      />

      <div className="space-y-6">
        {/* ========================================================= */}
        {/* PREMIUM HERO */}
        {/* ========================================================= */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#101114] shadow-2xl shadow-black/30">
          {/* Ambient lighting */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#007aff]/[0.08] blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-amber-400/[0.035] blur-[80px]" />

          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4da3ff]/15 bg-[#4da3ff]/[0.08] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-[#4da3ff]">
                    <Users className="h-3 w-3" />
                    Music Team
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white/25">
                    <Sparkles className="h-3 w-3" />
                    Jewels Music Hub
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-[42px]">
                  Music Team
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/35">
                  Meet the people serving through
                  vocals, instrumentation and music
                  leadership across the ministry.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2">
                    <Users className="h-3.5 w-3.5 text-[#4da3ff]" />
                    <span className="text-[10px] font-bold text-white/45">
                      {team.length}{' '}
                      {team.length === 1
                        ? 'Member'
                        : 'Members'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2">
                    <Mic2 className="h-3.5 w-3.5 text-[#4da3ff]" />
                    <span className="text-[10px] font-bold text-white/45">
                      {vocalists.length} Vocal
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2">
                    <Piano className="h-3.5 w-3.5 text-[#4da3ff]" />
                    <span className="text-[10px] font-bold text-white/45">
                      {instrumentalists.length} Band
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-amber-400/10 bg-amber-400/[0.05] px-3 py-2">
                    <Crown className="h-3.5 w-3.5 text-amber-300" />
                    <span className="text-[10px] font-bold text-amber-300/70">
                      {directors.length} Leader
                    </span>
                  </div>
                </div>
              </div>

              {/* MD CONTROL */}
              {isMD ? (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="group flex flex-shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-[#007aff] px-5 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-[#0877e8] hover:shadow-blue-500/30 active:scale-[0.98]"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Team Member
                  <ChevronRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <div className="flex flex-shrink-0 items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5">
                  <Lock className="h-3.5 w-3.5 text-white/25" />

                  <div>
                    <p className="text-[10px] font-bold text-white/45">
                      View Only
                    </p>

                    <p className="mt-0.5 text-[8px] font-medium text-white/20">
                      Team management is restricted
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FILTER BAR */}
            <div className="mt-7 overflow-x-auto">
              <div className="inline-flex min-w-max items-center gap-1 rounded-2xl border border-white/[0.07] bg-black/25 p-1.5">
                {filterButton(
                  'all',
                  'All Members',
                  team.length,
                  <Users className="h-3.5 w-3.5" />
                )}

                {filterButton(
                  'vocal',
                  'Vocalists',
                  vocalists.length,
                  <Mic2 className="h-3.5 w-3.5" />
                )}

                {filterButton(
                  'instrument',
                  'Musicians',
                  instrumentalists.length,
                  <Piano className="h-3.5 w-3.5" />
                )}

                {filterButton(
                  'director',
                  'Leadership',
                  directors.length,
                  <Crown className="h-3.5 w-3.5" />,
                  true
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* TEAM CONTENT */}
        {/* ========================================================= */}

        {visibleMembers.length > 0 ? (
          <div className="space-y-6">
            {/* LEADERSHIP */}
            {(activeFilter === 'all' ||
              activeFilter === 'director') &&
              directors.length > 0 && (
                <section className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#101114] shadow-xl shadow-black/10">
                  <div className="relative p-5 sm:p-6">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-400/[0.04] blur-3xl" />

                    <div className="relative mb-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/15 bg-amber-400/[0.08]">
                          <Crown className="h-4 w-4 text-amber-300" />
                        </div>

                        <div>
                          <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                            Music Leadership
                          </h2>

                          <p className="mt-0.5 text-[10px] text-white/25">
                            Ministry direction and administration
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-amber-400/15 bg-amber-400/[0.07] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-amber-300">
                        {directors.length}{' '}
                        {directors.length === 1
                          ? 'Leader'
                          : 'Leaders'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {directors.map(member =>
                        renderMemberCard(
                          member,
                          'director'
                        )
                      )}
                    </div>
                  </div>
                </section>
              )}

            {/* VOCAL TEAM */}
            {(activeFilter === 'all' ||
              activeFilter === 'vocal') &&
              vocalists.length > 0 && (
                <section className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#101114] shadow-xl shadow-black/10">
                  <div className="p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#4da3ff]/15 bg-[#4da3ff]/[0.08]">
                          <Mic2 className="h-4 w-4 text-[#4da3ff]" />
                        </div>

                        <div>
                          <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                            Vocal Team
                          </h2>

                          <p className="mt-0.5 text-[10px] text-white/25">
                            Leads, harmonies and vocal sections
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white/30">
                        {vocalists.length}{' '}
                        {vocalists.length === 1
                          ? 'Vocalist'
                          : 'Vocalists'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {vocalists.map(member =>
                        renderMemberCard(
                          member,
                          'vocal'
                        )
                      )}
                    </div>
                  </div>
                </section>
              )}

            {/* INSTRUMENTALISTS */}
            {(activeFilter === 'all' ||
              activeFilter === 'instrument') &&
              instrumentalists.length > 0 && (
                <section className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#101114] shadow-xl shadow-black/10">
                  <div className="p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#4da3ff]/15 bg-[#4da3ff]/[0.08]">
                          <Piano className="h-4 w-4 text-[#4da3ff]" />
                        </div>

                        <div>
                          <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                            Band & Instrumentalists
                          </h2>

                          <p className="mt-0.5 text-[10px] text-white/25">
                            Musicians and instrumental sections
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white/30">
                        {instrumentalists.length}{' '}
                        {instrumentalists.length === 1
                          ? 'Musician'
                          : 'Musicians'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {instrumentalists.map(member =>
                        renderMemberCard(
                          member,
                          'instrument'
                        )
                      )}
                    </div>
                  </div>
                </section>
              )}
          </div>
        ) : (
          /* ======================================================= */
          /* EMPTY / FILTER STATE */
          /* ======================================================= */

          <section className="rounded-[30px] border border-white/[0.08] bg-[#101114] p-10 text-center shadow-xl shadow-black/10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#4da3ff]/15 bg-[#4da3ff]/[0.08]">
              <Users className="h-7 w-7 text-[#4da3ff]" />
            </div>

            <h2 className="mt-5 text-xl font-extrabold tracking-tight text-white">
              {team.length === 0
                ? 'No team members yet'
                : 'No members in this section'}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/30">
              {team.length === 0
                ? 'Build the Jewels music roster by adding your first vocalist, instrumentalist or music leader.'
                : 'There are currently no team members assigned to this section.'}
            </p>

            {team.length === 0 && isMD && (
              <button
                type="button"
                onClick={handleAddMember}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#007aff] px-5 py-3 text-xs font-extrabold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-[#0877e8] active:scale-95"
              >
                <UserPlus className="h-4 w-4" />
                Add First Member
              </button>
            )}
          </section>
        )}

        {/* ========================================================= */}
        {/* MD INFORMATION PANEL */}
        {/* ========================================================= */}

        {isMD && team.length > 0 && (
          <section className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#101114] p-4 shadow-lg shadow-black/10 sm:p-5">
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#007aff]/[0.04] blur-3xl" />

            <div className="relative flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#4da3ff]/15 bg-[#4da3ff]/[0.08]">
                <ImageIcon className="h-4 w-4 text-[#4da3ff]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-extrabold text-white">
                    Team photo management
                  </p>

                  <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.07] px-2 py-0.5 text-[7px] font-black uppercase tracking-wider text-emerald-300">
                    MD Only
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-[10px] leading-relaxed text-white/25">
                  Click a team member's profile image
                  to replace their photo. JPG, PNG, WebP
                  and GIF images up to 5 MB are supported.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* VIEW-ONLY NOTICE FOR REGULAR MEMBERS */}
        {/* ========================================================= */}

        {!isMD && team.length > 0 && (
          <section className="rounded-[24px] border border-white/[0.06] bg-white/[0.015] px-4 py-3.5">
            <div className="flex items-center justify-center gap-2 text-center">
              <Lock className="h-3.5 w-3.5 text-white/20" />

              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/20">
                Team management is available to the Music Director only
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
