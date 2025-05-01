"use client";

import { useEffect, useState } from "react";
import {
  getVigilEvents,
  getUniqueProvinces,
  getCitiesByProvince,
} from "../app/actions";
import Link from "next/link";
import { VigilEvent } from "../db/schema";
import { motion } from "framer-motion";
import Image from "next/image";

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
  const [events, setEvents] = useState<VigilEvent[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const [eventsData, provincesData] = await Promise.all([
        getVigilEvents(),
        getUniqueProvinces(),
      ]);
      setEvents(eventsData);
      setProvinces(provincesData);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (selectedProvince) {
        const citiesData = await getCitiesByProvince(selectedProvince);
        setCities(citiesData);
        setSelectedCity("");
      } else {
        setCities([]);
        setSelectedCity("");
      }
    };
    loadCities();
  }, [selectedProvince]);

  const filteredEvents = events.filter((event) => {
    if (selectedProvince && event.province !== selectedProvince) return false;
    if (selectedCity && event.city !== selectedCity) return false;
    return true;
  });

  return (
    <motion.section
      className="max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-8 justify-center"
        variants={filterVariants}
      >
        <div className="flex-1">
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
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
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Province
          </label>
          <select
            id="province"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
          >
            <option value="">All Provinces</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
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
            City
          </label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2"
        variants={containerVariants}
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
              ) : (
                null
                // <div className="w-full h-48 bg-gray-800/50 flex items-center justify-center">
                //   <svg
                //     className="w-12 h-12 text-gray-600"
                //     fill="none"
                //     stroke="currentColor"
                //     viewBox="0 0 24 24"
                //   >
                //     <path
                //       strokeLinecap="round"
                //       strokeLinejoin="round"
                //       strokeWidth={2}
                //       d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                //     />
                //   </svg>
                // </div>
              )}
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
          No events found matching the selected filters.
        </motion.div>
      )}
    </motion.section>
  );
}
