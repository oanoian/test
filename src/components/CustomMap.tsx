import { useRef, useState, useCallback } from 'react';
import { MarkerData } from '../types';
import {
  PROVINCE_BOUNDARY,
  PROVINCE_BOUNDS,
  LINGAYEN_GULF,
  AGNO_RIVER,
  CORDILLERA_RANGE,
  ZAMBALES_RANGE,
  HUNDRED_ISLANDS,
  MUNICIPALITIES,
  CATEGORIES,
} from '../data';
import { latLngToSvg, svgToLatLng, pointsToPath } from '../utils/geo';

interface CustomMapProps {
  markers: MarkerData[];
  selectedMarker: string | null;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (id: string) => void;
  isAddingMode: boolean;
  showMunicipalities: boolean;
  showLabels: boolean;
  showRivers: boolean;
  showMountains: boolean;
}

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 900;
const PADDING = 60;

export default function CustomMap({
  markers,
  selectedMarker,
  onMapClick,
  onMarkerClick,
  isAddingMode,
  showMunicipalities,
  showLabels,
  showRivers,
  showMountains,
}: CustomMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; marker: MarkerData } | null>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleSvgClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || isPanning) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = viewBox.w / rect.width;
      const scaleY = viewBox.h / rect.height;
      const svgX = (e.clientX - rect.left) * scaleX + viewBox.x;
      const svgY = (e.clientY - rect.top) * scaleY + viewBox.y;
      
      const { lat, lng } = svgToLatLng(svgX, svgY, MAP_WIDTH, MAP_HEIGHT, PADDING);
      onMapClick(lat, lng);
    },
    [onMapClick, viewBox, isPanning]
  );

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = ((e.clientX - rect.left) / rect.width) * viewBox.w + viewBox.x;
    const mouseY = ((e.clientY - rect.top) / rect.height) * viewBox.h + viewBox.y;
    
    const newW = Math.max(200, Math.min(MAP_WIDTH * 2, viewBox.w * factor));
    const newH = Math.max(150, Math.min(MAP_HEIGHT * 2, viewBox.h * factor));
    
    const newX = mouseX - (mouseX - viewBox.x) * (newW / viewBox.w);
    const newY = mouseY - (mouseY - viewBox.y) * (newH / viewBox.h);
    
    setViewBox({ x: newX, y: newY, w: newW, h: newH });
  }, [viewBox]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const dx = (e.clientX - panStart.x) * (viewBox.w / rect.width);
    const dy = (e.clientY - panStart.y) * (viewBox.h / rect.height);
    
    setViewBox(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
    setPanStart({ x: e.clientX, y: e.clientY });
  }, [isPanning, panStart, viewBox]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Generate grid lines
  const gridLines = [];
  for (let lat = 15.5; lat <= 16.5; lat += 0.25) {
    const p1 = latLngToSvg(lat, PROVINCE_BOUNDS.west, MAP_WIDTH, MAP_HEIGHT, PADDING);
    const p2 = latLngToSvg(lat, PROVINCE_BOUNDS.east, MAP_WIDTH, MAP_HEIGHT, PADDING);
    gridLines.push(
      <line key={`lat-${lat}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.3" />
    );
    gridLines.push(
      <text key={`lat-label-${lat}`} x={p1.x - 5} y={p1.y + 3} fontSize="8" fill="#64748b" textAnchor="end">{lat.toFixed(2)}°N</text>
    );
  }
  for (let lng = 119.5; lng <= 121.0; lng += 0.25) {
    const p1 = latLngToSvg(PROVINCE_BOUNDS.north, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
    const p2 = latLngToSvg(PROVINCE_BOUNDS.south, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
    gridLines.push(
      <line key={`lng-${lng}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.3" />
    );
    gridLines.push(
      <text key={`lng-label-${lng}`} x={p1.x} y={p1.y - 5} fontSize="8" fill="#64748b" textAnchor="middle">{lng.toFixed(2)}°E</text>
    );
  }

  // Province boundary path
  const provincePath = pointsToPath(PROVINCE_BOUNDARY, MAP_WIDTH, MAP_HEIGHT, PADDING);
  
  // Lingayen Gulf path (water area)
  const gulfPath = pointsToPath(LINGAYEN_GULF, MAP_WIDTH, MAP_HEIGHT, PADDING);
  
  // River path
  const riverPath = pointsToPath(AGNO_RIVER, MAP_WIDTH, MAP_HEIGHT, PADDING, false);
  
  // Mountain range paths
  const cordilleraPath = pointsToPath(CORDILLERA_RANGE, MAP_WIDTH, MAP_HEIGHT, PADDING, false);
  const zambalesPath = pointsToPath(ZAMBALES_RANGE, MAP_WIDTH, MAP_HEIGHT, PADDING, false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className={`w-full h-full ${isAddingMode ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onClick={handleSvgClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ userSelect: 'none' }}
      >
        <defs>
          {/* Ocean gradient */}
          <radialGradient id="oceanGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#1a365d" />
            <stop offset="100%" stopColor="#0f2440" />
          </radialGradient>
          
          {/* Land gradient */}
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a7c59" />
            <stop offset="30%" stopColor="#5a8f6a" />
            <stop offset="60%" stopColor="#6ba37a" />
            <stop offset="100%" stopColor="#4d8b5e" />
          </linearGradient>
          
          {/* Mountain gradient */}
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="100%" stopColor="#6B5B45" />
          </linearGradient>

          {/* Water pattern */}
          <pattern id="waterPattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M 0 10 Q 5 8 10 10 Q 15 12 20 10" stroke="#2563eb" strokeWidth="0.3" fill="none" opacity="0.3"/>
          </pattern>

          {/* Terrain texture */}
          <pattern id="terrainTexture" patternUnits="userSpaceOnUse" width="40" height="40">
            <circle cx="5" cy="5" r="1" fill="#3d6b4a" opacity="0.3"/>
            <circle cx="25" cy="15" r="0.8" fill="#3d6b4a" opacity="0.2"/>
            <circle cx="15" cy="30" r="1.2" fill="#3d6b4a" opacity="0.25"/>
            <circle cx="35" cy="35" r="0.6" fill="#3d6b4a" opacity="0.2"/>
          </pattern>

          {/* Drop shadow filter */}
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
          </filter>

          {/* Glow filter for selected markers */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Marker pin shape */}
          <symbol id="markerPin" viewBox="0 0 24 36">
            <path d="M12 0 C5.4 0 0 5.4 0 12 C0 21 12 36 12 36 C12 36 24 21 24 12 C24 5.4 18.6 0 12 0 Z" />
            <circle cx="12" cy="12" r="6" fill="white" opacity="0.9"/>
          </symbol>
        </defs>

        {/* Ocean background */}
        <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#oceanGradient)" />
        
        {/* Water wave pattern overlay */}
        <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#waterPattern)" opacity="0.5" />

        {/* Grid lines */}
        {gridLines}

        {/* Lingayen Gulf water area */}
        <path d={gulfPath} fill="#1e40af" opacity="0.4" />
        <text 
          x={latLngToSvg(16.1, 119.7, MAP_WIDTH, MAP_HEIGHT, PADDING).x}
          y={latLngToSvg(16.1, 119.7, MAP_WIDTH, MAP_HEIGHT, PADDING).y}
          fontSize="14" 
          fill="#60a5fa" 
          textAnchor="middle"
          fontStyle="italic"
          opacity="0.8"
          transform={`rotate(-15, ${latLngToSvg(16.1, 119.7, MAP_WIDTH, MAP_HEIGHT, PADDING).x}, ${latLngToSvg(16.1, 119.7, MAP_WIDTH, MAP_HEIGHT, PADDING).y})`}
        >
          Lingayen Gulf
        </text>

        {/* West Philippine Sea label */}
        <text
          x={latLngToSvg(16.0, 119.82, MAP_WIDTH, MAP_HEIGHT, PADDING).x - 30}
          y={latLngToSvg(16.0, 119.82, MAP_WIDTH, MAP_HEIGHT, PADDING).y}
          fontSize="11"
          fill="#60a5fa"
          textAnchor="middle"
          fontStyle="italic"
          opacity="0.6"
          transform={`rotate(-75, ${latLngToSvg(16.0, 119.82, MAP_WIDTH, MAP_HEIGHT, PADDING).x - 30}, ${latLngToSvg(16.0, 119.82, MAP_WIDTH, MAP_HEIGHT, PADDING).y})`}
        >
          West Philippine Sea
        </text>

        {/* Province land mass - shadow */}
        <path d={provincePath} fill="#000" opacity="0.2" transform="translate(3, 3)" />
        
        {/* Province land mass */}
        <path d={provincePath} fill="url(#landGradient)" stroke="#2d5a3a" strokeWidth="2" />
        
        {/* Terrain texture overlay */}
        <path d={provincePath} fill="url(#terrainTexture)" />

        {/* Elevation shading - flat plains area */}
        <ellipse 
          cx={latLngToSvg(15.95, 120.35, MAP_WIDTH, MAP_HEIGHT, PADDING).x}
          cy={latLngToSvg(15.95, 120.35, MAP_WIDTH, MAP_HEIGHT, PADDING).y}
          rx="120" ry="80"
          fill="#7cb88a" opacity="0.2"
        />

        {/* Mountain ranges */}
        {showMountains && (
          <>
            {/* Cordillera Mountains (NE) */}
            <path d={cordilleraPath} stroke="#8B7355" strokeWidth="8" fill="none" opacity="0.4" strokeLinecap="round" />
            <path d={cordilleraPath} stroke="#6B5B45" strokeWidth="4" fill="none" opacity="0.6" strokeLinecap="round" strokeDasharray="2,6" />
            {/* Mountain symbols */}
            {CORDILLERA_RANGE.map(([lat, lng], i) => {
              const pos = latLngToSvg(lat, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
              return (
                <g key={`cord-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <polygon points="0,-8 -6,4 6,4" fill="#8B7355" opacity="0.7" />
                  <polygon points="0,-5 -3,2 3,2" fill="#a08060" opacity="0.5" />
                </g>
              );
            })}
            <text
              x={latLngToSvg(16.15, 120.65, MAP_WIDTH, MAP_HEIGHT, PADDING).x}
              y={latLngToSvg(16.15, 120.65, MAP_WIDTH, MAP_HEIGHT, PADDING).y}
              fontSize="9" fill="#8B7355" textAnchor="middle" fontWeight="bold" opacity="0.8"
            >
              Cordillera Central
            </text>

            {/* Zambales Mountains (W) */}
            <path d={zambalesPath} stroke="#8B7355" strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round" />
            <path d={zambalesPath} stroke="#6B5B45" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" strokeDasharray="2,5" />
            {ZAMBALES_RANGE.map(([lat, lng], i) => {
              const pos = latLngToSvg(lat, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
              return (
                <g key={`zam-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  <polygon points="0,-6 -5,3 5,3" fill="#8B7355" opacity="0.7" />
                </g>
              );
            })}
            <text
              x={latLngToSvg(15.95, 120.05, MAP_WIDTH, MAP_HEIGHT, PADDING).x}
              y={latLngToSvg(15.95, 120.05, MAP_WIDTH, MAP_HEIGHT, PADDING).y}
              fontSize="9" fill="#8B7355" textAnchor="middle" fontWeight="bold" opacity="0.8"
              transform={`rotate(-60, ${latLngToSvg(15.95, 120.05, MAP_WIDTH, MAP_HEIGHT, PADDING).x}, ${latLngToSvg(15.95, 120.05, MAP_WIDTH, MAP_HEIGHT, PADDING).y})`}
            >
              Zambales Mts.
            </text>
          </>
        )}

        {/* Rivers */}
        {showRivers && (
          <>
            <path d={riverPath} stroke="#3b82f6" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
            <path d={riverPath} stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round" />
            <text
              x={latLngToSvg(15.92, 120.18, MAP_WIDTH, MAP_HEIGHT, PADDING).x + 10}
              y={latLngToSvg(15.92, 120.18, MAP_WIDTH, MAP_HEIGHT, PADDING).y}
              fontSize="9" fill="#3b82f6" fontStyle="italic" opacity="0.8"
              transform={`rotate(-30, ${latLngToSvg(15.92, 120.18, MAP_WIDTH, MAP_HEIGHT, PADDING).x + 10}, ${latLngToSvg(15.92, 120.18, MAP_WIDTH, MAP_HEIGHT, PADDING).y})`}
            >
              Agno River
            </text>
          </>
        )}

        {/* Hundred Islands */}
        {HUNDRED_ISLANDS.map(([lat, lng], i) => {
          const pos = latLngToSvg(lat, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
          const rx = 4 + ((i * 7 + 3) % 5);
          const ry = 3 + ((i * 5 + 2) % 4);
          return (
            <g key={`island-${i}`}>
              <ellipse cx={pos.x} cy={pos.y} rx={rx} ry={ry} fill="#5a8f6a" stroke="#2d5a3a" strokeWidth="0.5" />
            </g>
          );
        })}
        <text
          x={latLngToSvg(16.10, 119.98, MAP_WIDTH, MAP_HEIGHT, PADDING).x}
          y={latLngToSvg(16.10, 119.98, MAP_WIDTH, MAP_HEIGHT, PADDING).y - 15}
          fontSize="8" fill="#60a5fa" textAnchor="middle" fontStyle="italic"
        >
          Hundred Islands
        </text>

        {/* Municipality dots and labels */}
        {showMunicipalities && MUNICIPALITIES.map((muni) => {
          const pos = latLngToSvg(muni.lat, muni.lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
          const isCity = muni.population > 100000;
          return (
            <g key={muni.name}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isCity ? 4 : 2.5}
                fill={isCity ? '#fbbf24' : '#e2e8f0'}
                stroke="#1e293b"
                strokeWidth="0.8"
              />
              {showLabels && (
                <text
                  x={pos.x + 6}
                  y={pos.y + 3}
                  fontSize={isCity ? '9' : '7'}
                  fill={isCity ? '#fbbf24' : '#cbd5e1'}
                  fontWeight={isCity ? 'bold' : 'normal'}
                  opacity="0.9"
                >
                  {muni.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Province boundary highlight */}
        <path d={provincePath} fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" strokeDasharray="8,4" />

        {/* Custom Markers */}
        {markers.map((marker) => {
          const pos = latLngToSvg(marker.lat, marker.lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
          const isSelected = selectedMarker === marker.id;
          const isHovered = hoveredMarker === marker.id;
          const scale = isSelected ? 1.3 : isHovered ? 1.15 : 1;
          
          return (
            <g
              key={marker.id}
              transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
              style={{ cursor: 'pointer', transformOrigin: `${pos.x}px ${pos.y}px` }}
              onClick={(e) => { e.stopPropagation(); onMarkerClick(marker.id); }}
              onMouseEnter={(e) => {
                setHoveredMarker(marker.id);
                const rect = svgRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltip({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top - 40,
                    marker,
                  });
                }
              }}
              onMouseLeave={() => {
                setHoveredMarker(null);
                setTooltip(null);
              }}
              filter={isSelected ? 'url(#glow)' : undefined}
            >
              {/* Marker shadow */}
              <ellipse cx="0" cy="2" rx="6" ry="2" fill="#000" opacity="0.3" />
              
              {/* Marker pin */}
              <path
                d="M 0 -24 C -8 -24 -12 -18 -12 -12 C -12 -4 0 4 0 4 C 0 4 12 -4 12 -12 C 12 -18 8 -24 0 -24 Z"
                fill={marker.color}
                stroke="white"
                strokeWidth="1.5"
              />
              
              {/* Inner circle */}
              <circle cx="0" cy="-14" r="5" fill="white" opacity="0.9" />
              
              {/* Category icon */}
              <text
                x="0"
                y="-11"
                textAnchor="middle"
                fontSize="7"
                dominantBaseline="middle"
              >
                {CATEGORIES[marker.category]?.icon || '📍'}
              </text>

              {/* Selection ring */}
              {isSelected && (
                <circle cx="0" cy="-14" r="16" fill="none" stroke={marker.color} strokeWidth="2" opacity="0.6" strokeDasharray="4,2">
                  <animate attributeName="stroke-dashoffset" values="0;12" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* Compass Rose */}
        <g transform={`translate(${MAP_WIDTH - 80}, ${MAP_HEIGHT - 80})`}>
          <circle cx="0" cy="0" r="25" fill="rgba(15, 23, 42, 0.8)" stroke="#475569" strokeWidth="1" />
          <polygon points="0,-20 -4,-5 0,-8 4,-5" fill="#ef4444" />
          <polygon points="0,20 -4,5 0,8 4,5" fill="#94a3b8" />
          <polygon points="-20,0 -5,-4 -8,0 -5,4" fill="#94a3b8" />
          <polygon points="20,0 5,-4 8,0 5,4" fill="#94a3b8" />
          <text x="0" y="-26" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">N</text>
          <text x="0" y="32" textAnchor="middle" fontSize="7" fill="#94a3b8">S</text>
          <text x="-28" y="3" textAnchor="middle" fontSize="7" fill="#94a3b8">W</text>
          <text x="28" y="3" textAnchor="middle" fontSize="7" fill="#94a3b8">E</text>
          <circle cx="0" cy="0" r="3" fill="#fbbf24" />
        </g>

        {/* Scale bar */}
        <g transform={`translate(${MAP_WIDTH - 200}, ${MAP_HEIGHT - 30})`}>
          <line x1="0" y1="0" x2="80" y2="0" stroke="#e2e8f0" strokeWidth="2" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#e2e8f0" strokeWidth="2" />
          <line x1="80" y1="-4" x2="80" y2="4" stroke="#e2e8f0" strokeWidth="2" />
          <text x="40" y="-8" textAnchor="middle" fontSize="8" fill="#e2e8f0">~25 km</text>
        </g>

        {/* Title cartouche */}
        <g transform={`translate(30, 30)`}>
          <rect x="0" y="0" width="200" height="50" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="100" y="22" textAnchor="middle" fontSize="16" fill="#fbbf24" fontWeight="bold">PANGASINAN</text>
          <text x="100" y="38" textAnchor="middle" fontSize="9" fill="#94a3b8">Province of the Philippines</text>
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 bg-slate-800 border border-slate-600 rounded-lg shadow-xl px-3 py-2 max-w-[250px]"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          <div className="flex items-center gap-2">
            <span>{CATEGORIES[tooltip.marker.category]?.icon}</span>
            <span className="text-white font-semibold text-sm">{tooltip.marker.name}</span>
          </div>
          <p className="text-slate-300 text-xs mt-1 line-clamp-2">{tooltip.marker.description}</p>
          <p className="text-slate-500 text-xs mt-1">
            {tooltip.marker.lat.toFixed(4)}°N, {tooltip.marker.lng.toFixed(4)}°E
          </p>
        </div>
      )}
    </div>
  );
}
