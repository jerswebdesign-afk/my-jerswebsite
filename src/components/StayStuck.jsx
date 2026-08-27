export default function StayStuck() {
  const steps = [
    { num: '01', title: 'Step one', desc: 'Sourcing', icon: 'folder_zip' },
    { num: '02', title: 'Step two', desc: 'Funding and Managing Energy', icon: 'account_tree' },
    { num: '03', title: 'Step three', desc: 'Profitable Sales.', icon: 'rocket_launch' },
  ]
  return (
    <section id="stuck" className="px-6 md:px-16 lg:px-24 py-16 md:py-24 grid-fade-dark relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative z-10">
        <div className="lg:col-span-5">
          <h2 className="font-headline font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight mb-6">
            Why most <br /> people <span className="font-serif italic">stay stuck</span>
          </h2>
          <div className="space-y-4 text-on-surface-variant font-light text-sm md:text-base max-w-md leading-relaxed">
            <p>"My Funding and Profit do NOT match"</p>
            <p>Having the funds is number one, BUT that doesn't mean you will profit. <span className="font-serif italic text-white text-lg md:text-xl">Managing</span>.</p>
            <p className="text-white">Directing that Funding to a Payout.</p>
          </div>
          <button
            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 md:mt-8 inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 bg-white/5 text-white font-headline font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 hover:border-white/40 transition-all active:scale-95"
          >
            Get access
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="lg:col-span-7">
          {steps.map((s, i) => (
            <div key={i}>
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-5 p-4 md:p-5 border border-outline-variant/30 bg-surface-container hover:border-white/40 transition-all group">
                <div className="text-3xl md:text-4xl font-headline font-black text-white/20 group-hover:text-white/50 transition-colors leading-none w-12 md:w-14">{s.num}</div>
                <div>
                  <h3 className="text-base md:text-lg font-headline font-bold text-white uppercase tracking-tight">{s.title}</h3>
                  <p className="text-on-surface-variant font-light text-xs md:text-sm leading-snug">{s.desc}</p>
                </div>
                <span className="material-symbols-outlined text-white/60 text-lg">{s.icon}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-2 md:py-3">
                  <span className="material-symbols-outlined text-white/40 text-2xl">arrow_downward</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#ff1a1a]/10 blur-[140px] -z-10 rounded-full pointer-events-none"></div>
    </section>
  )
}
