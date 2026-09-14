import Image from "next/image";
import Link from "next/link";
import { IconArrowCircle } from "@/components/Icons";
import { featuredExperiences } from "@/lib/content";

export function ExperiencesSection() {
  return (
    <section className="bg-ff-green-deep py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12 lg:px-12">
        <div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-[0.06em] text-ff-gold sm:text-4xl">
            Don&apos;t Wait for the Crowd. Create It.
          </h2>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-white/80">
            Products live inside experience categories, not as an unstructured
            rental list. The idea is the product. The equipment enables the
            idea. The audience experience proves the value.
          </p>
          <Link href="/experiences" className="btn-gold mt-8">
            Explore Experiences
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {featuredExperiences.map((experience) => (
            <Link
              key={experience.title}
              href={experience.href}
              className="experience-card group flex flex-col overflow-hidden rounded-xl border border-ff-gold/35 bg-ff-green/40"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ff-green-deep via-ff-green-deep/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-ff-gold">
                    {experience.title}
                  </h3>
                  <IconArrowCircle className="h-8 w-8 shrink-0 text-ff-gold transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-sm font-light leading-relaxed text-white/75">
                  {experience.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
