import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'
import { useOwnerAccess } from '../useOwnerAccess.js'

function groupFilesByFolder(files) {
  return files.reduce((acc, file) => {
    const parts = file.path.split('/')
    const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : ''
    if (!acc[folder]) acc[folder] = []
    acc[folder].push(file)
    return acc
  }, {})
}

export default function Access() {
  const { isOwner, email: ownerEmail } = useOwnerAccess()
  const [ownerTier, setOwnerTier] = useState(null) // 'lower' | 'higher' | null
  const [ownerStatus, setOwnerStatus] = useState('idle') // idle | loading | error | success
  const [ownerFiles, setOwnerFiles] = useState([])
  const [ownerTierLabel, setOwnerTierLabel] = useState('')
  const [ownerError, setOwnerError] = useState('')

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error | not-found | success
  const [errorMessage, setErrorMessage] = useState('')
  const [tier, setTier] = useState(null)
  const [files, setFiles] = useState([])

  async function loadOwnerPreview(tierKey) {
    setOwnerTier(tierKey)
    setOwnerStatus('loading')
    setOwnerError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/owner-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ tier: tierKey }),
      })
      const data = await res.json()
      if (!res.ok) {
        setOwnerError(data.error || 'Something went wrong. Try again shortly.')
        setOwnerStatus('error')
        return
      }
      setOwnerTierLabel(data.tier)
      setOwnerFiles(data.files || [])
      setOwnerStatus('success')
    } catch (err) {
      setOwnerError('Network error reaching /api/owner-preview.')
      setOwnerStatus('error')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
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
        setStatus('not-found')
        return
      }

      setTier(data.tier)
      setFiles(data.files || [])
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage('Something went wrong. Try again shortly.')
    }
  }

  const groups = groupFilesByFolder(files)
  const ownerGroups = groupFilesByFolder(ownerFiles)

  return (
    <div className="bg-surface-container-lowest text-on-surface font-['Manrope'] min-h-screen px-6 md:px-24 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant hover:text-white transition-colors">
          &larr; back
        </Link>

        <h1 className="font-headline font-extrabold text-4xl md:text-6xl text-white tracking-tight mt-8 mb-4">
          Access your <span className="font-serif italic">Vault</span>
        </h1>
        <p className="text-on-surface-variant font-light text-sm md:text-base mb-10">
          Enter the email you used at checkout and we'll pull up your files.
        </p>

        {isOwner && (
          <div className="border border-outline-variant/30 bg-surface-container text-sm p-4 mb-8">
            <div className="text-white font-bold uppercase tracking-widest text-xs mb-2">Owner / Dev preview</div>
            <p className="text-on-surface-variant mb-4">
              Signed in as {ownerEmail}. Preview either vault directly, without needing a purchase.
            </p>
            <div className="flex gap-3 flex-wrap mb-4">
              <button
                onClick={() => loadOwnerPreview('lower')}
                disabled={ownerStatus === 'loading'}
                className="py-3 px-6 border border-outline-variant/30 bg-surface-container-high text-white font-headline font-bold uppercase text-[11px] tracking-[0.2em] hover:border-white/40 transition-all disabled:opacity-50"
              >
                Preview The JER Method
              </button>
              <button
                onClick={() => loadOwnerPreview('higher')}
                disabled={ownerStatus === 'loading'}
                className="py-3 px-6 border border-outline-variant/30 bg-surface-container-high text-white font-headline font-bold uppercase text-[11px] tracking-[0.2em] hover:border-white/40 transition-all disabled:opacity-50"
              >
                Preview The Reselling Engine
              </button>
              {ownerTierLabel === 'The Reselling Engine' && ownerStatus === 'success' && (
                <Link
                  to="/ResellingEngine"
                  className="py-3 px-6 bg-white text-on-primary font-headline font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-white/90 transition-all"
                >
                  Enter Engine
                </Link>
              )}
            </div>

            {ownerStatus === 'loading' && <p className="text-on-surface-variant text-sm">Loading…</p>}
            {ownerStatus === 'error' && <p className="text-red-300 text-sm">{ownerError}</p>}
            {ownerStatus === 'success' && (
              ownerFiles.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No files in that bucket yet.</p>
              ) : (
                Object.entries(ownerGroups).map(([folder, groupFiles]) => (
                  <div key={folder || 'root'} className="mb-4">
                    {folder && (
                      <div className="text-white text-xs font-bold uppercase tracking-widest mb-2">{folder}</div>
                    )}
                    <div className="space-y-2">
                      {groupFiles.map((file) => (
                        <a
                          key={file.path}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-sm text-on-surface-variant hover:border-white/40 hover:text-white transition-all"
                        >
                          <span>{file.name}</span>
                          <span className="material-symbols-outlined text-base">download</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        )}

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
            {status === 'loading' ? 'Checking...' : 'Get My Files'}
          </button>
        </form>

        {status === 'error' && (
          <div className="border border-red-500/40 bg-red-500/5 text-red-200 text-sm p-4 mb-8">
            {errorMessage}
          </div>
        )}

        {status === 'not-found' && (
          <div className="border border-outline-variant/30 bg-surface-container text-on-surface-variant text-sm p-4 mb-8">
            We couldn't find a purchase for that email. Double check the email you used at checkout, or contact support@Jersmethod.win.
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="font-label text-[10px] tracking-[0.4em] text-on-surface-variant mb-6 uppercase">
              {tier}
            </div>

            {tier === 'The Reselling Engine' && (
              <Link
                to="/ResellingEngine"
                className="inline-block mb-8 py-4 px-8 bg-white text-on-primary font-headline font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-white/90 transition-all active:scale-95"
              >
                Enter Engine
              </Link>
            )}

            {files.length === 0 ? (
              <p className="text-on-surface-variant text-sm">
                No files are available yet. Contact support@Jersmethod.win.
              </p>
            ) : (
              Object.entries(groups).map(([folder, groupFiles]) => (
                <div key={folder || 'root'} className="mb-8">
                  {folder && (
                    <div className="text-white text-xs font-bold uppercase tracking-widest mb-3">{folder}</div>
                  )}
                  <div className="space-y-2">
                    {groupFiles.map((file) => (
                      <a
                        key={file.path}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm text-on-surface-variant hover:border-white/40 hover:text-white transition-all"
                      >
                        <span>{file.name}</span>
                        <span className="material-symbols-outlined text-base">download</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))
            )}

            <p className="text-on-surface-variant/60 text-xs mt-6">
              Links expire in 1 hour. Come back to /access if you need a fresh set.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
