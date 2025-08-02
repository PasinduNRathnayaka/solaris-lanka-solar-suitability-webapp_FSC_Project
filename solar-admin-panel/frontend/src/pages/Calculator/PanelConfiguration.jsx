import React from 'react';
import { Zap, Settings } from 'lucide-react';

const PanelConfiguration = ({ 
  selectedPanel, 
  setSelectedPanel, 
  solarPanels, 
  panelArea, 
  setPanelArea, 
  calculateSolarOutput, 
  loading, 
  loadingLocation, 
  locationData, 
  themeClasses,
  darkMode 
}) => {
  return (
    <div className={`rounded-3xl border shadow-2xl p-8 mb-8 transition-all duration-300 ${themeClasses.card}`}>
      <h2 className="text-3xl font-bold mb-8 flex items-center">
        <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mr-4">
          <Zap className="w-8 h-8 text-white" />
        </div>
        Solar Panel Configuration
      </h2>

      {/* Solar Panel Selection */}
      <div className="mb-10">
        <label className={`block font-semibold text-lg mb-4 flex items-center ${themeClasses.text}`}>
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mr-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          Select Solar Panel Type
        </label>
        <select
          value={selectedPanel}
          onChange={(e) => setSelectedPanel(e.target.value)}
          className={`w-full border rounded-xl px-4 py-4 text-lg focus:ring-2 focus:border-transparent transition-all duration-200 shadow-md ${themeClasses.input}`}
        >
          <option value="">Choose a solar panel</option>
          {solarPanels.map(panel => (
            <option key={panel._id} value={panel._id}>
              {panel.name} - {panel.efficiency}% efficiency
            </option>
          ))}
        </select>
      </div>

      {/* Panel Area Input */}
      <div className="mb-10">
        <label className={`block font-semibold text-lg mb-4 flex items-center ${themeClasses.text}`}>
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mr-3">
            <Settings className="w-6 h-6 text-white" />
          </div>
          Solar Panel Installation Area
        </label>
        <div className="relative">
          <input
            type="number"
            value={panelArea}
            onChange={(e) => setPanelArea(e.target.value)}
            placeholder="Enter area in square meters (m²)"
            min="0.1"
            step="0.1"
            className={`w-full border rounded-xl px-4 py-4 text-lg focus:ring-2 focus:border-transparent transition-all duration-200 shadow-md ${themeClasses.input}`}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
            m²
          </div>
        </div>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Enter the total area you want to install solar panels on. This will be used to calculate your energy production and earnings.
        </p>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateSolarOutput}
        disabled={loading || loadingLocation || !locationData || !selectedPanel || !panelArea}
        className={`w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50 text-white shadow-2xl ${themeClasses.button}`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            Calculating...
          </div>
        ) : (
          'Calculate Solar Output & Earnings'
        )}
      </button>
    </div>
  );
};

export default PanelConfiguration;