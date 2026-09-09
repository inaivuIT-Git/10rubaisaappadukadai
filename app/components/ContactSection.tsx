import "../styles/ContactSection.css";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="contact-section"
    >
      <div className="contact-container">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="contact-content">

          <span className="contact-label">
            ❤️ எங்களுடன் இணையுங்கள்
          </span>

          <h2 className="contact-title">
            உங்கள் சிறப்பான நாளை
            <span>
              {" "}ஒரு அர்த்தமுள்ள நாளாக மாற்றுங்கள்.
            </span>
          </h2>

          <p className="contact-description">
            பிறந்தநாள், திருமண நாள், நினைவு நாள்
            அல்லது உங்கள் வாழ்வின் எந்த சிறப்பான நாளாக இருந்தாலும்,
            அந்த நாளில் ஒரு வேளை உணவை பகிர்ந்து
            மற்றொருவரின் முகத்தில் மகிழ்ச்சியை உருவாக்கலாம்.
          </p>

          <div className="contact-message">
            <div className="contact-message-icon">
              🍚
            </div>

            <div>
              <span>
                ஒரு நாள் • ஒரு உணவு • ஒரு நல்ல நினைவு
              </span>

              <strong>
                உங்கள் மகிழ்ச்சியை உணவாக பகிருங்கள்.
              </strong>
            </div>
          </div>

        </div>


        {/* =====================================================
            CONTACT CARD
        ===================================================== */}

        <div className="contact-card">

          <div className="contact-card-icon">
            🤝
          </div>

          <span className="contact-card-label">
            தொடர்பு கொள்ள
          </span>

          <h3>
            எங்களுடன் இணைந்து
            உணவு வழங்க விரும்புகிறீர்களா?
          </h3>

          <p>
            உங்கள் சிறப்பான நாளில் உணவு வழங்குவது
            அல்லது இந்த முயற்சியைப் பற்றி மேலும்
            தெரிந்துகொள்ள எங்களை தொடர்பு கொள்ளுங்கள்.
          </p>


          {/* =================================================
              PHONE
          ================================================= */}

          <a
            href="tel:+919087737879"
            className="contact-phone"
          >
            <span className="contact-action-icon">
              📞
            </span>

            <span>
              <small>
                அழைக்க
              </small>

              <strong>
                +91 90877 37879
              </strong>
            </span>
          </a>


          {/* =================================================
              WHATSAPP
          ================================================= */}

          <a
            href="https://wa.me/919087737879"
            target="_blank"
            rel="noreferrer"
            className="contact-whatsapp"
          >
            <span className="contact-action-icon">
              💬
            </span>

            <span>
              <small>
                WhatsApp மூலம்
              </small>

              <strong>
                தொடர்பு கொள்ளுங்கள்
              </strong>
            </span>
          </a>

        </div>

      </div>


      {/* =====================================================
          BOTTOM MESSAGE
      ===================================================== */}

      <div className="contact-bottom">

        <p>
          ஒரு சிறிய பகிர்வு...
        </p>

        <strong>
          ஒருவரின் பசியை போக்கும் பெரிய உதவி ❤️
        </strong>

      </div>

    </section>
  );
}