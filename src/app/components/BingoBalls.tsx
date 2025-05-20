export const BingoBall = () => {
  return (
    <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-red-900 rounded-full shadow-lg flex items-center justify-center text-white text-4xl font-bold animate-pulse relative overflow-hidden">
      <span className="z-10">B</span>
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm pointer-events-none animate-pulse" />
    </div>
  );
};
