import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="footer-container">

        <div className="footer-grid">

          {/* =================================================
              BRAND
          ================================================== */}

          <div className="footer-brand">

            <div className="footer-brand-header">

              <div className="footer-logo">
                <img
                  src="/images/logo/logo.jpg"
                  alt="10 ரூபாய் சாப்பாட்டுக்கடை"
                />
              </div>

              <div className="footer-brand-name">
                <h2>10 ரூபாய்</h2>
                <p>சாப்பாட்டுக்கடை</p>
              </div>

            </div>


            <p className="footer-description">
              சுவையான உணவை எளிய விலையில்
              அனைவருக்கும் வழங்க வேண்டும் என்ற
              எண்ணத்துடன் முன்னெடுக்கப்படும்
              ஒரு சிறிய முயற்சி.
            </p>


            <p className="footer-tagline">
              விலை குறைவு... வயிறு நிறைவு! ❤️
            </p>

          </div>


          {/* =================================================
              QUICK LINKS
          ================================================== */}

          <div className="footer-links">

            <h3>
              விரைவான இணைப்புகள்
            </h3>

            <nav>

              <a href="#home">
                முகப்பு
              </a>

              <a href="#menu">
                எங்கள் உணவு
              </a>

              <a href="#why-10">
                எங்களைப் பற்றி
              </a>

              <a href="#gallery">
                புகைப்படங்கள்
              </a>

              <a href="#location">
                எங்களை சந்திக்க
              </a>

            </nav>

          </div>


          {/* =================================================
              CONTACT
          ================================================== */}

          <div className="footer-contact">

            <h3>
              தொடர்பு
            </h3>


            <div className="footer-contact-list">

              {/* ADDRESS */}

              <div className="footer-contact-item">

                <div className="footer-contact-icon">
                  📍
                </div>

                 <p>
                    நரசிம்மன் சாலை
                    <br />
                    அருள்மிகு சித்திர காளியம்மன் கோவில் எதிரில்
                    <br />
                    ஹவுசிங் போர்டு + போஸ்ட் ஆபிஸ் அருகில்
                    <br />
                    செவ்வாய்ப்பேட்டை
                    <br />
                    சேலம் - 636 002.
                  </p>

              </div>


              {/* PHONE */}

              <div className="footer-contact-item">

                <div className="footer-contact-icon">
                  📞
                </div>

                <a href="tel:+919087737879">
                  +91 90877 37879
                </a>

              </div>


              {/* TIMING */}

              <div className="footer-contact-item">

                <div className="footer-contact-icon">
                  🕐
                </div>

                <p>
                  தினமும்
                  <br />
                  மதியம் 12:00 – 3:00
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
            © {new Date().getFullYear()} 10 ரூபாய் சாப்பாட்டுக்கடை.
            அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.
          </p>

          <p>
            அன்புடன் உருவாக்கப்பட்டது ❤️
          </p>

        </div>

      </div>

    </footer>
  );
}