export default function Footer() {
  return (
    <footer className="bg-[#155A91] text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">

              {/* Logo / Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7C928] text-2xl shadow-md">
                🍚
              </div>

              <div>
                <div className="text-2xl font-black text-[#F7C928]">
                  10 ரூபாய்
                </div>

                <div className="font-bold text-white">
                  சாப்பாட்டுக்கடை
                </div>
              </div>

            </div>


            <p className="mt-6 max-w-md text-sm leading-7 text-white/75">
              சுவையான உணவை எளிய விலையில்
              அனைவருக்கும் வழங்க வேண்டும் என்ற
              எண்ணத்துடன் முன்னெடுக்கப்படும்
              ஒரு சிறிய முயற்சி.
            </p>


            <p className="mt-4 font-bold text-[#F7C928]">
              விலை குறைவு... வயிறு நிறைவு! ❤️
            </p>

          </div>


          {/* Quick Links */}
          <div>

            <h3 className="font-bold text-[#F7C928]">
              விரைவான இணைப்புகள்
            </h3>


            <nav className="mt-5 flex flex-col gap-3 text-sm text-white/75">

              <a
                href="#"
                className="transition hover:text-[#F7C928]"
              >
                முகப்பு
              </a>


              <a
                href="#menu"
                className="transition hover:text-[#F7C928]"
              >
                எங்கள் உணவு
              </a>


              <a
                href="#about"
                className="transition hover:text-[#F7C928]"
              >
                எங்களைப் பற்றி
              </a>


              <a
                href="#gallery"
                className="transition hover:text-[#F7C928]"
              >
                புகைப்படங்கள்
              </a>


              <a
                href="#location"
                className="transition hover:text-[#F7C928]"
              >
                எங்களை சந்திக்க
              </a>

            </nav>

          </div>


          {/* Contact */}
          <div>

            <h3 className="font-bold text-[#F7C928]">
              தொடர்பு
            </h3>


            <div className="mt-5 space-y-4 text-sm text-white/75">

              {/* Address */}
              <div className="flex gap-3">

                <span className="text-lg">
                  📍
                </span>

                <span>
                  [முகவரி இங்கே]
                  <br />
                  [ஊர் / மாவட்டம்]
                </span>

              </div>


              {/* Phone */}
              <div className="flex gap-3">

                <span className="text-lg">
                  📞
                </span>

                <a
                  href="tel:+919999999999"
                  className="transition hover:text-[#F7C928]"
                >
                  +91 99999 99999
                </a>

              </div>


              {/* Timing */}
              <div className="flex gap-3">

                <span className="text-lg">
                  🕐
                </span>

                <span>
                  தினமும்
                  <br />
                  காலை 11:00 – பிற்பகல் 3:00
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* Bottom Bar */}
      <div className="border-t border-white/15 bg-[#0F4773]">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-white/60 sm:flex-row sm:px-8">

          <p>
            © {new Date().getFullYear()} 10 ரூபாய் சாப்பாட்டுக்கடை.
            அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.
          </p>


          <p className="text-white/70">
            அன்புடன் உருவாக்கப்பட்டது ❤️
          </p>

        </div>

      </div>

    </footer>
  );
}