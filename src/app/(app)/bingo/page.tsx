"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useBingoStore } from "@/app/stores/bingoStore";
import { Spinner } from "@/components/ui/spinner";
import { BingoFooter } from "@/app/components/bingo/BingoFooter";
import { BingoHeader } from "@/app/components/bingo/BingoHeader";
import { BingoBoard } from "@/app/components/bingo/BingoBoard";
import { useGameStore } from "@/app/stores/gameStore";

type GameState = {
  selectedNumbers: number[];
};

export default function BingoGame() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/(public)/(auth)/login");
    },
  });

  // Get all store methods and state
  const {
    players,
    setPlayers,
    betAmount,
    setBetAmount,
    prizePool,
    getWalletBalance,
    // canStartGame,
    addPlayer,
    removePlayer,
  } = useBingoStore();

  // const canStart = canStartGame();

  // const canStartGame = useBingoStore(
  //   (state) => state.players.length >= 2 && !state.gameStarted
  // );

  const canStartGame = useBingoStore((state) => {
    const gameStore = useGameStore.getState();
    return (
      state.canStartGame() &&
      !gameStore.isSaving &&
      gameStore.currentGame.id === null
    );
  });

  // Calculate current wallet amount
  const walletAmount = getWalletBalance();

  // Numbers for the board
  const numbers = Array.from({ length: 200 }, (_, i) => i + 1);

  const [gameState, setGameState] = useState<GameState>({
    selectedNumbers: [],
  });
  const [isStarting, setIsStarting] = useState(false);

  // Clear all selections
  const clearSelection = () => {
    setGameState({ selectedNumbers: [] });
    setPlayers([]);
  };

  // Toggle number selection and manage players
  const toggleNumberSelection = (number: number) => {
    setGameState((prev) => {
      const isSelected = prev.selectedNumbers.includes(number);
      const newSelected = isSelected
        ? prev.selectedNumbers.filter((n) => n !== number)
        : [...prev.selectedNumbers, number];

      // Update players in store
      if (isSelected) {
        removePlayer(number);
      } else {
        addPlayer(number);
      }

      return { selectedNumbers: isSelected ? newSelected : newSelected };
    });
  };

  // Start game handler
  const startGame = async () => {
    if (!canStartGame) return;

    setIsStarting(true);

    try {
      // Only prepare game data, don't deduct yet
      useBingoStore.getState().prepareGame();
      await router.push("bingo/caller");
    } catch (error) {
      console.error("Navigation failed:", error);
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    if (session && session.user.role !== "CASHIER") {
      router.push("/unauthorized");
    }
  }, [session]);

  useEffect(() => {
    setGameState({ selectedNumbers: players });
  }, [players]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col gap-4 items-center">
          <Spinner size="lg" />
          <p className="text-muted-foreground text-sm">Loading game ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <BingoHeader
        betAmount={betAmount}
        players={players}
        prizePool={prizePool}
        walletAmount={walletAmount}
        onBetAmountChange={setBetAmount}
      />

      <BingoBoard
        numbers={numbers}
        selectedNumbers={gameState.selectedNumbers}
        onNumberClick={toggleNumberSelection}
      />

      <BingoFooter
        canStartGame={canStartGame}
        isStarting={isStarting}
        onClearSelection={clearSelection}
        onStartGame={startGame}
      />
    </div>
  );
}
