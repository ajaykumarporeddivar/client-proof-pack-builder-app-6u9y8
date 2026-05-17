'use client';

import { AppSidebar } from '@/components/layout';
import { PlusSquare, LayoutDashboard, Download, Settings } from 'lucide-react';
import React from 'react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems: NavItem[] = [
    {
      icon: <PlusSquare size={16} />,
      label: 'Intake',
      href: '/dashboard/intake',
    },
    {
      icon: <LayoutDashboard size={16} />,
      label: 'Dashboard',
      href: '/dashboard/dashboard',
    },
    {
      icon: <Download size={16} />,
      label: 'Exports',
      href: '/dashboard/exports',
    },
    {
      icon: <Settings size={16} />,
      label: 'Settings',
      href: '/dashboard/settings', // Common pattern for SaaS, even if not an MVP feature page
    },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AppSidebar items={navItems} projectName="Client Proof Pack Builder" />
      <div className="flex-1 ml-64 flex flex-col min-h-full">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}