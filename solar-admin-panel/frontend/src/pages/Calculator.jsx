import React, { useState } from 'react';
import { Calculator as CalcIcon, MapPin, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Calculator = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState({ province: '', district: '', city: '' });
  const [pvout, setPvout] = useState(null);

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

  const calculatePVOUT = () => {
    if (!selectedLocation.city) {
      alert('Please select a location');
      return;
    }

    // Mock calculation - in real app, this would fetch from API using admin-configured coefficients
    const mockPVOUT = (Math.random() * 2 + 4).toFixed(3); // 4-6 range
    setPvout(mockPVOUT);
  };

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
          <p className="text-xl text-gray-300">Calculate solar photovoltaic output for locations in Sri Lanka</p>
          
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
            Select Location
          </h2>

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

          <button
            onClick={calculatePVOUT}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
          >
            Calculate PVOUT
          </button>
        </div>

        {/* Results */}
        {pvout && (
          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Solar Energy Output</h3>
            <div className="text-5xl font-bold mb-4">{pvout}</div>
            <p className="text-xl">kWh/m²/day</p>
            <p className="text-lg mt-4 opacity-90">
              For {selectedLocation.city}, {selectedLocation.district}, {selectedLocation.province}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;