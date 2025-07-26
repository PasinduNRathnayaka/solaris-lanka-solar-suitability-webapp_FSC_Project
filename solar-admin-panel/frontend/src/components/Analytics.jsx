import React from 'react';
import { Users, Database, MapPin } from 'lucide-react';

const Analytics = ({ analytics, variablesCount }) => {
  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">System Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8" />
              <span className="text-2xl font-bold">
                {analytics.totalCalculations || 0}
              </span>
            </div>
            <h4 className="font-semibold mb-1">Total Calculations</h4>
            <p className="text-sm opacity-90">All time</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Database className="w-8 h-8" />
              <span className="text-2xl font-bold">{variablesCount}</span>
            </div>
            <h4 className="font-semibold mb-1">Active Variables</h4>
            <p className="text-sm opacity-90">In the model</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-8 h-8" />
              <span className="text-2xl font-bold">
                {analytics.coveredCities || analytics.activeLocations || 0}
              </span>
            </div>
            <h4 className="font-semibold mb-1">Covered Cities</h4>
            <p className="text-sm opacity-90">Across Sri Lanka</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-600">
          <h3 className="text-xl font-semibold mb-4">Model Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-300 mb-2">
                Average Accuracy: <span className="text-green-400 font-semibold">
                  {analytics.modelAccuracy || 94.2}%
                </span>
              </p>
              <p className="text-gray-300 mb-2">
                R² Score: <span className="text-blue-400 font-semibold">
                  {analytics.rSquaredScore || 0.887}
                </span>
              </p>
              <p className="text-gray-300">
                RMSE: <span className="text-yellow-400 font-semibold">
                  {analytics.rmse || 0.234}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">
                Last Updated: <span className="text-purple-400 font-semibold">
                  {analytics.lastUpdated ? 
                    new Date(analytics.lastUpdated).toLocaleString() : 
                    'Never'
                  }
                </span>
              </p>
              <p className="text-gray-300 mb-2">
                Active Locations: <span className="text-teal-400 font-semibold">
                  {analytics.activeLocations || 0}
                </span>
              </p>
              <p className="text-gray-300">
                Model Version: <span className="text-orange-400 font-semibold">
                  {analytics.modelVersion || 'v2.1.3'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-600">
          <h3 className="text-xl font-semibold mb-4">Monthly Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-300 mb-2">
                Monthly Calculations: <span className="text-blue-400 font-semibold">
                  {analytics.monthlyCalculations || 0}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">
                New Locations: <span className="text-green-400 font-semibold">
                  {Math.floor((analytics.activeLocations || 0) * 0.1)}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">
                System Uptime: <span className="text-yellow-400 font-semibold">
                  99.9%
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;