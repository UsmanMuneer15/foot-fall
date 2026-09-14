import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  description:
    "The vision behind FOOTFALL GLOBAL LLC — experiences that make people want to come to a place.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About FOOTFALL"
        title={["THE VISION", "BEHIND FOOTFALL"]}
        description="FOOTFALL GLOBAL is built around a simple belief: people remember experiences longer than they remember advertisements."
        image="/images/hero-right-bright.png"
        imageAlt="FOOTFALL activation — the vision behind memorable experiences"
      />

      <section className="bg-ff-green-deep py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="ff-heading ff-heading-md sm:text-4xl">
              Amal El Houm
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-ff-gold/90">
              Proprietor, FOOTFALL GLOBAL LLC
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white sm:text-[0.95rem]">
              FOOTFALL GLOBAL is built around a simple belief: people remember
              experiences longer than they remember advertisements.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white sm:text-[0.95rem]">
              Amal El Houm&apos;s vision is to create a different approach to
              audience engagement — one where brands move beyond direct selling
              and instead create experiences people genuinely want to approach,
              participate in and share.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white sm:text-[0.95rem]">
              Through creativity, technology and physical activations, FOOTFALL
              GLOBAL aims to transform ordinary event spaces into destinations
              and passing audiences into engaged communities.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white sm:text-[0.95rem]">
              The objective is not simply to put a brand in front of people. It
              is to give people a reason to come to the brand.
            </p>
          </div>

          <div className="border border-ff-gold/30 bg-ff-green p-8 sm:p-10">
            <p className="section-label">Positioning</p>
            <h3 className="mt-4 ff-heading text-2xl sm:text-3xl">
              Experience instead of direct selling.
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-white">
              FOOTFALL GLOBAL exists to create a reason for people to approach a
              particular place, brand, stand, venue or event zone. The company
              develops experiences that attract attention, encourage
              participation and create a memorable connection between the
              audience and the brand.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white">
              The positioning is not: an event-equipment rental company that
              also creates activations. The positioning is: an experiential
              engagement company that controls the concepts, technology,
              equipment and infrastructure required to deliver those
              experiences.
            </p>
            <Link href="/contact" className="btn-gold mt-8">
              Create an Activation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
