import { Metadata } from "next";
import MemorialWall from "@/components/MemorialWall";

export const metadata: Metadata = {
  metadataBase: new URL("https://luksangbayan.com"),
  title: "Memorial Wall | Luksang Bayan",
  description: "Share your messages of remembrance and solidarity.",
};

export default function MemorialWallPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif text-center mb-8">Memorial Wall</h1>
      <p className="text-gray-300 text-center max-w-2xl mx-auto mb-12">
        Share your messages of remembrance and solidarity. Your words help build
        a collective memory of our shared grief and hope.
      </p>
      <MemorialWall />
    </main>
  );
}
