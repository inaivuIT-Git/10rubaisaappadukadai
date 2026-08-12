"use client";

import { useState } from "react";

const galleryImages = [
  {
    src: "/images/gallery/gallery-1.jpg",
    alt: "உணவு தயாரிப்பு",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/gallery/gallery-2.jpg",
    alt: "சுவையான உணவு",
    className: "",
  },
  {
    src: "/images/gallery/gallery-3.jpg",
    alt: "உணவு வழங்கும் தருணம்",
    className: "",
  },
  {
    src: "/images/gallery/gallery-4.jpg",
    alt: "சாப்பாட்டுக்கடை",
    className: "",
  },
  {
    src: "/images/gallery/gallery-5.jpg",
    alt: "எங்கள் உணவு",
    className: "",
  },
  {
    src: "/images/gallery/gallery-6.jpg",
    alt: "எங்கள் உணவு",
    className: "",
  },
  {
    src: "/images/gallery/gallery-7.jpg",
    alt: "எங்கள் உணவு",
    className: "",
  },
  {
    src: "/images/gallery/gallery-8.jpg",
    alt: "எங்கள் உணவு",
    className: "",
  },
  {
    src: "/images/gallery/gallery-9.jpg",
    alt: "எங்கள் உணவு",
    className: "",
  },
];

