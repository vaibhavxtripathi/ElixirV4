export const metadata = {
  title: "Testimonials | Elixir",
  description: "Meet our expert testimonials.",
};

import { TestimonialCard } from "@/components/ui/testimonial-card";

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
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 sm:pt-36 pb-12 sm:pb-18">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6 sm:mb-8 md:mb-10 text-center sm:text-left">
        Testimonials
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
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
    </main>
  );
}
