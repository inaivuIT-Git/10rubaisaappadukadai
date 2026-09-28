"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useAdminAuth } from "../../../components/admin/AdminAuthGuard";

import "../../../styles/AdminLayout.css";
import "../../../styles/AddDonation.css";

/* =====================================================
   TYPES
===================================================== */

type DonationImage = {
  id: string;
  imageType: "REFERENCE" | "BANNER";
  fileName: string;
  sortOrder: number;
  createdAt: string;
};

type DonationData = {
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
    occasionType: string;
    donationFor: string;
    personName: string;
    relationshipToDonor: string | null;
    annualReminderEnabled: boolean;
  };

  foodOfferedDate: string;

  images: DonationImage[];

  createdAt: string;

  amountReceived?: number | null;
  paymentMethod?: string | null;
  transactionReference?: string | null;
  paymentReceivedDate?: string | null;
};

/* =====================================================
   HELPERS
===================================================== */

function formatDateForInput(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function getOccasionLabel(value: string) {
  switch (value) {
    case "BIRTHDAY":
      return "Birthday";

    case "WEDDING_ANNIVERSARY":
      return "Wedding Anniversary";

    case "MEMORIAL":
      return "Memorial / Death Anniversary";

    default:
      return "Other Special Occasion";
  }
}

function getDonationForLabel(value: string) {
  switch (value) {
    case "SELF":
      return "Self";

    case "FAMILY_MEMBER":
      return "Family Member";

    case "FRIEND":
      return "Friend";

    case "RELATIVE":
      return "Relative";

    default:
      return "Other";
  }
}

function getPaymentLabel(value: string | null | undefined) {
  switch (value) {
    case "GPAY":
      return "GPay";

    case "CASH":
      return "Cash";

    case "NEFT":
      return "NEFT";

    default:
      return "Not recorded";
  }
}

/* =====================================================
   PAGE
===================================================== */

export default function EditDonationPage() {
  const searchParams = useSearchParams();

  const donationId = searchParams.get("id");

  const { isSuperAdmin } = useAdminAuth();

  /* =====================================================
     DONATION STATE
  ===================================================== */

  const [donation, setDonation] = useState<DonationData | null>(null);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  /* =====================================================
     REFERENCE IMAGE STATE
  ===================================================== */

  const [referenceFile, setReferenceFile] = useState<File | null>(null);

  const [referencePreview, setReferencePreview] = useState<string | null>(null);

  /* =====================================================
     BANNER IMAGE STATE
  ===================================================== */

  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  /* =====================================================
     IMAGE SAVE STATE
  ===================================================== */

  const [savingImages, setSavingImages] = useState(false);

  const [uploadMessage, setUploadMessage] = useState("");

  const [uploadError, setUploadError] = useState("");

  /* =====================================================
     LOAD DONATION
  ===================================================== */

  const loadDonation = useCallback(async () => {
    if (!donationId) {
      setLoadError("Donation ID is missing.");

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setLoadError("");

      const response = await fetch(`/api/admin/donations/${donationId}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setLoadError(data.message ?? "Unable to load donation.");

        return;
      }

      setDonation(data.donation);
    } catch (error) {
      console.error("Load donation error:", error);

      setLoadError("Unable to load donation.");
    } finally {
      setLoading(false);
    }
  }, [donationId]);

  useEffect(() => {
    loadDonation();
  }, [loadDonation]);

  /* =====================================================
     REFERENCE FILE SELECTION
  ===================================================== */

  function handleReferenceChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      if (referencePreview) {
        URL.revokeObjectURL(referencePreview);
      }

      setReferenceFile(null);
      setReferencePreview(null);

      return;
    }

    if (referencePreview) {
      URL.revokeObjectURL(referencePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setReferenceFile(file);

    setReferencePreview(previewUrl);

    setUploadMessage("");
    setUploadError("");
  }

  /* =====================================================
     BANNER FILE SELECTION
  ===================================================== */

  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }

      setBannerFile(null);
      setBannerPreview(null);

      return;
    }

    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setBannerFile(file);

    setBannerPreview(previewUrl);

    setUploadMessage("");
    setUploadError("");
  }

  /* =====================================================
     CLEAR REFERENCE SELECTION
  ===================================================== */

  function clearReferenceSelection() {
    if (referencePreview) {
      URL.revokeObjectURL(referencePreview);
    }

    setReferenceFile(null);
    setReferencePreview(null);
  }

  /* =====================================================
     CLEAR BANNER SELECTION
  ===================================================== */

  function clearBannerSelection() {
    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
    }

    setBannerFile(null);
    setBannerPreview(null);
  }

  /* =====================================================
     UPLOAD SINGLE IMAGE
  ===================================================== */

  async function uploadImage(file: File, imageType: "REFERENCE" | "BANNER") {
    if (!donationId) {
      throw new Error("Donation ID is missing.");
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append("imageType", imageType);

    const response = await fetch(`/api/admin/donations/${donationId}/images`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ??
          `Unable to upload ${
            imageType === "REFERENCE" ? "reference photo" : "banner artwork"
          }.`,
      );
    }

    return data;
  }

  /* =====================================================
     SAVE REFERENCE + BANNER
  ===================================================== */

  async function saveImages() {
    if (!referenceFile && !bannerFile) {
      setUploadError("Please choose a reference photo or banner artwork.");

      return;
    }

    try {
      setSavingImages(true);
      setUploadMessage("");
      setUploadError("");

      const successMessages: string[] = [];

      const errorMessages: string[] = [];

      /* -------------------------------------------------
         REFERENCE IMAGE
      ------------------------------------------------- */

      if (referenceFile) {
        try {
          await uploadImage(referenceFile, "REFERENCE");

          successMessages.push("Reference photo saved");
        } catch (error) {
          console.error("Reference upload error:", error);

          errorMessages.push(
            error instanceof Error
              ? error.message
              : "Unable to save reference photo.",
          );
        }
      }

      /* -------------------------------------------------
         BANNER IMAGE
      ------------------------------------------------- */

      if (bannerFile) {
        try {
          await uploadImage(bannerFile, "BANNER");

          successMessages.push("Banner artwork saved");
        } catch (error) {
          console.error("Banner upload error:", error);

          errorMessages.push(
            error instanceof Error
              ? error.message
              : "Unable to save banner artwork.",
          );
        }
      }

      /* -------------------------------------------------
         CLEAR SUCCESSFUL SELECTIONS
      ------------------------------------------------- */

      if (successMessages.length > 0) {
        clearReferenceSelection();
        clearBannerSelection();

        await loadDonation();

        setUploadMessage(`${successMessages.join(" and ")} successfully.`);
      }

      /* -------------------------------------------------
         SHOW ERRORS
      ------------------------------------------------- */

      if (errorMessages.length > 0) {
        setUploadError(errorMessages.join(" "));
      }
    } catch (error) {
      console.error("Save images error:", error);

      setUploadError("Unable to save donation images.");
    } finally {
      setSavingImages(false);
    }
  }

  /* =====================================================
     PAGE STATES
  ===================================================== */

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <main className="admin-main">
          <div className="admin-main-container">
            <div className="donation-section">
              <h2>Loading donation...</h2>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loadError || !donation) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <main className="admin-main">
          <div className="admin-main-container">
            <div className="donation-page-header">
              <div className="donation-page-heading">
                <span className="donation-page-eyebrow">
                  DONATION MANAGEMENT
                </span>

                <h1>Donation Not Available</h1>

                <p>
                  {loadError || "The requested donation could not be found."}
                </p>
              </div>

              <Link href="/admin/donations" className="admin-back-button">
                ← Donation List
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     IMAGE STATUS
  ===================================================== */

  const referenceImages = donation.images.filter(
    (image) => image.imageType === "REFERENCE",
  );

  const bannerImages = donation.images.filter(
    (image) => image.imageType === "BANNER",
  );

  const hasReference = referenceImages.length > 0;

  const hasBanner = bannerImages.length > 0;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-main-container">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="donation-page-header">
            <div className="donation-page-heading">
              <span className="donation-page-eyebrow">DONATION MANAGEMENT</span>

              <h1>Donation Details</h1>

              <p>
                Review the donation and manage its reference photo and final
                banner artwork.
              </p>
            </div>

            <Link href="/admin/donations" className="admin-back-button">
              ← Donation List
            </Link>
          </div>

          {/* =================================================
              MESSAGES
          ================================================= */}

          {uploadMessage && (
            <div className="donation-alert donation-alert-success">
              <div className="donation-alert-icon">✓</div>

              <div>
                <strong>Images saved</strong>

                <span>{uploadMessage}</span>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="donation-alert donation-alert-error">
              <div className="donation-alert-icon">!</div>

              <div>
                <strong>Unable to save images</strong>

                <span>{uploadError}</span>
              </div>
            </div>
          )}

          <div className="admin-donation-form">
            {/* =================================================
                01 DONOR DETAILS
            ================================================= */}

            <section className="donation-section">
              <div className="donation-section-header">
                <div className="donation-section-number">01</div>

                <div>
                  <h2>Donor Details</h2>

                  <p>Donor information associated with this donation.</p>
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Donor Name</label>

                  <input value={donation.donor.name} readOnly />
                </div>

                <div className="admin-form-group">
                  <label>Mobile Number</label>

                  <input value={donation.donor.mobile} readOnly />
                </div>

                <div className="admin-form-group">
                  <label>Email Address</label>

                  <input
                    value={donation.donor.email ?? ""}
                    placeholder="Not provided"
                    readOnly
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label>Address</label>

                  <textarea
                    rows={3}
                    value={donation.donor.address ?? ""}
                    placeholder="Not provided"
                    readOnly
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                02 OCCASION
            ================================================= */}

            <section className="donation-section">
              <div className="donation-section-header">
                <div className="donation-section-number">02</div>

                <div>
                  <h2>Occasion & Food Service</h2>

                  <p>Occasion information and the date food will be served.</p>
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Food Offered Date</label>

                  <input
                    type="date"
                    value={formatDateForInput(donation.foodOfferedDate)}
                    readOnly
                  />
                </div>

                <div className="admin-form-group">
                  <label>Occasion</label>

                  <input
                    value={getOccasionLabel(donation.occasion.occasionType)}
                    readOnly
                  />
                </div>

                <div className="admin-form-group">
                  <label>Donation For</label>

                  <input
                    value={getDonationForLabel(donation.occasion.donationFor)}
                    readOnly
                  />
                </div>

                <div className="admin-form-group">
                  <label>Person / Couple Name</label>

                  <input value={donation.occasion.personName} readOnly />
                </div>

                {donation.occasion.relationshipToDonor && (
                  <div className="admin-form-group">
                    <label>Relationship to Donor</label>

                    <input
                      value={donation.occasion.relationshipToDonor}
                      readOnly
                    />
                  </div>
                )}

                <div className="admin-form-group">
                  <label>Annual Reminder</label>

                  <input
                    value={
                      donation.occasion.annualReminderEnabled
                        ? "Enabled"
                        : "Disabled"
                    }
                    readOnly
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                03 DONATION IMAGES
            ================================================= */}

            <section className="donation-section">
              <div className="donation-section-header">
                <div className="donation-section-number">03</div>

                <div>
                  <h2>Donation Images</h2>

                  <p>
                    Reference photo is optional and used internally. Banner
                    artwork is the final image prepared for public display.
                  </p>
                </div>
              </div>

              {/* =================================================
                  REFERENCE PHOTO STATUS
              ================================================= */}

              <div className="selected-record-card">
                <div className="selected-record-icon">
                  {hasReference ? "✓" : "—"}
                </div>

                <div className="selected-record-main">
                  <span>REFERENCE PHOTO</span>

                  <strong>{hasReference ? "Uploaded" : "Not Provided"}</strong>

                  <p>
                    {hasReference
                      ? "A donor reference photo is available."
                      : "No donor reference photo was provided. This is optional."}
                  </p>
                </div>
              </div>
              {/* =================================================
    REFERENCE PHOTO UPLOAD
================================================= */}

              <div
                className="admin-image-upload-layout"
                style={{
                  marginTop: "22px",
                }}
              >
                {/* LEFT SIDE - CURRENT IMAGE / UPLOAD */}

                <div className="premium-upload-card">
                  {hasReference ? (
                    <>
                      <div className="premium-existing-image">
                        <span className="premium-image-label">
                          CURRENT REFERENCE PHOTO
                        </span>

                        <img
                          src={`/api/admin/images/${referenceImages[0].id}`}
                          alt="Current reference photo"
                        />
                      </div>

                      <h3>Replace Reference Photo</h3>
                    </>
                  ) : (
                    <>
                      <div className="premium-upload-icon">↑</div>

                      <h3>Add Reference Photo</h3>
                    </>
                  )}

                  <p>JPG, PNG or WebP • Maximum 5 MB</p>

                  <label className="premium-upload-button">
                    {referenceFile
                      ? "Change Reference"
                      : hasReference
                        ? "Choose Replacement"
                        : "Choose Reference"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleReferenceChange}
                      disabled={savingImages}
                    />
                  </label>

                  {referenceFile ? (
                    <>
                      <small>Selected: {referenceFile.name}</small>

                      <button
                        type="button"
                        className="admin-cancel-button"
                        onClick={clearReferenceSelection}
                        disabled={savingImages}
                        style={{
                          marginTop: "10px",
                        }}
                      >
                        Remove Selection
                      </button>
                    </>
                  ) : (
                    <small>
                      Optional donor-provided photo. This image will not be
                      displayed publicly.
                    </small>
                  )}
                </div>

                {/* RIGHT SIDE - NEW IMAGE PREVIEW */}

                <div className="premium-image-preview">
                  {referencePreview ? (
                    <img
                      src={referencePreview}
                      alt="Replacement reference preview"
                    />
                  ) : (
                    <div className="premium-empty-preview">
                      <span>REPLACEMENT PREVIEW</span>

                      <strong>
                        {hasReference
                          ? "No replacement selected"
                          : "No reference photo selected"}
                      </strong>

                      <p>
                        {hasReference
                          ? "Choose another photo to preview the replacement before saving."
                          : "Choose a donor photo to preview it before saving."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================
    BANNER ARTWORK UPLOAD
================================================= */}

              <div
                className="admin-image-upload-layout"
                style={{
                  marginTop: "22px",
                }}
              >
                {/* LEFT SIDE - CURRENT BANNER / UPLOAD */}

                <div className="premium-upload-card">
                  {hasBanner ? (
                    <>
                      <div className="premium-existing-image">
                        <span className="premium-image-label">
                          CURRENT BANNER ARTWORK
                        </span>

                        <img
                          src={`/api/admin/images/${bannerImages[0].id}`}
                          alt="Current banner artwork"
                        />
                      </div>

                      <h3>Replace Banner Artwork</h3>
                    </>
                  ) : (
                    <>
                      <div className="premium-upload-icon">↑</div>

                      <h3>Add Banner Artwork</h3>
                    </>
                  )}

                  <p>JPG, PNG or WebP • Maximum 5 MB</p>

                  <label className="premium-upload-button">
                    {bannerFile
                      ? "Change Banner"
                      : hasBanner
                        ? "Choose Replacement"
                        : "Choose Banner"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleBannerChange}
                      disabled={savingImages}
                    />
                  </label>

                  {bannerFile ? (
                    <>
                      <small>Selected: {bannerFile.name}</small>

                      <button
                        type="button"
                        className="admin-cancel-button"
                        onClick={clearBannerSelection}
                        disabled={savingImages}
                        style={{
                          marginTop: "10px",
                        }}
                      >
                        Remove Selection
                      </button>
                    </>
                  ) : (
                    <small>
                      This is the final artwork used for public display. If no
                      reference photo exists, upload the default text-based
                      banner prepared by the client.
                    </small>
                  )}
                </div>

                {/* RIGHT SIDE - NEW BANNER PREVIEW */}

                <div className="premium-image-preview">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Replacement banner preview" />
                  ) : (
                    <div className="premium-empty-preview">
                      <span>REPLACEMENT PREVIEW</span>

                      <strong>
                        {hasBanner
                          ? "No replacement selected"
                          : "Banner pending"}
                      </strong>

                      <p>
                        {hasBanner
                          ? "Choose another banner to preview the replacement before saving."
                          : "Choose the final banner artwork to preview it before saving."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================
                  SAVE BOTH IMAGES
              ================================================= */}

              {(referenceFile || bannerFile) && (
                <div
                  className="donation-form-footer"
                  style={{
                    marginTop: "24px",
                  }}
                >
                  <div>
                    <strong>Images ready to save</strong>

                    <span>
                      {referenceFile && `Reference: ${referenceFile.name}`}

                      {referenceFile && bannerFile && " • "}

                      {bannerFile && `Banner: ${bannerFile.name}`}
                    </span>
                  </div>

                  <div className="donation-form-footer-actions">
                    <button
                      type="button"
                      className="admin-save-button"
                      onClick={saveImages}
                      disabled={savingImages}
                    >
                      {savingImages ? "Saving Images..." : "Save Images"}
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* =================================================
                04 PAYMENT — SUPER ADMIN ONLY
            ================================================= */}

            {isSuperAdmin && (
              <section className="donation-section payment-section">
                <div className="donation-section-header">
                  <div className="donation-section-number">04</div>

                  <div className="payment-section-title">
                    <div>
                      <h2>Payment Details</h2>

                      <p>Financial information for this donation.</p>
                    </div>

                    <span className="super-admin-badge">SUPER ADMIN</span>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>Amount Received</label>

                    <div className="admin-amount-input">
                      <span>₹</span>

                      <input value={donation.amountReceived ?? ""} readOnly />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Payment Method</label>

                    <input
                      value={getPaymentLabel(donation.paymentMethod)}
                      readOnly
                    />
                  </div>

                  {donation.transactionReference && (
                    <div className="admin-form-group">
                      <label>Transaction / Reference Number</label>

                      <input value={donation.transactionReference} readOnly />
                    </div>
                  )}

                  <div className="admin-form-group">
                    <label>Payment Received Date</label>

                    <input
                      type="date"
                      value={formatDateForInput(donation.paymentReceivedDate)}
                      readOnly
                    />
                  </div>
                </div>
              </section>
            )}

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="donation-form-footer">
              <div>
                <strong>Donation record</strong>

                <span>
                  Reference photo is optional. Banner artwork is used for public
                  display.
                </span>
              </div>

              <div className="donation-form-footer-actions">
                <Link href="/admin/donations" className="admin-cancel-button">
                  Back to Donations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
