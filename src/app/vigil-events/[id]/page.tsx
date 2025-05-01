"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { checkAdminStatus } from "@/app/actions";

interface VigilEvent {
  id: number;
  city: string;
  province: string;
  date: string;
  time: string;
  location: string;
  details: string;
  organizers: string;
  createdAt: string;
  updatedAt: string;
  links: string[];
}

export default function VigilEventPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<VigilEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const adminStatus = await checkAdminStatus();
        setIsAdmin(adminStatus);
      } catch (err) {
        console.error("Failed to check admin status:", err);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/vigil-events/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch event");
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError("Failed to load event");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gray-900 py-6 flex items-center justify-center"
        role="status"
        aria-label="Loading event"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"
          aria-hidden="true"
        ></div>
        <span className="sr-only">Loading event...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-gray-900 py-6"
        role="alert"
        aria-live="assertive"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="bg-gray-800 border border-gray-700 text-gray-200 px-4 py-3 rounded"
            role="alert"
          >
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">Event not found</div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/"
            className="ml-auto text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors"
          >
            ← Back to Events
          </Link>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-100 mb-2">
                  {event.city}, {event.province}
                </h1>
                <p className="text-lg text-gray-300">
                  {formattedDate} at {event.time}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  Location
                </h2>
                <p className="text-gray-300">{event.location}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  Details
                </h2>
                <p className="text-gray-300 whitespace-pre-line">
                  {event.details}
                </p>
              </div>

              {event.organizers && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-100 mb-2">
                    Organizers
                  </h2>
                  <p className="text-gray-300">{event.organizers}</p>
                </div>
              )}

              {event.links.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-100 mb-2">
                    Links
                  </h2>
                  <div className="space-y-2">
                    {event.links.map(
                      (link, index) =>
                        link.trim() && (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {link}
                          </a>
                        )
                    )}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Last updated: {new Date(event.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          {isAdmin && (
            <button
              onClick={() =>
                router.push(`/admin/dashboard/vigil-events/${event.id}/edit`)
              }
              className="mt-4 bg-green-700 px-4 py-2 flex items-center gap-2 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors"
              aria-label={`Edit event in ${event.city}, ${event.province}`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
