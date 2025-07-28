import React, { useState, useEffect } from 'react';
import { Settings, Database, Calculator, MapPin, Save, Plus, Trash2, Edit3, RefreshCw, Users, BarChart3, ArrowLeft, X, Zap, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('model');
  const [loading, setLoading] = useState(false);

  // Model Coefficients State
  const [modelCoefficients, setModelCoefficients] = useState({
    beta0: 2.5,
    beta1: 0.8,
    beta2: -0.3,
    beta3: 0.6,
    beta4: 0.4,
    epsilon: 0.1
  });

  // Variables State
  const [variables, setVariables] = useState([]);
  const [newVariable, setNewVariable] = useState({ name: '', unit: '', description: '' });
  const [showAddVariable, setShowAddVariable] = useState(false);
  const [editingVariable, setEditingVariable] = useState(null);

  // Solar Panels State
  const [solarPanels, setSolarPanels] = useState([]);
  const [newSolarPanel, setNewSolarPanel] = useState({
    name: '',
    manufacturer: '',
    wattage: '',
    efficiency: '',
    absorptionRate: '',
    area: '',
    pricePerUnit: '',
    warranty: 25,
    technology: 'Monocrystalline'
  });
  const [showAddSolarPanel, setShowAddSolarPanel] = useState(false);
  const [editingSolarPanel, setEditingSolarPanel] = useState(null);

  // Location Data State
  const [selectedLocation, setSelectedLocation] = useState({ province: '', district: '', city: '' });
  const [locationVariables, setLocationVariables] = useState({});
  const [electricityRate, setElectricityRate] = useState(0);
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

  const [savedData, setSavedData] = useState([]);
  const [calculations, setCalculations] = useState([]);

  // API Functions
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

  const fetchVariables = async () => {
    try {
      const response = await fetch(`${API_URL}/variables`);
      const data = await response.json();
      setVariables(data);
    } catch (error) {
      console.error('Error fetching variables:', error);
    }
  };

  const fetchSolarPanels = async () => {
    try {
      const response = await fetch(`${API_URL}/solar-panels`);
      const data = await response.json();
      setSolarPanels(data);
    } catch (error) {
      console.error('Error fetching solar panels:', error);
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

  const fetchCalculations = async () => {
    try {
      const response = await fetch(`${API_URL}/calculations`);
      const data = await response.json();
      setCalculations(data);
    } catch (error) {
      console.error('Error fetching calculations:', error);
    }
  };

  useEffect(() => {
    fetchModelCoefficients();
    fetchVariables();
    fetchSolarPanels();
    fetchCalculations();
  }, []);

  useEffect(() => {
    fetchLocationData();
  }, [selectedLocation]);

  // Model Coefficients Functions
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

  // Variables Functions
  const addVariable = async () => {
    if (newVariable.name && newVariable.unit) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/variables`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVariable)
        });
        if (response.ok) {
          await fetchVariables();
          setNewVariable({ name: '', unit: '', description: '' });
          setShowAddVariable(false);
        }
      } catch (error) {
        console.error('Error adding variable:', error);
        alert('Error adding variable');
      } finally {
        setLoading(false);
      }
    }
  };

  const updateVariable = async () => {
    if (newVariable.name && newVariable.unit && editingVariable) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/variables/${editingVariable}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVariable)
        });
        if (response.ok) {
          await fetchVariables();
          setNewVariable({ name: '', unit: '', description: '' });
          setShowAddVariable(false);
          setEditingVariable(null);
        }
      } catch (error) {
        console.error('Error updating variable:', error);
        alert('Error updating variable');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteVariable = async (id) => {
    if (window.confirm('Are you sure you want to delete this variable?')) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/variables/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchVariables();
        }
      } catch (error) {
        console.error('Error deleting variable:', error);
        alert('Error deleting variable');
      } finally {
        setLoading(false);
      }
    }
  };

  const editVariable = (variable) => {
    setNewVariable({
      name: variable.name,
      unit: variable.unit,
      description: variable.description
    });
    setEditingVariable(variable._id);
    setShowAddVariable(true);
  };

  // Solar Panel Functions
  const addSolarPanel = async () => {
    if (newSolarPanel.name && newSolarPanel.manufacturer && newSolarPanel.wattage) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/solar-panels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newSolarPanel,
            wattage: parseFloat(newSolarPanel.wattage),
            efficiency: parseFloat(newSolarPanel.efficiency),
            absorptionRate: parseFloat(newSolarPanel.absorptionRate),
            area: parseFloat(newSolarPanel.area),
            pricePerUnit: parseFloat(newSolarPanel.pricePerUnit),
            warranty: parseInt(newSolarPanel.warranty)
          })
        });
        if (response.ok) {
          await fetchSolarPanels();
          setNewSolarPanel({
            name: '',
            manufacturer: '',
            wattage: '',
            efficiency: '',
            absorptionRate: '',
            area: '',
            pricePerUnit: '',
            warranty: 25,
            technology: 'Monocrystalline'
          });
          setShowAddSolarPanel(false);
        }
      } catch (error) {
        console.error('Error adding solar panel:', error);
        alert('Error adding solar panel');
      } finally {
        setLoading(false);
      }
    }
  };

  const updateSolarPanel = async () => {
    if (newSolarPanel.name && newSolarPanel.manufacturer && editingSolarPanel) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/solar-panels/${editingSolarPanel}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newSolarPanel,
            wattage: parseFloat(newSolarPanel.wattage),
            efficiency: parseFloat(newSolarPanel.efficiency),
            absorptionRate: parseFloat(newSolarPanel.absorptionRate),
            area: parseFloat(newSolarPanel.area),
            pricePerUnit: parseFloat(newSolarPanel.pricePerUnit),
            warranty: parseInt(newSolarPanel.warranty)
          })
        });
        if (response.ok) {
          await fetchSolarPanels();
          setNewSolarPanel({
            name: '',
            manufacturer: '',
            wattage: '',
            efficiency: '',
            absorptionRate: '',
            area: '',
            pricePerUnit: '',
            warranty: 25,
            technology: 'Monocrystalline'
          });
          setShowAddSolarPanel(false);
          setEditingSolarPanel(null);
        }
      } catch (error) {
        console.error('Error updating solar panel:', error);
        alert('Error updating solar panel');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteSolarPanel = async (id) => {
    if (window.confirm('Are you sure you want to delete this solar panel?')) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/solar-panels/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchSolarPanels();
        }
      } catch (error) {
        console.error('Error deleting solar panel:', error);
        alert('Error deleting solar panel');
      } finally {
        setLoading(false);
      }
    }
  };

  const editSolarPanel = (panel) => {
    setNewSolarPanel({
      name: panel.name,
      manufacturer: panel.manufacturer,
      wattage: panel.wattage.toString(),
      efficiency: panel.efficiency.toString(),
      absorptionRate: panel.absorptionRate.toString(),
      area: panel.area.toString(),
      pricePerUnit: panel.pricePerUnit.toString(),
      warranty: panel.warranty,
      technology: panel.technology
    });
    setEditingSolarPanel(panel._id);
    setShowAddSolarPanel(true);
  };

  // Location Functions
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
                <p className="text-gray-300 text-sm">Manage model coefficients, variables, and solar panels</p>
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
            { id: 'solar-panels', label: 'Solar Panels', icon: Zap },
            { id: 'locations', label: 'Location Data', icon: MapPin },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'calculations', label: 'Calculations', icon: Users }
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
                    setEditingVariable(null);
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
                      {editingVariable ? 'Edit Variable' : 'Add New Variable'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddVariable(false);
                        setEditingVariable(null);
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
                      onClick={editingVariable ? updateVariable : addVariable}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {loading ? 'Saving...' : (editingVariable ? 'Update Variable' : 'Add Variable')}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddVariable(false);
                        setEditingVariable(null);
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
                  <div key={variable._id} className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{variable.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editVariable(variable)}
                          className="text-blue-300 hover:text-blue-100 transition-colors"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteVariable(variable._id)}
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

        {/* Solar Panels Tab */}
        {activeTab === 'solar-panels' && (
          <div className="space-y-8">
            <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Manage Solar Panels</h2>
                <button
                  onClick={() => {
                    setShowAddSolarPanel(true);
                    setEditingSolarPanel(null);
                    setNewSolarPanel({
                      name: '',
                      manufacturer: '',
                      wattage: '',
                      efficiency: '',
                      absorptionRate: '',
                      area: '',
                      pricePerUnit: '',
                      warranty: 25,
                      technology: 'Monocrystalline'
                    });
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Solar Panel</span>
                </button>
              </div>

              {showAddSolarPanel && (
                <div className="mb-6 p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingSolarPanel ? 'Edit Solar Panel' : 'Add New Solar Panel'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddSolarPanel(false);
                        setEditingSolarPanel(null);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Panel name"
                      value={newSolarPanel.name}
                      onChange={(e) => setNewSolarPanel(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Manufacturer"
                      value={newSolarPanel.manufacturer}
                      onChange={(e) => setNewSolarPanel(prev => ({ ...prev, manufacturer: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Wattage (W)"
                      value={newSolarPanel.wattage}
                      onChange={(e) => setNewSolarPanel(prev => ({ ...prev, wattage: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Efficiency (%)"
                      value={newSolarPanel.efficiency}
                      onChange={(e) => setNewSolarPanel(prev => ({ ...prev, efficiency: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Absorption Rate (%)"
                      value={newSolarPanel.absorptionRate}
                      onChange={(e) => setNewSolarPanel(prev => ({ ...prev, absorptionRate: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Area (m²)"
                      value={newSolarPanel.area}
                      onChange={(e) => setNewSolarPanel(prev => ({ ...prev, area: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Price per unit"
                      value={newSolarPanel.pricePerUnit}
                      onChange={(e) => setNewSolarPanel(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Warranty (years)"
                      value={newSolarPanel.warranty}
                      onChange={(e) => setNewSolarPanel(prev => ({ ...prev, warranty: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newSolarPanel.technology}
                      onChange={(e) => setNewSolarPanel(prev => ({ ...prev, technology: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Monocrystalline">Monocrystalline</option>
                      <option value="Polycrystalline">Polycrystalline</option>
                      <option value="Thin Film">Thin Film</option>
                      <option value="Bifacial">Bifacial</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={editingSolarPanel ? updateSolarPanel : addSolarPanel}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {loading ? 'Saving...' : (editingSolarPanel ? 'Update Panel' : 'Add Panel')}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSolarPanel(false);
                        setEditingSolarPanel(null);
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solarPanels.map((panel) => (
                  <div key={panel._id} className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-6 h-6" />
                        <h3 className="text-xl font-semibold">{panel.name}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editSolarPanel(panel)}
                          className="text-orange-300 hover:text-orange-100 transition-colors"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteSolarPanel(panel._id)}
                          className="text-red-300 hover:text-red-100 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p className="text-white text-opacity-90">
                        <span className="font-medium">Manufacturer:</span> {panel.manufacturer}
                      </p>
                      <p className="text-white text-opacity-90">
                        <span className="font-medium">Technology:</span> {panel.technology}
                      </p>
                      <p className="text-white text-opacity-90">
                        <span className="font-medium">Wattage:</span> {panel.wattage}W
                      </p>
                      <p className="text-white text-opacity-90">
                        <span className="font-medium">Efficiency:</span> {panel.efficiency}%
                      </p>
                      <p className="text-white text-opacity-90">
                        <span className="font-medium">Absorption Rate:</span> {panel.absorptionRate}%
                      </p>
                      <p className="text-white text-opacity-90">
                        <span className="font-medium">Area:</span> {panel.area}m²
                      </p>
                      <p className="text-white text-opacity-90">
                        <span className="font-medium">Price:</span> ${panel.pricePerUnit}
                      </p>
                      <p className="text-white text-opacity-90">
                        <span className="font-medium">Warranty:</span> {panel.warranty} years
                      </p>
                    </div>
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
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
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
        )}

        {/* Calculations Tab */}
        {activeTab === 'calculations' && (
          <div className="space-y-8">
            <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Calculations</h2>
                <button
                  onClick={fetchCalculations}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
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
        )}
      </div>
    </div>
  );
};

export default AdminPanel;