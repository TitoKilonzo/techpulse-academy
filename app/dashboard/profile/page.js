import { getCurrentUser } from '@/lib/auth';
import { queryFirst, queryAll } from '@/lib/db';
import { courses } from '@/lib/courses';
import { User, Mail, Calendar, Star, ShieldCheck, Trophy, Flame, BookOpen } from 'lucide-react';
import ProfileForm from '@/components/dashboard/ProfileForm';

export const metadata = { title: 'Profile | TechPulse' };

export default async function ProfilePage() {
  const payload  = await getCurrentUser();
  const user     = await queryFirst('SELECT * FROM users WHERE id=?', [payload.id]);
  const progress = await queryAll('SELECT * FROM user_progress WHERE user_id=?', [payload.id]);

  const completedCourses = progress.filter(p=>p.completed);
  const totalLessons     = progress.reduce((a,p)=>a+(JSON.parse(p.completed_lessons||'[]').length),0);
  const joinDate         = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : 'Unknown';

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2rem)', marginBottom: 24, color: 'var(--text-primary)' }}>My Profile</h1>

      {/* Hero Profile Card */}
      <div className="card-premium animate-fade-up" style={{ padding: 32, display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(to left, var(--orange-glow), transparent)', opacity: 0.3, pointerEvents: 'none' }} />
        
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(232,134,12,0.4)', border: '4px solid var(--bg-card)' }}>
          <span style={{ fontSize: '2.5rem', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</span>
        </div>
        
        <div style={{ flex: 1, zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name}</h2>
            {user?.role === 'admin' && (
              <span className="badge-gold" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px' }}>
                <ShieldCheck size={14} /> Admin
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={16} color="var(--orange)" />{user?.email}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={16} color="var(--orange)" />Joined {joinDate}</div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid animate-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginTop: 24, animationDelay: '100ms' }}>
        {[
          { label: 'Courses Enrolled', value: progress.length,         Icon: BookOpen, color: 'var(--blue)' },
          { label: 'Completed Courses',value: completedCourses.length, Icon: Trophy,   color: 'var(--emerald)' },
          { label: 'Lessons Done',     value: totalLessons,            Icon: Star,     color: 'var(--violet)' },
          { label: 'Current Streak',   value: user?.streak ?? 0,       Icon: Flame,    color: 'var(--orange)' },
        ].map(({label, value, Icon, color}) => (
          <div key={label} className="card-premium" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `color-mix(in srgb, ${color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={24} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)', lineHeight: 1, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Form Component */}
      <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <ProfileForm user={user} />
      </div>

      {/* Course Progress List */}
      <div className="card-premium animate-fade-up" style={{ marginTop: 32, padding: 32, animationDelay: '300ms' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', marginBottom: 24, color: 'var(--text-primary)' }}>Your Learning Journey</h3>
        {progress.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No courses started yet. Browse the catalog to get started!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {progress.map(p => {
              const course = courses.find(c=>c.slug===p.course_slug);
              if (!course) return null;
              const done = JSON.parse(p.completed_lessons||'[]').length;
              const pct  = Math.round((done/course.lessons.length)*100);
              return (
                <div key={p.course_slug} style={{ display: 'flex', gap: 20, alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  {/* Abstract Thumbnail */}
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: `linear-gradient(135deg, var(--surface-dark), var(--orange))`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{course.title.substring(0,2)}</span>
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="progress-bar" style={{ flex: 1, background: 'var(--bg-primary)' }}>
                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: p.completed ? 'var(--emerald)' : 'var(--orange)' }} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{done}/{course.lessons.length} ({pct}%)</div>
                    </div>
                  </div>
                  {p.completed && <span className="badge-gold" style={{ background: 'var(--emerald-dim)', color: 'var(--emerald)', border: '1px solid var(--emerald)' }}>COMPLETED</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
