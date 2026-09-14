import { useState, useCallback } from 'react';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import { MarkerData, CategoryType } from './types';
import { initialMarkers, CATEGORIES } from './data';

function App() {
  const [markers, setMarkers] = useState<MarkerData[]>(initialMarkers);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPendingLocation({ lat, lng });
    setIsAddingMode(false);
  }, []);

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedMarker(id);
  }, []);

  const handleAddMarker = () => {
    setIsAddingMode(true);
    setPendingLocation(null);
  };

  const handleConfirmAdd = (name: string, description: string, category: CategoryType) => {
    if (!pendingLocation) return;

    const newMarker: MarkerData = {
      id: Date.now().toString(),
      name,
      description,
      lat: pendingLocation.lat,
      lng: pendingLocation.lng,
      category,
      color: CATEGORIES[category]?.color || '#a855f7',
    };

    setMarkers((prev) => [...prev, newMarker]);
    setPendingLocation(null);
    setSelectedMarker(newMarker.id);
  };

  const handleCancelAdd = () => {
    setPendingLocation(null);
    setIsAddingMode(false);
  };

  const handleUpdateMarker = (updatedMarker: MarkerData) => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === updatedMarker.id ? updatedMarker : m))
    );
  };

  const handleDeleteMarker = (id: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
    if (selectedMarker === id) {
      setSelectedMarker(null);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900">
      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-800 text-white p-2.5 rounded-lg shadow-lg border border-slate-700 hover:bg-slate-700 transition-colors"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative z-40 h-full transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-80 lg:w-96 flex-shrink-0
        `}
      >
        <Sidebar
          markers={markers}
          selectedMarker={selectedMarker}
          onSelectMarker={setSelectedMarker}
          onUpdateMarker={handleUpdateMarker}
          onDeleteMarker={handleDeleteMarker}
          onAddMarker={handleAddMarker}
          isAddingMode={isAddingMode}
          pendingLocation={pendingLocation}
          onConfirmAdd={handleConfirmAdd}
          onCancelAdd={handleCancelAdd}
        />
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <MapView
          markers={markers}
          selectedMarker={selectedMarker}
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          isAddingMode={isAddingMode}
        />

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 max-w-[200px]">
          <h4 className="text-xs font-bold text-slate-700 mb-2">Legend</h4>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(CATEGORIES).map(([key, info]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="text-sm">{info.icon}</span>
                <span className="text-xs text-slate-600">{info.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Adding Mode Indicator */}
        {isAddingMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <span>📍</span>
            <span className="text-sm font-medium">Click anywhere on the map to place a marker</span>
            <button
              onClick={() => setIsAddingMode(false)}
              className="ml-2 bg-amber-600 hover:bg-amber-700 rounded px-2 py-0.5 text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Stats Bar */}
        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-800">{markers.length}</div>
              <div className="text-xs text-slate-500">Markers</div>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {new Set(markers.map(m => m.category)).size}
              </div>
              <div className="text-xs text-slate-500">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
