import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { FacultyView } from './components/FacultyView';
import { AttendanceView } from './components/AttendanceView';
import { MarksAndExamsView } from './components/MarksAndExamsView';
import { FeesAndAccountsView } from './components/FeesAndAccountsView';
import { CampusView } from './components/CampusView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { WorkspaceAndAppScriptModal } from './components/WorkspaceAndAppScriptModal';
import {
  initialStudents,
  initialTeachers,
  initialStaff,
  initialClasses,
  initialSections,
  initialSubjects,
  initialAttendanceRecords,
  initialExams,
  initialMarks,
  initialGradeRules,
  initialFeeInvoices,
  initialFeeReceipts,
  initialAccounts,
  initialTransactions,
  initialPayroll,
  initialNotices,
  initialSchoolSettings,
} from './data/mockData';
import {
  Student,
  Teacher,
  StudentAttendance,
  Mark,
  FeeInvoice,
  FeeReceipt,
  AccountTransaction,
  UserRole,
  SchoolSettings,
} from './types';

export default function App() {
  // Navigation & Role State
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('Super Admin');
  const [academicSession, setAcademicSession] = useState<string>('2026-2027');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Modals
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState<boolean>(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState<boolean>(false);

  // Master ERP Data Stores
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(initialSchoolSettings);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [staff, setStaff] = useState(initialStaff);
  const [classes, setClasses] = useState(initialClasses);
  const [sections, setSections] = useState(initialSections);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendance[]>(initialAttendanceRecords);
  const [exams, setExams] = useState(initialExams);
  const [marks, setMarks] = useState<Mark[]>(initialMarks);
  const [gradeRules, setGradeRules] = useState(initialGradeRules);
  const [feeInvoices, setFeeInvoices] = useState<FeeInvoice[]>(initialFeeInvoices);
  const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>(initialFeeReceipts);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [transactions, setTransactions] = useState<AccountTransaction[]>(initialTransactions);
  const [teacherSalaries, setTeacherSalaries] = useState(initialPayroll);
  const [notices, setNotices] = useState(initialNotices);

  // Quick Action Handler
  const handleQuickAction = (action: string) => {
    if (action === 'add-student') {
      setCurrentView('students');
    } else if (action === 'take-attendance') {
      setCurrentView('attendance');
    } else if (action === 'collect-fee') {
      setCurrentView('fees');
    } else if (action === 'ai-advisor') {
      setIsAIAdvisorOpen(true);
    } else if (action === 'google-sync') {
      setIsWorkspaceModalOpen(true);
    }
  };

  // Data Mutators
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === updatedStudent.studentId ? updatedStudent : s))
    );
  };

  const handleSaveAttendance = (recordsToSave: StudentAttendance[]) => {
    setAttendanceRecords((prev) => {
      const updated = [...prev];
      recordsToSave.forEach((newRec) => {
        const existingIdx = updated.findIndex(
          (r) => r.studentId === newRec.studentId && r.date === newRec.date
        );
        if (existingIdx >= 0) {
          updated[existingIdx] = newRec;
        } else {
          updated.push(newRec);
        }
      });
      return updated;
    });
  };

  const handleSaveMarks = (updatedMarks: Mark[]) => {
    setMarks((prev) => {
      const merged = [...prev];
      updatedMarks.forEach((newMark) => {
        const existingIdx = merged.findIndex(
          (m) =>
            m.examId === newMark.examId &&
            m.studentId === newMark.studentId &&
            m.subjectId === newMark.subjectId
        );
        if (existingIdx >= 0) {
          merged[existingIdx] = newMark;
        } else {
          merged.push(newMark);
        }
      });
      return merged;
    });
  };

  const handleRecordFeePayment = (receipt: FeeReceipt, invoiceId: string) => {
    // 1. Add receipt
    setFeeReceipts((prev) => [receipt, ...prev]);

    // 2. Update fee invoice balance
    setFeeInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceId === invoiceId) {
          const newPaid = inv.paidAmount + receipt.amountPaid;
          const newBalance = Math.max(0, inv.balance - receipt.amountPaid);
          const newStatus = newBalance === 0 ? 'Paid' : 'Partial';
          return {
            ...inv,
            paidAmount: newPaid,
            balance: newBalance,
            status: newStatus,
          };
        }
        return inv;
      })
    );

    // 3. Add to accounts transaction ledger
    const newTxn: AccountTransaction = {
      transactionId: `TXN-${Date.now()}`,
      date: receipt.paymentDate,
      accountId: 'ACC-101',
      type: 'Income',
      description: `Fee Collection - Receipt #${receipt.receiptId} (${receipt.studentName})`,
      debit: receipt.amountPaid,
      credit: 0,
      amount: receipt.amountPaid,
      paymentMethod: (receipt.paymentMethod === 'Other' ? 'Cash' : receipt.paymentMethod) as any,
      reference: receipt.receiptId,
      user: receipt.receivedBy,
      timestamp: new Date().toISOString(),
      runningBalance: 0,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    // 4. Update asset bank account balance
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.accountId === 'ACC-101'
          ? { ...acc, balance: acc.balance + receipt.amountPaid }
          : acc
      )
    );
  };

  const handleAddExpense = (txn: AccountTransaction) => {
    setTransactions((prev) => [txn, ...prev]);
  };

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  // Aggregated payload for Google Drive Export & Backup
  const fullSchoolPayload = useMemo(
    () => ({
      exportDate: new Date().toISOString(),
      schoolSettings,
      counts: {
        students: students.length,
        teachers: teachers.length,
        classes: classes.length,
      },
      students,
      teachers,
      staff,
      attendanceRecords,
      exams,
      marks,
      feeInvoices,
      feeReceipts,
      accounts,
      transactions,
    }),
    [
      schoolSettings,
      students,
      teachers,
      staff,
      attendanceRecords,
      exams,
      marks,
      feeInvoices,
      feeReceipts,
      accounts,
      transactions,
    ]
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
        schoolSettings={schoolSettings}
        onLogout={() => {
          setUserRole('Teacher');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          schoolSettings={schoolSettings}
          userRole={userRole}
          onChangeRole={(r) => setUserRole(r)}
          academicSession={academicSession}
          onChangeSession={(s) => setAcademicSession(s)}
          onOpenQuickAction={handleQuickAction}
          onOpenGoogleSync={() => setIsWorkspaceModalOpen(true)}
          onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
          isWorkspaceConnected={true}
          searchQuery={globalSearch}
          onSearchChange={(q) => setGlobalSearch(q)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <DashboardView
                students={students}
                teachers={teachers}
                staff={staff}
                classes={classes}
                attendanceRecords={attendanceRecords}
                feeInvoices={feeInvoices}
                feeReceipts={feeReceipts}
                accounts={accounts}
                schoolSettings={schoolSettings}
                onNavigate={(v) => setCurrentView(v)}
                onQuickAction={handleQuickAction}
              />
            )}

            {currentView === 'students' && (
              <StudentsView
                students={students}
                classes={classes}
                sections={sections}
                schoolSettings={schoolSettings}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
              />
            )}

            {currentView === 'faculty' && (
              <FacultyView
                teachers={teachers}
                staff={staff}
                schoolSettings={schoolSettings}
                onAddTeacher={handleAddTeacher}
              />
            )}

            {currentView === 'attendance' && (
              <AttendanceView
                students={students}
                classes={classes}
                sections={sections}
                attendanceRecords={attendanceRecords}
                onSaveAttendance={handleSaveAttendance}
                schoolSettings={schoolSettings}
              />
            )}

            {currentView === 'exams' && (
              <MarksAndExamsView
                students={students}
                exams={exams}
                subjects={subjects}
                marks={marks}
                gradeRules={gradeRules}
                classes={classes}
                sections={sections}
                schoolSettings={schoolSettings}
                onSaveMarks={handleSaveMarks}
              />
            )}

            {currentView === 'fees' && (
              <FeesAndAccountsView
                students={students}
                feeInvoices={feeInvoices}
                feeReceipts={feeReceipts}
                accounts={accounts}
                transactions={transactions}
                teacherSalaries={teacherSalaries}
                schoolSettings={schoolSettings}
                onRecordFeePayment={handleRecordFeePayment}
                onAddExpense={handleAddExpense}
              />
            )}

            {currentView === 'campus' && (
              <CampusView
                classes={classes}
                sections={sections}
                subjects={subjects}
                notices={notices}
                students={students}
                schoolSettings={schoolSettings}
              />
            )}

            {currentView === 'reports' && (
              <ReportsView
                students={students}
                attendanceRecords={attendanceRecords}
                feeInvoices={feeInvoices}
                marks={marks}
                schoolSettings={schoolSettings}
              />
            )}

            {currentView === 'google-sync' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Google Workspace & Apps Script Integration</h3>
                    <p className="text-xs text-slate-500">Live Drive, Sheets, and complete 48-sheet backend code.</p>
                  </div>
                  <button
                    onClick={() => setIsWorkspaceModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    Open Workspace Hub
                  </button>
                </div>
              </div>
            )}

            {currentView === 'settings' && (
              <SettingsView
                schoolSettings={schoolSettings}
                gradeRules={gradeRules}
                onSaveSettings={(newSettings) => setSchoolSettings(newSettings)}
              />
            )}
          </div>
        </main>
      </div>

      {/* High Thinking AI Advisor Modal */}
      <AIAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        students={students}
        subjects={subjects}
        schoolSettings={schoolSettings}
      />

      {/* Google Workspace & Apps Script Studio Modal */}
      <WorkspaceAndAppScriptModal
        isOpen={isWorkspaceModalOpen || currentView === 'google-sync'}
        onClose={() => {
          setIsWorkspaceModalOpen(false);
          if (currentView === 'google-sync') {
            setCurrentView('dashboard');
          }
        }}
        schoolSettings={schoolSettings}
        fullSchoolPayload={fullSchoolPayload}
      />
    </div>
  );
}
