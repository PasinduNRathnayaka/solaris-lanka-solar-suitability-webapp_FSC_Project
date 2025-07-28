import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const ModelCoefficients = () => {
  const [loading, setLoading] = useState(false);
  const [modelCoefficients, setModelCoefficients] = useState({
    beta0: 2.5,
    beta1: 0.8,
    beta2: -0.3,
    beta3: 0.6,
    beta4: 0.4,
    epsilon: 0.1
  });

  const API_URL = 'http://localhost:5000/api';

  const fetchModelCoefficients = async () => {
    try {
      const response = await fetch(`${API_URL}/model-coefficients`);
      const data = await response.json();
      setModelCoefficients(data);
    } catch (error) {
      console.error('Error fetching model coefficients:', error);
    }
  };

  useEffect(() => {
    fetchModelCoefficients();
  }, []);

  const handleCoefficientChange = (key, value) => {
    setModelCoefficients(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const saveModelCoefficients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/model-coefficients`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelCoefficients)
      });
      if (response.ok) {
        alert('Model coefficients saved successfully!');
      }
    } catch (error) {
      console.error('Error saving model coefficients:', error);
      alert('Error saving model coefficients');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">Mathematical Model: PVOUT = β₀ + β₁x₁ + β₂x₂ + β₃x₃ + β₄x₄ + ε</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6">
            <label className="block text-white font-medium mb-3">β₀ (Intercept)</label>
            <input
              type="number"
              step="0.01"
              value={modelCoefficients.beta0}
              onChange={(e) => handleCoefficientChange('beta0', e.target.value)}
              className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6">
            <label className="block text-white font-medium mb-3">β₁ (Variable 1)</label>
            <input
              type="number"
              step="0.01"
              value={modelCoefficients.beta1}
              onChange={(e) => handleCoefficientChange('beta1', e.target.value)}
              className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6">
            <label className="block text-white font-medium mb-3">β₂ (Variable 2)</label>
            <input
              type="number"
              step="0.01"
              value={modelCoefficients.beta2}
              onChange={(e) => handleCoefficientChange('beta2', e.target.value)}
              className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6">
            <label className="block text-white font-medium mb-3">β₃ (Variable 3)</label>
            <input
              type="number"
              step="0.01"
              value={modelCoefficients.beta3}
              onChange={(e) => handleCoefficientChange('beta3', e.target.value)}
              className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6">
            <label className="block text-white font-medium mb-3">β₄ (Variable 4)</label>
            <input
              type="number"
              step="0.01"
              value={modelCoefficients.beta4}
              onChange={(e) => handleCoefficientChange('beta4', e.target.value)}
              className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>

          <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-6">
            <label className="block text-white font-medium mb-3">ε (Error Term)</label>
            <input
              type="number"
              step="0.01"
              value={modelCoefficients.epsilon}
              onChange={(e) => handleCoefficientChange('epsilon', e.target.value)}
              className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={saveModelCoefficients}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Coefficients'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCoefficients;