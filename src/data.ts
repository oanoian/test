import { MarkerData, CategoryType } from './types';

export const CATEGORIES: Record<string, { label: string; color: string; icon: string }> = {
  city: { label: 'City / Town', color: '#3b82f6', icon: '🏙️' },
  beach: { label: 'Beach / Coast', color: '#14b8a6', icon: '🏖️' },
  landmark: { label: 'Landmark', color: '#ef4444', icon: '🏛️' },
  nature: { label: 'Nature', color: '#22c55e', icon: '🌿' },
  food: { label: 'Food / Local', color: '#f97316', icon: '🍜' },
  custom: { label: 'Custom', color: '#a855f7', icon: '📍' },
};

// Pangasinan province boundary - simplified polygon based on real coordinates
// The province is roughly bounded by:
// North: ~16.40°N (Bolinao tip)
// South: ~15.75°N (Mangatarem/Infanta)
// West: ~119.80°E (Dasol/Bolinao coast)
// East: ~120.85°E (Umingan/San Quintin)
export const PROVINCE_BOUNDS = {
  north: 16.45,
  south: 15.70,
  west: 119.75,
  east: 120.90,
};

// Province boundary polygon points (lat, lng) - traced from real geography
export const PROVINCE_BOUNDARY: [number, number][] = [
  // Starting from Bolinao cape (northwest tip) going clockwise
  [16.39, 119.89],  // Bolinao Cape
  [16.35, 119.92],
  [16.30, 119.95],  // Anda
  [16.29, 119.95],
  [16.25, 119.97],
  [16.20, 119.90],  // Bani coast
  [16.18, 119.86],
  [16.15, 119.85],
  [16.11, 119.80],  // Agno
  [16.07, 119.87],  // Burgos
  [16.06, 119.94],  // Mabini
  [16.04, 119.94],
  [16.00, 119.88],  // Dasol
  [15.95, 119.85],
  [15.90, 119.84],
  [15.83, 119.91],  // Infanta
  [15.79, 119.95],
  [15.78, 120.05],
  [15.75, 120.15],  // Southern border
  [15.78, 120.25],
  [15.80, 120.30],
  [15.82, 120.33],  // Urbiztondo
  [15.85, 120.40],
  [15.88, 120.45],
  [15.89, 120.55],
  [15.90, 120.63],  // Rosales
  [15.93, 120.70],
  [15.95, 120.75],
  [15.98, 120.81],  // San Quintin
  [16.00, 120.84],
  [16.03, 120.85],  // Eastern border (Umingan)
  [16.05, 120.80],
  [16.07, 120.76],  // San Nicolas
  [16.08, 120.70],
  [16.10, 120.65],
  [16.12, 120.58],
  [16.14, 120.55],  // Pozorrubio area
  [16.17, 120.51],  // Sison
  [16.18, 120.45],
  [16.20, 120.40],
  [16.22, 120.35],
  [16.25, 120.30],
  [16.28, 120.25],
  [16.30, 120.20],
  [16.33, 120.18],  // Lingayen Gulf coast going north
  [16.35, 120.15],
  [16.37, 120.10],
  [16.38, 120.00],
  [16.39, 119.95],
  [16.39, 119.89],  // Back to Bolinao
];

// Lingayen Gulf water boundary (simplified)
export const LINGAYEN_GULF: [number, number][] = [
  [16.39, 119.89],
  [16.35, 119.80],
  [16.30, 119.70],
  [16.20, 119.60],
  [16.10, 119.55],
  [16.00, 119.55],
  [15.90, 119.60],
  [15.80, 119.70],
  [15.75, 119.80],
  [15.78, 119.95],
  [15.83, 119.91],
  [15.90, 119.84],
  [15.95, 119.85],
  [16.00, 119.88],
  [16.06, 119.94],
  [16.11, 119.80],
  [16.15, 119.85],
  [16.18, 119.86],
  [16.20, 119.90],
  [16.25, 119.97],
  [16.29, 119.95],
  [16.30, 119.95],
  [16.35, 119.92],
  [16.39, 119.89],
];

