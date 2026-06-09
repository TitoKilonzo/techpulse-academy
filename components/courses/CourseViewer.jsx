'use client';
import { useState, useCallback } from 'react';
import {
  Clock, ChevronLeft, ChevronRight,
  CheckCircle, PlayCircle, FlaskConical, HelpCircle, Award,
  MessageSquare, Bookmark, Send, BookmarkCheck, Share2, Download
} from 'lucide-react';
import { formatDuration, calcProgress } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';

/* ── inline content renderer ── */
function renderInline(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`'))
      return <code key={i} style={{ background: 'var(--bg-hover)', color: 'var(--orange-dark)', padding: '2px 6px', borderRadius: 4, fontSize: '0.85em', fontFamily: 'var(--font-mono)' }}>{p.slice(1, -1)}</code>;
    if (p.startsWith('**') && p.endsWith('**'))
      return <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
    return p;
  });
}

function renderContent(raw) {
  if (!raw) return null;
  const segs = [];
  const re   = /```(\w*)\n([\s\S]*?)```/g;
  let last = 0, m;
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) segs.push({ type: 'text', text: raw.slice(last, m.index) });
    segs.push({ type: 'code', lang: m[1], code: m[2] });
    last = re.lastIndex;
  }
  if (last < raw.length) segs.push({ type: 'text', text: raw.slice(last) });

  return segs.map((seg, si) => {
    if (seg.type === 'code') return (
      <pre key={si} style={{ background: 'var(--surface-dark)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, overflow: 'auto', marginBottom: 20, marginTop: 12 }}>
        {seg.lang && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 10, letterSpacing: '0.1em' }}>{seg.lang.toUpperCase()}</div>}
        <code style={{ background: 'none', border: 'none', padding: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.6 }}>{seg.code}</code>
      </pre>
    );

    return seg.text.split('\n').map((line, li) => {
      if (!line) return <br key={`${si}-${li}`} />;
      if (line.startsWith('- '))
        return <li key={`${si}-${li}`} style={{ marginLeft: 24, marginBottom: 8, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{renderInline(line.slice(2))}</li>;
      if (/^\d+\. /.test(line))
        return <li key={`${si}-${li}`} style={{ marginLeft: 26, marginBottom: 8, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{renderInline(line.replace(/^\d+\. /, ''))}</li>;
      if (line.startsWith('**') && line.endsWith('**'))
        return <strong key={`${si}-${li}`} style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 800, marginTop: 24, marginBottom: 12, fontSize: '1.1rem' }}>{line.slice(2, -2)}</strong>;
      return <p key={`${si}-${li}`} style={{ marginBottom: 16, color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>{renderInline(line)}</p>;
    });
  });
}

/* ── Quiz component ── */
function Quiz({ lesson }) {
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!lesson.questions) return <div>{renderContent(lesson.content)}</div>;

  const score    = submitted ? lesson.questions.filter((q, i) => answers[i] === q.answer).length : 0;
  const allDone  = Object.keys(answers).length === lesson.questions.length;

  return (
    <div>
      {lesson.questions.map((q, qi) => (
        <div key={qi} className="card-premium animate-fade-up" style={{ marginBottom: 24, padding: '24px', animationDelay: `${qi * 100}ms` }}>
          <p style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
            {qi + 1}. {q.q}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {q.options.map((opt, oi) => {
              const sel     = answers[qi] === oi;
              const correct = submitted && oi === q.answer;
              const wrong   = submitted && sel && oi !== q.answer;
              return (
                <button key={oi} onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))} className="focus-ring" style={{
                  textAlign: 'left', padding: '14px 20px', borderRadius: 12,
                  cursor: submitted ? 'default' : 'pointer', fontSize: '0.95rem',
                  transition: 'all 0.2s',
                  background: correct ? 'var(--emerald-dim)' : wrong ? 'var(--rose-dim)' : sel ? 'var(--orange-dim)' : 'var(--bg-primary)',
                  border:     correct ? '1.5px solid var(--emerald)' : wrong ? '1.5px solid var(--rose)' : sel ? '1.5px solid var(--orange)' : '1.5px solid var(--border)',
                  color:      correct ? 'var(--emerald)' : wrong ? 'var(--rose)' : sel ? 'var(--orange-dark)' : 'var(--text-secondary)',
                  fontWeight: sel ? 600 : 500,
                }}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={!allDone} className="btn-primary" style={{
          width: '100%', padding: '16px', fontWeight: 700, fontSize: '1.05rem',
          opacity: allDone ? 1 : 0.5, cursor: allDone ? 'pointer' : 'not-allowed',
        }}>
          Submit Quiz
        </button>
      ) : (
        <div className="card-premium animate-fade-in" style={{ padding: 32, textAlign: 'center', background: 'var(--bg-hover)', border: '1.5px solid var(--orange-glow)' }}>
          <Award size={48} color="var(--orange)" style={{ marginBottom: 16 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
            {score} / {lesson.questions.length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            {score === lesson.questions.length ? '🎉 Flawless victory!' : score >= lesson.questions.length * 0.7 ? 'Great work!' : 'Keep practicing, you got this!'}
          </div>
        </div>
      )}
    </div>
  );
}

const TYPE_ICON  = { lesson: PlayCircle, lab: FlaskConical, quiz: HelpCircle };
const TYPE_COLOR = { lesson: 'var(--orange)',  lab: 'var(--violet)',    quiz: 'var(--cyan)'  };

/* ── Discussions Component ── */
function LessonDiscussions({ lessonId }) {
  const [comments, setComments] = useState([
    { id: 1, user: 'Alex C.', avatar: 'A', text: 'This lab was really helpful for understanding the concepts!', time: '2 hours ago' },
    { id: 2, user: 'Sarah J.', avatar: 'S', text: 'I got stuck on step 3, but looking at the hint clarified it.', time: '5 hours ago' }
  ]);
  const [newComment, setNewComment] = useState('');
  const { addToast } = useToast();

  const handlePost = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([{ id: Date.now(), user: 'You', avatar: 'Y', text: newComment, time: 'Just now' }, ...comments]);
    setNewComment('');
    addToast('Discussion posted', 'success');
  };

  return (
    <div style={{ marginTop: 48, borderTop: '1px solid var(--border)', paddingTop: 32 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <MessageSquare size={20} color="var(--orange)" /> Community Discussion
      </h3>
      
      <form onSubmit={handlePost} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>Y</div>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            value={newComment} onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts or ask a question..." 
            style={{ width: '100%', background: 'var(--bg-primary)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '12px 48px 12px 16px', fontSize: '0.95rem', color: 'var(--text-primary)', outline: 'none' }}
            className="focus-ring"
          />
          <button type="submit" disabled={!newComment.trim()} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'var(--orange)', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newComment.trim() ? 'pointer' : 'not-allowed', opacity: newComment.trim() ? 1 : 0.5, color: '#fff' }}>
            <Send size={16} />
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {comments.map(c => (
          <div key={c.id} className="animate-fade-in" style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-hover)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontWeight: 700, flexShrink: 0 }}>{c.avatar}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{c.user}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.time}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CourseViewer({ course, completedLessons, categoryMeta }) {
  const { addToast } = useToast();
  const [activeIdx,   setActiveIdx]   = useState(0);
  const [completed,   setCompleted]   = useState(new Set(completedLessons));
  const [marking,     setMarking]     = useState(false);
  const [listVisible, setListVisible] = useState(true);
  const [bookmarked,  setBookmarked]  = useState({ course: false, lessons: {} });

  const lesson   = course.lessons[activeIdx];
  const totalDone= completed.size;
  const pct      = calcProgress(totalDone, course.lessons.length);
  const TIcon    = TYPE_ICON[lesson.type]  ?? PlayCircle;
  const tColor   = TYPE_COLOR[lesson.type] ?? 'var(--orange)';
  const courseDone = totalDone === course.lessons.length;

  const markComplete = useCallback(async () => {
    if (marking) return;
    setMarking(true);
    if (!completed.has(lesson.id)) {
      setCompleted(prev => new Set([...prev, lesson.id]));
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: course.slug, lessonId: lesson.id, lessonCount: course.lessons.length }),
      });
      addToast('Lesson completed! +10 XP', 'success');
    }
    setMarking(false);
    if (activeIdx + 1 < course.lessons.length) setActiveIdx(i => i + 1);
  }, [lesson.id, course.slug, course.lessons.length, activeIdx, completed, marking, addToast]);

  const toggleBookmark = (type, id = null) => {
    if (type === 'course') {
      setBookmarked(prev => ({ ...prev, course: !prev.course }));
      addToast(bookmarked.course ? 'Course removed from bookmarks' : 'Course bookmarked', 'success');
    } else {
      setBookmarked(prev => ({ ...prev, lessons: { ...prev.lessons, [id]: !prev.lessons[id] } }));
      addToast(bookmarked.lessons[id] ? 'Lesson removed from bookmarks' : 'Lesson bookmarked', 'success');
    }
  };

  const isDone = completed.has(lesson.id);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      
      {/* ── Course Certificate Banner (if done) ── */}
      {courseDone && (
        <div className="card-premium animate-fade-down" style={{ background: 'linear-gradient(135deg, var(--orange-dark), var(--orange))', padding: '24px 32px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.4)' }}>
              <Award size={28} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>Course Completed!</h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>You&apos;ve mastered {course.title}. Claim your certificate.</p>
            </div>
          </div>
          <button className="glass" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'background 0.2s' }}>
            <Download size={18} /> View Certificate
          </button>
        </div>
      )}

      {/* ── Course Header ── */}
      <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: '20px 24px', flexWrap: 'wrap' }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: `linear-gradient(135deg, var(--surface-dark), ${categoryMeta.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{course.title.substring(0,2)}</span>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className="badge-gold" style={{ color: categoryMeta.color, background: categoryMeta.bg, borderColor: categoryMeta.border }}>
              {categoryMeta.label.toUpperCase()}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{course.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="progress-bar" style={{ flex: 1, maxWidth: 300, background: 'var(--bg-primary)' }}>
              <div className="progress-bar-fill" style={{ width: `${pct}%`, background: 'var(--orange)' }} />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{totalDone}/{course.lessons.length} ({pct}%)</span>
          </div>
        </div>
        
        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => toggleBookmark('course')} className="btn-secondary" style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {bookmarked.course ? <BookmarkCheck size={20} color="var(--orange)" /> : <Bookmark size={20} color="var(--text-secondary)" />}
          </button>
          <button className="btn-secondary" style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2 size={20} color="var(--text-secondary)" />
          </button>
          <button onClick={() => setListVisible(v => !v)} className="btn-secondary" style={{ display: 'none', padding: '10px 16px', fontWeight: 600 }} id="mobile-toggle">
            {listVisible ? 'Hide Lessons' : 'View Lessons'}
          </button>
        </div>
      </div>

      {/* ── Main viewer shell ── */}
      <div className="viewer-shell" style={{ display: 'flex', gap: 24, height: 'calc(100vh - 220px)', minHeight: 600 }}>

        {/* ── Lesson list sidebar ── */}
        {listVisible && (
          <div className="viewer-lesson-list card-premium" style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 700 }}>
              CURRICULUM ({course.lessons.length})
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {course.lessons.map((l, i) => {
                const LIcon = TYPE_ICON[l.type]  ?? PlayCircle;
                const lClr  = TYPE_COLOR[l.type] ?? 'var(--orange)';
                const done  = completed.has(l.id);
                const active= i === activeIdx;
                return (
                  <button key={l.id} onClick={() => setActiveIdx(i)} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    width: '100%', padding: '12px 16px', marginBottom: 4,
                    border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 12,
                    background: active ? 'var(--orange-dim)' : 'transparent',
                    boxShadow: active ? 'inset 2px 0 0 var(--orange)' : 'none',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ marginTop: 2, flexShrink: 0 }}>
                      {done
                        ? <CheckCircle size={18} color="var(--emerald)" />
                        : <LIcon size={18} color={active ? lClr : 'var(--text-muted)'} />
                      }
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: active ? 700 : 500, color: active ? 'var(--orange-dark)' : 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 4 }}>
                        {l.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {l.type} · {l.duration}m
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Content area ── */}
        <div className="viewer-content card-premium" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Lesson header */}
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <span className="badge-gold" style={{ background: `color-mix(in srgb, ${tColor} 15%, transparent)`, color: tColor, borderColor: `color-mix(in srgb, ${tColor} 30%, transparent)` }}>
                  {lesson.type.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lesson {activeIdx + 1} of {course.lessons.length}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <Clock size={14} />{lesson.duration} min
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.8rem)', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {lesson.title}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => toggleBookmark('lesson', lesson.id)} className="btn-secondary" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.85rem' }}>
                {bookmarked.lessons[lesson.id] ? <><BookmarkCheck size={16} color="var(--orange)" /> Saved</> : <><Bookmark size={16} /> Save</>}
              </button>
            </div>
          </div>

          {/* Lesson body & Discussions */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              {lesson.type === 'quiz' ? <Quiz lesson={lesson} /> : renderContent(lesson.content)}
              
              <LessonDiscussions lessonId={lesson.id} />
            </div>
          </div>

          {/* Navigation bar */}
          <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border)', background: 'var(--bg-primary)', display: 'flex', gap: 16 }}>
            <button
              onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
              disabled={activeIdx === 0}
              className="btn-secondary"
              style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8, opacity: activeIdx === 0 ? 0.5 : 1, cursor: activeIdx === 0 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={18} /> Prev
            </button>

            <button
              onClick={markComplete}
              disabled={marking}
              className="btn-primary"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '12px 24px', fontWeight: 700, fontSize: '1rem',
                background: isDone ? 'var(--emerald-dim)' : 'linear-gradient(135deg, var(--orange), var(--orange-dark))',
                color:      isDone ? 'var(--emerald)' : '#fff',
                border:     isDone ? '1.5px solid var(--emerald)' : 'none',
                boxShadow:  isDone ? 'none' : '0 4px 14px rgba(249,115,22,0.3)',
                cursor: marking ? 'not-allowed' : 'pointer',
              }}
            >
              {isDone ? <><CheckCircle size={18} /> Completed — Next</> : 'Mark Complete & Continue'}
            </button>

            <button
              onClick={() => setActiveIdx(i => Math.min(course.lessons.length - 1, i + 1))}
              disabled={activeIdx === course.lessons.length - 1}
              className="btn-secondary"
              style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8, opacity: activeIdx === course.lessons.length - 1 ? 0.5 : 1, cursor: activeIdx === course.lessons.length - 1 ? 'not-allowed' : 'pointer' }}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .viewer-shell { flex-direction: column !important; height: auto !important; }
          .viewer-lesson-list { width: 100% !important; max-height: 250px; }
          .viewer-content { height: 75vh; min-height: 400px; }
          #mobile-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
}
