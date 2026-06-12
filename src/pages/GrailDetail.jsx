import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Zap, User, LogOut, ChevronLeft, FolderOpen, Footprints, Trash2, X, Share2, Link, Check } from 'lucide-react'
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
  text: '#FFFFFF', muted: '#A1A1AA', border: '#1f1f1f', danger: '#ff4444',
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
          {!isMobile && (
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(217,255,63,0.1)', border: '1px solid rgba(217,255,63,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color={C.accent} />
            </div>
          )}
          <button onClick={handleLogout} style={{ fontFamily: font.body, fontSize: 13, fontWeight: 600, color: C.muted, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <LogOut size={14} />
            {!isMobile && 'Log out'}
          </button>
        </div>
      </div>
    </nav>
  )
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#0d0d0d', border: '1px solid rgba(255,68,68,0.25)',
        borderRadius: 16, padding: '28px 24px',
        width: '100%', maxWidth: 380, boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={16} color={C.danger} />
            </div>
            <h3 style={{ fontFamily: font.body, fontWeight: 700, fontSize: 16, color: C.text, margin: 0 }}>Confirm Delete</h3>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 4 }}><X size={16} /></button>
        </div>
        <p style={{ fontFamily: font.body, fontSize: 14, color: C.muted, margin: '0 0 24px', lineHeight: 1.55 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onConfirm} disabled={loading}
            style={{ flex: 1, background: C.danger, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontFamily: font.body, fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
          <button
            onClick={onCancel}
            style={{ flex: 1, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 0', fontFamily: font.body, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Shoe Card ───────────────────────────────────────────────────────────────
function ShoeCard({ shoe, collectionId, onRemoved }) {
  const { isMobile } = useBreakpoint()
  const [hovered, setHovered]   = useState(false)
  const [confirm, setConfirm]   = useState(false)
  const [removing, setRemoving] = useState(false)
  const [copied, setCopied]     = useState(false)

  const handleShare = () => {
    const url = shoe.url || window.location.href
    if (navigator.share) {
      navigator.share({ title: shoe.name, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    }
  }

  const handleRemove = async () => {
    setRemoving(true)
    try {
      const res = await fetch(`${API}/api/collections/${collectionId}/shoes/${shoe.id}/`, { method: 'DELETE', headers: authHeader() })
      if (res.ok) onRemoved(shoe.id)
    } finally { setRemoving(false); setConfirm(false) }
  }

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: C.card,
          border: `1px solid ${hovered ? 'rgba(217,255,63,0.35)' : C.border}`,
          borderRadius: 16, overflow: 'hidden',
          transition: 'border-color 0.2s, transform 0.2s',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <div style={{ background: '#fff', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative' }}>
          {shoe.image_s3 || shoe.image
            ? <img src={shoe.image_s3 || shoe.image} alt={shoe.name} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <Footprints size={48} color="#ccc" />
          }
          {hovered && (
            <button
              onClick={() => setConfirm(true)}
              style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,68,68,0.85)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={13} color="#fff" />
            </button>
          )}
        </div>
        <div style={{ padding: '14px 16px 18px' }}>
          <p style={{ fontFamily: font.body, fontWeight: 700, fontSize: 14, color: C.text, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shoe.name || 'Unknown Shoe'}
          </p>
          <p style={{ fontFamily: font.body, fontSize: 12, color: C.muted, margin: '0 0 12px' }}>{shoe.source || '—'}</p>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: isMobile ? 8 : 0,
          }}>
            <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 16, color: C.text }}>
              {shoe.price ? `${shoe.price}`.trim() : '—'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={handleShare}
                style={{
                  background: copied ? 'rgba(217,255,63,0.1)' : 'transparent',
                  border: `1px solid ${copied ? 'rgba(217,255,63,0.3)' : C.border}`,
                  color: copied ? C.accent : C.muted,
                  borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', transition: 'all 0.15s',
                }}
              >
                {copied ? <Check size={12} strokeWidth={2.5} /> : <Share2 size={12} />}
              </button>
              <a
                href={shoe.url} target="_blank" rel="noreferrer"
                style={{
                  fontFamily: font.body, fontSize: 12, fontWeight: 600, color: C.accent,
                  background: 'rgba(217,255,63,0.08)', border: '1px solid rgba(217,255,63,0.2)',
                  borderRadius: 6, padding: '4px 10px', textDecoration: 'none',
                }}
              >
                View
              </a>
            </div>
          </div>
        </div>
      </div>
      {confirm && (
        <ConfirmModal
          message={`Remove "${shoe.name || 'this shoe'}" from the grail? The shoe itself won't be deleted.`}
          onConfirm={handleRemove} onCancel={() => setConfirm(false)} loading={removing}
        />
      )}
    </>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function GrailDetail() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const { isMobile, isTablet } = useBreakpoint()
  const [collection, setCollection]       = useState(null)
  const [fetching, setFetching]           = useState(true)
  const [notFound, setNotFound]           = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting]           = useState(false)
  const [showStory, setShowStory]         = useState(false)
  const [shareOpen, setShareOpen]         = useState(false)
  const [copied, setCopied]               = useState(false)
  const shareRef                          = useRef(null)

  useEffect(() => {
    if (!shareOpen) return
    const close = (e) => { if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [shareOpen])

  const grailUrl = `${window.location.origin}/grails/${id}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(grailUrl).then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false); setShareOpen(false) }, 1800)
    })
  }

  const handleInstagram = () => { setShareOpen(false); setShowStory(true) }

  useEffect(() => {
    if (!localStorage.getItem('access')) { navigate('/login'); return }
    fetch(`${API}/api/collections/${id}/`, { headers: authHeader() })
      .then(r => { if (r.status === 404) { setNotFound(true); return null } return r.json() })
      .then(data => { if (data) setCollection(data) })
      .catch(() => setNotFound(true))
      .finally(() => setFetching(false))
  }, [id])

  const handleDeleteCollection = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`${API}/api/collections/${id}/`, { method: 'DELETE', headers: authHeader() })
      if (res.ok) navigate('/grails')
    } finally { setDeleting(false) }
  }

  const handleShoeRemoved = (shoeId) => {
    setCollection(prev => ({ ...prev, shoes: prev.shoes.filter(s => s.id !== shoeId), shoe_count: prev.shoe_count - 1 }))
  }

  const shoeGridCols = isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(3,1fr)' : 'repeat(4,1fr)'

  if (fetching) return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Navbar />
      <p style={{ fontFamily: font.body, fontSize: 14, color: C.muted, padding: '48px 16px' }}>Loading…</p>
    </div>
  )

  if (notFound || !collection) return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '24px 16px' : '48px 32px' }}>
        <p style={{ fontFamily: font.body, fontSize: 15, color: C.muted }}>Grail not found.</p>
        <button onClick={() => navigate('/grails')} style={{ fontFamily: font.body, fontSize: 13, color: C.accent, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          ← Back to grails
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 32px' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/grails')}
          style={{
            fontFamily: font.body, fontSize: 13, fontWeight: 600, color: C.muted,
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5, padding: 0, marginBottom: 24,
          }}
        >
          <ChevronLeft size={15} /> Back to grails
        </button>

        {/* Collection header */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'flex-start',
          justifyContent: 'space-between',
          gap: isMobile ? 20 : 16,
          marginBottom: 36,
        }}>
          {/* Left: info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(217,255,63,0.08)', border: '1px solid rgba(217,255,63,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FolderOpen size={20} color={C.accent} />
              </div>
              <h1 style={{ fontFamily: font.heading, fontSize: isMobile ? 32 : 42, color: C.text, margin: 0, letterSpacing: '2px', wordBreak: 'break-word' }}>
                {collection.name.toUpperCase()}
              </h1>
            </div>

            {collection.description && (
              <p style={{ fontFamily: font.body, fontSize: 14, color: C.muted, margin: '0 0 14px', maxWidth: 600 }}>
                {collection.description}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: font.body, fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Footprints size={13} />
                {collection.shoe_count} {collection.shoe_count === 1 ? 'shoe' : 'shoes'}
              </span>
              {collection.total_worth > 0 && (
                <span style={{
                  fontFamily: font.body, fontSize: 13, fontWeight: 700, color: C.accent,
                  background: 'rgba(217,255,63,0.08)', border: '1px solid rgba(217,255,63,0.2)',
                  borderRadius: 8, padding: '3px 12px',
                }}>
                  {collection.total_worth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
              {collection.tags?.map(tag => (
                <span key={tag} style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, color: '#000', background: C.accent, borderRadius: 4, padding: '2px 8px' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
            <div ref={shareRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShareOpen(s => !s)}
                style={{
                  fontFamily: font.body, fontSize: 13, fontWeight: 600,
                  color: shareOpen ? C.accent : C.muted,
                  background: shareOpen ? 'rgba(217,255,63,0.1)' : 'transparent',
                  border: `1px solid ${shareOpen ? 'rgba(217,255,63,0.35)' : C.border}`,
                  borderRadius: 8, padding: '9px 14px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s',
                }}
              >
                <Share2 size={14} /> Share
              </button>
              {shareOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#181818', border: '1px solid #2a2a2a',
                  borderRadius: 12, padding: '6px', minWidth: 190,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6)', zIndex: 50,
                }}>
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

            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                fontFamily: font.body, fontSize: 13, fontWeight: 600, color: C.danger,
                background: 'rgba(255,68,68,0.07)', border: '1px solid rgba(255,68,68,0.2)',
                borderRadius: 8, padding: '9px 16px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,68,68,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,68,68,0.07)'}
            >
              <Trash2 size={14} /> {isMobile ? 'Delete' : 'Delete Grail'}
            </button>
          </div>
        </div>

        {/* Shoes grid */}
        {collection.shoes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', border: `1px dashed ${C.border}`, borderRadius: 18 }}>
            <Footprints size={48} color="#2a2a2a" style={{ marginBottom: 16 }} />
            <p style={{ fontFamily: font.body, fontSize: 15, color: C.muted, margin: '0 0 8px' }}>No shoes in this grail yet.</p>
            <p style={{ fontFamily: font.body, fontSize: 13, color: '#444', margin: 0 }}>Paste a sneaker URL on the home page and save it here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: shoeGridCols, gap: isMobile ? 12 : 18 }}>
            {collection.shoes.map(shoe => (
              <ShoeCard key={shoe.id} shoe={shoe} collectionId={id} onRemoved={handleShoeRemoved} />
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={`Delete "${collection.name}"? This will remove the grail and all its shoe associations. The shoes themselves won't be deleted.`}
          onConfirm={handleDeleteCollection} onCancel={() => setConfirmDelete(false)} loading={deleting}
        />
      )}

      {showStory && <GrailStoryModal grail={collection} onClose={() => setShowStory(false)} />}
    </div>
  )
}
