import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export const AppContextProvider = ({ children }) => {
  // Global state for the application
  const [modelCoefficients, setModelCoefficients] = useState({
    beta0: 2.5,    // Intercept
    beta1: 0.8,    // Solar Irradiance coefficient
    beta2: -0.3,   // Temperature coefficient
    beta3: 0.6,    // Humidity coefficient
    beta4: 0.4,    // Cloud Cover coefficient
    epsilon: 0.1   // Error term
  });

  const [variables, setVariables] = useState([
    { id: 1, name: 'Solar Irradiance', unit: 'kWh/m²/day', description: 'Average daily solar irradiance' },
    { id: 2, name: 'Temperature', unit: '°C', description: 'Average ambient temperature' },
    { id: 3, name: 'Humidity', unit: '%', description: 'Relative humidity percentage' },
    { id: 4, name: 'Cloud Cover', unit: '%', description: 'Average cloud cover percentage' }
  ]);

  const [savedRecords, setSavedRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedCoefficients = localStorage.getItem('modelCoefficients');
      const storedVariables = localStorage.getItem('variables');
      const storedRecords = localStorage.getItem('savedRecords');

      if (storedCoefficients) {
        setModelCoefficients(JSON.parse(storedCoefficients));
      }
      if (storedVariables) {
        setVariables(JSON.parse(storedVariables));
      }
      if (storedRecords) {
        setSavedRecords(JSON.parse(storedRecords));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setError('Failed to load saved data');
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('modelCoefficients', JSON.stringify(modelCoefficients));
    } catch (error) {
      console.error('Error saving model coefficients:', error);
    }
  }, [modelCoefficients]);

  useEffect(() => {
    try {
      localStorage.setItem('variables', JSON.stringify(variables));
    } catch (error) {
      console.error('Error saving variables:', error);
    }
  }, [variables]);

  useEffect(() => {
    try {
      localStorage.setItem('savedRecords', JSON.stringify(savedRecords));
    } catch (error) {
      console.error('Error saving records:', error);
    }
  }, [savedRecords]);

  // Calculate PVOUT using current model coefficients
  const calculatePVOUT = (locationVariables) => {
    const { beta0, beta1, beta2, beta3, beta4, epsilon } = modelCoefficients;
    const x1 = locationVariables[1] || 0; // Solar Irradiance
    const x2 = locationVariables[2] || 0; // Temperature
    const x3 = locationVariables[3] || 0; // Humidity
    const x4 = locationVariables[4] || 0; // Cloud Cover

    return beta0 + (beta1 * x1) + (beta2 * x2) + (beta3 * x3) + (beta4 * x4) + epsilon;
  };

  // Add a new record
  const addRecord = (recordData) => {
    const newRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...recordData
    };
    setSavedRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };

  // Delete a record
  const deleteRecord = (id) => {
    setSavedRecords(prev => prev.filter(record => record.id !== id));
  };

  // Update model coefficients
  const updateModelCoefficients = (newCoefficients) => {
    setModelCoefficients(prev => ({ ...prev, ...newCoefficients }));
  };

  // Add a new variable
  const addVariable = (variableData) => {
    const newId = Math.max(...variables.map(v => v.id), 0) + 1;
    const newVariable = { ...variableData, id: newId };
    setVariables(prev => [...prev, newVariable]);
    return newVariable;
  };

  // Update a variable
  const updateVariable = (id, variableData) => {
    setVariables(prev => prev.map(v => 
      v.id === id ? { ...variableData, id } : v
    ));
  };

  // Delete a variable
  const deleteVariable = (id) => {
    setVariables(prev => prev.filter(v => v.id !== id));
  };

  // Get location-specific data (mock function - would fetch from API in real app)
  const getLocationData = (province, district, city) => {
    // Mock data generation
    return {
      1: Math.random() * 2 + 4, // Solar Irradiance: 4-6
      2: Math.random() * 10 + 25, // Temperature: 25-35°C
      3: Math.random() * 20 + 60, // Humidity: 60-80%
      4: Math.random() * 30 + 20  // Cloud Cover: 20-50%
    };
  };

  const contextValue = {
    // State
    modelCoefficients,
    variables,
    savedRecords,
    locationData,
    loading,
    error,

    // Actions
    updateModelCoefficients,
    addVariable,
    updateVariable,
    deleteVariable,
    addRecord,
    deleteRecord,
    calculatePVOUT,
    getLocationData,
    setLoading,
    setError
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};