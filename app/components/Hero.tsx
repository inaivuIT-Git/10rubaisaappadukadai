import "../styles/Hero.css";

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">

        <div className="hero-content">

          <div className="hero-label">
            🌿 சுவையான உணவு • எளிய விலை
          </div>

   <h1 className="hero-title">
  ₹10 ரூபாய்
  <br />
  <span className="hero-title-secondary">
    சாப்பாட்டுக்கடை
  </span>
</h1>

<p className="hero-description">
  உங்கள் வாழ்வின் முக்கியமான, சிறப்பான நாட்களை
  பத்து ரூபாய் சாப்பாட்டுக் கடையுடன் இணைந்து
  பசியுடன் இருப்பவர்கள் பசி போக்கி,
  பசி இல்லாத சமுதாயத்தை உருவாக்குவோம்.
</p>

<p className="hero-highlight-text">
  வாங்க.. சாப்பிடலாம்..
</p>

          <div className="hero-price-row">

            <div className="hero-price-circle">
              <span>₹10</span>
            </div>

            <div className="hero-price-content">
              <p className="hero-price-title">
  முழு சாப்பாடு 
              </p>

              <p className="hero-price-description">
                மதியம் 12.00 மணி முதல் 3.00 மணி வரை
              </p>
            </div>

          </div>

          <div className="hero-actions">

            <a
              href="#menu"
              className="hero-primary-button"
            >
              🍛 இன்றைய உணவு
            </a>

            <a
              href="#location"
              className="hero-secondary-button"
            >
              📍 எங்களை சந்திக்க
            </a>

          </div>

        </div>

        <div className="hero-image-wrapper">

          <div className="hero-image-card">
            <img
              src="/images/hero/hero-food.jpg"
              alt="10 ரூபாய் சாப்பாட்டுக்கடையின் உணவு"
              className="hero-image"
            />
          </div>

          <div className="hero-image-info">

            <div className="hero-image-icon">
              ❤️
            </div>

            <div>
              <p className="hero-image-title">
                உணவு அனைவருக்கும்
              </p>

              <p className="hero-image-description">
                குறைந்த விலையில் நல்ல உணவை
                அனைவருக்கும் கொண்டு சேர்ப்பதே எங்கள் நோக்கம்.
              </p>
            </div>

          </div>

        </div>

      </div>

      <div className="hero-features">

        <div className="hero-features-container">

          <Feature
            icon="🍚"
            title="விதவிதமான சாதங்கள்"
            description="தினமும் பல வகைகள்"
          />

          <Feature
            icon="₹"
            title="₹10 மட்டும்"
            description="எளிய விலை"
          />

          <Feature
            icon="🌿"
            title="வீட்டுச் சுவை"
            description="அன்புடன் தயாரிப்பு"
          />

          <Feature
            icon="🕛"
            title="12 PM – 3 PM"
            description="தினசரி சேவை நேரம்"
          />

        </div>

      </div>

    </section>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="hero-feature-item">

      <div className="hero-feature-icon">
        {icon}
      </div>

      <div>
        <p className="hero-feature-title">
          {title}
        </p>

        <p className="hero-feature-description">
          {description}
        </p>
      </div>

    </div>
  );
}