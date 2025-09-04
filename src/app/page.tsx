export const metadata = {
  title: "Elixir | Home",
  description: "Discover events, mentors, and blogs in the Elixir community.",
};

export default function HomePage() {
  return (
    <main className="relative min-h-[88vh] text-white">
      <div className="max-w-7xl mx-auto px-4 pt-36 md:pt-40">
        {/* badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/90 backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
            Elixir Tech Community
          </div>
        </div>

        {/* headline */}
        <h1 className="mt-6 text-center text-transparent text-5xl leading-tight tracking-tight md:text-7xl bg-clip-text bg-gradient-to-b from-white to-white/60">
          Think better with Elixir
        </h1>

        {/* subtext */}
        <p className="mt-4 text-center text-lg text-white/70 md:text-xl">
          We build the future of technology with you
        </p>
      </div>
    </main>
  );
}
