import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Mail, ArrowRight, ShieldCheck, RotateCcw } from 'lucide-react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import loginLeft from '../assets/login_left.png'

const C = {
  bg: '#050505', surface: '#0D0D0D', accent: '#D9FF00',
  text: '#FFFFFF', muted: '#9B9B9B', border: '#1A1A1A', inputBg: '#090909',
}

const font = {
  heading: "'Bebas Neue', sans-serif",
  body: "'Space Grotesk', sans-serif",
}

// ─── Left showcase panel ─────────────────────────────────────────────────────
function ShowcasePanel() {
  const { isMobile, isTablet } = useBreakpoint()
  if (isMobile) return null
  return (
    <div style={{ width: isTablet ? '45%' : '55%', minHeight: '100vh', position: 'relative', flexShrink: 0 }}>
      <img src={loginLeft} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', top: 28, left: 32, display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="#000" fill="#000" />
        </div>
        <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 17, color: C.text }}>Sole</span>
      </div>
    </div>
  )
}

// ─── OTP input group ────────────────────────────────────────────────────────
function OtpInput({ value, onChange }) {
  const { isMobile } = useBreakpoint()
  const refs = useRef([])
  const slot = (i) => value[i] || ''

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      const arr = Array.from({ length: 6 }, (_, j) => slot(j))
      arr[i] = ''
      onChange(arr.join(''))
      if (i > 0) refs.current[i - 1]?.focus()
    }
  }

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const arr = Array.from({ length: 6 }, (_, j) => slot(j))
    arr[i] = char
    onChange(arr.join(''))
    if (char && i < 5) refs.current[i + 1]?.focus()
  }

  return (
    <div style={{ display: 'flex', gap: isMobile ? 7 : 10 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={slot(i)}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKey(i, e)}
          style={{
            width: isMobile ? 40 : 48, height: isMobile ? 48 : 56,
            background: C.inputBg,
            border: `1px solid ${slot(i) ? C.accent : C.border}`,
            borderRadius: 10, textAlign: 'center',
            fontFamily: font.body, fontSize: isMobile ? 18 : 22, fontWeight: 700,
            color: 'white', outline: 'none', transition: 'border-color 0.15s',
            flex: 1,
          }}
        />
      ))}
    </div>
  )
}

