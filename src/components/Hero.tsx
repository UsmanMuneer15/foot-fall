import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ff-green-deep">
      <Image
        src="/images/hero-bg-claw.png"
        alt="FOOTFALL Giant Claw activation at a crowded exhibition"
        fill
        priority
        className="object-cover object-[68%_center] sm:object-[72%_center]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ff-green-deep/70 via-ff-green-deep/60 to-ff-green-deep/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-ff-green-deep via-transparent to-ff-green-deep/35" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-4 pb-12 pt-24 sm:px-8 sm:pb-20 sm:pt-28 lg:justify-center lg:px-12 lg:pb-24 xl:px-16">
        <div className="fade-up max-w-3xl">
          <h1 className="font-display text-[1.85rem] font-semibold uppercase leading-[1.02] tracking-[0.05em] text-ff-gold sm:text-5xl sm:leading-[0.95] sm:tracking-[0.06em] md:text-6xl lg:text-[4.5rem] xl:text-[5rem]">
            <span className="block">Turning</span>
            <span className="block">Spaces Into</span>
            <span className="block">Destinations.</span>
          </h1>
          <p className="mt-4 max-w-lg text-[0.95rem] font-normal leading-relaxed text-white sm:mt-6 sm:text-base">
            We create experiences that attract people, inspire participation and
            turn ordinary spaces into places people want to be.
          </p>
          <div className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href="/experiences"
              className="btn-gold w-full justify-center sm:w-auto"
            >
              Explore Experiences
            </Link>
            <Link
              href="/contact"
              className="btn-outline-gold w-full justify-center sm:w-auto"
            >
              Create an Activation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
