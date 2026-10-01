import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

/* ============================================================
   JEWELS MUSIC HUB
   TEAM VIEW — PREMIUM EDITION
   ============================================================ */

type TeamRole =
  | "admin_md"
  | "lead_vocalist"
  | "backing_vocalist"
  | "instrumentalist"
  | "media"
  | "sound"
  | "other";

type MemberStatus =
  | "active"
  | "inactive"
  | "on_leave";

type MemberGender =
  | "male"
  | "female"
  | "other";

type ViewMode =
  | "grid"
  | "list";

type SortMode =
  | "name"
  | "role"
  | "status"
  | "joined"
  | "recent";

type ToastType =
  | "success"
  | "error"
  | "info"
  | "warning";

type InstrumentCategory =
  | "vocals"
  | "keyboard"
  | "guitar"
  | "bass"
  | "drums"
  | "percussion"
  | "brass"
  | "strings"
  | "media"
  | "sound"
  | "other";

interface TeamMember {
  id: string;
  name: string;
  nickname?: string;
  role: TeamRole;
  status: MemberStatus;
  gender?: MemberGender;
  phone?: string;
  email?: string;
  avatar?: string;
  instrument?: string;
  instrumentCategory?: InstrumentCategory;
  voicePart?: string;
  joinedAt: string;
  updatedAt: string;
  notes?: string;
  ministry?: string;
  section?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  isLeader?: boolean;
  isFeatured?: boolean;
  isAvailable?: boolean;
  availability?: string[];
  skills?: string[];
  assignedSongs?: string[];
  assignedMinistrations?: string[];
  socials?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

interface TeamViewProps {
  activeRole?: string;
  currentRole?: string;
  role?: string;
  members?: TeamMember[];
  onMembersChange?: (members: TeamMember[]) => void;
  readOnly?: boolean;
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const STORAGE_KEY = "jewels_music_hub_team_v2";

const LEGACY_STORAGE_KEYS = [
  "jewels_music_hub_team",
  "jewels_team_members",
  "team_members",
];

const MD_ROLES = [
  "admin_md",
  "md",
  "music_director",
  "music-director",
];

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ROLE_LABELS: Record<TeamRole, string> = {
  admin_md: "Music Director",
  lead_vocalist: "Lead Vocalist",
  backing_vocalist: "Backing Vocalist",
  instrumentalist: "Instrumentalist",
  media: "Media",
  sound: "Sound",
  other: "Other",
};

const STATUS_LABELS: Record<MemberStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
};

const CATEGORY_LABELS: Record<InstrumentCategory, string> = {
  vocals: "Vocals",
  keyboard: "Keyboard",
  guitar: "Guitar",
  bass: "Bass",
  drums: "Drums",
  percussion: "Percussion",
  brass: "Brass",
  strings: "Strings",
  media: "Media",
  sound: "Sound",
  other: "Other",
};

const EMPTY_MEMBER: TeamMember = {
  id: "",
  name: "",
  nickname: "",
  role: "backing_vocalist",
  status: "active",
  gender: "other",
  phone: "",
  email: "",
  avatar: "",
  instrument: "",
  instrumentCategory: "vocals",
  voicePart: "",
  joinedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  notes: "",
  ministry: "",
  section: "",
  emergencyContact: "",
  emergencyPhone: "",
  isLeader: false,
  isFeatured: false,
  isAvailable: true,
  availability: [],
  skills: [],
  assignedSongs: [],
  assignedMinistrations: [],
  socials: {
    instagram: "",
    facebook: "",
    youtube: "",
  },
};

/* ============================================================
   ICONS
   ============================================================ */

const Icon = ({
  name,
  size = 18,
  strokeWidth = 1.8,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
      );

    case "trash":
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v5" />
          <path d="M14 11v5" />
        </svg>
      );

    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "mic":
      return (
        <svg {...common}>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <path d="M12 17v5" />
          <path d="M8 22h8" />
        </svg>
      );

