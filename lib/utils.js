import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getLevelColor(level) {
  return {
    beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    advanced: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  }[level] ?? 'text-gray-400 bg-gray-400/10';
}

export function getCategoryMeta(category) {
  const map = {
    tech: {
      label: 'Tech',
      color: '#60A5FA',
      bg: 'rgba(37,99,235,0.10)',
      border: 'rgba(37,99,235,0.22)',
      tailwind: 'text-blue-400 bg-blue-600/10 border-blue-500/20',
    },
    cybersecurity: {
      label: 'Cybersecurity',
      color: '#F87171',
      bg: 'rgba(239,68,68,0.10)',
      border: 'rgba(239,68,68,0.22)',
      tailwind: 'text-red-400 bg-red-500/10 border-red-500/20',
    },
    ai: {
      label: 'AI & Claude',
      color: '#A78BFA',
      bg: 'rgba(99,102,241,0.10)',
      border: 'rgba(99,102,241,0.22)',
      tailwind: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
    cloud: {
      label: 'Cloud Computing',
      color: '#38BDF8',
      bg: 'rgba(14,165,233,0.10)',
      border: 'rgba(14,165,233,0.22)',
      tailwind: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    opensource: {
      label: 'Open Source',
      color: '#34D399',
      bg: 'rgba(16,185,129,0.10)',
      border: 'rgba(16,185,129,0.22)',
      tailwind: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  };
  return map[category] ?? map.tech;
}

export function calcProgress(completedLessons, totalLessons) {
  if (!totalLessons) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}