// Agno River path (simplified)
export const AGNO_RIVER: [number, number][] = [
  [16.25, 120.45],  // Source area (Cordillera)
  [16.20, 120.40],
  [16.15, 120.35],
  [16.10, 120.32],
  [16.05, 120.30],
  [16.02, 120.28],
  [16.00, 120.25],
  [15.98, 120.22],
  [15.95, 120.20],
  [15.92, 120.18],
  [15.90, 120.15],
  [15.88, 120.12],
  [15.85, 120.10],  // Mouth at Lingayen Gulf
];

// Mountain ranges
export const CORDILLERA_RANGE: [number, number][] = [
  [16.30, 120.50],
  [16.25, 120.55],
  [16.20, 120.60],
  [16.15, 120.65],
  [16.10, 120.70],
  [16.05, 120.75],
  [16.00, 120.80],
];

export const ZAMBALES_RANGE: [number, number][] = [
  [16.10, 119.95],
  [16.05, 120.00],
  [16.00, 120.05],
  [15.95, 120.10],
  [15.90, 120.15],
  [15.85, 120.20],
  [15.80, 120.25],
];

// Hundred Islands cluster
export const HUNDRED_ISLANDS: [number, number][] = [
  [16.10, 119.97],
  [16.11, 119.98],
  [16.09, 119.99],
  [16.10, 120.00],
  [16.08, 119.98],
  [16.12, 119.96],
  [16.09, 120.01],
  [16.11, 120.02],
  [16.08, 120.00],
  [16.13, 119.95],
];

