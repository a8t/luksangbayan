import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vigil Events Across Canada",
  description: "In grief and solidarity",
  openGraph: {
    title: "Vigil Events Across Canada",
    description: "In grief and solidarity",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Vigil Events Across Canada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vigil Events Across Canada",
    description: "In grief and solidarity",
    images: ["/og?type=twitter"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
