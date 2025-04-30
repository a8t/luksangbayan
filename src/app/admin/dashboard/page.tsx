"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { VigilEvent } from "@/types/vigilEvent";

export default function DashboardPage() {
  const [events, setEvents] = useState<VigilEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/vigil-events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/admin/vigil-events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      // Refresh the events list
      fetchEvents();
    } catch (err) {
      setError("Failed to delete event");
      console.error(err);
    }
  };

  const eventsSortedByDate = events.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <Link
              href="/admin/dashboard/vigil-events/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create New Event
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {eventsSortedByDate.map((event) => {
                  const cityProvince = event?.city + ", " + event?.province;
                  return (
                    <li key={event.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-medium text-blue-600 truncate">
                              {cityProvince} -{" "}
                              <i className="text-gray-500">{event.details}</i>
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-4">
                            <Link
                              href={`/admin/dashboard/vigil-events/${event.id}/edit`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
                {events.length === 0 && (
                  <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                    No events found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
