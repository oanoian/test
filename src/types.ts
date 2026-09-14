export type MarkerShape = 
  | 'dot' | 'pin' | 'landmark' | 'warning' | 'alert' 
  | 'grid-ref' | 'cross' | 'diamond' | 'star' | 'flag'
  | 'circle' | 'square' | 'triangle' | 'hexagon' | 'building';

export type LineStyle = 'solid' | 'dashed' | 'dotted' | 'arrow' | 'measurement' | 'thick' | 'double';

export type ToolMode = 'select' | 'place-marker' | 'draw-line' | 'pan' | 'delete' | 'measure';

export interface MarkerData {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  shape: MarkerShape;
  color: string;
  size: number;
  label: string;
  layer: string;
  locked: boolean;
  createdAt: number;
}

export interface LineData {
  id: string;
  fromMarkerId: string;
  toMarkerId: string;
  style: LineStyle;
  color: string;
  width: number;
  label: string;
  showDistance: boolean;
  layer: string;
  createdAt: number;
}

export interface GridConfig {
  visible: boolean;
  spacing: number; // in degrees
  color: string;
  opacity: number;
  showLabels: boolean;
  showMinor: boolean;
  minorSpacing: number;
}

export interface MapState {
  markers: MarkerData[];
  lines: LineData[];
  selectedMarkerId: string | null;
  selectedLineId: string | null;
  toolMode: ToolMode;
  selectedShape: MarkerShape;
  selectedLineStyle: LineStyle;
  selectedColor: string;
  selectedSize: number;
  lineWidth: number;
  grid: GridConfig;
  showRoads: boolean;
  showMunicipalities: boolean;
  showLabels: boolean;
  showRivers: boolean;
  showMountains: boolean;
  showCoastline: boolean;
  snapToGrid: boolean;
  isPanning: boolean;
  isDrawingLine: boolean;
  lineStartMarkerId: string | null;
  pendingMarkerLocation: { lat: number; lng: number } | null;
}

export const MARKER_SHAPES: Record<MarkerShape, { label: string; icon: string; category: string }> = {
  'dot': { label: 'Dot Marker', icon: '●', category: 'Basic' },
  'pin': { label: 'Map Pin', icon: '📍', category: 'Basic' },
  'landmark': { label: 'Landmark', icon: '🏛️', category: 'Places' },
  'warning': { label: 'Warning', icon: '⚠️', category: 'Alerts' },
  'alert': { label: 'Red Alert', icon: '🔴', category: 'Alerts' },
  'grid-ref': { label: 'Grid Reference', icon: '⊞', category: 'Survey' },
  'cross': { label: 'Cross Mark', icon: '✚', category: 'Survey' },
  'diamond': { label: 'Diamond', icon: '◆', category: 'Basic' },
  'star': { label: 'Star', icon: '★', category: 'Basic' },
  'flag': { label: 'Flag', icon: '🚩', category: 'Places' },
  'circle': { label: 'Circle', icon: '○', category: 'Basic' },
  'square': { label: 'Square', icon: '■', category: 'Basic' },
  'triangle': { label: 'Triangle', icon: '▲', category: 'Survey' },
  'hexagon': { label: 'Hexagon', icon: '⬡', category: 'Survey' },
  'building': { label: 'Building', icon: '🏢', category: 'Places' },
};

export const LINE_STYLES: Record<LineStyle, { label: string; dasharray: string }> = {
  'solid': { label: 'Solid Line', dasharray: '' },
  'dashed': { label: 'Dashed Line', dasharray: '10,5' },
  'dotted': { label: 'Dotted Line', dasharray: '3,3' },
  'arrow': { label: 'Arrow Line', dasharray: '' },
  'measurement': { label: 'Measurement', dasharray: '8,4,2,4' },
  'thick': { label: 'Thick Line', dasharray: '' },
  'double': { label: 'Double Line', dasharray: '' },
};

export const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#14b8a6', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e', '#ffffff',
  '#94a3b8', '#475569', '#1e293b', '#000000',
];

export const LAYERS = [
  { id: 'default', name: 'Default', color: '#3b82f6' },
  { id: 'roads', name: 'Roads', color: '#f59e0b' },
  { id: 'survey', name: 'Survey Points', color: '#22c55e' },
  { id: 'alerts', name: 'Alerts & Warnings', color: '#ef4444' },
  { id: 'landmarks', name: 'Landmarks', color: '#8b5cf6' },
  { id: 'custom', name: 'Custom', color: '#06b6d4' },
];
