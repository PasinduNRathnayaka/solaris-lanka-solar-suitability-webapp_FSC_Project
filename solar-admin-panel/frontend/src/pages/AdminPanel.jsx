import React, { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import Navigation from '../components/Navigation';
import ModelCoefficients from '../components/ModelCoefficients';
import Variables from '../components/Variables';
import LocationData from '../components/LocationData';
import Analytics from '../components/Analytics';
import { coefficientsAPI, variablesAPI, locationsAPI, analyticsAPI } from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('model');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  // Location Data State
  const [selectedLocation, setSelectedLocation] = useState({ 
    province: '', 
    district: '', 
    city: '' 
  });
  const [locationVariables, setLocationVariables] = useState({});
  const [locations, setLocations] = useState([]);

  // Analytics State
  const [analytics, setAnalytics] = useState({});

  // Location data structure
  const locationData = {
    "Central Province": {
      "Kandy": ["Kandy", "Gampola", "Nawalapitiya", "Peradeniya", "Akurana"],
      "Matale": ["Matale", "Dambulla", "Sigiriya", "Galewela", "Ukuwela"],
      "Nuwara Eliya": ["Nuwara Eliya", "Hatton", "Talawakelle", "Haputale", "Bandarawela"],
    },
    "Western Province": {
      "Colombo": ["Colombo", "Dehiwala-Mount Lavinia", "Mount Lavinia", "Sri Jayewardenepura Kotte", "Moratuwa"],
      "Gampaha": ["Gampaha", "Negombo", "Kelaniya", "Kadawatha", "Ja-Ela"],
      "Kalutara": ["Kalutara", "Panadura", "Horana", "Beruwala", "Aluthgama"],
    },
    "Southern Province": {
      "Galle": ["Galle", "Hikkaduwa", "Ambalangoda", "Bentota", "Elpitiya"],
      "Hambantota": ["Hambantota", "Tissamaharama", "Tangalle", "Ambalantota", "Beliatta"],
      "Matara": ["Matara", "Weligama", "Mirissa", "Akuressa", "Dickwella"],
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load model coefficients
      const coeffResponse = await coefficientsAPI.get();
      setModelCoefficients(coeffResponse.data);

      // Load variables
      const varsResponse = await variablesAPI.getAll();
      setVariables(varsResponse.data);

      // Initialize default variables if none exist
      if (varsResponse.data.length === 0) {
        await initializeDefaultVariables();
      }

      // Load analytics
      const analyticsResponse = await analyticsAPI.get();
      setAnalytics(analyticsResponse.data);

    } catch (error) {
      console.error('Error loading initial data:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultVariables = async () => {
    const defaultVariables = [
      { name: 'Solar Irradiance', unit: 'kWh/m²/day', description: 'Average daily solar irradiance' },
      { name: 'Temperature', unit: '°C', description: 'Average ambient temperature' },
      { name: 'Humidity', unit: '%', description: 'Relative humidity percentage' },
      { name: 'Cloud Cover', unit: '%', description: 'Average cloud cover percentage' }
    ];

    try {
      for (const variable of defaultVariables) {
        await variablesAPI.create(variable);
      }
      // Reload variables
      const varsResponse = await variablesAPI.getAll();
      setVariables(varsResponse.data);
    } catch (error) {
      console.error('Error initializing default variables:', error);
    }
  };

  const handleCoefficientChange = (key, value) => {
    setModelCoefficients(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleSaveCoefficients = async () => {
    try {
      setLoading(true);
      await coefficientsAPI.update(modelCoefficients);
      setMessage('Model coefficients saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving coefficients:', error);
      setMessage('Error saving coefficients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariable = async (newVariable) => {
    try {
      setLoading(true);
      const response = await variablesAPI.create(newVariable);
      setVariables(prev => [...prev, response.data]);
      setMessage('Variable added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding variable:', error);
      setMessage('Error adding variable');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariable = async (variableId) => {
    if (!window.confirm('Are you sure you want to delete this variable?')) {
      return;
    }

    try {
      setLoading(true);
      await variablesAPI.delete(variableId);
      setVariables(prev => prev.filter(v => v._id !== variableId));
      setMessage('Variable deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting variable:', error);
      setMessage('Error deleting variable');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = async (location) => {
    setSelectedLocation(location);
    
    if (location.city) {
      try {
        const response = await locationsAPI.getByLocation(
          location.province, 
          location.district, 
          location.city
        );
        
        if (response.data) {
          // Convert backend format to frontend format
          const variableValues = {};
          response.data.variables.forEach(v => {
            variableValues[v.variableId._id] = v.value;
          });
          setLocationVariables(variableValues);
        } else {
          // Generate random values for new location
          const randomValues = {};
          variables.forEach((variable, index) => {
            // Generate realistic random values based on variable type
            if (variable.name.toLowerCase().includes('solar')) {
              randomValues[variable._id] = Math.random() * 2 + 4; // 4-6 kWh/m²/day
            } else if (variable.name.toLowerCase().includes('temperature')) {
              randomValues[variable._id] = Math.random() * 10 + 25; // 25-35°C
            } else if (variable.name.toLowerCase().includes('humidity')) {
              randomValues[variable._id] = Math.random() * 20 + 60; // 60-80%
            } else if (variable.name.toLowerCase().includes('cloud')) {
              randomValues[variable._id] = Math.random() * 30 + 20; // 20-50%
            } else {
              randomValues[variable._id] = Math.random() * 100;
            }
          });
          setLocationVariables(randomValues);
        }
      } catch (error) {
        console.error('Error loading location data:', error);
        // Generate random values if location not found
        const randomValues = {};
        variables.forEach((variable, index) => {
          if (variable.name.toLowerCase().includes('solar')) {
            randomValues[variable._id] = Math.random() * 2 + 4;
          } else if (variable.name.toLowerCase().includes('temperature')) {
            randomValues[variable._id] = Math.random() * 10 + 25;
          } else if (variable.name.toLowerCase().includes('humidity')) {
            randomValues[variable._id] = Math.random() * 20 + 60;
          } else if (variable.name.toLowerCase().includes('cloud')) {
            randomValues[variable._id] = Math.random() * 30 + 20;
          } else {
            randomValues[variable._id] = Math.random() * 100;
          }
        });
        setLocationVariables(randomValues);
      }
    }
  };

  const handleLocationVariableChange = (variableId, value) => {
    setLocationVariables(prev => ({
      ...prev,
      [variableId]: parseFloat(value) || 0
    }));
  };

  const handleSaveLocationData = async () => {
    if (!selectedLocation.city) {
      setMessage('Please select a location first');
      return;
    }

    try {
      setLoading(true);
      
      // Format data for backend
      const locationData = {
        province: selectedLocation.province,
        district: selectedLocation.district,
        city: selectedLocation.city,
        variables: Object.entries(locationVariables).map(([variableId, value]) => ({
          variableId,
          value: parseFloat(value) || 0
        }))
      };

      await locationsAPI.createOrUpdate(locationData);
      await analyticsAPI.incrementCalculation(); // Increment calculation count
      setMessage('Location data saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving location data:', error);
      setMessage('Error saving location data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePVOUT = () => {
    if (!variables.length || !Object.keys(locationVariables).length) {
      return 0;
    }

    const { beta0, beta1, beta2, beta3, beta4, epsilon } = modelCoefficients;
    
    // Map variables by name to get correct coefficients
    let x1 = 0, x2 = 0, x3 = 0, x4 = 0;
    
    variables.forEach(variable => {
      const value = locationVariables[variable._id] || 0;
      if (variable.name.toLowerCase().includes('solar')) {
        x1 = value;
      } else if (variable.name.toLowerCase().includes('temperature')) {
        x2 = value;
      } else if (variable.name.toLowerCase().includes('humidity')) {
        x3 = value;
      } else if (variable.name.toLowerCase().includes('cloud')) {
        x4 = value;
      }
    });

    return beta0 + (beta1 * x1) + (beta2 * x2) + (beta3 * x3) + (beta4 * x4) + epsilon;
  };

  const saveAllData = async () => {
    try {
      setLoading(true);
      await handleSaveCoefficients();
      if (selectedLocation.city && Object.keys(locationVariables).length) {
        await handleSaveLocationData();
      }
      setMessage('All data saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setMessage('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !variables.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

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
            {message && (
              <div className={`px-4 py-2 rounded-lg text-sm ${
                message.includes('Error') ? 'bg-red-600' : 'bg-green-600'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        {activeTab === 'model' && (
          <ModelCoefficients
            modelCoefficients={modelCoefficients}
            onCoefficientChange={handleCoefficientChange}
            onSave={handleSaveCoefficients}
            loading={loading}
          />
        )}

        {activeTab === 'variables' && (
          <Variables
            variables={variables}
            onAddVariable={handleAddVariable}
            onDeleteVariable={handleDeleteVariable}
            loading={loading}
          />
        )}

        {activeTab === 'locations' && (
          <LocationData
            selectedLocation={selectedLocation}
            locationVariables={locationVariables}
            variables={variables}
            locationData={locationData}
            onLocationChange={handleLocationChange}
            onVariableChange={handleLocationVariableChange}
            onSave={handleSaveLocationData}
            calculatePVOUT={calculatePVOUT}
            loading={loading}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            analytics={analytics}
            variablesCount={variables.length}
          />
        )}

        {/* Save Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={saveAllData}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-4 rounded-full shadow-lg flex items-center space-x-2 transition-all transform hover:scale-105 disabled:transform-none"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save All'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;