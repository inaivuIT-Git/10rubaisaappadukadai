import Image from "next/image";
import Banner from "./Banner";
import "../styles/MenuSection.css";

export default function MenuSection() {
  const menuImage = "/images/menu/today-menu.jpeg";

  return (
    <section id="menu" className="menu-section">
      <div className="menu-container">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="menu-section-header">
          <span className="menu-label">
            இன்றைய சிறப்பு
          </span>

          <h2 className="menu-title">
            இன்றைய ஆதரவாளர் & இன்றைய உணவு
          </h2>

          <p className="menu-description">
            இன்றைய சிறப்பு நாளை பகிர்ந்து கொண்ட ஆதரவாளரின்
            வாழ்த்துகளும், இன்று வழங்கப்படும் உணவும்.
          </p>

          <span className="menu-header-line" />
        </div>


        {/* =====================================================
            DONOR BANNER
        ===================================================== */}

        <div className="menu-banner-block">

          <div className="menu-banner-heading">

            <div>
              <span className="menu-banner-label">
                ❤️ இன்றைய ஆதரவாளர்
              </span>

              <h3>
                அன்புடன் பகிரப்படும் ஒரு சிறப்பான நாள்
              </h3>
            </div>

            <span className="menu-banner-date">
              இன்று
            </span>

          </div>

          {/* Existing dynamic banner component */}
          <Banner />

        </div>


        {/* =====================================================
            DAILY MENU
        ===================================================== */}

        <div className="menu-main">

          {/* LEFT - MENU ARTWORK */}

          <div className="menu-artwork-column">

            <div className="menu-artwork-heading">

              <span className="menu-food-label">
                🍚 இன்றைய உணவு
              </span>

              <h3>
                இன்று என்ன சாப்பாடு?
              </h3>

            </div>


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


          {/* ===================================================
              RIGHT - MENU DETAILS
          =================================================== */}

          <div className="menu-details">

            {/* PRICE */}

            <div className="menu-price-area">

              <span className="menu-price-label">
                முழு சாப்பாடு
              </span>

              <div className="menu-price">

                <strong>
                  ₹10
                </strong>

                <span>
                  மட்டும்
                </span>

              </div>

              <p>
                அனைவருக்கும் எளிய விலையில்
                சுவையான உணவு.
              </p>

            </div>


            <div className="menu-divider" />


            {/* TIME */}

            <div className="menu-detail-row">

              <div className="menu-detail-icon">
                🕛
              </div>

              <div className="menu-detail-content">

                <span className="menu-detail-label">
                  உணவு வழங்கும் நேரம்
                </span>

                <h3>
                  மதியம் 12.00 மணி – 3.00 மணி
                </h3>

              </div>

            </div>


            {/* SERVING */}

            <div className="menu-detail-row">

              <div className="menu-detail-icon">
                🍚
              </div>

              <div className="menu-detail-content">

                <span className="menu-detail-label">
                  பரிமாறும் முறை
                </span>

                <p>
                  உணவு வீணாகாமல் இருக்க முதலில்
                  தேவையான அளவு பரிமாறப்படும்.
                  மேலும் தேவையெனில் மீண்டும்
                  பெற்றுக்கொள்ளலாம்.
                </p>

              </div>

            </div>


            {/* PURPOSE */}

            <div className="menu-detail-row">

              <div className="menu-detail-icon">
                ❤️
              </div>

              <div className="menu-detail-content">

                <span className="menu-detail-label">
                  எங்கள் நோக்கம்
                </span>

                <p>
                  யாரும் பசியுடன் திரும்பிச் செல்லக்கூடாது
                  என்பதே எங்கள் எண்ணம்.
                </p>

              </div>

            </div>


            {/* LOCATION */}

            <a
              href="#location"
              className="menu-location-button"
            >
              <span>
                📍
              </span>

              <span>
                எங்களை சந்திக்க
              </span>

              <span className="menu-button-arrow">
                →
              </span>
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}