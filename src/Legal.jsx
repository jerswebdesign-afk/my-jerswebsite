import { Link } from 'react-router-dom'

export default function Legal() {
  return (
    <div className="bg-surface-container-lowest text-on-surface font-['Manrope'] min-h-screen px-6 md:px-24 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant hover:text-white transition-colors">
          &larr; back
        </Link>
        <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight mt-8 mb-8">Legal</h1>
        <div className="space-y-6 text-on-surface-variant font-light text-sm md:text-base leading-relaxed">
        
          <p>Digital product. Designed to help someone in a niche, refund policy is stated on the main page no one will know your email except the team that will send you updates.</p>
          <p>Questions: support@Jersmethod.win</p>
        </div>
      </div>
    </div>
  )
}
