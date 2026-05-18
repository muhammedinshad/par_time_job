import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ links }) => {
  return (
    <aside className="sidebar">
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <NavLink to={link.path}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
