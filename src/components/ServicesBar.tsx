import { serviceIcons } from "@/components/Icons";
import { services } from "@/lib/content";

export function ServicesBar() {
  return (
    <section className="border-y border-ff-gold/45 bg-ff-green">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {services.map((service, index) => {
          const Icon = serviceIcons[service.icon];
          return (
            <div
              key={`${service.line1}-${service.line2}`}
              className={[
                "relative flex flex-col items-center gap-3.5 px-3 py-9 text-center",
                "after:absolute after:right-0 after:top-5 after:bottom-5 after:w-px after:bg-ff-gold/40",
                index % 2 === 1 ? "after:hidden sm:after:block" : "",
                index % 3 === 2 ? "sm:after:hidden lg:after:block" : "",
                index === services.length - 1 ? "after:hidden" : "",
              ].join(" ")}
            >
              <Icon className="h-11 w-11 text-ff-gold" />
              <p className="max-w-[10.5rem] text-[0.68rem] font-semibold uppercase leading-[1.3] tracking-[0.12em] text-white">
                <span className="block">{service.line1}</span>
                <span className="block">{service.line2}</span>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
