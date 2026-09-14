"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  IconCause,
  IconEngage,
  IconQueue,
  IconShare,
} from "@/components/Icons";
import { proofPoints } from "@/lib/content";

const proofIcons = [IconQueue, IconShare, IconEngage, IconCause];

function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, target]);

  return value;
}

export function ProofSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(4700, visible);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden pb-6 pt-10 sm:pb-8 sm:pt-14 lg:pb-10 lg:pt-16">
      <div className="relative mx-auto grid max-w-[1440px] gap-8 px-4 sm:gap-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr_1fr] lg:items-center lg:gap-6 lg:px-12 xl:gap-8">
        <div className="text-center sm:text-left">
          <h2 className="ff-heading text-[1.55rem] tracking-[0.1em] sm:text-[1.85rem] md:text-[2.15rem] lg:text-[2.35rem]">
            <span className="block">Real People.</span>
            <span className="block">Real Results.</span>
          </h2>
          <div className="mx-auto mt-3.5 h-px w-12 bg-ff-gold sm:mx-0 sm:mt-4 sm:w-14" aria-hidden />
          <p className="mx-auto mt-5 max-w-md text-[0.9rem] font-normal leading-[1.7] text-white sm:mx-0 sm:mt-5 sm:text-[0.95rem]">
            FOOTFALL GLOBAL&apos;s first major Abu Dhabi activation at ADIHEX
            2026 demonstrated the model in practice. An approximately 4m × 4m
            Giant Claw activation created a visible attraction, generated queues
            and encouraged visitors to participate while supporting the wider
            objective of increasing awareness around dogs and cats requiring
            adoption, care and responsible rehoming.
          </p>
          <Link
            href="/case-studies/adihex-2026"
            className="btn-outline-gold mt-6 inline-flex sm:mt-7"
          >
            View Case Study
          </Link>
        </div>

        <div className="text-center">
          <p className="font-[family-name:var(--font-montserrat)] text-[3.75rem] font-semibold leading-none tracking-tight text-ff-gold sm:text-[5.25rem] lg:text-[5.75rem]">
            {count.toLocaleString()}+
          </p>
          <p className="mt-2.5 font-[family-name:var(--font-montserrat)] text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-ff-gold sm:mt-3 sm:text-[0.7rem]">
            Registered Visitors
          </p>
          <div className="mx-auto mt-7 flex max-w-md items-stretch justify-center sm:mt-8">
            {proofPoints.map((point, index) => {
              const Icon = proofIcons[index];
              return (
                <div
                  key={point}
                  className={[
                    "relative flex flex-1 flex-col items-center gap-2 px-1.5 sm:gap-2.5 sm:px-2",
                    index < proofPoints.length - 1
                      ? "after:absolute after:right-0 after:top-1 after:bottom-1 after:w-px after:bg-ff-gold/40"
                      : "",
                  ].join(" ")}
                >
                  <Icon className="h-7 w-7 text-ff-gold sm:h-8 sm:w-8" />
                  <p className="max-w-[5.75rem] text-center font-[family-name:var(--font-montserrat)] text-[0.48rem] font-medium uppercase leading-snug tracking-[0.12em] text-ff-gold sm:text-[0.52rem] sm:tracking-[0.14em]">
                    {point}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative min-h-[260px] overflow-hidden sm:min-h-[400px] lg:min-h-[440px]">
          <Image
            src="/images/proof-dog.png"
            alt="Experiences for a better tomorrow"
            fill
            className="object-cover object-[center_20%]"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ff-green-deep/70 via-transparent to-transparent" />
          <p className="absolute bottom-7 right-4 max-w-[11.5rem] rotate-[-8deg] font-[family-name:var(--font-great-vibes)] text-[1.65rem] leading-tight text-ff-gold sm:bottom-9 sm:right-5 sm:max-w-[13rem] sm:text-[2rem]">
            Experiences For A Better Tomorrow
          </p>
        </div>
      </div>
    </section>
  );
}
