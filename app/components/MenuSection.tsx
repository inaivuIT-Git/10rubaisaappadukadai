"use client";

const todayMenu = [
  {
    name: "காளான் பிரியாணி",
    english: "Mushroom Biryani",
    image: "/images/menu/mushroom-biryani.jpg",
  },
  {
    name: "தக்காளி சாதம்",
    english: "Tomato Rice",
    image: "/images/menu/tomato-rice.jpg",
  },
  {
    name: "சாம்பார் சாதம்",
    english: "Sambar Rice",
    image: "/images/menu/sambar-rice.jpg",
  },
  {
    name: "புதினா சாதம்",
    english: "Mint Rice",
    image: "/images/menu/mint-rice.jpg",
  },
  {
    name: "எலுமிச்சை சாதம்",
    english: "Lemon Rice",
    image: "/images/menu/lemon-rice.jpg",
  },
];

export default function MenuSection() {
  return (
    <section
      id="menu"
      className="relative overflow-hidden bg-[#F7F5F0] py-16 sm:py-20"
    >
      {/* -------------------------------------------------- */}
      {/* Decorative Background */}
      {/* -------------------------------------------------- */}

      <div className="pointer-events-none absolute left-[-100px] top-24 h-72 w-72 rounded-full bg-[#EAF5E5] opacity-70 blur-3xl" />

      <div className="pointer-events-none absolute right-[-100px] top-40 h-80 w-80 rounded-full bg-[#EAF5E5] opacity-70 blur-3xl" />

      {/* Decorative leaves */}
      <div className="pointer-events-none absolute left-0 top-32 hidden text-[#8DBA72] opacity-30 lg:block">
        <svg
          width="150"
          height="180"
          viewBox="0 0 150 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 170C35 135 42 90 90 35"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M38 122C20 112 10 98 8 80C28 84 42 96 45 111"
            fill="currentColor"
          />
          <path
            d="M55 91C38 78 35 62 38 47C55 53 65 67 62 82"
            fill="currentColor"
          />
          <path
            d="M73 67C62 48 65 32 75 20C87 35 88 50 80 63"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="pointer-events-none absolute right-0 top-36 hidden rotate-12 text-[#8DBA72] opacity-30 lg:block">
        <svg
          width="150"
          height="180"
          viewBox="0 0 150 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M140 170C115 135 108 90 60 35"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M112 122C130 112 140 98 142 80C122 84 108 96 105 111"
            fill="currentColor"
          />
          <path
            d="M95 91C112 78 115 62 112 47C95 53 85 67 88 82"
            fill="currentColor"
          />
          <path
            d="M77 67C88 48 85 32 75 20C63 35 62 50 70 63"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* -------------------------------------------------- */}
      {/* Main Container */}
      {/* -------------------------------------------------- */}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        {/* ------------------------------------------------ */}
        {/* Heading */}
        {/* ------------------------------------------------ */}

        <div className="mx-auto max-w-4xl text-center">

          {/* Small label */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#CFE3C5] bg-white px-5 py-2 text-sm font-semibold text-[#2D7037] shadow-sm">
            <span>🌿</span>
            <span>இன்றைய சிறப்பு</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-black leading-tight text-[#173B5B] sm:text-5xl lg:text-6xl">
            தினமும்{" "}
            <span className="text-[#2D7037]">5</span>{" "}
            வகையான சாதம்
            <span className="ml-2">❤️</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-[#59645D] sm:text-lg">
            ஒவ்வொரு நாளும் 5 வகையான சுவையான சாதங்கள்
            <br className="hidden sm:block" />
            அன்புடன் தயாரிக்கப்படும்.
          </p>

          {/* ------------------------------------------------ */}
          {/* ₹10 Badge */}
          {/* ------------------------------------------------ */}

          <div className="mt-7 flex justify-center">
            <div className="flex items-center overflow-hidden rounded-2xl bg-[#145A8D] shadow-lg">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F7C928] text-3xl font-black text-[#173B5B] sm:h-24 sm:w-24 sm:text-4xl">
                ₹10
              </div>

              <div className="px-6 py-3 text-left text-white sm:px-8">
                <p className="text-lg font-black sm:text-xl">
                  மட்டுமே
                </p>

                <p className="text-sm font-medium text-white/90 sm:text-base">
                  சாப்பிடும் அளவு வரை
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Menu White Card */}
        {/* ------------------------------------------------ */}

        <div className="mt-12 rounded-[2rem] border border-[#E1E9DA] bg-white p-5 shadow-[0_15px_50px_rgba(45,112,55,0.08)] sm:p-8 lg:p-10">

          {/* Menu title */}
          <div className="mb-8 flex items-center justify-center">

            <div className="hidden h-px flex-1 bg-[#DCE8D6] sm:block" />

            <div className="mx-4 rounded-full bg-[#2D7037] px-8 py-3 text-center text-lg font-black text-white shadow-md sm:text-xl">
              இன்று என்ன உணவு?
            </div>

            <div className="hidden h-px flex-1 bg-[#DCE8D6] sm:block" />

          </div>

          {/* ------------------------------------------------ */}
          {/* Five Food Cards */}
          {/* ------------------------------------------------ */}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {todayMenu.map((item, index) => (
              <FoodCard
                key={item.name}
                number={index + 1}
                name={item.name}
                english={item.english}
                image={item.image}
              />
            ))}

          </div>

          {/* ------------------------------------------------ */}
          {/* Serving Information */}
          {/* ------------------------------------------------ */}

          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3 rounded-full border border-[#DCE8D6] bg-[#F3F8EF] px-5 py-3 text-center">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#2D7037] shadow-sm">
              ℹ
            </div>

            <p className="text-sm font-semibold leading-6 text-[#2D7037] sm:text-base">
              முதலில் சிறிய அளவு பரிமாறப்படும்.
              பிடித்திருந்தால் மீண்டும் வாங்கிக் கொள்ளலாம்.
            </p>

          </div>

          {/* ------------------------------------------------ */}
          {/* Benefits */}
          {/* ------------------------------------------------ */}

          <div className="mt-8 grid overflow-hidden rounded-3xl border border-[#DCE8D6] bg-[#F4F8EF] sm:grid-cols-2 lg:grid-cols-4">

            <Benefit
              icon="🍚"
              title="சுவையானது"
              description="சத்தான பொருட்களால் சுவையாக சமைக்கப்படும்."
            />

            <Benefit
              icon="💚"
              title="அனைவருக்கும்"
              description="பணக்காரர், ஏழை என்று வேறுபாடின்றி அனைவருக்கும்."
            />

            <Benefit
              icon="🌿"
              title="சத்தானது"
              description="ஆரோக்கியமான, சத்தான உணவுகள் மட்டுமே."
            />

            <Benefit
              icon="₹10"
              title="எளிய விலை"
              description="ஒவ்வொரு வகையும் வெறும் ₹10 மட்டுமே."
              price
            />

          </div>

        </div>

      </div>
    </section>
  );
}


/* ====================================================== */
/* Food Card */
/* ====================================================== */

function FoodCard({
  number,
  name,
  english,
  image,
}: {
  number: number;
  name: string;
  english: string;
  image: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E1E8D9] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Number */}
      <div className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#2D7037] text-sm font-black text-white shadow-md">
        {number}
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#EAF5E5]">

        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

      </div>

      {/* Content */}
      <div className="px-3 pb-4 pt-4 text-center">

        <h3 className="text-base font-black text-[#2D7037] sm:text-lg">
          {name}
        </h3>

        <p className="mt-1 text-sm font-medium text-[#555E58]">
          {english}
        </p>

        {/* Decorative line */}
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">

          <span className="h-px w-8 bg-[#DCE8D6]" />

          <span className="text-xs text-[#6EA35A]">
            🌿
          </span>

          <span className="h-px w-8 bg-[#DCE8D6]" />

        </div>

      </div>
    </div>
  );
}


/* ====================================================== */
/* Benefit */
/* ====================================================== */

function Benefit({
  icon,
  title,
  description,
  price = false,
}: {
  icon: string;
  title: string;
  description: string;
  price?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-[#DCE8D6] px-5 py-6 last:border-b-0 sm:px-6 lg:border-b-0 lg:border-r lg:last:border-r-0">

      {/* Icon */}
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${
          price
            ? "bg-[#F7C928] text-2xl font-black text-[#173B5B]"
            : "bg-[#E5F2D9] text-3xl"
        }`}
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <h4 className="font-black text-[#2D7037]">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-[#59645D]">
          {description}
        </p>
      </div>

    </div>
  );
}