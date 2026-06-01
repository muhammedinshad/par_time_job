import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import EmployerNavbar from './EmployerNavbar';
import StatusBadge from '../../components/common/StatusBadge';
import { fetchApplicationDetail, updateApplicationStatus } from '../../api/jobApi';

const CATEGORY_LABELS = {
  restaurant: 'Restaurant & Food',
  events: 'Events & Entertainment',
  health_care: 'Health & Care',
  education: 'Education & Tutoring',
  delivery: 'Delivery',
  other: 'Other',
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [employerNote, setEmployerNote] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchApplicationDetail(id)
      .then((data) => {
        setApp(data);
        setEmployerNote(data.employer_note || '');
      })
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (status) => {
    setActionLoading(true);
    setActionError('');
    try {
      await updateApplicationStatus(id, { status, employer_note: employerNote });
      setApp((prev) => ({ ...prev, status }));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const BASE_URL = 'http://127.0.0.1:8000';

  const buildMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // path is like "cvs/filename.pdf" — prepend /media/
    return `${BASE_URL}${path}`;
  };

  const renderCategoryFields = () => {
    if (!app) return null;
    const category = app.job_category;

    return (
      <>
        {category === 'delivery' && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-semibold text-[#111827]">Delivery Details</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6b7280]">Has Vehicle:</span>
              <span className={`text-sm font-medium ${app.has_vehicle ? 'text-emerald-600' : 'text-red-500'}`}>
                {app.has_vehicle ? 'Yes' : 'No'}
              </span>
            </div>
            {app.license_photo_url && (
              <div>
                <span className="text-sm text-[#6b7280] block mb-1">License Photo:</span>
                <a
                  href={buildMediaUrl(app.license_photo_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#136040] font-medium underline hover:text-[#0f4f34]"
                >
                  View License Photo
                </a>
              </div>
            )}
          </div>
        )}

        {category === 'education' && app.qualification && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-semibold text-[#111827]">Education Details</h4>
            <div>
              <span className="text-sm text-[#6b7280] block">Qualification:</span>
              <span className="text-sm font-medium text-[#111827] capitalize">{app.qualification?.replace(/_/g, ' ')}</span>
            </div>
          </div>
        )}

        {category === 'health_care' && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-semibold text-[#111827]">Healthcare Details</h4>
            {app.experience_details && (
              <div>
                <span className="text-sm text-[#6b7280] block">Experience Details:</span>
                <p className="text-sm text-[#111827] mt-1">{app.experience_details}</p>
              </div>
            )}
            {app.health_cert_url && (
              <div>
                <span className="text-sm text-[#6b7280] block mb-1">Health Certificate:</span>
                <a
                  href={buildMediaUrl(app.health_cert_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#136040] font-medium underline hover:text-[#0f4f34]"
                >
                  View Health Certificate
                </a>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-[#136040] rounded-full animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#9ca3af] text-lg">Application not found.</p>
          <button onClick={() => navigate('/employer/applications')} className="mt-4 px-6 py-2 bg-[#136040] text-white rounded-xl text-sm">
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const isResolved = app.status === 'accepted' || app.status === 'rejected';

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#f5f7f6] text-[#111827] font-sans flex z-[9999] overflow-hidden m-0 p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <EmployerNavbar />
        <div className="px-10 pb-10 flex-1 max-w-[1000px]">
          <div className="flex items-center justify-between mb-8 mt-4">
            <div>
              <button
                onClick={() => navigate('/employer/applications')}
                className="text-sm text-[#136040] font-medium hover:underline mb-2 bg-transparent p-0 border-none shadow-none hover:translate-y-0"
              >
                &larr; Back to Applications
              </button>
              <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">Application Detail</h1>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#111827] mb-4">Applicant Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-[#9ca3af] block">Full Name</span>
                    <span className="text-sm font-medium text-[#111827]">{app.seeker_name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#9ca3af] block">Phone</span>
                    <span className="text-sm font-medium text-[#111827]">{app.seeker_phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#9ca3af] block">Location</span>
                    <span className="text-sm font-medium text-[#111827]">{app.seeker_location || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#9ca3af] block">Applied On</span>
                    <span className="text-sm font-medium text-[#111827]">{formatDate(app.applied_at)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#111827] mb-4">Job Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-[#9ca3af] block">Job Title</span>
                    <span className="text-sm font-medium text-[#111827]">{app.job_title}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#9ca3af] block">Category</span>
                    <span className="text-sm font-medium text-[#111827]">{CATEGORY_LABELS[app.job_category] || app.job_category}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#111827] mb-4">Application Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-[#9ca3af] block mb-1">Cover Note</span>
                    <p className="text-sm text-[#111827] bg-gray-50 rounded-xl p-4">{app.cover_note || 'No cover note provided.'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-[#9ca3af] block mb-1">CV / Resume</span>
                    {(() => {
                      const cvPath = app.cv_snapshot || app.cv_url || null;
                      const cvUrl = buildMediaUrl(cvPath);
                      return cvUrl ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => window.open(cvUrl, '_blank')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#136040] text-white text-xs font-semibold rounded-lg hover:bg-[#0f4f34] transition-colors border-none shadow-sm"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View CV
                          </button>
                          <a
                            href={cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1.5 text-xs text-[#136040] font-semibold underline hover:text-[#0f4f34]"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-[#9ca3af]">No CV uploaded.</span>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {renderCategoryFields()}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#111827] mb-4">Actions</h3>

                {isResolved ? (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm font-medium text-[#111827]">
                      This application has been <span className={app.status === 'accepted' ? 'text-emerald-600' : 'text-red-600'}>{app.status}</span>.
                    </p>
                    {app.employer_note && (
                      <div className="mt-3">
                        <span className="text-xs text-[#9ca3af] block">Your Note:</span>
                        <p className="text-sm text-[#111827] mt-1">{app.employer_note}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {actionError && (
                      <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4">{actionError}</div>
                    )}

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-[#111827] mb-1.5">
                        Employer Note (optional)
                      </label>
                      <textarea
                        value={employerNote}
                        onChange={(e) => setEmployerNote(e.target.value)}
                        placeholder="Add a note..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleAction('accepted')}
                        disabled={actionLoading}
                        className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading ? 'Processing...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleAction('rejected')}
                        disabled={actionLoading}
                        className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationDetail;