const shorts = [
  {
    id: 1,
    thumbnail: "/images/shorts/short-1.jpg",
    title: "இன்று 500+ பேருக்கு சாப்பாடு வழங்கினோம் ❤️",
    views: "12.4K",
  },
  {
    id: 2,
    thumbnail: "/images/shorts/short-2.jpg",
    title: "சுவையான வகையான சாப்பாடு தயாராகிறது 🍚",
    views: "8.7K",
  },
  {
    id: 3,
    thumbnail: "/images/shorts/short-3.jpg",
    title: "₹10-க்கு சாப்பாடு அனைவருக்கும் ❤️",
    views: "15.2K",
  },
  {
    id: 4,
    thumbnail: "/images/shorts/short-4.jpg",
    title: "சாப்பிட்ட பின் சிறிப்பு தான் எங்கள் வெற்றி 😊",
    views: "9.3K",
  },
  {
    id: 5,
    thumbnail: "/images/shorts/short-5.jpg",
    title: "அன்புடன் பரிமாறும் எங்கள் அணி 🤝",
    views: "11.1K",
  },
  {
    id: 6,
    thumbnail: "/images/shorts/short-6.jpg",
    title: "அத்தனைக்கும், சத்தானதும், வீணில்லாததும் 🌱",
    views: "7.6K",
  },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<"shorts" | "photos">("shorts");

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#F7F5F0] px-5 py-20 sm:py-24"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#EAF5E5] blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-72 h-80 w-80 rounded-full bg-[#EAF5E5] blur-3xl" />

      <div className="pointer-events-none absolute left-10 top-40 text-7xl opacity-10">
        🌿
      </div>

      <div className="pointer-events-none absolute right-10 top-80 text-7xl opacity-10">
        🌿
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#26733A] shadow-sm ring-1 ring-[#DDEBD7]">
            ❤️ எங்கள் பயணம்
          </span>

          <h2 className="mt-6 text-4xl font-black leading-tight text-[#173F63] sm:text-5xl lg:text-6xl">
            எங்கள் பயணத்தின்{" "}
            <span className="text-[#26733A]">
              சில தருணங்கள்
            </span>{" "}
            ❤️
          </h2>

          <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
            உணவு, அன்பு, சேவை — எங்கள் நாள்தோறும் நிகழும்
            அழகான தருணங்களை இங்கே காணலாம்.
          </p>

        </div>


        {/* =====================================================
            TABS
        ====================================================== */}

        <div className="mx-auto mt-10 flex max-w-xl rounded-full bg-white p-1.5 shadow-md ring-1 ring-gray-200">

          <button
            type="button"
            onClick={() => setActiveTab("shorts")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all sm:text-base ${
              activeTab === "shorts"
                ? "bg-[#26733A] text-white shadow-md"
                : "text-[#26733A] hover:bg-[#EAF5E5]"
            }`}
          >
            <span className="text-lg">🎬</span>
            ஷார்ட்ஸ் வீடியோக்கள்
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("photos")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all sm:text-base ${
              activeTab === "photos"
                ? "bg-[#26733A] text-white shadow-md"
                : "text-[#26733A] hover:bg-[#EAF5E5]"
            }`}
          >
            <span className="text-lg">📷</span>
            புகைப்படங்கள்
          </button>

        </div>


        {/* =====================================================
            SHORTS
        ====================================================== */}

        {activeTab === "shorts" && (
          <div className="mt-10">

            <div className="rounded-[2rem] bg-[#EAF5E5] p-5 sm:p-8">

              <div className="mb-7 text-center">
                <h3 className="text-2xl font-black text-[#173F63] sm:text-3xl">
                  எங்கள் பணியின் சில தருணங்கள்
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  எங்கள் உணவு பயணத்தின் சிறிய வீடியோக்கள் ❤️
                </p>
              </div>


              {/* Shorts grid */}

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

                {shorts.map((short) => (
                  <div
                    key={short.id}
                    className="group overflow-hidden rounded-3xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* Video thumbnail */}

                    <div className="relative aspect-[9/14] overflow-hidden bg-[#DCEAD7]">

                      <img
                        src={short.thumbnail}
                        alt={short.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Dark overlay */}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                      {/* Play button */}

                      <div className="absolute inset-0 flex items-center justify-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 bg-black/40 text-xl text-white backdrop-blur-sm transition group-hover:scale-110">
                          ▶
                        </div>

                      </div>


                      {/* Views */}

                      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                        ▶ {short.views}
                      </div>

                    </div>


                    {/* Caption */}

                    <div className="p-4">

                      <p className="line-clamp-2 text-sm font-bold leading-6 text-[#173F63]">
                        {short.title}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>
        )}


        {/* =====================================================
            PHOTO GALLERY
        ====================================================== */}

        {activeTab === "photos" && (
          <div className="mt-10">

            <div className="rounded-[2rem] bg-[#EAF5E5] p-5 sm:p-8">

              <div className="mb-7 text-center">

                <h3 className="text-2xl font-black text-[#173F63] sm:text-3xl">
                  புகைப்படங்கள்
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  எங்கள் உணவு, மக்கள் மற்றும் சேவையின் தருணங்கள்
                </p>

              </div>


              {/* Gallery */}

              <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:grid-cols-3 lg:grid-cols-4">

                {galleryImages.map((image, index) => (
                  <div
                    key={image.src}
                    className={`group relative overflow-hidden rounded-3xl bg-white shadow-sm ${image.className}`}
                  >

                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Hover overlay */}

                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">

                      <p className="p-4 text-sm font-bold text-white">
                        {image.alt}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>
        )}


        {/* =====================================================
            SUPPORT MESSAGE
        ====================================================== */}

        <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] bg-white p-6 shadow-md ring-1 ring-[#DDEBD7] sm:p-8">

          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">

            {/* Icon */}

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EAF5E5] text-3xl">
              🌿
            </div>


            {/* Content */}

            <div className="flex-1">

              <h3 className="text-xl font-black text-[#26733A] sm:text-2xl">
                உங்கள் ஆதரவே எங்கள் பலம்
              </h3>

              <p className="mt-2 text-sm leading-7 text-gray-600 sm:text-base">
                நீங்கள் பகிரும் ஒரு வீடியோ அல்லது ஒரு புகைப்படம்,
                இன்னொருவருக்கு எங்கள் முயற்சியை அறிமுகப்படுத்தலாம்.
              </p>

            </div>


            {/* Share */}

            <button
              type="button"
              className="rounded-full bg-[#26733A] px-7 py-3 font-bold text-white shadow-md transition hover:bg-[#1F5D30]"
            >
              ↗ பகிருங்கள்
            </button>

          </div>

        </div>


        {/* =====================================================
            FINAL MESSAGE
        ====================================================== */}

        <div className="mt-10 text-center">

          <p className="text-sm font-medium text-gray-500">
            ஒரு சிறிய முயற்சி • ஒரு பெரிய நோக்கம்
          </p>

          <p className="mt-2 text-xl font-black text-[#173F63]">
            உணவு அனைவருக்கும் ❤️
          </p>

        </div>

      </div>
    </section>
  );
}