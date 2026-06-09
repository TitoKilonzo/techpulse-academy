'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [form,   setForm]   = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [busy,   setBusy]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Invalid email or password.', 'error');
        setBusy(false);
        return;
      }
      addToast('Welcome back!', 'success');
      router.replace('/dashboard');
    } catch {
      addToast('Network error — please try again.', 'error');
      setBusy(false);
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-primary)',
    border: '1.5px solid var(--border)',
    borderRadius: 12,
    padding: '14px 14px 14px 44px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s',
  };

  return (
    <div className="auth-grid" style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      background: 'var(--bg-primary)',
    }}>

      {/* ── Form Panel ── */}
      <div className="animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(24px,6vw,60px)',
      }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 48 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(232,134,12,0.3)' }}>
              <Zap size={20} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>TechPulse</span>
          </Link>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 40, fontSize: '1rem' }}>Sign in to continue your learning journey.</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.05em', fontWeight: 600 }}>EMAIL ADDRESS</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  style={inputStyle}
                  className="focus-ring"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.05em', fontWeight: 600 }}>
                <span>PASSWORD</span>
                <Link href="#" style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 600, textTransform: 'none', letterSpacing: 'normal' }}>Forgot Password?</Link>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 44 }}
                  className="focus-ring"
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginTop: 32,
                padding: '16px',
                fontWeight: 700,
                fontSize: '1.05rem',
                opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? <Loader2 size={20} className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 700 }}>Create one free</Link>
          </p>
        </div>
      </div>

      {/* ── Visual Panel ── */}
      <div className="auth-visual" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-dark)' }}>
        {/* Abstract Golden Art */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1C1917 0%, #301f11 50%, #B45309 100%)' }} />
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 60%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,134,12,0.3) 0%, transparent 60%)', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '40px', maxWidth: 480, width: '100%' }}>
          {/* Floating Testimonial/Stats */}
          <div className="animate-fade-up" style={{ animationDelay: '200ms', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '32px', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {[1,2,3,4,5].map(i => <Zap key={i} size={16} color="#FBBF24" fill="#FBBF24" />)}
            </div>
            <p style={{ color: '#fff', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, marginBottom: 20 }}>
              &quot;The most practical learning platform I&apos;ve ever used. The hands-on labs make all the difference.&quot;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>A</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Alex Chen</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Security Engineer</div>
              </div>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '400ms', display: 'flex', gap: 16 }}>
            {[['10k+','Students'],['50+','Labs']].map(([v,l]) => (
              <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: '20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#FCD34D', marginBottom: 4 }}>{v}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
