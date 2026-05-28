import { CheckCircle, XCircle, Calendar, Hash } from 'lucide-react';
import { useApp } from '../store';
import type { QualityReport } from '../types';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

export default function QualitySection() {
  const { state } = useApp();
  if (state.currentRole === 'admin') return <AdminQuality />;
  if (state.currentRole === 'farmer') return <FarmerQuality />;
  return <ViewerQuality />;
}

function ViewerQuality() {
  const { state } = useApp();
  const verifiedReports = state.qualityReports.filter(qr => qr.status === 'verified');

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Quality Reports</h2>
      <p className="text-sm text-slate-500">View quality verification reports for farm produce.</p>
      {verifiedReports.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {verifiedReports.map(report => (
            <QualityReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <EmptyState icon="clipboard" title="No quality reports" description="Quality reports will appear here once verified." />
      )}
    </div>
  );
}

function QualityReportCard({ report }: { report: QualityReport }) {

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-slate-800">{report.productName}</h4>
          <p className="text-xs text-slate-400">{report.farmerName} &middot; {report.labName}</p>
        </div>
        <Badge variant="verified">{report.grade}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <p className="text-xs text-green-600 mb-1">Freshness</p>
          <p className="text-xl font-bold text-green-800">{report.freshnessScore}%</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg text-center">
          <p className="text-xs text-slate-500 mb-1">Moisture</p>
          <p className="text-xl font-bold text-slate-700">{report.moisture}%</p>
        </div>
        <div className={`p-3 rounded-lg text-center ${report.pesticideResidue === 'Pass' ? 'bg-green-50' : 'bg-error-50'}`}>
          <p className={`text-xs mb-1 ${report.pesticideResidue === 'Pass' ? 'text-green-600' : 'text-error-500'}`}>Pesticide</p>
          <p className={`text-xl font-bold ${report.pesticideResidue === 'Pass' ? 'text-green-800' : 'text-error-600'}`}>{report.pesticideResidue}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{report.batchId}</span>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(report.inspectionDate).toLocaleDateString()}</span>
      </div>

      {report.notes && (
        <p className="text-xs text-slate-500 mt-3 bg-slate-50 p-3 rounded-lg">{report.notes}</p>
      )}
    </div>
  );
}

function FarmerQuality() {
  const { state } = useApp();
  const myReports = state.qualityReports.filter(qr => qr.farmerId === state.currentUser.id);

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Quality Reports</h2>
      {myReports.length > 0 ? (
        <div className="space-y-3">
          {myReports.map(report => (
            <div key={report.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800">{report.productName}</h4>
                <p className="text-xs text-slate-400">{report.batchId}</p>
              </div>
              <Badge variant={report.status}>{report.status}</Badge>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="clipboard" title="No quality reports" description="Request quality checks for your produce." />
      )}
    </div>
  );
}

function AdminQuality() {
  const { state, dispatch } = useApp();
  const pendingReports = state.qualityReports.filter(qr => qr.status === 'pending');
  const approvedReports = state.qualityReports.filter(qr => qr.status === 'verified');

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Quality Approvals</h2>

      {/* Pending */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Pending Approval ({pendingReports.length})</h3>
        {pendingReports.length > 0 ? (
          <div className="space-y-3">
            {pendingReports.map(report => (
              <div key={report.id} className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-800">{report.productName}</h4>
                    <p className="text-xs text-slate-400">{report.farmerName} &middot; Batch: {report.batchId}</p>
                    <p className="text-sm text-slate-500 mt-1">{report.notes}</p>
                  </div>
                  <Badge variant="pending">Pending</Badge>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      dispatch({ type: 'APPROVE_QUALITY', payload: report.id });
                      dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: `Quality report for ${report.productName} approved`, type: 'success' } });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => {
                      dispatch({ type: 'REJECT_QUALITY', payload: { id: report.id, reason: 'Does not meet standards' } });
                      dispatch({ type: 'SHOW_TOAST', payload: { id: Math.random().toString(), message: `Quality report rejected`, type: 'warning' } });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-full hover:bg-slate-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-6 text-center text-sm text-slate-400">No pending quality approvals</div>
        )}
      </div>

      {/* Approved */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Approved ({approvedReports.length})</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {approvedReports.map(report => (
            <QualityReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
}
