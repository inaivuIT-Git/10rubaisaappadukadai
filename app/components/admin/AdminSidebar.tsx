"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useAdminAuth } from "./AdminAuthGuard";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { admin, isSuperAdmin } = useAdminAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  function isActive(path: string) {
    if (path === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(path);
  }

  function navClass(path: string) {
    return isActive(path)
      ? "admin-nav-link admin-nav-link-active"
      : "admin-nav-link";
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const response = await fetch(
        "/api/admin/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Logout failed.");
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="admin-sidebar">

      {/* BRAND */}

      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">
          ₹10
        </div>

        <div className="admin-sidebar-brand-text">
          <h2>10 Rupee Meals</h2>
          <p>Admin Portal</p>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav className="admin-sidebar-nav">

        {/* OVERVIEW */}

        <div className="admin-nav-group">
          <span className="admin-nav-title">
            OVERVIEW
          </span>

          <Link
            href="/admin"
            className={navClass("/admin")}
          >
            <span className="admin-nav-icon">
              ▦
            </span>

            <span>Dashboard</span>
          </Link>
        </div>

        {/* DONATIONS */}

        <div className="admin-nav-group">
          <span className="admin-nav-title">
            DONATIONS
          </span>

          <Link
            href="/admin/donations/add"
            className={navClass(
              "/admin/donations/add"
            )}
          >
            <span className="admin-nav-icon">
              ＋
            </span>

            <span>Add Donation</span>
          </Link>

          <Link
            href="/admin/donations"
            className={
              pathname === "/admin/donations"
                ? "admin-nav-link admin-nav-link-active"
                : "admin-nav-link"
            }
          >
            <span className="admin-nav-icon">
              ♡
            </span>

            <span>
              Donors & Donations
            </span>
          </Link>
        </div>

        {/* EXPENSES */}

        <div className="admin-nav-group">
          <span className="admin-nav-title">
            EXPENSES
          </span>

          <Link
            href="/admin/expenses"
            className={navClass(
              "/admin/expenses"
            )}
          >
            <span className="admin-nav-icon">
              ₹
            </span>

            <span>Expenses</span>
          </Link>
        </div>

        {/* MEDIA */}

        <div className="admin-nav-group">
          <span className="admin-nav-title">
            MEDIA
          </span>

          <Link
            href="/admin/menu"
            className={navClass(
              "/admin/menu"
            )}
          >
            <span className="admin-nav-icon">
              ☰
            </span>

            <span>
              Today&apos;s Menu
            </span>
          </Link>

          <Link
            href="/admin/images?view=today"
            className="admin-nav-link"
          >
            <span className="admin-nav-icon">
              ▧
            </span>

            <span>
              Today&apos;s Images
            </span>
          </Link>

          <Link
            href="/admin/images?view=pending"
            className="admin-nav-link"
          >
            <span className="admin-nav-icon">
              ◫
            </span>

            <span>
              Pending Images
            </span>
          </Link>
        </div>

        {/* SUPER ADMIN ONLY */}

        {isSuperAdmin && (
          <div className="admin-nav-group">
            <span className="admin-nav-title">
              MANAGEMENT
            </span>

            <Link
              href="/admin/users"
              className={navClass(
                "/admin/users"
              )}
            >
              <span className="admin-nav-icon">
                ◎
              </span>

              <span>
                User Management
              </span>
            </Link>
          </div>
        )}
      </nav>

      {/* USER */}

      <div className="admin-sidebar-footer">

        <div className="admin-sidebar-user">
          <div className="admin-user-avatar">
            {admin?.name
              ?.charAt(0)
              .toUpperCase() || "A"}
          </div>

          <div className="admin-user-info">
            <strong>
              {admin?.name || "Admin"}
            </strong>

            <span>
              {isSuperAdmin
                ? "Super Admin"
                : "Admin"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <span>↪</span>

          {loggingOut
            ? "Logging out..."
            : "Sign Out"}
        </button>

      </div>

    </aside>
  );
}