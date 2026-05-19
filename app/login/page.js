'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Zap, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      router.push('/dashboard');
    } catch { setError('Network error — please try again.'); }
    finally { setLoading(false); }
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '11px 12px 11px 38px', color: 'var(--text-primary)',
    fontSize: '0.9rem', outline: 'none',
  };

  return (
    <div className="auth-grid" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-primary)' }}>

      {/* Form panel */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'clamp(24px,6vw,56px)', background: 'linear-gradient(135deg,rgba(0,212,255,0.04),rgba(124,58,237,0.06))', borderRight: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>TechPulse</span>
          </Link>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2rem)', fontWeight: 800, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '0.9rem' }}>Sign in to continue your learning journey.</p>

          {error && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 8, padding: '11px 14px', marginBottom: 18, color: '#F43F5E', fontSize: '0.875rem' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 5, letterSpacing: '0.04em' }}>EMAIL</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 5, letterSpacing: '0.04em' }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 38 }} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', color: '#fff', border: 'none',
              borderRadius: 9, padding: '13px', fontWeight: 600, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}>
              {loading ? 'Signing in…' : <>{`Sign In`} <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            No account?{' '}
            <Link href="/signup" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 500 }}>Create one free</Link>
          </p>
        </div>
      </div>

      {/* Visual panel — hidden on mobile */}
      <div className="auth-visual" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 60% 40%,rgba(124,58,237,0.3),transparent 60%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>
            <span className="gradient-text">10+ courses.</span><br />Real skills.
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cybersecurity · AI · Cloud · Open Source</p>
        </div>
      </div>
    </div>
  );
}
