import { useState } from 'react'

export default function Faq() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: 'Is there a refund policy?', a: 'Yes, Do the honest work and methodology, Apply the skills. Show proof of work and refund in full.' },
    { q: 'What if Im a newbie?', a: 'Module one, Story one, the first lesson is  whatever you need.' },
    { q: 'Does this convert?', a: '%100 it does, no more useless vendors and guessing. follow the framework.' },
    { q: 'Is it really lifetime access?', a: 'Yes, you will get updates and the links expire, so fresh info will always be given.' },
    { q: 'D I need to have Products beforehand?', a: 'You can do this without a product and you can with one beforehand, it is easier to dive in quicker.' },
    { q: 'What does it actually take to get started?', a: 'The Course, plus an extra $50 to get more than one item. one sale can cover everything, Funding and placement will get you far. youll learn the best strats in the game.' },
  ]
  return (
    <section id="faq" className="px-6 md:px-16 lg:px-24 py-16 md:py-24 grid-fade-light">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="font-label text-[10px] text-on-surface-variant/60 uppercase tracking-[0.4em] mb-4">FAQ</div>
          <h2 className="font-headline font-extrabold text-5xl md:text-6xl lg:text-7xl text-black leading-[0.95] tracking-tight mb-6">
            Questions<span className="font-serif italic">.</span>
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base font-light max-w-sm">You will learn that everything is ecom, get info before you dive in.</p>
        </div>

        <div className="lg:col-span-7 space-y-3 md:space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={i} className={`border bg-[#f5dede] transition-all ${isOpen ? 'border-[#ff1a1a]/50 shadow-[0_0_30px_rgba(255,30,30,0.18)]' : 'border-black/10 hover:border-primary/40'}`}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="w-full text-left p-5 md:p-6 flex items-center gap-3 md:gap-4 cursor-pointer focus:outline-none">
                  <span className="text-primary text-xs md:text-sm font-label tracking-widest shrink-0">0{i + 1}</span>
                  <h3 className="flex-1 text-base md:text-lg font-semibold text-black">{faq.q}</h3>
                  <span className={`material-symbols-outlined text-black transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="text-black/70 font-light text-xs md:text-sm leading-relaxed px-5 md:px-6 pb-5 md:pb-6 pl-12 md:pl-14">{faq.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
