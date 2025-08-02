import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

const LocationSelection = ({ 
  selectedLocation, 
  locationData, 
  loadingLocation, 
  error, 
  handleLocationChange, 
  themeClasses 
}) => {
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

  return (
    <div className={`rounded-3xl border shadow-2xl p-8 mb-8 transition-all duration-300 ${themeClasses.card}`}>
      <h2 className="text-3xl font-bold mb-8 flex items-center">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mr-4">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        Location Selection
      </h2>

      {/* Error Display */}
      {error && (
        <div className={`rounded-2xl p-6 mb-8 ${themeClasses.errorCard}`}>
          <div className="flex items-center text-white">
            <AlertCircle className="w-6 h-6 mr-3" />
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

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

      {/* Location Data Loading */}
      {loadingLocation && (
        <div className="mb-8 p-6 rounded-2xl bg-blue-500 bg-opacity-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
            <span>Loading location data...</span>
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
          <p className={`mb-8 text-lg ${themeClasses.text === 'text-white' ? 'text-gray-400' : 'text-gray-600'}`}>
            Location data for {selectedLocation.city}, {selectedLocation.district} is not available in the database.
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelection;