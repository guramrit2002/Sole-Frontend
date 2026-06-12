import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Globe, TrendingUp, Bell, LayoutGrid, ArrowRight, Check, LogOut, X } from 'lucide-react'
import { useBreakpoint } from '../hooks/useBreakpoint'

import sneaker1 from '../assets/sneakers/sneaker_1.png'
import sneaker2 from '../assets/sneakers/sneaker_2.png'
import sneaker3 from '../assets/sneakers/sneaker_3.png'

import neonBg1 from '../assets/backgrounds/neon_bg_1.png'
import neonBg2 from '../assets/backgrounds/neon_bg_2.png'
import neonBg3 from '../assets/backgrounds/neon_bg_3.png'

import graffiti1 from '../assets/graffiti/graffiti_1.png'
import graffiti2 from '../assets/graffiti/graffiti_2.png'
import graffiti3 from '../assets/graffiti/graffiti_3.png'
import graffiti4 from '../assets/graffiti/graffiti_4.png'
import graffiti5 from '../assets/graffiti/graffiti_5.png'

import arrowIcon from '../assets/icons/arrow.png'
import heartIcon from '../assets/icons/heart.png'

const C = {
  bg: '#050505', card: '#111111', accent: '#D9FF3F', glow: '#8DFF00',
  text: '#FFFFFF', muted: '#A1A1AA', border: '#1f1f1f',
}

const font = {
  heading: "'Bebas Neue', sans-serif",
  body: "'Space Grotesk', sans-serif",
}

const TRENDING = [
  { id: 1, name: 'Nike Dunk Low',     colorway: 'Pine Green',   price: '$112.99',   badge: null,  img: sneaker1 },
  { id: 2, name: 'Yeezy 350 V2',     colorway: 'Bone',          price: '$219.00',   badge: 'HOT', img: sneaker2 },
  { id: 3, name: 'Air Jordan 1 High', colorway: 'Bred Toe',     price: '$1,445.00', badge: null,  img: sneaker3 },
  { id: 4, name: 'Air Jordan 4',      colorway: 'White Cement', price: '$340.00',   badge: 'NEW', img: sneaker1 },
]

const FEATURES = [
  { icon: Globe,      title: 'ADD FROM ANYWHERE',     desc: "Just paste a link. We'll grab all the details." },
  { icon: TrendingUp, title: 'PRICE TRACKING',        desc: 'Get notified when the price drops.' },
  { icon: Bell,       title: 'RELEASE REMINDERS',     desc: 'Never miss a drop again.' },
  { icon: LayoutGrid, title: 'BUILD YOUR GRAIL LIST', desc: 'Organize, droplist & flex your kicks.' },
]

