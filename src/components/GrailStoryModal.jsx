import { useRef, useState, useEffect } from 'react'
import { toPng } from 'html-to-image'
import { X, Download, Share2, Smartphone } from 'lucide-react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import GrailStoryCard from './GrailStoryCard'

const font = { body: "'Space Grotesk', sans-serif" }

const CARD_W = 1080
const CARD_H = 1920

const isMobile = typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

const KEYFRAMES = `
@keyframes sole-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.08); }
}
`

function waitForImages(node) {
  const images = Array.from(node.querySelectorAll('img'))
  if (images.length === 0) return Promise.resolve()

  return Promise.allSettled(images.map(img => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve()

    return new Promise(resolve => {
      const done = () => {
        img.removeEventListener('load', done)
        img.removeEventListener('error', done)
        resolve()
      }
      img.addEventListener('load', done, { once: true })
      img.addEventListener('error', done, { once: true })
    })
  }))
}

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)

const ZapIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#000" stroke="none">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
  </svg>
)

export default function GrailStoryModal({ grail, onClose }) {
  const cardRef  = useRef(null)
  const { w }    = useBreakpoint()

  // Responsive preview dimensions — fit within the modal on narrow screens
  const modalW   = Math.min(w < 640 ? w - 24 : 440, 440)
  const previewW = Math.min(360, modalW - 48)
  const scale    = previewW / CARD_W
  const previewH = Math.round(CARD_H * scale)

  const [step, setStep]         = useState('pick')
  const [cardReady, setReady]   = useState(false)
  const [exporting, setExp]     = useState(false)
  const [notice, setNotice]     = useState({ text: '', error: false })

  const clearNotice = () => setNotice({ text: '', error: false })

  // Give images and fonts time to settle before revealing the card
  useEffect(() => {
    if (step !== 'preview') return
    setReady(false)
    const t = setTimeout(() => setReady(true), 900)
    return () => clearTimeout(t)
  }, [step])

  const getDataUrl = async () => {
    if (!cardRef.current) throw new Error('Card ref not ready.')
    await waitForImages(cardRef.current)
    return toPng(cardRef.current, { pixelRatio: 2, cacheBust: true, width: CARD_W, height: CARD_H })
  }

  const handleDownload = async () => {
    setExp(true)
    clearNotice()
    try {
      const url  = await getDataUrl()
      const link = document.createElement('a')
      link.download = `sole-grail-${grail.id}.png`
      link.href = url
      link.click()
    } catch {
      setNotice({ text: 'Could not create the story card. Try again.', error: true })
    } finally {
      setExp(false)
    }
  }

  const handleShare = async () => {
    setExp(true)
    clearNotice()
    try {
      const dataUrl = await getDataUrl()
      const res     = await fetch(dataUrl)
      const blob    = await res.blob()
      const file    = new File([blob], `sole-grail-${grail.id}.png`, { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: grail.name, text: 'Check out my grail on Sole' })
      } else {
        const link = document.createElement('a')
        link.download = file.name
        link.href = dataUrl
        link.click()
        setNotice({ text: 'Image downloaded. Open Instagram and add it to your story.', error: false })
      }
    } catch (e) {
      if (e?.name === 'AbortError') return
      try {
        const url  = await getDataUrl()
        const link = document.createElement('a')
        link.download = `sole-grail-${grail.id}.png`
        link.href = url
        link.click()
        setNotice({ text: 'Image downloaded. Open Instagram and add it to your story.', error: false })
      } catch {
        setNotice({ text: 'Could not create the story card. Try again.', error: true })
      }
    } finally {
      setExp(false)
    }
  }

  const busy = exporting || !cardReady

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: w < 640 ? '16px' : 0,
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#0d0d0d',
            border: '1px solid #222',
            borderRadius: 20,
            width: modalW,
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            overflow: 'hidden',
          }}
        >

          {/* ── Header ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {step === 'preview' && (
                <button
                  onClick={() => { setStep('pick'); clearNotice() }}
                  style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0, fontSize: 18, lineHeight: 1 }}
                >
                  ←
                </button>
              )}
              <h2 style={{ fontFamily: font.body, fontWeight: 700, fontSize: 16, color: '#fff', margin: 0 }}>
                {step === 'pick' ? 'Share Grail' : 'Your Grail Drop'}
              </h2>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          {/* ── Pick step ── */}
          {step === 'pick' && (
            <div style={{ padding: '20px 24px 24px', display: 'flex', gap: 14 }}>

              {/* Instagram Story */}
              <button
                onClick={() => setStep('preview')}
                style={{
                  flex: 1, background: '#181818', position: 'relative',
                  border: '1px solid rgba(217,255,63,0.3)',
                  borderRadius: 14, padding: '20px 14px',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#202020'; e.currentTarget.style.borderColor = 'rgba(217,255,63,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#181818'; e.currentTarget.style.borderColor = 'rgba(217,255,63,0.3)' }}
              >
                {!isMobile && (
                  <span style={{
                    position: 'absolute', top: 10, right: 10,
                    fontFamily: font.body, fontSize: 10, fontWeight: 700,
                    background: 'rgba(217,255,63,0.1)', color: '#D9FF3F',
                    border: '1px solid rgba(217,255,63,0.22)',
                    borderRadius: 6, padding: '2px 7px', letterSpacing: '0.5px',
                  }}>
                    MOBILE
                  </span>
                )}
                <div style={{
                  width: 44, height: 76, borderRadius: 8,
                  background: 'rgba(217,255,63,0.1)',
                  border: '1px solid rgba(217,255,63,0.25)',
                  margin: '0 auto 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <InstagramIcon />
                </div>
                <p style={{ fontFamily: font.body, fontWeight: 700, fontSize: 14, color: '#fff', margin: '0 0 4px' }}>
                  Instagram Story
                </p>
                <p style={{ fontFamily: font.body, fontSize: 12, color: '#666', margin: 0 }}>
                  {isMobile ? '9:16 share card' : 'Download or share on mobile'}
                </p>
              </button>

              {/* Post — coming soon */}
              <div style={{
                flex: 1, background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: 14, padding: '20px 14px',
                textAlign: 'center', opacity: 0.4,
                cursor: 'not-allowed',
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 8,
                  background: '#1a1a1a', border: '1px solid #222',
                  margin: '0 auto 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <InstagramIcon />
                </div>
                <p style={{ fontFamily: font.body, fontWeight: 700, fontSize: 14, color: '#fff', margin: '0 0 4px' }}>Post</p>
                <p style={{ fontFamily: font.body, fontSize: 12, color: '#555', margin: 0 }}>Coming soon</p>
              </div>
            </div>
          )}

          {/* ── Preview step ── */}
          {step === 'preview' && (
            <div style={{ padding: '16px 24px 24px' }}>

              {/* Card preview */}
              <div style={{
                width: previewW, height: previewH,
                margin: '0 auto 20px',
                borderRadius: 14, overflow: 'hidden',
                border: '1px solid #222',
                position: 'relative', flexShrink: 0,
              }}>
                <div style={{
                  width: CARD_W, height: CARD_H,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  position: 'absolute', top: 0, left: 0,
                }}>
                  <GrailStoryCard ref={cardRef} grail={grail} />
                </div>

                {/* Loading skeleton */}
                {!cardReady && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: '#0d0d0d', borderRadius: 14, zIndex: 10,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 14,
                  }}>
                    <div style={{
                      width: 52, height: 52, background: '#D9FF3F', borderRadius: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: 'sole-pulse 1.4s ease-in-out infinite',
                    }}>
                      <ZapIcon />
                    </div>
                    <p style={{
                      fontFamily: font.body, fontSize: 13, fontWeight: 600,
                      color: '#444', margin: 0, letterSpacing: '0.3px',
                    }}>
                      Preparing your card…
                    </p>
                  </div>
                )}
              </div>

              {/* Notice */}
              {notice.text && (
                <p style={{
                  fontFamily: font.body, fontSize: 12,
                  color: notice.error ? '#f87171' : '#A1A1AA',
                  margin: '0 0 14px', textAlign: 'center', lineHeight: 1.55,
                }}>
                  {notice.text}
                </p>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleDownload}
                  disabled={busy}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    background: '#1a1a1a', border: '1px solid #2a2a2a',
                    borderRadius: 10, padding: '11px 0',
                    fontFamily: font.body, fontSize: 13, fontWeight: 600, color: '#fff',
                    cursor: busy ? 'not-allowed' : 'pointer',
                    opacity: busy ? 0.45 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  <Download size={14} />
                  {exporting ? 'Exporting…' : 'Download'}
                </button>

                {isMobile ? (
                  <button
                    onClick={handleShare}
                    disabled={busy}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      background: '#D9FF3F', border: 'none',
                      borderRadius: 10, padding: '11px 0',
                      fontFamily: font.body, fontSize: 13, fontWeight: 700, color: '#000',
                      cursor: busy ? 'not-allowed' : 'pointer',
                      opacity: busy ? 0.45 : 1,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    <Share2 size={14} />
                    {exporting ? 'Exporting…' : 'Share'}
                  </button>
                ) : (
                  <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: 'rgba(217,255,63,0.05)',
                    border: '1px solid rgba(217,255,63,0.15)',
                    borderRadius: 10, padding: '11px 10px',
                    fontFamily: font.body, fontSize: 12, fontWeight: 600,
                    color: '#D9FF3F', textAlign: 'center',
                  }}>
                    <Smartphone size={13} style={{ flexShrink: 0 }} />
                    Open on mobile to share
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
