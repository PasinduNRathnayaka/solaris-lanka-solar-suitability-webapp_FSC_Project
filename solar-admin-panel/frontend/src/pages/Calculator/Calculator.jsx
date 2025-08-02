import React, { useState, useEffect } from 'react';
import { Zap, Sun, Moon } from 'lucide-react';
import LocationSelection from './LocationSelection';
import PanelConfiguration from './PanelConfiguration';
import ResultsDisplay from './ResultsDisplay';

const API_BASE_URL = 'http://localhost:5000/api';

const Calculator = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState({ province: '', district: '', city: '' });
  const [selectedPanel, setSelectedPanel] = useState('');
  const [solarPanels, setSolarPanels] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [panelArea, setPanelArea] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSolarPanels();
    initializeData();
  }, []);

  useEffect(() => {
    if (selectedLocation.city) {
      loadLocationData();
    } else {
      setLocationData(null);
    }
  }, [selectedLocation.city]);

  const initializeData = async () => {
    try {
      await fetch(`${API_BASE_URL}/initialize`, { method: 'POST' });
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const loadSolarPanels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/solar-panels`);
      const data = await response.json();
      setSolarPanels(data);
    } catch (error) {
      console.error('Error loading solar panels:', error);
      // Mock data for demo
      setSolarPanels([
        {
          _id: '1',
          name: 'Monocrystalline Panel A',
          efficiency: 22,
        },
        {
          _id: '2',
          name: 'Polycrystalline Panel B',
          efficiency: 18,
        }
      ]);
    }
  };

  const loadLocationData = async () => {
    setLoadingLocation(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${selectedLocation.province}/${selectedLocation.district}/${selectedLocation.city}`);
      if (response.ok) {
        const data = await response.json();
        setLocationData(data);
      } else {
        setError('Location data not found in database');
        setLocationData(null);
      }
    } catch (error) {
      console.error('Error loading location data:', error);
      setError('Error loading location data');
      setLocationData(null);
    } finally {
      setLoadingLocation(false);
    }
  };

  const calculateSolarOutput = async () => {
    if (!selectedLocation.city || !selectedPanel || !locationData || !panelArea) {
      alert('Please select location, solar panel, enter panel area, and ensure location data is loaded');
      return;
    }

    const areaValue = parseFloat(panelArea);
    if (isNaN(areaValue) || areaValue <= 0) {
      alert('Please enter a valid panel area greater than 0');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/calculations/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          province: selectedLocation.province,
          district: selectedLocation.district,
          city: selectedLocation.city,
          solarPanelId: selectedPanel,
          numberOfPanels: 1,
          panelArea: areaValue
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        const errorData = await response.json();
        // If API fails, calculate manually using database data
        calculateManually(areaValue);
      }
    } catch (error) {
      console.error('Error calculating solar output:', error);
      calculateManually(areaValue);
    } finally {
      setLoading(false);
    }
  };

  const calculateManually = (areaValue) => {
    if (!locationData || !selectedPanel || !areaValue) return;

    const selectedPanelData = solarPanels.find(panel => panel._id === selectedPanel);
    if (!selectedPanelData) return;

    // Get PVOUT from location data (assuming it's in kWh/m²/year)
    // Find PVOUT variable in location data (assuming it's the first variable or specifically named)
    const pvoutVariable = locationData.variables?.find(v => 
      v.variableId?.name?.toLowerCase().includes('pvout') || 
      v.variableId?.name?.toLowerCase().includes('solar') ||
      v.variableId?.name?.toLowerCase().includes('irradiance')
    );

    let annualPvout = pvoutVariable ? pvoutVariable.value : 1500; // Default fallback

    // Convert annual PVOUT to daily and monthly
    const dailyPvout = annualPvout / 365; // kWh/m²/day
    const monthlyPvout = annualPvout / 12; // kWh/m²/month

    // Calculate absorbed energy using user-specified panel area
    const efficiency = selectedPanelData.efficiency / 100;

    const dailyAbsorbedEnergy = dailyPvout * areaValue * efficiency;
    const monthlyAbsorbedEnergy = monthlyPvout * areaValue * efficiency;
    const annualAbsorbedEnergy = annualPvout * areaValue * efficiency;

    // Calculate earnings (using electricity rate from location data)
    const electricityRate = locationData.electricityRate || 25; // LKR per kWh

    const dailyEarnings = dailyAbsorbedEnergy * electricityRate;
    const monthlyEarnings = monthlyAbsorbedEnergy * electricityRate;
    const annualEarnings = annualAbsorbedEnergy * electricityRate;

    setResults({
      pvout: {
        daily: dailyPvout.toFixed(3),
        monthly: monthlyPvout.toFixed(2),
        annual: annualPvout.toFixed(2)
      },
      absorbedEnergy: {
        daily: dailyAbsorbedEnergy.toFixed(3),
        monthly: monthlyAbsorbedEnergy.toFixed(2),
        annual: annualAbsorbedEnergy.toFixed(2)
      },
      earnings: {
        daily: dailyEarnings.toFixed(2),
        monthly: monthlyEarnings.toFixed(2),
        annual: annualEarnings.toFixed(2)
      },
      electricityRate,
      solarPanel: selectedPanelData,
      location: selectedLocation,
      panelArea: areaValue
    });
  };

  const handleLocationChange = (field, value) => {
    const newLocation = { ...selectedLocation, [field]: value };
    if (field === 'province') {
      newLocation.district = '';
      newLocation.city = '';
    } else if (field === 'district') {
      newLocation.city = '';
    }
    setSelectedLocation(newLocation);
  };

  const themeClasses = {
    background: darkMode 
      ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    card: darkMode 
      ? 'bg-gray-800 bg-opacity-50 backdrop-blur-xl border-gray-700' 
      : 'bg-white bg-opacity-80 backdrop-blur-xl border-gray-200',
    input: darkMode 
      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400' 
      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500',
    button: darkMode 
      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
    adminButton: darkMode 
      ? 'bg-gray-700 hover:bg-gray-600' 
      : 'bg-gray-600 hover:bg-gray-700',
    locationCard: darkMode 
      ? 'bg-gradient-to-br from-teal-600 to-cyan-600' 
      : 'bg-gradient-to-br from-teal-500 to-cyan-500',
    resultCard: darkMode 
      ? 'bg-gradient-to-br from-green-600 to-teal-600' 
      : 'bg-gradient-to-br from-green-500 to-teal-500',
    errorCard: darkMode 
      ? 'bg-gradient-to-br from-red-600 to-pink-600' 
      : 'bg-gradient-to-br from-red-500 to-pink-500',
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses.background} ${themeClasses.text}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <Zap className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Solar Energy Calculator
          </h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Calculate solar photovoltaic output and earnings using database location data
          </p>
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.adminButton} text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Location Selection Component */}
        <LocationSelection 
          selectedLocation={selectedLocation}
          locationData={locationData}
          loadingLocation={loadingLocation}
          error={error}
          handleLocationChange={handleLocationChange}
          themeClasses={themeClasses}
        />

        {/* Panel Configuration Component */}
        <PanelConfiguration 
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
          solarPanels={solarPanels}
          panelArea={panelArea}
          setPanelArea={setPanelArea}
          calculateSolarOutput={calculateSolarOutput}
          loading={loading}
          loadingLocation={loadingLocation}
          locationData={locationData}
          themeClasses={themeClasses}
          darkMode={darkMode}
        />

        {/* Results Display Component */}
        <ResultsDisplay 
          results={results}
          themeClasses={themeClasses}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default Calculator;