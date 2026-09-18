import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Search,
  UserPlus,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  DollarSign,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Teacher, Staff, SchoolSettings } from '../types';

interface FacultyViewProps {
  teachers: Teacher[];
  staff: Staff[];
  schoolSettings: SchoolSettings;
  onAddTeacher: (t: Teacher) => void;
}

export const FacultyView: React.FC<FacultyViewProps> = ({
  teachers,
  staff,
  schoolSettings,
  onAddTeacher,
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'staff'>('teachers');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter(
    (t) =>
      searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="faculty-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <span>Human Resources & Academic Faculty</span>
              <span>•</span>
              <span>{teachers.length + staff.length} Total Employees</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-indigo-600" />
              <span>Teachers & Staff Management</span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Faculty qualifications, assigned classes, payroll designations, and contact directory.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center p-1 bg-slate-100 rounded-xl space-x-1">
              <button
                onClick={() => setActiveTab('teachers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'teachers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Teachers ({teachers.length})
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'staff' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Support Staff ({staff.length})
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Faculty</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Employee #</th>
                  <th className="py-3.5 px-4">Faculty Member</th>
                  <th className="py-3.5 px-4">Designation & Dept</th>
                  <th className="py-3.5 px-4">Qualification</th>
                  <th className="py-3.5 px-4">Phone / Contact</th>
                  <th className="py-3.5 px-4">Subjects & Classes</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTeachers.map((t) => (
                  <tr key={t.teacherId} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {t.employeeId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {t.photo ? (
                            <img src={t.photo} alt={t.name} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                          ) : (
                            t.name.slice(0, 2)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{t.name}</p>
                          <p className="text-xs text-slate-400">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <p className="font-bold text-slate-800">{t.designation}</p>
                      <p className="text-slate-500">{t.department}</p>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                      {t.qualification} ({t.experience})
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-600">
                      {t.phone}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="font-semibold text-indigo-700">{t.subjects.join(', ')}</span>
                      <p className="text-[11px] text-slate-500">{t.assignedClasses.join(', ')}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Table */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Employee #</th>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {staff.map((st) => (
                  <tr key={st.staffId} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{st.employeeId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-800">{st.designation}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{st.department}</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-600">{st.phone}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
