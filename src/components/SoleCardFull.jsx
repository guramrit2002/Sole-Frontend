import { forwardRef } from 'react'

const SoleCardFull = forwardRef(function SoleCardFull({
  username = '@kicksjunkie',
  isActive = true,
  personalityTitle = 'Hype Architect',
  personalityDesc = 'Moves with intention, never the crowd',
  avatar = null,
  kicks = [],
  tags = [],
}, ref) {
  return (
    <div
      ref={ref}
      style={{
        width: 360,
        backgroundColor: '#0c0e18',
        border: '2px solid #2dd4bf',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#ffffff',
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
        <span style={{
          fontSize: 13,
          fontWeight: 900,
          color: '#2dd4bf',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          SOLE.ID
        </span>
        {isActive && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>Active</span>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 20px' }}>
        {avatar ? (
          <img
            src={avatar}
            alt=""
            style={{ height: 120, objectFit: 'contain' }}
          />
        ) : (
          <div style={{ width: 100, height: 100, background: '#12142a', borderRadius: 16 }} />
        )}
      </div>

      {/* Identity */}
      <div style={{ padding: '0 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{username}</span>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            background: '#4c1d95',
            color: '#d8b4fe',
            padding: '3px 10px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
          }}>
            {personalityTitle}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{personalityDesc}</p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#1a1d2e', margin: '0 20px' }} />

      {/* Equipped Kicks */}
      <div style={{ padding: '14px 20px 12px' }}>
        <p style={{
          fontSize: 10,
          color: '#4b5563',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          margin: '0 0 12px',
        }}>
          Equipped Kicks
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {kicks.map((kick, i) => (
            <div
              key={i}
              style={{ background: '#12142a', borderRadius: 12, padding: 10 }}
            >
              {kick.image ? (
                <img
                  src={kick.image}
                  alt={kick.name}
                  style={{
                    width: '100%',
                    height: 60,
                    objectFit: 'contain',
                    background: '#1c1f38',
                    borderRadius: 8,
                    marginBottom: 8,
                    display: 'block',
                  }}
                />
              ) : (
                <div style={{ width: '100%', height: 60, background: '#1c1f38', borderRadius: 8, marginBottom: 8 }} />
              )}
              <p style={{ fontSize: 12, fontWeight: 600, color: '#ffffff', margin: '0 0 2px' }}>{kick.name}</p>
              <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>{kick.brand}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px 16px',
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

export default SoleCardFull
