import { ExperiencesSection } from "@/components/ExperiencesSection";
import { Hero } from "@/components/Hero";
import { ProcessSection } from "@/components/ProcessSection";
import { ProofSection } from "@/components/ProofSection";
import { ServicesBar } from "@/components/ServicesBar";

/** Homepage — redeploy trigger. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesBar />
      <div className="relative overflow-hidden bg-ff-green-deep">
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/world-map-bg.svg')] bg-cover bg-center bg-no-repeat opacity-60"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ff-green-deep/50 via-transparent to-ff-green-deep/75"
          aria-hidden
        />
        <div className="relative">
          <ProofSection />
          <ProcessSection />
        </div>
      </div>
      <ExperiencesSection />
    </>
  );
}
