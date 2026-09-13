"use client";

import { useEffect, useState } from "react";
import "../styles/Gallery.css";

type YouTubeVideo = {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
};

const galleryImages = [
  {
    src: "/images/gallery/gallery-1.jpg",
    alt: "உணவு தயாரிப்பு",
    featured: true,
  },
  {
    src: "/images/gallery/gallery-2.jpg",
    alt: "சுவையான உணவு",
  },
  {
    src: "/images/gallery/gallery-3.jpg",
    alt: "உணவு வழங்கும் தருணம்",
  },
  {
    src: "/images/gallery/gallery-4.jpg",
    alt: "சாப்பாட்டுக்கடை",
  },
  {
    src: "/images/gallery/gallery-5.jpg",
    alt: "எங்கள் உணவு",
  },
  {
    src: "/images/gallery/gallery-6.jpg",
    alt: "எங்கள் உணவு",
  },
  {
    src: "/images/gallery/gallery-7.jpg",
    alt: "எங்கள் உணவு",
  },
  {
    src: "/images/gallery/gallery-8.jpg",
    alt: "எங்கள் உணவு",
  },
  {
    src: "/images/gallery/gallery-9.jpg",
    alt: "எங்கள் உணவு",
  },
];

export default function Gallery() {
  const [activeTab, setActiveTab] =
    useState<"shorts" | "photos">("shorts");

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const response = await fetch("/api/youtube");

        if (!response.ok) {
          throw new Error("Unable to load YouTube videos");
        }

        const data = await response.json();

        setVideos(data);
      } catch (error) {
        console.error("YouTube videos error:", error);
      } finally {
        setVideosLoading(false);
      }
    }

    loadVideos();
  }, []);

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-glow gallery-glow-left" />
      <div className="gallery-glow gallery-glow-right" />

      <div className="gallery-leaf gallery-leaf-left">🌿</div>
      <div className="gallery-leaf gallery-leaf-right">🌿</div>

      <div className="gallery-container">
        <div className="gallery-header">
          <div className="gallery-label">❤️ எங்கள் பயணம்</div>

          <h2 className="gallery-title">
            எங்கள் பயணத்தின்
            <span> சில தருணங்கள்</span> ❤️
          </h2>

          <p className="gallery-description">
            உணவு, அன்பு, சேவை — எங்கள் நாள்தோறும் நிகழும்
            அழகான தருணங்களை இங்கே காணலாம்.
          </p>
        </div>

        <div className="gallery-tabs">
          <button
            type="button"
            onClick={() => setActiveTab("shorts")}
            className={
              activeTab === "shorts"
                ? "gallery-tab gallery-tab-active"
                : "gallery-tab"
            }
          >
            <span>🎬</span>
            சமீபத்திய வீடியோக்கள்
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("photos")}
            className={
              activeTab === "photos"
                ? "gallery-tab gallery-tab-active"
                : "gallery-tab"
            }
          >
            <span>📷</span>
            புகைப்படங்கள்
          </button>
        </div>

        {activeTab === "shorts" && (
          <div className="gallery-panel">
            <div className="gallery-panel-heading">
              <h3>எங்கள் சமீபத்திய YouTube வீடியோக்கள்</h3>
              <p>எங்கள் உணவு பயணத்தின் புதிய தருணங்கள் ❤️</p>
            </div>

            {videosLoading && (
              <p className="gallery-loading">
                வீடியோக்கள் ஏற்றப்படுகின்றன...
              </p>
            )}

            {!videosLoading && videos.length === 0 && (
              <p className="gallery-loading">
                தற்போது வீடியோக்கள் கிடைக்கவில்லை.
              </p>
            )}

            {!videosLoading && videos.length > 0 && (
              <div className="shorts-grid">
                {videos.map((video) => (
                  <a
                    key={video.videoId}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-card short-card-link"
                  >
                    <div className="short-image-wrapper">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="short-image"
                      />

                      <div className="short-overlay" />

                      <div className="short-play-wrapper">
                        <div className="short-play-button">▶</div>
                      </div>
                    </div>

              
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "photos" && (
          <div className="gallery-panel">
            <div className="gallery-panel-heading">
              <h3>புகைப்படங்கள்</h3>
              <p>எங்கள் உணவு, மக்கள் மற்றும் சேவையின் தருணங்கள்</p>
            </div>

            <div className="photo-grid">
              {galleryImages.map((image) => (
                <article
                  key={image.src}
                  className={
                    image.featured
                      ? "photo-card photo-card-featured"
                      : "photo-card"
                  }
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="photo-image"
                  />

                  <div className="photo-overlay">
                    <p>{image.alt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="gallery-support">
          <div className="gallery-support-icon">🌿</div>

          <div className="gallery-support-content">
            <h3>உங்கள் ஆதரவே எங்கள் பலம்</h3>

            <p>
              நீங்கள் பகிரும் ஒரு வீடியோ அல்லது ஒரு புகைப்படம்,
              இன்னொருவருக்கு எங்கள் முயற்சியை அறிமுகப்படுத்தலாம்.
            </p>
          </div>

          <button
            type="button"
            className="gallery-share-button"
          >
            ↗ பகிருங்கள்
          </button>
        </div>

        <div className="gallery-footer-message">
          <p>ஒரு சிறிய முயற்சி • ஒரு பெரிய நோக்கம்</p>
          <strong>உணவு அனைவருக்கும் ❤️</strong>
        </div>
      </div>
    </section>
  );
}