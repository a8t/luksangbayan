import { Metadata } from "next";
import MemorialWall from "@/components/MemorialWall";
import Navigation from "@/components/Navigation";
import Image from "next/image";

export const metadata: Metadata = {
  metadataBase: new URL("https://luksangbayan.ca"),
  title: "Memorial Wall | Luksang Bayan",
  description: "Share your messages of remembrance and solidarity.",
  openGraph: {
    title: "Memorial Wall | Luksang Bayan",
    description: "Share your messages of remembrance and solidarity.",
    images: [
      {
        url: "/og/memorial-wall.png",
        width: 1200,
        height: 630,
        alt: "Memorial Wall | Luksang Bayan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memorial Wall | Luksang Bayan",
    description: "Share your messages of remembrance and solidarity.",
    images: ["/og/memorial-wall.png"],
  },
};

export default function MemorialWallPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Fixed background container */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/vigil.jpg"
          alt="Candlelight vigil"
          fill
          className="object-cover brightness-15 max-h-[1080px]"
          priority
          sizes="100vw"
        />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10">
        <header className="text-center mb-12">
          <Navigation />
          <h1 className="text-4xl md:text-6xl font-serif mb-4">
            Luksang Bayan
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Week of Mourning of Filipino Communities and Supporters across
            Canada
          </p>
        </header>

        {/* Moderation Notice */}
        <div className="max-w-lg mx-auto mb-8">
          <div className="bg-blue-900/40 border border-blue-700 text-blue-100 px-4 py-3 rounded text-center text-sm">
            <p>
              All messages will be reviewed by a volunteer administrator to
              ensure respectful usage of the memorial wall.
            </p>
            <p className="mt-2">
              Messages will be approved within 24 hours, and usually much
              faster.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-gray-300 mb-8">
            In memory of those we have lost, and in solidarity with those who
            grieve.
          </p>
        </div>
        <MemorialWall />
      </div>
    </main>
  );
}
