import { TestimonialsSection } from "@/components/testimonials-with-marquee";
import { Header } from "@/components/Header";
import { DemoSection } from "@/components/DemoSection";
import { AboutElixir } from "@/components/AboutElixir";
import { HowItWorks } from "@/components/how-it-works";

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
      <Header
        badge="Elixir Tech Community"
        title="Think better with Elixir"
        subtitle="We build the future of technology with you"
      />

      {/* Showcase layout replica (chrome only, no content) */}
      <DemoSection />

      <AboutElixir />

      {/* <HowItWorks /> */}

      <section>
        <TestimonialsSection
          badge="Testimonials"
          headline="What our alumni say"
          subtext="Real voices from the Elixir community."
          testimonials={testimonials}
        />
      </section>
    </main>
  );
}
