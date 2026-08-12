const menuItems = [
  {
    name: "காளான் பிரியாணி",
    image: "/images/menu/mushroom-biryani.jpg",
  },
  {
    name: "வெஜிடபுள் பிரியாணி",
    image: "/images/menu/vegetable-biryani.jpg",
  },
  {
    name: "தக்காளி சாதம்",
    image: "/images/menu/tomato-rice.jpg",
  },
  {
    name: "தட்டைப் பயிறு குழம்பு சாதம்",
    image: "/images/menu/thattaipayiru-kulambu-rice.jpg",
  },
  {
    name: "கருப்பு பீன்ஸ் குழம்பு சாதம்",
    image: "/images/menu/black-beans-kulambu-rice.jpg",
  },
  {
    name: "சாம்பார் சாதம்",
    image: "/images/menu/sambar-rice.jpg",
  },
  {
    name: "பீட்ரூட் சாதம்",
    image: "/images/menu/beetroot-rice.jpg",
  },
  {
    name: "கேரட் சாதம்",
    image: "/images/menu/carrot-rice.jpg",
  },
  {
    name: "முட்டைக்கோஸ் சாதம்",
    image: "/images/menu/cabbage-rice.jpg",
  },
  {
    name: "புதினா சாதம்",
    image: "/images/menu/mint-rice.jpg",
  },
];


export default function HeroMenuSection() {
  return (
    <section
      id="menu"
      className="relative overflow-hidden bg-[#F7F5F0]"
    >

      {/* =====================================================
          SOFT BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#EAF4FB] blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-[45%] h-96 w-96 rounded-full bg-[#EAF4FB] blur-3xl" />


      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">


        {/* =====================================================
            HERO INTRO
        ====================================================== */}

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">


          {/* LEFT CONTENT */}

          <div className="text-center lg:text-left">

            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF4FB] px-5 py-2.5 text-sm font-bold text-[#155A91]">
              🌿 சுவையான உணவு • அனைவருக்கும்
            </span>


            <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">

              <span className="text-[#155A91]">
                ₹10-க்கு
              </span>

              <br />

              <span className="text-[#17324D]">
                வயிறு நிறைய
              </span>

              <br />

              <span className="text-[#155A91]">
                உணவு
              </span>

              <span className="ml-2">
                ❤️
              </span>

            </h1>


            <p className="mx-auto mt-7 max-w-xl text-lg font-semibold leading-8 text-[#4B5B68] sm:text-xl lg:mx-0">

              ஒவ்வொரு நாளும் 3–5 வகையான
              <br />

              சுவையான உணவுகள்.

              <br />

              <span className="font-black text-[#155A91]">
                ஒவ்வொரு வகையும் வெறும் ₹10
              </span>

            </p>


            {/* PRICE */}

            <div className="mt-8 flex items-center justify-center gap-4 lg:justify-start">

              <div className="flex h-20 w-20 rotate-[-3deg] items-center justify-center rounded-2xl bg-[#155A91] shadow-lg">

                <span className="text-4xl font-black text-[#F7C928]">
                  ₹10
                </span>

              </div>


              <div className="text-left">

                <p className="font-black text-[#17324D]">
                  அனைவருக்கும்
                </p>

                <p className="text-sm font-semibold text-[#6B7280]">
                  எளிய விலையில் நல்ல உணவு
                </p>

              </div>

            </div>


            {/* CTA */}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">

              <a
                href="#menu-list"
                className="rounded-full bg-[#155A91] px-8 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#124C7A] hover:shadow-lg"
              >
                🍛 உணவு வகைகளைப் பார்க்க
              </a>


              <a
                href="#location"
                className="rounded-full border-2 border-[#155A91] bg-white px-8 py-3.5 font-bold text-[#155A91] transition hover:-translate-y-0.5 hover:bg-[#155A91] hover:text-white"
              >
                📍 எங்களை சந்திக்க
              </a>

            </div>

          </div>


          {/* RIGHT HERO IMAGE */}

          <div className="relative mx-auto w-full max-w-xl">

            <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-white bg-white shadow-2xl">

              <img
                src="/images/hero/hero-food.jpg"
                alt="10 ரூபாய் சாப்பாட்டுக்கடையின் சுவையான உணவு"
                className="h-[380px] w-full object-cover sm:h-[500px]"
              />


              {/* Image information */}

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-[#155A91]/95 p-5 text-white backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7C928] text-xl">
                    ❤️
                  </div>

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


            {/* Floating ₹10 */}

            <div className="absolute -bottom-7 -left-3 flex h-28 w-28 rotate-[-8deg] items-center justify-center rounded-full border-8 border-[#F7F5F0] bg-[#F7C928] shadow-xl sm:-left-7 sm:h-32 sm:w-32">

              <div className="text-center">

                <div className="text-4xl font-black leading-none text-[#155A91] sm:text-5xl">
                  ₹10
                </div>

                <div className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#17324D]">
                  மட்டும்
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            MENU SECTION
        ====================================================== */}

        <div
          id="menu-list"
          className="mt-24 border-t border-[#D9E7F0] pt-16 sm:mt-28 sm:pt-20"
        >

          {/* Menu Heading */}

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex rounded-full bg-[#EAF4FB] px-5 py-2 text-sm font-bold text-[#155A91]">
              🍚 எங்கள் உணவு
            </span>


            <h2 className="mt-5 text-4xl font-black leading-tight text-[#17324D] sm:text-5xl">

              சுவையான உணவு
              <br />

              <span className="text-[#155A91]">
                ஒரே விலையில் ₹10
              </span>

            </h2>


            <p className="mt-5 text-base leading-7 text-[#5B6670] sm:text-lg">
              தினமும் கிடைக்கும் உணவு வகைகளில்
              உங்களுக்கு பிடித்ததை தேர்வு செய்து சாப்பிடுங்கள்.
            </p>

          </div>


          {/* =================================================
              MENU CARDS
          ================================================== */}

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {menuItems.map((item, index) => (
              <MenuCard
                key={`${item.name}-${index}`}
                name={item.name}
                image={item.image}
              />
            ))}

          </div>


          {/* Bottom message */}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#D9E7F0] bg-white px-6 py-7 text-center shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4FB] text-xl">
              ❤️
            </div>

            <p className="mt-3 font-black text-[#155A91]">
              தேவையான அளவு சாப்பிடலாம்
            </p>

            <p className="mt-2 text-sm leading-6 text-[#5B6670]">
              முதல் முறையாக சிறிய அளவில் பரிமாறப்படும்.
              உணவு பிடித்திருந்தால் தேவையான அளவு மீண்டும் வாங்கிக்கொள்ளலாம்.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   MENU CARD
========================================================= */

function MenuCard({
  name,
  image,
}: {
  name: string;
  image: string;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#E3E8EC] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}

      <div className="relative overflow-hidden">

        <img
          src={image}
          alt={name}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />


        {/* ₹10 badge */}

        <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7C928] shadow-md">

          <span className="text-sm font-black text-[#155A91]">
            ₹10
          </span>

        </div>

      </div>


      {/* Content */}

      <div className="p-5">

        <h3 className="min-h-[3rem] text-lg font-black leading-6 text-[#17324D]">
          {name}
        </h3>


        <div className="mt-4 flex items-center justify-between">

          <span className="text-sm font-semibold text-[#6B7280]">
            ஒரு வகை
          </span>


          <span className="font-black text-[#155A91]">
            ₹10
          </span>

        </div>

      </div>

    </article>
  );
}