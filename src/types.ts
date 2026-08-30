export interface Song {
  id: number;
  title: string;
  artist: string;
  key: string;
  icon: string;
  lyrics: string;
  chords?: string;

  // Actual uploaded audio
  audioFileName?: string;
  audioFileType?: string;
  audioFileSize?: number;
}

export interface SetlistSongItem {
  songId: number;
  lead: number | null;
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

export type VoicePart =
  | 'Soprano'
  | 'Alto'
  | 'Tenor'
  | 'Lead / Soloist'
  | 'All Vocal';

export type InstrumentType =
  | 'Keyboard'
  | 'Guitar'
  | 'Bass'
  | 'Drums'
  | 'Saxophone'
  | 'Trumpet'
  | 'Violin'
  | 'Percussion'
  | 'Other';

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

export type ActiveRole =
  | 'admin_md'
  | 'vocal_member'
  | 'instrumentalist'
  | 'guest';
