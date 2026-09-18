import React, { useState } from 'react';
import {
  Sparkles,
  BrainCircuit,
  Bot,
  FileQuestion,
  FileText,
  Calendar,
  DollarSign,
  Send,
  Loader2,
  Copy,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Student, Exam, Subject, SchoolSettings } from '../types';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  subjects: Subject[];
  schoolSettings: SchoolSettings;
}

type AdvisoryMode = 'intervention' | 'question-paper' | 'report-card' | 'timetable' | 'financial';

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  students,
  subjects,
  schoolSettings,
}) => {
  const [activeMode, setActiveMode] = useState<AdvisoryMode>('intervention');
  const [promptInput, setPromptInput] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.studentId || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.subjectId || '');
  const [targetGrade, setTargetGrade] = useState('Grade 9');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMarkdown, setResponseMarkdown] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const modePresets = {
    intervention: {
      title: 'Student Academic Diagnostic & Remedial Plan',
      description: 'Analyze student attendance, test results, and behavioral indicators with deep chain-of-thought to produce a customized intervention schedule.',
      defaultPrompt: 'Conduct a comprehensive academic diagnostic for this student. Identify learning bottlenecks in Physics and Math, assess their 82% attendance impact, and formulate a 4-week step-by-step remedial roadmap.',
    },
    'question-paper': {
      title: 'Exam Question Paper & Marking Scheme Generator',
      description: 'Generate balanced exam papers mapped to Bloom\'s Taxonomy (Knowledge, Comprehension, Application, Synthesis) with MCQs, short answers, and long analytical problems.',
      defaultPrompt: 'Generate a mid-term examination paper for Grade 9 Physics (Total Marks: 75). Structure into Section A (15 MCQs), Section B (9 Short Questions), and Section C (3 Long Analytical Problems with sub-parts) along with an official marking key.',
    },
    'report-card': {
      title: 'Report Card Narrative & Principal Remarks',
      description: 'Draft constructive, compassionate, and highly personalized performance appraisals for report cards.',
      defaultPrompt: 'Write an inspiring yet objective term report card appraisal for a student who scored 85% in Sciences and 72% in English, noting strong lab practical enthusiasm and encouraging deeper essay structure.',
    },
    timetable: {
      title: 'Conflict-Free Campus Timetable Solver',
      description: 'Formulate an optimal weekly schedule without teacher room or period collisions.',
      defaultPrompt: 'Optimize a 6-period daily schedule for Grade 9 and Grade 10 covering Physics, Chemistry, Biology, Math, and English, ensuring no teacher is scheduled for more than 3 consecutive periods.',
    },
    financial: {
      title: 'Financial Health & Fee Recovery Analyst',
      description: 'Evaluate fee collection trends, defaulter exposure, and cash-flow projections.',
      defaultPrompt: 'Analyze our current outstanding fee balance of 38,000 PKR and propose an automated 3-tier polite parent reminder schedule and discount strategy for early settlement.',
    },
  };

  const handleRunThinking = async () => {
    setIsLoading(true);
    setResponseMarkdown('');

    const currPreset = modePresets[activeMode];
    const userPrompt = promptInput.trim() || currPreset.defaultPrompt;

    const studentObj = students.find((s) => s.studentId === selectedStudentId);
    const subjectObj = subjects.find((s) => s.subjectId === selectedSubjectId);

    const enrichedContext = `
[SCHOOL CONTEXT]
School: ${schoolSettings.schoolName}
Academic Session: ${schoolSettings.academicSession}
Active Mode: ${activeMode}
Selected Student: ${studentObj ? `${studentObj.fullName} (Roll #${studentObj.rollNo}, Class ${studentObj.classId})` : 'N/A'}
Selected Subject: ${subjectObj ? `${subjectObj.name} (Code: ${subjectObj.code})` : 'N/A'}
Target Grade: ${targetGrade}

[TASK INSTRUCTIONS]
${userPrompt}
`;

    try {
      const res = await fetch('/api/ai/high-thinking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: enrichedContext,
          context: {
            schoolName: schoolSettings.schoolName,
            mode: activeMode,
            role: 'Senior Academic Advisor & Curriculum Specialist',
          },
        }),
      });

      const data = await res.json();
      if (data.text) {
        setResponseMarkdown(data.text);
      } else {
        setResponseMarkdown('No response text was generated. Please try again.');
      }
    } catch (err: any) {
      setResponseMarkdown(`Error contacting AI Advisor: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white shrink-0">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  High Thinking Academic Advisor
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  gemini-3.1-pro-preview
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  HIGH THINKING
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Deep analytical reasoning for diagnostic plans, exam papers, and institutional operations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl">
          {[
            { id: 'intervention', label: 'Student Diagnostic', icon: Bot },
            { id: 'question-paper', label: 'Exam Paper Creator', icon: FileQuestion },
            { id: 'report-card', label: 'Report Card Writer', icon: FileText },
            { id: 'timetable', label: 'Timetable Solver', icon: Calendar },
            { id: 'financial', label: 'Financial Health', icon: DollarSign },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMode(m.id as AdvisoryMode);
                  setResponseMarkdown('');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Configuration Context */}
        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-purple-900">
              {modePresets[activeMode].title}
            </h4>
            <span className="text-[11px] text-purple-700">Configured with Maximum Reasoning Depth</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {modePresets[activeMode].description}
          </p>

          {/* Context Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-white border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
              >
                {students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.fullName} (#{s.rollNo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full bg-white border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
              >
                {subjects.map((sub) => (
                  <option key={sub.subjectId} value={sub.subjectId}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Class Grade</label>
              <select
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                className="w-full bg-white border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 8">Grade 8</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Custom Directives or Modifications (Optional)
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder={modePresets[activeMode].defaultPrompt}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-purple-500 font-sans"
            />
          </div>
        </div>

        {/* Run Button */}
        <div className="flex justify-end">
          <button
            disabled={isLoading}
            onClick={handleRunThinking}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Engaging High Thinking Engine...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4 text-amber-300" />
                <span>Generate High-Thinking Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Results Pane */}
        {responseMarkdown && (
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 space-y-3 relative shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Advisor Formulation Complete</span>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Output'}</span>
              </button>
            </div>

            <div className="text-xs leading-relaxed max-h-80 overflow-y-auto pr-2 space-y-2 whitespace-pre-line font-sans custom-scrollbar">
              {responseMarkdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
