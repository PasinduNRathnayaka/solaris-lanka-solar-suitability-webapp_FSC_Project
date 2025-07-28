import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X } from 'lucide-react';

const Variables = () => {
  const [loading, setLoading] = useState(false);
  const [variables, setVariables] = useState([]);
  const [newVariable, setNewVariable] = useState({ name: '', unit: '', description: '' });
  const [showAddVariable, setShowAddVariable] = useState(false);
  const [editingVariable, setEditingVariable] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  const fetchVariables = async () => {
    try {
      const response = await fetch(`${API_URL}/variables`);
      const data = await response.json();
      setVariables(data);
    } catch (error) {
      console.error('Error fetching variables:', error);
    }
  };

  useEffect(() => {
    fetchVariables();
  }, []);

  const addVariable = async () => {
    if (newVariable.name && newVariable.unit) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/variables`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVariable)
        });
        if (response.ok) {
          await fetchVariables();
          setNewVariable({ name: '', unit: '', description: '' });
          setShowAddVariable(false);
        }
      } catch (error) {
        console.error('Error adding variable:', error);
        alert('Error adding variable');
      } finally {
        setLoading(false);
      }
    }
  };

  const updateVariable = async () => {
    if (newVariable.name && newVariable.unit && editingVariable) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/variables/${editingVariable}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVariable)
        });
        if (response.ok) {
          await fetchVariables();
          setNewVariable({ name: '', unit: '', description: '' });
          setShowAddVariable(false);
          setEditingVariable(null);
        }
      } catch (error) {
        console.error('Error updating variable:', error);
        alert('Error updating variable');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteVariable = async (id) => {
    if (window.confirm('Are you sure you want to delete this variable?')) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/variables/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchVariables();
        }
      } catch (error) {
        console.error('Error deleting variable:', error);
        alert('Error deleting variable');
      } finally {
        setLoading(false);
      }
    }
  };

  const editVariable = (variable) => {
    setNewVariable({
      name: variable.name,
      unit: variable.unit,
      description: variable.description
    });
    setEditingVariable(variable._id);
    setShowAddVariable(true);
  };

  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Variables</h2>
          <button
            onClick={() => {
              setShowAddVariable(true);
              setEditingVariable(null);
              setNewVariable({ name: '', unit: '', description: '' });
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Variable</span>
          </button>
        </div>

        {showAddVariable && (
          <div className="mb-6 p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingVariable ? 'Edit Variable' : 'Add New Variable'}
              </h3>
              <button
                onClick={() => {
                  setShowAddVariable(false);
                  setEditingVariable(null);
                  setNewVariable({ name: '', unit: '', description: '' });
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Variable name"
                value={newVariable.name}
                onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Unit (e.g., kWh, °C)"
                value={newVariable.unit}
                onChange={(e) => setNewVariable(prev => ({ ...prev, unit: e.target.value }))}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={newVariable.description}
                onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={editingVariable ? updateVariable : addVariable}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : (editingVariable ? 'Update Variable' : 'Add Variable')}
              </button>
              <button
                onClick={() => {
                  setShowAddVariable(false);
                  setEditingVariable(null);
                  setNewVariable({ name: '', unit: '', description: '' });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {variables.map((variable) => (
            <div key={variable._id} className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{variable.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => editVariable(variable)}
                    className="text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteVariable(variable._id)}
                    className="text-red-300 hover:text-red-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-white text-opacity-80 mb-2">Unit: {variable.unit}</p>
              <p className="text-white text-opacity-70 text-sm">{variable.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Variables;