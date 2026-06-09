'use client';
import { Search, Bell, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashHeader({ onMenuToggle }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data && data.user) setUser(data.user);
      })
      .catch(console.error);
  }, []);

  return (
    <header style={{
      height: 60,
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 12,
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    }}>
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="mobile-menu-btn"
      >
        <Menu size={16} /> Menu
      </button>

      {/* Search */}
      <div className="header-search" style={{ flex: 1, maxWidth: 340, position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          placeholder="Search courses…"
          style={{
            width: '100%',
            background: 'var(--bg-secondary)',
            border: '1.5px solid var(--border)',
            borderRadius: 9,
            padding: '8px 12px 8px 34px',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            outline: 'none',
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const q = e.target.value.trim();
              if (q) {
                router.push(`/dashboard/courses?q=${encodeURIComponent(q)}`);
              } else {
                router.push(`/dashboard/courses`);
              }
            }
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Notification bell */}
      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, borderRadius: 8, transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
        <Bell size={18} />
      </button>

      {/* Avatar */}
      {user && (
        <div style={{
          width: 34, height: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.85rem',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(232,134,12,0.3)',
          cursor: 'default',
          userSelect: 'none',
        }}>
          {user.name?.charAt(0).toUpperCase() ?? 'U'}
        </div>
      )}
    </header>
  );
}
