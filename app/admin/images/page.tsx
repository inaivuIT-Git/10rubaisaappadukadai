"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import AdminSidebar from "../../components/admin/AdminSidebar";

import "../../styles/AdminLayout.css";
import "../../styles/AdminImages.css";

type ImageStatus = "Uploaded" | "Pending";

type OccasionImage = {
  id: number;
  donorName: string;
  mobile: string;
  occasion: string;
  personName: string;
  foodOfferedDate: string;
  imageStatus: ImageStatus;
  imageName?: string;
};

const initialImages: OccasionImage[] = [
  {
    id: 1,
    donorName: "Ravi",
    mobile: "98765 43210",
    occasion: "பிறந்தநாள்",
    personName: "Ananya",
    foodOfferedDate: "2026-09-04",
    imageStatus: "Uploaded",
    imageName: "image-1.jpg",
  },
  {
    id: 2,
    donorName: "Priya",
    mobile: "97900 56789",
    occasion: "திருமண நாள்",
    personName: "Priya & Arun",
    foodOfferedDate: "2026-09-04",
    imageStatus: "Pending",
  },
  {
    id: 3,
    donorName: "Kumar",
    mobile: "98400 12345",
    occasion: "நினைவு நாள்",
    personName: "Late Ramesh",
    foodOfferedDate: "2026-09-04",
    imageStatus: "Pending",
  },
  {
    id: 4,
    donorName: "Suresh",
    mobile: "98844 22110",
    occasion: "பிறந்தநாள்",
    personName: "Karthik",
    foodOfferedDate: "2026-09-04",
    imageStatus: "Uploaded",
    imageName: "image-1.jpg",
  },
];

