"use client";

import { useEffect, useState } from "react";
import "../styles/Banner.css";

type BannerItem = {
  id: string;
  image: string;
};

export default function Banner() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBanners() {
      try {
        const response = await fetch("/api/banners", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load banners");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setBanners(data);
        }
      } catch (error) {
        console.error("Banner error:", error);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    }

    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((current) =>
        current === banners.length - 1
          ? 0
          : current + 1
      );
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [banners]);

  useEffect(() => {
    if (
      banners.length > 0 &&
      currentIndex >= banners.length
    ) {
      setCurrentIndex(0);
    }
  }, [banners, currentIndex]);

  if (loading || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  function previousBanner() {
    setCurrentIndex((current) =>
      current === 0
        ? banners.length - 1
        : current - 1
    );
  }

  function nextBanner() {
    setCurrentIndex((current) =>
      current === banners.length - 1
        ? 0
        : current + 1
    );
  }

  return (
    <section className="banner-section">
      <div className="banner-container">
        <div className="banner-card">
          <img
            src={currentBanner.image}
            alt={`Donor banner ${currentIndex + 1}`}
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
                onClick={() =>
                  setCurrentIndex(index)
                }
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