    case "music":
      return (
        <svg {...common}>
          <path d="M9 18V5l10-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );

    case "list":
      return (
        <svg {...common}>
          <path d="M8 6h13" />
          <path d="M8 12h13" />
          <path d="M8 18h13" />
          <path d="M3 6h.01" />
          <path d="M3 12h.01" />
          <path d="M3 18h.01" />
        </svg>
      );

    case "filter":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="M18 6 6 18" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "star":
      return (
        <svg {...common}>
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
        </svg>
      );

    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.1 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
        </svg>
      );

    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );

    case "more":
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="19" cy="12" r="1" fill="currentColor" />
        </svg>
      );

    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
        </svg>
      );

    case "headphones":
      return (
        <svg {...common}>
          <path d="M4 14a8 8 0 0 1 16 0" />
          <path d="M4 14v4a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 1Z" />
          <path d="M20 14v4a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 1Z" />
        </svg>
      );

    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v7c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 12v7c0 1.66 3.58 3 8 3s8-1.34 8-3v-7" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8.1 8.1 0 0 0-14.9-4L3 10" />
          <path d="M3 4v6h6" />
          <path d="M4 13a8.1 8.1 0 0 0 14.9 4L21 14" />
          <path d="M21 20v-6h-6" />
        </svg>
      );

    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
      );

    case "alert":
      return (
        <svg {...common}>
          <path d="M10.3 3.5 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.5a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );

    case "zap":
      return (
        <svg {...common}>
          <path d="m13 2-9 12h7l-1 8 9-12h-7Z" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
};

/* ============================================================
   HELPERS
   ============================================================ */

const createId = (): string => {
  return `team_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
};

const isMD = (role?: string): boolean => {
  if (!role) return false;

  return MD_ROLES.includes(
    role.trim().toLowerCase()
  );
};

const normalizeMember = (
  member: Partial<TeamMember>
): TeamMember => {
  const now = new Date().toISOString();

  return {
    ...EMPTY_MEMBER,
    ...member,
    id: member.id || createId(),
    name: member.name || "Unnamed Member",
    role: member.role || "other",
    status: member.status || "active",
    joinedAt: member.joinedAt || now,
    updatedAt: member.updatedAt || now,
    availability: member.availability || [],
    skills: member.skills || [],
    assignedSongs: member.assignedSongs || [],
    assignedMinistrations:
      member.assignedMinistrations || [],
    socials: {
      ...EMPTY_MEMBER.socials,
      ...(member.socials || {}),
    },
  };
};

const safeParseMembers = (
  value: string | null
): TeamMember[] => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeMember);
  } catch {
    return [];
  }
};

const getInitialMembers = (): TeamMember[] => {
  try {
    const current = localStorage.getItem(
      STORAGE_KEY
    );

    const currentMembers = safeParseMembers(current);

    if (currentMembers.length > 0) {
      return currentMembers;
    }

    for (const key of LEGACY_STORAGE_KEYS) {
      const legacy = localStorage.getItem(key);
      const members = safeParseMembers(legacy);

      if (members.length > 0) {
        return members;
      }
    }
  } catch {
    return [];
  }

  return [];
};

const formatDate = (
  value?: string
): string => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

const initials = (
  name: string
): string => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
};

const getRoleLabel = (
  role: TeamRole
): string => {
  return ROLE_LABELS[role] || "Other";
};

const getStatusLabel = (
  status: MemberStatus
): string => {
  return STATUS_LABELS[status] || status;
};

/* ============================================================
   DEFAULT DEMO MEMBERS
   ============================================================ */

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "demo-md",
    name: "Music Director",
    nickname: "",
    role: "admin_md",
    status: "active",
    gender: "other",
    instrument: "",
    instrumentCategory: "vocals",
    voicePart: "",
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes:
      "Music Director and administrator of the music team.",
    ministry: "Music Ministry",
    section: "Leadership",
    isLeader: true,
    isFeatured: true,
    isAvailable: true,
    availability: WEEK_DAYS,
    skills: [
      "Music Direction",
      "Rehearsal Management",
      "Team Coordination",
    ],
    assignedSongs: [],
    assignedMinistrations: [],
  },
];

/* ============================================================
   TOAST
   ============================================================ */

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

const ToastItem = ({
  toast,
  onClose,
}: {
  toast: ToastData;
  onClose: () => void;
}) => {
  return (
    <div
      className={[
        "pointer-events-auto",
        "w-[min(380px,calc(100vw-32px))]",
        "rounded-2xl",
        "border",
        "border-white/10",
        "bg-[#111214]/95",
        "backdrop-blur-xl",
        "shadow-2xl",
        "px-4",
        "py-3",
        "flex",
        "items-start",
        "gap-3",
      ].join(" ")}
    >
      <div
        className={[
          "mt-0.5",
          "h-9",
          "w-9",
          "rounded-xl",
          "flex",
          "items-center",
          "justify-center",
          toast.type === "success"
            ? "bg-emerald-500/15 text-emerald-400"
            : "",
          toast.type === "error"
            ? "bg-red-500/15 text-red-400"
            : "",
          toast.type === "warning"
            ? "bg-amber-500/15 text-amber-400"
            : "",
          toast.type === "info"
            ? "bg-sky-500/15 text-sky-400"
            : "",
        ].join(" ")}
      >
        <Icon
          name={
            toast.type === "success"
              ? "check"
              : toast.type === "error"
              ? "alert"
              : toast.type === "warning"
              ? "alert"
              : "info"
          }
          size={17}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-white">
          {toast.title}
        </div>

        {toast.message && (
          <div className="mt-1 text-xs leading-5 text-white/55">
            {toast.message}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-white/35 hover:text-white transition"
      >
        <Icon name="close" size={15} />
      </button>
    </div>
  );
};

/* ============================================================
   AVATAR
   ============================================================ */

const Avatar = ({
  member,
  size = "md",
}: {
  member: TeamMember;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  const sizeClass =
    size === "sm"
      ? "h-9 w-9 text-xs"
      : size === "md"
      ? "h-12 w-12 text-sm"
      : size === "lg"
      ? "h-16 w-16 text-lg"
      : "h-24 w-24 text-2xl";

  if (member.avatar) {
    return (
      <img
        src={member.avatar}
        alt={member.name}
        className={[
          sizeClass,
          "rounded-2xl",
          "object-cover",
          "border",
          "border-white/10",
        ].join(" ")}
      />
    );
  }

  return (
    <div
      className={[
        sizeClass,
        "rounded-2xl",
        "bg-gradient-to-br",
        "from-white/15",
        "to-white/5",
        "border",
        "border-white/10",
        "flex",
        "items-center",
        "justify-center",
        "font-semibold",
        "text-white",
        "shrink-0",
      ].join(" ")}
    >
      {initials(member.name)}
    </div>
  );
};

/* ============================================================
   BADGES
   ============================================================ */

const RoleBadge = ({
  role,
}: {
  role: TeamRole;
}) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-white/65">
      <Icon
        name={
          role === "lead_vocalist" ||
          role === "backing_vocalist"
            ? "mic"
            : role === "admin_md"
            ? "shield"
            : role === "instrumentalist"
            ? "music"
            : "user"
        }
        size={12}
      />

      {getRoleLabel(role)}
    </span>
  );
};

const StatusBadge = ({
  status,
}: {
  status: MemberStatus;
}) => {
  const classes =
    status === "active"
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      : status === "on_leave"
      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
      : "bg-white/[0.05] border-white/10 text-white/40";

  return (
    <span
      className={[
        "inline-flex",
        "items-center",
        "gap-1.5",
        "rounded-full",
        "border",
        "px-2.5",
        "py-1",
        "text-[10px]",
        "font-medium",
        classes,
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {getStatusLabel(status)}
    </span>
  );
};

/* ============================================================
   MEMBER CARD
   ============================================================ */

const MemberCard = ({
  member,
  canEdit,
  onView,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  member: TeamMember;
  canEdit: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
}) => {
  return (
    <div
      className={[
        "group",
        "relative",
        "overflow-hidden",
        "rounded-[24px]",
        "border",
        "border-white/[0.08]",
        "bg-[#111214]",
        "transition-all",
        "duration-300",
        "hover:-translate-y-0.5",
        "hover:border-white/[0.14]",
        "hover:bg-[#141518]",
        "hover:shadow-2xl",
      ].join(" ")}
    >
      {member.isFeatured && (
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-white/10 via-white/50 to-white/10" />
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={onView}
            className="text-left"
          >
            <Avatar member={member} size="lg" />
          </button>

          <div className="flex items-center gap-1">
            {canEdit && (
              <button
                type="button"
                onClick={onToggleFeatured}
                title={
                  member.isFeatured
                    ? "Remove featured status"
                    : "Feature member"
                }
                className={[
                  "h-8",
                  "w-8",
                  "rounded-xl",
                  "flex",
                  "items-center",
                  "justify-center",
                  "transition",
                  member.isFeatured
                    ? "bg-white/10 text-white"
                    : "text-white/25 hover:bg-white/5 hover:text-white/60",
                ].join(" ")}
              >
                <Icon name="star" size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={onView}
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white/30 hover:bg-white/5 hover:text-white transition"
              title="View member"
            >
              <Icon name="eye" size={15} />
            </button>

            {canEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="h-8 w-8 rounded-xl flex items-center justify-center text-white/30 hover:bg-white/5 hover:text-white transition"
                title="Edit member"
              >
                <Icon name="edit" size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-white">
              {member.name}
            </h3>

            {member.isLeader && (
              <span
                title="Team leader"
                className="shrink-0 text-white/60"
              >
                <Icon name="shield" size={13} />
              </span>
            )}
          </div>

          {member.nickname && (
            <div className="mt-0.5 text-xs text-white/35">
              {member.nickname}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <RoleBadge role={member.role} />
            <StatusBadge status={member.status} />
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {member.instrument && (
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="text-white/25">
                <Icon name="music" size={14} />
              </span>
              <span className="truncate">
                {member.instrument}
              </span>
            </div>
          )}

          {member.voicePart && (
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="text-white/25">
                <Icon name="mic" size={14} />
              </span>
              <span className="truncate">
                {member.voicePart}
              </span>
            </div>
          )}

          {member.section && (
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="text-white/25">
                <Icon name="users" size={14} />
              </span>
              <span className="truncate">
                {member.section}
              </span>
            </div>
          )}
        </div>

        {member.skills &&
          member.skills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {member.skills
                .slice(0, 3)
                .map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-white/[0.035] px-2 py-1 text-[9px] text-white/40"
                  >
                    {skill}
                  </span>
                ))}

              {member.skills.length > 3 && (
                <span className="rounded-lg bg-white/[0.035] px-2 py-1 text-[9px] text-white/30">
                  +{member.skills.length - 3}
                </span>
              )}
            </div>
          )}

        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <button
            type="button"
            onClick={onView}
            className="flex w-full items-center justify-between text-xs font-medium text-white/40 hover:text-white transition"
          >
            <span>View profile</span>
            <Icon name="arrow" size={14} />
          </button>
        </div>
      </div>

      {canEdit && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute bottom-4 right-4 hidden rounded-lg p-1.5 text-white/15 hover:bg-red-500/10 hover:text-red-400 group-hover:block transition"
          title="Delete member"
        >
          <Icon name="trash" size={13} />
        </button>
      )}
    </div>
  );
};

/* ============================================================
   MEMBER LIST ROW
   ============================================================ */

const MemberListRow = ({
  member,
  canEdit,
  onView,
  onEdit,
  onDelete,
}: {
  member: TeamMember;
  canEdit: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="group grid grid-cols-[minmax(220px,1.8fr)_1fr_1fr_1fr_auto] items-center gap-4 border-b border-white/[0.06] px-5 py-4 last:border-b-0 hover:bg-white/[0.02] transition">
      <button
        type="button"
        onClick={onView}
        className="flex min-w-0 items-center gap-3 text-left"
      >
        <Avatar member={member} size="md" />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-medium text-white">
              {member.name}
            </div>

            {member.isLeader && (
              <Icon
                name="shield"
                size={12}
              />
            )}
          </div>

          {member.nickname && (
            <div className="truncate text-[11px] text-white/30">
              {member.nickname}
            </div>
          )}
        </div>
      </button>

      <div>
        <RoleBadge role={member.role} />
      </div>

      <div className="text-xs text-white/45">
        {member.instrument ||
          member.voicePart ||
          "—"}
      </div>

      <div>
        <StatusBadge status={member.status} />
      </div>

      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={onView}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-white/25 hover:bg-white/5 hover:text-white transition"
        >
          <Icon name="eye" size={15} />
        </button>

        {canEdit && (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white/25 hover:bg-white/5 hover:text-white transition"
            >
              <Icon name="edit" size={15} />
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white/20 hover:bg-red-500/10 hover:text-red-400 transition"
            >
              <Icon name="trash" size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   STAT CARD
   ============================================================ */

const StatCard = ({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: string;
}) => {
  return (
    <div className="rounded-[22px] border border-white/[0.07] bg-[#111214] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/60">
          <Icon name={icon} size={18} />
        </div>

        <div className="text-[10px] uppercase tracking-[0.16em] text-white/20">
          Team
        </div>
      </div>

      <div className="mt-5 text-2xl font-semibold text-white">
        {value}
      </div>

      <div className="mt-1 text-xs font-medium text-white/60">
        {label}
      </div>

      <div className="mt-1 text-[10px] text-white/25">
        {description}
      </div>
    </div>
  );
};

/* ============================================================
   FORM FIELD
   ============================================================ */

const FieldLabel = ({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => {
  return (
    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
      {children}
      {required && (
        <span className="ml-1 text-white/60">
          *
        </span>
      )}
    </label>
  );
};

const Input = ({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  type?: string;
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.05] transition"
    />
  );
};

const Select = ({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  children: React.ReactNode;
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#17181b] px-3.5 text-sm text-white outline-none focus:border-white/20 transition"
    >
      {children}
    </select>
  );
};

const Textarea = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.05] transition"
    />
  );
};

/* ============================================================
   MEMBER MODAL
   ============================================================ */

const MemberModal = ({
  mode,
  member,
  canEdit,
  onClose,
  onSave,
}: {
  mode: "view" | "edit" | "create";
  member: TeamMember;
  canEdit: boolean;
  onClose: () => void;
  onSave: (
    member: TeamMember
  ) => void;
}) => {
  const editable =
    mode !== "view" && canEdit;

  const [form, setForm] =
    useState<TeamMember>(member);

  const [skillInput, setSkillInput] =
    useState("");

  const [availability, setAvailability] =
    useState<string[]>(
      member.availability || []
    );

  useEffect(() => {
    setForm(member);
    setAvailability(
      member.availability || []
    );
  }, [member]);

  const update = <
    K extends keyof TeamMember
  >(
    key: K,
    value: TeamMember[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
      updatedAt:
        new Date().toISOString(),
    }));
  };

  const toggleDay = (
    day: string
  ) => {
    setAvailability((previous) => {
      const exists =
        previous.includes(day);

      const next = exists
        ? previous.filter(
            (item) => item !== day
          )
        : [...previous, day];

      setForm((current) => ({
        ...current,
        availability: next,
        updatedAt:
          new Date().toISOString(),
      }));

      return next;
    });
  };

  const addSkill = () => {
    const skill =
      skillInput.trim();

    if (!skill) return;

    if (
      (form.skills || []).some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      )
    ) {
      setSkillInput("");
      return;
    }

    update("skills", [
      ...(form.skills || []),
      skill,
    ]);

    setSkillInput("");
  };

  const removeSkill = (
    skill: string
  ) => {
    update(
      "skills",
      (form.skills || []).filter(
        (item) => item !== skill
      )
    );
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!editable) return;

    if (!form.name.trim()) {
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      availability,
      updatedAt:
        new Date().toISOString(),
    });
  };

  const title =
    mode === "create"
      ? "Add Team Member"
      : mode === "edit"
      ? "Edit Team Member"
      : "Member Profile";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#101113] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
              Music Team
            </div>

            <h2 className="mt-1 text-lg font-semibold text-white">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-white/35 hover:bg-white/5 hover:text-white transition"
          >
            <Icon name="close" size={17} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[260px_1fr]">
            <div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex justify-center">
                  <Avatar
                    member={form}
                    size="xl"
                  />
                </div>

                <div className="mt-4 text-center">
                  <div className="text-sm font-semibold text-white">
                    {form.name ||
                      "New Member"}
                  </div>

                  <div className="mt-1 text-xs text-white/30">
                    {getRoleLabel(
                      form.role
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <StatusBadge
                    status={form.status}
                  />

                  {form.isLeader && (
                    <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] text-white/50">
                      <Icon
                        name="shield"
                        size={12}
                      />
                      Team Leader
                    </div>
                  )}
                </div>

                {editable && (
                  <div className="mt-5">
                    <FieldLabel>
                      Avatar URL
                    </FieldLabel>

                    <Input
                      value={
                        form.avatar || ""
                      }
                      onChange={(event) =>
                        update(
                          "avatar",
                          event.target
                            .value
                        )
                      }
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>

              {!editable && (
                <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-white/40">
                      <Icon
                        name="lock"
                        size={15}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-medium text-white/65">
                        Read-only profile
                      </div>

                      <div className="mt-1 text-[10px] leading-5 text-white/30">
                        Only the Music Director can
                        modify team information.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Basic Information
                  </div>

                  <div className="mt-1 text-[10px] text-white/25">
                    Core identity and team assignment.
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel required>
                      Full Name
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={form.name}
                        onChange={(event) =>
                          update(
                            "name",
                            event.target
                              .value
                          )
                        }
                        placeholder="Member name"
                      />
                    ) : (
                      <div className="text-sm text-white/70">
                        {form.name || "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Nickname
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.nickname ||
                          ""
                        }
                        onChange={(event) =>
                          update(
                            "nickname",
                            event.target
                              .value
                          )
                        }
                        placeholder="Optional"
                      />
                    ) : (
                      <div className="text-sm text-white/70">
                        {form.nickname ||
                          "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Team Role
                    </FieldLabel>

                    {editable ? (
                      <Select
                        value={form.role}
                        onChange={(event) =>
                          update(
                            "role",
                            event.target
                              .value as TeamRole
                          )
                        }
                      >
                        {Object.entries(
                          ROLE_LABELS
                        ).map(
                          ([
                            value,
                            label,
                          ]) => (
                            <option
                              key={value}
                              value={value}
                            >
                              {label}
                            </option>
                          )
                        )}
                      </Select>
                    ) : (
                      <RoleBadge
                        role={form.role}
                      />
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Status
                    </FieldLabel>

                    {editable ? (
                      <Select
                        value={form.status}
                        onChange={(event) =>
                          update(
                            "status",
                            event.target
                              .value as MemberStatus
                          )
                        }
                      >
                        {Object.entries(
                          STATUS_LABELS
                        ).map(
                          ([
                            value,
                            label,
                          ]) => (
                            <option
                              key={value}
                              value={value}
                            >
                              {label}
                            </option>
                          )
                        )}
                      </Select>
                    ) : (
                      <StatusBadge
                        status={
                          form.status
                        }
                      />
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Gender
                    </FieldLabel>

                    {editable ? (
                      <Select
                        value={
                          form.gender ||
                          "other"
                        }
                        onChange={(event) =>
                          update(
                            "gender",
                            event.target
                              .value as MemberGender
                          )
                        }
                      >
                        <option value="male">
                          Male
                        </option>
                        <option value="female">
                          Female
                        </option>
                        <option value="other">
                          Other
                        </option>
                      </Select>
                    ) : (
                      <div className="text-sm capitalize text-white/60">
                        {form.gender ||
                          "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Section
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.section ||
                          ""
                        }
                        onChange={(event) =>
                          update(
                            "section",
                            event.target
                              .value
                          )
                        }
                        placeholder="e.g. Vocals"
                      />
                    ) : (
                      <div className="text-sm text-white/60">
                        {form.section ||
                          "—"}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Music Information
                  </div>

                  <div className="mt-1 text-[10px] text-white/25">
                    Musical role, instrument and vocal details.
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>
                      Instrument
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.instrument ||
                          ""
                        }
                        onChange={(event) =>
                          update(
                            "instrument",
                            event.target
                              .value
                          )
                        }
                        placeholder="e.g. Keyboard"
                      />
                    ) : (
                      <div className="text-sm text-white/60">
                        {form.instrument ||
                          "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Instrument Category
                    </FieldLabel>

                    {editable ? (
                      <Select
                        value={
                          form.instrumentCategory ||
                          "other"
                        }
                        onChange={(event) =>
                          update(
                            "instrumentCategory",
                            event.target
                              .value as InstrumentCategory
                          )
                        }
                      >
                        {Object.entries(
                          CATEGORY_LABELS
                        ).map(
                          ([
                            value,
                            label,
                          ]) => (
                            <option
                              key={value}
                              value={value}
                            >
                              {label}
                            </option>
                          )
                        )}
                      </Select>
                    ) : (
                      <div className="text-sm text-white/60">
                        {form.instrumentCategory
                          ? CATEGORY_LABELS[
                              form.instrumentCategory
                            ]
                          : "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Voice Part
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.voicePart ||
                          ""
                        }
                        onChange={(event) =>
                          update(
                            "voicePart",
                            event.target
                              .value
                          )
                        }
                        placeholder="e.g. Soprano, Tenor"
                      />
                    ) : (
                      <div className="text-sm text-white/60">
                        {form.voicePart ||
                          "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Ministry
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.ministry ||
                          ""
                        }
                        onChange={(event) =>
                          update(
                            "ministry",
                            event.target
                              .value
                          )
                        }
                        placeholder="e.g. Music Ministry"
                      />
                    ) : (
                      <div className="text-sm text-white/60">
                        {form.ministry ||
                          "—"}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Contact Information
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>
                      Phone
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.phone || ""
                        }
                        onChange={(event) =>
                          update(
                            "phone",
                            event.target
                              .value
                          )
                        }
                        placeholder="+233..."
                        type="tel"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Icon
                          name="phone"
                          size={14}
                        />
                        {form.phone ||
                          "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Email
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.email || ""
                        }
                        onChange={(event) =>
                          update(
                            "email",
                            event.target
                              .value
                          )
                        }
                        placeholder="email@example.com"
                        type="email"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Icon
                          name="mail"
                          size={14}
                        />
                        {form.email ||
                          "—"}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Availability
                  </div>

                  <div className="mt-1 text-[10px] text-white/25">
                    Days the member is normally available.
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {WEEK_DAYS.map(
                    (day) => {
                      const active =
                        availability.includes(
                          day
                        );

                      if (!editable) {
                        return (
                          <span
                            key={day}
                            className={[
                              "rounded-xl",
                              "border",
                              "px-3",
                              "py-2",
                              "text-[10px]",
                              active
                                ? "border-white/15 bg-white/10 text-white/75"
                                : "border-white/[0.06] bg-white/[0.02] text-white/20",
                            ].join(" ")}
                          >
                            {day.slice(
                              0,
                              3
                            )}
                          </span>
                        );
                      }

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() =>
                            toggleDay(
                              day
                            )
                          }
                          className={[
                            "rounded-xl",
                            "border",
                            "px-3",
                            "py-2",
                            "text-[10px]",
                            "transition",
                            active
                              ? "border-white/15 bg-white/10 text-white"
                              : "border-white/[0.06] bg-white/[0.02] text-white/25 hover:bg-white/[0.05]",
                          ].join(" ")}
                        >
                          {day.slice(
                            0,
                            3
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Skills
                  </div>
                </div>

                {editable && (
                  <div className="flex gap-2">
                    <Input
                      value={
                        skillInput
                      }
                      onChange={(event) =>
                        setSkillInput(
                          event.target
                            .value
                        )
                      }
                      placeholder="Add a skill"
                    />

                    <button
                      type="button"
                      onClick={
                        addSkill
                      }
                      className="h-11 shrink-0 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-xs font-medium text-white hover:bg-white/10 transition"
                    >
                      Add
                    </button>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {(form.skills || [])
                    .length === 0 && (
                    <span className="text-xs text-white/25">
                      No skills added.
                    </span>
                  )}

                  {(form.skills || []).map(
                    (skill) => (
                      <span
                        key={skill}
                        className="group flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[10px] text-white/50"
                      >
                        {skill}

                        {editable && (
                          <button
                            type="button"
                            onClick={() =>
                              removeSkill(
                                skill
                              )
                            }
                            className="text-white/20 hover:text-red-400"
                          >
                            <Icon
                              name="close"
                              size={11}
                            />
                          </button>
                        )}
                      </span>
                    )
                  )}
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Notes
                  </div>
                </div>

                {editable ? (
                  <Textarea
                    value={
                      form.notes || ""
                    }
                    onChange={(event) =>
                      update(
                        "notes",
                        event.target
                          .value
                      )
                    }
                    placeholder="Additional team notes..."
                  />
                ) : (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-sm leading-6 text-white/45">
                    {form.notes ||
                      "No additional notes."}
                  </div>
                )}
              </section>

              <section>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {editable && (
                    <>
                      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                        <div>
                          <div className="text-xs font-medium text-white/70">
                            Team Leader
                          </div>
                          <div className="mt-0.5 text-[9px] text-white/25">
                            Mark as a team leader
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={
                            !!form.isLeader
                          }
                          onChange={(event) =>
                            update(
                              "isLeader",
                              event.target
                                .checked
                            )
                          }
                          className="h-4 w-4 accent-white"
                        />
                      </label>

                      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                        <div>
                          <div className="text-xs font-medium text-white/70">
                            Featured
                          </div>
                          <div className="mt-0.5 text-[9px] text-white/25">
                            Show as featured
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={
                            !!form.isFeatured
                          }
                          onChange={(event) =>
                            update(
                              "isFeatured",
                              event.target
                                .checked
                            )
                          }
                          className="h-4 w-4 accent-white"
                        />
                      </label>

                      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                        <div>
                          <div className="text-xs font-medium text-white/70">
                            Available
                          </div>
                          <div className="mt-0.5 text-[9px] text-white/25">
                            Available for ministry
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={
                            form.isAvailable !==
                            false
                          }
                          onChange={(event) =>
                            update(
                              "isAvailable",
                              event.target
                                .checked
                            )
                          }
                          className="h-4 w-4 accent-white"
                        />
                      </label>
                    </>
                  )}
                </div>
              </section>
            </div>
          </div>

          {editable && (
            <div className="flex items-center justify-end gap-3 border-t border-white/[0.07] px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-white/55 hover:bg-white/[0.05] hover:text-white transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black hover:bg-white/90 transition"
              >
                {mode === "create"
                  ? "Add Member"
                  : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

/* ============================================================
   DELETE MODAL
   ============================================================ */

const DeleteModal = ({
  member,
  onClose,
  onConfirm,
}: {
  member: TeamMember;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[26px] border border-white/[0.09] bg-[#111214] p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <Icon
            name="trash"
            size={19}
          />
        </div>

        <h3 className="mt-5 text-base font-semibold text-white">
          Remove team member?
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/40">
          This will remove{" "}
          <span className="text-white/70">
            {member.name}
          </span>{" "}
          from the music team.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-white/55 hover:bg-white/[0.05] hover:text-white transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition"
          >
            Remove Member
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   FILTER PANEL
   ============================================================ */

const FilterPanel = ({
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  onClear,
}: {
  roleFilter: string;
  setRoleFilter: (
    value: string
  ) => void;
  statusFilter: string;
  setStatusFilter: (
    value: string
  ) => void;
  categoryFilter: string;
  setCategoryFilter: (
    value: string
  ) => void;
  onClear: () => void;
}) => {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111214] p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div>
          <div className="mb-2 text-[9px] uppercase tracking-[0.14em] text-white/25">
            Role
          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target.value
              )
            }
            className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white outline-none"
          >
            <option value="all">
              All roles
            </option>

            {Object.entries(
              ROLE_LABELS
            ).map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <div className="mb-2 text-[9px] uppercase tracking-[0.14em] text-white/25">
            Status
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white outline-none"
          >
            <option value="all">
              All statuses
            </option>

            {Object.entries(
              STATUS_LABELS
            ).map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <div className="mb-2 text-[9px] uppercase tracking-[0.14em] text-white/25">
            Category
          </div>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white outline-none"
          >
            <option value="all">
              All categories
            </option>

            {Object.entries(
              CATEGORY_LABELS
            ).map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onClear}
            className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] text-xs font-medium text-white/40 hover:bg-white/[0.05] hover:text-white transition"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   EMPTY STATE
   ============================================================ */

const EmptyState = ({
  search,
  canEdit,
  onAdd,
}: {
  search: string;
  canEdit: boolean;
  onAdd: () => void;
}) => {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[26px] border border-dashed border-white/[0.08] bg-white/[0.015] p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-white/30">
        <Icon name="users" size={25} />
      </div>

      <h3 className="mt-5 text-sm font-semibold text-white/80">
        {search
          ? "No members found"
          : "Your music team is empty"}
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-white/30">
        {search
          ? "Try changing your search or filters."
          : "Add your first team member to start building the team directory."}
      </p>

      {canEdit && !search && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black hover:bg-white/90 transition"
        >
          <Icon name="plus" size={14} />
          Add Member
        </button>
      )}
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

const TeamView: React.FC<TeamViewProps> = ({
  activeRole,
  currentRole,
  role,
  members: externalMembers,
  onMembersChange,
  readOnly = false,
}) => {
  const detectedRole =
    activeRole ||
    currentRole ||
    role ||
    "";

  const canEdit =
    !readOnly && isMD(detectedRole);

  const [members, setMembers] =
    useState<TeamMember[]>(() => {
      if (
        externalMembers &&
        externalMembers.length > 0
      ) {
        return externalMembers.map(
          normalizeMember
        );
      }

      if (
        typeof window !==
        "undefined"
      ) {
        const stored =
          getInitialMembers();

        if (stored.length > 0) {
          return stored;
        }
      }

      return [];
    });

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [sortMode, setSortMode] =
    useState<SortMode>("name");

  const [viewMode, setViewMode] =
    useState<ViewMode>("grid");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedMember, setSelectedMember] =
    useState<TeamMember | null>(null);

  const [modalMode, setModalMode] =
    useState<
      "view" | "edit" | "create" | null
    >(null);

  const [deleteMember, setDeleteMember] =
    useState<TeamMember | null>(null);

  const [toasts, setToasts] =
    useState<ToastData[]>([]);

  const [showStats, setShowStats] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  /* ============================================================
     TOAST
     ============================================================ */

  const addToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string
    ) => {
      const id = createId();

      setToasts((previous) => [
        ...previous,
        {
          id,
          type,
          title,
          message,
        },
      ]);

      window.setTimeout(() => {
        setToasts((previous) =>
          previous.filter(
            (toast) =>
              toast.id !== id
          )
        );
      }, 4000);
    },
    []
  );

  const removeToast = (
    id: string
  ) => {
    setToasts((previous) =>
      previous.filter(
        (toast) =>
          toast.id !== id
      )
    );
  };

  /* ============================================================
     SYNC EXTERNAL MEMBERS
     ============================================================ */

  useEffect(() => {
    if (
      externalMembers &&
      externalMembers.length > 0
    ) {
      setMembers(
        externalMembers.map(
          normalizeMember
        )
      );
    }
  }, [externalMembers]);

  /* ============================================================
     PERSIST MEMBERS
     ============================================================ */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(members)
      );
    } catch {
      // Ignore localStorage errors.
    }

    onMembersChange?.(members);
  }, [
    members,
    onMembersChange,
  ]);

  /* ============================================================
     DERIVED DATA
     ============================================================ */

  const statistics = useMemo(() => {
    const total =
      members.length;

    const active =
      members.filter(
        (member) =>
          member.status === "active"
      ).length;

    const inactive =
      members.filter(
        (member) =>
          member.status === "inactive"
      ).length;

    const onLeave =
      members.filter(
        (member) =>
          member.status === "on_leave"
      ).length;

    const vocalists =
      members.filter(
        (member) =>
          member.role ===
            "lead_vocalist" ||
          member.role ===
            "backing_vocalist"
      ).length;

    const instrumentalists =
      members.filter(
        (member) =>
          member.role ===
          "instrumentalist"
      ).length;

    const leaders =
      members.filter(
        (member) =>
          member.isLeader
      ).length;

    const available =
      members.filter(
        (member) =>
          member.isAvailable !==
          false
      ).length;

    return {
      total,
      active,
      inactive,
      onLeave,
      vocalists,
      instrumentalists,
      leaders,
      available,
    };
  }, [members]);

  const filteredMembers = useMemo(() => {
    const normalizedSearch =
      search
        .trim()
        .toLowerCase();

    let result =
      members.filter(
        (member) => {
          const matchesSearch =
            !normalizedSearch ||
            [
              member.name,
              member.nickname,
              member.role,
              member.instrument,
              member.voicePart,
              member.section,
              member.ministry,
              ...(member.skills ||
                []),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesRole =
            roleFilter ===
              "all" ||
            member.role ===
              roleFilter;

          const matchesStatus =
            statusFilter ===
              "all" ||
            member.status ===
              statusFilter;

          const matchesCategory =
            categoryFilter ===
              "all" ||
            member.instrumentCategory ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus &&
            matchesCategory
          );
        }
      );

    result.sort(
      (a, b) => {
        switch (sortMode) {
          case "role":
            return getRoleLabel(
              a.role
            ).localeCompare(
              getRoleLabel(
                b.role
              )
            );

          case "status":
            return getStatusLabel(
              a.status
            ).localeCompare(
              getStatusLabel(
                b.status
              )
            );

          case "joined":
            return (
              new Date(
                a.joinedAt
              ).getTime() -
              new Date(
                b.joinedAt
              ).getTime()
            );

          case "recent":
            return (
              new Date(
                b.updatedAt
              ).getTime() -
              new Date(
                a.updatedAt
              ).getTime()
            );

          case "name":
          default:
            return a.name.localeCompare(
              b.name
            );
        }
      }
    );

    return result;
  }, [
    members,
    search,
    roleFilter,
    statusFilter,
    categoryFilter,
    sortMode,
  ]);

  /* ============================================================
     ACTIONS
     ============================================================ */

  const openCreate = () => {
    if (!canEdit) {
      addToast(
        "warning",
        "MD access required",
        "Only the Music Director can add team members."
      );
      return;
    }

    setSelectedMember({
      ...EMPTY_MEMBER,
      id: createId(),
      joinedAt:
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString(),
    });

    setModalMode("create");
  };

  const openView = (
    member: TeamMember
  ) => {
    setSelectedMember(member);
    setModalMode("view");
  };

  const openEdit = (
    member: TeamMember
  ) => {
    if (!canEdit) {
      addToast(
        "warning",
        "Read-only access",
        "Only the Music Director can edit team information."
      );
      return;
    }

    setSelectedMember({
      ...member,
      socials: {
        ...member.socials,
      },
      availability: [
        ...(member.availability ||
          []),
      ],
      skills: [
        ...(member.skills ||
          []),
      ],
    });

    setModalMode("edit");
  };

  const closeModal = () => {
    setSelectedMember(null);
    setModalMode(null);
  };

  const saveMember = (
    member: TeamMember
  ) => {
    if (!canEdit) {
      addToast(
        "error",
        "Permission denied",
        "Only the Music Director can modify team members."
      );
      return;
    }

    setMembers((previous) => {
      const exists =
        previous.some(
          (item) =>
            item.id ===
            member.id
        );

      if (exists) {
        return previous.map(
          (item) =>
            item.id ===
            member.id
              ? normalizeMember(
                  member
                )
              : item
        );
      }

      return [
        ...previous,
        normalizeMember(member),
      ];
    });

    addToast(
      "success",
      modalMode === "create"
        ? "Member added"
        : "Changes saved",
      `${member.name} has been updated successfully.`
    );

    closeModal();
  };

  const confirmDelete = () => {
    if (!canEdit) {
      addToast(
        "error",
        "Permission denied",
        "Only the Music Director can remove team members."
      );
      return;
    }

    if (!deleteMember) {
      return;
    }

    const name =
      deleteMember.name;

    setMembers((previous) =>
      previous.filter(
        (member) =>
          member.id !==
          deleteMember.id
      )
    );

    setDeleteMember(null);

    addToast(
      "success",
      "Member removed",
      `${name} was removed from the team.`
    );
  };

  const toggleFeatured = (
    member: TeamMember
  ) => {
    if (!canEdit) {
      addToast(
        "warning",
        "MD access required",
        "Only the Music Director can change featured members."
      );
      return;
    }

    setMembers((previous) =>
      previous.map((item) =>
        item.id === member.id
          ? {
              ...item,
              isFeatured:
                !item.isFeatured,
              updatedAt:
                new Date().toISOString(),
            }
          : item
      )
    );
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const refresh = () => {
    setIsRefreshing(true);

    window.setTimeout(() => {
      try {
        const stored =
          localStorage.getItem(
            STORAGE_KEY
          );

        const parsed =
          safeParseMembers(
            stored
          );

        if (parsed.length > 0) {
          setMembers(parsed);
        }

        addToast(
          "success",
          "Team refreshed",
          "The latest saved team data is now displayed."
        );
      } catch {
        addToast(
          "error",
          "Refresh failed",
          "Unable to load saved team data."
        );
      } finally {
        setIsRefreshing(false);
      }
    }, 500);
  };

  const exportTeam = () => {
    const payload = {
      exportedAt:
        new Date().toISOString(),
      team: members,
    };

    const blob = new Blob(
      [JSON.stringify(
        payload,
        null,
        2
      )],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href = url;
    anchor.download =
      `jewels-music-team-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

    anchor.click();

    URL.revokeObjectURL(url);

    addToast(
      "success",
      "Team exported",
      "Your team directory has been exported."
    );
  };

  /* ============================================================
     KEYBOARD SUPPORT
     ============================================================ */

  useEffect(() => {
    const listener = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        if (modalMode) {
          closeModal();
        }

        if (deleteMember) {
          setDeleteMember(null);
        }
      }

      if (
        event.key === "/" &&
        document.activeElement?.tagName !==
          "INPUT" &&
        document.activeElement?.tagName !==
          "TEXTAREA"
      ) {
        event.preventDefault();

        const input =
          document.querySelector<HTMLInputElement>(
            '[data-team-search="true"]'
          );

        input?.focus();
      }
    };

    window.addEventListener(
      "keydown",
      listener
    );

    return () => {
      window.removeEventListener(
        "keydown",
        listener
      );
    };
  }, [
    modalMode,
    deleteMember,
  ]);

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="min-h-full bg-[#050506] text-white">
      {/* ======================================================
          BACKGROUND
          ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-white/[0.015] blur-3xl" />

        <div className="absolute bottom-[-20%] right-[-5%] h-[500px] w-[500px] rounded-full bg-white/[0.012] blur-3xl" />
      </div>

      {/* ======================================================
          PAGE
          ====================================================== */}

      <div className="relative mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* ====================================================
            HEADER
            ==================================================== */}

        <header className="rounded-[28px] border border-white/[0.07] bg-[#0c0d0f]/90 p-5 shadow-xl backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                  <Icon
                    name="users"
                    size={20}
                  />
                </div>

                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                    Jewels Music Hub
                  </div>

                  <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    Music Team
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-xs leading-5 text-white/35">
                Manage your music ministry team,
                roles, availability and member
                information from one organized
                workspace.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {statistics.active} active
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/40">
                  <Icon
                    name="users"
                    size={12}
                  />
                  {statistics.total} members
                </span>

                {canEdit ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/50">
                    <Icon
                      name="shield"
                      size={12}
                    />
                    MD Control
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/30">
                    <Icon
                      name="lock"
                      size={12}
                    />
                    View Only
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={refresh}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-xs font-medium text-white/45 hover:bg-white/[0.05] hover:text-white transition"
              >
                <Icon
                  name="refresh"
                  size={14}
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>
              </button>

              <button
                type="button"
                onClick={exportTeam}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-xs font-medium text-white/45 hover:bg-white/[0.05] hover:text-white transition"
              >
                <Icon
                  name="download"
                  size={14}
                />

                <span className="hidden sm:inline">
                  Export
                </span>
              </button>

              {canEdit && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-black hover:bg-white/90 transition"
                >
                  <Icon
                    name="plus"
                    size={15}
                  />
                  Add Member
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ====================================================
            STATISTICS
            ==================================================== */}

        {showStats && (
          <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="Total Members"
              value={statistics.total}
              description="Registered in the team"
              icon="users"
            />

            <StatCard
              label="Active Members"
              value={statistics.active}
              description="Currently active"
              icon="zap"
            />

            <StatCard
              label="Vocalists"
              value={statistics.vocalists}
              description="Lead + backing vocals"
              icon="mic"
            />

            <StatCard
              label="Instrumentalists"
              value={
                statistics.instrumentalists
              }
              description="Instrument team"
              icon="music"
            />
          </section>
        )}

        {/* ====================================================
            TOOLBAR
            ==================================================== */}

        <section className="mt-5 rounded-[24px] border border-white/[0.07] bg-[#0c0d0f] p-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25">
                <Icon
                  name="search"
                  size={16}
                />
              </div>

              <input
                data-team-search="true"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search members, roles, instruments, skills..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-12 text-xs text-white outline-none placeholder:text-white/20 focus:border-white/15 focus:bg-white/[0.04] transition"
              />

              <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/20 sm:block">
                /
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (previous) =>
                      !previous
                  )
                }
                className={[
                  "inline-flex",
                  "h-11",
                  "items-center",
                  "gap-2",
                  "rounded-xl",
                  "border",
                  "px-3.5",
                  "text-xs",
                  "font-medium",
                  "transition",
                  showFilters
                    ? "border-white/15 bg-white/[0.08] text-white"
                    : "border-white/[0.07] bg-white/[0.025] text-white/45 hover:bg-white/[0.05] hover:text-white",
                ].join(" ")}
              >
                <Icon
                  name="filter"
                  size={15}
                />

                <span>
                  Filters
                </span>
              </button>

              <div className="hidden h-7 w-px bg-white/[0.06] sm:block" />

              <div className="flex h-11 items-center rounded-xl border border-white/[0.07] bg-white/[0.025] p-1">
                <button
                  type="button"
                  onClick={() =>
                    setViewMode(
                      "grid"
                    )
                  }
                  className={[
                    "h-9 w-9 rounded-lg flex items-center justify-center transition",
                    viewMode ===
                    "grid"
                      ? "bg-white/10 text-white"
                      : "text-white/25 hover:text-white/60",
                  ].join(" ")}
                  title="Grid view"
                >
                  <Icon
                    name="grid"
                    size={15}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setViewMode(
                      "list"
                    )
                  }
                  className={[
                    "h-9 w-9 rounded-lg flex items-center justify-center transition",
                    viewMode ===
                    "list"
                      ? "bg-white/10 text-white"
                      : "text-white/25 hover:text-white/60",
                  ].join(" ")}
                  title="List view"
                >
                  <Icon
                    name="list"
                    size={15}
                  />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sortMode}
                  onChange={(event) =>
                    setSortMode(
                      event.target
                        .value as SortMode
                    )
                  }
                  className="h-11 appearance-none rounded-xl border border-white/[0.07] bg-white/[0.025] pl-3.5 pr-9 text-xs text-white/45 outline-none hover:bg-white/[0.05] transition"
                >
                  <option value="name">
                    Name
                  </option>

                  <option value="role">
                    Role
                  </option>

                  <option value="status">
                    Status
                  </option>

                  <option value="joined">
                    Joined
                  </option>

                  <option value="recent">
                    Recently Updated
                  </option>
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/20">
                  <Icon
                    name="chevron"
                    size={12}
                  />
                </div>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 border-t border-white/[0.06] pt-3">
              <FilterPanel
                roleFilter={
                  roleFilter
                }
                setRoleFilter={
                  setRoleFilter
                }
                statusFilter={
                  statusFilter
                }
                setStatusFilter={
                  setStatusFilter
                }
                categoryFilter={
                  categoryFilter
                }
                setCategoryFilter={
                  setCategoryFilter
                }
                onClear={
                  clearFilters
                }
              />
            </div>
          )}
        </section>

        {/* ====================================================
            RESULTS BAR
            ==================================================== */}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-white/80">
              Team Directory
            </div>

            <div className="mt-1 text-[10px] text-white/25">
              Showing{" "}
              {filteredMembers.length}{" "}
              of {members.length}{" "}
              members
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(search ||
              roleFilter !==
                "all" ||
              statusFilter !==
                "all" ||
              categoryFilter !==
                "all") && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-[10px] font-medium text-white/35 hover:text-white transition"
              >
                Clear active filters
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setShowStats(
                  (previous) =>
                    !previous
                )
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[10px] text-white/30 hover:bg-white/[0.04] hover:text-white/60 transition"
            >
              <Icon
                name={
                  showStats
                    ? "eye"
                    : "eye"
                }
                size={12}
              />
              {showStats
                ? "Hide stats"
                : "Show stats"}
            </button>
          </div>
        </div>

        {/* ====================================================
            TEAM CONTENT
            ==================================================== */}

        <section className="mt-4">
          {filteredMembers.length ===
          0 ? (
            <EmptyState
              search={search}
              canEdit={canEdit}
              onAdd={openCreate}
            />
          ) : viewMode ===
            "grid" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredMembers.map(
                (member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    canEdit={
                      canEdit
                    }
                    onView={() =>
                      openView(
                        member
                      )
                    }
                    onEdit={() =>
                      openEdit(
                        member
                      )
                    }
                    onDelete={() =>
                      canEdit &&
                      setDeleteMember(
                        member
                      )
                    }
                    onToggleFeatured={() =>
                      toggleFeatured(
                        member
                      )
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#111214]">
              <div className="hidden grid-cols-[minmax(220px,1.8fr)_1fr_1fr_1fr_auto] items-center gap-4 border-b border-white/[0.07] bg-white/[0.02] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/20 md:grid">
                <div>Member</div>
                <div>Role</div>
                <div>Assignment</div>
                <div>Status</div>
                <div />
              </div>

              <div>
                {filteredMembers.map(
                  (member) => (
                    <MemberListRow
                      key={
                        member.id
                      }
                      member={
                        member
                      }
                      canEdit={
                        canEdit
                      }
                      onView={() =>
                        openView(
                          member
                        )
                      }
                      onEdit={() =>
                        openEdit(
                          member
                        )
                      }
                      onDelete={() =>
                        canEdit &&
                        setDeleteMember(
                          member
                        )
                      }
                    />
                  )
                )}
              </div>
            </div>
          )}
        </section>

        {/* ====================================================
            SECURITY INFORMATION
            ==================================================== */}

        <section className="mt-6 rounded-[24px] border border-white/[0.07] bg-[#0c0d0f] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-white/45">
                <Icon
                  name={
                    canEdit
                      ? "shield"
                      : "lock"
                  }
                  size={17}
                />
              </div>

              <div>
                <div className="text-xs font-medium text-white/65">
                  {canEdit
                    ? "Music Director controls enabled"
                    : "Team directory is read-only"}
                </div>

                <div className="mt-1 max-w-2xl text-[10px] leading-5 text-white/25">
                  {canEdit
                    ? "You are signed in with Music Director permissions. You can manage team members, roles, availability and directory information."
                    : "Team member editing is restricted to the Music Director. Your current access allows you to view the team directory without modifying it."}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[9px] text-white/30">
                <span
                  className={[
                    "h-1.5",
                    "w-1.5",
                    "rounded-full",
                    canEdit
                      ? "bg-emerald-400"
                      : "bg-white/25",
                  ].join(" ")}
                />

                {canEdit
                  ? "EDIT ACCESS"
                  : "VIEW ACCESS"}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ======================================================
          TOASTS
          ====================================================== */}

      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
        {toasts.map(
          (toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() =>
                removeToast(
                  toast.id
                )
              }
            />
          )
        )}
      </div>

      {/* ======================================================
          MEMBER MODAL
          ====================================================== */}

      {selectedMember &&
        modalMode && (
          <MemberModal
            mode={modalMode}
            member={selectedMember}
            canEdit={canEdit}
            onClose={
              closeModal
            }
            onSave={
              saveMember
            }
          />
        )}

      {/* ======================================================
          DELETE MODAL
          ====================================================== */}

      {deleteMember && (
        <DeleteModal
          member={deleteMember}
          onClose={() =>
            setDeleteMember(
              null
            )
          }
          onConfirm={
            confirmDelete
          }
        />
      )}

      {/* ======================================================
          REFRESH OVERLAY
          ====================================================== */}

      {isRefreshing && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#111214]/95 px-5 py-4 shadow-2xl">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/70" />

            <span className="text-xs text-white/55">
              Refreshing team...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;

/* ============================================================
   END OF PREMIUM TEAM VIEW
   ============================================================ */
