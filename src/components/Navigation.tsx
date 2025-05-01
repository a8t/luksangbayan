"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { checkAdminStatus } from "@/lib/auth";
import { usePendingCount } from "@/hooks/usePendingCount";

export default function Navigation() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: pendingCount = 0 } = usePendingCount();

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await checkAdminStatus();
      setIsAdmin(adminStatus);
    };
    checkAdmin();
  }, []);

  return (
    <nav className="mb-6 flex justify-end gap-x-4">
      <Link
        href="/"
        className={`text-gray-300 hover:text-white transition-colors ${
          pathname === "/" ? "text-white" : ""
        }`}
      >
        Home
      </Link>
      <Link
        href="/memorial-wall"
        className={`text-gray-300 hover:text-white transition-colors ${
          pathname === "/memorial-wall" ? "text-white" : ""
        }`}
      >
        Memorial Wall
      </Link>
      <Link
        href="/about"
        className={`text-gray-300 hover:text-white transition-colors ${
          pathname === "/about" ? "text-white" : ""
        }`}
      >
        About
      </Link>
      {isAdmin && (
        <Link
          href="/admin/memorial-messages"
          className={`text-gray-300 hover:text-white transition-colors relative ${
            pathname.startsWith("/admin") ? "text-white" : ""
          }`}
        >
          Admin
          {pendingCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {pendingCount}
            </span>
          )}
        </Link>
      )}
    </nav>
  );
}
