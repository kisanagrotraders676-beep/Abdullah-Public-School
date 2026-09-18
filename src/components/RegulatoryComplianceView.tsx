import React, { useState } from 'react';
import {
  ShieldCheck,
  Scale,
  Building2,
  GraduationCap,
  Award,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Calendar,
  Download,
  Search,
  FileSpreadsheet,
  Users,
  CheckSquare,
  Clock,
  ExternalLink,
  FileCheck,
  RefreshCw,
  Sliders,
  Printer,
  BadgeCheck,
  BookOpen,
  Send,
  X,
  Plus,
} from 'lucide-react';
import {
  RegulatoryAuthority,
  HECInstitutionProfile,
  CampusRecognition,
  ProgramApproval,
  RegulatoryPolicy,
  DegreeRecord,
  VerificationRequest,
  DocumentConsistencyIssue,
  AccreditationCouncilRecord,
  FacultyQualificationRecord,
  ResearchAndPhDEntry,
  GraduateOutcomeRecord,
  RegulatoryCalendarEvent,
  ComplianceDocumentItem,
  ProvincialCompliancePack,
  HEDRReportingDataset,
  SchoolSettings,
} from '../types';

interface RegulatoryComplianceViewProps {
  schoolSettings: SchoolSettings;
  initialAuthorities: RegulatoryAuthority[];
  initialProfile: HECInstitutionProfile;
  initialCampuses: CampusRecognition[];
  initialPrograms: ProgramApproval[];
  initialPolicies: RegulatoryPolicy[];
  initialDegrees: DegreeRecord[];
  initialVerifications: VerificationRequest[];
  initialDiscrepancies: DocumentConsistencyIssue[];
  initialCouncils: AccreditationCouncilRecord[];
  initialQualifications: FacultyQualificationRecord[];
  initialResearch: ResearchAndPhDEntry[];
  initialOutcomes: GraduateOutcomeRecord[];
  initialCalendar: RegulatoryCalendarEvent[];
  initialDocuments: ComplianceDocumentItem[];
  initialProvincial: ProvincialCompliancePack;
  initialHEDR: HEDRReportingDataset[];
}

