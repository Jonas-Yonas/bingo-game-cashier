"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBingoStore } from "@/app/stores/bingoStore";
import { useState } from "react";

export function PreviewPlayersDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { players } = useBingoStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Custom trigger button passed as children */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-5xl sm:max-w-full dark:bg-gray-900/80 bg-gray-300">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold dark:text-gray-300">
            Selected Players Preview
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto px-2">
          <div
            className="grid min-w-[900px]"
            style={{
              gridTemplateColumns: "repeat(25, minmax(0, 1fr))",
              gap: "0.3rem",
            }}
          >
            {Array.from({ length: 200 }, (_, i) => i + 1).map((number) => (
              <div
                key={number}
                className={`aspect-square w-full flex items-center justify-center rounded text-white font-semibold text-sm sm:text-lg ${
                  players.includes(number)
                    ? "bg-red-500"
                    : "bg-gray-400 dark:bg-blue-600"
                }`}
              >
                {number}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="dark:bg-yellow-300 hover:bg-gray-800 text-gray-950 font-medium px-12 py-2 rounded-lg animate-pulse transform transition duration-500 ease-in-out"
            onClick={() => setOpen(false)}
          >
            Resume Game
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
