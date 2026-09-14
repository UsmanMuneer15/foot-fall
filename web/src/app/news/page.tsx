import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  description: "FOOTFALL STORIES — editorial updates from activations and ideas.",
};

const stories = [
  {
    title: "4,700+ Visitors: FOOTFALL GLOBAL Makes Its Abu Dhabi Debut at ADIHEX 2026",
    href: "/case-studies/adihex-2026",
    tag: "Case Study",
  },
  {
    title: "The Giant Claw: How Scale Turned an Activation into an Attraction",
    href: "/experiences#giant-claw",
    tag: "Experiences",
  },
  {
    title: "The Gift Tree: Turning Brand Placement into Discovery",
    href: "/experiences#gift-tree",
    tag: "Experiences",
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News"
        title="FOOTFALL STORIES"
        description="Future activations continuously feed this section so the website builds a visible record of proven work."
        image="/images/exp-led.png"
        imageAlt="FOOTFALL walking LED media activation"
      />

      <section className="bg-ff-green-deep py-16 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
          {stories.map((story) => (
            <Link
              key={story.title}
              href={story.href}
              className="block border border-ff-gold/25 bg-ff-green/40 p-6 transition-colors hover:border-ff-gold/50 sm:p-8"
            >
              <p className="section-label">{story.tag}</p>
              <h2 className="mt-3 max-w-4xl font-display text-2xl text-ff-gold sm:text-3xl">
                {story.title}
              </h2>
              <span className="mt-5 inline-block text-xs uppercase tracking-[0.2em] text-ff-gold">
                Read →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
