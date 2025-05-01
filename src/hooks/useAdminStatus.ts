import { useQuery } from "@tanstack/react-query";

async function fetchAdminStatus() {
  const response = await fetch(`/api/admin/check-auth`);

  if (!response.ok) {
    throw new Error("Failed to fetch admin status");
  }
  const data = await response.json();
  return data.authenticated;
}

export function useAdminStatus() {
  return useQuery({
    queryKey: ["adminStatus"],
    queryFn: fetchAdminStatus,
    // Refresh every minute
    refetchInterval: 60000,
  });
}
