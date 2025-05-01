import { useQuery } from "@tanstack/react-query";
import type { MemorialMessage } from "@/db/schema";

interface PaginatedMessages {
  messages: MemorialMessage[];
  totalCount: number;
}

async function fetchMemorialMessages(
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedMessages> {
  const response = await fetch(
    `/api/memorial-messages?page=${page}&perPage=${perPage}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useMemorialMessages(page: number = 1, perPage: number = 10) {
  return useQuery({
    queryKey: ["memorialMessages", page, perPage],
    queryFn: () => fetchMemorialMessages(page, perPage),
    placeholderData: (previousData) => previousData,
  });
}
