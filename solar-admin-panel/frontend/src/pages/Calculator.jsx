import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, MapPin, Settings, Zap, DollarSign, Sun, Battery, TrendingUp, Moon, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const Calculator = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState({ province: '', district: '', city: '' });
  const [selectedPanel, setSelectedPanel] = useState('');
  const [solarPanels, setSolarPanels] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [electricityPrice, setElectricityPrice] = useState({ pricePerUnit: 25, currency: 'LKR' });

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

  useEffect(() => {
    loadSolarPanels();
    loadElectricityPrice();
    initializeData();
  }, []);

  // const navigate = (path) => {
  //   console.log(`Navigating to ${path}`);
  // };

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
          type: 'Monocrystalline',
          wattage: 400,
          efficiency: 22,
          area: 2.5,
          manufacturer: 'SolarTech Inc.',
          warranty: '25 years',
          cost: 85000,
          description: 'High-efficiency monocrystalline solar panel with excellent performance in various weather conditions.'
        },
        {
          _id: '2',
          name: 'Polycrystalline Panel B',
          type: 'Polycrystalline',
          wattage: 350,
          efficiency: 18,
          area: 2.2,
          manufacturer: 'EcoSolar Ltd.',
          warranty: '20 years',
          cost: 65000,
          description: 'Cost-effective polycrystalline panel suitable for residential installations.'
        }
      ]);
    }
  };

  const loadElectricityPrice = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/electricity-price`);
      const data = await response.json();
      setElectricityPrice(data);
    } catch (error) {
      console.error('Error loading electricity price:', error);
    }
  };

  const calculatePVOUT = async () => {
    if (!selectedLocation.city || !selectedPanel) {
      alert('Please select both location and solar panel');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/calculate-pvout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          province: selectedLocation.province,
          district: selectedLocation.district,
          city: selectedLocation.city,
          panelId: selectedPanel
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error calculating PVOUT');
      }
    } catch (error) {
      console.error('Error calculating PVOUT:', error);
      // Mock results for demo
      const selectedPanelData = solarPanels.find(panel => panel._id === selectedPanel);
      if (selectedPanelData) {
        const mockPvout = 5.2;
        const mockAbsorbedEnergy = (mockPvout * selectedPanelData.efficiency * selectedPanelData.area / 100).toFixed(2);
        const mockMonthlyEarnings = (mockAbsorbedEnergy * electricityPrice.pricePerUnit * 30).toFixed(2);
        
        setResults({
          pvout: mockPvout,
          absorbedEnergy: mockAbsorbedEnergy,
          monthlyEarnings: mockMonthlyEarnings,
          electricityPrice: electricityPrice.pricePerUnit,
          solarPanel: selectedPanelData
        });
      }
    } finally {
      setLoading(false);
    }
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
    panelCard: darkMode 
      ? 'bg-gradient-to-br from-yellow-600 to-orange-600' 
      : 'bg-gradient-to-br from-yellow-500 to-orange-500',
    resultCard: darkMode 
      ? 'bg-gradient-to-br from-green-600 to-teal-600' 
      : 'bg-gradient-to-br from-green-500 to-teal-500',
    detailCard: darkMode 
      ? 'bg-gray-800 bg-opacity-60 backdrop-blur-lg border-gray-700' 
      : 'bg-white bg-opacity-60 backdrop-blur-lg border-gray-300',
    statBox: darkMode 
      ? 'bg-gray-700 bg-opacity-60' 
      : 'bg-gray-100 bg-opacity-80',
    codeBlock: darkMode 
      ? 'bg-gray-900 text-green-400' 
      : 'bg-gray-100 text-green-700'
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses.background} ${themeClasses.text}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <CalcIcon className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Solar Energy Calculator
          </h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Calculate solar photovoltaic output and earnings for locations in Sri Lanka
          </p>
          
          {/* Theme Toggle & Admin Button */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all duration-300 ${themeClasses.adminButton} text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate('/admin/model')}
              className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 ${themeClasses.adminButton} text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              <Settings className="w-5 h-5" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>

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
                {Object.keys(locationData).map(province => (
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
                {selectedLocation.province && Object.keys(locationData[selectedLocation.province]).map(district => (
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
                 locationData[selectedLocation.province][selectedLocation.district].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

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
                  {panel.name} - {panel.wattage}W ({panel.efficiency}% efficiency)
                </option>
              ))}
            </select>
          </div>

          {/* Selected Panel Details */}
          {selectedPanelData && (
            <div className={`mb-10 p-8 rounded-2xl shadow-xl ${themeClasses.panelCard}`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center text-white">
                <div className="p-2 bg-white bg-opacity-20 rounded-xl mr-3">
                  <Zap className="w-8 h-8" />
                </div>
                Selected Panel: {selectedPanelData.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
                {[
                  { label: 'Type', value: selectedPanelData.type },
                  { label: 'Wattage', value: `${selectedPanelData.wattage}W` },
                  { label: 'Efficiency', value: `${selectedPanelData.efficiency}%` },
                  { label: 'Area', value: `${selectedPanelData.area}m²` },
                  { label: 'Manufacturer', value: selectedPanelData.manufacturer },
                  { label: 'Warranty', value: selectedPanelData.warranty },
                  { label: 'Cost', value: `LKR ${selectedPanelData.cost?.toLocaleString()}` },
                  { label: 'Electricity Rate', value: `${electricityPrice.currency} ${electricityPrice.pricePerUnit}/kWh` }
                ].filter(item => item.value).map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-xl p-4">
                    <p className="text-sm opacity-80 mb-1">{item.label}</p>
                    <p className="font-bold text-lg">{item.value}</p>
                  </div>
                ))}
              </div>
              {selectedPanelData.description && (
                <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-xl">
                  <p className="text-white text-opacity-90">{selectedPanelData.description}</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={calculatePVOUT}
            disabled={loading}
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
                  {selectedLocation.city}, {selectedLocation.district}, {selectedLocation.province}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: Sun, title: 'Solar Irradiance (PVOUT)', value: results.pvout, unit: 'kWh/m²/day', color: 'yellow' },
                  { icon: Battery, title: 'Daily Energy Output', value: results.absorbedEnergy, unit: 'kWh/day', color: 'blue' },
                  { icon: DollarSign, title: 'Monthly Earnings', value: `LKR ${results.monthlyEarnings}`, unit: 'per month', color: 'green' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
                    <item.icon className={`w-16 h-16 mx-auto mb-6 text-${item.color}-300`} />
                    <h4 className="text-xl font-semibold text-white mb-4">{item.title}</h4>
                    <div className="text-4xl font-bold text-white mb-2">{item.value}</div>
                    <p className="text-white opacity-80 text-lg">{item.unit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Energy Details */}
              <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.detailCard}`}>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mr-3">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  Energy Production Details
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Base Solar Irradiance (PVOUT)', value: `${results.pvout} kWh/m²/day`, highlight: false },
                    { label: 'Panel Efficiency', value: `${results.solarPanel.efficiency}%`, highlight: false },
                    { label: 'Panel Area', value: `${results.solarPanel.area}m²`, highlight: false },
                    { label: 'Daily Energy Output', value: `${results.absorbedEnergy} kWh/day`, highlight: true }
                  ].map((item, index) => (
                    <div key={index} className={`flex justify-between items-center p-4 rounded-xl transition-all duration-200 ${
                      item.highlight 
                        ? `${darkMode ? 'bg-green-800 bg-opacity-50 border border-green-600' : 'bg-green-100 border border-green-300'}` 
                        : themeClasses.statBox
                    }`}>
                      <span className={item.highlight ? 'font-bold' : ''}>{item.label}</span>
                      <span className={`font-bold ${item.highlight ? (darkMode ? 'text-green-400' : 'text-green-700') : ''}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Details */}
              <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.detailCard}`}>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl mr-3">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  Financial Analysis
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Daily Energy Output', value: `${results.absorbedEnergy} kWh`, highlight: false },
                    { label: 'Electricity Rate', value: `LKR ${results.electricityPrice}/kWh`, highlight: false },
                    { label: 'Daily Earnings', value: `LKR ${(parseFloat(results.monthlyEarnings) / 30).toFixed(2)}`, highlight: false },
                    { label: 'Monthly Earnings', value: `LKR ${results.monthlyEarnings}`, highlight: true },
                    { label: 'Annual Earnings (Est.)', value: `LKR ${(parseFloat(results.monthlyEarnings) * 12).toLocaleString()}`, highlight: true }
                  ].map((item, index) => (
                    <div key={index} className={`flex justify-between items-center p-4 rounded-xl transition-all duration-200 ${
                      item.highlight 
                        ? `${darkMode ? 'bg-green-800 bg-opacity-50 border border-green-600' : 'bg-green-100 border border-green-300'}` 
                        : themeClasses.statBox
                    }`}>
                      <span className={item.highlight ? 'font-bold' : ''}>{item.label}</span>
                      <span className={`font-bold ${item.highlight ? (darkMode ? 'text-green-400' : 'text-green-700') : ''}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROI Analysis */}
            <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.detailCard}`}>
              <h3 className="text-2xl font-bold mb-8">Return on Investment Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: 'Panel Cost', value: `LKR ${results.solarPanel.cost?.toLocaleString()}`, gradient: 'from-blue-600 to-purple-600' },
                  { title: 'Monthly Income', value: `LKR ${results.monthlyEarnings}`, gradient: 'from-green-600 to-teal-600' },
                  { title: 'Payback Period', value: `${Math.ceil(results.solarPanel.cost / parseFloat(results.monthlyEarnings))} months`, gradient: 'from-yellow-600 to-orange-600' },
                  { title: '5-Year Profit', value: `LKR ${((parseFloat(results.monthlyEarnings) * 60) - results.solarPanel.cost).toLocaleString()}`, gradient: 'from-purple-600 to-pink-600' }
                ].map((item, index) => (
                  <div key={index} className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-6 text-center text-white shadow-lg transform hover:scale-105 transition-all duration-300`}>
                    <h4 className="font-bold mb-3 text-lg">{item.title}</h4>
                    <p className="text-2xl font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculation Formula */}
            <div className={`rounded-2xl border shadow-xl p-8 ${themeClasses.detailCard}`}>
              <h3 className="text-2xl font-bold mb-6">Calculation Method</h3>
              <div className={`p-6 rounded-xl font-mono text-sm overflow-x-auto ${themeClasses.codeBlock}`}>
                <p className="mb-3 font-semibold">Daily Energy Output = PVOUT × Panel Efficiency × Panel Area</p>
                <p className="mb-3">Daily Energy Output = {results.pvout} × {results.solarPanel.efficiency}% × {results.solarPanel.area}m² = {results.absorbedEnergy} kWh/day</p>
                <p className="mb-3 font-semibold">Monthly Earnings = Daily Energy × Electricity Rate × 30 days</p>
                <p>Monthly Earnings = {results.absorbedEnergy} × LKR {results.electricityPrice} × 30 = LKR {results.monthlyEarnings}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Panels Message */}
        {solarPanels.length === 0 && (
          <div className={`rounded-2xl border shadow-xl p-12 text-center ${themeClasses.card}`}>
            <div className="p-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded-3xl mx-auto mb-6 w-fit">
              <Zap className="w-20 h-20 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">No Solar Panels Available</h3>
            <p className={`mb-8 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Please add solar panels in the admin panel to start calculating.
            </p>
            <button
              onClick={() => navigate('/admin')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${themeClasses.button} text-white shadow-xl`}
            >
              Go to Admin Panel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;