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
  showModerated: boolean = false
): Promise<PaginatedMessages> {
  const response = await fetch(
    `/api/memorial-messages?page=${page}&perPage=${perPage}&showModerated=${showModerated}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useMemorialMessages(
  page: number = 1,
  perPage: number = 10,
  showModerated: boolean = false
) {
  return useQuery({
    queryKey: ["memorialMessages", page, perPage, showModerated],
    queryFn: () => fetchMemorialMessages(page, perPage, showModerated),
    placeholderData: (previousData) => previousData,
  });
}
