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
      className={`inline-flex shrink-0 items-center gap-2 sm:gap-3 ${className}`}
      aria-label="FOOTFALL GLOBAL LLC home"
    >
      <Image
        src="/brand/logo-rounded-crest-transparent.png"
        alt=""
        width={56}
        height={56}
        className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12"
        priority
      />
      <span className="flex flex-col justify-center leading-none">
        <span className="font-display text-[0.95rem] font-medium uppercase tracking-[0.16em] text-ff-gold sm:text-[1.25rem] sm:tracking-[0.18em] lg:text-[1.35rem]">
          FOOTFALL
        </span>
        <span className="mt-1 text-[0.48rem] font-medium uppercase tracking-[0.3em] text-ff-gold sm:mt-1.5 sm:text-[0.55rem] sm:tracking-[0.34em] lg:text-[0.6rem]">
          GLOBAL LLC
        </span>
      </span>
    </Link>
  );
}
