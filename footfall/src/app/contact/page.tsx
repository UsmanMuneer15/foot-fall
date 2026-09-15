import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  description:
    "Where do you need the crowd? Tell FOOTFALL GLOBAL about your brand, event, venue or destination.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={["WHERE DO YOU", "NEED THE CROWD?"]}
        description="Tell us about your brand, event, venue or destination. FOOTFALL GLOBAL will develop an experience designed to bring people to it."
        image="/images/hero-event.jpg"
        imageAlt="Crowd at a FOOTFALL event destination"
      />

      <section className="bg-ff-green-deep py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
