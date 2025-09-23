export const metadata = {
  title: "Mentors | Elixir",
  description: "Meet our expert mentors.",
};

async function getMentors() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${base}/mentors`, { next: { revalidate: 60 } });
    if (!res.ok) return { mentors: [] };
    return res.json();
  } catch {
    return { mentors: [] };
  }
}

import Image from "next/image";
import { FaLinkedin } from "react-icons/fa6";

export default async function MentorsPage() {
  const data = await getMentors();
  const mentors = data.mentors || [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mentors</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.map(
          (m: {
            id: string | number;
            imageUrl?: string;
            avatar?: string;
            name: string;
            expertise?: string;
            linkedInUrl?: string;
            title?: string;
            role?: string;
            club?: { name?: string };
          }) => (
            <div className="relative overflow-hidden rounded-2xl border border-blue-500/10 bg-blue-900/5 p-5 dark:bg-blue-900/5">
              <div className="relative h-40 w-full overflow-hidden rounded-xl">
                <Image
                  src={m.imageUrl || m.avatar || "/avatar.png"}
                  alt={m.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white/90">
                  {m.name}
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  {m.expertise || m.title || m.role}{" "}
                  {m.linkedInUrl && (
                    <a
                      href={m.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                      title="LinkedIn"
                    >
                      <FaLinkedin />
                    </a>
                  )}
                </p>
                <div className="mt-2 text-xs text-white/60">
                  {m.club?.name ? `Club: ${m.club.name}` : null}
                </div>
              </div>
            </div>
          )
        )}
        {mentors.length === 0 && (
          <p className="col-span-full text-white/60">No mentors yet.</p>
        )}
      </div>
    </main>
  );
}
