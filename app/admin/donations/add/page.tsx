"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useAdminAuth } from "../../../components/admin/AdminAuthGuard";

import "../../../styles/AdminLayout.css";
import "../../../styles/AddDonation.css";

export default function AddDonationPage() {
  const { isSuperAdmin } = useAdminAuth();

  type ExistingDonor = {
    id: string;
    name: string;
    mobile: string;
    email: string | null;
    address: string | null;

    occasions: {
      id: string;
      occasionType: string;
      donationFor: string;
      personName: string;
      relationshipToDonor: string | null;
      annualReminderEnabled: boolean;
    }[];

    donations: {
      id: string;
      foodOfferedDate: string;

      occasion: {
        id: string;
        occasionType: string;
        donationFor: string;
        personName: string;
        relationshipToDonor: string | null;
      };
    }[];
  };

  const [donorName, setDonorName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [donorSearchResults, setDonorSearchResults] =
    useState<ExistingDonor[]>([]);

  const [selectedDonor, setSelectedDonor] =
    useState<ExistingDonor | null>(null);

  const [occasionType, setOccasionType] =
    useState("");

  const [donationFor, setDonationFor] =
    useState("");

  const [personName, setPersonName] =
    useState("");

  const [relationship, setRelationship] =
    useState("");

  const [annualReminder, setAnnualReminder] =
    useState(true);

  const [searchingDonor, setSearchingDonor] =
    useState(false);

  const [donorSearchMessage, setDonorSearchMessage] =
    useState("");

  const [referenceImage, setReferenceImage] =
    useState<File | null>(null);

  const [referencePreview, setReferencePreview] =
    useState<string | null>(null);

  const [bannerImage, setBannerImage] =
    useState<File | null>(null);

  const [bannerPreview, setBannerPreview] =
    useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [saveError, setSaveError] =
    useState("");

  function handleReferenceImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setReferenceImage(null);
      setReferencePreview(null);
      return;
    }

    setReferenceImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setReferencePreview(previewUrl);
  }

  function handleBannerImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setBannerImage(null);
      setBannerPreview(null);
      return;
    }

    setBannerImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setBannerPreview(previewUrl);
  }

  async function searchExistingDonor() {
    if (
      !mobile.trim() &&
      !donorName.trim()
    ) {
      setDonorSearchMessage(
        "Please enter donor name or mobile number."
      );

      setDonorSearchResults([]);

      return;
    }

    try {
      setSearchingDonor(true);

      setDonorSearchMessage("");

      setDonorSearchResults([]);

      const params =
        new URLSearchParams();

      if (mobile.trim()) {
        params.set(
          "mobile",
          mobile.trim()
        );
      }

      if (donorName.trim()) {
        params.set(
          "name",
          donorName.trim()
        );
      }

      const response = await fetch(
        `/api/admin/donors/search?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setDonorSearchMessage(
          data.message ??
            "Donor search failed."
        );

        return;
      }

      const results: ExistingDonor[] =
        data.donors ?? [];

      setDonorSearchResults(
        results
      );

      if (results.length === 0) {
        setDonorSearchMessage(
          "No existing donor found. You can continue as a new donor."
        );
      }
    } catch (error) {
      console.error(
        "Existing donor search error:",
        error
      );

      setDonorSearchMessage(
        "Unable to search donor."
      );
    } finally {
      setSearchingDonor(false);
    }
  }

  function selectExistingDonor(
    donor: ExistingDonor
  ) {
    setSelectedDonor(donor);

    setDonorName(donor.name);
    setMobile(donor.mobile);
    setEmail(donor.email ?? "");
    setAddress(donor.address ?? "");

    setOccasionType("");
    setDonationFor("");
    setPersonName("");
    setRelationship("");
    setAnnualReminder(true);

    setDonorSearchResults([]);

    setDonorSearchMessage(
      "Existing donor selected."
    );
  }

  async function uploadDonationImage(
    donationId: string,
    file: File,
    imageType: "REFERENCE" | "BANNER"
  ) {
    const imageFormData =
      new FormData();

    imageFormData.append(
      "file",
      file
    );

    imageFormData.append(
      "imageType",
      imageType
    );

    const response = await fetch(
      `/api/admin/donations/${donationId}/images`,
      {
        method: "POST",
        credentials: "include",
        body: imageFormData,
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ??
          `${imageType} image upload failed.`
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

      const body: {
        donorId: string | null;
        occasionId?: string | null;

        donorName: string;
        mobile: string;
        email: string;
        address: string;

        foodOfferedDate: string;
        occasionType: string;
        donationFor: string;
        personName: string;
        relationshipToDonor: string;
        annualReminderEnabled: boolean;

        amountReceived?: number;
        paymentMethod?: string;
        transactionReference?: string;
        paymentReceivedDate?: string;
      } = {
        donorId:
          selectedDonor?.id ??
          null,

        occasionId: null,

        donorName: String(
          formData.get(
            "donorName"
          ) ?? ""
        ).trim(),

        mobile: String(
          formData.get(
            "mobile"
          ) ?? ""
        ).trim(),

        email: String(
          formData.get(
            "email"
          ) ?? ""
        ).trim(),

        address: String(
          formData.get(
            "address"
          ) ?? ""
        ).trim(),

        foodOfferedDate:
          String(
            formData.get(
              "foodDate"
            ) ?? ""
          ),

        occasionType:
          String(
            formData.get(
              "occasion"
            ) ?? ""
          ),

        donationFor:
          String(
            formData.get(
              "donationFor"
            ) ?? ""
          ),

        personName: String(
          formData.get(
            "personName"
          ) ?? ""
        ).trim(),

        relationshipToDonor:
          String(
            formData.get(
              "relationship"
            ) ?? ""
          ).trim(),

        annualReminderEnabled:
          formData.get(
            "annualReminder"
          ) === "on",
      };

      if (isSuperAdmin) {
        const amount =
          String(
            formData.get(
              "amount"
            ) ?? ""
          );

        body.amountReceived =
          Number(amount);

        body.paymentMethod =
          String(
            formData.get(
              "paymentMethod"
            ) ?? ""
          );

        body.transactionReference =
          String(
            formData.get(
              "transactionReference"
            ) ?? ""
          ).trim();

        body.paymentReceivedDate =
          String(
            formData.get(
              "paymentDate"
            ) ?? ""
          );
      }

      /* =====================================================
         SAVE DONATION
      ===================================================== */

      const response = await fetch(
        "/api/admin/donations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body:
            JSON.stringify(body),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setSaveError(
          data.message ??
            "Unable to save donation."
        );

        return;
      }

      const donationId =
        data.donation?.id;

      if (!donationId) {
        setSaveError(
          "Donation was saved, but the donation ID was not returned."
        );

        return;
      }

      /* =====================================================
         UPLOAD REFERENCE PHOTO
      ===================================================== */

      if (referenceImage) {
        try {
          await uploadDonationImage(
            donationId,
            referenceImage,
            "REFERENCE"
          );
        } catch (error) {
          console.error(
            "Reference image upload error:",
            error
          );

          setSaveError(
            error instanceof Error
              ? `Donation was saved, but reference photo upload failed: ${error.message}`
              : "Donation was saved, but reference photo upload failed."
          );

          return;
        }
      }

      /* =====================================================
         UPLOAD BANNER ARTWORK
      ===================================================== */

      if (bannerImage) {
        try {
          await uploadDonationImage(
            donationId,
            bannerImage,
            "BANNER"
          );
        } catch (error) {
          console.error(
            "Banner image upload error:",
            error
          );

          setSaveError(
            error instanceof Error
              ? `Donation was saved, but banner artwork upload failed: ${error.message}`
              : "Donation was saved, but banner artwork upload failed."
          );

          return;
        }
      }

      /* =====================================================
         SUCCESS MESSAGE
      ===================================================== */

      if (
        referenceImage &&
        bannerImage
      ) {
        setSaveMessage(
          "Donation, reference photo and banner artwork saved successfully."
        );
      } else if (
        referenceImage
      ) {
        setSaveMessage(
          "Donation and reference photo saved successfully."
        );
      } else if (
        bannerImage
      ) {
        setSaveMessage(
          "Donation and banner artwork saved successfully."
        );
      } else {
        setSaveMessage(
          "Donation saved successfully."
        );
      }

      /* =====================================================
         RESET
      ===================================================== */

      form.reset();

      setDonorName("");
      setMobile("");
      setEmail("");
      setAddress("");

      setSelectedDonor(null);

      setDonorSearchResults([]);
      setDonorSearchMessage("");

      setOccasionType("");
      setDonationFor("");
      setPersonName("");
      setRelationship("");

      setAnnualReminder(true);

      setPaymentMethod("");

      setReferenceImage(null);
      setReferencePreview(null);

      setBannerImage(null);
      setBannerPreview(null);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      console.log(
        "Donation created:",
        data.donation
      );
    } catch (error) {
      console.error(
        "Donation save error:",
        error
      );

      setSaveError(
        "Unable to save donation."
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

          <div className="donation-page-header">

            <div className="donation-page-heading">
              <span className="donation-page-eyebrow">
                DONATION MANAGEMENT
              </span>

              <h1>
                Add Donation
              </h1>

              <p>
                Record donor, occasion, food service and payment
                information in one place.
              </p>
            </div>

            <Link
              href="/admin/donations"
              className="admin-back-button"
            >
              ← Donation List
            </Link>

          </div>

          {/* =====================================================
              SUCCESS / ERROR
          ===================================================== */}

          {saveMessage && (
            <div className="donation-alert donation-alert-success">

              <div className="donation-alert-icon">
                ✓
              </div>

              <div>
                <strong>
                  Donation saved successfully
                </strong>

                <span>
                  {saveMessage}
                </span>
              </div>

            </div>
          )}

          {saveError && (
            <div className="donation-alert donation-alert-error">

              <div className="donation-alert-icon">
                !
              </div>

              <div>
                <strong>
                  Unable to complete donation
                </strong>

                <span>
                  {saveError}
                </span>
              </div>

            </div>
          )}

          <form
            className="admin-donation-form"
            onSubmit={handleSubmit}
          >

            {/* =====================================================
                01. DONOR
            ===================================================== */}

            <section className="donation-section">

              <div className="donation-section-header">

                <div className="donation-section-number">
                  01
                </div>

                <div>
                  <h2>
                    Donor Details
                  </h2>

                  <p>
                    Search for an existing donor or enter details
                    for a new donor.
                  </p>
                </div>

              </div>

              {/* EXISTING DONOR SEARCH */}

              <div className="donor-search-card">

                <div className="donor-search-card-header">

                  <div>
                    <span className="donor-search-label">
                      EXISTING DONOR
                    </span>

                    <h3>
                      Find an existing donor
                    </h3>

                    <p>
                      Search using either the donor name or mobile
                      number.
                    </p>
                  </div>

                </div>

                <div className="donor-search-grid">

                  <div className="admin-form-group">
                    <label htmlFor="donorName">
                      Donor Name
                    </label>

                    <input
                      id="donorName"
                      name="donorName"
                      type="text"
                      value={donorName}
                      onChange={(event) => {
                        setDonorName(
                          event.target.value
                        );

                        setSelectedDonor(
                          null
                        );
                      }}
                      placeholder="Enter donor name"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="mobile">
                      Mobile Number
                    </label>

                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(event) => {
                        setMobile(
                          event.target.value
                        );

                        setSelectedDonor(
                          null
                        );
                      }}
                      placeholder="Enter mobile number"
                    />
                  </div>

                  <div className="donor-search-action">
                    <button
                      type="button"
                      className="donor-search-button"
                      onClick={
                        searchExistingDonor
                      }
                      disabled={
                        searchingDonor
                      }
                    >
                      {searchingDonor
                        ? "Searching..."
                        : "Search"}
                    </button>
                  </div>

                </div>

                {donorSearchMessage && (
                  <div className="donor-search-message">
                    {donorSearchMessage}
                  </div>
                )}

                {donorSearchResults.length > 0 && (
                  <div className="donor-results">

                    <div className="donor-results-heading">
                      <strong>
                        Matching donors
                      </strong>

                      <span>
                        {
                          donorSearchResults.length
                        }{" "}
                        result
                        {donorSearchResults.length !==
                        1
                          ? "s"
                          : ""}
                      </span>
                    </div>

                    {donorSearchResults.map(
                      (donor) => (
                        <div
                          key={donor.id}
                          className="donor-result-row"
                        >

                          <div className="donor-result-main">

                            <div className="donor-result-avatar">
                              {donor.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="donor-result-details">

                              <strong>
                                {donor.name}
                              </strong>

                              <div>

                                {donor.mobile && (
                                  <span>
                                    {
                                      donor.mobile
                                    }
                                  </span>
                                )}

                                {donor.email && (
                                  <span>
                                    {
                                      donor.email
                                    }
                                  </span>
                                )}

                              </div>

                            </div>

                          </div>

                          <div className="donor-result-history">
                            <strong>
                              {
                                donor.donations.length
                              }
                            </strong>

                            <span>
                              Donations
                            </span>
                          </div>

                          <button
                            type="button"
                            className="donor-select-button"
                            onClick={() =>
                              selectExistingDonor(
                                donor
                              )
                            }
                          >
                            Select
                          </button>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              {/* SELECTED DONOR */}

              {selectedDonor && (
                <div className="selected-record-card">

                  <div className="selected-record-icon">
                    ✓
                  </div>

                  <div className="selected-record-main">
                    <span>
                      SELECTED DONOR
                    </span>

                    <strong>
                      {selectedDonor.name}
                    </strong>

                    <p>
                      {selectedDonor.mobile ||
                        "No mobile number"}
                    </p>
                  </div>

                  <div className="selected-record-stat">
                    <strong>
                      {
                        selectedDonor.donations.length
                      }
                    </strong>

                    <span>
                      Previous Donations
                    </span>
                  </div>

                  <div className="selected-record-stat">
                    <strong>
                      {
                        selectedDonor.occasions.length
                      }
                    </strong>

                    <span>
                      Occasions
                    </span>
                  </div>

                </div>
              )}

              {/* CONTACT INFORMATION */}

              <div className="form-subsection-heading">

                <div>
                  <h3>
                    Contact Information
                  </h3>

                  <p>
                    Optional contact information for the donor.
                  </p>
                </div>

              </div>

              <div className="admin-form-grid">

                <div className="admin-form-group">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label htmlFor="address">
                    Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={address}
                    onChange={(event) =>
                      setAddress(
                        event.target.value
                      )
                    }
                    placeholder="Enter donor address"
                  />
                </div>

              </div>

            </section>

            {/* =====================================================
                02. OCCASION
            ===================================================== */}

            <section className="donation-section">

              <div className="donation-section-header">

                <div className="donation-section-number">
                  02
                </div>

                <div>
                  <h2>
                    Occasion & Food Service
                  </h2>

                  <p>
                    Record why the food is being sponsored and
                    when it will be served.
                  </p>
                </div>

              </div>

              {/* EXISTING OCCASIONS */}

              {selectedDonor &&
                selectedDonor.occasions.length > 0 && (
                  <div className="existing-occasion-area">

                    <div className="form-subsection-heading">

                      <div>
                        <h3>
                          Existing Occasions
                        </h3>

                        <p>
                          Previous occasions recorded for this donor.
                        </p>
                      </div>

                    </div>

                    <div className="occasion-display-list">

                      {selectedDonor.occasions.map(
                        (occasion) => {
                          const latestDonation =
                            selectedDonor.donations.find(
                              (donation) =>
                                donation.occasion.id ===
                                occasion.id
                            );

                          return (
                            <div
                              key={occasion.id}
                              className="occasion-display-card"
                            >

                              <div className="occasion-display-main">

                                <strong>
                                  {occasion.personName}
                                </strong>

                                <span>
                                  {occasion.occasionType.replaceAll(
                                    "_",
                                    " "
                                  )}

                                  {" • "}

                                  {occasion.donationFor.replaceAll(
                                    "_",
                                    " "
                                  )}
                                </span>

                                {occasion.relationshipToDonor && (
                                  <span>
                                    Relationship:{" "}
                                    {
                                      occasion.relationshipToDonor
                                    }
                                  </span>
                                )}

                              </div>

                              <div className="occasion-display-date">

                                <span>
                                  Last Food Offered
                                </span>

                                <strong>
                                  {latestDonation
                                    ? new Date(
                                        latestDonation.foodOfferedDate
                                      ).toLocaleDateString(
                                        "en-IN",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                          timeZone: "UTC",
                                        }
                                      )
                                    : "No previous date"}
                                </strong>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                )}

              {/* CURRENT DONATION */}

              <div className="admin-form-grid">

                <div className="admin-form-group">

                  <label htmlFor="foodDate">
                    Food Offered Date{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="foodDate"
                    name="foodDate"
                    type="date"
                    required
                  />

                  <small className="form-field-help">
                    The date on which food will be served.
                  </small>

                </div>

                <div className="admin-form-group">

                  <label htmlFor="occasion">
                    Occasion{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="occasion"
                    name="occasion"
                    value={occasionType}
                    onChange={(event) =>
                      setOccasionType(
                        event.target.value
                      )
                    }
                    required
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select occasion
                    </option>

                    <option value="birthday">
                      Birthday
                    </option>

                    <option value="wedding-anniversary">
                      Wedding Anniversary
                    </option>

                    <option value="memorial">
                      Memorial / Death Anniversary
                    </option>

                    <option value="other">
                      Other Special Occasion
                    </option>

                  </select>

                </div>

                <div className="admin-form-group">

                  <label htmlFor="donationFor">
                    Donation For{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="donationFor"
                    name="donationFor"
                    value={donationFor}
                    onChange={(event) =>
                      setDonationFor(
                        event.target.value
                      )
                    }
                    required
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select
                    </option>

                    <option value="self">
                      Self
                    </option>

                    <option value="family-member">
                      Family Member
                    </option>

                    <option value="friend">
                      Friend
                    </option>

                    <option value="relative">
                      Relative
                    </option>

                    <option value="other">
                      Other
                    </option>

                  </select>

                </div>

                <div className="admin-form-group">

                  <label htmlFor="personName">
                    Person / Couple Name{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="personName"
                    name="personName"
                    type="text"
                    value={personName}
                    onChange={(event) =>
                      setPersonName(
                        event.target.value
                      )
                    }
                    placeholder="Example: Ravi / Ravi & Priya"
                    required
                  />

                </div>

                {donationFor !== "" &&
                  donationFor !== "self" && (
                    <div className="admin-form-group">

                      <label htmlFor="relationship">
                        Relationship to Donor
                      </label>

                      <input
                        id="relationship"
                        name="relationship"
                        type="text"
                        value={relationship}
                        onChange={(event) =>
                          setRelationship(
                            event.target.value
                          )
                        }
                        placeholder="Example: Sister, Father, Friend"
                      />

                    </div>
                  )}

                <div className="admin-form-group admin-form-full">

                  <div className="reminder-card">

                    <label className="reminder-checkbox">

                      <input
                        type="checkbox"
                        name="annualReminder"
                        checked={annualReminder}
                        onChange={(event) =>
                          setAnnualReminder(
                            event.target.checked
                          )
                        }
                      />

                      <span className="reminder-check-ui" />

                    </label>

                    <div className="reminder-content">

                      <strong>
                        Annual Reminder
                      </strong>

                      <p>
                        Remind the team 7 days before next
                        year&apos;s food offered date.
                      </p>

                    </div>

                    <span className="reminder-status">
                      {annualReminder
                        ? "Enabled"
                        : "Disabled"}
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* =====================================================
                03. IMAGES
            ===================================================== */}

            <section className="donation-section">

              <div className="donation-section-header">

                <div className="donation-section-number">
                  03
                </div>

                <div>
                  <h2>
                    Images
                  </h2>

                  <p>
                    Upload the donor reference photo and final
                    banner artwork when available.
                  </p>
                </div>

              </div>

              <div className="donation-image-type-grid">

                {/* REFERENCE PHOTO */}

                <div className="donation-image-type-card">

                  <div className="donation-image-type-header">

                    <div>
              

                      <h3>
                        Reference Photo
                      </h3>

                      <p>
                        Original photo provided by the donor.
                      </p>
                    </div>

                  

                  </div>

                  <div className="premium-upload-card">

                    <div className="premium-upload-icon">
                      ↑
                    </div>

                    <h3>
                      Upload reference photo
                    </h3>

                    <p>
                      JPG, PNG or WebP • Maximum 5 MB
                    </p>

                    <label className="premium-upload-button">

                      Choose Reference Photo

                      <input
                        id="referenceImage"
                        name="referenceImage"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={
                          handleReferenceImageChange
                        }
                      />

                    </label>

                    <small>
                      This image will not be displayed publicly.
                    </small>

                  </div>

                  <div className="premium-image-preview">

                    {referencePreview ? (
                      <img
                        src={referencePreview}
                        alt="Reference photo preview"
                      />
                    ) : (
                      <div className="premium-empty-preview">

                        <span>
                          REFERENCE PHOTO
                        </span>

                        <strong>
                          No photo selected
                        </strong>

                        <p>
                          The donor&apos;s original photo will
                          appear here.
                        </p>

                      </div>
                    )}

                  </div>

                </div>

                {/* BANNER ARTWORK */}

                <div className="donation-image-type-card">

                  <div className="donation-image-type-header">

                    <div>
                      

                      <h3>
                        Banner Artwork
                      </h3>

                      <p>
                        Final prepared artwork for the public website.
                      </p>
                    </div>

                   

                  </div>

                  <div className="premium-upload-card">

                    <div className="premium-upload-icon">
                      ↑
                    </div>

                    <h3>
                      Upload banner artwork
                    </h3>

                    <p>
                      JPG, PNG or WebP • Maximum 5 MB
                    </p>

                    <label className="premium-upload-button">

                      Choose Banner

                      <input
                        id="bannerImage"
                        name="bannerImage"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={
                          handleBannerImageChange
                        }
                      />

                    </label>

                    <small>
                      You can leave this empty and upload the
                      banner later.
                    </small>

                  </div>

                  <div className="premium-image-preview">

                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Banner artwork preview"
                      />
                    ) : (
                      <div className="premium-empty-preview">

                        <span>
                          BANNER ARTWORK
                        </span>

                        <strong>
                          No banner selected
                        </strong>

                        <p>
                          The final public banner artwork will
                          appear here.
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>

            </section>

            {/* =====================================================
                04. PAYMENT
            ===================================================== */}

            {isSuperAdmin && (
              <section className="donation-section payment-section">

                <div className="donation-section-header">

                  <div className="donation-section-number">
                    04
                  </div>

                  <div className="payment-section-title">

                    <div>
                      <h2>
                        Payment Details
                      </h2>

                      <p>
                        Record the amount received and payment
                        information.
                      </p>
                    </div>

                    <span className="super-admin-badge">
                      SUPER ADMIN
                    </span>

                  </div>

                </div>

                <div className="admin-form-grid">

                  <div className="admin-form-group">

                    <label htmlFor="amount">
                      Amount Received{" "}
                      <span>*</span>
                    </label>

                    <div className="admin-amount-input">

                      <span>
                        ₹
                      </span>

                      <input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Enter amount"
                        required
                      />

                    </div>

                  </div>

                  <div className="admin-form-group">

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

                      <option value="gpay">
                        GPay
                      </option>

                      <option value="cash">
                        Cash
                      </option>

                      <option value="neft">
                        NEFT
                      </option>

                    </select>

                  </div>

                  {paymentMethod !== "cash" &&
                    paymentMethod !== "" && (
                      <div className="admin-form-group">

                        <label htmlFor="transactionReference">
                          Transaction / Reference Number
                        </label>

                        <input
                          id="transactionReference"
                          name="transactionReference"
                          type="text"
                          placeholder="Enter transaction reference"
                        />

                      </div>
                    )}

                  <div className="admin-form-group">

                    <label htmlFor="paymentDate">
                      Payment Received Date{" "}
                      <span>*</span>
                    </label>

                    <input
                      id="paymentDate"
                      name="paymentDate"
                      type="date"
                      required
                    />

                  </div>

                </div>

              </section>
            )}

            {/* =====================================================
                ACTIONS
            ===================================================== */}

            <div className="donation-form-footer">

              <div>
                <strong>
                  Ready to save?
                </strong>

                <span>
                  Please review the information before saving.
                </span>
              </div>

              <div className="donation-form-footer-actions">

                <Link
                  href="/admin/donations"
                  className="admin-cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="admin-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Donation"}
                </button>

              </div>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}