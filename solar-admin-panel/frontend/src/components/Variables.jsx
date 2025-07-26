import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const Variables = ({ variables, onAddVariable, onDeleteVariable, loading }) => {
  const [showAddVariable, setShowAddVariable] = useState(false);
  const [newVariable, setNewVariable] = useState({ 
    name: '', 
    unit: '', 
    description: '' 
  });

  const handleAddVariable = () => {
    if (newVariable.name && newVariable.unit) {
      onAddVariable(newVariable);
      setNewVariable({ name: '', unit: '', description: '' });
      setShowAddVariable(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Variables</h2>
          <button
            onClick={() => setShowAddVariable(true)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Variable</span>
          </button>
        </div>

        {showAddVariable && (
          <div className="mb-6 p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-600">
            <h3 className="text-lg font-semibold mb-4">Add New Variable</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Variable name"
                value={newVariable.name}
                onChange={(e) => setNewVariable(prev => ({ 
                  ...prev, 
                  name: e.target.value 
                }))}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Unit (e.g., kWh, °C)"
                value={newVariable.unit}
                onChange={(e) => setNewVariable(prev => ({ 
                  ...prev, 
                  unit: e.target.value 
                }))}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={newVariable.description}
                onChange={(e) => setNewVariable(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleAddVariable}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Variable
              </button>
              <button
                onClick={() => setShowAddVariable(false)}
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
                <button
                  onClick={() => onDeleteVariable(variable._id)}
                  disabled={loading}
                  className="text-red-300 hover:text-red-100 disabled:opacity-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white text-opacity-80 mb-2">Unit: {variable.unit}</p>
              <p className="text-white text-opacity-70 text-sm">{variable.description}</p>
            </div>
          ))}
        </div>

        {variables.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No variables found</p>
            <p className="text-sm">Add your first variable to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Variables;