export const RegulatoryComplianceView: React.FC<RegulatoryComplianceViewProps> = ({
  schoolSettings,
  initialAuthorities,
  initialProfile,
  initialCampuses,
  initialPrograms,
  initialPolicies,
  initialDegrees,
  initialVerifications,
  initialDiscrepancies,
  initialCouncils,
  initialQualifications,
  initialResearch,
  initialOutcomes,
  initialCalendar,
  initialDocuments,
  initialProvincial,
  initialHEDR,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    | 'health'
    | 'institution'
    | 'programs'
    | 'hedr'
    | 'degrees'
    | 'consistency'
    | 'accreditation'
    | 'faculty'
    | 'research'
    | 'calendar'
    | 'provincial'
  >('health');

  // State
  const [authorities, setAuthorities] = useState<RegulatoryAuthority[]>(initialAuthorities);
  const [profile, setProfile] = useState<HECInstitutionProfile>(initialProfile);
  const [campuses, setCampuses] = useState<CampusRecognition[]>(initialCampuses);
  const [programs, setPrograms] = useState<ProgramApproval[]>(initialPrograms);
  const [policies, setPolicies] = useState<RegulatoryPolicy[]>(initialPolicies);
  const [degrees, setDegrees] = useState<DegreeRecord[]>(initialDegrees);
  const [verifications, setVerifications] = useState<VerificationRequest[]>(initialVerifications);
  const [discrepancies, setDiscrepancies] = useState<DocumentConsistencyIssue[]>(initialDiscrepancies);
  const [councils, setCouncils] = useState<AccreditationCouncilRecord[]>(initialCouncils);
  const [qualifications, setQualifications] = useState<FacultyQualificationRecord[]>(initialQualifications);
  const [researchEntries, setResearchEntries] = useState<ResearchAndPhDEntry[]>(initialResearch);
  const [outcomes, setOutcomes] = useState<GraduateOutcomeRecord[]>(initialOutcomes);
  const [calendarEvents, setCalendarEvents] = useState<RegulatoryCalendarEvent[]>(initialCalendar);
  const [documents, setDocuments] = useState<ComplianceDocumentItem[]>(initialDocuments);
  const [provincial, setProvincial] = useState<ProvincialCompliancePack>(initialProvincial);
  const [hedrDatasets, setHedrDatasets] = useState<HEDRReportingDataset[]>(initialHEDR);

  // Search & Filters
  const [degreeSearchQuery, setDegreeSearchQuery] = useState('');
  const [selectedDegreeForCert, setSelectedDegreeForCert] = useState<DegreeRecord | null>(degrees[0] || null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [newVerificationForm, setNewVerificationForm] = useState({
    studentName: '',
    regNo: '',
    degreeTitle: 'Bachelor of Science in Computer Science',
    requestingAgency: '',
    requestType: 'Degree' as const,
    remarks: '',
  });

  // Verification Search query
  const [verifySearchQuery, setVerifySearchQuery] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ searched: boolean; found: boolean; record?: DegreeRecord } | null>(null);

  // Scan trigger animation
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Print state for verification certificate
  const [isPrintingVerification, setIsPrintingVerification] = useState(false);

  // HEDR Export & Submit
  const [selectedHEDRDomain, setSelectedHEDRDomain] = useState<'students' | 'faculty' | 'programs' | 'graduates' | 'research'>('students');
  const [hedrSubmitOfficer, setHedrSubmitOfficer] = useState('Barrister Salman Qureshi (Registrar)');
  const [hedrSubmitRef, setHedrSubmitRef] = useState('HEDR-CENSUS-2026-SUB-01');
  const [isSubmittingHEDR, setIsSubmittingHEDR] = useState(false);
  const [hedrSubmitSuccess, setHedrSubmitSuccess] = useState(false);

  // Calculations for Compliance Health Score
  const totalChecks = 25;
  const criticalErrorsCount = discrepancies.filter((d) => d.severity.includes('Critical') && d.status !== 'Corrected').length +
    (hedrDatasets[0]?.validationIssues.filter((i) => i.severity === 'Error').length || 0);
  const warningsCount = discrepancies.filter((d) => d.severity === 'Warning').length +
    (hedrDatasets[0]?.validationIssues.filter((i) => i.severity === 'Warning').length || 0);
  
  // Health Score percentage: max 100, deducting 4 per error and 1.5 per warning
  const complianceScore = Math.max(70, Math.min(100, Math.round(100 - criticalErrorsCount * 4 - warningsCount * 1.5)));

  // Filter degrees
  const filteredDegrees = degrees.filter(
    (deg) =>
      deg.studentName.toLowerCase().includes(degreeSearchQuery.toLowerCase()) ||
      deg.registrationNo.toLowerCase().includes(degreeSearchQuery.toLowerCase()) ||
      deg.degreeSerialNo.toLowerCase().includes(degreeSearchQuery.toLowerCase()) ||
      deg.cnicBForm.includes(degreeSearchQuery)
  );

  // Handle Verify Degree Search
  const handleVerifySearch = () => {
    if (!verifySearchQuery.trim()) return;
    const q = verifySearchQuery.trim().toLowerCase();
    const found = degrees.find(
      (d) =>
        d.degreeSerialNo.toLowerCase() === q ||
        d.registrationNo.toLowerCase() === q ||
        d.cnicBForm.replace(/[^0-9]/g, '') === q.replace(/[^0-9]/g, '')
    );
    if (found) {
      setVerifyResult({ searched: true, found: true, record: found });
      setSelectedDegreeForCert(found);
    } else {
      setVerifyResult({ searched: true, found: false });
    }
  };

  // Run Compliance Scan
  const handleTriggerComplianceScan = () => {
    setIsScanning(true);
    setScanMessage('Scanning 1,420 student master records, 68 faculty profiles, 8 program approval records, and HEDR census datasets...');
    setTimeout(() => {
      setIsScanning(false);
      setScanMessage('Data Quality Scan Complete: 2 critical attestation blockers, 3 warnings identified against HEC & Nadra format rules.');
    }, 1200);
  };

  // Handle Submit HEDR Package
  const handleSubmitHEDRPackage = () => {
    if (!hedrSubmitRef.trim()) return;
    setIsSubmittingHEDR(true);
    setTimeout(() => {
      setIsSubmittingHEDR(false);
      setHedrSubmitSuccess(true);
      setHedrDatasets((prev) =>
        prev.map((item, idx) =>
          idx === 0
            ? {
                ...item,
                submissionStatus: 'Submitted',
                submissionDate: new Date().toISOString().split('T')[0],
                acceptanceRef: `HEC-HEDR-ACK-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              }
            : item
        )
      );
      setTimeout(() => setHedrSubmitSuccess(false), 5000);
    }, 1000);
  };

  // Export HEDR CSV
  const handleExportHEDRCSV = (domain: string) => {
    let headers = '';
    let rows = '';

    if (domain === 'students') {
      headers = 'StudentID,RegistrationNo,RollNo,FullName,FatherName,CNIC_BForm,Gender,Program,Campus,CGPA,Status\n';
      rows = degrees
        .map(
          (d) =>
            `"${d.studentId}","${d.registrationNo}","${d.rollNo}","${d.studentName}","${d.fatherName}","${d.cnicBForm}","Male","${d.programName}","${d.campusName}","${d.cgpa}","Active"`
        )
        .join('\n');
    } else if (domain === 'faculty') {
      headers = 'EmployeeID,FacultyName,Department,Designation,HighestDegree,AwardingHEI,Country,PCD_No,PEC_Reg,Status\n';
      rows = qualifications
        .map(
          (q) =>
            `"${q.employeeId}","${q.facultyName}","${q.department}","${q.designation}","${q.highestDegree}","${q.awardingInstitution}","${q.awardingCountry}","${q.phdCountryDirectoryRef || 'N/A'}","${q.professionalCouncilRegistrationNo || 'N/A'}","${q.verificationStatus}"`
        )
        .join('\n');
    } else {
      headers = 'RecordID,Title,Department,Status,Reference\n';
      rows = programs.map((p) => `"${p.programId}","${p.programName}","${p.department}","${p.status}","${p.hecNocReference}"`).join('\n');
    }

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HEC_HEDR_${domain.toUpperCase()}_Dataset_2025_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Verification Request
  const handleAddVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVerificationForm.studentName || !newVerificationForm.regNo) return;
    const newReq: VerificationRequest = {
      requestId: `VER-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: 'STU-NEW',
      studentName: newVerificationForm.studentName,
      regNo: newVerificationForm.regNo,
      degreeTitle: newVerificationForm.degreeTitle,
      requestingAgency: newVerificationForm.requestingAgency || 'Private Verification Request',
      requestType: newVerificationForm.requestType,
      requestDate: new Date().toISOString().split('T')[0],
      verificationOfficer: 'Mr. Noman Sadiq (Assistant Controller Verifications)',
      status: 'Pending',
      remarks: newVerificationForm.remarks || 'Awaiting Controller seal and gazette verification.',
      referenceNo: `AIHE/VER/2026/${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setVerifications([newReq, ...verifications]);
    setShowVerificationModal(false);
    setNewVerificationForm({
      studentName: '',
      regNo: '',
      degreeTitle: 'Bachelor of Science in Computer Science',
      requestingAgency: '',
      requestType: 'Degree',
      remarks: '',
    });
  };

  // Resolve Discrepancy
  const handleResolveDiscrepancy = (issueId: string) => {
    setDiscrepancies((prev) =>
      prev.map((d) => (d.issueId === issueId ? { ...d, status: 'Corrected' } : d))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Master Header with Legal Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> HEC Status: {profile.recognitionStatus} (Category {profile.hecCategory})
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
                {profile.charterActReference}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                NOC Ref: {profile.approvalNocReference}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Pakistan Government & Regulatory Compliance Center
            </h1>
            <p className="text-sm text-slate-600">
              Institutional governance, HEC recognition profiles, HEDR census reporting engine, Controller of Examinations verification register, and professional councils accreditation matrix.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleTriggerComplianceScan}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Auditing Records...' : 'Run Data Quality Scan'}
            </button>
            <button
              onClick={() => setActiveTab('degrees')}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <BadgeCheck className="w-4 h-4 text-indigo-600" />
              Verify Degree
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold uppercase tracking-wider">Regulatory Notice:</span> This module provides institutional data maintenance, structured records, audit trails, and reporting preparation workflows for Pakistani authorities (HEC, Provincial HED, PEC, NCEAC, NBEAC, BISE, IBCC). Internal validation health scores reflect internal data completeness only and do not constitute or substitute official government accreditation until formally verified and issued by the competent statutory authority.
          </div>
        </div>

        {scanMessage && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 font-medium flex items-center justify-between">
            <span>{scanMessage}</span>
            <button onClick={() => setScanMessage(null)} className="text-blue-500 hover:text-blue-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Top-Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Health</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${complianceScore >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {complianceScore >= 90 ? 'Healthy' : 'Needs Review'}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{complianceScore}%</span>
            <span className="text-xs text-slate-500">internal quality index</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {criticalErrorsCount} blocker discrepancies, {warningsCount} warnings
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">HEDR Census Status</span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
              {hedrDatasets[0]?.submissionStatus || 'Draft'}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">1,420</span>
            <span className="text-xs text-slate-500">students tracked</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            68 faculty • 8 programs • Due 15 April 2026
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Degree Verifications</span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800">Controller Reg</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{degrees.length}</span>
            <span className="text-xs text-slate-500">issued degrees</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {verifications.filter((v) => v.status === 'Verified').length} agency verifications completed
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accreditation Councils</span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800">3 Councils</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">100%</span>
            <span className="text-xs text-slate-500">active programs accredited</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            NCEAC (Computing) • PEC (Level II OBE) • NBEAC
          </p>
        </div>
      </div>

      {/* 3. Tabbed Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs flex flex-wrap gap-1">
        {[
          { id: 'health', label: 'Health & Quality Scan', icon: ShieldCheck },
          { id: 'institution', label: 'HEC & Campuses', icon: Building2 },
          { id: 'programs', label: 'Programs & Policy V1.1', icon: GraduationCap },
          { id: 'hedr', label: 'HEC HEDR Reporting', icon: FileSpreadsheet },
          { id: 'degrees', label: 'Degree & Attestation', icon: BadgeCheck },
          { id: 'consistency', label: 'Document Checker', icon: Scale },
          { id: 'accreditation', label: 'Accreditation Councils', icon: Award },
          { id: 'faculty', label: 'Faculty Compliance', icon: Users },
          { id: 'research', label: 'Research & PhD (PCD)', icon: BookOpen },
          { id: 'calendar', label: 'Calendar & Docs', icon: Calendar },
          { id: 'provincial', label: 'Punjab HED & BISE', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Tab 1: Compliance Health & Quality Dashboard */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Health Overview */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs lg:col-span-1 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Data Integrity & Readiness Index
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-2">
                <div className="text-5xl font-black text-slate-900">{complianceScore}%</div>
                <p className="text-xs font-semibold text-emerald-700">Audit Grade: A (High Institutional Readiness)</p>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${complianceScore}%` }}></div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">HEC Charter Verification</span>
                  <span className="font-bold text-emerald-600">Passed (Gazetted 2018)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Undergrad Policy V1.1 Compliance</span>
                  <span className="font-bold text-emerald-600">Active (30 Cr GenEd)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Terminal Degree Verifications</span>
                  <span className="font-bold text-slate-900">65 / 68 Verified</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Degree Serial Gaps</span>
                  <span className="font-bold text-emerald-600">0 Gaps (Gazette Aligned)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Active Accreditation Status</span>
                  <span className="font-bold text-indigo-600">3 Valid Councils</span>
                </div>
              </div>

              <button
                onClick={handleTriggerComplianceScan}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-Scan Institutional Ledgers
              </button>
            </div>

            {/* Live Flagged Issues & Attestation Blockers */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Regulatory Data Quality & Attestation Blockers</h3>
                  <p className="text-xs text-slate-500">Discrepancies that will delay HEC degree attestation or HEDR census validation</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  {criticalErrorsCount} Critical
                </span>
              </div>

              <div className="space-y-3">
                {discrepancies.map((issue) => (
                  <div
                    key={issue.issueId}
                    className={`p-4 rounded-xl border text-xs transition ${
                      issue.status === 'Corrected'
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : issue.severity.includes('Critical')
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-amber-50/50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            issue.status === 'Corrected'
                              ? 'bg-emerald-100 text-emerald-800'
                              : issue.severity.includes('Critical')
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {issue.status === 'Corrected' ? 'Resolved' : issue.severity}
                          </span>
                          <span className="font-bold text-slate-900">{issue.studentName} ({issue.regNo})</span>
                          <span className="text-slate-400">• Checked: {issue.fieldChecked}</span>
                        </div>
                        <p className="text-slate-700">{issue.discrepancyDescription}</p>
                        <div className="flex items-center gap-4 text-slate-500 pt-1">
                          <span>Master Record: <strong className="text-slate-800">{issue.sourceRecordValue}</strong></span>
                          <span>vs {issue.comparisonDocument}: <strong className="text-slate-800">{issue.documentValue}</strong></span>
                        </div>
                      </div>

                      {issue.status !== 'Corrected' && (
                        <button
                          onClick={() => handleResolveDiscrepancy(issue.issueId)}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-md font-bold text-xs shrink-0 cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {hedrDatasets[0]?.validationIssues.map((vIssue) => (
                  <div key={vIssue.id} className="p-3.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded font-bold text-[10px]">
                          {vIssue.category} • {vIssue.severity}
                        </span>
                        <span className="font-bold text-slate-900">{vIssue.entityName}</span>
                      </div>
                      <p className="text-slate-600">{vIssue.message}</p>
                    </div>
                    <span className="text-[11px] text-amber-700 font-semibold shrink-0">HEDR Rule</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Regulatory Authorities Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Configured Regulatory Authorities & Councils</h3>
                <p className="text-xs text-slate-500">Authorities enabled specifically for this institutional charter</p>
              </div>
              <span className="text-xs text-slate-500 font-medium">Configurable per university statutes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {authorities.map((auth) => (
                <div key={auth.authorityId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{auth.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {auth.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">{auth.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{auth.description}</p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Jurisdiction: <strong className="text-slate-700">{auth.jurisdiction}</strong></span>
                    {auth.portalUrl && (
                      <a href={auth.portalUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                        Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: HEC Institution Profile & Campuses Recognition */}
      {activeTab === 'institution' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base">HEC Institutional Profile & Charter Governance</h3>
                <p className="text-xs text-slate-500">Legal statutory recognition parameters as registered with Higher Education Commission</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                Autonomous Degree Awarding Institute
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Legal Institution Name</span>
                <p className="text-slate-900 font-bold text-sm">{profile.institutionLegalName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">HEC Recognized Listing</span>
                <p className="text-slate-900 font-bold text-sm">{profile.hecRecognizedName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Legislative Charter / Act</span>
                <p className="text-slate-900 font-bold text-sm">{profile.charterActReference}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Vice Chancellor / Rector</span>
                <p className="text-slate-800 font-medium">{profile.viceChancellorOrPrincipal}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Registrar of University</span>
                <p className="text-slate-800 font-medium">{profile.registrar}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Controller of Examinations</span>
                <p className="text-slate-800 font-medium">{profile.controllerOfExaminations}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Treasurer & CFO</span>
                <p className="text-slate-800 font-medium">{profile.treasurerOrCFO}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">HEC Category & Status</span>
                <p className="text-slate-800 font-medium">Category {profile.hecCategory} • Recognized Status</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Primary Registered Address</span>
                <p className="text-slate-800 font-medium">{profile.mainCampusAddress}, {profile.city}</p>
              </div>
            </div>
          </div>

          {/* Campus Recognition Register */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Official Campus Recognition Register</h3>
                <p className="text-xs text-slate-500">Main campus, authorized sub-campuses, and constituent collegiate units</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">{campuses.length} Campuses Listed</span>
            </div>

            <div className="divide-y divide-slate-100">
              {campuses.map((campus) => (
                <div key={campus.campusId} className="py-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {campus.campusId.replace('CMP-', '')}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{campus.campusName}</h4>
                        <p className="text-xs text-slate-500">{campus.address} • {campus.province}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {campus.campusType}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        {campus.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Recognition Authority</span>
                      <span className="font-bold text-slate-800">{campus.recognitionAuthority}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Approval Reference</span>
                      <span className="font-mono font-bold text-slate-800">{campus.approvalReferenceNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Authorized Programs</span>
                      <span className="font-bold text-slate-800">{campus.programsAuthorized} Programs</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Valid / Review Date</span>
                      <span className="font-bold text-slate-800">{campus.expiryOrReviewDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Program Approvals & HEC Policy Configuration Engine */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Approved Academic Programs & Degree Titles</h3>
                <p className="text-xs text-slate-500">HEC approved nomenclature, total credit hours, and council accreditation status</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                HEC Undergraduate Policy V1.1 Compliant
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Program & Degree Title</th>
                    <th className="py-3 px-4">Degree Level</th>
                    <th className="py-3 px-4">Credit Hours</th>
                    <th className="py-3 px-4">Approval NOC</th>
                    <th className="py-3 px-4">Accreditation Council</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {programs.map((prg) => (
                    <tr key={prg.programId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{prg.programName}</div>
                        <div className="text-slate-500 text-[11px]">{prg.degreeTitle}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{prg.degreeLevel}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {prg.creditHoursTotal} Cr ({prg.durationYears} Yrs)
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {prg.hecNocReference}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{prg.accreditationCouncil}</span>
                        <div className="text-[11px] text-emerald-700 font-bold">Ref: {prg.accreditationNo}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          {prg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Configurable Policy Engine */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Regulatory Policies Engine (Configurable)</h3>
              <p className="text-xs text-slate-500">
                Statutory policies configured without hard-coded rules, allowing seamless adaptation when HEC or provincial mandates change.
              </p>
            </div>

            <div className="space-y-4">
              {policies.map((pol) => (
                <div key={pol.policyId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{pol.policyName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {pol.version}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Effective: {pol.effectiveDate}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{pol.ruleSummary}</p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Formula / Threshold: </span>
                      <strong className="text-slate-800">{pol.thresholdOrFormula}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Legal Source Reference: </span>
                      <span className="text-slate-600 font-mono">{pol.sourceReference}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 4: HEC HEDR Reporting Center */}
      {activeTab === 'hedr' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-base">HEC Higher Education Data Repository (HEDR)</h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-xs">Census 2025-26</span>
                </div>
                <p className="text-xs text-slate-500">
                  Annual mandatory census data collection engine spanning Students, Faculty, Academic Programs, Graduates, and Research
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportHEDRCSV(selectedHEDRDomain)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Export HEDR Package ({selectedHEDRDomain.toUpperCase()})
                </button>
              </div>
            </div>

            {/* Statistics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Total Enrolled Students</span>
                <div className="text-2xl font-black text-slate-900 mt-1">1,420</div>
                <span className="text-[10px] text-slate-400">860 Male • 560 Female</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Faculty Registry</span>
                <div className="text-2xl font-black text-slate-900 mt-1">68</div>
                <span className="text-[10px] text-slate-400">26 PhDs • 42 MS/MPhil</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Graduates Reported</span>
                <div className="text-2xl font-black text-slate-900 mt-1">312</div>
                <span className="text-[10px] text-slate-400">Tracer study recorded</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Validation Errors</span>
                <div className="text-2xl font-black text-rose-700 mt-1">
                  {hedrDatasets[0]?.validationIssues.length || 0}
                </div>
                <span className="text-[10px] text-rose-500 font-semibold">1 Critical • 2 Warnings</span>
              </div>
            </div>

            {/* Domain Switcher */}
            <div className="flex gap-2 border-b border-slate-200 pb-3">
              {(['students', 'faculty', 'programs', 'graduates', 'research'] as const).map((dom) => (
                <button
                  key={dom}
                  onClick={() => setSelectedHEDRDomain(dom)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                    selectedHEDRDomain === dom ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {dom} Dataset
                </button>
              ))}
            </div>

            {/* Domain Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                    {selectedHEDRDomain === 'students' && (
                      <>
                        <th className="py-2.5 px-4">Student & Reg No</th>
                        <th className="py-2.5 px-4">CNIC / B-Form</th>
                        <th className="py-2.5 px-4">Degree Program</th>
                        <th className="py-2.5 px-4">Campus</th>
                        <th className="py-2.5 px-4 text-right">CGPA</th>
                      </>
                    )}
                    {selectedHEDRDomain === 'faculty' && (
                      <>
                        <th className="py-2.5 px-4">Faculty Member</th>
                        <th className="py-2.5 px-4">Designation</th>
                        <th className="py-2.5 px-4">Highest Qualification</th>
                        <th className="py-2.5 px-4">Awarding HEI</th>
                        <th className="py-2.5 px-4 text-center">PCD Status</th>
                      </>
                    )}
                    {selectedHEDRDomain === 'programs' && (
                      <>
                        <th className="py-2.5 px-4">Program Name</th>
                        <th className="py-2.5 px-4">Level</th>
                        <th className="py-2.5 px-4">Credit Hours</th>
                        <th className="py-2.5 px-4">Accreditation</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                      </>
                    )}
                    {selectedHEDRDomain === 'graduates' && (
                      <>
                        <th className="py-2.5 px-4">Graduate</th>
                        <th className="py-2.5 px-4">Program</th>
                        <th className="py-2.5 px-4">Employment Status</th>
                        <th className="py-2.5 px-4">Employer / Further Studies</th>
                        <th className="py-2.5 px-4">Salary Bracket</th>
                      </>
                    )}
                    {selectedHEDRDomain === 'research' && (
                      <>
                        <th className="py-2.5 px-4">Research Title</th>
                        <th className="py-2.5 px-4">Type</th>
                        <th className="py-2.5 px-4">Lead Investigator</th>
                        <th className="py-2.5 px-4">Funding Agency</th>
                        <th className="py-2.5 px-4 text-right">Grant Amount</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {selectedHEDRDomain === 'students' &&
                    degrees.map((d) => (
                      <tr key={d.studentId} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{d.studentName}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{d.registrationNo}</div>
                        </td>
                        <td className="py-3 px-4 font-mono">{d.cnicBForm}</td>
                        <td className="py-3 px-4">{d.programName}</td>
                        <td className="py-3 px-4 text-slate-600">{d.campusName}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{d.cgpa.toFixed(2)}</td>
                      </tr>
                    ))}

                  {selectedHEDRDomain === 'faculty' &&
                    qualifications.map((q) => (
                      <tr key={q.qualificationId} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-slate-900">{q.facultyName}</td>
                        <td className="py-3 px-4 text-slate-700">{q.designation}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-indigo-700">{q.highestDegree}</span> ({q.majorField})
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {q.awardingInstitution}, {q.awardingCountry}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {q.phdCountryDirectoryRef || 'Verified'}
                          </span>
                        </td>
                      </tr>
                    ))}

                  {selectedHEDRDomain === 'programs' &&
                    programs.map((p) => (
                      <tr key={p.programId} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-slate-900">{p.programName}</td>
                        <td className="py-3 px-4">{p.degreeLevel}</td>
                        <td className="py-3 px-4 font-mono font-bold">{p.creditHoursTotal} Cr</td>
                        <td className="py-3 px-4">{p.accreditationCouncil}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                  {selectedHEDRDomain === 'graduates' &&
                    outcomes.map((o) => (
                      <tr key={o.outcomeId} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-slate-900">{o.studentName}</td>
                        <td className="py-3 px-4">{o.programName}</td>
                        <td className="py-3 px-4 font-semibold text-emerald-700">{o.employmentStatus}</td>
                        <td className="py-3 px-4 text-slate-600">
                          {o.employerName || o.higherEdInstitution} {o.countryOfDestination ? `(${o.countryOfDestination})` : ''}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">{o.monthlySalaryBracket || 'N/A'}</td>
                      </tr>
                    ))}

                  {selectedHEDRDomain === 'research' &&
                    researchEntries.map((r) => (
                      <tr key={r.entryId} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-slate-900">{r.title}</td>
                        <td className="py-3 px-4">{r.type}</td>
                        <td className="py-3 px-4">{r.leadPersonName}</td>
                        <td className="py-3 px-4 font-semibold text-blue-700">{r.fundingAgency || 'University ORIC'}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {r.fundingAmountPKR ? `PKR ${r.fundingAmountPKR.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Submission Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 text-xs">Official Census Package Submission & Locking</span>
                <p className="text-[11px] text-slate-500">
                  Submitting will lock the reporting snapshot in Google Sheets audit table with authorized officer reference.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={hedrSubmitRef}
                  onChange={(e) => setHedrSubmitRef(e.target.value)}
                  placeholder="Official Submission Ref"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono w-56"
                />
                <button
                  onClick={handleSubmitHEDRPackage}
                  disabled={isSubmittingHEDR}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmittingHEDR ? 'Locking Snapshot...' : 'Submit & Lock Package'}
                </button>
              </div>
            </div>

            {hedrSubmitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                HEDR Census 2025-26 snapshot locked successfully in database. Audit trail entry created with official reference.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. Tab 5: Degree Records, Controller of Examinations Verification & Attestation Prep */}
      {activeTab === 'degrees' && (
        <div className="space-y-6">
          {/* Degree Verification Counter / Search Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Controller of Examinations — Degree & Transcript Verification Counter</h3>
              <p className="text-xs text-slate-500">
                Instantly verify genuineness of issued degrees, transcript serials, DMC references, and HEC e-Attestation readiness against the university examination gazette.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Degree Serial # (e.g. DEG-2025-00142), Reg # (e.g. 2021-AIHE-BSCS-0042), or 13-digit CNIC..."
                  value={verifySearchQuery}
                  onChange={(e) => setVerifySearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifySearch()}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:border-slate-900 outline-none"
                />
              </div>
              <button
                onClick={handleVerifySearch}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Search className="w-4 h-4" /> Search Record
              </button>
              <button
                onClick={() => setShowVerificationModal(true)}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Log External Request
              </button>
            </div>

            {/* Search Result Banner */}
            {verifyResult && (
              <div className={`p-4 rounded-xl border text-xs ${
                verifyResult.found ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                {verifyResult.found && verifyResult.record ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> GENUINE RECORD VERIFIED — Controller of Examinations Gazette Match
                      </span>
                      <button
                        onClick={() => setIsPrintingVerification(true)}
                        className="px-3 py-1 bg-emerald-700 text-white font-bold rounded text-xs hover:bg-emerald-800 transition flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Verification Certificate
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-emerald-200">
                      <div>Student: <strong>{verifyResult.record.studentName}</strong></div>
                      <div>Father: <strong>{verifyResult.record.fatherName}</strong></div>
                      <div>Degree: <strong>{verifyResult.record.degreeTitle}</strong></div>
                      <div>CGPA: <strong>{verifyResult.record.cgpa} ({verifyResult.record.academicStanding})</strong></div>
                      <div>Transcript No: <strong>{verifyResult.record.transcriptSerialNo}</strong></div>
                      <div>Degree Serial: <strong>{verifyResult.record.degreeSerialNo}</strong></div>
                      <div>Gazette: <strong>{verifyResult.record.gazettePageNo}</strong></div>
                      <div>HEC Status: <strong>{verifyResult.record.hecAttestationStatus}</strong></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    NO OFFICIAL RECORD FOUND: The query did not match any gazetted degree or transcript serial. Potential fraudulent or unissued document.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Official Degree Master Register */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Official Degree & Transcript Master Register</h3>
                <p className="text-xs text-slate-500">Official serial numbering linked to the Controller of Examinations gazette</p>
              </div>

              <input
                type="text"
                placeholder="Filter by name, reg # or degree serial..."
                value={degreeSearchQuery}
                onChange={(e) => setDegreeSearchQuery(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-64"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Student & Registration</th>
                    <th className="py-3 px-4">Degree Title</th>
                    <th className="py-3 px-4">Degree Serial #</th>
                    <th className="py-3 px-4">Transcript No</th>
                    <th className="py-3 px-4">CGPA / Div</th>
                    <th className="py-3 px-4">HEC e-Attestation</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDegrees.map((deg) => (
                    <tr key={deg.degreeRecordId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{deg.studentName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{deg.registrationNo} • {deg.cnicBForm}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{deg.degreeTitle}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{deg.degreeSerialNo}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{deg.transcriptSerialNo}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {deg.cgpa.toFixed(2)} ({deg.academicStanding.replace(' (Honours)', '')})
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          deg.hecAttestationStatus.includes('Attested')
                            ? 'bg-emerald-100 text-emerald-800'
                            : deg.hecAttestationStatus.includes('Verified')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {deg.hecAttestationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedDegreeForCert(deg);
                            setIsPrintingVerification(true);
                          }}
                          className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold border border-slate-200 cursor-pointer"
                        >
                          Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* External Verification Request Audit Log */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">External Agency Verification Requests Audit Trail</h3>
            <div className="divide-y divide-slate-100">
              {verifications.map((req) => (
                <div key={req.requestId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{req.studentName} ({req.regNo})</span>
                      <span className="text-slate-400">• Agency: <strong className="text-slate-700">{req.requestingAgency}</strong></span>
                    </div>
                    <p className="text-slate-500 mt-0.5">{req.remarks}</p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="font-mono text-slate-400">{req.referenceNo}</span>
                    <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Print Modal for Official Degree Verification Certificate */}
          {isPrintingVerification && selectedDegreeForCert && (
            <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 border border-slate-300">
                <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Office of the Controller of Examinations</span>
                    <h2 className="text-lg font-black text-slate-900">{profile.institutionLegalName}</h2>
                    <p className="text-xs text-slate-500">{profile.mainCampusAddress} • Ref: AIHE/VER/CERT/2026</p>
                  </div>
                  <button onClick={() => setIsPrintingVerification(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center py-2">
                  <h3 className="text-base font-extrabold uppercase tracking-widest text-slate-900 underline underline-offset-4">
                    Official Verification Certificate
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">To Whom It May Concern / For HEC & Foreign Credential Evaluation</p>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed space-y-3">
                  <p>
                    This is to officially certify that <strong>{selectedDegreeForCert.studentName}</strong>, S/D/o <strong>{selectedDegreeForCert.fatherName}</strong>, holding National Identity Card / B-Form No. <strong>{selectedDegreeForCert.cnicBForm}</strong> and University Registration No. <strong>{selectedDegreeForCert.registrationNo}</strong>, was a bona fide student of this Institute.
                  </p>
                  <p>
                    The candidate has successfully satisfied all academic and statutory examination requirements for the conferment of the degree of <strong>{selectedDegreeForCert.degreeTitle}</strong> during Session <strong>{selectedDegreeForCert.session}</strong> with a Cumulative Grade Point Average (CGPA) of <strong>{selectedDegreeForCert.cgpa.toFixed(2)}</strong> out of 4.00, earning <strong>{selectedDegreeForCert.academicStanding}</strong>.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                    <div>Degree Serial Number: <strong className="font-mono text-slate-900">{selectedDegreeForCert.degreeSerialNo}</strong></div>
                    <div>Official Transcript No: <strong className="font-mono text-slate-900">{selectedDegreeForCert.transcriptSerialNo}</strong></div>
                    <div>Total Completed Credit Hours: <strong>{selectedDegreeForCert.totalCreditHours} Cr</strong></div>
                    <div>University Gazette Record: <strong>{selectedDegreeForCert.gazettePageNo}</strong></div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    This document is officially signed by the Controller of Examinations and can be authenticated directly via university electronic verification seal.
                  </p>
                </div>

                <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-left text-xs">
                    <div className="font-bold text-slate-900">{selectedDegreeForCert.controllerOfficer}</div>
                    <div className="text-slate-500">Controller of Examinations</div>
                    <div className="text-slate-400 text-[10px]">Date of Certification: {new Date().toISOString().split('T')[0]}</div>
                  </div>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print / Save PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* New Verification Modal */}
          {showVerificationModal && (
            <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm">Log External Verification Request</h3>
                  <button onClick={() => setShowVerificationModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddVerification} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Student Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Hamza Malik"
                      value={newVerificationForm.studentName}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, studentName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Registration Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2021-AIHE-BSCS-0042"
                      value={newVerificationForm.regNo}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, regNo: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Requesting Agency / Employer</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WES, Embassy, HBL HR, Foreign Ministry"
                      value={newVerificationForm.requestingAgency}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, requestingAgency: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Document Type</label>
                    <select
                      value={newVerificationForm.requestType}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, requestType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                    >
                      <option value="Degree">Degree Certificate</option>
                      <option value="Transcript">Official Final Transcript</option>
                      <option value="DMC">Detailed Marks Certificate (DMC)</option>
                      <option value="Provisional Certificate">Provisional Certificate</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Remarks / Reference</label>
                    <textarea
                      placeholder="Agency file number or verification purpose..."
                      value={newVerificationForm.remarks}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, remarks: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none h-16"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowVerificationModal(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800"
                    >
                      Record Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. Tab 6: Document Consistency Checker */}
      {activeTab === 'consistency' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Academic Document Cross-Consistency Checker</h3>
              <p className="text-xs text-slate-500">
                HEC strictly mandates 100% spelling and date conformity across Student Master Record, Nadra CNIC, Matriculation (SSC) certificates, Intermediate (HSSC) transcripts, and Final Degrees.
              </p>
            </div>

            <div className="space-y-3">
              {discrepancies.map((d) => (
                <div
                  key={d.issueId}
                  className={`p-4 rounded-xl border text-xs ${
                    d.status === 'Corrected' ? 'bg-slate-50 border-slate-200' : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{d.studentName} ({d.regNo})</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                          {d.fieldChecked}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          d.status === 'Corrected' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {d.status}
                        </span>
                      </div>
                      <p className="text-slate-700">{d.discrepancyDescription}</p>
                      <div className="grid grid-cols-2 gap-4 pt-1 text-slate-600">
                        <div>University Record: <strong className="text-slate-900">{d.sourceRecordValue}</strong></div>
                        <div>{d.comparisonDocument}: <strong className="text-slate-900">{d.documentValue}</strong></div>
                      </div>
                    </div>

                    {d.status !== 'Corrected' && (
                      <button
                        onClick={() => handleResolveDiscrepancy(d.issueId)}
                        className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition cursor-pointer self-start sm:self-center shrink-0"
                      >
                        Verify Correction
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. Tab 7: Professional Accreditation Councils */}
      {activeTab === 'accreditation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Discipline-Specific Professional Accreditation Councils</h3>
              <p className="text-xs text-slate-500">
                Self-Assessment Reports (SAR), Outcome-Based Education (OBE) Washington Accord status, deficiency remediation, and visit cycles
              </p>
            </div>

            <div className="space-y-4">
              {councils.map((c) => (
                <div key={c.councilRecordId} className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-slate-900 text-white rounded font-extrabold text-xs">
                        {c.councilCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{c.councilName}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded">
                        {c.accreditationLevel}
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Program Evaluated</span>
                      <span className="font-bold text-slate-800">{c.programName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Council Order Ref</span>
                      <span className="font-mono font-bold text-slate-800">{c.approvalRefNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Last Inspection Date</span>
                      <span className="font-bold text-slate-800">{c.lastVisitDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Accreditation Valid Till</span>
                      <span className="font-bold text-slate-800">{c.expiryDate}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Corrective Action Implemented (CQI):</span>
                    <p className="text-slate-700">{c.correctiveActions}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 11. Tab 8: Faculty Qualifications & HEC Criteria Audit */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Faculty Regulatory Compliance & Terminal Qualification Registry</h3>
              <p className="text-xs text-slate-500">
                HEC foreign degree equivalence certificates, PhD Country Directory (PCD) registration numbers, and PEC / PMDC professional renewals
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Faculty Name & Rank</th>
                    <th className="py-3 px-4">Highest Qualification</th>
                    <th className="py-3 px-4">Awarding Institution</th>
                    <th className="py-3 px-4">HEC Equivalence / PCD</th>
                    <th className="py-3 px-4">Professional Council</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {qualifications.map((q) => (
                    <tr key={q.qualificationId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{q.facultyName}</div>
                        <div className="text-slate-500 text-[11px]">{q.designation} • {q.department}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-indigo-700">{q.highestDegree}</span>
                        <div className="text-slate-500 text-[11px]">{q.majorField}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{q.awardingInstitution}</div>
                        <div className="text-slate-400 text-[11px]">{q.awardingCountry} ({q.graduationYear})</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div>{q.hecEquivalenceLetterNo || 'Pak Chartered HEI'}</div>
                        {q.phdCountryDirectoryRef && (
                          <span className="text-emerald-700 font-bold">PCD: {q.phdCountryDirectoryRef}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 text-[11px]">
                        {q.professionalCouncilRegistrationNo ? (
                          <>
                            <div className="font-bold">{q.professionalCouncilRegistrationNo}</div>
                            <div className="text-slate-400">Exp: {q.professionalCouncilExpiry}</div>
                          </>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {q.verificationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 12. Tab 9: Research, PhD Directory & Graduate Outcomes */}
      {activeTab === 'research' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">PhD Scholars Lifecycle & HEC Country Directory (PCD) Pipeline</h3>
              <p className="text-xs text-slate-500">
                Milestone tracking from Coursework, Comprehensive Examination, Foreign Scrutiny to PCD allocation
              </p>
            </div>

            <div className="space-y-3">
              {researchEntries.map((res) => (
                <div key={res.entryId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[10px]">
                        {res.type}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{res.title}</h4>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                      {res.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Scholar / Investigator</span>
                      <span className="font-bold text-slate-800">{res.leadPersonName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Supervisor</span>
                      <span className="font-bold text-slate-800">{res.supervisorOrCoPi || 'Self'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Comprehensive Exam</span>
                      <span className="font-bold text-emerald-700">{res.comprehensiveExamStatus || 'Passed'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">PCD Allocation Status</span>
                      <span className="font-mono font-bold text-indigo-700">{res.phdCountryDirectoryNo || 'PCD-ALLOC-READY'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 13. Tab 10: Regulatory Calendar, Document Register & Submissions */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Regulatory Calendar */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Regulatory Compliance Calendar & Statutory Deadlines</h3>
            <div className="divide-y divide-slate-100">
              {calendarEvents.map((evt) => (
                <div key={evt.eventId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{evt.reportName}</span>
                      <span className="text-slate-400">• Authority: <strong className="text-slate-700">{evt.authority}</strong></span>
                    </div>
                    <p className="text-slate-500">{evt.remarks}</p>
                    <div className="text-slate-400 text-[11px]">Responsible: {evt.responsibleOfficer} ({evt.responsibleDepartment})</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Due Date</span>
                      <span className="font-bold text-slate-800">{evt.dueDate}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      evt.urgencyStatus === 'Overdue'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : evt.urgencyStatus === 'Due Soon'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {evt.urgencyStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Document Register */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Central Compliance Document Register & Vault</h3>
            <div className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <div key={doc.docId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{doc.docTitle}</h4>
                    <div className="text-slate-400 font-mono text-[11px]">
                      {doc.authority} • Ref: {doc.referenceNumber} • Issued: {doc.issueDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-mono">
                      {doc.storageService}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                      {doc.validityStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 14. Tab 11: Provincial Compliance Pack (Punjab HED & BISE / IBCC) */}
      {activeTab === 'provincial' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">Punjab Higher Education Compliance Pack</h3>
                <p className="text-xs text-slate-500">Provincial HED collegiate supervision, BISE intermediate affiliations, and PEEF scholarship quotas</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                Province of {provincial.province} Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Provincial Department</span>
                <p className="text-slate-900 font-bold">{provincial.provincialDepartment}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Affiliation Order #</span>
                <p className="text-slate-900 font-mono font-bold">{provincial.affiliationOrderNumber}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">BISE Examination Board</span>
                <p className="text-slate-900 font-bold">{provincial.biseBoardName}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">BISE College Code</span>
                <p className="text-slate-900 font-mono font-bold">{provincial.biseAffiliationCode}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">PEEF Scholarship Quota</span>
                <p className="text-slate-900 font-bold">{provincial.peefScholarshipQuotaCount} Designated Students</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Annual Inspection Clearance</span>
                <p className="text-slate-900 font-bold">{provincial.annualInspectionReportDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
