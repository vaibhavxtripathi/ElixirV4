export const metadata = {
  title: "Testimonials | Elixir",
  description: "Meet our expert testimonials.",
};

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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Testimonials</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map(
          (testimonial: {
            id: string | number;
            name: string;
            content: string;
            batchYear?: string | number;
          }) => (
            <div key={testimonial.id} className="border rounded p-6">
              <h3 className="text-lg font-semibold mb-2">{testimonial.name}</h3>
              <p className="text-gray-600 mb-3">{testimonial.content}</p>
              <div className="text-sm text-gray-500">
                Batch Year: {testimonial.batchYear}
              </div>
            </div>
          )
        )}
        {testimonials.length === 0 && (
          <p className="text-gray-600 col-span-full">No testimonials yet.</p>
        )}
      </div>
    </main>
  );
}
