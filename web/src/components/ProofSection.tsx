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
    <section ref={ref} className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
      <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 sm:gap-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr_1fr] lg:items-center lg:gap-8 lg:px-12 xl:gap-10">
        <div className="text-center sm:text-left">
          <h2 className="font-display text-[1.65rem] font-bold uppercase leading-[1.05] tracking-[0.06em] text-ff-gold sm:text-3xl md:text-4xl">
            <span className="block">Real People.</span>
            <span className="block">Real Results.</span>
          </h2>
          <div className="mx-auto mt-4 h-px w-14 bg-ff-gold/80 sm:mx-0" aria-hidden />
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-white/90 sm:mt-6 sm:text-[0.95rem] mx-auto sm:mx-0">
            FOOTFALL GLOBAL&apos;s first major Abu Dhabi activation at ADIHEX
            2026 demonstrated the model in practice. An approximately 4m × 4m
            Giant Claw activation created a visible attraction, generated queues
            and encouraged visitors to participate while supporting the wider
            objective of increasing awareness around dogs and cats requiring
            adoption, care and responsible rehoming.
          </p>
          <Link
            href="/case-studies/adihex-2026"
            className="btn-outline-gold mt-7 inline-flex sm:mt-8"
          >
            View Case Study
          </Link>
        </div>

        <div className="text-center">
          <p className="font-display text-5xl font-extrabold leading-none tracking-tight text-ff-gold sm:text-7xl lg:text-[5.5rem]">
            {count.toLocaleString()}+
          </p>
          <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-ff-gold sm:text-xs">
            Registered Visitors
          </p>
          <div className="mx-auto mt-8 flex max-w-md items-stretch justify-center sm:mt-10">
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
                  <p className="max-w-[5.5rem] text-center text-[0.48rem] font-medium uppercase leading-snug tracking-[0.1em] text-ff-gold sm:text-[0.52rem] sm:tracking-[0.12em]">
                    {point}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative min-h-[280px] overflow-hidden sm:min-h-[420px]">
          <Image
            src="/images/proof-dog.png"
            alt="Experiences for a better tomorrow"
            fill
            className="object-cover object-[center_20%]"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ff-green-deep/70 via-transparent to-transparent" />
          <p className="absolute bottom-8 right-4 max-w-[12rem] rotate-[-8deg] font-[family-name:var(--font-great-vibes)] text-2xl leading-tight text-white sm:bottom-10 sm:right-6 sm:text-[2.1rem]">
            Experiences For A Better Tomorrow
          </p>
        </div>
      </div>
    </section>
  );
}
