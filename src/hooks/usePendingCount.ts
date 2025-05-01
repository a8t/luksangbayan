import { useQuery } from "@tanstack/react-query";

async function fetchPendingCount() {
  const response = await fetch("/api/memorial-messages/pending-count", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch pending count");
  }
  const data = await response.json();
  return data.count;
}

export function usePendingCount() {
  return useQuery({
    queryKey: ["pendingCount"],
    queryFn: fetchPendingCount,
    // Refresh every minute
    refetchInterval: 60000,
  });
}
