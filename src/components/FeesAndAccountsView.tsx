import React, { useState } from 'react';
import {
  Receipt,
  CircleDollarSign,
  CreditCard,
  Search,
  PlusCircle,
  Printer,
  FileSpreadsheet,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Calendar,
  Wallet,
  Building,
  UserCheck,
} from 'lucide-react';
import {
  Student,
  FeeInvoice,
  FeeReceipt,
  Account,
  AccountTransaction,
  TeacherSalary,
  SchoolSettings,
} from '../types';

interface FeesAndAccountsViewProps {
  students: Student[];
  feeInvoices: FeeInvoice[];
  feeReceipts: FeeReceipt[];
  accounts: Account[];
  transactions: AccountTransaction[];
  teacherSalaries: TeacherSalary[];
  schoolSettings: SchoolSettings;
  onRecordFeePayment: (receipt: FeeReceipt, invoiceId: string) => void;
  onAddExpense: (txn: AccountTransaction) => void;
}

export const FeesAndAccountsView: React.FC<FeesAndAccountsViewProps> = ({
  students,
  feeInvoices,
  feeReceipts,
  accounts,
  transactions,
  teacherSalaries,
  schoolSettings,
  onRecordFeePayment,
  onAddExpense,
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'receipts' | 'accounts' | 'payroll'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<FeeInvoice | null>(null);
  const [printedReceipt, setPrintedReceipt] = useState<FeeReceipt | null>(null);
  const [printedSalarySlip, setPrintedSalarySlip] = useState<TeacherSalary | null>(null);

  // Payment form state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank' | 'Online'>('Cash');
  const [transactionRef, setTransactionRef] = useState<string>('COUNTER-CASH');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredInvoices = feeInvoices.filter((inv) => {
    const student = students.find((s) => s.studentId === inv.studentId);
    const sName = inv.studentName || student?.fullName || '';
    const sRoll = inv.studentRoll || student?.rollNo || '';
    return (
      searchQuery === '' ||
      sName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sRoll.includes(searchQuery) ||
      inv.invoiceId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalCollected = feeReceipts.reduce((sum, r) => sum + r.amountPaid, 0);
  const totalOutstanding = feeInvoices.reduce((sum, inv) => sum + inv.balance, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const openPaymentModal = (inv: FeeInvoice) => {
    setSelectedInvoiceForPayment(inv);
    setPayAmount(inv.balance);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    const paidNow = Number(payAmount);
    const prevBalance = selectedInvoiceForPayment.balance;
    const remainingBalance = Math.max(0, prevBalance - paidNow);
    const student = students.find((s) => s.studentId === selectedInvoiceForPayment.studentId);

    const newReceipt: FeeReceipt = {
      receiptId: `RCP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceId: selectedInvoiceForPayment.invoiceId,
      studentId: selectedInvoiceForPayment.studentId,
      studentName: selectedInvoiceForPayment.studentName || student?.fullName || 'Student',
      fatherName: student?.fatherName || 'Parent',
      className: student?.classId || 'Grade 9',
      sectionName: student?.sectionId || 'Section A',
      feeMonth: selectedInvoiceForPayment.month,
      totalFee: selectedInvoiceForPayment.totalFee,
      discount: selectedInvoiceForPayment.discount,
      lateFee: selectedInvoiceForPayment.lateFee,
      amountPaid: paidNow,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMethod,
      receivedBy: 'Counter Bursar',
      transactionRef: transactionRef || 'DIRECT-COUNTER',
      previousBalance: prevBalance,
      remainingBalance,
    };

    onRecordFeePayment(newReceipt, selectedInvoiceForPayment.invoiceId);
    setSelectedInvoiceForPayment(null);
    setPrintedReceipt(newReceipt);
    showToast(`Payment of ${schoolSettings.currencySymbol} ${paidNow.toLocaleString()} received.`);
  };

  return (
    <div id="fees-and-accounts-view" className="space-y-6 pb-16">
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
            <div className="flex items-center space-x-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <span>Bursary & Financial ERP Engine</span>
              <span>•</span>
              <span>Formula: Total - Discount + LateFee - Paid = Balance</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="w-7 h-7 text-teal-600" />
              <span>Fees, Ledger & Payroll Management</span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Real-time balance tracking, instant official receipts, expense recording, and salary disbursements.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center p-1.5 bg-slate-100 rounded-xl space-x-1 shrink-0">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'invoices' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fee Invoices
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'receipts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Payment Receipts
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'accounts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chart of Accounts & Ledger
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'payroll' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty Payroll
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 mb-1">Total Fee Collected</p>
          <p className="text-2xl font-bold text-emerald-700">
            {schoolSettings.currencySymbol} {totalCollected.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Realized in current session</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 mb-1">Outstanding Recoveries</p>
          <p className="text-2xl font-bold text-amber-700">
            {schoolSettings.currencySymbol} {totalOutstanding.toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Pending parent dues</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 mb-1">Operational Expenses</p>
          <p className="text-2xl font-bold text-rose-700">
            {schoolSettings.currencySymbol} {totalExpenses.toLocaleString()}
          </p>
          <span className="text-[11px] text-rose-600 font-medium">Salaries, utilities, maintenance</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 mb-1">Net Reserve Margin</p>
          <p className="text-2xl font-bold text-teal-700">
            {schoolSettings.currencySymbol} {(totalCollected - totalExpenses).toLocaleString()}
          </p>
          <span className="text-[11px] text-teal-600 font-medium">Operating surplus</span>
        </div>
      </div>

      {/* Tab 1: Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search invoice by student name or roll #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
              />
            </div>
            <div className="text-xs font-semibold text-slate-600">
              Showing {filteredInvoices.length} invoices
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Invoice #</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Month</th>
                    <th className="py-3.5 px-4 text-right">Total Fee</th>
                    <th className="py-3.5 px-4 text-right">Discount</th>
                    <th className="py-3.5 px-4 text-right">Late Fee</th>
                    <th className="py-3.5 px-4 text-right">Paid</th>
                    <th className="py-3.5 px-4 text-right">Balance</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredInvoices.map((inv) => {
                    const st = students.find((s) => s.studentId === inv.studentId);
                    const sName = inv.studentName || st?.fullName || 'Student';
                    const sRoll = inv.studentRoll || st?.rollNo || '-';
                    return (
                      <tr key={inv.invoiceId} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          {inv.invoiceId}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{sName}</p>
                          <p className="text-xs text-slate-400 font-mono">Roll: #{sRoll}</p>
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                          {inv.month}
                        </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        {inv.totalFee.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700">
                        {inv.discount > 0 ? `-${inv.discount}` : '0'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-rose-700">
                        {inv.lateFee > 0 ? `+${inv.lateFee}` : '0'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        {inv.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-amber-700">
                        {inv.balance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inv.status === 'Partial'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {inv.balance > 0 ? (
                          <button
                            onClick={() => openPaymentModal(inv)}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition"
                          >
                            Collect Fee
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                          </span>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Payment Receipts */}
      {activeTab === 'receipts' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">Realized Payment Receipts</h3>
            <span className="text-xs text-slate-500 font-medium">
              {feeReceipts.length} Official Vouchers Issued
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Received By</th>
                  <th className="py-3 px-4 text-right">Remaining Balance</th>
                  <th className="py-3 px-4 text-center">Print Voucher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {feeReceipts.map((rcp) => (
                  <tr key={rcp.receiptId} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{rcp.receiptId}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{rcp.studentName}</td>
                    <td className="py-3 px-4 text-xs text-slate-600 font-mono">{rcp.paymentDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      {schoolSettings.currencySymbol} {rcp.amountPaid.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                      {rcp.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">{rcp.receivedBy}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                      {schoolSettings.currencySymbol} {rcp.remainingBalance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setPrintedReceipt(rcp)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Chart of Accounts & General Ledger */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Chart of Accounts</span>
            </h3>

            <div className="space-y-2">
              {accounts.map((acc) => (
                <div
                  key={acc.accountId}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-xs text-slate-900">{acc.name || acc.accountName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{acc.code || acc.accountCode} • {acc.type}</p>
                  </div>
                  <span className="font-mono font-bold text-xs text-slate-900">
                    {schoolSettings.currencySymbol} {acc.balance.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
              <span>Recent General Ledger Entries</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5 text-right">Debit</th>
                    <th className="p-2.5 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactions.map((txn) => (
                    <tr key={txn.transactionId} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono text-slate-500">{txn.date}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{txn.description}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            txn.type === 'Income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                        {txn.debit > 0 ? `${schoolSettings.currencySymbol} ${txn.debit.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-rose-700">
                        {txn.credit > 0 ? `${schoolSettings.currencySymbol} ${txn.credit.toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Faculty Payroll */}
      {activeTab === 'payroll' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Faculty Monthly Salary Disbursal</h3>
              <p className="text-xs text-slate-500">
                Formula: Basic Salary + Allowances + Bonus - Deductions = Net Payable
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4 text-right">Basic Pay</th>
                  <th className="py-3 px-4 text-right">Allowances</th>
                  <th className="py-3 px-4 text-right">Deductions</th>
                  <th className="py-3 px-4 text-right">Net Payable</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Salary Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {teacherSalaries.map((sal) => (
                  <tr key={sal.salaryId || sal.payrollId} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{sal.teacherName || sal.employeeName}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">{sal.month}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {sal.basicSalary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700">
                      +{sal.allowances.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-700">
                      -{sal.deductions.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-teal-700">
                      {schoolSettings.currencySymbol} {sal.netSalary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sal.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setPrintedSalarySlip(sal)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Fee Collection Counter</h3>
              <button
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs space-y-1">
                {(() => {
                  const s = students.find((st) => st.studentId === selectedInvoiceForPayment.studentId);
                  return (
                    <p>
                      <strong>Student:</strong> {selectedInvoiceForPayment.studentName || s?.fullName || 'Student'} (Roll: #{selectedInvoiceForPayment.studentRoll || s?.rollNo || '-'})
                    </p>
                  );
                })()}
                <p><strong>Billing Month:</strong> {selectedInvoiceForPayment.month}</p>
                <p><strong>Current Outstanding Balance:</strong> <span className="font-bold text-amber-700">{schoolSettings.currencySymbol} {selectedInvoiceForPayment.balance.toLocaleString()}</span></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Amount to Collect ({schoolSettings.currencySymbol}) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedInvoiceForPayment.balance}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                >
                  <option value="Cash">Cash at Counter</option>
                  <option value="Bank">Bank Deposit / Challan</option>
                  <option value="Online">Online Transfer / Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transaction / Reference #</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Fee Receipt Modal */}
      {printedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Official Payment Receipt</h3>
              <button
                onClick={() => setPrintedReceipt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Receipt Box */}
            <div id="printable-receipt" className="border-2 border-dashed border-slate-400 p-6 rounded-xl bg-slate-50/50 space-y-4 text-xs text-slate-800">
              <div className="text-center border-b border-slate-300 pb-3">
                <h4 className="font-black text-base uppercase">{schoolSettings.schoolName}</h4>
                <p className="text-[10px] text-slate-500">{schoolSettings.address} • {schoolSettings.phone}</p>
                <div className="mt-2 inline-block px-3 py-0.5 rounded bg-teal-100 text-teal-800 font-extrabold text-[11px]">
                  FEE COLLECTION RECEIPT
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div>
                  <p><strong>Receipt #:</strong> {printedReceipt.receiptId}</p>
                  <p><strong>Date:</strong> {printedReceipt.paymentDate}</p>
                  <p><strong>Method:</strong> {printedReceipt.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p><strong>Student:</strong> {printedReceipt.studentName}</p>
                  <p><strong>Ref:</strong> {printedReceipt.transactionRef}</p>
                  <p><strong>Operator:</strong> {printedReceipt.receivedBy}</p>
                </div>
              </div>

              <div className="border-t border-b border-slate-300 py-3 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span>Previous Balance:</span>
                  <span>{schoolSettings.currencySymbol} {printedReceipt.previousBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 text-sm">
                  <span>Amount Paid:</span>
                  <span>{schoolSettings.currencySymbol} {printedReceipt.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-800">
                  <span>Remaining Balance:</span>
                  <span>{schoolSettings.currencySymbol} {printedReceipt.remainingBalance.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between pt-6 text-[10px] text-slate-500">
                <div className="border-t border-slate-400 pt-1 w-28 text-center">Cashier Stamp</div>
                <div className="border-t border-slate-400 pt-1 w-28 text-center">Authorized Signature</div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
