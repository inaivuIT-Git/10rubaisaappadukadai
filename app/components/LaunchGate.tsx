"use client";

import { ReactNode, useEffect, useState } from "react";
import "../styles/LaunchGate.css";

const LAUNCH_AT = new Date("2026-09-14T12:00:00+05:30").getTime();

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  launched: boolean;
};

function calculateTimeLeft(): TimeLeft {
  const remaining = LAUNCH_AT - Date.now();

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, launched: true };
  }

  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
    launched: false,
  };
}

function CountdownValue({ value, label }: { value: number; label: string }) {
  return (
    <div className="launch-countdown-item">
      <strong>{String(value).padStart(2, "0")}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function LaunchGate({ children }: { children: ReactNode }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    setPreview(isLocal || url.searchParams.get("preview") === "1");
  }, []);

  useEffect(() => {
    if (preview || timeLeft.launched) return;

    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [preview, timeLeft.launched]);

  if (preview || timeLeft.launched) {
    return <>{children}</>;
  }

  return (
    <main className="launch-page">
      <div className="launch-glow launch-glow-one" />
      <div className="launch-glow launch-glow-two" />

      <section className="launch-card" aria-labelledby="launch-title">
        <img
          className="launch-logo"
          src="/images/branding/logo-square.png"
          alt="10 ரூபாய் சாப்பாட்டுக்கடை"
        />

        <p className="launch-eyebrow">இணையதள அறிமுகப் பணிகள் நடைபெறுகின்றன</p>

        <h1 id="launch-title">
          10 ரூபாய்
          <span>சாப்பாட்டுக்கடை</span>
        </h1>

        <p className="launch-message">
          பசி இல்லாத ஒரு நாளை நோக்கிய எங்கள் பயணம்
          <br />
          விரைவில் இணையத்தில் தொடங்குகிறது.
        </p>

        <div className="launch-countdown" aria-label="Time remaining until launch">
          <CountdownValue value={timeLeft.days} label="நாட்கள்" />
          <CountdownValue value={timeLeft.hours} label="மணி" />
          <CountdownValue value={timeLeft.minutes} label="நிமிடம்" />
          <CountdownValue value={timeLeft.seconds} label="வினாடி" />
        </div>

        <div className="launch-date">
          <span>திங்கள் · 14 செப்டம்பர் 2026</span>
          <strong>நண்பகல் 12:00 · இந்திய நேரம்</strong>
        </div>

        <p className="launch-english">
          Website launch in progress · Monday, 14 September 2026 at 12:00 noon IST
        </p>

        <div className="launch-heart" aria-hidden="true">♥</div>
        <p className="launch-tagline">விலை குறைவு… வயிறு நிறைவு!</p>
      </section>
    </main>
  );
}
