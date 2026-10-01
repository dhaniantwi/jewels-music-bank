import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

/* ============================================================
   JEWELS MUSIC HUB
   MUSIC TEAM VIEW — PREMIUM EDITION
   SAFE STORAGE EDITION

   IMPORTANT:
   - Existing team data is loaded before anything is saved.
   - Multiple historical storage keys are supported.
   - Empty state NEVER overwrites existing saved data.
   - Only the MD can modify team members.
   ============================================================ */

/* ============================================================
   TYPES
   ============================================================ */

export type TeamRole =
  | "admin_md"
  | "lead_vocalist"
  | "backing_vocalist"
  | "instrumentalist"
  | "media"
  | "sound"
  | "other";

export type MemberStatus =
  | "active"
  | "inactive"
  | "on_leave";

export type MemberGender =
  | "male"
  | "female"
  | "other";

export type InstrumentCategory =
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

type TeamSection =
  | "all"
  | "vocalists"
  | "instrumentalists";

type ViewMode =
  | "grid"
  | "list";

type SortMode =
  | "name"
  | "role"
  | "status"
  | "joined"
  | "recent";

type ModalMode =
  | "view"
  | "edit"
  | "create"
  | null;

type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

export interface TeamMember {
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

interface MusicTeamViewProps {
  activeRole?: string;
  currentRole?: string;
  role?: string;

  members?: TeamMember[];

  onMembersChange?: (
    members: TeamMember[]
  ) => void;

  readOnly?: boolean;
}

/* ============================================================
   STORAGE
   ============================================================ */

/*
 * team_v2 is the primary key used by the Music Team page.
 *
 * The other keys are deliberately retained because older
 * versions of the Jewels Music Hub may have stored the
 * members under different names.
 */

const STORAGE_KEY =
  "team_v2";

const COMPATIBILITY_STORAGE_KEYS = [
  "jewels_music_hub_team_v2",
  "jewels_music_hub_team",
  "jewels_team_members",
  "team_members",
];

/* ============================================================
   ACCESS
   ============================================================ */

const MD_ROLES = [
  "admin_md",
  "md",
  "music_director",
  "music-director",
];

/* ============================================================
   CONSTANTS
   ============================================================ */

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ROLE_LABELS: Record<
  TeamRole,
  string
> = {
  admin_md: "Music Director",
  lead_vocalist: "Lead Vocalist",
  backing_vocalist: "Backing Vocalist",
  instrumentalist: "Instrumentalist",
  media: "Media",
  sound: "Sound",
  other: "Other",
};

const STATUS_LABELS: Record<
  MemberStatus,
  string
> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
};

const CATEGORY_LABELS: Record<
  InstrumentCategory,
  string
> = {
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

/* ============================================================
   EMPTY MEMBER
   ============================================================ */

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

  joinedAt: "",
  updatedAt: "",

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
   HELPERS
   ============================================================ */

const createId = (): string => {
  return (
    "team_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 10)
  );
};

const isMD = (
  role?: string
): boolean => {
  if (!role) {
    return false;
  }

  return MD_ROLES.includes(
    role.trim().toLowerCase()
  );
};

const safeArray = (
  value: unknown
): string[] => {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string"
      )
    : [];
};

const normalizeRole = (
  value: unknown
): TeamRole => {
  const role =
    String(value || "")
      .trim()
      .toLowerCase();

  if (
    role === "admin_md" ||
    role === "md" ||
    role === "music_director" ||
    role === "music-director"
  ) {
    return "admin_md";
  }

  if (
    role === "lead_vocalist" ||
    role === "lead vocalist" ||
    role === "lead"
  ) {
    return "lead_vocalist";
  }

  if (
    role === "backing_vocalist" ||
    role === "backing vocalist" ||
    role === "backing" ||
    role === "backup vocalist"
  ) {
    return "backing_vocalist";
  }

  if (
    role === "instrumentalist" ||
    role === "instrument" ||
    role === "band"
  ) {
    return "instrumentalist";
  }

  if (role === "media") {
    return "media";
  }

  if (role === "sound") {
    return "sound";
  }

  return "other";
};

const normalizeStatus = (
  value: unknown
): MemberStatus => {
  const status =
    String(value || "")
      .trim()
      .toLowerCase();

  if (
    status === "inactive" ||
    status === "in-active"
  ) {
    return "inactive";
  }

  if (
    status === "on_leave" ||
    status === "on leave" ||
    status === "leave"
  ) {
    return "on_leave";
  }

  return "active";
};

const normalizeMember = (
  member: Partial<TeamMember> & Record<string, any>
): TeamMember => {
  const now =
    new Date().toISOString();

  const rawRole =
    member.role ??
    member.teamRole ??
    member.memberRole ??
    member.type;

  const rawName =
    member.name ??
    member.fullName ??
    member.memberName ??
    member.displayName;

  const rawAvatar =
    member.avatar ??
    member.image ??
    member.photo ??
    member.profileImage ??
    member.photoUrl;

  const rawInstrument =
    member.instrument ??
    member.instrumentName;

  const rawVoicePart =
    member.voicePart ??
    member.voice ??
    member.vocalPart;

  return {
    ...EMPTY_MEMBER,
    ...member,

    id:
      String(
        member.id ||
          member.memberId ||
          createId()
      ),

    name:
      String(
        rawName ||
          "Unnamed Member"
      ),

    nickname:
      member.nickname ??
      member.nickName ??
      "",

    role:
      normalizeRole(
        rawRole
      ),

    status:
      normalizeStatus(
        member.status
      ),

    gender:
      member.gender ||
      "other",

    phone:
      member.phone ??
      member.mobile ??
      "",

    email:
      member.email ??
      "",

    avatar:
      rawAvatar ??
      "",

    instrument:
      rawInstrument ??
      "",

    instrumentCategory:
      member.instrumentCategory ||
      "other",

    voicePart:
      rawVoicePart ??
      "",

    joinedAt:
      member.joinedAt ||
      member.createdAt ||
      now,

    updatedAt:
      member.updatedAt ||
      member.modifiedAt ||
      now,

    notes:
      member.notes ??
      "",

    ministry:
      member.ministry ??
      "",

    section:
      member.section ??
      "",

    emergencyContact:
      member.emergencyContact ??
      "",

    emergencyPhone:
      member.emergencyPhone ??
      "",

    isLeader:
      Boolean(
        member.isLeader
      ),

    isFeatured:
      Boolean(
        member.isFeatured
      ),

    isAvailable:
      member.isAvailable !==
      false,

    availability:
      safeArray(
        member.availability
      ),

    skills:
      safeArray(
        member.skills
      ),

    assignedSongs:
      safeArray(
        member.assignedSongs
      ),

    assignedMinistrations:
      safeArray(
        member.assignedMinistrations
      ),

    socials: {
      ...EMPTY_MEMBER.socials,
      ...(member.socials || {}),
    },
  };
};

