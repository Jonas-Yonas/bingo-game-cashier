import { Rocket, Users, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PublicTopbar } from "./PublicTopbar";

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    title: "Real-Time Multiplayer",
    description: "Play with friends instantly.",
  },
  {
    icon: <Shield className="w-5 h-5 text-emerald-400" />,
    title: "No Ads",
    description: "100% free, forever.",
  },
  {
    icon: <Star className="w-5 h-5 text-purple-400" />,
    title: "Custom Rooms",
    description: "Private or public games.",
  },
];

export default function LandingClientPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      {/* Navbar with subtle border */}

      <PublicTopbar />

      {/* Hero Section */}
      <section className="container px-4 py-24 mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Play{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Bingo
          </span>{" "}
          Online
        </h1>
        <p className="text-lg md:text-xl text-gray-300/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Create a room, invite players, and compete in real-time.
          <span className="block mt-2 text-emerald-300/80">
            Free, fun, and wildly addictive!
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
          >
            <Rocket className="w-5 h-5" /> Create Private Room
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-gray-100 border-gray-500/40 hover:border-emerald-400/60 bg-gray-900/20 hover:bg-emerald-900/20 gap-2 backdrop-blur-md transition-all hover:text-emerald-300"
          >
            <Users className="w-5 h-5" /> Join with Code
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 pb-28 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          <span className="text-white">Why Choose</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            Bingo Blast?
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="bg-gray-800/40 border border-gray-700/50 hover:border-emerald-400/30 transition-colors group hover:bg-gray-800/60 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-gray-700/50 group-hover:bg-emerald-900/20 transition-colors">
                    {feature.icon}
                  </span>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300/80">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8">
        <div className="container mx-auto text-center text-gray-400/80 text-sm">
          © {new Date().getFullYear()} Bingo Blast. Not affiliated with any
          official bingo.
        </div>
      </footer>
    </main>
  );
}
