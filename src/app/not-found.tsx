import { SignOutAndGoBack } from "./SignOutAndGoBack ";

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

        <SignOutAndGoBack />
      </div>
    </main>
  );
}
