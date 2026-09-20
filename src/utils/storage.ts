import { Song, Ministration, TeamMember } from '../types';
import {
  INITIAL_SONGS,
  INITIAL_MINISTRATIONS,
  INITIAL_TEAM_MEMBERS
} from '../data/initialData';

const SONGS_STORAGE_KEY = 'jewels_music_hub_songs_v2';
const MINISTRATIONS_STORAGE_KEY = 'jewels_music_hub_ministrations_v2';
const TEAM_STORAGE_KEY = 'jewels_music_hub_team_v2';
const CURRENT_ROLE_KEY = 'jewels_music_hub_current_role_v2';

/**
 * Load songs saved locally.
 *
 * Songs are now primarily loaded from Supabase, but this function
 * is kept for backwards compatibility with the older local-storage
 * version of the application.
 */
export function loadStoredSongs(): Song[] {
  try {
    const raw = localStorage.getItem(SONGS_STORAGE_KEY);

    if (!raw) {
      return INITIAL_SONGS;
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : INITIAL_SONGS;
  } catch (e) {
    console.error('Error loading songs from storage:', e);
    return INITIAL_SONGS;
  }
}

/**
 * Save songs locally.
 */
export function saveStoredSongs(songs: Song[]): void {
  try {
    localStorage.setItem(
      SONGS_STORAGE_KEY,
      JSON.stringify(songs)
    );
  } catch (e) {
    console.error('Error saving songs to storage:', e);
  }
}

/**
 * Load ministrations from local storage.
 */
export function loadStoredMinistrations(): Ministration[] {
  try {
    const raw = localStorage.getItem(
      MINISTRATIONS_STORAGE_KEY
    );

    if (!raw) {
      return INITIAL_MINISTRATIONS;
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : INITIAL_MINISTRATIONS;
  } catch (e) {
    console.error(
      'Error loading ministrations from storage:',
      e
    );

    return INITIAL_MINISTRATIONS;
  }
}

/**
 * Save ministrations locally.
 */
export function saveStoredMinistrations(
  ministrations: Ministration[]
): void {
  try {
    localStorage.setItem(
      MINISTRATIONS_STORAGE_KEY,
      JSON.stringify(ministrations)
    );
  } catch (e) {
    console.error(
      'Error saving ministrations to storage:',
      e
    );
  }
}

/**
 * Load team members from local storage.
 */
export function loadStoredTeam(): TeamMember[] {
  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);

    if (!raw) {
      return INITIAL_TEAM_MEMBERS;
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : INITIAL_TEAM_MEMBERS;
  } catch (e) {
    console.error('Error loading team from storage:', e);
    return INITIAL_TEAM_MEMBERS;
  }
}

/**
 * Save team members locally.
 */
export function saveStoredTeam(team: TeamMember[]): void {
  try {
    localStorage.setItem(
      TEAM_STORAGE_KEY,
      JSON.stringify(team)
    );
  } catch (e) {
    console.error('Error saving team to storage:', e);
  }
}

/**
 * Normalize a song title so small differences in spacing,
 * capitalization, punctuation, etc. do not prevent matching.
 */
function normalizeSongTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '');
}

/**
 * Find the current Supabase song that corresponds to an old
 * INITIAL_SONGS entry.
 *
 * Old ministrations use IDs such as "1", "2", "3", etc.
 * Current Supabase songs use UUIDs.
 */
function resolveLegacySongId(
  legacySongId: string,
  currentSongs: Song[]
): string | null {
  // Already a current Supabase ID.
  const directMatch = currentSongs.find(
    song => String(song.id) === String(legacySongId)
  );

  if (directMatch) {
    return directMatch.id;
  }

  // Find the old song using the legacy numeric ID.
  const legacySong = INITIAL_SONGS.find(
    song => String(song.id) === String(legacySongId)
  );

  if (!legacySong) {
    return null;
  }

  const legacyTitle = normalizeSongTitle(
    legacySong.title
  );

  // Exact normalized title match.
  const titleMatch = currentSongs.find(
    song =>
      normalizeSongTitle(song.title) === legacyTitle
  );

  if (titleMatch) {
    return titleMatch.id;
  }

  // Slightly more forgiving title match.
  const partialMatch = currentSongs.find(song => {
    const currentTitle = normalizeSongTitle(song.title);

    return (
      currentTitle.includes(legacyTitle) ||
      legacyTitle.includes(currentTitle)
    );
  });

  if (partialMatch) {
    return partialMatch.id;
  }

  return null;
}

/**
 * Upgrade old ministration song references to the current
 * Supabase song IDs.
 *
 * This is the important migration layer that prevents Stage Mode
 * from breaking when an old ministration contains IDs such as
 * "1", "2", "3", etc.
 */
export function migrateMinistrationsToCurrentSongs(
  ministrations: Ministration[],
  currentSongs: Song[]
): Ministration[] {
  if (!currentSongs.length) {
    return ministrations;
  }

  let changed = false;

  const migratedMinistrations = ministrations.map(
    ministration => {
      const migratedSongs = ministration.songs.map(
        item => {
          const currentSongId = resolveLegacySongId(
            String(item.songId),
            currentSongs
          );

          if (
            currentSongId &&
            String(currentSongId) !== String(item.songId)
          ) {
            changed = true;

            return {
              ...item,
              songId: currentSongId
            };
          }

          return item;
        }
      );

      return {
        ...ministration,
        songs: migratedSongs
      };
    }
  );

  if (changed) {
    console.log(
      'Jewels Music Hub: migrated legacy ministration song IDs to current Supabase IDs.'
    );
  }

  return migratedMinistrations;
}

/**
 * Reset locally stored data back to the original defaults.
 */
export function resetAllToDefaults(): void {
  localStorage.removeItem(SONGS_STORAGE_KEY);
  localStorage.removeItem(MINISTRATIONS_STORAGE_KEY);
  localStorage.removeItem(TEAM_STORAGE_KEY);
  localStorage.removeItem(CURRENT_ROLE_KEY);
}
