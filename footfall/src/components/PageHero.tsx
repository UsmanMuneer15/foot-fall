import Image from "next/image";

type PageHeroProps = {
  eyebrow?: string;
  /** Plain string, or line-by-line array (forced breaks on all devices) */
  title: string | readonly string[];
  description?: string;
  /** Topic-related background image for this page */
  image?: string;
  imageAlt?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
}: PageHeroProps) {
  const isSvg = image?.endsWith(".svg");
  const lines = Array.isArray(title) ? title : [title];

  return (
    <section className="relative overflow-hidden border-b border-ff-gold/20 pt-28 pb-14 sm:pt-32 sm:pb-20">
      {image ? (
        <>
          {isSvg ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${image}')` }}
              role="img"
              aria-label={imageAlt}
            />
          ) : (
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-ff-green-deep/48" />
          <div className="absolute inset-0 bg-gradient-to-r from-ff-green-deep/78 via-ff-green-deep/45 to-ff-green-deep/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ff-green-deep/55 via-transparent to-ff-green-deep/25" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 texture-green" />
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(197,160,89,0.18), transparent 50%)",
            }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {eyebrow ? <p className="section-label mb-4">{eyebrow}</p> : null}
        <h1 className="ff-heading ff-heading-lg max-w-5xl">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-white sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
