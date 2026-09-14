import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  description:
    "FOOTFALL you can measure — registration, visitor management and engagement technology built into the experience.",
};

const journey = [
  "Visitor",
  "QR / Tablet / Touchscreen",
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
        title="FOOTFALL YOU CAN MEASURE."
        description="A successful activation should produce more than photographs. FOOTFALL can integrate registration and visitor-management technology into the experience where appropriate."
        image="/images/exp-touch.png"
        imageAlt="FOOTFALL interactive touchscreen technology"
      />

      <section className="bg-ff-green-deep py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="ff-heading ff-heading-md sm:text-4xl">
            From visitor to lasting connection
          </h2>
          <div className="mt-10 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
            {journey.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className="border border-ff-gold/40 px-4 py-3 text-xs uppercase tracking-[0.16em] text-ff-gold">
                  {step}
                </div>
                {index < journey.length - 1 ? (
                  <span className="hidden text-ff-gold/50 md:inline" aria-hidden>
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
