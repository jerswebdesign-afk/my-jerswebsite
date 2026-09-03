import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'
import { useOwnerAccess } from '../useOwnerAccess.js'

// Not part of the customer funnel and not linked from public navigation.
// This is a real Supabase Auth account, used only so the site owner/dev can
// verify and test the paid-member gates without a purchase.
export default function OwnerLogin() {
  const { loading, isOwner, checkFailed, reason, email: sessionEmail } = useOwnerAccess()
  // A genuine "not an admin" result only happens when the RPC actually ran
  // (reason === 'ok') and returned false. Any other reason means the check
  // itself didn't complete - showing that distinction is the whole point of
  // this page, since the two used to be visually identical.
  const genuinelyNotAdmin = !isOwner && !checkFailed && reason === 'ok'
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error | signedUp
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    const { error } = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      setStatus('error')
      setMessage(error.message)
      return
    }

    if (mode === 'signup') {
      setStatus('signedUp')
      setMessage('Account created. If email confirmation is required on this project, confirm it, then sign in below.')
    } else {
      setStatus('idle')
      setEmail('')
      setPassword('')
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface font-['Manrope'] min-h-screen px-6 md:px-24 py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Link to="/" className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant hover:text-white transition-colors">
          &larr; back
        </Link>

        <h1 className="font-headline font-extrabold text-4xl text-white tracking-tight mt-8 mb-4">
          Owner <span className="font-serif italic">sign-in</span>
        </h1>
        <p className="text-on-surface-variant font-light text-sm mb-8">
          Not a customer flow. Sign in with your owner/dev Supabase account to test the paid-member areas without a purchase.
        </p>

        {loading ? (
          <p className="text-on-surface-variant text-sm">Checking session…</p>
        ) : sessionEmail ? (
          <div className="border border-outline-variant/30 bg-surface-container text-sm p-4 mb-8">
            <div className="text-white font-bold uppercase tracking-widest text-xs mb-2">
              Signed in as {sessionEmail}
            </div>
            <p className={"mb-4 " + (isOwner ? "text-green-400" : genuinelyNotAdmin ? "text-on-surface-variant" : "text-yellow-400")}>
              {isOwner
                ? '✅ Recognized as Owner / Dev — tier gates will bypass for this account.'
                : genuinelyNotAdmin
                  ? "❌ Signed in, but this email is not in public.admins — no bypass granted."
                  : `⚠️ The owner check did not complete, so this is NOT a real "not an admin" result. Reason: ${reason ?? 'unknown'}.`}
            </p>
            <div className="flex gap-4 flex-wrap items-center">
              <Link to="/access" className="underline hover:text-white text-on-surface-variant text-sm">Test /access</Link>
              <Link to="/ResellingEngine" className="underline hover:text-white text-on-surface-variant text-sm">Test /ResellingEngine</Link>
              <button onClick={handleSignOut} className="underline hover:text-white text-on-surface-variant text-sm">Sign out</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="bg-surface-container px-4 py-4 border border-outline-variant/30 text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-white/40"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="bg-surface-container px-4 py-4 border border-outline-variant/30 text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-white/40"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="py-4 px-8 bg-white text-on-primary font-headline font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-white/90 transition-all active:scale-95 disabled:opacity-50"
            >
              {status === 'loading' ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
            <button
              type="button"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setStatus('idle'); setMessage('') }}
              className="text-on-surface-variant text-xs underline hover:text-white text-left"
            >
              {mode === 'signin' ? 'First time here? Create your owner account' : 'Already have an account? Sign in'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div className="border border-red-500/40 bg-red-500/5 text-red-200 text-sm p-4 mb-8">{message}</div>
        )}
        {status === 'signedUp' && (
          <div className="border border-outline-variant/30 bg-surface-container text-on-surface-variant text-sm p-4 mb-8">{message}</div>
        )}

        <p className="text-on-surface-variant/60 text-xs mt-6">
          Creating an account here only creates a normal Supabase login — it grants no access on its own. Access is
          granted only to the email(s) listed in the <code>public.admins</code> table.
        </p>
      </div>
    </div>
  )
}