export default function AdminImagesPage() {
  const searchParams = useSearchParams();

  const view =
    searchParams.get("view") === "pending"
      ? "pending"
      : "today";

  const [images, setImages] =
    useState<OccasionImage[]>(initialImages);

  const [search, setSearch] = useState("");

  const today = "2026-09-02";

  const filteredImages = useMemo(() => {
    return images.filter((item) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        item.donorName.toLowerCase().includes(searchValue) ||
        item.personName.toLowerCase().includes(searchValue) ||
        item.mobile.toLowerCase().includes(searchValue);

      if (view === "today") {
        return (
          item.foodOfferedDate === today &&
          matchesSearch
        );
      }

      return (
        item.imageStatus === "Pending" &&
        matchesSearch
      );
    });
  }, [images, search, view]);

  const todayUploadedCount = images.filter(
    (item) =>
      item.foodOfferedDate === today &&
      item.imageStatus === "Uploaded"
  ).length;

  const todayPendingCount = images.filter(
    (item) =>
      item.foodOfferedDate === today &&
      item.imageStatus === "Pending"
  ).length;

  const totalPendingCount = images.filter(
    (item) => item.imageStatus === "Pending"
  ).length;

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  function getStoragePath(item: OccasionImage) {
    const [year, month, day] =
      item.foodOfferedDate.split("-");

    if (item.imageStatus === "Pending") {
      return `${year} / ${month} / ${day} / image-n`;
    }

    return `${year} / ${month} / ${day} / ${item.imageName}`;
  }

  function handleUploadImage(id: number) {
    setImages((currentImages) =>
      currentImages.map((item) =>
        item.id === id
          ? {
              ...item,
              imageStatus: "Uploaded",
              imageName: "image-1.jpg",
            }
          : item
      )
    );

    alert(
      "UI மட்டும்: படம் பதிவேற்றப்பட்டதாக குறிக்கப்பட்டது."
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main-container">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}

          <div className="images-page-header">
            <div>
              <span className="admin-page-label">
                படங்கள்
              </span>

              <h1>
                {view === "today"
                  ? "இன்றைய நிகழ்வு படங்கள்"
                  : "நிலுவையில் உள்ள படங்கள்"}
              </h1>

              <p>
                {view === "today"
                  ? "இன்று உணவு வழங்கப்படும் நன்கொடைகளுக்கான நிகழ்வு படங்களை இங்கே நிர்வகிக்கலாம்."
                  : "இன்னும் பதிவேற்றப்படாத நிகழ்வு படங்களை இங்கே காணலாம் மற்றும் பதிவேற்றலாம்."}
              </p>
            </div>
          </div>


          {/* =====================================================
              VIEW TABS
          ===================================================== */}

          <section className="images-view-tabs">

            <a
              href="/admin/images?view=today"
              className={
                view === "today"
                  ? "images-view-tab active"
                  : "images-view-tab"
              }
            >
              Today&apos;s Images
            </a>

            <a
              href="/admin/images?view=pending"
              className={
                view === "pending"
                  ? "images-view-tab active"
                  : "images-view-tab"
              }
            >
              Pending Images
            </a>

          </section>


          {/* =====================================================
              SUMMARY
          ===================================================== */}

          {view === "today" ? (
            <section className="images-summary-grid">

              <div className="images-summary-card">
                <span>
                  இன்றைய மொத்த நன்கொடைகள்
                </span>

                <strong>
                  {
                    images.filter(
                      (item) =>
                        item.foodOfferedDate === today
                    ).length
                  }
                </strong>
              </div>

              <div className="images-summary-card uploaded">
                <span>
                  படம் பதிவேற்றப்பட்டது
                </span>

                <strong>
                  {todayUploadedCount}
                </strong>
              </div>

              <div className="images-summary-card pending">
                <span>
                  படம் நிலுவையில் உள்ளது
                </span>

                <strong>
                  {todayPendingCount}
                </strong>
              </div>

            </section>
          ) : (
            <section className="images-summary-grid pending-view">

              <div className="images-summary-card pending">
                <span>
                  மொத்த நிலுவை படங்கள்
                </span>

                <strong>
                  {totalPendingCount}
                </strong>
              </div>

            </section>
          )}


          {/* =====================================================
              SEARCH
          ===================================================== */}

          <section className="images-search-card">

            <div className="images-search-field">
              <label htmlFor="imageSearch">
                தேடல்
              </label>

              <input
                id="imageSearch"
                type="text"
                placeholder="நன்கொடையாளர் பெயர் / அலைபேசி / நபர் பெயர்"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <button
              type="button"
              className="images-reset-button"
              onClick={() => setSearch("")}
            >
              Reset
            </button>

          </section>


          {/* =====================================================
              IMAGE LIST
          ===================================================== */}

          <section className="images-list-card">

            <div className="images-list-header">
              <div>
                <h2>
                  {view === "today"
                    ? "இன்றைய படங்கள்"
                    : "நிலுவை படங்கள்"}
                </h2>

                <p>
                  மொத்தம் {filteredImages.length} பதிவுகள்
                </p>
              </div>
            </div>


            <div className="images-table-wrapper">
              <table className="images-table">

                <thead>
                  <tr>
                    <th>நன்கொடையாளர்</th>
                    <th>அலைபேசி</th>
                    <th>நிகழ்வு</th>
                    <th>யாருக்காக</th>
                    <th>உணவு வழங்கும் தேதி</th>
                    <th>பட நிலை</th>
                    <th>Storage Path</th>
                    <th>Action</th>
                  </tr>
                </thead>


                <tbody>
                  {filteredImages.length > 0 ? (
                    filteredImages.map((item) => (
                      <tr key={item.id}>

                        <td>
                          <strong>
                            {item.donorName}
                          </strong>
                        </td>

                        <td>
                          {item.mobile}
                        </td>

                        <td>
                          <span className="images-occasion-badge">
                            {item.occasion}
                          </span>
                        </td>

                        <td>
                          {item.personName}
                        </td>

                        <td>
                          {formatDate(
                            item.foodOfferedDate
                          )}
                        </td>

                        <td>
                          <span
                            className={`images-status ${item.imageStatus.toLowerCase()}`}
                          >
                            {item.imageStatus}
                          </span>
                        </td>

                        <td>
                          <code className="images-storage-path">
                            {getStoragePath(item)}
                          </code>
                        </td>

                        <td>
                          <div className="images-actions">

                            {item.imageStatus ===
                            "Pending" ? (
                              <button
                                type="button"
                                className="images-action-button upload"
                                onClick={() =>
                                  handleUploadImage(
                                    item.id
                                  )
                                }
                              >
                                Upload Image
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="images-action-button view"
                                onClick={() =>
                                  alert(
                                    `View image: ${item.imageName}`
                                  )
                                }
                              >
                                View Image
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="images-empty-state"
                      >
                        பதிவுகள் எதுவும் இல்லை.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>

          </section>

        </div>
      </main>
    </div>
  );
}