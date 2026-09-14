import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
};

/** Official FOOTFALL brand logo lockup — crest + wordmark */
export function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex min-w-0 items-center gap-2 sm:gap-3.5 ${className}`}
      aria-label="FOOTFALL GLOBAL LLC home"
    >
      <Image
        src="/brand/logo-rounded-crest-transparent.png"
        alt=""
        width={56}
        height={56}
        className="h-9 w-9 shrink-0 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
        priority
      />
      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span className="font-display text-[0.95rem] font-[300] uppercase tracking-[0.16em] text-ff-gold sm:text-[1.35rem] sm:tracking-[0.2em] md:text-[1.55rem]">
          FOOTFALL
        </span>
        <span className="mt-1 text-[0.42rem] font-light uppercase tracking-[0.32em] text-ff-gold/90 sm:mt-1.5 sm:text-[0.55rem] sm:tracking-[0.44em] md:text-[0.62rem]">
          GLOBAL LLC
        </span>
      </span>
    </Link>
  );
}
