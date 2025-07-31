import React, { useState, useEffect } from 'react';
import { MapPin, Settings, Zap, DollarSign, Sun, Battery, TrendingUp, Moon, AlertCircle } from 'lucide-react';

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

  const locationHierarchy = {
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

  const selectedPanelData = solarPanels.find(panel => panel._id === selectedPanel);

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

        {/* Error Display */}
        {error && (
          <div className={`rounded-2xl p-6 mb-8 ${themeClasses.errorCard}`}>
            <div className="flex items-center text-white">
              <AlertCircle className="w-6 h-6 mr-3" />
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Calculator Form */}
        <div className={`rounded-3xl border shadow-2xl p-8 mb-8 transition-all duration-300 ${themeClasses.card}`}>
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mr-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            Select Location & Solar Panel
          </h2>

          {/* Location Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="space-y-3">
              <label className={`block font-semibold text-lg ${themeClasses.text}`}>Province</label>
              <select
                value={selectedLocation.province}
                onChange={(e) => handleLocationChange('province', e.target.value)}
                className={`w-full border rounded-xl px-4 py-4 text-lg focus:ring-2 focus:border-transparent transition-all duration-200 shadow-md ${themeClasses.input}`}
              >
                <option value="">Select Province</option>
                {Object.keys(locationHierarchy).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className={`block font-semibold text-lg ${themeClasses.text}`}>District</label>
              <select
                value={selectedLocation.district}
                onChange={(e) => handleLocationChange('district', e.target.value)}
                disabled={!selectedLocation.province}
                className={`w-full border rounded-xl px-4 py-4 text-lg focus:ring-2 focus:border-transparent transition-all duration-200 shadow-md disabled:opacity-50 ${themeClasses.input}`}
              >
                <option value="">Select District</option>
                {selectedLocation.province && Object.keys(locationHierarchy[selectedLocation.province]).map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className={`block font-semibold text-lg ${themeClasses.text}`}>City</label>
              <select
                value={selectedLocation.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                disabled={!selectedLocation.district}
                className={`w-full border rounded-xl px-4 py-4 text-lg focus:ring-2 focus:border-transparent transition-all duration-200 shadow-md disabled:opacity-50 ${themeClasses.input}`}
              >
                <option value="">Select City</option>
                {selectedLocation.province && selectedLocation.district && 
                 locationHierarchy[selectedLocation.province][selectedLocation.district].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Data Display */}
          {loadingLocation && (
            <div className="mb-8 p-6 rounded-2xl bg-blue-500 bg-opacity-20">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
                <span>Loading location data...</span>
              </div>
            </div>
          )}

          {locationData && (
            <div className={`mb-10 p-8 rounded-2xl shadow-xl ${themeClasses.locationCard}`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center text-white">
                <div className="p-2 bg-white bg-opacity-20 rounded-xl mr-3">
                  <MapPin className="w-8 h-8" />
                </div>
                Location Data: {selectedLocation.city}, {selectedLocation.district}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-black">
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                  <p className="text-sm opacity-80 mb-1">Electricity Rate</p>
                  <p className="font-bold text-lg">LKR {locationData.electricityRate}/kWh</p>
                </div>
                {locationData.variables?.map((variable, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-xl p-4">
                    <p className="text-sm opacity-80 mb-1">{variable.variableId?.name || `Variable ${index + 1}`}</p>
                    <p className="font-bold text-lg">
                      {variable.value} {variable.variableId?.unit || ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solar Panel Selection */}
          <div className="mb-10">
            <label className={`block font-semibold text-lg mb-4 flex items-center ${themeClasses.text}`}>
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mr-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              Select Solar Panel Type
            </label>
            <select
              value={selectedPanel}
              onChange={(e) => setSelectedPanel(e.target.value)}
              className={`w-full border rounded-xl px-4 py-4 text-lg focus:ring-2 focus:border-transparent transition-all duration-200 shadow-md ${themeClasses.input}`}
            >
              <option value="">Choose a solar panel</option>
              {solarPanels.map(panel => (
                <option key={panel._id} value={panel._id}>
                  {panel.name} - {panel.efficiency}% efficiency
                </option>
              ))}
            </select>
          </div>

          {/* Panel Area Input */}
          <div className="mb-10">
            <label className={`block font-semibold text-lg mb-4 flex items-center ${themeClasses.text}`}>
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mr-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
              Solar Panel Installation Area
            </label>
            <div className="relative">
              <input
                type="number"
                value={panelArea}
                onChange={(e) => setPanelArea(e.target.value)}
                placeholder="Enter area in square meters (m²)"
                min="0.1"
                step="0.1"
                className={`w-full border rounded-xl px-4 py-4 text-lg focus:ring-2 focus:border-transparent transition-all duration-200 shadow-md ${themeClasses.input}`}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                m²
              </div>
            </div>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter the total area you want to install solar panels on. This will be used to calculate your energy production and earnings.
            </p>
          </div>

          <button
            onClick={calculateSolarOutput}
            disabled={loading || loadingLocation || !locationData || !selectedPanel || !panelArea}
            className={`w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50 text-white shadow-2xl ${themeClasses.button}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Calculating...
              </div>
            ) : (
              'Calculate Solar Output & Earnings'
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Main Results Card */}
            <div className={`rounded-3xl p-10 shadow-2xl ${themeClasses.resultCard}`}>
              <div className="text-center mb-8">
                <h3 className="text-4xl font-bold mb-4 text-white">Solar Energy Analysis</h3>
                <p className="text-2xl text-white opacity-90">
                  {results.location.city}, {results.location.district}, {results.location.province}
                </p>
                <p className="text-lg text-white opacity-80 mt-2">
                  Panel: {results.solarPanel.name} ({results.solarPanel.efficiency}% efficiency) | Area: {results.panelArea}m²
                </p>
              </div>
              
              {/* PVOUT Values */}
              <div className="mb-10">
                <h4 className="text-2xl font-bold text-white mb-6 text-center">Solar Irradiance (PVOUT)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Daily PVOUT', value: results.pvout.daily, unit: 'kWh/m²/day', icon: Sun },
                    { title: 'Monthly PVOUT', value: results.pvout.monthly, unit: 'kWh/m²/month', icon: Sun },
                    { title: 'Annual PVOUT', value: results.pvout.annual, unit: 'kWh/m²/year', icon: Sun }
                  ].map((item, index) => (
                    <div key={index} className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
                      <item.icon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                      <h5 className="text-lg font-semibold text-white mb-2">{item.title}</h5>
                      <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
                      <p className="text-white opacity-80">{item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Energy Production */}
              <div className="mb-10">
                <h4 className="text-2xl font-bold text-white mb-6 text-center">Energy Production (Absorbed)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Daily Production', value: results.absorbedEnergy.daily, unit: 'kWh/day', icon: Battery },
                    { title: 'Monthly Production', value: results.absorbedEnergy.monthly, unit: 'kWh/month', icon: Battery },
                    { title: 'Annual Production', value: results.absorbedEnergy.annual, unit: 'kWh/year', icon: Battery }
                  ].map((item, index) => (
                    <div key={index} className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
                      <item.icon className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                      <h5 className="text-lg font-semibold text-white mb-2">{item.title}</h5>
                      <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
                      <p className="text-white opacity-80">{item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earnings */}
              <div>
                <h4 className="text-2xl font-bold text-white mb-6 text-center">Financial Returns</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Daily Earnings', value: `LKR ${results.earnings.daily}`, unit: 'per day', icon: DollarSign },
                    { title: 'Monthly Earnings', value: `LKR ${results.earnings.monthly}`, unit: 'per month', icon: DollarSign },
                    { title: 'Annual Earnings', value: `LKR ${results.earnings.annual}`, unit: 'per year', icon: DollarSign }
                  ].map((item, index) => (
                    <div key={index} className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
                      <item.icon className="w-12 h-12 mx-auto mb-4 text-green-300" />
                      <h5 className="text-lg font-semibold text-white mb-2">{item.title}</h5>
                      <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
                      <p className="text-white opacity-80">{item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculation Details */}
            <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.card}`}>
              <h3 className="text-2xl font-bold mb-6">Calculation Method</h3>
              <div className={`p-6 rounded-xl font-mono text-sm overflow-x-auto ${darkMode ? 'bg-gray-800 text-green-400' : 'bg-gray-100 text-green-700'}`}>
                <p className="mb-2 font-semibold">1. PVOUT Conversion:</p>
                <p className="mb-3">• Annual PVOUT: {results.pvout.annual} kWh/m²/year (from database)</p>
                <p className="mb-3">• Monthly PVOUT: {results.pvout.annual} ÷ 12 = {results.pvout.monthly} kWh/m²/month</p>
                <p className="mb-3">• Daily PVOUT: {results.pvout.annual} ÷ 365 = {results.pvout.daily} kWh/m²/day</p>
                
                <p className="mb-2 font-semibold mt-4">2. Energy Absorption:</p>
                <p className="mb-3">• Panel Efficiency: {results.solarPanel.efficiency}%</p>
                <p className="mb-3">• Installation Area: {results.panelArea}m² (user input)</p>
                <p className="mb-3">• Absorbed Energy = PVOUT × Panel Area × Efficiency</p>
                <p className="mb-3">• Example (Daily): {results.pvout.daily} × {results.panelArea} × {results.solarPanel.efficiency}% = {results.absorbedEnergy.daily} kWh</p>
                
                <p className="mb-2 font-semibold mt-4">3. Financial Calculation:</p>
                <p className="mb-3">• Electricity Rate: LKR {results.electricityRate}/kWh (from database)</p>
                <p className="mb-3">• Daily Earnings: {results.absorbedEnergy.daily} × {results.electricityRate} = LKR {results.earnings.daily}</p>
                <p className="mb-3">• Monthly Earnings: {results.absorbedEnergy.monthly} × {results.electricityRate} = LKR {results.earnings.monthly}</p>
                <p>• Annual Earnings: {results.absorbedEnergy.annual} × {results.electricityRate} = LKR {results.earnings.annual}</p>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.card}`}>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <TrendingUp className="w-8 h-8 mr-3 text-blue-500" />
                  Performance Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
                    <span>Installation Area</span>
                    <span className="font-bold">{results.panelArea}m²</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900 rounded-xl">
                    <span>Panel Efficiency</span>
                    <span className="font-bold">{results.solarPanel.efficiency}%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-xl">
                    <span>Total Daily Production</span>
                    <span className="font-bold">{results.absorbedEnergy.daily} kWh</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900 rounded-xl">
                    <span>Production per m²</span>
                    <span className="font-bold">{(parseFloat(results.absorbedEnergy.daily) / results.panelArea).toFixed(3)} kWh/m²</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.card}`}>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <DollarSign className="w-8 h-8 mr-3 text-green-500" />
                  Investment Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900 rounded-xl">
                    <span>Total Installation Area</span>
                    <span className="font-bold">{results.panelArea}m²</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
                    <span>Revenue per m²/year</span>
                    <span className="font-bold">LKR {(parseFloat(results.earnings.annual) / results.panelArea).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900 rounded-xl">
                    <span>Energy Yield per m²</span>
                    <span className="font-bold">{(parseFloat(results.absorbedEnergy.annual) / results.panelArea).toFixed(0)} kWh/m²/year</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {selectedLocation.city && !locationData && !loadingLocation && !error && (
          <div className={`rounded-2xl border shadow-xl p-12 text-center ${themeClasses.card}`}>
            <div className="p-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded-3xl mx-auto mb-6 w-fit">
              <AlertCircle className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">No Location Data Available</h3>
            <p className={`mb-8 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Location data for {selectedLocation.city}, {selectedLocation.district} is not available in the database.
            </p>
          </div>
        )}

        {/* Instructions */}
        {!selectedLocation.city && (
          <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.card}`}>
            <h3 className="text-2xl font-bold mb-6">How to Use This Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-4 bg-blue-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold mb-2">1. Select Location</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose your province, district, and city to load location-specific solar data
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-yellow-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold mb-2">2. Enter Installation Area</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Input the total area (in square meters) where you plan to install solar panels
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-yellow-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold mb-2">3. Choose Solar Panel</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Select a solar panel type based on efficiency and specifications
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-green-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold mb-2">4. Get Results</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  View detailed calculations for energy production and financial returns based on your installation area
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;