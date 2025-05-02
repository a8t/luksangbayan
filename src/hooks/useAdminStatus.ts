import { useQuery } from "@tanstack/react-query";

export async function fetchAdminStatus(): Promise<boolean> {
  const response = await fetch(`/api/admin/check-auth`);

  if (!response.ok) {
    return false;
  }
  const data = await response.json();
  return data.authenticated;
}

export function useAdminStatus() {
  return useQuery<boolean>({
    queryKey: ["adminStatus"],
    queryFn: fetchAdminStatus,
    // Refresh every minute
    refetchInterval: 60000,
  });
}
