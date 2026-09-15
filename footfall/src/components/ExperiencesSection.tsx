import Image from "next/image";
import Link from "next/link";
import { IconArrowCircle } from "@/components/Icons";
import { featuredExperiences } from "@/lib/content";

export function ExperiencesSection() {
  return (
    <section className="bg-ff-green-deep py-10 sm:py-12 lg:py-14">
      <div
        className="mx-auto mb-8 h-px max-w-[1440px] bg-gradient-to-r from-transparent via-ff-gold/55 to-transparent sm:mb-10"
        aria-hidden
      />

      <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 sm:gap-10 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:gap-10 lg:px-12 xl:gap-12">
        <div className="max-w-md lg:max-w-none">
          <p className="font-[family-name:var(--font-montserrat)] text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-ff-gold sm:text-[0.7rem]">
            Our Experiences
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-montserrat)] text-[1.45rem] font-medium uppercase leading-[1.15] tracking-[0.1em] text-white sm:mt-3.5 sm:text-[1.85rem] md:text-[2.15rem] lg:text-[2.35rem]">
            Don&apos;t Wait for the Crowd. Create It.
          </h2>
          <div className="mt-3.5 h-px w-12 bg-ff-gold sm:mt-4" aria-hidden />
          <p className="mt-4 max-w-md text-[0.9rem] font-normal leading-relaxed text-white sm:mt-5 sm:text-[0.95rem]">
            Products live inside experience categories, not as an unstructured
            rental list. The idea is the product. The equipment enables the
            idea. The audience experience proves the value.
          </p>
          <Link href="/experiences" className="btn-gold mt-6 sm:mt-7">
            Explore Experiences
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:gap-4">
          {featuredExperiences.map((experience) => (
            <Link
              key={experience.title}
              href={experience.href}
              className="experience-card group flex max-w-[17rem] flex-col overflow-hidden rounded-sm border border-ff-gold/50 bg-transparent mx-auto w-full sm:max-w-none"
            >
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 70vw, 18vw"
                />
              </div>
              <div className="relative flex flex-1 flex-col gap-1.5 px-3 pb-3.5 pt-3 sm:px-3.5 sm:pb-4 sm:pt-3.5">
                <h3 className="pr-8 font-[family-name:var(--font-montserrat)] text-[0.68rem] font-semibold uppercase leading-snug tracking-[0.14em] text-ff-gold sm:text-[0.72rem]">
                  {experience.title}
                </h3>
                <p className="line-clamp-3 pr-7 text-[0.72rem] font-normal leading-relaxed text-white/90 sm:text-[0.78rem]">
                  {experience.description}
                </p>
                <IconArrowCircle className="absolute bottom-3 right-2.5 h-6 w-6 shrink-0 text-ff-gold transition-transform group-hover:translate-x-0.5 sm:bottom-3.5 sm:right-3 sm:h-7 sm:w-7" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div
        className="mx-auto mt-8 h-px max-w-[1440px] bg-gradient-to-r from-transparent via-ff-gold/55 to-transparent sm:mt-10"
        aria-hidden
      />
    </section>
  );
}
