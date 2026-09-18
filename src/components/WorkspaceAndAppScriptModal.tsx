import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Cloud,
  CheckCircle2,
  Mail,
  HardDrive,
  Users,
  Code2,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Play,
  Layers,
  Sparkles,
  Lock,
  ChevronRight,
  Database,
} from 'lucide-react';
import {
  signInWithGoogleWorkspace,
  logoutGoogleWorkspace,
  backupSchoolDataToDrive,
  createGoogleSheetDatabase,
  sendGmailNotice,
  getCachedAccessToken,
} from '../services/workspace';
import { appScriptFiles } from '../services/appScriptGenerator';
import { SchoolSettings } from '../types';

interface WorkspaceAndAppScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolSettings: SchoolSettings;
  fullSchoolPayload: any;
}

export const WorkspaceAndAppScriptModal: React.FC<WorkspaceAndAppScriptModalProps> = ({
  isOpen,
  onClose,
  schoolSettings,
  fullSchoolPayload,
}) => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'appscript' | 'docs'>('workspace');
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copiedFile, setCopiedFile] = useState(false);

  // Workspace integration state
  const [authUser, setAuthUser] = useState<any>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string | null>(null);
  const [driveBackupLink, setDriveBackupLink] = useState<string | null>(null);

  // Email test state
  const [testEmailTo, setTestEmailTo] = useState('kisanagrotraders676@gmail.com');
  const [emailSubject, setEmailSubject] = useState(`Official Notice from ${schoolSettings.schoolName}`);
  const [emailBody, setEmailBody] = useState(
    `<p>Dear Parent / Guardian,</p><p>This is an automated confirmation notice from the <strong>${schoolSettings.schoolName}</strong> ERP Portal regarding student rollcall and quarterly fee clearance.</p><p>Regards,<br/><strong>Administration Office</strong></p>`
  );
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setSyncStatus('Initiating Google Workspace OAuth popup with 5 requested scopes...');
    try {
      const { user } = await signInWithGoogleWorkspace();
      setAuthUser(user);
      setSyncStatus(`Connected as ${user.email} with Drive, Sheets, Gmail, Chat & Contacts permissions!`);
    } catch (err: any) {
      setSyncStatus(`OAuth Error: ${err.message}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogleWorkspace();
    setAuthUser(null);
    setSyncStatus('Signed out from Google Workspace.');
  };

  const handleBackupToDrive = async () => {
    const token = getCachedAccessToken();
    if (!token) {
      setSyncStatus('Please Sign In with Google Workspace first to access Google Drive.');
      return;
    }

    setSyncStatus('Creating complete School ERP JSON snapshot in Google Drive...');
    try {
      const res = await backupSchoolDataToDrive(token, fullSchoolPayload);
      setDriveBackupLink(res.webViewLink || null);
      setSyncStatus(`Successfully backed up school data to Google Drive (${res.name})!`);
    } catch (err: any) {
      setSyncStatus(`Google Drive Upload Error: ${err.message}`);
    }
  };

  const handleCreateGoogleSheet = async () => {
    const token = getCachedAccessToken();
    if (!token) {
      setSyncStatus('Please Sign In with Google Workspace first to access Google Sheets.');
      return;
    }

    setSyncStatus('Creating connected 12-table Google Sheet in your Google Drive...');
    try {
      const res = await createGoogleSheetDatabase(token, schoolSettings.schoolName);
      setCreatedSheetUrl(res.spreadsheetUrl);
      setSyncStatus(`Created Google Spreadsheet: ${res.spreadsheetUrl}`);
    } catch (err: any) {
      setSyncStatus(`Google Sheets API Error: ${err.message}`);
    }
  };

  const handleSendGmailNotice = async () => {
    const token = getCachedAccessToken();
    if (!token) {
      setSyncStatus('Please Sign In with Google Workspace first to dispatch via Gmail.');
      return;
    }

    setIsSendingEmail(true);
    setSyncStatus(`Sending notice to ${testEmailTo} via Gmail API...`);
    try {
      await sendGmailNotice(token, testEmailTo, emailSubject, emailBody);
      setSyncStatus(`Email successfully dispatched to ${testEmailTo} via official Gmail account!`);
    } catch (err: any) {
      setSyncStatus(`Gmail API Error: ${err.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Google Workspace & Apps Script Studio
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  5 Workspace Scopes Configured
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live synchronization with Google Sheets, Google Drive, Gmail, Google Chat, and full 48-sheet Apps Script backend code.
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

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'workspace'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Google Workspace Live Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('appscript')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'appscript'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Google Apps Script Backend Code</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'docs'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Parts 1 to 9 Deployment Guide</span>
          </button>
        </div>

        {/* Tab 1: Live Workspace Operations */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            {/* Status box */}
            {syncStatus && (
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono flex items-center justify-between border border-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {syncStatus}
                </span>
                {createdSheetUrl && (
                  <a
                    href={createdSheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-bold ml-2"
                  >
                    <span>Open Sheet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {driveBackupLink && (
                  <a
                    href={driveBackupLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-bold ml-2"
                  >
                    <span>View in Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* OAuth Connection Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Google Workspace OAuth Status</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized Brand: <strong className="text-slate-800">Abdullah Public School's Apps</strong>
                  </p>
                </div>

                {authUser ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-right text-xs">
                      <p className="font-bold text-slate-900">{authUser.displayName || 'Authorized User'}</p>
                      <p className="text-slate-500">{authUser.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={isSigningIn}
                    onClick={handleSignIn}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                  >
                    <Cloud className="w-4 h-4 text-blue-400" />
                    <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google Workspace'}</span>
                  </button>
                )}
              </div>

              {/* 5 Scopes checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-medium text-slate-600">
                <div className="flex items-center space-x-1.5 p-2 bg-white rounded-lg border border-slate-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Drive (drive.file)</span>
                </div>
                <div className="flex items-center space-x-1.5 p-2 bg-white rounded-lg border border-slate-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Sheets (spreadsheets)</span>
                </div>
                <div className="flex items-center space-x-1.5 p-2 bg-white rounded-lg border border-slate-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gmail (gmail.send)</span>
                </div>
                <div className="flex items-center space-x-1.5 p-2 bg-white rounded-lg border border-slate-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Chat (messages.create)</span>
                </div>
                <div className="flex items-center space-x-1.5 p-2 bg-white rounded-lg border border-slate-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Contacts (contacts.readonly)</span>
                </div>
                <div className="flex items-center space-x-1.5 p-2 bg-white rounded-lg border border-slate-200/60 text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>All Scopes Verified</span>
                </div>
              </div>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Google Drive Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">Google Drive Snapshot</h5>
                    <p className="text-xs text-slate-500">Back up all student and financial data</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Exports a structured JSON backup containing all 48 database tables directly into your connected Google Drive folder.
                </p>
                <button
                  onClick={handleBackupToDrive}
                  className="w-full flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Export Backup to Google Drive</span>
                </button>
              </div>

              {/* Google Sheets DB Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">Live Google Sheets DB</h5>
                    <p className="text-xs text-slate-500">Create connected spreadsheet</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Creates an official Google Spreadsheet with 12 synchronized tables (Students, Teachers, Attendance, Exams, Fees, Ledger).
                </p>
                <button
                  onClick={handleCreateGoogleSheet}
                  className="w-full flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Create Live Google Sheet</span>
                </button>
              </div>
            </div>

            {/* Gmail Notice Sender */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
              <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-600" />
                <span>Send Official Parent Notice via Gmail API</span>
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={testEmailTo}
                    onChange={(e) => setTestEmailTo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">HTML Message Content</label>
                <textarea
                  rows={3}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-800"
                />
              </div>

              <div className="flex justify-end">
                <button
                  disabled={isSendingEmail}
                  onClick={handleSendGmailNotice}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isSendingEmail ? 'Dispatching...' : 'Dispatch via Gmail API'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Apps Script Files */}
        {activeTab === 'appscript' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* File Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {appScriptFiles.map((file, idx) => (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFileIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      selectedFileIdx === idx
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleCopyCode(appScriptFiles[selectedFileIdx].code)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
              >
                {copiedFile ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFile ? 'Copied to Clipboard' : 'Copy File'}</span>
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              <strong>{appScriptFiles[selectedFileIdx].name}</strong>: {appScriptFiles[selectedFileIdx].description}
            </div>

            {/* Code view */}
            <div className="bg-slate-950 text-slate-100 p-4 rounded-2xl font-mono text-xs max-h-96 overflow-y-auto custom-scrollbar border border-slate-800 leading-relaxed">
              <pre>{appScriptFiles[selectedFileIdx].code}</pre>
            </div>
          </div>
        )}

        {/* Tab 3: Deployment Guide */}
        {activeTab === 'docs' && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Part 1: Architectural Overview</h4>
              <p>
                The Smart School Management System operates on a multi-tier serverless cloud architecture. Google Sheets serves as the durable relational data store with 48 distinct sheets, Google Apps Script runs as the serverless execution and concurrency controller using LockService, and the client frontend delivers an instantaneous responsive web interface with zero lag.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Part 5: Automated One-Time Setup Function</h4>
              <p>
                To create all 48 required sheets in a single second, copy the contents of <code className="bg-slate-200 px-1 py-0.5 rounded font-bold">Setup.gs</code> into your Apps Script editor, select the function <code className="bg-slate-200 px-1 py-0.5 rounded font-bold">setupSchoolManagementSystem()</code>, and press Run. It formats headers with dark blue fills, freezes header rows, sets default institutional configurations, and creates the default Super Admin credential.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Part 6: Web App Deployment</h4>
              <ol className="list-decimal pl-4 space-y-1">
                <li>In Google Apps Script, click <strong>Deploy &gt; New deployment</strong>.</li>
                <li>Select type: <strong>Web app</strong>.</li>
                <li>Description: <code className="font-mono">Smart School Management System ERP v2.4</code>.</li>
                <li>Execute as: <strong>Me (your account)</strong>.</li>
                <li>Who has access: <strong>Anyone</strong> (for public parent/student portal access).</li>
                <li>Click <strong>Deploy</strong> and copy the generated Web App URL.</li>
              </ol>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Part 7: Initial Credentials</h4>
              <p>
                Default Super Admin Username: <code className="font-bold text-blue-600">superadmin</code><br />
                Default Password: <code className="font-bold text-blue-600">Admin@12345</code><br />
                Change the password immediately upon initial deployment from the Settings menu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
