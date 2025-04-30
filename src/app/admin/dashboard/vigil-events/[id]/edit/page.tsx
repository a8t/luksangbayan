"use client";

import React, { useState, useEffect } from "react";
import VigilEventForm from "../../form";

interface VigilEvent {
  id: number;
  city: string;
  province: string;
  date: string;
  time: string;
  location: string;
  details: string;
  organizers: string;
  links: string[];
}

export default function EditVigilEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const [event, setEvent] = useState<VigilEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvent = React.useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/vigil-events/${resolvedParams.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch event");
      const data = await response.json();
      setEvent(data);
    } catch (err) {
      setError("Failed to load event");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchEvent();
  }, [resolvedParams.id, fetchEvent]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">Event not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VigilEventForm event={event} />
      </div>
    </div>
  );
}
