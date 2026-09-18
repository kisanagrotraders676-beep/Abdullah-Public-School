import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  Receipt,
  Landmark,
  Building2,
  FileSpreadsheet,
  BrainCircuit,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  BookOpen,
  FileText,
  Scale,
} from 'lucide-react';
import { UserRole, SchoolSettings } from '../types';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole: UserRole;
  schoolSettings: SchoolSettings;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  roles: string[];
  highlight?: boolean;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  userRole,
  schoolSettings,
  onLogout,
}) => {
  const navSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Administrator', 'Principal', 'Teacher', 'Accountant', 'Receptionist', 'Librarian', 'HR Manager', 'Parent', 'Student'] },
      ],
    },
    {
      title: 'Academics & People',
      items: [
        { id: 'students', label: 'Students & Parents', icon: Users, roles: ['Super Admin', 'Administrator', 'Principal', 'Teacher', 'Receptionist'] },
        { id: 'faculty', label: 'Faculty & Staff', icon: GraduationCap, roles: ['Super Admin', 'Administrator', 'Principal', 'HR Manager'] },
      ],
    },
    {
      title: 'Operations',
      items: [
        { id: 'attendance', label: 'Attendance Hub', icon: CalendarCheck, roles: ['Super Admin', 'Administrator', 'Principal', 'Teacher', 'HR Manager', 'Parent', 'Student'], highlight: true },
        { id: 'exams', label: 'Exams & Results', icon: Award, roles: ['Super Admin', 'Administrator', 'Principal', 'Teacher', 'Parent', 'Student'] },
        { id: 'campus', label: 'Campus & Classes', icon: Building2, roles: ['Super Admin', 'Administrator', 'Principal', 'Teacher', 'Receptionist', 'Librarian', 'Parent', 'Student'] },
      ],
    },
    {
      title: 'Finance & Accounts',
      items: [
        { id: 'fees', label: 'Fees & Accounts', icon: Receipt, roles: ['Super Admin', 'Administrator', 'Principal', 'Accountant', 'Parent', 'Student'] },
      ],
    },
    {
      title: 'Intelligence & Reports',
      items: [
        { id: 'reports', label: 'Reports Center', icon: FileText, roles: ['Super Admin', 'Administrator', 'Principal', 'Accountant', 'HR Manager'] },
        { id: 'ai-advisor', label: 'AI Academic Advisor', icon: BrainCircuit, roles: ['Super Admin', 'Administrator', 'Principal', 'Teacher', 'Accountant'], badge: 'HIGH THINKING' },
      ],
    },
    {
      title: 'Integration & System',
      items: [
        { id: 'google-sync', label: 'Google Sheets & ERP Hub', icon: FileSpreadsheet, roles: ['Super Admin', 'Administrator', 'Principal'] },
        { id: 'settings', label: 'School Settings', icon: Settings, roles: ['Super Admin', 'Administrator'] },
      ],
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`relative flex flex-col bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 select-none z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 h-20">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 border border-blue-400/30 overflow-hidden">
            {schoolSettings.logo ? (
              <img
                src={schoolSettings.logo}
                alt="School Crest"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <GraduationCap className="w-6 h-6 text-white" />
            )}
          </div>
          {!collapsed && (
            <div className="truncate">
              <h1 className="font-bold text-sm tracking-tight text-white truncate leading-tight">
                {schoolSettings.schoolName}
              </h1>
              <p className="text-[11px] text-blue-400 font-medium truncate flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                ERP v2.4 • Active
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
        {navSections.map((section, sIdx) => {
          const visibleItems = section.items.filter((item) =>
            item.roles.includes(userRole)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {section.title}
                </p>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    } ${item.highlight && !isActive ? 'ring-1 ring-emerald-500/30' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : item.highlight
                          ? 'text-emerald-400 group-hover:text-emerald-300'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full truncate">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 shrink-0">
                            {item.badge}
                          </span>
                        )}
                        {item.highlight && !item.badge && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* User Info / Role Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-xs text-blue-300 shrink-0">
              {userRole.slice(0, 2).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{userRole}</p>
                <p className="text-[10px] text-slate-400 truncate">{schoolSettings.academicSession}</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
