import { MarkerData, LineData, GridConfig } from './types';

// Pangasinan province bounds
export const PROVINCE_BOUNDS = {
  north: 16.45,
  south: 15.70,
  west: 119.75,
  east: 120.90,
};

// Province boundary polygon
export const PROVINCE_BOUNDARY: [number, number][] = [
  [16.39, 119.89], [16.35, 119.92], [16.30, 119.95], [16.29, 119.95],
  [16.25, 119.97], [16.20, 119.90], [16.18, 119.86], [16.15, 119.85],
  [16.11, 119.80], [16.07, 119.87], [16.06, 119.94], [16.04, 119.94],
  [16.00, 119.88], [15.95, 119.85], [15.90, 119.84], [15.83, 119.91],
  [15.79, 119.95], [15.78, 120.05], [15.75, 120.15], [15.78, 120.25],
  [15.80, 120.30], [15.82, 120.33], [15.85, 120.40], [15.88, 120.45],
  [15.89, 120.55], [15.90, 120.63], [15.93, 120.70], [15.95, 120.75],
  [15.98, 120.81], [16.00, 120.84], [16.03, 120.85], [16.05, 120.80],
  [16.07, 120.76], [16.08, 120.70], [16.10, 120.65], [16.12, 120.58],
  [16.14, 120.55], [16.17, 120.51], [16.18, 120.45], [16.20, 120.40],
  [16.22, 120.35], [16.25, 120.30], [16.28, 120.25], [16.30, 120.20],
  [16.33, 120.18], [16.35, 120.15], [16.37, 120.10], [16.38, 120.00],
  [16.39, 119.95], [16.39, 119.89],
];

// Lingayen Gulf
export const LINGAYEN_GULF: [number, number][] = [
  [16.39, 119.89], [16.35, 119.80], [16.30, 119.70], [16.20, 119.60],
  [16.10, 119.55], [16.00, 119.55], [15.90, 119.60], [15.80, 119.70],
  [15.75, 119.80], [15.78, 119.95], [15.83, 119.91], [15.90, 119.84],
  [15.95, 119.85], [16.00, 119.88], [16.06, 119.94], [16.11, 119.80],
  [16.15, 119.85], [16.18, 119.86], [16.20, 119.90], [16.25, 119.97],
  [16.29, 119.95], [16.30, 119.95], [16.35, 119.92], [16.39, 119.89],
];

// Rivers
export const AGNO_RIVER: [number, number][] = [
  [16.25, 120.45], [16.20, 120.40], [16.15, 120.35], [16.10, 120.32],
  [16.05, 120.30], [16.02, 120.28], [16.00, 120.25], [15.98, 120.22],
  [15.95, 120.20], [15.92, 120.18], [15.90, 120.15], [15.88, 120.12],
  [15.85, 120.10],
];

export const BAYAMBANG_RIVER: [number, number][] = [
  [15.85, 120.45], [15.83, 120.43], [15.81, 120.40], [15.80, 120.37],
  [15.79, 120.33], [15.78, 120.30],
];

export const FABRICATION_RIVER: [number, number][] = [
  [16.10, 120.40], [16.08, 120.38], [16.06, 120.36], [16.04, 120.34],
  [16.03, 120.32],
];

// Mountain ranges
export const CORDILLERA_RANGE: [number, number][] = [
  [16.30, 120.50], [16.25, 120.55], [16.20, 120.60], [16.15, 120.65],
  [16.10, 120.70], [16.05, 120.75], [16.00, 120.80],
];

export const ZAMBALES_RANGE: [number, number][] = [
  [16.10, 119.95], [16.05, 120.00], [16.00, 120.05], [15.95, 120.10],
  [15.90, 120.15], [15.85, 120.20], [15.80, 120.25],
];

// Hundred Islands
export const HUNDRED_ISLANDS: [number, number][] = [
  [16.10, 119.97], [16.11, 119.98], [16.09, 119.99], [16.10, 120.00],
  [16.08, 119.98], [16.12, 119.96], [16.09, 120.01], [16.11, 120.02],
  [16.08, 120.00], [16.13, 119.95],
];

// Municipalities
export const MUNICIPALITIES: { name: string; lat: number; lng: number; population: number; isCity: boolean }[] = [
  { name: 'Agno', lat: 16.1142, lng: 119.8028, population: 29270, isCity: false },
  { name: 'Aguilar', lat: 15.8887, lng: 120.2395, population: 45363, isCity: false },
  { name: 'Alaminos', lat: 16.1565, lng: 119.9804, population: 100430, isCity: true },
  { name: 'Alcala', lat: 15.8443, lng: 120.5213, population: 49479, isCity: false },
  { name: 'Anda', lat: 16.2900, lng: 119.9513, population: 42688, isCity: false },
  { name: 'Asingan', lat: 16.0037, lng: 120.6702, population: 58349, isCity: false },
  { name: 'Balungao', lat: 15.8983, lng: 120.6724, population: 30678, isCity: false },
  { name: 'Bani', lat: 16.1833, lng: 119.8625, population: 52715, isCity: false },
  { name: 'Basista', lat: 15.8523, lng: 120.4025, population: 37840, isCity: false },
  { name: 'Bautista', lat: 15.8111, lng: 120.4768, population: 35728, isCity: false },
  { name: 'Bayambang', lat: 15.8088, lng: 120.4540, population: 129506, isCity: false },
  { name: 'Binalonan', lat: 16.0444, lng: 120.5917, population: 56560, isCity: false },
  { name: 'Binmaley', lat: 16.0305, lng: 120.2695, population: 88006, isCity: false },
  { name: 'Bolinao', lat: 16.3856, lng: 119.8945, population: 84658, isCity: false },
  { name: 'Bugallon', lat: 15.9540, lng: 120.2149, population: 76027, isCity: false },
  { name: 'Burgos', lat: 16.0593, lng: 119.8649, population: 23240, isCity: false },
  { name: 'Calasiao', lat: 16.0089, lng: 120.3571, population: 100686, isCity: false },
  { name: 'Dagupan', lat: 16.0424, lng: 120.3375, population: 174777, isCity: true },
  { name: 'Dasol', lat: 15.9902, lng: 119.8811, population: 31842, isCity: false },
  { name: 'Infanta', lat: 15.8250, lng: 119.9056, population: 26837, isCity: false },
  { name: 'Labrador', lat: 16.0255, lng: 120.1453, population: 26995, isCity: false },
  { name: 'Laoac', lat: 16.0480, lng: 120.5471, population: 34550, isCity: false },
  { name: 'Lingayen', lat: 16.0206, lng: 120.2306, population: 108510, isCity: false },
  { name: 'Mabini', lat: 16.0698, lng: 119.9394, population: 26589, isCity: false },
  { name: 'Malasiqui', lat: 15.9191, lng: 120.4139, population: 144344, isCity: false },
  { name: 'Manaoag', lat: 16.0427, lng: 120.4874, population: 76606, isCity: false },
  { name: 'Mangaldan', lat: 16.0666, lng: 120.4010, population: 113302, isCity: false },
  { name: 'Mangatarem', lat: 15.7885, lng: 120.2938, population: 79648, isCity: false },
  { name: 'Mapandan', lat: 16.0240, lng: 120.4535, population: 38228, isCity: false },
  { name: 'Natividad', lat: 16.0427, lng: 120.7946, population: 26721, isCity: false },
  { name: 'Pozorrubio', lat: 16.1104, lng: 120.5458, population: 75143, isCity: false },
  { name: 'Rosales', lat: 15.8915, lng: 120.6331, population: 67510, isCity: false },
  { name: 'San Carlos', lat: 15.9277, lng: 120.3478, population: 208330, isCity: true },
  { name: 'San Fabian', lat: 16.1265, lng: 120.4033, population: 87714, isCity: false },
  { name: 'San Jacinto', lat: 16.0735, lng: 120.4370, population: 44713, isCity: false },
  { name: 'San Manuel', lat: 16.0643, lng: 120.6681, population: 56876, isCity: false },
  { name: 'San Nicolas', lat: 16.0703, lng: 120.7624, population: 40144, isCity: false },
  { name: 'San Quintin', lat: 15.9843, lng: 120.8131, population: 34322, isCity: false },
  { name: 'Santa Barbara', lat: 15.9999, lng: 120.4051, population: 92420, isCity: false },
  { name: 'Santa Maria', lat: 15.9792, lng: 120.7003, population: 34452, isCity: false },
  { name: 'Santo Tomas', lat: 15.8782, lng: 120.5860, population: 14894, isCity: false },
  { name: 'Sison', lat: 16.1724, lng: 120.5103, population: 51439, isCity: false },
  { name: 'Sual', lat: 16.0666, lng: 120.0951, population: 38625, isCity: false },
  { name: 'Tayug', lat: 16.0278, lng: 120.7447, population: 45476, isCity: false },
  { name: 'Umingan', lat: 15.9267, lng: 120.8406, population: 78940, isCity: false },
  { name: 'Urbiztondo', lat: 15.8232, lng: 120.3294, population: 56349, isCity: false },
  { name: 'Urdaneta', lat: 15.9753, lng: 120.5670, population: 145935, isCity: true },
  { name: 'Villasis', lat: 15.9015, lng: 120.5883, population: 65086, isCity: false },
];

