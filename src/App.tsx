import { useState, useCallback } from 'react';
import CustomMap from './components/CustomMap';
import Sidebar from './components/Sidebar';
import { MarkerData, CategoryType } from './types';
import { initialMarkers, CATEGORIES } from './data';

function App() {
  const [markers, setMarkers] = useState<MarkerData[]>(initialMarkers);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMunicipalities, setShowMunicipalities] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showMountains, setShowMountains] = useState(true);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (isAddingMode) {
      setPendingLocation({ lat, lng });
      setIsAddingMode(false);
    }
  }, [isAddingMode]);

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedMarker(id === selectedMarker ? null : id);
  }, [selectedMarker]);

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
          showMunicipalities={showMunicipalities}
          setShowMunicipalities={setShowMunicipalities}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          showRivers={showRivers}
          setShowRivers={setShowRivers}
          showMountains={showMountains}
          setShowMountains={setShowMountains}
        />
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <CustomMap
          markers={markers}
          selectedMarker={selectedMarker}
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          isAddingMode={isAddingMode}
          showMunicipalities={showMunicipalities}
          showLabels={showLabels}
          showRivers={showRivers}
          showMountains={showMountains}
        />

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
        <div className="absolute top-4 right-4 z-10 bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{markers.length}</div>
              <div className="text-xs text-slate-400">Markers</div>
            </div>
            <div className="w-px h-8 bg-slate-600"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-400">
                {new Set(markers.map(m => m.category)).size}
              </div>
              <div className="text-xs text-slate-400">Categories</div>
            </div>
            <div className="w-px h-8 bg-slate-600"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">48</div>
              <div className="text-xs text-slate-400">Towns</div>
            </div>
          </div>
        </div>

        {/* Map Controls Help */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 border border-slate-700 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>🖱️ Scroll to zoom</span>
            <span>⇧+Drag to pan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
