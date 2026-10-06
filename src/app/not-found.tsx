import Link from "next/link";
import Container from "@/components/container";

export default function NotFound() {
  return (
    <main className="pt-32 sm:pt-36 pb-12 sm:pb-18">
      <Container>
        <div className="max-w-xl mx-auto text-center rounded-2xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10 sm:py-16">
          <p className="text-sm text-white/50">404</p>
          <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Page not found
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/70">
            That page doesn&apos;t exist. Head back to the homepage.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-[#0F172A] text-white border border-[#3B82F6] shadow-[inset_0_0_16px_#3B82F680] hover:shadow-[inset_0_0_18px_#3B82F6cc] transition-all duration-200 h-10 px-6 text-sm font-medium"
          >
            Back to home
          </Link>
        </div>
      </Container>
    </main>
  );
}
