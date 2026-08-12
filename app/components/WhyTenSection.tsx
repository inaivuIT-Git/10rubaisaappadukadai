export default function WhyTenSection() {
  return (
    <section
      id="why-10"
      className="relative overflow-hidden bg-[#0B4F8A] px-5 py-20 sm:py-24"
    >
      {/* Decorative background circles */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#F7C928]/10 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#8BCF7A]/10 blur-3xl" />

      {/* Decorative leaf shapes */}
      <div className="absolute left-5 top-24 hidden text-6xl opacity-10 sm:block">
        🌿
      </div>

      <div className="absolute right-5 bottom-24 hidden text-6xl opacity-10 sm:block">
        🌿
      </div>

      <div className="relative mx-auto max-w-6xl">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mx-auto max-w-3xl text-center">

          {/* Small label */}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm">
            ❤️ எங்கள் நோக்கம்
          </span>

          {/* Heading */}
          <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            ₹10-க்கு எப்படி
            <br />

            <span className="text-[#F7C928]">
              இவ்வளவு உணவு?
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            அனைவருக்கும் நல்ல உணவு கிடைக்க வேண்டும்.
            <br />
            உணவும் வீணாகக்கூடாது என்பதே எங்கள் நோக்கம்.
          </p>

        </div>


        {/* =====================================================
            ₹10 HIGHLIGHT
        ====================================================== */}

        <div className="mx-auto mt-10 flex w-fit items-center gap-4 rounded-full bg-white px-4 py-3 shadow-xl sm:gap-5 sm:px-6">

          {/* ₹10 Circle */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F7C928] shadow-md sm:h-20 sm:w-20">
            <span className="text-2xl font-black text-[#174A70] sm:text-3xl">
              ₹10
            </span>
          </div>

          {/* Text */}
          <div className="pr-3">
            <p className="text-sm font-black text-[#174A70] sm:text-base">
              எல்லோருக்கும் எளிய விலை
            </p>

            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              நல்ல உணவு • நியாயமான விலை
            </p>
          </div>

        </div>


        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="mt-14 rounded-[2rem] bg-white p-5 shadow-2xl sm:p-8 lg:p-10">

          {/* Inner heading */}
          <div className="text-center">

            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF5E5] px-5 py-2 text-sm font-bold text-[#26733A]">
              🌱 எங்கள் செயல்முறை
            </span>

            <h3 className="mt-4 text-2xl font-black text-[#174A70] sm:text-3xl">
              நல்ல உணவு • குறைந்த விலை • வீணில்லா முயற்சி
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              அனைவரும் சாப்பிட வேண்டும் என்பதற்காக
              எளிமையான முறையில் இந்த உணவு வழங்கப்படுகிறது.
            </p>

          </div>


          {/* =====================================================
              THREE STEPS
          ====================================================== */}

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {/* STEP 1 */}
            <div className="group rounded-3xl border border-[#DCE8EF] bg-[#F7FAFC] p-7 text-center transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B4F8A] text-2xl font-black text-white shadow-md">
                ₹10
              </div>

              <div className="mt-5">

                <span className="text-xs font-bold uppercase tracking-widest text-[#0B4F8A]">
                  STEP 01
                </span>

                <h4 className="mt-2 text-xl font-black text-[#174A70]">
                  ₹10 மட்டும்
                </h4>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  அனைவரும் வாங்கி சாப்பிடக்கூடிய
                  வகையில் ஒவ்வொரு உணவும்
                  வெறும் ₹10 மட்டுமே.
                </p>

              </div>

            </div>


            {/* STEP 2 */}
            <div className="group rounded-3xl border border-[#DDEBD7] bg-[#F5FAF2] p-7 text-center transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF5E5] text-2xl shadow-md">
                🍚
              </div>

              <div className="mt-5">

                <span className="text-xs font-bold uppercase tracking-widest text-[#26733A]">
                  STEP 02
                </span>

                <h4 className="mt-2 text-xl font-black text-[#26733A]">
                  முதலில் சிறிய அளவு
                </h4>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  முதல் முறையாக அனைத்து வகையான
                  உணவுகளும் சிறிய அளவில்
                  பரிமாறப்படும்.
                </p>

              </div>

            </div>


            {/* STEP 3 */}
            <div className="group rounded-3xl border border-[#F0E2A8] bg-[#FFFDF2] p-7 text-center transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7C928] text-2xl shadow-md">
                ❤️
              </div>

              <div className="mt-5">

                <span className="text-xs font-bold uppercase tracking-widest text-[#9A7200]">
                  STEP 03
                </span>

                <h4 className="mt-2 text-xl font-black text-[#174A70]">
                  தேவையானால் மீண்டும்
                </h4>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  இன்னும் பசி இருந்தால் அல்லது
                  உணவு பிடித்திருந்தால்
                  மீண்டும் வாங்கலாம்.
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              FOOD WASTE MESSAGE
          ====================================================== */}

          <div className="mt-8 rounded-3xl border border-[#CFE4C8] bg-[#F2F9EE] p-6 sm:p-8">

            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">

              {/* Icon */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
                🌱
              </div>

              {/* Content */}
              <div className="flex-1">

                <h4 className="text-xl font-black text-[#26733A]">
                  உணவு வீணாகாமல் இருக்க
                </h4>

                <p className="mt-2 text-sm leading-7 text-gray-600 sm:text-base">
                  சிலர் தேவைக்கு அதிகமாக உணவு எடுத்துக்கொண்டு
                  வீணாக்குவதைத் தவிர்க்கவே முதல் பரிமாறுதல்
                  சிறிய அளவில் வழங்கப்படுகிறது.
                </p>

                <p className="mt-3 font-bold text-[#174A70]">
                  தேவையான அளவு மட்டும் எடுத்துக்கொள்வோம் ❤️
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              BOTTOM MESSAGE
          ====================================================== */}

          <div className="mt-8 rounded-3xl bg-[#174A70] px-6 py-8 text-center sm:px-10">

            <p className="text-sm font-bold text-white/70">
              உணவு தீரும் வரை
            </p>

            <h4 className="mt-2 text-3xl font-black text-[#F7C928] sm:text-4xl">
              தேவையான அளவு சாப்பிடலாம் ❤️
            </h4>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/75">
              பசி இருந்தால் மீண்டும் வாங்கிக்கொள்ளலாம்.
              அனைவருக்கும் போதுமான உணவு கிடைக்க வேண்டும் என்பதே
              எங்கள் சிறிய முயற்சி.
            </p>

          </div>

        </div>


        {/* =====================================================
            FINAL TAGLINE
        ====================================================== */}

        <div className="mt-10 text-center">

          <p className="text-sm font-medium text-white/60">
            ஒரு சிறிய முயற்சி • ஒரு பெரிய நோக்கம்
          </p>

          <p className="mt-2 text-xl font-black text-white sm:text-2xl">
            உணவு அனைவருக்கும் ❤️
          </p>

        </div>

      </div>

    </section>
  );
}