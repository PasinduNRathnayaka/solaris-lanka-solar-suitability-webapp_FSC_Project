import React, { useState, useEffect } from 'react';
import { Settings, Save, Sparkles, Zap, TrendingUp, Activity } from 'lucide-react';
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalCalculations: 0,
    avgResponseTime: 145,
    successRate: 98.7,
    lastUpdated: new Date()
  });

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

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Auto-save feature
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedLocation.city && Object.keys(locationVariables).length) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [selectedLocation, locationVariables]);

  const autoSave = async () => {
    try {
      await handleSaveLocationData();
      showMessage('Auto-saved successfully!', 'success');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

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

      // Update performance metrics
      setPerformanceMetrics(prev => ({
        ...prev,
        totalCalculations: analyticsResponse.data.totalCalculations || 0,
        lastUpdated: new Date()
      }));

    } catch (error) {
      console.error('Error loading initial data:', error);
      showMessage('Error loading data', 'error');
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

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 4000);
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
      showMessage('Model coefficients saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving coefficients:', error);
      showMessage('Error saving coefficients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariable = async (newVariable) => {
    try {
      setLoading(true);
      const response = await variablesAPI.create(newVariable);
      setVariables(prev => [...prev, response.data]);
      showMessage('Variable added successfully!', 'success');
    } catch (error) {
      console.error('Error adding variable:', error);
      showMessage('Error adding variable', 'error');
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
      showMessage('Variable deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting variable:', error);
      showMessage('Error deleting variable', 'error');
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
      showMessage('Please select a location first', 'error');
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
      
      // Update performance metrics
      setPerformanceMetrics(prev => ({
        ...prev,
        totalCalculations: prev.totalCalculations + 1,
        lastUpdated: new Date()
      }));

      showMessage('Location data saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving location data:', error);
      showMessage('Error saving location data', 'error');
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
      showMessage('All data saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving data:', error);
      showMessage('Error saving data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !variables.length) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white border-opacity-30 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          <div className="text-white text-2xl font-bold mt-6 animate-pulse">Loading Solar Admin Panel...</div>
          <div className="text-white text-opacity-80 mt-2">Initializing system components</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #f5576c 60%, #4facfe 80%, #00f2fe 100%)',
      minHeight: '100vh'
    }}>
      {/* Advanced Animated Background */}
      <div className="fixed inset-0 z-0" style={{ opacity: 0.4 }}>
        {/* Primary floating elements */}
        <div 
          className="absolute top-10 left-10 w-72 h-72 rounded-full filter blur-3xl animate-float"
          style={{
            background: 'radial-gradient(circle, #ff6b6b, #ee5a24)',
            animation: 'float 6s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute top-20 right-20 w-80 h-80 rounded-full filter blur-3xl animate-float-delayed"
          style={{
            background: 'radial-gradient(circle, #4ecdc4, #45b7d1)',
            animation: 'float 8s ease-in-out infinite 2s'
          }}
        ></div>
        <div 
          className="absolute bottom-20 left-32 w-64 h-64 rounded-full filter blur-3xl animate-float-slow"
          style={{
            background: 'radial-gradient(circle, #a8e6cf, #88d8c0)',
            animation: 'float 10s ease-in-out infinite 4s'
          }}
        ></div>
        <div 
          className="absolute bottom-32 right-16 w-96 h-96 rounded-full filter blur-3xl animate-float-reverse"
          style={{
            background: 'radial-gradient(circle, #ffeaa7, #fdcb6e)',
            animation: 'float-reverse 7s ease-in-out infinite 1s'
          }}
        ></div>
        
        {/* Secondary sparkle elements */}
        <div 
          className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full filter blur-2xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, #fd79a8, #fdcb6e)',
            animation: 'sparkle 4s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute top-2/3 right-1/3 w-40 h-40 rounded-full filter blur-2xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, #6c5ce7, #a29bfe)',
            animation: 'sparkle 5s ease-in-out infinite 2s'
          }}
        ></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative z-10 border-b border-white border-opacity-20 shadow-2xl backdrop-blur-xl" style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95))',
      }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="p-4 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
                }}
              >
                <Settings className="w-10 h-10 text-white animate-spin-slow" />
              </div>
              <div>
                <h1 
                  className="text-4xl font-black text-transparent bg-clip-text mb-1"
                  style={{
                    background: 'linear-gradient(45deg, #ffeaa7, #fab1a0, #fd79a8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Solar Energy Admin Panel
                </h1>
                <p className="text-white text-opacity-90 text-lg font-medium flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Advanced model coefficients and location data management</span>
                </p>
              </div>
            </div>
            
            {/* Status indicators */}
            <div className="flex items-center space-x-4">
              {/* Online status */}
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              
              {/* Performance indicator */}
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">{performanceMetrics.successRate}% Uptime</span>
              </div>
              
              {/* Message display */}
              {message && (
                <div 
                  className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl animate-bounce backdrop-blur-sm ${
                    message.type === 'error' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                      : 'bg-gradient-to-r from-green-400 to-teal-500 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {message.type === 'success' ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    <span>{message.text || message}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content with enhanced animations */}
        <div className="transform transition-all duration-500 ease-in-out">
          {activeTab === 'model' && (
            <div className="animate-fade-in">
              <ModelCoefficients
                modelCoefficients={modelCoefficients}
                onCoefficientChange={handleCoefficientChange}
                onSave={handleSaveCoefficients}
                loading={loading}
              />
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="animate-slide-in-right">
              <Variables
                variables={variables}
                onAddVariable={handleAddVariable}
                onDeleteVariable={handleDeleteVariable}
                loading={loading}
              />
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="animate-slide-in-left">
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
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-fade-in-up">
              <Analytics
                analytics={analytics}
                variablesCount={variables.length}
                performanceMetrics={performanceMetrics}
              />
            </div>
          )}
        </div>

        {/* Enhanced Quick Stats Panel */}
        <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-20 space-y-4">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 backdrop-blur-xl bg-opacity-90 shadow-2xl">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">{performanceMetrics.totalCalculations}</div>
              <div className="text-xs text-white text-opacity-80">Total Calculations</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-4 backdrop-blur-xl bg-opacity-90 shadow-2xl">
            <div className="text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold text-white">{variables.length}</div>
              <div className="text-xs text-white text-opacity-80">Active Variables</div>
            </div>
          </div>
        </div>

        {/* Ultra Enhanced Save Button */}
        <div className="fixed bottom-8 right-8 z-30">
          <button
            onClick={saveAllData}
            disabled={loading}
            className="group relative text-white px-10 py-6 rounded-full shadow-2xl flex items-center space-x-4 transition-all duration-500 transform hover:scale-110 disabled:transform-none overflow-hidden"
            style={{
              background: loading 
                ? 'linear-gradient(45deg, #6b7280, #9ca3af)' 
                : 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)',
              backgroundSize: '300% 300%',
              animation: loading ? 'none' : 'gradient-shift 3s ease infinite'
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-600 opacity-75 group-hover:opacity-100 blur-xl transform scale-110 transition-all duration-300"></div>
            
            {/* Button content */}
            <div className="relative flex items-center space-x-4">
              <Save className={`w-8 h-8 ${loading ? 'animate-spin' : 'group-hover:animate-bounce'}`} />
              <div className="text-left">
                <div className="font-black text-xl">{loading ? 'Saving...' : 'Save All Data'}</div>
                <div className="text-sm opacity-90">Click to save changes</div>
              </div>
            </div>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-30 transition-opacity duration-150"></div>
          </button>
        </div>
      </div>

      {/* Advanced Custom CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
            33% { transform: translate(30px, -30px) rotate(120deg) scale(1.1); }
            66% { transform: translate(-20px, 20px) rotate(240deg) scale(0.9); }
          }
          
          @keyframes float-reverse {
            0%, 100% { transform: translate(0px, 0px) rotate(360deg) scale(1); }
            50% { transform: translate(-25px, -25px) rotate(180deg) scale(1.2); }
          }
          
          @keyframes sparkle {
            0%, 100% { opacity: 0.4; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-in-right {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slide-in-left {
            from { opacity: 0; transform: translateX(-100px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
          
          .animate-slide-in-right {
            animation: slide-in-right 0.6s ease-out;
          }
          
          .animate-slide-in-left {
            animation: slide-in-left 0.6s ease-out;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
          
          /* Enhanced scrollbar */
          ::-webkit-scrollbar {
            width: 12px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 10px;
            border: 2px solid rgba(255, 255, 255, 0.1);
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #5a67d8, #6b46c1);
          }
        `
      }} />
    </div>
  );
};

export default AdminPanel;