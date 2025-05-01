"use client";

import { QueryClient } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

export const invalidateQueries = async (queryKey: string[]) => {
  await queryClient.invalidateQueries({ queryKey });
};

export default queryClient;
