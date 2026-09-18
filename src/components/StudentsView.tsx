import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Download,
  Printer,
  IdCard,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import { Student, ClassItem, SectionItem, SchoolSettings } from '../types';

interface StudentsViewProps {
  students: Student[];
  classes: ClassItem[];
  sections: SectionItem[];
  schoolSettings: SchoolSettings;
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  classes,
  sections,
  schoolSettings,
  onAddStudent,
  onUpdateStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [showIdCardModal, setShowIdCardModal] = useState<Student | null>(null);
  const [showPromoteModal, setShowPromoteModal] = useState<Student | null>(null);

  // Form state for adding/editing
  const [formData, setFormData] = useState<Partial<Student>>({
    fullName: '',
    fatherName: '',
    motherName: '',
    gender: 'Male',
    dob: '2012-05-15',
    bForm: '61101-1234567-1',
    bloodGroup: 'B+',
    religion: 'Islam',
    address: 'Street 4, Sector G-10',
    city: 'Islamabad',
    phone: '+92 300 1234567',
    parentPhone: '+92 321 7654321',
    email: '',
    classId: 'CLS-9',
    sectionId: 'SEC-9A',
    rollNo: '04',
    academicSession: schoolSettings.academicSession,
    feeCategory: 'Regular',
    transportNeeded: false,
    status: 'Active',
    admissionDate: new Date().toISOString().slice(0, 10),
  });

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      searchQuery === '' ||
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentPhone.includes(searchQuery);

    const matchesClass = selectedClass === 'ALL' || s.classId === selectedClass;
    const matchesSection = selectedSection === 'ALL' || s.sectionId === selectedSection;
    const matchesGender = selectedGender === 'ALL' || s.gender === selectedGender;

