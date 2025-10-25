import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import ConditionalLayout from "@/components/ConditionalLayout";
export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://elixir.tech"
  ),
  title: {
    default: "Elixir - Student Tech Community | Learn, Build, Launch",
    template: "%s | Elixir Tech Community",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
    >
      <head></head>
      <body
        className="bg-card min-h-screen overflow-x-hidden flex flex-col font-sans 
      font-primary h-full [--pattern-fg:var(--color-charcoal-900)]/10 dark:[--pattern-fg:var(--color-neutral-100)]/30"
      >
        <ReactQueryProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
