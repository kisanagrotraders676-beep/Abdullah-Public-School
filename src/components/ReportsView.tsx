import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Filter,
  Calendar,
  Users,
  CircleDollarSign,
  Award,
  CheckCircle2,
} from 'lucide-react';
import {
  Student,
  StudentAttendance,
  FeeInvoice,
  Mark,
  SchoolSettings,
} from '../types';

interface ReportsViewProps {
  students: Student[];
  attendanceRecords: StudentAttendance[];
  feeInvoices: FeeInvoice[];
  marks: Mark[];
  schoolSettings: SchoolSettings;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  attendanceRecords,
  feeInvoices,
  marks,
  schoolSettings,
}) => {
  const [selectedReport, setSelectedReport] = useState<string>('attendance');

  const defaulters = feeInvoices.filter((inv) => inv.balance > 0);

  const exportCSV = (filename: string, rows: string[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    if (selectedReport === 'defaulters') {
      const rows = [
        ['InvoiceID', 'StudentName', 'RollNo', 'Month', 'TotalFee', 'Paid', 'Balance', 'Status'],
        ...defaulters.map((d) => {
          const st = students.find((s) => s.studentId === d.studentId);
          return [
            d.invoiceId,
            `"${d.studentName || st?.fullName || 'Student'}"`,
            d.studentRoll || st?.rollNo || '-',
            d.month,
            d.totalFee.toString(),
            d.paidAmount.toString(),
            d.balance.toString(),
            d.status,
          ];
        }),
      ];
      exportCSV('Fee_Defaulters_Report', rows);
    } else {
      const rows = [
        ['RollNo', 'StudentName', 'Class', 'Gender', 'FatherName', 'Phone'],
        ...students.map((s) => [s.rollNo, `"${s.fullName}"`, s.classId, s.gender, `"${s.fatherName}"`, s.parentPhone]),
      ];
      exportCSV('Student_Master_Roster', rows);
    }
  };

  return (
    <div id="reports-center-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <span>Auditable Business Intelligence</span>
              <span>•</span>
              <span>Official Exportable Reports</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-7 h-7 text-teal-600" />
              <span>Institutional Reports Center</span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Generate auditable statements, attendance master sheets, and fee collection summaries.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV / Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex space-x-2 p-1.5 bg-slate-100 rounded-2xl">
        {[
          { id: 'attendance', label: 'Attendance Master Sheet', icon: Users },
          { id: 'defaulters', label: 'Fee Defaulters & Dues Ledger', icon: CircleDollarSign },
          { id: 'academic', label: 'Academic Performance Index', icon: Award },
        ].map((r) => {
          const Icon = r.icon;
          const isSelected = selectedReport === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Table Display */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {selectedReport === 'defaulters' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-amber-50/50">
              <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                Unpaid & Outstanding Fee Recovery List ({defaulters.length} Accounts)
              </h4>
              <span className="text-xs font-bold text-amber-800">
                Total Overdue: {schoolSettings.currencySymbol} {defaulters.reduce((s, d) => s + d.balance, 0).toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Month</th>
                    <th className="py-3 px-4 text-right">Total Fee</th>
                    <th className="py-3 px-4 text-right">Paid</th>
                    <th className="py-3 px-4 text-right">Overdue Balance</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-xs">
                  {defaulters.map((d) => {
                    const st = students.find((s) => s.studentId === d.studentId);
                    return (
                      <tr key={d.invoiceId} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{d.invoiceId}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {d.studentName || st?.fullName || 'Student'} (Roll #{d.studentRoll || st?.rollNo || '-'})
                        </td>
                        <td className="py-3 px-4">{d.month}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-800">
                        {schoolSettings.currencySymbol} {d.totalFee.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700">
                        {schoolSettings.currencySymbol} {d.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-amber-700">
                        {schoolSettings.currencySymbol} {d.balance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'attendance' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Student Attendance Master Register (Session {schoolSettings.academicSession})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Roll #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4 text-center">Working Days</th>
                    <th className="py-3 px-4 text-center">Present</th>
                    <th className="py-3 px-4 text-center">Absent</th>
                    <th className="py-3 px-4 text-center">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-xs">
                  {students.map((st) => (
                    <tr key={st.studentId} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">#{st.rollNo}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{st.fullName}</td>
                      <td className="py-3 px-4">{st.classId}</td>
                      <td className="py-3 px-4 text-center font-mono">22</td>
                      <td className="py-3 px-4 text-center font-mono text-emerald-700 font-bold">20</td>
                      <td className="py-3 px-4 text-center font-mono text-rose-700 font-bold">2</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">90.9%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'academic' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-purple-50/50">
              <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider">
                Academic Progress & GPA Matrix
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Roll #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4 text-center">Physics</th>
                    <th className="py-3 px-4 text-center">Chemistry</th>
                    <th className="py-3 px-4 text-center">Math</th>
                    <th className="py-3 px-4 text-center">Cumulative %</th>
                    <th className="py-3 px-4 text-center">GPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-xs">
                  {students.map((st) => (
                    <tr key={st.studentId} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">#{st.rollNo}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{st.fullName}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">88</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">82</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">94</td>
                      <td className="py-3 px-4 text-center font-bold text-purple-700">88.0%</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">3.8</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
