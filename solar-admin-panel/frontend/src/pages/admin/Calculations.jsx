import React, { useState, useEffect } from 'react';
import { RefreshCw, Calculator } from 'lucide-react';

const Calculations = () => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  const fetchCalculations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/calculations`);
      const data = await response.json();
      setCalculations(data);
    } catch (error) {
      console.error('Error fetching calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Calculations</h2>
          <button
            onClick={fetchCalculations}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {calculations.length === 0 ? (
          <div className="text-center py-12">
            <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No calculations found</h3>
            <p className="text-gray-500">Calculations will appear here after users perform calculations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {calculations.slice(0, 10).map((calc) => (
              <div key={calc._id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {calc.location.city}, {calc.location.district}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {calc.solarPanelId?.name} - {calc.numberOfPanels} panel(s)
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(calc.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold mb-2">
                      PVOUT: {calc.pvout.toFixed(3)}
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      ${calc.monthlyEarnings.toFixed(2)}/month
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Energy Production</h4>
                    <p className="text-gray-400">Daily: {calc.dailyEnergyProduction.toFixed(2)} kWh</p>
                    <p className="text-gray-400">Monthly: {calc.monthlyEnergyProduction.toFixed(2)} kWh</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Panel Details</h4>
                    <p className="text-gray-400">Type: {calc.solarPanelId?.technology}</p>
                    <p className="text-gray-400">Wattage: {calc.solarPanelId?.wattage}W</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Economics</h4>
                    <p className="text-gray-400">Rate: ${calc.electricityRate}/kWh</p>
                    <p className="text-gray-400">Panels: {calc.numberOfPanels}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculations;