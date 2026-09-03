import { useState } from 'react'
import { Link } from 'react-router-dom'
import ResellingEngineDashboard from './ResellingEngineDashboard.jsx'
import { useOwnerAccess } from '../useOwnerAccess.js'

// Must match the product name api/stripe-webhook.js records for the higher
// tier, and the tier label api/get-downloads.js returns for it.
const REQUIRED_TIER = 'The Reselling Engine'

export default function ResellingEngine() {
  const { loading: ownerLoading, isOwner } = useOwnerAccess()
  const [testAsCustomer, setTestAsCustomer] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error | denied | granted
  const [errorMessage, setErrorMessage] = useState('')
  const [deniedReason, setDeniedReason] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      // Same lookup /access uses: the server checks public.purchases for this
      // email with the service-role key and reports back the highest tier
      // purchased. The browser never talks to Supabase directly.
      const res = await fetch('/api/get-downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Try again shortly.')
        return
      }

      if (!data.access) {
        setDeniedReason("We couldn't find a purchase for that email.")
        setStatus('denied')
        return
      }

      if (data.tier !== REQUIRED_TIER) {
        setDeniedReason(`That email is on ${data.tier}.`)
        setStatus('denied')
        return
      }

      setStatus('granted')
    } catch (err) {
      setStatus('error')
      setErrorMessage('Something went wrong. Try again shortly.')
    }
  }

  // Owner/dev accounts skip the tier check entirely - api/check-owner.js
  // (via useOwnerAccess) already verified this server-side against
  // public.admins, so there is nothing left to gate here.
  if (ownerLoading) {
    return <div className="bg-surface-container-lowest min-h-screen" />
  }

  if (isOwner && !testAsCustomer) {
    return (
      <div>
        <div className="bg-surface-container-lowest px-6 md:px-10 py-3 flex items-center justify-between border-b border-outline-variant/20">
          <Link to="/" className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant hover:text-white transition-colors">
            &larr; back to site
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-green-400">Owner / Dev access</span>
            <button
              onClick={() => setTestAsCustomer(true)}
              className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant hover:text-white transition-colors"
            >
              Test as a customer instead
            </button>
          </div>
        </div>
        <ResellingEngineDashboard />
      </div>
    )
  }

  if (status === 'granted') {
    return (
      <div>
        <div className="bg-surface-container-lowest px-6 md:px-10 py-3 flex items-center justify-between border-b border-outline-variant/20">
          <Link to="/" className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant hover:text-white transition-colors">
            &larr; back to site
          </Link>
          <button
            onClick={() => { setStatus('idle'); setEmail('') }}
            className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant hover:text-white transition-colors"
          >
            Not you? Check a different email
          </button>
        </div>
        <ResellingEngineDashboard />
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface font-['Manrope'] min-h-screen px-6 md:px-24 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant hover:text-white transition-colors">
          &larr; back
        </Link>

        {isOwner && testAsCustomer && (
          <button
            onClick={() => setTestAsCustomer(false)}
            className="block mt-4 font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant hover:text-white transition-colors"
          >
            &larr; Back to owner view
          </button>
        )}

        <h1 className="font-headline font-extrabold text-4xl md:text-6xl text-white tracking-tight mt-8 mb-4">
          The <span className="font-serif italic">Reselling Engine</span>
        </h1>
        <p className="text-on-surface-variant font-light text-sm md:text-base mb-10">
          Enter the email you used at checkout to open the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 bg-surface-container px-4 py-4 border border-outline-variant/30 text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-white/40"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="py-4 px-8 bg-white text-on-primary font-headline font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-white/90 transition-all active:scale-95 disabled:opacity-50"
          >
            {status === 'loading' ? 'Checking...' : 'Enter Engine'}
          </button>
        </form>

        {status === 'error' && (
          <div className="border border-red-500/40 bg-red-500/5 text-red-200 text-sm p-4 mb-8">
            {errorMessage}
          </div>
        )}

        {status === 'denied' && (
          <div className="border border-outline-variant/30 bg-surface-container text-on-surface-variant text-sm p-4 mb-8">
            <div className="text-white font-bold uppercase tracking-widest text-xs mb-2">Access required</div>
            <p className="mb-4">
              {deniedReason} The Reselling Engine dashboard is only available on The Reselling Engine tier.
            </p>
            <Link
              to="/access"
              className="inline-block py-3 px-6 bg-white text-on-primary font-headline font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-white/90 transition-all active:scale-95"
            >
              Go to /access
            </Link>
          </div>
        )}

        <p className="text-on-surface-variant/60 text-xs mt-6">
          Not the right tier yet? Upgrade from <Link to="/access" className="underline hover:text-white">/access</Link>.
        </p>
      </div>
    </div>
  )
}
