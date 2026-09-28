"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import AdminSidebar from "../../../components/admin/AdminSidebar";

import "../../../styles/AdminLayout.css";
import "../../../styles/EditExpense.css";

type ExpenseData = {
  id: string;
  expenseDate: string;
  expenseType: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  paidTo: string | null;
  billReferenceNumber: string | null;
  receiptFileName: string | null;
  receiptStatus: "UPLOADED" | "NOT_PROVIDED";
  notes: string | null;
};

export default function EditExpensePage() {
  const searchParams = useSearchParams();

  const expenseId = searchParams.get("id");

  const [expense, setExpense] = useState<ExpenseData | null>(null);

  const [expenseType, setExpenseType] = useState("");

  const [category, setCategory] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!expenseId) {
      setError("Expense ID is missing.");
      setLoading(false);
      return;
    }

    loadExpense(expenseId);
  }, [expenseId]);

  async function loadExpense(id: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/admin/expenses/${id}`, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Unable to load expense.");

        return;
      }

      const loadedExpense = data.expense as ExpenseData;

      setExpense(loadedExpense);

      setExpenseType(loadedExpense.expenseType);

      setCategory(loadedExpense.category);

      setPaymentMethod(loadedExpense.paymentMethod);
    } catch (error) {
      console.error("Load expense error:", error);

      setError("Unable to load expense.");
    } finally {
      setLoading(false);
    }
  }

  function handleReceiptChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }

    setReceiptFile(file);

    setReceiptPreview(URL.createObjectURL(file));
  }

  async function uploadReceipt(id: string, file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`/api/admin/expenses/${id}/receipt`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? "Receipt upload failed.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!expenseId) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const form = event.currentTarget;

      const formData = new FormData(form);

      const body = {
        expenseDate: String(formData.get("expenseDate") ?? ""),

        expenseType: String(formData.get("expenseType") ?? ""),

        category: String(formData.get("category") ?? ""),

        description: String(formData.get("description") ?? "").trim(),

        amount: Number(formData.get("amount") ?? 0),

        paymentMethod: String(formData.get("paymentMethod") ?? ""),

        paidTo: String(formData.get("paidTo") ?? "").trim(),

        billReferenceNumber: String(
          formData.get("billReferenceNumber") ?? "",
        ).trim(),

        notes: String(formData.get("notes") ?? "").trim(),
      };

      /* =====================================================
         UPDATE EXPENSE
      ===================================================== */

      const response = await fetch(`/api/admin/expenses/${expenseId}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Unable to update expense.");

        return;
      }

      /* =====================================================
         OPTIONAL RECEIPT REPLACEMENT
      ===================================================== */

      if (receiptFile) {
        try {
          await uploadReceipt(expenseId, receiptFile);
        } catch (uploadError) {
          console.error("Receipt upload error:", uploadError);

          setError(
            uploadError instanceof Error
              ? `Expense updated, but receipt upload failed: ${uploadError.message}`
              : "Expense updated, but receipt upload failed.",
          );

          await loadExpense(expenseId);

          return;
        }
      }

      setMessage(
        receiptFile
          ? "Expense and receipt updated successfully."
          : "Expense updated successfully.",
      );

      setReceiptFile(null);
      setReceiptPreview(null);

      await loadExpense(expenseId);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Update expense error:", error);

      setError("Unable to update expense.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <main className="admin-main">
          <div className="admin-main-container">
            <div className="edit-expense-loading">Loading expense...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <main className="admin-main">
          <div className="admin-main-container">
            <div className="edit-expense-error">
              {error || "Expense not found."}
            </div>

            <Link href="/admin/expenses" className="edit-expense-back-button">
              ← Back to Expenses
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main-container">
          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="edit-expense-page-header">
            <div>
              <span className="edit-expense-eyebrow">EXPENSE MANAGEMENT</span>

              <h1>Edit Expense</h1>

              <p>Update expense information or replace the receipt.</p>
            </div>

            <Link href="/admin/expenses" className="edit-expense-back-button">
              ← Expense List
            </Link>
          </div>

          {/* =====================================================
              MESSAGES
          ===================================================== */}

          {message && (
            <div className="edit-expense-alert edit-expense-success">
              {message}
            </div>
          )}

          {error && (
            <div className="edit-expense-alert edit-expense-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="edit-expense-form">
            {/* =====================================================
                01 EXPENSE DETAILS
            ===================================================== */}

            <section className="edit-expense-section">
              <div className="edit-expense-section-header">
                <div className="edit-expense-section-number">01</div>

                <div>
                  <h2>Expense Details</h2>

                  <p>Update the date, type, category and description.</p>
                </div>
              </div>

              <div className="edit-expense-grid">
                <div className="edit-expense-group">
                  <label htmlFor="expenseDate">
                    Expense Date <span>*</span>
                  </label>

                  <input
                    id="expenseDate"
                    name="expenseDate"
                    type="date"
                    defaultValue={expense.expenseDate.slice(0, 10)}
                    required
                  />
                </div>

                <div className="edit-expense-group">
                  <label htmlFor="expenseType">
                    Expense Type <span>*</span>
                  </label>

                  <select
                    id="expenseType"
                    name="expenseType"
                    value={expenseType}
                    onChange={(event) => setExpenseType(event.target.value)}
                    required
                  >
                    <option value="FOOD_EXPENSE">Food Expense</option>

                    <option value="OPERATING_EXPENSE">Operating Expense</option>
                  </select>
                </div>

                <div className="edit-expense-group">
                  <label htmlFor="category">
                    Category <span>*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    required
                  >
                    <option value="RICE_GROCERIES">Rice & Groceries</option>

                    <option value="VEGETABLES">Vegetables</option>

                    <option value="COOKING_GAS_FUEL">Cooking Gas / Fuel</option>

                    <option value="COOKING_MATERIALS">Cooking Materials</option>

                    <option value="PACKAGING">Packaging</option>

                    <option value="TRANSPORT">Transport</option>

                    <option value="RENT">Rent</option>

                    <option value="ELECTRICITY">Electricity</option>

                    <option value="WATER">Water</option>

                    <option value="STAFF_LABOUR">Staff / Labour</option>

                    <option value="MAINTENANCE">Maintenance</option>

                    <option value="MARKETING_PRINTING">
                      Marketing / Printing
                    </option>

                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="edit-expense-group edit-expense-full">
                  <label htmlFor="description">Description</label>

                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={expense.description}
                    placeholder="Optional description"
                  />
                </div>
              </div>
            </section>

            {/* =====================================================
                02 PAYMENT DETAILS
            ===================================================== */}

            <section className="edit-expense-section">
              <div className="edit-expense-section-header">
                <div className="edit-expense-section-number">02</div>

                <div>
                  <h2>Payment Details</h2>

                  <p>Update the amount and payment information.</p>
                </div>
              </div>

              <div className="edit-expense-grid">
                <div className="edit-expense-group">
                  <label htmlFor="amount">
                    Amount <span>*</span>
                  </label>

                  <div className="edit-expense-amount">
                    <span>₹</span>

                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={expense.amount}
                      required
                    />
                  </div>
                </div>

                <div className="edit-expense-group">
                  <label htmlFor="paymentMethod">
                    Payment Method <span>*</span>
                  </label>

                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    required
                  >
                    <option value="CASH">Cash</option>

                    <option value="GPAY">GPay</option>

                    <option value="NEFT">NEFT</option>
                  </select>
                </div>

                <div className="edit-expense-group">
                  <label htmlFor="paidTo">Paid To</label>

                  <input
                    id="paidTo"
                    name="paidTo"
                    type="text"
                    defaultValue={expense.paidTo ?? ""}
                    placeholder="Supplier / person / organisation"
                  />
                </div>

                <div className="edit-expense-group">
                  <label htmlFor="billReferenceNumber">
                    Bill / Reference Number
                  </label>

                  <input
                    id="billReferenceNumber"
                    name="billReferenceNumber"
                    type="text"
                    defaultValue={expense.billReferenceNumber ?? ""}
                    placeholder="Invoice or transaction reference"
                  />
                </div>

                <div className="edit-expense-group edit-expense-full">
                  <label htmlFor="notes">Notes</label>

                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    defaultValue={expense.notes ?? ""}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            </section>

            {/* =====================================================
                03 RECEIPT
            ===================================================== */}

            <section className="edit-expense-section">
              <div className="edit-expense-section-header">
                <div className="edit-expense-section-number">03</div>

                <div>
                  <h2>Receipt / Bill</h2>

                  <p>Upload a new receipt to replace the current receipt.</p>
                </div>
              </div>

              <div className="edit-expense-receipt-grid">
                <div className="edit-expense-current-receipt">
                  <span className="edit-expense-small-label">
                    CURRENT RECEIPT
                  </span>

                  {expense.receiptStatus === "UPLOADED" ? (
                    <>
                      <strong>Receipt Uploaded</strong>

                      <div className="edit-expense-existing-image">
                        <img
                          src={`/api/admin/expenses/${expense.id}/receipt`}
                          alt="Current expense receipt"
                        />
                      </div>

                      <p>{expense.receiptFileName}</p>

                      <span className="edit-expense-receipt-status uploaded">
                        Uploaded
                      </span>
                    </>
                  ) : (
                    <>
                      <strong>No Receipt Provided</strong>

                      <p>
                        No receipt or bill image has been uploaded for this
                        expense.
                      </p>

                      <span className="edit-expense-receipt-status missing">
                        Not Provided
                      </span>
                    </>
                  )}
                </div>

                <div className="edit-expense-upload-card">
                  <span className="edit-expense-small-label">NEW RECEIPT</span>

                  <strong>
                    {expense.receiptStatus === "UPLOADED"
                      ? "Replace Receipt"
                      : "Upload Receipt"}
                  </strong>

                  <p>JPG, PNG or WebP • Maximum 5 MB</p>

                  <label className="edit-expense-upload-button">
                    Choose Receipt
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleReceiptChange}
                    />
                  </label>
                </div>

                <div className="edit-expense-preview">
                  {receiptPreview ? (
                    <img src={receiptPreview} alt="New receipt preview" />
                  ) : (
                    <div className="edit-expense-preview-empty">
                      <span>PREVIEW</span>

                      <strong>No new receipt selected</strong>

                      <p>
                        Select a receipt only if you want to add or replace the
                        existing one.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div className="edit-expense-footer">
              <div>
                <strong>Update Expense</strong>

                <span>
                  Changes will be saved to the existing expense record.
                </span>
              </div>

              <div className="edit-expense-actions">
                <Link href="/admin/expenses" className="edit-expense-cancel">
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="edit-expense-save"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
