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
  Lock
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
  onPhotoSelected
}) => {
  const [activeFilter, setActiveFilter] =
    useState<'all' | 'vocal' | 'instrument' | 'director'>('all');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoTarget, setPhotoTarget] =
    useState<TeamMember | null>(null);

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

  const handlePhotoClick = (member: TeamMember) => {
    if (!isMD) return;

    setPhotoTarget(member);
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !photoTarget) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image smaller than 5 MB.');
      return;
    }

    onPhotoSelected?.(photoTarget, file);

    event.target.value = '';
    setPhotoTarget(null);
  };

  const renderMemberPhoto = (
    member: TeamMember,
    variant: 'director' | 'vocal' | 'instrument'
  ) => {
    const style =
      variant === 'director'
        ? 'bg-amber-500/15 border-amber-500/20'
        : 'bg-white/[0.035] border-white/10';

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
          className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border ${style} ${
            isMD
              ? 'cursor-pointer hover:bg-white/10'
              : 'cursor-default'
          }`}
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="h-full w-full object-cover"
            />
          ) : member.icon ? (
            <span className="text-xl">
              {member.icon}
            </span>
          ) : (
            <Users className="h-5 w-5 text-white/35" />
          )}
        </button>

        {isMD && (
          <div className="pointer-events-none absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-[#1c1c1f]">
            <Camera className="h-2.5 w-2.5 text-[#4da3ff]" />
          </div>
        )}
      </div>
    );
  };

  const renderContactInfo = (member: TeamMember) => (
    <div className="space-y-1.5 pt-1 text-xs text-white/40">
      {member.phone && (
        <div className="flex min-w-0 items-center gap-2">
          <Phone className="h-3 w-3 flex-shrink-0 text-[#4da3ff]" />
          <span className="truncate">{member.phone}</span>
        </div>
      )}

      {member.email && (
        <div className="flex min-w-0 items-center gap-2">
          <Mail className="h-3 w-3 flex-shrink-0 text-white/45" />
          <span className="truncate">{member.email}</span>
        </div>
      )}
    </div>
  );

  const renderMemberActions = (
    member: TeamMember,
    allowDelete: boolean
  ) => {
    if (!isMD) return null;

    return (
      <div className="flex flex-shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEditMember(member)}
          title="Edit member"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/45 hover:bg-white/10 hover:text-white"
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
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/45 hover:bg-white/10 hover:text-rose-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  };

  const filterClass = (
    active: boolean,
    amber = false
  ) =>
    active
      ? amber
        ? 'bg-amber-500 text-black'
        : 'bg-[#007aff] text-white'
      : 'bg-transparent text-white/40 hover:bg-white/10 hover:text-white';

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden bg-[#0f0f11] text-white animate-in fade-in duration-200">

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handlePhotoChange}
      />

      <div className="space-y-6">

        {/* HEADER */}
        <section className="rounded-[28px] border border-white/10 bg-[#111113]/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div className="min-w-0">

              <div className="mb-3 flex flex-wrap items-center gap-2">

                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-300">
                  <Users className="h-3 w-3" />
                  Music Team
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">
                  Team Control
                </span>

              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Jewels Music Team
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-medium text-white/45">
                {team.length} dedicated vocalists, musicians,
                and directors serving in music ministry.
              </p>

            </div>

            <div className="flex flex-shrink-0 items-center gap-2">

              {isMD ? (
                <button
                  type="button"
                  onClick={onAddNewMember}
                  className="flex items-center gap-2 rounded-2xl bg-[#007aff] px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-blue-500/20 hover:bg-[#0062cc] active:scale-95 sm:text-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Team Member
                </button>
              ) : (
                <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-xs font-semibold text-white/40">
                  <Lock className="h-3.5 w-3.5" />
                  Member management restricted to MD
                </div>
              )}

            </div>

          </div>

          {/* FILTER BAR */}
          <div className="mt-6 overflow-x-auto">
            <div className="flex min-w-max items-center gap-1.5 rounded-2xl border border-white/10 bg-black/35 p-1">

              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap ${filterClass(
                  activeFilter === 'all'
                )}`}
              >
                All Members ({team.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('vocal')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap ${filterClass(
                  activeFilter === 'vocal'
                )}`}
              >
                <Mic2 className="h-3.5 w-3.5" />
                Vocalists ({vocalists.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('instrument')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap ${filterClass(
                  activeFilter === 'instrument'
                )}`}
              >
                <Piano className="h-3.5 w-3.5" />
                Musicians ({instrumentalists.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('director')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap ${filterClass(
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

        {/* LEADERSHIP */}
        {(activeFilter === 'all' ||
          activeFilter === 'director') &&
          directors.length > 0 && (
            <section className="rounded-[28px] border border-white/10 bg-[#111113]/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">

              <div className="mb-5 flex items-center justify-between gap-3">

                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-amber-300" />

                    <h2 className="text-xl font-bold tracking-tight text-white">
                      Music Leadership
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-white/30">
                    Ministry direction and administration
                  </p>
                </div>

                <span className="rounded-full border border-amber-500/20 bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  {directors.length} Leader
                  {directors.length !== 1 ? 's' : ''}
                </span>

              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                {directors.map(member => (

                  <div
                    key={member.id}
                    className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl"
                  >

                    <div>

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

                              <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-extrabold text-black">
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

                    </div>

                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">

                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Full Admin Rights
                      </span>

                      <span className="rounded-full border border-emerald-500/10 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        Active Leader
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </section>
          )}

        {/* VOCAL TEAM */}
        {(activeFilter === 'all' ||
          activeFilter === 'vocal') &&
          vocalists.length > 0 && (
            <section className="rounded-[28px] border border-white/10 bg-[#111113]/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">

              <div className="mb-5 flex items-center justify-between gap-3">

                <div>
                  <div className="flex items-center gap-2">
                    <Mic2 className="h-5 w-5 text-[#4da3ff]" />

                    <h2 className="text-xl font-bold tracking-tight text-white">
                      Vocal Team
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-white/30">
                    Harmonies, solos and lead vocal assignments
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[10px] font-bold text-white/40">
                  {vocalists.length} Vocalist
                  {vocalists.length !== 1 ? 's' : ''}
                </span>

              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                {vocalists.map(member => (

                  <div
                    key={member.id}
                    className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl"
                  >

                    <div>

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

                    </div>

                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">

                      <span className="rounded-full border border-[#007aff]/20 bg-[#007aff]/15 px-2.5 py-1 text-[10px] font-bold text-[#4da3ff]">
                        {member.voicePart ||
                          'Vocal Section'}
                      </span>

                      {isMD && (
                        <button
                          type="button"
                          onClick={() =>
                            onTogglePermission(
                              member.id
                            )
                          }
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                            member.canEdit
                              ? 'border-emerald-500/10 bg-emerald-500/10 text-emerald-300'
                              : 'border-white/10 bg-white/[0.035] text-white/40 hover:bg-white/10 hover:text-white/70'
                          }`}
                        >
                          {member.canEdit
                            ? 'Upload Access'
                            : 'Grant Uploads'}
                        </button>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </section>
          )}

        {/* INSTRUMENTALISTS */}
        {(activeFilter === 'all' ||
          activeFilter === 'instrument') &&
          instrumentalists.length > 0 && (
            <section className="rounded-[28px] border border-white/10 bg-[#111113]/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-2xl sm:p-6">

              <div className="mb-5 flex items-center justify-between gap-3">

                <div>
                  <div className="flex items-center gap-2">
                    <Piano className="h-5 w-5 text-[#4da3ff]" />

                    <h2 className="text-xl font-bold tracking-tight text-white">
                      Band & Instrumentalists
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-white/30">
                    Musicians and instrumental sections
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[10px] font-bold text-white/40">
                  {instrumentalists.length} Musician
                  {instrumentalists.length !== 1 ? 's' : ''}
                </span>

              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                {instrumentalists.map(member => (

                  <div
                    key={member.id}
                    className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl"
                  >

                    <div>

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

                    </div>

                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">

                      <span className="rounded-full border border-[#007aff]/20 bg-[#007aff]/15 px-2.5 py-1 text-[10px] font-bold text-[#4da3ff]">
                        {member.instrumentType ||
                          'Band'}
                      </span>

                      {isMD && (
                        <button
                          type="button"
                          onClick={() =>
                            onTogglePermission(
                              member.id
                            )
                          }
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                            member.canEdit
                              ? 'border-emerald-500/10 bg-emerald-500/10 text-emerald-300'
                              : 'border-white/10 bg-white/[0.035] text-white/40 hover:bg-white/10 hover:text-white/70'
                          }`}
                        >
                          {member.canEdit
                            ? 'Upload Access'
                            : 'Grant Uploads'}
                        </button>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </section>
          )}

        {/* PHOTO INFORMATION */}
        {isMD && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#007aff]/20 bg-[#007aff]/15">
                <ImageIcon className="h-4 w-4 text-[#4da3ff]" />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Team photos
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-white/35">
                  Click a member's photo area to choose a
                  profile image. Photos should be JPG, PNG,
                  WebP, or GIF and under 5 MB.
                </p>
              </div>

            </div>

          </section>
        )}

      </div>
    </div>
  );
};
