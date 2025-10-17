export const metadata = {
  title: "Elixir | Mentors",
  description: "Explore mentors by clubs.",
  alternates: { canonical: "/mentors" },
};

import MentorsGrid from "./MentorsGrid";

export default function MentorsPage() {
  return <MentorsGrid />;
}
