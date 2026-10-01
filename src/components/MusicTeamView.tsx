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
    useState<'all' | 'vocal' | 'instrument' | 'director'>('all');

  const [photoTarget, setPhotoTarget] =
    useState<TeamMember | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /*
   * ============================================================
   * PERMISSIONS
   * ============================================================
   *
   * Only the Music Director / admin_md is allowed to make
   * changes to the team.
   *
   * Regular members are strictly VIEW-ONLY.
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

  /*
   * ============================================================
   * PHOTO HANDLING
   * ============================================================
   */

  const handlePhotoClick = (member: TeamMember) => {
    // HARD BLOCK — regular members cannot change photos.
    if (!isMD) return;

    setPhotoTarget(member);
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // HARD BLOCK — even if the input somehow gets triggered,
    // regular members cannot upload.
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

  /*
   * ============================================================
   * MEMBER PHOTO
   * ============================================================
   */

  const renderMemberPhoto = (
    member: TeamMember,
    variant: 'director' | 'vocal' | 'instrument'
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
          className={`group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] border ${
            isDirector
              ? 'border-amber-500/20 bg-amber-500/10'
              : 'border-white/10 bg-white/[0.035]'
          } ${
            isMD
              ? 'cursor-pointer hover:border-[#007aff]/40 hover:bg-white/[0.07]'
              : 'cursor-default'
          }`}
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : member.icon ? (
            <span className="text-2xl">
              {member.icon}
            </span>
          ) : (
            <Users className="h-6 w-6 text-white/25" />
          )}

          {/* Camera overlay ONLY for MD */}
          {isMD && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
              <Camera className="h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          )}
        </button>

        {/* Camera badge ONLY for MD */}
        {isMD && (
          <div className="pointer-events-none absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#19191c] shadow-lg">
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

  const renderContactInfo = (member: TeamMember) => {
    if (!member.phone && !member.email) {
      return (
        <div className="pt-2 text-[11px] font-medium text-white/20">
          No contact information added
        </div>
      );
    }

    return (
      <div className="space-y-2 pt-2 text-xs text-white/40">
        {member.phone && (
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-[#007aff]/10">
              <Phone className="h-3 w-3 text-[#4da3ff]" />
            </div>

            <span className="truncate">
              {member.phone}
            </span>
          </div>
        )}

        {member.email && (
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
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
   * EDIT / DELETE ACTIONS
   * ============================================================
   */

  const renderMemberActions = (
    member: TeamMember,
    allowDelete: boolean
  ) => {
    // Regular members get NOTHING here.
    if (!isMD) return null;

    return (
      <div className="flex flex-shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            if (!isMD) return;
            onEditMember(member);
          }}
          title="Edit member"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/40 transition-all hover:border-[#007aff]/25 hover:bg-[#007aff]/10 hover:text-[#4da3ff] active:scale-95"
        >
          <Edit className="h-3.5 w-3.5" />
        </button>

        {allowDelete && (
          <button
            type="button"
            onClick={() => {
              if (!isMD) return;

              const confirmed = window.confirm(
                `Remove ${member.name} from the ${
                  member.type === 'vocal'
                    ? 'vocal'
                    : 'band'
                } roster?`
              );

              if (confirmed) {
                onDeleteMember(member.id);
              }
            }}
            title="Delete member"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/40 transition-all hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-300 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  };

  /*
   * ============================================================
   * FILTER BUTTONS
   * ============================================================
   */

  const filterClass = (
    active: boolean,
    amber = false
  ) =>
    active
      ? amber
        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
        : 'bg-[#007aff] text-white shadow-lg shadow-blue-500/20'
      : 'bg-transparent text-white/40 hover:bg-white/[0.07] hover:text-white';

  /*
   * ============================================================
   * UPLOAD PERMISSION
   * ============================================================
   */

  const renderPermissionButton = (
    member: TeamMember
  ) => {
    // Regular members cannot manage permissions.
    if (!isMD) return null;

    return (
      <button
        type="button"
        onClick={() => {
          if (!isMD) return;
          onTogglePermission(member.id);
        }}
        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] transition-all ${
          member.canEdit
            ? 'border-emerald-500/15 bg-emerald-500/10 text-emerald-300'
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
   * MAIN UI
   * ============================================================
   */

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[30px] border border-white/10 bg-[#0f0f11] text-white shadow-2xl shadow-black/20 animate-in fade-in duration-200">

      {/* Hidden photo input */}
      {isMD && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handlePhotoChange}
        />
      )}

      <div className="space-y-6">

        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111113]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-7">

          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#007aff]/[0.07] blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

            <div className="min-w-0">

              <div className="mb-4 flex flex-wrap items-center gap-2">

                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-amber-300">
                  <Users className="h-3 w-3" />
                  Music Team
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/25">
                  {isMD
                    ? 'Team Control'
                    : 'View Only'}
                </span>

              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Jewels Music Team
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-white/40">
                {team.length} dedicated{' '}
                {team.length === 1
                  ? 'member'
                  : 'members'} serving across vocals,
                instrumentation and music leadership.
              </p>

            </div>

            <div className="flex flex-shrink-0">

              {isMD ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!isMD) return;
                    onAddNewMember();
                  }}
                  className="group flex items-center gap-2.5 rounded-2xl bg-[#007aff] px-5 py-3 text-xs font-extrabold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-[#006fe6] active:scale-95 sm:text-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Team Member
                  <ChevronRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-semibold text-white/35">
                  <Lock className="h-3.5 w-3.5" />
                  View Only
                </div>
              )}

            </div>

          </div>

          {/* FILTERS */}

          <div className="relative mt-7 overflow-x-auto">

            <div className="flex min-w-max items-center gap-1.5 rounded-2xl border border-white/10 bg-black/30 p-1">

              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${filterClass(
                  activeFilter === 'all'
                )}`}
              >
                All Members ({team.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('vocal')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${filterClass(
                  activeFilter === 'vocal'
                )}`}
              >
                <Mic2 className="h-3.5 w-3.5" />
                Vocalists ({vocalists.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('instrument')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${filterClass(
                  activeFilter === 'instrument'
                )}`}
              >
                <Piano className="h-3.5 w-3.5" />
                Musicians ({instrumentalists.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('director')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${filterClass(
                  activeFilter === 'director',
                  true
                )}`}
              >
                <Music2 className="h-3.5 w-3.5" />
                Leadership ({directors.length})
              </button>

            </div>

          </div>

        </section>

        {/* ======================================================
            LEADERSHIP
        ====================================================== */}

        {(activeFilter === 'all' ||
          activeFilter === 'director') &&
          directors.length > 0 && (

          <section className="rounded-[30px] border border-white/10 bg-[#111113]/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">

            <div className="mb-5 flex items-center justify-between gap-3">

              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                  <ShieldCheck className="h-4 w-4 text-amber-300" />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                    Music Leadership
                  </h2>

                  <p className="mt-0.5 text-[11px] text-white/25">
                    Ministry direction and administration
                  </p>
                </div>

              </div>

              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-amber-300">
                {directors.length} Leader
                {directors.length !== 1 ? 's' : ''}
              </span>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

              {directors.map(member => (

                <div
                  key={member.id}
                  className="group relative overflow-hidden rounded-[26px] border border-amber-500/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/20 hover:bg-white/[0.05]"
                >

                  <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-amber-500/[0.06] blur-3xl" />

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

                            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-black">
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

                      <span className="rounded-full border border-emerald-500/10 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-300">
                        Active
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>
        )}

        {/* ======================================================
            VOCAL TEAM
        ====================================================== */}

        {(activeFilter === 'all' ||
          activeFilter === 'vocal') &&
          vocalists.length > 0 && (

          <section className="rounded-[30px] border border-white/10 bg-[#111113]/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">

            <div className="mb-5 flex items-center justify-between gap-3">

              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10">
                  <Mic2 className="h-4 w-4 text-[#4da3ff]" />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                    Vocal Team
                  </h2>

                  <p className="mt-0.5 text-[11px] text-white/25">
                    Harmonies, solos and lead vocal assignments
                  </p>
                </div>

              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/35">
                {vocalists.length} Vocalist
                {vocalists.length !== 1 ? 's' : ''}
              </span>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

              {vocalists.map(member => (

                <div
                  key={member.id}
                  className="group rounded-[26px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#007aff]/20 hover:bg-white/[0.05]"
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

                      {renderPermissionButton(member)}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>
        )}

        {/* ======================================================
            INSTRUMENTALISTS
        ====================================================== */}

        {(activeFilter === 'all' ||
          activeFilter === 'instrument') &&
          instrumentalists.length > 0 && (

          <section className="rounded-[30px] border border-white/10 bg-[#111113]/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">

            <div className="mb-5 flex items-center justify-between gap-3">

              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10">
                  <Piano className="h-4 w-4 text-[#4da3ff]" />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                    Band & Instrumentalists
                  </h2>

                  <p className="mt-0.5 text-[11px] text-white/25">
                    Musicians and instrumental sections
                  </p>
                </div>

              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/35">
                {instrumentalists.length} Musician
                {instrumentalists.length !== 1 ? 's' : ''}
              </span>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

              {instrumentalists.map(member => (

                <div
                  key={member.id}
                  className="group rounded-[26px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#007aff]/20 hover:bg-white/[0.05]"
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

                      {renderPermissionButton(member)}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>
        )}

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {team.length === 0 && (

          <section className="rounded-[30px] border border-white/10 bg-[#111113]/90 p-10 text-center shadow-2xl shadow-black/10 backdrop-blur-2xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#007aff]/20 bg-[#007aff]/10">
              <Users className="h-7 w-7 text-[#4da3ff]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              No team members yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/35">
              Add your first vocalist, instrumentalist
              or music leader to begin building the
              ministry roster.
            </p>

            {isMD && (
              <button
                type="button"
                onClick={() => {
                  if (!isMD) return;
                  onAddNewMember();
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#007aff] px-5 py-3 text-xs font-extrabold text-white shadow-xl shadow-blue-500/20 hover:bg-[#006fe6]"
              >
                <UserPlus className="h-4 w-4" />
                Add First Member
              </button>
            )}

          </section>
        )}

        {/* ======================================================
            PHOTO INFORMATION
        ====================================================== */}

        {isMD && team.length > 0 && (

          <section className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl sm:p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/10">
                <ImageIcon className="h-4 w-4 text-[#4da3ff]" />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold text-white">
                  Team photos
                </p>

                <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-white/30">
                  Click a member's photo to change their
                  profile image. Supported formats are JPG,
                  PNG, WebP and GIF, with a maximum file size
                  of 5 MB.
                </p>

              </div>

            </div>

          </section>
        )}

      </div>
    </div>
  );
};

