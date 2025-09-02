import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

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
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
