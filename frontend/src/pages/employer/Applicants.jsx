import React from 'react';

const Applicants = () => {
  return (
    <div className="applicants">
      <h1>Job Applicants</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Job Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>Web Developer</td>
            <td><button>View Profile</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Applicants;
