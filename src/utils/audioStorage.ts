/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Audio storage utility for Jewels Music Hub.
 *
 * Audio files are stored locally in the browser using IndexedDB.
 * No server or paid storage service is required.
 */

const DB_NAME = 'JewelsMusicHubAudio';
const DB_VERSION = 1;
const STORE_NAME = 'audioFiles';

interface StoredAudio {
  songId: number;
  file: Blob;
  fileName: string;
  fileType: string;
  fileSize: number;
  savedAt: string;
}

/**
 * Open the IndexedDB database.
 */
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(
          STORE_NAME,
          { keyPath: 'songId' }
        );
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(
        request.error ||
        new Error('Could not open audio database.')
      );
    };
  });
};

/**
 * Save an audio file for a song.
 */
export const saveAudioFile = async (
  songId: number,
  file: File
): Promise<void> => {
  if (!file) {
    throw new Error('No audio file was provided.');
  }

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readwrite'
    );

    const store = transaction.objectStore(
      STORE_NAME
    );

    const audioData: StoredAudio = {
      songId,
      file,
      fileName: file.name,
      fileType: file.type || 'audio/mpeg',
      fileSize: file.size,
      savedAt: new Date().toISOString()
    };

    store.put(audioData);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();

      reject(
        transaction.error ||
        new Error('Could not save audio file.')
      );
    };

    transaction.onabort = () => {
      db.close();

      reject(
        transaction.error ||
        new Error('Audio save operation was aborted.')
      );
    };
  });
};

/**
 * Retrieve the stored audio file for a song.
 */
export const getAudioFile = async (
  songId: number
): Promise<StoredAudio | null> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readonly'
    );

    const store = transaction.objectStore(
      STORE_NAME
    );

    const request = store.get(songId);

    request.onsuccess = () => {
      db.close();

      resolve(
        request.result || null
      );
    };

    request.onerror = () => {
      db.close();

      reject(
        request.error ||
        new Error('Could not retrieve audio file.')
      );
    };
  });
};

/**
 * Create a temporary URL for playing a song's audio.
 *
 * Remember to call URL.revokeObjectURL(url)
 * when the audio element is no longer using it.
 */
export const getAudioUrl = async (
  songId: number
): Promise<string | null> => {
  const storedAudio = await getAudioFile(
    songId
  );

  if (!storedAudio) {
    return null;
  }

  return URL.createObjectURL(
    storedAudio.file
  );
};

/**
 * Delete the stored audio file for a song.
 */
export const deleteAudioFile = async (
  songId: number
): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readwrite'
    );

    const store = transaction.objectStore(
      STORE_NAME
    );

    store.delete(songId);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();

      reject(
        transaction.error ||
        new Error('Could not delete audio file.')
      );
    };

    transaction.onabort = () => {
      db.close();

      reject(
        transaction.error ||
        new Error('Audio deletion was aborted.')
      );
    };
  });
};

/**
 * Check whether a song has an audio file stored.
 */
export const hasAudioFile = async (
  songId: number
): Promise<boolean> => {
  const storedAudio = await getAudioFile(
    songId
  );

  return storedAudio !== null;
};

/**
 * Delete every stored audio file.
 */
export const clearAllAudioFiles = async (): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      'readwrite'
    );

    const store = transaction.objectStore(
      STORE_NAME
    );

    store.clear();

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();

      reject(
        transaction.error ||
        new Error('Could not clear audio storage.')
      );
    };

    transaction.onabort = () => {
      db.close();

      reject(
        transaction.error ||
        new Error('Audio storage clearing was aborted.')
      );
    };
  });
};
