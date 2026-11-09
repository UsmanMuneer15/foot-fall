import type { Metadata } from "next";
import Image from "next/image";
import { CreateActivationButton } from "@/components/CreateActivationButton";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  description:
    "FOOTFALL GLOBAL's first major Abu Dhabi activation at ADIHEX 2026 — 4,700+ registered visitors.",
};

const sections = [
  {
    title: "Event",
    body: "ADIHEX 2026, Abu Dhabi — FOOTFALL GLOBAL's first major activation in the city.",
  },
  {
    title: "Client / Partner",
    body: "An activation supporting the wider objective of increasing awareness around dogs and cats requiring adoption, care and responsible rehoming.",
  },
  {
    title: "Challenge",
    body: "Create a visible reason for visitors to approach, participate and engage — while supporting awareness around dogs and cats requiring adoption, care and responsible rehoming.",
  },
  {
    title: "FOOTFALL Concept",
    body: "An approximately 4m × 4m Giant Claw activation designed as a visual destination. Scale creates curiosity. Participation creates entertainment. Queues create further curiosity.",
  },
  {
    title: "Activation",
    body: "Giant Claw experiential activation with branding opportunity, LED presence and visitor participation woven into the wider exhibition environment.",
  },
  {
    title: "Visitor Experience",
    body: "People approached because of the landmark scale, waited in queues, played, shared and became part of the attraction for others.",
  },
  {
    title: "Measured Results",
    body: "4,700+ registered visitors. Supporting proof points: visitor queues, social sharing, brand engagement and measurable registration.",
  },
  {
    title: "Gallery / Video",
    body: "Actual photography and video from ADIHEX 2026 documenting the activation, audience participation and the Giant Claw as a visual destination.",
  },
  {
    title: "Outcome",
    body: "The activation demonstrated the FOOTFALL model in practice — experience instead of direct selling, with verified audience engagement.",
  },
];

export default function AdihexCaseStudyPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Study · ADIHEX 2026"
        title="4,700+ REGISTERED VISITORS"
        description="FOOTFALL GLOBAL's first major Abu Dhabi activation at ADIHEX 2026 demonstrated the model in practice."
        image="/images/hero-bg-claw.png"
        imageAlt="FOOTFALL Giant Claw at ADIHEX 2026"
      />

      <section className="bg-ff-green-deep py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="space-y-8">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-ff-gold">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white">
                  {section.body}
                </p>
              </article>
            ))}
            <CreateActivationButton className="btn-gold" />
          </div>

          <div className="relative min-h-[420px] overflow-hidden border border-ff-gold/25">
            <Image
              src="/images/proof-dog.png"
              alt="Experiences for a better tomorrow"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ff-green-deep/80 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-5 right-5 font-[family-name:var(--font-great-vibes)] text-3xl text-ff-gold sm:text-4xl">
              Experiences For A Better Tomorrow
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
