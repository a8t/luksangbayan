"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePendingCount } from "@/hooks/usePendingCount";
import AdminAuthCheck from "@/components/AdminAuthCheck";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Vigil Events",
  },
  {
    href: "/admin/memorial-messages",
    label: "Memorial Messages",
  },

  // Add more admin sections here as needed
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: pendingCount = 0 } = usePendingCount();

  // Don't wrap login page with auth check
  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-black text-white">
        <nav className="bg-gray-900/50 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ← Back to Site
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium relative ${
                      pathname === item.href
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {item.href === "/admin/memorial-messages" &&
                      pendingCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {pendingCount}
                        </span>
                      )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
        {children}
      </div>
    </AdminAuthCheck>
  );
}
