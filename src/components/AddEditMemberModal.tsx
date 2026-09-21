import React, { useState, useEffect } from 'react';
import { TeamMember, MemberType, VoicePart, InstrumentType } from '../types';
import { X, Save } from 'lucide-react';

interface AddEditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Omit<TeamMember, 'id'> & { id?: number }) => void;
  editingMember: TeamMember | null;
}

export const AddEditMemberModal: React.FC<AddEditMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMember
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState<MemberType>('vocal');
  const [voicePart, setVoicePart] = useState<VoicePart>('Soprano');
  const [instrumentType, setInstrumentType] =
    useState<InstrumentType>('Keyboard');
  const [icon, setIcon] = useState('🎤');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name);
      setRole(editingMember.role);
      setType(editingMember.type);
      setVoicePart(editingMember.voicePart || 'Soprano');
      setInstrumentType(editingMember.instrumentType || 'Keyboard');
      setIcon(editingMember.icon || '🎤');
      setPhone(editingMember.phone || '');
      setEmail(editingMember.email || '');
      setIsAvailable(editingMember.isAvailable ?? true);
      setCanEdit(editingMember.canEdit ?? false);
    } else {
      setName('');
      setRole('Vocalist');
      setType('vocal');
      setVoicePart('Soprano');
      setInstrumentType('Keyboard');
      setIcon('🎤');
      setPhone('');
      setEmail('');
      setIsAvailable(true);
      setCanEdit(false);
    }
  }, [editingMember, isOpen]);

  const handleTypeChange = (newType: MemberType) => {
    setType(newType);

    if (newType === 'vocal') {
      setIcon('🎤');
      setRole('Vocalist');
    } else if (newType === 'instrument') {
      setIcon('🎹');
      setRole(`${instrumentType} Player`);
    } else {
      setIcon('🎼');
      setRole('Music Director');
    }
  };

  const handleInstrumentChange = (newInst: InstrumentType) => {
    setInstrumentType(newInst);
    setRole(`${newInst} Player`);

    if (newInst === 'Keyboard') setIcon('🎹');
    else if (newInst === 'Guitar') setIcon('🎸');
    else if (newInst === 'Bass') setIcon('🎸');
    else if (newInst === 'Drums') setIcon('🥁');
    else if (newInst === 'Saxophone') setIcon('🎷');
    else if (newInst === 'Trumpet') setIcon('🎺');
    else if (newInst === 'Violin') setIcon('🎻');
    else setIcon('🎵');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter member name');
      return;
    }

    onSave({
      id: editingMember?.id,
      name: name.trim(),
      role:
        role.trim() ||
        (type === 'vocal'
          ? `${voicePart} Vocalist`
          : `${instrumentType} Player`),
      type,
      voicePart:
        type === 'vocal' || type === 'director' ? voicePart : undefined,
      instrumentType:
        type === 'instrument' ? instrumentType : undefined,
      icon,
      phone: phone.trim(),
      email: email.trim(),
      isAvailable,
      canEdit
    });

    onClose();
  };

  const voiceParts: VoicePart[] = [
    'Soprano',
    'Alto',
    'Tenor',
    'Lead / Soloist',
    'All Vocal'
  ];

  const instrumentList: InstrumentType[] = [
    'Keyboard',
    'Guitar',
    'Bass',
    'Drums',
    'Saxophone',
    'Trumpet',
    'Violin',
    'Percussion',
    'Other'
  ];

  const memberIcons = [
    '🎤',
    '🎼',
    '🎹',
    '🎸',
    '🥁',
    '🎷',
    '🎺',
    '🎻',
    '🎵',
    '👑',
    '👤'
  ];

  const inputClass =
    'w-full bg-white/[0.055] border border-white/10 rounded-2xl px-3.5 py-3 text-sm font-medium text-white placeholder:text-white/30 outline-none transition-all focus:border-[#007aff]/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-[#007aff]/10';

  const selectClass =
    'w-full bg-[#1b1b1f] border border-white/10 rounded-2xl px-3.5 py-3 text-sm font-semibold text-white outline-none transition-all focus:border-[#007aff]/70 focus:ring-2 focus:ring-[#007aff]/10 cursor-pointer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden rounded-[30px] bg-[#141417]/95 backdrop-blur-3xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">

        {/* Blue / purple glow */}
        <div className="pointer-events-none absolute -top-32 -left-24 w-72 h-72 rounded-full bg-[#007aff]/12 blur-3xl" />
        <div className="pointer-events-none absolute -top-28 -right-24 w-72 h-72 rounded-full bg-[#7c3aed]/10 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 sm:px-7 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#007aff] to-[#7c3aed] flex items-center justify-center text-white text-lg shadow-lg shadow-[#007aff]/20 flex-shrink-0">
              👥
            </div>

            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#4da3ff]">
                Ministry Roster Management
              </div>

              <h2 className="mt-0.5 text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                {editingMember
                  ? `Edit Member: ${editingMember.name}`
                  : 'Add New Music Team Member'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/[0.11] flex items-center justify-center text-white/60 hover:text-white transition-all flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-5"
        >
          {/* Member Type */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/55 block mb-2">
              Ministry Department / Role Type
            </label>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/[0.035] border border-white/10">
              <button
                type="button"
                onClick={() => handleTypeChange('vocal')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  type === 'vocal'
                    ? 'bg-[#7c3aed]/20 text-[#c4a7ff] border border-[#7c3aed]/30 shadow-lg shadow-[#7c3aed]/10'
                    : 'text-white/45 hover:text-white/75 hover:bg-white/[0.045]'
                }`}
              >
                <span>🎤</span>
                <span>Vocalist</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('instrument')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  type === 'instrument'
                    ? 'bg-[#007aff]/20 text-[#4da3ff] border border-[#007aff]/30 shadow-lg shadow-[#007aff]/10'
                    : 'text-white/45 hover:text-white/75 hover:bg-white/[0.045]'
                }`}
              >
                <span>🎹</span>
                <span>Musician</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('director')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  type === 'director'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-400/20 shadow-lg shadow-amber-500/10'
                    : 'text-white/45 hover:text-white/75 hover:bg-white/[0.045]'
                }`}
              >
                <span>🎼</span>
                <span>Director</span>
              </button>
            </div>
          </div>

          {/* Name + Icon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/55 block mb-2">
                Full Name *
              </label>

              <input
                type="text"
                required
                placeholder="e.g. Daniel Antwi, Priscilla Mensah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/55 block mb-2">
                Avatar Icon
              </label>

              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className={`${selectClass} text-base`}
              >
                {memberIcons.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vocal Part */}
          {type === 'vocal' && (
            <div className="p-4 rounded-2xl bg-[#7c3aed]/[0.07] border border-[#7c3aed]/15">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#c4a7ff] block mb-2">
                Primary Voice Section / Part
              </label>

              <select
                value={voicePart}
                onChange={(e) => {
                  const part = e.target.value as VoicePart;
                  setVoicePart(part);
                  setRole(`${part} Section`);
                }}
                className={`${selectClass} border-[#7c3aed]/20 text-[#d6c5ff]`}
              >
                {voiceParts.map((vp) => (
                  <option key={vp} value={vp}>
                    {vp}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Instrument */}
          {type === 'instrument' && (
            <div className="p-4 rounded-2xl bg-[#007aff]/[0.07] border border-[#007aff]/15">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#4da3ff] block mb-2">
                Primary Instrument
              </label>

              <select
                value={instrumentType}
                onChange={(e) =>
                  handleInstrumentChange(e.target.value as InstrumentType)
                }
                className={`${selectClass} border-[#007aff]/20 text-[#9bcaff]`}
              >
                {instrumentList.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Custom Role */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/55 block mb-2">
              Ministry Title / Description
            </label>

            <input
              type="text"
              placeholder="e.g. Lead Keyboardist & Synthesizer, Alto Section Lead"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/55">
              Contact Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-white/40 block mb-1.5">
                  Phone / WhatsApp
                </label>

                <input
                  type="tel"
                  placeholder="+233 24 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-white/40 block mb-1.5">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="member@jewelsmusic.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="rounded-2xl bg-amber-500/[0.06] border border-amber-400/15 p-4">
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-bold text-white">
                  Grant Song Upload & Edit Access
                </p>

                <p className="mt-1 text-[10px] sm:text-[11px] text-white/40 leading-relaxed">
                  Permit this member to assist MD with song uploading and notes.
                </p>
              </div>

              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={canEdit}
                  onChange={(e) => setCanEdit(e.target.checked)}
                  className="peer sr-only"
                />

                <div className="w-11 h-6 rounded-full bg-white/10 border border-white/10 peer-checked:bg-[#007aff] peer-checked:border-[#007aff]/60 transition-all" />

                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>

          {/* Availability */}
          <div className="rounded-2xl bg-white/[0.035] border border-white/10 p-4">
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-bold text-white">
                  Available for Ministry
                </p>

                <p className="mt-1 text-[10px] sm:text-[11px] text-white/40">
                  Show this member as currently available in the team roster.
                </p>
              </div>

              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="peer sr-only"
                />

                <div className="w-11 h-6 rounded-full bg-white/10 border border-white/10 peer-checked:bg-emerald-500 peer-checked:border-emerald-400/50 transition-all" />

                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/[0.055] hover:bg-white/[0.10] border border-white/10 text-xs font-bold text-white/70 hover:text-white transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#007aff] hover:bg-[#006fe6] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#007aff]/25 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />

              <span>
                {editingMember ? 'Update Member' : 'Add to Team'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
