import { getAudioFromIndexedDB } from "@/lib/dexieDatabase";
import { useEffect, useRef } from "react";

type AudioFiles = Record<string, HTMLAudioElement>;

export default function useAudioManager() {
  const audioRefs = useRef<AudioFiles>({});
  const audioQueue = useRef<HTMLAudioElement[]>([]);
  const isPlaying = useRef(false);

  const loadAudioFile = async (key: string) => {
    try {
      const url = await getAudioFromIndexedDB(key);
      if (url) {
        const audio = new Audio(url);
        audio.preload = "auto";
        audioRefs.current[key] = audio;
        return true;
      }
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
    }
    return false;
  };

  const initAudio = async () => {
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

    await Promise.all(audioKeys.map(loadAudioFile));
  };

  const playAudio = (key: string) => {
    const audio = audioRefs.current[key];
    if (!audio) return;

    audioQueue.current.push(audio.cloneNode() as HTMLAudioElement); // Clone to allow overlaps
    processQueue();
  };

  const processQueue = () => {
    if (isPlaying.current || audioQueue.current.length === 0) return;

    const audio = audioQueue.current.shift()!;
    isPlaying.current = true;

    audio.onended = () => {
      isPlaying.current = false;
      processQueue();
    };

    audio.play().catch((error) => {
      console.error("Playback failed:", error);
      isPlaying.current = false;
      processQueue();
    });
  };

  useEffect(() => {
    initAudio();
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.removeAttribute("src");
      });
    };
  }, []);

  return { playAudio };
}
