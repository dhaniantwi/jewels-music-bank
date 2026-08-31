/**
 * Audio file storage using IndexedDB.
 *
 * Audio files are stored separately from the normal song data because
 * LocalStorage cannot reliably store File/Blob objects.
 */

const DB_NAME = 'jewels-music-audio';
const DB_VERSION = 1;
const STORE_NAME = 'audioFiles';

interface AudioRecord {
  songId: number;
  file: Blob;
  fileName: string;
  fileType: string;
  fileSize: number;
}

const openDatabase = (): Promise<IDBDatabase> => {
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
          keyPath: 'songId'
        });
      }
    };
  });
};

/**
 * Save or replace an audio file for a song.
 */
export const saveAudioFile = async (
  songId: number,
  file: File
): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const record: AudioRecord = {
      songId,
      file,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    };

    const request = store.put(record);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };

    transaction.onerror = () => {
      reject(transaction.error);
      db.close();
    };
  });
};

/**
 * Get an audio file for a song.
 */
export const getAudioFile = async (
  songId: number
): Promise<File | Blob | null> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(songId);

    request.onsuccess = () => {
      const record = request.result as AudioRecord | undefined;

      if (!record) {
        resolve(null);
        return;
      }

      /*
       * Re-create a File where possible so the existing
       * SongDetailModal continues to work normally.
       */
      try {
        const file = new File(
          [record.file],
          record.fileName,
          {
            type: record.fileType || 'audio/mpeg'
          }
        );

        resolve(file);
      } catch {
        resolve(record.file);
      }
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };

    transaction.onerror = () => {
      reject(transaction.error);
      db.close();
    };
  });
};

/**
 * Delete an audio file for a song.
 */
export const deleteAudioFile = async (
  songId: number
): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(songId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };

    transaction.onerror = () => {
      reject(transaction.error);
      db.close();
    };
  });
};

/**
 * Check whether an audio file exists for a song.
 */
export const hasAudioFile = async (
  songId: number
): Promise<boolean> => {
  const file = await getAudioFile(songId);
  return !!file;
};
