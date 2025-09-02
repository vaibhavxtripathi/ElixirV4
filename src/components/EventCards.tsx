import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  date: string;
  club?: { name: string; imageUrl?: string | null };
};

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="rounded-lg border p-4 hover:shadow-sm transition">
      <div className="text-sm text-gray-500">{new Date(event.date).toDateString()}</div>
      <h3 className="text-lg font-semibold mt-1">{event.title}</h3>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
      {event.club?.name && <div className="text-xs text-gray-500 mt-2">Club: {event.club.name}</div>}
      <Link href={`/events/${event.id}`} className="text-indigo-600 text-sm mt-3 inline-block">View</Link>
    </div>
  );
}