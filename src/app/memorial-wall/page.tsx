import { Metadata } from "next";
import MemorialWall from "@/components/MemorialWall";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  metadataBase: new URL("https://luksangbayan.com"),
  title: "Memorial Wall | Luksang Bayan",
  description: "Share your messages of remembrance and solidarity.",
  openGraph: {
    title: "Memorial Wall | Luksang Bayan",
    description: "Share your messages of remembrance and solidarity.",
    images: [
      {
        url: "/vigil.jpg",
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
    images: ["/vigil.jpg"],
  },
};

export default function MemorialWallPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <Navigation />
        <h1 className="text-4xl md:text-6xl font-serif mb-4">Luksang Bayan</h1>
        <p className="text-xl md:text-2xl text-gray-300">
          Week of Mourning of Filipino Communities and Supporters across Canada
        </p>
      </header>

      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-lg text-gray-300 mb-8">
          In memory of those we have lost, and in solidarity with those who
          grieve.
        </p>
      </div>
      <MemorialWall />
    </main>
  );
}