// All municipalities with coordinates
export const MUNICIPALITIES: { name: string; lat: number; lng: number; district: number; population: number }[] = [
  { name: 'Agno', lat: 16.1142, lng: 119.8028, district: 1, population: 29270 },
  { name: 'Aguilar', lat: 15.8887, lng: 120.2395, district: 2, population: 45363 },
  { name: 'Alaminos', lat: 16.1565, lng: 119.9804, district: 1, population: 100430 },
  { name: 'Alcala', lat: 15.8443, lng: 120.5213, district: 5, population: 49479 },
  { name: 'Anda', lat: 16.2900, lng: 119.9513, district: 1, population: 42688 },
  { name: 'Asingan', lat: 16.0037, lng: 120.6702, district: 6, population: 58349 },
  { name: 'Balungao', lat: 15.8983, lng: 120.6724, district: 6, population: 30678 },
  { name: 'Bani', lat: 16.1833, lng: 119.8625, district: 1, population: 52715 },
  { name: 'Basista', lat: 15.8523, lng: 120.4025, district: 2, population: 37840 },
  { name: 'Bautista', lat: 15.8111, lng: 120.4768, district: 5, population: 35728 },
  { name: 'Bayambang', lat: 15.8088, lng: 120.4540, district: 3, population: 129506 },
  { name: 'Binalonan', lat: 16.0444, lng: 120.5917, district: 5, population: 56560 },
  { name: 'Binmaley', lat: 16.0305, lng: 120.2695, district: 2, population: 88006 },
  { name: 'Bolinao', lat: 16.3856, lng: 119.8945, district: 1, population: 84658 },
  { name: 'Bugallon', lat: 15.9540, lng: 120.2149, district: 2, population: 76027 },
  { name: 'Burgos', lat: 16.0593, lng: 119.8649, district: 1, population: 23240 },
  { name: 'Calasiao', lat: 16.0089, lng: 120.3571, district: 3, population: 100686 },
  { name: 'Dagupan', lat: 16.0424, lng: 120.3375, district: 4, population: 174777 },
  { name: 'Dasol', lat: 15.9902, lng: 119.8811, district: 1, population: 31842 },
  { name: 'Infanta', lat: 15.8250, lng: 119.9056, district: 1, population: 26837 },
  { name: 'Labrador', lat: 16.0255, lng: 120.1453, district: 2, population: 26995 },
  { name: 'Laoac', lat: 16.0480, lng: 120.5471, district: 5, population: 34550 },
  { name: 'Lingayen', lat: 16.0206, lng: 120.2306, district: 2, population: 108510 },
  { name: 'Mabini', lat: 16.0698, lng: 119.9394, district: 1, population: 26589 },
  { name: 'Malasiqui', lat: 15.9191, lng: 120.4139, district: 3, population: 144344 },
  { name: 'Manaoag', lat: 16.0427, lng: 120.4874, district: 4, population: 76606 },
  { name: 'Mangaldan', lat: 16.0666, lng: 120.4010, district: 4, population: 113302 },
  { name: 'Mangatarem', lat: 15.7885, lng: 120.2938, district: 2, population: 79648 },
  { name: 'Mapandan', lat: 16.0240, lng: 120.4535, district: 3, population: 38228 },
  { name: 'Natividad', lat: 16.0427, lng: 120.7946, district: 6, population: 26721 },
  { name: 'Pozorrubio', lat: 16.1104, lng: 120.5458, district: 5, population: 75143 },
  { name: 'Rosales', lat: 15.8915, lng: 120.6331, district: 6, population: 67510 },
  { name: 'San Carlos', lat: 15.9277, lng: 120.3478, district: 3, population: 208330 },
  { name: 'San Fabian', lat: 16.1265, lng: 120.4033, district: 4, population: 87714 },
  { name: 'San Jacinto', lat: 16.0735, lng: 120.4370, district: 4, population: 44713 },
  { name: 'San Manuel', lat: 16.0643, lng: 120.6681, district: 6, population: 56876 },
  { name: 'San Nicolas', lat: 16.0703, lng: 120.7624, district: 6, population: 40144 },
  { name: 'San Quintin', lat: 15.9843, lng: 120.8131, district: 6, population: 34322 },
  { name: 'Santa Barbara', lat: 15.9999, lng: 120.4051, district: 3, population: 92420 },
  { name: 'Santa Maria', lat: 15.9792, lng: 120.7003, district: 6, population: 34452 },
  { name: 'Santo Tomas', lat: 15.8782, lng: 120.5860, district: 6, population: 14894 },
  { name: 'Sison', lat: 16.1724, lng: 120.5103, district: 5, population: 51439 },
  { name: 'Sual', lat: 16.0666, lng: 120.0951, district: 1, population: 38625 },
  { name: 'Tayug', lat: 16.0278, lng: 120.7447, district: 6, population: 45476 },
  { name: 'Umingan', lat: 15.9267, lng: 120.8406, district: 6, population: 78940 },
  { name: 'Urbiztondo', lat: 15.8232, lng: 120.3294, district: 2, population: 56349 },
  { name: 'Urdaneta', lat: 15.9753, lng: 120.5670, district: 5, population: 145935 },
  { name: 'Villasis', lat: 15.9015, lng: 120.5883, district: 5, population: 65086 },
];

