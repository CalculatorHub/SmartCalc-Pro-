import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''} title="Dashboard">🏠</Link>
      <Link to="/finance" className={location.pathname === '/finance' ? 'active' : ''} title="Finance Hub">💰</Link>
    </div>
  );
}
