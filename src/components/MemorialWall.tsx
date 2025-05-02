"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMemorialMessages } from "@/hooks/useMemorialMessages";
import MemorialMessageForm from "./MemorialMessageForm";

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

const MESSAGES_PER_PAGE = 10;

export default function MemorialWall() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useMemorialMessages(
    currentPage,
    MESSAGES_PER_PAGE,
    "approved"
  );

  const messages = data?.messages || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / MESSAGES_PER_PAGE);

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
        {/* Messages Display */}
        <motion.div
          variants={itemVariants}
          id="messages-section"
          className="space-y-6 mx-auto break-all pb-48"
        >
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

      <MemorialMessageForm />
    </motion.div>
  );
}
