import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiDatabase, FiPlay, FiFileText, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  
  const token = localStorage.getItem('token');

  // Get user from localStorage on mount and when location changes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing user:', e);
        setUser(null);
      }
    }
  }, [location]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Request Library', href: '/requests', icon: FiDatabase },
    { name: 'Replay Runner', href: '/replay', icon: FiPlay },
    { name: 'Reports', href: '/reports', icon: FiFileText },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call logout API endpoint
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.post('http://localhost:5000/api/auth/logout', {}, config);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setShowUserMenu(false);
      setIsLoggingOut(false);
      
      // Redirect to login
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">API ReplayLab</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Regression Testing Platform</span>
              
              {/* User Menu */}
              {user && user.name ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.name}</span>
                    <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200">
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                        {user.role && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        )}
                      </div>

                      {/* Logout Section */}
                      <div className="border-t border-gray-200 py-2 px-2">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full text-left px-2 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 flex items-center space-x-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
                        >
                          {isLoggingOut ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Logging out...</span>
                            </>
                          ) : (
                            <>
                              <FiLogOut className="h-5 w-5" />
                              <span>🚪 LOGOUT</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Footer Info */}
                      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-500">
                        <p>Status: Logged in</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Not logged in</span>
                  <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r border-gray-200">
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              API ReplayLab v1.0.0
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
