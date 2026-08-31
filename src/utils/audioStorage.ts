const DB_NAME = 'jewels_music_hub_audio';
const STORE_NAME = 'songs_audio';
const DB_VERSION = 1;

interface AudioRecord {
  songId: number;
  file: File;
}

/**
 * Opens the IndexedDB database used to store song audio files.
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'songId',
        });
      }
    };
  });
}

/**
 * Saves or replaces an audio file for a song.
 */
export async function saveAudioFile(
  songId: number,
  file: File
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readwrite'
    );

    const store = transaction.objectStore(STORE_NAME);

    const record: AudioRecord = {
      songId,
      file,
    };

    store.put(record);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

/**
 * Retrieves the audio file belonging to a song.
 */
export async function getAudioFile(
  songId: number
): Promise<File | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readonly'
    );

    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(songId);

    request.onsuccess = () => {
      const record = request.result as
        | AudioRecord
        | undefined;

      db.close();
      resolve(record?.file ?? null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Deletes the audio file belonging to a song.
 */
export async function deleteAudioFile(
  songId: number
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readwrite'
    );

    const store = transaction.objectStore(STORE_NAME);

    store.delete(songId);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
}
