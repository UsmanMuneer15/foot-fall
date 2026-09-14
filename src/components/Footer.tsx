export function Footer() {
  return (
    <footer className="border-t border-ff-gold/20 bg-ff-green-deep">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/90">
          Trusted by brands <span className="text-ff-gold/70">|</span> Chosen by
          events <span className="text-ff-gold/70">|</span> Built for people
        </p>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ff-gold">
            Experiences today. Stronger connections tomorrow.
          </p>
          <span className="h-px w-40 bg-ff-gold/60" />
        </div>
      </div>
      <div className="border-t border-ff-gold/10">
        <div className="mx-auto max-w-[1440px] px-4 py-5 text-center text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white/80 sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} FOOTFALL GLOBAL LLC</p>
        </div>
      </div>
    </footer>
  );
}
