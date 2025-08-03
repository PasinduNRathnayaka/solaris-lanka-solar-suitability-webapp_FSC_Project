import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Zap, DollarSign, Award } from 'lucide-react';

const SolarPanels = () => {
  const [loading, setLoading] = useState(false);
  const [solarPanels, setSolarPanels] = useState([]);
  const [newSolarPanel, setNewSolarPanel] = useState({
    name: '',
    efficiency: '',
    pricePerWatt: '150',
    warrantyYears: '25',
    manufacturer: '',
    technology: 'Monocrystalline',
    maxPowerOutput: '400',
    dimensions: {
      length: '2',
      width: '1',
      thickness: '0.04'
    },
    weight: '20',
    temperatureCoefficient: '-0.4'
  });
  const [showAddSolarPanel, setShowAddSolarPanel] = useState(false);
  const [editingSolarPanel, setEditingSolarPanel] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  const fetchSolarPanels = async () => {
    try {
      const response = await fetch(`${API_URL}/solar-panels`);
      const data = await response.json();
      setSolarPanels(data);
    } catch (error) {
      console.error('Error fetching solar panels:', error);
    }
  };

  useEffect(() => {
    fetchSolarPanels();
  }, []);

  const resetForm = () => {
    setNewSolarPanel({
      name: '',
      efficiency: '',
      pricePerWatt: '150',
      warrantyYears: '25',
      manufacturer: '',
      technology: 'Monocrystalline',
      maxPowerOutput: '400',
      dimensions: {
        length: '2',
        width: '1',
        thickness: '0.04'
      },
      weight: '20',
      temperatureCoefficient: '-0.4'
    });
  };

  const addSolarPanel = async () => {
    if (newSolarPanel.name && newSolarPanel.efficiency) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/solar-panels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newSolarPanel.name,
            efficiency: parseFloat(newSolarPanel.efficiency),
            pricePerWatt: parseFloat(newSolarPanel.pricePerWatt),
            warrantyYears: parseInt(newSolarPanel.warrantyYears),
            manufacturer: newSolarPanel.manufacturer,
            technology: newSolarPanel.technology,
            maxPowerOutput: parseFloat(newSolarPanel.maxPowerOutput),
            dimensions: {
              length: parseFloat(newSolarPanel.dimensions.length),
              width: parseFloat(newSolarPanel.dimensions.width),
              thickness: parseFloat(newSolarPanel.dimensions.thickness)
            },
            weight: parseFloat(newSolarPanel.weight),
            temperatureCoefficient: parseFloat(newSolarPanel.temperatureCoefficient)
          })
        });
        
        if (response.ok) {
          await fetchSolarPanels();
          resetForm();
          setShowAddSolarPanel(false);
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error adding solar panel');
        }
      } catch (error) {
        console.error('Error adding solar panel:', error);
        alert('Error adding solar panel');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in the panel name and efficiency');
    }
  };

  const updateSolarPanel = async () => {
    if (newSolarPanel.name && newSolarPanel.efficiency && editingSolarPanel) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/solar-panels/${editingSolarPanel}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newSolarPanel.name,
            efficiency: parseFloat(newSolarPanel.efficiency),
            pricePerWatt: parseFloat(newSolarPanel.pricePerWatt),
            warrantyYears: parseInt(newSolarPanel.warrantyYears),
            manufacturer: newSolarPanel.manufacturer,
            technology: newSolarPanel.technology,
            maxPowerOutput: parseFloat(newSolarPanel.maxPowerOutput),
            dimensions: {
              length: parseFloat(newSolarPanel.dimensions.length),
              width: parseFloat(newSolarPanel.dimensions.width),
              thickness: parseFloat(newSolarPanel.dimensions.thickness)
            },
            weight: parseFloat(newSolarPanel.weight),
            temperatureCoefficient: parseFloat(newSolarPanel.temperatureCoefficient)
          })
        });
        
        if (response.ok) {
          await fetchSolarPanels();
          resetForm();
          setShowAddSolarPanel(false);
          setEditingSolarPanel(null);
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error updating solar panel');
        }
      } catch (error) {
        console.error('Error updating solar panel:', error);
        alert('Error updating solar panel');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in the panel name and efficiency');
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
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error deleting solar panel');
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
      efficiency: panel.efficiency.toString(),
      pricePerWatt: panel.pricePerWatt?.toString() || '150',
      warrantyYears: panel.warrantyYears?.toString() || '25',
      manufacturer: panel.manufacturer || '',
      technology: panel.technology || 'Monocrystalline',
      maxPowerOutput: panel.maxPowerOutput?.toString() || '400',
      dimensions: {
        length: panel.dimensions?.length?.toString() || '2',
        width: panel.dimensions?.width?.toString() || '1',
        thickness: panel.dimensions?.thickness?.toString() || '0.04'
      },
      weight: panel.weight?.toString() || '20',
      temperatureCoefficient: panel.temperatureCoefficient?.toString() || '-0.4'
    });
    setEditingSolarPanel(panel._id);
    setShowAddSolarPanel(true);
  };

  const technologies = ['Monocrystalline', 'Polycrystalline', 'Thin Film', 'Bifacial'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Manage Solar Panels</h2>
            <button
              onClick={() => {
                setShowAddSolarPanel(true);
                setEditingSolarPanel(null);
                resetForm();
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Solar Panel</span>
            </button>
          </div>

          {showAddSolarPanel && (
            <div className="mb-6 p-6 bg-gray-800 bg-opacity-60 rounded-xl border border-gray-600 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {editingSolarPanel ? 'Edit Solar Panel' : 'Add New Solar Panel'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddSolarPanel(false);
                    setEditingSolarPanel(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Basic Information */}
                <div className="col-span-full">
                  <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Panel Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., High Efficiency Solar Panel Pro"
                    value={newSolarPanel.name}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Efficiency (%) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 22.5"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newSolarPanel.efficiency}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, efficiency: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Technology
                  </label>
                  <select
                    value={newSolarPanel.technology}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, technology: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {technologies.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., SunPower, LG, Panasonic"
                    value={newSolarPanel.manufacturer}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, manufacturer: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Technical Specifications */}
                <div className="col-span-full mt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Technical Specifications</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Power Output (W)
                  </label>
                  <input
                    type="number"
                    placeholder="400"
                    min="50"
                    step="10"
                    value={newSolarPanel.maxPowerOutput}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, maxPowerOutput: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    min="5"
                    step="0.5"
                    value={newSolarPanel.weight}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Temperature Coefficient (%/°C)
                  </label>
                  <input
                    type="number"
                    placeholder="-0.4"
                    step="0.01"
                    value={newSolarPanel.temperatureCoefficient}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, temperatureCoefficient: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Dimensions */}
                <div className="col-span-full mt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Dimensions (meters)</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Length (m)
                  </label>
                  <input
                    type="number"
                    placeholder="2"
                    min="0.5"
                    step="0.1"
                    value={newSolarPanel.dimensions.length}
                    onChange={(e) => setNewSolarPanel(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, length: e.target.value }
                    }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Width (m)
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    min="0.5"
                    step="0.1"
                    value={newSolarPanel.dimensions.width}
                    onChange={(e) => setNewSolarPanel(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, width: e.target.value }
                    }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thickness (m)
                  </label>
                  <input
                    type="number"
                    placeholder="0.04"
                    min="0.01"
                    step="0.001"
                    value={newSolarPanel.dimensions.thickness}
                    onChange={(e) => setNewSolarPanel(prev => ({ 
                      ...prev, 
                      dimensions: { ...prev.dimensions, thickness: e.target.value }
                    }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Pricing & Warranty */}
                <div className="col-span-full mt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Pricing & Warranty</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price per Watt (LKR)
                  </label>
                  <input
                    type="number"
                    placeholder="150"
                    min="50"
                    step="5"
                    value={newSolarPanel.pricePerWatt}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, pricePerWatt: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Warranty (years)
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    min="10"
                    max="30"
                    value={newSolarPanel.warrantyYears}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, warrantyYears: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={editingSolarPanel ? updateSolarPanel : addSolarPanel}
                  disabled={loading || !newSolarPanel.name || !newSolarPanel.efficiency}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? 'Saving...' : (editingSolarPanel ? 'Update Panel' : 'Add Panel')}
                </button>
                <button
                  onClick={() => {
                    setShowAddSolarPanel(false);
                    setEditingSolarPanel(null);
                    resetForm();
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {solarPanels.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No solar panels added yet</p>
              <p className="text-gray-500">Click "Add Solar Panel" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solarPanels.map((panel) => (
                <div key={panel._id} className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-6 h-6 text-yellow-300" />
                      <span className="text-sm text-orange-200">{panel.technology}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editSolarPanel(panel)}
                        className="text-orange-200 hover:text-white transition-colors p-1 rounded hover:bg-white hover:bg-opacity-20"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSolarPanel(panel._id)}
                        className="text-red-200 hover:text-white transition-colors p-1 rounded hover:bg-white hover:bg-opacity-20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white break-words">
                      {panel.name}
                    </h3>
                    
                    {panel.manufacturer && (
                      <p className="text-sm text-orange-200">
                        by {panel.manufacturer}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                        <div className="text-sm text-black font-medium">Efficiency</div>
                        <div className="text-lg font-bold text-black">{panel.efficiency}%</div>
                      </div>
                      
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                        <div className="text-sm text-black font-medium">Power</div>
                        <div className="text-lg font-bold text-black">{panel.maxPowerOutput}W</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white bg-opacity-20 rounded-lg p-2 text-center">
                        <div className="text-xs text-black font-medium">Area</div>
                        <div className="text-sm font-bold text-black">{panel.area?.toFixed(2)}m²</div>
                      </div>
                      
                      <div className="bg-white bg-opacity-20 rounded-lg p-2 text-center">
                        <div className="text-xs text-black font-medium flex items-center justify-center">
                          <Award className="w-3 h-3 mr-1" />
                          Warranty
                        </div>
                        <div className="text-sm font-bold text-black">{panel.warrantyYears}y</div>
                      </div>
                    </div>

                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-black font-medium flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Price:
                        </span>
                        <span className="text-black font-bold">LKR {panel.pricePerWatt}/W</span>
                      </div>
                      {panel.pricePerSqm && (
                        <div className="text-xs text-black mt-1">
                          ~LKR {panel.pricePerSqm.toFixed(0)}/m²
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-orange-200 mt-4">
                      Added: {new Date(panel.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarPanels;