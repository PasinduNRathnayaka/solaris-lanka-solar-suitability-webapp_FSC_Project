import React from 'react';

const LocationData = ({
  selectedLocation,
  locationVariables,
  variables,
  locationData,
  onLocationChange,
  onVariableChange,
  onSave,
  calculatePVOUT,
  loading
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">Location-Specific Variable Values</h2>

        {/* Location Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-white font-medium mb-3">Province</label>
            <select
              value={selectedLocation.province}
              onChange={(e) => onLocationChange({
                ...selectedLocation,
                province: e.target.value,
                district: '',
                city: ''
              })}
              disabled={loading}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select Province</option>
              {Object.keys(locationData).map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-3">District</label>
            <select
              value={selectedLocation.district}
              onChange={(e) => onLocationChange({
                ...selectedLocation,
                district: e.target.value,
                city: ''
              })}
              disabled={!selectedLocation.province || loading}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select District</option>
              {selectedLocation.province && Object.keys(locationData[selectedLocation.province]).map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-3">City</label>
            <select
              value={selectedLocation.city}
              onChange={(e) => onLocationChange({
                ...selectedLocation,
                city: e.target.value
              })}
              disabled={!selectedLocation.district || loading}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select City</option>
              {selectedLocation.province && selectedLocation.district && 
               locationData[selectedLocation.province][selectedLocation.district].map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Variable Values */}
        {selectedLocation.city && (
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Variable Values for {selectedLocation.city}, {selectedLocation.district}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {variables.map((variable) => (
                <div key={variable._id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-600">
                  <label className="block text-white font-medium mb-3">
                    {variable.name} ({variable.unit})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={locationVariables[variable._id] || ''}
                    onChange={(e) => onVariableChange(variable._id, e.target.value)}
                    disabled={loading}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder={`Enter ${variable.name.toLowerCase()}`}
                  />
                  <p className="text-gray-400 text-sm mt-2">{variable.description}</p>
                </div>
              ))}
            </div>

            {/* PVOUT Calculation */}
            <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-6 mb-6">
              <h4 className="text-xl font-semibold text-white mb-4">Calculated PVOUT</h4>
              <div className="text-3xl font-bold text-white mb-2">
                {calculatePVOUT().toFixed(3)} kWh/m²/day
              </div>
              <p className="text-white text-opacity-80">
                Based on current model coefficients and location variables
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={onSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : 'Save Location Data'}
              </button>
            </div>
          </div>
        )}

        {!selectedLocation.city && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Select a location to manage variable values</p>
            <p className="text-sm">Choose province, district, and city from the dropdowns above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationData;