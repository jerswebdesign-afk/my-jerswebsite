export default function FinalCta() {
  return (
    <section className="px-6 md:px-8 py-16 md:py-24 grid-fade-dark text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="font-headline font-extrabold text-5xl md:text-7xl text-white mb-6 md:mb-8 tracking-tight leading-[0.95]">
          Be an Ecom <span className="font-serif italic">Goat</span>
        </h2>
        <p className="text-on-surface-variant text-base md:text-lg mb-10 font-light max-w-xl mx-auto leading-snug">
          The Method is right there, infront of you. Someone just got an order. Make your decision now to use it.
        </p>
        <button
          onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
          className="px-10 md:px-14 py-5 md:py-6 bg-white text-on-primary font-headline font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm shadow-[0_0_40px_rgba(255,30,30,0.35)] hover:shadow-[0_0_60px_rgba(255,30,30,0.55)] transition-all active:scale-95 w-full md:w-auto"
        >
          Start your story
        </button>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[#ff1a1a]/15 blur-[150px] -z-10 rounded-full pointer-events-none"></div>
    </section>
  )
}
