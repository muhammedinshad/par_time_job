import React from 'react';

const Profile = () => {
  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <form>
        <input type="text" placeholder="Full Name" />
        <textarea placeholder="Bio"></textarea>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
