"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAdminAuth } from "../../components/admin/AdminAuthGuard";

import "../../styles/AdminLayout.css";
import "../../styles/AdminDonations.css";

/* =====================================================
   TYPES
===================================================== */

type OccasionType =
  | "BIRTHDAY"
  | "WEDDING_ANNIVERSARY"
  | "MEMORIAL"
  | "OTHER";

type PaymentMethod =
  | "GPAY"
  | "CASH"
  | "NEFT"
  | null;

type Donation = {
  id: string;

  donor: {
    id: string;
    name: string;
    mobile: string;
    email: string | null;
    address: string | null;
  };

  occasion: {
    id: string;
    occasionType: OccasionType;
    donationFor: string;
    personName: string;
    relationshipToDonor: string | null;
    annualReminderEnabled: boolean;
  };

  foodOfferedDate: string;

  imageStatus: "Uploaded" | "Pending";
  imageCount: number;

  images: {
    id: string;
    fileName: string;
    sortOrder: number;
  }[];

  createdAt: string;

  /*
   * These fields are returned only for SUPER_ADMIN.
   */
  amountReceived?: number | null;
  paymentMethod?: PaymentMethod;
  transactionReference?: string | null;
  paymentReceivedDate?: string | null;
};

type DonationsResponse = {
  donations: Donation[];
  total: number;
};

/* =====================================================
   HELPERS
===================================================== */

function getOccasionLabel(
  occasionType: OccasionType
) {
  switch (occasionType) {
    case "BIRTHDAY":
      return "Birthday";

    case "WEDDING_ANNIVERSARY":
      return "Wedding Anniversary";

    case "MEMORIAL":
      return "Memorial";

    case "OTHER":
      return "Other Special Occasion";

    default:
      return occasionType;
  }
}

function getPaymentLabel(
  paymentMethod?: PaymentMethod
) {
  switch (paymentMethod) {
    case "GPAY":
      return "GPay";

    case "CASH":
      return "Cash";

    case "NEFT":
      return "NEFT";

    default:
      return "—";
  }
}

