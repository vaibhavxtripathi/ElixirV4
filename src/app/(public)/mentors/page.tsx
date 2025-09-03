export const metadata = {
    title: "Mentors | Elixir",
    description: "Meet our expert mentors.",
  };
  
  async function getMentors() {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${base}/mentors`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch mentors");
    return res.json();
  }
  
  export default async function MentorsPage() {
    const data = await getMentors();
    const mentors = data.mentors || [];
  
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mentors</h1>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor: any) => (
            <div key={mentor.id} className="border rounded p-6">
              <h3 className="text-lg font-semibold mb-2">{mentor.name}</h3>
              <p className="text-gray-600 mb-3">{mentor.expertise}</p>
              <div className="text-sm text-gray-500">Club: {mentor.club?.name}</div>
            </div>
          ))}
          {mentors.length === 0 && <p className="text-gray-600 col-span-full">No mentors yet.</p>}
        </div>
      </main>
    );
  }