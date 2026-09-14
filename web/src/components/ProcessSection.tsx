import { processSteps } from "@/lib/content";

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden pb-12 pt-4 sm:pb-20 sm:pt-8">
      <div className="relative mb-10 sm:mb-16" aria-hidden>
        <div className="mx-auto h-px max-w-[1440px] bg-gradient-to-r from-transparent via-ff-gold/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-16 max-w-4xl -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(31,138,85,0.45),transparent_70%)] blur-md" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-8 max-w-2xl -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.35),transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-[1.65rem] font-bold uppercase leading-[1.1] tracking-[0.06em] text-ff-gold sm:text-4xl sm:tracking-[0.08em] md:text-5xl">
            We Engineer Attention.
          </h2>
          <div className="mx-auto mt-4 h-px w-12 bg-ff-gold/80 sm:mt-5 sm:w-14" aria-hidden />
        </div>

        <ol className="mt-8 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-5 lg:gap-1">
          {processSteps.map((step, index) => (
            <li
              key={step.number}
              className="relative text-center sm:text-left lg:px-3 lg:text-center"
            >
              {index < processSteps.length - 1 ? (
                <span
                  className="absolute -right-0.5 top-4 hidden text-lg font-light text-ff-gold/55 lg:block"
                  aria-hidden
                >
                  ›
                </span>
              ) : null}
              <div className="flex items-baseline justify-center gap-2 sm:block sm:justify-start lg:block">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-ff-gold">
                  {step.number}
                </p>
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ff-gold sm:mt-2">
                  {step.title}
                </h3>
              </div>
              <p className="mx-auto mt-1.5 max-w-[18rem] text-[0.85rem] font-light leading-relaxed text-white/80 sm:mt-3 sm:max-w-none sm:text-sm lg:mx-auto lg:max-w-[12rem]">
                {step.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
