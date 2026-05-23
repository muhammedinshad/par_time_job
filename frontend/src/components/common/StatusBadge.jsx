const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-600 border border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  rejected: 'bg-red-50 text-red-600 border border-red-200',
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
    </span>
  );
};

export default StatusBadge;
