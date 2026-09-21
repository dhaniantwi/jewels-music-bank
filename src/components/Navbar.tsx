import React from 'react';
import {
  ActiveTab,
  ActiveRole,
  TeamMember
} from '../types';
import {
  Radio,
  Wrench,
  ChevronDown
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
    icon: string;
    badge: string;
  }[] = [
    {
      id: 'admin_md',
      label: 'Daniel Antwi',
      desc: 'Music Director & Lead Admin (Full Control)',
      icon: '🎼',
      badge: 'MD & Admin'
    },
    {
      id: 'vocal_member',
      label: 'Priscilla Mensah',
      desc: 'Vocal Team Member (View & Rehearse)',
      icon: '🎤',
      badge: 'Vocalist'
    },
    {
      id: 'instrumentalist',
      label: 'Joshua Boateng',
      desc: 'Instrumentalist / Band Member',
      icon: '🎹',
      badge: 'Band'
    },
    {
      id: 'guest',
      label: 'Choir / Church Member',
      desc: 'Read-only viewer mode',
      icon: '👤',
      badge: 'Viewer'
    }
  ];

  const currentRoleObj =
    roleOptions.find(
      r => r.id === activeRole
    ) || roleOptions[0];

  return (
    <header className="sticky top-3 z-40 w-full px-3 sm:px-6 max-w-7xl mx-auto mb-4 no-print">

      <nav
        className="
          bg-white/[0.045]
          backdrop-blur-2xl
          border border-white/10
          rounded-[26px]
          p-2 sm:p-2.5
          flex items-center justify-between
          gap-2
          shadow-2xl
          shadow-black/30
        "
      >

        {/* =====================================================
            BRAND
        ====================================================== */}

        <button
          onClick={() => setActiveTab('home')}
          className="
            flex items-center
            gap-2.5
            px-2.5
            py-1.5
            rounded-2xl
            hover:bg-white/10
            transition-all
            text-left
            group
          "
        >

          <div
            className="
              w-10 h-10
              rounded-xl
              bg-gradient-to-tr
              from-[#007aff]
              to-[#7c3aed]
              flex items-center
              justify-center
              text-white
              shadow-lg
              shadow-[#007aff]/20
              group-hover:scale-105
              transition-transform
            "
          >
            <span className="text-xl">
              🎼
            </span>
          </div>

          <div className="hidden sm:block">

            <h1
              className="
                font-bold
                text-[15px]
                tracking-tight
                leading-tight
                text-white
                flex items-center
                gap-1.5
              "
            >
              Jewels Music Hub

              <span
                className="
                  text-[10px]
                  uppercase
                  font-extrabold
                  tracking-wider
                  bg-[#007aff]/15
                  text-[#4da3ff]
                  px-1.5
                  py-0.5
                  rounded-full
                "
              >
                Portal
              </span>
            </h1>

            <p
              className="
                text-[11px]
                text-white/40
                font-medium
                leading-none
                mt-0.5
              "
            >
              Music Ministry Management
            </p>

          </div>
        </button>


        {/* =====================================================
            NAVIGATION TABS
        ====================================================== */}

        <div
          className="
            flex items-center
            bg-white/[0.05]
            border border-white/10
            p-1
            rounded-2xl
            gap-1
          "
        >

          {/* HOME */}

          <button
            onClick={() => setActiveTab('home')}
            className={`
              px-3
              py-1.5
              rounded-xl
              text-xs
              sm:text-[13px]
              font-semibold
              transition-all
              flex items-center
              gap-1.5

              ${
                activeTab === 'home'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <span>🏠</span>

            <span className="hidden md:inline">
              Home
            </span>
          </button>


          {/* SONG BANK */}

          <button
            onClick={() => setActiveTab('songs')}
            className={`
              px-3
              py-1.5
              rounded-xl
              text-xs
              sm:text-[13px]
              font-semibold
              transition-all
              flex items-center
              gap-1.5

              ${
                activeTab === 'songs'
                  ? 'bg-white/10 text-[#4da3ff] shadow-sm'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }
            `}
          >

            <span>🎵</span>

            <span>
              Song Bank
            </span>

            <span
              className="
                text-[10px]
                px-1.5
                py-0.2
                rounded-full
                bg-[#007aff]/15
                text-[#4da3ff]
                font-bold
              "
            >
              {songsCount}
            </span>

          </button>


          {/* MINISTRATIONS */}

          <button
            onClick={() =>
              setActiveTab('ministrations')
            }
            className={`
              px-3
              py-1.5
              rounded-xl
              text-xs
              sm:text-[13px]
              font-semibold
              transition-all
              flex items-center
              gap-1.5

              ${
                activeTab === 'ministrations'
                  ? 'bg-white/10 text-[#a78bfa] shadow-sm'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }
            `}
          >

            <span>📋</span>

            <span>
              Ministrations
            </span>

          </button>


          {/* MUSIC TEAM */}

          <button
            onClick={() => setActiveTab('team')}
            className={`
              px-3
              py-1.5
              rounded-xl
              text-xs
              sm:text-[13px]
              font-semibold
              transition-all
              flex items-center
              gap-1.5

              ${
                activeTab === 'team'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }
            `}
          >

            <span>👥</span>

            <span>
              Music Team
            </span>

            <span
              className="
                text-[10px]
                px-1.5
                py-0.2
                rounded-full
                bg-white/10
                text-white/50
                font-bold
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
            flex items-center
            gap-1.5
            sm:gap-2
          "
        >

          {/* =================================================
              TOOLS
          ================================================== */}

          <button
            onClick={openToolsModal}
            title="Music Director Rehearsal Tools"
            className="
              h-9
              px-2.5
              sm:px-3
              rounded-xl
              bg-white/[0.06]
              border border-white/10
              hover:bg-white/10
              text-white
              text-xs
              font-semibold
              flex items-center
              gap-1.5
              transition-all
              shadow-sm
              active:scale-95
            "
          >

            <Wrench
              className="
                w-3.5
                h-3.5
                text-[#4da3ff]
              "
            />

            <span className="hidden lg:inline">
              Tools
            </span>

          </button>


          {/* =================================================
              STAGE MODE
          ================================================== */}

          <button
            onClick={openStageMode}
            title="Launch Stage & Live Rehearsal Mode"
            className="
              h-9
              px-2.5
              sm:px-3
              rounded-xl
              bg-[#007aff]
              hover:bg-[#007aff]/90
              text-white
              text-xs
              font-semibold
              flex items-center
              gap-1.5
              transition-all
              shadow-lg
              shadow-[#007aff]/20
              active:scale-95
            "
          >

            <Radio
              className="
                w-3.5
                h-3.5
                text-[#ff9500]
                animate-pulse
              "
            />

            <span className="hidden md:inline">
              Stage View
            </span>

          </button>


          {/* =================================================
              ROLE SWITCHER
          ================================================== */}

          <div
            className="relative"
            ref={dropdownRef}
          >

            <button
              onClick={() =>
                setRoleDropdownOpen(
                  !roleDropdownOpen
                )
              }
              className={`
                h-9
                px-2
                sm:px-3
                rounded-xl
                flex items-center
                gap-1.5
                text-xs
                font-bold
                transition-all
                border

                ${
                  isMD
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/15'
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                }
              `}
            >

              <span>
                {currentRoleObj.icon}
              </span>

              <span
                className="
                  hidden
                  xl:inline
                  max-w-[110px]
                  truncate
                "
              >
                {currentRoleObj.label}
              </span>

              <span
                className="
                  text-[10px]
                  px-1.5
                  py-0.5
                  rounded-full
                  bg-white/10
                "
              >
                {currentRoleObj.badge}
              </span>

              <ChevronDown
                className="
                  w-3
                  h-3
                  opacity-60
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
                  mt-2
                  w-72
                  bg-[#17171a]/95
                  backdrop-blur-2xl
                  rounded-2xl
                  p-2
                  shadow-2xl
                  border border-white/10
                  z-50
                  animate-in
                  fade-in
                  slide-in-from-top-2
                  duration-200
                "
              >

                <div
                  className="
                    px-3
                    py-2
                    border-b
                    border-white/10
                    mb-1
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
                      text-xs
                      text-white/80
                      font-medium
                      mt-0.5
                    "
                  >
                    {isMD
                      ? '👑 You have full MD Admin rights to add songs, assign vocalists, and edit members.'
                      : '🔒 Restricted Mode: Changes require MD permission.'
                    }
                  </p>

                </div>


                <div className="space-y-1">

                  {/* GENERAL HUB */}

                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                    }}
                    className="
                      w-full
                      text-left
                      p-2.5
                      rounded-xl
                      text-xs
                      flex items-center
                      gap-2.5
                      text-white
                      hover:bg-white/10
                      font-medium
                    "
                  >

                    <span className="text-base">
                      🌐
                    </span>

                    <div>

                      <p className="leading-tight">
                        General Music Hub
                      </p>

                      <p
                        className="
                          text-[10px]
                          text-white/40
                          font-normal
                        "
                      >
                        Browse, listen & rehearse
                      </p>

                    </div>

                  </button>


                  {/* MD ADMIN */}

                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      onOpenMDLogin();
                    }}
                    className="
                      w-full
                      text-left
                      p-2.5
                      rounded-xl
                      text-xs
                      flex items-center
                      gap-2.5
                      text-white
                      hover:bg-white/10
                      font-medium
                    "
                  >

                    <span className="text-base">
                      🔐
                    </span>

                    <div>

                      <p className="leading-tight">
                        MD Admin Portal
                      </p>

                      <p
                        className="
                          text-[10px]
                          text-white/40
                          font-normal
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
