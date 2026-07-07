import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MaddyMeta - Meta Tag Analyzer & SEO Preview Tool",
  description:
    "Analyze, preview & fix your meta tags. Get SEO scores, social previews, and actionable fix suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
