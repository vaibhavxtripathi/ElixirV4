import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import ConditionalLayout from "@/components/ConditionalLayout";
export const metadata = {
  title: "Elixir",
  description: "Elixir Tech Community",
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
