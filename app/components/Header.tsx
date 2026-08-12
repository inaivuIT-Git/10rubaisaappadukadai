export default function Header() {
  return (
<header className="sticky top-0 z-50 border-b border-[#174A73]/20 bg-[#1F5D8F] text-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo / Brand */}
        <a href="#home" className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#EAF5E5]">
            <img
              src="/images/logo/logo-square.png"
              alt="10 ரூபாய் சாப்பாட்டுக்கடை"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="leading-tight">
            <h1 className="text-xl font-black text-white sm:text-2xl">
              10 ரூபாய்
            </h1>

            <p className="text-sm font-bold text-[#EAF5E5] sm:text-base">
              சாப்பாட்டுக்கடை
            </p>

            <p className="hidden text-[10px] text-white/80 sm:block">
              விலை குறைவு... வயிறு நிறைவு!
            </p>
          </div>
        </a>

        {/* Navigation */}
       <nav className="hidden items-center gap-8 lg:flex">
  <a
    href="#home"
    className="font-semibold text-white transition hover:text-[#F7C928]"
  >
    முகப்பு
  </a>

  <a
    href="#menu"
    className="font-semibold text-white transition hover:text-[#F7C928]"
  >
    எங்கள் உணவு
  </a>

  <a
    href="#about"
    className="font-semibold text-white transition hover:text-[#F7C928]"
  >
    எங்களைப் பற்றி
  </a>

  <a
    href="#gallery"
    className="font-semibold text-white transition hover:text-[#F7C928]"
  >
    புகைப்படங்கள்
  </a>

  <a
    href="#contact"
    className="font-semibold text-white transition hover:text-[#F7C928]"
  >
    எங்களைச் சந்திக்க
  </a>
</nav>

        {/* Contact Button */}
        <a
          href="tel:9088773789"
          className="hidden items-center gap-2 rounded-full bg-[#1F5D8F] px-6 py-3 font-bold text-white shadow-md transition hover:bg-[#174A73] sm:flex"
        >
          <span>📞</span>
          தொடர்பு
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5E5] text-xl text-[#174A73] lg:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}