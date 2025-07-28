import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';

const ModelCoefficients = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modelData, setModelData] = useState({
    beta0: 2.5,
    epsilon: 0.1,
    coefficients: [],
    variables: []
  });

  const API_URL = 'http://localhost:5000/api';

  const fetchModelCoefficients = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${API_URL}/model-coefficients`);
      const data = await response.json();
      setModelData(data);
    } catch (error) {
      console.error('Error fetching model coefficients:', error);
      alert('Error fetching model coefficients');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchModelCoefficients();
  }, []);

  const handleInterceptChange = (value) => {
    setModelData(prev => ({
      ...prev,
      beta0: parseFloat(value) || 0
    }));
  };

  const handleEpsilonChange = (value) => {
    setModelData(prev => ({
      ...prev,
      epsilon: parseFloat(value) || 0
    }));
  };

  const handleCoefficientChange = (variableId, value) => {
    setModelData(prev => ({
      ...prev,
      coefficients: prev.coefficients.map(coeff => 
        coeff.variableId === variableId 
          ? { ...coeff, value: parseFloat(value) || 0 }
          : coeff
      )
    }));
  };

  const saveModelCoefficients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/model-coefficients`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beta0: modelData.beta0,
          epsilon: modelData.epsilon,
          coefficients: modelData.coefficients
        })
      });
      
      if (response.ok) {
        alert('Model coefficients saved successfully!');
        await fetchModelCoefficients(); // Refresh data
      } else {
        throw new Error('Failed to save coefficients');
      }
    } catch (error) {
      console.error('Error saving model coefficients:', error);
      alert('Error saving model coefficients');
    } finally {
      setLoading(false);
    }
  };

  const generateEquation = () => {
    let equation = `PVOUT = β₀`;
    modelData.coefficients.forEach((coeff, index) => {
      equation += ` + β${index + 1}(${coeff.variableName})`;
    });
    equation += ` + ε`;
    return equation;
  };

  const gradientColors = [
    'from-purple-600 to-blue-600',
    'from-yellow-500 to-orange-600',
    'from-red-500 to-pink-600',
    'from-green-500 to-teal-600',
    'from-indigo-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-pink-500 to-rose-600',
    'from-emerald-500 to-green-600'
  ];

  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Mathematical Model</h2>
            <p className="text-lg text-gray-300 font-mono">{generateEquation()}</p>
          </div>
          <button
            onClick={fetchModelCoefficients}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {modelData.coefficients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No variables found</p>
            <p className="text-gray-500">Please add variables first to configure model coefficients</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Intercept */}
              <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-6">
                <label className="block text-white font-medium mb-3">
                  β₀ (Intercept)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={modelData.beta0}
                  onChange={(e) => handleInterceptChange(e.target.value)}
                  placeholder="Enter intercept value"
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-lg font-semibold placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p className="text-white text-opacity-70 text-sm mt-2">Base value when all variables are zero</p>
              </div>

              {/* Dynamic Variable Coefficients */}
              {modelData.coefficients.map((coeff, index) => (
                <div 
                  key={coeff.variableId} 
                  className={`bg-gradient-to-br ${gradientColors[index % gradientColors.length]} rounded-xl p-6`}
                >
                  <label className="block text-white font-medium mb-3">
                    β{index + 1} ({coeff.variableName})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={coeff.value}
                    onChange={(e) => handleCoefficientChange(coeff.variableId, e.target.value)}
                    placeholder={`Enter β${index + 1} value`}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-lg font-semibold placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <p className="text-white text-opacity-70 text-sm mt-2">
                    Impact of {coeff.variableName} on output
                  </p>
                </div>
              ))}

              {/* Error Term */}
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-6">
                <label className="block text-white font-medium mb-3">
                  ε (Error Term)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={modelData.epsilon}
                  onChange={(e) => handleEpsilonChange(e.target.value)}
                  placeholder="Enter error term value"
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-lg font-semibold placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p className="text-white text-opacity-70 text-sm mt-2">Random error component</p>
              </div>
            </div>

            {/* Variables Summary */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Model Variables Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modelData.variables.map((variable, index) => (
                  <div key={variable._id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">β{index + 1}: {variable.name}</span>
                      <span className="text-sm text-gray-400">{variable.unit}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{variable.description}</p>
                    <p className="text-sm text-blue-400 mt-2">
                      Coefficient: {modelData.coefficients.find(c => c.variableId === variable._id)?.value || 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveModelCoefficients}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : 'Save Coefficients'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModelCoefficients;