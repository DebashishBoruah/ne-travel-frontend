import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NE India Travel - Discover Northeast India",
  description: "Discover the enchanting Northeast India. Book homestays, tour packages, explore tribal cultures, festivals, and pristine nature across 8 magical states.",
  keywords: "Northeast India, travel, homestay, tour packages, Assam, Meghalaya, Nagaland, Arunachal Pradesh, tribal culture, festivals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