// ─── Auth panel ─────────────────────────────────────────────────────────────
function AuthPanel() {
  const navigate = useNavigate()
  const { isMobile, isTablet } = useBreakpoint()
  const [step, setStep]       = useState('email')
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const callLogin = async () => {
    const res = await fetch('https://titanium-deviation-newcastle-pupils.trycloudflare.com/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    })
    const data = await res.json()
    return { ok: res.ok, status: res.status, data }
  }

  const handleContinue = async () => {
    if (!email.trim() || loading) return
    setError('')
    setLoading(true)
    try {
      const { ok, status, data } = await callLogin()
      if (ok) { setStep('otp'); setResendTimer(30) }
      else if (status === 404 || data?.detail?.toLowerCase().includes('not found') || data?.error?.toLowerCase().includes('not found')) {
        setStep('not-found')
      } else {
        setError(data?.detail || data?.error || 'Something went wrong. Try again.')
      }
    } catch { setError('Could not reach the server. Check your connection.') }
    finally { setLoading(false) }
  }

  const handleCreateUser = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('https://titanium-deviation-newcastle-pupils.trycloudflare.com/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (res.ok) { setStep('otp'); setResendTimer(30) }
      else { setError(data?.detail || data?.error || 'Could not create account.') }
    } catch { setError('Could not reach the server. Check your connection.') }
    finally { setLoading(false) }
  }

  const handleVerify = async () => {
    if (otp.length < 6 || loading) return
    setLoading(true)
    try {
      const res = await fetch('https://titanium-deviation-newcastle-pupils.trycloudflare.com/api/auth/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data?.detail || data?.error || 'Invalid code.'); return }
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      navigate('/')
    } catch { setError('Could not reach the server.') }
    finally { setLoading(false) }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setError('')
    setLoading(true)
    try { await callLogin(); setResendTimer(30) }
    catch { setError('Could not resend code.') }
    finally { setLoading(false) }
  }

  const panelWidth   = isMobile ? '100%' : isTablet ? '55%' : '45%'
  const sidePadding  = isMobile ? '24px' : '56px'

  return (
    <div style={{
      width: panelWidth, minHeight: '100vh', background: '#000000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: `48px ${sidePadding}`, boxSizing: 'border-box',
      borderLeft: isMobile ? 'none' : '1px solid rgba(217,255,0,0.08)',
    }}>
      {/* Mobile logo */}
      {isMobile && (
        <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#000" fill="#000" />
          </div>
          <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 17, color: C.text }}>Sole</span>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{
          width: 48, height: 48,
          background: 'rgba(217,255,0,0.1)', border: '1px solid rgba(217,255,0,0.2)',
          borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28, boxShadow: '0 0 20px rgba(217,255,0,0.1)',
        }}>
          <Zap size={22} color={C.accent} fill={C.accent} />
        </div>

        <h1 style={{ fontFamily: font.body, fontSize: 26, fontWeight: 700, color: C.text, margin: '0 0 10px', lineHeight: 1.2 }}>
          {step === 'email'     && <>Welcome to <span style={{ color: C.accent }}>Sole</span></>}
          {step === 'not-found' && <>No account <span style={{ color: C.accent }}>found</span></>}
          {step === 'otp'       && <>Check your <span style={{ color: C.accent }}>inbox</span></>}
        </h1>

        <p style={{ fontFamily: font.body, fontSize: 14, color: C.muted, margin: '0 0 32px', lineHeight: 1.6 }}>
          {step === 'email'     && "Enter your email and we'll send you a one-time code to continue."}
          {step === 'not-found' && <>{`No account exists for `}<strong style={{ color: C.text }}>{email}</strong>. Would you like to create one?</>}
          {step === 'otp'       && <>We sent a 6-digit code to <strong style={{ color: C.text }}>{email}</strong>. Enter it below to sign in.</>}
        </p>

        {error && (
          <div style={{
            background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            fontFamily: font.body, fontSize: 13, color: '#ff6b6b',
          }}>
            {error}
          </div>
        )}

        {step === 'email' ? (
          <>
            <label style={{ fontFamily: font.body, fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Email Address
            </label>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Mail size={16} color={C.muted} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleContinue()}
                placeholder="hi@example.com"
                style={{
                  width: '100%', height: 52, background: C.inputBg,
                  border: `1px solid ${C.border}`, borderRadius: 12,
                  paddingLeft: 44, paddingRight: 16,
                  fontFamily: font.body, fontSize: 14, color: C.text,
                  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = C.accent}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
            <button
              onClick={handleContinue}
              style={{
                width: '100%', height: 52,
                background: !email.trim() ? '#2a2a0a' : C.accent,
                color: '#000', border: 'none', borderRadius: 12,
                fontFamily: font.body, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.75 : 1, letterSpacing: '0.5px', textTransform: 'uppercase',
                transition: 'background 0.15s, opacity 0.15s',
              }}
            >
              {loading ? 'Checking…' : 'Continue'}
              {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
              <ShieldCheck size={14} color={C.muted} />
              <span style={{ fontFamily: font.body, fontSize: 12, color: C.muted }}>Secure &amp; private. We never share your email.</span>
            </div>
          </>
        ) : step === 'not-found' ? (
          <>
            <button
              onClick={handleCreateUser}
              style={{
                width: '100%', height: 52, background: C.accent, color: '#000',
                border: 'none', borderRadius: 12, fontFamily: font.body, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.75 : 1, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 12,
              }}
            >
              {loading ? 'Creating…' : 'Create Account'}
              {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
            </button>
            <button
              onClick={() => { setStep('email'); setError('') }}
              style={{
                width: '100%', height: 52, background: 'transparent', color: C.muted,
                border: `1px solid ${C.border}`, borderRadius: 12,
                fontFamily: font.body, fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px',
              }}
            >
              Use a different email
            </button>
          </>
        ) : (
          <>
            <OtpInput value={otp} onChange={setOtp} />
            <button
              onClick={handleVerify}
              style={{
                width: '100%', height: 52,
                background: otp.length < 6 ? '#2a2a0a' : C.accent,
                color: '#e7e7e7', border: 'none', borderRadius: 12,
                fontFamily: font.body, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.75 : 1, marginTop: 20,
                textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'background 0.15s',
              }}
            >
              Verify Code
              {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              <button
                onClick={() => { setStep('email'); setOtp('') }}
                style={{ background: 'none', border: 'none', padding: 0, fontFamily: font.body, fontSize: 13, color: C.muted, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Change email
              </button>
              <button
                onClick={handleResend}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  fontFamily: font.body, fontSize: 13, color: resendTimer > 0 ? C.muted : C.accent,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <RotateCcw size={13} />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function Login() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, position: 'relative' }}>
      <ShowcasePanel />
      <AuthPanel />
    </div>
  )
}
