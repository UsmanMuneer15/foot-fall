import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  description:
    "FOOTFALL experience categories — activations, digital media, technology, crowd systems and event environments.",
};

const categories = [
  {
    id: "experiential",
    title: "Experiential Activations",
    items:
      "Giant Claw Machine, gift activations, custom interactive concepts, custom mascots and custom plush toys.",
  },
  {
    id: "digital",
    title: "Digital Experiences",
    items:
      "Walking LED billboard bags, indoor LED walls, 43-inch touchscreen displays, custom LED content and digital brand experiences.",
  },
  {
    id: "technology",
    title: "Event Technology",
    items:
      "PTZ cameras, standard controllers, video controllers, tablets, custom crowd-control software, QR registration and visitor-registration systems.",
  },
  {
    id: "crowd",
    title: "Crowd & Visitor Management",
    items:
      "Queueing systems, barricades, wristbands, visitor-flow systems and registration management.",
  },
  {
    id: "environments",
    title: "Event Environments",
    items:
      "Exhibition lighting with dimmers, cocktail tables, high leather chairs, single-seater chairs, Elite Tables and supporting event infrastructure.",
  },
  {
    id: "consultation",
    title: "Consultation & Concept Development",
    items:
      "Activation strategy, creative consultation, visitor-engagement planning, concept development, brand-experience strategy and custom event solutions.",
  },
];

const featured = [
  {
    id: "giant-claw",
    headline: "THE GIANT CLAW",
    subheading: "A familiar game transformed into an event landmark.",
    body: "At approximately 4m × 4m, the FOOTFALL Giant Claw is designed to become a visual destination inside an exhibition, festival, mall or public event. Its scale creates curiosity. Participation creates entertainment. Queues create further curiosity. The audience itself begins attracting another audience.",
    customisation:
      "Possible customisation includes branding, LED displays, custom content, lighting, plush toys, campaign prizes, QR registration, visitor data capture and queue management.",
    note: "DON'T WAIT FOR THE CROWD. CREATE IT.",
    image: "/images/exp-claw.png",
  },
  {
    id: "gift-tree",
    headline: "DISCOVERY CREATES ENGAGEMENT.",
    subheading: "The Gift Tree",
    body: "The Gift Tree turns a branded display into a physical discovery experience. Branded cards or objects become part of the interaction, with surprises revealed through participation.",
    customisation:
      "The principle is simple: when the audience interacts with the branding, the branding becomes part of the memory.",
    note: null,
    image: "/images/exp-touch.png",
  },
  {
    id: "walking-led",
    headline: "TAKE THE MESSAGE TO THE CROWD.",
    subheading: "Walking LED Media",
    body: "Walking LED billboard bags allow digital content to move through exhibitions, malls and event environments instead of waiting for the audience to pass a static display. This product should be presented as mobile audience attraction and directional media rather than simply a screen mounted on a backpack.",
    customisation: null,
    note: null,
    image: "/images/exp-led.png",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        eyebrow="Experiences"
        title="EXPERIENCES"
        description="Products live inside experience categories, not as an unstructured rental list. The idea is the product. The equipment enables the idea."
        image="/images/exp-claw.png"
        imageAlt="FOOTFALL Giant Claw experiential activation"
      />

      <section className="bg-ff-green-deep py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {categories.map((category) => (
            <article
              key={category.id}
              id={category.id}
              className="border border-ff-gold/25 bg-ff-green/50 p-6"
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ff-gold">
                {category.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white">
                {category.items}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-ff-gold/15 bg-ff-green py-16 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
          {featured.map((item, index) => (
            <article
              key={item.id}
              id={item.id}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
                index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="relative min-h-[280px] overflow-hidden border border-ff-gold/25 sm:min-h-[360px]">
                <Image
                  src={item.image}
                  alt={item.headline}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <p className="section-label">{item.subheading}</p>
                <h2 className="mt-3 ff-heading ff-heading-md sm:text-4xl">
                  {item.headline}
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-white">
                  {item.body}
                </p>
                {item.customisation ? (
                  <p className="mt-4 text-sm leading-relaxed text-white">
                    {item.customisation}
                  </p>
                ) : null}
                {item.note ? (
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-ff-gold">
                    {item.note}
                  </p>
                ) : null}
                <Link href="/contact" className="btn-outline-gold mt-7">
                  Create an Activation
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
