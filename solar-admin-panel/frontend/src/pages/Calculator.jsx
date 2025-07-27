import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, MapPin, Settings, Zap, DollarSign, Sun, Battery, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const Calculator = () => {
  const navigate = useNavigate();
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
      alert('Error calculating PVOUT. Please check your connection.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-yellow-500 rounded-2xl">
              <CalcIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Solar Energy Calculator</h1>
          <p className="text-xl text-gray-300">Calculate solar photovoltaic output and earnings for locations in Sri Lanka</p>
          
          {/* Admin Button */}
          <button
            onClick={() => navigate('/admin')}
            className="mt-6 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Admin Panel</span>
          </button>
        </div>

        {/* Calculator Form */}
        <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-3" />
            Select Location & Solar Panel
          </h2>

          {/* Location Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-white font-medium mb-3">Province</label>
              <select
                value={selectedLocation.province}
                onChange={(e) => handleLocationChange('province', e.target.value)}
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
                onChange={(e) => handleLocationChange('district', e.target.value)}
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
                onChange={(e) => handleLocationChange('city', e.target.value)}
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

          {/* Solar Panel Selection */}
          <div className="mb-8">
            <label className="block text-white font-medium mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Select Solar Panel Type
            </label>
            <select
              value={selectedPanel}
              onChange={(e) => setSelectedPanel(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
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
            <div className="mb-8 p-6 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                <Zap className="w-6 h-6 mr-2" />
                Selected Panel: {selectedPanelData.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                <div>
                  <p className="text-sm opacity-80">Type</p>
                  <p className="font-semibold">{selectedPanelData.type}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Wattage</p>
                  <p className="font-semibold">{selectedPanelData.wattage}W</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Efficiency</p>
                  <p className="font-semibold">{selectedPanelData.efficiency}%</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Area</p>
                  <p className="font-semibold">{selectedPanelData.area}m²</p>
                </div>
                {selectedPanelData.manufacturer && (
                  <div>
                    <p className="text-sm opacity-80">Manufacturer</p>
                    <p className="font-semibold">{selectedPanelData.manufacturer}</p>
                  </div>
                )}
                {selectedPanelData.warranty && (
                  <div>
                    <p className="text-sm opacity-80">Warranty</p>
                    <p className="font-semibold">{selectedPanelData.warranty}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm opacity-80">Cost</p>
                  <p className="font-semibold">LKR {selectedPanelData.cost?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Electricity Rate</p>
                  <p className="font-semibold">{electricityPrice.currency} {electricityPrice.pricePerUnit}/kWh</p>
                </div>
              </div>
              {selectedPanelData.description && (
                <p className="text-white text-opacity-90 text-sm mt-4">{selectedPanelData.description}</p>
              )}
            </div>
          )}

          <button
            onClick={calculatePVOUT}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:transform-none"
          >
            {loading ? 'Calculating...' : 'Calculate Solar Output & Earnings'}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Main Results Card */}
            <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2 text-white">Solar Energy Analysis</h3>
                <p className="text-xl text-white opacity-90">
                  {selectedLocation.city}, {selectedLocation.district}, {selectedLocation.province}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PVOUT */}
                <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                  <Sun className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                  <h4 className="text-lg font-semibold text-white mb-2">Solar Irradiance (PVOUT)</h4>
                  <div className="text-3xl font-bold text-white mb-1">{results.pvout}</div>
                  <p className="text-white opacity-80">kWh/m²/day</p>
                </div>

                {/* Daily Energy */}
                <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                  <Battery className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                  <h4 className="text-lg font-semibold text-white mb-2">Daily Energy Output</h4>
                  <div className="text-3xl font-bold text-white mb-1">{results.absorbedEnergy}</div>
                  <p className="text-white opacity-80">kWh/day</p>
                </div>

                {/* Monthly Earnings */}
                <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-green-300" />
                  <h4 className="text-lg font-semibold text-white mb-2">Monthly Earnings</h4>
                  <div className="text-3xl font-bold text-white mb-1">LKR {results.monthlyEarnings}</div>
                  <p className="text-white opacity-80">per month</p>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Energy Details */}
              <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Energy Production Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                    <span className="text-gray-300">Base Solar Irradiance (PVOUT)</span>
                    <span className="font-semibold text-yellow-400">{results.pvout} kWh/m²/day</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                    <span className="text-gray-300">Panel Efficiency</span>
                    <span className="font-semibold text-blue-400">{results.solarPanel.efficiency}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                    <span className="text-gray-300">Panel Area</span>
                    <span className="font-semibold text-purple-400">{results.solarPanel.area}m²</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-800 bg-opacity-50 rounded-lg border border-green-600">
                    <span className="text-green-300 font-semibold">Daily Energy Output</span>
                    <span className="font-bold text-green-400">{results.absorbedEnergy} kWh/day</span>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <DollarSign className="w-6 h-6 mr-2" />
                  Financial Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                    <span className="text-gray-300">Daily Energy Output</span>
                    <span className="font-semibold text-blue-400">{results.absorbedEnergy} kWh</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                    <span className="text-gray-300">Electricity Rate</span>
                    <span className="font-semibold text-yellow-400">LKR {results.electricityPrice}/kWh</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                    <span className="text-gray-300">Daily Earnings</span>
                    <span className="font-semibold text-purple-400">
                      LKR {(parseFloat(results.monthlyEarnings) / 30).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-800 bg-opacity-50 rounded-lg border border-green-600">
                    <span className="text-green-300 font-semibold">Monthly Earnings</span>
                    <span className="font-bold text-green-400">LKR {results.monthlyEarnings}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-800 bg-opacity-50 rounded-lg border border-blue-600">
                    <span className="text-blue-300 font-semibold">Annual Earnings (Est.)</span>
                    <span className="font-bold text-blue-400">
                      LKR {(parseFloat(results.monthlyEarnings) * 12).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Analysis */}
            <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4">Return on Investment Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 text-center">
                  <h4 className="text-white font-semibold mb-2">Panel Cost</h4>
                  <p className="text-2xl font-bold text-white">
                    LKR {results.solarPanel.cost?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-4 text-center">
                  <h4 className="text-white font-semibold mb-2">Monthly Income</h4>
                  <p className="text-2xl font-bold text-white">LKR {results.monthlyEarnings}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-4 text-center">
                  <h4 className="text-white font-semibold mb-2">Payback Period</h4>
                  <p className="text-2xl font-bold text-white">
                    {Math.ceil(results.solarPanel.cost / parseFloat(results.monthlyEarnings))} months
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-center">
                  <h4 className="text-white font-semibold mb-2">5-Year Profit</h4>
                  <p className="text-2xl font-bold text-white">
                    LKR {((parseFloat(results.monthlyEarnings) * 60) - results.solarPanel.cost).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Calculation Formula */}
            <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4">Calculation Method</h3>
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
                <p className="mb-2">Daily Energy Output = PVOUT × Panel Efficiency × Panel Area</p>
                <p className="mb-2">Daily Energy Output = {results.pvout} × {results.solarPanel.efficiency}% × {results.solarPanel.area}m² = {results.absorbedEnergy} kWh/day</p>
                <p className="mb-2">Monthly Earnings = Daily Energy × Electricity Rate × 30 days</p>
                <p>Monthly Earnings = {results.absorbedEnergy} × LKR {results.electricityPrice} × 30 = LKR {results.monthlyEarnings}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Panels Message */}
        {solarPanels.length === 0 && (
          <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 text-center">
            <Zap className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Solar Panels Available</h3>
            <p className="text-gray-500 mb-4">Please add solar panels in the admin panel to start calculating.</p>
            <button
              onClick={() => navigate('/admin')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
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