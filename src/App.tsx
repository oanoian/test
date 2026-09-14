import { useState, useCallback } from 'react';
import CustomMap from './components/CustomMap';
import Sidebar from './components/Sidebar';
import { MapState, MarkerData, LineData } from './types';
import { initialMarkers, initialLines, DEFAULT_GRID } from './data';

const initialState: MapState = {
  markers: initialMarkers,
  lines: initialLines,
  selectedMarkerId: null,
  selectedLineId: null,
  toolMode: 'select',
  selectedShape: 'pin',
  selectedLineStyle: 'solid',
  selectedColor: '#3b82f6',
  selectedSize: 12,
  lineWidth: 2,
  grid: DEFAULT_GRID,
  showRoads: true,
  showMunicipalities: true,
  showLabels: true,
  showRivers: true,
  showMountains: true,
  showCoastline: true,
  snapToGrid: false,
  isPanning: false,
  isDrawingLine: false,
  lineStartMarkerId: null,
  pendingMarkerLocation: null,
};

function App() {
  const [state, setState] = useState<MapState>(initialState);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setState(prev => {
      // Place marker mode
      if (prev.toolMode === 'place-marker') {
        return { ...prev, pendingMarkerLocation: { lat, lng } };
      }

      // Delete mode - check if clicked on something
      if (prev.toolMode === 'delete') {
        return prev; // deletion handled by marker/line click
      }

      // Deselect
      return { ...prev, selectedMarkerId: null, selectedLineId: null };
    });
  }, []);

  const handleMarkerClick = useCallback((id: string) => {
    setState(prev => {
      // Delete mode
      if (prev.toolMode === 'delete') {
        return {
          ...prev,
          markers: prev.markers.filter(m => m.id !== id),
          lines: prev.lines.filter(l => l.fromMarkerId !== id && l.toMarkerId !== id),
          selectedMarkerId: null,
        };
      }

      // Draw line mode
      if (prev.toolMode === 'draw-line') {
        if (!prev.isDrawingLine) {
          // Start line
          return { ...prev, isDrawingLine: true, lineStartMarkerId: id };
        } else if (prev.lineStartMarkerId && prev.lineStartMarkerId !== id) {
          // Complete line
          const newLine: LineData = {
            id: `l${Date.now()}`,
            fromMarkerId: prev.lineStartMarkerId,
            toMarkerId: id,
            style: prev.selectedLineStyle,
            color: prev.selectedColor,
            width: prev.lineWidth,
            label: '',
            showDistance: true,
            layer: 'custom',
            createdAt: Date.now(),
          };
          return {
            ...prev,
            lines: [...prev.lines, newLine],
            isDrawingLine: false,
            lineStartMarkerId: null,
            selectedLineId: newLine.id,
          };
        }
        return prev;
      }

      // Select mode
      return {
        ...prev,
        selectedMarkerId: prev.selectedMarkerId === id ? null : id,
        selectedLineId: null,
      };
    });
  }, []);

  const handleLineClick = useCallback((id: string) => {
    setState(prev => {
      if (prev.toolMode === 'delete') {
        return { ...prev, lines: prev.lines.filter(l => l.id !== id), selectedLineId: null };
      }
      return { ...prev, selectedLineId: prev.selectedLineId === id ? null : id, selectedMarkerId: null };
    });
  }, []);

  const handleMarkerDrag = useCallback((id: string, lat: number, lng: number) => {
    setState(prev => ({
      ...prev,
      markers: prev.markers.map(m => m.id === id ? { ...m, lat, lng } : m),
    }));
  }, []);

  const handleUpdateMarker = useCallback((marker: MarkerData) => {
    setState(prev => ({
      ...prev,
      markers: prev.markers.map(m => m.id === marker.id ? marker : m),
    }));
  }, []);

  const handleDeleteMarker = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      markers: prev.markers.filter(m => m.id !== id),
      lines: prev.lines.filter(l => l.fromMarkerId !== id && l.toMarkerId !== id),
      selectedMarkerId: prev.selectedMarkerId === id ? null : prev.selectedMarkerId,
    }));
  }, []);

  const handleDeleteLine = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      lines: prev.lines.filter(l => l.id !== id),
      selectedLineId: prev.selectedLineId === id ? null : prev.selectedLineId,
    }));
  }, []);

  const handleUpdateLine = useCallback((line: LineData) => {
    setState(prev => ({
      ...prev,
      lines: prev.lines.map(l => l.id === line.id ? line : l),
    }));
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900">
      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 left-3 z-50 lg:hidden bg-slate-800 text-white p-2 rounded-lg shadow-lg border border-slate-700 hover:bg-slate-700 transition-colors text-sm"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative z-40 h-full transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-72 sm:w-80 lg:w-96 flex-shrink-0
        `}
      >
        <Sidebar
          state={state}
          setState={setState}
          onUpdateMarker={handleUpdateMarker}
          onDeleteMarker={handleDeleteMarker}
          onDeleteLine={handleDeleteLine}
          onUpdateLine={handleUpdateLine}
        />
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <CustomMap
          state={state}
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
          onLineClick={handleLineClick}
          onMarkerDrag={handleMarkerDrag}
        />

        {/* Tool mode indicator */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <div className={`px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 border ${
            state.toolMode === 'place-marker' ? 'bg-blue-600/90 text-white border-blue-400' :
            state.toolMode === 'draw-line' ? 'bg-purple-600/90 text-white border-purple-400' :
            state.toolMode === 'delete' ? 'bg-red-600/90 text-white border-red-400' :
            state.toolMode === 'pan' ? 'bg-amber-600/90 text-white border-amber-400' :
            state.toolMode === 'measure' ? 'bg-green-600/90 text-white border-green-400' :
            'bg-slate-700/90 text-slate-200 border-slate-500'
          }`}>
            <span>{
              state.toolMode === 'select' ? '🖱️' :
              state.toolMode === 'place-marker' ? '📍' :
              state.toolMode === 'draw-line' ? '📏' :
              state.toolMode === 'pan' ? '✋' :
              state.toolMode === 'delete' ? '🗑️' :
              state.toolMode === 'measure' ? '📐' : ''
            }</span>
            <span className="capitalize">{state.toolMode.replace('-', ' ')}</span>
            {state.snapToGrid && <span className="text-xs opacity-70">[SNAP]</span>}
          </div>
        </div>

        {/* Quick stats */}
        <div className="absolute top-3 right-3 z-10 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-1.5 border border-slate-700 flex items-center gap-3 text-xs">
          <div className="text-center">
            <div className="font-bold text-white">{state.markers.length}</div>
            <div className="text-slate-400 text-xs">Pts</div>
          </div>
          <div className="w-px h-6 bg-slate-600"></div>
          <div className="text-center">
            <div className="font-bold text-white">{state.lines.length}</div>
            <div className="text-slate-400 text-xs">Lines</div>
          </div>
          <div className="w-px h-6 bg-slate-600"></div>
          <div className="text-center">
            <div className="font-bold text-amber-400">48</div>
            <div className="text-slate-400 text-xs">Towns</div>
          </div>
        </div>

        {/* Controls help */}
        <div className="absolute bottom-12 right-3 z-10 bg-slate-800/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-slate-700 text-xs text-slate-400 space-y-0.5">
          <div>🖱️ Scroll = Zoom</div>
          <div>⌥+Drag or Middle = Pan</div>
          <div>Drag markers = Move</div>
        </div>
      </div>
    </div>
  );
}

export default App;
