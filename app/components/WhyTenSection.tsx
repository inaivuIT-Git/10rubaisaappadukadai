import "../styles/WhyTenSection.css";

export default function WhyTenSection() {
  return (
    <section id="why-10" className="why-section">
      <div className="why-container">

        {/* =====================================================
            MAIN STORY
        ===================================================== */}

        <div className="why-story">

          {/* LEFT SIDE */}
          <div className="why-story-content">

            <span className="why-label">
              ❤️ எங்கள் நோக்கம்
            </span>

            <h2 className="why-title">
              பசி என்பது யாருக்கும்
              <span> தடையாக இருக்கக்கூடாது.</span>
            </h2>

            <p className="why-description">
              யாராக இருந்தாலும், பசியுடன் வருபவர்
              பசியாறிச் செல்ல வேண்டும்.
            </p>

            <div className="why-purpose">
              <span>அதற்காகத்தான்</span>

              <strong>
                பத்து ரூபாய்
                <br />
                சாப்பாட்டுக்கடை.
              </strong>
            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="why-people">

            <div className="why-person">

              <div className="why-person-icon">
                💪
              </div>

              <div>
                <span>ஒருவேளை...</span>

                <p>
                  உழைத்துக் களைத்து
                  வருபவராக இருக்கலாம்...
                </p>
              </div>

            </div>


            <div className="why-person">

              <div className="why-person-icon">
                ❤️
              </div>

              <div>
                <span>ஒருவேளை...</span>

                <p>
                  தனியாக வாழும்
                  முதியவராக இருக்கலாம்...
                </p>
              </div>

            </div>


            <div className="why-person">

              <div className="why-person-icon">
                🍚
              </div>

              <div>
                <span>ஒருவேளை...</span>

                <p>
                  அன்றைய ஒரு வேளை உணவை
                  எதிர்பார்த்து வருபவராக இருக்கலாம்...
                </p>
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