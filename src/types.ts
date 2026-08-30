export type ActiveTab = 'home' | 'songs' | 'ministrations' | 'team';

export type ActiveRole =
  | 'admin_md'
  | 'vocalist'
  | 'instrumentalist';

export type SongCategory =
  | 'Worship'
  | 'Praise'
  | 'Afropraise'
  | 'Gospel'
  | 'Contemporary'
  | 'Other';

export interface SongArrangement {
  lead?: string;
  soprano?: string;
  alto?: string;
  tenor?: string;
}

export interface SongInstruments {
  keyboard?: string;
  guitar?: string;
  bass?: string;
  drums?: string;
  brass?: string;
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  category?: SongCategory | string;
  key?: string;
  originalKey?: string;
  tempo?: string;
  bpm?: number;
  timeSignature?: string;
  icon?: string;
  audioUrl?: string;
  lyrics?: string;
  chords?: string;
  arrangement?: SongArrangement;
  instruments?: SongInstruments;
  mdNotes?: string;
  duration?: string;
  tags?: string[];
  createdAt?: string;
}

export interface MinistrationSong {
  songId: string;
  lead: number | null;
  keyOverride?: string;
  orderNote?: string;
  durationMin?: number;
  songOrder?: number;
}

export interface Ministration {
  id: number;
  name: string;
  date: string;
  time?: string;
  venue?: string;
  theme?: string;
  status: 'Upcoming' | 'Completed' | 'Draft';
  description?: string;
  mdGlobalNotes?: string;
  songs: MinistrationSong[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  type: 'director' | 'vocal' | 'instrument';
  voicePart?: string;
  instrumentType?: string;
  icon?: string;
  phone?: string;
  email?: string;
  isAvailable?: boolean;
  canEdit?: boolean;
}
