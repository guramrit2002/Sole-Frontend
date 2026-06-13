import { forwardRef } from 'react'
import { Zap, Footprints } from 'lucide-react'

import graffiti1 from '../assets/graffiti/graffiti_1.png'
import graffiti2 from '../assets/graffiti/graffiti_2.png'
import graffiti3 from '../assets/graffiti/graffiti_3.png'

const C = {
  bg:      '#050505',
  surface: '#101010',
  accent:  '#D9FF3F',
  text:    '#FFFFFF',
  muted:   '#A1A1AA',
  border:  '#1F1F1F',
}

const font = {
  heading: "'Bebas Neue', sans-serif",
  body:    "'Space Grotesk', sans-serif",
}

function formatWorth(val) {
  if (!val) return '$0'
  return '$' + Number(val).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function formatPrice(price) {
  if (!price) return '—'
  const s = String(price).trim()
  if (s.startsWith('$')) return s
  const n = parseFloat(s.replace(/[^\d.]/g, ''))
  return isNaN(n) ? s : '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const GrailStoryCard = forwardRef(function GrailStoryCard({ grail }, ref) {
  const heroShoe    = grail.shoes?.find(s => s.image_s3) || null
  const featured    = grail.shoes?.slice(0, 3) || []
  const visibleTags = grail.tags?.slice(0, 4) || []
  const extraTags   = Math.max(0, (grail.tags?.length || 0) - 4)
  const titleSize   = (grail.name || '').length > 14 ? 82 : 112

  return (
    <div
      ref={ref}
      style={{
        width: 1080, height: 1920,
        background: C.bg,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 44,
        fontFamily: font.body,
      }}
    >
      {/* Neon radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 45% at 50% 36%, rgba(217,255,63,0.2) 0%, transparent 68%)',
      }} />

      {/* Graffiti overlays */}
      {[
        { src: graffiti1, top: 180,  right: -70,  size: 620, opacity: 0.32, rotate: '-8deg'  },
        { src: graffiti2, top: 820,  right: -40,  size: 500, opacity: 0.22, rotate:  '6deg'  },
        { src: graffiti3, bottom: 180, right: 80, size: 460, opacity: 0.28, rotate: '-6deg'  },
      ].map(({ src, size, opacity, rotate, ...pos }, i) => (
        <div key={i} aria-hidden style={{
          position: 'absolute', ...pos,
          width: size, height: size,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundColor: C.accent,
          backgroundBlendMode: 'multiply',
          mixBlendMode: 'screen',
          opacity,
          transform: `rotate(${rotate})`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── Brand row ── */}
      <div style={{
        position: 'absolute', top: 72, left: 72, right: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 54, height: 54, background: C.accent, borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={30} color="#000" fill="#000" />
          </div>
          <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 28, color: C.text }}>SOLE</span>
        </div>
        <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 22, color: C.accent, letterSpacing: '2px' }}>
          GRAIL DROP
        </span>
      </div>

      {/* ── Title section ── */}
      <div style={{ position: 'absolute', top: 168, left: 72, right: 72 }}>
        <p style={{
          fontFamily: font.body, fontWeight: 700, fontSize: 22,
          color: C.accent, letterSpacing: '3px',
          margin: '0 0 12px', textTransform: 'uppercase',
        }}>
          MY GRAIL
        </p>
        <h1 style={{
          fontFamily: font.heading, fontSize: titleSize,
          lineHeight: 0.9, color: C.text,
          margin: '0 0 22px', textTransform: 'uppercase', letterSpacing: '2px',
          wordBreak: 'break-word',
        }}>
          {grail.name}
        </h1>
        {grail.description && (
          <p style={{
            fontFamily: font.body, fontSize: 28, color: C.muted,
            margin: 0, lineHeight: 1.35,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {grail.description}
          </p>
        )}
      </div>

      {/* ── Hero shoe ── */}
      <div style={{
        position: 'absolute', top: 520, left: 72, right: 72, height: 470,
        background: '#F3F3EF', borderRadius: 36,
        border: '2px solid rgba(217,255,63,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {heroShoe?.image_s3 ? (
          <img
            src={heroShoe.image_s3}
            alt={heroShoe.name}
            crossOrigin="anonymous"
            style={{
              width: '100%', height: '100%', objectFit: 'contain',
              filter: 'drop-shadow(0 36px 80px rgba(0,0,0,0.45))',
            }}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Footprints size={80} color="#bbb" />
            <p style={{ fontFamily: font.body, fontSize: 24, color: '#999', margin: '12px 0 0' }}>NO SHOES YET</p>
          </div>
        )}
      </div>

      {/* ── Stats row ── */}
      <div style={{
        position: 'absolute', top: 1030, left: 72, right: 72,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
      }}>
        {[
          { label: 'TOTAL SHOES', value: String(grail.total_shoes || 0), accent: false },
          { label: 'TOTAL WORTH', value: formatWorth(grail.total_worth),  accent: true  },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.045)',
            border: '1px solid rgba(217,255,63,0.18)',
            borderRadius: 24, padding: 28,
          }}>
            <p style={{
              fontFamily: font.body, fontSize: 18, color: C.muted,
              margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              {label}
            </p>
            <p style={{
              fontFamily: font.heading, fontSize: 72,
              color: accent ? C.accent : C.text,
              margin: 0, lineHeight: 1,
            }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Featured pairs ── */}
      <div style={{ position: 'absolute', top: 1230, left: 72, right: 72 }}>
        <p style={{
          fontFamily: font.body, fontSize: 18, color: C.muted,
          textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 18px',
        }}>
          FEATURED PAIRS
        </p>
        {featured.length === 0 ? (
          <p style={{ fontFamily: font.body, fontSize: 24, color: C.muted }}>
            Add shoes to build this grail.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {featured.map(shoe => (
              <div key={shoe.id} style={{
                background: '#111111',
                border: `1px solid ${C.border}`,
                borderRadius: 18,
                display: 'flex', alignItems: 'center', gap: 20,
                padding: '18px 22px',
              }}>
                <div style={{
                  width: 84, height: 84, background: '#F3F3EF',
                  borderRadius: 12, flexShrink: 0, overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {shoe.image_s3
                    ? <img src={shoe.image_s3} alt={shoe.name} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Footprints size={32} color="#bbb" />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: font.body, fontWeight: 700, fontSize: 24, color: C.text,
                    margin: '0 0 6px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {shoe.name}
                  </p>
                  <p style={{ fontFamily: font.body, fontSize: 22, color: C.accent, margin: 0 }}>
                    {formatPrice(shoe.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Tags ── */}
      <div style={{
        position: 'absolute', top: 1672, left: 72, right: 72,
        display: 'flex', flexWrap: 'wrap', gap: 12,
      }}>
        {visibleTags.map(tag => (
          <span key={tag} style={{
            fontFamily: font.body, fontWeight: 700, fontSize: 24,
            background: C.accent, color: '#000',
            borderRadius: 10, padding: '8px 20px',
          }}>
            {tag}
          </span>
        ))}
        {extraTags > 0 && (
          <span style={{
            fontFamily: font.body, fontWeight: 700, fontSize: 24,
            background: 'rgba(217,255,63,0.12)', color: C.accent,
            border: '1px solid rgba(217,255,63,0.28)',
            borderRadius: 10, padding: '8px 20px',
          }}>
            +{extraTags}
          </span>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'absolute', bottom: 72, left: 72, right: 72,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: font.body, fontSize: 22, color: C.muted }}>Built on Sole</span>
        <span style={{ fontFamily: font.body, fontSize: 22, color: C.muted }}>sole.app</span>
      </div>
    </div>
  )
})

export default GrailStoryCard
