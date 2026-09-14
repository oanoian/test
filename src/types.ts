export interface MarkerData {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  category: 'city' | 'beach' | 'landmark' | 'nature' | 'food' | 'custom';
  color: string;
}

export type CategoryType = MarkerData['category'];

export interface CategoryInfo {
  label: string;
  color: string;
  icon: string;
}
