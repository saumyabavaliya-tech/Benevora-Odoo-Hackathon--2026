import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plane, PlusCircle, Compass, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MobileNavigation: React.FC = () => {
  const items = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/trips/new', label: 'Plan', icon: PlusCircle, isCenter: true },
    { to: '/trips', label: 'Trips', icon: Plane },
    { to: '/travel-saarthi', label: 'Saarthi AI', icon: Sparkles },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all',
                  item.isCenter &&
                    'bg-blue-600/90 backdrop-blur-md text-white rounded-full p-2.5 -mt-4 shadow-xl shadow-blue-600/40 border border-blue-400/40 hover:bg-blue-500',
                  !item.isCenter &&
                    (isActive
                      ? 'text-blue-400 font-bold'
                      : 'text-slate-400 hover:text-white')
                )
              }
            >
              <Icon className={cn('w-5 h-5', item.isCenter && 'w-6 h-6 text-white')} />
              {!item.isCenter && (
                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
