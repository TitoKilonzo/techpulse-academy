'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Zap, AlertCircle, ArrowRight } from 'lucide-react';

const LOGIN_IMG  = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80';
const LOGIN_IMG2 = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1000&q=80';

export default function LoginPage() {
  const router = useRouter();
  const [form,   setForm]   = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error,  setError]  = useState('');
  const [busy,   setBusy]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
        setBusy(false);
        return;
      }
      /* Instant navigation — replace so Back doesn't return to login */
      router.replace('/dashboard');
    } catch {
      setError('Network error — please try again.');
      setBusy(false);
    }
  }

  const inputStyle = {
    width: '100%',
    background: '#fff',
    border: '1.5px solid #E5E7EB',
    borderRadius: 9,
    padding: '12px 12px 12px 40px',
    color: '#111827',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <div className="auth-grid" style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: '#fff',
    }}>

      {/* ── Form Panel ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(24px,6vw,60px)',
        borderRight: '1px solid #F3F4F6',
      }}>
        <div style={{ maxWidth: 420, width: '100%' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 44 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#F97316,#C2410C)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(249,115,22,0.35)' }}>
              <Zap size={17} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>TechPulse</span>
          </Link>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem,4vw,2.1rem)', fontWeight: 800, marginBottom: 6, color: '#111827' }}>Welcome back</h1>
          <p style={{ color: '#6B7280', marginBottom: 32, fontSize: '0.92rem' }}>Sign in to continue your learning journey.</p>

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.22)', borderRadius: 9, padding: '11px 14px', marginBottom: 20, color: '#DC2626', fontSize: '0.875rem' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', marginBottom: 6, letterSpacing: '0.05em', fontWeight: 600 }}>EMAIL</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', marginBottom: 6, letterSpacing: '0.05em', fontWeight: 600 }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit — instant (no spinner text) */}
            <button
              type="submit"
              disabled={busy}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: busy ? '#FDA974' : 'linear-gradient(135deg,#F97316,#C2410C)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '14px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: busy ? 'default' : 'pointer',
                boxShadow: busy ? 'none' : '0 4px 14px rgba(249,115,22,0.35)',
                transition: 'all 0.2s',
              }}
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: '#9CA3AF' }}>
            No account?{' '}
            <Link href="/signup" style={{ color: '#F97316', textDecoration: 'none', fontWeight: 600 }}>Create one free</Link>
          </p>
        </div>
      </div>

      {/* ── Visual Panel (hidden on mobile) ── */}
      <div className="auth-visual" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={LOGIN_IMG}
          alt="People learning technology together"
          loading="eager"
          sizes="50vw"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Orange gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(194,65,12,0.82) 0%,rgba(249,115,22,0.70) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '40px 32px', maxWidth: 400 }}>
          {/* Floating stat cards */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
            {[['10+','Courses'],['57+','Lessons'],['Free','Forever']].map(([v,l]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '12px 18px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 12 }}>
            Real skills.<br />Real projects.
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Cybersecurity · AI · Cloud · Open Source
          </p>
        </div>
      </div>
    </div>
  );
}
