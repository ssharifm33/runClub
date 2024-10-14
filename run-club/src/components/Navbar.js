import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/log-run">Log Run</Link>
        </li>
        <li>
          <Link to="/plan-run">Plan Run</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
