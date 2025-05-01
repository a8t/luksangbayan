"use client";

import VigilEvents from "@/components/VigilEvents";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const titleVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 1 },
  },
};

const subtitleContainerVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 1.0 },
  },
};

const wordVariants = {
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
  exit: {
    opacity: 0,
    transition: { duration: 1 },
  },
};

const contentVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  const [showTitle, setShowTitle] = useState(true);
  const [hasVisited, setHasVisited] = useState(true); // Default to true to prevent flash

  useEffect(() => {
    // Check if user has visited before
    const hasVisitedBefore = localStorage.getItem("hasVisitedLuksangBayan");
    setHasVisited(!!hasVisitedBefore);

    if (!hasVisitedBefore) {
      // Set visited flag
      localStorage.setItem("hasVisitedLuksangBayan", "true");

      // Show title for 5 seconds on first visit
      const timer = setTimeout(() => {
        setShowTitle(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      // Skip title animation if user has visited before
      setShowTitle(false);
    }
  }, []);

  const subtitleWords = [
    "Week of Mourning",
    "of Filipino Communities",
    "and Supporters",
    "across Canada",
  ];

  return (
    <AnimatePresence mode="wait">
      {showTitle && !hasVisited ? (
        <motion.main
          key="title"
          className="min-h-screen flex flex-col items-center justify-center bg-black text-white"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.h1
            variants={titleVariants}
            className="text-4xl md:text-6xl font-serif text-center mb-6"
          >
            Luksang Bayan
          </motion.h1>
          <motion.div
            variants={subtitleContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-xl md:text-2xl text-center text-gray-300 max-w-2xl px-4 flex flex-wrap justify-center gap-x-2"
          >
            {subtitleWords.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </motion.main>
      ) : (
        <motion.main
          key="content"
          className="min-h-screen bg-black text-white relative"
          initial="initial"
          animate="animate"
          variants={contentVariants}
        >
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
              <header className="text-center mb-12">
                <nav className="mb-6 flex justify-end">
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors inline-flex items-center"
                  >
                    About
                  </Link>
                </nav>
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
                  In memory of those we have lost, and in solidarity with those
                  who grieve.
                </p>
              </div>

              <VigilEvents />
            </div>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
