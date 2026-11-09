import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  href?: string;
};

/** Official FOOTFALL brand logo lockup — crest + wordmark */
export function Logo({ className = "", href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center gap-2.5 sm:gap-3.5 ${className}`}
      aria-label="FOOTFALL GLOBAL LLC home"
    >
      <Image
        src="/brand/logo-rounded-crest-transparent.png"
        alt=""
        width={80}
        height={80}
        className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14 xl:h-16 xl:w-16"
        priority
      />
      <span className="flex flex-col justify-center leading-none">
        <span className="ff-heading !font-bold text-[1.25rem] !tracking-[0.08em] sm:text-[1.5rem] md:text-[1.65rem] xl:text-[1.9rem]">
          FOOTFALL
        </span>
        <span className="mt-1.5 text-[0.55rem] font-bold uppercase tracking-[0.24em] text-ff-gold sm:mt-1.5 sm:text-[0.62rem] sm:tracking-[0.26em] md:text-[0.68rem] xl:text-[0.72rem]">
          GLOBAL LLC
        </span>
      </span>
    </Link>
  );
}
