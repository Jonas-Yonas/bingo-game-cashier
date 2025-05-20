"use client";

import { useEffect } from "react";

export default function AudioInitializer() {
  useEffect(() => {
    // Mobile audio unlock
    const handleFirstInteraction = () => {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."
      );
      audio.volume = 0;
      audio
        .play()
        .then(() => console.debug("Audio context unlocked"))
        .catch((e) => console.debug("Audio unlock failed:", e));
      document.removeEventListener("click", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    return () => document.removeEventListener("click", handleFirstInteraction);
  }, []);

  return null;
}
