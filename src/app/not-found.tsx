import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6">
          404
        </h1>
        <p className="text-xl md:text-2xl text-gray-300/90 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link href="/" passHref>
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 cursor-pointer hover:from-emerald-500 hover:to-teal-500 gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeftCircle className="w-5 h-5" />
            Go Back Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
