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
  Crown,
  CheckCircle2,
  UserRound,
  Upload,
  X,
  Sparkles,
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

  const [selectedMember, setSelectedMember] =
    useState<TeamMember | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  /*
   * ============================================================
   * ACCESS CONTROL
   * ============================================================
   *
   * IMPORTANT:
   * Only the Music Director / MD account can modify this page.
   *
   * Every other role is completely read-only.
   *
   * Do NOT change this to simply:
   *
   *   activeRole !== 'viewer'
   *
   * or:
   *
   *   !!activeRole
   *
   * because that would accidentally give regular members
   * management privileges.
   */
  const isMD = activeRole === 'admin_md';

  /*
   * ============================================================
   * TEAM GROUPS
   * ============================================================
   */

  const directors = team.filter(
    member => member.type === 'director'
  );

  const vocalists = team.filter(
    member => member.type === 'vocal'
  );

  const instrumentalists = team.filter(
    member => member.type === 'instrument'
  );

  /*
   * ============================================================
   * PHOTO MANAGEMENT
   * ============================================================
   */

  const handlePhotoClick = (member: TeamMember) => {
    /*
     * HARD BLOCK:
     * Regular members can never open the upload dialog.
     */
    if (!isMD) return;

    setPhotoTarget(member);

    /*
     * Small timeout makes the interaction more reliable
     * after state updates / modal transitions.
     */
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    /*
     * SECOND HARD BLOCK.
     *
     * Even if someone somehow triggers the file input,
     * regular users cannot submit a photo.
     */
    if (!isMD) {
      event.target.value = '';
      setPhotoTarget(null);
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

  /*
   * ============================================================
   * EDIT / DELETE SECURITY WRAPPERS
   * ============================================================
   *
   * These wrappers provide another layer of protection.
   */

  const handleEditMember = (member: TeamMember) => {
    if (!isMD) return;

    onEditMember(member);
  };

  const handleDeleteMember = (member: TeamMember) => {
    if (!isMD) return;

    const section =
      member.type === 'vocal'
        ? 'vocal'
        : member.type === 'director'
          ? 'leadership'
          : 'band';

    const confirmed = window.confirm(
      `Remove ${member.name} from the ${section} roster?`
    );

    if (!confirmed) return;

    onDeleteMember(member.id);
  };

  const handleTogglePermission = (
    member: TeamMember
  ) => {
    if (!isMD) return;

    onTogglePermission(member.id);
  };

  /*
   * ============================================================
   * FILTER
   * ============================================================
   */

  const filterClass = (
    active: boolean,
    amber = false
  ) => {
    if (active) {
      return amber
        ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
        : 'bg-[#007aff] text-white shadow-lg shadow-blue-500/20';
    }

    return 'bg-transparent text-white/40 hover:bg-white/[0.06] hover:text-white';
  };

  /*
   * ============================================================
   * PHOTO COMPONENT
   * ============================================================
   */

  const renderMemberPhoto = (
    member: TeamMember,
    variant:
      | 'director'
      | 'vocal'
      | 'instrument'
  ) => {
    const isDirector = variant === 'director';

    return (
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => handlePhotoClick(member)}
          disabled={!isMD}
          title={
            isMD
              ? `Change photo for ${member.name}`
              : `${member.name}'s profile photo`
          }
          aria-label={
            isMD
              ? `Change photo for ${member.name}`
              : `${member.name}'s profile photo`
          }
          className={`group relative flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-[22px] border ${
            isDirector
              ? 'border-amber-400/20 bg-amber-400/10'
              : 'border-white/10 bg-white/[0.035]'
          } ${
            isMD
              ? 'cursor-pointer hover:border-[#007aff]/50 hover:bg-white/[0.07]'
              : 'cursor-default'
          } transition-all duration-300`}
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
            <UserRound className="h-7 w-7 text-white/20" />
          )}

          {isMD && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
              <Camera className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          )}
        </button>

        {isMD && (
          <div className="pointer-events-none absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#151518] shadow-xl">
            <Camera className="h-3 w-3 text-[#4da3ff]" />
          </div>
        )}
      </div>
    );
  };

  /*
   * ============================================================
   * CONTACT INFORMATION
   * ============================================================
   */

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
      <div className="space-y-2.5 pt-3 text-xs text-white/45">
        {member.phone && (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-[#007aff]/10 bg-[#007aff]/10">
              <Phone className="h-3 w-3 text-[#4da3ff]" />
            </div>

            <span className="truncate">
              {member.phone}
            </span>
          </div>
        )}

        {member.email && (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035]">
              <Mail className="h-3 w-3 text-white/40" />
            </div>

            <span className="truncate">
              {member.email}
            </span>
          </div>
        )}
      </div>
    );
  };

  /*
   * ============================================================
   * MEMBER ACTIONS
   * ============================================================
   */

  const renderMemberActions = (
    member: TeamMember,
    allowDelete: boolean
  ) => {
    /*
     * ABSOLUTE READ-ONLY CHECK.
     *
     * If this is not the MD, this entire section disappears.
     */
    if (!isMD) return null;

    return (
      <div className="flex flex-shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() =>
            handleEditMember(member)
          }
          title="Edit member"
          aria-label={`Edit ${member.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/40 transition-all hover:border-[#007aff]/30 hover:bg-[#007aff]/10 hover:text-[#4da3ff] active:scale-95"
        >
          <Edit className="h-3.5 w-3.5" />
        </button>

        {allowDelete && (
          <button
            type="button"
            onClick={() =>
              handleDeleteMember(member)
            }
            title="Delete member"
            aria-label={`Delete ${member.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/40 transition-all hover:border-rose-500/25 hover:bg-rose-500/10 hover:text-rose-300 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  };

  /*
   * ============================================================
   * PERMISSION BUTTON
   * ============================================================
   */

  const renderPermissionButton = (
    member: TeamMember
  ) => {
    if (!isMD) return null;

    return (
      <button
        type="button"
        onClick={() =>
          handleTogglePermission(member)
        }
        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] transition-all ${
          member.canEdit
            ? 'border-emerald-500/15 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15'
            : 'border-white/10 bg-white/[0.035] text-white/40 hover:bg-white/[0.07] hover:text-white/70'
        }`}
      >
        <ShieldCheck className="h-3 w-3" />

        {member.canEdit
          ? 'Upload Access'
          : 'Grant Uploads'}
      </button>
    );
  };

  /*
   * ============================================================
   * SECTION HEADER
   * ============================================================
   */

  const renderSectionHeader = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    count: number,
    accent: 'blue' | 'amber' = 'blue'
  ) => {
    const amber = accent === 'amber';

    return (
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border ${
              amber
                ? 'border-amber-400/20 bg-amber-400/10'
                : 'border-[#007aff]/20 bg-[#007aff]/10'
            }`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">
              {title}
            </h2>

            <p className="mt-0.5 truncate text-[11px] text-white/25">
              {subtitle}
            </p>
          </div>
        </div>

        <span
          className={`flex-shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] ${
            amber
              ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
              : 'border-white/10 bg-white/[0.035] text-white/35'
          }`}
        >
          {count}
        </span>
      </div>
    );
  };

  /*
   * ============================================================
   * MAIN UI
   * ============================================================
   */

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#09090b] text-white shadow-2xl shadow-black/30 animate-in fade-in duration-300">

      {/* Hidden photo input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handlePhotoChange}
        disabled={!isMD}
      />

      <div className="space-y-6 p-1">

        {/* =====================================================
            PREMIUM HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#151518] via-[#111113] to-[#0c0c0f] p-6 shadow-2xl shadow-black/20 sm:p-8">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#007aff]/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-amber-400/[0.035] blur-3xl" />

          <div className="relative">

            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-amber-300">
                <Music2 className="h-3 w-3" />
                Music Team
              </span>

              {isMD ? (
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-emerald-300">
                  <Crown className="h-3 w-3" />
                  MD Control
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/35">
                  <Lock className="h-3 w-3" />
                  View Only
                </span>
              )}
            </div>

            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">

              <div className="min-w-0">

                <div className="flex items-center gap-3">
                  <div className="hidden h-14 w-14 items-center justify-center rounded-[20px] border border-[#007aff]/20 bg-[#007aff]/10 sm:flex">
                    <Users className="h-6 w-6 text-[#4da3ff]" />
                  </div>

                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      Jewels Music Team
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-white/40">
                      {team.length}{' '}
                      {team.length === 1
                        ? 'member'
                        : 'members'}{' '}
                      serving across vocals,
                      instrumentation and music
                      leadership.
                    </p>
                  </div>
                </div>

                {/* STATS */}
                <div className="mt-6 flex flex-wrap gap-2">

                  <div className="flex items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-2">
                    <Users className="h-3.5 w-3.5 text-white/30" />
                    <span className="text-[11px] font-bold text-white/60">
                      {team.length} Total
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-[#007aff]/10 bg-[#007aff]/[0.05] px-3 py-2">
                    <Mic2 className="h-3.5 w-3.5 text-[#4da3ff]" />
                    <span className="text-[11px] font-bold text-white/60">
                      {vocalists.length} Vocal
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-[#007aff]/10 bg-[#007aff]/[0.05] px-3 py-2">
                    <Piano className="h-3.5 w-3.5 text-[#4da3ff]" />
                    <span className="text-[11px] font-bold text-white/60">
                      {instrumentalists.length}{' '}
                      Musicians
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-amber-400/10 bg-amber-400/[0.05] px-3 py-2">
                    <Crown className="h-3.5 w-3.5 text-amber-300" />
                    <span className="text-[11px] font-bold text-white/60">
                      {directors.length} Leadership
                    </span>
                  </div>

                </div>
              </div>

              {/* MD CONTROL */}
              <div className="flex flex-shrink-0">

                {isMD ? (
                  <button
                    type="button"
                    onClick={() =>
                      onAddNewMember()
                    }
                    className="group flex items-center gap-2.5 rounded-2xl bg-[#007aff] px-5 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-[#006fe6] hover:shadow-blue-500/30 active:scale-95 sm:text-sm"
                  >
                    <UserPlus className="h-4 w-4" />

                    Add Team Member

                    <ChevronRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-xs font-semibold text-white/35">
                    <Lock className="h-3.5 w-3.5" />
                    MD-only management
                  </div>
                )}

              </div>
            </div>

            {/* FILTERS */}

            <div className="relative mt-8 overflow-x-auto">
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
                  All Members ({team.length})
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
                  Vocalists ({vocalists.length})
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveFilter('instrument')
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
        </section>

        {/* =====================================================
            LEADERSHIP
        ====================================================== */}

        {(activeFilter === 'all' ||
          activeFilter === 'director') &&
          directors.length > 0 && (

            <section className="rounded-[30px] border border-white/10 bg-[#111113] p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">

              {renderSectionHeader(
                <ShieldCheck className="h-5 w-5 text-amber-300" />,
                'Music Leadership',
                'Ministry direction and administration',
                directors.length,
                'amber'
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                {directors.map(member => (

                  <div
                    key={member.id}
                    className="group relative overflow-hidden rounded-[26px] border border-amber-400/10 bg-gradient-to-br from-amber-400/[0.045] to-white/[0.025] p-5 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/20 hover:bg-amber-400/[0.06]"
                  >

                    <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-amber-400/[0.06] blur-3xl" />

                    <div className="relative">

                      <div className="mb-4 flex items-start justify-between gap-3">

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

                              <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-black">
                                MD
                              </span>

                            </div>

                            <p className="mt-1 truncate text-xs font-semibold text-amber-300">
                              {member.role}
                            </p>

                          </div>
                        </div>

                        {renderMemberActions(
                          member,
                          false
                        )}

                      </div>

                      {renderContactInfo(member)}

                      <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">

                        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-amber-300">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Full Admin Rights
                        </span>

                        <span className="flex items-center gap-1 rounded-full border border-emerald-500/10 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* =====================================================
            VOCAL TEAM
        ====================================================== */}

        {(activeFilter === 'all' ||
          activeFilter === 'vocal') &&
          vocalists.length > 0 && (

            <section className="rounded-[30px] border border-white/10 bg-[#111113] p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">

              {renderSectionHeader(
                <Mic2 className="h-5 w-5 text-[#4da3ff]" />,
                'Vocal Team',
                'Harmonies, solos and lead vocal assignments',
                vocalists.length
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                {vocalists.map(member => (

                  <div
                    key={member.id}
                    className="group rounded-[26px] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#007aff]/20 hover:bg-white/[0.045]"
                  >

                    <div className="flex min-w-0 flex-col">

                      <div className="mb-4 flex items-start justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          {renderMemberPhoto(
                            member,
                            'vocal'
                          )}

                          <div className="min-w-0">

                            <h3 className="truncate text-base font-bold text-white">
                              {member.name}
                            </h3>

                            <p className="mt-1 truncate text-xs font-semibold text-[#4da3ff]">
                              {member.voicePart ||
                                member.role}
                            </p>

                          </div>
                        </div>

                        {renderMemberActions(
                          member,
                          true
                        )}

                      </div>

                      {renderContactInfo(member)}

                      <div className="mt-5 flex min-h-[30px] items-center justify-between gap-2 border-t border-white/[0.07] pt-3">

                        <span className="rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#4da3ff]">
                          {member.voicePart ||
                            'Vocal Section'}
                        </span>

                        {renderPermissionButton(
                          member
                        )}

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* =====================================================
            INSTRUMENTALISTS
        ====================================================== */}

        {(activeFilter === 'all' ||
          activeFilter === 'instrument') &&
          instrumentalists.length > 0 && (

            <section className="rounded-[30px] border border-white/10 bg-[#111113] p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">

              {renderSectionHeader(
                <Piano className="h-5 w-5 text-[#4da3ff]" />,
                'Band & Instrumentalists',
                'Musicians and instrumental sections',
                instrumentalists.length
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                {instrumentalists.map(member => (

                  <div
                    key={member.id}
                    className="group rounded-[26px] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#007aff]/20 hover:bg-white/[0.045]"
                  >

                    <div className="flex min-w-0 flex-col">

                      <div className="mb-4 flex items-start justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          {renderMemberPhoto(
                            member,
                            'instrument'
                          )}

                          <div className="min-w-0">

                            <h3 className="truncate text-base font-bold text-white">
                              {member.name}
                            </h3>

                            <p className="mt-1 truncate text-xs font-semibold text-[#4da3ff]">
                              {member.instrumentType ||
                                member.role}
                            </p>

                          </div>
                        </div>

                        {renderMemberActions(
                          member,
                          true
                        )}

                      </div>

                      {renderContactInfo(member)}

                      <div className="mt-5 flex min-h-[30px] items-center justify-between gap-2 border-t border-white/[0.07] pt-3">

                        <span className="rounded-full border border-[#007aff]/20 bg-[#007aff]/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#4da3ff]">
                          {member.instrumentType ||
                            'Band'}
                        </span>

                        {renderPermissionButton(
                          member
                        )}

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {team.length === 0 && (

          <section className="rounded-[30px] border border-white/10 bg-[#111113] p-10 text-center shadow-2xl shadow-black/10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#007aff]/20 bg-[#007aff]/10">
              <Users className="h-7 w-7 text-[#4da3ff]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              No team members yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/35">
              Add your first vocalist,
              instrumentalist or music leader to
              begin building the ministry roster.
            </p>

            {isMD && (
              <button
                type="button"
                onClick={() =>
                  onAddNewMember()
                }
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#007aff] px-5 py-3 text-xs font-extrabold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-[#006fe6] active:scale-95"
              >
                <UserPlus className="h-4 w-4" />
                Add First Member
              </button>
            )}

          </section>
        )}

        {/* =====================================================
            MD INFORMATION PANEL
        ====================================================== */}

        {team.length > 0 && (

          <section className="rounded-[26px] border border-white/10 bg-gradient-to-r from-white/[0.025] to-transparent p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10">
                {isMD ? (
                  <Sparkles className="h-4 w-4 text-[#4da3ff]" />
                ) : (
                  <Lock className="h-4 w-4 text-white/30" />
                )}
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold text-white">
                  {isMD
                    ? 'Team management enabled'
                    : 'Team directory — view only'}
                </p>

                <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-white/30">

                  {isMD
                    ? 'You are signed in as the Music Director. You can add, edit and remove team members, update photos and manage upload permissions.'
                    : 'Team management is restricted to the Music Director. Regular members can view the team directory but cannot modify member information, photos or permissions.'}

                </p>

              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            PHOTO INFORMATION — MD ONLY
        ====================================================== */}

        {isMD && team.length > 0 && (

          <section className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl sm:p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10">
                <ImageIcon className="h-4 w-4 text-[#4da3ff]" />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold text-white">
                  Team photos
                </p>

                <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-white/30">
                  Click a member's photo to change
                  their profile image. Supported
                  formats are JPG, PNG, WebP and GIF,
                  with a maximum file size of 5 MB.
                </p>

              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
