import "../styles/LocationSection.css";

export default function LocationSection() {
  return (
    <section id="location" className="location-section">
      <div className="location-glow location-glow-right" />
      <div className="location-glow location-glow-left" />

      <div className="location-container">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="location-header">
          <div className="location-label">📍 எங்களை சந்திக்க</div>

          <h2 className="location-title">
            எங்கள் கடைக்கு
            <br />
            <span>வாருங்கள் ❤️</span>
          </h2>

          <p className="location-description">
            நேரில் வந்து சுவையான உணவை ₹10-க்கு சாப்பிட்டு மகிழுங்கள்.
          </p>
        </div>

        {/* =====================================================
            MAP
        ====================================================== */}

        <div className="location-map-card">
          <div className="location-map-wrapper">
            <iframe
              title="10 ரூபாய் சாப்பாட்டுக்கடை Location"
              src="https://www.google.com/maps?q=79%2F1%2C%2020%2F2%2C%20Narasimman%20Road%2C%20near%20Siddhar%20Kaliyamman%20Temple%2C%20Salem%20636002%2C%20Tamil%20Nadu&output=embed"
              loading="lazy"
            />
          </div>
        </div>

        {/* =====================================================
            DETAILS
        ====================================================== */}

        <div className="location-details-card">
          <div className="location-details-grid">
            {/* ADDRESS */}

            <div className="location-address">
              <div className="location-address-row">
                <div className="location-icon">📍</div>

                <div>
                  <h3>எங்கள் முகவரி</h3>

                  <p>
                    79/1, 20/2, நரசிம்மன் சாலை,
                    <br />
                    சித்தர் காலியம்மன் கோவில் அருகில்,
                    <br />
                    சேலம் - 636 002.
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=79%2F1%2C%2020%2F2%2C%20Narasimman%20Road%2C%20near%20Siddhar%20Kaliyamman%20Temple%2C%20Salem%20636002%2C%20Tamil%20Nadu"
                target="_blank"
                rel="noreferrer"
                className="location-direction-button"
              >
                📍 Google Maps-ல் வழியைப் பார்க்க
              </a>
            </div>

            {/* INFO */}

            <div className="location-info-grid">
              <div className="location-info-card">
                <div className="location-info-icon">🕐</div>

                <h4>நேரம்</h4>

                <p>
                  தினமும்
                  <br />
                  மதியம் 12:00 – 3:00
                </p>
              </div>

              <div className="location-info-card">
                <div className="location-info-icon">📞</div>

                <h4>தொடர்பு</h4>

                <a href="tel:+919087737879">+91 90877 37879</a>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM MESSAGE
        ====================================================== */}

        <div className="location-bottom">
          <div className="location-bottom-message">
            <span>🍚</span>

            <p>உங்கள் வருகைக்காக காத்திருக்கிறோம் ❤️</p>
          </div>
        </div>
      </div>
    </section>
  );
}
