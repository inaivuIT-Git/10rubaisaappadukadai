"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import AdminSidebar from "../../components/admin/AdminSidebar";

import "../../styles/AdminLayout.css";
import "../../styles/AdminReminders.css";

type ReminderStatus =
  | "Pending"
  | "WhatsApp Sent"
  | "Sponsored"
  | "Not Interested";

type Reminder = {
  id: number;
  reminderDate: string;
  occasionDate: string;
  donorName: string;
  occasion: string;
  personName: string;
  mobile: string;
  lastDonationAmount: number;
  status: ReminderStatus;
  whatsappSentDate?: string;
  responseDate?: string;
};

const initialReminders: Reminder[] = [
  {
    id: 1,
    reminderDate: "2027-09-03",
    occasionDate: "2027-09-10",
    donorName: "Ravi",
    occasion: "பிறந்தநாள்",
    personName: "Ananya",
    mobile: "98765 43210",
    lastDonationAmount: 5000,
    status: "Pending",
  },
  {
    id: 2,
    reminderDate: "2027-09-05",
    occasionDate: "2027-09-12",
    donorName: "Priya",
    occasion: "திருமண நாள்",
    personName: "Priya & Arun",
    mobile: "97900 56789",
    lastDonationAmount: 4000,
    status: "WhatsApp Sent",
    whatsappSentDate: "2027-09-05",
  },
  {
    id: 3,
    reminderDate: "2027-09-07",
    occasionDate: "2027-09-14",
    donorName: "Kumar",
    occasion: "நினைவு நாள்",
    personName: "Late Ramesh",
    mobile: "98400 12345",
    lastDonationAmount: 3000,
    status: "Sponsored",
    whatsappSentDate: "2027-09-07",
    responseDate: "2027-09-08",
  },
  {
    id: 4,
    reminderDate: "2027-09-09",
    occasionDate: "2027-09-16",
    donorName: "Suresh",
    occasion: "பிறந்தநாள்",
    personName: "Karthik",
    mobile: "98844 22110",
    lastDonationAmount: 2500,
    status: "Not Interested",
    whatsappSentDate: "2027-09-09",
    responseDate: "2027-09-10",
  },
  {
    id: 5,
    reminderDate: "2027-09-12",
    occasionDate: "2027-09-19",
    donorName: "Meena",
    occasion: "பிறந்தநாள்",
    personName: "Nithya",
    mobile: "99440 88776",
    lastDonationAmount: 3500,
    status: "Pending",
  },
];

