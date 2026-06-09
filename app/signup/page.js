'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

function checkStrength(p) {
  let score = 0;
  if (p.length > 7) score += 1;
  if (p.length > 12) score += 1;
  if (/[A-Z]/.test(p)) score += 1;
  if (/[0-9]/.test(p)) score += 1;
  if (/[^A-Za-z0-9]/.test(p)) score += 1;
  return score;
}

function pwCheck(p) {
  if (p.length < 8)          return 'Password must be at least 8 characters.';
  if (p.length > 128)        return 'Password too long (max 128).';
  if (!/[A-Z]/.test(p))      return 'Password must contain at least one uppercase letter.';
  if (!/[0-9!@#$%^*]/.test(p)) return 'Must include a number or special character (!@#$%^*).';
  return null;
}

export default function SignupPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [form,   setForm]   = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [busy,   setBusy]   = useState(false);
  
  const strengthScore = checkStrength(form.password);
  
  const getStrengthColor = () => {
    if (strengthScore <= 1) return 'var(--rose)';
    if (strengthScore <= 3) return 'var(--amber)';
    return 'var(--emerald)';
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    
    const err = pwCheck(form.password);
    if (err) { 
      addToast(err, 'warning'); 
      return; 
    }
    
    setBusy(true);
    try {
      const res  = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { 
        addToast(data.error || 'Signup failed', 'error'); 
        setBusy(false); 
        return; 
      }
      addToast('Account created successfully!', 'success');
      router.replace('/dashboard');
    } catch {
      addToast('Network error — please try again.', 'error');
      setBusy(false);
    }
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg-primary)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: '14px 14px 14px 44px', color: 'var(--text-primary)',
    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.15s',
  };

  const FIELDS = [
    { key: 'name',     label: 'FULL NAME', type: 'text',     Icon: User, placeholder: 'Your full name',          autocomplete: 'name' },
    { key: 'email',    label: 'EMAIL ADDRESS', type: 'email', Icon: Mail, placeholder: 'you@example.com',        autocomplete: 'email' },
    { key: 'password', label: 'PASSWORD',  type: 'password', Icon: Lock, placeholder: 'Min 8 chars, 1 uppercase', autocomplete: 'new-password' },
  ];

  return (
    <div className="auth-grid" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1.2fr', background: 'var(--bg-primary)' }}>

      {/* ── Visual Panel ── */}
      <div className="auth-visual" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-dark)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #B45309 0%, #301f11 50%, #1C1917 100%)' }} />
        <div style={{ position: 'absolute', top: '10%', left: '-20%', width: '80%', height: '80%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '70%', height: '70%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,134,12,0.2) 0%, transparent 60%)', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '40px', maxWidth: 480, width: '100%' }}>
          <div className="animate-fade-up" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '40px 32px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 24 }}>
              Join the next generation of tech leaders.
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                'Free forever. No credit card.',
                'Access all premium courses instantly.',
                'Interactive hands-on labs.',
                'Track progress and earn certificates.'
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={14} color="#FCD34D" />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'clamp(24px,6vw,60px)' }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(232,134,12,0.3)' }}>
              <Zap size={20} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>TechPulse</span>
          </Link>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Create an account</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1rem' }}>Free access to all courses. No credit card needed.</p>

          <form onSubmit={handleSubmit}>
            {FIELDS.map(({ key, label, type, Icon, placeholder, autocomplete }) => (
              <div key={key} style={{ marginBottom: key === 'password' ? 8 : 20 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.05em', fontWeight: 600 }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={key === 'password' ? (showPw ? 'text' : 'password') : type}
                    required
                    autoComplete={autocomplete}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ ...inputStyle, paddingRight: key === 'password' ? 44 : 14 }}
                  />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Password Strength Meter */}
            {form.password.length > 0 && (
              <div className="animate-fade-in" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 6, height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ flex: 1, background: i <= strengthScore ? getStrengthColor() : 'var(--border)', transition: 'background 0.3s' }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem', color: getStrengthColor(), fontWeight: 600, textAlign: 'right' }}>
                  {strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Fair' : 'Strong'}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn-primary"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: form.password.length > 0 ? 8 : 24,
                padding: '16px', fontWeight: 700, fontSize: '1.05rem', opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? <Loader2 size={20} className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
