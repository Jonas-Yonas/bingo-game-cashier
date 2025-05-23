import { RecentTransactions } from "@/app/components/dashboard/RecentTransactions";
import GamesLog from "@/app/components/games/GamesLog";
// import GamesPage from "@/app/components/games/GameDetail";
// import { Spinner } from "@/components/ui/spinner";

const page = () => {
  return (
    <div className="flex items-center justify-center py-6">
      {/* <div className="text-center">
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm mt-4">
          Page under construction ...
        </p>
      </div> */}

      <GamesLog />
    </div>
  );
};

export default page;
