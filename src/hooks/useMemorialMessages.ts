import { useQuery } from "@tanstack/react-query";
import type { MemorialMessage } from "@/db/schema";

interface PaginatedMessages {
  messages: MemorialMessage[];
  totalCount: number;
  isAdmin: boolean;
}

async function fetchMemorialMessages(
  page: number = 1,
  perPage: number = 10,
  status: string | "all" = "all"
): Promise<PaginatedMessages> {
  const response = await fetch(
    `/api/memorial-messages?page=${page}&perPage=${perPage}&status=${status}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useMemorialMessages(
  page: number = 1,
  perPage: number = 10,
  status: string | "all" = "all"
) {
  return useQuery({
    queryKey: ["memorialMessages", page, perPage, status],
    queryFn: () => fetchMemorialMessages(page, perPage, status),
    placeholderData: (previousData) => previousData,
  });
}
