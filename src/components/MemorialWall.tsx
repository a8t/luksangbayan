"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createMemorialMessage } from "@/app/actions";
import { useMemorialMessages } from "@/hooks/useMemorialMessages";

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

interface FormData {
  name: string;
  city: string;
  province: string;
  country: string;
  email: string;
  message: string;
}

const DRAFT_KEY = "memorial-wall-draft";
const MESSAGES_PER_PAGE = 10;

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

export default function MemorialWall() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
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

  const { data, isLoading, isError } = useMemorialMessages(
    currentPage,
    MESSAGES_PER_PAGE,
    false
  );

  const messages = data?.messages || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / MESSAGES_PER_PAGE);

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
      } else {
        setError(result.error || "Failed to submit message");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll the messages section into view
    document
      .getElementById("messages-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="grid gap-8 mx-auto">
        {/* Message Form */}
        <motion.div variants={itemVariants}>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-6"
          >
            <h2 className="text-2xl font-serif mb-6">Share Your Message</h2>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
                {error}
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Share Message"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Messages Display */}
        <motion.div
          variants={itemVariants}
          id="messages-section"
          className="space-y-6 mx-auto break-all"
        >
          <h2 className="text-2xl font-serif mb-6">Messages</h2>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
          ) : isError ? (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
              Error loading messages
            </div>
          ) : messages.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No messages yet</p>
          ) : (
            <>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={itemVariants}
                    className="bg-gray-900/50 border border-gray-800 rounded-lg p-4"
                  >
                    <p className="text-gray-300 mb-2">{message.message}</p>
                    <p className="text-sm text-gray-400">
                      - {message.name} from {message.city}, {message.province}
                    </p>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
