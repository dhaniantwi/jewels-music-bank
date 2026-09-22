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

  const navButtonBase =
    'flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors';

  const navButtonInactive =
    `${navButtonBase} border-white/5 bg-white/[0.035] text-white/55 hover:bg-white/[0.08]`;

  const navButtonActive =
    `${navButtonBase} border-[#007aff]/30 bg-[#007aff]/15 text-[#4da3ff]`;

  return (
    <header
      className="
        sticky
        top-3
        z-40
        mb-4
        w-full
        px-3
        sm:px-6
        no-print
      "
    >

      <nav
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          gap-2
          rounded-[28px]
          border
          border-white/10
          bg-[#111113]/90
          p-2
          backdrop-blur-2xl
        "
      >

        {/* BRAND */}

        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="
            flex
            items-center
            gap-2.5
            rounded-2xl
            border
            border-white/5
            bg-white/[0.035]
            px-2.5
            py-2
            text-left
            transition-colors
            hover:bg-white/[0.08]
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-white/10
              bg-[#007aff]/15
              text-[#4da3ff]
            "
          >
            <Music2 className="h-5 w-5" />
          </div>

          <div className="hidden sm:block">

            <div
              className="
                flex
                items-center
                gap-1.5
                text-[15px]
                font-bold
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
                  bg-[#007aff]/15
                  px-1.5
                  py-0.5
                  text-[9px]
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
                text-[11px]
                leading-none
                text-white/40
              "
            >
              Music Ministry Management
            </p>

          </div>

        </button>


        {/* NAVIGATION */}

        <div
          className="
            flex
            items-center
            gap-1
            rounded-2xl
            border
            border-white/10
            bg-white/[0.045]
            p-1
          "
        >

          {/* HOME */}

          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={
              activeTab === 'home'
                ? navButtonActive
                : navButtonInactive
            }
          >
            <Home className="h-3.5 w-3.5" />

            <span className="hidden md:inline">
              Home
            </span>
          </button>


          {/* SONG BANK */}

          <button
            type="button"
            onClick={() => setActiveTab('songs')}
            className={
              activeTab === 'songs'
                ? navButtonActive
                : navButtonInactive
            }
          >
            <Music2 className="h-3.5 w-3.5" />

            <span>
              Song Bank
            </span>

            <span
              className="
                rounded-full
                border
                border-[#007aff]/20
                bg-[#007aff]/15
                px-1.5
                py-0.5
                text-[10px]
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
            className={
              activeTab === 'ministrations'
                ? navButtonActive
                : navButtonInactive
            }
          >
            <ClipboardList className="h-3.5 w-3.5" />

            <span className="hidden lg:inline">
              Ministrations
            </span>
          </button>


          {/* MUSIC TEAM */}

          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={
              activeTab === 'team'
                ? navButtonActive
                : navButtonInactive
            }
          >
            <Users className="h-3.5 w-3.5" />

            <span className="hidden lg:inline">
              Music Team
            </span>

            <span
              className="
                rounded-full
                border
                border-white/5
                bg-white/[0.035]
                px-1.5
                py-0.5
                text-[10px]
                font-bold
                text-white/55
              "
            >
              {team.length}
            </span>
          </button>

        </div>


        {/* RIGHT ACTIONS */}

        <div
          className="
            flex
            items-center
            gap-1.5
            sm:gap-2
          "
        >

          {/* TOOLS */}

          <button
            type="button"
            onClick={openToolsModal}
            title="Music Director Rehearsal Tools"
            className="
              flex
              h-10
              items-center
              gap-1.5
              rounded-2xl
              border
              border-white/5
              bg-white/[0.035]
              px-2.5
              text-xs
              font-semibold
              text-white/80
              transition-colors
              hover:bg-white/[0.08]
              sm:px-3
            "
          >
            <Wrench
              className="
                h-3.5
                w-3.5
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
            className="
              flex
              h-10
              items-center
              gap-1.5
              rounded-2xl
              bg-[#007aff]
              px-3
              text-xs
              font-semibold
              text-white
              shadow-xl
              shadow-blue-500/20
              transition-colors
              hover:bg-[#0062cc]
              active:scale-95
            "
          >
            <Radio className="h-3.5 w-3.5" />

            <span className="hidden md:inline">
              Stage View
            </span>
          </button>


          {/* ROLE SWITCHER */}

          <div
            className="relative"
            ref={dropdownRef}
          >

            <button
              type="button"
              onClick={() =>
                setRoleDropdownOpen(
                  !roleDropdownOpen
                )
              }
              className={`
                flex
                h-10
                items-center
                gap-1.5
                rounded-2xl
                border
                px-2.5
                text-xs
                font-semibold
                transition-colors
                sm:px-3

                ${
                  isMD
                    ? `
                      border-amber-500/20
                      bg-amber-500/15
                      text-amber-300
                      hover:bg-amber-500/20
                    `
                    : `
                      border-white/5
                      bg-white/[0.035]
                      text-white/55
                      hover:bg-white/[0.08]
                    `
                }
              `}
            >

              <ShieldCheck
                className={`
                  h-3.5
                  w-3.5
                  ${
                    isMD
                      ? 'text-amber-300'
                      : 'text-white/45'
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
                  rounded-full
                  border
                  border-white/5
                  bg-white/[0.035]
                  px-1.5
                  py-0.5
                  text-[10px]
                  text-white/55
                "
              >
                {currentRoleObj.badge}
              </span>

              <ChevronDown
                className="
                  h-3
                  w-3
                  text-white/40
                "
              />

            </button>


            {/* ROLE DROPDOWN */}

            {roleDropdownOpen && (
              <div
                className="
                  absolute
                  right-0
                  z-50
                  mt-2
                  w-72
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#1c1c1f]/95
                  p-2
                  backdrop-blur-2xl
                "
              >

                <div
                  className="
                    mb-1
                    border-b
                    border-white/10
                    px-3
                    py-2
                  "
                >

                  <p
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-white/40
                    "
                  >
                    Role & Permission Switcher
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-medium
                      leading-relaxed
                      text-white/80
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
                      rounded-2xl
                      border
                      border-white/5
                      bg-white/[0.035]
                      p-2.5
                      text-left
                      text-xs
                      font-medium
                      text-white/80
                      transition-colors
                      hover:bg-white/[0.08]
                    "
                  >

                    <Globe2
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-[#4da3ff]
                      "
                    />

                    <div>

                      <p className="leading-tight">
                        General Music Hub
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          font-normal
                          text-white/40
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
                      rounded-2xl
                      border
                      border-amber-500/20
                      bg-amber-500/15
                      p-2.5
                      text-left
                      text-xs
                      font-medium
                      text-amber-200
                      transition-colors
                      hover:bg-amber-500/20
                    "
                  >

                    <ShieldCheck
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-amber-300
                      "
                    />

                    <div>

                      <p className="leading-tight">
                        MD Admin Portal
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          font-normal
                          text-amber-300/60
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

      </nav>

    </header>
  );
};
