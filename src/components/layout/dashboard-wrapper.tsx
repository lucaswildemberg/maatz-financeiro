"use client";

import { Sidebar } from "./sidebar";

interface DashboardWrapperProps {
  userName?: string;
  children: React.ReactNode;
}

export function DashboardWrapper({ userName, children }: DashboardWrapperProps) {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      <Sidebar userName={userName} />
      
      <main className="flex-1 lg:pl-64">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}