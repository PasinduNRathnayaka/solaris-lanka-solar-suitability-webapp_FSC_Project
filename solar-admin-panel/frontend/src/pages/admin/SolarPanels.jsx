import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Zap } from 'lucide-react';

const SolarPanels = () => {
  const [loading, setLoading] = useState(false);
  const [solarPanels, setSolarPanels] = useState([]);
  const [newSolarPanel, setNewSolarPanel] = useState({
    name: '',
    efficiency: '',
    technology: 'Monocrystalline',
    // Optional fields with defaults
    manufacturer: 'Generic',
    wattage: '300',
    absorptionRate: '95',
    area: '2',
    pricePerUnit: '250',
    warranty: 25
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
      technology: 'Monocrystalline',
      manufacturer: 'Generic',
      wattage: '300',
      absorptionRate: '95',
      area: '2',
      pricePerUnit: '250',
      warranty: 25
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
            ...newSolarPanel,
            wattage: parseFloat(newSolarPanel.wattage),
            efficiency: parseFloat(newSolarPanel.efficiency),
            absorptionRate: parseFloat(newSolarPanel.absorptionRate),
            area: parseFloat(newSolarPanel.area),
            pricePerUnit: parseFloat(newSolarPanel.pricePerUnit),
            warranty: parseInt(newSolarPanel.warranty)
          })
        });
        if (response.ok) {
          await fetchSolarPanels();
          resetForm();
          setShowAddSolarPanel(false);
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
            ...newSolarPanel,
            wattage: parseFloat(newSolarPanel.wattage),
            efficiency: parseFloat(newSolarPanel.efficiency),
            absorptionRate: parseFloat(newSolarPanel.absorptionRate),
            area: parseFloat(newSolarPanel.area),
            pricePerUnit: parseFloat(newSolarPanel.pricePerUnit),
            warranty: parseInt(newSolarPanel.warranty)
          })
        });
        if (response.ok) {
          await fetchSolarPanels();
          resetForm();
          setShowAddSolarPanel(false);
          setEditingSolarPanel(null);
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
      technology: panel.technology,
      manufacturer: panel.manufacturer,
      wattage: panel.wattage.toString(),
      absorptionRate: panel.absorptionRate.toString(),
      area: panel.area.toString(),
      pricePerUnit: panel.pricePerUnit.toString(),
      warranty: panel.warranty
    });
    setEditingSolarPanel(panel._id);
    setShowAddSolarPanel(true);
  };

  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Solar Panels</h2>
          <button
            onClick={() => {
              setShowAddSolarPanel(true);
              setEditingSolarPanel(null);
              resetForm();
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Solar Panel</span>
          </button>
        </div>

        {showAddSolarPanel && (
          <div className="mb-6 p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingSolarPanel ? 'Edit Solar Panel' : 'Add New Solar Panel'}
              </h3>
              <button
                onClick={() => {
                  setShowAddSolarPanel(false);
                  setEditingSolarPanel(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Primary Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Panel Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., High Efficiency Solar Panel Pro"
                  value={newSolarPanel.name}
                  onChange={(e) => setNewSolarPanel(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Efficiency (%) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 22.5"
                    min="10"
                    max="35"
                    step="0.1"
                    value={newSolarPanel.efficiency}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, efficiency: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Technology <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={newSolarPanel.technology}
                    onChange={(e) => setNewSolarPanel(prev => ({ ...prev, technology: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Monocrystalline">Monocrystalline</option>
                    <option value="Polycrystalline">Polycrystalline</option>
                    <option value="Thin Film">Thin Film</option>
                    <option value="Bifacial">Bifacial</option>
                  </select>
                </div>
              </div>
            </div>


            
            <div className="flex space-x-4">
              <button
                onClick={editingSolarPanel ? updateSolarPanel : addSolarPanel}
                disabled={loading || !newSolarPanel.name || !newSolarPanel.efficiency}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : (editingSolarPanel ? 'Update Panel' : 'Add Panel')}
              </button>
              <button
                onClick={() => {
                  setShowAddSolarPanel(false);
                  setEditingSolarPanel(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solarPanels.map((panel) => (
            <div key={panel._id} className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Zap className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">{panel.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => editSolarPanel(panel)}
                    className="text-orange-300 hover:text-orange-100 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteSolarPanel(panel._id)}
                    className="text-red-300 hover:text-red-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Primary Information Highlighted */}
              <div className="space-y-3 mb-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-white font-medium text-lg">
                    Efficiency: {panel.efficiency}%
                  </p>
                  <p className="text-white text-opacity-90">
                    Technology: {panel.technology}
                  </p>
                </div>
              </div>
              
              {/* Secondary Information */}
              <div className="space-y-2 text-sm text-white text-opacity-75">
                <p><span className="font-medium">Manufacturer:</span> {panel.manufacturer}</p>
                <p><span className="font-medium">Wattage:</span> {panel.wattage}W</p>
                <p><span className="font-medium">Absorption Rate:</span> {panel.absorptionRate}%</p>
                <p><span className="font-medium">Area:</span> {panel.area}m²</p>
                <p><span className="font-medium">Price:</span> ${panel.pricePerUnit}</p>
                <p><span className="font-medium">Warranty:</span> {panel.warranty} years</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolarPanels;