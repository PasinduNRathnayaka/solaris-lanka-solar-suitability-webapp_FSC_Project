import React from 'react';
import { Sun, Battery, DollarSign, MapPin, Zap, TrendingUp, Info, ArrowRight, BarChart } from 'lucide-react';

const ResultsDisplay = ({ results, themeClasses, darkMode }) => {
  if (!results) {
    return (
      <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.card}`}>
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-4">How to Use This Calculator</h3>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
            Follow these simple steps to get your solar energy analysis
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-lg mb-1">Select Your Location</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose your province, district, and city to load location-specific solar data
              </p>
            </div>
            <MapPin className="w-6 h-6 text-blue-500" />
          </div>

          <div className="flex items-center p-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-lg mb-1">Choose Solar Panel</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select a solar panel type based on efficiency and specifications
              </p>
            </div>
            <Zap className="w-6 h-6 text-yellow-500" />
          </div>

          <div className="flex items-center p-6 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-lg mb-1">Enter Installation Area</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Input the total area (in square meters) where you plan to install solar panels
              </p>
            </div>
            <BarChart className="w-6 h-6 text-purple-500" />
          </div>

          <div className="flex items-center p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">4</span>
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-lg mb-1">Get Results</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                View detailed calculations for energy production and financial returns
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Information */}
      <div className={`rounded-2xl p-8 shadow-xl ${themeClasses.resultCard}`}>
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-4 text-white">Solar Energy Analysis Results</h3>
          <div className="space-y-2">
            <p className="text-xl text-white opacity-90">
              📍 {results.location.city}, {results.location.district}, {results.location.province}
            </p>
            <p className="text-lg text-white opacity-80">
              🔋 {results.solarPanel.name} ({results.solarPanel.efficiency}% efficiency) • 📏 {results.panelArea}m²
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PVOUT Section */}
        <div className={`rounded-2xl border shadow-xl p-6 ${themeClasses.card}`}>
          <div className="flex items-center mb-6">
            <div className="p-3 bg-yellow-500 rounded-lg mr-4">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold">PVOUT (Solar Irradiance)</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Model Generated Values</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily PVOUT</p>
                <p className="text-2xl font-bold text-yellow-600">{results.pvout.daily}</p>
              </div>
              <p className="text-sm text-gray-500">kWh/m²/day</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly PVOUT</p>
                <p className="text-2xl font-bold text-orange-600">{results.pvout.monthly}</p>
              </div>
              <p className="text-sm text-gray-500">kWh/m²/month</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual PVOUT</p>
                <p className="text-2xl font-bold text-red-600">{(results.pvout.annual)*365}</p>
              </div>
              <p className="text-sm text-gray-500">kWh/m²/year</p>
            </div>
          </div>
        </div>

        {/* Energy Production Section */}
        {/* <div className={`rounded-2xl border shadow-xl p-6 ${themeClasses.card}`}>
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-500 rounded-lg mr-4">
              <Battery className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Energy Production</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Based on PVOUT & Panel Area</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Production</p>
                <p className="text-2xl font-bold text-blue-600">{results.absorbedEnergy.daily}</p>
              </div>
              <p className="text-sm text-gray-500">kWh/day</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Production</p>
                <p className="text-2xl font-bold text-cyan-600">{results.absorbedEnergy.monthly}</p>
              </div>
              <p className="text-sm text-gray-500">kWh/month</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual Production</p>
                <p className="text-2xl font-bold text-teal-600">{results.absorbedEnergy.annual}</p>
              </div>
              <p className="text-sm text-gray-500">kWh/year</p>
            </div>
          </div>
        </div> */}

      {/* </div> */}

      {/* Financial Analysis */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
        
        {/* Installation Cost */}
        <div className={`rounded-2xl border shadow-xl p-6 ${themeClasses.card}`}>
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-500 rounded-lg mr-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Installation Cost</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Complete Setup Investment</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="text-center">
                <p className="text-sm font-medium text-purple-600 mb-2">Total Investment</p>
                <p className="text-4xl font-bold text-purple-700 mb-2">
                  LKR {(results.solarPanel.costPerSqm * results.panelArea).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete Installation</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                <p className="text-sm text-gray-100 dark:text-gray-100">Cost per m²</p>
                <p className="text-lg font-bold text-white">LKR {results.solarPanel.costPerSqm.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                <p className="text-sm text-gray-100 dark:text-gray-100">Area Coverage</p>
                <p className="text-lg font-bold text-white">{results.panelArea} m²</p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Financial Returns */}
        {/* <div className={`rounded-2xl border shadow-xl p-6 ${themeClasses.card}`}>
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-500 rounded-lg mr-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Financial Returns</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Estimated Revenue Potential</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Value</p>
                <p className="text-2xl font-bold text-green-600">LKR {results.earnings.daily}</p>
              </div>
              <p className="text-sm text-gray-500">per day</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Value</p>
                <p className="text-2xl font-bold text-emerald-600">LKR {results.earnings.monthly}</p>
              </div>
              <p className="text-sm text-gray-500">per month</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual Value</p>
                <p className="text-2xl font-bold text-teal-600">LKR {results.earnings.annual}</p>
              </div>
              <p className="text-sm text-gray-500">per year</p>
            </div>
          </div>
        </div> */}

      </div>

    
    </div>
  );
};

export default ResultsDisplay;