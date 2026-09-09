import Image from "next/image";
import "../styles/MenuSection.css";

export default function MenuSection() {
  // Temporary static image.
  // Later this will come automatically from the Admin daily menu upload.
  const menuImage = "/images/menu/today-menu.jpeg";

  return (
    <section
      className="menu-section"
      id="menu"
    >
      <div className="menu-container">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="menu-section-header">

          <span className="menu-small-label">
            🍛 இன்றைய மெனு
          </span>

          <h2 className="menu-title">
            இன்று என்ன சாப்பாடு?
          </h2>

          <p className="menu-intro">
            தினமும் விதவிதமான சுவையான சாதங்கள்
            அன்புடன் தயாரிக்கப்படுகின்றன.
          </p>

        </div>

        {/* =====================================================
            MENU CARD
        ===================================================== */}

        <div className="menu-main-card">

          {/* =================================================
              DAILY MENU IMAGE
          ================================================= */}

          <div className="menu-image-area">

            <div className="menu-image-frame">

              <Image
                src={menuImage}
                alt="10 ரூபாய் சாப்பாட்டுக்கடையின் இன்றைய மெனு"
                width={800}
                height={1200}
                className="menu-image"
              />

            </div>

            <p className="menu-image-note">
              தினசரி உணவு வகைகள் மாறுபடலாம்.
            </p>

          </div>

          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="menu-text-area">

            <div className="menu-price-box">

              <div className="menu-price-circle">
                ₹10
              </div>

              <div>
                <span className="menu-price-label">
                  முழு சாப்பாடு
                </span>

                <h3>
                  ₹10 மட்டும்
                </h3>

                <p>
                  அனைவருக்கும் எளிய விலையில்
                  சுவையான உணவு.
                </p>
              </div>

            </div>

            <div className="menu-info-card">

              <div className="menu-info-icon">
                🕛
              </div>

              <div>
                <h3>
                  உணவு வழங்கும் நேரம்
                </h3>

                <p>
                  மதியம் 12.00 மணி முதல்
                  3.00 மணி வரை
                </p>
              </div>

            </div>

            <div className="menu-info-card">

              <div className="menu-info-icon">
                🍚
              </div>

              <div>
                <h3>
                  பரிமாறும் முறை
                </h3>

                <p>
                  உணவு வீணாகாமல் இருக்க முதலில்
                  தேவையான அளவு பரிமாறப்படும்.
                  மேலும் தேவையெனில் மீண்டும்
                  பெற்றுக்கொள்ளலாம்.
                </p>
              </div>

            </div>

            <a
              href="#location"
              className="menu-location-button"
            >
              📍 எங்களை சந்திக்க
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}