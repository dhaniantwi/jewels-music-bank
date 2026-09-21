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
  Image as ImageIcon
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

    if (!file || !photoTarget) {
      return;
    }

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
        ? 'bg-amber-500/10 border-amber-400/20'
        : variant === 'vocal'
          ? 'bg-[#7c3aed]/10 border-[#7c3aed]/20'
          : 'bg-[#007aff]/10 border-[#007aff]/20';

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
          className={`w-14 h-14 rounded-2xl ${style} border overflow-hidden flex items-center justify-center transition-all ${
            isMD
              ? 'cursor-pointer hover:scale-105 hover:border-white/20'
              : 'cursor-default'
          }`}
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : member.icon ? (
            <span className="text-2xl">
              {member.icon}
            </span>
          ) : (
            <span className="text-xl">
              👤
            </span>
          )}
        </button>

        {isMD && (
          <div className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-[#17171a] border border-white/10 shadow-lg flex items-center justify-center pointer-events-none">
            <Camera className="w-2.5 h-2.5 text-[#4da3ff]" />
          </div>
        )}
      </div>
    );
  };

  const renderContactInfo = (member: TeamMember) => (
    <div className="space-y-1.5 pt-1 text-xs text-white/40">
      {member.phone && (
        <div className="flex items-center gap-2 min-w-0">
          <Phone className="w-3 h-3 text-[#007aff] flex-shrink-0" />
          <span className="truncate">{member.phone}</span>
        </div>
      )}

      {member.email && (
        <div className="flex items-center gap-2 min-w-0">
          <Mail className="w-3 h-3 text-[#7c3aed] flex-shrink-0" />
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
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEditMember(member)}
          title="Edit member"
          className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.10] flex items-center justify-center text-white/45 hover:text-white transition-all"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>

        {allowDelete && (
          <button
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
            className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/15 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Hidden photo input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handlePhotoChange}
      />

      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="space-y-5">

        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-300 bg-amber-400/10 border border-amber-400/15 px-3 py-1 rounded-full">
                People & Ministry Roster
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">
                Team Control
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Jewels Music Team
            </h1>

            <p className="text-sm text-white/45 font-medium mt-2 max-w-2xl">
              {team.length} dedicated vocalists, musicians,
              and directors serving in music ministry.
            </p>
          </div>

          {/* MD ACTION */}
          <div className="flex items-center gap-2">

            {isMD ? (
              <button
                onClick={onAddNewMember}
                className="px-5 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#1685ff] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_10px_30px_rgba(0,122,255,0.25)] transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            ) : (
              <div className="px-3.5 py-2.5 rounded-2xl bg-white/[0.045] text-white/35 text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                <span>
                  🔒 Member management restricted to MD
                </span>
              </div>
            )}

          </div>
        </div>

        {/* =====================================================
            FILTER TABS
        ===================================================== */}
        <div className="flex items-center gap-1.5 bg-white/[0.035] border border-white/10 p-1 rounded-2xl max-w-full overflow-x-auto">

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#007aff] text-white shadow-[0_5px_18px_rgba(0,122,255,0.20)]'
                : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            All Members ({team.length})
          </button>

          <button
            onClick={() => setActiveFilter('vocal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'vocal'
                ? 'bg-[#7c3aed] text-white shadow-[0_5px_18px_rgba(124,58,237,0.20)]'
                : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            🎤 Vocalists ({vocalists.length})
          </button>

          <button
            onClick={() => setActiveFilter('instrument')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'instrument'
                ? 'bg-[#007aff] text-white shadow-[0_5px_18px_rgba(0,122,255,0.20)]'
                : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            🎹 Musicians ({instrumentalists.length})
          </button>

          <button
            onClick={() => setActiveFilter('director')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'director'
                ? 'bg-amber-500 text-black shadow-[0_5px_18px_rgba(245,158,11,0.18)]'
                : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            🎼 Leadership ({directors.length})
          </button>

        </div>
      </div>

      {/* =========================================================
          LEADERSHIP
      ========================================================= */}
      {(activeFilter === 'all' ||
        activeFilter === 'director') &&
        directors.length > 0 && (

          <section className="space-y-4">

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎼</span>

                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Music Leadership
                  </h2>
                </div>

                <p className="text-xs text-white/30 mt-1">
                  Ministry direction and administration
                </p>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/15 px-2.5 py-1 rounded-full">
                {directors.length} Leader
                {directors.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {directors.map(member => (

                <div
                  key={member.id}
                  className="ios-card p-5 border-amber-400/15 bg-gradient-to-br from-amber-400/[0.08] via-white/[0.045] to-transparent flex flex-col justify-between"
                >

                  <div>

                    <div className="flex items-start justify-between gap-3 mb-4">

                      <div className="flex items-center gap-3 min-w-0">

                        {renderMemberPhoto(
                          member,
                          'director'
                        )}

                        <div className="min-w-0">

                          <div className="flex items-center gap-1.5">

                            <h3 className="text-base font-extrabold text-white truncate">
                              {member.name}
                            </h3>

                            <span className="text-[9px] bg-amber-500 text-black font-extrabold px-1.5 py-0.5 rounded-full">
                              MD
                            </span>

                          </div>

                          <p className="text-xs font-semibold text-amber-300 mt-1 truncate">
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

                  <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">

                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Full Admin Rights
                    </span>

                    <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-400/10 border border-emerald-400/10 px-2 py-0.5 rounded-full">
                      Active Leader
                    </span>

                  </div>

                </div>
              ))}

            </div>
          </section>
        )}

      {/* =========================================================
          VOCAL TEAM
      ========================================================= */}
      {(activeFilter === 'all' ||
        activeFilter === 'vocal') &&
        vocalists.length > 0 && (

          <section className="space-y-4">

            <div className="flex items-center justify-between gap-3">

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎤</span>

                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Vocal Team
                  </h2>
                </div>

                <p className="text-xs text-white/30 mt-1">
                  Harmonies, solos and lead vocal assignments
                </p>
              </div>

              <span className="text-[10px] font-bold text-white/35 bg-white/[0.045] border border-white/10 px-2.5 py-1 rounded-full">
                {vocalists.length} Vocalist
                {vocalists.length !== 1 ? 's' : ''}
              </span>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {vocalists.map(member => (

                <div
                  key={member.id}
                  className="ios-card p-5 flex flex-col justify-between"
                >

                  <div>

                    <div className="flex items-start justify-between gap-3 mb-4">

                      <div className="flex items-center gap-3 min-w-0">

                        {renderMemberPhoto(
                          member,
                          'vocal'
                        )}

                        <div className="min-w-0">

                          <h3 className="text-base font-bold text-white truncate">
                            {member.name}
                          </h3>

                          <p className="text-xs font-semibold text-[#b18cff] truncate mt-1">
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

                  <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">

                    <span className="text-[10px] font-bold text-[#b18cff] bg-[#7c3aed]/10 border border-[#7c3aed]/15 px-2.5 py-1 rounded-full">
                      {member.voicePart ||
                        'Vocal Section'}
                    </span>

                    {isMD && (
                      <button
                        onClick={() =>
                          onTogglePermission(
                            member.id
                          )
                        }
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                          member.canEdit
                            ? 'bg-emerald-400/10 border-emerald-400/15 text-emerald-300'
                            : 'bg-white/[0.04] border-white/10 text-white/35 hover:text-white/60'
                        }`}
                      >
                        {member.canEdit
                          ? '✓ Upload Access'
                          : '+ Grant Uploads'}
                      </button>
                    )}

                  </div>

                </div>
              ))}

            </div>
          </section>
        )}

      {/* =========================================================
          INSTRUMENTALISTS
      ========================================================= */}
      {(activeFilter === 'all' ||
        activeFilter === 'instrument') &&
        instrumentalists.length > 0 && (

          <section className="space-y-4">

            <div className="flex items-center justify-between gap-3">

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎹</span>

                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Band & Instrumentalists
                  </h2>
                </div>

                <p className="text-xs text-white/30 mt-1">
                  Musicians and instrumental sections
                </p>
              </div>

              <span className="text-[10px] font-bold text-white/35 bg-white/[0.045] border border-white/10 px-2.5 py-1 rounded-full">
                {instrumentalists.length} Musician
                {instrumentalists.length !== 1 ? 's' : ''}
              </span>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {instrumentalists.map(member => (

                <div
                  key={member.id}
                  className="ios-card p-5 flex flex-col justify-between"
                >

                  <div>

                    <div className="flex items-start justify-between gap-3 mb-4">

                      <div className="flex items-center gap-3 min-w-0">

                        {renderMemberPhoto(
                          member,
                          'instrument'
                        )}

                        <div className="min-w-0">

                          <h3 className="text-base font-bold text-white truncate">
                            {member.name}
                          </h3>

                          <p className="text-xs font-semibold text-[#4da3ff] truncate mt-1">
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

                  <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">

                    <span className="text-[10px] font-bold text-[#4da3ff] bg-[#007aff]/10 border border-[#007aff]/15 px-2.5 py-1 rounded-full">
                      {member.instrumentType ||
                        'Band'}
                    </span>

                    {isMD && (
                      <button
                        onClick={() =>
                          onTogglePermission(
                            member.id
                          )
                        }
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                          member.canEdit
                            ? 'bg-emerald-400/10 border-emerald-400/15 text-emerald-300'
                            : 'bg-white/[0.04] border-white/10 text-white/35 hover:text-white/60'
                        }`}
                      >
                        {member.canEdit
                          ? '✓ Upload Access'
                          : '+ Grant Uploads'}
                      </button>
                    )}

                  </div>

                </div>
              ))}

            </div>
          </section>
        )}

      {/* =========================================================
          PHOTO INFORMATION
      ========================================================= */}
      {isMD && (
        <div className="ios-glass rounded-2xl p-4 flex items-start gap-3 border border-[#007aff]/15">

          <div className="w-10 h-10 rounded-xl bg-[#007aff]/10 border border-[#007aff]/15 flex items-center justify-center flex-shrink-0">
            <ImageIcon className="w-4 h-4 text-[#4da3ff]" />
          </div>

          <div>
            <p className="text-xs font-bold text-white">
              Team photos
            </p>

            <p className="text-[11px] text-white/35 mt-1 leading-relaxed">
              Click a member's photo area to choose a
              profile image. Photos should be JPG, PNG,
              WebP, or GIF and under 5 MB.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
