import React from 'react';
import { Calculator, Database, MapPin, BarChart3 } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'model', label: 'Model Coefficients', icon: Calculator },
    { id: 'variables', label: 'Variables', icon: Database },
    { id: 'locations', label: 'Location Data', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="flex space-x-1 mb-8 bg-gray-800 bg-opacity-50 rounded-xl p-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;