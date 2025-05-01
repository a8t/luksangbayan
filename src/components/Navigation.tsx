"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { checkAdminStatus } from "@/app/actions";

export default function Navigation() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

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
          className={`text-gray-300 hover:text-white transition-colors ${
            pathname.startsWith("/admin") ? "text-white" : ""
          }`}
        >
          Admin
        </Link>
      )}
    </nav>
  );
}
