"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface VigilEventFormProps {
  event?: {
    id: number;
    city: string;
    province: string;
    date: string;
    time: string;
    location: string;
    details: string;
    organizers: string;
  };
}

export default function VigilEventForm({ event }: VigilEventFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    city: event?.city || "",
    province: event?.province || "",
    date: event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
    time: event?.time || "",
    location: event?.location || "",
    details: event?.details || "",
    organizers: event?.organizers || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const url = event
        ? `/api/admin/vigil-events/${event.id}`
        : "/api/admin/vigil-events";
      const method = event ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save event");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save event. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isFieldValid = (name: string) => {
    if (!touched[name]) return true;
    return formData[name as keyof typeof formData].trim() !== "";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-black mb-6">
        {event ? "Edit Event" : "Create New Event"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Event {event ? "updated" : "created"} successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-black mb-1"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              required
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFieldValid("city")
                  ? "border-gray-300"
                  : "border-red-500 focus:ring-red-500"
              } text-black`}
            />
            {!isFieldValid("city") && (
              <p className="mt-1 text-sm text-red-600">City is required</p>
            )}
          </div>

          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium text-black mb-1"
            >
              Province
            </label>
            <input
              type="text"
              name="province"
              id="province"
              required
              value={formData.province}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFieldValid("province")
                  ? "border-gray-300"
                  : "border-red-500 focus:ring-red-500"
              } text-black`}
            />
            {!isFieldValid("province") && (
              <p className="mt-1 text-sm text-red-600">Province is required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-black mb-1"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              value={formData.date}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFieldValid("date")
                  ? "border-gray-300"
                  : "border-red-500 focus:ring-red-500"
              } text-black`}
            />
            {!isFieldValid("date") && (
              <p className="mt-1 text-sm text-red-600">Date is required</p>
            )}
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-black mb-1"
            >
              Time
            </label>
            <input
              type="text"
              name="time"
              id="time"
              required
              value={formData.time}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., 6:00 PM"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFieldValid("time")
                  ? "border-gray-300"
                  : "border-red-500 focus:ring-red-500"
              } text-black`}
            />
            {!isFieldValid("time") && (
              <p className="mt-1 text-sm text-red-600">Time is required</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-black mb-1"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isFieldValid("location")
                ? "border-gray-300"
                : "border-red-500 focus:ring-red-500"
            } text-black`}
          />
          {!isFieldValid("location") && (
            <p className="mt-1 text-sm text-red-600">Location is required</p>
          )}
        </div>

        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-black mb-1"
          >
            Details
          </label>
          <textarea
            name="details"
            id="details"
            required
            rows={4}
            value={formData.details}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isFieldValid("details")
                ? "border-gray-300"
                : "border-red-500 focus:ring-red-500"
            } text-black`}
          />
          {!isFieldValid("details") && (
            <p className="mt-1 text-sm text-red-600">Details are required</p>
          )}
        </div>

        <div>
          <label
            htmlFor="organizers"
            className="block text-sm font-medium text-black mb-1"
          >
            Organizers
          </label>
          <input
            type="text"
            name="organizers"
            id="organizers"
            value={formData.organizers}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="px-4 py-2 border border-gray-300 rounded-md text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md text-white ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
