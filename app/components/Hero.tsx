export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#EAF4FB]"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">

        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}

        <div className="text-center lg:text-left">

          {/* Small heading */}

          <div className="mb-5 flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#155A91] shadow-sm">
              🌿 சுவையான உணவு • எளிய விலை
            </span>
          </div>


          {/* Main heading */}

          <h1 className="text-5xl font-black leading-[1.05] text-[#155A91] sm:text-6xl lg:text-7xl">
            எங்கள்
            <br />

            <span className="text-[#17324D]">
              உணவு
            </span>

            <span className="ml-2">
              ❤️
            </span>
          </h1>


          {/* Description */}

          <p className="mx-auto mt-6 max-w-xl text-lg font-semibold leading-8 text-[#35485A] lg:mx-0 lg:text-xl">
            ஒவ்வொரு நாளும் 3–5 வகையான உணவுகள்
            <br />

            ஒவ்வொரு வகையும் வெறும் ₹10
          </p>


          {/* =================================================
              PRICE + MESSAGE
          ================================================== */}

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-center">

            {/* ₹10 */}

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#F7C928] shadow-md">

              <span className="text-3xl font-black text-[#155A91]">
                ₹10
              </span>

            </div>


            {/* Message */}

            <div className="text-center sm:text-left">

              <p className="font-black text-[#155A91]">
                அனைவருக்கும் மலிவு விலை
              </p>

              <p className="mt-1 text-sm text-[#5B6670]">
                சுவையான உணவு • அன்புடன் தயாரிப்பு
              </p>

            </div>

          </div>


          {/* =================================================
              CTA BUTTONS
          ================================================== */}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">

            <a
              href="#menu"
              className="rounded-full bg-[#155A91] px-7 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#124C7A] hover:shadow-lg"
            >
              🍛 எங்கள் உணவு
            </a>


            <a
              href="#location"
              className="rounded-full border-2 border-[#155A91] bg-white px-7 py-3.5 font-bold text-[#155A91] transition hover:-translate-y-0.5 hover:bg-[#155A91] hover:text-white"
            >
              📍 எங்களை சந்திக்க
            </a>

          </div>

        </div>


        {/* =====================================================
            RIGHT FOOD IMAGE
        ====================================================== */}

        <div className="relative">

          {/* Image */}

          <div className="overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-xl">

            <img
              src="/images/hero/hero-food.jpg"
              alt="10 ரூபாய் சாப்பாட்டுக்கடையின் உணவு"
              className="h-[360px] w-full object-cover sm:h-[480px]"
            />

          </div>


          {/* =================================================
              IMAGE INFORMATION CARD
          ================================================== */}

          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-[#155A91]/95 p-5 text-white shadow-lg backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6">

            <div className="flex items-center gap-4">

              {/* Icon */}

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7C928] text-xl">
                ❤️
              </div>


              {/* Text */}

              <div>

                <p className="font-black">
                  குறைந்த செலவில் நல்ல உணவு
                </p>

                <p className="mt-1 text-sm leading-6 text-white/80">
                  அனைவரும் சாப்பிட வேண்டும் என்பதே
                  எங்கள் நோக்கம்.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          FEATURE STRIP
      ====================================================== */}

      <div className="border-t border-[#D9E7F0] bg-white">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#D9E7F0] md:grid-cols-4">

          <Feature
            icon="🍚"
            title="சத்தான உணவு"
            description="எளிமையான உணவு"
          />

          <Feature
            icon="❤️"
            title="அனைவருக்கும்"
            description="எளிய விலை"
          />

          <Feature
            icon="🌿"
            title="வீட்டுச் சுவை"
            description="அன்புடன் தயாரிப்பு"
          />

          <Feature
            icon="₹"
            title="எளிய விலை"
            description="ஒவ்வொரு வகையும் ₹10"
          />

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   FEATURE COMPONENT
========================================================= */

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
    <div className="flex items-center gap-3 px-4 py-5 sm:px-6">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF4FB] text-xl">
        {icon}
      </div>


      <div>

        <p className="text-sm font-bold text-[#155A91]">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-[#5B6670]">
          {description}
        </p>

      </div>

    </div>
  );
}