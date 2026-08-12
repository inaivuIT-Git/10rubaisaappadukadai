export default function LocationSection() {
  return (
    <section
      id="location"
      className="relative overflow-hidden bg-[#EAF4FB] px-5 py-20 sm:py-24"
    >

      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-white/60 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-[#F7C928]/10 blur-3xl" />


      <div className="relative mx-auto max-w-7xl">


        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#155A91] shadow-sm ring-1 ring-[#D9E7F0]">
            📍 எங்களை சந்திக்க
          </span>


          <h2 className="mt-5 text-4xl font-black leading-tight text-[#155A91] sm:text-5xl">

            எங்கள் கடைக்கு
            <br />

            <span className="text-[#17324D]">
              வாருங்கள் ❤️
            </span>

          </h2>


          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#5B6670] sm:text-lg">
            நேரில் வந்து சுவையான உணவை ₹10-க்கு
            சாப்பிட்டு மகிழுங்கள்.
          </p>

        </div>


        {/* =====================================================
            MAP
        ====================================================== */}

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-xl">

          <div className="h-[350px] overflow-hidden rounded-[1.5rem] bg-gray-200 sm:h-[450px]">

            <iframe
              title="10 ரூபாய் சாப்பாட்டுக்கடை Location"
              src="https://www.google.com/maps?q=Salem,Tamil%20Nadu&output=embed"
              className="h-full w-full border-0"
              loading="lazy"
            />

          </div>

        </div>


        {/* =====================================================
            LOCATION DETAILS
        ====================================================== */}

        <div className="mx-auto mt-6 max-w-5xl rounded-[2rem] bg-white p-6 shadow-lg sm:p-8">

          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">


            {/* ADDRESS */}

            <div>

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF4FB] text-xl">
                  📍
                </div>


                <div>

                  <p className="text-lg font-black text-[#155A91]">
                    எங்கள் முகவரி
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[#5B6670] sm:text-base">
                    79/1, 20/2, நரசிம்மன் சாலை,
                    <br />
                    சித்தர் காலியம்மன் கோவில் அருகில்,
                    <br />
                    சேலம் - 636 002.
                  </p>

                </div>

              </div>


              {/* Direction Button */}

              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#155A91] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#124C7A]"
              >
                📍 Google Maps-ல் வழியைப் பார்க்க
              </a>

            </div>


            {/* INFO */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">


              {/* Timing */}

              <div className="rounded-2xl bg-[#F7F5F0] p-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7C928]">
                  🕐
                </div>

                <p className="mt-4 text-sm font-black text-[#155A91]">
                  நேரம்
                </p>

                <p className="mt-1 text-xs leading-5 text-[#5B6670]">
                  தினமும்
                  <br />
                  மதியம் 12:00 – 3:00
                </p>

              </div>


              {/* Phone */}

              <div className="rounded-2xl bg-[#F7F5F0] p-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7C928]">
                  📞
                </div>

                <p className="mt-4 text-sm font-black text-[#155A91]">
                  தொடர்பு
                </p>

                <a
                  href="tel:+919087737879"
                  className="mt-1 block text-xs font-bold leading-5 text-[#1769A8]"
                >
                  +91
                  <br />
                  90877 37879
                </a>

              </div>


            </div>

          </div>

        </div>


        {/* =====================================================
            BOTTOM MESSAGE
        ====================================================== */}

        <div className="mt-8 text-center">

          <div className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-sm">

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7C928]">
              🍚
            </span>

            <p className="text-sm font-bold text-[#17324D] sm:text-base">
              உங்கள் வருகைக்காக காத்திருக்கிறோம் ❤️
            </p>

          </div>

        </div>


      </div>

    </section>
  );
}