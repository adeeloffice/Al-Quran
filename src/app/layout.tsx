import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bayan ul Quran - Dr. Israr Ahmad",
  description:
    "Complete Quran Tafseer (Bayan ul Quran) by Dr. Israr Ahmad in Urdu. Listen to audio lectures covering all 114 Surahs of the Holy Quran.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📖</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur" dir="ltr" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
