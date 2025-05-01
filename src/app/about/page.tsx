"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const contentVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function About() {
  return (
    <main className="min-h-screen bg-black text-white relative">
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
        <div className="container mx-auto px-4 py-8">
          <nav className="mb-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Events
            </Link>
          </nav>

          <motion.div
            initial="initial"
            animate="animate"
            variants={contentVariants}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-serif mb-8 text-center">
              About Luksang Bayan
            </h1>

            <div className="prose prose-lg prose-invert mx-auto">
              <p className="text-xl mb-6">
                Luksang Bayan, which translates to &quot;National Mourning&quot;
                or &quot;People&apos;s Mourning&quot; in Filipino, is a
                collective expression of grief and solidarity within Filipino
                communities and their supporters across Canada.
              </p>

              <p className="mb-6">
                This initiative serves as a platform to honor and remember those
                we have lost, while bringing together communities in shared
                moments of remembrance and support. Through organized vigils
                across various Canadian cities, we create spaces for collective
                mourning, healing, and community building.
              </p>

              <h2 className="text-2xl font-bold mb-4">Background</h2>

              <p className="mb-6">
                The tragic incident occurred on April 27, 2025, when a vehicle
                plowed into a crowd celebrating a Lapu-Lapu Day Festival in
                Vancouver, British Columbia. The event marked the 500th
                anniversary of the Battle of Mactan, where Filipino hero
                Lapu-Lapu repelled Spanish explorer Ferdinand Magellan.
              </p>

              <p className="mb-6">
                For more information, please refer to the following articles:
                <ul className="list-disc pl-6 mb-6">
                  <li>
                    <a
                      className="text-blue-400 hover:text-blue-600"
                      href="https://www.bbc.com/news/articles/cvgnz7n7zj4o"
                    >
                      BBC News Article (overall summary)
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-blue-400 hover:text-blue-600"
                      href="https://www.cbc.ca/news/canada/british-columbia/vehicle-hits-crowd-filipino-festival-lapu-lapu-day-block-party-1.7519778"
                    >
                      CBC News Article (more detailed)
                    </a>
                  </li>
                </ul>
              </p>

              <h2 className="text-2xl font-bold mb-4">About Luksang Bayan</h2>

              <p className="mb-6">
                The call for a country-wide mourning under the banner of Luksang
                Bayan was initiated by{" "}
                <a
                  className="text-blue-400 hover:text-blue-600"
                  href="https://www.instagram.com/migrantecanada/p/DI9W2TuJNeD/"
                >
                  Migrante Canada
                </a>
                , a country-wide organization part of a global movement that
                advocates for the rights and welfare of Filipino migrants,
                Filipinos in the diaspora and at home. Migrante is part of the
                movement for national liberation and genuine democracy in the
                Philippines.
              </p>

              <p className="mb-6">
                Vigils and other activities have been organized by local
                communities and supporters across Canada.
              </p>

              <h2 className="text-2xl font-bold mb-4">
                How can I participate?
              </h2>

              <p className="mb-6">
                The Luksang Bayan is a call for solidarity and mourning for the
                victims of the incident. Any who would like to gather in
                community, share space, and express grief are welcome to join.
              </p>

              <p className="mb-6">
                If you would like to host a vigil and share it header, or if you
                have any questions, comments, or suggestions, please contact us
                at{" "}
                <a
                  className="text-blue-400 hover:text-blue-600"
                  href="mailto:info@luksangbayan.ca"
                >
                  info@luksangbayan.ca
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