// === ROAD NETWORK ===
// Major highways and roads connecting municipalities
export const ROADS: { name: string; type: 'national' | 'provincial' | 'local'; points: [number, number][] }[] = [
  {
    name: 'MacArthur Highway (NH-55)',
    type: 'national',
    points: [
      [15.75, 120.15], [15.80, 120.20], [15.85, 120.25], [15.90, 120.30],
      [15.93, 120.34], [15.97, 120.35], [16.00, 120.34], [16.02, 120.33],
      [16.04, 120.34], [16.07, 120.38], [16.10, 120.40], [16.13, 120.40],
      [16.16, 120.38], [16.20, 120.35], [16.25, 120.30], [16.30, 120.22],
      [16.33, 120.18], [16.35, 120.15],
    ],
  },
  {
    name: 'Dagupan-Lingayen Road',
    type: 'provincial',
    points: [
      [16.04, 120.34], [16.04, 120.31], [16.03, 120.28], [16.03, 120.25],
      [16.02, 120.23],
    ],
  },
  {
    name: 'Dagupan-Manaoag Road',
    type: 'provincial',
    points: [
      [16.04, 120.34], [16.04, 120.37], [16.04, 120.40], [16.04, 120.44],
      [16.04, 120.49],
    ],
  },
  {
    name: 'Urdaneta-Rosales Road',
    type: 'provincial',
    points: [
      [15.97, 120.57], [15.95, 120.58], [15.93, 120.60], [15.91, 120.62],
      [15.89, 120.63],
    ],
  },
  {
    name: 'Alaminos-Bolinao Road',
    type: 'provincial',
    points: [
      [16.16, 119.98], [16.18, 119.96], [16.22, 119.94], [16.26, 119.93],
      [16.30, 119.92], [16.34, 119.90], [16.37, 119.89], [16.39, 119.89],
    ],
  },
  {
    name: 'San Carlos-Bayambang Road',
    type: 'provincial',
    points: [
      [15.93, 120.35], [15.90, 120.37], [15.87, 120.39], [15.84, 120.41],
      [15.81, 120.44], [15.81, 120.45],
    ],
  },
  {
    name: 'Manaoag-San Fabian Road',
    type: 'provincial',
    points: [
      [16.04, 120.49], [16.06, 120.47], [16.08, 120.44], [16.10, 120.42],
      [16.13, 120.40],
    ],
  },
  {
    name: 'Pozorrubio-Sison Road',
    type: 'provincial',
    points: [
      [16.11, 120.55], [16.13, 120.54], [16.15, 120.53], [16.17, 120.51],
    ],
  },
  {
    name: 'Urdaneta-Binalonan Road',
    type: 'provincial',
    points: [
      [15.97, 120.57], [15.99, 120.57], [16.01, 120.58], [16.03, 120.59],
      [16.04, 120.59],
    ],
  },
  {
    name: 'Tayug-San Nicolas Road',
    type: 'provincial',
    points: [
      [16.03, 120.74], [16.04, 120.75], [16.05, 120.76], [16.07, 120.76],
    ],
  },
  {
    name: 'Asingan-San Manuel Road',
    type: 'provincial',
    points: [
      [16.00, 120.67], [16.02, 120.67], [16.04, 120.67], [16.06, 120.67],
    ],
  },
  {
    name: 'Malasiqui-Santa Barbara Road',
    type: 'provincial',
    points: [
      [15.92, 120.41], [15.95, 120.41], [15.98, 120.40], [16.00, 120.40],
    ],
  },
  {
    name: 'Sual-Labrador Road',
    type: 'local',
    points: [
      [16.07, 120.10], [16.05, 120.12], [16.04, 120.14], [16.03, 120.15],
    ],
  },
  {
    name: 'Dasol-Infanta Road',
    type: 'local',
    points: [
      [15.99, 119.88], [15.95, 119.87], [15.90, 119.88], [15.85, 119.90],
      [15.83, 119.91],
    ],
  },
  {
    name: 'Anda-Bani Road',
    type: 'local',
    points: [
      [16.29, 119.95], [16.25, 119.90], [16.22, 119.88], [16.18, 119.86],
    ],
  },
  {
    name: 'Mangatarem-Urbiztondo Road',
    type: 'local',
    points: [
      [15.79, 120.29], [15.80, 120.31], [15.82, 120.33],
    ],
  },
  {
    name: 'Natividad-Umingan Road',
    type: 'local',
    points: [
      [16.04, 120.79], [16.02, 120.80], [15.99, 120.82], [15.96, 120.83],
      [15.93, 120.84],
    ],
  },
  {
    name: 'Villasis-Urdaneta Road',
    type: 'local',
    points: [
      [15.90, 120.59], [15.92, 120.58], [15.95, 120.57], [15.97, 120.57],
    ],
  },
];

// Default grid config
export const DEFAULT_GRID: GridConfig = {
  visible: true,
  spacing: 0.1,
  color: '#475569',
  opacity: 0.3,
  showLabels: true,
  showMinor: true,
  minorSpacing: 0.025,
};

// Initial markers (pre-placed landmarks)
export const initialMarkers: MarkerData[] = [
  {
    id: 'm1', name: 'Dagupan City Center', description: 'Commercial capital of Pangasinan',
    lat: 16.0424, lng: 120.3375, shape: 'star', color: '#f59e0b', size: 14,
    label: 'DAGUPAN', layer: 'landmarks', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm2', name: 'Lingayen Capitol', description: 'Provincial capital building',
    lat: 16.0206, lng: 120.2306, shape: 'building', color: '#3b82f6', size: 12,
    label: 'LINGAYEN', layer: 'landmarks', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm3', name: 'Hundred Islands', description: 'National Park - 124 islands',
    lat: 16.10, lng: 119.98, shape: 'flag', color: '#14b8a6', size: 12,
    label: '100 ISLANDS', layer: 'landmarks', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm4', name: 'Manaoag Basilica', description: 'Our Lady of the Most Holy Rosary',
    lat: 16.0427, lng: 120.4874, shape: 'landmark', color: '#8b5cf6', size: 12,
    label: 'MANAOAG', layer: 'landmarks', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm5', name: 'Cape Bolinao Lighthouse', description: 'Historic lighthouse (1905)',
    lat: 16.39, lng: 119.89, shape: 'triangle', color: '#ef4444', size: 11,
    label: 'CAPE BOLINAO', layer: 'landmarks', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm6', name: 'San Carlos City', description: 'Most populous city',
    lat: 15.9277, lng: 120.3478, shape: 'star', color: '#f59e0b', size: 13,
    label: 'SAN CARLOS', layer: 'landmarks', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm7', name: 'Urdaneta City', description: 'Eastern commercial hub',
    lat: 15.9753, lng: 120.5670, shape: 'star', color: '#f59e0b', size: 13,
    label: 'URDANETA', layer: 'landmarks', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm8', name: 'Alaminos City', description: 'Gateway to Hundred Islands',
    lat: 16.1565, lng: 119.9804, shape: 'diamond', color: '#06b6d4', size: 11,
    label: 'ALAMINOS', layer: 'landmarks', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm9', name: 'Survey Point Alpha', description: 'Geodetic reference point',
    lat: 16.10, lng: 120.30, shape: 'cross', color: '#22c55e', size: 10,
    label: 'SP-α', layer: 'survey', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm10', name: 'Survey Point Bravo', description: 'Geodetic reference point',
    lat: 15.95, lng: 120.45, shape: 'cross', color: '#22c55e', size: 10,
    label: 'SP-β', layer: 'survey', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm11', name: 'Flood Warning Zone A', description: 'Prone to flooding during typhoons',
    lat: 15.92, lng: 120.20, shape: 'warning', color: '#f97316', size: 12,
    label: '⚠ FLOOD ZONE', layer: 'alerts', locked: false, createdAt: Date.now(),
  },
  {
    id: 'm12', name: 'Anda Peninsula', description: 'White sand beaches & caves',
    lat: 16.2900, lng: 119.9513, shape: 'flag', color: '#14b8a6', size: 11,
    label: 'ANDA', layer: 'landmarks', locked: false, createdAt: Date.now(),
  },
];

// Initial connection lines
export const initialLines: LineData[] = [
  {
    id: 'l1', fromMarkerId: 'm1', toMarkerId: 'm2', style: 'solid',
    color: '#3b82f6', width: 2, label: 'Provincial Route', showDistance: true,
    layer: 'roads', createdAt: Date.now(),
  },
  {
    id: 'l2', fromMarkerId: 'm1', toMarkerId: 'm4', style: 'dashed',
    color: '#8b5cf6', width: 2, label: 'Pilgrimage Route', showDistance: true,
    layer: 'roads', createdAt: Date.now(),
  },
  {
    id: 'l3', fromMarkerId: 'm9', toMarkerId: 'm10', style: 'measurement',
    color: '#22c55e', width: 2, label: 'Survey Baseline', showDistance: true,
    layer: 'survey', createdAt: Date.now(),
  },
  {
    id: 'l4', fromMarkerId: 'm1', toMarkerId: 'm3', style: 'arrow',
    color: '#14b8a6', width: 2, label: 'Tourism Corridor', showDistance: true,
    layer: 'roads', createdAt: Date.now(),
  },
];
