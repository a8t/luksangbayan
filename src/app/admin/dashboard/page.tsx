"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<VigilEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/admin/vigil-events");

        if (!response.ok) {
          if (response.status === 401) {
            return router.push("/admin/login");
          }
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError("Failed to load events");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const handleDelete = async (id: number, eventName: string) => {
    if (!confirm(`Are you sure you want to delete the event in ${eventName}?`))
      return;

    try {
      const response = await fetch(`/api/admin/vigil-events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gray-900 py-6 flex items-center justify-center"
        role="status"
        aria-label="Loading events"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"
          aria-hidden="true"
        ></div>
        <span className="sr-only">Loading events...</span>
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
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedEvents = events.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-100">Admin Dashboard</h1>
          <Link
            href="/admin/dashboard/vigil-events/new"
            className="bg-gray-800 text-gray-100 px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            aria-label="Create new vigil event"
          >
            Create New Event
          </Link>
        </header>

        <main>
          <section
            className="bg-gray-800 shadow-md rounded-lg overflow-hidden"
            aria-labelledby="events-heading"
          >
            <div className="p-6">
              <h2
                id="events-heading"
                className="text-xl font-semibold text-gray-100 mb-4"
              >
                Vigil Events
              </h2>
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-700"
                  aria-label="List of vigil events"
                >
                  <thead className="bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Event
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Date & Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {sortedEvents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-4 text-center text-gray-400"
                        >
                          No events found
                        </td>
                      </tr>
                    ) : (
                      sortedEvents.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/vigil-events/${event.id}`}
                              className="text-gray-200 hover:text-white font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors"
                              aria-label={`View event in ${event.city}, ${event.province}`}
                            >
                              {event.city}, {event.province}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                            <time dateTime={event.date}>
                              {formatDate(event.date)} at {event.time}
                            </time>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/dashboard/vigil-events/${event.id}/edit`
                                )
                              }
                              className="text-gray-300 hover:text-white mr-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors"
                              aria-label={`Edit event in ${event.city}, ${event.province}`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(
                                  event.id,
                                  `${event.city}, ${event.province}`
                                )
                              }
                              className="text-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors"
                              aria-label={`Delete event in ${event.city}, ${event.province}`}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
