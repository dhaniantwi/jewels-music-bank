import React, { useState, useEffect } from 'react';
import { TeamMember, MemberType, VoicePart, InstrumentType } from '../types';
import { X, Save, UserPlus, Check } from 'lucide-react';

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
  const [instrumentType, setInstrumentType] = useState<InstrumentType>('Keyboard');
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

  // Adjust default icon when type changes
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
      role: role.trim() || (type === 'vocal' ? `${voicePart} Vocalist` : `${instrumentType} Player`),
      type,
      voicePart: type === 'vocal' || type === 'director' ? voicePart : undefined,
      instrumentType: type === 'instrument' ? instrumentType : undefined,
      icon,
      phone: phone.trim(),
      email: email.trim(),
      isAvailable,
      canEdit
    });

    onClose();
  };

  const voiceParts: VoicePart[] = ['Soprano', 'Alto', 'Tenor', 'Lead / Soloist', 'All Vocal'];
  const instrumentList: InstrumentType[] = ['Keyboard', 'Guitar', 'Bass', 'Drums', 'Saxophone', 'Trumpet', 'Violin', 'Percussion', 'Other'];
  const memberIcons = ['🎤', '🎼', '🎹', '🎸', '🥁', '🎷', '🎺', '🎻', '🎵', '👑', '👤'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="ios-glass bg-white/95 rounded-[32px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-white/80 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007aff] to-[#7c3aed] flex items-center justify-center text-white text-lg shadow-md shadow-[#007aff]/20">
              👥
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#007aff]">
                MINISTRY ROSTER MANAGEMENT
              </span>
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                {editingMember ? `Edit Member: ${editingMember.name}` : 'Add New Music Team Member'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#6e6e73] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          
          {/* Member Type Switcher */}
          <div>
            <label className="text-xs font-bold text-[#1d1d1f] block mb-1.5">
              Ministry Department / Role Type
            </label>
            <div className="grid grid-cols-3 gap-2 bg-black/[0.04] p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => handleTypeChange('vocal')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  type === 'vocal'
                    ? 'bg-white text-[#007aff] shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                <span>🎤</span>
                <span>Vocalist</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('instrument')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  type === 'instrument'
                    ? 'bg-white text-[#7c3aed] shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                <span>🎹</span>
                <span>Musician</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('director')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  type === 'director'
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                <span>🎼</span>
                <span>Director</span>
              </button>
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Daniel Antwi, Priscilla Mensah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-sm font-medium text-[#1d1d1f] outline-none focus:border-[#007aff]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Avatar Icon
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-2 text-base outline-none cursor-pointer focus:border-[#007aff]"
              >
                {memberIcons.map(ic => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vocal Part or Instrument specific */}
          {type === 'vocal' && (
            <div>
              <label className="text-xs font-bold text-[#7c3aed] block mb-1">
                Primary Voice Section / Part
              </label>
              <select
                value={voicePart}
                onChange={(e) => {
                  const part = e.target.value as VoicePart;
                  setVoicePart(part);
                  setRole(`${part} Section`);
                }}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs font-bold text-[#7c3aed] outline-none focus:border-[#7c3aed]"
              >
                {voiceParts.map(vp => (
                  <option key={vp} value={vp}>{vp}</option>
                ))}
              </select>
            </div>
          )}

          {type === 'instrument' && (
            <div>
              <label className="text-xs font-bold text-[#007aff] block mb-1">
                Primary Instrument
              </label>
              <select
                value={instrumentType}
                onChange={(e) => handleInstrumentChange(e.target.value as InstrumentType)}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs font-bold text-[#007aff] outline-none focus:border-[#007aff]"
              >
                {instrumentList.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>
          )}

          {/* Custom Role Title */}
          <div>
            <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
              Ministry Title / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Lead Keyboardist & Synthesizer, Alto Section Lead"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Phone / WhatsApp (Optional)
              </label>
              <input
                type="tel"
                placeholder="+233 24 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1d1d1f] block mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="member@jewelsmusic.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs text-[#1d1d1f] outline-none focus:border-[#007aff]"
              />
            </div>
          </div>

          {/* MD Permission Grant */}
          <div className="p-3.5 rounded-2xl bg-black/[0.025] border border-black/5 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-xs font-bold text-[#1d1d1f]">Grant Song Upload & Edit Access</p>
                <p className="text-[10px] text-[#86868b]">Permit this member to assist MD with song uploading and notes</p>
              </div>
              <input
                type="checkbox"
                checked={canEdit}
                onChange={(e) => setCanEdit(e.target.checked)}
                className="w-4 h-4 accent-[#007aff] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold text-[#1d1d1f] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007aff]/30 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{editingMember ? 'Update Member' : 'Add to Team'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