/* ============================================================
   PARSING
   ============================================================ */

const parseMembers = (
  value: string | null
): TeamMember[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(value);

    /*
     * Some older versions may have stored:
     *
     * { members: [...] }
     *
     * instead of:
     *
     * [...]
     */

    let rawMembers: unknown =
      parsed;

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      const possible =
        parsed as Record<
          string,
          unknown
        >;

      rawMembers =
        possible.members ??
        possible.team ??
        possible.teamMembers ??
        possible.data ??
        [];
    }

    if (
      !Array.isArray(
        rawMembers
      )
    ) {
      return [];
    }

    return rawMembers
      .filter(
        (
          item
        ): item is Record<
          string,
          any
        > =>
          !!item &&
          typeof item ===
            "object"
      )
      .map(
        normalizeMember
      );
  } catch {
    return [];
  }
};

/* ============================================================
   SAFE STORAGE LOADER
   ============================================================ */

const loadMembers =
  (): TeamMember[] => {
    if (
      typeof window ===
      "undefined"
    ) {
      return [];
    }

    const keys = [
      STORAGE_KEY,
      ...COMPATIBILITY_STORAGE_KEYS,
    ];

    try {
      for (const key of keys) {
        const value =
          localStorage.getItem(
            key
          );

        if (!value) {
          continue;
        }

        const parsed =
          parseMembers(value);

        if (
          parsed.length >
          0
        ) {
          console.log(
            `[MusicTeamView] Loaded ${parsed.length} members from "${key}".`
          );

          return parsed;
        }
      }
    } catch (error) {
      console.error(
        "[MusicTeamView] Storage loading error:",
        error
      );
    }

    return [];
  };

/* ============================================================
   SAVE STORAGE
   ============================================================ */

const saveMembersSafely = (
  members: TeamMember[]
): boolean => {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  /*
   * NEVER write an empty array here.
   *
   * This is a protection against accidentally destroying
   * an existing team directory.
   */

  if (
    members.length ===
    0
  ) {
    const existing =
      loadMembers();

    if (
      existing.length >
      0
    ) {
      console.warn(
        "[MusicTeamView] Refused to overwrite existing team data with an empty array."
      );

      return false;
    }
  }

  try {
    const serialized =
      JSON.stringify(
        members
      );

    localStorage.setItem(
      STORAGE_KEY,
      serialized
    );

    /*
     * Keep the old key synchronized for compatibility
     * with older parts of the application.
     */

    localStorage.setItem(
      "jewels_music_hub_team_v2",
      serialized
    );

    return true;
  } catch (error) {
    console.error(
      "[MusicTeamView] Storage saving error:",
      error
    );

    return false;
  }
};

/* ============================================================
   GENERAL HELPERS
   ============================================================ */

const initials = (
  name: string
): string => {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(
        (part) =>
          part
            .charAt(0)
            .toUpperCase()
      )
      .join("") ||
    "?"
  );
};

const formatDate = (
  value?: string
): string => {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
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

/* ============================================================
   ICON
   ============================================================ */

const Icon = ({
  name,
  size = 18,
}: {
  name: string;
  size?: number;
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap:
      "round" as const,
    strokeLinejoin:
      "round" as const,
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle
            cx="11"
            cy="11"
            r="7"
          />
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

    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle
            cx="9"
            cy="7"
            r="4"
          />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "mic":
      return (
        <svg {...common}>
          <rect
            x="9"
            y="2"
            width="6"
            height="12"
            rx="3"
          />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <path d="M12 17v5" />
          <path d="M8 22h8" />
        </svg>
      );

    case "music":
      return (
        <svg {...common}>
          <path d="M9 18V5l10-2v13" />
          <circle
            cx="6"
            cy="18"
            r="3"
          />
          <circle
            cx="16"
            cy="16"
            r="3"
          />
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
          <rect
            x="4"
            y="10"
            width="16"
            height="11"
            rx="2"
          />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case "grid":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="3"
            width="7"
            height="7"
          />
          <rect
            x="14"
            y="3"
            width="7"
            height="7"
          />
          <rect
            x="3"
            y="14"
            width="7"
            height="7"
          />
          <rect
            x="14"
            y="14"
            width="7"
            height="7"
          />
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

    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle
            cx="12"
            cy="12"
            r="3"
          />
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
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
          />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="2"
          />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
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

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );

    case "info":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="9"
          />
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

    default:
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="9"
          />
        </svg>
      );
  }
};

/* ============================================================
   BADGES
   ============================================================ */

const RoleBadge = ({
  role,
}: {
  role: TeamRole;
}) => {
  const icon =
    role === "lead_vocalist" ||
    role === "backing_vocalist"
      ? "mic"
      : role ===
        "instrumentalist"
      ? "music"
      : role ===
        "admin_md"
      ? "shield"
      : "users";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-white/60">
      <Icon
        name={icon}
        size={11}
      />
      {ROLE_LABELS[role]}
    </span>
  );
};

