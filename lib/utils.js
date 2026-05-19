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
      color: '#00D4FF',
      bg: 'rgba(0,212,255,0.1)',
      border: 'rgba(0,212,255,0.2)',
      tailwind: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    },
    cybersecurity: {
      label: 'Cybersecurity',
      color: '#F43F5E',
      bg: 'rgba(244,63,94,0.1)',
      border: 'rgba(244,63,94,0.2)',
      tailwind: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    },
    ai: {
      label: 'AI & Claude',
      color: '#A855F7',
      bg: 'rgba(168,85,247,0.1)',
      border: 'rgba(168,85,247,0.2)',
      tailwind: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    },
    cloud: {
      label: 'Cloud Computing',
      color: '#22D3EE',
      bg: 'rgba(34,211,238,0.1)',
      border: 'rgba(34,211,238,0.2)',
      tailwind: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    },
    opensource: {
      label: 'Open Source',
      color: '#10B981',
      bg: 'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.2)',
      tailwind: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    },
  };
  return map[category] ?? map.tech;
}

export function calcProgress(completedLessons, totalLessons) {
  if (!totalLessons) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}
