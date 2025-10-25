import { Metadata } from "next";
import { Header } from "@/components/Header";
import { DemoSection } from "@/components/DemoSection";
import { AboutElixir } from "@/components/AboutElixir";
import { HowItWorks } from "@/components/how-it-works";
import { TestimonialsSection } from "@/components/testimonials-with-marquee";
import { FAQSection } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Elixir - Student Tech Community | Learn, Build, Launch",
  description:
    "Join Elixir, the premier student tech community with 5000+ developers. Connect with GFG, GDG, and CodeChef clubs. Attend workshops, hackathons, and mentorship programs to grow your tech career.",
  keywords: [
    "tech community",
    "student developers",
    "programming",
    "hackathons",
    "workshops",
    "mentorship",
    "GFG",
    "GDG",
    "CodeChef",
    "coding",
    "software development",
    "tech events",
  ],
  authors: [{ name: "Elixir Tech Community" }],
  creator: "Elixir Tech Community",
  publisher: "Elixir Tech Community",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://elixir.tech",
    title: "Elixir - Student Tech Community | Learn, Build, Launch",
    description:
      "Join Elixir, the premier student tech community with 5000+ developers. Connect with GFG, GDG, and CodeChef clubs.",
    siteName: "Elixir Tech Community",
    images: [
      {
        url: "/elixir-logo.png",
        width: 1200,
        height: 630,
        alt: "Elixir Tech Community Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elixir - Student Tech Community | Learn, Build, Launch",
    description:
      "Join Elixir, the premier student tech community with 5000+ developers. Connect with GFG, GDG, and CodeChef clubs.",
    images: ["/elixir-logo.png"],
    creator: "@ElixirTech",
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
};

// Sample testimonials data
const testimonials = [
  {
    author: {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      avatar: "/testimonials/sarah.jpg",
      handle: "@sarahchen",
    },
    text: "Elixir helped me land my dream job at Google. The mentorship program and hackathons were game-changers for my career.",
    href: "#",
  },
  {
    author: {
      name: "Alex Rodriguez",
      role: "Full Stack Developer",
      avatar: "/testimonials/alex.jpg",
      handle: "@alexrod",
    },
    text: "The community is incredible. I've learned so much from the workshops and made lifelong connections with fellow developers.",
    href: "#",
  },
  {
    author: {
      name: "Priya Sharma",
      role: "Product Manager at Microsoft",
      avatar: "/testimonials/priya.jpg",
      handle: "@priyasharma",
    },
    text: "Elixir's events and mentorship program gave me the confidence to transition from engineering to product management.",
    href: "#",
  },
  {
    author: {
      name: "David Kim",
      role: "Startup Founder",
      avatar: "/testimonials/david.jpg",
      handle: "@davidkim",
    },
    text: "The hackathons at Elixir helped me build my first startup. The community support and resources are unmatched.",
    href: "#",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <Header
          badge="Welcome to Elixir"
          title="Connect, Learn, and Build with 5000+ Tech Enthusiasts"
          subtitle="Join our vibrant community of developers, designers, and tech professionals. Attend workshops, participate in hackathons, and grow your career with mentorship from industry experts."
          variant="default"
        />
      </section>

      {/* Demo Section */}
      <DemoSection />

      {/* About Elixir Section */}
      <AboutElixir />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <TestimonialsSection
        badge="Success Stories"
        headline="What our community members say"
        subtext="Join thousands of developers who have accelerated their careers with Elixir"
        testimonials={testimonials}
        variant="secondary"
      />

      {/* FAQ Section */}
      <FAQSection />
    </main>
  );
}
