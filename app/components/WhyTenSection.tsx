"use client";

import { useEffect, useRef, useState } from "react";
import "../styles/WhyTenSection.css";

export default function WhyTenSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="why-10"
      className="why-section"
      ref={sectionRef}
    >
      <div className="why-container">

        {/* =====================================================
            CENTER HEADER
        ===================================================== */}

        <div className="why-section-header">
          <span className="why-label">
            ❤️ எங்கள் நோக்கம்
          </span>

          <h2 className="why-title">
            பசியற்ற சமூகம்
          </h2>

          <span className="why-header-line" />
        </div>


        {/* =====================================================
            MAIN STORY
        ===================================================== */}

        <div className="why-story">

          {/* ===================================================
              LEFT SIDE
          =================================================== */}

          <div className="why-story-content">

            <h3 className="why-story-title">
              பசி என்பது யாருக்கும்
              <span>
                தடையாக இருக்கக்கூடாது.
              </span>
            </h3>

            <p className="why-description">
              யாராக இருந்தாலும், பசியுடன் வருபவர்
              பசியாறிச் செல்ல வேண்டும்.
            </p>

            <div className="why-purpose">

              <span className="why-purpose-label">
                அதற்காகத்தான்
              </span>

              <strong>
                பத்து ரூபாய்
                <br />
                சாப்பாட்டுக்கடை.
              </strong>

            </div>

          </div>


          {/* ===================================================
              RIGHT SIDE - ANIMATED IMPACT
          =================================================== */}

          <div
            className={`why-impact ${
              isVisible ? "why-impact-visible" : ""
            }`}
          >
            <span className="why-impact-label">
              எங்கள் எண்ணம்
            </span>

            <div className="why-impact-steps">

              {/* STEP 01 */}
              <div className="why-impact-step why-impact-step-one">

                <span className="why-impact-number">
                  01
                </span>

                <h3>
                  ஒரு சிறிய தொகை.
                </h3>

              </div>


              {/* STEP 02 */}
              <div className="why-impact-step why-impact-step-two">

                <span className="why-impact-number">
                  02
                </span>

                <h3>
                  ஒரு நிறைவான உணவு.
                </h3>

              </div>


              {/* STEP 03 */}
              <div className="why-impact-step why-impact-step-three">

                <span className="why-impact-number">
                  03
                </span>

                <h3>
                  ஒரு பெரிய நோக்கம்.
                </h3>

              </div>

            </div>
          </div>

        </div>


        {/* =====================================================
            ₹10 PHILOSOPHY
        ===================================================== */}

        <div className="why-price-section">

          <div className="why-price-circle">
            ₹10
          </div>

          <div className="why-price-content">

            <span className="why-price-label">
              இது வெறும் விலை அல்ல
            </span>

            <h3>
              ₹10 என்பது உணவின் மதிப்பு அல்ல...
            </h3>

            <p>
              அனைவரும் தயக்கமின்றி வந்து
              சாப்பிடுவதற்கான ஒரு எளிய வழி.
            </p>

          </div>

        </div>


        {/* =====================================================
            CLOSING MESSAGE
        ===================================================== */}

        <div className="why-closing">

          <span className="why-closing-icon">
            ❤️
          </span>

          <div>
            <p>
              பசி இருக்கும் வரை,
              பகிர்வதற்கான தேவையும் இருக்கும்.
            </p>

            <strong>
              நம்மால் முடிந்த ஒரு வேளை உணவை பகிர்வோம்.
            </strong>
          </div>

        </div>

      </div>
    </section>
  );
}