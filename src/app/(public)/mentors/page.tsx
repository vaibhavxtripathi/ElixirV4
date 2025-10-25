export const metadata = {
  title: "Elixir | Mentors",
  description: "Explore mentors by clubs.",
  alternates: { canonical: "/mentors" },
};

import MentorsGrid from "./MentorsGrid";

export default function MentorsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 sm:pt-36 pb-12 sm:pb-18">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
        Mentors
      </h1>
      <MentorsGrid />
    </main>
  );
}
