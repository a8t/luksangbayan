"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useVigilEvents } from "@/hooks/useVigilEvents";

const EVENTS_PER_PAGE = 10;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const filterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export default function VigilEvents() {
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const { data, isLoading, isError } = useVigilEvents();
  const events = data?.events || [];

  useEffect(() => {
    if (selectedProvince === "") {
      setSelectedCity(null);
    }
  }, [selectedProvince, selectedCity]);

  const provinces = new Set(events.map((event) => event.province));
  const citiesFilteredByProvince: Set<string> = selectedProvince
    ? new Set(
        events
          .filter((event) => event.province === selectedProvince)
          .map((event) => event.city)
      )
    : new Set();

  const filteredEvents = events
    .filter((event) => {
      if (selectedProvince && event.province !== selectedProvince) return false;
      if (selectedCity && event.city !== selectedCity) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
        Error loading events
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="flex flex-wrap gap-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full md:w-auto">
          <select
            value={selectedProvince || ""}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="">All Provinces</option>
            {Array.from(provinces).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {selectedProvince && (
          <div className="w-full md:w-auto">
            <select
              value={selectedCity || ""}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <option value="">All Cities</option>
              {Array.from(citiesFilteredByProvince).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            variants={itemVariants}
            className="block bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-900 overflow-hidden"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <Link href={`/vigil-events/${event.id}`} className="block">
              {event.image ? (
                <div className="relative w-full h-48">
                  <Image
                    src={event.image}
                    alt={`Event in ${event.city}, ${event.province}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="p-6">
                <h3 className="text-xl font-serif mb-2">
                  {event.city}, {event.province}
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <svg
                      className="w-4 h-4 inline-block mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(event.date)}
                  </p>
                  <p>
                    <svg
                      className="w-4 h-4 inline-block mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {event.time}
                  </p>
                  <p>
                    <svg
                      className="w-4 h-4 inline-block mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {event.location}
                  </p>
                  {event.organizers && (
                    <p>
                      <svg
                        className="w-4 h-4 inline-block mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {event.organizers}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2">
                    <svg
                      className="w-4 h-4 inline-block mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {event.details}
                  </p>
                </div>
              </div>
            </Link>

            {event.links && event.links.length > 0 && (
              <div className="p-6">
                <svg
                  className="w-4 h-4 inline-block mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <div className="inline-flex flex-wrap gap-4">
                  {event.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Link {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {filteredEvents.length === 0 && (
        <motion.div
          className="text-center text-gray-400 py-8"
          variants={itemVariants}
        >
          No events found
        </motion.div>
      )}
    </div>
  );
}
