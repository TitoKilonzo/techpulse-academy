import { getCurrentUser } from '@/lib/auth';
import { queryFirst, queryAll } from '@/lib/db';
import { getFeaturedCourses, courses as allCourses } from '@/lib/courses';
import { getCategoryMeta, formatDuration, calcProgress } from '@/lib/utils';
import { BookOpen, Clock, Zap, Flame, ArrowRight, PlayCircle, Trophy, Activity } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const payload  = await getCurrentUser();
  if (!payload) redirect('/login');
  
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
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2rem)', marginBottom: 6, color: 'var(--text-primary)' }}>
            Welcome back, {user?.name?.split(' ')[0] ?? 'Learner'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Ready to conquer another lab today?</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--orange-glow)' }}>
            <Flame size={18} color="var(--orange)" fill="var(--orange)" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{user?.streak ?? 0} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {[
          { Icon: BookOpen,    label: 'Enrolled Courses',  value: enrolled,      color: 'var(--blue)' },
          { Icon: Zap,         label: 'Lessons Completed', value: totalLessons,  color: 'var(--violet)' },
          { Icon: Trophy,      label: 'Certificates Earned', value: completedC,    color: 'var(--emerald)' },
          { Icon: Activity,    label: 'Total XP Earned',   value: user?.xp ?? 0, color: 'var(--orange)' },
        ].map(({ Icon, label, value, color }, i) => (
          <div key={label} className="card-premium animate-fade-up" style={{ animationDelay: `${i * 100}ms`, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `color-mix(in srgb, ${color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, marginBottom: 40 }}>
        {/* In progress */}
        {inProgress.length > 0 && (
          <section className="animate-fade-up" style={{ animationDelay: '400ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Continue Learning</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {inProgress.map(({ course_slug, completed_lessons, course }) => {
                const done = JSON.parse(completed_lessons || '[]').length;
                const pct  = calcProgress(done, course.lessons.length);
                const meta = getCategoryMeta(course.category);
                return (
                  <Link key={course_slug} href={`/dashboard/courses/${course_slug}`} className="card-premium" style={{
                    display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px', textDecoration: 'none', transition: 'all 0.2s',
                  }}>
                    {/* Abstract Thumbnail */}
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: `linear-gradient(135deg, var(--surface-dark), ${meta.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{course.title.substring(0,2)}</span>
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 100, color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{meta.label.toUpperCase()}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {course.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="progress-bar" style={{ flex: 1, height: 6, background: 'var(--bg-primary)' }}>
                          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: 'var(--orange)', borderRadius: 100 }} />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: 45 }}>{pct}%</div>
                      </div>
                    </div>
                    
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>
                      <PlayCircle size={20} color="var(--orange)" fill="var(--orange-dim)" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Featured courses */}
        <section className="animate-fade-up" style={{ animationDelay: '500ms' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Recommended for You</h2>
            <Link href="/dashboard/courses" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px' }}>
              Browse Catalog <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
            {featured.map(c => {
              const meta  = getCategoryMeta(c.category);
              const prog  = progress.find(p => p.course_slug === c.slug);
              const done  = prog ? JSON.parse(prog.completed_lessons || '[]').length : 0;
              const pct   = calcProgress(done, c.lessons.length);
              
              return (
                <Link key={c.slug} href={`/dashboard/courses/${c.slug}`} className="card-premium course-card" style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, var(--surface-dark), ${meta.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{c.title.substring(0,2)}</span>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                    <span className="glass" style={{ position: 'absolute', top: 12, left: 12, fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '4px 10px', borderRadius: 100, color: meta.color, fontWeight: 700 }}>
                      {meta.label.toUpperCase()}
                    </span>
                    {prog?.completed && (
                      <span style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.65rem', color: '#10B981', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 100, padding: '4px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700, backdropFilter: 'blur(8px)' }}>DONE</span>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8, lineHeight: 1.4, color: 'var(--text-primary)' }}>{c.title}</div>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: done > 0 ? 16 : 0, fontWeight: 500 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={14} color="var(--orange)" />{c.lessons.length}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} color="var(--orange)" />{formatDuration(c.duration)}</span>
                    </div>
                    {done > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="progress-bar" style={{ flex: 1, background: 'var(--bg-primary)' }}>
                          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: 'var(--orange)' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--orange)', fontWeight: 700 }}>{pct}%</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid   { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
