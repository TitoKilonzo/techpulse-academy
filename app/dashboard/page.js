import { getCurrentUser } from '@/lib/auth';
import { queryFirst, queryAll } from '@/lib/db';
import { getFeaturedCourses, courses as allCourses } from '@/lib/courses';
import { getCategoryMeta, formatDuration, calcProgress } from '@/lib/utils';
import { BookOpen, Clock, Zap, Flame, ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const payload  = await getCurrentUser();
  const user     = await queryFirst('SELECT id,name,xp,streak FROM users WHERE id=?', [payload.id]);
  const progress = await queryAll('SELECT * FROM user_progress WHERE user_id=?', [payload.id]);

  const enrolled    = progress.length;
  const completedC  = progress.filter(p => p.completed).length;
  const totalLessons= progress.reduce((a, p) => a + (JSON.parse(p.completed_lessons || '[]').length), 0);

  const inProgress = progress
    .filter(p => !p.completed)
    .map(p => ({ ...p, course: allCourses.find(c => c.slug === p.course_slug) }))
    .filter(p => p.course)
    .slice(0, 3);

  const featured = getFeaturedCourses().slice(0, 4);

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,1.8rem)', marginBottom: 4 }}>
          Welcome back, {user?.name?.split(' ')[0] ?? 'Learner'} 👋
        </h1>
        <p style={{ color: '#4B5563', fontSize: '0.875rem' }}>Continue where you left off.</p>
      </div>

      {/* Stats grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 32 }}>
        {[
          { Icon: BookOpen,    label: 'Enrolled',     value: enrolled,      color: '#F97316' },
          { Icon: Zap,         label: 'Lessons Done', value: totalLessons,  color: '#7C3AED' },
          { Icon: PlayCircle,  label: 'Completed',    value: completedC,    color: '#10B981' },
          { Icon: Flame,       label: 'XP Earned',    value: user?.xp ?? 0, color: '#F59E0B' },
        ].map(({ Icon, label, value, color }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color={color} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#9CA3AF', letterSpacing: '0.05em' }}>{label.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.7rem', color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* In progress */}
      {inProgress.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>Continue Learning</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {inProgress.map(({ course_slug, completed_lessons, course }) => {
              const done = JSON.parse(completed_lessons || '[]').length;
              const pct  = calcProgress(done, course.lessons.length);
              const meta = getCategoryMeta(course.category);
              return (
                <Link key={course_slug} href={`/dashboard/courses/${course_slug}`} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: '#fff', border: '1px solid #E5E7EB',
                  borderRadius: 12, padding: '14px 18px', textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}>
                  <img src={course.thumbnail} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 5, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {course.title}
                    </div>
                    <div className="progress-bar" style={{ marginBottom: 4 }}>
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{done}/{course.lessons.length} lessons · {pct}%</div>
                  </div>
                  <ArrowRight size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured courses */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Featured Courses</h2>
          <Link href="/dashboard/courses" style={{ color: '#F97316', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            All courses <ArrowRight size={12} />
          </Link>
        </div>
        <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
          {featured.map(c => {
            const meta  = getCategoryMeta(c.category);
            const prog  = progress.find(p => p.course_slug === c.slug);
            const done  = prog ? JSON.parse(prog.completed_lessons || '[]').length : 0;
            const pct   = calcProgress(done, c.lessons.length);
            return (
              <Link key={c.slug} href={`/dashboard/courses/${c.slug}`} className="course-card" style={{
                display: 'block', background: '#fff', border: '1px solid #E5E7EB',
                borderRadius: 14, overflow: 'hidden', textDecoration: 'none',
              }}>
                <div style={{ position: 'relative', height: 130, overflow: 'hidden' }}>
                  <img src={c.thumbnail} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.55),transparent)' }} />
                  <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: 'var(--font-mono)', fontSize: '0.62rem', padding: '3px 8px', borderRadius: 100, color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}>
                    {meta.label.toUpperCase()}
                  </span>
                  {prog?.completed && (
                    <span style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.62rem', color: '#10B981', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 100, padding: '3px 8px', fontFamily: 'var(--font-mono)' }}>DONE</span>
                  )}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4, lineHeight: 1.35 }}>{c.title}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem', color: '#9CA3AF', marginBottom: done > 0 ? 10 : 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><BookOpen size={10} />{c.lessons.length}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} />{formatDuration(c.duration)}</span>
                  </div>
                  {done > 0 && (
                    <>
                      <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${pct}%` }} /></div>
                      <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: 4 }}>{pct}% complete</div>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .courses-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .courses-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
