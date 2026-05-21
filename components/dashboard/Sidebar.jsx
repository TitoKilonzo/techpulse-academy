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
  { href: '/dashboard/courses?cat=cybersecurity', Icon: ShieldCheck,  label: 'Cybersecurity', color: '#DC2626' },
  { href: '/dashboard/courses?cat=ai',            Icon: BrainCircuit, label: 'AI & Claude',   color: '#7C3AED' },
  { href: '/dashboard/courses?cat=cloud',         Icon: Cloud,        label: 'Cloud',         color: '#0284C7' },
  { href: '/dashboard/courses?cat=opensource',    Icon: GitBranch,    label: 'Open Source',   color: '#059669' },
  { href: '/dashboard/courses?cat=tech',          Icon: Cpu,          label: 'Tech',          color: '#F97316' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  return (
    <aside className={`dash-sidebar${isOpen ? ' open' : ''}`}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#F97316,#C2410C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(249,115,22,0.3)' }}>
            <Zap size={16} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: '#111827', lineHeight: 1 }}>TechPulse</div>
            <div style={{ fontSize: '0.58rem', color: '#F97316', letterSpacing: '0.1em', fontWeight: 700, marginTop: 1 }}>ACADEMY</div>
          </div>
        </Link>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 4, display: 'none', borderRadius: 6 }} className="mobile-close-btn">
          <X size={18} />
        </button>
      </div>

      {/* Main nav */}
      <nav style={{ padding: '12px 8px 6px' }}>
        <div style={{ fontSize: '0.6rem', color: '#9CA3AF', letterSpacing: '0.12em', padding: '0 8px', marginBottom: 6, fontWeight: 700 }}>NAVIGATION</div>
        {NAV.map(({ href, Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose} className="nav-item" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 8, marginBottom: 2,
              textDecoration: 'none',
              background: active ? 'rgba(249,115,22,0.08)' : 'transparent',
              color:      active ? '#C2410C'               : '#4B5563',
              borderLeft: active ? '2.5px solid #F97316'  : '2.5px solid transparent',
              fontWeight: active ? 700                     : 400,
              fontSize: '0.875rem',
            }}>
              <Icon size={16} color={active ? '#F97316' : '#9CA3AF'} />{label}
            </Link>
          );
        })}
      </nav>

      {/* Tracks */}
      <div style={{ padding: '2px 8px' }}>
        <div style={{ fontSize: '0.6rem', color: '#9CA3AF', letterSpacing: '0.12em', padding: '0 8px', marginBottom: 6, marginTop: 10, fontWeight: 700 }}>TRACKS</div>
        {TRACKS.map(({ href, Icon, label, color }) => (
          <Link key={href} href={href} onClick={onClose} className="sidebar-track-link" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 8, marginBottom: 2,
            textDecoration: 'none', color: '#4B5563',
            fontSize: '0.825rem', transition: 'all 0.15s',
          }}>
            <Icon size={14} color={color} />{label}
          </Link>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Logout */}
      <div style={{ padding: 8, borderTop: '1px solid #F3F4F6' }}>
        <button
          onClick={logout}
          className="nav-item"
          style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '9px 10px', borderRadius: 8, background: 'transparent',
            border: 'none', color: '#9CA3AF', cursor: 'pointer',
            fontSize: '0.875rem', transition: 'all 0.15s', borderLeft: '2.5px solid transparent',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#DC2626'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
