import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Access() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error | not-found | success
  const [errorMessage, setErrorMessage] = useState('')
  const [tier, setTier] = useState(null)
  const [files, setFiles] = useState([])

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

  const groups = files.reduce((acc, file) => {
    const parts = file.path.split('/')
    const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : ''
    if (!acc[folder]) acc[folder] = []
    acc[folder].push(file)
    return acc
  }, {})

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
