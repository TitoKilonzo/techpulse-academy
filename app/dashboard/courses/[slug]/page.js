import { getCourseBySlug } from '@/lib/courses';
import { getCurrentUser } from '@/lib/auth';
import { queryFirst } from '@/lib/db';
import { getCategoryMeta, formatDuration } from '@/lib/utils';
import { notFound } from 'next/navigation';
import CourseViewer from '@/components/courses/CourseViewer';

export async function generateMetadata({ params }) {
  const course = getCourseBySlug(params.slug);
  return { title: course?.title ?? 'Course' };
}

export default async function CoursePage({ params }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

  const payload  = await getCurrentUser();
  if (!payload) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  const progress = await queryFirst(
    'SELECT completed_lessons FROM user_progress WHERE user_id=? AND course_slug=?',
    [payload.id, params.slug]
  );
  const completedLessons = JSON.parse(progress?.completed_lessons ?? '[]');
  const meta = getCategoryMeta(course.category);

  return (
    <CourseViewer
      course={course}
      completedLessons={completedLessons}
      categoryMeta={meta}
    />
  );
}
