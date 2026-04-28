import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IELTS Reading Platform",
  description: "Reading-first IELTS CBT platform"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