    return matchesSearch && matchesClass && matchesSection && matchesGender;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      studentId: `STU-${Date.now().toString().slice(-4)}`,
      admissionNo: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      rollNo: formData.rollNo || '10',
      fullName: formData.fullName || 'New Student',
      fatherName: formData.fatherName || 'Father Name',
      motherName: formData.motherName || 'Mother Name',
      gender: formData.gender as 'Male' | 'Female' | 'Other',
      dob: formData.dob || '2012-01-01',
      bForm: formData.bForm || '61101-0000000-0',
      bloodGroup: formData.bloodGroup || 'O+',
      religion: formData.religion || 'Islam',
      address: formData.address || 'Campus Road',
      city: formData.city || 'Islamabad',
      phone: formData.phone || '',
      parentPhone: formData.parentPhone || '+92 300 0000000',
      email: formData.email || '',
      classId: formData.classId || 'CLS-9',
      sectionId: formData.sectionId || 'SEC-9A',
      admissionDate: formData.admissionDate || new Date().toISOString().slice(0, 10),
      academicSession: schoolSettings.academicSession,
      status: 'Active',
      feeCategory: (formData.feeCategory as any) || 'Regular',
      transportNeeded: !!formData.transportNeeded,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
  };

  return (
    <div id="students-view" className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <span>Student Information System (SIS)</span>
              <span>•</span>
              <span>{students.length} Total Enrolled</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-7 h-7 text-blue-600" />
              <span>Student & Parent Directory</span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage complete student profiles, roll numbers, guardian contacts, and printable ID cards.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            id="btn-add-student-modal"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Admit New Student</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll #, admission #, father..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">All Classes</option>
              {classes.map((c) => (
                <option key={c.classId} value={c.classId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">All Sections</option>
              {sections.map((s) => (
                <option key={s.sectionId} value={s.sectionId}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">All Genders</option>
              <option value="Male">Boys (Male)</option>
              <option value="Female">Girls (Female)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Admission #</th>
                <th className="py-3.5 px-4">Student Profile</th>
                <th className="py-3.5 px-4">Class & Section</th>
                <th className="py-3.5 px-4">Father Name & Contact</th>
                <th className="py-3.5 px-4">B-Form / CNIC</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No students matched your query.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const cls = classes.find((c) => c.classId === st.classId);
                  const sec = sections.find((s) => s.sectionId === st.sectionId);

                  return (
                    <tr key={st.studentId} className="hover:bg-slate-50/70 transition">
                      {/* Admission & Roll */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900">{st.admissionNo}</span>
                        <p className="text-[11px] text-slate-500 font-mono">Roll: #{st.rollNo}</p>
                      </td>

                      {/* Photo & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            {st.photo ? (
                              <img
                                src={st.photo}
                                alt={st.fullName}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-blue-600">
                                {st.fullName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{st.fullName}</p>
                            <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
                              <span>{st.gender}</span> • <span>Blood: {st.bloodGroup}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                        <span>{cls?.name || st.classId}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-blue-600 font-bold">{sec?.name || st.sectionId}</span>
                      </td>

                      {/* Father & Phone */}
                      <td className="py-3 px-4 text-xs">
                        <p className="font-semibold text-slate-800">{st.fatherName}</p>
                        <p className="text-slate-500 font-mono">{st.parentPhone}</p>
                      </td>

                      {/* B-Form */}
                      <td className="py-3 px-4 text-xs font-mono text-slate-600">
                        {st.bForm}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            st.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setSelectedStudentForProfile(st)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowIdCardModal(st)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition"
                            title="Print Student ID Card"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">New Student Admission</h3>
                <p className="text-xs text-slate-500">
                  Fill in primary academic, identity, and guardian details
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Father Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mother Name</label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">B-Form / CNIC</label>
                  <input
                    type="text"
                    value={formData.bForm}
                    onChange={(e) => setFormData({ ...formData, bForm: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class / Grade *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  >
                    {classes.map((c) => (
                      <option key={c.classId} value={c.classId}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section *</label>
                  <select
                    value={formData.sectionId}
                    onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  >
                    {sections.map((s) => (
                      <option key={s.sectionId} value={s.sectionId}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fee Category</label>
                  <select
                    value={formData.feeCategory}
                    onChange={(e) => setFormData({ ...formData, feeCategory: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Scholarship">Scholarship (50%)</option>
                    <option value="Sibling">Sibling Concession</option>
                    <option value="Staff Child">Staff Child</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable ID Card Modal */}
      {showIdCardModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <IdCard className="w-5 h-5 text-blue-600" />
                <span>Student Identity Card</span>
              </h3>
              <button
                onClick={() => setShowIdCardModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Official ID Card Layout */}
            <div
              id="student-id-card"
              className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-xl border-2 border-blue-400/30 relative overflow-hidden"
            >
              <div className="text-center border-b border-blue-700/50 pb-3">
                <h4 className="font-extrabold text-sm tracking-wide text-white">
                  {schoolSettings.schoolName}
                </h4>
                <p className="text-[10px] text-blue-300">
                  {schoolSettings.address} • Session {schoolSettings.academicSession}
                </p>
              </div>

              <div className="flex items-center space-x-4 py-4">
                <div className="w-20 h-24 rounded-xl bg-slate-800 overflow-hidden border-2 border-white/20 shrink-0">
                  {showIdCardModal.photo ? (
                    <img
                      src={showIdCardModal.photo}
                      alt={showIdCardModal.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-white text-xl">
                      {showIdCardModal.fullName.slice(0, 2)}
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-base text-white">{showIdCardModal.fullName}</p>
                  <p className="text-blue-200">
                    Father: <span className="text-white font-medium">{showIdCardModal.fatherName}</span>
                  </p>
                  <p className="text-blue-200">
                    Adm #: <span className="font-mono text-white">{showIdCardModal.admissionNo}</span>
                  </p>
                  <p className="text-blue-200">
                    Roll #: <span className="font-mono text-white">{showIdCardModal.rollNo}</span> • Blood: {showIdCardModal.bloodGroup}
                  </p>
                  <p className="text-blue-200">
                    Emergency: <span className="font-mono text-white">{showIdCardModal.parentPhone}</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-blue-700/50 pt-2 flex items-center justify-between text-[10px] text-blue-300">
                <span>Principal: Dr. Muhammad Tariq Khan</span>
                <span className="font-mono">VALID UNTIL 2027</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print ID Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Student Profile Modal */}
      {selectedStudentForProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Student Detailed Record</h3>
              <button
                onClick={() => setSelectedStudentForProfile(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Student Name:</span>
                <p className="font-bold text-slate-800 text-sm">{selectedStudentForProfile.fullName}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Admission Number:</span>
                <p className="font-mono font-bold text-slate-800 text-sm">{selectedStudentForProfile.admissionNo}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Father Name:</span>
                <p className="font-bold text-slate-800">{selectedStudentForProfile.fatherName}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">B-Form / CNIC:</span>
                <p className="font-mono font-bold text-slate-800">{selectedStudentForProfile.bForm}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Emergency Contact:</span>
                <p className="font-bold text-slate-800">{selectedStudentForProfile.parentPhone}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Residential Address:</span>
                <p className="font-bold text-slate-800">{selectedStudentForProfile.address}, {selectedStudentForProfile.city}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedStudentForProfile(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
