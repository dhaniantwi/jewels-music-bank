import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

/* ============================================================
   JEWELS MUSIC HUB
   MUSIC TEAM VIEW — PREMIUM / SAFE STORAGE EDITION

   FEATURES
   ------------------------------------------------------------
   • Premium dark UI
   • All Members / Vocalists / Instrumentalists
   • Search
   • Sort
   • Grid / List view
   • Member profiles
   • Add / Edit / Delete
   • Featured members
   • Export
   • MD-only editing
   • Regular members = view only

   STORAGE FIX
   ------------------------------------------------------------
   • team_v2 is the canonical key
   • Supports historical Jewels keys
   • Searches localStorage and sessionStorage
   • Supports arrays and { members: [] } structures
   • Migrates recovered data back to team_v2
   • Empty parent props NEVER erase recovered data
   • Empty initial state NEVER destroys existing storage
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

  [key: string]: any;
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

  [key: string]: any;
}

/* ============================================================
   STORAGE
   ============================================================ */

const STORAGE_KEY = "team_v2";

const COMPATIBILITY_STORAGE_KEYS = [
  "jewels_music_hub_team_v2",
  "jewels_music_hub_team",
  "jewels_team_members",
  "team_members",
  "music_team",
  "music_team_members",
  "jewels_team_v2",
];

const STORAGE_HINTS = [
  "team",
  "member",
  "music",
  "jewel",
];

/* ============================================================
   ACCESS
   ============================================================ */

const MD_ROLES = [
  "admin_md",
  "md",
  "music_director",
  "music-director",
  "musicdirector",
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
   BASIC HELPERS
   ============================================================ */

const createId = (): string => {
  try {
    if (
      typeof crypto !== "undefined" &&
      "randomUUID" in crypto
    ) {
      return `team_${crypto.randomUUID()}`;
    }
  } catch {}

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
  if (!role) return false;

  return MD_ROLES.includes(
    role.trim().toLowerCase()
  );
};

const safeArray = (
  value: unknown
): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is string =>
        typeof item === "string"
    )
    .map((item) => item.trim())
    .filter(Boolean);
};

const asRecord = (
  value: unknown
): Record<string, any> | null => {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as Record<
      string,
      any
    >;
  }

  return null;
};

/* ============================================================
   NORMALIZERS
   ============================================================ */

