export default function Pricing() {
  return (
    <section id="pricing" className="px-6 md:px-24 py-12 md:py-20 grid-fade-dark">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="font-headline font-extrabold text-4xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[0.95] mb-4">
            Choose your <span className="font-serif italic">Story</span>
          </h2>
          <p className="text-on-surface-variant font-light text-sm md:text-base max-w-xl mx-auto">Starting I S easy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto items-start">
          {/* Tier One (entry) */}
          <div className="bg-surface-container p-6 md:p-10 flex flex-col border border-outline-variant/30 hover:border-white/40 transition-all">
            <div className="font-label text-[10px] tracking-[0.4em] text-on-surface-variant mb-4 md:mb-6 uppercase">STORY ONE</div>
            <h3 className="text-2xl font-headline font-bold text-white mb-2 uppercase">The JER Method</h3>
            <div className="text-sm text-on-surface-variant/80 italic mb-4 font-light leading-snug">Learn to Package yourself as a reseller, Ecom bro, and even course seller as an Obsidian Vault. Sell it and do it faceless. This Galaxy of a system, built by hand: Turn what you know into a skill you have people pay for, no face on camera.</div>
            <div className="flex items-baseline gap-3 mb-4">
              <div className="text-5xl font-headline font-bold text-white tracking-tighter">$46</div>
              <div className="relative inline-block text-3xl font-headline font-bold text-on-surface-variant/70 tracking-tighter">
                $99
                <span aria-hidden="true" className="absolute left-[-4px] right-[-4px] top-1/2 h-[3px] bg-white -translate-y-1/2 rotate-[-18deg] origin-center pointer-events-none"></span>
              </div>
            </div>
            <div className="text-[10px] text-on-surface-variant/70 font-label uppercase tracking-widest mb-8">Lifetime Updates</div>
            <div className="space-y-3 mb-8">
              {['The full story: 6 Modules, 28 Lessons', 'The GOATED FILES: DM Script and sales that handles your customers', 'Funnel Side: Manychat Automation workflow in one', 'Direct mail Support',].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-light leading-snug text-on-surface-variant">
                  <span className="material-symbols-outlined text-white text-base">check</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            {/* Replace with your Stripe payment link */}
            <a href="https://buy.stripe.com/cNi00ifzLb9b8lzeysew800" className="w-full py-4 border border-white/20 bg-white/5 text-white font-headline font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-white/10 hover:border-white/40 transition-all active:scale-95 text-center block">
              Get Story one
            </a>
          </div>

          {/* Tier Two (featured) */}
          <div className="bg-surface-container-lowest p-6 md:p-10 flex flex-col border border-[#ff1a1a]/40 shadow-[0_0_50px_rgba(255,30,30,0.2)] relative z-10 mt-4 md:mt-0 hover:border-white/40 transition-all">
            <div className="absolute -top-3 right-6 md:right-8 bg-white text-on-primary text-[10px] px-4 py-1 font-bold uppercase tracking-widest">Most Popular</div>
            <div className="font-label text-[10px] tracking-[0.4em] text-white mb-4 md:mb-6 uppercase">FINAL ACT</div>
            <h3 className="text-2xl font-headline font-bold text-white mb-2 uppercase">The Reselling Engine</h3>
            <div className="text-sm text-on-surface-variant/80 italic mb-4 font-light leading-snug">Just Skip the guesswork. Build your business, reselling, Ecom or just a course business with a complete system planned to help you source, scale and sell faster of what works.</div>
            <div className="flex items-baseline gap-3 mb-4">
              <div className="text-5xl font-headline font-bold text-white tracking-tighter">$96</div>
              <div className="relative inline-block text-3xl font-headline font-bold text-on-surface-variant/70 tracking-tighter">
                $202
                <span aria-hidden="true" className="absolute left-[-4px] right-[-4px] top-1/2 h-[3px] bg-white -translate-y-1/2 rotate-[-18deg] origin-center pointer-events-none"></span>
              </div>
            </div>
            <div className="border border-white/30 bg-white/5 px-3 py-2.5 mb-8 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-white text-base">all_inclusive</span>
              <div>
                <div className="text-white font-headline font-bold text-[11px] uppercase tracking-[0.2em]">Lifetime Access</div>
                <div className="text-on-surface-variant text-[10px] font-label uppercase tracking-widest">One payment. All future updates included.</div>
              </div>
            </div>
            <div className="flex-grow space-y-3 mb-8">
              {['Everything in The Jer Method, plus:', 'The Resell Template: Socials set-up', 'The Bulk System: Pre-orders and early access', 'The Ai Negotiotor: Prompts to help you convert', 'The MRR: Setting up Bulk Customers','The Supplier: The setup to be your own supplier'].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-light leading-snug text-on-surface-variant">
                  <span className="material-symbols-outlined text-white text-base">{i === 0 ? 'add' : 'check'}</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            {/* Replace with your Stripe payment link */}
            <a href="https://buy.stripe.com/7sYbJ05Zb1yB6dr4XSew801" className="w-full py-4 bg-white text-on-primary font-headline font-bold uppercase text-[11px] tracking-[0.3em] shadow-[0_0_40px_rgba(255,30,30,0.35)] hover:shadow-[0_0_50px_rgba(255,30,30,0.5)] transition-all active:scale-95 text-center block">
              Get tier two
            </a>
            <div className="p-4 bg-surface-container-high border border-white/20 mt-6 flex items-start gap-4">
              <span className="material-symbols-outlined text-white text-xl mt-0.5">verified_user</span>
              <div>
                <div className="text-white text-xs font-bold uppercase tracking-widest mb-1">14-DAY ACTION-BASEd GAURANTEE</div>
                <div className="text-white/70 text-xs font-light leading-snug">Complete Everything, Lauch your products, Post all your offers, negotiate in dms. If the system did not work with your grind, show me the work and I will refund you in full.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
