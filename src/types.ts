export type UserRole =
  | 'Super Admin'
  | 'Administrator'
  | 'Vice Chancellor'
  | 'Rector'
  | 'Principal'
  | 'Registrar'
  | 'Controller of Examinations'
  | 'Dean'
  | 'HOD'
  | 'Teacher'
  | 'Accountant'
  | 'Receptionist'
  | 'Librarian'
  | 'HR Manager'
  | 'Parent'
  | 'Student';

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  academicSession: string;
  principalName: string;
  registrationInfo: string;
  affiliationNo: string;
  currencySymbol: string;
  themeColor: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  lastLogin: string;
  phone?: string;
  avatar?: string;
}

export interface Student {
  studentId: string;
  admissionNo: string;
  regNo?: string;
  rollNo: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  guardianName?: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bForm: string;
  photo?: string;
  bloodGroup: string;
  religion: string;
  address: string;
  city: string;
  district?: string;
  province?: string;
  phone: string;
  parentPhone: string;
  email: string;
  emergencyContact?: string;
  admissionDate: string;
  academicSession: string;
  classId: string;
  sectionId: string;
  previousSchool?: string;
  previousClass?: string;
  status: 'Active' | 'Inactive' | 'Transferred' | 'Graduated';
  transportNeeded: boolean;
  routeId?: string;
  scholarship?: string;
  feeCategory: 'Standard' | 'Concession' | 'Orphan' | 'Staff Child' | 'Merit Scholarship' | 'Regular';
  notes?: string;
}

export interface Parent {
  parentId: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  cnic: string;
  phone: string;
  altPhone?: string;
  email: string;
  address: string;
  occupation: string;
  relationship: string;
  linkedStudentIds: string[];
}

export interface Teacher {
  teacherId: string;
  employeeId: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  cnic: string;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  experience: string;
  joiningDate: string;
  designation: string;
  department: string;
  subjects: string[];
  assignedClasses: string[];
  salary: number;
  bankInfo: string;
  emergencyContact: string;
  status: 'Active' | 'On Leave' | 'Resigned';
  photo?: string;
}

export interface Staff {
  staffId: string;
  employeeId: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  designation: string;
  department: string;
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Resigned';
}

export interface ClassItem {
  classId: string;
  name: string;
  numericLevel: number;
  sectionIds: string[];
  roomNo: string;
  capacity: number;
  classTeacherId: string;
  classTeacherName?: string;
}

export interface SectionItem {
  sectionId: string;
  name: string;
  classId: string;
  capacity: number;
}

export interface SubjectItem {
  subjectId: string;
  name: string;
  code: string;
  classId: string;
  type: 'Core' | 'Elective' | 'Practical' | 'Theory';
  maxMarks: number;
  passingMarks: number;
  teacherId: string;
  status: 'Active' | 'Inactive';
}
export type Subject = SubjectItem;

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave' | 'Half Day';

export interface StudentAttendance {
  id: string;
  date: string;
  academicSession: string;
  classId: string;
  sectionId: string;
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
  isLocked?: boolean;
}

