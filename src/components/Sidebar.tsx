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
  showMunicipalities: boolean;
  setShowMunicipalities: (v: boolean) => void;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
  showRivers: boolean;
  setShowRivers: (v: boolean) => void;
  showMountains: boolean;
  setShowMountains: (v: boolean) => void;
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
  showMunicipalities,
  setShowMunicipalities,
  showLabels,
  setShowLabels,
  showRivers,
  setShowRivers,
  showMountains,
  setShowMountains,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MarkerData>>({});
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('custom');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'markers' | 'layers'>('markers');

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
          <span>Pangasinan</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Custom SVG Geographical Map
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setActiveTab('markers')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'markers'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📍 Markers
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'layers'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🗂️ Map Layers
        </button>
      </div>

      {activeTab === 'markers' ? (
        <>
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
                📍 New Marker at ({pendingLocation.lat.toFixed(4)}°N, {pendingLocation.lng.toFixed(4)}°E)
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
                    <div className="text-xs text-slate-400 px-1">
                      Position: {editForm.lat?.toFixed(4)}°N, {editForm.lng?.toFixed(4)}°E
                    </div>
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
                          {marker.lat.toFixed(4)}°N, {marker.lng.toFixed(4)}°E
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
        </>
      ) : (
        /* Map Layers Tab */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Geographic Layers</h3>
            
            <label className="flex items-center justify-between p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-750 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">🏘️</span>
                <div>
                  <div className="text-sm font-medium">Municipalities</div>
                  <div className="text-xs text-slate-400">Show all 48 towns & cities</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={showMunicipalities}
                onChange={(e) => setShowMunicipalities(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-750 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">🏷️</span>
                <div>
                  <div className="text-sm font-medium">Town Labels</div>
                  <div className="text-xs text-slate-400">Show municipality names</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-750 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">🏔️</span>
                <div>
                  <div className="text-sm font-medium">Mountain Ranges</div>
                  <div className="text-xs text-slate-400">Cordillera & Zambales ranges</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={showMountains}
                onChange={(e) => setShowMountains(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-750 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">🏞️</span>
                <div>
                  <div className="text-sm font-medium">Rivers</div>
                  <div className="text-xs text-slate-400">Agno River & waterways</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={showRivers}
                onChange={(e) => setShowRivers(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500"
              />
            </label>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Legend</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(CATEGORIES).map(([key, info]) => (
                <div key={key} className="flex items-center gap-3 p-2 bg-slate-800 rounded-lg">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: info.color }}></div>
                  <span className="text-lg">{info.icon}</span>
                  <span className="text-sm text-slate-300">{info.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Map Symbols</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-400 border border-slate-600"></div>
                <span>City (pop. &gt; 100k)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-600"></div>
                <span>Municipality</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-0.5 bg-blue-500"></div>
                <span>River</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-1 bg-amber-700 rounded"></div>
                <span>Mountain Range</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">About This Map</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This is a fully custom-built SVG map of Pangasinan province. 
              No external tile servers or online map services are used. 
              All geographical features are rendered natively using SVG paths 
              based on real coordinate data.
            </p>
            <div className="mt-3 text-xs text-slate-500 space-y-1">
              <div>📐 Equirectangular Projection</div>
              <div>🎨 Pure SVG Rendering</div>
              <div>📍 Real Coordinate System</div>
              <div>🔧 100% Self-Contained</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 text-xs text-slate-500 text-center">
        Pangasinan, Philippines 🇵🇭 • Custom SVG Map Engine
      </div>
    </div>
  );
}
