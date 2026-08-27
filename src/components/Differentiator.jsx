export default function Differentiator() {
  const rows = [
    { not: 'Not Tested Theory', to: 'A Ready Guide' },
    { not: 'Not Gurus Hiding Everything', to: 'The Method infront of your face' },
    { not: 'Not a Subscription', to: 'one payment, Access a lifetimes' },
    { not: 'Not Stale Proof', to: 'What you are inside right now, the funnel' },
    { not: 'Never "M4 Money Ready?"', to: 'The System to do  it' },
  ]
  return (
    <section id="differentiator" className="px-6 md:px-16 lg:px-24 py-16 md:py-24 grid-fade-dark">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 order-1 lg:order-2 lg:border-l lg:border-outline-variant/20 lg:pl-8 lg:py-2">
          <h2 className="font-headline font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight">
            Why this isn't <br /> <span className="font-serif italic">Another Mentorship</span>
          </h2>
          <h3 className="Font-sub-headline font-bold text-0.1xl md:text-0.2xl lg:text-0.3xl text-white/50 leading-[0.98] tracking-tight">
            Don't buy if your lazy and your're gonna sit. The catch is you still need to work and do the reps 100% of the way. if this is you: welcome in!
          </h3>
          
        </div>
        <div className="lg:col-span-6 space-y-6 md:space-y-8 lg:pr-8 lg:py-2 order-2 lg:order-1">
          {rows.map((item, i) => (
            <div key={i} className="flex items-center gap-5 md:gap-8">
              <div className="text-white/40 font-label text-xs tracking-widest shrink-0">0{i + 1}</div>
              <div className="flex-1 flex items-center flex-wrap gap-x-3 md:gap-x-4 gap-y-1">
                <span className="text-on-surface-variant/70 font-light text-base md:text-lg">{item.not}</span>
                <span className="material-symbols-outlined text-white/60 text-base">arrow_forward</span>
                <span className="text-white font-serif italic text-base md:text-lg">{item.to}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
