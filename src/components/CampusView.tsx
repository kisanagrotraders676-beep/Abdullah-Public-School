import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Layers,
  FileCheck,
  Bell,
  Printer,
  Sparkles,
  BookOpen,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';
import {
  ClassItem,
  SectionItem,
  Subject,
  Notice,
  Certificate,
  Student,
  SchoolSettings,
} from '../types';

interface CampusViewProps {
  classes: ClassItem[];
  sections: SectionItem[];
  subjects: Subject[];
  notices: Notice[];
  students: Student[];
  schoolSettings: SchoolSettings;
}

export const CampusView: React.FC<CampusViewProps> = ({
  classes,
  sections,
  subjects,
  notices,
  students,
  schoolSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'timetable' | 'notices' | 'certificates'>('classes');
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student>(students[0]);
  const [certType, setCertType] = useState<'Bonafide' | 'Character' | 'Leaving'>('Bonafide');
  const [showPrintCert, setShowPrintCert] = useState(false);

  return (
    <div id="campus-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <span>Campus Facilities & Academic Architecture</span>
              <span>•</span>
              <span>{classes.length} Academic Grades</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-7 h-7 text-blue-600" />
              <span>Campus, Timetable & Certificates</span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Class room allocations, official timetable schedules, school notices, and verified certificate printing.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl space-x-1 shrink-0">
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'classes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Classes & Sections
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'timetable' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timetable
            </button>
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'notices' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Notices ({notices.length})
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'certificates' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Certificate Generator
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Classes & Sections */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {classes.map((cls) => {
            const classSecs = sections.filter((s) => s.classId === cls.classId);
            const studentCount = students.filter((s) => s.classId === cls.classId).length;

            return (
              <div
                key={cls.classId}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">
                    {cls.roomNo}
                  </div>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    Cap: {cls.capacity}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">{cls.name}</h4>
                  <p className="text-xs text-slate-500">Incharge: {cls.classTeacherName || cls.classTeacherId}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Sections:</span>
                  <div className="flex gap-1">
                    {classSecs.map((sec) => (
                      <span
                        key={sec.sectionId}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[11px]"
                      >
                        {sec.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs font-bold text-blue-700 bg-blue-50 p-2 rounded-xl text-center">
                  {studentCount} Students Currently Enrolled
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Timetable */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Weekly Master Schedule (Grade 9 - Section A)</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">08:00 AM - 01:30 PM</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="p-3 border-r border-slate-200">Day</th>
                  <th className="p-3 border-r border-slate-200">Period 1 (08:00)</th>
                  <th className="p-3 border-r border-slate-200">Period 2 (08:45)</th>
                  <th className="p-3 border-r border-slate-200">Period 3 (09:30)</th>
                  <th className="p-3 border-r border-slate-200 bg-amber-50/60 text-amber-900 text-center">Break</th>
                  <th className="p-3 border-r border-slate-200">Period 4 (10:45)</th>
                  <th className="p-3 border-r border-slate-200">Period 5 (11:30)</th>
                  <th className="p-3">Period 6 (12:15)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <tr key={day} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/50">{day}</td>
                    <td className="p-3 border-r border-slate-200 font-semibold text-blue-800">Physics (Lab 1)</td>
                    <td className="p-3 border-r border-slate-200 font-semibold text-emerald-800">Chemistry (Lab 2)</td>
                    <td className="p-3 border-r border-slate-200 font-semibold text-purple-800">Mathematics</td>
                    <td className="p-3 border-r border-slate-200 text-center bg-amber-50/40 text-amber-800 font-bold">Assembly / Tea</td>
                    <td className="p-3 border-r border-slate-200 font-semibold text-indigo-800">English Literature</td>
                    <td className="p-3 border-r border-slate-200 font-semibold text-teal-800">Biology</td>
                    <td className="p-3 font-semibold text-slate-700">Pakistan Studies</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Notices */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notices.map((n) => (
            <div
              key={n.id || n.noticeId}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  Audience: {n.audience}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{n.date}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm leading-snug">{n.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                Issued by: <strong className="text-slate-600">{n.author}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Certificates */}
      {activeTab === 'certificates' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <span>Official Student Certificate Dispatcher</span>
            </h3>
            <p className="text-xs text-slate-500">
              Generate Bonafide, Character, or School Leaving Certificates with unique serial numbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Student</label>
              <select
                value={selectedStudentForCert?.studentId}
                onChange={(e) => {
                  const found = students.find((s) => s.studentId === e.target.value);
                  if (found) setSelectedStudentForCert(found);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden"
              >
                {students.map((st) => (
                  <option key={st.studentId} value={st.studentId}>
                    {st.fullName} (Roll #{st.rollNo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Certificate Type</label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden"
              >
                <option value="Bonafide">Bonafide Student Certificate</option>
                <option value="Character">Character & Conduct Certificate</option>
                <option value="Leaving">School Leaving / Transfer Certificate</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setShowPrintCert(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Generate Certificate</span>
              </button>
            </div>
          </div>

          {/* Certificate Preview Card */}
          {showPrintCert && selectedStudentForCert && (
            <div
              id="official-certificate-preview"
              className="border-8 border-double border-slate-800 p-8 rounded-2xl bg-amber-50/30 text-slate-900 space-y-6 text-center font-serif"
            >
              <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900">
                {schoolSettings.schoolName}
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                {schoolSettings.address} • Affiliation & Reg: {schoolSettings.registrationInfo}
              </p>

              <div className="py-2">
                <span className="inline-block border-b-2 border-slate-800 pb-1 text-base font-extrabold uppercase tracking-wider text-slate-900 font-sans">
                  {certType} Certificate
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Serial No: CERT-2026-{Math.floor(1000 + Math.random() * 9000)}
                </p>
              </div>

              <p className="text-sm leading-loose max-w-2xl mx-auto text-justify indent-8">
                This is to officially certify that <strong>{selectedStudentForCert.fullName}</strong>, child of{' '}
                <strong>{selectedStudentForCert.fatherName}</strong>, bearing Admission Number{' '}
                <strong>{selectedStudentForCert.admissionNo}</strong>, is a registered bonafide student of this institution in{' '}
                <strong>Class Grade 9 (Session {schoolSettings.academicSession})</strong>. During their academic tenure at our campus, their moral conduct and academic dedication have been found to be exemplary.
              </p>

              <div className="flex justify-between pt-16 text-xs font-sans font-bold">
                <div className="text-center border-t border-slate-700 pt-1 w-44">
                  Office Superintendent
                </div>
                <div className="w-24 h-24 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center text-[10px] text-slate-400 uppercase font-mono">
                  School Seal
                </div>
                <div className="text-center border-t border-slate-700 pt-1 w-44">
                  Principal Signature
                </div>
              </div>

              <div className="pt-4 flex justify-end font-sans">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