export const initialMarkers: MarkerData[] = [
  {
    id: '1',
    name: 'Dagupan City',
    description: 'The commercial capital of Pangasinan, famous for Bangus (milkfish) and the annual Bangus Festival.',
    lat: 16.0424,
    lng: 120.3375,
    category: 'city',
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Lingayen (Provincial Capital)',
    description: 'The capital of Pangasinan, known for its beautiful long beach and the Lingayen Gulf.',
    lat: 16.0206,
    lng: 120.2306,
    category: 'city',
    color: '#3b82f6',
  },
  {
    id: '3',
    name: 'Hundred Islands National Park',
    description: 'A group of 124 islands in Alaminos, famous for white sand beaches and crystal clear waters.',
    lat: 16.10,
    lng: 119.98,
    category: 'beach',
    color: '#14b8a6',
  },
  {
    id: '4',
    name: 'Alaminos City',
    description: 'Gateway city to the Hundred Islands National Park.',
    lat: 16.1565,
    lng: 119.9804,
    category: 'city',
    color: '#3b82f6',
  },
  {
    id: '5',
    name: 'San Carlos City',
    description: 'The most populous city in Pangasinan, known for mangoes and Puto Calasiao.',
    lat: 15.9277,
    lng: 120.3478,
    category: 'city',
    color: '#3b82f6',
  },
  {
    id: '6',
    name: 'Urdaneta City',
    description: 'Known as the "Mabuhay City" - a major commercial center in eastern Pangasinan.',
    lat: 15.9753,
    lng: 120.5670,
    category: 'city',
    color: '#3b82f6',
  },
  {
    id: '7',
    name: 'Bolinao',
    description: 'Home to stunning beaches, Cape Bolinao Lighthouse, and the Patar Beach.',
    lat: 16.3856,
    lng: 119.8945,
    category: 'beach',
    color: '#14b8a6',
  },
  {
    id: '8',
    name: 'Manaoag Basilica',
    description: 'A famous pilgrimage site housing the Our Lady of the Most Holy Rosary (Nuestra Señora del Rosario).',
    lat: 16.0427,
    lng: 120.4874,
    category: 'landmark',
    color: '#ef4444',
  },
  {
    id: '9',
    name: 'Cape Bolinao Lighthouse',
    description: 'Historic lighthouse built in 1905, offering panoramic views of the South China Sea.',
    lat: 16.39,
    lng: 119.89,
    category: 'landmark',
    color: '#ef4444',
  },
  {
    id: '10',
    name: 'Tambobong White Beach (Dasol)',
    description: 'A pristine white sand beach in Dasol, Pangasinan with crystal clear waters.',
    lat: 15.9902,
    lng: 119.85,
    category: 'beach',
    color: '#14b8a6',
  },
  {
    id: '11',
    name: 'Bangus (Milkfish) Capital',
    description: 'Pangasinan is the milkfish capital of the Philippines. Dagupan\'s boneless bangus is world-famous!',
    lat: 16.04,
    lng: 120.36,
    category: 'food',
    color: '#f97316',
  },
  {
    id: '12',
    name: 'Puto Calasiao',
    description: 'A traditional Pangasinan delicacy - steamed rice cakes from Calasiao, soft and fluffy.',
    lat: 16.0089,
    lng: 120.3571,
    category: 'food',
    color: '#f97316',
  },
  {
    id: '13',
    name: 'Anda Peninsula',
    description: 'A beautiful peninsula with white sand beaches, caves, and rich marine biodiversity.',
    lat: 16.2900,
    lng: 119.9513,
    category: 'nature',
    color: '#22c55e',
  },
  {
    id: '14',
    name: 'Mt. Cabuyao',
    description: 'A dormant volcano offering hiking trails and scenic views of Pangasinan and the Lingayen Gulf.',
    lat: 16.05,
    lng: 120.10,
    category: 'nature',
    color: '#22c55e',
  },
  {
    id: '15',
    name: 'Agno River',
    description: 'The longest river in Pangasinan, originating from the Cordillera Mountains and flowing to Lingayen Gulf.',
    lat: 15.95,
    lng: 120.20,
    category: 'nature',
    color: '#22c55e',
  },
  {
    id: '16',
    name: 'Pozorrubio',
    description: 'A municipality known for its agricultural products and as gateway to northern Pangasinan.',
    lat: 16.1104,
    lng: 120.5458,
    category: 'city',
    color: '#3b82f6',
  },
  {
    id: '17',
    name: 'Sual Power Plant',
    description: 'The 1200 MW Sual coal-fired power plant, one of the largest in the Philippines.',
    lat: 16.0666,
    lng: 120.0951,
    category: 'landmark',
    color: '#ef4444',
  },
  {
    id: '18',
    name: 'Binalonan',
    description: 'Hometown of Carlos Bulosan, author of "America Is in the Heart". Known for the Bago Festival.',
    lat: 16.0444,
    lng: 120.5917,
    category: 'city',
    color: '#3b82f6',
  },
];
