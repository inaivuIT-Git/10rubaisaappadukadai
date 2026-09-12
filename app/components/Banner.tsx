"use client";

import { useEffect, useMemo, useState } from "react";
import "../styles/Banner.css";

type BannerItem = {
  id: number | string;
  enabled: boolean;
  startDate: string;
  endDate: string;
  title: string;
  message: string;
  image: string;
  isDefault?: boolean;
  occasion?: string;
};

const scheduledBanners: BannerItem[] = [
  {
    id: 1,
    enabled: true,
    startDate: "2026-09-12",
    endDate: "2026-09-12",
    occasion: "birthday",
    title: "",
    message: "",
    image: "/images/banner/image-1.jpeg",
  },
  {
    id: 2,
    enabled: true,
    startDate: "2026-09-12",
    endDate: "2026-09-12",
    occasion: "birthday",
    title: "",
    message: "",
    image: "/images/banner/image-2.jpeg",
  },
  {
    id: 3,
    enabled: false,
    startDate: "2026-09-11",
    endDate: "2026-09-11",
    occasion: "birthday",
    title: "",
    message: "",
    image: "/images/banner/image-3.jpg",
  },
  {
    id: 4,
    enabled: false,
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    occasion: "memorial",
    title: "",
    message: "",
    image: "/images/banner/image-4.jpeg",
  },
  {
    id: 5,
    enabled: true,
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    occasion: "memorial",
    title: "",
    message: "",
    image: "/images/banner/image-5.jpeg",
  },
  {
    id: 6,
    enabled: false,
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    occasion: "memorial",
    title: "",
    message: "",
    image: "/images/banner/image-6.jpeg",
  },
];

const defaultBanners: BannerItem[] = [];

function indiaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function Banner() {
  const banners = useMemo(() => {
    const today = indiaDate();
    const active = scheduledBanners.filter(
      (banner) =>
        banner.enabled &&
        today >= banner.startDate &&
        today <= banner.endDate
    );

    return active.length > 0
      ? [
          ...active.map((banner) => ({ ...banner, isDefault: false })),
          ...defaultBanners.map((banner) => ({ ...banner, isDefault: true })),
        ]
      : defaultBanners.map((banner) => ({ ...banner, isDefault: true }));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((current) =>
        current === banners.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  function previousBanner() {
    setCurrentIndex((current) =>
      current === 0 ? banners.length - 1 : current - 1
    );
  }

  function nextBanner() {
    setCurrentIndex((current) =>
      current === banners.length - 1 ? 0 : current + 1
    );
  }

  return (
    <section className="banner-section">
      <div className="banner-container">
        <div className="banner-card">
          <img
            src={currentBanner.image}
            alt={currentBanner.title || "Special announcement"}
            className="banner-image"
          />

          {banners.length > 1 && (
            <>
              <button
                type="button"
                className="banner-arrow banner-arrow-left"
                onClick={previousBanner}
                aria-label="Previous banner"
              >
                ‹
              </button>
              <button
                type="button"
                className="banner-arrow banner-arrow-right"
                onClick={nextBanner}
                aria-label="Next banner"
              >
                ›
              </button>
            </>
          )}
        </div>

        {banners.length > 1 && (
          <div className="banner-dots">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={
                  index === currentIndex
                    ? "banner-dot banner-dot-active"
                    : "banner-dot"
                }
                aria-label={`Banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
