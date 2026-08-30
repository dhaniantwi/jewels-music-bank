export type SongCategory = 'All' | 'Worship' | 'Praise' | 'Gospel' | 'Afropraise' | 'Medleys' | 'Choir' | 'Contemporary';

export interface VocalArrangement {
  lead: string;
  soprano: string;
  alto: string;
  tenor: string;
}

export interface InstrumentArrangement {
  keyboard: string;
  guitar: string;
  bass: string;
  drums: string;
  brass?: string;
  auxPads?: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  category: SongCategory;
  key: string;
  originalKey?: string;
  tempo: string;
  bpm?: number;
  timeSignature?: string;
  icon: string;
  audioUrl?: string;
  lyrics: string;
  chords?: string;
  arrangement: VocalArrangement;
  instruments: InstrumentArrangement;
  mdNotes: string;
  duration?: string;
  tags?: string[];
  createdAt?: string;
}

export interface SetlistSongItem {
  songId: number;
  lead: number | null; // TeamMember ID
  keyOverride?: string;
  orderNote?: string;
  durationMin?: number;
}

export interface Ministration {
  id: number;
  name: string;
  date: string;
  time?: string;
  venue?: string;
  theme?: string;
  status: 'Upcoming' | 'In Rehearsal' | 'Completed';
  description: string;
  mdGlobalNotes?: string;
  songs: SetlistSongItem[];
}

export type MemberType = 'director' | 'vocal' | 'instrument';
export type VoicePart = 'Soprano' | 'Alto' | 'Tenor' | 'Lead / Soloist' | 'All Vocal';
export type InstrumentType = 'Keyboard' | 'Guitar' | 'Bass' | 'Drums' | 'Saxophone' | 'Trumpet' | 'Violin' | 'Percussion' | 'Other';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  type: MemberType;
  voicePart?: VoicePart;
  instrumentType?: InstrumentType;
  icon: string;
  phone?: string;
  email?: string;
  isAvailable?: boolean;
  canEdit?: boolean;
}

export type ActiveTab = 'home' | 'songs' | 'ministrations' | 'team';
export type ActiveRole = 'admin_md' | 'vocal_member' | 'instrumentalist' | 'guest';
