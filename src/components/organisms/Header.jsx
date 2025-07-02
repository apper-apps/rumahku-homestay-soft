import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState('guest'); // guest or owner
  const [currentPlan] = useState('basic'); // mock current plan

  const handleUserTypeToggle = () => {
    setUserType(prev => prev === 'guest' ? 'owner' : 'guest');
  };

  const getDashboardPath = () => {
    return userType === 'owner' ? '/owner-dashboard' : '/customer-dashboard';
  };

  const navigationItems = [
    { name: 'Browse Stays', path: '/browse', icon: 'Search' },
    { name: 'My Bookings', path: getDashboardPath(), icon: 'Calendar' },
    { name: 'List Property', path: '/list-property', icon: 'Plus' },
    { name: 'Plans', path: '/plans', icon: 'Package' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Home" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-display">RumahKu</h1>
              <p className="text-xs text-gray-600">Malaysian Homestays</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* User Type Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleUserTypeToggle}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${userType === 'guest' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                Guest
              </button>
              <button
                onClick={handleUserTypeToggle}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${userType === 'owner' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                Owner
              </button>
            </div>

            {/* Plan Badge for Owners */}
            {userType === 'owner' && (
              <Badge variant={currentPlan} size="sm">
                {currentPlan.toUpperCase()}
              </Badge>
            )}

            {/* Dashboard Button */}
            <Button
              variant="outline"
              size="sm"
              icon="User"
              onClick={() => navigate(getDashboardPath())}
            >
              Dashboard
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-4">
            {/* User Type Toggle Mobile */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 mb-4">
              <button
                onClick={handleUserTypeToggle}
                className={`
                  flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${userType === 'guest' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                  }
                `}
              >
                Guest
              </button>
              <button
                onClick={handleUserTypeToggle}
                className={`
                  flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${userType === 'owner' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                  }
                `}
              >
                Owner
              </button>
            </div>

            {/* Plan Badge Mobile */}
            {userType === 'owner' && (
              <div className="flex justify-center mb-4">
                <Badge variant={currentPlan} size="sm">
                  Current Plan: {currentPlan.toUpperCase()}
                </Badge>
              </div>
            )}

            {/* Navigation Items Mobile */}
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <ApperIcon name={item.icon} size={20} />
                  {item.name}
                </Link>
              );
            })}

            {/* Dashboard Button Mobile */}
            <Button
              variant="primary"
              size="md"
              icon="User"
              className="w-full mt-4"
              onClick={() => {
                navigate(getDashboardPath());
                setMobileMenuOpen(false);
              }}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;