import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  GraduationCap,
  Briefcase,
  Layers,
  CircleDollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  PlusCircle,
  CalendarCheck,
  Award,
  Receipt,
  FileSpreadsheet,
  Sparkles,
  Calendar,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import {
  Student,
  Teacher,
  Staff,
  ClassItem,
  StudentAttendance,
  FeeInvoice,
  FeeReceipt,
  Account,
  SchoolSettings,
} from '../types';

interface DashboardViewProps {
  students: Student[];
  teachers: Teacher[];
  staff: Staff[];
  classes: ClassItem[];
  attendanceRecords: StudentAttendance[];
  feeInvoices: FeeInvoice[];
  feeReceipts: FeeReceipt[];
  accounts: Account[];
  schoolSettings: SchoolSettings;
  onNavigate: (view: string) => void;
  onQuickAction: (action: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  teachers,
  staff,
  classes,
  attendanceRecords,
  feeInvoices,
  feeReceipts,
  accounts,
  schoolSettings,
  onNavigate,
  onQuickAction,
}) => {
  // Calculations
  const totalStudents = students.length;
  const maleStudents = students.filter((s) => s.gender === 'Male').length;
  const femaleStudents = students.filter((s) => s.gender === 'Female').length;
  const totalTeachers = teachers.length;
  const totalStaff = staff.length;
  const totalClasses = classes.length;

  // Today's attendance counts
  const presentCount = attendanceRecords.filter((a) => a.status === 'Present').length;
  const absentCount = attendanceRecords.filter((a) => a.status === 'Absent').length;
  const lateCount = attendanceRecords.filter((a) => a.status === 'Late').length;
  const leaveCount = attendanceRecords.filter((a) => a.status === 'Leave' || a.status === 'Half Day').length;
  const attendanceTotalMarked = attendanceRecords.length || 1;
  const attendanceRate = Math.round((presentCount / attendanceTotalMarked) * 100);

  // Financials
  const totalCollectedFees = feeReceipts.reduce((sum, r) => sum + r.amountPaid, 0);
  const totalOutstandingFees = feeInvoices.reduce((sum, inv) => sum + inv.balance, 0);
  const totalBankBalance = accounts
    .filter((acc) => acc.type === 'Asset')
    .reduce((sum, acc) => sum + acc.balance, 0);

  // Class distribution
  const classBreakdown = classes.slice(0, 6).map((cls) => {
    const count = students.filter((s) => s.classId === cls.classId).length;
    return { name: cls.name, count };
  });

  return (
    <div id="dashboard-view" className="space-y-6 pb-12">
      {/* Welcome Banner with School Info & Quick Date */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>{schoolSettings.registrationInfo}</span>
              <span>•</span>
              <span>Session {schoolSettings.academicSession}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {schoolSettings.schoolName}
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {schoolSettings.tagline} • Principal: <strong className="text-white">{schoolSettings.principalName}</strong>
            </p>
          </div>

          {/* Quick Actions Cluster */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onQuickAction('add-student')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Admit Student</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Take Attendance</span>
            </button>
            <button
              onClick={() => onNavigate('fees')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Receipt className="w-4 h-4" />
              <span>Collect Fee</span>
            </button>
            <button
              onClick={() => onQuickAction('ai-advisor')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Students */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Students</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{totalStudents}</p>
          <div className="flex items-center text-[11px] text-slate-500 mt-1 space-x-2">
            <span className="text-blue-600 font-medium">{maleStudents} Boys</span>
            <span>•</span>
            <span className="text-purple-600 font-medium">{femaleStudents} Girls</span>
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-indigo-300 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Faculty Teachers</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{totalTeachers}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {totalClasses} Grades & Labs
          </p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Attendance Today</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{attendanceRate}%</p>
          <div className="flex items-center text-[11px] text-slate-500 mt-1 space-x-1">
            <span className="text-emerald-700 font-bold">{presentCount} Present</span>
            <span>/</span>
            <span className="text-rose-600 font-bold">{absentCount} Absent</span>
          </div>
        </div>

        {/* Fee Collection */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-300 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Fees Collected</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-800">
            {schoolSettings.currencySymbol} {(totalCollectedFees / 1000).toFixed(1)}k
          </p>
          <p className="text-[11px] text-teal-600 font-medium mt-1">
            {feeReceipts.length} Receipts Processed
          </p>
        </div>

        {/* Outstanding Dues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-300 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Outstanding Fees</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-amber-600">
            {schoolSettings.currencySymbol} {(totalOutstandingFees / 1000).toFixed(1)}k
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Receivables Ledger</p>
        </div>

        {/* Liquid Reserves */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Current Balance</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-800">
            {schoolSettings.currencySymbol} {(totalBankBalance / 1000000).toFixed(2)}M
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Bank & Cash Accounts</p>
        </div>
      </div>

      {/* Attendance & Finance Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dedicated Attendance Status Breakdown with requested lovely color scheme */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>Today's Attendance Status</span>
              </h3>
              <p className="text-xs text-slate-500">Live student rollcall breakdown</p>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Scheme Status Badges */}
          <div className="grid grid-cols-2 gap-3">
            {/* Present: 🟢 emerald */}
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🟢</span>
                <div>
                  <p className="text-xs font-semibold text-emerald-900">Present</p>
                  <p className="text-[10px] text-emerald-700">On time</p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-emerald-700">{presentCount}</span>
            </div>

            {/* Absent: 🔴 rose */}
            <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔴</span>
                <div>
                  <p className="text-xs font-semibold text-rose-900">Absent</p>
                  <p className="text-[10px] text-rose-700">Unexcused</p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-rose-700">{absentCount}</span>
            </div>

            {/* Late: 🟡 amber */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🟡</span>
                <div>
                  <p className="text-xs font-semibold text-amber-900">Late</p>
                  <p className="text-[10px] text-amber-700">Delayed</p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-amber-700">{lateCount}</span>
            </div>

            {/* Leave: 🔵 sky & 🟣 purple */}
            <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔵</span>
                <div>
                  <p className="text-xs font-semibold text-sky-900">Leave / Half Day</p>
                  <p className="text-[10px] text-sky-700">Excused</p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-sky-700">{leaveCount}</span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Overall Campus Rate</span>
              <span className="font-bold text-slate-800">{attendanceRate}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                style={{ width: `${(presentCount / attendanceTotalMarked) * 100}%` }}
                className="bg-emerald-500 h-full"
                title="Present"
              ></div>
              <div
                style={{ width: `${(lateCount / attendanceTotalMarked) * 100}%` }}
                className="bg-amber-400 h-full"
                title="Late"
              ></div>
              <div
                style={{ width: `${(leaveCount / attendanceTotalMarked) * 100}%` }}
                className="bg-sky-400 h-full"
                title="Leave"
              ></div>
              <div
                style={{ width: `${(absentCount / attendanceTotalMarked) * 100}%` }}
                className="bg-rose-500 h-full"
                title="Absent"
              ></div>
            </div>
          </div>
        </div>

        {/* Academic & Class Demographics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Class Enrollment Distribution</span>
              </h3>
              <p className="text-xs text-slate-500">Student count across core grades</p>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {classBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>{item.name}</span>
                  <span className="font-bold text-slate-900">{item.count} students</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (item.count / 25) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Flow & Quick Ledger */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-teal-600" />
                <span>Financial Health & Recovery</span>
              </h3>
              <p className="text-xs text-slate-500">September 2026 Collection Cycle</p>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
            >
              <span>Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Total Billed Dues:</span>
              <span className="font-bold text-slate-900">
                {schoolSettings.currencySymbol} {(totalCollectedFees + totalOutstandingFees).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Total Realized:
              </span>
              <span className="font-bold text-emerald-700">
                {schoolSettings.currencySymbol} {totalCollectedFees.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" /> Pending Recovery:
              </span>
              <span className="font-bold text-amber-700">
                {schoolSettings.currencySymbol} {totalOutstandingFees.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Recent Payments list */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Latest Receipts</p>
            {feeReceipts.slice(0, 3).map((rcp) => (
              <div
                key={rcp.receiptId}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60 hover:bg-slate-100 transition text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-800">{rcp.studentName}</p>
                  <p className="text-[10px] text-slate-500">{rcp.receiptId} • {rcp.paymentMethod}</p>
                </div>
                <span className="font-bold text-emerald-700">
                  +{schoolSettings.currencySymbol} {rcp.amountPaid.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google Sheets Database & Apps Script Integration Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                Google Sheets Database & Google Apps Script Engine
              </h3>
              <p className="text-xs text-emerald-200">
                Automated 48-sheet schema, server-side locking, live Google Drive backup, and web app code
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Every record in this ERP maps directly to Google Sheets database columns with unique keys. Access the Apps Script Studio to copy ready-to-run <code className="text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded">Code.gs</code> and <code className="text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded">Setup.gs</code> files or sync live spreadsheet tables.
          </p>
        </div>

        <button
          onClick={() => onNavigate('google-sync')}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition shrink-0 flex items-center space-x-2"
        >
          <span>Open Apps Script Studio</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
