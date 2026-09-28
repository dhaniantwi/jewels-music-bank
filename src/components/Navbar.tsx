```tsx
import React from 'react';

import {
  ActiveTab,
  ActiveRole,
  TeamMember,
} from '../types';

import {
  Radio,
  Wrench,
  ChevronDown,
  Home,
  Music2,
  ClipboardList,
  Users,
  ShieldCheck,
  Globe2,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeRole: ActiveRole;
  onOpenMDLogin: () => void;
  team: TeamMember[];
  songsCount: number;
  openToolsModal: () => void;
  openStageMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  onOpenMDLogin,
  team,
  songsCount,
  openToolsModal,
  openStageMode,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] =
    React.useState(false);

  const dropdownRef =
    React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setRoleDropdownOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const isMD = activeRole === 'admin_md';

  const roleOptions: {
    id: ActiveRole;
    label: string;
    desc: string;
    badge: string;
  }[] = [
    {
      id: 'admin_md',
      label: 'Daniel Antwi',
      desc: 'Music Director & Lead Admin (Full Control)',
      badge: 'MD & Admin',
    },
    {
      id: 'vocal_member',
      label: 'Priscilla Mensah',
      desc: 'Vocal Team Member (View & Rehearse)',
      badge: 'Vocalist',
    },
    {
      id: 'instrumentalist',
      label: 'Joshua Boateng',
      desc: 'Instrumentalist / Band Member',
      badge: 'Band',
    },
    {
      id: 'guest',
      label: 'Choir / Church Member',
      desc: 'Read-only viewer mode',
      badge: 'Viewer',
    },
  ];

  const currentRoleObj =
    roleOptions.find(
      role => role.id === activeRole
    ) || roleOptions[0];

  const navButtonBase = `
    flex
    shrink-0
    items-center
    justify-center
    gap-1.5
    rounded-xl
    border
    px-2.5
    py-2
    text-xs
    font-semibold
    transition-all
    duration-200
    active:scale-[0.98]
  `;

  const navButtonInactive = `
    ${navButtonBase}
    border-white/[0.06]
    bg-white/[0.025]
    text-white/45
    hover:border-white/10
    hover:bg-white/[0.07]
    hover:text-white/80
  `;

  const navButtonActive = `
    ${navButtonBase}
    border-[#007aff]/25
    bg-[#007aff]/12
    text-[#4da3ff]
    shadow-[inset_0_0_20px_rgba(0,122,255,0.04)]
  `;

  return (
    <header
      className="
        sticky
        top-3
        z-40
        mb-4
        w-full
        min-w-0
        max-w-full
        px-2
        sm:px-5
        no-print
      "
    >
      <nav
        className="
          mx-auto
          w-full
          max-w-7xl
          overflow-x-auto
          overflow-y-visible
          rounded-[24px]
          border
          border-white/[0.08]
          bg-[#101012]/90
          p-1.5
          shadow-[0_18px_50px_rgba(0,0,0,0.24)]
          backdrop-blur-2xl
          scrollbar-hide
        "
      >
        <div
          className="
            flex
            min-w-max
            items-center
            gap-1.5
            sm:w-full
            sm:min-w-0
            sm:gap-2
          "
        >

          {/* =====================================================
              BRAND
          ====================================================== */}

          <button
            type="button"
            onClick={() => setActiveTab('home')}
            aria-label="Jewels Music Hub"
            className="
              group
              flex
              shrink-0
              items-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.025]
              p-1.5
              text-left
              transition-all
              duration-200
              hover:border-white/10
              hover:bg-white/[0.06]
              sm:gap-2.5
              sm:px-2
              sm:py-1.5
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#007aff]/20
                bg-[#007aff]/10
                text-[#4da3ff]
                transition-all
                duration-200
                group-hover:bg-[#007aff]/15
                sm:h-9
                sm:w-9
              "
            >
              <Music2 className="h-4.5 w-4.5" />
            </div>

            <div className="hidden sm:block">
              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[14px]
                  font-extrabold
                  leading-tight
                  tracking-tight
                  text-white
                "
              >
                Jewels Music Hub

                <span
                  className="
                    rounded-full
                    border
                    border-[#007aff]/20
                    bg-[#007aff]/10
                    px-1.5
                    py-0.5
                    text-[8px]
                    font-extrabold
                    uppercase
                    tracking-wider
                    text-[#4da3ff]
                  "
                >
                  Portal
                </span>
              </div>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  leading-none
                  text-white/30
                "
              >
                Music Ministry Management
              </p>
            </div>
          </button>

          {/* =====================================================
              MAIN NAVIGATION
          ====================================================== */}

          <div
            className="
              flex
              min-w-max
              shrink-0
              items-center
              gap-0.5
              rounded-xl
              border
              border-white/[0.06]
              bg-black/20
              p-1
              sm:gap-1
            "
          >

            {/* HOME */}

            <button
              type="button"
              onClick={() => setActiveTab('home')}
              aria-label="Home"
              title="Home"
              className={
                activeTab === 'home'
                  ? navButtonActive
                  : navButtonInactive
              }
            >
              <Home className="h-3.5 w-3.5 shrink-0" />

              <span className="hidden md:inline">
                Home
              </span>
            </button>

            {/* SONG BANK */}

            <button
              type="button"
              onClick={() => setActiveTab('songs')}
              aria-label="Song Bank"
              title="Song Bank"
              className={
                activeTab === 'songs'
                  ? navButtonActive
                  : navButtonInactive
              }
            >
              <Music2 className="h-3.5 w-3.5 shrink-0" />

              <span className="hidden sm:inline">
                Song Bank
              </span>

              <span
                className="
                  min-w-[20px]
                  rounded-full
                  border
                  border-[#007aff]/15
                  bg-[#007aff]/10
                  px-1.5
                  py-0.5
                  text-center
                  text-[9px]
                  font-bold
                  text-[#4da3ff]
                "
              >
                {songsCount}
              </span>
            </button>

            {/* MINISTRATIONS */}

            <button
              type="button"
              onClick={() =>
                setActiveTab('ministrations')
              }
              aria-label="Ministrations"
              title="Ministrations"
              className={
                activeTab === 'ministrations'
                  ? navButtonActive
                  : navButtonInactive
              }
            >
              <ClipboardList className="h-3.5 w-3.5 shrink-0" />

              <span className="hidden lg:inline">
                Ministrations
              </span>
            </button>

            {/* MUSIC TEAM */}

            <button
              type="button"
              onClick={() => setActiveTab('team')}
              aria-label="Music Team"
              title="Music Team"
              className={
                activeTab === 'team'
                  ? navButtonActive
                  : navButtonInactive
              }
            >
              <Users className="h-3.5 w-3.5 shrink-0" />

              <span className="hidden lg:inline">
                Music Team
              </span>

              <span
                className="
                  min-w-[20px]
                  rounded-full
                  border
                  border-white/[0.06]
                  bg-white/[0.035]
                  px-1.5
                  py-0.5
                  text-center
                  text-[9px]
                  font-bold
                  text-white/45
                "
              >
                {team.length}
              </span>
            </button>
          </div>

          {/* =====================================================
              RIGHT ACTIONS
          ====================================================== */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1
              sm:ml-auto
              sm:gap-1.5
            "
          >

            {/* TOOLS */}

            <button
              type="button"
              onClick={openToolsModal}
              title="Music Director Rehearsal Tools"
              aria-label="Tools"
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                text-white/65
                transition-all
                duration-200
                hover:border-white/10
                hover:bg-white/[0.07]
                hover:text-white
                active:scale-[0.97]
                sm:h-9
                sm:w-auto
                sm:gap-1.5
                sm:px-3
              "
            >
              <Wrench
                className="
                  h-3.5
                  w-3.5
                  shrink-0
                  text-[#4da3ff]
                "
              />

              <span className="hidden lg:inline">
                Tools
              </span>
            </button>

            {/* STAGE VIEW */}

            <button
              type="button"
              onClick={openStageMode}
              title="Launch Stage & Live Rehearsal Mode"
              aria-label="Stage View"
              className="
                group
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#007aff]/30
                bg-[#007aff]
                text-xs
                font-bold
                text-white
                shadow-[0_8px_24px_rgba(0,122,255,0.22)]
                transition-all
                duration-200
                hover:bg-[#006ee6]
                hover:shadow-[0_10px_30px_rgba(0,122,255,0.30)]
                active:scale-[0.97]
                sm:h-9
                sm:w-auto
                sm:gap-1.5
                sm:px-3
              "
            >
              <Radio className="h-3.5 w-3.5 shrink-0" />

              <span className="hidden md:inline">
                Stage View
              </span>
            </button>

            {/* =================================================
                ROLE SWITCHER
            ================================================== */}

            <div
              className="relative shrink-0"
              ref={dropdownRef}
            >
              <button
                type="button"
                onClick={() =>
                  setRoleDropdownOpen(
                    !roleDropdownOpen
                  )
                }
                aria-label="Role switcher"
                title="Role switcher"
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  text-xs
                  font-semibold
                  transition-all
                  duration-200
                  active:scale-[0.97]
                  sm:h-9
                  sm:w-auto
                  sm:gap-1.5
                  sm:px-3

                  ${
                    isMD
                      ? `
                        border-amber-400/15
                        bg-amber-400/10
                        text-amber-300
                        hover:border-amber-400/25
                        hover:bg-amber-400/15
                      `
                      : `
                        border-white/[0.06]
                        bg-white/[0.025]
                        text-white/50
                        hover:border-white/10
                        hover:bg-white/[0.07]
                        hover:text-white/80
                      `
                  }
                `}
              >
                <ShieldCheck
                  className={`
                    h-3.5
                    w-3.5
                    shrink-0
                    ${
                      isMD
                        ? 'text-amber-300'
                        : 'text-white/40'
                    }
                  `}
                />

                <span
                  className="
                    hidden
                    max-w-[110px]
                    truncate
                    xl:inline
                  "
                >
                  {currentRoleObj.label}
                </span>

                <span
                  className="
                    hidden
                    rounded-full
                    border
                    border-white/[0.06]
                    bg-white/[0.035]
                    px-1.5
                    py-0.5
                    text-[9px]
                    font-bold
                    text-white/45
                    sm:inline
                  "
                >
                  {currentRoleObj.badge}
                </span>

                <ChevronDown
                  className="
                    hidden
                    h-3
                    w-3
                    text-white/30
                    sm:inline
                  "
                />
              </button>

              {/* =================================================
                  ROLE DROPDOWN
              ================================================== */}

              {roleDropdownOpen && (
                <div
                  className="
                    absolute
                    right-0
                    z-50
                    mt-2
                    w-72
                    max-w-[calc(100vw-1rem)]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-[#151517]/95
                    p-1.5
                    shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                    backdrop-blur-2xl
                  "
                >
                  <div
                    className="
                      mb-1
                      border-b
                      border-white/[0.07]
                      px-3
                      py-2.5
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-[0.16em]
                        text-white/30
                      "
                    >
                      Role & Permission Switcher
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-[11px]
                        font-medium
                        leading-relaxed
                        text-white/65
                      "
                    >
                      {isMD
                        ? 'You have full MD Admin rights to add songs, assign vocalists, and edit members.'
                        : 'Restricted Mode: Changes require MD permission.'
                      }
                    </p>
                  </div>

                  <div className="space-y-1">

                    {/* GENERAL HUB */}

                    <button
                      type="button"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5
                        rounded-xl
                        border
                        border-white/[0.05]
                        bg-white/[0.025]
                        p-2.5
                        text-left
                        text-xs
                        font-medium
                        text-white/75
                        transition-all
                        duration-200
                        hover:border-white/10
                        hover:bg-white/[0.07]
                        hover:text-white
                      "
                    >
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-[#007aff]/15
                          bg-[#007aff]/10
                        "
                      >
                        <Globe2
                          className="
                            h-4
                            w-4
                            text-[#4da3ff]
                          "
                        />
                      </div>

                      <div>
                        <p className="leading-tight">
                          General Music Hub
                        </p>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            font-normal
                            text-white/30
                          "
                        >
                          Browse, listen & rehearse
                        </p>
                      </div>
                    </button>

                    {/* MD ADMIN */}

                    <button
                      type="button"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenMDLogin();
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5
                        rounded-xl
                        border
                        border-amber-400/15
                        bg-amber-400/[0.08]
                        p-2.5
                        text-left
                        text-xs
                        font-medium
                        text-amber-200
                        transition-all
                        duration-200
                        hover:border-amber-400/25
                        hover:bg-amber-400/[0.12]
                      "
                    >
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-amber-400/15
                          bg-amber-400/10
                        "
                      >
                        <ShieldCheck
                          className="
                            h-4
                            w-4
                            text-amber-300
                          "
                        />
                      </div>

                      <div>
                        <p className="leading-tight">
                          MD Admin Portal
                        </p>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            font-normal
                            text-amber-300/50
                          "
                        >
                          Authorized MD access only
                        </p>
                      </div>
                    </button>

                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
};
```
