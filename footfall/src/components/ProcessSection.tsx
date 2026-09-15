import { processSteps } from "@/lib/content";

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden pb-6 pt-1 sm:pb-8 sm:pt-2 lg:pb-8">
      <div className="relative mb-7 sm:mb-9" aria-hidden>
        <div className="mx-auto h-px max-w-[1440px] bg-gradient-to-r from-transparent via-ff-gold/65 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-12 max-w-3xl -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(31,138,85,0.4),transparent_70%)] blur-md" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-montserrat)] text-[0.65rem] font-medium uppercase tracking-[0.32em] text-white/85 sm:text-[0.7rem]">
            More Than Events
          </p>
          <h2 className="ff-heading mt-2.5 text-[1.45rem] tracking-[0.12em] sm:mt-3 sm:text-[1.85rem] md:text-[2.25rem] lg:text-[2.5rem]">
            We Engineer Attention.
          </h2>
          <div className="mx-auto mt-3 h-px w-11 bg-ff-gold sm:mt-3.5 sm:w-12" aria-hidden />
        </div>

        <ol className="mt-8 grid gap-8 sm:mt-9 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:mt-10 lg:grid-cols-5 lg:gap-0">
          {processSteps.map((step, index) => (
            <li
              key={step.number}
              className="relative flex flex-col items-center px-3 text-center lg:px-5"
            >
              {index < processSteps.length - 1 ? (
                <span
                  className="absolute -right-[0.15rem] top-[1.15rem] z-10 hidden select-none text-[0.95rem] font-light leading-none text-ff-gold lg:block"
                  aria-hidden
                >
                  ›
                </span>
              ) : null}

              <p className="font-[family-name:var(--font-montserrat)] text-[0.72rem] font-semibold uppercase leading-none tracking-[0.18em] text-ff-gold sm:text-[0.78rem]">
                {step.number}
              </p>
              <h3 className="mt-1.5 font-[family-name:var(--font-montserrat)] text-[0.82rem] font-semibold uppercase leading-none tracking-[0.2em] text-ff-gold sm:mt-2 sm:text-[0.9rem]">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-[13rem] text-[0.82rem] font-normal leading-relaxed text-white sm:mt-3 sm:text-[0.88rem] lg:max-w-[11rem]">
                {step.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
