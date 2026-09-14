import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MarkerData, CategoryType } from '../types';
import { CATEGORIES } from '../data';

interface MapViewProps {
  markers: MarkerData[];
  selectedMarker: string | null;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (id: string) => void;
  isAddingMode: boolean;
}

function createCustomIcon(color: string, category: CategoryType) {
  const categoryInfo = CATEGORIES[category];
  const icon = categoryInfo?.icon || '📍';
  
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="
          background: ${color};
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">${icon}</span>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

export default function MapView({ markers, selectedMarker, onMapClick, onMarkerClick, isAddingMode }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [16.0425, 120.2],
      zoom: 10,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add Pangasinan province boundary (simplified)
    const pangasinanBounds = L.polygon([
      [16.35, 119.80],
      [16.35, 120.75],
      [15.85, 120.75],
      [15.85, 119.80],
    ], {
      color: '#3b82f6',
      weight: 2,
      fillColor: '#3b82f6',
      fillOpacity: 0.05,
      dashArray: '5, 10',
    }).addTo(map);

    // Add label for Pangasinan
    const label = L.divIcon({
      className: 'province-label',
      html: `<div style="
        background: rgba(59, 130, 246, 0.9);
        color: white;
        padding: 4px 12px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 14px;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">PANGASINAN</div>`,
      iconSize: [120, 30],
      iconAnchor: [60, 15],
    });

    L.marker([16.1, 120.3], { icon: label, interactive: false }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers on the map
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      const icon = createCustomIcon(marker.color, marker.category);
      const leafletMarker = L.marker([marker.lat, marker.lng], { icon })
        .addTo(markersLayerRef.current!);

      leafletMarker.bindPopup(`
        <div style="min-width: 200px; font-family: system-ui;">
          <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold; color: #1e293b;">${marker.name}</h3>
          <span style="
            display: inline-block;
            background: ${marker.color}20;
            color: ${marker.color};
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 6px;
          ">${CATEGORIES[marker.category]?.label || marker.category}</span>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #475569; line-height: 1.4;">${marker.description}</p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8;">
            📍 ${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}
          </p>
        </div>
      `);

      leafletMarker.on('click', () => {
        onMarkerClick(marker.id);
      });

      // Highlight selected marker
      if (selectedMarker === marker.id) {
        leafletMarker.openPopup();
      }
    });
  }, [markers, selectedMarker, onMarkerClick]);

  // Handle map click for adding markers
  useEffect(() => {
    if (!mapRef.current) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (isAddingMode) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    };

    mapRef.current.on('click', handleClick);

    return () => {
      mapRef.current?.off('click', handleClick);
    };
  }, [isAddingMode, onMapClick]);

  // Update cursor style based on mode
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (isAddingMode) {
      mapContainerRef.current.style.cursor = 'crosshair';
    } else {
      mapContainerRef.current.style.cursor = '';
    }
  }, [isAddingMode]);

  return (
    <div ref={mapContainerRef} className="w-full h-full" />
  );
}
