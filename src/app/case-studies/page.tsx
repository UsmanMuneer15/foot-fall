import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  description:
    "Structured FOOTFALL case studies — verified results from experiential activations.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="REAL PEOPLE. REAL RESULTS."
        description="Every major activation becomes a structured FOOTFALL case study: Event, Client / Partner, Challenge, FOOTFALL Concept, Activation, Visitor Experience, Measured Results, Gallery / Video and Outcome."
        image="/images/proof-dog.png"
        imageAlt="FOOTFALL ADIHEX activation for a greater cause"
      />

      <section className="bg-ff-green-deep py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/case-studies/adihex-2026"
            className="group grid overflow-hidden border border-ff-gold/30 lg:grid-cols-2"
          >
            <div className="relative min-h-[280px] sm:min-h-[360px]">
              <Image
                src="/images/proof-dog.png"
                alt="ADIHEX 2026 FOOTFALL activation"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center bg-ff-green p-8 sm:p-10">
              <p className="section-label">Abu Dhabi · ADIHEX 2026</p>
              <h2 className="mt-3 ff-heading ff-heading-md sm:text-4xl">
                4,700+ Registered Visitors
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white">
                FOOTFALL GLOBAL&apos;s first major Abu Dhabi activation at ADIHEX
                2026 — an approximately 4m × 4m Giant Claw creating a visible
                attraction, generating queues and encouraging participation with
                4,700+ registered visitors.
              </p>
              <span className="mt-8 text-xs uppercase tracking-[0.2em] text-ff-gold">
                View Case Study
              </span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
