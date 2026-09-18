import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  Save,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Student,
  Exam,
  Subject,
  Mark,
  GradeRule,
  ClassItem,
  SectionItem,
  SchoolSettings,
} from '../types';

interface MarksAndExamsViewProps {
  students: Student[];
  exams: Exam[];
  subjects: Subject[];
  marks: Mark[];
  gradeRules: GradeRule[];
  classes: ClassItem[];
  sections: SectionItem[];
  schoolSettings: SchoolSettings;
  onSaveMarks: (updatedMarks: Mark[]) => void;
  onOpenAIRemarksWriter?: (student: Student, subject: string, marks: Mark) => void;
}

export const MarksAndExamsView: React.FC<MarksAndExamsViewProps> = ({
  students,
  exams,
  subjects,
  marks,
  gradeRules,
  classes,
  sections,
  schoolSettings,
  onSaveMarks,
  onOpenAIRemarksWriter,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.examId || 'EXAM-1');
  const [selectedClassId, setSelectedClassId] = useState<string>('CLS-9');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('SEC-9A');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('SUB-101'); // Physics
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedSubject = subjects.find((s) => s.subjectId === selectedSubjectId);
  const selectedExam = exams.find((e) => e.examId === selectedExamId);

  // Relevant students
  const filteredStudents = students.filter(
    (s) => s.classId === selectedClassId && s.sectionId === selectedSectionId
  );

  // Local state of marks for quick grid entry
  const [localMarks, setLocalMarks] = useState<Record<string, { theory: number; practical: number; remarks: string }>>(() => {
    const map: Record<string, { theory: number; practical: number; remarks: string }> = {};
    students.forEach((st) => {
      const existing = marks.find(
        (m) => m.examId === selectedExamId && m.studentId === st.studentId && m.subjectId === selectedSubjectId
      );
      map[st.studentId] = {
        theory: existing?.theoryMarks ?? 65,
        practical: existing?.practicalMarks ?? 22,
        remarks: existing?.remarks ?? 'Satisfactory work',
      };
    });
    return map;
  });

  const calculateGradeInfo = (obtained: number, max: number) => {
    const pct = Math.round((obtained / max) * 100);
    const rule = gradeRules.find((r) => pct >= r.minPercentage && pct <= r.maxPercentage) || gradeRules[gradeRules.length - 1];
    return {
      percentage: pct,
      grade: rule ? rule.grade : 'B',
      gpa: rule ? rule.gpa : 3.0,
      passFail: pct >= 40 ? ('Pass' as const) : ('Fail' as const),
    };
  };

  const handleMarksChange = (studentId: string, field: 'theory' | 'practical', value: string) => {
    const num = Math.max(0, Number(value) || 0);
    setLocalMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: num,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, val: string) => {
    setLocalMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: val,
      },
    }));
  };

  const handleSaveAll = () => {
    const newRecords: Mark[] = filteredStudents.map((st, idx) => {
      const t = localMarks[st.studentId]?.theory ?? 0;
      const p = localMarks[st.studentId]?.practical ?? 0;
      const total = t + p;
      const maxM = selectedSubject?.maxMarks || 100;
      const gradeInfo = calculateGradeInfo(total, maxM);

      return {
        markId: `MRK-${selectedExamId}-${st.studentId}-${selectedSubjectId}`,
        examId: selectedExamId,
        studentId: st.studentId,
        subjectId: selectedSubjectId,
        theoryMarks: t,
        practicalMarks: p,
        totalMarks: total,
        maxMarks: maxM,
        percentage: gradeInfo.percentage,
        grade: gradeInfo.grade,
        gpa: gradeInfo.gpa,
        passFail: gradeInfo.passFail,
        remarks: localMarks[st.studentId]?.remarks || '',
        rank: idx + 1,
        updatedBy: 'Teacher Portal User',
        timestamp: new Date().toISOString(),
      };
    });

    onSaveMarks(newRecords);
    showToast(`Saved marks for ${newRecords.length} students in ${selectedSubject?.name}.`);
  };

  return (
    <div id="exams-and-marks-view" className="space-y-6 pb-16">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-3 z-50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
              <span>Examination & Evaluation Engine</span>
              <span>•</span>
              <span>Automated Grading & GPA</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-7 h-7 text-purple-600" />
              <span>Marks Entry & Official Report Cards</span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Live spreadsheet-style marks entry with automatic percentage, GPA, rank, and printable report cards.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveAll}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Subject Marks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters: Exam, Class, Section, Subject */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Exam Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Exam</label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden"
            >
              {exams.map((ex) => (
                <option key={ex.examId} value={ex.examId}>
                  {ex.name} ({ex.term})
                </option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Class / Grade</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden"
            >
              {classes.map((c) => (
                <option key={c.classId} value={c.classId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden"
            >
              {sections
                .filter((s) => s.classId === selectedClassId)
                .map((s) => (
                  <option key={s.sectionId} value={s.sectionId}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden"
            >
              {subjects
                .filter((sub) => sub.classId === selectedClassId)
                .map((sub) => (
                  <option key={sub.subjectId} value={sub.subjectId}>
                    {sub.name} (Max: {sub.maxMarks})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Marks Entry Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs text-purple-900">
              Editing: {selectedSubject?.name} (Code: {selectedSubject?.code})
            </span>
            <span className="text-xs text-purple-700">
              • Max Theory: 75 • Max Practical: 25 • Passing: 40%
            </span>
          </div>
          <span className="text-xs font-bold text-purple-800">
            {filteredStudents.length} Students in Grade
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Roll #</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4 text-center">Theory (Max 75)</th>
                <th className="py-3.5 px-4 text-center">Practical (Max 25)</th>
                <th className="py-3.5 px-4 text-center">Total Marks</th>
                <th className="py-3.5 px-4 text-center">Percentage</th>
                <th className="py-3.5 px-4 text-center">Grade & GPA</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Teacher Remarks</th>
                <th className="py-3.5 px-4 text-center">Report Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.map((st) => {
                const theory = localMarks[st.studentId]?.theory ?? 0;
                const practical = localMarks[st.studentId]?.practical ?? 0;
                const total = theory + practical;
                const max = selectedSubject?.maxMarks || 100;
                const calc = calculateGradeInfo(total, max);

                return (
                  <tr key={st.studentId} className="hover:bg-slate-50/70 transition">
                    {/* Roll */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      #{st.rollNo}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{st.fullName}</p>
                      <p className="text-xs text-slate-400 font-mono">{st.admissionNo}</p>
                    </td>

                    {/* Theory Input */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="75"
                        value={theory}
                        onChange={(e) => handleMarksChange(st.studentId, 'theory', e.target.value)}
                        className="w-20 text-center font-bold text-sm bg-slate-50 border border-slate-200 rounded-lg py-1.5 focus:bg-white focus:outline-hidden focus:border-purple-500"
                      />
                    </td>

                    {/* Practical Input */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={practical}
                        onChange={(e) => handleMarksChange(st.studentId, 'practical', e.target.value)}
                        className="w-20 text-center font-bold text-sm bg-slate-50 border border-slate-200 rounded-lg py-1.5 focus:bg-white focus:outline-hidden focus:border-purple-500"
                      />
                    </td>

                    {/* Total Marks */}
                    <td className="py-3 px-4 text-center font-bold text-slate-900">
                      {total} <span className="text-xs text-slate-400">/ {max}</span>
                    </td>

                    {/* Percentage */}
                    <td className="py-3 px-4 text-center font-bold text-purple-700">
                      {calc.percentage}%
                    </td>

                    {/* Grade & GPA */}
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-extrabold text-xs">
                        {calc.grade} ({calc.gpa.toFixed(1)})
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          calc.passFail === 'Pass'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {calc.passFail}
                      </span>
                    </td>

                    {/* Remarks */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={localMarks[st.studentId]?.remarks || ''}
                        onChange={(e) => handleRemarksChange(st.studentId, e.target.value)}
                        placeholder="Evaluation note..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:bg-white focus:outline-hidden"
                      />
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setReportCardStudent(st)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-700 transition"
                        title="Generate Official Report Card"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Report Card Modal */}
      {reportCardStudent && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Report Card Preview</h3>
              <button
                onClick={() => setReportCardStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Official Report Card Layout */}
            <div id="printable-report-card" className="border-4 border-double border-slate-800 p-8 rounded-xl bg-white text-slate-900 space-y-6">
              {/* Institution Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4">
                <h2 className="text-2xl font-black uppercase tracking-wider text-slate-900">
                  {schoolSettings.schoolName}
                </h2>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  {schoolSettings.address} • Phone: {schoolSettings.phone}
                </p>
                <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                  Official Academic Progress Report ({selectedExam?.name || 'Annual Examination'})
                </div>
              </div>

              {/* Student Metadata Card */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 p-3 rounded-lg bg-slate-50/50 font-medium">
                <div>
                  <p><strong>Student Name:</strong> {reportCardStudent.fullName}</p>
                  <p className="mt-1"><strong>Father Name:</strong> {reportCardStudent.fatherName}</p>
                  <p className="mt-1"><strong>Admission No:</strong> {reportCardStudent.admissionNo}</p>
                </div>
                <div>
                  <p><strong>Class & Section:</strong> Grade 9 - Section A</p>
                  <p className="mt-1"><strong>Roll Number:</strong> #{reportCardStudent.rollNo}</p>
                  <p className="mt-1"><strong>Academic Session:</strong> {schoolSettings.academicSession}</p>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Subject</th>
                    <th className="p-2 border-r border-slate-300 text-center">Max Marks</th>
                    <th className="p-2 border-r border-slate-300 text-center">Obtained</th>
                    <th className="p-2 border-r border-slate-300 text-center">%</th>
                    <th className="p-2 border-r border-slate-300 text-center">Grade</th>
                    <th className="p-2">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">Physics</td>
                    <td className="p-2 border-r border-slate-300 text-center">100</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">88</td>
                    <td className="p-2 border-r border-slate-300 text-center">88%</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold text-emerald-700">A</td>
                    <td className="p-2">Outstanding grasp of kinematics and dynamics</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">Chemistry</td>
                    <td className="p-2 border-r border-slate-300 text-center">100</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">82</td>
                    <td className="p-2 border-r border-slate-300 text-center">82%</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold text-emerald-700">A</td>
                    <td className="p-2">Excellent lab practical demonstrations</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">Mathematics</td>
                    <td className="p-2 border-r border-slate-300 text-center">100</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">94</td>
                    <td className="p-2 border-r border-slate-300 text-center">94%</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold text-emerald-700">A+</td>
                    <td className="p-2">Exceptional problem solving & algebraic clarity</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">English Language</td>
                    <td className="p-2 border-r border-slate-300 text-center">100</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">78</td>
                    <td className="p-2 border-r border-slate-300 text-center">78%</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold text-blue-700">B+</td>
                    <td className="p-2">Good comprehension, keep refining essay syntax</td>
                  </tr>
                </tbody>
              </table>

              {/* Cumulative Metrics Box */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs border border-slate-300 p-2.5 rounded bg-slate-50 font-bold">
                <div>
                  <span className="text-[10px] text-slate-500 block">TOTAL MARKS</span>
                  <span className="text-sm text-slate-900">342 / 400</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">PERCENTAGE</span>
                  <span className="text-sm text-purple-700">85.5%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">FINAL GRADE</span>
                  <span className="text-sm text-emerald-700">A (GPA 3.8)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">CLASS POSITION</span>
                  <span className="text-sm text-amber-700">2nd Position</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between pt-12 text-xs font-semibold text-slate-700">
                <div className="text-center border-t border-slate-400 pt-1 w-44">
                  Class Teacher Signature
                </div>
                <div className="text-center border-t border-slate-400 pt-1 w-44">
                  Examination Controller
                </div>
                <div className="text-center border-t border-slate-400 pt-1 w-44">
                  Principal Seal & Signature
                </div>
              </div>
            </div>

            {/* Print button */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Report Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
