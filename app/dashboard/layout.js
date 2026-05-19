'use client';
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashHeader from '@/components/dashboard/DashHeader';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dash-shell">
      {/* Sidebar backdrop on mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dash-main">
        <DashHeader onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}
