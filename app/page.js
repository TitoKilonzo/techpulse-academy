'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Cloud, BrainCircuit, GitBranch, Cpu,
  ChevronRight, BookOpen, Clock, ArrowRight,
  Terminal, Lock, Globe, Zap, Star,
} from 'lucide-react';
import { getTotalStats, getFeaturedCourses } from '@/lib/courses';
import { getCategoryMeta, formatDuration } from '@/lib/utils';

/* ── Unsplash image helpers ── */
const HERO_IMG     = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&q=80';
const FEATURES_IMG = 'https://images.unsplash.com/photo-1550439062-609e1531270e?w=1400&q=80';
const CTA_IMG      = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80';

const CATEGORIES = [
  { id: 'cybersecurity', Icon: ShieldCheck,  label: 'Cybersecurity',   desc: 'SOC labs, network security, ethical hacking', color: '#DC2626', bg: 'rgba(220,38,38,0.08)',   img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=70' },
  { id: 'ai',            Icon: BrainCircuit, label: 'AI & Claude',     desc: 'LLMs, prompt engineering, Anthropic API',   color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=70' },
  { id: 'cloud',         Icon: Cloud,        label: 'Cloud Computing', desc: 'AWS, Docker, Kubernetes, serverless',       color: '#0284C7', bg: 'rgba(2,132,199,0.08)',   img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=70' },
  { id: 'opensource',    Icon: GitBranch,    label: 'Open Source',     desc: 'Git, contributions, Linux, licensing',     color: '#059669', bg: 'rgba(5,150,105,0.08)',   img: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&q=70' },
  { id: 'tech',          Icon: Cpu,          label: 'Tech Fundamentals',desc: 'Auth, networking, databases, APIs',        color: '#F97316', bg: 'rgba(249,115,22,0.08)',  img: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=70' },
];

const FEATURES = [
  { Icon: Terminal, title: 'Hands-on Labs',       desc: 'Real tools — Splunk, Kali, AWS, Docker. Not simulated.',          color: '#F97316' },
  { Icon: Lock,     title: 'JWT Auth + Turso DB',  desc: 'Production-grade auth backed by libsql edge database.',           color: '#7C3AED' },
  { Icon: Globe,    title: 'Open Source MIT',      desc: 'Fork it, self-host it, contribute back to the community.',        color: '#059669' },
  { Icon: Star,     title: 'Progress Tracking',    desc: 'Per-user lesson completion synced to your account.',              color: '#0284C7' },
];

/* ── Category Card ── */
function CategoryCard({ id, Icon, label, desc, color, bg, img }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/dashboard/courses?cat=${id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? bg : '#fff',
        border: `1.5px solid ${hovered ? color : '#E5E7EB'}`,
        borderRadius: 16,
        overflow: 'hidden',
        textDecoration: 'none',
        display: 'block',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.22s',
        boxShadow: hovered ? `0 12px 32px ${color}22` : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Category thumbnail */}
      <div style={{ position: 'relative', height: 100, overflow: 'hidden' }}>
        <img
          src={img}
          alt={label}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 100%)` }} />
      </div>
      <div style={{ padding: '14px 18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={17} color={color} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{label}</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.5 }}>{desc}</p>
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
      className="course-card"
      style={{
        display: 'block',
        background: '#fff',
        border: `1.5px solid ${hovered ? meta.color : '#E5E7EB'}`,
        borderRadius: 16,
        overflow: 'hidden',
        textDecoration: 'none',
        boxShadow: hovered ? `0 16px 40px ${meta.color}18` : '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.22s',
      }}
    >
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className="course-thumb"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
        <span style={{
          position: 'absolute', top: 10, left: 10,
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.06em',
          padding: '3px 9px', borderRadius: 100,
          color: meta.color, background: 'rgba(255,255,255,0.92)', border: `1px solid ${meta.color}44`,
          fontWeight: 600,
        }}>
          {meta.label.toUpperCase()}
        </span>
      </div>
      <div style={{ padding: '16px 18px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6, lineHeight: 1.35, color: '#111827' }}>{course.title}</h3>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: 14, lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </p>
        <div style={{ display: 'flex', gap: 12, fontSize: '0.77rem', color: '#9CA3AF', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={12} color="#F97316" />{course.lessons.length} lessons</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} color="#F97316" />{formatDuration(course.duration)}</span>
          <span style={{
            padding: '2px 9px', borderRadius: 100, fontSize: '0.7rem', textTransform: 'capitalize',
            background:  course.level === 'beginner' ? 'rgba(5,150,105,0.1)' : 'rgba(245,158,11,0.1)',
            color:       course.level === 'beginner' ? '#059669'             : '#D97706',
            border:      course.level === 'beginner' ? '1px solid rgba(5,150,105,0.2)' : '1px solid rgba(245,158,11,0.2)',
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

  const navLinkStyle = { color: '#4B5563', textDecoration: 'none', fontSize: '0.875rem', padding: '8px 14px', borderRadius: 8, transition: 'color 0.15s, background 0.15s', fontWeight: 500 };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Responsive overrides ── */}
      <style>{`
        @media (max-width: 900px) {
          .cat-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .course-grid{ grid-template-columns: repeat(2,1fr) !important; }
          .feat-grid  { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .hero-title { font-size: 2.2rem !important; }
          .hero-sub   { font-size: 0.95rem !important; }
          .hero-btns  { flex-direction: column !important; }
          .stats-row  { gap: 20px !important; flex-wrap: wrap; }
          .cat-grid   { grid-template-columns: 1fr !important; }
          .course-grid{ grid-template-columns: 1fr !important; }
          .feat-grid  { grid-template-columns: 1fr !important; }
          .cta-box    { padding: 36px 20px !important; }
          .cta-title  { font-size: 1.5rem !important; }
          .nav-desktop{ display: none !important; }
          .show-mobile{ display: flex !important; }
          .section-pad{ padding-left: 16px !important; padding-right: 16px !important; }
        }
        @media (max-width: 380px) {
          .hero-title { font-size: 1.9rem !important; }
          .stats-row  { grid-template-columns: 1fr 1fr; display: grid !important; gap: 12px !important; }
        }
        a:hover .course-thumb { transform: scale(1.04); }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #F3F4F6',
        padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#F97316,#C2410C)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(249,115,22,0.35)' }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>TechPulse</span>
        </Link>

        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="#courses"  style={navLinkStyle}>Courses</Link>
          <Link href="#features" style={navLinkStyle}>Features</Link>
          <Link href="/login"    style={{ ...navLinkStyle, border: '1.5px solid #E5E7EB', borderRadius: 8 }}>Log in</Link>
          <Link href="/signup"   style={{ background: 'linear-gradient(135deg,#F97316,#C2410C)', color: '#fff', textDecoration: 'none', padding: '9px 20px', borderRadius: 9, fontSize: '0.875rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}>
            Get Started
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="show-mobile" onClick={() => setMobileNavOpen(o => !o)} style={{
          display: 'none', background: 'none', border: '1.5px solid #E5E7EB',
          borderRadius: 8, padding: '7px 12px', color: '#4B5563', cursor: 'pointer',
          alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.85rem',
        }}>
          Menu
        </button>
      </nav>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
          background: '#fff', borderBottom: '1px solid #E5E7EB',
          padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>
          <Link href="#courses"  onClick={() => setMobileNavOpen(false)} style={{ color: '#374151', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #F3F4F6', fontWeight: 500 }}>Courses</Link>
          <Link href="#features" onClick={() => setMobileNavOpen(false)} style={{ color: '#374151', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #F3F4F6', fontWeight: 500 }}>Features</Link>
          <Link href="/login"    onClick={() => setMobileNavOpen(false)} style={{ color: '#374151', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #F3F4F6', fontWeight: 500 }}>Log in</Link>
          <Link href="/signup"   onClick={() => setMobileNavOpen(false)} style={{ background: 'linear-gradient(135deg,#F97316,#C2410C)', color: '#fff', textDecoration: 'none', padding: '13px 16px', borderRadius: 9, fontWeight: 700, textAlign: 'center', marginTop: 8 }}>
            Get Started Free
          </Link>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section style={{ paddingTop: 130, paddingBottom: 96, position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        {/* Background image */}
        <img
          src={HERO_IMG}
          alt=""
          aria-hidden="true"
          className="hero-bg-img"
          loading="eager"
          fetchPriority="high"
        />
        {/* Gradient overlay — white/orange wash */}
        <div className="hero-overlay" />
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '8%', right: '5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />

        <div className="section-pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>

          <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.6rem,7vw,5rem)', lineHeight: 1.1, marginBottom: 22 }}>
            <span className="gradient-text">Build. Hack.</span><br />
            <span style={{ color: '#111827' }}>Deploy.</span>
          </h1>

          <p className="hero-sub" style={{ fontSize: 'clamp(1rem,2.2vw,1.2rem)', color: '#4B5563', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.8 }}>
            The open-source learning platform for tech enthusiasts mastering Cybersecurity, Cloud Computing, Claude AI, Open Source, and more.
          </p>

          <div className="hero-btns" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#F97316,#C2410C)', color: '#fff', textDecoration: 'none', padding: '15px 32px', borderRadius: 11, fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 16px rgba(249,115,22,0.35)' }}>
              Start Learning Free <ArrowRight size={17} />
            </Link>
            <a href="https://github.com/TitoKilonzo/techpulse-academy" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #E5E7EB', color: '#374151', textDecoration: 'none', padding: '15px 32px', borderRadius: 11, fontSize: '0.95rem', fontWeight: 600, background: '#fff' }}>
              <GitBranch size={17} /> View on GitHub
            </a>
          </div>

          {/* Stats row */}
          <div className="stats-row" style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 64 }}>
            {[
              { value: `${stats.totalCourses}+`, label: 'Courses' },
              { value: `${stats.totalLessons}+`, label: 'Lessons' },
              { value: `${stats.totalHours}h+`,  label: 'Content' },
              { value: 'Free',                   label: 'Open Source' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.9rem', color: '#F97316' }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="courses" style={{ padding: '80px 24px', background: '#F9FAFB', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F97316', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>Learning Tracks</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, marginTop: 8, color: '#111827' }}>Five Disciplines. One Platform.</h2>
            <p style={{ color: '#6B7280', marginTop: 10, fontSize: '1rem', maxWidth: 540, margin: '10px auto 0' }}>From beginner to production-ready across the most in-demand tech disciplines.</p>
          </div>
          <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 18 }}>
            {CATEGORIES.map(cat => <CategoryCard key={cat.id} {...cat} />)}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F97316', letterSpacing: '0.1em', fontWeight: 700 }}>FEATURED</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3.5vw,2rem)', fontWeight: 800, marginTop: 6, color: '#111827' }}>Start with the Best</h2>
            </div>
            <Link href="/dashboard/courses" style={{ color: '#F97316', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              View all courses <ChevronRight size={15} />
            </Link>
          </div>
          <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {featured.map(c => <CourseCard key={c.slug} course={c} />)}
          </div>
        </div>
      </section>

      {/* ── Features section (with background image) ── */}
      <section id="features" style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden', background: '#FFF7ED' }}>
        <img
          src={FEATURES_IMG}
          alt=""
          aria-hidden="true"
          className="section-bg-img"
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.05, pointerEvents: 'none' }}
        />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F97316', letterSpacing: '0.1em', fontWeight: 700 }}>WHY TECHPULSE</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, marginTop: 8, color: '#111827' }}>Built for Real Learning</h2>
            <p style={{ color: '#6B7280', marginTop: 10, maxWidth: 500, margin: '10px auto 0' }}>Not a slide-show. Real tools, real code, real deployments.</p>
          </div>
          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
            {FEATURES.map(({ Icon, title, desc, color }) => (
              <div key={title} style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={24} color={color} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8, color: '#111827', fontSize: '1rem' }}>{title}</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (with background image) ── */}
      <section style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden', background: '#111827' }}>
        <img
          src={CTA_IMG}
          alt=""
          aria-hidden="true"
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, pointerEvents: 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(17,24,39,0.92),rgba(194,65,12,0.75))', zIndex: 1 }} />
        <div className="cta-box section-pad" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 24px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#FED7AA', letterSpacing: '0.1em', fontWeight: 700 }}>GET STARTED TODAY</span>
          <h2 className="cta-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 800, marginTop: 12, marginBottom: 16, color: '#fff' }}>
            Start Building Your Skills
          </h2>
          <p style={{ color: '#D1D5DB', marginBottom: 36, lineHeight: 1.8, fontSize: '1rem', maxWidth: 500, margin: '0 auto 36px' }}>
            Free. Open source. No credit card. Just sign up and start learning.
          </p>
          <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#F97316,#C2410C)', color: '#fff', textDecoration: 'none', padding: '17px 40px', borderRadius: 12, fontWeight: 700, fontSize: '1rem', boxShadow: '0 6px 20px rgba(249,115,22,0.45)' }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#fff', borderTop: '1px solid #F3F4F6', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#F97316,#C2410C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>TechPulse Academy</span>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: 12 }}>Open Source · MIT License</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          <a href="https://github.com/TitoKilonzo/techpulse-academy" style={{ color: '#F97316', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>GitHub</a>
          <Link href="/login"  style={{ color: '#F97316', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>Login</Link>
          <Link href="/signup" style={{ color: '#F97316', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>Sign Up</Link>
        </div>
        <p style={{ color: '#D1D5DB', fontSize: '0.75rem', marginTop: 16 }}>© {new Date().getFullYear()} TechPulse Academy. Built with Next.js.</p>
      </footer>
    </div>
  );
}
