"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";

import "../../styles/AdminLayout.css";
import "../../styles/AdminDailyMenu.css";

type DailyMenu = {
  id: string;
  menuDate: string;
  fileName: string;
  title: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function DailyMenuPage() {
  const [menuDate, setMenuDate] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [existingMenu, setExistingMenu] = useState<DailyMenu | null>(null);

  const [loadingMenus, setLoadingMenus] = useState(true);
  const [checkingDate, setCheckingDate] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const todayValue = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  useEffect(() => {
    setMenuDate(todayValue);
  }, [todayValue]);

  useEffect(() => {
    loadMenus();
  }, []);

  useEffect(() => {
    if (!menuDate) {
      setExistingMenu(null);
      return;
    }

    loadMenuByDate(menuDate);
  }, [menuDate]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function loadMenus() {
    try {
      setLoadingMenus(true);

      const response = await fetch("/api/admin/daily-menu", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load menus.");
      }

      setMenus(data.menus ?? []);
    } catch (error) {
      console.error("Load menus error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load menus.",
      );
    } finally {
      setLoadingMenus(false);
    }
  }

  async function loadMenuByDate(dateValue: string) {
    try {
      setCheckingDate(true);

      const response = await fetch(
        `/api/admin/daily-menu?date=${encodeURIComponent(dateValue)}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to check menu date.",
        );
      }

      const menu = data.menu ?? null;

      setExistingMenu(menu);

      if (menu) {
        setTitle(menu.title ?? "");
      } else {
        setTitle("");
      }
    } catch (error) {
      console.error("Check menu date error:", error);

      setExistingMenu(null);
    } finally {
      setCheckingDate(false);
    }
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0] ?? null;

    setError("");
    setMessage("");

    if (!selectedFile) {
      setFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only JPG, PNG and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxFileSize) {
      setError("Menu image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!menuDate) {
      setError("Menu date is required.");
      return;
    }

    if (!file) {
      setError("Please select a menu image.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("menuDate", menuDate);
      formData.append("title", title.trim());
      formData.append("file", file);

      const response = await fetch("/api/admin/daily-menu", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save menu.",
        );
      }

      setMessage(
        data.message || "Menu saved successfully.",
      );

      setFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      const fileInput =
        document.getElementById(
          "daily-menu-file",
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await Promise.all([
        loadMenus(),
        loadMenuByDate(menuDate),
      ]);
    } catch (error) {
      console.error("Daily menu save error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save menu.",
      );
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateValue: string) {
    const date = new Date(dateValue);

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

return (
  <div className="admin-layout">
    <AdminSidebar />

    <main className="admin-main">
      <div className="admin-main-container">

        <div className="daily-menu-page">
          <div className="daily-menu-header">
            <div>
              <span className="daily-menu-eyebrow">
                MEDIA MANAGEMENT
              </span>

              <h1>Daily Menu</h1>

              <p>
                Upload menu artwork for a selected date.
                The public website will display the menu
                automatically on that date.
              </p>
            </div>
          </div>

          {/* KEEP THE REST OF YOUR EXISTING PAGE HERE */}

        </div>

      </div>
    </main>
  </div>
);
}