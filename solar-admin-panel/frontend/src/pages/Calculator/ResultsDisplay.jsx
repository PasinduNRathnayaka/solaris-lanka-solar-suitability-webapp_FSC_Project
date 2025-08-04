import React from 'react';
import { Sun, Battery, DollarSign, MapPin, Zap, TrendingUp } from 'lucide-react';

const ResultsDisplay = ({ results, themeClasses, darkMode }) => {
  if (!results) {
    return (
      <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.card}`}>
        <h3 className="text-2xl font-bold mb-6">How to Use This Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-4 bg-blue-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold mb-2">1. Select Location</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose your province, district, and city to load location-specific solar data
            </p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-yellow-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold mb-2">2. Choose Solar Panel</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Select a solar panel type based on efficiency and specifications
            </p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-purple-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold mb-2">3. Enter Installation Area</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Input the total area (in square meters) where you plan to install solar panels
            </p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-green-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold mb-2">4. Get Results</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              View detailed calculations for energy production and financial returns based on your installation area
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Results Card */}
      <div className={`rounded-3xl p-10 shadow-2xl ${themeClasses.resultCard}`}>
        <div className="text-center mb-8">
          <h3 className="text-4xl font-bold mb-4 text-white">Solar Energy Analysis</h3>
          <p className="text-2xl text-white opacity-90">
            {results.location.city}, {results.location.district}, {results.location.province}
          </p>
          <p className="text-lg text-white opacity-80 mt-2">
            Panel: {results.solarPanel.name} ({results.solarPanel.efficiency}% efficiency) | Area: {results.panelArea}m²
          </p>
        </div>
        
        {/* PVOUT Values - Model Generated */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold text-white mb-6 text-center">PVOUT (Model Generated)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Daily PVOUT', value: results.pvout.daily, unit: 'kWh/m²/day', icon: Sun },
              { title: 'Monthly PVOUT', value: results.pvout.monthly, unit: 'kWh/m²/month', icon: Sun },
              { title: 'Annual PVOUT', value: results.pvout.annual, unit: 'kWh/m²/year', icon: Sun }
            ].map((item, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h5 className="text-lg font-semibold text-black mb-2">{item.title}</h5>
                <div className="text-3xl font-bold text-black mb-1">{item.value}</div>
                <p className="text-black opacity-80">{item.unit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Production - Based on PVOUT and Panel Area */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold text-white mb-6 text-center">Energy Production</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Daily Production', value: results.absorbedEnergy.daily, unit: 'kWh/day', icon: Battery },
              { title: 'Monthly Production', value: results.absorbedEnergy.monthly, unit: 'kWh/month', icon: Battery },
              { title: 'Annual Production', value: results.absorbedEnergy.annual, unit: 'kWh/year', icon: Battery }
            ].map((item, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                <h5 className="text-lg font-semibold text-black mb-2">{item.title}</h5>
                <div className="text-3xl font-bold text-black mb-1">{item.value}</div>
                <p className="text-black opacity-80">{item.unit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Cost */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold text-white mb-6 text-center">Installation Cost</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-orange-300" />
              <h5 className="text-lg font-semibold text-black mb-2">Total Cost</h5>
              <div className="text-3xl font-bold text-black mb-1">
                LKR {(results.solarPanel.costPerSqm * results.panelArea).toLocaleString()}
              </div>
              <p className="text-black opacity-80">Complete Installation</p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <h5 className="text-lg font-semibold text-black mb-2">Cost per m²</h5>
              <div className="text-3xl font-bold text-black mb-1">
                LKR {results.solarPanel.costPerSqm.toLocaleString()}
              </div>
              <p className="text-black opacity-80">Per Square Meter</p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <h5 className="text-lg font-semibold text-black mb-2">Area Coverage</h5>
              <div className="text-3xl font-bold text-black mb-1">{results.panelArea}</div>
              <p className="text-black opacity-80">Square Meters</p>
            </div>
          </div>
        </div>

        {/* Basic Financial Returns */}
        <div>
          <h4 className="text-2xl font-bold text-white mb-6 text-center">Basic Financial Returns</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Daily Value', value: `LKR ${results.earnings.daily}`, unit: 'per day', icon: DollarSign },
              { title: 'Monthly Value', value: `LKR ${results.earnings.monthly}`, unit: 'per month', icon: DollarSign },
              { title: 'Annual Value', value: `LKR ${results.earnings.annual}`, unit: 'per year', icon: DollarSign }
            ].map((item, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-green-300" />
                <h5 className="text-lg font-semibold text-black mb-2">{item.title}</h5>
                <div className="text-3xl font-bold text-black mb-1">{item.value}</div>
                <p className="text-black opacity-80">{item.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculation Details */}
      <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.card}`}>
        <h3 className="text-2xl font-bold mb-6">Calculation Method</h3>
        <div className={`p-6 rounded-xl font-mono text-sm overflow-x-auto ${darkMode ? 'bg-gray-800 text-green-400' : 'bg-gray-100 text-green-700'}`}>
          <p className="mb-2 font-semibold">1. PVOUT from Mathematical Model:</p>
          <p className="mb-3">• Annual PVOUT: {results.pvout.annual} kWh/m²/year (Generated by Model)</p>
          <p className="mb-3">• Monthly PVOUT: {results.pvout.annual} ÷ 12 = {results.pvout.monthly} kWh/m²/month</p>
          <p className="mb-3">• Daily PVOUT: {results.pvout.annual} ÷ 365 = {results.pvout.daily} kWh/m²/day</p>
          
          <p className="mb-2 font-semibold mt-4">2. Energy Production Calculation:</p>
          <p className="mb-3">• Panel Efficiency: {results.solarPanel.efficiency}%</p>
          <p className="mb-3">• Installation Area: {results.panelArea}m² (user input)</p>
          <p className="mb-3">• Energy Production = PVOUT × Panel Area × Efficiency</p>
          <p className="mb-3">• Example (Daily): {results.pvout.daily} × {results.panelArea} × {results.solarPanel.efficiency}% = {results.absorbedEnergy.daily} kWh</p>
          
          <p className="mb-2 font-semibold mt-4">3. Installation Cost:</p>
          <p className="mb-3">• Cost per m²: LKR {results.solarPanel.costPerSqm.toLocaleString()}/m²</p>
          <p className="mb-3">• Total Cost: {results.panelArea}m² × LKR {results.solarPanel.costPerSqm.toLocaleString()} = LKR {(results.solarPanel.costPerSqm * results.panelArea).toLocaleString()}</p>
          
          <p className="mb-2 font-semibold mt-4">4. Basic Financial Value:</p>
          <p className="mb-3">• Base Rate: LKR {results.electricityRate}/kWh (simplified rate)</p>
          <p className="mb-3">• Daily Value: {results.absorbedEnergy.daily} × {results.electricityRate} = LKR {results.earnings.daily}</p>
          <p className="mb-3">• Monthly Value: {results.absorbedEnergy.monthly} × {results.electricityRate} = LKR {results.earnings.monthly}</p>
          <p>• Annual Value: {results.absorbedEnergy.annual} × {results.electricityRate} = LKR {results.earnings.annual}</p>
          
          <p className="mb-2 font-semibold mt-4 text-yellow-600">Note:</p>
          <p className="text-yellow-600">• Enter your monthly electricity consumption below for detailed tiered pricing analysis</p>
          <p className="text-yellow-600">• Different Sri Lankan solar plans (Net Metering, Net Accounting, Net Plus) will be analyzed</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;