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
    <div className="min-h-screen relative text-slate-100 flex flex-col selection:bg-[#2563EB] selection:text-white font-sans antialiased bg-slate-900">
      {/* Scenic Ambient Blurred Background Image */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        {/* Multilayer backdrop blur, gradient atmospheric wash & vignettes */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/80 to-blue-950/70 backdrop-blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />
      </div>

      {/* App Surface */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex w-full">
          {!hideSidebar && <Sidebar tripId={tripId} />}
          <main className="flex-1 pb-20 lg:pb-10 overflow-x-hidden min-w-0">
            {children}
          </main>
        </div>
        <MobileNavigation />
      </div>
    </div>
  );
};