function formatDate(dateValue: string | null | undefined) {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/* =====================================================
   PAGE
===================================================== */

export default function DonationsPage() {
  const { isSuperAdmin } = useAdminAuth();

  const [donations, setDonations] = useState<
    Donation[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [occasion, setOccasion] =
    useState("all");

  const [payment, setPayment] =
    useState("all");

  const [imageStatus, setImageStatus] =
    useState("all");

  /* ===================================================
     LOAD DONATIONS
  =================================================== */

  useEffect(() => {
    async function loadDonations() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/donations",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data: DonationsResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            (data as unknown as { message?: string })
              .message ||
              "Unable to load donations."
          );
        }

        setDonations(data.donations ?? []);
      } catch (error) {
        console.error(
          "Load donations error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load donations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDonations();
  }, []);

  /* ===================================================
     FILTER DONATIONS
  =================================================== */

  const filteredDonations = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return donations.filter((donation) => {
      const donorName =
        donation.donor.name.toLowerCase();

      const mobile =
        donation.donor.mobile.toLowerCase();

      const personName =
        donation.occasion.personName.toLowerCase();

      const matchesSearch =
        !searchValue ||
        donorName.includes(searchValue) ||
        mobile.includes(searchValue) ||
        personName.includes(searchValue);

      const matchesOccasion =
        occasion === "all" ||
        donation.occasion.occasionType ===
          occasion;

      const matchesImage =
        imageStatus === "all" ||
        donation.imageStatus ===
          imageStatus;

      const matchesPayment =
        !isSuperAdmin ||
        payment === "all" ||
        donation.paymentMethod === payment;

      return (
        matchesSearch &&
        matchesOccasion &&
        matchesImage &&
        matchesPayment
      );
    });
  }, [
    donations,
    search,
    occasion,
    payment,
    imageStatus,
    isSuperAdmin,
  ]);

  /* ===================================================
     RESET FILTERS
  =================================================== */

  function resetFilters() {
    setSearch("");
    setOccasion("all");
    setPayment("all");
    setImageStatus("all");
  }

  /* ===================================================
     UI
  =================================================== */

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main-container">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="admin-page-header">
            <div>
              <span className="admin-page-label">
                DONATION MANAGEMENT
              </span>

              <h1>Donors & Donations</h1>

              <p>
                View and manage donor information,
                food sponsorships, occasions and
                donation history.
              </p>
            </div>

            <Link
              href="/admin/donations/add"
              className="admin-add-button"
            >
              + Add Donation
            </Link>
          </div>

          {/* ==========================================
              ERROR
          ========================================== */}

          {error && (
            <div className="donation-list-alert error">
              {error}
            </div>
          )}

          {/* ==========================================
              SEARCH & FILTERS
          ========================================== */}

          <section className="donor-search-card">
            <div className="donor-filter-title">
              <h2>Search & Filter</h2>

              <p>
                Find donations using donor details,
                occasion, payment method or image
                status.
              </p>
            </div>

            <div className="donor-search-grid">

              {/* SEARCH */}

              <div className="donor-filter-field donor-search-field">
                <label htmlFor="donorSearch">
                  Search
                </label>

                <input
                  id="donorSearch"
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Donor name / mobile / person name"
                />
              </div>

              {/* OCCASION */}

              <div className="donor-filter-field">
                <label htmlFor="occasion">
                  Occasion
                </label>

                <select
                  id="occasion"
                  value={occasion}
                  onChange={(event) =>
                    setOccasion(
                      event.target.value
                    )
                  }
                >
                  <option value="all">
                    All Occasions
                  </option>

                  <option value="BIRTHDAY">
                    Birthday
                  </option>

                  <option value="WEDDING_ANNIVERSARY">
                    Wedding Anniversary
                  </option>

                  <option value="MEMORIAL">
                    Memorial
                  </option>

                  <option value="OTHER">
                    Other Special Occasion
                  </option>
                </select>
              </div>

              {/* PAYMENT — SUPER ADMIN ONLY */}

              {isSuperAdmin && (
                <div className="donor-filter-field">
                  <label htmlFor="payment">
                    Payment Method
                  </label>

                  <select
                    id="payment"
                    value={payment}
                    onChange={(event) =>
                      setPayment(
                        event.target.value
                      )
                    }
                  >
                    <option value="all">
                      All Methods
                    </option>

                    <option value="GPAY">
                      GPay
                    </option>

                    <option value="CASH">
                      Cash
                    </option>

                    <option value="NEFT">
                      NEFT
                    </option>
                  </select>
                </div>
              )}

              {/* IMAGE STATUS */}

              <div className="donor-filter-field">
                <label htmlFor="imageStatus">
                  Image Status
                </label>

                <select
                  id="imageStatus"
                  value={imageStatus}
                  onChange={(event) =>
                    setImageStatus(
                      event.target.value
                    )
                  }
                >
                  <option value="all">
                    All Images
                  </option>

                  <option value="Uploaded">
                    Uploaded
                  </option>

                  <option value="Pending">
                    Pending
                  </option>
                </select>
              </div>

              <button
                type="button"
                className="donor-reset-button"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </section>

          {/* ==========================================
              DONATION LIST
          ========================================== */}

          <section className="admin-donation-card">

            <div className="admin-donation-card-header">
              <div>
                <h2>Donation Records</h2>

                <p>
                  {loading
                    ? "Loading records..."
                    : `${filteredDonations.length} ${
                        filteredDonations.length ===
                        1
                          ? "record"
                          : "records"
                      }`}
                </p>
              </div>
            </div>

            {/* ========================================
                LOADING
            ======================================== */}

            {loading ? (
              <div className="donor-empty-state">
                Loading donation records...
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-donation-table">

                  <thead>
                    <tr>
                      <th>Donor</th>

                      <th>Mobile</th>

                      <th>
                        Food Offered Date
                      </th>

                      <th>Occasion</th>

                      <th>
                        Person / Couple
                      </th>

                      {isSuperAdmin && (
                        <>
                          <th>Amount</th>
                          <th>Payment</th>
                        </>
                      )}

                      <th>Image</th>

                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDonations.map(
                      (donation) => (
                        <tr key={donation.id}>

                          {/* DONOR */}

                          <td>
                            <div className="donor-table-name">
                              <strong>
                                {donation.donor.name}
                              </strong>
                            </div>
                          </td>

                          {/* MOBILE */}

                          <td>
                            {donation.donor.mobile ||
                              "—"}
                          </td>

                          {/* FOOD DATE */}

                          <td>
                            <strong>
                              {formatDate(
                                donation.foodOfferedDate
                              )}
                            </strong>
                          </td>

                          {/* OCCASION */}

                          <td>
                            <span className="occasion-badge">
                              {getOccasionLabel(
                                donation.occasion
                                  .occasionType
                              )}
                            </span>
                          </td>

                          {/* PERSON */}

                          <td>
                            {
                              donation.occasion
                                .personName
                            }
                          </td>

                          {/* FINANCE — SUPER ADMIN */}

                          {isSuperAdmin && (
                            <>
                              <td>
                                <strong>
                                  {donation.amountReceived !==
                                    null &&
                                  donation.amountReceived !==
                                    undefined
                                    ? `₹${donation.amountReceived.toLocaleString(
                                        "en-IN"
                                      )}`
                                    : "—"}
                                </strong>
                              </td>

                              <td>
                                {getPaymentLabel(
                                  donation.paymentMethod
                                )}
                              </td>
                            </>
                          )}

                          {/* IMAGE */}

                          <td>
                            <span
                              className={
                                donation.imageStatus ===
                                "Uploaded"
                                  ? "image-status uploaded"
                                  : "image-status pending"
                              }
                            >
                              {
                                donation.imageStatus
                              }
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td>
                            <div className="admin-table-actions">

                              <Link
                                href={`/admin/donations/${donation.id}`}
                                className="admin-action-button view-action"
                              >
                                View
                              </Link>

                              <Link
                                href={`/admin/donations/edit?id=${donation.id}`}
                                className="admin-action-button edit-action"
                              >
                                Edit
                              </Link>

                              {donation.imageStatus ===
                                "Pending" && (
                                <Link
                                  href={`/admin/donations/edit?id=${donation.id}`}
                                  className="admin-action-button upload-action"
                                >
                                  Upload Image
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )}

                    {/* ==================================
                        EMPTY STATE
                    ================================== */}

                    {filteredDonations.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={
                            isSuperAdmin ? 9 : 7
                          }
                          className="donor-empty-state"
                        >
                          No matching donation
                          records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ========================================
                FOOTER
            ======================================== */}

            {!loading &&
              filteredDonations.length > 0 && (
                <div className="donor-pagination">
                  <span>
                    Showing{" "}
                    {filteredDonations.length} of{" "}
                    {donations.length} records
                  </span>

                  <div>
                    <button
                      type="button"
                      disabled
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      className="active"
                    >
                      1
                    </button>

                    <button
                      type="button"
                      disabled
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
          </section>
        </div>
      </main>
    </div>
  );
}