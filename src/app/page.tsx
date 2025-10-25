import { TestimonialsSection } from "@/components/testimonials-with-marquee";
import { Header } from "@/components/Header";
import { AboutElixir } from "@/components/AboutElixir";
import dynamic from "next/dynamic";
import { FAQSection } from "@/components/FAQ";
import { AnimatedDemoSection } from "@/components/AnimatedDemoSection";
import { StarBorder } from "@/components/ui/star-border";
import { DiscordLogo } from "@/icons/general";
import Separator from "@/components/Separator";

export const metadata = {
  title: "Elixir | Home",
  description: "Discover events, mentors, and blogs in the Elixir community.",
};

// Lazy load heavy components
const HowItWorks = dynamic(
  () => import("@/components/how-it-works").then((mod) => mod.HowItWorks),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="h-6 w-48 bg-white/10 rounded mx-auto animate-pulse" />
          <div className="h-8 w-96 bg-white/10 rounded mx-auto animate-pulse" />
          <div className="h-4 w-80 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
        <div className="h-96 bg-white/5 rounded-lg border border-white/10 animate-pulse" />
      </div>
    ),
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
    // Increased timeout for production - 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${base}/testimonials`, {
      next: { revalidate: 60 },
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(
        `Testimonials API returned ${res.status}: ${res.statusText}`
      );
      return [] as BackendTestimonial[];
    }

    const data = await res.json();
    const items: unknown = data.items ?? data.testimonials ?? [];
    if (Array.isArray(items) && items.length > 0) {
      console.log(`Loaded ${items.length} testimonials from API`);
      return items as BackendTestimonial[];
    }

    console.warn("No testimonials found in API response");
    return [] as BackendTestimonial[];
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
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

  // Debug logging for production
  console.log(`HomePage: Processed ${testimonials.length} testimonials`);
  if (testimonials.length === 0) {
    console.log("HomePage: No testimonials available, will show fallback");
  }
  return (
    <main className="relative min-h-[88vh] text-white pt-10 mt-32">
      <Header
        badge="Elixir Tech Community"
        title="Think better with Elixir"
        subtitle="We build the future of technology with you."
        variant="default"
      />
      <StarBorder className="flex mx-auto mt-8 sm:mt-12">
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base">Join Discord</span>
          <DiscordLogo className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </StarBorder>
      <AnimatedDemoSection />

      {/* Uniform spacing between demo and about */}
      <div className="mt-2 sm:mt-4 md:mt-6">
        <AboutElixir />
      </div>

      {/* Separator between About and How It Works */}
      <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
        <Separator className="w-32 sm:w-48 md:w-64" />
      </div>

      {/* Increased spacing between about and how it works */}
      <div className="mt-6 sm:mt-8 md:mt-10">
        <div className="their-component-wrapper dark">
          <HowItWorks />
        </div>
      </div>

      {/* Separator between How It Works and Testimonials */}
      <div className="flex justify-center mt-8 sm:mt-8 md:mt-16">
        <Separator className="w-32 sm:w-48 md:w-64" />
      </div>

      {/* Increased spacing between how it works and testimonials */}
      <div className="mt-8 sm:mt-8 md:mt-10">
        <section>
          <TestimonialsSection
            badge="Testimonials"
            headline="What our alumni say"
            subtext="Real voices from the Elixir community."
            testimonials={testimonials}
            variant="secondary"
          />
          {/* Fallback when no testimonials are available */}
          {testimonials.length === 0 && (
            <div className="py-8 sm:py-12 md:py-16 px-4">
              <div className="mx-auto max-w-7xl text-center">
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                    Testimonials
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                  What our alumni say
                </h2>
                <p className="text-lg text-white/70 mb-6">
                  Real voices from the Elixir community.
                </p>
                <div className="rounded-2xl border border-blue-500/10 bg-[#080914]/50 p-6 sm:p-8">
                  <div className="h-12 w-12 rounded-full bg-white/10 mx-auto mb-3" />
                  <p className="text-white/80 text-base">
                    Testimonials are loading... Check back soon to see what our
                    community members have to say!
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Separator between Testimonials and FAQ */}
      <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
        <Separator className="w-32 sm:w-48 md:w-64" />
      </div>

      {/* Increased spacing between testimonials and FAQ */}
      <div className="mt-6 sm:mt-8 md:mt-10">
        <FAQSection />
      </div>
    </main>
  );
}
