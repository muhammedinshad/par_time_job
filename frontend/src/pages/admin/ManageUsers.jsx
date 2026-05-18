import React from 'react';

const ManageUsers = () => {
  return (
    <div className="manage-users">
      <h1>Manage Users</h1>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Smith</td>
            <td>Employer</td>
            <td>Active</td>
            <td><button>Deactivate</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
