'use client';
import { useState } from 'react';
import Link from 'next/link';
import { courses, CATEGORIES } from '@/lib/courses';
import { getCategoryMeta, formatDuration } from '@/lib/utils';
import { BookOpen, Clock, Search } from 'lucide-react';

export default function CoursesPage() {
  const [cat,    setCat]    = useState('all');
  const [level,  setLevel]  = useState('all');
  const [search, setSearch] = useState('');

  const filtered = courses.filter(c => {
    if (cat !== 'all' && c.category !== cat) return false;
    if (level !== 'all' && c.level !== level) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.title.toLowerCase().includes(q) &&
          !c.description.toLowerCase().includes(q) &&
          !c.tags.some(t => t.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,1.6rem)', marginBottom: 4 }}>
          All Courses
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {courses.length} courses across 5 tracks
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 380 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, tag, topic…"
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px 9px 32px', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 500,
              cursor: 'pointer', border: '1px solid', transition: 'all 0.15s',
              background:   cat === c.id ? 'rgba(0,212,255,0.12)' : 'var(--bg-card)',
              color:        cat === c.id ? 'var(--cyan)' : 'var(--text-secondary)',
              borderColor:  cat === c.id ? 'rgba(0,212,255,0.4)' : 'var(--border)',
            }}>{c.label}</button>
          ))}
        </div>

        {/* Level pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'beginner', 'intermediate', 'advanced'].map(l => (
            <button key={l} onClick={() => setLevel(l)} style={{
              padding: '5px 12px', borderRadius: 20, fontSize: '0.75rem',
              cursor: 'pointer', border: '1px solid', textTransform: 'capitalize', transition: 'all 0.15s',
              background:  level === l ? 'rgba(245,158,11,0.1)' : 'var(--bg-card)',
              color:       level === l ? '#F59E0B' : 'var(--text-muted)',
              borderColor: level === l ? 'rgba(245,158,11,0.35)' : 'var(--border)',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>
        {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* Course grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          No courses match your filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
          {filtered.map(c => {
            const meta = getCategoryMeta(c.category);
            return (
              <Link key={c.slug} href={`/dashboard/courses/${c.slug}`} className="course-card" style={{
                display: 'block', background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 14, overflow: 'hidden', textDecoration: 'none',
              }}>
                <div style={{ position: 'relative', height: 148, overflow: 'hidden' }}>
                  <img src={c.thumbnail} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,23,41,0.85),transparent)' }} />
                  <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: 'var(--font-mono)', fontSize: '0.63rem', padding: '3px 9px', borderRadius: 100, color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}>
                    {meta.label.toUpperCase()}
                  </span>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 5, lineHeight: 1.35, color: 'var(--text-primary)' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><BookOpen size={11} />{c.lessons.length} lessons</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} />{formatDuration(c.duration)}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 100, textTransform: 'capitalize',
                      background:  c.level === 'beginner' ? 'rgba(16,185,129,0.08)' : c.level === 'intermediate' ? 'rgba(245,158,11,0.08)' : 'rgba(244,63,94,0.08)',
                      color:       c.level === 'beginner' ? '#10B981' : c.level === 'intermediate' ? '#F59E0B' : '#F43F5E',
                      border:      c.level === 'beginner' ? '1px solid rgba(16,185,129,0.25)' : c.level === 'intermediate' ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(244,63,94,0.25)',
                    }}>{c.level}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {c.tags.slice(0, 3).map(t => (
                      <span key={t} style={{ fontSize: '0.63rem', padding: '2px 8px', borderRadius: 100, background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
