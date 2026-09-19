/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Audio storage utility for Jewels Music Hub.
 *
 * Audio files are stored in Supabase Storage so they can be
 * accessed across devices and by all authorized users.
 */

import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'songs';
const AUDIO_FOLDER = 'audio';

/**
 * Create a safe filename for Supabase Storage.
 */
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '_');
};

/**
 * Build the storage path for a song's audio file.
 */
const getAudioPath = (
  songId: string,
  fileName: string
): string => {
  return `${AUDIO_FOLDER}/${songId}-${sanitizeFileName(fileName)}`;
};

/**
 * Upload an audio file for a song.
 *
 * Returns the public URL of the uploaded file.
 */
export const saveAudioFile = async (
  songId: string,
  file: File
): Promise<string> => {
  if (!file) {
    throw new Error('No audio file was provided.');
  }

  if (!songId) {
    throw new Error('A valid song ID is required.');
  }

  const filePath = getAudioPath(
    songId,
    file.name
  );

  const { error: uploadError } = await supabase
    .storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType: file.type || 'audio/mpeg',
      upsert: true
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: publicUrlData
  } = supabase
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error(
      'Could not generate the public audio URL.'
    );
  }

  return publicUrlData.publicUrl;
};

/**
 * Get the public audio URL for a song.
 *
 * This uses the audio URL stored in the songs table.
 */
export const getAudioUrl = (
  audioUrl?: string
): string | null => {
  if (!audioUrl) {
    return null;
  }

  return audioUrl;
};

/**
 * Delete a song's audio file from Supabase Storage.
 *
 * The song ID is used to locate files belonging to that song.
 */
export const deleteAudioFile = async (
  songId: string,
  fileName?: string
): Promise<void> => {
  if (!songId) {
    return;
  }

  if (fileName) {
    const filePath = getAudioPath(
      songId,
      fileName
    );

    const { error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return;
  }

  /*
   * If the exact filename is unknown, find all files
   * belonging to this song and remove them.
   */
  const { data: files, error: listError } =
    await supabase
      .storage
      .from(BUCKET_NAME)
      .list(AUDIO_FOLDER);

  if (listError) {
    throw listError;
  }

  const matchingFiles = (files || [])
    .filter(file =>
      file.name.startsWith(`${songId}-`)
    )
    .map(file =>
      `${AUDIO_FOLDER}/${file.name}`
    );

  if (matchingFiles.length === 0) {
    return;
  }

  const { error: removeError } =
    await supabase
      .storage
      .from(BUCKET_NAME)
      .remove(matchingFiles);

  if (removeError) {
    throw removeError;
  }
};

/**
 * Check whether a song has an audio URL.
 */
export const hasAudioFile = (
  audioUrl?: string
): boolean => {
  return Boolean(audioUrl);
};

/**
 * Remove all audio files from the audio folder.
 *
 * This should only be used by an administrator.
 */
export const clearAllAudioFiles = async (): Promise<void> => {
  const { data: files, error: listError } =
    await supabase
      .storage
      .from(BUCKET_NAME)
      .list(AUDIO_FOLDER);

  if (listError) {
    throw listError;
  }

  if (!files || files.length === 0) {
    return;
  }

  const filePaths = files.map(file =>
    `${AUDIO_FOLDER}/${file.name}`
  );

  const { error: removeError } =
    await supabase
      .storage
      .from(BUCKET_NAME)
      .remove(filePaths);

  if (removeError) {
    throw removeError;
  }
};
