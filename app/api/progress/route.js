/**
 * GET|POST /api/progress
 *
 * Security fixes:
 *  C3 — lessonCount now derived server-side from course data, NOT trusted from client
 *  C4 — courseSlug and lessonId validated against real course data
 *  H3 — XP only awarded for newly-completed lessons (prevent replay farming)
 *  H4 — same-origin check on POST
 *  H5 — body size guard
 *  M3 — safe error logging
 */
import { NextResponse }           from 'next/server';
import { getCurrentUser }         from '@/lib/auth';
import { queryFirst, query, queryAll } from '@/lib/db';
import { getCourseBySlug }        from '@/lib/courses';
import {
  progressLimiter,
  isSameOrigin,
  isBodyTooLarge,
  logError,
} from '@/lib/security';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const rows = await queryAll(
      'SELECT course_slug, completed_lessons, lesson_count, completed, last_accessed FROM user_progress WHERE user_id = ?',
      [payload.id]
    );
    return NextResponse.json({ progress: rows });
  } catch (err) {
    logError('progress:GET', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // ── Body size guard ──
    if (isBodyTooLarge(request)) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
    }

    // ── Auth ──
    const payload = await getCurrentUser();
    if (!payload) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    // ── CSRF check ──
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // ── Rate limiting ──
    const rl = progressLimiter(payload.id);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    // ── Parse body ──
    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }); }

    const { courseSlug, lessonId } = body;

    // ── C4: Validate courseSlug against real data ──
    if (typeof courseSlug !== 'string' || !courseSlug.trim()) {
      return NextResponse.json({ error: 'Invalid course.' }, { status: 400 });
    }
    const course = getCourseBySlug(courseSlug.trim());
    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    // ── C4: Validate lessonId against real lesson list ──
    const lessonIdNum = Number(lessonId);
    if (!Number.isInteger(lessonIdNum) || lessonIdNum < 1) {
      return NextResponse.json({ error: 'Invalid lesson.' }, { status: 400 });
    }
    const lesson = course.lessons.find(l => l.id === lessonIdNum);
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found in this course.' }, { status: 404 });
    }

    // ── C3: Derive lessonCount server-side — never from client ──
    const realLessonCount = course.lessons.length;

    // ── Fetch existing progress row ──
    const existing = await queryFirst(
      'SELECT id, completed_lessons FROM user_progress WHERE user_id = ? AND course_slug = ?',
      [payload.id, courseSlug]
    );

    let completedList = existing ? JSON.parse(existing.completed_lessons || '[]') : [];

    // ── H3: Only award XP if this is a genuinely NEW lesson completion ──
    const isNewLesson = !completedList.includes(lessonIdNum);

    if (isNewLesson) {
      completedList.push(lessonIdNum);
    }

    const isDone = completedList.length >= realLessonCount ? 1 : 0;

    if (existing) {
      await query(
        `UPDATE user_progress
         SET completed_lessons = ?,
             lesson_count      = ?,
             completed         = ?,
             last_accessed     = datetime('now')
         WHERE id = ?`,
        [JSON.stringify(completedList), realLessonCount, isDone, existing.id]
      );
    } else {
      await query(
        `INSERT INTO user_progress (user_id, course_slug, completed_lessons, lesson_count, completed)
         VALUES (?, ?, ?, ?, ?)`,
        [payload.id, courseSlug, JSON.stringify(completedList), realLessonCount, isDone]
      );
    }

    // Award XP only for new lesson completions; cap at 99,999 (H3)
    if (isNewLesson) {
      await query(
        `UPDATE users
         SET xp = CASE WHEN xp + 10 > 99999 THEN 99999 ELSE xp + 10 END
         WHERE id = ?`,
        [payload.id]
      );
    }

    return NextResponse.json({ ok: true, newLesson: isNewLesson, courseComplete: isDone === 1 });

  } catch (err) {
    logError('progress:POST', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
