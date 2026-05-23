import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { fetchMyApplications } from '../../api/jobApi';
import StatusBadge from '../../components/common/StatusBadge';

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
  const location = useLocation();
  const appData = location.state?.application;
  const [app, setApp] = useState(appData || null);
  const [loading, setLoading] = useState(!appData);

  useEffect(() => {
    if (appData) return;
    fetchMyApplications()
      .then((data) => {
        const apps = Array.isArray(data) ? data : [];
        setApp(apps.find((a) => a.id === Number(id)) || null);
      })
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [id, appData]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-[#136040] rounded-full animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center p-12">
        <p className="text-[#9ca3af] text-lg mb-4">Application not found.</p>
        <Link to="/jobseeker/my-applications" className="text-[#136040] font-medium underline">
          &larr; Back to My Applications
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 mt-4">
        <Link to="/jobseeker/dashboard/my-applications" className="text-sm text-[#136040] font-medium hover:underline no-underline">
          &larr; Back to My Applications
        </Link>
      </div>

      <div className="max-w-[800px]">
        <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[24px] font-bold text-[#111827] mb-1">{app.job_title}</h1>
              <p className="text-[14px] text-[#6b7280]">{app.employer_name}</p>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
            <div>
              <span className="text-[11px] text-[#9ca3af] block">Category</span>
              <span className="text-[13px] font-medium text-[#111827] capitalize">
                {CATEGORY_LABELS[app.job_category] || app.job_category}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#9ca3af] block">Applied On</span>
              <span className="text-[13px] font-medium text-[#111827]">{formatDate(app.applied_at)}</span>
            </div>
          </div>

          {app.employer_note && (
            <div className="mb-4">
              <span className="text-xs text-[#9ca3af] block mb-1.5">Employer Note</span>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-[#111827]">{app.employer_note}</p>
              </div>
            </div>
          )}

          {app.status === 'accepted' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-emerald-700">Congratulations! Your application has been accepted.</p>
            </div>
          )}

          {app.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-red-600">Your application has been rejected.</p>
            </div>
          )}

          {app.status === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-amber-700">Your application is under review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
