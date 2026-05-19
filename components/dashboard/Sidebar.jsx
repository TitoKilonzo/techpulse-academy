'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, User, LogOut, Zap,
  ShieldCheck, Cloud, BrainCircuit, GitBranch, Cpu, X,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard',         Icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/courses', Icon: BookOpen,        label: 'Courses'   },
  { href: '/dashboard/profile', Icon: User,            label: 'Profile'   },
];

const TRACKS = [
  { href: '/dashboard/courses?cat=cybersecurity', Icon: ShieldCheck,  label: 'Cybersecurity', color: '#F43F5E' },
  { href: '/dashboard/courses?cat=ai',            Icon: BrainCircuit, label: 'AI & Claude',   color: '#A855F7' },
  { href: '/dashboard/courses?cat=cloud',         Icon: Cloud,        label: 'Cloud',         color: '#22D3EE' },
  { href: '/dashboard/courses?cat=opensource',    Icon: GitBranch,    label: 'Open Source',   color: '#10B981' },
  { href: '/dashboard/courses?cat=tech',          Icon: Cpu,          label: 'Tech',          color: '#00D4FF' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <aside className={`dash-sidebar${isOpen ? ' open' : ''}`}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1 }}>TechPulse</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>ACADEMY</div>
          </div>
        </Link>
        {/* Close button — mobile only */}
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, display: 'none' }} className="mobile-close-btn">
          <X size={18} />
        </button>
      </div>

      {/* Main nav */}
      <nav style={{ padding: '14px 10px 6px' }}>
        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 6 }}>NAVIGATION</div>
        {NAV.map(({ href, Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose} className="nav-item" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 8, marginBottom: 2,
              textDecoration: 'none',
              background:  active ? 'rgba(0,212,255,0.1)'        : 'transparent',
              color:       active ? 'var(--cyan)'                 : 'var(--text-secondary)',
              borderLeft:  active ? '2px solid var(--cyan)'       : '2px solid transparent',
              fontWeight:  active ? 600                           : 400,
              fontSize: '0.875rem',
            }}>
              <Icon size={16} />{label}
            </Link>
          );
        })}
      </nav>

      {/* Tracks */}
      <div style={{ padding: '4px 10px' }}>
        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 6, marginTop: 8 }}>TRACKS</div>
        {TRACKS.map(({ href, Icon, label, color }) => (
          <Link key={href} href={href} onClick={onClose} className="sidebar-track-link" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 8, marginBottom: 2,
            textDecoration: 'none', color: 'var(--text-secondary)',
            fontSize: '0.825rem', transition: 'all 0.15s',
          }}>
            <Icon size={14} color={color} />{label}
          </Link>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Logout */}
      <div style={{ padding: 10, borderTop: '1px solid var(--border)' }}>
        <button onClick={logout} className="nav-item" style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: '9px 10px', borderRadius: 8, background: 'transparent',
          border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
          fontSize: '0.875rem', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.08)'; e.currentTarget.style.color = '#F43F5E'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
