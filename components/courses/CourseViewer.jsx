'use client';
import { useState, useCallback } from 'react';
import {
  Clock, ChevronLeft, ChevronRight,
  CheckCircle, PlayCircle, FlaskConical, HelpCircle, Award,
} from 'lucide-react';
import { formatDuration, calcProgress } from '@/lib/utils';

/* ── inline content renderer ── */
function renderInline(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`'))
      return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith('**') && p.endsWith('**'))
      return <strong key={i} style={{ color: '#111827', fontWeight: 600 }}>{p.slice(2, -2)}</strong>;
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
      <pre key={si} style={{ background: '#0A1220', border: '1px solid #E5E7EB', borderRadius: 10, padding: 16, overflow: 'auto', marginBottom: 16, marginTop: 8 }}>
        {seg.lang && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: '#9CA3AF', marginBottom: 8, letterSpacing: '0.1em' }}>{seg.lang.toUpperCase()}</div>}
        <code style={{ background: 'none', border: 'none', padding: 0, color: '#A8C0D6', fontSize: '0.82rem', lineHeight: 1.7 }}>{seg.code}</code>
      </pre>
    );

    return seg.text.split('\n').map((line, li) => {
      if (!line) return <br key={`${si}-${li}`} />;
      if (line.startsWith('- '))
        return <li key={`${si}-${li}`} style={{ marginLeft: 20, marginBottom: 4, color: '#4B5563' }}>{renderInline(line.slice(2))}</li>;
      if (/^\d+\. /.test(line))
        return <li key={`${si}-${li}`} style={{ marginLeft: 22, marginBottom: 4, color: '#4B5563' }}>{renderInline(line.replace(/^\d+\. /, ''))}</li>;
      if (line.startsWith('**') && line.endsWith('**'))
        return <strong key={`${si}-${li}`} style={{ display: 'block', color: '#111827', fontWeight: 600, marginTop: 14, marginBottom: 4 }}>{line.slice(2, -2)}</strong>;
      return <p key={`${si}-${li}`} style={{ marginBottom: 8, color: '#4B5563', lineHeight: 1.78 }}>{renderInline(line)}</p>;
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
        <div key={qi} style={{ marginBottom: 22, background: 'var(--bg-hover)', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px' }}>
          <p style={{ fontWeight: 600, marginBottom: 14, color: '#111827', lineHeight: 1.5, fontSize: '0.9rem' }}>
            {qi + 1}. {q.q}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.options.map((opt, oi) => {
              const sel     = answers[qi] === oi;
              const correct = submitted && oi === q.answer;
              const wrong   = submitted && sel && oi !== q.answer;
              return (
                <button key={oi} onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))} style={{
                  textAlign: 'left', padding: '10px 14px', borderRadius: 8,
                  cursor: submitted ? 'default' : 'pointer', fontSize: '0.875rem',
                  transition: 'all 0.15s',
                  background: correct ? 'rgba(16,185,129,0.12)' : wrong ? 'rgba(239,68,68,0.10)' : sel ? 'rgba(249,115,22,0.10)' : 'var(--bg-card)',
                  border:     correct ? '1px solid rgba(16,185,129,0.4)' : wrong ? '1px solid rgba(244,63,94,0.35)' : sel ? '1px solid rgba(0,212,255,0.4)' : '1px solid var(--border)',
                  color:      correct ? '#10B981' : wrong ? '#EF4444' : sel ? '#F97316' : '#4B5563',
                }}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={!allDone} style={{
          background: 'linear-gradient(135deg,#F97316,#C2410C)', color: '#fff', border: 'none',
          borderRadius: 9, padding: '12px 28px', fontWeight: 600, cursor: allDone ? 'pointer' : 'not-allowed',
          fontSize: '0.9rem', opacity: allDone ? 1 : 0.5, transition: 'opacity 0.2s',
        }}>
          Submit Quiz
        </button>
      ) : (
        <div style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
          <Award size={34} color="var(--cyan)" style={{ marginBottom: 10 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#F97316' }}>
            {score} / {lesson.questions.length}
          </div>
          <div style={{ color: '#4B5563', marginTop: 4, fontSize: '0.875rem' }}>
            {score === lesson.questions.length ? '🎉 Perfect score!' : score >= lesson.questions.length * 0.7 ? 'Great work!' : 'Keep practicing!'}
          </div>
        </div>
      )}
    </div>
  );
}

const TYPE_ICON  = { lesson: PlayCircle, lab: FlaskConical, quiz: HelpCircle };
const TYPE_COLOR = { lesson: '#F97316',  lab: '#F59E0B',    quiz: '#A78BFA'  };

export default function CourseViewer({ course, completedLessons, categoryMeta }) {
  const [activeIdx,   setActiveIdx]   = useState(0);
  const [completed,   setCompleted]   = useState(new Set(completedLessons));
  const [marking,     setMarking]     = useState(false);
  const [listVisible, setListVisible] = useState(true);  // mobile toggle

  const lesson   = course.lessons[activeIdx];
  const totalDone= completed.size;
  const pct      = calcProgress(totalDone, course.lessons.length);
  const TIcon    = TYPE_ICON[lesson.type]  ?? PlayCircle;
  const tColor   = TYPE_COLOR[lesson.type] ?? '#F97316';

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
    }
    setMarking(false);
    if (activeIdx + 1 < course.lessons.length) setActiveIdx(i => i + 1);
  }, [lesson.id, course.slug, course.lessons.length, activeIdx, completed, marking]);

  const isDone = completed.has(lesson.id);

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Course banner + progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <img src={course.thumbnail} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em', padding: '3px 9px', borderRadius: 100, color: categoryMeta.color, background: categoryMeta.bg, border: `1px solid ${categoryMeta.border}` }}>
              {categoryMeta.label.toUpperCase()}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{course.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#9CA3AF', flexShrink: 0 }}>{totalDone}/{course.lessons.length} · {pct}%</span>
          </div>
        </div>
        {/* Mobile: toggle lesson list */}
        <button onClick={() => setListVisible(v => !v)} style={{
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
          padding: '7px 12px', color: '#4B5563', cursor: 'pointer',
          fontSize: '0.8rem', display: 'none',
        }} className="viewer-toggle-btn">
          {listVisible ? 'Hide' : 'Lessons'}
        </button>
      </div>

      {/* Main viewer shell */}
      <div className="viewer-shell" style={{ display: 'flex', gap: 20, height: 'calc(100vh - 200px)', minHeight: 400 }}>

        {/* ── Lesson list sidebar ── */}
        {listVisible && (
          <div className="viewer-lesson-list" style={{
            width: 272, flexShrink: 0,
            background: '#F9FAFB', border: '1px solid #E5E7EB',
            borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '0.72rem', color: '#9CA3AF', letterSpacing: '0.08em' }}>
              LESSONS ({course.lessons.length})
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {course.lessons.map((l, i) => {
                const LIcon = TYPE_ICON[l.type]  ?? PlayCircle;
                const lClr  = TYPE_COLOR[l.type] ?? '#F97316';
                const done  = completed.has(l.id);
                const active= i === activeIdx;
                return (
                  <button key={l.id} onClick={() => setActiveIdx(i)} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    width: '100%', padding: '10px 14px',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: active ? `${categoryMeta.color}12` : 'transparent',
                    borderLeft: `3px solid ${active ? categoryMeta.color : 'transparent'}`,
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ marginTop: 1, flexShrink: 0 }}>
                      {done
                        ? <CheckCircle size={15} color="#10B981" />
                        : <LIcon size={15} color={active ? lClr : '#9CA3AF'} />
                      }
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: active ? 600 : 400, color: active ? '#111827' : '#4B5563', lineHeight: 1.35, marginBottom: 2, wordBreak: 'break-word' }}>
                        {l.title}
                      </div>
                      <div style={{ fontSize: '0.63rem', color: '#9CA3AF' }}>
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
        <div className="viewer-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Lesson header card */}
          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ background: `${tColor}18`, border: `1px solid ${tColor}35`, color: tColor, fontFamily: 'var(--font-mono)', fontSize: '0.63rem', letterSpacing: '0.08em', padding: '3px 9px', borderRadius: 100 }}>
                  {lesson.type.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  {activeIdx + 1} / {course.lessons.length}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', color: '#9CA3AF' }}>
                  <Clock size={11} />{lesson.duration}m
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1rem,3vw,1.25rem)', lineHeight: 1.25 }}>
                {lesson.title}
              </h1>
            </div>
            {isDone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, padding: '7px 12px', color: '#10B981', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
                <CheckCircle size={14} /> Complete
              </div>
            )}
          </div>

          {/* Lesson body */}
          <div style={{ flex: 1, overflowY: 'auto', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: 'clamp(18px,3vw,28px) clamp(18px,4vw,32px)' }}>
            {lesson.type === 'quiz'
              ? <Quiz lesson={lesson} />
              : <div>{renderContent(lesson.content)}</div>
            }
          </div>

          {/* Navigation bar */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
              disabled={activeIdx === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 8, fontSize: '0.875rem',
                background: '#fff', border: '1px solid #E5E7EB',
                cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
                color: '#4B5563', opacity: activeIdx === 0 ? 0.45 : 1,
                flexShrink: 0,
              }}
            >
              <ChevronLeft size={15} /> Prev
            </button>

            <button
              onClick={markComplete}
              disabled={marking}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem',
                background: isDone ? 'rgba(16,185,129,0.1)' : 'linear-gradient(135deg,#F97316,#C2410C)',
                border:     isDone ? '1px solid rgba(16,185,129,0.3)' : 'none',
                color:      isDone ? '#10B981' : '#fff',
                cursor: marking ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isDone
                ? <><CheckCircle size={15} /> Done — Next lesson</>
                : 'Mark Complete & Continue'
              }
            </button>

            <button
              onClick={() => setActiveIdx(i => Math.min(course.lessons.length - 1, i + 1))}
              disabled={activeIdx === course.lessons.length - 1}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 8, fontSize: '0.875rem',
                background: '#fff', border: '1px solid #E5E7EB',
                cursor: activeIdx === course.lessons.length - 1 ? 'not-allowed' : 'pointer',
                color: '#4B5563',
                opacity: activeIdx === course.lessons.length - 1 ? 0.45 : 1,
                flexShrink: 0,
              }}
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .viewer-shell    { flex-direction: column !important; height: auto !important; }
          .viewer-lesson-list { width: 100% !important; max-height: 200px; }
          .viewer-content  { height: 65vh; min-height: 340px; }
          .viewer-toggle-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
