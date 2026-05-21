import { getCurrentUser } from '@/lib/auth';
import { queryFirst, queryAll } from '@/lib/db';
import { courses } from '@/lib/courses';
import { User, Mail, Calendar, Zap, BookOpen, Star } from 'lucide-react';

export const metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const payload  = await getCurrentUser();
  const user     = await queryFirst('SELECT * FROM users WHERE id=?', [payload.id]);
  const progress = await queryAll('SELECT * FROM user_progress WHERE user_id=?', [payload.id]);

  const completedCourses = progress.filter(p=>p.completed);
  const totalLessons     = progress.reduce((a,p)=>a+(JSON.parse(p.completed_lessons||'[]').length),0);
  const joinDate         = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : 'Unknown';

  return (
    <div style={{ maxWidth:800 }}>
      <h1 style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.6rem',marginBottom:28 }}>My Profile</h1>

      {/* Profile card */}
      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,padding:32,marginBottom:24,display:'flex',gap:28,alignItems:'flex-start',flexWrap:'wrap' }}>
        <div style={{ width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#F97316,#C2410C)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <User size={36} color="#fff" />
        </div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:700,marginBottom:4 }}>{user?.name}</h2>
          <div style={{ display:'flex',flexDirection:'column',gap:8,marginTop:10 }}>
            {[
              { Icon:Mail,     text:user?.email },
              { Icon:Calendar, text:`Joined ${joinDate}` },
              { Icon:Star,     text:`${user?.xp ?? 0} XP earned` },
            ].map(({ Icon,text }) => (
              <div key={text} style={{ display:'flex',alignItems:'center',gap:8,color:'var(--text-secondary)',fontSize:'0.875rem' }}>
                <Icon size={14} color="var(--text-muted)" />{text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:28 }}>
        {[
          { label:'Enrolled',           value:progress.length,         color:'#2563EB' },
          { label:'Completed Courses',  value:completedCourses.length, color:'#10B981' },
          { label:'Total Lessons Done', value:totalLessons,            color:'#A78BFA' },
        ].map(({label,value,color})=>(
          <div key={label} style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,padding:'20px 24px',textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'2rem',color,marginBottom:4 }}>{value}</div>
            <div style={{ fontSize:'0.75rem',color:'var(--text-muted)',letterSpacing:'0.04em' }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Course progress list */}
      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,padding:24 }}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1rem',marginBottom:18 }}>Course Progress</h3>
        {progress.length === 0 ? (
          <p style={{ color:'var(--text-muted)',fontSize:'0.875rem' }}>No courses started yet.</p>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            {progress.map(p => {
              const course = courses.find(c=>c.slug===p.course_slug);
              if (!course) return null;
              const done = JSON.parse(p.completed_lessons||'[]').length;
              const pct  = Math.round((done/course.lessons.length)*100);
              return (
                <div key={p.course_slug} style={{ display:'flex',gap:14,alignItems:'center' }}>
                  <img src={course.thumbnail} alt="" style={{ width:44,height:44,borderRadius:8,objectFit:'cover',flexShrink:0 }} />
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:'0.875rem',fontWeight:500,marginBottom:4,color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{course.title}</div>
                    <div className="progress-bar" style={{ marginBottom:4 }}>
                      <div className="progress-bar-fill" style={{ width:`${pct}%` }} />
                    </div>
                    <div style={{ fontSize:'0.7rem',color:'var(--text-muted)' }}>{done}/{course.lessons.length} lessons · {pct}%</div>
                  </div>
                  {p.completed && <span style={{ fontSize:'0.7rem',color:'#10B981',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:100,padding:'3px 10px',fontFamily:'var(--font-mono)',flexShrink:0 }}>DONE</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
