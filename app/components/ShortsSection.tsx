"use client";

import { useRef, useState } from "react";

const shorts = [
  {
    id: 1,
    src: "/videos/short-01.mp4",
    title: "உணவுக்கு அப்பால்... மனிதநேயம் ❤️",
  },
  {
    id: 2,
    src: "/videos/short-02.mp4",
    title: "அன்புடன் பரிமாறுகிறோம்",
  },
  {
    id: 3,
    src: "/videos/short-03.mp4",
    title: "₹10 உணவு — ஒரு சிறிய முயற்சி",
  },
];

export default function ShortsSection() {
  return (
    <section
      id="shorts"
      className="bg-[#F7F5F0] px-5 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <span className="inline-flex rounded-full bg-[#720909]/10 px-4 py-2 text-sm font-bold text-[#720909]">
            🎥 எங்கள் Shorts
          </span>

          <h2 className="mt-5 text-4xl font-black leading-tight text-[#720909] sm:text-5xl">
            எங்கள் பயணத்தின்
            <br />
            <span className="text-[#2d7037]">
              சில தருணங்கள் ❤️
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-[#5b4b42] sm:text-lg">
            உணவு, மனிதர்கள், அன்பு —
            <br />
            எங்கள் முயற்சியின் சில காட்சிகள்.
          </p>

        </div>

        {/* Videos */}
        <div className="mt-12 flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">

          {shorts.map((short) => (
            <ShortCard
              key={short.id}
              src={short.src}
              title={short.title}
            />
          ))}

        </div>

        {/* Mobile swipe hint */}
        <p className="mt-1 text-center text-xs font-medium text-[#806d60] md:hidden">
          ← மேலும் பார்க்க swipe செய்யுங்கள் →
        </p>

      </div>
    </section>
  );
}


/* =====================================================
   SHORT CARD
===================================================== */

function ShortCard({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggleVideo = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {
          console.log("Video playback was blocked.");
        });
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className="
        group
        relative
        min-w-[280px]
        snap-center
        overflow-hidden
        rounded-[2rem]
        bg-black
        shadow-xl
        sm:min-w-[320px]
        md:min-w-0
      "
    >

      {/* Video */}
      <div className="aspect-[9/16]">

        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

      </div>

      {/* Bottom Gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* ₹10 Badge */}
      <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f7c928] text-sm font-black text-[#720909] shadow-lg">
        ₹10
      </div>

      {/* Play / Pause Button */}
      <button
        type="button"
        onClick={toggleVideo}
        aria-label={playing ? "Pause video" : "Play video"}
        className="
          absolute
          left-1/2
          top-1/2
          flex
          h-16
          w-16
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-white/90
          text-xl
          text-[#720909]
          shadow-2xl
          transition
          hover:scale-110
        "
      >
        {playing ? "❚❚" : "▶"}
      </button>

      {/* Caption */}
      <div className="absolute bottom-5 left-5 right-5">

        <p className="text-sm font-bold leading-6 text-white">
          {title}
        </p>

      </div>

    </div>
  );
}