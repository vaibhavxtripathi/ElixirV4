import { TestimonialsSection } from "@/components/testimonials-with-marquee";
import { Header } from "@/components/Header";
import { AboutElixir } from "@/components/AboutElixir";
import dynamic from "next/dynamic";
import { FAQSection } from "@/components/FAQ";
import { AnimatedDemoSection } from "@/components/AnimatedDemoSection";
import { StarBorder } from "@/components/ui/star-border";
import { DiscordLogo } from "@/icons/general";

export const metadata = {
  title: "Elixir | Home",
  description: "Discover events, mentors, and blogs in the Elixir community.",
};

// Lazy load heavy components
const HowItWorks = dynamic(
  () => import("@/components/how-it-works").then((mod) => mod.HowItWorks),
  {
    loading: () => <div className="h-96 animate-pulse bg-white/5 rounded-lg" />,
  }
);

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

async function getHomeTestimonials(): Promise<BackendTestimonial[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    // Very short timeout - 2 seconds max
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${base}/testimonials`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return [] as BackendTestimonial[];
    }

    const data = await res.json();
    const items: unknown = data.items ?? data.testimonials ?? [];
    if (Array.isArray(items) && items.length > 0) {
      console.log("Using real API data");
      return items as BackendTestimonial[];
    }

    return [] as BackendTestimonial[];
  } catch {
    return [] as BackendTestimonial[];
  }
}

export default async function HomePage() {
  const testimonialsRaw = await getHomeTestimonials();
  const testimonials = (testimonialsRaw || []).map((t) => ({
    author: {
      name: t.name ?? "Anonymous",
      handle: t.batchYear ? `Batch ${t.batchYear}` : t.handle ?? "",
      avatar:
        t.imageUrl ??
        t.image ??
        t.avatar ??
        "https://ui-avatars.com/api/?name=Testimonial&background=random&color=fff",
    },
    text: t.content ?? t.text ?? "",
    href: t.href,
  }));
  return (
    <main className="relative min-h-[88vh] text-white pt-10">
      <Header
        badge="Elixir Tech Community"
        title="Think better with Elixir"
        subtitle="We build the future of technology with you."
        variant="default"

      />
      <StarBorder className="flex mx-auto mt-12">
        <div className="flex items-center gap-2">
          <span>Join Discord</span>
          <DiscordLogo className="w-5 h-5" />
        </div>
      </StarBorder>
      <AnimatedDemoSection />

      <AboutElixir />

      <div className="their-component-wrapper dark">
        <HowItWorks />
      </div>

      <section>
        <TestimonialsSection
          badge="Testimonials"
          headline="What our alumni say"
          subtext="Real voices from the Elixir community."
          testimonials={testimonials}
          variant="secondary"
        />
      </section>

      <FAQSection />
    </main>
  );
}
