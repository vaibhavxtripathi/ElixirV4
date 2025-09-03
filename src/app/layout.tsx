import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import Navbar from "@/components/Navbar";

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
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Navbar />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
