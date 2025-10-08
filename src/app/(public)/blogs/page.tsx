"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

type Blog = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author?: { firstName?: string; lastName?: string };
  imageUrl?: string;
};

export default function BlogsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get("/blogs")).data,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const blogs = data?.blogs || [];

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 pt-36 pb-18">
        <h1 className="text-2xl font-bold mb-6">Blogs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="group block overflow-hidden rounded-2xl border border-blue-500/10 bg-[#080914] hover:bg-[#0b0c1b] transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
            >
              {/* Image shimmer */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
              </div>
              <div className="p-5">
                {/* Author shimmer */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
                  <div className="h-3 w-24 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
                  <div className="h-3 w-16 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
                </div>
                {/* Title shimmer */}
                <div className="h-6 w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded mb-2" />
                <div className="h-6 w-3/4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded mb-3" />
                {/* Content shimmer */}
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
                  <div className="h-3 w-5/6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
                  <div className="h-3 w-4/5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 pt-36 pb-18">
        <h1 className="text-2xl font-bold mb-6">Blogs</h1>
        <p className="text-red-400">
          Failed to load blogs. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pt-36 pb-18">
      <h1 className="text-2xl font-bold mb-6">Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog: Blog) => (
          <a
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="group block overflow-hidden rounded-2xl border border-blue-500/10 bg-[##080914] hover:bg-[#0b0c1b] transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
          >
            {/* Card image */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              {blog.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                <div className="h-6 w-6 rounded-full bg-white/10" />
                <span>
                  {blog.author?.firstName} {blog.author?.lastName}
                </span>
                <span>• {new Date(blog.createdAt).toDateString()}</span>
              </div>
              <h2 className="text-xl font-semibold text-white group-hover:translate-y-[-1px] transition-transform duration-200">
                {blog.title}
              </h2>
              <p className="mt-2 text-sm text-white/70 line-clamp-3">
                {blog.content}
              </p>
            </div>
          </a>
        ))}
      </div>
      {blogs.length === 0 && (
        <p className="text-gray-400 mt-6">No blogs yet.</p>
      )}
    </main>
  );
}
