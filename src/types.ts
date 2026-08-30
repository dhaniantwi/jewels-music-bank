export interface Song {
id: number;
title: string;
artist: string;
key: string;
bpm?: number;
category: string;
lyrics?: string;
notes?: string;
audio_url?: string;
created_at?: string;
updated_at?: string;
}

export interface Ministration {
id: number;
title: string;
description?: string;
songs?: number[];
date?: string;
venue?: string;
notes?: string;
created_at?: string;
updated_at?: string;
}

export interface TeamMember {
id: number;
name: string;
role?: string;
instrument?: string;
phone?: string;
email?: string;
image_url?: string;
created_at?: string;
updated_at?: string;
}

export interface AudioRecord {
songId: number;
file: File;
}

export type SongCategory =
| 'Worship'
| 'Praise'
| 'Ministration'
| 'Special'
| 'Other';
