import { PROVINCE_BOUNDS } from '../data';

// Convert lat/lng to SVG coordinates
// We use a simple equirectangular projection scaled to our viewport
export function latLngToSvg(
  lat: number,
  lng: number,
  width: number,
  height: number,
  padding: number = 40
): { x: number; y: number } {
  const { north, south, west, east } = PROVINCE_BOUNDS;
  
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  
  // Longitude maps to X (west to east = left to right)
  const x = padding + ((lng - west) / (east - west)) * usableWidth;
  
  // Latitude maps to Y (north to south = top to bottom, inverted)
  const y = padding + ((north - lat) / (north - south)) * usableHeight;
  
  return { x, y };
}

// Convert SVG coordinates back to lat/lng
export function svgToLatLng(
  x: number,
  y: number,
  width: number,
  height: number,
  padding: number = 40
): { lat: number; lng: number } {
  const { north, south, west, east } = PROVINCE_BOUNDS;
  
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  
  const lng = west + ((x - padding) / usableWidth) * (east - west);
  const lat = north - ((y - padding) / usableHeight) * (north - south);
  
  return { lat, lng };
}

// Convert array of lat/lng points to SVG path string
export function pointsToPath(
  points: [number, number][],
  width: number,
  height: number,
  padding: number = 40,
  closed: boolean = true
): string {
  if (points.length === 0) return '';
  
  const svgPoints = points.map(([lat, lng]) => latLngToSvg(lat, lng, width, height, padding));
  
  let path = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
  for (let i = 1; i < svgPoints.length; i++) {
    path += ` L ${svgPoints[i].x} ${svgPoints[i].y}`;
  }
  if (closed) {
    path += ' Z';
  }
  
  return path;
}

// Generate terrain noise for elevation shading
export function generateTerrainPattern(seed: number = 42): string {
  // Simple pseudo-random for terrain texture
  const random = (s: number) => {
    const x = Math.sin(s * 12.9898 + s * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  
  let circles = '';
  for (let i = 0; i < 200; i++) {
    const cx = random(i * 3.1 + seed) * 100;
    const cy = random(i * 7.3 + seed) * 100;
    const r = random(i * 11.7 + seed) * 2 + 0.5;
    const opacity = random(i * 5.1 + seed) * 0.03;
    circles += `<circle cx="${cx}%" cy="${cy}%" r="${r}" fill="#4a7c59" opacity="${opacity}"/>`;
  }
  return circles;
}
