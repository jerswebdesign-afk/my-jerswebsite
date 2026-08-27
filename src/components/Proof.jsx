export default function Proof() {
  const ENABLE_PROOF = true;
  if (! ENABLE_PROOF) return null;
  // Replace each placeholder box with your own screenshot. Drop images into
  // /public and swap the placeholder div for an <img src="/your-image.png" />.
  const tiles = [
    { image: '/fbmarketplace.jpg', note: 'fbmarketplacejpg', featured: false },
    { image: '/WhatsApp.jpg', note: '/WhatsApp.jpg', featured: true },
    { image: '/cshapp1.jpg', note: '/cshapp1.jpg', featured: false },
    { image: '/Youtube.jpg', note: '/Youtube.jpg', featured: false },
    { image: '/InstagramALT.jpg', note: '/InstagramALT.jpg', featured: false },
    
  ]
  return (
    <section id="proof" className="px-6 md:px-24 py-12 md:py-20 grid-fade-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-headline font-extrabold text-4xl md:text-6xl text-white tracking-tight leading-[0.95] mb-4">
            Your Story can <span className="font-serif italic">Scale.</span>
          </h2>
          <p className="text-on-surface-variant font-light text-sm md:text-base">My progress in the online business space but others as well.</p>
        </div>

        {/* Auto-moving carousel — no manual scrolling, edges fade into the section background.
            Hover pauses it. The card list is rendered twice back-to-back and the track
            animates left by exactly half its width, so the loop is seamless. */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-24 z-20 bg-gradient-to-r from-[#1a0505] to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-24 z-20 bg-gradient-to-l from-[#1a0505] to-transparent"></div>

          <div className="marquee-track flex gap-3 md:gap-4 w-max py-1">
            {[...tiles, ...tiles].map((t, i) => (
              <div
                key={i}
                aria-hidden={i >= tiles.length ? 'true' : undefined}
                className={`shrink-0 w-[220px] sm:w-[250px] md:w-[270px] bg-surface-container overflow-hidden transition-all border ${t.featured ? 'border-[#ff1a1a]/40 shadow-[0_0_40px_rgba(255,30,30,0.2)]' : 'border-outline-variant/40 hover:border-white/40'}`}
              >
                {/* Image section — replace this placeholder box with your screenshot */}
                <div className="aspect-[4/5] bg-surface-container-low flex items-center justify-center overflow-hidden">
                  <img src={t.image} alt={t.note} className="w-full h-full object-cover block" />
                </div>
                <div className="flex justify-between items-center px-2 py-1.5 border-t border-outline-variant/20">
                  <span className="text-[7px] font-label text-on-surface-variant/60 uppercase tracking-widest">{t.label}</span>
                  <span className="text-[8px] text-primary font-headline font-bold uppercase tracking-tight">{t.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#ff1a1a]/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
    </section>
  )
}
