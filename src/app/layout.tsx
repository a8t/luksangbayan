import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://luksangbayan.ca"),
  title: "Luksang Bayan",
  description:
    "Week of Mourning of Filipino Communities and Supporters across Canada",
  openGraph: {
    title: "Vigil Events Across Canada",
    description: "In grief and solidarity",
    images: [
      {
        url: "/og/vigil.png",
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
    images: ["/og/vigil.png"],
  },
};

const enableAnalytics = process.env.NODE_ENV === "production";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {enableAnalytics && (
          <script
            defer
            data-domain="luksangbayan.ca"
            src="https://analytics.andytran.ca/js/script.file-downloads.hash.outbound-links.js"
          ></script>
        )}
      </head>
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
