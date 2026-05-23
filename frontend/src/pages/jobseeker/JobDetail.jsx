import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJobDetail, applyToJob, fetchMyApplications } from '../../api/jobApi';
import { fetchProfile } from '../../api/userApi';

const CATEGORY_LABELS = {
  restaurant: 'Restaurant & Food',
  events: 'Events & Entertainment',
  health_care: 'Health & Care',
  education: 'Education & Tutoring',
  delivery: 'Delivery',
  other: 'Other',
};

const JOB_TYPE_LABELS = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
};

const QUALIFICATION_CHOICES = [
  { value: 'plus_two', label: 'Plus Two' },
  { value: 'degree', label: 'Degree' },
  { value: 'masters', label: 'Masters' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'other', label: 'Other' },
];

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cover_note: '',
    available_from: '',
    has_vehicle: false,
    license_photo: null,
    qualification: '',
    experience_details: '',
    health_certificate: null,
    cv: null,
  });
  const [profileCv, setProfileCv] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchJobDetail(id),
      fetchMyApplications().catch(() => []),
    ])
      .then(([jobData, myApps]) => {
        setJob(jobData);
        const apps = Array.isArray(myApps) ? myApps : [];
        setHasApplied(apps.some((app) => app.job_id === Number(id) || app.job === Number(id)));
      })
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  const openApplyForm = async () => {
    setShowForm(true);
    try {
      const profile = await fetchProfile();
      setProfileCv(profile.cv_url || profile.cv || null);
    } catch {
      setProfileCv(null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formPayload = new FormData();
      formPayload.append('job', id);

      if (formData.cover_note) formPayload.append('cover_note', formData.cover_note);
      if (formData.cv) formPayload.append('cv_snapshot', formData.cv);

      const category = job?.category;
      if (category === 'delivery') {
        formPayload.append('has_vehicle', formData.has_vehicle);
        if (formData.license_photo) formPayload.append('license_photo', formData.license_photo);
      }
      if (category === 'education') {
        if (formData.qualification) formPayload.append('qualification', formData.qualification);
        if (formData.experience_details) formPayload.append('experience_details', formData.experience_details);
      }
      if (category === 'health_care') {
        if (formData.experience_details) formPayload.append('experience_details', formData.experience_details);
        if (formData.health_certificate) formPayload.append('health_certificate', formData.health_certificate);
      }

      await applyToJob(formPayload);
      setSuccess('Application submitted successfully!');
      setShowForm(false);
      setHasApplied(true);
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Failed to submit application.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!job) {
    return (
      <div className="text-center p-12">
        <p className="text-[#9ca3af] text-lg mb-4">Job not found.</p>
        <Link to="/jobseeker/browse-jobs" className="text-[#136040] font-medium underline">
          &larr; Back to Browse Jobs
        </Link>
      </div>
    );
  }

  const renderExtraFormFields = () => {
    const category = job.category;

    if (category === 'delivery') {
      return (
        <>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="has_vehicle"
              checked={formData.has_vehicle}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-[#136040] focus:ring-[#136040]"
            />
            <span className="text-sm font-medium text-[#111827]">I have a vehicle</span>
          </label>
          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">License Photo *</label>
            <input
              type="file"
              name="license_photo"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#136040]/10 file:text-[#136040] hover:file:bg-[#136040]/20"
            />
          </div>
        </>
      );
    }

    if (category === 'education') {
      return (
        <>
          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Qualification *</label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] bg-white"
            >
              <option value="">Select qualification</option>
              {QUALIFICATION_CHOICES.map((q) => (
                <option key={q.value} value={q.value}>{q.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Experience Details</label>
            <textarea
              name="experience_details"
              value={formData.experience_details}
              onChange={handleChange}
              placeholder="Describe your teaching experience..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] resize-none"
            />
          </div>
        </>
      );
    }

    if (category === 'health_care') {
      return (
        <>
          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Experience Details</label>
            <textarea
              name="experience_details"
              value={formData.experience_details}
              onChange={handleChange}
              placeholder="Describe your healthcare experience..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#111827] mb-1.5">Health Certificate *</label>
            <input
              type="file"
              name="health_certificate"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#136040]/10 file:text-[#136040] hover:file:bg-[#136040]/20"
            />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div>
      <div className="mb-6 mt-4">
        <Link to="/jobseeker/dashboard/browse-jobs" className="text-sm text-[#136040] font-medium hover:underline bg-transparent p-0 border-none shadow-none no-underline">
          &larr; Back to Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] font-medium text-[#136040] bg-[#136040]/10 px-2.5 py-1 rounded-full">
                    {CATEGORY_LABELS[job.category] || job.category}
                  </span>
                  <span className="text-[11px] font-medium text-[#6b7280] bg-gray-100 px-2.5 py-1 rounded-full">
                    {JOB_TYPE_LABELS[job.job_type] || job.job_type}
                  </span>
                </div>
                <h1 className="text-[26px] font-bold text-[#111827] mb-1">{job.title}</h1>
                <p className="text-[15px] text-[#6b7280]">{job.employer_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
              <div>
                <span className="text-[11px] text-[#9ca3af] block">Location</span>
                <span className="text-[13px] font-medium text-[#111827]">{job.location}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#9ca3af] block">Salary</span>
                <span className="text-[13px] font-medium text-emerald-600">{job.salary_range || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#9ca3af] block">Timing</span>
                <span className="text-[13px] font-medium text-[#111827]">{job.timing || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#9ca3af] block">Slots</span>
                <span className="text-[13px] font-medium text-[#111827]">{job.slots || 'Open'}</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#111827] mb-3">Description</h3>
              <p className="text-[14px] text-[#4b5563] leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <span className="text-[12px] text-[#9ca3af]">Posted on {formatDate(job.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {hasApplied ? (
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">Already Applied</h3>
              <p className="text-sm text-[#6b7280]">You have already submitted an application for this position.</p>
            </div>
          ) : !showForm ? (
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#111827] mb-4">Interested?</h3>
              <p className="text-sm text-[#6b7280] mb-6">Apply for this position and let the employer know why you're a great fit.</p>
              <button
                onClick={openApplyForm}
                className="w-full px-6 py-3 bg-[#136040] text-white text-sm font-semibold rounded-xl hover:bg-[#0f4f34] transition-colors"
              >
                Apply Now
              </button>
            </div>
          ) : null}

          {showForm && (
            <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-[#111827]">Apply</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-sm text-[#9ca3af] hover:text-[#111827] bg-transparent p-1 border-none shadow-none hover:translate-y-0"
                >
                  Cancel
                </button>
              </div>

              {success && (
                <div className="bg-emerald-50 text-emerald-700 text-sm rounded-xl p-4 mb-4 border border-emerald-200">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl p-4 mb-4 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#111827] mb-1.5">Cover Note</label>
                  <textarea
                    name="cover_note"
                    value={formData.cover_note}
                    onChange={handleChange}
                    placeholder="Tell the employer why you're a good fit..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111827] mb-1.5">CV</label>
                  {profileCv ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-2">
                      <p className="text-xs text-emerald-700">
                        Your profile CV will be automatically attached. Upload a different one below if needed.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-2">
                      <p className="text-xs text-amber-700">
                        No CV found in your profile. You must upload one to apply.
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#136040]/10 file:text-[#136040] hover:file:bg-[#136040]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111827] mb-1.5">Available From</label>
                  <input
                    type="date"
                    name="available_from"
                    value={formData.available_from}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#136040]"
                  />
                </div>

                {renderExtraFormFields()}

                <button
                  type="submit"
                  disabled={submitting || (!profileCv && !formData.cv)}
                  className="w-full px-6 py-3 bg-[#136040] text-white text-sm font-semibold rounded-xl hover:bg-[#0f4f34] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
