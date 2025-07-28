import React, { useState, useEffect } from 'react';
import { Calculator, Database, Zap, MapPin } from 'lucide-react';

const Analytics = () => {
  const [variables, setVariables] = useState([]);
  const [solarPanels, setSolarPanels] = useState([]);
  const [calculations, setCalculations] = useState([]);

  const API_URL = 'http://localhost:5000/api';

  const fetchData = async () => {
    try {
      const [variablesRes, solarPanelsRes, calculationsRes] = await Promise.all([
        fetch(`${API_URL}/variables`),
        fetch(`${API_URL}/solar-panels`),
        fetch(`${API_URL}/calculations`)
      ]);

      const [variablesData, solarPanelsData, calculationsData] = await Promise.all([
        variablesRes.json(),
        solarPanelsRes.json(),
        calculationsRes.json()
      ]);

      setVariables(variablesData);
      setSolarPanels(solarPanelsData);
      setCalculations(calculationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">System Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Calculator className="w-8 h-8" />
              <span className="text-2xl font-bold">{calculations.length}</span>
            </div>
            <h4 className="font-semibold mb-1">Total Calculations</h4>
            <p className="text-sm opacity-90">All time</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Database className="w-8 h-8" />
              <span className="text-2xl font-bold">{variables.length}</span>
            </div>
            <h4 className="font-semibold mb-1">Active Variables</h4>
            <p className="text-sm opacity-90">In the model</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8" />
              <span className="text-2xl font-bold">{solarPanels.length}</span>
            </div>
            <h4 className="font-semibold mb-1">Solar Panels</h4>
            <p className="text-sm opacity-90">Available types</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-8 h-8" />
              <span className="text-2xl font-bold">89</span>
            </div>
            <h4 className="font-semibold mb-1">Active Locations</h4>
            <p className="text-sm opacity-90">With data</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-600">
          <h3 className="text-xl font-semibold mb-4">Model Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-300 mb-2">Average Accuracy: <span className="text-green-400 font-semibold">94.2%</span></p>
              <p className="text-gray-300 mb-2">R² Score: <span className="text-blue-400 font-semibold">0.887</span></p>
              <p className="text-gray-300">RMSE: <span className="text-yellow-400 font-semibold">0.234</span></p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">Last Updated: <span className="text-purple-400 font-semibold">2 hours ago</span></p>
              <p className="text-gray-300 mb-2">Model Version: <span className="text-orange-400 font-semibold">v2.1.3</span></p>
              <p className="text-gray-300">Status: <span className="text-green-400 font-semibold">Active</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;