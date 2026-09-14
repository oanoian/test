import { useState } from 'react';
import { MarkerData, LineData, MarkerShape, LineStyle, MapState, ToolMode } from '../types';
import { MARKER_SHAPES, LINE_STYLES, PRESET_COLORS, LAYERS } from '../types';

interface SidebarProps {
  state: MapState;
  setState: React.Dispatch<React.SetStateAction<MapState>>;
  onUpdateMarker: (marker: MarkerData) => void;
  onDeleteMarker: (id: string) => void;
  onDeleteLine: (id: string) => void;
  onUpdateLine: (line: LineData) => void;
}

export default function Sidebar({ state, setState, onUpdateMarker, onDeleteMarker, onDeleteLine, onUpdateLine }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'tools' | 'markers' | 'lines' | 'layers' | 'properties'>('tools');
  const [editingMarker, setEditingMarker] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MarkerData>>({});

  const selectedMarker = state.markers.find(m => m.id === state.selectedMarkerId);
  const selectedLine = state.lines.find(l => l.id === state.selectedLineId);

  const setTool = (tool: ToolMode) => setState(prev => ({ ...prev, toolMode: tool }));
  const setShape = (shape: MarkerShape) => setState(prev => ({ ...prev, selectedShape: shape }));
  const setLineStyle = (style: LineStyle) => setState(prev => ({ ...prev, selectedLineStyle: style }));
  const setColor = (color: string) => setState(prev => ({ ...prev, selectedColor: color }));

  const startEditMarker = (marker: MarkerData) => {
    setEditingMarker(marker.id);
    setEditForm({ ...marker });
  };

  const saveEditMarker = () => {
    if (editingMarker && editForm.name) {
      onUpdateMarker({
        ...state.markers.find(m => m.id === editingMarker)!,
        ...editForm,
      } as MarkerData);
      setEditingMarker(null);
    }
  };

  const tabs = [
    { id: 'tools' as const, label: '🔧 Tools', shortLabel: '🔧' },
    { id: 'markers' as const, label: '📍 Markers', shortLabel: '📍' },
    { id: 'lines' as const, label: '📏 Lines', shortLabel: '📏' },
    { id: 'layers' as const, label: '🗂️ Layers', shortLabel: '🗂️' },
    { id: 'properties' as const, label: '⚙️ Props', shortLabel: '⚙️' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-slate-700 flex-shrink-0">
        <h1 className="text-base font-bold flex items-center gap-2">
          <span className="text-lg">🗺️</span>
          <span>Pangasinan Map Editor</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Engineering-grade SVG mapping system</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 flex-shrink-0">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}>
            <span className="hidden lg:inline">{tab.label}</span>
            <span className="lg:hidden">{tab.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto sidebar-scroll">
        {/* TOOLS TAB */}
        {activeTab === 'tools' && (
          <div className="p-3 space-y-4">
            {/* Tool Mode */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Tool</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {([
                  { mode: 'select' as ToolMode, icon: '🖱️', label: 'Select' },
                  { mode: 'place-marker' as ToolMode, icon: '📍', label: 'Place' },
                  { mode: 'draw-line' as ToolMode, icon: '📏', label: 'Line' },
                  { mode: 'pan' as ToolMode, icon: '✋', label: 'Pan' },
                  { mode: 'delete' as ToolMode, icon: '🗑️', label: 'Delete' },
                  { mode: 'measure' as ToolMode, icon: '📐', label: 'Measure' },
                ]).map(t => (
                  <button key={t.mode} onClick={() => setTool(t.mode)}
                    className={`p-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                      state.toolMode === t.mode
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}>
                    <span className="text-base">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Marker Shape Selection */}
            {state.toolMode === 'place-marker' && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Marker Shape</h3>
                <div className="grid grid-cols-5 gap-1">
                  {(Object.entries(MARKER_SHAPES) as [MarkerShape, typeof MARKER_SHAPES[MarkerShape]][]).map(([key, info]) => (
                    <button key={key} onClick={() => setShape(key)}
                      className={`p-1.5 rounded text-center transition-all ${
                        state.selectedShape === key
                          ? 'bg-blue-600 ring-1 ring-blue-400'
                          : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                      title={info.label}>
                      <span className="text-sm">{info.icon}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">{MARKER_SHAPES[state.selectedShape].label}</p>
              </div>
            )}

            {/* Line Style Selection */}
            {state.toolMode === 'draw-line' && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Line Style</h3>
                <div className="space-y-1">
                  {(Object.entries(LINE_STYLES) as [LineStyle, typeof LINE_STYLES[LineStyle]][]).map(([key, info]) => (
                    <button key={key} onClick={() => setLineStyle(key)}
                      className={`w-full p-2 rounded text-xs font-medium transition-all flex items-center gap-2 ${
                        state.selectedLineStyle === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}>
                      <svg width="40" height="8" className="flex-shrink-0">
                        <line x1="0" y1="4" x2="40" y2="4" stroke="currentColor" strokeWidth="2"
                          strokeDasharray={info.dasharray} />
                      </svg>
                      <span>{info.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="text-xs text-slate-400">Line Width: {state.lineWidth}px</label>
                  <input type="range" min="1" max="6" value={state.lineWidth}
                    onChange={e => setState(prev => ({ ...prev, lineWidth: Number(e.target.value) }))}
                    className="w-full accent-blue-500" />
                </div>
              </div>
            )}

            {/* Color Selection */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Color</h3>
              <div className="grid grid-cols-10 gap-1">
                {PRESET_COLORS.map(color => (
                  <button key={color} onClick={() => setColor(color)}
                    className={`w-6 h-6 rounded-sm border transition-all ${
                      state.selectedColor === color ? 'border-white ring-1 ring-white scale-110' : 'border-slate-600'
                    }`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="text-xs text-slate-400">Marker Size: {state.selectedSize}px</label>
              <input type="range" min="6" max="24" value={state.selectedSize}
                onChange={e => setState(prev => ({ ...prev, selectedSize: Number(e.target.value) }))}
                className="w-full accent-blue-500" />
            </div>

            {/* Layer */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Layer</h3>
              <select value={state.markers[0]?.layer || 'default'}
                onChange={e => setState(prev => ({ ...prev }))}
                className="w-full px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-xs">
                {LAYERS.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            {/* Snap to Grid */}
            <label className="flex items-center justify-between p-2 bg-slate-800 rounded-lg cursor-pointer">
              <span className="text-xs">📐 Snap to Grid</span>
              <input type="checkbox" checked={state.snapToGrid}
                onChange={e => setState(prev => ({ ...prev, snapToGrid: e.target.checked }))}
                className="w-4 h-4 accent-blue-500" />
            </label>

            {/* Pending marker form */}
            {state.pendingMarkerLocation && state.toolMode === 'place-marker' && (
              <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <h3 className="text-xs font-semibold text-blue-300 mb-2">
                  📍 Place marker at ({state.pendingMarkerLocation.lat.toFixed(4)}°N, {state.pendingMarkerLocation.lng.toFixed(4)}°E)
                </h3>
                <input type="text" placeholder="Label / Name..." id="new-marker-name"
                  className="w-full px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-xs mb-2 focus:outline-none focus:border-blue-500" />
                <textarea placeholder="Description..." id="new-marker-desc" rows={2}
                  className="w-full px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-xs mb-2 focus:outline-none focus:border-blue-500 resize-none" />
                <div className="flex gap-2">
                  <button onClick={() => {
                    const name = (document.getElementById('new-marker-name') as HTMLInputElement)?.value || 'New Marker';
                    const desc = (document.getElementById('new-marker-desc') as HTMLTextAreaElement)?.value || '';
                    const newMarker: MarkerData = {
                      id: `m${Date.now()}`, name, description: desc,
                      lat: state.pendingMarkerLocation!.lat, lng: state.pendingMarkerLocation!.lng,
                      shape: state.selectedShape, color: state.selectedColor, size: state.selectedSize,
                      label: name.substring(0, 12).toUpperCase(), layer: 'custom', locked: false, createdAt: Date.now(),
                    };
                    setState(prev => ({ ...prev, markers: [...prev.markers, newMarker], pendingMarkerLocation: null, selectedMarkerId: newMarker.id }));
                  }} className="flex-1 py-1.5 bg-green-600 hover:bg-green-500 rounded text-xs font-medium">
                    ✓ Place
                  </button>
                  <button onClick={() => setState(prev => ({ ...prev, pendingMarkerLocation: null }))}
                    className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium">
                    ✕ Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Line drawing instruction */}
            {state.toolMode === 'draw-line' && state.isDrawingLine && (
              <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg">
                <p className="text-xs text-amber-300">
                  {state.lineStartMarkerId
                    ? '🎯 Now click another marker to complete the line'
                    : '👆 Click a marker to start the line'}
                </p>
                {state.lineStartMarkerId && (
                  <button onClick={() => setState(prev => ({ ...prev, isDrawingLine: false, lineStartMarkerId: null }))}
                    className="mt-2 text-xs text-slate-400 hover:text-white">Cancel line</button>
                )}
              </div>
            )}
          </div>
        )}

        {/* MARKERS TAB */}
        {activeTab === 'markers' && (
          <div className="p-3 space-y-2">
            <div className="text-xs text-slate-400 mb-2">{state.markers.length} markers total</div>
            {state.markers.map(marker => (
              <div key={marker.id}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  state.selectedMarkerId === marker.id
                    ? 'bg-slate-800 border-blue-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                }`}
                onClick={() => setState(prev => ({ ...prev, selectedMarkerId: marker.id, selectedLineId: null }))}>
                {editingMarker === marker.id ? (
                  <div className="space-y-2" onClick={e => e.stopPropagation()}>
                    <input type="text" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs" placeholder="Name" />
                    <input type="text" value={editForm.label || ''} onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs" placeholder="Map Label" />
                    <textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs resize-none" rows={2} placeholder="Description" />
                    <div className="grid grid-cols-2 gap-1">
                      <select value={editForm.shape || 'dot'} onChange={e => setEditForm({ ...editForm, shape: e.target.value as MarkerShape })}
                        className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs">
                        {(Object.entries(MARKER_SHAPES) as [MarkerShape, typeof MARKER_SHAPES[MarkerShape]][]).map(([k, v]) => (
                          <option key={k} value={k}>{v.icon} {v.label}</option>
                        ))}
                      </select>
                      <select value={editForm.layer || 'default'} onChange={e => setEditForm({ ...editForm, layer: e.target.value })}
                        className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs">
                        {LAYERS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-400">Color:</label>
                      <div className="flex gap-0.5 flex-wrap">
                        {PRESET_COLORS.slice(0, 10).map(c => (
                          <button key={c} onClick={() => setEditForm({ ...editForm, color: c })}
                            className={`w-4 h-4 rounded-sm ${editForm.color === c ? 'ring-1 ring-white' : ''}`}
                            style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={saveEditMarker} className="flex-1 py-1 bg-green-600 hover:bg-green-500 rounded text-xs">Save</button>
                      <button onClick={() => setEditingMarker(null)} className="flex-1 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-sm flex-shrink-0 mt-0.5" style={{ backgroundColor: marker.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{MARKER_SHAPES[marker.shape]?.icon}</span>
                        <span className="text-xs font-semibold truncate">{marker.name}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{marker.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 font-mono">{marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</span>
                        <span className="text-xs px-1 bg-slate-700 rounded" style={{ color: LAYERS.find(l => l.id === marker.layer)?.color }}>
                          {LAYERS.find(l => l.id === marker.layer)?.name}
                        </span>
                      </div>
                      {state.selectedMarkerId === marker.id && (
                        <div className="flex gap-1 mt-1.5">
                          <button onClick={e => { e.stopPropagation(); startEditMarker(marker); }}
                            className="px-2 py-0.5 bg-blue-600/30 text-blue-400 rounded text-xs hover:bg-blue-600/50">✏️ Edit</button>
                          <button onClick={e => { e.stopPropagation(); onDeleteMarker(marker.id); }}
                            className="px-2 py-0.5 bg-red-600/30 text-red-400 rounded text-xs hover:bg-red-600/50">🗑️ Delete</button>
                          <button onClick={e => { e.stopPropagation(); onUpdateMarker({ ...marker, locked: !marker.locked }); }}
                            className="px-2 py-0.5 bg-slate-600/50 text-slate-300 rounded text-xs hover:bg-slate-600/70">
                            {marker.locked ? '🔒' : '🔓'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* LINES TAB */}
        {activeTab === 'lines' && (
          <div className="p-3 space-y-2">
            <div className="text-xs text-slate-400 mb-2">{state.lines.length} connections</div>
            {state.lines.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No lines yet. Use the Draw Line tool to connect markers.</p>
            )}
            {state.lines.map(line => {
              const from = state.markers.find(m => m.id === line.fromMarkerId);
              const to = state.markers.find(m => m.id === line.toMarkerId);
              if (!from || !to) return null;
              return (
                <div key={line.id}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    state.selectedLineId === line.id ? 'bg-slate-800 border-blue-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                  }`}
                  onClick={() => setState(prev => ({ ...prev, selectedLineId: line.id, selectedMarkerId: null }))}>
                  <div className="flex items-center gap-2">
                    <svg width="30" height="8" className="flex-shrink-0">
                      <line x1="0" y1="4" x2="30" y2="4" stroke={line.color} strokeWidth={line.width}
                        strokeDasharray={LINE_STYLES[line.style].dasharray} />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{line.label || 'Unnamed Line'}</div>
                      <div className="text-xs text-slate-400 truncate">{from.name} → {to.name}</div>
                    </div>
                  </div>
                  {state.selectedLineId === line.id && (
                    <div className="flex gap-1 mt-2">
                      <button onClick={e => { e.stopPropagation(); onDeleteLine(line.id); }}
                        className="px-2 py-0.5 bg-red-600/30 text-red-400 rounded text-xs hover:bg-red-600/50">🗑️ Delete</button>
                      <button onClick={e => {
                        e.stopPropagation();
                        const newLabel = prompt('Line label:', line.label) || line.label;
                        onUpdateLine({ ...line, label: newLabel });
                      }} className="px-2 py-0.5 bg-blue-600/30 text-blue-400 rounded text-xs hover:bg-blue-600/50">✏️ Label</button>
                      <button onClick={e => {
                        e.stopPropagation();
                        onUpdateLine({ ...line, showDistance: !line.showDistance });
                      }} className="px-2 py-0.5 bg-green-600/30 text-green-400 rounded text-xs hover:bg-green-600/50">
                        {line.showDistance ? '📏 Hide Dist' : '📏 Show Dist'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* LAYERS TAB */}
        {activeTab === 'layers' && (
          <div className="p-3 space-y-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Geographic Layers</h3>
              {[
                { key: 'showRoads', icon: '🛣️', label: 'Roads', desc: 'Highways & provincial roads' },
                { key: 'showMunicipalities', icon: '🏘️', label: 'Municipalities', desc: '48 towns & cities' },
                { key: 'showLabels', icon: '🏷️', label: 'Town Labels', desc: 'Municipality names' },
                { key: 'showRivers', icon: '🏞️', label: 'Rivers', desc: 'Agno & waterways' },
                { key: 'showMountains', icon: '🏔️', label: 'Mountains', desc: 'Cordillera & Zambales' },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between p-2 bg-slate-800 rounded-lg cursor-pointer mb-1">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <div>
                      <div className="text-xs font-medium">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                  <input type="checkbox" checked={(state as any)[item.key]}
                    onChange={e => setState(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-4 h-4 accent-blue-500" />
                </label>
              ))}
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Grid Settings</h3>
              <label className="flex items-center justify-between p-2 bg-slate-800 rounded-lg cursor-pointer mb-1">
                <span className="text-xs">Show Grid</span>
                <input type="checkbox" checked={state.grid.visible}
                  onChange={e => setState(prev => ({ ...prev, grid: { ...prev.grid, visible: e.target.checked } }))}
                  className="w-4 h-4 accent-blue-500" />
              </label>
              <label className="flex items-center justify-between p-2 bg-slate-800 rounded-lg cursor-pointer mb-1">
                <span className="text-xs">Show Minor Grid</span>
                <input type="checkbox" checked={state.grid.showMinor}
                  onChange={e => setState(prev => ({ ...prev, grid: { ...prev.grid, showMinor: e.target.checked } }))}
                  className="w-4 h-4 accent-blue-500" />
              </label>
              <label className="flex items-center justify-between p-2 bg-slate-800 rounded-lg cursor-pointer mb-1">
                <span className="text-xs">Grid Labels</span>
                <input type="checkbox" checked={state.grid.showLabels}
                  onChange={e => setState(prev => ({ ...prev, grid: { ...prev.grid, showLabels: e.target.checked } }))}
                  className="w-4 h-4 accent-blue-500" />
              </label>
              <div className="p-2 bg-slate-800 rounded-lg">
                <label className="text-xs text-slate-400">Grid Spacing: {state.grid.spacing.toFixed(3)}°</label>
                <input type="range" min="0.025" max="0.5" step="0.025" value={state.grid.spacing}
                  onChange={e => setState(prev => ({ ...prev, grid: { ...prev.grid, spacing: Number(e.target.value) } }))}
                  className="w-full accent-blue-500" />
              </div>
              <div className="p-2 bg-slate-800 rounded-lg mt-1">
                <label className="text-xs text-slate-400">Grid Opacity: {(state.grid.opacity * 100).toFixed(0)}%</label>
                <input type="range" min="0.05" max="1" step="0.05" value={state.grid.opacity}
                  onChange={e => setState(prev => ({ ...prev, grid: { ...prev.grid, opacity: Number(e.target.value) } }))}
                  className="w-full accent-blue-500" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Data Layers</h3>
              {LAYERS.map(layer => {
                const count = state.markers.filter(m => m.layer === layer.id).length;
                return (
                  <div key={layer.id} className="flex items-center justify-between p-2 bg-slate-800 rounded-lg mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: layer.color }} />
                      <span className="text-xs">{layer.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{count} items</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <div className="p-3 space-y-3">
            {selectedMarker ? (
              <div>
                <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Selected Marker</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Name</span>
                    <span className="font-medium">{selectedMarker.name}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Shape</span>
                    <span>{MARKER_SHAPES[selectedMarker.shape]?.icon} {MARKER_SHAPES[selectedMarker.shape]?.label}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Color</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: selectedMarker.color }} />
                      <span className="font-mono">{selectedMarker.color}</span>
                    </div>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Size</span>
                    <span>{selectedMarker.size}px</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Latitude</span>
                    <span className="font-mono">{selectedMarker.lat.toFixed(6)}°N</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Longitude</span>
                    <span className="font-mono">{selectedMarker.lng.toFixed(6)}°E</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Layer</span>
                    <span>{LAYERS.find(l => l.id === selectedMarker.layer)?.name}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Label</span>
                    <span>{selectedMarker.label || '—'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Locked</span>
                    <span>{selectedMarker.locked ? '🔒 Yes' : '🔓 No'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Connections</span>
                    <span>{state.lines.filter(l => l.fromMarkerId === selectedMarker.id || l.toMarkerId === selectedMarker.id).length}</span>
                  </div>
                </div>
              </div>
            ) : selectedLine ? (
              <div>
                <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Selected Line</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Label</span>
                    <span>{selectedLine.label || '—'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Style</span>
                    <span>{LINE_STYLES[selectedLine.style].label}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">Width</span>
                    <span>{selectedLine.width}px</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">From</span>
                    <span>{state.markers.find(m => m.id === selectedLine.fromMarkerId)?.name}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-800 rounded">
                    <span className="text-slate-400">To</span>
                    <span>{state.markers.find(m => m.id === selectedLine.toMarkerId)?.name}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                <p>Select a marker or line to view properties</p>
                <p className="mt-2 text-slate-600">Or use the Tools tab to create new elements</p>
              </div>
            )}

            {/* Map Statistics */}
            <div className="pt-3 border-t border-slate-700">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Map Statistics</h3>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="p-2 bg-slate-800 rounded text-center">
                  <div className="text-lg font-bold text-white">{state.markers.length}</div>
                  <div className="text-slate-400">Markers</div>
                </div>
                <div className="p-2 bg-slate-800 rounded text-center">
                  <div className="text-lg font-bold text-white">{state.lines.length}</div>
                  <div className="text-slate-400">Lines</div>
                </div>
                <div className="p-2 bg-slate-800 rounded text-center">
                  <div className="text-lg font-bold text-amber-400">{new Set(state.markers.map(m => m.shape)).size}</div>
                  <div className="text-slate-400">Shape Types</div>
                </div>
                <div className="p-2 bg-slate-800 rounded text-center">
                  <div className="text-lg font-bold text-green-400">{new Set(state.markers.map(m => m.layer)).size}</div>
                  <div className="text-slate-400">Layers Used</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-700 text-xs text-slate-500 text-center flex-shrink-0">
        Pangasinan Engineering Map System • Custom SVG Engine
      </div>
    </div>
  );
}
