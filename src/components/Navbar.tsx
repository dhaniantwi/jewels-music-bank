import React from 'react';
import { ActiveTab, ActiveRole, TeamMember } from '../types';
import { Music, Calendar, Users, Radio, Shield, Wrench, Sparkles, Check, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeRole: ActiveRole;
  
  team: TeamMember[];
  songsCount: number;
  openToolsModal: () => void;
  openStageMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  team,
  songsCount,
  openToolsModal,
  openStageMode
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMD = activeRole === 'admin_md';

  const roleOptions: { id: ActiveRole; label: string; desc: string; icon: string; badge: string }[] = [
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

  const currentRoleObj = roleOptions.find(r => r.id === activeRole) || roleOptions[0];

  return (
    <header className="sticky top-3 z-40 w-full px-3 sm:px-6 max-w-7xl mx-auto mb-4 no-print">
      <nav className="ios-glass rounded-[26px] p-2 sm:p-2.5 flex items-center justify-between gap-2 shadow-lg shadow-black/[0.04]">
        
        {/* Brand */}
        <button 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-2xl hover:bg-black/5 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#007aff] to-[#7c3aed] flex items-center justify-center text-white shadow-md shadow-[#007aff]/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🎼</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-[15px] tracking-tight leading-tight text-[#1d1d1f] flex items-center gap-1.5">
              Jewels Music Hub
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#007aff]/10 text-[#007aff] px-1.5 py-0.5 rounded-full">
                Portal
              </span>
            </h1>
            <p className="text-[11px] text-[#86868b] font-medium leading-none mt-0.5">
              Music Ministry Management
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-black/[0.04] p-1 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-white text-[#1d1d1f] shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white/40'
            }`}
          >
            <span>🏠</span>
            <span className="hidden md:inline">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('songs')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'songs'
                ? 'bg-white text-[#007aff] shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white/40'
            }`}
          >
            <span>🎵</span>
            <span>Song Bank</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#007aff]/10 text-[#007aff] font-bold">
              {songsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ministrations')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'ministrations'
                ? 'bg-white text-[#7c3aed] shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white/40'
            }`}
          >
            <span>📋</span>
            <span>Ministrations</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'team'
                ? 'bg-white text-[#1d1d1f] shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white/40'
            }`}
          >
            <span>👥</span>
            <span>Music Team</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 text-[#6e6e73] font-bold">
              {team.length}
            </span>
          </button>
        </div>

        {/* Right Action Tools & Role Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Tools button (Pitch Pipe & Metronome) */}
          <button
            onClick={openToolsModal}
            title="Music Director Rehearsal Tools (Pitch Pipe, Metronome, Transpose)"
            className="h-9 px-2.5 sm:px-3 rounded-xl bg-white/80 border border-black/[0.08] hover:bg-white text-[#1d1d1f] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Wrench className="w-3.5 h-3.5 text-[#007aff]" />
            <span className="hidden lg:inline">Tools</span>
          </button>

          {/* Stage Rehearsal Mode */}
          <button
            onClick={openStageMode}
            title="Launch Stage & Live Rehearsal Mode"
            className="h-9 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-[#1d1d1f] to-[#3a3a3c] text-white hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Radio className="w-3.5 h-3.5 text-[#ff9500] animate-pulse" />
            <span className="hidden md:inline">Stage View</span>
          </button>

          {/* Role / MD Permission Simulator */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`h-9 px-2 sm:px-3 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all border ${
                isMD
                  ? 'bg-amber-500/10 text-amber-900 border-amber-500/20 hover:bg-amber-500/15'
                  : 'bg-black/5 text-[#6e6e73] border-black/10 hover:bg-black/10'
              }`}
            >
              <span>{currentRoleObj.icon}</span>
              <span className="hidden xl:inline max-w-[110px] truncate">{currentRoleObj.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/80 shadow-xs">
                {currentRoleObj.badge}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl border border-black/10 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-black/5 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">
                    Role & Permission Switcher
                  </p>
                  <p className="text-xs text-[#1d1d1f] font-medium mt-0.5">
                    {isMD ? '👑 You have full MD Admin rights to add songs, assign vocalists, and edit members.' : '🔒 Restricted Mode: Changes require MD permission.'}
                  </p>
                </div>

                <div className="space-y-1">
  <button
    onClick={() => {
      setRoleDropdownOpen(false);
    }}
    className="w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 text-[#1d1d1f] hover:bg-black/5 font-medium"
  >
    <span className="text-base">🌐</span>
    <div>
      <p className="leading-tight">General Music Hub</p>
      <p className="text-[10px] text-[#86868b] font-normal">
        Browse, listen & rehearse
      </p>
    </div>
  </button>

  <button
    onClick={() => {
      setRoleDropdownOpen(false);
    }}
    className="w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 text-[#1d1d1f] hover:bg-black/5 font-medium"
  >
    <span className="text-base">🔐</span>
    <div>
      <p className="leading-tight">MD Admin Portal</p>
      <p className="text-[10px] text-[#86868b] font-normal">
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
