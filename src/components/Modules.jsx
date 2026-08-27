export default function Modules() {
  const modules = [
    { num: '01', title: 'Reselling Fundamentals', desc: 'The Model, Your niche and Understanding Capital.', lessons: 5 },
    { num: '02', title: 'Finding & Sourcing Inventory', desc: 'What Product is worth it? Understaning Scams and vendor links, Research Tools.', lessons: 5 },
    { num: '03', title: 'Buying Inventory', desc: 'Calculating true cost, MOQ Shipping and Sneaky Costs. Evaluating Product Qaulity, first inventory purchase.', lessons: 5 },
    { num: '04', title: 'Pricing & Selling', desc: 'How to price, Market Value, Getting attention and Converting posts.', lessons: 5 },
    { num: '05', title: 'Marketplace & Social Selling', desc: 'Depop, FBM, Instagram and Tiktok, Building Profile and Repeat Cutomers, SnapChat Methods.', lessons: 4 },
    { num: '06', title: 'Scaling the Reselling Model', desc: 'Negotiating, Reinvest Smart, Scale Inventory and converting side hustle to 5-9 business.', lessons: 4 },
  ]
  return (
    <section id="modules" className="px-6 md:px-24 py-12 md:py-20 grid-fade-light">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-headline font-extrabold text-4xl md:text-6xl text-white tracking-tight leading-[0.95] mb-4">
            Everything <span className="font-serif italic">you get</span>
          </h2>
          <p className="text-on-surface-variant font-light text-sm md:text-base mb-6">6 modules. 28 lessons.</p>
          <button
            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-on-primary font-headline font-bold uppercase tracking-[0.2em] text-[10px] shadow-[0_0_40px_rgba(255,30,30,0.35)] hover:shadow-[0_0_50px_rgba(255,30,30,0.5)] transition-all active:scale-95"
          >
            Get access
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

        <div className="space-y-3 md:space-y-4">
          {modules.map((m, i) => (
            <div key={i} className="relative p-5 md:p-6 transition-all group border border-outline-variant/30 bg-surface-container hover:border-white/40">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                <div className="flex flex-row md:flex-col items-center gap-4 md:gap-1 md:w-20 shrink-0">
                  <div className="text-4xl md:text-5xl font-headline font-black leading-none transition-colors text-white/20 group-hover:text-white/50">{m.num}</div>
                  <div className="text-[9px] font-label text-on-surface-variant uppercase tracking-widest whitespace-nowrap">{m.lessons} lessons</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-2xl font-headline font-bold text-white uppercase tracking-tight mb-1.5">{m.title}</h3>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