const normalizeRole = (
  value: unknown
): TeamRole => {
  const role = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");

  if (
    role === "admin_md" ||
    role === "md" ||
    role === "music_director" ||
    role === "musicdirector"
  ) {
    return "admin_md";
  }

  if (
    role === "lead_vocalist" ||
    role === "lead vocalist" ||
    role === "lead" ||
    role === "lead_vocal"
  ) {
    return "lead_vocalist";
  }

  if (
    role === "backing_vocalist" ||
    role === "backing vocalist" ||
    role === "backing" ||
    role === "backup vocalist" ||
    role === "backup_vocalist" ||
    role === "vocalist" ||
    role === "vocal"
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
  const status = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");

  if (
    status === "inactive" ||
    status === "in_active"
  ) {
    return "inactive";
  }

  if (
    status === "on_leave" ||
    status === "leave"
  ) {
    return "on_leave";
  }

  return "active";
};

const normalizeCategory = (
  value: unknown
): InstrumentCategory => {
  const category = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");

  const allowed: InstrumentCategory[] = [
    "vocals",
    "keyboard",
    "guitar",
    "bass",
    "drums",
    "percussion",
    "brass",
    "strings",
    "media",
    "sound",
    "other",
  ];

  return allowed.includes(
    category as InstrumentCategory
  )
    ? (category as InstrumentCategory)
    : "other";
};

const normalizeMember = (
  member: Partial<TeamMember> &
    Record<string, any>
): TeamMember => {
  const now =
    new Date().toISOString();

  const rawName =
    member.name ??
    member.fullName ??
    member.memberName ??
    member.displayName ??
    "Unnamed Member";

  const rawRole =
    member.role ??
    member.teamRole ??
    member.memberRole ??
    member.type;

  const rawAvatar =
    member.avatar ??
    member.image ??
    member.photo ??
    member.profileImage ??
    member.photoUrl ??
    "";

  const rawInstrument =
    member.instrument ??
    member.instrumentName ??
    "";

  const rawVoicePart =
    member.voicePart ??
    member.voice ??
    member.vocalPart ??
    "";

  return {
    ...EMPTY_MEMBER,
    ...member,

    id: String(
      member.id ??
        member.memberId ??
        createId()
    ),

    name: String(rawName),

    nickname: String(
      member.nickname ??
        member.nickName ??
        ""
    ),

    role: normalizeRole(
      rawRole
    ),

    status: normalizeStatus(
      member.status
    ),

    gender:
      member.gender ===
        "male" ||
      member.gender ===
        "female"
        ? member.gender
        : "other",

    phone: String(
      member.phone ??
        member.mobile ??
        ""
    ),

    email: String(
      member.email ?? ""
    ),

    avatar: String(
      rawAvatar
    ),

    instrument: String(
      rawInstrument
    ),

    instrumentCategory:
      normalizeCategory(
        member.instrumentCategory ??
          member.category
      ),

    voicePart: String(
      rawVoicePart
    ),

    joinedAt: String(
      member.joinedAt ??
        member.createdAt ??
        now
    ),

    updatedAt: String(
      member.updatedAt ??
        member.modifiedAt ??
        now
    ),

    notes: String(
      member.notes ?? ""
    ),

    ministry: String(
      member.ministry ?? ""
    ),

    section: String(
      member.section ?? ""
    ),

    emergencyContact:
      String(
        member.emergencyContact ??
          ""
      ),

    emergencyPhone:
      String(
        member.emergencyPhone ??
          ""
      ),

    isLeader: Boolean(
      member.isLeader
    ),

    isFeatured: Boolean(
      member.isFeatured
    ),

    isAvailable:
      member.isAvailable !==
      false,

    availability:
      safeArray(
        member.availability
      ),

    skills: safeArray(
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
   MEMBER DETECTION
   ============================================================ */

const looksLikeMember = (
  value: unknown
): boolean => {
  const obj =
    asRecord(value);

  if (!obj) {
    return false;
  }

  const hasName =
    typeof obj.name ===
      "string" ||
    typeof obj.fullName ===
      "string" ||
    typeof obj.memberName ===
      "string" ||
    typeof obj.displayName ===
      "string";

  if (!hasName) {
    return false;
  }

  const markers = [
    "role",
    "teamRole",
    "memberRole",
    "instrument",
    "voicePart",
    "phone",
    "email",
    "status",
    "section",
    "ministry",
    "nickname",
    "gender",
    "skills",
    "availability",
    "joinedAt",
  ];

  return markers.some(
    (key) =>
      key in obj
  );
};

/* ============================================================
   DEEP EXTRACTION
   ============================================================ */

const extractMembers = (
  value: unknown,
  depth = 0
): TeamMember[] => {
  if (depth > 6) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .filter(
        looksLikeMember
      )
      .map((item) =>
        normalizeMember(
          item as Record<
            string,
            any
          >
        )
      );
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  if (looksLikeMember(value)) {
    return [
      normalizeMember(
        value as Record<
          string,
          any
        >
      ),
    ];
  }

  const obj =
    asRecord(value);

  if (!obj) {
    return [];
  }

  const wrapperKeys = [
    "members",
    "teamMembers",
    "team",
    "data",
    "items",
    "value",
    "people",
    "users",
  ];

  for (const key of wrapperKeys) {
    if (key in obj) {
      const result =
        extractMembers(
          obj[key],
          depth + 1
        );

      if (result.length > 0) {
        return result;
      }
    }
  }

  /*
   * Some old implementations may have used:
   *
   * {
   *   "id123": {...member},
   *   "id456": {...member}
   * }
   */

  const values =
    Object.values(obj);

  const possible =
    values.filter(
      looksLikeMember
    );

  if (possible.length > 0) {
    return possible.map(
      (item) =>
        normalizeMember(
          item as Record<
            string,
            any
          >
        )
    );
  }

  return [];
};

/* ============================================================
   DEDUPLICATION
   ============================================================ */

const dedupeMembers = (
  members: TeamMember[]
): TeamMember[] => {
  const map =
    new Map<
      string,
      TeamMember
    >();

  for (const member of members) {
    const id =
      member.id ||
      `${member.name
        .trim()
        .toLowerCase()}_${(
        member.phone || ""
      ).trim()}`;

    if (!map.has(id)) {
      map.set(
        id,
        normalizeMember(
          member
        )
      );
    }
  }

  return Array.from(
    map.values()
  );
};

/* ============================================================
   STORAGE READ
   ============================================================ */

const readStorage =
  (
    storage: Storage,
    key: string
  ): TeamMember[] => {
    try {
      const raw =
        storage.getItem(key);

      if (!raw) {
        return [];
      }

      return dedupeMembers(
        extractMembers(
          JSON.parse(raw)
        )
      );
    } catch {
      return [];
    }
  };

/* ============================================================
   FULL RECOVERY
   ============================================================ */

const recoverTeamMembers =
  (): {
    members: TeamMember[];
    source: string;
  } => {
    if (
      typeof window ===
      "undefined"
    ) {
      return {
        members: [],
        source: "",
      };
    }

    const knownKeys = [
      STORAGE_KEY,
      ...COMPATIBILITY_STORAGE_KEYS,
    ];

    /* --------------------------------------------
       1. Known localStorage keys
       -------------------------------------------- */

    try {
      for (const key of knownKeys) {
        const members =
          readStorage(
            localStorage,
            key
          );

        if (
          members.length > 0
        ) {
          return {
            members,
            source: `localStorage:${key}`,
          };
        }
      }
    } catch {}

    /* --------------------------------------------
       2. Known sessionStorage keys
       -------------------------------------------- */

    try {
      for (const key of knownKeys) {
        const members =
          readStorage(
            sessionStorage,
            key
          );

        if (
          members.length > 0
        ) {
          return {
            members,
            source: `sessionStorage:${key}`,
          };
        }
      }
    } catch {}

    /* --------------------------------------------
       3. Deep scan localStorage
       -------------------------------------------- */

    try {
      for (
        let i = 0;
        i <
        localStorage.length;
        i++
      ) {
        const key =
          localStorage.key(i);

        if (!key) {
          continue;
        }

        if (
          knownKeys.includes(
            key
          )
        ) {
          continue;
        }

        const looksRelevant =
          STORAGE_HINTS.some(
            (hint) =>
              key
                .toLowerCase()
                .includes(hint)
          );

        if (!looksRelevant) {
          continue;
        }

        const members =
          readStorage(
            localStorage,
            key
          );

        if (
          members.length > 0
        ) {
          return {
            members,
            source: `localStorage:${key}`,
          };
        }
      }
    } catch {}

    /* --------------------------------------------
       4. Deep scan sessionStorage
       -------------------------------------------- */

    try {
      for (
        let i = 0;
        i <
        sessionStorage.length;
        i++
      ) {
        const key =
          sessionStorage.key(i);

        if (!key) {
          continue;
        }

        const looksRelevant =
          STORAGE_HINTS.some(
            (hint) =>
              key
                .toLowerCase()
                .includes(hint)
          );

        if (!looksRelevant) {
          continue;
        }

        const members =
          readStorage(
            sessionStorage,
            key
          );

        if (
          members.length > 0
        ) {
          return {
            members,
            source: `sessionStorage:${key}`,
          };
        }
      }
    } catch {}

    return {
      members: [],
      source: "",
    };
  };

/* ============================================================
   SAFE SAVE
   ============================================================ */

const saveMembers =
  (
    members: TeamMember[],
    forceEmpty = false
  ): boolean => {
    if (
      typeof window ===
      "undefined"
    ) {
      return false;
    }

    /*
     * Never accidentally destroy existing data.
     *
     * forceEmpty is ONLY used after the user has explicitly
     * deleted the final member.
     */

    if (
      members.length === 0 &&
      !forceEmpty
    ) {
      const recovered =
        recoverTeamMembers();

      if (
        recovered.members
          .length > 0
      ) {
        console.warn(
          "[MusicTeamView] Empty save blocked; existing members were found."
        );

        return false;
      }
    }

    const normalized =
      dedupeMembers(
        members
      );

    const serialized =
      JSON.stringify(
        normalized
      );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        serialized
      );

      /*
       * Keep the newer compatibility key synchronized.
       */

      localStorage.setItem(
        "jewels_music_hub_team_v2",
        serialized
      );

      return true;
    } catch (
      error
    ) {
      console.error(
        "[MusicTeamView] Failed to save members:",
        error
      );

      return false;
    }
  };

/* ============================================================
   ROLE RECOVERY
   ============================================================ */

const getStoredRole =
  (): string => {
    if (
      typeof window ===
      "undefined"
    ) {
      return "";
    }

    try {
      const raw =
        localStorage.getItem(
          "current_role_v2"
        );

      if (!raw) {
        return "";
      }

      try {
        const parsed =
          JSON.parse(raw);

        if (
          typeof parsed ===
          "string"
        ) {
          return parsed;
        }

        if (
          parsed &&
          typeof parsed ===
            "object"
        ) {
          return String(
            parsed.role ??
              parsed.currentRole ??
              parsed.activeRole ??
              ""
          );
        }
      } catch {
        return raw;
      }
    } catch {}

    return "";
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
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase()
      )
      .join("") || "?"
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
      : role === "instrumentalist"
      ? "music"
      : role === "admin_md"
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
}) => (
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

/* ============================================================
   CATEGORY SELECTOR
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
  const items = [
    {
      id: "all" as TeamSection,
      title: "All Members",
      description:
        "View the complete music team",
      icon: "users",
    },
    {
      id: "vocalists" as TeamSection,
      title: "Vocalists",
      description:
        "Lead and backing vocal team",
      icon: "mic",
    },
    {
      id: "instrumentalists" as TeamSection,
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
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                active
                  ? "border-white/15 bg-white/[0.075] shadow-xl"
                  : "border-white/[0.07] bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    active
                      ? "bg-white text-black"
                      : "bg-white/[0.05] text-white/50 group-hover:text-white"
                  }`}
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
}) => (
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
              className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                member.isFeatured
                  ? "bg-white/10 text-white"
                  : "text-white/20 hover:bg-white/5 hover:text-white"
              }`}
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
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-white/[0.035] px-2 py-1 text-[9px] text-white/35"
                  >
                    {skill}
                  </span>
                )
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
      >
        <Icon
          name="trash"
          size={13}
        />
      </button>
    )}
  </div>
);

/* ============================================================
   FORM INPUTS
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
  disabled = false,
}: {
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.05] disabled:cursor-default disabled:opacity-70"
  />
);

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
}) => (
  <select
    value={value}
    onChange={onChange}
    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#161719] px-3.5 text-sm text-white outline-none focus:border-white/20"
  >
    {children}
  </select>
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
    useState<TeamMember>(
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

  const addSkill = () => {
    const clean =
      skill.trim();

    if (!clean) {
      return;
    }

    const exists =
      (
        form.skills || []
      ).some(
        (item) =>
          item.toLowerCase() ===
          clean.toLowerCase()
      );

    if (!exists) {
      update(
        "skills",
        [
          ...(form.skills ||
            []),
          clean,
        ]
      );
    }

    setSkill("");
  };

  const removeSkill = (
    value: string
  ) => {
    update(
      "skills",
      (
        form.skills || []
      ).filter(
        (item) =>
          item !== value
      )
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#101113] shadow-2xl">
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
                      onChange={(e) =>
                        update(
                          "avatar",
                          e.target.value
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
              {/* BASIC INFORMATION */}

              <section>
                <div className="mb-4 text-xs font-semibold text-white">
                  Basic Information
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
                        onChange={(e) =>
                          update(
                            "name",
                            e.target.value
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
                        onChange={(e) =>
                          update(
                            "nickname",
                            e.target.value
                          )
                        }
                        placeholder="Nickname"
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
                      Role
                    </FieldLabel>

                    {editable ? (
                      <Select
                        value={
                          form.role
                        }
                        onChange={(e) =>
                          update(
                            "role",
                            e.target
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
                      </Select>
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
                      <Select
                        value={
                          form.status
                        }
                        onChange={(e) =>
                          update(
                            "status",
                            e.target
                              .value as MemberStatus
                          )
                        }
                      >
                        <option value="active">
                          Active
                        </option>
                        <option value="inactive">
                          Inactive
                        </option>
                        <option value="on_leave">
                          On Leave
                        </option>
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
                        onChange={(e) =>
                          update(
                            "gender",
                            e.target
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
                        onChange={(e) =>
                          update(
                            "section",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Praise Team"
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

              {/* MUSIC */}

              <section>
                <div className="mb-4 text-xs font-semibold text-white">
                  Music Assignment
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
                        onChange={(e) =>
                          update(
                            "instrument",
                            e.target.value
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
                        onChange={(e) =>
                          update(
                            "instrumentCategory",
                            e.target
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
                      </Select>
                    ) : (
                      <div className="text-sm text-white/60">
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
                        onChange={(e) =>
                          update(
                            "voicePart",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Soprano, Alto, Tenor"
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
                        onChange={(e) =>
                          update(
                            "ministry",
                            e.target.value
                          )
                        }
                        placeholder="Ministry / team"
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

              {/* CONTACT */}

              <section>
                <div className="mb-4 text-xs font-semibold text-white">
                  Contact
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>
                      Phone
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.phone ||
                          ""
                        }
                        onChange={(e) =>
                          update(
                            "phone",
                            e.target.value
                          )
                        }
                        placeholder="+233..."
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
                        type="email"
                        value={
                          form.email ||
                          ""
                        }
                        onChange={(e) =>
                          update(
                            "email",
                            e.target.value
                          )
                        }
                        placeholder="member@email.com"
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

              {/* EMERGENCY */}

              <section>
                <div className="mb-4 text-xs font-semibold text-white">
                  Emergency Contact
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>
                      Contact Name
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.emergencyContact ||
                          ""
                        }
                        onChange={(e) =>
                          update(
                            "emergencyContact",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <div className="text-sm text-white/60">
                        {form.emergencyContact ||
                          "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <FieldLabel>
                      Contact Phone
                    </FieldLabel>

                    {editable ? (
                      <Input
                        value={
                          form.emergencyPhone ||
                          ""
                        }
                        onChange={(e) =>
                          update(
                            "emergencyPhone",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <div className="text-sm text-white/60">
                        {form.emergencyPhone ||
                          "—"}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* AVAILABILITY */}

              <section>
                <div className="mb-4 text-xs font-semibold text-white">
                  Availability
                </div>

                <div className="flex flex-wrap gap-2">
                  {WEEK_DAYS.map(
                    (day) => {
                      const active =
                        (
                          form.availability ||
                          []
                        ).includes(
                          day
                        );

                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={
                            !editable
                          }
                          onClick={() =>
                            toggleDay(
                              day
                            )
                          }
                          className={`rounded-xl border px-3 py-2 text-[10px] transition ${
                            active
                              ? "border-white/20 bg-white/10 text-white"
                              : "border-white/[0.07] bg-white/[0.025] text-white/30"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    }
                  )}
                </div>

                {editable && (
                  <label className="mt-4 flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={
                        form.isAvailable !==
                        false
                      }
                      onChange={(e) =>
                        update(
                          "isAvailable",
                          e.target.checked
                        )
                      }
                    />

                    <span className="text-xs text-white/50">
                      Currently available
                    </span>
                  </label>
                )}
              </section>

              {/* SKILLS */}

              <section>
                <div className="mb-4 text-xs font-semibold text-white">
                  Skills
                </div>

                {editable && (
                  <div className="flex gap-2">
                    <Input
                      value={skill}
                      onChange={(e) =>
                        setSkill(
                          e.target.value
                        )
                      }
                      placeholder="Add skill"
                    />

                    <button
                      type="button"
                      onClick={
                        addSkill
                      }
                      className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-4 text-black"
                    >
                      <Icon
                        name="plus"
                        size={15}
                      />
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
                        key={item}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[10px] text-white/50"
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
                            className="text-white/20 hover:text-white"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    )
                  )}
                </div>
              </section>

              {/* NOTES */}

              <section>
                <div className="mb-4 text-xs font-semibold text-white">
                  Notes
                </div>

                {editable ? (
                  <Textarea
                    value={
                      form.notes ||
                      ""
                    }
                    onChange={(e) =>
                      update(
                        "notes",
                        e.target.value
                      )
                    }
                    placeholder="Additional notes about this member..."
                  />
                ) : (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-sm leading-6 text-white/45">
                    {form.notes ||
                      "No notes added."}
                  </div>
                )}
              </section>

              {/* CONTROLS */}

              {editable && (
                <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={
                          Boolean(
                            form.isLeader
                          )
                        }
                        onChange={(e) =>
                          update(
                            "isLeader",
                            e.target
                              .checked
                          )
                        }
                      />

                      <span className="text-xs text-white/50">
                        Team leader
                      </span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={
                          Boolean(
                            form.isFeatured
                          )
                        }
                        onChange={(e) =>
                          update(
                            "isFeatured",
                            e.target
                              .checked
                          )
                        }
                      />

                      <span className="text-xs text-white/50">
                        Featured member
                      </span>
                    </label>
                  </div>
                </section>
              )}
            </div>
          </div>

          {editable && (
            <div className="flex items-center justify-end gap-3 border-t border-white/[0.07] px-6 py-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-xs text-white/40 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
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
  onCancel,
  onConfirm,
}: {
  member: TeamMember;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
    <div className="w-full max-w-md rounded-[26px] border border-white/[0.09] bg-[#101113] p-6 shadow-2xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <Icon
          name="trash"
          size={19}
        />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">
        Remove team member?
      </h2>

      <p className="mt-2 text-xs leading-6 text-white/35">
        This will remove{" "}
        <span className="text-white/70">
          {member.name}
        </span>{" "}
        from the Music Team directory.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-xs text-white/40 hover:bg-white/5 hover:text-white"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
        >
          Remove Member
        </button>
      </div>
    </div>
  </div>
);

/* ============================================================
   LIST ROW
   ============================================================ */

const MemberListRow = ({
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
}) => (
  <div className="group flex items-center gap-4 border-b border-white/[0.05] px-5 py-4 transition hover:bg-white/[0.025]">
    <button
      type="button"
      onClick={onView}
      className="shrink-0"
    >
      <Avatar
        member={member}
        size="sm"
      />
    </button>

    <button
      type="button"
      onClick={onView}
      className="min-w-0 flex-1 text-left"
    >
      <div className="truncate text-sm font-medium text-white">
        {member.name}
      </div>

      <div className="mt-1 truncate text-[10px] text-white/25">
        {member.nickname ||
          member.instrument ||
          member.voicePart ||
          "Music Team Member"}
      </div>
    </button>

    <div className="hidden md:block">
      <RoleBadge
        role={member.role}
      />
    </div>

    <div className="hidden sm:block">
      <StatusBadge
        status={member.status}
      />
    </div>

    <div className="flex items-center gap-1">
      {canEdit && (
        <button
          type="button"
          onClick={onFeature}
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
            member.isFeatured
              ? "text-white"
              : "text-white/20 hover:bg-white/5 hover:text-white"
          }`}
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
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-white/25 hover:bg-white/5 hover:text-white"
          >
            <Icon
              name="edit"
              size={14}
            />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-white/20 hover:bg-red-500/10 hover:text-red-400"
          >
            <Icon
              name="trash"
              size={14}
            />
          </button>
        </>
      )}
    </div>
  </div>
);

/* ============================================================
   MAIN COMPONENT
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
  /*
   * CRITICAL:
   *
   * The state initializer loads storage BEFORE the first
   * persistence effect runs.
   *
   * This is what prevents:
   *
   *     [] -> localStorage
   *
   * from destroying an existing team.
   */

  const [
    members,
    setMembers,
  ] = useState<TeamMember[]>(
    () => {
      /*
       * If App already supplies actual members, respect them.
       *
       * An empty prop is deliberately ignored because an empty
       * prop is very often just the initial App state.
       */

      if (
        externalMembers &&
        externalMembers.length >
          0
      ) {
        return dedupeMembers(
          externalMembers.map(
            normalizeMember
          )
        );
      }

      const recovered =
        recoverTeamMembers();

      if (
        recovered.members
          .length > 0
      ) {
        console.info(
          `[MusicTeamView] Recovered team from ${recovered.source}`
        );

        /*
         * Immediately migrate recovered data to the
         * canonical storage key.
         */

        saveMembers(
          recovered.members,
          true
        );

        return recovered.members;
      }

      return [];
    }
  );

  const [
    section,
    setSection,
  ] =
    useState<TeamSection>(
      "all"
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    sortMode,
    setSortMode,
  ] =
    useState<SortMode>(
      "name"
    );

  const [
    viewMode,
    setViewMode,
  ] =
    useState<ViewMode>(
      "grid"
    );

  const [
    modalMode,
    setModalMode,
  ] =
    useState<ModalMode>(
      null
    );

  const [
    selectedMember,
    setSelectedMember,
  ] =
    useState<TeamMember | null>(
      null
    );

  const [
    deleteMember,
    setDeleteMember,
  ] =
    useState<TeamMember | null>(
      null
    );

  const [
    toasts,
    setToasts,
  ] = useState<Toast[]>(
    []
  );

  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  const [
    hasInitialized,
    setHasInitialized,
  ] = useState(false);

  /*
   * If App supplied actual members at mount, App is considered
   * the initial source.
   *
   * If App supplied [] we use local storage as the source.
   */
  const externalSource =
    React.useRef(
      Boolean(
        externalMembers &&
          externalMembers.length >
            0
      )
    );

  const userRole =
    activeRole ||
    currentRole ||
    role ||
    getStoredRole();

  const canEdit =
    !readOnly &&
    isMD(userRole);

  /* ==========================================================
     INITIALIZATION
     ========================================================== */

  useEffect(() => {
    setHasInitialized(
      true
    );
  }, []);

  /* ==========================================================
     EXTERNAL MEMBERS
     ========================================================== */

  useEffect(() => {
    /*
     * Only synchronize external members if the parent actually
     * supplied a real directory.
     *
     * Empty [] from App is ignored.
     */

    if (
      !externalSource.current
    ) {
      return;
    }

    if (
      !externalMembers ||
      externalMembers.length ===
        0
    ) {
      return;
    }

    const normalized =
      dedupeMembers(
        externalMembers.map(
          normalizeMember
        )
      );

    setMembers(
      normalized
    );
  }, [
    externalMembers,
  ]);

  /* ==========================================================
     PERSISTENCE
     ========================================================== */

  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    /*
     * We save after hydration.
     *
     * Empty arrays are allowed ONLY after the component has
     * actually been initialized. This means a real user deletion
     * can eventually remove all members.
     */

    saveMembers(
      members,
      false
    );

    onMembersChange?.(
      members
    );
  }, [
    members,
    hasInitialized,
    onMembersChange,
  ]);

  /* ==========================================================
     TOAST
     ========================================================== */

  const showToast = (
    type: ToastType,
    title: string,
    message?: string
  ) => {
    const id = createId();

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
              (item) =>
                item.id !== id
            )
        );
      },
      3500
    );
  };

  /* ==========================================================
     FILTERING
     ========================================================== */

  const filteredMembers =
    useMemo(() => {
      let result =
        [...members];

      if (
        section ===
        "vocalists"
      ) {
        result =
          result.filter(
            (member) =>
              member.role ===
                "lead_vocalist" ||
              member.role ===
                "backing_vocalist" ||
              member.instrumentCategory ===
                "vocals"
          );
      }

      if (
        section ===
        "instrumentalists"
      ) {
        result =
          result.filter(
            (member) =>
              member.role ===
                "instrumentalist"
          );
      }

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (member) => {
              const haystack =
                [
                  member.name,
                  member.nickname,
                  member.role,
                  member.instrument,
                  member.voicePart,
                  member.section,
                  member.ministry,
                  member.email,
                  member.phone,
                  ...(member.skills ||
                    []),
                ]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase();

              return haystack.includes(
                query
              );
            }
          );
      }

      result.sort(
        (a, b) => {
          if (
            sortMode ===
            "name"
          ) {
            return a.name.localeCompare(
              b.name
            );
          }

          if (
            sortMode ===
            "role"
          ) {
            return ROLE_LABELS[
              a.role
            ].localeCompare(
              ROLE_LABELS[
                b.role
              ]
            );
          }

          if (
            sortMode ===
            "status"
          ) {
            return STATUS_LABELS[
              a.status
            ].localeCompare(
              STATUS_LABELS[
                b.status
              ]
            );
          }

          if (
            sortMode ===
            "joined"
          ) {
            return (
              new Date(
                a.joinedAt
              ).getTime() -
              new Date(
                b.joinedAt
              ).getTime()
            );
          }

          return (
            new Date(
              b.updatedAt
            ).getTime() -
            new Date(
              a.updatedAt
            ).getTime()
          );
        }
      );

      return result;
    }, [
      members,
      section,
      search,
      sortMode,
      refreshKey,
    ]);

  /* ==========================================================
     ACTIONS
     ========================================================== */

  const openCreate = () => {
    if (!canEdit) {
      showToast(
        "warning",
        "View only",
        "Only the Music Director can add team members."
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

  const openView = (
    member: TeamMember
  ) => {
    setSelectedMember(
      member
    );

    setModalMode(
      "view"
    );
  };

  const openEdit = (
    member: TeamMember
  ) => {
    if (!canEdit) {
      showToast(
        "warning",
        "View only",
        "Only the Music Director can edit team members."
      );
      return;
    }

    setSelectedMember(
      member
    );

    setModalMode(
      "edit"
    );
  };

  const handleSave = (
    incoming: TeamMember
  ) => {
    if (!canEdit) {
      return;
    }

    const normalized =
      normalizeMember(
        incoming
      );

    if (
      modalMode ===
      "create"
    ) {
      setMembers(
        (previous) => [
          ...previous,
          normalized,
        ]
      );

      showToast(
        "success",
        "Member added",
        `${normalized.name} has been added to the music team.`
      );
    } else {
      setMembers(
        (previous) =>
          previous.map(
            (member) =>
              member.id ===
              normalized.id
                ? normalized
                : member
          )
      );

      showToast(
        "success",
        "Member updated",
        `${normalized.name}'s profile has been updated.`
      );
    }

    setModalMode(
      null
    );

    setSelectedMember(
      null
    );
  };

  const handleDelete =
    () => {
      if (
        !canEdit ||
        !deleteMember
      ) {
        return;
      }

      const id =
        deleteMember.id;

      setMembers(
        (previous) =>
          previous.filter(
            (member) =>
              member.id !== id
          )
      );

      showToast(
        "success",
        "Member removed",
        `${deleteMember.name} was removed from the team.`
      );

      setDeleteMember(
        null
      );
    };

  const toggleFeatured =
    (member: TeamMember) => {
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
     REFRESH / RECOVERY
     ========================================================== */

  const recoverNow =
    () => {
      const recovered =
        recoverTeamMembers();

      if (
        recovered.members
          .length === 0
      ) {
        showToast(
          "info",
          "No saved directory found",
          "No team members were found in the supported storage locations."
        );
        return;
      }

      setMembers(
        recovered.members
      );

      saveMembers(
        recovered.members,
        true
      );

      setRefreshKey(
        (value) =>
          value + 1
      );

      showToast(
        "success",
        "Team recovered",
        `${recovered.members.length} member(s) recovered from ${recovered.source}.`
      );
    };

  /* ==========================================================
     EXPORT
     ========================================================== */

  const exportMembers =
    () => {
      if (
        members.length ===
        0
      ) {
        showToast(
          "info",
          "Nothing to export",
          "There are no team members to export."
        );
        return;
      }

      const payload =
        JSON.stringify(
          members,
          null,
          2
        );

      const blob =
        new Blob(
          [payload],
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

      anchor.href = url;
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

      showToast(
        "success",
        "Team exported",
        "The Music Team directory has been downloaded."
      );
    };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="min-h-full bg-black text-white">
      {/* ================================================
          HEADER
          ================================================ */}

      <div className="border-b border-white/[0.06] bg-[#090a0b]">
        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
                <span>
                  Jewels Music Hub
                </span>

                <span className="text-white/10">
                  /
                </span>

                <span>
                  Music Team
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Music Team
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                Manage the members,
                vocalists and
                instrumentalists
                of the Jewels music
                team.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={
                  recoverNow
                }
                className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 text-xs text-white/50 transition hover:bg-white/[0.06] hover:text-white"
              >
                <Icon
                  name="refresh"
                  size={14}
                />
                Recover
              </button>

              <button
                type="button"
                onClick={
                  exportMembers
                }
                className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 text-xs text-white/50 transition hover:bg-white/[0.06] hover:text-white"
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
                  className="flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-black transition hover:bg-white/90"
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

          {/* MD ACCESS INDICATOR */}

          <div className="mt-6 flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] ${
                canEdit
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                  : "border-white/[0.07] bg-white/[0.025] text-white/30"
              }`}
            >
              <Icon
                name={
                  canEdit
                    ? "shield"
                    : "lock"
                }
                size={11}
              />

              {canEdit
                ? "MD editing enabled"
                : "View only"}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================
          CONTENT
          ================================================ */}

      <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8">
        {/* CATEGORY */}

        <CategorySelector
          selected={section}
          onSelect={
            setSection
          }
        />

        {/* TOOLBAR */}

        <div className="mt-6 rounded-[22px] border border-white/[0.07] bg-[#101113] p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Icon
                name="search"
                size={15}
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target
                      .value
                  )
                }
                placeholder="Search by name, role, instrument, voice, section..."
                className="h-11 w-full rounded-xl border border-transparent bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none placeholder:text-white/20 focus:border-white/[0.08]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex h-11 items-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-3">
                <Icon
                  name="filter"
                  size={14}
                />

                <select
                  value={
                    sortMode
                  }
                  onChange={(e) =>
                    setSortMode(
                      e.target
                        .value as SortMode
                    )
                  }
                  className="ml-2 bg-transparent text-xs text-white/50 outline-none"
                >
                  <option
                    value="name"
                    className="bg-[#111214]"
                  >
                    Name
                  </option>

                  <option
                    value="role"
                    className="bg-[#111214]"
                  >
                    Role
                  </option>

                  <option
                    value="status"
                    className="bg-[#111214]"
                  >
                    Status
                  </option>

                  <option
                    value="joined"
                    className="bg-[#111214]"
                  >
                    Joined
                  </option>

                  <option
                    value="recent"
                    className="bg-[#111214]"
                  >
                    Recently Updated
                  </option>
                </select>
              </div>

              <div className="flex h-11 items-center rounded-xl border border-white/[0.07] bg-white/[0.025] p-1">
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
            </div>
          </div>
        </div>

        {/* DIRECTORY */}

        <div className="mt-6">
          {filteredMembers.length >
          0 ? (
            viewMode ===
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
                        setDeleteMember(
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
                        setDeleteMember(
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
            )
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/[0.08] bg-[#0d0e0f] px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] text-white/25">
                <Icon
                  name={
                    members.length >
                    0
                      ? "search"
                      : "users"
                  }
                  size={24}
                />
              </div>

              <h2 className="mt-5 text-base font-semibold text-white">
                {members.length >
                0
                  ? "No matching members"
                  : "No team members found"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-white/25">
                {members.length >
                0
                  ? "Try changing your search or category filter."
                  : "The directory is currently empty. If members existed before, use Recover to search the saved Music Team data."}
              </p>

              <div className="mt-6 flex justify-center gap-2">
                {members.length >
                0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch(
                        ""
                      );
                      setSection(
                        "all"
                      );
                    }}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs text-white/50 hover:bg-white/[0.06] hover:text-white"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={
                        recoverNow
                      }
                      className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs text-white/50 hover:bg-white/[0.06] hover:text-white"
                    >
                      Recover Saved Team
                    </button>

                    {canEdit && (
                      <button
                        type="button"
                        onClick={
                          openCreate
                        }
                        className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black"
                      >
                        Add Member
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================================================
          MODALS
          ================================================ */}

      {modalMode &&
        selectedMember && (
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
              setModalMode(
                null
              );
              setSelectedMember(
                null
              );
            }}
            onSave={
              handleSave
            }
          />
        )}

      {deleteMember && (
        <DeleteModal
          member={
            deleteMember
          }
          onCancel={() =>
            setDeleteMember(
              null
            )
          }
          onConfirm={
            handleDelete
          }
        />
      )}

      {/* ================================================
          TOASTS
          ================================================ */}

      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex flex-col gap-3">
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
                setToasts(
                  (previous) =>
                    previous.filter(
                      (item) =>
                        item.id !==
                        toast.id
                    )
                )
              }
            />
          )
        )}
      </div>
    </div>
  );
};

export default MusicTeamView;
