"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WinnerModal from "@/app/components/WinnerModal";
import { useBingoStore } from "@/app/stores/bingoStore";
import { toast } from "sonner";
import { BINGO_CARDS } from "@/app/lib/utils";

import { ConfirmResetDialog } from "@/app/components/ConfirmResetDialog";
import useAudioManager from "@/hooks/useAudioManager";
import { BingoBoard } from "@/app/components/caller/BingoBoard";
import { BingoControls } from "@/app/components/caller/BingoControls";
import { BingoSidebar } from "@/app/components/caller/BingoSidebar";
import { useResolvedShopId } from "@/hooks/useResolvedShopId";
import { Spinner } from "@/components/ui/spinner";
import { useGameStore } from "@/app/stores/gameStore";

export default function BingoCallerPage() {
  const { playAudio } = useAudioManager();
  const shopId = useResolvedShopId();

  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    betAmount,
    players,
    calledNumbers,
    prizePool,
    callNumber,
    resetCalledNumbers,
    resetGame,
    setPlayers,
    lockedNumbers,
    gameStarted,
    startGameWithDeduction,
  } = useBingoStore();

  //  const { players, betAmount, startGame } = useBingoStore();
  const {
    createGame,
    currentGame,
    isSaving,
    error: gameError,
  } = useGameStore();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
  const [narrator, setNarrator] = useState<"en" | "am">("am");

  const flickerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const flickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize shuffled numbers
  useEffect(() => {
    const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
    setShuffledNumbers(shuffleArray(numbers));
  }, []);

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

    const num = available[0];
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

  // const startAutoPlay = async () => {
  //   setIsAutoPlaying(true);
  //   playAudio("start");
  //   toast.success("Auto-play started");

  //   if (shopId) {
  //     await useBingoStore().syncWallet(shopId);
  //   }
  // };

  const startAutoPlay = async () => {
    try {
      // First create the game record
      await createGame(shopId as string, betAmount, ["5", "8"]);

      // Then handle the financial transactions
      // await startGame();

      setIsAutoPlaying(true);
      playAudio("start");
      toast.success("Auto-play started");

      if (shopId) {
        await useBingoStore().syncWallet(shopId);
      }

      // Game is now active in both stores
    } catch (err) {
      console.error("Failed to start game:", err);
    }
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
    if (calledNumbers.length !== 0) return;

    const audio = new Audio("/audios/shuffle.mp3");
    startFlickerEffect();

    await new Promise<void>((resolve) => {
      audio.onended = () => {
        stopFlickerEffect();
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

    const flickerDuration = 5000;
    const flickerInterval = 150;

    const numbers = Array.from({ length: 5 }, (_, row) =>
      Array.from({ length: 15 }, (_, col) => row * 15 + col + 1)
    ).flat();

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
    setFlickerNumbers(new Set());
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
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!gameStarted && shopId) {
      startGameWithDeduction(shopId).catch(console.error);
    }
  }, [gameStarted, shopId]);

  useEffect(() => {
    if (gameStarted) {
      setLoading(false);
      return;
    }

    if (!shopId) {
      setError("No shop associated");
      return;
    }

    const initializeGame = async () => {
      try {
        await startGameWithDeduction(shopId);
      } catch (err) {
        setError("Failed to start game. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeGame();
  }, [gameStarted, shopId]);

  if (status === "loading" || !session) return null;

  if (error) return <div className="text-red-500">{error}</div>;

  if (loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="flex flex-col gap-4 items-center">
          <Spinner size="lg" />
          <p className="text-muted-foreground text-sm">Starting game ...</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Main Game Area */}
      <div
        className="flex flex-1 w-full"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <BingoSidebar calledNumbers={calledNumbers} currentCall={currentCall} />

        <BingoBoard
          calledNumbers={calledNumbers}
          currentCall={currentCall}
          flickerNumbers={flickerNumbers}
          getLetterForNumber={getLetterForNumber}
        />
      </div>

      <BingoControls
        calledNumbers={calledNumbers}
        currentCall={currentCall}
        isAutoPlaying={isAutoPlaying}
        prizePool={prizePool}
        players={players}
        cardNumber={cardNumber}
        callerLanguage={callerLanguage}
        onStartAutoPlay={startAutoPlay}
        onPauseAutoPlay={pauseAutoPlay}
        onShuffleNumbers={shuffleNumbers}
        onReset={() => setConfirmResetOpen(true)}
        onCheckWinner={checkWinner}
        onCardNumberChange={setCardNumber}
        onCallerLanguageChange={(value) => {
          setCallerLanguage(value);
          setNarrator(value === "English" ? "en" : "am");
        }}
        onPreviewActivePlayers={previewActivePlayers}
      />

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
