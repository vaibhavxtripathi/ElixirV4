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
      <body className="bg-[#0A0B1A] min-h-screen flex flex-col font-sans">
        <ReactQueryProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
