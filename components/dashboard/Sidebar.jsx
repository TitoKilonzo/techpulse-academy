'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, User, LogOut, Zap,
  ShieldCheck, Cloud, BrainCircuit, GitBranch, Cpu, X,
  MessageSquare, Bookmark, Shield
} from 'lucide-react';

const NAV = [
  { href: '/dashboard',         Icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/courses', Icon: BookOpen,        label: 'Courses'   },
  { href: '/dashboard/profile', Icon: User,            label: 'Profile'   },
];

const TRACKS = [
  { href: '/dashboard/courses?cat=cybersecurity', Icon: ShieldCheck,  label: 'Cybersecurity', color: 'var(--rose)' },
  { href: '/dashboard/courses?cat=ai',            Icon: BrainCircuit, label: 'AI & Claude',   color: 'var(--violet)' },
  { href: '/dashboard/courses?cat=cloud',         Icon: Cloud,        label: 'Cloud',         color: 'var(--cyan)' },
  { href: '/dashboard/courses?cat=opensource',    Icon: GitBranch,    label: 'Open Source',   color: 'var(--emerald)' },
  { href: '/dashboard/courses?cat=tech',          Icon: Cpu,          label: 'Tech',          color: 'var(--orange)' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data && data.user) setUser(data.user);
      })
      .catch(console.error);
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  return (
    <aside className={`dash-sidebar${isOpen ? ' open' : ''}`}>
      {/* Logo */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(232,134,12,0.3)' }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1 }}>TechPulse</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--orange)', letterSpacing: '0.12em', fontWeight: 700, marginTop: 2 }}>ACADEMY</div>
          </div>
        </Link>
        <button onClick={onClose} className="mobile-close-btn glass" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, display: 'none', borderRadius: 8 }}>
          <X size={18} />
        </button>
      </div>

      {/* Main nav */}
      <nav style={{ padding: '16px 12px 6px' }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em', padding: '0 12px', marginBottom: 8, fontWeight: 700 }}>NAVIGATION</div>
        {NAV.map(({ href, Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose} className="nav-item" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10, marginBottom: 4,
              textDecoration: 'none',
              background: active ? 'var(--bg-hover)' : 'transparent',
              color:      active ? 'var(--orange-dark)' : 'var(--text-secondary)',
              borderLeft: `3px solid ${active ? 'var(--orange)' : 'transparent'}`,
              fontWeight: active ? 600 : 500,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}>
              <Icon size={18} color={active ? 'var(--orange)' : 'var(--text-muted)'} />{label}
            </Link>
          );
        })}
      </nav>

      {/* Community */}
      <div style={{ padding: '8px 12px' }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em', padding: '0 12px', marginBottom: 8, fontWeight: 700 }}>COMMUNITY</div>
        <button onClick={() => alert("Bookmarks coming soon!")} className="nav-item" style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%',
          padding: '10px 12px', borderRadius: 10, marginBottom: 4, background: 'transparent',
          border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
          fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.2s', borderLeft: '3px solid transparent', textAlign: 'left'
        }}>
          <Bookmark size={18} color="var(--text-muted)" /> Bookmarks
        </button>
        <button onClick={() => alert("Discussions coming soon!")} className="nav-item" style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%',
          padding: '10px 12px', borderRadius: 10, marginBottom: 4, background: 'transparent',
          border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
          fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.2s', borderLeft: '3px solid transparent', textAlign: 'left'
        }}>
          <MessageSquare size={18} color="var(--text-muted)" /> Discussions
        </button>
      </div>

      {/* Tracks */}
      <div style={{ padding: '8px 12px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em', padding: '0 12px', marginBottom: 8, fontWeight: 700 }}>TRACKS</div>
        {TRACKS.map(({ href, Icon, label, color }) => (
          <Link key={href} href={href} onClick={onClose} className="sidebar-track-link" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 12px', borderRadius: 10, marginBottom: 4,
            textDecoration: 'none', color: 'var(--text-secondary)',
            fontSize: '0.85rem', transition: 'all 0.2s', fontWeight: 500,
          }}>
            <Icon size={16} color={color} />{label}
          </Link>
        ))}
      </div>

      {/* User Info & Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem',
              boxShadow: '0 2px 6px rgba(232,134,12,0.3)', flexShrink: 0,
            }}>
              {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Shield size={10} color="var(--emerald)" /> {user.role === 'admin' ? 'Admin' : 'Student'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="nav-item"
          style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '10px 12px', borderRadius: 10, background: 'transparent',
            border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
            fontSize: '0.9rem', transition: 'all 0.2s', borderLeft: '3px solid transparent', fontWeight: 500,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.08)'; e.currentTarget.style.color = 'var(--rose)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
