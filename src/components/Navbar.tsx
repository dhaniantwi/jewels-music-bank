import React, { useState } from 'react';
import {
  ActiveTab,
  ActiveRole,
  TeamMember
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
  Globe2
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
  openStageMode
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] =
    useState(false);

  const isMD = activeRole === 'admin_md';

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home
    },
    {
      id: 'songs',
      label: 'Song Bank',
      icon: Music2
    },
    {
      id: 'ministrations',
      label: 'Ministrations',
      icon: ClipboardList
    },
    {
      id: 'team',
      label: 'Music Team',
      icon: Users
    }
  ];

  const currentRoleLabel = isMD
    ? 'MD & Admin'
    : 'Music Team';

  const currentRoleName = isMD
    ? 'Daniel Antwi'
    : 'Choir Member';

  return (
    <header
      className="
        sticky
        top-3
        z-40
        mb-5
        w-full
      "
    >
      <div
        className="
          relative
          rounded-[24px]
          border border-white/10
          bg-[#101012]/90
          px-3
          py-3
          shadow-2xl
          shadow-black/25
          backdrop-blur-2xl
          sm:px-4
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-wrap
            items-center
            gap-3
          "
        >

          {/* =====================================================
              BRAND
          ===================================================== */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="
              group
              flex
              min-w-0
              shrink-0
              items-center
              gap-2.5
              rounded-2xl
              px-1.5
              py-1
              text-left
              transition-all
              duration-200
              hover:bg-white/[0.035]
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
                rounded-xl
                border border-[#007aff]/20
                bg-[#007aff]/10
                shadow-lg
                shadow-blue-500/5
              "
            >
              <Music2
                className="
                  h-5
                  w-5
                  text-[#4da3ff]
                "
              />
            </div>

            <div className="hidden min-w-0 sm:block">
              <div
                className="
                  truncate
                  text-sm
                  font-extrabold
                  tracking-tight
                  text-white
                "
              >
                Jewels Music
              </div>

              <div
                className="
                  truncate
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-white/30
                "
              >
                Ministry Portal
              </div>
            </div>
          </button>


          {/* =====================================================
              NAVIGATION
          ===================================================== */}
          <nav
            className="
              order-3
              flex
              w-full
              min-w-0
              items-center
              gap-1.5
              overflow-x-auto
              pb-0.5
              scrollbar-none
              sm:order-none
              sm:w-auto
              sm:flex-1
              sm:justify-center
            "
          >
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    px-3
                    py-2
                    text-[11px]
                    font-bold
                    transition-all
                    duration-200
                    active:scale-[0.97]
                    ${
                      isActive
                        ? `
                          border-[#007aff]/20
                          bg-[#007aff]/10
                          text-[#4da3ff]
                          shadow-sm
                          shadow-blue-500/5
                        `
                        : `
                          border-white/[0.06]
                          bg-white/[0.02]
                          text-white/40
                          hover:border-white/10
                          hover:bg-white/[0.055]
                          hover:text-white
                        `
                    }
                  `}
                >
                  <Icon className="h-3.5 w-3.5" />

                  <span className="hidden xs:inline sm:inline">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>


          {/* =====================================================
              RIGHT ACTIONS
          ===================================================== */}
          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-1.5
            "
          >

            {/* Tools */}
            <button
              type="button"
              onClick={openToolsModal}
              title="Open music tools"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border border-white/10
                bg-white/[0.025]
                text-white/40
                transition-all
                duration-200
                hover:border-white/15
                hover:bg-white/[0.06]
                hover:text-white
                active:scale-[0.95]
              "
            >
              <Wrench className="h-4 w-4" />
            </button>


            {/* Stage Mode */}
            <button
              type="button"
              onClick={openStageMode}
              title="Open Stage View"
              className="
                flex
                h-9
                items-center
                gap-1.5
                rounded-xl
                border border-amber-500/20
                bg-amber-500/10
                px-3
                text-[10px]
                font-extrabold
                uppercase
                tracking-wider
                text-amber-200
                transition-all
                duration-200
                hover:bg-amber-500/15
                active:scale-[0.95]
              "
            >
              <Radio className="h-3.5 w-3.5 text-amber-300" />

              <span className="hidden md:inline">
                Stage
              </span>
            </button>


            {/* =================================================
                ROLE SWITCHER
            ================================================= */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsRoleMenuOpen(prev => !prev)
                }
                className="
                  flex
                  h-9
                  items-center
                  gap-2
                  rounded-xl
                  border border-white/10
                  bg-white/[0.035]
                  px-2.5
                  text-white/60
                  transition-all
                  duration-200
                  hover:border-white/15
                  hover:bg-white/[0.06]
                  hover:text-white
                  active:scale-[0.97]
                "
              >
                <div
                  className="
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-lg
                    border border-[#007aff]/20
                    bg-[#007aff]/10
                  "
                >
                  {isMD ? (
                    <ShieldCheck
                      className="
                        h-3.5
                        w-3.5
                        text-[#4da3ff]
                      "
                    />
                  ) : (
                    <Users
                      className="
                        h-3.5
                        w-3.5
                        text-[#4da3ff]
                      "
                    />
                  )}
                </div>

                <div className="hidden text-left lg:block">
                  <div
                    className="
                      max-w-[100px]
                      truncate
                      text-[10px]
                      font-bold
                      text-white/75
                    "
                  >
                    {currentRoleName}
                  </div>

                  <div
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-white/30
                    "
                  >
                    {currentRoleLabel}
                  </div>
                </div>

                <ChevronDown
                  className={`
                    h-3.5
                    w-3.5
                    text-white/30
                    transition-transform
                    duration-200
                    ${
                      isRoleMenuOpen
                        ? 'rotate-180'
                        : ''
                    }
                  `}
                />
              </button>


              {/* ROLE DROPDOWN */}
              {isRoleMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close role menu"
                    onClick={() =>
                      setIsRoleMenuOpen(false)
                    }
                    className="
                      fixed
                      inset-0
                      z-40
                      cursor-default
                    "
                  />

                  <div
                    className="
                      absolute
                      right-0
                      top-[calc(100%+10px)]
                      z-50
                      w-72
                      overflow-hidden
                      rounded-[22px]
                      border border-white/10
                      bg-[#151517]/95
                      p-2
                      shadow-2xl
                      shadow-black/40
                      backdrop-blur-2xl
                    "
                  >

                    {/* Current role */}
                    <div
                      className="
                        mb-2
                        rounded-2xl
                        border border-white/10
                        bg-white/[0.035]
                        p-3
                      "
                    >
                      <div
                        className="
                          mb-1
                          text-[9px]
                          font-extrabold
                          uppercase
                          tracking-[0.15em]
                          text-white/30
                        "
                      >
                        Current Access
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-2.5
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            border border-[#007aff]/20
                            bg-[#007aff]/10
                          "
                        >
                          {isMD ? (
                            <ShieldCheck
                              className="
                                h-4
                                w-4
                                text-[#4da3ff]
                              "
                            />
                          ) : (
                            <Users
                              className="
                                h-4
                                w-4
                                text-[#4da3ff]
                              "
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div
                            className="
                              truncate
                              text-xs
                              font-bold
                              text-white
                            "
                          >
                            {currentRoleName}
                          </div>

                          <div
                            className="
                              text-[9px]
                              font-medium
                              text-white/35
                            "
                          >
                            {currentRoleLabel}
                          </div>
                        </div>
                      </div>
                    </div>


                    {/* MD access */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRoleMenuOpen(false);
                        onOpenMDLogin();
                      }}
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-2xl
                        border border-amber-500/10
                        bg-amber-500/[0.035]
                        p-3
                        text-left
                        transition-all
                        duration-200
                        hover:border-amber-500/20
                        hover:bg-amber-500/[0.08]
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
                          border border-amber-500/20
                          bg-amber-500/10
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

                      <div className="min-w-0">
                        <div
                          className="
                            text-xs
                            font-bold
                            text-white
                          "
                        >
                          MD Admin Portal
                        </div>

                        <div
                          className="
                            mt-0.5
                            text-[9px]
                            leading-relaxed
                            text-white/30
                          "
                        >
                          Manage songs, setlists,
                          and ministry operations.
                        </div>
                      </div>
                    </button>


                    {/* General portal */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRoleMenuOpen(false);
                        setActiveTab('home');
                      }}
                      className="
                        group
                        mt-1.5
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-2xl
                        border border-white/5
                        bg-white/[0.02]
                        p-3
                        text-left
                        transition-all
                        duration-200
                        hover:border-white/10
                        hover:bg-white/[0.06]
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
                          border border-[#007aff]/20
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

                      <div className="min-w-0">
                        <div
                          className="
                            text-xs
                            font-bold
                            text-white
                          "
                        >
                          General Music Portal
                        </div>

                        <div
                          className="
                            mt-0.5
                            text-[9px]
                            leading-relaxed
                            text-white/30
                          "
                        >
                          Open the standard ministry
                          member experience.
                        </div>
                      </div>
                    </button>


                    {/* Small info footer */}
                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        justify-between
                        border-t
                        border-white/10
                        px-2
                        pt-2
                      "
                    >
                      <span
                        className="
                          text-[8px]
                          font-bold
                          uppercase
                          tracking-[0.12em]
                          text-white/20
                        "
                      >
                        Jewels Music Hub
                      </span>

                      <span
                        className="
                          text-[8px]
                          font-bold
                          text-white/20
                        "
                      >
                        {songsCount} songs
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
