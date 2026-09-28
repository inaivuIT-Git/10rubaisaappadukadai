"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AdminSidebar from "../components/admin/AdminSidebar";
import { useAdminAuth } from "../components/admin/AdminAuthGuard";

import "../styles/AdminLayout.css";
import "../styles/AdminDashboard.css";

type DashboardDonor = {
  id: string;
  name: string;
  mobile: string | null;
};

type DashboardOccasion = {
  id: string;
  occasionType: string;
  donationFor: string;
  personName: string | null;
  relationshipToDonor?: string | null;
};

type UpcomingFoodDate = {
  id: string;
  foodOfferedDate: string;
  donor: DashboardDonor;
  occasion: DashboardOccasion;
  bannerStatus: "UPLOADED" | "PENDING";
};

type RecentDonation = {
  id: string;
  foodOfferedDate: string;
  createdAt: string;
  donor: DashboardDonor;
  occasion: DashboardOccasion;
  bannerStatus: "UPLOADED" | "PENDING";
};

type RecentExpense = {
  id: string;
  expenseDate: string;
  expenseType: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  paidTo: string | null;
  receiptFileName: string | null;
  receiptStatus: "UPLOADED" | "NOT_PROVIDED";
  createdAt: string;
};

type DashboardData = {
  date: string;

  summary: {
    donationsCount: number;
    expensesCount: number;

    banners: {
      uploaded: number;
      pending: number;
    };

    today: {
      donations: number;
      bannersUploaded: number;
      bannersPending: number;
    };
  };

  upcomingFoodDates: UpcomingFoodDate[];
  recentDonations: RecentDonation[];
  recentExpenses: RecentExpense[];

  finance: {
    gpay: number;
    cash: number;
    neft: number;
    totalDonations: number;
    totalExpenses: number;
    balance: number;
  } | null;
};

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export default function AdminDashboardPage() {
  const { isSuperAdmin } = useAdminAuth();

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/dashboard",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ??
            "Unable to load dashboard."
        );

        return;
      }

      setDashboard(data);
    } catch (error) {
      console.error(
        "Dashboard load error:",
        error
      );

      setError(
        "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main-container">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="dashboard-header">

            <div>
              <span className="dashboard-eyebrow">
                ADMIN OVERVIEW
              </span>

              <h1>Dashboard</h1>

              <p>
                Review donations, expenses,
                upcoming food dates and banner readiness.
              </p>
            </div>

            <div className="dashboard-header-actions">

              <Link
                href="/admin/expenses/add"
                className="dashboard-secondary-button"
              >
                + Add Expense
              </Link>

              <Link
                href="/admin/donations/add"
                className="dashboard-primary-button"
              >
                + Add Donation
              </Link>

            </div>

          </div>

          {/* =====================================================
              LOADING / ERROR
          ===================================================== */}

          {loading && (
            <div className="dashboard-message-card">
              Loading dashboard...
            </div>
          )}

          {error && (
            <div className="dashboard-error-card">
              <span>{error}</span>

              <button
                type="button"
                onClick={loadDashboard}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            dashboard && (
              <>

                {/* =================================================
                    GENERAL SUMMARY
                ================================================= */}

                <section className="dashboard-summary-grid">

                  <div className="dashboard-summary-card">

                    <div className="dashboard-summary-top">
                      <span>
                        Total Donations
                      </span>

                      <div className="dashboard-summary-icon">
                        D
                      </div>
                    </div>

                    <strong>
                      {
                        dashboard.summary
                          .donationsCount
                      }
                    </strong>

                    <small>
                      Donation records
                    </small>

                  </div>

                  <div className="dashboard-summary-card">

                    <div className="dashboard-summary-top">
                      <span>
                        Total Expenses
                      </span>

                      <div className="dashboard-summary-icon">
                        E
                      </div>
                    </div>

                    <strong>
                      {
                        dashboard.summary
                          .expensesCount
                      }
                    </strong>

                    <Link href="/admin/expenses">
                      View Expenses
                    </Link>

                  </div>

                  <div className="dashboard-summary-card">

                    <div className="dashboard-summary-top">
                      <span>
                        Banners Uploaded
                      </span>

                      <div className="dashboard-summary-icon">
                        B
                      </div>
                    </div>

                    <strong>
                      {
                        dashboard.summary
                          .banners.uploaded
                      }
                    </strong>

                    <small>
                      Final banners available
                    </small>

                  </div>

                  <div className="dashboard-summary-card">

                    <div className="dashboard-summary-top">
                      <span>
                        Banners Pending
                      </span>

                      <div className="dashboard-summary-icon">
                        P
                      </div>
                    </div>

                    <strong>
                      {
                        dashboard.summary
                          .banners.pending
                      }
                    </strong>

                    <Link href="/admin/images">
                      Review Images
                    </Link>

                  </div>

                </section>

                {/* =================================================
                    TODAY STATUS
                ================================================= */}

                <section className="dashboard-today-card">

                  <div className="dashboard-section-header">

                    <div>
                      <span className="dashboard-section-label">
                        TODAY
                      </span>

                      <h2>
                        Today&apos;s Food Service
                      </h2>

                      <p>
                        {formatDate(
                          dashboard.date
                        )}
                      </p>
                    </div>

                    <Link href="/admin/images">
                      Manage Images
                    </Link>

                  </div>

                  <div className="dashboard-today-grid">

                    <div>
                      <span>
                        Food Offerings
                      </span>

                      <strong>
                        {
                          dashboard.summary
                            .today.donations
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Banners Ready
                      </span>

                      <strong>
                        {
                          dashboard.summary
                            .today
                            .bannersUploaded
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Banners Pending
                      </span>

                      <strong>
                        {
                          dashboard.summary
                            .today
                            .bannersPending
                        }
                      </strong>
                    </div>

                  </div>

                </section>

                {/* =================================================
                    SUPER ADMIN FINANCIAL SUMMARY
                ================================================= */}

                {isSuperAdmin &&
                  dashboard.finance && (
                    <section className="dashboard-finance-section">

                      <div className="dashboard-section-header">

                        <div>
                          <span className="dashboard-section-label">
                            FINANCIAL SUMMARY
                          </span>

                          <h2>
                            Donation & Expense Overview
                          </h2>

                          <p>
                            Financial information is
                            available to Super Admin only.
                          </p>
                        </div>

                        <Link href="/admin/expenses">
                          View Expenses
                        </Link>

                      </div>

                      <div className="dashboard-payment-grid">

                        <div className="dashboard-money-card">
                          <span>GPay</span>

                          <strong>
                            {formatCurrency(
                              dashboard.finance
                                .gpay
                            )}
                          </strong>
                        </div>

                        <div className="dashboard-money-card">
                          <span>Cash</span>

                          <strong>
                            {formatCurrency(
                              dashboard.finance
                                .cash
                            )}
                          </strong>
                        </div>

                        <div className="dashboard-money-card">
                          <span>NEFT</span>

                          <strong>
                            {formatCurrency(
                              dashboard.finance
                                .neft
                            )}
                          </strong>
                        </div>

                        <div className="dashboard-money-card total">
                          <span>
                            Total Donations
                          </span>

                          <strong>
                            {formatCurrency(
                              dashboard.finance
                                .totalDonations
                            )}
                          </strong>
                        </div>

                      </div>

                      <div className="dashboard-finance-grid">

                        <div className="dashboard-finance-card">

                          <span>
                            Total Donations Received
                          </span>

                          <strong>
                            {formatCurrency(
                              dashboard.finance
                                .totalDonations
                            )}
                          </strong>

                          <small>
                            Recorded donation income
                          </small>

                        </div>

                        <div className="dashboard-finance-card expense">

                          <span>
                            Total Expenses
                          </span>

                          <strong>
                            {formatCurrency(
                              dashboard.finance
                                .totalExpenses
                            )}
                          </strong>

                          <small>
                            Food + operating expenses
                          </small>

                        </div>

                        <div className="dashboard-finance-card balance">

                          <span>
                            Current Balance
                          </span>

                          <strong>
                            {formatCurrency(
                              dashboard.finance
                                .balance
                            )}
                          </strong>

                          <small>
                            Donations − Expenses
                          </small>

                        </div>

                      </div>

                    </section>
                  )}

                {/* =================================================
                    UPCOMING FOOD DATES
                ================================================= */}

                <section className="dashboard-panel dashboard-wide-panel">

                  <div className="dashboard-panel-header">

                    <div>
                      <span className="dashboard-section-label">
                        UPCOMING
                      </span>

                      <h2>
                        Upcoming Food Offered Dates
                      </h2>

                      <p>
                        Next scheduled food sponsorships.
                      </p>
                    </div>

                    <Link href="/admin/donations">
                      View Donations
                    </Link>

                  </div>

                  {dashboard
                    .upcomingFoodDates
                    .length === 0 ? (
                    <div className="dashboard-empty-state">
                      No upcoming food offered dates.
                    </div>
                  ) : (
                    <div className="dashboard-upcoming-list">

                      {dashboard.upcomingFoodDates.map(
                        (item) => (
                          <div
                            key={item.id}
                            className="dashboard-upcoming-item"
                          >

                            <div className="dashboard-date-box">
                              <strong>
                                {new Date(
                                  item.foodOfferedDate
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                  }
                                )}
                              </strong>

                              <span>
                                {new Date(
                                  item.foodOfferedDate
                                )
                                  .toLocaleDateString(
                                    "en-IN",
                                    {
                                      month:
                                        "short",
                                    }
                                  )
                                  .toUpperCase()}
                              </span>
                            </div>

                            <div className="dashboard-upcoming-content">

                              <strong>
                                {item.occasion
                                  .personName ||
                                  item.donor.name}
                              </strong>

                              <span>
                                {formatLabel(
                                  item.occasion
                                    .occasionType
                                )}
                              </span>

                              <small>
                                Donor:{" "}
                                {item.donor.name}
                              </small>

                            </div>

                            <span
                              className={
                                item.bannerStatus ===
                                "UPLOADED"
                                  ? "dashboard-status uploaded"
                                  : "dashboard-status pending"
                              }
                            >
                              {item.bannerStatus ===
                              "UPLOADED"
                                ? "Banner Ready"
                                : "Banner Pending"}
                            </span>

                            <Link
                              href={`/admin/donations/edit?id=${item.id}`}
                              className="dashboard-view-button"
                            >
                              View
                            </Link>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </section>

                {/* =================================================
                    RECENT DONATIONS + EXPENSES
                ================================================= */}

                <div className="dashboard-content-grid">

                  {/* RECENT DONATIONS */}

                  <section className="dashboard-panel">

                    <div className="dashboard-panel-header">

                      <div>
                        <span className="dashboard-section-label">
                          RECENT
                        </span>

                        <h2>
                          Recent Donations
                        </h2>

                        <p>
                          Latest donation records.
                        </p>
                      </div>

                      <Link href="/admin/donations">
                        View All
                      </Link>

                    </div>

                    {dashboard
                      .recentDonations
                      .length === 0 ? (
                      <div className="dashboard-empty-state">
                        No donations available.
                      </div>
                    ) : (
                      <div className="dashboard-activity-list">

                        {dashboard.recentDonations.map(
                          (donation) => (
                            <div
                              key={
                                donation.id
                              }
                              className="dashboard-activity-item"
                            >

                              <div className="dashboard-activity-content">

                                <strong>
                                  {donation
                                    .occasion
                                    .personName ||
                                    donation
                                      .donor
                                      .name}
                                </strong>

                                <span>
                                  {formatLabel(
                                    donation
                                      .occasion
                                      .occasionType
                                  )}
                                </span>

                                <small>
                                  {
                                    donation
                                      .donor.name
                                  }
                                  {" • "}
                                  {formatDate(
                                    donation
                                      .foodOfferedDate
                                  )}
                                </small>

                              </div>

                              <span
                                className={
                                  donation.bannerStatus ===
                                  "UPLOADED"
                                    ? "dashboard-status uploaded"
                                    : "dashboard-status pending"
                                }
                              >
                                {donation.bannerStatus ===
                                "UPLOADED"
                                  ? "Ready"
                                  : "Pending"}
                              </span>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </section>

                  {/* RECENT EXPENSES */}

                  <section className="dashboard-panel">

                    <div className="dashboard-panel-header">

                      <div>
                        <span className="dashboard-section-label">
                          RECENT
                        </span>

                        <h2>
                          Recent Expenses
                        </h2>

                        <p>
                          Latest expense entries.
                        </p>
                      </div>

                      <Link href="/admin/expenses">
                        View All
                      </Link>

                    </div>

                    {dashboard
                      .recentExpenses
                      .length === 0 ? (
                      <div className="dashboard-empty-state">
                        No expenses available.
                      </div>
                    ) : (
                      <div className="dashboard-activity-list">

                        {dashboard.recentExpenses.map(
                          (expense) => (
                            <div
                              key={
                                expense.id
                              }
                              className="dashboard-expense-item"
                            >

                              <div className="dashboard-activity-content">

                                <strong>
                                  {expense.description ||
                                    formatLabel(
                                      expense.category
                                    )}
                                </strong>

                                <span>
                                  {formatLabel(
                                    expense
                                      .expenseType
                                  )}
                                </span>

                                <small>
                                  {formatDate(
                                    expense
                                      .expenseDate
                                  )}

                                  {expense.paidTo
                                    ? ` • ${expense.paidTo}`
                                    : ""}
                                </small>

                              </div>

                              <div className="dashboard-expense-amount">

                                <strong>
                                  {formatCurrency(
                                    expense.amount
                                  )}
                                </strong>

                                <Link
                                  href={`/admin/expenses/edit?id=${expense.id}`}
                                >
                                  Edit
                                </Link>

                              </div>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </section>

                </div>

              </>
            )}

        </div>
      </main>
    </div>
  );
}