export default function RemindersPage() {
  const [reminders, setReminders] =
    useState<Reminder[]>(initialReminders);

  const [period, setPeriod] = useState("7days");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredReminders = useMemo(() => {
    return reminders.filter((reminder) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        reminder.donorName.toLowerCase().includes(searchValue) ||
        reminder.personName.toLowerCase().includes(searchValue) ||
        reminder.mobile.toLowerCase().includes(searchValue);

      const normalizedStatus = reminder.status
        .toLowerCase()
        .replaceAll(" ", "-");

      const matchesStatus =
        statusFilter === "all" ||
        normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reminders, search, statusFilter]);

  const pendingCount = reminders.filter(
    (reminder) => reminder.status === "Pending"
  ).length;

  const whatsappSentCount = reminders.filter(
    (reminder) => reminder.status === "WhatsApp Sent"
  ).length;

  const sponsoredCount = reminders.filter(
    (reminder) => reminder.status === "Sponsored"
  ).length;

  const notInterestedCount = reminders.filter(
    (reminder) => reminder.status === "Not Interested"
  ).length;

  function formatDate(date?: string) {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function getTodayDate() {
    return new Date().toISOString().split("T")[0];
  }

  function handleSendWhatsApp(id: number) {
    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              status: "WhatsApp Sent",
              whatsappSentDate: getTodayDate(),
            }
          : reminder
      )
    );
  }

  function handleNotInterested(id: number) {
    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              status: "Not Interested",
              responseDate: getTodayDate(),
            }
          : reminder
      )
    );
  }

  function handleReset() {
    setSearch("");
    setStatusFilter("all");
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main-container">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}

          <div className="reminders-header">
            <div>
              <span className="admin-page-label">
                நினைவூட்டல்கள்
              </span>

              <h1>வரவிருக்கும் நினைவூட்டல்கள்</h1>

              <p>
                கடந்த ஆண்டு உணவு வழங்கிய நன்கொடையாளர்களை
                நிகழ்வு நடைபெறுவதற்கு முன்பு WhatsApp மூலம்
                தொடர்பு கொண்டு, இந்த ஆண்டு மீண்டும் நன்கொடை
                வழங்குகிறார்களா என்பதை பதிவு செய்யலாம்.
              </p>
            </div>
          </div>


          {/* =====================================================
              PERIOD FILTER
          ===================================================== */}

          <section className="reminders-filter-card">
            <div className="reminders-filter-heading">
              <h2>நினைவூட்டல் காலம்</h2>

              <p>
                பார்க்க வேண்டிய நினைவூட்டல் காலத்தை
                தேர்வு செய்யவும்.
              </p>
            </div>

            <div className="reminders-period-buttons">

              <button
                type="button"
                className={period === "7days" ? "active" : ""}
                onClick={() => setPeriod("7days")}
              >
                Next 7 Days
              </button>

              <button
                type="button"
                className={period === "30days" ? "active" : ""}
                onClick={() => setPeriod("30days")}
              >
                Next 30 Days
              </button>

              <button
                type="button"
                className={period === "month" ? "active" : ""}
                onClick={() => setPeriod("month")}
              >
                This Month
              </button>

              <button
                type="button"
                className={period === "all" ? "active" : ""}
                onClick={() => setPeriod("all")}
              >
                All
              </button>

            </div>
          </section>


          {/* =====================================================
              STATUS SUMMARY
          ===================================================== */}

          <section className="reminders-summary-grid">

            <div className="reminders-summary-card">
              <span>
                தொடர்பு கொள்ள வேண்டும்
              </span>

              <strong>{pendingCount}</strong>
            </div>

            <div className="reminders-summary-card whatsapp">
              <span>
                WhatsApp அனுப்பப்பட்டது
              </span>

              <strong>{whatsappSentCount}</strong>
            </div>

            <div className="reminders-summary-card contacted">
              <span>
                இந்த ஆண்டு நன்கொடை
              </span>

              <strong>{sponsoredCount}</strong>
            </div>

            <div className="reminders-summary-card not-interested">
              <span>
                இந்த ஆண்டு விருப்பமில்லை
              </span>

              <strong>{notInterestedCount}</strong>
            </div>

          </section>


          {/* =====================================================
              SEARCH / STATUS FILTER
          ===================================================== */}

          <section className="reminders-search-card">
            <div className="reminders-search-grid">

              <div className="reminders-form-field reminders-search-field">
                <label htmlFor="reminderSearch">
                  தேடல்
                </label>

                <input
                  id="reminderSearch"
                  type="text"
                  placeholder="நன்கொடையாளர் பெயர் / அலைபேசி / நபர் பெயர்"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>


              <div className="reminders-form-field">
                <label htmlFor="statusFilter">
                  நிலை
                </label>

                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="all">
                    அனைத்து நிலைகள்
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="whatsapp-sent">
                    WhatsApp Sent
                  </option>

                  <option value="sponsored">
                    Sponsored
                  </option>

                  <option value="not-interested">
                    Not Interested
                  </option>
                </select>
              </div>


              <button
                type="button"
                className="reminders-reset-button"
                onClick={handleReset}
              >
                Reset
              </button>

            </div>
          </section>


          {/* =====================================================
              REMINDER TABLE
          ===================================================== */}

          <section className="reminders-table-card">

            <div className="reminders-table-card-header">
              <div>
                <h2>நினைவூட்டல் பட்டியல்</h2>

                <p>
                  மொத்தம் {filteredReminders.length} நினைவூட்டல்கள்
                </p>
              </div>
            </div>


            <div className="reminders-table-wrapper">
              <table className="reminders-table">

                <thead>
                  <tr>
                    <th>நினைவூட்டல் தேதி</th>

                    <th>நிகழ்வு தேதி</th>

                    <th>நன்கொடையாளர்</th>

                    <th>நிகழ்வு</th>

                    <th>யாருக்காக</th>

                    <th>அலைபேசி</th>

                    <th>கடந்த ஆண்டு தொகை</th>

                    <th>WhatsApp தேதி</th>

                    <th>பதில் தேதி</th>

                    <th>நிலை</th>

                    <th>Action</th>
                  </tr>
                </thead>


                <tbody>

                  {filteredReminders.length > 0 ? (
                    filteredReminders.map((reminder) => (
                      <tr key={reminder.id}>

                        {/* Reminder Date */}

                        <td>
                          <strong>
                            {formatDate(reminder.reminderDate)}
                          </strong>
                        </td>


                        {/* Occasion Date */}

                        <td>
                          {formatDate(reminder.occasionDate)}
                        </td>


                        {/* Donor */}

                        <td>
                          <strong>
                            {reminder.donorName}
                          </strong>
                        </td>


                        {/* Occasion */}

                        <td>
                          <span className="reminder-occasion-badge">
                            {reminder.occasion}
                          </span>
                        </td>


                        {/* Person */}

                        <td>
                          {reminder.personName}
                        </td>


                        {/* Mobile */}

                        <td>
                          {reminder.mobile}
                        </td>


                        {/* Last Donation */}

                        <td>
                          <strong>
                            {formatAmount(
                              reminder.lastDonationAmount
                            )}
                          </strong>
                        </td>


                        {/* WhatsApp Date */}

                        <td>
                          {formatDate(
                            reminder.whatsappSentDate
                          )}
                        </td>


                        {/* Response Date */}

                        <td>
                          {formatDate(
                            reminder.responseDate
                          )}
                        </td>


                        {/* Status */}

                        <td>
                          <span
                            className={`reminder-status ${reminder.status
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            {reminder.status}
                          </span>
                        </td>


                        {/* Actions */}

                        <td>
                          <div className="reminder-actions">

                            {reminder.status === "Pending" && (
                              <button
                                type="button"
                                className="reminder-action-button whatsapp"
                                onClick={() =>
                                  handleSendWhatsApp(
                                    reminder.id
                                  )
                                }
                              >
                                Send WhatsApp
                              </button>
                            )}


                            {reminder.status ===
                              "WhatsApp Sent" && (
                              <>
                                <Link
                                  href="/admin/donations/add"
                                  className="reminder-action-button sponsored"
                                >
                                  Sponsored
                                </Link>

                                <button
                                  type="button"
                                  className="reminder-action-button declined"
                                  onClick={() =>
                                    handleNotInterested(
                                      reminder.id
                                    )
                                  }
                                >
                                  Not Interested
                                </button>
                              </>
                            )}


                            {reminder.status === "Sponsored" && (
                              <span className="reminder-completed">
                                ✓ Donation Created
                              </span>
                            )}


                            {reminder.status ===
                              "Not Interested" && (
                              <span className="reminder-declined-text">
                                No action
                              </span>
                            )}

                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={11}
                        className="reminders-empty-state"
                      >
                        நினைவூட்டல்கள் எதுவும் இல்லை.
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