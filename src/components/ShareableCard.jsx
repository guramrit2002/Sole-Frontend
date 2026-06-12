import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'

export default function ShareableCard({ children, filename = 'sole-card' }) {
  const ref = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!ref.current || downloading) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(ref.current, { pixelRatio: 2, cacheBust: true })
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div ref={ref} style={{ display: 'inline-block' }}>
        {children}
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          background: downloading ? '#6b21a8' : '#9333ea',
          color: '#ffffff',
          border: 'none',
          borderRadius: 24,
          padding: '9px 22px',
          fontSize: 13,
          fontWeight: 700,
          cursor: downloading ? 'default' : 'pointer',
          letterSpacing: '0.3px',
          opacity: downloading ? 0.7 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {downloading ? 'Saving…' : 'Download Card'}
      </button>
    </div>
  )
}
