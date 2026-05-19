'use client';
import { Bell, Search, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashHeader({ onMenuToggle }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user));
  }, []);

  return (
    <header style={{
      height: 60, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)', flexShrink: 0, gap: 12,
    }}>
      {/* Left: hamburger (mobile) + search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <button
          className="mobile-menu-btn"
          onClick={onMenuToggle}
          aria-label="Open menu"
          style={{ flexShrink: 0 }}
        >
          <Menu size={16} />
        </button>

        <div className="header-search" style={{ position: 'relative', width: 260, maxWidth: '100%' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            placeholder="Search courses…"
            style={{
              width: '100%', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 8,
              padding: '7px 10px 7px 28px', color: 'var(--text-primary)',
              fontSize: '0.8rem', outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Right: bell + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button style={{
          background: 'none', border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 8px', color: 'var(--text-secondary)',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <Bell size={15} />
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg,#00D4FF,#7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                {user.name?.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{user.xp ?? 0} XP</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
