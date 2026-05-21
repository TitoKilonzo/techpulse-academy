'use client';
import { Search, Bell, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashHeader({ user, onMenuClick }) {
  const router = useRouter();
  return (
    <header style={{
      height: 60,
      background: '#fff',
      borderBottom: '1px solid #F3F4F6',
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
        onClick={onMenuClick}
        className="mobile-menu-btn"
        style={{ color: '#4B5563', border: '1.5px solid #E5E7EB', borderRadius: 8, padding: '6px 10px', background: 'none', cursor: 'pointer', display: 'none', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}
      >
        <Menu size={16} /> Menu
      </button>

      {/* Search */}
      <div className="header-search" style={{ flex: 1, maxWidth: 340, position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        <input
          placeholder="Search courses…"
          style={{
            width: '100%',
            background: '#F9FAFB',
            border: '1.5px solid #E5E7EB',
            borderRadius: 9,
            padding: '8px 12px 8px 34px',
            color: '#111827',
            fontSize: '0.85rem',
            outline: 'none',
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const q = e.target.value.trim();
              if (q) router.push(`/dashboard/courses?q=${encodeURIComponent(q)}`);
            }
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Notification bell */}
      <button style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 6, borderRadius: 8, transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#F97316'}
        onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
        <Bell size={18} />
      </button>

      {/* Avatar */}
      {user && (
        <div style={{
          width: 34, height: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#F97316,#C2410C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.85rem',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(249,115,22,0.3)',
          cursor: 'default',
          userSelect: 'none',
        }}>
          {user.name?.charAt(0).toUpperCase() ?? 'U'}
        </div>
      )}
    </header>
  );
}
