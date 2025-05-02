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
  const { data: isAdmin, isLoading } = useAdminStatus();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/admin/login");
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
