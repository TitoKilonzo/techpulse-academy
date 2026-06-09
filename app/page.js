'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Cloud, BrainCircuit, GitBranch, Cpu,
  ChevronRight, BookOpen, Clock, ArrowRight,
  Terminal, Lock, Globe, Zap, Star,
} from 'lucide-react';
import { getTotalStats, getFeaturedCourses } from '@/lib/courses';
import { getCategoryMeta, formatDuration } from '@/lib/utils';

const CATEGORIES = [
  { id: 'cybersecurity', Icon: ShieldCheck,  label: 'Cybersecurity',   desc: 'SOC labs, network security, ethical hacking' },
  { id: 'ai',            Icon: BrainCircuit, label: 'AI & Claude',     desc: 'LLMs, prompt engineering, Anthropic API' },
  { id: 'cloud',         Icon: Cloud,        label: 'Cloud Computing', desc: 'AWS, Docker, Kubernetes, serverless' },
  { id: 'opensource',    Icon: GitBranch,    label: 'Open Source',     desc: 'Git, contributions, Linux, licensing' },
  { id: 'tech',          Icon: Cpu,          label: 'Tech Fundamentals',desc: 'Auth, networking, databases, APIs' },
];

const FEATURES = [
  { Icon: Terminal, title: 'Hands-on Labs',       desc: 'Real tools — Splunk, Kali, AWS, Docker. Not simulated.' },
  { Icon: Lock,     title: 'JWT Auth + Turso DB', desc: 'Production-grade auth backed by libsql edge database.' },
  { Icon: Globe,    title: 'Open Source MIT',     desc: 'Fork it, self-host it, contribute back to the community.' },
  { Icon: Star,     title: 'Progress Tracking',   desc: 'Per-user lesson completion synced to your account.' },
];

/* ── Category Card ── */
function CategoryCard({ id, Icon, label, desc }) {
  const [hovered, setHovered] = useState(false);
  const meta = getCategoryMeta(id);

  return (
    <Link
      href={`/dashboard/courses?cat=${id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="animate-fade-up"
      style={{
        background: hovered ? 'var(--bg-hover)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--orange-glow)' : 'var(--border)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        textDecoration: 'none',
        display: 'block',
        transform: hovered ? 'translateY(-6px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hovered ? '0 12px 32px rgba(232,134,12,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--orange-dim)', border: '1px solid var(--orange-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s', transform: hovered ? 'scale(1.1)' : 'scale(1)' }}>
            <Icon size={20} color="var(--orange-dark)" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{label}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
      </div>
    </Link>
  );
}

/* ── Course Card ── */
function CourseCard({ course }) {
  const [hovered, setHovered] = useState(false);
  const meta = getCategoryMeta(course.category);
  return (
    <Link
      href={`/dashboard/courses/${course.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card-premium animate-fade-up"
      style={{
        display: 'block',
        textDecoration: 'none',
      }}
    >
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        {/* Placeholder gradient thumbnail to replace Unsplash */}
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(135deg, var(--surface-dark) 0%, var(--orange-dark) 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.5s', transform: hovered ? 'scale(1.06)' : 'scale(1)'
        }}>
          <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{course.title.substring(0,2)}</span>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
        <span className="glass" style={{
          position: 'absolute', top: 12, left: 12,
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em',
          padding: '4px 10px', borderRadius: 100,
          color: 'var(--orange-dark)',
          fontWeight: 700,
        }}>
          {meta.label.toUpperCase()}
        </span>
      </div>
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.4, color: 'var(--text-primary)' }}>{course.title}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </p>
        <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--text-muted)', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={14} color="var(--orange)" />{course.lessons.length} lessons</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} color="var(--orange)" />{formatDuration(course.duration)}</span>
          <span style={{
            padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', textTransform: 'capitalize',
            background:  'var(--bg-hover)',
            color:       'var(--orange-dark)',
            border:      '1px solid var(--border)',
            fontWeight: 600,
          }}>{course.level}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Landing Page ── */
