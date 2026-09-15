import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  description:
    "FOOTFALL you can measure — registration, visitor management and engagement technology built into the experience.",
};

const journey = [
  "Visitor",
  "QR / Touchscreen",
  "Registration",
  "Participation",
  "Audience Data",
  "Post-Event Connection",
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology & Data"
        title={["FOOTFALL", "YOU CAN MEASURE."]}
        description="A successful activation should produce more than photographs. FOOTFALL can integrate registration and visitor-management technology into the experience where appropriate."
        image="/images/exp-touch.png"
        imageAlt="FOOTFALL interactive touchscreen technology"
      />

      <section className="bg-ff-green-deep py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="ff-heading ff-heading-md sm:text-4xl">
            From visitor to lasting connection
          </h2>
          <div className="mt-10 flex flex-col gap-3 lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between lg:gap-1.5 xl:gap-2">
            {journey.map((step, index) => (
              <div
                key={step}
                className="flex min-w-0 items-center gap-1.5 lg:flex-1 xl:gap-2"
              >
                <div className="w-full border border-ff-gold/40 px-3 py-2.5 text-center text-[0.58rem] uppercase leading-snug tracking-[0.12em] text-ff-gold sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.16em] lg:px-2 lg:py-2.5 lg:text-[0.55rem] lg:tracking-[0.1em] xl:px-3 xl:text-[0.62rem] xl:tracking-[0.14em]">
                  {step}
                </div>
                {index < journey.length - 1 ? (
                  <span
                    className="hidden shrink-0 text-ff-gold/50 lg:inline"
                    aria-hidden
                  >
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Registration Systems",
                copy: "QR, tablet and touchscreen registration woven into the activation flow.",
              },
              {
                title: "Crowd Control Software",
                copy: "Custom visitor-flow tools, controllers and systems that keep engagement orderly.",
              },
              {
                title: "Verified Metrics Only",
                copy: "Only publish data-capture and analytics capabilities the deployed system actually supports.",
              },
            ].map((card) => (
              <article
                key={card.title}
                className="border border-ff-gold/25 bg-ff-green/40 p-6"
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-ff-gold">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white">
                  {card.copy}
                </p>
              </article>
            ))}
          </div>

          <Link href="/contact" className="btn-gold mt-12">
            Create an Activation
          </Link>
        </div>
      </section>
    </>
  );
}
