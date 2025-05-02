"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStatus } from "@/hooks/useAdminStatus";

export default function AdminAuthCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { refetch, data: isAdmin, isLoading } = useAdminStatus();

  // on mount, check if the user is admin
  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/admin/login");
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return <>{children}</>;
}
