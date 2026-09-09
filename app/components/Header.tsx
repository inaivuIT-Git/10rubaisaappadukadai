import "../styles/Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">

        {/* Logo / Brand */}
        <a href="#home" className="header-brand">
          <div className="header-logo">
            <img
              src="/images/logo/logo-square.png"
              alt="10 ரூபாய் சாப்பாட்டுக்கடை"
            />
          </div>

          <div className="header-brand-content">
            <h1>10 ரூபாய்</h1>

            <p className="header-brand-name">
              சாப்பாட்டுக்கடை
            </p>

            <p className="header-tagline">
              விலை குறைவு... வயிறு நிறைவு!
            </p>
          </div>
        </a>

        {/* Navigation */}
        <nav className="header-nav">
          <a href="#home">முகப்பு</a>
          <a href="#menu">எங்கள் உணவு</a>
          <a href="#about">எங்களைப் பற்றி</a>
          <a href="#gallery">புகைப்படங்கள்</a>
          <a href="#contact">எங்களைச் சந்திக்க</a>
        </nav>

        {/* Contact */}
        <a
          href="tel:+919087737879"
          className="header-contact-button"
        >
          <span>📞</span>
          தொடர்பு
        </a>

        {/* Mobile Menu */}
        <button
          type="button"
          className="header-mobile-button"
          aria-label="Open menu"
        >
          ☰
        </button>

      </div>
    </header>
  );
}