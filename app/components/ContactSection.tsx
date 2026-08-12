export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#F7F5F0] px-5 py-20 sm:py-24"
    >

      {/* Decorative background */}

      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#EAF4FB] blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#F7C928]/10 blur-3xl" />


      <div className="relative mx-auto max-w-4xl text-center">


        {/* =========================
            HEART ICON
        ========================== */}

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7C928] text-2xl shadow-md">
          ❤️
        </div>


        {/* =========================
            HEADING
        ========================== */}

        <h2 className="mt-7 text-4xl font-black leading-tight text-[#155A91] sm:text-5xl">

          ஒரு சிறிய உதவி...
          <br />

          <span className="text-[#17324D]">
            ஒரு பெரிய மாற்றம்
          </span>

        </h2>


        {/* =========================
            DESCRIPTION
        ========================== */}

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#5B6670] sm:text-lg">

          அனைவருக்கும் நல்ல உணவு கிடைக்க வேண்டும்
          <br className="hidden sm:block" />
          என்பதே எங்கள் முயற்சியின் நோக்கம்.

        </p>


        {/* =========================
            CONTACT CARD
        ========================== */}

        <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-[#D9E7F0] bg-white p-7 shadow-lg sm:p-10">


          <p className="text-lg font-black text-[#17324D] sm:text-xl">
            இந்த முயற்சியைப் பற்றி தெரிந்துகொள்ள
          </p>


          <p className="mt-2 text-sm leading-6 text-[#5B6670] sm:text-base">
            அல்லது எங்களுடன் இணைந்து செயல்பட
            விரும்புகிறீர்களா?
          </p>


          {/* Buttons */}

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">


            {/* Phone */}

            <a
              href="tel:+919087737879"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#155A91] px-7 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#124C7A] hover:shadow-lg"
            >
              📞 தொடர்பு கொள்ளுங்கள்
            </a>


            {/* WhatsApp */}

            <a
              href="https://wa.me/919087737879"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#1EBE5D] hover:shadow-lg"
            >
              💬 WhatsApp
            </a>

          </div>


          {/* Phone Number */}

          <a
            href="tel:+919087737879"
            className="mt-6 inline-block text-sm font-black text-[#1769A8]"
          >
            +91 90877 37879
          </a>

        </div>


        {/* =========================
            CLOSING MESSAGE
        ========================== */}

        <div className="mt-10">

          <p className="text-xl font-black text-[#155A91] sm:text-2xl">
            விலை குறைவு...
          </p>

          <p className="mt-1 text-2xl font-black text-[#17324D] sm:text-3xl">
            வயிறு நிறைவு ❤️
          </p>

        </div>


      </div>

    </section>
  );
}