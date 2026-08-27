import { useEffect } from 'react'

export default function Hero() {
  useEffect(() => {
    const canvas = document.getElementById('neuralCanvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const container = canvas.parentElement
    let width, height, nodes = []
    const nodeCount = 70
    const connectionDistance = 140
    // Canvas color follows the accent token from tailwind.config.js. Change the
    // accent there to rebrand the hero, or hard-code a hex value below.
    const rootStyles = getComputedStyle(document.documentElement)
    const primaryColor = (rootStyles.getPropertyValue('--accent') || '#ff0000').trim() || '#ff0000'
    const repelRadius = 110
    const repelStrength = 4
    const isDesktop = () => window.innerWidth >= 1024

    const mouse = { x: null, y: null }

    function resize() {
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width
      canvas.height = height
    }

    class Node {
      constructor(side = null) {
        // side controls spawn half. After spawn, nodes move freely and may drift across center.
        if (side === 'left')      this.x = Math.random() * (width / 2)
        else if (side === 'right') this.x = width / 2 + Math.random() * (width / 2)
        else                       this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4
        this.radius = Math.random() * 1.5 + 1
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (isDesktop() && mouse.x !== null) {
          const dx = this.x - mouse.x
          const dy = this.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < repelRadius && dist > 0) {
            const force = (repelRadius - dist) / repelRadius * repelStrength
            this.x += (dx / dist) * force
            this.y += (dy / dist) * force
          }
        }

        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = primaryColor
        ctx.fill()
      }
    }

    function setup() {
      resize()
      const half = nodeCount / 2
      nodes = [
        ...Array.from({ length: half }, () => new Node('left')),
        ...Array.from({ length: half }, () => new Node('right')),
      ]
    }

    let animId
    function animate() {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            const opacity = (1 - distance / connectionDistance) * 0.55
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 1.1
            ctx.stroke()
          }
        }
      }
      nodes.forEach(node => {
        node.update()
        node.draw()
      })
      animId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    // Listen on window so interaction works even when canvas is behind other elements.
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)
    setup()
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <section className="relative grid-fade-dark min-h-screen flex flex-col bg-surface-container-lowest">
      {/* Animated canvas background, mouse-reactive. Color follows your accent token. */}
      <div className="absolute inset-0 opacity-90 pointer-events-none">
        <canvas className="absolute inset-0 w-full h-full" id="neuralCanvas"></canvas>
      </div>

      {/* Terminal window frame */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-8 py-6 md:py-10">
        <div className="w-full max-w-4xl mx-auto border border-outline-variant/20 bg-surface-container-lowest/40 backdrop-blur-sm">
          {/* Terminal title bar */}
          <div className="flex items-center justify-between px-4 md:px-5 py-2 border-b border-outline-variant/20">
            <div className="flex gap-1.5 md:gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/40"></div>
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/40"></div>
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/50"></div>
            </div>
            {/* Replace with your brand name */}
            <div className="text-[9px] md:text-[10px] font-label text-on-surface-variant/40 uppercase tracking-[0.2em]">JersMethod</div>
            <div className="w-12"></div>
          </div>

          {/* Hero content, centered, single column */}
          <div className="px-6 md:px-10 lg:px-14 py-8 md:py-12 lg:py-14 text-center">
            <div className="font-label text-[10px] md:text-xs text-primary uppercase tracking-[0.4em] mb-5 md:mb-6">[ Online is best ]</div>

            <h1 className="font-['Manrope'] font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1] mb-5 md:mb-6">
              Source Easier. <span className="font-serif italic font-normal"></span> <br className="hidden sm:block" />
              Sell Higher. Scale <span className="font-serif italic font-normal">Faster.</span>
            </h1>

            <p className="text-on-surface-variant text-xs sm:text-sm md:text-base font-light leading-snug mx-auto mb-1">
              I resell, I help ecom bros, This is simply for all "sellers".
            </p>

            <p className="text-on-surface-variant/60 text-xs md:text-sm font-label uppercase tracking-[0.25em] mt-6 md:mt-8">
              Source. Grind. Scale.
            </p>

            <div className="h-px w-16 bg-primary/40 mx-auto my-6 md:my-8"></div>

            <div className="inline-flex flex-col items-center gap-2 text-on-surface-variant/60">
              <span className="text-[10px] md:text-xs font-label uppercase tracking-[0.3em]">Scroll to see more</span>
              <span className="material-symbols-outlined text-xl animate-bounce">expand_more</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
