import { VigilEvent } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

interface VigilEventsResponse {
  events: VigilEvent[];
  totalCount: number;
  isAdmin: boolean;
}

async function fetchVigilEvents() {
  const response = await fetch(`/api/vigil-events`);
  if (!response.ok) {
    throw new Error("Failed to fetch vigil events");
  }
  return response.json() as Promise<VigilEventsResponse>;
}

export function useVigilEvents() {
  return useQuery({
    queryKey: ["vigilEvents"],
    queryFn: () => fetchVigilEvents(),
  });
}
