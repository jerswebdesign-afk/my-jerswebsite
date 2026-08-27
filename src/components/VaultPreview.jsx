export default function VaultPreview() {
  return (
    <section id="vault" className="px-6 md:px-24 py-12 md:py-20 grid-fade-light relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-headline font-extrabold text-4xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[0.95] mb-4">
            Inside the grind of <span className="font-serif italic">your Story</span>
          </h2>
          <p className="text-on-surface-variant font-light text-sm md:text-base max-w-xl mx-auto">The Amount of content deseved to go through to reach your rich flow state.</p>
        </div>

        <div className="relative border border-white/20 overflow-hidden shadow-[0_0_50px_rgba(255,30,30,0.18)] bg-[#120303]">
          <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#220707]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white/20 border border-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/20 border border-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/20 border border-white/40"></div>
            </div>
            <div className="mx-auto text-xs font-label text-on-surface-variant tracking-widest">your-preview.png</div>
          </div>
          {/* Replace this placeholder box with a screenshot of your product */}
          <div className="aspect-[16/9] bg-surface-container-low flex items-center justify-center">
            <img src= '/Vault-Preview.png'
                  alt="/Vault-Preview.png"
                  classname="w-full h-full
                  object-cover block"
                  />
         </div>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#ff1a1a]/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
    </section>
  )
}
