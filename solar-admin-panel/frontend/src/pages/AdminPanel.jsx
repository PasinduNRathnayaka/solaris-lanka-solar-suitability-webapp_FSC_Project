import React, { useState, useEffect } from 'react';
import { Settings, Database, Calculator, MapPin, Save, Plus, Trash2, Edit3, RefreshCw, Users, BarChart3, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('model');

  // Model Coefficients State
  const [modelCoefficients, setModelCoefficients] = useState({
    beta0: 2.5,    // Intercept
    beta1: 0.8,    // Solar Irradiance coefficient
    beta2: -0.3,   // Temperature coefficient
    beta3: 0.6,    // Humidity coefficient
    beta4: 0.4,    // Cloud Cover coefficient
    epsilon: 0.1   // Error term
  });

  // Variables State
  const [variables, setVariables] = useState([
    { id: 1, name: 'Solar Irradiance', unit: 'kWh/m²/day', description: 'Average daily solar irradiance' },
    { id: 2, name: 'Temperature', unit: '°C', description: 'Average ambient temperature' },
    { id: 3, name: 'Humidity', unit: '%', description: 'Relative humidity percentage' },
    { id: 4, name: 'Cloud Cover', unit: '%', description: 'Average cloud cover percentage' }
  ]);

  // Location Data State
  const [selectedLocation, setSelectedLocation] = useState({ province: '', district: '', city: '' });
  const [locationVariables, setLocationVariables] = useState({});
  const [editingLocation, setEditingLocation] = useState(null);

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

  const [newVariable, setNewVariable] = useState({ name: '', unit: '', description: '' });
  const [showAddVariable, setShowAddVariable] = useState(false);
  const [savedData, setSavedData] = useState([]);

  useEffect(() => {
    // Load location-specific data when location changes
    if (selectedLocation.city) {
      const locationKey = `${selectedLocation.province}-${selectedLocation.district}-${selectedLocation.city}`;
      // Mock data - in real app, fetch from API
      setLocationVariables({
        1: Math.random() * 2 + 4, // Solar Irradiance: 4-6
        2: Math.random() * 10 + 25, // Temperature: 25-35°C
        3: Math.random() * 20 + 60, // Humidity: 60-80%
        4: Math.random() * 30 + 20  // Cloud Cover: 20-50%
      });
    }
  }, [selectedLocation]);

  const handleCoefficientChange = (key, value) => {
    setModelCoefficients(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleVariableValueChange = (variableId, value) => {
    setLocationVariables(prev => ({
      ...prev,
      [variableId]: parseFloat(value) || 0
    }));
  };

  const addVariable = () => {
    if (newVariable.name && newVariable.unit) {
      const newId = Math.max(...variables.map(v => v.id)) + 1;
      setVariables(prev => [...prev, { ...newVariable, id: newId }]);
      setNewVariable({ name: '', unit: '', description: '' });
      setShowAddVariable(false);
    }
  };

  const deleteVariable = (id) => {
    if (window.confirm('Are you sure you want to delete this variable?')) {
      setVariables(prev => prev.filter(v => v.id !== id));
      setLocationVariables(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const editVariable = (id) => {
    const variable = variables.find(v => v.id === id);
    if (variable) {
      setNewVariable({ ...variable });
      setEditingLocation(id);
      setShowAddVariable(true);
    }
  };

  const updateVariable = () => {
    if (newVariable.name && newVariable.unit && editingLocation) {
      setVariables(prev => prev.map(v => 
        v.id === editingLocation ? { ...newVariable, id: editingLocation } : v
      ));
      setNewVariable({ name: '', unit: '', description: '' });
      setShowAddVariable(false);
      setEditingLocation(null);
    }
  };

  const calculatePVOUT = () => {
    const { beta0, beta1, beta2, beta3, beta4, epsilon } = modelCoefficients;
    const x1 = locationVariables[1] || 0; // Solar Irradiance
    const x2 = locationVariables[2] || 0; // Temperature
    const x3 = locationVariables[3] || 0; // Humidity
    const x4 = locationVariables[4] || 0; // Cloud Cover

    return beta0 + (beta1 * x1) + (beta2 * x2) + (beta3 * x3) + (beta4 * x4) + epsilon;
  };

  const saveData = async () => {
    const newData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      modelCoefficients,
      variables,
      locationVariables,
      selectedLocation,
      calculatedPVOUT: selectedLocation.city ? calculatePVOUT() : null
    };

    setSavedData(prev => [newData, ...prev]);
    
    // In real app, save to backend API
    console.log('Saving data:', newData);
    alert('Data saved successfully!');
  };

  const deleteRecord = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setSavedData(prev => prev.filter(record => record.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Solar Energy Admin Panel</h1>
                <p className="text-gray-300 text-sm">Manage model coefficients and location data</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Calculator</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 bg-opacity-50 rounded-xl p-1 overflow-x-auto">
          {[
            { id: 'model', label: 'Model Coefficients', icon: Calculator },
            { id: 'variables', label: 'Variables', icon: Database },
            { id: 'locations', label: 'Location Data', icon: MapPin },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'records', label: 'Saved Records', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Model Coefficients Tab */}
        {activeTab === 'model' && (
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
                  <label className="block text-white font-medium mb-3">β₁ (Solar Irradiance)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={modelCoefficients.beta1}
                    onChange={(e) => handleCoefficientChange('beta1', e.target.value)}
                    className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                </div>

                <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6">
                  <label className="block text-white font-medium mb-3">β₂ (Temperature)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={modelCoefficients.beta2}
                    onChange={(e) => handleCoefficientChange('beta2', e.target.value)}
                    className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                </div>

                <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6">
                  <label className="block text-white font-medium mb-3">β₃ (Humidity)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={modelCoefficients.beta3}
                    onChange={(e) => handleCoefficientChange('beta3', e.target.value)}
                    className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6">
                  <label className="block text-white font-medium mb-3">β₄ (Cloud Cover)</label>
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

              {/* Model Preview */}
              <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold mb-4">Current Model Formula</h3>
                <div className="font-mono text-lg text-green-400 bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  PVOUT = {modelCoefficients.beta0} + ({modelCoefficients.beta1} × Solar Irradiance) + ({modelCoefficients.beta2} × Temperature) + ({modelCoefficients.beta3} × Humidity) + ({modelCoefficients.beta4} × Cloud Cover) + {modelCoefficients.epsilon}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variables Tab */}
        {activeTab === 'variables' && (
          <div className="space-y-8">
            <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Manage Variables</h2>
                <button
                  onClick={() => {
                    setShowAddVariable(true);
                    setEditingLocation(null);
                    setNewVariable({ name: '', unit: '', description: '' });
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Variable</span>
                </button>
              </div>

              {showAddVariable && (
                <div className="mb-6 p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingLocation ? 'Edit Variable' : 'Add New Variable'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddVariable(false);
                        setEditingLocation(null);
                        setNewVariable({ name: '', unit: '', description: '' });
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Variable name"
                      value={newVariable.name}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Unit (e.g., kWh, °C)"
                      value={newVariable.unit}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, unit: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newVariable.description}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={editingLocation ? updateVariable : addVariable}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {editingLocation ? 'Update Variable' : 'Add Variable'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddVariable(false);
                        setEditingLocation(null);
                        setNewVariable({ name: '', unit: '', description: '' });
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {variables.map((variable) => (
                  <div key={variable.id} className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{variable.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editVariable(variable.id)}
                          className="text-blue-300 hover:text-blue-100 transition-colors"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteVariable(variable.id)}
                          className="text-red-300 hover:text-red-100 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-white text-opacity-80 mb-2">Unit: {variable.unit}</p>
                    <p className="text-white text-opacity-70 text-sm">{variable.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location Data Tab */}
        {activeTab === 'locations' && (
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {variables.map((variable) => (
                      <div key={variable.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-600">
                        <label className="block text-white font-medium mb-3">
                          {variable.name} ({variable.unit})
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={locationVariables[variable.id] || ''}
                          onChange={(e) => handleVariableValueChange(variable.id, e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                          placeholder={`Enter ${variable.name.toLowerCase()}`}
                        />
                        <p className="text-gray-400 text-sm mt-2">{variable.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* PVOUT Calculation */}
                  <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-6">
                    <h4 className="text-xl font-semibold text-white mb-4">Calculated PVOUT</h4>
                    <div className="text-3xl font-bold text-white mb-2">
                      {calculatePVOUT().toFixed(3)} kWh/m²/day
                    </div>
                    <p className="text-white text-opacity-80">
                      Based on current model coefficients and location variables
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
              <h2 className="text-2xl font-bold mb-6">System Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8" />
                    <span className="text-2xl font-bold">1,247</span>
                  </div>
                  <h4 className="font-semibold mb-1">Total Calculations</h4>
                  <p className="text-sm opacity-90">This month</p>
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
                    <MapPin className="w-8 h-8" />
                    <span className="text-2xl font-bold">{savedData.length}</span>
                  </div>
                  <h4 className="font-semibold mb-1">Saved Records</h4>
                  <p className="text-sm opacity-90">Total entries</p>
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
                    <p className="text-gray-300 mb-2">Active Locations: <span className="text-teal-400 font-semibold">89</span></p>
                    <p className="text-gray-300">Model Version: <span className="text-orange-400 font-semibold">v2.1.3</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Records Tab */}
        {activeTab === 'records' && (
          <div className="space-y-8">
            <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Saved Records</h2>
                <div className="text-sm text-gray-400">
                  {savedData.length} total records
                </div>
              </div>

              {savedData.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No records found</h3>
                  <p className="text-gray-500">Save some data to see records here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedData.map((record) => (
                    <div key={record.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-600">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {record.selectedLocation.city ? 
                              `${record.selectedLocation.city}, ${record.selectedLocation.district}` : 
                              'Model Configuration'
                            }
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Saved on {new Date(record.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {record.calculatedPVOUT && (
                            <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                              PVOUT: {record.calculatedPVOUT.toFixed(3)}
                            </div>
                          )}
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">Model Coefficients</h4>
                          <div className="space-y-1 text-gray-400">
                            <p>β₀: {record.modelCoefficients.beta0}</p>
                            <p>β₁: {record.modelCoefficients.beta1}</p>
                            <p>β₂: {record.modelCoefficients.beta2}</p>
                            <p>β₃: {record.modelCoefficients.beta3}</p>
                            <p>β₄: {record.modelCoefficients.beta4}</p>
                            <p>ε: {record.modelCoefficients.epsilon}</p>
                          </div>
                        </div>
                        
                        {record.selectedLocation.city && (
                          <div>
                            <h4 className="font-semibold text-gray-300 mb-2">Location Variables</h4>
                            <div className="space-y-1 text-gray-400">
                              {record.variables.map(variable => (
                                <p key={variable.id}>
                                  {variable.name}: {record.locationVariables[variable.id]?.toFixed(2) || 'N/A'} {variable.unit}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={saveData}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-full shadow-lg flex items-center space-x-2 transition-all transform hover:scale-105"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;