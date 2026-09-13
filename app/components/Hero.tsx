import "../styles/Hero.css";

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="hero-content">

          <div className="hero-kicker-wrap">
            <p className="hero-kicker">
              சுவையான உணவு • எளிய விலை
            </p>
            <span className="hero-kicker-line" />
          </div>

          <h1 className="hero-title">
            பசியில்லாத
            <span>சமுதாயம் நோக்கி.</span>
          </h1>

          <div className="hero-price-highlight">
            <span>அளவு இல்லாத சாப்பாடு</span>
            <strong>₹10</strong>
            <span>மட்டும்</span>
          </div>

          <p className="hero-description">
            அனைவரும் தயக்கமின்றி வந்து
            <br />
            பசியாறிச் செல்ல வேண்டும்...
          </p>

          <div className="hero-invite-wrap">
            <p className="hero-invite">
              வாங்க... சாப்பிடலாம்
              <span>❤️</span>
            </p>

            <span className="hero-invite-line" />
          </div>

          <div className="hero-actions">
            <a
              href="#menu"
              className="hero-button hero-button-primary"
            >
              <span className="hero-button-icon">🍴</span>
              <span>இன்றைய உணவு</span>
              <span>→</span>
            </a>

            <a
              href="#location"
              className="hero-button hero-button-secondary"
            >
              <span className="hero-location-icon">📍</span>
              <span>எங்களை சந்திக்க</span>
              <span>→</span>
            </a>
          </div>

          {/* Decorative bottom message */}
          <div className="hero-bottom-note">
            <span>விலை குறைவு...</span>
            <span>வயிறு நிறைவு! ♡</span>
          </div>

        </div>


        {/* =====================================================
            DECORATIVE LEAF
        ===================================================== */}

        <div className="hero-middle-leaf" aria-hidden="true">
          <span>🌿</span>
        </div>


        {/* =====================================================
            RIGHT IMAGE COLLAGE
        ===================================================== */}

        <div className="hero-collage">

          <div className="hero-photo hero-photo-main">
            <img
              src="/images/hero/hero-food-1.jpeg"
              alt="உணவு வழங்கும் தருணம்"
            />
          </div>

          <div className="hero-photo hero-photo-top">
            <img
              src="/images/hero/hero-food-2.jpeg"
              alt="விதவிதமான உணவு வகைகள்"
            />
          </div>

          <div className="hero-photo hero-photo-bottom">
            <img
              src="/images/hero/hero-food-3.jpeg"
              alt="உணவை பகிரும் தருணம்"
            />
          </div>

          <div className="hero-leaf hero-leaf-top">
            🌿
          </div>

          <div className="hero-leaf hero-leaf-bottom">
            🌿
          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM DECORATION
      ===================================================== */}

      <div className="hero-landscape" aria-hidden="true">
        <span className="hero-tree">🌴</span>
        <span className="hero-temple">🛕</span>
        <span className="hero-tree">🌴</span>
      </div>

    </section>
  );
}