const StatusBadge = ({
  status,
}: {
  status: MemberStatus;
}) => {
  const style =
    status === "active"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : status === "on_leave"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
      : "border-white/10 bg-white/[0.03] text-white/30";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
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
  const dimensions =
    size === "sm"
      ? "h-9 w-9 text-xs"
      : size === "md"
      ? "h-12 w-12 text-sm"
      : size === "lg"
      ? "h-16 w-16 text-lg"
      : "h-24 w-24 text-2xl";

  if (
    member.avatar &&
    member.avatar.trim()
  ) {
    return (
      <img
        src={member.avatar}
        alt={member.name}
        className={`${dimensions} rounded-2xl border border-white/10 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${dimensions} flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/15 to-white/[0.03] font-semibold text-white`}
    >
      {initials(member.name)}
    </div>
  );
};

/* ============================================================
   TOAST
   ============================================================ */

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

const ToastItem = ({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) => {
  return (
    <div className="pointer-events-auto flex w-[360px] max-w-[calc(100vw-30px)] items-start gap-3 rounded-2xl border border-white/10 bg-[#111214]/95 p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/60">
        <Icon
          name={
            toast.type ===
            "success"
              ? "check"
              : toast.type ===
                "error"
              ? "alert"
              : toast.type ===
                "warning"
              ? "alert"
              : "info"
          }
          size={15}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-white">
          {toast.title}
        </div>

        {toast.message && (
          <div className="mt-1 text-[10px] leading-5 text-white/35">
            {toast.message}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-white/25 hover:text-white"
      >
        <Icon
          name="close"
          size={14}
        />
      </button>
    </div>
  );
};

/* ============================================================
   TEAM SECTION SELECTOR
   ============================================================ */

const CategorySelector = ({
  selected,
  onSelect,
}: {
  selected: TeamSection;
  onSelect: (
    value: TeamSection
  ) => void;
}) => {
  const items: Array<{
    id: TeamSection;
    title: string;
    description: string;
    icon: string;
  }> = [
    {
      id: "all",
      title: "All Members",
      description:
        "View the complete music team",
      icon: "users",
    },
    {
      id: "vocalists",
      title: "Vocalists",
      description:
        "Lead and backing vocal team",
      icon: "mic",
    },
    {
      id: "instrumentalists",
      title: "Instrumentalists",
      description:
        "Band and instrumental team",
      icon: "music",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map(
        (item) => {
          const active =
            selected ===
            item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onSelect(
                  item.id
                )
              }
              className={[
                "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300",
                active
                  ? "border-white/15 bg-white/[0.075] shadow-xl"
                  : "border-white/[0.07] bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.05]",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-xl transition",
                    active
                      ? "bg-white text-black"
                      : "bg-white/[0.05] text-white/50 group-hover:text-white",
                  ].join(" ")}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                  />
                </div>

                <Icon
                  name="arrow"
                  size={14}
                />
              </div>

              <div className="mt-5 text-lg font-semibold text-white">
                {item.title}
              </div>

              <div className="mt-1 text-[10px] leading-5 text-white/30">
                {item.description}
              </div>
            </button>
          );
        }
      )}
    </div>
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
  onFeature,
}: {
  member: TeamMember;
  canEdit: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFeature: () => void;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#111214] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#141518]">
      {member.isFeatured && (
        <div className="absolute left-0 right-0 top-0 h-0.5 bg-white/50" />
      )}

      <div className="p-5">
        <div className="flex items-start justify-between">
          <button
            type="button"
            onClick={onView}
            className="rounded-2xl outline-none focus:ring-2 focus:ring-white/20"
          >
            <Avatar
              member={member}
              size="lg"
            />
          </button>

          <div className="flex items-center gap-1">
            {canEdit && (
              <button
                type="button"
                onClick={onFeature}
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                  member.isFeatured
                    ? "bg-white/10 text-white"
                    : "text-white/20 hover:bg-white/5 hover:text-white"
                }`}
                title={
                  member.isFeatured
                    ? "Remove featured"
                    : "Feature member"
                }
              >
                <Icon
                  name="star"
                  size={14}
                />
              </button>
            )}

            <button
              type="button"
              onClick={onView}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white/25 hover:bg-white/5 hover:text-white"
              title="View profile"
            >
              <Icon
                name="eye"
                size={15}
              />
            </button>

            {canEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-white/25 hover:bg-white/5 hover:text-white"
                title="Edit member"
              >
                <Icon
                  name="edit"
                  size={14}
                />
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
              <span className="text-white/50">
                <Icon
                  name="shield"
                  size={12}
                />
              </span>
            )}
          </div>

          {member.nickname && (
            <div className="mt-1 truncate text-[10px] text-white/25">
              {member.nickname}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <RoleBadge
              role={member.role}
            />

            <StatusBadge
              status={member.status}
            />
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {member.instrument && (
            <div className="flex items-center gap-2 text-xs text-white/45">
              <Icon
                name="music"
                size={13}
              />
              <span className="truncate">
                {member.instrument}
              </span>
            </div>
          )}

          {member.voicePart && (
            <div className="flex items-center gap-2 text-xs text-white/45">
              <Icon
                name="mic"
                size={13}
              />
              <span className="truncate">
                {member.voicePart}
              </span>
            </div>
          )}

          {member.section && (
            <div className="flex items-center gap-2 text-xs text-white/45">
              <Icon
                name="users"
                size={13}
              />
              <span className="truncate">
                {member.section}
              </span>
            </div>
          )}
        </div>

        {member.skills &&
          member.skills.length >
            0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {member.skills
                .slice(0, 3)
                .map(
                  (
                    skill
                  ) => (
                    <span
                      key={
                        skill
                      }
                      className="rounded-lg bg-white/[0.035] px-2 py-1 text-[9px] text-white/35"
                    >
                      {skill}
                    </span>
                  )
                )}

              {member.skills.length >
                3 && (
                <span className="rounded-lg bg-white/[0.035] px-2 py-1 text-[9px] text-white/25">
                  +
                  {member.skills.length -
                    3}
                </span>
              )}
            </div>
          )}

        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <button
            type="button"
            onClick={onView}
            className="flex w-full items-center justify-between text-xs text-white/35 hover:text-white"
          >
            View profile
            <Icon
              name="arrow"
              size={13}
            />
          </button>
        </div>
      </div>

      {canEdit && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute bottom-4 right-4 hidden text-white/15 hover:text-red-400 group-hover:block"
          title="Remove member"
        >
          <Icon
            name="trash"
            size={13}
          />
        </button>
      )}
    </div>
  );
};

/* ============================================================
   FORM COMPONENTS
   ============================================================ */

const FieldLabel = ({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30">
    {children}

    {required && (
      <span className="ml-1 text-white/50">
        *
      </span>
    )}
  </label>
);

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
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.05]"
  />
);

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
}) => (
  <textarea
    rows={4}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
  />
);

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
  mode: ModalMode;
  member: TeamMember;
  canEdit: boolean;
  onClose: () => void;
  onSave: (
    member: TeamMember
  ) => void;
}) => {
  const editable =
    canEdit &&
    mode !== "view";

  const [form, setForm] =
    useState<TeamMember>(() =>
      normalizeMember(
        member
      )
    );

  const [skill, setSkill] =
    useState("");

  useEffect(() => {
    setForm(
      normalizeMember(
        member
      )
    );
  }, [member]);

  const update = <
    K extends keyof TeamMember
  >(
    key: K,
    value: TeamMember[K]
  ) => {
    setForm(
      (previous) => ({
        ...previous,
        [key]: value,
        updatedAt:
          new Date().toISOString(),
      })
    );
  };

  const toggleDay = (
    day: string
  ) => {
    const current =
      form.availability ||
      [];

    update(
      "availability",
      current.includes(day)
        ? current.filter(
            (item) =>
              item !== day
          )
        : [
            ...current,
            day,
          ]
    );
  };

  const addSkill = () => {
    const clean =
      skill.trim();

    if (!clean) {
      return;
    }

    const exists =
      (
        form.skills ||
        []
      )
        .map((item) =>
          item.toLowerCase()
        )
        .includes(
          clean.toLowerCase()
        );

    if (exists) {
      setSkill("");
      return;
    }

    update(
      "skills",
      [
        ...(form.skills ||
          []),
        clean,
      ]
    );

    setSkill("");
  };

  const removeSkill = (
    value: string
  ) => {
    update(
      "skills",
      (
        form.skills ||
        []
      ).filter(
        (item) =>
          item !== value
      )
    );
  };

  const submit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!editable) {
      return;
    }

    if (
      !form.name.trim()
    ) {
      return;
    }

    onSave(
      normalizeMember({
        ...form,
        name: form.name.trim(),
        updatedAt:
          new Date().toISOString(),
      })
    );
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
      onMouseDown={(
        event
      ) => {
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
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/20">
              Jewels Music Team
            </div>

            <h2 className="mt-1 text-lg font-semibold text-white">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/30 hover:bg-white/5 hover:text-white"
          >
            <Icon
              name="close"
              size={17}
            />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[220px_1fr]">
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

                  <div className="mt-1 text-[10px] text-white/25">
                    {
                      ROLE_LABELS[
                        form.role
                      ]
                    }
                  </div>
                </div>

                {editable && (
                  <div className="mt-5">
                    <FieldLabel>
                      Avatar URL
                    </FieldLabel>

                    <Input
                      value={
                        form.avatar ||
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        update(
                          "avatar",
                          event
                            .target
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
                  <div className="flex gap-3">
                    <Icon
                      name="lock"
                      size={15}
                    />

                    <div>
                      <div className="text-xs text-white/60">
                        Read-only profile
                      </div>

                      <div className="mt-1 text-[10px] leading-5 text-white/25">
                        Only the Music
                        Director can
                        modify team
                        information.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-7">
              {/* BASIC */}

              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Basic Information
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel required>
                      Full Name
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.name
                        }
                        onChange={(
                          event
                        ) =>
                          update(
                            "name",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Member name"
                      />
                    ) : (
                      <div className="text-sm text-white/65">
                        {form.name}
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
                        onChange={(
                          event
                        ) =>
                          update(
                            "nickname",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    ) : (
                      <div className="text-sm text-white/65">
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
                      <select
                        value={
                          form.role
                        }
                        onChange={(
                          event
                        ) =>
                          update(
                            "role",
                            event
                              .target
                              .value as TeamRole
                          )
                        }
                        className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#17181b] px-3 text-sm text-white outline-none"
                      >
                        {Object.entries(
                          ROLE_LABELS
                        ).map(
                          ([
                            value,
                            label,
                          ]) => (
                            <option
                              key={
                                value
                              }
                              value={
                                value
                              }
                            >
                              {
                                label
                              }
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <RoleBadge
                        role={
                          form.role
                        }
                      />
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Status
                    </FieldLabel>

                    {editable ? (
                      <select
                        value={
                          form.status
                        }
                        onChange={(
                          event
                        ) =>
                          update(
                            "status",
                            event
                              .target
                              .value as MemberStatus
                          )
                        }
                        className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#17181b] px-3 text-sm text-white outline-none"
                      >
                        {Object.entries(
                          STATUS_LABELS
                        ).map(
                          ([
                            value,
                            label,
                          ]) => (
                            <option
                              key={
                                value
                              }
                              value={
                                value
                              }
                            >
                              {
                                label
                              }
                            </option>
                          )
                        )}
                      </select>
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
                      Section
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.section ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          update(
                            "section",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="e.g. Vocals"
                      />
                    ) : (
                      <div className="text-sm text-white/55">
                        {form.section ||
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
                        onChange={(
                          event
                        ) =>
                          update(
                            "ministry",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    ) : (
                      <div className="text-sm text-white/55">
                        {form.ministry ||
                          "—"}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* MUSIC */}

              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Musical Assignment
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
                        onChange={(
                          event
                        ) =>
                          update(
                            "instrument",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Keyboard, Bass, Guitar..."
                      />
                    ) : (
                      <div className="text-sm text-white/55">
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
                      <select
                        value={
                          form.instrumentCategory ||
                          "other"
                        }
                        onChange={(
                          event
                        ) =>
                          update(
                            "instrumentCategory",
                            event
                              .target
                              .value as InstrumentCategory
                          )
                        }
                        className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#17181b] px-3 text-sm text-white outline-none"
                      >
                        {Object.entries(
                          CATEGORY_LABELS
                        ).map(
                          ([
                            value,
                            label,
                          ]) => (
                            <option
                              key={
                                value
                              }
                              value={
                                value
                              }
                            >
                              {
                                label
                              }
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <div className="text-sm text-white/55">
                        {
                          CATEGORY_LABELS[
                            form
                              .instrumentCategory ||
                              "other"
                          ]
                        }
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
                        onChange={(
                          event
                        ) =>
                          update(
                            "voicePart",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Soprano, Alto, Tenor..."
                      />
                    ) : (
                      <div className="text-sm text-white/55">
                        {form.voicePart ||
                          "—"}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* CONTACT */}

              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Contact
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>
                      Phone
                    </FieldLabel>

                    {editable ? (
                      <Input
                        type="tel"
                        value={
                          form.phone ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          update(
                            "phone",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Icon
                          name="phone"
                          size={13}
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
                        type="email"
                        value={
                          form.email ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          update(
                            "email",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Icon
                          name="mail"
                          size={13}
                        />
                        {form.email ||
                          "—"}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* AVAILABILITY */}

              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Availability
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {WEEK_DAYS.map(
                    (day) => {
                      const selected =
                        (
                          form.availability ||
                          []
                        ).includes(
                          day
                        );

                      if (
                        !editable
                      ) {
                        return (
                          <span
                            key={
                              day
                            }
                            className={`rounded-xl border px-3 py-2 text-[10px] ${
                              selected
                                ? "border-white/15 bg-white/10 text-white/70"
                                : "border-white/[0.06] bg-white/[0.02] text-white/20"
                            }`}
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
                          type="button"
                          key={
                            day
                          }
                          onClick={() =>
                            toggleDay(
                              day
                            )
                          }
                          className={`rounded-xl border px-3 py-2 text-[10px] transition ${
                            selected
                              ? "border-white/15 bg-white/10 text-white"
                              : "border-white/[0.06] bg-white/[0.02] text-white/25 hover:bg-white/[0.05]"
                          }`}
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

              {/* SKILLS */}

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
                        skill
                      }
                      onChange={(
                        event
                      ) =>
                        setSkill(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Add skill"
                    />

                    <button
                      type="button"
                      onClick={
                        addSkill
                      }
                      className="rounded-xl border border-white/10 bg-white/[0.05] px-4 text-xs text-white hover:bg-white/10"
                    >
                      Add
                    </button>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {(
                    form.skills ||
                    []
                  ).map(
                    (item) => (
                      <span
                        key={
                          item
                        }
                        className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[10px] text-white/45"
                      >
                        {item}

                        {editable && (
                          <button
                            type="button"
                            onClick={() =>
                              removeSkill(
                                item
                              )
                            }
                            className="text-white/20 hover:text-red-400"
                          >
                            <Icon
                              name="close"
                              size={10}
                            />
                          </button>
                        )}
                      </span>
                    )
                  )}
                </div>
              </section>

              {/* NOTES */}

              <section>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-white">
                    Notes
                  </div>
                </div>

                {editable ? (
                  <Textarea
                    value={
                      form.notes ||
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      update(
                        "notes",
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Additional notes..."
                  />
                ) : (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-xs leading-6 text-white/40">
                    {form.notes ||
                      "No notes available."}
                  </div>
                )}
              </section>

              {/* CONTROLS */}

              {editable && (
                <section>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                      <div>
                        <div className="text-xs text-white/65">
                          Team Leader
                        </div>

                        <div className="mt-1 text-[9px] text-white/25">
                          Leadership marker
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={
                          !!form.isLeader
                        }
                        onChange={(
                          event
                        ) =>
                          update(
                            "isLeader",
                            event
                              .target
                              .checked
                          )
                        }
                        className="h-4 w-4 accent-white"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                      <div>
                        <div className="text-xs text-white/65">
                          Featured
                        </div>

                        <div className="mt-1 text-[9px] text-white/25">
                          Highlight member
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={
                          !!form.isFeatured
                        }
                        onChange={(
                          event
                        ) =>
                          update(
                            "isFeatured",
                            event
                              .target
                              .checked
                          )
                        }
                        className="h-4 w-4 accent-white"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                      <div>
                        <div className="text-xs text-white/65">
                          Available
                        </div>

                        <div className="mt-1 text-[9px] text-white/25">
                          Available for ministry
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={
                          form.isAvailable !==
                          false
                        }
                        onChange={(
                          event
                        ) =>
                          update(
                            "isAvailable",
                            event
                              .target
                              .checked
                          )
                        }
                        className="h-4 w-4 accent-white"
                      />
                    </label>
                  </div>
                </section>
              )}
            </div>
          </div>

          {editable && (
            <div className="flex justify-end gap-3 border-t border-white/[0.07] px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs text-white/50 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black hover:bg-white/90"
              >
                {mode ===
                "create"
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
}) => (
  <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
    <div className="w-full max-w-md rounded-[26px] border border-white/[0.09] bg-[#111214] p-6 shadow-2xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <Icon
          name="trash"
          size={18}
        />
      </div>

      <h3 className="mt-5 text-base font-semibold text-white">
        Remove team member?
      </h3>

      <p className="mt-2 text-xs leading-6 text-white/35">
        Remove{" "}
        <span className="text-white/70">
          {member.name}
        </span>{" "}
        from the music team?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-white/[0.07] px-4 py-2.5 text-xs text-white/50 hover:text-white"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/15"
        >
          Remove Member
        </button>
      </div>
    </div>
  </div>
);

/* ============================================================
   MAIN MUSIC TEAM VIEW
   ============================================================ */

export const MusicTeamView: React.FC<
  MusicTeamViewProps
> = ({
  activeRole,
  currentRole,
  role,
  members:
    externalMembers,
  onMembersChange,
  readOnly = false,
}) => {
  /* ==========================================================
     ROLE
     ========================================================== */

  const userRole =
    activeRole ||
    currentRole ||
    role ||
    "";

  const canEdit =
    !readOnly &&
    isMD(userRole);

  /* ==========================================================
     STORAGE HYDRATION
     ========================================================== */

  const [
    storageReady,
    setStorageReady,
  ] = useState(false);

  const [
    members,
    setMembers,
  ] = useState<
    TeamMember[]
  >([]);

  /*
   * Load the existing team exactly once.
   *
   * This prevents the initial empty state from overwriting
   * existing localStorage data.
   */

  useEffect(() => {
    if (
      externalMembers &&
      externalMembers.length >
        0
    ) {
      const normalized =
        externalMembers.map(
          normalizeMember
        );

      setMembers(
        normalized
      );

      setStorageReady(
        true
      );

      return;
    }

    const saved =
      loadMembers();

    setMembers(saved);
    setStorageReady(true);
  }, []);

  /* ==========================================================
     EXTERNAL MEMBER SYNC
     ========================================================== */

  useEffect(() => {
    if (
      !storageReady
    ) {
      return;
    }

    if (
      externalMembers &&
      externalMembers.length >
        0
    ) {
      setMembers(
        externalMembers.map(
          normalizeMember
        )
      );
    }
  }, [
    externalMembers,
    storageReady,
  ]);

  /* ==========================================================
     PERSISTENCE
     ========================================================== */

  useEffect(() => {
    if (
      !storageReady
    ) {
      return;
    }

    /*
     * Protection:
     *
     * If we somehow reach an empty state while saved data
     * still exists, do NOT destroy that saved data.
     */

    if (
      members.length ===
      0
    ) {
      const existing =
        loadMembers();

      if (
        existing.length >
        0
      ) {
        setMembers(
          existing
        );

        return;
      }
    }

    saveMembersSafely(
      members
    );

    onMembersChange?.(
      members
    );
  }, [
    members,
    storageReady,
    onMembersChange,
  ]);

  /* ==========================================================
     UI STATE
     ========================================================== */

  const [search, setSearch] =
    useState("");

  const [
    section,
    setSection,
  ] = useState<TeamSection>(
    "all"
  );

  const [
    roleFilter,
    setRoleFilter,
  ] = useState("all");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("all");

  const [sortMode, setSortMode] =
    useState<SortMode>(
      "name"
    );

  const [viewMode, setViewMode] =
    useState<ViewMode>(
      "grid"
    );

  const [
    showFilters,
    setShowFilters,
  ] = useState(false);

  const [
    selectedMember,
    setSelectedMember,
  ] =
    useState<TeamMember | null>(
      null
    );

  const [
    modalMode,
    setModalMode,
  ] =
    useState<ModalMode>(null);

  const [
    memberToDelete,
    setMemberToDelete,
  ] =
    useState<TeamMember | null>(
      null
    );

  const [toasts, setToasts] =
    useState<Toast[]>([]);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  /* ==========================================================
     TOAST
     ========================================================== */

  const addToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string
    ) => {
      const id =
        createId();

      setToasts(
        (previous) => [
          ...previous,
          {
            id,
            type,
            title,
            message,
          },
        ]
      );

      window.setTimeout(
        () => {
          setToasts(
            (previous) =>
              previous.filter(
                (
                  toast
                ) =>
                  toast.id !==
                  id
              )
          );
        },
        4000
      );
    },
    []
  );

  const removeToast = (
    id: string
  ) => {
    setToasts(
      (previous) =>
        previous.filter(
          (toast) =>
            toast.id !== id
        )
    );
  };

  /* ==========================================================
     FILTERED MEMBERS
     ========================================================== */

  const filteredMembers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      let result =
        members.filter(
          (member) => {
            const searchText = [
              member.name,
              member.nickname,
              member.instrument,
              member.voicePart,
              member.section,
              member.ministry,
              ROLE_LABELS[
                member.role
              ],
              ...(member.skills ||
                []),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            const matchesSearch =
              !query ||
              searchText.includes(
                query
              );

            let matchesSection =
              true;

            if (
              section ===
              "vocalists"
            ) {
              matchesSection =
                member.role ===
                  "lead_vocalist" ||
                member.role ===
                  "backing_vocalist";
            }

            if (
              section ===
              "instrumentalists"
            ) {
              matchesSection =
                member.role ===
                "instrumentalist";
            }

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
              matchesSection &&
              matchesRole &&
              matchesStatus &&
              matchesCategory
            );
          }
        );

      result.sort(
        (a, b) => {
          switch (
            sortMode
          ) {
            case "role":
              return ROLE_LABELS[
                a.role
              ].localeCompare(
                ROLE_LABELS[
                  b.role
                ]
              );

            case "status":
              return STATUS_LABELS[
                a.status
              ].localeCompare(
                STATUS_LABELS[
                  b.status
                ]
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
      section,
      roleFilter,
      statusFilter,
      categoryFilter,
      sortMode,
    ]);

  /* ==========================================================
     OPEN CREATE
     ========================================================== */

  const openCreate = () => {
    if (!canEdit) {
      addToast(
        "warning",
        "MD access required",
        "Only the Music Director can add members."
      );

      return;
    }

    const now =
      new Date().toISOString();

    setSelectedMember({
      ...EMPTY_MEMBER,
      id: createId(),
      joinedAt: now,
      updatedAt: now,
    });

    setModalMode(
      "create"
    );
  };

  /* ==========================================================
     VIEW
     ========================================================== */

  const openView = (
    member: TeamMember
  ) => {
    setSelectedMember(
      normalizeMember(
        member
      )
    );

    setModalMode("view");
  };

  /* ==========================================================
     EDIT
     ========================================================== */

  const openEdit = (
    member: TeamMember
  ) => {
    if (!canEdit) {
      addToast(
        "warning",
        "Read-only access",
        "Only the Music Director can edit team members."
      );

      return;
    }

    setSelectedMember(
      normalizeMember(
        member
      )
    );

    setModalMode(
      "edit"
    );
  };

  /* ==========================================================
     SAVE MEMBER
     ========================================================== */

  const saveMember = (
    member: TeamMember
  ) => {
    if (!canEdit) {
      addToast(
        "error",
        "Permission denied",
        "Only the Music Director can modify the team."
      );

      return;
    }

    const normalized =
      normalizeMember(
        member
      );

    setMembers(
      (previous) => {
        const exists =
          previous.some(
            (item) =>
              item.id ===
              normalized.id
          );

        if (exists) {
          return previous.map(
            (item) =>
              item.id ===
              normalized.id
                ? normalized
                : item
          );
        }

        return [
          ...previous,
          normalized,
        ];
      }
    );

    addToast(
      "success",
      modalMode ===
        "create"
        ? "Member added"
        : "Changes saved",
      `${normalized.name} has been updated.`
    );

    setSelectedMember(
      null
    );

    setModalMode(
      null
    );
  };

  /* ==========================================================
     DELETE
     ========================================================== */

  const deleteConfirmed =
    () => {
      if (
        !canEdit ||
        !memberToDelete
      ) {
        return;
      }

      const name =
        memberToDelete.name;

      setMembers(
        (previous) =>
          previous.filter(
            (member) =>
              member.id !==
              memberToDelete.id
          )
      );

      setMemberToDelete(
        null
      );

      addToast(
        "success",
        "Member removed",
        `${name} was removed from the music team.`
      );
    };

  /* ==========================================================
     FEATURE
     ========================================================== */

  const toggleFeatured = (
    member: TeamMember
  ) => {
    if (!canEdit) {
      return;
    }

    setMembers(
      (previous) =>
        previous.map(
          (item) =>
            item.id ===
            member.id
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

  /* ==========================================================
     CLEAR FILTERS
     ========================================================== */

  const clearFilters =
    () => {
      setSearch("");
      setSection("all");
      setRoleFilter(
        "all"
      );
      setStatusFilter(
        "all"
      );
      setCategoryFilter(
        "all"
      );
    };

  /* ==========================================================
     REFRESH
     ========================================================== */

  const refresh = () => {
    setRefreshing(true);

    window.setTimeout(
      () => {
        const saved =
          loadMembers();

        if (
          saved.length >
          0
        ) {
          setMembers(
            saved
          );

          addToast(
            "success",
            "Team refreshed",
            "Your saved team information has been loaded."
          );
        } else {
          /*
           * IMPORTANT:
           *
           * Do not replace an existing non-empty team with
           * an empty refresh result.
           */

          if (
            members.length >
            0
          ) {
            addToast(
              "warning",
              "No replacement data found",
              "Your current team was kept safe."
            );
          } else {
            setMembers([]);

            addToast(
              "info",
              "No saved members",
              "No saved team members were found."
            );
          }
        }

        setRefreshing(false);
      },
      450
    );
  };

  /* ==========================================================
     EXPORT
     ========================================================== */

  const exportTeam =
    () => {
      try {
        const blob =
          new Blob(
            [
              JSON.stringify(
                {
                  exportedAt:
                    new Date().toISOString(),
                  team: members,
                },
                null,
                2
              ),
            ],
            {
              type: "application/json",
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const anchor =
          document.createElement(
            "a"
          );

        anchor.href =
          url;

        anchor.download =
          `jewels-music-team-${new Date()
            .toISOString()
            .slice(
              0,
              10
            )}.json`;

        document.body.appendChild(
          anchor
        );

        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(
          url
        );

        addToast(
          "success",
          "Team exported",
          "The team directory has been exported."
        );
      } catch {
        addToast(
          "error",
          "Export failed",
          "Unable to export the team directory."
        );
      }
    };

  /* ==========================================================
     KEYBOARD
     ========================================================== */

  useEffect(() => {
    const listener = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setSelectedMember(
          null
        );

        setModalMode(
          null
        );

        setMemberToDelete(
          null
        );
      }

      if (
        event.key ===
          "/" &&
        document.activeElement
          ?.tagName !==
          "INPUT" &&
        document.activeElement
          ?.tagName !==
          "TEXTAREA"
      ) {
        event.preventDefault();

        document
          .querySelector<HTMLInputElement>(
            "[data-team-search]"
          )
          ?.focus();
      }
    };

    window.addEventListener(
      "keydown",
      listener
    );

    return () =>
      window.removeEventListener(
        "keydown",
        listener
      );
  }, []);

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="min-h-full bg-[#050506] text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">

        {/* ====================================================
            HEADER
            ==================================================== */}

        <header className="rounded-[28px] border border-white/[0.07] bg-[#0c0d0f]/95 p-5 shadow-xl backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white/60">
                  <Icon
                    name="users"
                    size={20}
                  />
                </div>

                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                    Jewels Music Hub
                  </div>

                  <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    Music Team
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-xs leading-5 text-white/30">
                Your music ministry
                team directory —
                organized,
                searchable and
                controlled by the
                Music Director.
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/40">
                <Icon
                  name={
                    canEdit
                      ? "shield"
                      : "lock"
                  }
                  size={11}
                />

                {canEdit
                  ? "MD Control"
                  : "View Only"}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={
                  refresh
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-xs text-white/40 hover:bg-white/[0.05] hover:text-white"
              >
                <Icon
                  name="refresh"
                  size={14}
                />

                Refresh
              </button>

              <button
                type="button"
                onClick={
                  exportTeam
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-xs text-white/40 hover:bg-white/[0.05] hover:text-white"
              >
                <Icon
                  name="download"
                  size={14}
                />

                Export
              </button>

              {canEdit && (
                <button
                  type="button"
                  onClick={
                    openCreate
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-black hover:bg-white/90"
                >
                  <Icon
                    name="plus"
                    size={14}
                  />

                  Add Member
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ====================================================
            THREE MAIN TEAM SECTIONS
            ==================================================== */}

        <section className="mt-5">
          <CategorySelector
            selected={
              section
            }
            onSelect={
              setSection
            }
          />
        </section>

        {/* ====================================================
            SEARCH / TOOLBAR
            ==================================================== */}

        <section className="mt-5 rounded-[24px] border border-white/[0.07] bg-[#0c0d0f] p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

            <div className="relative flex-1">
              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25">
                <Icon
                  name="search"
                  size={16}
                />
              </div>

              <input
                data-team-search="true"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search team members..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-10 text-xs text-white outline-none placeholder:text-white/20 focus:border-white/15"
              />

              <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/20 sm:block">
                /
              </div>
            </div>

            <div className="flex flex-wrap gap-2">

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (
                      previous
                    ) =>
                      !previous
                  )
                }
                className={`inline-flex h-11 items-center gap-2 rounded-xl border px-3.5 text-xs transition ${
                  showFilters
                    ? "border-white/15 bg-white/[0.08] text-white"
                    : "border-white/[0.07] bg-white/[0.025] text-white/40"
                }`}
              >
                <Icon
                  name="filter"
                  size={14}
                />

                Filters
              </button>

              <div className="flex h-11 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1">
                <button
                  type="button"
                  onClick={() =>
                    setViewMode(
                      "grid"
                    )
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    viewMode ===
                    "grid"
                      ? "bg-white/10 text-white"
                      : "text-white/25"
                  }`}
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
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    viewMode ===
                    "list"
                      ? "bg-white/10 text-white"
                      : "text-white/25"
                  }`}
                >
                  <Icon
                    name="list"
                    size={15}
                  />
                </button>
              </div>

              <select
                value={
                  sortMode
                }
                onChange={(
                  event
                ) =>
                  setSortMode(
                    event.target
                      .value as SortMode
                  )
                }
                className="h-11 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white/45 outline-none"
              >
                <option value="name">
                  Sort: Name
                </option>

                <option value="role">
                  Sort: Role
                </option>

                <option value="status">
                  Sort: Status
                </option>

                <option value="joined">
                  Sort: Joined
                </option>

                <option value="recent">
                  Sort: Recent
                </option>
              </select>
            </div>
          </div>

          {/* FILTERS */}

          {showFilters && (
            <div className="mt-3 grid grid-cols-1 gap-3 border-t border-white/[0.06] pt-3 md:grid-cols-4">

              <select
                value={
                  roleFilter
                }
                onChange={(
                  event
                ) =>
                  setRoleFilter(
                    event.target
                      .value
                  )
                }
                className="h-10 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white/50 outline-none"
              >
                <option value="all">
                  All Roles
                </option>

                {Object.entries(
                  ROLE_LABELS
                ).map(
                  ([
                    value,
                    label,
                  ]) => (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {label}
                    </option>
                  )
                )}
              </select>

              <select
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
                  setStatusFilter(
                    event.target
                      .value
                  )
                }
                className="h-10 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white/50 outline-none"
              >
                <option value="all">
                  All Statuses
                </option>

                {Object.entries(
                  STATUS_LABELS
                ).map(
                  ([
                    value,
                    label,
                  ]) => (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {label}
                    </option>
                  )
                )}
              </select>

              <select
                value={
                  categoryFilter
                }
                onChange={(
                  event
                ) =>
                  setCategoryFilter(
                    event.target
                      .value
                  )
                }
                className="h-10 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white/50 outline-none"
              >
                <option value="all">
                  All Categories
                </option>

                {Object.entries(
                  CATEGORY_LABELS
                ).map(
                  ([
                    value,
                    label,
                  ]) => (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {label}
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="h-10 rounded-xl border border-white/[0.07] bg-white/[0.025] text-xs text-white/35 hover:bg-white/[0.05] hover:text-white"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* ====================================================
            DIRECTORY HEADING
            ==================================================== */}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-white/75">
              {section ===
              "vocalists"
                ? "Vocal Team"
                : section ===
                  "instrumentalists"
                ? "Instrumental Team"
                : "Music Team Directory"}
            </div>

            <div className="mt-1 text-[10px] text-white/25">
              {search ||
              section !==
                "all" ||
              roleFilter !==
                "all" ||
              statusFilter !==
                "all" ||
              categoryFilter !==
                "all"
                ? "Filtered team view"
                : "Team directory"}
            </div>
          </div>

          {(search ||
            section !==
              "all" ||
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
              className="text-[10px] text-white/35 hover:text-white"
            >
              Clear active filters
            </button>
          )}
        </div>

        {/* ====================================================
            MEMBERS
            ==================================================== */}

        <section className="mt-4">
          {filteredMembers.length ===
          0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[26px] border border-dashed border-white/[0.08] bg-white/[0.015] px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-white/25">
                <Icon
                  name={
                    section ===
                    "vocalists"
                      ? "mic"
                      : section ===
                        "instrumentalists"
                      ? "music"
                      : "users"
                  }
                  size={25}
                />
              </div>

              <div className="mt-5 text-sm font-semibold text-white/70">
                No team members found
              </div>

              <div className="mt-2 max-w-sm text-xs leading-5 text-white/25">
                Try changing the
                search or selected
                team section.
              </div>

              {canEdit && (
                <button
                  type="button"
                  onClick={
                    openCreate
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black"
                >
                  <Icon
                    name="plus"
                    size={13}
                  />

                  Add Member
                </button>
              )}
            </div>
          ) : viewMode ===
            "grid" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredMembers.map(
                (member) => (
                  <MemberCard
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
                      setMemberToDelete(
                        member
                      )
                    }
                    onFeature={() =>
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

              <div className="hidden grid-cols-[1.8fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3 text-[9px] uppercase tracking-[0.14em] text-white/20 md:grid">
                <div>
                  Member
                </div>

                <div>
                  Role
                </div>

                <div>
                  Assignment
                </div>

                <div>
                  Status
                </div>

                <div />
              </div>

              {filteredMembers.map(
                (member) => (
                  <div
                    key={
                      member.id
                    }
                    className="grid grid-cols-1 gap-4 border-b border-white/[0.06] p-5 last:border-b-0 md:grid-cols-[1.8fr_1fr_1fr_1fr_auto] md:items-center"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openView(
                          member
                        )
                      }
                      className="flex min-w-0 items-center gap-3 text-left"
                    >
                      <Avatar
                        member={
                          member
                        }
                        size="md"
                      />

                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-white">
                          {
                            member.name
                          }
                        </div>

                        <div className="mt-1 truncate text-[10px] text-white/25">
                          {member.nickname ||
                            "Music Team"}
                        </div>
                      </div>
                    </button>

                    <div>
                      <RoleBadge
                        role={
                          member.role
                        }
                      />
                    </div>

                    <div className="text-xs text-white/40">
                      {member.instrument ||
                        member.voicePart ||
                        "—"}
                    </div>

                    <div>
                      <StatusBadge
                        status={
                          member.status
                        }
                      />
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          openView(
                            member
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 hover:bg-white/5 hover:text-white"
                      >
                        <Icon
                          name="eye"
                          size={14}
                        />
                      </button>

                      {canEdit && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              openEdit(
                                member
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 hover:bg-white/5 hover:text-white"
                          >
                            <Icon
                              name="edit"
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setMemberToDelete(
                                member
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Icon
                              name="trash"
                              size={13}
                            />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ====================================================
            ACCESS NOTICE
            ==================================================== */}

        <section className="mt-6 rounded-[24px] border border-white/[0.07] bg-[#0c0d0f] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-white/40">
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
              <div className="text-xs font-medium text-white/60">
                {canEdit
                  ? "Music Director access"
                  : "View-only access"}
              </div>

              <div className="mt-1 text-[10px] leading-5 text-white/25">
                {canEdit
                  ? "You can add, edit, feature and remove music team members."
                  : "Team information is read-only. Only the Music Director can make changes."}
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
              key={
                toast.id
              }
              toast={
                toast
              }
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
            mode={
              modalMode
            }
            member={
              selectedMember
            }
            canEdit={
              canEdit
            }
            onClose={() => {
              setSelectedMember(
                null
              );

              setModalMode(
                null
              );
            }}
            onSave={
              saveMember
            }
          />
        )}

      {/* ======================================================
          DELETE MODAL
          ====================================================== */}

      {memberToDelete && (
        <DeleteModal
          member={
            memberToDelete
          }
          onClose={() =>
            setMemberToDelete(
              null
            )
          }
          onConfirm={
            deleteConfirmed
          }
        />
      )}

      {/* ======================================================
          REFRESH OVERLAY
          ====================================================== */}

      {refreshing && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#111214] px-5 py-4 shadow-2xl">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/70" />

            <span className="text-xs text-white/50">
              Loading team...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

export default MusicTeamView;
