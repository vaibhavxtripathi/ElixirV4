export const metadata = {
  title: "Testimonials | Elixir",
  description: "Meet our expert testimonials.",
};

import { TestimonialCard } from "@/components/ui/testimonial-card";
import Container from "@/components/container";
import PageHeader from "@/components/PageHeader";

async function getTestimonials() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${base}/testimonials`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { testimonials: [] };
    return res.json();
  } catch {
    return { testimonials: [] };
  }
}

export default async function TestimonialsPage() {
  const data = await getTestimonials();
  const testimonials = data.items || data.testimonials || [];

  return (
    <main className="pt-32 sm:pt-36 pb-12 sm:pb-18">
      <Container>
        <PageHeader title="Testimonials" className="mb-6 sm:mb-8 md:mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {testimonials.map(
            (testimonial: {
              id: string | number;
              name: string;
              content: string;
              batchYear?: string | number;
              imageUrl?: string | null;
            }) => (
              <TestimonialCard
                key={testimonial.id}
                author={{
                  name: testimonial.name,
                  handle: `Batch of ${testimonial.batchYear ?? "—"}`,
                  avatar:
                    testimonial.imageUrl && testimonial.imageUrl.trim() !== ""
                      ? testimonial.imageUrl
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          testimonial.name || "User"
                        )}`,
                }}
                text={testimonial.content}
                className="w-full h-full"
              />
            )
          )}
          {testimonials.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-blue-500/10 bg-[#080914]/50 p-10 text-center">
              <div className="h-16 w-16 rounded-full bg-white/10 mb-4" />
              <p className="text-white/80 text-base">No testimonials yet.</p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
