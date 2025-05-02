"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createMemorialMessage } from "@/app/actions";

interface FormData {
  name: string;
  city: string;
  province: string;
  country: string;
  email: string;
  message: string;
}

const DRAFT_KEY = "memorial-wall-draft";

const getStoredDraft = (): FormData | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(DRAFT_KEY);
  return stored ? JSON.parse(stored) : null;
};

const saveDraft = (data: FormData) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
};

const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY);
};

export default function MemorialMessageForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const draft = getStoredDraft();
    return (
      draft || {
        name: "",
        city: "",
        province: "",
        country: "Canada",
        email: "",
        message: "",
      }
    );
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    saveDraft(updatedData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setShowSuccess(false);

    try {
      const result = await createMemorialMessage(formData);
      if (result.success) {
        clearDraft();
        setFormData({
          name: "",
          city: "",
          province: "",
          country: "Canada",
          email: "",
          message: "",
        });
        setShowSuccess(true);
        // Hide success message after 10 seconds
        setTimeout(() => setShowSuccess(false), 10000);
        // Close modal after 2 seconds
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setError(result.error || "Failed to submit message");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Form Container */}
      <motion.div
        initial={{ y: "calc(100% - 80px)" }}
        animate={{ y: isOpen ? 0 : "calc(100% - 80px)" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`mx-2 sm:mx-16 md:mx-24 fixed bottom-0 left-0 right-0 bg-gray-700/95 border-t border-gray-800 rounded-t-xl shadow-xl z-50 max-h-[90vh] ${
          isOpen ? "overflow-y-auto" : "overflow-y-clip"
        }`}
      >
        {/* Peek Handle */}
        <div
          className="h-20 flex items-center justify-center cursor-pointer hover:bg-gray-600/50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="text-lg sm:text-2xl font-serif">
            📝 Share Your Message
          </h2>
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            className="absolute right-4"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, height: "1px" }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : "1px" }}
          transition={{ delay: 0.1 }}
          className="px-4 pt-2 pb-6"
        >
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {showSuccess && (
              <div className="bg-emerald-900/50 border border-emerald-700 text-emerald-200 px-4 py-3 rounded mb-4">
                <p>
                  Thank you for sharing your message. It has been submitted for
                  review and will appear on the memorial wall once approved.
                </p>
                <p className="text-sm mt-1">
                  This usually takes less than 24 hours.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Optional, won&apos;t be displayed.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="province"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Province *
                  </label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    required
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>

              <div className="max-w-2xl mx-auto mb-2">
                <div className="bg-blue-900/40 border border-blue-700 text-blue-100 px-4 py-2 rounded text-center text-xs">
                  Messages are reviewed within 24 hours.
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-700 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Share Message"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
}
