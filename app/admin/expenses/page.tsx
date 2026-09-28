"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AdminSidebar from "../../components/admin/AdminSidebar";

import "../../styles/AdminLayout.css";
import "../../styles/AdminExpenses.css";

type Expense = {
  id: string;
  expenseDate: string;
  expenseType: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  paidTo: string | null;
  billReferenceNumber: string | null;
  receiptStatus: "UPLOADED" | "NOT_PROVIDED";
  receiptFileName: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

function formatExpenseType(value: string) {
  if (value === "FOOD_EXPENSE") {
    return "Food Expense";
  }

  if (value === "OPERATING_EXPENSE") {
    return "Operating Expense";
  }

  return value;
}

function formatCategory(value: string) {
  const labels: Record<string, string> = {
    RICE_GROCERIES: "Rice & Groceries",
    VEGETABLES: "Vegetables",
    COOKING_GAS_FUEL: "Cooking Gas / Fuel",
    COOKING_MATERIALS: "Cooking Materials",
    PACKAGING: "Packaging",
    TRANSPORT: "Transport",
    RENT: "Rent",
    ELECTRICITY: "Electricity",
    WATER: "Water",
    STAFF_LABOUR: "Staff / Labour",
    MAINTENANCE: "Maintenance",
    MARKETING_PRINTING: "Marketing / Printing",
    OTHER: "Other",
  };

  return labels[value] ?? value;
}

function formatPaymentMethod(value: string) {
  if (value === "GPAY") {
    return "GPay";
  }

  if (value === "CASH") {
    return "Cash";
  }

  if (value === "NEFT") {
    return "NEFT";
  }

  return value;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [expenseType, setExpenseType] = useState("");

  const [category, setCategory] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  const [receiptStatus, setReceiptStatus] = useState("");

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/expenses", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Unable to load expenses.");
        return;
      }

      setExpenses(data.expenses ?? []);
    } catch (error) {
      console.error("Load expenses error:", error);

      setError("Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  }

  const filteredExpenses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return expenses.filter((expense) => {
      const matchesSearch =
        !normalizedSearch ||
        expense.description
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        expense.paidTo
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        expense.billReferenceNumber
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        formatCategory(expense.category)
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesExpenseType =
        !expenseType || expense.expenseType === expenseType;

      const matchesCategory =
        !category || expense.category === category;

      const matchesPaymentMethod =
        !paymentMethod ||
        expense.paymentMethod === paymentMethod;

      const matchesReceiptStatus =
        !receiptStatus ||
        expense.receiptStatus === receiptStatus;

      return (
        matchesSearch &&
        matchesExpenseType &&
        matchesCategory &&
        matchesPaymentMethod &&
        matchesReceiptStatus
      );
    });
  }, [
    expenses,
    search,
    expenseType,
    category,
    paymentMethod,
    receiptStatus,
  ]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }, [filteredExpenses]);

  function clearFilters() {
    setSearch("");
    setExpenseType("");
    setCategory("");
    setPaymentMethod("");
    setReceiptStatus("");
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main-container">
          {/* =====================================================
              PAGE HEADER
          ===================================================== */}

          <div className="expenses-page-header">
            <div>
              <span className="expenses-page-eyebrow">
                EXPENSE MANAGEMENT
              </span>

              <h1>Expenses</h1>

              <p>
                View and manage food and operating expenses.
              </p>
            </div>

            <Link
              href="/admin/expenses/add"
              className="expenses-add-button"
            >
              + Add Expense
            </Link>
          </div>

          {/* =====================================================
              SUMMARY
          ===================================================== */}

          <div className="expenses-summary-grid">
            <div className="expenses-summary-card">
              <span>Total Records</span>

              <strong>{filteredExpenses.length}</strong>
            </div>

            <div className="expenses-summary-card">
              <span>Total Expense Amount</span>

              <strong>{formatAmount(totalAmount)}</strong>
            </div>
          </div>

          {/* =====================================================
              FILTERS
          ===================================================== */}

          <section className="expenses-filter-card">
            <div className="expenses-filter-header">
              <div>
                <h2>Search & Filter</h2>

                <p>
                  Find expenses by category, supplier, reference or
                  payment details.
                </p>
              </div>

              <button
                type="button"
                className="expenses-clear-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>

            <div className="expenses-filter-grid">
              <div className="expenses-filter-group expenses-search-group">
                <label htmlFor="expenseSearch">Search</label>

                <input
                  id="expenseSearch"
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Description, paid to, category or reference"
                />
              </div>

              <div className="expenses-filter-group">
                <label htmlFor="expenseTypeFilter">
                  Expense Type
                </label>

                <select
                  id="expenseTypeFilter"
                  value={expenseType}
                  onChange={(event) =>
                    setExpenseType(event.target.value)
                  }
                >
                  <option value="">All Types</option>

                  <option value="FOOD_EXPENSE">
                    Food Expense
                  </option>

                  <option value="OPERATING_EXPENSE">
                    Operating Expense
                  </option>
                </select>
              </div>

              <div className="expenses-filter-group">
                <label htmlFor="categoryFilter">
                  Category
                </label>

                <select
                  id="categoryFilter"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option value="">All Categories</option>

                  <option value="RICE_GROCERIES">
                    Rice & Groceries
                  </option>

                  <option value="VEGETABLES">
                    Vegetables
                  </option>

                  <option value="COOKING_GAS_FUEL">
                    Cooking Gas / Fuel
                  </option>

                  <option value="COOKING_MATERIALS">
                    Cooking Materials
                  </option>

                  <option value="PACKAGING">
                    Packaging
                  </option>

                  <option value="TRANSPORT">
                    Transport
                  </option>

                  <option value="RENT">Rent</option>

                  <option value="ELECTRICITY">
                    Electricity
                  </option>

                  <option value="WATER">Water</option>

                  <option value="STAFF_LABOUR">
                    Staff / Labour
                  </option>

                  <option value="MAINTENANCE">
                    Maintenance
                  </option>

                  <option value="MARKETING_PRINTING">
                    Marketing / Printing
                  </option>

                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="expenses-filter-group">
                <label htmlFor="paymentFilter">
                  Payment Method
                </label>

                <select
                  id="paymentFilter"
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                >
                  <option value="">All Payments</option>

                  <option value="CASH">Cash</option>

                  <option value="GPAY">GPay</option>

                  <option value="NEFT">NEFT</option>
                </select>
              </div>

              <div className="expenses-filter-group">
                <label htmlFor="receiptFilter">
                  Receipt Status
                </label>

                <select
                  id="receiptFilter"
                  value={receiptStatus}
                  onChange={(event) =>
                    setReceiptStatus(event.target.value)
                  }
                >
                  <option value="">All Receipt Statuses</option>

                  <option value="UPLOADED">Uploaded</option>

                  <option value="NOT_PROVIDED">
                    Not Provided
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (
            <div className="expenses-error-message">
              {error}
            </div>
          )}

          {/* =====================================================
              TABLE
          ===================================================== */}

          <section className="expenses-list-card">
            <div className="expenses-list-header">
              <div>
                <h2>Expense Records</h2>

                <p>
                  {filteredExpenses.length}{" "}
                  {filteredExpenses.length === 1
                    ? "expense"
                    : "expenses"}
                </p>
              </div>

              <button
                type="button"
                className="expenses-refresh-button"
                onClick={loadExpenses}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {loading ? (
              <div className="expenses-state">
                <div className="expenses-loading-circle" />

                <strong>Loading expenses...</strong>

                <span>
                  Please wait while expense records are loaded.
                </span>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="expenses-state">
                <div className="expenses-empty-icon">₹</div>

                <strong>No expenses found</strong>

                <span>
                  Add a new expense or change the current filters.
                </span>
              </div>
            ) : (
              <div className="expenses-table-wrapper">
                <table className="expenses-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Paid To</th>
                      <th>Payment</th>
                      <th>Amount</th>
                      <th>Receipt</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>
                          <span className="expenses-date">
                            {formatDate(expense.expenseDate)}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`expense-type-badge ${
                              expense.expenseType ===
                              "FOOD_EXPENSE"
                                ? "expense-type-food"
                                : "expense-type-operating"
                            }`}
                          >
                            {formatExpenseType(
                              expense.expenseType
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="expenses-category">
                            {formatCategory(expense.category)}
                          </span>
                        </td>

                        <td>
                          <div className="expenses-description-cell">
                            {expense.description || "—"}
                          </div>
                        </td>

                        <td>
                          <div className="expenses-paid-to">
                            <strong>{expense.paidTo || "—"}</strong>

                            {expense.billReferenceNumber && (
                              <span>
                                Ref:{" "}
                                {expense.billReferenceNumber}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="expenses-payment-badge">
                            {formatPaymentMethod(
                              expense.paymentMethod
                            )}
                          </span>
                        </td>

                        <td>
                          <strong className="expenses-amount">
                            {formatAmount(expense.amount)}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`expenses-receipt-badge ${
                              expense.receiptStatus ===
                              "UPLOADED"
                                ? "receipt-uploaded"
                                : "receipt-not-provided"
                            }`}
                          >
                            {expense.receiptStatus ===
                            "UPLOADED"
                              ? "Uploaded"
                              : "Not Provided"}
                          </span>
                        </td>

                        <td>
                          <Link
                            href={`/admin/expenses/edit?id=${expense.id}`}
                            className="expenses-edit-button"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}