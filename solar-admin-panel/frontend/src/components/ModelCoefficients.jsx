import React from 'react';

const ModelCoefficients = ({ 
  modelCoefficients, 
  onCoefficientChange, 
  onSave, 
  loading 
}) => {
  const coefficients = [
    { key: 'beta0', label: 'β₀ (Intercept)', color: 'from-purple-600 to-blue-600' },
    { key: 'beta1', label: 'β₁ (Solar Irradiance)', color: 'from-yellow-500 to-orange-600' },
    { key: 'beta2', label: 'β₂ (Temperature)', color: 'from-red-500 to-pink-600' },
    { key: 'beta3', label: 'β₃ (Humidity)', color: 'from-green-500 to-teal-600' },
    { key: 'beta4', label: 'β₄ (Cloud Cover)', color: 'from-indigo-500 to-purple-600' },
    { key: 'epsilon', label: 'ε (Error Term)', color: 'from-gray-600 to-gray-700' }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">
          Mathematical Model: PVOUT = β₀ + β₁x₁ + β₂x₂ + β₃x₃ + β₄x₄ + ε
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coefficients.map(({ key, label, color }) => (
            <div key={key} className={`bg-gradient-to-br ${color} rounded-xl p-6`}>
              <label className="block text-white font-medium mb-3">{label}</label>
              <input
                type="number"
                step="0.01"
                value={modelCoefficients[key]}
                onChange={(e) => onCoefficientChange(key, e.target.value)}
                disabled={loading}
                className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50"
              />
            </div>
          ))}
        </div>

        {/* Model Preview */}
        <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-600">
          <h3 className="text-xl font-semibold mb-4">Current Model Formula</h3>
          <div className="font-mono text-lg text-green-400 bg-gray-900 p-4 rounded-lg overflow-x-auto">
            PVOUT = {modelCoefficients.beta0} + ({modelCoefficients.beta1} × Solar Irradiance) + 
            ({modelCoefficients.beta2} × Temperature) + ({modelCoefficients.beta3} × Humidity) + 
            ({modelCoefficients.beta4} × Cloud Cover) + {modelCoefficients.epsilon}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : 'Save Coefficients'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCoefficients;