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

const CATEGORIES = [
  { id: 'cybersecurity', Icon: ShieldCheck,  label: 'Cybersecurity',  desc: 'SOC labs, network security, ethical hacking', color: '#F43F5E' },
  { id: 'ai',            Icon: BrainCircuit, label: 'AI & Claude',    desc: 'LLMs, prompt engineering, Anthropic API',   color: '#A855F7' },
  { id: 'cloud',         Icon: Cloud,        label: 'Cloud Computing',desc: 'AWS, Docker, Kubernetes, serverless',       color: '#22D3EE' },
  { id: 'opensource',    Icon: GitBranch,    label: 'Open Source',    desc: 'Git, contributions, Linux, licensing',      color: '#10B981' },
  { id: 'tech',          Icon: Cpu,          label: 'Tech',           desc: 'Auth, networking, databases, APIs',         color: '#00D4FF' },
];

const FEATURES = [
  { Icon: Terminal, title: 'Hands-on Labs',      desc: 'Real tools — Splunk, Kali, AWS, Docker. Not simulated.' },
  { Icon: Lock,     title: 'JWT Auth + Turso DB', desc: 'Production-grade auth backed by libsql edge database.' },
  { Icon: Globe,    title: 'Open Source MIT',     desc: 'Fork it, self-host it, contribute back to the community.' },
  { Icon: Star,     title: 'Progress Tracking',   desc: 'Per-user lesson completion synced to your account.' },
];

function CategoryCard({ id, Icon, label, desc, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/dashboard/courses?cat=${id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? color : 'var(--border)'}`,
        borderRadius: 14,
        padding: 24,
        textDecoration: 'none',
        display: 'block',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{label}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
    </Link>
  );
}

function CourseCard({ course }) {
  const [hovered, setHovered] = useState(false);
  const meta = getCategoryMeta(course.category);
  return (
    <Link
      href={`/dashboard/courses/${course.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? meta.color : 'var(--border)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        textDecoration: 'none',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.35)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,23,41,0.85),transparent)' }} />
        <span style={{
          position: 'absolute', top: 12, left: 12,
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em',
          padding: '4px 10px', borderRadius: 100,
          color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`,
        }}>
          {meta.label.toUpperCase()}
        </span>
      </div>
      <div style={{ padding: '18px 20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 6, lineHeight: 1.35, color: 'var(--text-primary)' }}>{course.title}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </p>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={12} />{course.lessons.length} lessons</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} />{formatDuration(course.duration)}</span>
          <span style={{
            padding: '2px 8px', borderRadius: 100, fontSize: '0.7rem', textTransform: 'capitalize',
            background:  course.level === 'beginner' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
            color:       course.level === 'beginner' ? '#10B981' : '#F59E0B',
            border:      course.level === 'beginner' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(245,158,11,0.2)',
          }}>{course.level}</span>
        </div>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  const stats    = getTotalStats();
  const featured = getFeaturedCourses().slice(0, 3);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 768px) {
          .hero-title { font-size: 2.6rem !important; }
          .hero-sub   { font-size: 1rem !important; }
          .hero-btns  { flex-direction: column !important; align-items: stretch !important; }
          .stats-row  { gap: 24px !important; }
          .cat-grid   { grid-template-columns: 1fr 1fr !important; }
          .course-grid{ grid-template-columns: 1fr !important; }
          .feat-grid  { grid-template-columns: 1fr 1fr !important; }
          .auth-split { grid-template-columns: 1fr !important; }
          .hide-mobile{ display: none !important; }
          .show-mobile{ display: flex !important; }
          .cta-box    { padding: 40px 24px !important; }
          .cta-title  { font-size: 1.6rem !important; }
          .nav-desktop{ display: none !important; }
        }
        @media (max-width: 480px) {
          .cat-grid   { grid-template-columns: 1fr !important; }
          .feat-grid  { grid-template-columns: 1fr !important; }
          .stats-row  { flex-wrap: wrap !important; gap: 16px !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(6,9,21,0.9)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>TechPulse</span>
        </Link>

        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="#courses"  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', padding: '8px 14px', borderRadius: 8 }}>Courses</Link>
          <Link href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', padding: '8px 14px', borderRadius: 8 }}>Features</Link>
          <Link href="/login"    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>Log in</Link>
          <Link href="/signup"   style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600 }}>Get Started</Link>
        </div>

        {/* Mobile menu button */}
        <button className="show-mobile" onClick={() => setMobileNavOpen(o => !o)} style={{
          display: 'none', background: 'none', border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 10px', color: 'var(--text-secondary)', cursor: 'pointer', alignItems: 'center',
        }}>
          Menu
        </button>
      </nav>

      {/* Mobile nav dropdown */}
      {mobileNavOpen && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99,
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
          padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <Link href="#courses"  onClick={() => setMobileNavOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>Courses</Link>
          <Link href="/login"    onClick={() => setMobileNavOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>Log in</Link>
          <Link href="/signup"   onClick={() => setMobileNavOpen(false)} style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', color: '#fff', textDecoration: 'none', padding: '12px 16px', borderRadius: 8, fontWeight: 600, textAlign: 'center' }}>Get Started Free</Link>
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{ paddingTop: 130, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'absolute', top: '-10%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12),transparent 70%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.1),transparent 70%)', zIndex: 0 }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D4FF', boxShadow: '0 0 8px #00D4FF' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cyan)', letterSpacing: '0.08em' }}>OPEN SOURCE · MIT LICENSE</span>
          </div>

          <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.6rem,7vw,5rem)', lineHeight: 1.1, marginBottom: 20 }}>
            <span className="gradient-text">Build. Hack.</span><br />
            <span style={{ color: 'var(--text-primary)' }}>Deploy.</span>
          </h1>

          <p className="hero-sub" style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.8 }}>
            The open-source learning platform for tech enthusiasts mastering Cybersecurity, Cloud Computing, Claude AI, Open Source, and more.
          </p>

          <div className="hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: 10, fontWeight: 600, fontSize: '0.95rem' }}>
              Start Learning Free <ArrowRight size={16} />
            </Link>
            <a href="https://github.com/your-username/techpulse-academy" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', padding: '14px 28px', borderRadius: 10, fontSize: '0.95rem' }}>
              <GitBranch size={16} /> View on GitHub
            </a>
          </div>

          <div className="stats-row" style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 56, flexWrap: 'wrap' }}>
            {[
              { value: `${stats.totalCourses}+`, label: 'Courses' },
              { value: `${stats.totalLessons}+`, label: 'Lessons' },
              { value: `${stats.totalHours}h+`,  label: 'Content' },
              { value: 'Free',                   label: 'Open Source' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', color: 'var(--cyan)' }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="courses" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>Five Learning Tracks</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 40 }}>From beginner to production-ready across the most in-demand tech disciplines.</p>
        <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
          {CATEGORIES.map(cat => <CategoryCard key={cat.id} {...cat} />)}
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section style={{ padding: '40px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,3vw,1.6rem)', fontWeight: 700 }}>Featured Courses</h2>
          <Link href="/dashboard/courses" style={{ color: 'var(--cyan)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
          {featured.map(c => <CourseCard key={c.slug} course={c} />)}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>Built for real learning</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 48 }}>Not a slide-show. Real tools, real code, real deployments.</p>
        <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--cyan-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={22} color="var(--cyan)" />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div className="cta-box" style={{ maxWidth: 680, margin: '0 auto', background: 'linear-gradient(135deg,rgba(0,212,255,0.06),rgba(124,58,237,0.08))', border: '1px solid var(--border)', borderRadius: 24, padding: '60px 40px', textAlign: 'center' }}>
          <h2 className="cta-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 800, marginBottom: 16 }}>Start building your skills today</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.8, maxWidth: 480, margin: '0 auto 32px' }}>
            Free. Open source. No credit card. Just sign up and start learning.
          </p>
          <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', color: '#fff', textDecoration: 'none', padding: '16px 36px', borderRadius: 12, fontWeight: 700, fontSize: '1rem' }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>TechPulse Academy — Open Source, MIT License</p>
        <p style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <a href="https://github.com/your-username/techpulse-academy" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>GitHub</a>
          <Link href="/login"  style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Login</Link>
          <Link href="/signup" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </footer>
    </div>
  );
}
