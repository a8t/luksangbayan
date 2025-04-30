import { Metadata } from "next";
import VigilEvents from "@/components/VigilEvents";
import Image from "next/image";

export const metadata: Metadata = {
  title:
    "Luksang Bayan: Week of Mourning of Filipino Communities and Supporters across Canada",
  description:
    "A space for remembrance and solidarity with the Filipino community in Canada",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/vigil.jpg"
            alt="Candlelight vigil"
            fill
            className="object-cover brightness-15"
            priority
          />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-serif mb-4">
              Luksang Bayan
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Week of Mourning of Filipino Communities and Supporters across
              Canada
            </p>
          </header>

          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg text-gray-300 mb-8">
              In memory of those we have lost, and in solidarity with those who
              grieve.
            </p>
          </div>

          <VigilEvents />
        </div>
      </div>
    </main>
  );
}
