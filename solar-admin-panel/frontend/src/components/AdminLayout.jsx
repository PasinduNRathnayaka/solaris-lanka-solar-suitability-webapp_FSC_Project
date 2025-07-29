import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Settings, Database, Calculator, MapPin, BarChart3, Users, ArrowLeft, Zap } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'model', label: 'Model Coefficients', icon: Calculator, path: '/admin/model' },
    { id: 'variables', label: 'Variables', icon: Database, path: '/admin/variables' },
    { id: 'solar-panels', label: 'Solar Panels', icon: Zap, path: '/admin/solar-panels' },
    { id: 'locations', label: 'Location Data', icon: MapPin, path: '/admin/locations' },
    // { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    // { id: 'calculations', label: 'Calculations', icon: Users, path: '/admin/calculations' }
  ];

  const isActiveTab = (path) => {
    return location.pathname === path || (path === '/admin/model' && location.pathname === '/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Solar Energy Admin Panel</h1>
                <p className="text-gray-300 text-sm">Manage model coefficients, variables, and solar panels</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Calculator</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-6 mb-8 bg-gray-800 bg-opacity-50 rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                isActiveTab(tab.path)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;