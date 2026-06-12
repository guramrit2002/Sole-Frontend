import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, LogOut, FolderOpen, Plus, Footprints, X, ArrowRight, Share2, Check, Link } from 'lucide-react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import GrailStoryModal from '../components/GrailStoryModal'

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)

const C = {
  bg: '#050505', card: '#111111', accent: '#D9FF3F',
  text: '#FFFFFF', muted: '#A1A1AA', border: '#1f1f1f',
}

const font = {
  heading: "'Bebas Neue', sans-serif",
  body: "'Space Grotesk', sans-serif",
}

const API = 'https://titanium-deviation-newcastle-pupils.trycloudflare.com'
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('access')}` })

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    navigate('/login')
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '0 16px' : '0 32px',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#000" fill="#000" />
          </div>
          <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 17, color: C.text }}>Sole</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16 }}>
          <button onClick={() => navigate('/grails')} style={{ fontFamily: font.body, fontSize: 14, fontWeight: 600, color: C.accent, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            My Grails
          </button>
          <button onClick={handleLogout} style={{ fontFamily: font.body, fontSize: 13, fontWeight: 600, color: C.muted, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <LogOut size={14} />
            {!isMobile && 'Log out'}
          </button>
        </div>
      </div>
    </nav>
  )
}

// ─── Add Shoe Modal ───────────────────────────────────────────────────────────
function AddShoeModal({ collection, onClose, onAdded }) {
  const { isMobile } = useBreakpoint()
  const [url, setUrl]       = useState('')
  const [status, setStatus] = useState(null)
  const [msg, setMsg]       = useState('')
  const inputRef            = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleAdd = async () => {
    if (!url.trim() || status === 'scraping' || status === 'saving') return
    setStatus('scraping'); setMsg('')
    try {
      const scrapeRes = await fetch(`${API}/api/scrape/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ url: url.trim(), force: false }),
      })
      const shoe = await scrapeRes.json()
      if (!scrapeRes.ok) { setStatus('error'); setMsg(shoe.error || 'Could not scrape URL.'); return }
      setStatus('saving')
      const addRes = await fetch(`${API}/api/collections/${collection.id}/shoes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ shoe_id: shoe.id }),
      })
      if (!addRes.ok) { setStatus('error'); setMsg('Shoe scraped but could not add to collection.'); return }
      setStatus('done'); setMsg(shoe.name || 'Shoe added!'); onAdded()
    } catch { setStatus('error'); setMsg('Could not reach the server.') }
  }

  const busy = status === 'scraping' || status === 'saving'

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#0d0d0d', border: '1px solid rgba(217,255,63,0.2)',
        borderRadius: 20, padding: isMobile ? '24px 20px 20px' : '32px 32px 28px',
        width: '100%', maxWidth: 480,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ fontFamily: font.heading, fontSize: 24, color: C.text, margin: 0, letterSpacing: '1px' }}>ADD SHOE</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 4 }}><X size={18} /></button>
        </div>
        <p style={{ fontFamily: font.body, fontSize: 13, color: C.muted, margin: '0 0 24px' }}>
          to <strong style={{ color: C.text }}>{collection.name}</strong>
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <input
            ref={inputRef} value={url}
            onChange={e => { setUrl(e.target.value); setStatus(null); setMsg('') }}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="https://www.nike.com/t/..."
            disabled={busy || status === 'done'}
            style={{
              flex: isMobile ? '1 1 100%' : 1,
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 10, padding: '11px 14px',
              fontFamily: font.body, fontSize: 13, color: C.text,
              outline: 'none', opacity: busy ? 0.6 : 1,
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!url.trim() || busy || status === 'done'}
            style={{
              flex: isMobile ? '1 1 100%' : '0 0 auto',
              background: (!url.trim() || busy || status === 'done') ? '#2a2a0a' : C.accent,
              color: '#000', border: 'none', borderRadius: 10,
              padding: '11px 18px', fontFamily: font.body, fontSize: 13, fontWeight: 700,
              cursor: !url.trim() || busy || status === 'done' ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {status === 'scraping' ? 'Scraping…' : status === 'saving' ? 'Saving…' : 'Add'}
            {!busy && status !== 'done' && <ArrowRight size={13} strokeWidth={2.5} />}
          </button>
        </div>
        {status === 'done' && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(217,255,63,0.07)', border: '1px solid rgba(217,255,63,0.2)', borderRadius: 8, fontFamily: font.body, fontSize: 13, color: C.accent }}>
            ✓ {msg} added to grail.
          </div>
        )}
        {status === 'error' && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(255,60,60,0.07)', border: '1px solid rgba(255,60,60,0.2)', borderRadius: 8, fontFamily: font.body, fontSize: 13, color: '#ff6b6b' }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Grail Card ──────────────────────────────────────────────────────────────
function GrailCard({ collection, onClick, onAddShoe, onInstagram }) {
  const { isMobile } = useBreakpoint()
  const [hovered, setHovered]     = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied]       = useState(false)
  const shareRef                  = useRef(null)

  useEffect(() => {
    if (!shareOpen) return
    const close = (e) => { if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [shareOpen])

  const grailUrl = `${window.location.origin}/grails/${collection.id}`

  const handleCopyLink = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(grailUrl).then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false); setShareOpen(false) }, 1800)
    })
  }

  const handleInstagram = (e) => { e.stopPropagation(); setShareOpen(false); onInstagram() }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card,
        border: `1px solid ${hovered ? 'rgba(217,255,63,0.4)' : C.border}`,
        borderRadius: 22,
        padding: isMobile ? '24px 20px 20px' : '36px 36px 30px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 60px rgba(217,255,63,0.09)' : 'none',
        display: 'flex', flexDirection: 'column', gap: 20,
        minHeight: isMobile ? 240 : 300,
      }}
    >
      {/* Icon + counts */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'rgba(217,255,63,0.08)', border: '1px solid rgba(217,255,63,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <FolderOpen size={22} color={C.accent} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{
            fontFamily: font.body, fontSize: 12, fontWeight: 700, color: C.muted,
            background: '#1a1a1a', border: `1px solid ${C.border}`,
            borderRadius: 20, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Footprints size={12} />
            {collection.shoe_count} {collection.shoe_count === 1 ? 'shoe' : 'shoes'}
          </span>
          {collection.total_worth > 0 && (
            <span style={{
              fontFamily: font.body, fontSize: 12, fontWeight: 700, color: C.accent,
              background: 'rgba(217,255,63,0.08)', border: '1px solid rgba(217,255,63,0.2)',
              borderRadius: 20, padding: '4px 12px',
            }}>
              ${collection.total_worth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>

      {/* Name + description */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: font.heading, fontSize: isMobile ? 28 : 36, color: C.text,
          margin: '0 0 10px', letterSpacing: '1.5px', lineHeight: 1,
        }}>
          {collection.name.toUpperCase()}
        </h3>
        {collection.description && (
          <p style={{
            fontFamily: font.body, fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {collection.description}
          </p>
        )}
      </div>

      {/* Tags + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, flex: 1 }}>
          {collection.tags?.map(tag => (
            <span key={tag} style={{
              fontFamily: font.body, fontSize: 11, fontWeight: 600,
              color: '#000', background: C.accent, borderRadius: 4, padding: '3px 9px',
            }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button
            onClick={e => { e.stopPropagation(); onAddShoe() }}
            style={{
              background: 'rgba(217,255,63,0.1)', border: '1px solid rgba(217,255,63,0.25)',
              color: C.accent, borderRadius: 8, padding: '7px 14px',
              fontFamily: font.body, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Plus size={12} strokeWidth={2.5} /> Add
          </button>
          <div ref={shareRef} style={{ position: 'relative' }}>
            <button
              onClick={e => { e.stopPropagation(); setShareOpen(s => !s) }}
              style={{
                background: shareOpen ? 'rgba(217,255,63,0.12)' : 'transparent',
                border: `1px solid ${shareOpen ? 'rgba(217,255,63,0.35)' : C.border}`,
                color: shareOpen ? C.accent : C.muted,
                borderRadius: 8, padding: '7px 10px',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
              }}
            >
              <Share2 size={13} />
            </button>
            {shareOpen && (
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'absolute', bottom: 'calc(100% + 8px)', right: 0,
                  background: '#181818', border: '1px solid #2a2a2a',
                  borderRadius: 12, padding: '6px', minWidth: 190,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6)', zIndex: 50,
                }}
              >
                <button
                  onClick={handleCopyLink}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', borderRadius: 8, padding: '9px 12px', cursor: 'pointer', fontFamily: font.body, fontSize: 13, fontWeight: 600, color: copied ? C.accent : C.text, transition: 'background 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#242424'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {copied ? <Check size={14} color={C.accent} strokeWidth={2.5} /> : <Link size={14} />}
                  {copied ? 'Copied!' : 'Copy public link'}
                </button>
                <button
                  onClick={handleInstagram}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', borderRadius: 8, padding: '9px 12px', cursor: 'pointer', fontFamily: font.body, fontSize: 13, fontWeight: 600, color: C.text, transition: 'background 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#242424'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <InstagramIcon /> Share on Instagram
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Grails() {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()
  const [collections, setCollections] = useState([])
  const [fetching, setFetching]       = useState(true)
  const [creating, setCreating]       = useState(false)
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState({ name: '', description: '', tags: '' })
  const [addTarget, setAddTarget]     = useState(null)
  const [storyTarget, setStoryTarget] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem('access')) { navigate('/login'); return }
    fetch(`${API}/api/collections/`, { headers: authHeader() })
      .then(r => r.json()).then(setCollections).catch(() => {}).finally(() => setFetching(false))
  }, [])

  const handleCreate = async () => {
    if (!form.name.trim() || creating) return
    setCreating(true)
    try {
      const res = await fetch(`${API}/api/collections/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (res.ok) { setCollections(prev => [data, ...prev]); setForm({ name: '', description: '', tags: '' }); setShowForm(false) }
    } finally { setCreating(false) }
  }

  const inputStyle = {
    width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
    borderRadius: 8, padding: '9px 12px', fontFamily: font.body,
    fontSize: 13, color: C.text, outline: 'none', boxSizing: 'border-box',
  }

  const labelStyle = {
    fontFamily: font.body, fontSize: 11, fontWeight: 700,
    color: C.muted, letterSpacing: '1px', textTransform: 'uppercase',
    display: 'block', marginBottom: 6,
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '24px 16px' : '48px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ fontFamily: font.heading, fontSize: isMobile ? 28 : 36, color: C.text, margin: 0, letterSpacing: '2px' }}>
            MY GRAILS
          </h1>
          <button
            onClick={() => setShowForm(s => !s)}
            style={{
              fontFamily: font.body, fontSize: 13, fontWeight: 700, color: '#000', background: C.accent,
              border: 'none', borderRadius: 8, padding: '9px 16px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            {isMobile ? 'New' : 'New Grail'}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div style={{
            background: C.card, border: `1px solid rgba(217,255,63,0.2)`,
            borderRadius: 14, padding: isMobile ? '20px 16px' : '24px 28px', marginBottom: 28,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. My Grails" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What's this grail about?" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Nike, Jordan, Retro" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button
                onClick={handleCreate}
                disabled={!form.name.trim() || creating}
                style={{
                  fontFamily: font.body, fontSize: 13, fontWeight: 700, color: '#000',
                  background: form.name.trim() ? C.accent : '#2a2a0a',
                  border: 'none', borderRadius: 8, padding: '9px 22px',
                  cursor: form.name.trim() && !creating ? 'pointer' : 'not-allowed',
                }}
              >
                {creating ? 'Creating…' : 'Create'}
              </button>
              <button
                onClick={() => { setShowForm(false); setForm({ name: '', description: '', tags: '' }) }}
                style={{ fontFamily: font.body, fontSize: 13, fontWeight: 600, color: C.muted, background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, padding: '9px 18px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cards */}
        {fetching ? (
          <p style={{ fontFamily: font.body, fontSize: 14, color: C.muted }}>Loading…</p>
        ) : collections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <FolderOpen size={48} color="#2a2a2a" style={{ marginBottom: 16 }} />
            <p style={{ fontFamily: font.body, fontSize: 15, color: C.muted, margin: 0 }}>
              No grails yet. Create your first one above.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? 16 : 24,
          }}>
            {collections.map(c => (
              <GrailCard
                key={c.id} collection={c}
                onClick={() => navigate(`/grails/${c.id}`)}
                onAddShoe={() => setAddTarget(c)}
                onInstagram={() => setStoryTarget(c)}
              />
            ))}
          </div>
        )}
      </div>

      {addTarget && (
        <AddShoeModal
          collection={addTarget}
          onClose={() => setAddTarget(null)}
          onAdded={() => setCollections(prev => prev.map(c => c.id === addTarget.id ? { ...c, shoe_count: c.shoe_count + 1 } : c))}
        />
      )}

      {storyTarget && <GrailStoryModal grail={storyTarget} onClose={() => setStoryTarget(null)} />}
    </div>
  )
}
