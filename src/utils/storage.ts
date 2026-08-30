import { Song, Ministration, TeamMember } from '../types';
import { INITIAL_SONGS, INITIAL_MINISTRATIONS, INITIAL_TEAM_MEMBERS } from '../data/initialData';

const SONGS_STORAGE_KEY = 'jewels_music_hub_songs_v2';
const MINISTRATIONS_STORAGE_KEY = 'jewels_music_hub_ministrations_v2';
const TEAM_STORAGE_KEY = 'jewels_music_hub_team_v2';
const CURRENT_ROLE_KEY = 'jewels_music_hub_current_role_v2';

export function loadStoredSongs(): Song[] {
  try {
    const raw = localStorage.getItem(SONGS_STORAGE_KEY);
    if (!raw) return INITIAL_SONGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SONGS;
  } catch (e) {
    console.error('Error loading songs from storage:', e);
    return INITIAL_SONGS;
  }
}

export function saveStoredSongs(songs: Song[]): void {
  try {
    localStorage.setItem(SONGS_STORAGE_KEY, JSON.stringify(songs));
  } catch (e) {
    console.error('Error saving songs to storage:', e);
  }
}

export function loadStoredMinistrations(): Ministration[] {
  try {
    const raw = localStorage.getItem(MINISTRATIONS_STORAGE_KEY);
    if (!raw) return INITIAL_MINISTRATIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MINISTRATIONS;
  } catch (e) {
    console.error('Error loading ministrations from storage:', e);
    return INITIAL_MINISTRATIONS;
  }
}

export function saveStoredMinistrations(ministrations: Ministration[]): void {
  try {
    localStorage.setItem(MINISTRATIONS_STORAGE_KEY, JSON.stringify(ministrations));
  } catch (e) {
    console.error('Error saving ministrations to storage:', e);
  }
}

export function loadStoredTeam(): TeamMember[] {
  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) return INITIAL_TEAM_MEMBERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TEAM_MEMBERS;
  } catch (e) {
    console.error('Error loading team from storage:', e);
    return INITIAL_TEAM_MEMBERS;
  }
}

export function saveStoredTeam(team: TeamMember[]): void {
  try {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
  } catch (e) {
    console.error('Error saving team to storage:', e);
  }
}

export function resetAllToDefaults(): void {
  localStorage.removeItem(SONGS_STORAGE_KEY);
  localStorage.removeItem(MINISTRATIONS_STORAGE_KEY);
  localStorage.removeItem(TEAM_STORAGE_KEY);
}
