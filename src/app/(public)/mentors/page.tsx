export const metadata = {
  title: "Elixir | Mentors",
  description: "Explore mentors by clubs.",
  alternates: { canonical: "/mentors" },
};

import MentorsGrid from "./MentorsGrid";

export default function MentorsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-36 pb-18">
      <h1 className="text-2xl font-bold mb-6">Mentors</h1>
      <MentorsGrid />
    </main>
  );
}
