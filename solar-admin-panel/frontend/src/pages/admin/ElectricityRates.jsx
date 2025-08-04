import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, DollarSign, Zap, Save } from 'lucide-react';

const ElectricityRates = () => {
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState([]);
  const [newRate, setNewRate] = useState({
    fromUnits: '',
    toUnits: '',
    ratePerKwh: '',
    description: ''
  });
  const [showAddRate, setShowAddRate] = useState(false);
  const [editingRate, setEditingRate] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  const fetchRates = async () => {
    try {
      const response = await fetch(`${API_URL}/electricity-rates`);
      const data = await response.json();
      setRates(data);
    } catch (error) {
      console.error('Error fetching electricity rates:', error);
      // Set default rates if API fails
      setRates([
        { _id: '1', fromUnits: 0, toUnits: 30, ratePerKwh: 7.85, description: 'Domestic - 0-30 units' },
        { _id: '2', fromUnits: 31, toUnits: 60, ratePerKwh: 10.75, description: 'Domestic - 31-60 units' },
        { _id: '3', fromUnits: 61, toUnits: 90, ratePerKwh: 27.75, description: 'Domestic - 61-90 units' },
        { _id: '4', fromUnits: 91, toUnits: 120, ratePerKwh: 32.00, description: 'Domestic - 91-120 units' },
        { _id: '5', fromUnits: 121, toUnits: 180, ratePerKwh: 45.00, description: 'Domestic - 121-180 units' },
        { _id: '6', fromUnits: 181, toUnits: 999999, ratePerKwh: 50.00, description: 'Domestic - Above 180 units' }
      ]);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const resetForm = () => {
    setNewRate({
      fromUnits: '',
      toUnits: '',
      ratePerKwh: '',
      description: ''
    });
  };

  const addRate = async () => {
    if (newRate.fromUnits && newRate.toUnits && newRate.ratePerKwh) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/electricity-rates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromUnits: parseInt(newRate.fromUnits),
            toUnits: parseInt(newRate.toUnits),
            ratePerKwh: parseFloat(newRate.ratePerKwh),
            description: newRate.description
          })
        });
        
        if (response.ok) {
          await fetchRates();
          resetForm();
          setShowAddRate(false);
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error adding electricity rate');
        }
      } catch (error) {
        console.error('Error adding electricity rate:', error);
        alert('Error adding electricity rate');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in all required fields');
    }
  };

  const updateRate = async () => {
    if (newRate.fromUnits && newRate.toUnits && newRate.ratePerKwh && editingRate) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/electricity-rates/${editingRate}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromUnits: parseInt(newRate.fromUnits),
            toUnits: parseInt(newRate.toUnits),
            ratePerKwh: parseFloat(newRate.ratePerKwh),
            description: newRate.description
          })
        });
        
        if (response.ok) {
          await fetchRates();
          resetForm();
          setShowAddRate(false);
          setEditingRate(null);
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error updating electricity rate');
        }
      } catch (error) {
        console.error('Error updating electricity rate:', error);
        alert('Error updating electricity rate');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in all required fields');
    }
  };

  const deleteRate = async (id) => {
    if (window.confirm('Are you sure you want to delete this electricity rate?')) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/electricity-rates/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchRates();
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error deleting electricity rate');
        }
      } catch (error) {
        console.error('Error deleting electricity rate:', error);
        alert('Error deleting electricity rate');
      } finally {
        setLoading(false);
      }
    }
  };

  const editRate = (rate) => {
    setNewRate({
      fromUnits: rate.fromUnits.toString(),
      toUnits: rate.toUnits === 999999 ? '' : rate.toUnits.toString(),
      ratePerKwh: rate.ratePerKwh.toString(),
      description: rate.description || ''
    });
    setEditingRate(rate._id);
    setShowAddRate(true);
  };

  const calculateBill = (units) => {
    let totalBill = 0;
    let remainingUnits = units;
    
    const sortedRates = [...rates].sort((a, b) => a.fromUnits - b.fromUnits);
    
    for (const rate of sortedRates) {
      if (remainingUnits <= 0) break;
      
      const tierUnits = Math.min(remainingUnits, rate.toUnits - rate.fromUnits + 1);
      if (tierUnits > 0) {
        totalBill += tierUnits * rate.ratePerKwh;
        remainingUnits -= tierUnits;
      }
    }
    
    return totalBill;
  };

  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Electricity Rates Management</h2>
            <p className="text-gray-400 mt-2">Manage tiered electricity pricing structure for billing calculations</p>
          </div>
          <button
            onClick={() => {
              setShowAddRate(true);
              setEditingRate(null);
              resetForm();
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Rate Tier</span>
          </button>
        </div>

        {showAddRate && (
          <div className="mb-6 p-6 bg-gray-800 bg-opacity-60 rounded-xl border border-gray-600 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                {editingRate ? 'Edit Rate Tier' : 'Add New Rate Tier'}
              </h3>
              <button
                onClick={() => {
                  setShowAddRate(false);
                  setEditingRate(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  From Units <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={newRate.fromUnits}
                  onChange={(e) => setNewRate(prev => ({ ...prev, fromUnits: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  To Units <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="30 (leave empty for unlimited)"
                  min="1"
                  value={newRate.toUnits}
                  onChange={(e) => setNewRate(prev => ({ ...prev, toUnits: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rate per kWh (LKR) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="7.85"
                  min="0"
                  step="0.01"
                  value={newRate.ratePerKwh}
                  onChange={(e) => setNewRate(prev => ({ ...prev, ratePerKwh: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Domestic - 0-30 units"
                  value={newRate.description}
                  onChange={(e) => setNewRate(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={editingRate ? updateRate : addRate}
                disabled={loading || !newRate.fromUnits || !newRate.toUnits || !newRate.ratePerKwh}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? 'Saving...' : (editingRate ? 'Update Rate' : 'Add Rate')}
              </button>
              <button
                onClick={() => {
                  setShowAddRate(false);
                  setEditingRate(null);
                  resetForm();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Current Rates Display */}
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 bg-opacity-50 rounded-xl">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-4 px-6 text-white font-semibold">Tier</th>
                <th className="text-left py-4 px-6 text-white font-semibold">Units Range</th>
                <th className="text-left py-4 px-6 text-white font-semibold">Rate (LKR/kWh)</th>
                <th className="text-left py-4 px-6 text-white font-semibold">Description</th>
                <th className="text-center py-4 px-6 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate, index) => (
                <tr key={rate._id} className="border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-30">
                  <td className="py-4 px-6 text-white font-medium">
                    Tier {index + 1}
                  </td>
                  <td className="py-4 px-6 text-gray-300">
                    {rate.fromUnits} - {rate.toUnits === 999999 ? '∞' : rate.toUnits} units
                  </td>
                  <td className="py-4 px-6 text-green-400 font-semibold">
                    LKR {rate.ratePerKwh.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-gray-300">
                    {rate.description || 'No description'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => editRate(rate)}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded hover:bg-gray-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRate(rate._id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-gray-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Calculator Preview */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <DollarSign className="w-6 h-6 mr-2" />
          Bill Calculator Preview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[50, 100, 200, 350].map(units => (
            <div key={units} className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-sm text-black opacity-80">{units} Units</div>
              <div className="text-lg font-bold text-black">
                LKR {calculateBill(units).toFixed(2)}
              </div>
              <div className="text-xs text-black opacity-60">
                Avg: LKR {(calculateBill(units) / units).toFixed(2)}/kWh
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElectricityRates;