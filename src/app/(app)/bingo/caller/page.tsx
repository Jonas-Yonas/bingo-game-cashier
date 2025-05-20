"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WinnerModal from "@/app/components/WinnerModal";
import { useBingoStore } from "@/app/stores/bingoStore";
import { toast } from "sonner";
import { BINGO_CARDS } from "@/app/lib/utils";

import { ConfirmResetDialog } from "@/app/components/ConfirmResetDialog";
import { PreviewPlayersDialog } from "@/app/components/CustomPreviewDialog";
import useAudioManager from "@/app/hooks/useAudioManager";
import { BingoBall } from "@/app/components/BingoBalls";

export default function BingoCallerPage() {
  const { playAudio } = useAudioManager();

  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    players,
    calledNumbers,
    prizePool,
    callNumber,
    resetCalledNumbers,
    resetGame,
    setPlayers,
    removePlayer,
    lockedNumbers,
    addLockedNumber,
  } = useBingoStore();

  // Authentication and authorization check
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/(public)/(auth)/login");
    } else if (session.user.role !== "CASHIER") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  // Game state
  const [currentCall, setCurrentCall] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [callerLanguage, setCallerLanguage] = useState("Amharic");
  const [cardNumber, setCardNumber] = useState("");
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [lastCheckedCard, setLastCheckedCard] = useState<string | null>(null);
  const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const [flickerNumbers, setFlickerNumbers] = useState<Set<number>>(new Set());

  const flickerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const flickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [narrator, setNarrator] = useState<"en" | "am">("am"); // 'am' for Amharic audio, 'en' for English TTS

  // Initialize shuffled numbers
  useEffect(() => {
    const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
    setShuffledNumbers(shuffleArray(numbers));
  }, []);

  // Generate BINGO number grid
  const numberRows = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 15 }, (_, col) => row * 15 + col + 1)
  );

  const getLetterForNumber = (num: number) => {
    if (num <= 15) return "B";
    if (num <= 30) return "I";
    if (num <= 45) return "N";
    if (num <= 60) return "G";
    return "O";
  };

  const previewActivePlayers = () => {
    setIsAutoPlaying(false);
  };

  const checkWinner = () => {
    setIsAutoPlaying(false);

    if (!cardNumber) return;

    // Check if card is locked first
    if (lockedNumbers.includes(Number(cardNumber))) {
      toast.error(`Card ${cardNumber} is locked for this game`);
      return;
    }

    if (!players.includes(Number(cardNumber))) {
      toast.error(`Card ${cardNumber} is not registered in this game`);
      return;
    }

    if (!BINGO_CARDS[cardNumber as keyof typeof BINGO_CARDS]) {
      toast.error(`Invalid card number`);
      return;
    }

    setLastCheckedCard(cardNumber);
    setShowWinnerModal(true);
  };

  const callRandomNumber = useCallback(() => {
    const available = shuffledNumbers.filter(
      (n) => !calledNumbers.includes(n) && !lockedNumbers.includes(n)
    );

    if (available.length === 0) {
      setIsAutoPlaying(false);

      toast.error("All numbers have been called!");
      return null;
    }

    const num = available[0]; // Get next number from shuffled array
    const letter = getLetterForNumber(num);
    const call = `${letter}${num}`;

    // Audio announcement
    if (narrator === "am") {
      playAudio(`${letter.toLowerCase()}${num}Audio`);
    } else {
      // English TTS
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = `${letter}-${num}`;
      const voice = synth
        .getVoices()
        .find((v) =>
          v.name.includes("Microsoft David - English (United States)")
        );
      if (voice) utterance.voice = voice;
      synth.speak(utterance);
    }

    callNumber(num);
    setCurrentCall(call);
    return num;
  }, [
    shuffledNumbers,
    calledNumbers,
    lockedNumbers,
    callNumber,
    playAudio,
    narrator,
  ]);

  const startAutoPlay = () => {
    setIsAutoPlaying(true);
    playAudio("start");
    toast.success("Auto-play started");
  };

  const pauseAutoPlay = async () => {
    try {
      await playAudio("stop");
      setIsAutoPlaying(false);
      toast("Auto-play paused");
    } catch (error) {
      console.error("Error stopping game:", error);
    }
  };

  const handleResetBoard = () => {
    resetGame();
    resetCalledNumbers();

    setCurrentCall(null);
    toast("Board has been reset");
    router.push("/bingo");
    setConfirmResetOpen(false);
  };

  const shuffleNumbers = async () => {
    if (calledNumbers.length !== 0) return; // disable if numbers called

    const audio = new Audio("/audios/shuffle.mp3");

    startFlickerEffect();

    await new Promise<void>((resolve) => {
      audio.onended = () => {
        stopFlickerEffect(); // stop flickering exactly when audio ends
        resolve();
      };
      audio.play();
    });

    const newShuffled = shuffleArray([...calledNumbers]);
    resetCalledNumbers();
    newShuffled.forEach((num) => callNumber(num));
    toast.success("Numbers have been reshuffled");
  };

  const startFlickerEffect = () => {
    if (flickerIntervalRef.current) clearInterval(flickerIntervalRef.current);
    if (flickerTimeoutRef.current) clearTimeout(flickerTimeoutRef.current);

    const flickerDuration = 5000; // 5 seconds
    const flickerInterval = 150;

    const numbers = numberRows.flat();

    flickerIntervalRef.current = setInterval(() => {
      setFlickerNumbers(() => {
        const newSet = new Set<number>();
        numbers.forEach((num) => {
          if (Math.random() > 0.5) newSet.add(num);
        });
        return newSet;
      });
    }, flickerInterval);

    flickerTimeoutRef.current = setTimeout(() => {
      if (flickerIntervalRef.current) {
        clearInterval(flickerIntervalRef.current);
        flickerIntervalRef.current = null;
      }
      flickerTimeoutRef.current = null;
      setFlickerNumbers(new Set());
    }, flickerDuration);
  };

  const stopFlickerEffect = () => {
    if (flickerIntervalRef.current) {
      clearInterval(flickerIntervalRef.current);
      flickerIntervalRef.current = null;
    }
    if (flickerTimeoutRef.current) {
      clearTimeout(flickerTimeoutRef.current);
      flickerTimeoutRef.current = null;
    }
    setFlickerNumbers(new Set()); // clear flicker highlights immediately
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = isAutoPlaying ? setInterval(callRandomNumber, 3000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, callRandomNumber]);

  // Load players from URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const playersParam = searchParams.get("players");
    if (playersParam) {
      setPlayers(JSON.parse(playersParam));
    }
  }, [setPlayers]);

  useEffect(() => {
    return () => {
      // Cancel any pending speech
      window.speechSynthesis.cancel();
    };
  }, []);

  if (status === "loading" || !session) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Main Game Area */}
      <div
        className="flex flex-1 w-full"
        style={{ height: "calc(100vh - 80px)" }}
      >
        {/* Left Sidebar */}
        <div className="w-40 bg-white dark:bg-gray-800 p-2 flex flex-col border-r border-gray-200 dark:border-gray-700 pt-10">
          <div className="flex justify-between mb-3">
            <div className="text-center">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Total
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {calledNumbers.length}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Last
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {currentCall || "--"}
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-1">
            <BingoBall />

            <div className="text-lg font-bold text-red-600 dark:text-red-400 mt-1 text-center">
              BINGO <br />
              <span className="text-2xl text-yellow-500">BLAST</span>
            </div>
          </div>
        </div>

        {/* Main Board */}
        <div className="flex-1 flex relative min-w-0">
          {/* Bingo Letters - Left */}
          <div className="w-8 flex flex-col px-6">
            {["B", "I", "N", "G", "O"].map((letter) => (
              <div
                key={`left-${letter}`}
                className="h-[20%] flex items-center justify-center bg-gray-100 dark:bg-gray-800"
              >
                <div className="text-4xl font-black text-gray-800 dark:text-blue-600">
                  {letter}
                </div>
              </div>
            ))}
          </div>

          {/* Numbers Grid */}
          <div className="flex-1 flex flex-col gap-y-1 pt-1">
            {numberRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-1 gap-x-1">
                {row.map((num) => (
                  <div
                    key={num}
                    className={`flex-1 flex items-center justify-center text-3xl font-bold border border-gray-300 dark:border-gray-600 rounded-sm
                   ${
                     calledNumbers.includes(num)
                       ? "bg-emerald-600 text-gray-200"
                       : "bg-gray-200 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600"
                   }
                   ${
                     currentCall === `${getLetterForNumber(num)}${num}`
                       ? "ring-2 ring-yellow-500 shadow-lg animate-pulse"
                       : ""
                   }
                   ${
                     flickerNumbers.has(num)
                       ? "shadow-[0_0_10px_3px_rgba(255,192,203,0.75)]"
                       : ""
                   }
                 `}
                  >
                    {num}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bingo Letters - Right */}
          <div className="w-8 flex flex-col px-6">
            {["B", "I", "N", "G", "O"].map((letter) => (
              <div
                key={`right-${letter}`}
                className="h-[20%] flex items-center justify-center bg-gray-100 dark:bg-gray-800"
              >
                <div className="text-4xl font-black text-gray-800 dark:text-blue-600 rounded-md">
                  {letter}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white dark:bg-gray-800 p-2 border-t border-gray-200 dark:border-gray-700 h-32 mt-8">
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-2 h-24 py-2">
          {/* Current Call Display */}
          <div className="flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center 
                  ring-8 ring-blue-400 ring-offset-4 ring-offset-white shadow-xl"
            >
              <span className="text-3xl font-extrabold text-white drop-shadow-md">
                {currentCall || "?"}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={startAutoPlay}
              disabled={isAutoPlaying || calledNumbers.length === 75}
              className="bg-green-600 hover:bg-green-700 text-white px-1 py-0.5 rounded text-xs disabled:bg-gray-400"
            >
              Start Auto
            </button>
            <button
              onClick={pauseAutoPlay}
              disabled={!isAutoPlaying}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-1 py-0.5 rounded text-xs disabled:bg-gray-400"
            >
              Pause
            </button>
            <button
              onClick={shuffleNumbers}
              disabled={calledNumbers.length !== 0}
              className="bg-pink-600 hover:bg-pink-700 text-white px-1 py-0.5 rounded text-xs disabled:bg-gray-400"
            >
              Shuffle
            </button>
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                setConfirmResetOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-1 py-0.5 rounded text-xs"
            >
              Reset
            </button>
          </div>

          {/* Right Controls */}
          <div className="grid grid-cols-1 gap-1 w-full">
            <div className="flex gap-1 h-10">
              <select
                value={callerLanguage}
                onChange={(e) => {
                  setCallerLanguage(e.target.value);
                  setNarrator(e.target.value === "English" ? "en" : "am");
                }}
                className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-xs"
              >
                <option value="English">English</option>
                <option value="Amharic">Amharic</option>
              </select>
            </div>

            <div className="flex gap-1 h-10">
              <div className="flex justify-between">
                <input
                  type="number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card #"
                  className="flex bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-xl rounded-r-none w-1/2"
                  min="1"
                />
                <button
                  onClick={checkWinner}
                  disabled={!cardNumber}
                  className="bg-red-600 hover:bg-red-700 text-white px-1 py-0.5 rounded-l-none rounded text-xs disabled:bg-gray-400 w-1/2"
                >
                  Check Winner
                </button>
              </div>
            </div>
          </div>

          {/* Current Amount to Bet */}
          <div className="flex items-center justify-end">
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center ring-8 ring-blue-400           ring-offset-4 ring-offset-white shadow-lg animate-pulse transform transition duration-500 ease-in-out">
              <PreviewPlayersDialog
                trigger={
                  <button
                    className="px-6 py-3 rounded-lg"
                    onClick={previewActivePlayers}
                  >
                    <span className="text-2xl font-extrabold text-white drop-shadow-lg select-none">
                      {prizePool < 1000
                        ? prizePool
                        : Math.round(prizePool / 1000) + "K"}
                    </span>
                  </button>
                }
              />
              {/* Player count badge */}
              {players.length > 0 && (
                <div
                  className="absolute -top-2 -right-6 bg-red-500 text-white text-xs 
                     font-bold rounded-full w-6 h-6 p-4 flex items-center justify-center
                     shadow-md animate-bounce"
                >
                  {players.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {showWinnerModal && lastCheckedCard && (
        <WinnerModal
          cardNumber={lastCheckedCard}
          lastCalledNumber={currentCall}
          onClose={() => setShowWinnerModal(false)}
        />
      )}

      {/* Reset Modal */}
      <ConfirmResetDialog
        open={confirmResetOpen}
        onConfirm={handleResetBoard}
        onCancel={() => setConfirmResetOpen(false)}
        title="Reset the board?"
        description="This will clear all players, called numbers, and prize pool."
        confirmText="Reset"
        cancelText="Cancel"
      />
    </div>
  );
}

// Helper function to shuffle array
function shuffleArray(array: any[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
