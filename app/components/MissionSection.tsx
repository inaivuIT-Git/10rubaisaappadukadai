export default function MissionSection() {
  return (
    <section
      id="about"
      className="overflow-hidden bg-[#6f0808] px-5 py-20 text-white sm:py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Main Content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Image */}
          <div className="relative">

            <div className="overflow-hidden rounded-[2rem] border-4 border-[#f7c928]/30 shadow-2xl">

              <img
                src="/images/about/mission.jpg"
                alt="10 ரூபாய் சாப்பாட்டுக்கடை"
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />

            </div>

            {/* Floating ₹10 badge */}
            <div className="absolute -bottom-6 -right-4 flex h-28 w-28 rotate-6 items-center justify-center rounded-full border-4 border-[#6f0808] bg-[#f7c928] shadow-xl sm:-right-7">

              <div className="text-center text-[#720909]">
                <div className="text-3xl font-black">
                  ₹10
                </div>

                <div className="text-[10px] font-bold leading-3">
                  எளிய<br />
                  விலையில்
                </div>
              </div>

            </div>

          </div>

          {/* Content */}
          <div>

            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#f7c928]">
              ❤️ ஏன் ₹10?
            </span>

            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              உணவு என்பது
              <br />
              <span className="text-[#f7c928]">
                அனைவருக்கும்.
              </span>
            </h2>

            <div className="mt-6 h-1 w-20 rounded-full bg-[#f7c928]" />

            <p className="mt-7 text-lg leading-8 text-white/85">
              குறைந்த செலவில் உணவு தேவைப்படுபவர்கள்
              நல்ல உணவை சாப்பிட வேண்டும் என்பதே
              எங்கள் நோக்கம்.
            </p>

            <p className="mt-5 text-base leading-7 text-white/65">
              எளிய விலையில் சுவையான உணவை வழங்குவதன்
              மூலம், யாரும் உணவின்றி இருக்கக் கூடாது
              என்ற எண்ணத்துடன் இந்த முயற்சி
              முன்னெடுக்கப்படுகிறது.
            </p>

            {/* Values */}
            <div className="mt-9 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">

              <ValueCard
                icon="₹"
                title="எளிய விலை"
                description="ஒவ்வொரு வகையும் ₹10"
              />

              <ValueCard
                icon="🍛"
                title="3–5 வகைகள்"
                description="தினமும் உணவு"
              />

              <ValueCard
                icon="❤️"
                title="அன்புடன்"
                description="அனைவருக்கும்"
              />

            </div>

          </div>

        </div>

        {/* Quote */}
        <div className="mx-auto mt-20 max-w-4xl text-center">

          <div className="text-5xl text-[#f7c928]">
            “
          </div>

          <blockquote className="mt-2 text-2xl font-bold leading-relaxed sm:text-3xl">
            பசியை குறைப்பது ஒரு சிறிய செயல் அல்ல.
            <br className="hidden sm:block" />
            அது ஒரு பெரிய மனிதநேயம்.
          </blockquote>

          <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-[#f7c928]" />

        </div>

      </div>
    </section>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7c928] text-lg font-black text-[#720909]">
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs text-white/60">
            {description}
          </p>
        </div>

      </div>

    </div>
  );
}