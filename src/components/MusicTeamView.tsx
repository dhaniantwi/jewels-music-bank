import React, { useState } from 'react';
import { TeamMember, ActiveRole, MemberType } from '../types';
import { Users, Plus, Phone, Mail, Edit, Trash2, ShieldCheck, CheckCircle2, Music, Mic, UserPlus } from 'lucide-react';

interface MusicTeamViewProps {
  team: TeamMember[];
  activeRole: ActiveRole;
  onAddNewMember: () => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: number) => void;
  onTogglePermission: (memberId: number) => void;
}

export const MusicTeamView: React.FC<MusicTeamViewProps> = ({
  team,
  activeRole,
  onAddNewMember,
  onEditMember,
  onDeleteMember,
  onTogglePermission
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'vocal' | 'instrument' | 'director'>('all');

  const isMD = activeRole === 'admin_md';

  const directors = team.filter(m => m.type === 'director');
  const vocalists = team.filter(m => m.type === 'vocal');
  const instrumentalists = team.filter(m => m.type === 'instrument');

  // Filtered list
  const displayMembers = team.filter(m => {
    if (activeFilter === 'all') return true;
    return m.type === activeFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
            PEOPLE & MINISTRY ROSTER
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
            Jewels Music Team
          </h1>
          <p className="text-sm text-[#6e6e73] font-medium mt-0.5">
            {team.length} dedicated vocalists, musicians, and directors serving in music ministry.
          </p>
        </div>

        {/* MD Add Member Action */}
        <div className="flex items-center gap-2">
          {isMD ? (
            <button
              onClick={onAddNewMember}
              className="px-5 py-2.5 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-[#007aff]/30 transition-all active:scale-95 flex-shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 rounded-2xl bg-black/5 text-[#86868b] text-xs font-semibold flex items-center gap-1.5 border border-black/5">
              <span>🔒 Member management restricted to MD</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-black/[0.04] p-1 rounded-2xl max-w-fit">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'all' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
          }`}
        >
          All Members ({team.length})
        </button>
        <button
          onClick={() => setActiveFilter('vocal')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'vocal' ? 'bg-white text-[#7c3aed] shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
          }`}
        >
          🎤 Vocalists ({vocalists.length})
        </button>
        <button
          onClick={() => setActiveFilter('instrument')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'instrument' ? 'bg-white text-[#007aff] shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
          }`}
        >
          🎹 Musicians ({instrumentalists.length})
        </button>
        <button
          onClick={() => setActiveFilter('director')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'director' ? 'bg-white text-amber-600 shadow-xs' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
          }`}
        >
          🎼 Leadership ({directors.length})
        </button>
      </div>

      {/* SECTION 1: LEADERSHIP & DIRECTORS */}
      {(activeFilter === 'all' || activeFilter === 'director') && directors.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎼</span>
            <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
              Music Leadership
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {directors.map(member => (
              <div
                key={member.id}
                className="ios-glass p-5 rounded-[26px] bg-gradient-to-br from-amber-500/10 via-white to-white border border-amber-500/20 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13 rounded-2xl bg-amber-500/20 flex items-center justify-center text-2xl flex-shrink-0 border border-amber-500/30">
                        {member.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-extrabold text-[#1d1d1f]">
                            {member.name}
                          </h3>
                          <span className="text-[10px] bg-amber-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                            MD
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-amber-900 mt-0.5">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {isMD && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditMember(member)}
                          className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#6e6e73]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 text-xs text-[#6e6e73]">
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#007aff]" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#7c3aed]" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Full Admin Rights
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Active Leader
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: VOCAL TEAM */}
      {(activeFilter === 'all' || activeFilter === 'vocal') && vocalists.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎤</span>
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Vocal Team (Harmonies & Solos)
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#86868b]">
              {vocalists.length} Vocalists Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vocalists.map(member => (
              <div
                key={member.id}
                className="ios-card p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center text-2xl flex-shrink-0 border border-[#7c3aed]/20">
                        {member.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-[#1d1d1f] truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#7c3aed] truncate">
                          {member.voicePart || member.role}
                        </p>
                      </div>
                    </div>

                    {isMD && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => onEditMember(member)}
                          className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#6e6e73]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${member.name} from the vocal roster?`)) {
                              onDeleteMember(member.id);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 pt-1 text-xs text-[#6e6e73]">
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-[#007aff]" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-[#7c3aed]" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#7c3aed] bg-[#7c3aed]/10 px-2 py-0.5 rounded-full">
                    {member.voicePart || 'Vocal Section'}
                  </span>
                  
                  {isMD && (
                    <button
                      onClick={() => onTogglePermission(member.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                        member.canEdit
                          ? 'bg-emerald-500/15 text-emerald-700'
                          : 'bg-black/5 text-[#86868b] hover:bg-black/10'
                      }`}
                    >
                      {member.canEdit ? '✓ Upload Access Granted' : '+ Grant Uploads'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: INSTRUMENTALISTS & BAND */}
      {(activeFilter === 'all' || activeFilter === 'instrument') && instrumentalists.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎹</span>
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Band & Instrumentalists
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#86868b]">
              {instrumentalists.length} Musicians
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instrumentalists.map(member => (
              <div
                key={member.id}
                className="ios-card p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#007aff]/10 flex items-center justify-center text-2xl flex-shrink-0 border border-[#007aff]/20">
                        {member.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-[#1d1d1f] truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#007aff] truncate">
                          {member.instrumentType || member.role}
                        </p>
                      </div>
                    </div>

                    {isMD && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => onEditMember(member)}
                          className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#6e6e73]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${member.name} from the band roster?`)) {
                              onDeleteMember(member.id);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 pt-1 text-xs text-[#6e6e73]">
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-[#007aff]" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-[#7c3aed]" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#007aff] bg-[#007aff]/10 px-2 py-0.5 rounded-full">
                    {member.instrumentType || 'Band'}
                  </span>
                  
                  {isMD && (
                    <button
                      onClick={() => onTogglePermission(member.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                        member.canEdit
                          ? 'bg-emerald-500/15 text-emerald-700'
                          : 'bg-black/5 text-[#86868b] hover:bg-black/10'
                      }`}
                    >
                      {member.canEdit ? '✓ Upload Access' : '+ Grant Uploads'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
