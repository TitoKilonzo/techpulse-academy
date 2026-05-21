'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, Zap, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

const SIGNUP_IMG = 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1000&q=80';

function pwCheck(p) {
  if (p.length < 8)          return 'Password must be at least 8 characters.';
  if (p.length > 128)        return 'Password too long (max 128).';
  if (!/[A-Z]/.test(p))      return 'Password must contain at least one uppercase letter.';
  if (!/[0-9!@#$%^*]/.test(p)) return 'Must include a number or special character (!@#$%^*).';
  return null;
}

export default function SignupPage() {
  const router = useRouter();
  const [form,   setForm]   = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error,  setError]  = useState('');
  const [busy,   setBusy]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setError('');
    const err = pwCheck(form.password);
    if (err) { setError(err); return; }
    setBusy(true);
    try {
      const res  = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Signup failed'); setBusy(false); return; }
      router.replace('/dashboard');
    } catch {
      setError('Network error — please try again.');
      setBusy(false);
    }
  }

  const inputStyle = {
    width: '100%', background: '#fff', border: '1.5px solid #E5E7EB',
    borderRadius: 9, padding: '12px 12px 12px 40px', color: '#111827',
    fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.15s',
  };

  const FIELDS = [
    { key: 'name',     label: 'FULL NAME', type: 'text',     Icon: User, placeholder: 'Your full name',          autocomplete: 'name' },
    { key: 'email',    label: 'EMAIL',     type: 'email',    Icon: Mail, placeholder: 'you@example.com',         autocomplete: 'email' },
    { key: 'password', label: 'PASSWORD',  type: 'password', Icon: Lock, placeholder: 'Min 8 chars, 1 uppercase', autocomplete: 'new-password' },
  ];

  return (
    <div className="auth-grid" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff' }}>

      {/* ── Visual Panel (left side) ── */}
      <div className="auth-visual" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={SIGNUP_IMG}
          alt="Developer working at a modern desk"
          loading="eager"
          sizes="50vw"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(194,65,12,0.85) 0%,rgba(249,115,22,0.72) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '40px 32px', maxWidth: 400 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 20 }}>
            Join thousands of<br />tech learners.
          </div>
          {['Free forever. No credit card.','Access all 10+ courses instantly.','Track your progress as you learn.'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, justifyContent: 'center' }}>
              <CheckCircle size={16} color="#FED7AA" />
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.88rem' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'clamp(24px,6vw,60px)', borderLeft: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#F97316,#C2410C)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(249,115,22,0.35)' }}>
              <Zap size={17} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>TechPulse</span>
          </Link>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2rem)', fontWeight: 800, marginBottom: 6, color: '#111827' }}>Create your account</h1>
          <p style={{ color: '#6B7280', marginBottom: 28, fontSize: '0.92rem' }}>Free access to all courses. No credit card needed.</p>

          {error && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.22)', borderRadius: 9, padding: '11px 14px', marginBottom: 20, color: '#DC2626', fontSize: '0.875rem' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {FIELDS.map(({ key, label, type, Icon, placeholder, autocomplete }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', marginBottom: 6, letterSpacing: '0.05em', fontWeight: 600 }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input
                    type={key === 'password' ? (showPw ? 'text' : 'password') : type}
                    required
                    autoComplete={autocomplete}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ ...inputStyle, paddingRight: key === 'password' ? 40 : 12 }}
                  />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={busy}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10,
                background: busy ? '#FDA974' : 'linear-gradient(135deg,#F97316,#C2410C)',
                color: '#fff', border: 'none', borderRadius: 10, padding: '14px',
                fontWeight: 700, fontSize: '0.95rem',
                cursor: busy ? 'default' : 'pointer',
                boxShadow: busy ? 'none' : '0 4px 14px rgba(249,115,22,0.35)',
                transition: 'all 0.2s',
              }}
            >
              Create Account <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: '#9CA3AF' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#F97316', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
