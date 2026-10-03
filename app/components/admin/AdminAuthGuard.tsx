"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { usePathname, useRouter } from "next/navigation";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

type AdminAuthContextType = {
  admin: AdminUser | null;
  isSuperAdmin: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  isSuperAdmin: false,
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

type AdminAuthGuardProps = {
  children: ReactNode;
};

export default function AdminAuthGuard({
  children,
}: AdminAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Login page is public
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      setLoading(false);
      return;
    }

    async function checkAuthentication() {
      try {
        setLoading(true);

        const response = await fetch("/api/admin/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          setAdmin(null);
          router.replace("/admin/login");
          return;
        }

        const data = await response.json();

        setAdmin(data.admin);
      } catch (error) {
        console.error(
          "Admin authentication error:",
          error
        );

        setAdmin(null);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuthentication();
  }, [pathname, router]);

  // Login page does not require authentication
  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return <>{children}</>;
  }

  // Wait while checking session
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  // Nothing should render while redirecting
  if (!admin) {
    return null;
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isSuperAdmin:
          admin.role === "SUPER_ADMIN",
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}