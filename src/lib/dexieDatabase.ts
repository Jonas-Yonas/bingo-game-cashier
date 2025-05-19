import Dexie, { Table } from "dexie";

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

    await db.audioFiles.add({
      name: fileName,
      blob: audioBlob,
    });

    return true;
  } catch (error) {
    console.error("Error saving audio file:", error);
    return false;
  }
};

export const getAudioFromIndexedDB = async (
  fileName: string
): Promise<string | null> => {
  try {
    const audioFile = await db.audioFiles
      .where("name")
      .equals(fileName)
      .first();
    return audioFile ? URL.createObjectURL(audioFile.blob) : null;
  } catch (error) {
    console.error("Error retrieving audio file:", error);
    return null;
  }
};

export const checkAudioFilesLoaded = async (): Promise<string> => {
  const audioKeys = [
    "start",
    "stop",
    "bingo",
    "shuffle",
    "b1Audio",
    "b2Audio",
    "b3Audio",
    "b4Audio",
    "b5Audio",
    "b6Audio",
    "b7Audio",
    "b8Audio",
    "b9Audio",
    "b10Audio",
    "b11Audio",
    "b12Audio",
    "b13Audio",
    "b14Audio",
    "b15Audio",
    "i16Audio",
    "i17Audio",
    "i18Audio",
    "i19Audio",
    "i20Audio",
    "i21Audio",
    "i22Audio",
    "i23Audio",
    "i24Audio",
    "i25Audio",
    "i26Audio",
    "i27Audio",
    "i28Audio",
    "i29Audio",
    "i30Audio",
    "n31Audio",
    "n32Audio",
    "n33Audio",
    "n34Audio",
    "n35Audio",
    "n36Audio",
    "n37Audio",
    "n38Audio",
    "n39Audio",
    "n40Audio",
    "n41Audio",
    "n42Audio",
    "n43Audio",
    "n44Audio",
    "n45Audio",
    "g46Audio",
    "g47Audio",
    "g48Audio",
    "g49Audio",
    "g50Audio",
    "g51Audio",
    "g52Audio",
    "g53Audio",
    "g54Audio",
    "g55Audio",
    "g56Audio",
    "g57Audio",
    "g58Audio",
    "g59Audio",
    "g60Audio",
    "o61Audio",
    "o62Audio",
    "o63Audio",
    "o64Audio",
    "o65Audio",
    "o66Audio",
    "o67Audio",
    "o68Audio",
    "o69Audio",
    "o70Audio",
    "o71Audio",
    "o72Audio",
    "o73Audio",
    "o74Audio",
    "o75Audio",
  ];

  const audioFiles = await Promise.all(
    audioKeys.map((key) => getAudioFromIndexedDB(key))
  );

  const allLoaded = audioFiles.every((file) => file !== null);

  if (allLoaded) {
    console.log("All audio files loaded successfully.");
    return Promise.resolve("Audio files are successfully loaded.");
  }

  console.warn("Some audio files are missing.");

  try {
    await clearDatabase();

    const saveOperations = [
      saveAudioToIndexedDB("start", "/audios/start.mp3"),
      saveAudioToIndexedDB("stop", "/audios/stop.mp3"),
      saveAudioToIndexedDB("bingo", "/audios/bingo.mp3"),
      saveAudioToIndexedDB("shuffle", "/audios/shuffle.mp3"),
      saveAudioToIndexedDB("b1Audio", "/audios/b1.mp3"),
      saveAudioToIndexedDB("b2Audio", "/audios/b2.mp3"),
      saveAudioToIndexedDB("b3Audio", "/audios/b3.mp3"),
      saveAudioToIndexedDB("b4Audio", "/audios/b4.mp3"),
      saveAudioToIndexedDB("b5Audio", "/audios/b5.mp3"),
      saveAudioToIndexedDB("b6Audio", "/audios/b6.mp3"),
      saveAudioToIndexedDB("b7Audio", "/audios/b7.mp3"),
      saveAudioToIndexedDB("b8Audio", "/audios/b8.mp3"),
      saveAudioToIndexedDB("b9Audio", "/audios/b9.mp3"),
      saveAudioToIndexedDB("b10Audio", "/audios/b10.mp3"),
      saveAudioToIndexedDB("b11Audio", "/audios/b11.mp3"),
      saveAudioToIndexedDB("b12Audio", "/audios/b12.mp3"),
      saveAudioToIndexedDB("b13Audio", "/audios/b13.mp3"),
      saveAudioToIndexedDB("b14Audio", "/audios/b14.mp3"),
      saveAudioToIndexedDB("b15Audio", "/audios/b15.mp3"),
      saveAudioToIndexedDB("i16Audio", "/audios/i16.mp3"),
      saveAudioToIndexedDB("i17Audio", "/audios/i17.mp3"),
      saveAudioToIndexedDB("i18Audio", "/audios/i18.mp3"),
      saveAudioToIndexedDB("i19Audio", "/audios/i19.mp3"),
      saveAudioToIndexedDB("i20Audio", "/audios/i20.mp3"),
      saveAudioToIndexedDB("i21Audio", "/audios/i21.mp3"),
      saveAudioToIndexedDB("i22Audio", "/audios/i22.mp3"),
      saveAudioToIndexedDB("i23Audio", "/audios/i23.mp3"),
      saveAudioToIndexedDB("i24Audio", "/audios/i24.mp3"),
      saveAudioToIndexedDB("i25Audio", "/audios/i25.mp3"),
      saveAudioToIndexedDB("i26Audio", "/audios/i26.mp3"),
      saveAudioToIndexedDB("i27Audio", "/audios/i27.mp3"),
      saveAudioToIndexedDB("i28Audio", "/audios/i28.mp3"),
      saveAudioToIndexedDB("i29Audio", "/audios/i29.mp3"),
      saveAudioToIndexedDB("i30Audio", "/audios/i30.mp3"),
      saveAudioToIndexedDB("n31Audio", "/audios/n31.mp3"),
      saveAudioToIndexedDB("n32Audio", "/audios/n32.mp3"),
      saveAudioToIndexedDB("n33Audio", "/audios/n33.mp3"),
      saveAudioToIndexedDB("n34Audio", "/audios/n34.mp3"),
      saveAudioToIndexedDB("n35Audio", "/audios/n35.mp3"),
      saveAudioToIndexedDB("n36Audio", "/audios/n36.mp3"),
      saveAudioToIndexedDB("n37Audio", "/audios/n37.mp3"),
      saveAudioToIndexedDB("n38Audio", "/audios/n38.mp3"),
      saveAudioToIndexedDB("n39Audio", "/audios/n39.mp3"),
      saveAudioToIndexedDB("n40Audio", "/audios/n40.mp3"),
      saveAudioToIndexedDB("n41Audio", "/audios/n41.mp3"),
      saveAudioToIndexedDB("n42Audio", "/audios/n42.mp3"),
      saveAudioToIndexedDB("n43Audio", "/audios/n43.mp3"),
      saveAudioToIndexedDB("n44Audio", "/audios/n44.mp3"),
      saveAudioToIndexedDB("n45Audio", "/audios/n45.mp3"),
      saveAudioToIndexedDB("g46Audio", "/audios/g46.mp3"),
      saveAudioToIndexedDB("g47Audio", "/audios/g47.mp3"),
      saveAudioToIndexedDB("g48Audio", "/audios/g48.mp3"),
      saveAudioToIndexedDB("g49Audio", "/audios/g49.mp3"),
      saveAudioToIndexedDB("g50Audio", "/audios/g50.mp3"),
      saveAudioToIndexedDB("g51Audio", "/audios/g51.mp3"),
      saveAudioToIndexedDB("g52Audio", "/audios/g52.mp3"),
      saveAudioToIndexedDB("g53Audio", "/audios/g53.mp3"),
      saveAudioToIndexedDB("g54Audio", "/audios/g54.mp3"),
      saveAudioToIndexedDB("g55Audio", "/audios/g55.mp3"),
      saveAudioToIndexedDB("g56Audio", "/audios/g56.mp3"),
      saveAudioToIndexedDB("g57Audio", "/audios/g57.mp3"),
      saveAudioToIndexedDB("g58Audio", "/audios/g58.mp3"),
      saveAudioToIndexedDB("g59Audio", "/audios/g59.mp3"),
      saveAudioToIndexedDB("g60Audio", "/audios/g60.mp3"),
      saveAudioToIndexedDB("o61Audio", "/audios/o61.mp3"),
      saveAudioToIndexedDB("o62Audio", "/audios/o62.mp3"),
      saveAudioToIndexedDB("o63Audio", "/audios/o63.mp3"),
      saveAudioToIndexedDB("o64Audio", "/audios/o64.mp3"),
      saveAudioToIndexedDB("o65Audio", "/audios/o65.mp3"),
      saveAudioToIndexedDB("o66Audio", "/audios/o66.mp3"),
      saveAudioToIndexedDB("o67Audio", "/audios/o67.mp3"),
      saveAudioToIndexedDB("o68Audio", "/audios/o68.mp3"),
      saveAudioToIndexedDB("o69Audio", "/audios/o69.mp3"),
      saveAudioToIndexedDB("o70Audio", "/audios/o70.mp3"),
      saveAudioToIndexedDB("o71Audio", "/audios/o71.mp3"),
      saveAudioToIndexedDB("o72Audio", "/audios/o72.mp3"),
      saveAudioToIndexedDB("o73Audio", "/audios/o73.mp3"),
      saveAudioToIndexedDB("o74Audio", "/audios/o74.mp3"),
      saveAudioToIndexedDB("o75Audio", "/audios/o75.mp3"),
    ];

    const results = await Promise.all(saveOperations);
    const allSaved = results.every((result) => result === true);

    if (allSaved) {
      return Promise.resolve("Audio files are successfully loaded.");
    } else {
      return Promise.reject("Audio files failed to load.");
    }
  } catch (error) {
    console.error("Error retrieving audio file again:", error);
    return Promise.reject("Audio files failed to load.");
  }
};
