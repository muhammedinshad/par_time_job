import React from 'react';

const PostJob = () => {
  return (
    <div className="post-job">
      <h1>Post a New Job</h1>
      <form>
        <input type="text" placeholder="Job Title" required />
        <textarea placeholder="Job Description" required></textarea>
        <input type="text" placeholder="Salary Range" />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
