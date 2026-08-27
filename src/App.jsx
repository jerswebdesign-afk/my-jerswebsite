import { useEffect } from 'react'
import Lenis from 'lenis'
import Hero from './components/Hero.jsx'
import Proof from './components/Proof.jsx'
import Pricing from './components/Pricing.jsx'
import VaultPreview from './components/VaultPreview.jsx'
import StayStuck from './components/StayStuck.jsx'
import Modules from './components/Modules.jsx'
import Differentiator from './components/Differentiator.jsx'
import Faq from './components/Faq.jsx'
import FinalCta from './components/FinalCta.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    })
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="bg-surface-container-lowest text-on-surface font-['Manrope'] selection:bg-white/20">
      <main className="min-h-screen relative overflow-hidden">
        <Hero />
        <Proof />
        <Pricing />
        <VaultPreview />
        <StayStuck />
        <Modules />
        <Differentiator />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
