import { EmptyState } from "@/components/GlobalLoader";
import Link from "next/link";

export default function NotFound() {
  return (
    <EmptyState
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      action={
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      }
    />
  );
}
