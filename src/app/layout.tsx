import type { Metadata } from "next";
import { VT323, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const shareMono = Share_Tech_Mono({
  variable: "--font-share-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FEDORA // MANJUANTHA P",
  description:
    "An abandoned CRT monitor, recovered from a forgotten cybersecurity research facility. Power it on.",
  keywords: [
    "portfolio",
    "ethical hacker",
    "security researcher",
    "CRT",
    "retro terminal",
    "MANJUNATHA P",
  ],
  authors: [{ name: "MANJUNATHA P" }],
  icons: {
    icon: "https://api.iconify.design/mdi:console.svg",
  },
  openGraph: {
    title: "FEDORA // MANJUNATHA P",
    description: "Power on the recovered monitor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${vt323.variable} ${shareMono.variable} antialiased bg-black text-[var(--crt-green)] overflow-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
