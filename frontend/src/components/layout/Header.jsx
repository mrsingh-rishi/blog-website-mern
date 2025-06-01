import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">Blog Platform</Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          {currentUser && (
            <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
          )}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search/${e.target.value}`);
                }
              }}
            />
          </div>
        </div>

        <div>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Hi, {currentUser.username}</span>
              <button 
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login" className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm">Login</Link>
              <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;