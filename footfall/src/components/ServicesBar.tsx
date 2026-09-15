import { serviceIcons } from "@/components/Icons";
import { services } from "@/lib/content";

export function ServicesBar() {
  return (
    <section className="border-y border-ff-gold/50 bg-ff-green-deep">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {services.map((service, index) => {
          const Icon = serviceIcons[service.icon];
          return (
            <div
              key={`${service.line1}-${service.line2}`}
              className={[
                "relative flex flex-col items-center gap-4 px-3 py-10 text-center",
                "after:absolute after:right-0 after:top-6 after:bottom-6 after:w-px after:bg-ff-gold/45",
                index % 2 === 1 ? "after:hidden sm:after:block" : "",
                index % 3 === 2 ? "sm:after:hidden lg:after:block" : "",
                index === services.length - 1 ? "after:hidden" : "",
              ].join(" ")}
            >
              <Icon className="h-10 w-10 text-ff-gold sm:h-11 sm:w-11" />
              <p className="max-w-[11rem] font-display text-[0.62rem] font-medium uppercase leading-[1.35] tracking-[0.16em] text-ff-gold sm:text-[0.65rem]">
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
