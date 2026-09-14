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
  const [ceremonyPreview, setCeremonyPreview] = useState(false);
  const [ceremonyLaunched, setCeremonyLaunched] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    setCeremonyPreview(url.searchParams.get("ceremony") === "1");
    setPreview(isLocal || url.searchParams.get("preview") === "1");
  }, []);

  useEffect(() => {
    if (preview || ceremonyPreview || timeLeft.launched) return;

    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [preview, ceremonyPreview, timeLeft.launched]);

  // The public launch ceremony is complete. After the official launch time,
  // normal visitors now go straight to the website. The ceremony can still
  // be revisited privately with ?ceremony=1 for memories/testing.
  if ((timeLeft.launched && !ceremonyPreview) || (preview && !ceremonyPreview) || ceremonyLaunched) {
    return <>{children}</>;
  }

  const readyToLaunch = ceremonyPreview;
  const displayedTime = ceremonyPreview
    ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
    : timeLeft;

  return (
    <main className={`launch-page ${readyToLaunch ? "launch-page-ready" : ""}`}>
      <div className="launch-glow launch-glow-one" />
      <div className="launch-glow launch-glow-two" />

      <section className="launch-card" aria-labelledby="launch-title">
        <img
          className="launch-logo"
          src="/images/branding/logo-square.png"
          alt="10 ரூபாய் சாப்பாட்டுக்கடை"
        />

        <p className="launch-eyebrow">
          {readyToLaunch ? "எங்கள் குட்டி விருந்தினர் தொடங்கி வைக்கத் தயாராகிறார்!" : "இணையதள அறிமுகப் பணிகள் நடைபெறுகின்றன"}
        </p>

        <h1 id="launch-title">
          10 ரூபாய்
          <span>சாப்பாட்டுக்கடை</span>
        </h1>

        <p className="launch-message">
          {readyToLaunch ? (
            <>சிறிய கைகளால் ஒரு பெரிய தொடக்கம்!<br />மோதகத்தைத் தொட்டு இணையதளத்தைத் தொடங்கி வையுங்கள்.</>
          ) : (
            <>பசி இல்லாத ஒரு நாளை நோக்கிய எங்கள் பயணம்<br />விரைவில் இணையத்தில் தொடங்குகிறது.</>
          )}
        </p>

        <div className="launch-countdown" aria-label="Time remaining until launch ceremony">
          <CountdownValue value={displayedTime.days} label="நாட்கள்" />
          <CountdownValue value={displayedTime.hours} label="மணி" />
          <CountdownValue value={displayedTime.minutes} label="நிமிடம்" />
          <CountdownValue value={displayedTime.seconds} label="வினாடி" />
        </div>

        {readyToLaunch ? (
          <div className="launch-ceremony">
            <p className="launch-ready-label">🎉 நேரம் வந்துவிட்டது! 🎉</p>
            <button
              type="button"
              className="launch-modakam-button"
              onClick={() => setCeremonyLaunched(true)}
              aria-label="மோதகத்தைத் தொட்டு இணையதளத்தைத் தொடங்கி வையுங்கள்"
            >
              <img src="/images/launch/chocolate-modakam.svg" alt="சாக்லேட் மோதகம்" />
              <span>மோதகத்தைப் பிடியுங்கள்!</span>
              <small>தொட்டு இணையதளத்தைத் தொடங்கி வையுங்கள்</small>
            </button>
            <p className="launch-kid-note">எங்கள் குட்டி விருந்தினரின் கைகளால் இனிய தொடக்கம் ♥</p>
          </div>
        ) : (
          <>
            <div className="launch-date">
              <span>திங்கள் · 14 செப்டம்பர் 2026</span>
              <strong>நண்பகல் 12:00 · இந்திய நேரம்</strong>
            </div>
            <p className="launch-english">
              Countdown ends at 12:00 noon IST · The website opens with our little guest's ceremonial launch.
            </p>
          </>
        )}

        <div className="launch-heart" aria-hidden="true">♥</div>
        <p className="launch-tagline">விலை குறைவு… வயிறு நிறைவு!</p>
      </section>
    </main>
  );
}
