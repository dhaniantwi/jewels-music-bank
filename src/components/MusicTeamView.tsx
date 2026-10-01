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
  Users,
  Mic2,
  Piano,
  Music2,
  Lock,
  Search,
  Crown,
  ChevronRight,
  CheckCircle2,
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

type TeamFilter = 'all' | 'vocal' | 'instrument' | 'director';

export const MusicTeamView: React.FC<MusicTeamViewProps> = ({
  team,
  activeRole,
  onAddNewMember,
  onEditMember,
  onDeleteMember,
  onTogglePermission,
  onPhotoSelected,
}) => {
  const isMD = activeRole === 'admin_md';

  const [activeFilter, setActiveFilter] = useState<TeamFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [photoTarget, setPhotoTarget] = useState<TeamMember | null>(null);
  const [showPhotoInfo, setShowPhotoInfo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const directors = useMemo(
    () => team.filter((member) => member.type === 'director'),
    [team]
  );

  const vocalists = useMemo(
    () => team.filter((member) => member.type === 'vocal'),
    [team]
  );

  const instrumentalists = useMemo(
    () => team.filter((member) => member.type === 'instrument'),
    [team]
  );

  const filteredTeam = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return team.filter((member) => {
      const matchesFilter =
        activeFilter === 'all' || member.type === activeFilter;

      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.role?.toLowerCase().includes(query) ||
        member.voicePart?.toLowerCase().includes(query) ||
        member.instrumentType?.toLowerCase().includes(query) ||
        member.phone?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [team, activeFilter, searchQuery]);

  const filteredDirectors = filteredTeam.filter(
    (member) => member.type === 'director'
  );

  const filteredVocalists = filteredTeam.filter(
    (member) => member.type === 'vocal'
  );

  const filteredInstrumentalists = filteredTeam.filter(
    (member) => member.type === 'instrument'
  );

  const handlePhotoClick = (member: TeamMember) => {
    if (!isMD) return;

    setPhotoTarget(member);
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !photoTarget) return;

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PNG, JPG, WEBP or GIF image.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be 5 MB or less.');
      event.target.value = '';
      return;
    }

    onPhotoSelected?.(photoTarget, file);

    setPhotoTarget(null);
    event.target.value = '';
  };

  const handleDelete = (member: TeamMember) => {
    if (member.type === 'director') return;

    const confirmed = window.confirm(
      `Remove ${member.name} from the ${
        member.type === 'vocal' ? 'vocal' : 'band'
      } roster?`
    );

    if (confirmed) {
      onDeleteMember(member.id);
    }
  };

  const filterOptions: {
    key: TeamFilter;
    label: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    {
      key: 'all',
      label: 'All Members',
      icon: <Users size={15} />,
      count: team.length,
    },
    {
      key: 'vocal',
      label: 'Vocals',
      icon: <Mic2 size={15} />,
      count: vocalists.length,
    },
    {
      key: 'instrument',
      label: 'Band',
      icon: <Music2 size={15} />,
      count: instrumentalists.length,
    },
    {
      key: 'director',
      label: 'Leadership',
      icon: <Crown size={15} />,
      count: directors.length,
    },
  ];

  const getMemberSubtitle = (member: TeamMember) => {
    if (member.type === 'vocal') {
      return member.voicePart || member.role || 'Vocalist';
    }

    if (member.type === 'instrument') {
      return member.instrumentType || member.role || 'Musician';
    }

    return member.role || 'Music Leadership';
  };

  const getMemberIcon = (member: TeamMember) => {
    if (member.type === 'vocal') return <Mic2 size={17} />;
    if (member.type === 'instrument') return <Piano size={17} />;
    return <Crown size={17} />;
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const renderMemberCard = (member: TeamMember) => {
    const isDirector = member.type === 'director';
    const subtitle = getMemberSubtitle(member);

    return (
      <div
        key={member.id}
        className="
          group relative overflow-hidden
          rounded-[28px]
          border border-white/[0.08]
          bg-[#0e1218]/95
          transition-all duration-500
          hover:-translate-y-1
          hover:border-[#007aff]/35
          hover:bg-[#111720]
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        {/* Hover glow */}
        <div
          className="
            pointer-events-none absolute -right-16 -top-16
            h-40 w-40 rounded-full
            bg-[#007aff]/10 blur-3xl
            opacity-0 transition-opacity duration-500
            group-hover:opacity-100
          "
        />

        {/* Top accent */}
        <div
          className={`
            absolute left-0 right-0 top-0 h-[2px]
            ${
              isDirector
                ? 'bg-gradient-to-r from-transparent via-amber-400/80 to-transparent'
                : 'bg-gradient-to-r from-transparent via-[#007aff]/70 to-transparent'
            }
            opacity-50 group-hover:opacity-100
            transition-opacity
          `}
        />

        <div className="p-5">
          {/* Photo */}
          <div className="relative mx-auto mb-5 w-fit">
            <div
              className={`
                absolute inset-[-7px] rounded-full blur-md
                opacity-40 transition-all duration-500
                group-hover:opacity-80
                ${
                  isDirector
                    ? 'bg-amber-400/20'
                    : 'bg-[#007aff]/20'
                }
              `}
            />

            <button
              type="button"
              onClick={() => handlePhotoClick(member)}
              disabled={!isMD}
              className={`
                relative block h-28 w-28 overflow-hidden rounded-full
                border-2
                ${
                  isDirector
                    ? 'border-amber-300/40'
                    : 'border-[#007aff]/30'
                }
                bg-[#171c24]
                ${
                  isMD
                    ? 'cursor-pointer'
                    : 'cursor-default'
                }
              `}
            >
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="
                    h-full w-full object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                />
              ) : member.icon ? (
                <img
                  src={member.icon}
                  alt={member.name}
                  className="
                    h-full w-full object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                />
              ) : (
                <div
                  className="
                    flex h-full w-full items-center justify-center
                    bg-gradient-to-br from-[#151b24] to-[#0a0d12]
                    text-2xl font-bold text-white/80
                  "
                >
                  {getInitials(member.name)}
                </div>
              )}

              {isMD && (
                <div
                  className="
                    absolute inset-0 flex items-center justify-center
                    bg-black/65 opacity-0
                    transition-opacity duration-300
                    group-hover:opacity-100
                  "
                >
                  <Camera size={21} className="text-white" />
                </div>
              )}
            </button>

            {/* Status */}
            <div
              className="
                absolute -bottom-1 -right-1
                flex h-7 w-7 items-center justify-center
                rounded-full border-4 border-[#0e1218]
                bg-emerald-500
              "
            >
              <CheckCircle2 size={12} className="text-white" />
            </div>
          </div>

          {/* Identity */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h3 className="max-w-[220px] truncate text-[17px] font-bold tracking-[-0.02em] text-white">
                {member.name}
              </h3>

              {isDirector && (
                <Crown
                  size={14}
                  className="shrink-0 text-amber-300"
                />
              )}
            </div>

            <div
              className={`
                mt-2 inline-flex items-center gap-2 rounded-full
                border px-3 py-1.5 text-[11px] font-semibold
                ${
                  isDirector
                    ? 'border-amber-300/15 bg-amber-300/[0.07] text-amber-200'
                    : 'border-white/[0.07] bg-white/[0.035] text-white/60'
                }
              `}
            >
              {getMemberIcon(member)}
              <span>{subtitle}</span>
            </div>
          </div>

          {/* Contact */}
          {(member.phone || member.email) && (
            <div className="mt-5 space-y-2">
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="
                    flex items-center gap-3 rounded-xl
                    border border-white/[0.06]
                    bg-black/20 px-3 py-2.5
                    text-xs text-white/55
                    transition-all hover:border-[#007aff]/20
                    hover:bg-[#007aff]/[0.05]
                    hover:text-white/80
                  "
                >
                  <Phone
                    size={14}
                    className="shrink-0 text-[#4da3ff]"
                  />
                  <span className="truncate">{member.phone}</span>
                </a>
              )}

              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="
                    flex items-center gap-3 rounded-xl
                    border border-white/[0.06]
                    bg-black/20 px-3 py-2.5
                    text-xs text-white/55
                    transition-all hover:border-[#007aff]/20
                    hover:bg-[#007aff]/[0.05]
                    hover:text-white/80
                  "
                >
                  <Mail
                    size={14}
                    className="shrink-0 text-[#4da3ff]"
                  />
                  <span className="truncate">{member.email}</span>
                </a>
              )}
            </div>
          )}

          {/* Permission */}
          {isMD && (
            <button
              type="button"
              onClick={() => onTogglePermission(member.id)}
              className="
                mt-4 flex w-full items-center justify-between
                rounded-xl border border-white/[0.06]
                bg-white/[0.025] px-3 py-2.5
                text-left transition-all
                hover:border-[#007aff]/20
                hover:bg-[#007aff]/[0.05]
              "
            >
              <span className="flex items-center gap-2">
                {member.canEdit ? (
                  <ShieldCheck
                    size={14}
                    className="text-emerald-300"
                  />
                ) : (
                  <Lock
                    size={14}
                    className="text-white/30"
                  />
                )}

                <span className="text-[11px] font-medium text-white/55">
                  {member.canEdit
                    ? 'Upload Access'
                    : 'Grant Uploads'}
                </span>
              </span>

              <ChevronRight
                size={14}
                className="text-white/25"
              />
            </button>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEditMember(member)}
              className="
                flex flex-1 items-center justify-center gap-2
                rounded-xl border border-white/[0.07]
                bg-white/[0.035] px-3 py-2.5
                text-xs font-semibold text-white/65
                transition-all
                hover:border-[#007aff]/30
                hover:bg-[#007aff]/[0.08]
                hover:text-white
              "
            >
              <Edit size={14} />
              Edit
            </button>

            {!isDirector && (
              <button
                type="button"
                onClick={() => handleDelete(member)}
                className="
                  flex h-10 w-10 shrink-0 items-center
                  justify-center rounded-xl
                  border border-red-400/10
                  bg-red-400/[0.035]
                  text-red-300/60
                  transition-all
                  hover:border-red-400/25
                  hover:bg-red-400/[0.08]
                  hover:text-red-300
                "
                title="Remove member"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLeadershipCard = (member: TeamMember) => {
    return (
      <div
        key={member.id}
        className="
          group relative overflow-hidden
          rounded-[30px]
          border border-amber-300/10
          bg-gradient-to-br from-[#15130e] via-[#101218] to-[#0c1016]
          p-6 sm:p-7
        "
      >
        <div
          className="
            pointer-events-none absolute
            -right-24 -top-24 h-64 w-64
            rounded-full bg-amber-400/[0.08]
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none absolute
            -bottom-28 -left-20 h-60 w-60
            rounded-full bg-[#007aff]/[0.07]
            blur-3xl
          "
        />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          {/* Portrait */}
          <div className="relative mx-auto md:mx-0">
            <div
              className="
                absolute inset-[-9px] rounded-full
                bg-amber-300/10 blur-xl
              "
            />

            <button
              type="button"
              onClick={() => handlePhotoClick(member)}
              disabled={!isMD}
              className="
                relative h-32 w-32 overflow-hidden
                rounded-full border-2 border-amber-300/30
                bg-[#17140e]
              "
            >
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="
                    h-full w-full object-cover
                    transition-transform duration-700
                    group-hover:scale-105
                  "
                />
              ) : member.icon ? (
                <img
                  src={member.icon}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="
                    flex h-full w-full items-center justify-center
                    bg-gradient-to-br from-[#211d13] to-[#0d1015]
                    text-3xl font-bold text-amber-200
                  "
                >
                  {getInitials(member.name)}
                </div>
              )}

              {isMD && (
                <div
                  className="
                    absolute inset-0 flex items-center justify-center
                    bg-black/60 opacity-0 transition-opacity
                    group-hover:opacity-100
                  "
                >
                  <Camera size={22} />
                </div>
              )}
            </button>

            <div
              className="
                absolute -bottom-1 -right-1
                flex h-9 w-9 items-center justify-center
                rounded-full border-4 border-[#111218]
                bg-amber-300 text-black
              "
            >
              <Crown size={15} />
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1 text-center md:text-left">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span
                className="
                  inline-flex items-center gap-1.5
                  rounded-full border border-amber-300/15
                  bg-amber-300/[0.07]
                  px-2.5 py-1 text-[10px]
                  font-bold uppercase tracking-[0.16em]
                  text-amber-200
                "
              >
                <Sparkles size={11} />
                Music Leadership
              </span>

              <span
                className="
                  inline-flex items-center gap-1.5
                  text-[10px] font-semibold
                  uppercase tracking-[0.14em]
                  text-emerald-300
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
            </div>

            <h3 className="text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
              {member.name}
            </h3>

            <p className="mt-1 text-sm font-medium text-amber-200/70">
              {member.role || 'Music Director'}
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
              Leading the musical direction, coordination and
              ministry excellence of the Jewels music team.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              <div
                className="
                  flex items-center gap-2 rounded-xl
                  border border-white/[0.07]
                  bg-black/20 px-3 py-2
                  text-xs text-white/55
                "
              >
                <ShieldCheck
                  size={14}
                  className="text-amber-300"
                />
                Full Management Access
              </div>

              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="
                    flex items-center gap-2 rounded-xl
                    border border-white/[0.07]
                    bg-black/20 px-3 py-2
                    text-xs text-white/55
                    hover:text-white
                  "
                >
                  <Phone size={14} className="text-[#4da3ff]" />
                  Contact
                </a>
              )}
            </div>
          </div>

          {/* Action */}
          <button
            type="button"
            onClick={() => onEditMember(member)}
            className="
              flex items-center justify-center gap-2
              rounded-xl border border-white/[0.08]
              bg-white/[0.04] px-4 py-3
              text-xs font-bold text-white/70
              transition-all
              hover:border-amber-300/20
              hover:bg-amber-300/[0.07]
              hover:text-amber-100
            "
          >
            <Edit size={14} />
            Edit Profile
          </button>
        </div>
      </div>
    );
  };

  const renderSectionHeader = (
    icon: React.ReactNode,
    eyebrow: string,
    title: string,
    count: number,
    accent: 'blue' | 'amber' = 'blue'
  ) => (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`
            flex h-10 w-10 items-center justify-center
            rounded-xl border
            ${
              accent === 'amber'
                ? 'border-amber-300/15 bg-amber-300/[0.07] text-amber-300'
                : 'border-[#007aff]/15 bg-[#007aff]/[0.07] text-[#4da3ff]'
            }
          `}
        >
          {icon}
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
            {eyebrow}
          </p>
          <h2 className="mt-0.5 text-lg font-bold tracking-[-0.02em] text-white">
            {title}
          </h2>
        </div>
      </div>

      <span className="text-xs font-semibold text-white/30">
        {count} {count === 1 ? 'member' : 'members'}
      </span>
    </div>
  );

  const total = team.length;

  const vocalPercentage =
    total > 0 ? Math.round((vocalists.length / total) * 100) : 0;

  const bandPercentage =
    total > 0
      ? Math.round((instrumentalists.length / total) * 100)
      : 0;

  const leadershipPercentage =
    total > 0 ? Math.round((directors.length / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#050608] text-white">
      {/* Ambient page lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="
            absolute -left-40 top-20
            h-96 w-96 rounded-full
            bg-[#007aff]/[0.045] blur-[120px]
          "
        />

        <div
          className="
            absolute -right-40 top-[35%]
            h-96 w-96 rounded-full
            bg-[#007aff]/[0.035] blur-[120px]
          "
        />

        <div
          className="
            absolute bottom-0 left-[35%]
            h-72 w-72 rounded-full
            bg-amber-400/[0.025] blur-[110px]
          "
        />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        {/* Hidden upload input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* =========================================================
            HERO
        ========================================================= */}
        <section
          className="
            relative overflow-hidden
            rounded-[32px]
            border border-white/[0.08]
            bg-[#0c1016]
            shadow-[0_30px_100px_rgba(0,0,0,0.35)]
          "
        >
          <div
            className="
              pointer-events-none absolute right-[-120px] top-[-160px]
              h-[420px] w-[420px]
              rounded-full bg-[#007aff]/[0.08]
              blur-[100px]
            "
          />

          <div
            className="
              pointer-events-none absolute bottom-[-180px] left-[20%]
              h-[360px] w-[360px]
              rounded-full bg-[#007aff]/[0.035]
              blur-[100px]
            "
          />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div
                  className="
                    mb-5 inline-flex items-center gap-2
                    rounded-full border border-[#007aff]/15
                    bg-[#007aff]/[0.07]
                    px-3 py-1.5
                    text-[10px] font-bold uppercase
                    tracking-[0.2em] text-[#69b3ff]
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4da3ff]" />
                  Jewels Music Ministry
                </div>

                <h1
                  className="
                    text-4xl font-black
                    tracking-[-0.05em]
                    text-white sm:text-5xl lg:text-6xl
                  "
                >
                  MUSIC TEAM
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                  The people behind every song, rehearsal and
                  ministration. Manage the team, keep roles clear,
                  and keep the ministry moving together.
                </p>

                {/* Quick metrics */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div
                    className="
                      rounded-2xl border border-white/[0.07]
                      bg-white/[0.025] p-4
                    "
                  >
                    <Users size={17} className="text-[#4da3ff]" />
                    <p className="mt-3 text-2xl font-black text-white">
                      {total}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
                      Total Team
                    </p>
                  </div>

                  <div
                    className="
                      rounded-2xl border border-white/[0.07]
                      bg-white/[0.025] p-4
                    "
                  >
                    <Mic2 size={17} className="text-[#4da3ff]" />
                    <p className="mt-3 text-2xl font-black text-white">
                      {vocalists.length}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
                      Vocalists
                    </p>
                  </div>

                  <div
                    className="
                      rounded-2xl border border-white/[0.07]
                      bg-white/[0.025] p-4
                    "
                  >
                    <Music2 size={17} className="text-[#4da3ff]" />
                    <p className="mt-3 text-2xl font-black text-white">
                      {instrumentalists.length}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
                      Band
                    </p>
                  </div>

                  <div
                    className="
                      rounded-2xl border border-amber-300/10
                      bg-amber-300/[0.025] p-4
                    "
                  >
                    <Crown size={17} className="text-amber-300" />
                    <p className="mt-3 text-2xl font-black text-white">
                      {directors.length}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
                      Leadership
                    </p>
                  </div>
                </div>
              </div>

              {/* Add member */}
              {isMD && (
                <button
                  type="button"
                  onClick={onAddNewMember}
                  className="
                    group relative flex shrink-0
                    items-center justify-center gap-3
                    overflow-hidden rounded-2xl
                    bg-[#007aff] px-6 py-4
                    text-sm font-bold text-white
                    shadow-[0_12px_40px_rgba(0,122,255,0.22)]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#1685ff]
                    hover:shadow-[0_18px_50px_rgba(0,122,255,0.3)]
                  "
                >
                  <UserPlus size={18} />
                  Add Team Member
                  <ChevronRight
                    size={16}
                    className="
                      transition-transform
                      group-hover:translate-x-0.5
                    "
                  />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            DIRECTORY TOOLBAR
        ========================================================= */}
        <section className="mt-7">
          <div
            className="
              rounded-[28px]
              border border-white/[0.08]
              bg-[#0c1015]/90
              p-4 sm:p-5
            "
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4da3ff]">
                  Team Directory
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-[-0.025em] text-white">
                  Find your people
                </h2>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={17}
                  className="
                    pointer-events-none absolute
                    left-4 top-1/2 -translate-y-1/2
                    text-white/25
                  "
                />

                <input
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search members..."
                  className="
                    h-11 w-full rounded-xl
                    border border-white/[0.08]
                    bg-black/25 pl-11 pr-10
                    text-sm text-white outline-none
                    placeholder:text-white/25
                    transition-all
                    focus:border-[#007aff]/40
                    focus:bg-[#007aff]/[0.035]
                  "
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="
                      absolute right-3 top-1/2
                      -translate-y-1/2
                      text-white/25
                      hover:text-white/70
                    "
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            <div
              className="
                mt-5 flex gap-2 overflow-x-auto
                pb-1 scrollbar-hide
              "
            >
              {filterOptions.map((filter) => {
                const active = activeFilter === filter.key;

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() =>
                      setActiveFilter(filter.key)
                    }
                    className={`
                      flex shrink-0 items-center gap-2
                      rounded-xl border px-3.5 py-2.5
                      text-xs font-semibold
                      transition-all duration-300
                      ${
                        active
                          ? 'border-[#007aff]/30 bg-[#007aff]/[0.1] text-white'
                          : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/[0.12] hover:text-white/70'
                      }
                    `}
                  >
                    {filter.icon}
                    {filter.label}
                    <span
                      className={`
                        rounded-md px-1.5 py-0.5 text-[10px]
                        ${
                          active
                            ? 'bg-[#007aff]/20 text-[#69b3ff]'
                            : 'bg-white/[0.05] text-white/25'
                        }
                      `}
                    >
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            LEADERSHIP
        ========================================================= */}
        {filteredDirectors.length > 0 && (
          <section className="mt-8">
            {renderSectionHeader(
              <Crown size={18} />,
              'Leadership',
              'Music Leadership',
              filteredDirectors.length,
              'amber'
            )}

            <div className="space-y-4">
              {filteredDirectors.map(renderLeadershipCard)}
            </div>
          </section>
        )}

        {/* =========================================================
            MINISTRY SNAPSHOT
        ========================================================= */}
        {activeFilter === 'all' && !searchQuery && (
          <section className="mt-8">
            <div
              className="
                rounded-[28px]
                border border-white/[0.08]
                bg-[#0b0f14]
                p-5 sm:p-6
              "
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="shrink-0 lg:w-56">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4da3ff]">
                    Ministry Snapshot
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-white">
                    Team coverage
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-white/35">
                    A quick view of how the current team is
                    distributed across the ministry.
                  </p>
                </div>

                <div className="grid flex-1 gap-4 sm:grid-cols-3">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-semibold text-white/60">
                        <Mic2 size={14} className="text-[#4da3ff]" />
                        Vocals
                      </span>

                      <span className="text-xs font-bold text-white/70">
                        {vocalists.length}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-[#007aff] transition-all duration-700"
                        style={{
                          width: `${vocalPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-semibold text-white/60">
                        <Music2
                          size={14}
                          className="text-[#4da3ff]"
                        />
                        Band
                      </span>

                      <span className="text-xs font-bold text-white/70">
                        {instrumentalists.length}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-[#4da3ff] transition-all duration-700"
                        style={{
                          width: `${bandPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-semibold text-white/60">
                        <Crown
                          size={14}
                          className="text-amber-300"
                        />
                        Leadership
                      </span>

                      <span className="text-xs font-bold text-white/70">
                        {directors.length}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-amber-300 transition-all duration-700"
                        style={{
                          width: `${leadershipPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            VOCAL TEAM
        ========================================================= */}
        {filteredVocalists.length > 0 && (
          <section className="mt-10">
            {renderSectionHeader(
              <Mic2 size={18} />,
              'Vocal Ministry',
              'Vocal Team',
              filteredVocalists.length
            )}

            <div
              className="
                grid grid-cols-1 gap-4
                sm:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
              "
            >
              {filteredVocalists.map(renderMemberCard)}
            </div>
          </section>
        )}

        {/* =========================================================
            BAND
        ========================================================= */}
        {filteredInstrumentalists.length > 0 && (
          <section className="mt-10">
            {renderSectionHeader(
              <Music2 size={18} />,
              'Instrumentation',
              'Band & Musicians',
              filteredInstrumentalists.length
            )}

            <div
              className="
                grid grid-cols-1 gap-4
                sm:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
              "
            >
              {filteredInstrumentalists.map(renderMemberCard)}
            </div>
          </section>
        )}

        {/* =========================================================
            EMPTY SEARCH/FILTER STATE
        ========================================================= */}
        {filteredTeam.length === 0 && (
          <section
            className="
              mt-8 flex min-h-[300px]
              items-center justify-center
              rounded-[28px]
              border border-dashed border-white/[0.1]
              bg-[#0b0f14]
              p-8 text-center
            "
          >
            <div className="max-w-sm">
              <div
                className="
                  mx-auto flex h-16 w-16
                  items-center justify-center
                  rounded-2xl border border-white/[0.08]
                  bg-white/[0.025]
                  text-white/25
                "
              >
                <Search size={25} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">
                No team members found
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/35">
                Try another search term or choose a different
                team category.
              </p>

              {(searchQuery || activeFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="
                    mt-5 rounded-xl
                    border border-[#007aff]/20
                    bg-[#007aff]/[0.07]
                    px-4 py-2.5
                    text-xs font-bold text-[#69b3ff]
                    transition-all
                    hover:bg-[#007aff]/[0.12]
                  "
                >
                  Clear Filters
                </button>
              )}
            </div>
          </section>
        )}

        {/* =========================================================
            MD PHOTO MANAGEMENT
        ========================================================= */}
        {isMD && (
          <section className="mt-10">
            <div
              className="
                overflow-hidden rounded-[26px]
                border border-[#007aff]/10
                bg-[#0a0f15]
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowPhotoInfo((current) => !current)
                }
                className="
                  flex w-full items-center justify-between
                  gap-4 p-5 text-left
                  transition-colors hover:bg-white/[0.02]
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10 items-center
                      justify-center rounded-xl
                      border border-[#007aff]/15
                      bg-[#007aff]/[0.07]
                      text-[#4da3ff]
                    "
                  >
                    <Camera size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Team Photo Management
                    </p>
                    <p className="mt-0.5 text-xs text-white/35">
                      Update member profile photos directly
                      from the directory.
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={17}
                  className={`
                    text-white/25 transition-transform duration-300
                    ${showPhotoInfo ? 'rotate-90' : ''}
                  `}
                />
              </button>

              {showPhotoInfo && (
                <div
                  className="
                    border-t border-white/[0.06]
                    px-5 pb-5 pt-4
                  "
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <Upload
                        size={15}
                        className="mt-0.5 shrink-0 text-[#4da3ff]"
                      />

                      <p className="text-xs leading-5 text-white/40">
                        Click any member's photo to upload a
                        replacement. Supported formats are
                        PNG, JPG, WEBP and GIF. Maximum size is
                        5 MB.
                      </p>
                    </div>

                    <span
                      className="
                        shrink-0 rounded-lg
                        border border-white/[0.06]
                        bg-white/[0.025]
                        px-3 py-1.5
                        text-[10px] font-bold
                        uppercase tracking-[0.12em]
                        text-white/30
                      "
                    >
                      MD Only
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =========================================================
            FOOTER
        ========================================================= */}
        <footer className="mt-14 border-t border-white/[0.06] pt-7">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs font-bold tracking-wide text-white/55">
                Jewels Music Hub
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/20">
                MUSIC • EXCELLENCE • SERVICE
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
              Team Directory
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MusicTeamView;
