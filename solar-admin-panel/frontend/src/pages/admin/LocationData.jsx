import React, { useState, useEffect } from 'react';
import { Save, DollarSign } from 'lucide-react';

const LocationData = () => {
  const [loading, setLoading] = useState(false);
  const [variables, setVariables] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({ province: '', district: '', city: '' });
  const [locationVariables, setLocationVariables] = useState({});
  const [electricityRate, setElectricityRate] = useState(0);
  const [modelCoefficients, setModelCoefficients] = useState({
    beta0: 2.5,
    beta1: 0.8,
    beta2: -0.3,
    beta3: 0.6,
    beta4: 0.4,
    epsilon: 0.1
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
    if (selectedLocation.city) {
      try {
        const response = await fetch(`${API_URL}/locations/${selectedLocation.province}/${selectedLocation.district}/${selectedLocation.city}`);
        if (response.ok) {
          const data = await response.json();
          const variableValues = {};
          data.variables.forEach(v => {
            variableValues[v.variableId._id] = v.value;
          });
          setLocationVariables(variableValues);
          setElectricityRate(data.electricityRate || 0);
        } else {
          setLocationVariables({});
          setElectricityRate(0);
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    }
  };

  useEffect(() => {
    fetchVariables();
    fetchModelCoefficients();
  }, []);

  useEffect(() => {
    fetchLocationData();
  }, [selectedLocation]);

  const handleVariableValueChange = (variableId, value) => {
    setLocationVariables(prev => ({
      ...prev,
      [variableId]: parseFloat(value) || 0
    }));
  };

  const saveLocationData = async () => {
    if (!selectedLocation.city) {
      alert('Please select a location');
      return;
    }

    try {
      setLoading(true);
      const variablesArray = Object.entries(locationVariables).map(([variableId, value]) => ({
        variableId,
        value: parseFloat(value) || 0
      }));

      const response = await fetch(`${API_URL}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          province: selectedLocation.province,
          district: selectedLocation.district,
          city: selectedLocation.city,
          variables: variablesArray,
          electricityRate: parseFloat(electricityRate) || 0
        })
      });

      if (response.ok) {
        alert('Location data saved successfully!');
      }
    } catch (error) {
      console.error('Error saving location data:', error);
      alert('Error saving location data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePVOUT = () => {
    const { beta0, beta1, beta2, beta3, beta4, epsilon } = modelCoefficients;
    const variableValues = Object.values(locationVariables);
    
    let result = beta0 + epsilon;
    if (variableValues[0]) result += beta1 * variableValues[0];
    if (variableValues[1]) result += beta2 * variableValues[1];
    if (variableValues[2]) result += beta3 * variableValues[2];
    if (variableValues[3]) result += beta4 * variableValues[3];
    
    return result;
  };

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

        {/* Variable Values */}
        {selectedLocation.city && (
          <div>
            <h3 className="text-xl font-semibold mb-6">
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

            {/* PVOUT Calculation */}
            {Object.keys(locationVariables).length > 0 && (
              <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-semibold text-white mb-4">Calculated PVOUT</h4>
                <div className="text-3xl font-bold text-white mb-2">
                  {calculatePVOUT().toFixed(3)} kWh/m²/day
                </div>
                <p className="text-white text-opacity-80">
                  Based on current model coefficients and location variables
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={saveLocationData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : 'Save Location Data'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationData;