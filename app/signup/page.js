'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, Zap, AlertCircle, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const pwCheck = (p) => { if(p.length < 8) return 'Password must be at least 8 characters.'; if(p.length > 128) return 'Password too long (max 128).'; if(!/[A-Z]/.test(p)) return 'Password must contain at least one uppercase letter.'; if(!/[0-9!@#$%^*]/.test(p)) return 'Password must contain at least one number or special character.'; return null; }; const pwErr = pwCheck(form.password); if (pwErr) { setError(pwErr); setLoading(false); return; }
    try {
      const res  = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Signup failed'); return; }
      router.push('/dashboard');
    } catch { setError('Network error — please try again.'); }
    finally { setLoading(false); }
  }

  const inputStyle = { width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 12px 11px 38px', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' };
  const FIELDS = [
    { key: 'name',     label: 'FULL NAME', type: 'text',     Icon: User,  placeholder: 'Your full name' },
    { key: 'email',    label: 'EMAIL',     type: 'email',    Icon: Mail,  placeholder: 'you@example.com' },
    { key: 'password', label: 'PASSWORD',  type: 'password', Icon: Lock,  placeholder: 'Min. 8 chars, 1 uppercase, 1 number' },
  ];

  return (
    <div className="auth-grid" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-primary)' }}>
      {/* Visual panel */}
      <div className="auth-visual" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&q=80" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 40% 50%,rgba(0,212,255,0.2),transparent 60%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>
            Join <span className="gradient-text">thousands</span><br />of tech learners.
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Free forever. No credit card.</p>
        </div>
      </div>

      {/* Form panel */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'clamp(24px,6vw,56px)', borderLeft: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>TechPulse</span>
          </Link>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2rem)', fontWeight: 800, marginBottom: 8 }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '0.9rem' }}>Free access to all courses. No credit card needed.</p>

          {error && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 8, padding: '11px 14px', marginBottom: 18, color: '#F43F5E', fontSize: '0.875rem' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {FIELDS.map(({ key, label, type, Icon, placeholder }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 5, letterSpacing: '0.04em' }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={key === 'password' ? (showPw ? 'text' : 'password') : type}
                    required value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ ...inputStyle, paddingRight: key === 'password' ? 38 : 12 }}
                  />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
              background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', color: '#fff', border: 'none',
              borderRadius: 9, padding: '13px', fontWeight: 600, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}>
              {loading ? 'Creating account…' : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