// ─── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()
  const isLoggedIn = !!localStorage.getItem('access')

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#000" fill="#000" />
          </div>
          <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 17, color: C.text }}>Sole</span>
        </div>

        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16 }}>
            <button
              onClick={() => navigate('/grails')}
              style={{
                fontFamily: font.body, fontSize: isMobile ? 12 : 14, fontWeight: 700,
                color: C.card, background: C.accent,
                border: 'none', cursor: 'pointer',
                padding: isMobile ? '5px 10px' : '6px 12px', borderRadius: 6,
              }}
            >
              My Grails
            </button>
            <button
              onClick={handleLogout}
              style={{
                fontFamily: font.body, fontSize: 13, fontWeight: 600, color: C.muted,
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <LogOut size={14} />
              {!isMobile && 'Log out'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              fontFamily: font.body, fontSize: 14, fontWeight: 600, color: C.text,
              background: 'transparent', border: '1px solid #333', borderRadius: 8,
              padding: '7px 20px', cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function HeroSection({ url, setUrl, onAdd, loading, scrapedShoe, collections, selectedCollection, setSelectedCollection, onSaveToCollection, saving, onDismiss }) {
  const { isMobile, isTablet, w } = useBreakpoint()

  const headingSize = w < 400 ? 52 : isMobile ? 60 : isTablet ? 88 : 130

  return (
    <section style={{ background: C.bg, position: 'relative', overflow: 'hidden', paddingTop: isMobile ? 40 : 72 }}>

      {/* Neon glow blobs — desktop/tablet only */}
      {!isMobile && <>
        <img src={neonBg1} alt="" aria-hidden style={{ position: 'absolute', top: -60, right: -40, width: isTablet ? 400 : 600, height: 'auto', mixBlendMode: 'screen', opacity: 0.45, pointerEvents: 'none' }} />
        <img src={neonBg2} alt="" aria-hidden style={{ position: 'absolute', top: 80, right: 120, width: isTablet ? 280 : 420, height: 'auto', mixBlendMode: 'screen', opacity: 0.3, pointerEvents: 'none' }} />
        <img src={neonBg3} alt="" aria-hidden style={{ position: 'absolute', bottom: 60, right: -80, width: 380, height: 'auto', mixBlendMode: 'screen', opacity: 0.2, pointerEvents: 'none' }} />
      </>}

      {/* Graffiti overlays — reduced on mobile */}
      {[
        { src: graffiti1, top: 10,   right: 40,  size: isMobile ? 180 : 340, opacity: 0.55, rotate: '-8deg'  },
        { src: graffiti2, top: 200,  right: -20, size: isMobile ? 160 : 300, opacity: 0.45, rotate:  '6deg'  },
        !isMobile && { src: graffiti3, top: -30, right: 320, size: 260, opacity: 0.4,  rotate: '-14deg' },
        !isMobile && { src: graffiti4, bottom: 80, right: 60, size: 280, opacity: 0.48, rotate: '4deg' },
        !isMobile && { src: graffiti5, bottom: 10, right: 260, size: 220, opacity: 0.38, rotate: '-6deg' },
      ].filter(Boolean).map(({ src, size, opacity, rotate, ...pos }, i) => (
        <div key={i} aria-hidden style={{
          position: 'absolute', ...pos,
          width: size, height: size,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
          backgroundColor: C.accent, backgroundBlendMode: 'multiply',
          mixBlendMode: 'screen', opacity, transform: `rotate(${rotate})`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '0 16px' : '0 32px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        minHeight: isMobile ? 'auto' : 520,
        gap: isMobile ? 32 : 0,
      }}>

        {/* ── Left: copy ── */}
        <div style={{
          flex: isMobile ? 'none' : '0 0 50%',
          width: isMobile ? '100%' : 'auto',
          paddingRight: isMobile ? 0 : 40,
          paddingTop: isMobile ? 16 : 0,
        }}>
          <h1 style={{
            fontFamily: font.heading, fontSize: headingSize,
            lineHeight: 0.9, letterSpacing: '3px',
            margin: `0 0 5% ${isMobile ? '0' : '10%'}`,
          }}>
            <span style={{ color: C.text }}>ADD IT.</span><br />
            <span style={{ color: C.accent }}>TRACK IT.</span><br />
            <span style={{ color: C.text }}>ROCK IT.</span>
          </h1>

          <p style={{
            fontFamily: font.body, fontSize: isMobile ? 14 : 15, color: C.muted,
            lineHeight: 1.65, margin: `0 0 0 ${isMobile ? '0' : '10%'}`, maxWidth: 360,
          }}>
            Save any sneaker from any store.<br />
            Track price, drops &amp;{' '}
            <span style={{ color: C.text, fontWeight: 600 }}>never miss a release.</span>
          </p>

          {/* Avatar cluster */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: `0 0 ${isMobile ? '8%' : '15%'} ${isMobile ? '0' : '10%'}`,
            marginTop: 20,
          }}>
            <div style={{ display: 'flex' }}>
              {['#D9FF3F', '#8DFF00', '#fff', '#6b7280'].map((c, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: `2px solid ${C.bg}`,
                  background: `linear-gradient(135deg, ${c}44, ${c}bb)`,
                  marginLeft: i === 0 ? 0 : -8,
                }} />
              ))}
            </div>
            <div>
              <span style={{ fontFamily: font.body, fontSize: 12, color: C.muted }}>
                Join <strong style={{ color: C.text }}>12,400+</strong> sneakerheads
              </span>
              <br />
              <span style={{ fontFamily: font.body, fontSize: 11, color: '#555' }}>@Sole</span>
            </div>
          </div>
        </div>

        {/* ── Right: hero shoe — hidden on mobile ── */}
        {!isMobile && (
          <div style={{
            flex: '0 0 55%',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            position: 'relative', height: isTablet ? 480 : 820,
          }}>
            <img
              src={sneaker1}
              alt="Featured sneaker"
              style={{
                width: '130%', maxWidth: 1200,
                height: isTablet ? 480 : 820,
                objectFit: 'contain', position: 'relative', zIndex: 1,
                filter: 'drop-shadow(0 20px 60px rgba(217,255,63,0.15))',
              }}
            />
          </div>
        )}
      </div>

      {/* ── URL bar ── */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '0 16px' : '0 3px',
      }}>
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: isMobile ? '20px 18px' : '28px 32px',
          position: 'relative', zIndex: 10,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <span style={{
            fontFamily: font.body, fontWeight: 700, fontSize: 13,
            color: C.text, textTransform: 'uppercase', letterSpacing: '1px',
            display: 'block', marginBottom: 4,
          }}>
            Add Sneaker from Any URL
          </span>
          <p style={{ fontFamily: font.body, fontSize: 13, color: C.muted, margin: '0 0 16px' }}>
            Paste the link to any sneaker product page and add it to your grail list.
          </p>

          <div style={{ display: 'flex', gap: 5, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <input
              type="url" value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="paste your favorite sneaker link..."
              style={{
                flex: isMobile ? '1 1 100%' : 1,
                background: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: 10, padding: '12px 16px',
                fontFamily: font.body, fontSize: 14, color: C.text, outline: 'none',
              }}
            />
            <button
              onClick={onAdd}
              disabled={loading}
              style={{
                flex: isMobile ? '1 1 100%' : '0 0 auto',
                background: loading ? '#a8c930' : C.accent,
                color: '#000', border: 'none', borderRadius: 10,
                padding: '12px 26px', fontFamily: font.body, fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.75 : 1, transition: 'opacity 0.15s',
              }}
            >
              {loading ? 'Adding…' : 'Add to Grail'}
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>

          <div style={{
            display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', marginTop: 12, gap: isMobile ? 6 : 0,
          }}>
            <span style={{ fontFamily: font.body, fontSize: 12, color: '#444' }}>
              Works with Nike, Adidas, StockX, SNKRS, Foot Locker &amp; More!
            </span>
            <span style={{ fontFamily: font.body, fontSize: 12, color: C.glow, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Check size={12} strokeWidth={3} />
              Magic happens instantly
            </span>
          </div>

          {/* Scraped result + collection picker */}
          {scrapedShoe && (
            <div style={{
              marginTop: 20, borderTop: `1px solid ${C.border}`, paddingTop: 20,
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12,
            }}>
              {scrapedShoe.image && (
                <img
                  src={scrapedShoe.image} alt={scrapedShoe.name}
                  style={{ width: 64, height: 64, objectFit: 'contain', background: '#e8e8e4', borderRadius: 10, flexShrink: 0 }}
                />
              )}
              <div style={{ flex: '1 1 140px', minWidth: 0 }}>
                <p style={{
                  fontFamily: font.body, fontWeight: 700, fontSize: 14, color: C.text, margin: '0 0 2px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {scrapedShoe.name || 'Untitled Shoe'}
                </p>
                <p style={{ fontFamily: font.body, fontSize: 13, color: C.accent, margin: 0 }}>
                  {scrapedShoe.price ? `${scrapedShoe.price} ${scrapedShoe.currency || ''}`.trim() : '—'}
                </p>
              </div>
              <select
                value={selectedCollection}
                onChange={e => setSelectedCollection(e.target.value)}
                style={{
                  flex: '1 1 140px', background: '#1a1a1a', border: '1px solid #2a2a2a',
                  borderRadius: 8, padding: '9px 12px',
                  fontFamily: font.body, fontSize: 13, color: C.text, outline: 'none', cursor: 'pointer',
                }}
              >
                <option value="">Pick a grail list…</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button
                onClick={onSaveToCollection}
                disabled={!selectedCollection || saving}
                style={{
                  background: selectedCollection ? C.accent : '#2a2a0a',
                  color: '#000', border: 'none', borderRadius: 8, padding: '9px 20px',
                  fontFamily: font.body, fontSize: 13, fontWeight: 700,
                  cursor: selectedCollection && !saving ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {saving ? 'Saving…' : 'Save to Grail'}
              </button>
              <button
                onClick={onDismiss}
                style={{ background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', padding: 4, flexShrink: 0 }}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
function FeaturesRow() {
  const { isMobile } = useBreakpoint()
  return (
    <section style={{ background: '#09090a', borderBottom: `1px solid ${C.border}` }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '48px 16px 40px' : '88px 32px 56px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gap: isMobile ? 20 : 32,
        }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, background: 'rgba(217,255,63,0.07)',
                border: '1px solid rgba(217,255,63,0.15)', borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
              }}>
                <Icon size={22} color={C.accent} />
              </div>
              <h3 style={{ fontFamily: font.heading, fontSize: isMobile ? 14 : 17, color: C.text, margin: '0 0 8px', letterSpacing: '1px' }}>
                {title}
              </h3>
              <p style={{ fontFamily: font.body, fontSize: isMobile ? 12 : 13, color: C.muted, margin: 0, lineHeight: 1.55 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Sneaker card ─────────────────────────────────────────────────────────────
function SneakerCard({ shoe }) {
  const [wishlisted, setWishlisted] = useState(false)
  return (
    <div
      style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(217,255,63,0.35)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ position: 'relative', background: '#e8e8e4', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={shoe.img} alt={shoe.name} style={{ width: '88%', height: '88%', objectFit: 'contain' }} />
        {shoe.badge && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: shoe.badge === 'HOT' ? '#ff3333' : C.accent,
            color: shoe.badge === 'HOT' ? '#fff' : '#000',
            fontFamily: font.body, fontWeight: 700, fontSize: 10,
            padding: '3px 8px', borderRadius: 6, letterSpacing: '0.5px',
          }}>
            {shoe.badge}
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); setWishlisted(w => !w) }}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}
        >
          <img src={heartIcon} alt="Wishlist" style={{ width: 16, height: 16, objectFit: 'contain', opacity: wishlisted ? 1 : 0.4, transition: 'opacity 0.15s' }} />
        </button>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <p style={{ fontFamily: font.body, fontWeight: 700, fontSize: 14, color: C.text, margin: '0 0 3px' }}>{shoe.name}</p>
        <p style={{ fontFamily: font.body, fontSize: 12, color: C.muted, margin: '0 0 14px' }}>{shoe.colorway}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 16, color: C.text }}>{shoe.price}</span>
          <button style={{
            background: 'rgba(217,255,63,0.1)', color: C.accent,
            border: '1px solid rgba(217,255,63,0.2)', borderRadius: 8, padding: '5px 14px',
            fontFamily: font.body, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Track</button>
        </div>
      </div>
    </div>
  )
}

// ─── Trending ──────────────────────────────────────────────────────────────
function TrendingSection() {
  const { isMobile, isTablet } = useBreakpoint()
  const cols = isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'
  return (
    <section style={{ background: C.bg, padding: isMobile ? '40px 16px 48px' : '72px 32px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32,
          flexWrap: 'wrap', gap: 12,
        }}>
          <h2 style={{
            fontFamily: font.heading, fontSize: isMobile ? 24 : 34, color: C.text,
            margin: 0, letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            TRENDING RIGHT NOW
            <img src={arrowIcon} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
          </h2>
          <button style={{
            fontFamily: font.body, fontSize: 13, fontWeight: 600, color: C.muted,
            background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8, padding: '7px 18px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            View All <ArrowRight size={13} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: isMobile ? 12 : 16 }}>
          {TRENDING.map(shoe => <SneakerCard key={shoe.id} shoe={shoe} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  const { isMobile } = useBreakpoint()
  return (
    <footer style={{ background: '#09090a', borderTop: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '20px 16px' : '24px 32px',
        display: 'flex', alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 8 : 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 24, height: 24, background: C.accent, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={13} color="#000" fill="#000" />
          </div>
          <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 15, color: C.text }}>Sole</span>
        </div>
        <span style={{ fontFamily: font.body, fontSize: 13, color: '#282828' }}>
          © 2025 Sole. Built for sneakerheads.
        </span>
      </div>
    </footer>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────
const API = 'https://titanium-deviation-newcastle-pupils.trycloudflare.com'

export default function Home() {
  const [url, setUrl]                               = useState('')
  const [loading, setLoading]                       = useState(false)
  const [scrapedShoe, setScrapedShoe]               = useState(null)
  const [collections, setCollections]               = useState([])
  const [selectedCollection, setSelectedCollection] = useState('')
  const [saving, setSaving]                         = useState(false)

  const isLoggedIn = !!localStorage.getItem('access')

  useEffect(() => {
    if (!isLoggedIn) return
    fetch(`${API}/api/collections/`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })
      .then(r => r.json()).then(setCollections).catch(() => {})
  }, [isLoggedIn])

  const handleAdd = async () => {
    if (!url.trim() || loading) return
    setScrapedShoe(null)
    setSelectedCollection('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/scrape/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), force: false }),
      })
      const data = await res.json()
      if (res.ok) { setScrapedShoe(data); setUrl('') }
    } catch (err) { console.error('Scrape error:', err) }
    finally { setLoading(false) }
  }

  const handleSaveToCollection = async () => {
    if (!selectedCollection || !scrapedShoe || saving) return
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/collections/${selectedCollection}/shoes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access')}` },
        body: JSON.stringify({ shoe_id: scrapedShoe.id }),
      })
      if (res.ok) {
        setScrapedShoe(null)
        setSelectedCollection('')
        setCollections(prev => prev.map(c => c.id === Number(selectedCollection) ? { ...c, shoe_count: c.shoe_count + 1 } : c))
      }
    } finally { setSaving(false) }
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Navbar />
      <HeroSection
        url={url} setUrl={setUrl} onAdd={handleAdd} loading={loading}
        scrapedShoe={scrapedShoe} collections={collections}
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
        onSaveToCollection={handleSaveToCollection}
        saving={saving} onDismiss={() => setScrapedShoe(null)}
      />
      <FeaturesRow />
      {/* <TrendingSection /> */}
      <Footer />
    </div>
  )
}
