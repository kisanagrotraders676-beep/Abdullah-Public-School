import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Calendar,
  CloudCheck,
  CheckCircle2,
  Shield,
  Layers,
  ChevronDown,
  FileSpreadsheet,
} from 'lucide-react';
import { UserRole, SchoolSettings } from '../types';

interface HeaderProps {
  schoolSettings: SchoolSettings;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  academicSession: string;
  onChangeSession: (session: string) => void;
  onOpenQuickAction: (action: string) => void;
  onOpenGoogleSync: () => void;
  onOpenAIAdvisor: () => void;
  isWorkspaceConnected: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  schoolSettings,
  userRole,
  onChangeRole,
  academicSession,
  onChangeSession,
  onOpenQuickAction,
  onOpenGoogleSync,
  onOpenAIAdvisor,
  isWorkspaceConnected,
  searchQuery,
  onSearchChange,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [sessionDropdownOpen, setSessionDropdownOpen] = useState(false);

  const availableRoles: UserRole[] = [
    'Super Admin',
    'Administrator',
    'Principal',
    'Teacher',
    'Accountant',
    'Receptionist',
    'Librarian',
    'HR Manager',
    'Parent',
    'Student',
  ];

  const availableSessions = ['2026-2027', '2025-2026', '2027-2028'];

  return (
    <header
      id="top-header"
      className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs"
    >
      {/* Left: Search & School Tagline */}
      <div className="flex items-center space-x-6 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Quick search student name, admission no, roll #, fee receipt..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right: Controls, Academic Session, Role Switcher, Google Workspace badge */}
      <div className="flex items-center space-x-3">
        {/* Google Workspace Connection Pill */}
        <button
          onClick={onOpenGoogleSync}
          id="btn-workspace-status"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-2xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          title="Google Workspace connected: Sheets, Drive, Gmail, Chat & Contacts active"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Google Workspace Active</span>
        </button>

        {/* High Thinking AI Advisor Button */}
        <button
          onClick={onOpenAIAdvisor}
          id="btn-open-ai-thinking"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:from-purple-700 hover:to-indigo-700 transition"
          title="High Thinking Academic Advisor (gemini-3.1-pro-preview)"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden md:inline">AI Academic Advisor</span>
          <span className="text-[10px] px-1 py-0.2 bg-white/20 rounded font-mono">3.1 PRO</span>
        </button>

        {/* Academic Session Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setSessionDropdownOpen(!sessionDropdownOpen);
              setRoleDropdownOpen(false);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium border border-slate-200 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold">{academicSession}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {sessionDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40">
              <p className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Academic Session
              </p>
              {availableSessions.map((ses) => (
                <button
                  key={ses}
                  onClick={() => {
                    onChangeSession(ses);
                    setSessionDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 transition flex items-center justify-between ${
                    academicSession === ses ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{ses}</span>
                  {academicSession === ses && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role Switcher (Live Role Preview) */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setSessionDropdownOpen(false);
            }}
            id="role-switcher-btn"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium shadow-xs transition"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Role: <strong className="text-blue-300">{userRole}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 max-h-80 overflow-y-auto">
              <p className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Switch Portal Role
              </p>
              {availableRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onChangeRole(r);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 transition flex items-center justify-between ${
                    userRole === r ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{r}</span>
                  {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