export default function LandingPage() {
  const stats    = getTotalStats();
  const featured = getFeaturedCourses().slice(0, 3);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkStyle = { color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', padding: '8px 16px', borderRadius: 8, transition: 'all 0.2s', fontWeight: 600 };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ── Responsive overrides ── */}
      <style>{`
        @media (max-width: 900px) {
          .cat-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .course-grid{ grid-template-columns: repeat(2,1fr) !important; }
          .feat-grid  { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .hero-title { font-size: 2.5rem !important; }
          .hero-sub   { font-size: 1rem !important; }
          .hero-btns  { flex-direction: column !important; }
          .stats-row  { gap: 24px !important; flex-wrap: wrap; }
          .cat-grid   { grid-template-columns: 1fr !important; }
          .course-grid{ grid-template-columns: 1fr !important; }
          .feat-grid  { grid-template-columns: 1fr !important; }
          .nav-desktop{ display: none !important; }
          .show-mobile{ display: flex !important; }
          .section-pad{ padding-left: 20px !important; padding-right: 20px !important; }
        }
        .nav-link:hover { background: var(--bg-hover); color: var(--orange-dark) !important; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        padding: '0 24px', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #F59E0B, #E8860C)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(232,134,12,0.3)' }}>
            <Zap size={20} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: scrolled ? 'var(--text-primary)' : '#fff', transition: 'color 0.3s' }}>TechPulse</span>
        </Link>

        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="#courses"  className="nav-link" style={{...navLinkStyle, color: scrolled ? 'var(--text-primary)' : '#fff'}}>Courses</Link>
          <Link href="#features" className="nav-link" style={{...navLinkStyle, color: scrolled ? 'var(--text-primary)' : '#fff'}}>Features</Link>
          <Link href="/login"    className="nav-link" style={{ ...navLinkStyle, border: `1.5px solid ${scrolled ? 'var(--border)' : 'rgba(255,255,255,0.3)'}`, borderRadius: 10, color: scrolled ? 'var(--text-primary)' : '#fff' }}>Log in</Link>
          <Link href="/signup"   className="btn-primary" style={{ textDecoration: 'none', padding: '10px 24px', borderRadius: 10, fontSize: '0.95rem', fontWeight: 700, marginLeft: 8 }}>
            Get Started
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="show-mobile glass" onClick={() => setMobileNavOpen(o => !o)} style={{
          display: 'none', color: scrolled ? 'var(--text-primary)' : '#fff', cursor: 'pointer',
          alignItems: 'center', gap: 8, fontWeight: 600, fontSize: '0.9rem', padding: '8px 14px', borderRadius: 10, border: `1px solid ${scrolled ? 'var(--border)' : 'rgba(255,255,255,0.2)'}`
        }}>
          Menu
        </button>
      </nav>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="animate-fade-in" style={{
          position: 'fixed', top: 72, left: 0, right: 0, zIndex: 99,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '24px', display: 'flex', flexDirection: 'column', gap: 8,
          boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
        }}>
          <Link href="#courses"  onClick={() => setMobileNavOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid var(--border-light)', fontWeight: 600, fontSize: '1.1rem' }}>Courses</Link>
          <Link href="#features" onClick={() => setMobileNavOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid var(--border-light)', fontWeight: 600, fontSize: '1.1rem' }}>Features</Link>
          <Link href="/login"    onClick={() => setMobileNavOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid var(--border-light)', fontWeight: 600, fontSize: '1.1rem' }}>Log in</Link>
          <Link href="/signup"   onClick={() => setMobileNavOpen(false)} className="btn-primary" style={{ textDecoration: 'none', padding: '16px', borderRadius: 12, fontWeight: 700, textAlign: 'center', marginTop: 12, fontSize: '1.1rem' }}>
            Get Started Free
          </Link>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section style={{ paddingTop: 160, paddingBottom: 120, position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="hero-bg-img" />
        <div className="hero-overlay" />
        
        {/* CSS Floating shapes */}
        <div style={{ position: 'absolute', top: '15%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, var(--orange) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(40px)', animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #FCD34D 0%, transparent 70%)', opacity: 0.1, filter: 'blur(50px)', animation: 'float 8s ease-in-out infinite reverse' }} />

        <div className="section-pad animate-fade-up" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 100, marginBottom: 32, color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} /> Platform v2.0 Live
          </div>

          <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(3rem,8vw,6rem)', lineHeight: 1.05, marginBottom: 28, color: '#fff' }}>
            <span className="gradient-text">Master Tech.</span><br />
            Build the Future.
          </h1>

          <p className="hero-sub" style={{ fontSize: 'clamp(1.1rem,2.5vw,1.35rem)', color: 'rgba(255,255,255,0.8)', maxWidth: 700, margin: '0 auto 48px', lineHeight: 1.7, fontWeight: 400 }}>
            Premium interactive learning for developers and security professionals. Open source. Hands-on. Built for scale.
          </p>

          <div className="hero-btns" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', padding: '18px 40px', borderRadius: 12, fontWeight: 700, fontSize: '1.1rem' }}>
              Start Learning Free <ArrowRight size={20} />
            </Link>
            <a href="https://github.com/TitoKilonzo/techpulse-academy" target="_blank" rel="noopener noreferrer" className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', padding: '18px 40px', borderRadius: 12, fontSize: '1.1rem', fontWeight: 600, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <GitBranch size={20} /> View on GitHub
            </a>
          </div>

          {/* Stats row */}
          <div className="stats-row glass" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '32px 40px', borderRadius: 24, marginTop: 80, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
            {[
              { value: `${stats.totalCourses}+`, label: 'Premium Courses' },
              { value: `${stats.totalLessons}+`, label: 'Interactive Lessons' },
              { value: `${stats.totalHours}h+`,  label: 'Hands-on Content' },
              { value: '100%',                   label: 'Open Source' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{s.value}</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: '0.05em', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="courses" style={{ padding: '100px 24px', background: 'var(--bg-secondary)', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--orange-dark)', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase', background: 'var(--bg-hover)', padding: '6px 14px', borderRadius: 100 }}>Learning Tracks</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,2.8rem)', fontWeight: 800, marginTop: 24, color: 'var(--text-primary)' }}>Five Disciplines. One Platform.</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontSize: '1.15rem', maxWidth: 600, margin: '16px auto 0', lineHeight: 1.7 }}>From beginner to production-ready across the most in-demand tech disciplines.</p>
          </div>
          <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {CATEGORIES.map((cat, i) => <div key={cat.id} style={{ animationDelay: `${i * 100}ms` }}><CategoryCard {...cat} /></div>)}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--orange-dark)', letterSpacing: '0.15em', fontWeight: 700, background: 'var(--bg-hover)', padding: '6px 14px', borderRadius: 100 }}>FEATURED</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4.5vw,2.5rem)', fontWeight: 800, marginTop: 24, color: 'var(--text-primary)' }}>Start with the Best</h2>
            </div>
            <Link href="/dashboard/courses" className="btn-secondary" style={{ textDecoration: 'none', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
              View all courses <ChevronRight size={18} />
            </Link>
          </div>
          <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {featured.map((c, i) => <div key={c.slug} style={{ animationDelay: `${i * 150}ms` }}><CourseCard course={c} /></div>)}
          </div>
        </div>
      </section>

      {/* ── Features section ── */}
      <section id="features" style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden', background: 'var(--bg-hover)' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'linear-gradient(to left, var(--orange-dim), transparent)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--orange-dark)', letterSpacing: '0.15em', fontWeight: 700, background: 'var(--bg-primary)', padding: '6px 14px', borderRadius: 100, border: '1px solid var(--border)' }}>WHY TECHPULSE</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,2.8rem)', fontWeight: 800, marginTop: 24, color: 'var(--text-primary)' }}>Built for Real Learning</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontSize: '1.15rem', maxWidth: 600, margin: '16px auto 0', lineHeight: 1.7 }}>Not a slide-show. Real tools, real code, real deployments.</p>
          </div>
          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <div key={title} className="glass animate-fade-up" style={{ animationDelay: `${i * 100}ms`, background: 'var(--bg-primary)', borderRadius: 20, padding: 32, transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 8px 20px rgba(232,134,12,0.3)' }}>
                  <Icon size={28} color="#fff" />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)', fontSize: '1.15rem' }}>{title}</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden', background: '#1C1917' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(232,134,12,0.2) 0%, transparent 60%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e8860c\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', opacity: 0.5, zIndex: 1 }} />
        
        <div className="cta-box section-pad" style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h2 className="cta-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,3.5rem)', fontWeight: 800, marginBottom: 24, color: '#fff', lineHeight: 1.1 }}>
            Ready to <span className="gradient-text">level up?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 48, lineHeight: 1.8, fontSize: '1.2rem', maxWidth: 600, margin: '0 auto 48px' }}>
            Join thousands of developers mastering the modern tech stack. Free, open source, and built for you.
          </p>
          <Link href="/signup" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', padding: '20px 48px', borderRadius: 16, fontWeight: 800, fontSize: '1.15rem' }}>
            Create Your Free Account <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(232,134,12,0.2)' }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>TechPulse</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 24 }}>Premium Open Source Learning Platform</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          <a href="https://github.com/TitoKilonzo/techpulse-academy" className="nav-link" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>GitHub</a>
          <Link href="/login"  className="nav-link" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>Login</Link>
          <Link href="/signup" className="nav-link" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>Sign Up</Link>
        </div>
        <div style={{ width: 60, height: 2, background: 'var(--border)', margin: '0 auto 24px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© {new Date().getFullYear()} TechPulse Academy. MIT License. Built with Next.js.</p>
      </footer>
    </div>
  );
}
