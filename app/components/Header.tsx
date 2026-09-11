import "../styles/Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">

        {/* =====================================================
            BRAND
        ===================================================== */}

        <a href="#home" className="header-brand">

          <div className="header-logo">
            <img
              src="/images/logo/logo.jpg"
              alt="10 ரூபாய் சாப்பாட்டுக்கடை"
            />
          </div>

          <div className="header-brand-content">

            <span className="header-brand-price">
              10 ரூபாய்
            </span>

            <span className="header-brand-name">
              சாப்பாட்டுக்கடை
            </span>

          </div>

        </a>


        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <nav className="header-nav">

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
            எங்களைச் சந்திக்க
          </a>

        </nav>


        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="header-actions">

          <a
            href="#contact"
            className="header-contact-button"
          >
            <span className="header-contact-icon">
              📞
            </span>

            <span>
              தொடர்பு
            </span>
          </a>


          {/* ===================================================
              MOBILE MENU
          =================================================== */}

          <button
            type="button"
            className="header-mobile-button"
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>

        </div>

      </div>
    </header>
  );
}