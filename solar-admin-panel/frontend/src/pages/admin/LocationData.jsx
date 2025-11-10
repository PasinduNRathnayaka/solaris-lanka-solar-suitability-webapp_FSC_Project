import React, { useState, useEffect } from 'react';
import { Save, DollarSign, Loader } from 'lucide-react';

const LocationData = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [variables, setVariables] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({ province: '', district: '', city: '' });
  const [locationVariables, setLocationVariables] = useState({});
  const [electricityRate, setElectricityRate] = useState('');
  const [modelCoefficients, setModelCoefficients] = useState({
    beta0: 2.5,
    epsilon: 0.1,
    coefficients: [],
    variables: []
  });

  const locationData = {
    "Central Province": {
      "Kandy": ["Kandy", "Gampola", "Nawalapitiya", "Peradeniya", "Akurana"],
      "Matale": ["Matale", "Dambulla", "Sigiriya", "Galewela", "Ukuwela"],
      "Nuwara Eliya": ["Nuwara Eliya", "Hatton", "Talawakelle", "Haputale", "Bandarawela"],
    },
    "Eastern Province": {
      "Ampara": ["Ampara", "Kalmunai", "Sainthamaruthu", "Akkaraipattu", "Pottuvil"],
      "Batticaloa": ["Batticaloa", "Kattankudy", "Eravur", "Vakarai", "Valaichchenai"],
      "Trincomalee": ["Trincomalee", "Nilaveli", "Kinniya", "Mutur", "Kuchchaveli"],
    },
    "North Central Province": {
      "Anuradhapura": ["Anuradhapura", "Mihintale", "Kekirawa", "Eppawala", "Thambuttegama"],
      "Polonnaruwa": ["Polonnaruwa", "Kaduruwela", "Hingurakgoda", "Medirigiriya", "Bakamuna"],
    },
    "Northern Province": {
      "Jaffna": ["Jaffna", "Nallur", "Chavakachcheri", "Point Pedro", "Velanai"],
      "Kilinochchi": ["Kilinochchi", "Paranthan", "Poonakari", "Pallai"],
      "Mannar": ["Mannar", "Talaimannar", "Nanattan", "Adampan"],
      "Mullaitivu": ["Mullaitivu", "Puthukkudiyiruppu", "Oddusuddan", "Mankulam"],
      "Vavuniya": ["Vavuniya", "Cheddikulam", "Settikulam", "Nedunkeni"],
    },
    "North Western Province": {
      "Kurunegala": ["Kurunegala", "Kuliyapitiya", "Pannala", "Narammala", "Wariyapola"],
      "Puttalam": ["Puttalam", "Chilaw", "Wennappuwa", "Marawila", "Kalpitiya"],
    },
    "Sabaragamuwa Province": {
      "Kegalle": ["Kegalle", "Mawanella", "Ruwanwella", "Warakapola", "Dehiowita"],
      "Ratnapura": ["Ratnapura", "Balangoda", "Embilipitiya", "Pelmadulla", "Kuruwita"],
    },
    "Southern Province": {
      "Galle": ["Galle", "Hikkaduwa", "Ambalangoda", "Bentota", "Elpitiya"],
      "Hambantota": ["Hambantota", "Tissamaharama", "Tangalle", "Ambalantota", "Beliatta"],
      "Matara": ["Matara", "Weligama", "Mirissa", "Akuressa", "Dickwella"],
    },
    "Uva Province": {
      "Badulla": ["Badulla", "Bandarawela", "Haputale", "Welimada", "Mahiyanganaya"],
      "Monaragala": ["Monaragala", "Wellawaya", "Bibile", "Kataragama", "Buttala"],
    },
    "Western Province": {
      "Colombo": ["Colombo", "Dehiwala-Mount Lavinia", "Mount Lavinia", "Sri Jayewardenepura Kotte", "Moratuwa"],
      "Gampaha": ["Gampaha", "Negombo", "Kelaniya", "Kadawatha", "Ja-Ela"],
      "Kalutara": ["Kalutara", "Panadura", "Horana", "Beruwala", "Aluthgama"],
    },
  };

  const API_URL = 'http://localhost:5000/api';

  const fetchVariables = async () => {
    try {
      const response = await fetch(`${API_URL}/variables`);
      const data = await response.json();
      setVariables(data);
    } catch (error) {
      console.error('Error fetching variables:', error);
    }
  };

  const fetchModelCoefficients = async () => {
    try {
      const response = await fetch(`${API_URL}/model-coefficients`);
      const data = await response.json();
      setModelCoefficients(data);
    } catch (error) {
      console.error('Error fetching model coefficients:', error);
    }
  };

  const fetchLocationData = async () => {
    if (!selectedLocation.city || !selectedLocation.district || !selectedLocation.province) {
      return;
    }

    setFetchingData(true);
    try {
      const response = await fetch(`${API_URL}/locations/${selectedLocation.province}/${selectedLocation.district}/${selectedLocation.city}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched location data:', data);
        
        const variableValues = {};
        
        if (data && data.variables) {
          data.variables.forEach(v => {
            variableValues[v.variableId._id || v.variableId] = v.value;
          });
        }
        
        setLocationVariables(variableValues);
        setElectricityRate(data?.electricityRate?.toString() || '');
      } else {
        console.log('No existing data found for location, resetting values');
        setLocationVariables({});
        setElectricityRate('');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      setLocationVariables({});
      setElectricityRate('');
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchVariables();
    fetchModelCoefficients();
  }, []);

  useEffect(() => {
    setLocationVariables({});
    setElectricityRate('');
    
    if (selectedLocation.city) {
      fetchLocationData();
    }
  }, [selectedLocation.province, selectedLocation.district, selectedLocation.city]);

  const handleVariableValueChange = (variableId, value) => {
    setLocationVariables(prev => ({
      ...prev,
      [variableId]: value === '' ? '' : (parseFloat(value) || 0)
    }));
  };

  const saveLocationData = async () => {
    if (!selectedLocation.city) {
      alert('Please select a location');
      return;
    }

    try {
      setLoading(true);
      
      const variablesArray = Object.entries(locationVariables)
        .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        .map(([variableId, value]) => ({
          variableId,
          value: parseFloat(value) || 0
        }));

      const requestData = {
        province: selectedLocation.province,
        district: selectedLocation.district,
        city: selectedLocation.city,
        variables: variablesArray,
        electricityRate: parseFloat(electricityRate) || 0
      };

      const response = await fetch(`${API_URL}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        alert('Location data saved successfully!');
        await fetchLocationData();
      } else {
        const errorData = await response.json();
        alert('Error saving location data: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving location data:', error);
      alert('Error saving location data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Updated calculation function to use dynamic coefficients
  const calculatePVOUT = () => {
    const { beta0, epsilon, coefficients } = modelCoefficients;
    
    let result = beta0 + epsilon;
    
    // Use coefficients array to calculate based on actual variable mapping
    coefficients.forEach(coeff => {
      const variableValue = locationVariables[coeff.variableId];
      if (variableValue !== '' && variableValue !== null && variableValue !== undefined) {
        result += coeff.value * parseFloat(variableValue);
      }
    });
    
    return result;
  };

  // Helper function to get coefficient for a specific variable
  const getCoefficientForVariable = (variableId) => {
    const coeff = modelCoefficients.coefficients.find(c => c.variableId === variableId);
    return coeff ? coeff.value : 0;
  };

  const hasValidVariableValues = () => {
    return Object.values(locationVariables).some(v => v !== '' && v !== null && v !== undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Location-Specific Variable Values</h2>

          {/* Location Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-white font-medium mb-3">Province</label>
              <select
                value={selectedLocation.province}
                onChange={(e) => setSelectedLocation(prev => ({ ...prev, province: e.target.value, district: '', city: '' }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
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
                onChange={(e) => setSelectedLocation(prev => ({ ...prev, district: e.target.value, city: '' }))}
                disabled={!selectedLocation.province}
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
                onChange={(e) => setSelectedLocation(prev => ({ ...prev, city: e.target.value }))}
                disabled={!selectedLocation.district}
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

          {/* Loading indicator when fetching data */}
          {fetchingData && selectedLocation.city && (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-blue-500 mr-2" />
              <span className="text-white">Loading existing data...</span>
            </div>
          )}

          {/* Variable Values */}
          {selectedLocation.city && !fetchingData && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">
                Variable Values for {selectedLocation.city}, {selectedLocation.district}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {variables.map((variable) => (
                  <div key={variable._id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-600">
                    <label className="block text-white font-medium mb-3">
                      {variable.name} ({variable.unit})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={locationVariables[variable._id] || ''}
                      onChange={(e) => handleVariableValueChange(variable._id, e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${variable.name.toLowerCase()}`}
                    />
                    <p className="text-gray-400 text-sm mt-2">{variable.description}</p>
                  </div>
                ))}
                
                {/* Electricity Rate */}
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-600">
                  <label className="block text-white font-medium mb-3">
                    <DollarSign className="w-5 h-5 inline mr-2" />
                    Electricity Rate (per kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter electricity rate"
                  />
                  <p className="text-gray-400 text-sm mt-2">Rate per unit of electricity in local currency</p>
                </div>
              </div>

              {/* Mathematical Model Display */}
              <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 mb-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">Mathematical Model</h3>
                  <p className="text-lg text-gray-300 font-mono">
                    {modelCoefficients.coefficients.length > 0 
                      ? `PVOUT = β₀${modelCoefficients.coefficients.map((coeff, index) => ` + β${index + 1}(${coeff.variableName})`).join('')} `
                      : 'PVOUT = β₀'
                    }
                  </p>
                </div>

                {/* Current Calculation for Selected Location */}
                {selectedLocation.city && hasValidVariableValues() && (
                  <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-4 text-white">
                      Current Calculation for {selectedLocation.city}, {selectedLocation.district}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {variables.map((variable, index) => {
                        const value = locationVariables[variable._id] || 0;
                        const coefficient = getCoefficientForVariable(variable._id);
                        const coeffIndex = modelCoefficients.coefficients.findIndex(c => c.variableId === variable._id) + 1;
                        
                        return (
                          <div key={variable._id} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white">β{coeffIndex}: {variable.name}</span>
                              <span className="text-sm text-gray-400">{variable.unit}</span>
                            </div>
                            <p className="text-sm text-gray-300 mt-1">Value: {value}</p>
                            <p className="text-sm text-blue-400 mt-2">
                              {coefficient} × {value} = {(coefficient * parseFloat(value || 0)).toFixed(3)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Final Calculation */}
                    <div className="bg-black bg-opacity-30 rounded-lg p-4">
                      <div className="font-mono text-white space-y-1">
                        <div className="text-lg">PVOUT Calculation:</div>
                        <div>= {modelCoefficients.beta0} (β₀)</div>
                        {modelCoefficients.coefficients.map((coeff, index) => {
                          const value = locationVariables[coeff.variableId] || 0;
                          return (
                            <div key={coeff.variableId}>
                              + {(coeff.value * parseFloat(value || 0)).toFixed(3)} (β{index + 1} × {coeff.variableName})
                            </div>
                          );
                        })}
                        {/* <div>+ {modelCoefficients.epsilon} (ε)</div> */}
                        <div className="border-t border-gray-600 pt-2 mt-2 text-xl font-bold text-green-400">
                          = {calculatePVOUT().toFixed(3)} kWh/m²/day
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PVOUT Result */}
              {hasValidVariableValues() && (
                <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-6 mb-6">
                  <h4 className="text-xl font-semibold text-white mb-4">Final PVOUT Result</h4>
                  <div className="text-4xl font-bold text-white mb-2">
                    {calculatePVOUT().toFixed(3)} kWh/m²/day
                  </div>
                  <p className="text-white text-opacity-80">
                    Photovoltaic Power Output for {selectedLocation.city}, {selectedLocation.district}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={saveLocationData}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Saving...' : 'Save Location Data'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationData;