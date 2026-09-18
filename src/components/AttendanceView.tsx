import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  Sparkles,
  Lock,
  Unlock,
  Printer,
  Download,
  Filter,
  Users,
  Search,
  Check,
  X,
  AlertCircle,
  Save,
} from 'lucide-react';
import {
  Student,
  ClassItem,
  SectionItem,
  StudentAttendance,
  AttendanceStatus,
  SchoolSettings,
} from '../types';

interface AttendanceViewProps {
  students: Student[];
  classes: ClassItem[];
  sections: SectionItem[];
  attendanceRecords: StudentAttendance[];
  onSaveAttendance: (records: StudentAttendance[]) => void;
  schoolSettings: SchoolSettings;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  classes,
  sections,
  attendanceRecords,
  onSaveAttendance,
  schoolSettings,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedClassId, setSelectedClassId] = useState<string>('CLS-9');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('SEC-9A');
  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'summary'>('student');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter students for selected class & section
  const currentStudents = students.filter(
    (s) =>
      s.classId === selectedClassId &&
      s.sectionId === selectedSectionId &&
      (searchFilter === '' ||
        s.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        s.rollNo.includes(searchFilter) ||
        s.admissionNo.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  // Map local state of attendance statuses for these students
  const [localStatuses, setLocalStatuses] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    students.forEach((s) => {
      const existing = attendanceRecords.find(
        (a) => a.studentId === s.studentId && a.date === selectedDate
      );
      map[s.studentId] = {
        status: existing ? existing.status : 'Present',
        remarks: existing?.remarks || '',
      };
    });
    return map;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    if (isLocked) {
      showToast('Attendance is locked for this session. Unlock first to modify.');
      return;
    }
    setLocalStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: newStatus,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    if (isLocked) return;
    setLocalStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    if (isLocked) {
      showToast('Attendance is locked. Unlock to make bulk modifications.');
      return;
    }
    setLocalStatuses((prev) => {
      const updated = { ...prev };
      currentStudents.forEach((s) => {
        updated[s.studentId] = {
          ...updated[s.studentId],
          status,
        };
      });
      return updated;
    });
    showToast(`Marked all ${currentStudents.length} students as ${status}.`);
  };

  const saveAttendance = () => {
    const recordsToSave: StudentAttendance[] = currentStudents.map((s) => ({
      id: `ATT-${selectedDate}-${s.studentId}`,
      date: selectedDate,
      academicSession: schoolSettings.academicSession,
      classId: selectedClassId,
      sectionId: selectedSectionId,
      studentId: s.studentId,
      status: localStatuses[s.studentId]?.status || 'Present',
      remarks: localStatuses[s.studentId]?.remarks || '',
      markedBy: 'Current Staff User',
      isLocked,
    }));

    onSaveAttendance(recordsToSave);
    showToast(`Successfully saved attendance for Grade 9-A (${recordsToSave.length} students).`);
  };

  // Status counters for current filtered list
  const currentPresent = currentStudents.filter((s) => localStatuses[s.studentId]?.status === 'Present').length;
  const currentAbsent = currentStudents.filter((s) => localStatuses[s.studentId]?.status === 'Absent').length;
  const currentLate = currentStudents.filter((s) => localStatuses[s.studentId]?.status === 'Late').length;
  const currentLeave = currentStudents.filter((s) => localStatuses[s.studentId]?.status === 'Leave').length;
  const currentHalfDay = currentStudents.filter((s) => localStatuses[s.studentId]?.status === 'Half Day').length;

  const statusConfig: Record<AttendanceStatus, { label: string; emoji: string; bg: string; text: string; border: string; activeClass: string }> = {
    Present: {
      label: 'Present',
      emoji: '🟢',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      activeClass: 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40',
    },
    Absent: {
      label: 'Absent',
      emoji: '🔴',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      activeClass: 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/40',
    },
    Late: {
      label: 'Late',
      emoji: '🟡',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      activeClass: 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/40',
    },
    Leave: {
      label: 'Leave',
      emoji: '🔵',
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      activeClass: 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-400/40',
    },
    'Half Day': {
      label: 'Half Day',
      emoji: '🟣',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      activeClass: 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400/40',
    },
  };

  return (
    <div id="attendance-hub" className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-3 z-50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner with Color Scheme Legend */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Rollcall Management</span>
              <span>•</span>
              <span>Academic Session {schoolSettings.academicSession}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarCheck className="w-7 h-7 text-emerald-600" />
              <span>Dedicated Attendance Hub</span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Rapid daily rollcall with visual status codes, lock controls, and duplicate prevention.
            </p>
          </div>

          {/* Lovely Professional Color Scheme Legend */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-xs font-bold text-slate-500 px-2">Legend:</span>
            {Object.entries(statusConfig).map(([st, cfg]) => (
              <span
                key={st}
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
              >
                <span>{cfg.emoji}</span>
                <span>{cfg.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Date, Class, Section, Lock Status, and Bulk Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Attendance Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Class Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Class / Grade</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {classes.map((c) => (
                <option key={c.classId} value={c.classId}>
                  {c.name} ({c.roomNo})
                </option>
              ))}
            </select>
          </div>

          {/* Section Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Section</label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {sections
                .filter((sec) => sec.classId === selectedClassId)
                .map((sec) => (
                  <option key={sec.sectionId} value={sec.sectionId}>
                    {sec.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Filter Student</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name or roll #"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Operational Bar: Counters & Bulk Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
          {/* Quick Counter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              Total: <strong>{currentStudents.length}</strong>
            </span>
            <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              🟢 {currentPresent} Present
            </span>
            <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
              🔴 {currentAbsent} Absent
            </span>
            <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
              🟡 {currentLate} Late
            </span>
            <span className="px-2 py-1 rounded-lg bg-sky-50 text-sky-700 font-bold text-xs border border-sky-200">
              🔵 {currentLeave} Leave
            </span>
            <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
              🟣 {currentHalfDay} Half Day
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => markAll('Present')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
            >
              Mark All Present
            </button>
            <button
              onClick={() => markAll('Absent')}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition"
            >
              Mark All Absent
            </button>
            <button
              onClick={() => {
                setIsLocked(!isLocked);
                showToast(isLocked ? 'Attendance record unlocked.' : 'Attendance record locked for editing.');
              }}
              className={`p-2 rounded-xl border text-xs font-medium transition ${
                isLocked
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isLocked ? 'Locked (Click to Unlock)' : 'Unlocked (Click to Lock)'}
            >
              {isLocked ? <Lock className="w-4 h-4 text-rose-600" /> : <Unlock className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={saveAttendance}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Rollcall</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Roll #</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Father / Contact</th>
                <th className="py-3.5 px-4 text-center">Status Selection (Click to mark)</th>
                <th className="py-3.5 px-4">Remarks / Excuse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold">No students found matching current filters.</p>
                  </td>
                </tr>
              ) : (
                currentStudents.map((st) => {
                  const currStatus = localStatuses[st.studentId]?.status || 'Present';
                  const currRemarks = localStatuses[st.studentId]?.remarks || '';

                  return (
                    <tr
                      key={st.studentId}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Roll No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {st.rollNo}
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
                            {st.photo ? (
                              <img
                                src={st.photo}
                                alt={st.fullName}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              st.fullName.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{st.fullName}</p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{st.admissionNo}</p>
                          </div>
                        </div>
                      </td>

                      {/* Parent Phone */}
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <p className="font-semibold text-slate-800">{st.fatherName}</p>
                        <p className="text-slate-500 font-mono">{st.parentPhone}</p>
                      </td>

                      {/* 5-Button Status Selector with Lovely Colors */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {(['Present', 'Absent', 'Late', 'Leave', 'Half Day'] as AttendanceStatus[]).map((opt) => {
                            const cfg = statusConfig[opt];
                            const isSelected = currStatus === opt;

                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={isLocked}
                                onClick={() => handleStatusChange(st.studentId, opt)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                                  isSelected
                                    ? cfg.activeClass
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                                } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                                title={`Mark ${opt}`}
                              >
                                <span>{cfg.emoji}</span>
                                <span className="hidden sm:inline">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Remarks */}
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          placeholder="e.g. Bus delay, sick"
                          disabled={isLocked}
                          value={currRemarks}
                          onChange={(e) => handleRemarksChange(st.studentId, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
