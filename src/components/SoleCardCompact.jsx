import { forwardRef } from 'react'

const SoleCardCompact = forwardRef(function SoleCardCompact({
  username = '@sneakerhead42',
  level = 12,
  personalityRank = 'Silhouette Purist',
  personalityDesc = 'Hunts originals. Never follows hype.',
  avatar = null,
  kicks = [],
  tags = [],
}, ref) {
  const words = personalityRank.trim().split(' ')
  const mid = Math.ceil(words.length / 2)
  const line1 = words.slice(0, mid).join(' ')
  const line2 = words.slice(mid).join(' ')

  return (
    <div
      ref={ref}
      style={{
        width: 320,
        backgroundColor: '#0c0e18',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#ffffff',
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 8px' }}>
        <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>{username}</span>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          background: '#4c1d95',
          color: '#c4b5fd',
          padding: '3px 10px',
          borderRadius: 20,
          letterSpacing: '0.5px',
        }}>
          LVL {level}
        </span>
      </div>

      {/* Personality section */}
      <div style={{ position: 'relative', padding: '8px 16px 24px' }}>
        {avatar && (
          <img
            src={avatar}
            alt=""
            style={{
              position: 'absolute',
              right: 12,
              top: 0,
              width: 88,
              height: 88,
              objectFit: 'contain',
            }}
          />
        )}
        <p style={{
          fontSize: 10,
          color: '#9333ea',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          margin: '0 0 6px',
        }}>
          Personality Rank
        </p>
        <h2 style={{
          fontSize: 44,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1,
          margin: '0 0 10px',
          letterSpacing: '-1.5px',
          maxWidth: avatar ? 200 : '100%',
        }}>
          {line1}
          {line2 && <><br />{line2}</>}
        </h2>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{personalityDesc}</p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#1a1d2e', margin: '0 16px' }} />

      {/* Equipped Kicks */}
      <div style={{ padding: '14px 16px 12px' }}>
        <p style={{
          fontSize: 10,
          color: '#4b5563',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          margin: '0 0 10px',
        }}>
          Equipped Kicks
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {kicks.map((kick, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#12142a',
                borderRadius: 12,
                padding: '8px 10px',
              }}
            >
              {kick.image ? (
                <img
                  src={kick.image}
                  alt={kick.name}
                  style={{ width: 64, height: 40, objectFit: 'contain', background: '#1c1f38', borderRadius: 8 }}
                />
              ) : (
                <div style={{ width: 64, height: 40, background: '#1c1f38', borderRadius: 8 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#ffffff',
                  margin: '0 0 2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {kick.name}
                </p>
                <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>{kick.brand}</p>
              </div>
              {kick.owned && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px 14px',
        background: '#090b12',
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                color: '#9ca3af',
                border: '1px solid #1e2235',
                borderRadius: 20,
                padding: '3px 10px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 10, color: '#374151', fontWeight: 700, letterSpacing: '1px' }}>
          sole.id
        </span>
      </div>
    </div>
  )
})

export default SoleCardCompact
