"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { memorialMessageStatus } from "@/db/schema";
import { motion } from "framer-motion";
import { usePendingCount } from "@/hooks/usePendingCount";

interface MemorialMessage {
  id: number;
  message: string;
  name: string;
  email: string | null;
  city: string;
  province: string;
  country: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  createdAt: string;
}

const MESSAGES_PER_PAGE = 20;

type ModerateAction = "approve" | "reject" | "delete";

async function moderateMessage(
  messageId: number,
  action: ModerateAction,
  rejectionReason?: string
) {
  const response = await fetch("/api/memorial-messages/moderate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
    },
    body: JSON.stringify({
      messageId,
      action,
      rejectionReason,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to moderate message");
  }

  return response.json();
}

async function fetchMessages(page: number, status: string | "all") {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: MESSAGES_PER_PAGE.toString(),
    ...(status !== "all" && { status }),
  });

  const response = await fetch(`/api/memorial-messages?${params}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return response.json();
}

export default function AdminMemorialMessages() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [moderationError, setModerationError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [messageToModerate, setMessageToModerate] = useState<number | null>(
    null
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["messages", currentPage, selectedStatus],
    queryFn: () => fetchMessages(currentPage, selectedStatus),
  });

  const { refetch: refetchPendingCount } = usePendingCount();

  const messages = data?.messages || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / MESSAGES_PER_PAGE);

  const handleModerate = async (messageId: number, action: ModerateAction) => {
    try {
      setModerationError("");
      if (action === "reject" && !rejectionReason) {
        setModerationError("Please provide a reason for rejection");
        return;
      }
      await moderateMessage(messageId, action, rejectionReason);
      setMessageToModerate(null);
      setRejectionReason("");
      refetch();
      refetchPendingCount();
    } catch {
      setModerationError("Failed to moderate message");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-200";
      case "approved":
        return "bg-green-500/20 text-green-200";
      case "rejected":
        return "bg-red-500/20 text-red-200";
      default:
        return "bg-gray-500/20 text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif">Memorial Messages Admin</h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1); // Reset to first page when changing status
              }}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <option value="all">All Messages</option>
              {Object.values(memorialMessageStatus.enumValues).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {moderationError && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {moderationError}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        ) : isError ? (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
            Error loading messages
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No messages found</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {messages.map((message: MemorialMessage) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            message.status
                          )}`}
                        >
                          {message.status}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4 break-all">
                        {message.message}
                      </p>
                      <div className="text-sm text-gray-400">
                        <p>
                          From: {message.name} ({message.email || "No email"})
                        </p>
                        <p>
                          Location: {message.city}, {message.province},{" "}
                          {message.country}
                        </p>
                      </div>
                      {message.status === "rejected" &&
                        message.rejectionReason && (
                          <p className="mt-2 text-sm text-red-400">
                            Rejected: {message.rejectionReason}
                          </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {message.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleModerate(message.id, "approve")
                            }
                            className="px-4 py-2 bg-green-600/20 text-green-200 rounded hover:bg-green-600/30 transition-colors"
                          >
                            Approve
                          </button>
                          {messageToModerate === message.id ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                value={rejectionReason}
                                onChange={(e) =>
                                  setRejectionReason(e.target.value)
                                }
                                placeholder="Reason for rejection"
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                              />
                              <button
                                onClick={() =>
                                  handleModerate(message.id, "reject")
                                }
                                className="px-4 py-2 bg-red-600/20 text-red-200 rounded hover:bg-red-600/30 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => {
                                  setMessageToModerate(null);
                                  setRejectionReason("");
                                }}
                                className="px-4 py-2 bg-gray-600/20 text-gray-200 rounded hover:bg-gray-600/30 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setMessageToModerate(message.id)}
                              className="px-4 py-2 bg-red-600/20 text-red-200 rounded hover:bg-red-600/30 transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </>
                      )}
                      {message.status !== "pending" && (
                        <button
                          onClick={() => handleModerate(message.id, "delete")}
                          className="px-4 py-2 bg-red-600/20 text-red-200 rounded hover:bg-red-600/30 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
