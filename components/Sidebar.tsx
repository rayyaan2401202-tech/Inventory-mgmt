
import React from 'react';
import { View, UserRole } from '../types';
import { DashboardIcon, InventoryIcon, SalesIcon, AnalyticsIcon, SyncIcon } from './icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  userRole: UserRole;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: View;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}> = ({ icon, label, isActive, onClick, disabled }) => {
    const baseClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200";
    const activeClasses = "bg-indigo-600 text-white shadow-lg";
    const inactiveClasses = "text-slate-200 hover:bg-slate-700 hover:text-white";
    const disabledClasses = "text-slate-500 cursor-not-allowed";

    return (
        <li>
            <button
                onClick={onClick}
                disabled={disabled}
                className={`${baseClasses} w-full text-left ${
                    disabled ? disabledClasses : isActive ? activeClasses : inactiveClasses
                }`}
            >
                {icon}
                <span className="ml-3">{label}</span>
            </button>
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, userRole }) => {
  const navItems = [
    { view: View.DASHBOARD, icon: <DashboardIcon className="w-5 h-5" />, disabled: false },
    { view: View.INVENTORY, icon: <InventoryIcon className="w-5 h-5" />, disabled: false },
    { view: View.SALES, icon: <SalesIcon className="w-5 h-5" />, disabled: false },
    { view: View.ANALYTICS, icon: <AnalyticsIcon className="w-5 h-5" />, disabled: userRole !== UserRole.ADMIN },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-slate-700">
        <SyncIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-xl font-bold ml-2">SyncStock</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map(item => (
             <NavItem
                key={item.view}
                icon={item.icon}
                label={item.view}
                isActive={currentView === item.view}
                onClick={() => setCurrentView(item.view)}
                disabled={item.disabled}
            />
          ))}
        </ul>
      </nav>
      <div className="px-4 py-4 border-t border-slate-700 text-xs text-slate-400">
        &copy; 2024 SyncStock Inc.
      </div>
    </aside>
  );
};

export default Sidebar;
