import Link from "next/link";

export const metadata = {
  title: "Elixir | Home",
  description: "Events, mentors, blogs for the Elixir community.",
};

async function getFeaturedContent() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  
  try {
    const [eventsRes, blogsRes] = await Promise.all([
      fetch(`${base}/events?page=1&limit=3`, { next: { revalidate: 60 } }),
      fetch(`${base}/blogs?page=1&limit=3`, { next: { revalidate: 60 } })
    ]);
    
    const events = eventsRes.ok ? (await eventsRes.json()).events : [];
    const blogs = blogsRes.ok ? (await blogsRes.json()).blogs : [];
    
    return { events, blogs };
  } catch {
    return { events: [], blogs: [] };
  }
}

export default async function HomePage() {
  const { events, blogs } = await getFeaturedContent();

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Elixir</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover events, connect with mentors, and read insights from our community.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/events" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold">
              Explore Events
            </Link>
            <Link href="/register" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event: any) => (
              <div key={event.id} className="border rounded-lg p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-3">{event.description}</p>
                <div className="text-sm text-gray-500">
                  {new Date(event.date).toDateString()} • {event.club?.name}
                </div>
                <Link href="/events" className="text-indigo-600 mt-3 inline-block">View All Events</Link>
              </div>
            ))}
          </div>
          {events.length === 0 && (
            <p className="text-center text-gray-600">No events yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Latest Blogs</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: any) => (
              <div key={blog.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-3">{blog.content.substring(0, 150)}...</p>
                <div className="text-sm text-gray-500">
                  By {blog.author?.firstName} {blog.author?.lastName}
                </div>
                <Link href="/blogs" className="text-indigo-600 mt-3 inline-block">Read More</Link>
              </div>
            ))}
          </div>
          {blogs.length === 0 && (
            <p className="text-center text-gray-600">No blogs yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join our community and start your journey today.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold">
              Sign Up
            </Link>
            <Link href="/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}