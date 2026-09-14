import { useState } from 'react';
import { MarkerData, CategoryType } from '../types';
import { CATEGORIES } from '../data';

interface SidebarProps {
  markers: MarkerData[];
  selectedMarker: string | null;
  onSelectMarker: (id: string | null) => void;
  onUpdateMarker: (marker: MarkerData) => void;
  onDeleteMarker: (id: string) => void;
  onAddMarker: () => void;
  isAddingMode: boolean;
  pendingLocation: { lat: number; lng: number } | null;
  onConfirmAdd: (name: string, description: string, category: CategoryType) => void;
  onCancelAdd: () => void;
}

export default function Sidebar({
  markers,
  selectedMarker,
  onSelectMarker,
  onUpdateMarker,
  onDeleteMarker,
  onAddMarker,
  isAddingMode,
  pendingLocation,
  onConfirmAdd,
  onCancelAdd,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MarkerData>>({});
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('custom');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const startEdit = (marker: MarkerData) => {
    setEditingId(marker.id);
    setEditForm({ ...marker });
  };

  const saveEdit = () => {
    if (editingId && editForm.name && editForm.description) {
      onUpdateMarker({
        id: editingId,
        name: editForm.name || '',
        description: editForm.description || '',
        lat: editForm.lat || 0,
        lng: editForm.lng || 0,
        category: editForm.category || 'custom',
        color: editForm.color || '#a855f7',
      });
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleConfirmAdd = () => {
    if (newName.trim()) {
      onConfirmAdd(newName, newDesc, newCategory);
      setNewName('');
      setNewDesc('');
      setNewCategory('custom');
    }
  };

  const filteredMarkers = markers.filter((m) => {
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <span>Pangasinan Map</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Interactive geographical markers
        </p>
      </div>

      {/* Add Marker Button */}
      <div className="p-3 border-b border-slate-700">
        <button
          onClick={onAddMarker}
          disabled={isAddingMode}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            isAddingMode
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          {isAddingMode ? (
            <>
              <span className="animate-pulse">●</span>
              Click on map to place marker
            </>
          ) : (
            <>
              <span>＋</span>
              Add New Marker
            </>
          )}
        </button>
      </div>

      {/* Pending Location Form */}
      {pendingLocation && (
        <div className="p-3 border-b border-slate-700 bg-blue-900/30">
          <h3 className="text-sm font-semibold text-blue-300 mb-2">
            📍 New Marker at ({pendingLocation.lat.toFixed(4)}, {pendingLocation.lng.toFixed(4)})
          </h3>
          <input
            type="text"
            placeholder="Marker name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm mb-2 focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <textarea
            placeholder="Description..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm mb-2 focus:outline-none focus:border-blue-500 resize-none"
            rows={2}
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as CategoryType)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm mb-2 focus:outline-none focus:border-blue-500"
          >
            {Object.entries(CATEGORIES).map(([key, info]) => (
              <option key={key} value={key}>
                {info.icon} {info.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmAdd}
              className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors"
            >
              ✓ Save
            </button>
            <button
              onClick={onCancelAdd}
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="p-3 border-b border-slate-700 space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search markers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-400 text-sm">🔍</span>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORIES).map(([key, info]) => (
            <option key={key} value={key}>
              {info.icon} {info.label}
            </option>
          ))}
        </select>
      </div>

      {/* Marker Count */}
      <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-700">
        Showing {filteredMarkers.length} of {markers.length} markers
      </div>

      {/* Marker List */}
      <div className="flex-1 overflow-y-auto sidebar-scroll">
        {filteredMarkers.map((marker) => (
          <div
            key={marker.id}
            className={`border-b border-slate-700/50 transition-colors ${
              selectedMarker === marker.id ? 'bg-slate-800' : 'hover:bg-slate-800/50'
            }`}
          >
            {editingId === marker.id ? (
              // Edit Form
              <div className="p-3 space-y-2">
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Name"
                />
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  placeholder="Description"
                />
                <select
                  value={editForm.category || 'custom'}
                  onChange={(e) => {
                    const cat = e.target.value as CategoryType;
                    setEditForm({ ...editForm, category: cat, color: CATEGORIES[cat]?.color || '#a855f7' });
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  {Object.entries(CATEGORIES).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.icon} {info.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-1.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Marker Display
              <div
                className="p-3 cursor-pointer"
                onClick={() => onSelectMarker(marker.id === selectedMarker ? null : marker.id)}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: marker.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">{marker.name}</h3>
                      <span className="text-xs">{CATEGORIES[marker.category]?.icon}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {marker.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                    </p>
                    {selectedMarker === marker.id && (
                      <div className="flex gap-1.5 mt-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); startEdit(marker); }}
                          className="px-2.5 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-medium hover:bg-blue-600/30 transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteMarker(marker.id); }}
                          className="px-2.5 py-1 bg-red-600/20 text-red-400 rounded text-xs font-medium hover:bg-red-600/30 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredMarkers.length === 0 && (
          <div className="p-6 text-center text-slate-500 text-sm">
            No markers found
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 text-xs text-slate-500 text-center">
        Pangasinan, Philippines 🇵🇭
      </div>
    </div>
  );
}
