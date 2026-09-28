"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import AdminSidebar from "../../../components/admin/AdminSidebar";

import "../../../styles/AdminLayout.css";
import "../../../styles/AddExpense.css";

export default function AddExpensePage() {
  const [expenseType, setExpenseType] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [receiptFile, setReceiptFile] =
    useState<File | null>(null);

  const [receiptPreview, setReceiptPreview] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [saveError, setSaveError] =
    useState("");

  function handleReceiptChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }

    setReceiptFile(file);

    setReceiptPreview(
      URL.createObjectURL(file)
    );
  }

  async function uploadReceipt(
    expenseId: string,
    file: File
  ) {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await fetch(
        `/api/admin/expenses/${expenseId}/receipt`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ??
          "Receipt upload failed."
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setSaveMessage("");
      setSaveError("");

      const form =
        event.currentTarget;

      const formData =
        new FormData(form);

      const body = {
        expenseDate: String(
          formData.get(
            "expenseDate"
          ) ?? ""
        ),

        expenseType: String(
          formData.get(
            "expenseType"
          ) ?? ""
        ),

        category: String(
          formData.get(
            "category"
          ) ?? ""
        ),

        description: String(
          formData.get(
            "description"
          ) ?? ""
        ).trim(),

        amount: Number(
          formData.get(
            "amount"
          ) ?? 0
        ),

        paymentMethod: String(
          formData.get(
            "paymentMethod"
          ) ?? ""
        ),

        paidTo: String(
          formData.get(
            "paidTo"
          ) ?? ""
        ).trim(),

        billReferenceNumber:
          String(
            formData.get(
              "billReferenceNumber"
            ) ?? ""
          ).trim(),

        notes: String(
          formData.get(
            "notes"
          ) ?? ""
        ).trim(),
      };

      /* =====================================================
         CREATE EXPENSE
      ===================================================== */

      const response =
        await fetch(
          "/api/admin/expenses",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body:
              JSON.stringify(
                body
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setSaveError(
          data.message ??
            "Unable to save expense."
        );

        return;
      }

      const expenseId =
        data.expense?.id;

      if (!expenseId) {
        setSaveError(
          "Expense was saved, but the expense ID was not returned."
        );

        return;
      }

      /* =====================================================
         OPTIONAL RECEIPT
      ===================================================== */

      if (receiptFile) {
        try {
          await uploadReceipt(
            expenseId,
            receiptFile
          );
        } catch (error) {
          console.error(
            "Receipt upload error:",
            error
          );

          setSaveError(
            error instanceof Error
              ? `Expense was saved, but receipt upload failed: ${error.message}`
              : "Expense was saved, but receipt upload failed."
          );

          return;
        }
      }

      setSaveMessage(
        receiptFile
          ? "Expense and receipt saved successfully."
          : "Expense saved successfully."
      );

      /* =====================================================
         RESET FORM
      ===================================================== */

      form.reset();

      setExpenseType("");
      setCategory("");
      setPaymentMethod("");

      setReceiptFile(null);
      setReceiptPreview(null);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Expense save error:",
        error
      );

      setSaveError(
        "Unable to save expense."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main-container">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}

          <div className="expense-page-header">

            <div className="expense-page-heading">
              <span className="expense-page-eyebrow">
                EXPENSE MANAGEMENT
              </span>

              <h1>
                Add Expense
              </h1>

              <p>
                Record day-to-day food and operating expenses.
              </p>
            </div>

            <Link
              href="/admin/expenses"
              className="expense-back-button"
            >
              ← Expense List
            </Link>

          </div>

          {/* =====================================================
              SUCCESS / ERROR
          ===================================================== */}

          {saveMessage && (
            <div className="expense-alert expense-alert-success">

              <div className="expense-alert-icon">
                ✓
              </div>

              <div>
                <strong>
                  Expense saved successfully
                </strong>

                <span>
                  {saveMessage}
                </span>
              </div>

            </div>
          )}

          {saveError && (
            <div className="expense-alert expense-alert-error">

              <div className="expense-alert-icon">
                !
              </div>

              <div>
                <strong>
                  Unable to complete expense
                </strong>

                <span>
                  {saveError}
                </span>
              </div>

            </div>
          )}

          <form
            className="expense-form"
            onSubmit={handleSubmit}
          >

            {/* =====================================================
                01. EXPENSE DETAILS
            ===================================================== */}

            <section className="expense-section">

              <div className="expense-section-header">

                <div className="expense-section-number">
                  01
                </div>

                <div>
                  <h2>
                    Expense Details
                  </h2>

                  <p>
                    Enter the date, type, category and description.
                  </p>
                </div>

              </div>

              <div className="expense-form-grid">

                <div className="expense-form-group">

                  <label htmlFor="expenseDate">
                    Expense Date{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="expenseDate"
                    name="expenseDate"
                    type="date"
                    required
                  />

                </div>

                <div className="expense-form-group">

                  <label htmlFor="expenseType">
                    Expense Type{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="expenseType"
                    name="expenseType"
                    value={expenseType}
                    onChange={(event) =>
                      setExpenseType(
                        event.target.value
                      )
                    }
                    required
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select expense type
                    </option>

                    <option value="FOOD_EXPENSE">
                      Food Expense
                    </option>

                    <option value="OPERATING_EXPENSE">
                      Operating Expense
                    </option>

                  </select>

                </div>

                <div className="expense-form-group">

                  <label htmlFor="category">
                    Category{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target.value
                      )
                    }
                    required
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select category
                    </option>

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

                    <option value="RENT">
                      Rent
                    </option>

                    <option value="ELECTRICITY">
                      Electricity
                    </option>

                    <option value="WATER">
                      Water
                    </option>

                    <option value="STAFF_LABOUR">
                      Staff / Labour
                    </option>

                    <option value="MAINTENANCE">
                      Maintenance
                    </option>

                    <option value="MARKETING_PRINTING">
                      Marketing / Printing
                    </option>

                    <option value="OTHER">
                      Other
                    </option>

                  </select>

                </div>

                <div className="expense-form-group expense-form-full">

                  <label htmlFor="description">
                    Description{" "}
                    <span>*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Example: Vegetables purchased for today's meals"
                    
                  />

                </div>

              </div>

            </section>

            {/* =====================================================
                02. PAYMENT DETAILS
            ===================================================== */}

            <section className="expense-section">

              <div className="expense-section-header">

                <div className="expense-section-number">
                  02
                </div>

                <div>
                  <h2>
                    Payment Details
                  </h2>

                  <p>
                    Record the expense amount and payment information.
                  </p>
                </div>

              </div>

              <div className="expense-form-grid">

                <div className="expense-form-group">

                  <label htmlFor="amount">
                    Amount{" "}
                    <span>*</span>
                  </label>

                  <div className="expense-amount-input">

                    <span>
                      ₹
                    </span>

                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Enter amount"
                      required
                    />

                  </div>

                </div>

                <div className="expense-form-group">

                  <label htmlFor="paymentMethod">
                    Payment Method{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                    required
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select payment method
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

                <div className="expense-form-group">

                  <label htmlFor="paidTo">
                    Paid To
                  </label>

                  <input
                    id="paidTo"
                    name="paidTo"
                    type="text"
                    placeholder="Supplier / person / organisation"
                  />

                </div>

                <div className="expense-form-group">

                  <label htmlFor="billReferenceNumber">
                    Bill / Reference Number
                  </label>

                  <input
                    id="billReferenceNumber"
                    name="billReferenceNumber"
                    type="text"
                    placeholder="Invoice or transaction reference"
                  />

                </div>

                <div className="expense-form-group expense-form-full">

                  <label htmlFor="notes">
                    Notes
                  </label>

                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Additional expense notes"
                  />

                </div>

              </div>

            </section>

            {/* =====================================================
                03. RECEIPT
            ===================================================== */}

            <section className="expense-section">

              <div className="expense-section-header">

                <div className="expense-section-number">
                  03
                </div>

                <div>
                  <h2>
                    Receipt / Bill
                  </h2>

                  <p>
                    Upload a receipt or bill image when available.
                    This field is optional.
                  </p>
                </div>

              </div>

              <div className="expense-receipt-layout">

                <div className="expense-upload-card">

                  <div className="expense-upload-icon">
                    ↑
                  </div>

                  <h3>
                    Upload receipt
                  </h3>

                  <p>
                    JPG, PNG or WebP • Maximum 5 MB
                  </p>

                  <label className="expense-upload-button">

                    Choose Receipt

                    <input
                      id="receiptFile"
                      name="receiptFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleReceiptChange
                      }
                    />

                  </label>

                  <small>
                    You can also save the expense without a receipt.
                  </small>

                </div>

                <div className="expense-receipt-preview">

                  {receiptPreview ? (
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                    />
                  ) : (
                    <div className="expense-empty-preview">

                      <span>
                        RECEIPT
                      </span>

                      <strong>
                        No receipt selected
                      </strong>

                      <p>
                        The selected receipt or bill image will
                        appear here.
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </section>

            {/* =====================================================
                ACTIONS
            ===================================================== */}

            <div className="expense-form-footer">

              <div>
                <strong>
                  Ready to save?
                </strong>

                <span>
                  Review the expense information before saving.
                </span>
              </div>

              <div className="expense-form-actions">

                <Link
                  href="/admin/expenses"
                  className="expense-cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="expense-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Expense"}
                </button>

              </div>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}