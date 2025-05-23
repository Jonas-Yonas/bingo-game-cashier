import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useGame } from "@/hooks/useGames";

export default function GameDetails({ params }: { params: { id: string } }) {
  const { data: game, isLoading, error } = useGame(params.id);

  if (isLoading) return <div>Loading...</div>;
  if (error || !game) return notFound();

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/games">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">
              Game Details: {game.id}
            </h2>
          </div>
          <Badge variant={game.status === "active" ? "default" : "secondary"}>
            {game.status}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started At:</span>
                <span>{new Date(game.timestamp).toLocaleString()}</span>
              </div>
              {game.endedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ended At:</span>
                  <span>{new Date(game.endedAt).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bet Amount:</span>
                <span>${game.betAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Players:</span>
                <span>{game.players.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Winning Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prize Pool:</span>
                <span className="font-medium">
                  ${game.winningAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
              {game.winnerCard && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Winner Card:</span>
                    <span>{game.winnerCard}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shop Commission:</span>
                <span>${game.shopCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  System Commission:
                </span>
                <span>${game.systemCommission.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Called Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {game.calledNumbers.length > 0 ? (
                  game.calledNumbers.map((num, i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No numbers called yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
              {game.players.length > 0 ? (
                <div className="space-y-2">
                  {game.players.map((playerId) => (
                    <div
                      key={playerId}
                      className="flex items-center justify-between rounded border p-2"
                    >
                      <span>{playerId}</span>
                      {game.winnerPlayerId === playerId && (
                        <Badge variant="default">Winner</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No players in this game</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
