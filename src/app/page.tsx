import { TestimonialsSection } from "@/components/testimonials-with-marquee";
import { Header } from "@/components/Header";
import { DemoSection } from "@/components/DemoSection";
import { AboutElixir } from "@/components/AboutElixir";
import dynamic from "next/dynamic";

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

export const metadata = {
  title: "Elixir | Home",
  description: "Discover events, mentors, and blogs in the Elixir community.",
};

async function getHomeTestimonials(): Promise<BackendTestimonial[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Static fallback data
  const fallbackData = [
    {
      id: 1,
      name: "John Doe",
      content: "Elixir helped me land my dream job at Google!",
      batchYear: "2023",
      avatar: "/avatar.png",
    },
    {
      id: 2,
      name: "Jane Smith",
      content: "The community support here is incredible.",
      batchYear: "2022",
      avatar: "/avatar.png",
    },
    {
      id: 3,
      name: "Mike Johnson",
      content: "Best tech community I've ever been part of.",
      batchYear: "2024",
      avatar: "/avatar.png",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      content: "Amazing workshops and networking opportunities!",
      batchYear: "2023",
      avatar: "/avatar.png",
    },
    {
      id: 5,
      name: "Alex Chen",
      content: "The mentorship program changed my career trajectory.",
      batchYear: "2022",
      avatar: "/avatar.png",
    },
  ];

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
      console.log("API returned error, using fallback data");
      return fallbackData;
    }

    const data = await res.json();
    const items: unknown = data.items ?? data.testimonials ?? [];
    if (Array.isArray(items) && items.length > 0) {
      console.log("Using real API data");
      return items as BackendTestimonial[];
    }

    console.log("API returned empty data, using fallback");
    return fallbackData;
  } catch (error) {
    return fallbackData;
  }
}

export default async function HomePage() {
  const testimonialsRaw = await getHomeTestimonials();
  const testimonials = (testimonialsRaw || []).map((t) => ({
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
        variant="default"
      />

      {/* Showcase layout replica (chrome only, no content) */}
      <DemoSection />

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
    </main>
  );
}
