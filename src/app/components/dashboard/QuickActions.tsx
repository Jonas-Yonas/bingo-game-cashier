import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Zap } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Button variant="outline" className="h-24 flex-col gap-2">
        <Zap className="h-6 w-6 text-yellow-500" />
        <span>Start New Game</span>
      </Button>
      <Button variant="outline" className="h-24 flex-col gap-2">
        <Plus className="h-6 w-6 text-blue-500" />
        <span>Add Funds</span>
      </Button>
      <Button variant="outline" className="h-24 flex-col gap-2">
        <RefreshCw className="h-6 w-6 text-green-500" />
        <span>Refresh Data</span>
      </Button>
    </div>
  );
}
