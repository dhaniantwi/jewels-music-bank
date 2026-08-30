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

export interface AudioRecord {
songId: number;
file: File;
}

export interface MinistryEvent {
id: number;
name: string;
date?: string;
venue?: string;
description?: string;
created_at?: string;
}

export interface MusicTeamMember {
id: number;
name: string;
role?: string;
instrument?: string;
phone?: string;
email?: string;
image_url?: string;
created_at?: string;
}

export type SongCategory =
| 'Worship'
| 'Praise'
| 'Ministration'
| 'Special'
| 'Other';
