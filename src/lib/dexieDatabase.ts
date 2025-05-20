import Dexie, { Table } from "dexie";

// -----------------------------
// Interfaces & DB Setup
// -----------------------------
interface AudioFile {
  id?: number;
  name: string;
  blob: Blob;
}

class AudioDatabase extends Dexie {
  audioFiles!: Table<AudioFile>;

  constructor() {
    super("AudioDatabase");
    this.version(1).stores({
      audioFiles: "++id,name,blob",
    });
  }
}

let db = new AudioDatabase();

// -----------------------------
// Audio Keys & Paths
// -----------------------------
const audioKeys = [
  "start",
  "stop",
  "bingo",
  "shuffle",
  ...Array.from({ length: 15 }, (_, i) => `b${i + 1}Audio`),
  ...Array.from({ length: 15 }, (_, i) => `i${i + 16}Audio`),
  ...Array.from({ length: 15 }, (_, i) => `n${i + 31}Audio`),
  ...Array.from({ length: 15 }, (_, i) => `g${i + 46}Audio`),
  ...Array.from({ length: 15 }, (_, i) => `o${i + 61}Audio`),
];

const getAudioFilePath = (key: string) => {
  const name = key.replace("Audio", "").toLowerCase();
  return `/audios/${name}.mp3`;
};

// -----------------------------
// Core Helpers
// -----------------------------
export const clearDatabase = async (): Promise<void> => {
  try {
    await db.delete();
    db = new AudioDatabase();
  } catch (error) {
    console.error("Failed to reset database:", error);
  }
};

export const saveAudioToIndexedDB = async (
  fileName: string,
  fileUrl: string
): Promise<boolean> => {
  try {
    const response = await fetch(fileUrl);
    const audioBlob = await response.blob();

    await db.audioFiles.add({ name: fileName, blob: audioBlob });
    return true;
  } catch (error) {
    console.error(`Error saving ${fileName}:`, error);
    return false;
  }
};

export const getAudioFromIndexedDB = async (
  fileName: string
): Promise<string | null> => {
  try {
    const file = await db.audioFiles.where("name").equals(fileName).first();
    return file ? URL.createObjectURL(file.blob) : null;
  } catch (error) {
    console.error(`Error retrieving ${fileName}:`, error);
    return null;
  }
};

// -----------------------------
// Load & Validate
// -----------------------------
export const checkAudioFilesLoaded = async (): Promise<string> => {
  const files = await Promise.all(audioKeys.map(getAudioFromIndexedDB));
  const allLoaded = files.every(Boolean);

  if (allLoaded) {
    console.log("All audio files loaded.");
    return "Audio files are successfully loaded.";
  }

  console.warn("Missing audio files. Reloading...");
  try {
    await clearDatabase();

    const saveResults = await Promise.all(
      audioKeys.map((key) => saveAudioToIndexedDB(key, getAudioFilePath(key)))
    );

    if (saveResults.every(Boolean)) {
      return "Audio files are successfully loaded.";
    } else {
      throw new Error("Some files failed to save.");
    }
  } catch (error) {
    console.error("Error loading audio files:", error);
    throw new Error("Audio files failed to load.");
  }
};

export const loadAllAudiosSimple = async (): Promise<boolean> => {
  try {
    await db.audioFiles.clear();

    await Promise.all(
      audioKeys.map((key) => saveAudioToIndexedDB(key, getAudioFilePath(key)))
    );

    return true;
  } catch (error) {
    console.error("Audio loading failed:", error);
    return false;
  }
};
