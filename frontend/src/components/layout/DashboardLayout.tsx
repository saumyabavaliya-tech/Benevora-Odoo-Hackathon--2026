import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  tripId?: string;
  hideSidebar?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  tripId,
  hideSidebar = false,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#2563EB] selection:text-white font-sans antialiased">
      <Navbar />
      <div className="flex-1 flex w-full">
        {!hideSidebar && <Sidebar tripId={tripId} />}
        <main className="flex-1 pb-20 lg:pb-10 overflow-x-hidden min-w-0 bg-[#F8FAFC]">
          {children}
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
};

