import React from 'react';

const Profile = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#111827] mb-6">My Profile</h1>
      <form className="bg-white p-8 rounded-2xl flex flex-col gap-6 max-w-[450px] mx-auto my-8 shadow-sm border border-[#e5e7eb]">
        <input type="text" placeholder="Full Name" />
        <textarea placeholder="Bio"></textarea>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
