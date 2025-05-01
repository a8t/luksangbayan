"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import ImageUpload from "@/components/ImageUpload";

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
    links: string[];
    image?: string;
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
    links: event?.links || [],
    image: event?.image || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [linkErrors, setLinkErrors] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>(
    event?.links ? event.links.filter(Boolean) : []
  );
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [newLink, setNewLink] = useState("");

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateLinks = (links: string[]): string[] => {
    return links
      .map((link) => {
        return validateUrl(link) ? "" : `"${link}" is not a valid URL`;
      })
      .filter((l) => l !== "");
  };

  const handleAddLink = () => {
    if (!newLink.trim()) return;
    if (!validateUrl(newLink)) {
      setLinkErrors([`"${newLink}" is not a valid URL`]);
      return;
    }
    setLinks([...links, newLink.trim()]);
    setNewLink("");
    setLinkErrors([]);
    setFormData((prev) => ({
      ...prev,
      links: [...links, newLink.trim()],
    }));
  };

  const handleEditLink = (index: number) => {
    setEditingLinkIndex(index);
    setNewLink(links[index]);
  };

  const handleUpdateLink = () => {
    if (!newLink.trim() || editingLinkIndex === null) return;
    if (!validateUrl(newLink)) {
      setLinkErrors([`"${newLink}" is not a valid URL`]);
      return;
    }
    const updatedLinks = [...links];
    updatedLinks[editingLinkIndex] = newLink.trim();
    setLinks(updatedLinks);
    setNewLink("");
    setEditingLinkIndex(null);
    setLinkErrors([]);
    setFormData((prev) => ({
      ...prev,
      links: updatedLinks,
    }));
  };

  const handleDeleteLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    setFormData((prev) => ({
      ...prev,
      links: updatedLinks,
    }));
  };

  const handleCancelEdit = () => {
    setNewLink("");
    setEditingLinkIndex(null);
    setLinkErrors([]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "newLink") {
      const errors = validateUrl(value)
        ? []
        : [`"${value}" is not a valid URL`];
      setLinkErrors(errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate links before submission
    const linkValidationErrors = validateLinks(formData.links);
    if (linkValidationErrors.length > 0) {
      setLinkErrors(linkValidationErrors);
      setIsLoading(false);
      return;
    }

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

      toast.success("Event saved successfully!");
      if (!event) {
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      }
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

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isFieldValid = (name: string) => {
    if (!touched[name]) return true;
    const value = formData[name as keyof typeof formData];
    if (name === "links") {
      return Array.isArray(value) && value.length > 0;
    }
    return typeof value === "string" && value.trim() !== "";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {event ? "Edit Event" : "Create New Event"}
        </h2>
        
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
          aria-label="Back to dashboard"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 flex items-center">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-300 mb-1"
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
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFieldValid("city")
                  ? "border-gray-700 text-gray-200"
                  : "border-red-500 focus:ring-red-500 text-gray-200"
              }`}
            />
            {!isFieldValid("city") && (
              <p className="mt-1 text-sm text-red-400">City is required</p>
            )}
          </div>

          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium text-gray-300 mb-1"
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
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFieldValid("province")
                  ? "border-gray-700 text-gray-200"
                  : "border-red-500 focus:ring-red-500 text-gray-200"
              }`}
            />
            {!isFieldValid("province") && (
              <p className="mt-1 text-sm text-red-400">Province is required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-300 mb-1"
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
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFieldValid("date")
                  ? "border-gray-700 text-gray-200"
                  : "border-red-500 focus:ring-red-500 text-gray-200"
              }`}
            />
            {!isFieldValid("date") && (
              <p className="mt-1 text-sm text-red-400">Date is required</p>
            )}
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-300 mb-1"
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
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                ${
                  isFieldValid("time")
                    ? "border-gray-700 text-gray-200"
                    : "border-red-500 focus:ring-red-500 text-gray-200"
                }`}
            />
            {!isFieldValid("time") && (
              <p className="mt-1 text-sm text-red-400">Time is required</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-300 mb-1"
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
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isFieldValid("location")
                ? "border-gray-700 text-gray-200"
                : "border-red-500 focus:ring-red-500 text-gray-200"
            }`}
          />
          {!isFieldValid("location") && (
            <p className="mt-1 text-sm text-red-400">Location is required</p>
          )}
        </div>

        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-300 mb-1"
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
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isFieldValid("details")
                ? "border-gray-700 text-gray-200"
                : "border-red-500 focus:ring-red-500 text-gray-200"
            }`}
          />
          {!isFieldValid("details") && (
            <p className="mt-1 text-sm text-red-400">Details are required</p>
          )}
        </div>

        <div>
          <label
            htmlFor="organizers"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Organizers
          </label>
          <input
            type="text"
            id="organizers"
            name="organizers"
            value={formData.organizers}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-200"
          />
        </div>

        <div>
          <label
            htmlFor="links"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Links
          </label>
          <div className="space-y-2">
            {links.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-blue-400 hover:text-blue-300 hover:underline truncate"
                >
                  {link}
                </a>
                <button
                  type="button"
                  onClick={() => handleEditLink(index)}
                  className="p-2 text-gray-400 hover:text-gray-200 focus:outline-none"
                  aria-label="Edit link"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLink(index)}
                  className="p-2 text-red-400 hover:text-red-300 focus:outline-none"
                  aria-label="Delete link"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              name="newLink"
              value={newLink}
              onChange={(e) => {
                setNewLink(e.target.value);
                setLinkErrors([]);
              }}
              placeholder="Enter a URL"
              className={`flex-1 px-3 py-2 bg-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-200 ${
                linkErrors.length > 0 ? "border-red-500" : "border-gray-700"
              }`}
            />
            {editingLinkIndex === null ? (
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Link
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleUpdateLink}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {linkErrors.length > 0 && (
            <div className="mt-2 text-sm text-red-400">
              {linkErrors.map((error, index) => (
                <p key={index} className="flex items-start">
                  <svg
                    className="h-4 w-4 mr-1 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Event Image
          </label>
          <ImageUpload
            onUpload={(url) => {
              setFormData((prev) => ({ ...prev, image: url }));
            }}
            existingImageUrl={formData.image}
            className="mb-6"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        theme="dark"
      />
    </div>
  );
}
