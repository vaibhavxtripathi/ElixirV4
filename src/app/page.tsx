import { TestimonialsSection } from "@/components/testimonials-with-marquee";

interface BackendTestimonial {
  id: string | number;
  name?: string;
  content?: string;
  text?: string;
  href?: string;
  batchYear?: string | number;
  avatar?: string;
  image?: string;
  imageUrl?: string;
  handle?: string;
}

export const metadata = {
  title: "Elixir | Home",
  description: "Discover events, mentors, and blogs in the Elixir community.",
};

async function getHomeTestimonials(): Promise<BackendTestimonial[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  try {
    const res = await fetch(`${base}/testimonials`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items: unknown = data.items ?? data.testimonials ?? [];
    if (Array.isArray(items)) {
      return items as BackendTestimonial[];
    }
    return [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const testimonialsRaw = await getHomeTestimonials();
  const testimonials = testimonialsRaw.map((t) => ({
    author: {
      name: t.name ?? "Anonymous",
      handle: t.batchYear ? `Batch ${t.batchYear}` : t.handle ?? "",
      avatar: t.imageUrl ?? t.image ?? t.avatar ?? "/avatar.png",
    },
    text: t.content ?? t.text ?? "",
    href: t.href,
  }));
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

      {/* Showcase layout replica (chrome only, no content) */}
      <section className="relative mt-20">
        {/* top glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.45),rgba(59,130,246,0.15)_40%,transparent_65%)] blur-2xl" />

        <div className="mx-auto w-[min(1200px,95%)] rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur">
          {/* window top bar */}
          <div className="flex h-12 items-center gap-3 rounded-t-2xl border-b border-white/10 px-4">
            <span className="inline-block h-3 w-3 rounded-full bg-white/20" />
            <span className="inline-block h-3 w-3 rounded-full bg-white/20" />
            <span className="inline-block h-3 w-3 rounded-full bg-white/20" />
            <div className="ml-3 h-7 grow rounded-md border border-white/10 bg-black/20" />
          </div>

          {/* 3-column app frame */}
          <div className="grid grid-cols-12 gap-0">
            {/* left sidebar */}
            <div className="col-span-3 hidden border-r border-white/10 p-4 md:block">
              <div className="h-6 w-28 rounded-md bg-white/10" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-32 rounded bg-white/5" />
                <div className="h-4 w-24 rounded bg-white/5" />
                <div className="h-4 w-28 rounded bg-white/5" />
                <div className="h-4 w-20 rounded bg-white/5" />
              </div>
            </div>

            {/* main content placeholder */}
            <div className="col-span-12 md:col-span-6 border-r border-white/10 p-4">
              <div className="h-6 w-56 rounded-md bg-white/10" />
              <div className="mt-6 space-y-3">
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-5/6 rounded bg-white/5" />
                <div className="h-3 w-2/3 rounded bg-white/5" />
                <div className="h-40 w-full rounded-lg border border-white/10 bg-black/20" />
              </div>
            </div>

            {/* right panel */}
            <div className="col-span-12 md:col-span-3 p-4">
              <div className="h-6 w-40 rounded-md bg-white/10" />
              <div className="mt-4 h-56 rounded-lg border border-white/10 bg-black/20" />
              <div className="mt-4 space-y-3">
                <div className="h-3 w-40 rounded bg-white/5" />
                <div className="h-3 w-24 rounded bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-12">
        <TestimonialsSection
          headline="What our alumni say"
          subtext="Real voices from the Elixir community."
          testimonials={testimonials}
        />
      </section>
    </main>
  );
}
