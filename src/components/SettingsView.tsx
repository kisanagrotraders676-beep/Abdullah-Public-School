import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Building,
  Calendar,
  DollarSign,
  Lock,
  Award,
} from 'lucide-react';
import { SchoolSettings, GradeRule } from '../types';

interface SettingsViewProps {
  schoolSettings: SchoolSettings;
  gradeRules: GradeRule[];
  onSaveSettings: (settings: SchoolSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  schoolSettings,
  gradeRules,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<SchoolSettings>({ ...schoolSettings });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    showToast('School settings successfully updated!');
  };

  return (
    <div id="settings-view" className="space-y-6 pb-16">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-3 z-50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <span>System Configuration & Master Rules</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="w-7 h-7 text-slate-700" />
              <span>School Settings & Institutional Profile</span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Customize institution branding, currency, academic sessions, and fee penalties.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Institution Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">School Name</label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-semibold focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Motto / Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Head of Institution / Principal</label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Landline / Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registration / Affiliation</label>
              <input
                type="text"
                value={formData.registrationInfo}
                onChange={(e) => setFormData({ ...formData, registrationInfo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Active Academic Session</label>
              <input
                type="text"
                value={formData.academicSession}
                onChange={(e) => setFormData({ ...formData, academicSession: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Financial Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Grading Scale Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Master Grading Scale Configuration</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="p-2.5 border-r border-slate-200">Grade</th>
                  <th className="p-2.5 border-r border-slate-200 text-center">Min %</th>
                  <th className="p-2.5 border-r border-slate-200 text-center">Max %</th>
                  <th className="p-2.5 border-r border-slate-200 text-center">GPA</th>
                  <th className="p-2.5">Performance Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {gradeRules.map((rule) => (
                  <tr key={rule.id || rule.grade} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-purple-800 border-r border-slate-200">{rule.grade}</td>
                    <td className="p-2.5 text-center font-mono border-r border-slate-200">{rule.minPercentage}%</td>
                    <td className="p-2.5 text-center font-mono border-r border-slate-200">{rule.maxPercentage}%</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700 border-r border-slate-200">{rule.gpa.toFixed(1)}</td>
                    <td className="p-2.5 text-slate-600">{rule.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Save System Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