export interface StaffAttendance {
  id: string;
  date: string;
  staffId: string;
  staffType: 'Teacher' | 'Staff';
  name: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface Exam {
  examId: string;
  name: string;
  academicSession: string;
  term: 'First Term' | 'Mid Term' | 'Final Term' | 'Monthly Test' | 'Annual';
  startDate: string;
  endDate: string;
  classIds: string[];
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Published';
}

export interface MarkRecord {
  markId: string;
  examId: string;
  studentId: string;
  subjectId: string;
  theoryMarks: number;
  practicalMarks: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  passFail: 'Pass' | 'Fail';
  remarks?: string;
  rank?: number;
}
export type Mark = MarkRecord;

export interface GradeRule {
  id: string;
  gradeId?: string;
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gpa: number;
  remarks: string;
}

export interface FeeStructure {
  id: string;
  name: string;
  classId: string;
  feeType: 'Tuition Fee' | 'Admission Fee' | 'Exam Fee' | 'Transport Fee' | 'Library Fee' | 'Computer Fee' | 'Activity Fee' | 'Other';
  amount: number;
  dueDate: string;
  frequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'One-Time';
}

export interface FeeInvoice {
  invoiceId: string;
  studentId: string;
  studentName?: string;
  studentRoll?: string;
  academicSession: string;
  month: string;
  totalFee: number;
  discount: number;
  lateFee: number;
  paidAmount: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
  dueDate: string;
}

export interface FeeReceipt {
  receiptId: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  className: string;
  sectionName: string;
  feeMonth: string;
  totalFee: number;
  discount: number;
  lateFee: number;
  amountPaid: number;
  previousBalance: number;
  remainingBalance: number;
  paymentDate: string;
  paymentMethod: 'Cash' | 'Bank' | 'Online' | 'Other' | 'Cheque';
  receivedBy: string;
  transactionRef?: string;
}

export interface Account {
  accountId: string;
  code: string;
  name: string;
  accountName?: string;
  accountCode?: string;
  type: 'Asset' | 'Liability' | 'Income' | 'Expense';
  balance: number;
  description?: string;
}

export interface AccountTransaction {
  transactionId: string;
  date: string;
  accountId: string;
  type: 'Income' | 'Expense' | 'Transfer' | 'Opening Balance';
  description: string;
  debit: number;
  credit: number;
  amount: number;
  paymentMethod: 'Cash' | 'Bank' | 'Online' | 'Cheque';
  reference?: string;
  user: string;
  timestamp: string;
  runningBalance: number;
}

export interface PayrollRecord {
  payrollId: string;
  salaryId?: string;
  employeeId: string;
  employeeType: 'Teacher' | 'Staff';
  employeeName: string;
  teacherName?: string;
  designation: string;
  department: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  bonus: number;
  deductions: number;
  absenceDeduction: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
  paymentDate?: string;
  paymentMethod?: 'Bank' | 'Cash' | 'Cheque';
}
export type TeacherSalary = PayrollRecord;

export interface TimetableSlot {
  id: string;
  classId: string;
  sectionId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  subjectId: string;
  teacherId: string;
  roomNo: string;
  startTime: string;
  endTime: string;
}

export interface Homework {
  id: string;
  date: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Assigned' | 'Submitted' | 'Checked';
}

export interface Notice {
  id: string;
  noticeId?: string;
  title: string;
  description: string;
  date: string;
  audience: 'All' | 'Teachers' | 'Students' | 'Parents' | 'Staff' | 'Class';
  classId?: string;
  expiryDate?: string;
  published: boolean;
  author: string;
}

export interface LeaveRequest {
  id: string;
  applicantType: 'Student' | 'Teacher' | 'Staff';
  applicantId: string;
  applicantName: string;
  leaveType: 'Sick' | 'Casual' | 'Emergency' | 'Maternity' | 'Other';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  remarks?: string;
}

export interface LibraryBook {
  bookId: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  shelf: string;
  price: number;
}

export interface LibraryTransaction {
  transactionId: string;
  bookId: string;
  bookTitle: string;
  memberType: 'Student' | 'Teacher';
  memberId: string;
  memberName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'Issued' | 'Returned' | 'Overdue';
}

export interface Vehicle {
  vehicleId: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  routeId: string;
  status: 'Active' | 'Under Maintenance';
}

export interface TransportRoute {
  routeId: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  stops: string[];
  transportFee: number;
}

export interface InventoryItem {
  itemId: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minStock: number;
  purchasePrice: number;
  supplier: string;
  location: string;
}

export interface Certificate {
  certificateId: string;
  certificateNo: string;
  certType: 'Bonafide' | 'Character' | 'Leaving' | 'Transfer' | 'Study' | 'Custom';
  studentId: string;
  studentName: string;
  fatherName: string;
  className: string;
  issueDate: string;
  content: string;
  remarks?: string;
}

export interface AuditLogItem {
  logId: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  recordId: string;
  details: string;
  status: 'Success' | 'Warning' | 'Failed';
}

// ==========================================
// PAKISTAN GOVERNMENT & REGULATORY COMPLIANCE MODULE TYPES
// ==========================================

export interface RegulatoryAuthority {
  authorityId: string;
  code: string;
  name: string;
  type: 'Federal (HEC)' | 'Accreditation Council' | 'Provincial HED' | 'Examination Board (BISE)' | 'Equivalence (IBCC)' | 'Revenue/Statutory';
  jurisdiction: string;
  portalUrl?: string;
  focalPerson?: string;
  contactEmail?: string;
  isActive: boolean;
  isMandatory: boolean;
  description: string;
}

export interface HECInstitutionProfile {
  institutionLegalName: string;
  hecRecognizedName: string;
  institutionType: 'University' | 'Degree Awarding Institute (DAI)' | 'Constituent College' | 'Affiliated College';
  sector: 'Public' | 'Private';
  charterActReference: string;
  charterYear: number;
  recognitionStatus: 'Recognized' | 'Conditional Recognition' | 'Under Review' | 'Provisional';
  hecCategory: 'W' | 'X' | 'Y' | 'Z' | 'General';
  mainCampusAddress: string;
  city: string;
  district: string;
  province: 'Punjab' | 'Sindh' | 'Khyber Pakhtunkhwa' | 'Balochistan' | 'Islamabad Capital Territory' | 'Azad Jammu & Kashmir' | 'Gilgit-Baltistan';
  phone: string;
  email: string;
  website: string;
  viceChancellorOrPrincipal: string;
  registrar: string;
  controllerOfExaminations: string;
  treasurerOrCFO: string;
  affiliationUniversity?: string;
  affiliationNo?: string;
  approvalNocReference: string;
  effectiveDate: string;
  nextReviewDate: string;
  lastInspectionDate: string;
  lastUpdated: string;
}

export interface CampusRecognition {
  campusId: string;
  campusName: string;
  campusType: 'Main Campus' | 'Recognized Campus' | 'Constituent College' | 'Affiliated College' | 'Study Center';
  address: string;
  city: string;
  district: string;
  province: string;
  recognitionAuthority: string;
  approvalReferenceNo: string;
  approvalDate: string;
  expiryOrReviewDate: string;
  programsAuthorized: number;
  headOfCampus: string;
  status: 'Recognized' | 'NOC Pending' | 'Under Scrutiny' | 'Conditional' | 'Suspended';
  documents: { title: string; refNo: string; date: string }[];
}

export interface ProgramApproval {
  programId: string;
  programCode: string;
  programName: string;
  degreeTitle: string;
  degreeLevel: 'Undergraduate (BS/BBA 4-Year)' | 'Associate Degree (2-Year)' | 'Graduate (MS/MPhil)' | 'Doctoral (PhD)' | 'Postgraduate Diploma';
  department: string;
  faculty: string;
  campusId: string;
  durationYears: number;
  creditHoursTotal: number;
  launchDate: string;
  approvalAuthority: 'HEC' | 'Academic Council' | 'Syndicate' | 'Affiliating University' | 'Board of Governors';
  approvalReference: string;
  approvalDate: string;
  hecNocReference: string;
  hecNocDate: string;
  accreditationCouncil: string;
  accreditationStatus: 'Accredited' | 'Recognized' | 'Under Review' | 'Pending Renewal' | 'Deficiencies Flagged' | 'Suspended' | 'Discontinued';
  accreditationNo: string;
  accreditationDate: string;
  accreditationExpiry: string;
  curriculumVersion: string;
  hecUndergradPolicyCompliant: boolean;
  status: 'Active' | 'Under Review' | 'Suspended' | 'Discontinued' | 'Pending Renewal';
  prohibitionNote?: string;
}

export interface RegulatoryPolicy {
  policyId: string;
  policyName: string;
  version: string;
  governingAuthority: string;
  effectiveDate: string;
  applicableDegreeLevels: string[];
  ruleSummary: string;
  thresholdOrFormula: string;
  sourceReference: string;
  reviewDate: string;
  isEnabled: boolean;
  adminNotes: string;
}

export interface HEDRValidationIssue {
  id: string;
  category: 'Students' | 'Faculty' | 'Programs' | 'Graduates' | 'Institution' | 'Research';
  recordId: string;
  entityName: string;
  ruleName: string;
  message: string;
  severity: 'Error' | 'Warning' | 'Notice';
  autoResolvable: boolean;
}

export interface HEDRReportingDataset {
  datasetId: string;
  reportingPeriod: string;
  academicYear: string;
  generatedDate: string;
  generatedBy: string;
  responsibleOfficer: string;
  authority: 'HEC Higher Education Data Repository (HEDR)';
  referenceNumber: string;
  submissionStatus: 'Draft' | 'Validation Failed' | 'Ready for Review' | 'Approved Internally' | 'Submitted' | 'Accepted' | 'Returned for Correction' | 'Closed';
  institutionStats: {
    totalStudents: number;
    maleStudents: number;
    femaleStudents: number;
    regularFaculty: number;
    visitingFaculty: number;
    phdFaculty: number;
    activePrograms: number;
    graduatesReported: number;
    researchProjects: number;
  };
  validationIssues: HEDRValidationIssue[];
  submissionDate?: string;
  acceptanceRef?: string;
}

export interface DegreeRecord {
  degreeRecordId: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  cnicBForm: string;
  registrationNo: string;
  rollNo: string;
  seatNo?: string;
  programId: string;
  programName: string;
  degreeTitle: string;
  faculty: string;
  department: string;
  campusName: string;
  session: string;
  admissionDate: string;
  completionDate: string;
  graduationDate: string;
  cgpa: number;
  totalCreditHours: number;
  transcriptSerialNo: string;
  degreeSerialNo: string;
  dmcReferenceNo: string;
  gazettePageNo?: string;
  academicStanding: 'First Division (Honours)' | 'First Division' | 'Second Division' | 'Pass';
  verificationStatus: 'Verified' | 'Pending Verification' | 'Correction Required' | 'Hold';
  hecAttestationStatus: 'Not Applied' | 'Application Assembled' | 'Scrutiny Pending' | 'Verified by HEI' | 'Attested (e-Certificate Issued)';
  hecAttestationRef?: string;
  qrVerificationCode: string;
  controllerOfficer: string;
}

export interface VerificationRequest {
  requestId: string;
  studentId: string;
  studentName: string;
  regNo: string;
  degreeTitle: string;
  requestingAgency: string;
  requestType: 'Transcript' | 'Degree' | 'DMC' | 'Provisional Certificate' | 'Character Certificate';
  requestDate: string;
  verificationOfficer: string;
  status: 'Pending' | 'Verified' | 'Not Verified' | 'Correction Required' | 'Rejected' | 'Completed';
  remarks: string;
  referenceNo: string;
  completionDate?: string;
}

export interface DocumentConsistencyIssue {
  issueId: string;
  studentId: string;
  studentName: string;
  regNo: string;
  fieldChecked: 'Full Name' | 'Father Name' | 'CNIC/B-Form' | 'Date of Birth' | 'Registration No' | 'Degree Title' | 'Session/Year';
  sourceRecordValue: string;
  comparisonDocument: 'CNIC / Nadra Record' | 'Matric / SSC Certificate' | 'Inter / HSSC Certificate' | 'Admission Ledger' | 'Final Transcript' | 'Degree Certificate';
  documentValue: string;
  discrepancyDescription: string;
  severity: 'Critical (Blocks HEC Attestation)' | 'Warning' | 'Typographical';
  status: 'Flagged' | 'Under Investigation' | 'Corrected' | 'Authorized Override';
  flaggedDate: string;
}

export interface AccreditationCouncilRecord {
  councilRecordId: string;
  councilCode: 'PEC' | 'NCEAC' | 'NBEAC' | 'NACTE' | 'PMDC' | 'PCATP' | 'NTC' | 'HEC-QAA';
  councilName: string;
  programId: string;
  programName: string;
  accreditationLevel: 'Level I' | 'Level II (OBE)' | 'Full Accreditation' | 'Interim (1-Year)' | 'Provisional';
  accreditationBatch: string;
  approvalRefNo: string;
  lastVisitDate: string;
  approvalDate: string;
  expiryDate: string;
  status: 'Accredited' | 'Conditional' | 'Under Review' | 'Visit Scheduled' | 'Deficiencies Found';
  deficienciesIdentified: string[];
  correctiveActions: string;
  responsibleOfficer: string;
  evidenceFolderRef: string;
  nextSelfAssessmentDate: string;
}

export interface FacultyQualificationRecord {
  qualificationId: string;
  employeeId: string;
  facultyName: string;
  department: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer' | 'Research Associate' | 'Adjunct Faculty';
  highestDegree: 'PhD' | 'MS / MPhil (18-Years)' | 'Master (16-Years)' | 'Bachelor (4-Year)';
  degreeTitle: string;
  majorField: string;
  awardingInstitution: string;
  awardingCountry: string;
  graduationYear: number;
  hecEquivalenceLetterNo?: string;
  phdCountryDirectoryRef?: string;
  professionalCouncilRegistrationNo?: string;
  professionalCouncilExpiry?: string;
  hecApprovedSupervisor: boolean;
  verificationStatus: 'Verified by HEC/Board' | 'Pending Verification' | 'Document Incomplete';
  assignedPrograms: string[];
  hecMinCriteriaCompliant: boolean;
}

export interface ResearchAndPhDEntry {
  entryId: string;
  type: 'PhD Candidate' | 'Funded Research Project' | 'Journal Publication' | 'Conference Proceeding' | 'Patent';
  title: string;
  leadPersonName: string;
  leadPersonRole: 'Student' | 'Faculty' | 'Principal Investigator';
  supervisorOrCoPi?: string;
  department: string;
  registrationSession?: string;
  synopsisApprovalDate?: string;
  courseworkCreditHoursCompleted?: number;
  comprehensiveExamStatus?: 'Passed' | 'Pending' | 'Exempt';
  foreignReviewersStatus?: 'Approved' | 'In Scrutiny' | 'Awaiting Reports' | 'Not Reached';
  defenseVivaStatus?: 'Passed' | 'Scheduled' | 'Pending';
  phdCountryDirectoryNo?: string;
  fundingAgency?: 'HEC NRPU' | 'HEC TDF' | 'PSF' | 'Ignite' | 'University ORIC Seed' | 'Industry';
  fundingAmountPKR?: number;
  publicationCategory?: 'W' | 'X' | 'Y' | 'HEC Recognized';
  status: 'Active' | 'Completed' | 'Under Review' | 'Submitted';
}

export interface GraduateOutcomeRecord {
  outcomeId: string;
  studentId: string;
  studentName: string;
  programName: string;
  graduationYear: number;
  employmentStatus: 'Employed Full-Time' | 'Employed Part-Time' | 'Self-Employed / Entrepreneur' | 'Pursuing Higher Studies (MS/PhD)' | 'Seeking Employment' | 'Other';
  employerName?: string;
  jobTitle?: string;
  industrySector?: 'IT & Software' | 'Banking & Finance' | 'Education & Academia' | 'Engineering & Industry' | 'Healthcare' | 'Government / Civil Service' | 'NGO' | 'Freelancing';
  monthlySalaryBracket?: '< 50,000' | '50,000 - 100,000' | '100,000 - 200,000' | '200,000+';
  higherEdInstitution?: string;
  higherEdProgram?: string;
  countryOfDestination?: string;
  surveySession: string;
}

export interface RegulatoryCalendarEvent {
  eventId: string;
  authority: string;
  reportName: string;
  reportingPeriod: string;
  dueDate: string;
  responsibleDepartment: string;
  responsibleOfficer: string;
  urgencyStatus: 'Overdue' | 'Due Soon' | 'Submitted' | 'Under Review';
  submissionDate?: string;
  externalRefNo?: string;
  submissionProofDoc?: string;
  remarks?: string;
}

export interface ComplianceDocumentItem {
  docId: string;
  docTitle: string;
  docType: 'Charter / Act' | 'HEC Recognition Order' | 'Campus NOC' | 'Program Approval' | 'Council Accreditation Certificate' | 'Statutory Body (Syndicate/Senate) Minutes' | 'Affiliation Notification' | 'Audit Compliance Report';
  authority: string;
  referenceNumber: string;
  issueDate: string;
  expiryDate?: string;
  relatedCampus?: string;
  relatedProgram?: string;
  fileReference: string;
  storageService: 'Google Drive' | 'Institutional Repository';
  validityStatus: 'Valid / Active' | 'Expiring Soon' | 'Expired / Requires Renewal' | 'Under Scrutiny';
}

export interface ProvincialCompliancePack {
  province: 'Punjab' | 'Sindh' | 'Khyber Pakhtunkhwa' | 'Balochistan';
  provincialDepartment: string;
  collegeAffiliationUniversity: string;
  affiliationOrderNumber: string;
  affiliationValidTill: string;
  biseBoardName: string;
  biseAffiliationCode: string;
  punjabHigherEdPortalCode: string;
  peefScholarshipQuotaCount: number;
  statutoryMeetingMinutesRef: string;
  annualInspectionReportDate: string;
  isPackActive: boolean;
}
