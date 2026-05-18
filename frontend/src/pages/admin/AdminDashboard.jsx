import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">Total Users: 150</div>
        <div className="stat-card">Total Jobs: 45</div>
        <div className="stat-card">Reports: 2</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
