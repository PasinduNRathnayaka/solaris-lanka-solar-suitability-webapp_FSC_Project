import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Zap } from 'lucide-react';

const SolarPanels = () => {
  const [loading, setLoading] = useState(false);
  const [solarPanels, setSolarPanels] = useState([]);
  const [newSolarPanel, setNewSolarPanel] = useState({
    name: '',
    efficiency: ''
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
      efficiency: ''
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
            efficiency: parseFloat(newSolarPanel.efficiency)
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
            efficiency: parseFloat(newSolarPanel.efficiency)
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
      efficiency: panel.efficiency.toString()
    });
    setEditingSolarPanel(panel._id);
    setShowAddSolarPanel(true);
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {solarPanels.map((panel) => (
                <div key={panel._id} className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-6 h-6 text-yellow-300" />
                      <span className="text-sm text-orange-200">Solar Panel</span>
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
                    
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">Efficiency:</span>
                        <span className="text-black font-bold text-xl">{panel.efficiency}%</span>
                      </div>
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