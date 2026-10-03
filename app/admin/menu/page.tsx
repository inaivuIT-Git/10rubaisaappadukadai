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
  const [file, setFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [menus, setMenus] = useState<DailyMenu[]>([]);

  const [existingMenu, setExistingMenu] = useState<DailyMenu | null>(null);

  const [loadingMenus, setLoadingMenus] = useState(true);

  const [checkingDate, setCheckingDate] = useState(false);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     TODAY
  ===================================================== */

  const todayValue = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

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

  /* =====================================================
     LOAD MENU HISTORY
  ===================================================== */

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
        error instanceof Error ? error.message : "Unable to load menus.",
      );
    } finally {
      setLoadingMenus(false);
    }
  }

  /* =====================================================
     CHECK SELECTED DATE
  ===================================================== */

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
        throw new Error(data.message || "Unable to check menu date.");
      }

      setExistingMenu(data.menu ?? null);
    } catch (error) {
      console.error("Check menu date error:", error);

      setExistingMenu(null);
    } finally {
      setCheckingDate(false);
    }
  }

  /* =====================================================
     FILE SELECTION
  ===================================================== */

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
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

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

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

  /* =====================================================
     SAVE MENU
  ===================================================== */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

      formData.append("file", file);

      const response = await fetch("/api/admin/daily-menu", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save menu.");
      }

      setMessage(data.message || "Menu saved successfully.");

      setFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);

        setPreviewUrl(null);
      }

      const fileInput = document.getElementById(
        "daily-menu-file",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await Promise.all([loadMenus(), loadMenuByDate(menuDate)]);
    } catch (error) {
      console.error("Daily menu save error:", error);

      setError(error instanceof Error ? error.message : "Unable to save menu.");
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     DATE FORMAT
  ===================================================== */

  function formatDate(dateValue: string) {
    const date = new Date(dateValue);

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main-container">
          <div className="daily-menu-page">
            {/* HEADER */}

            <div className="daily-menu-header">
              <div>
                <span className="daily-menu-eyebrow">MEDIA MANAGEMENT</span>

                <h1>Daily Menu</h1>

                <p>
                  Upload one menu image for each date. The public website will
                  automatically display the menu scheduled for that day.
                </p>
              </div>
            </div>

            {/* FORM */}

            <div className="daily-menu-card">
              <div className="daily-menu-card-header">
                <div>
                  <h2>Upload Daily Menu</h2>

                  <p>Select the date and upload the complete menu artwork.</p>
                </div>
              </div>

              <form className="daily-menu-form" onSubmit={handleSubmit}>
                {/* DATE */}

                <div className="daily-menu-field">
                  <label htmlFor="menu-date">Menu Date</label>

                  <input
                    id="menu-date"
                    type="date"
                    value={menuDate}
                    onChange={(event) => {
                      setMenuDate(event.target.value);

                      setMessage("");
                      setError("");
                    }}
                    required
                  />

                  {checkingDate && (
                    <span className="daily-menu-help">
                      Checking existing menu...
                    </span>
                  )}

                  {!checkingDate && existingMenu && (
                    <div className="daily-menu-existing">
                      A menu is already uploaded for this date. Uploading a new
                      image will replace it.
                    </div>
                  )}

                  {!checkingDate && !existingMenu && menuDate && (
                    <span className="daily-menu-help">
                      No menu has been uploaded for this date.
                    </span>
                  )}
                </div>

                {/* IMAGE */}

                <div className="daily-menu-field">
                  <label htmlFor="daily-menu-file">Menu Image</label>

                  <input
                    id="daily-menu-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    required
                  />

                  <span className="daily-menu-help">
                    JPG, PNG or WebP. Maximum file size: 5 MB.
                  </span>
                </div>

                {/* PREVIEW */}

                {previewUrl && (
                  <div className="daily-menu-preview">
                    <span className="daily-menu-preview-title">Preview</span>

                    <img src={previewUrl} alt="Daily menu preview" />
                  </div>
                )}

                {/* ERROR */}

                {error && <div className="daily-menu-error">{error}</div>}

                {/* SUCCESS */}

                {message && <div className="daily-menu-success">{message}</div>}

                {/* BUTTON */}

                <div className="daily-menu-actions">
                  <button
                    type="submit"
                    className="daily-menu-save-button"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Menu"}
                  </button>
                </div>
              </form>
            </div>

            {/* RECENT MENUS */}

            <div className="daily-menu-history">
              <div className="daily-menu-history-header">
                <div>
                  <h2>Scheduled Menus</h2>

                  <p>Recently uploaded daily menu artwork.</p>
                </div>
              </div>

              {loadingMenus ? (
                <div className="daily-menu-empty">Loading menus...</div>
              ) : menus.length === 0 ? (
                <div className="daily-menu-empty">
                  No daily menus uploaded yet.
                </div>
              ) : (
                <div className="daily-menu-table-wrapper">
                  <table className="daily-menu-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>File</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {menus.map((menu) => (
                        <tr key={menu.id}>
                          <td>
                            <strong>{formatDate(menu.menuDate)}</strong>
                          </td>

                          <td>{menu.fileName}</td>

                          <td>
                            <span
                              className={
                                menu.isActive
                                  ? "daily-menu-status active"
                                  : "daily-menu-status inactive"
                              }
                            >
                              {menu.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
