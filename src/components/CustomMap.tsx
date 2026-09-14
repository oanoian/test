import { useRef, useState, useCallback } from 'react';
import { MarkerData, LineData, MarkerShape, MapState } from '../types';
import { MARKER_SHAPES, LINE_STYLES } from '../types';
import {
  PROVINCE_BOUNDARY, PROVINCE_BOUNDS, LINGAYEN_GULF, AGNO_RIVER,
  BAYAMBANG_RIVER, FABRICATION_RIVER, CORDILLERA_RANGE, ZAMBALES_RANGE,
  HUNDRED_ISLANDS, MUNICIPALITIES, ROADS,
} from '../data';
import { latLngToSvg, svgToLatLng, pointsToPath } from '../utils/geo';

interface CustomMapProps {
  state: MapState;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (id: string) => void;
  onLineClick: (id: string) => void;
  onMarkerDrag: (id: string, lat: number, lng: number) => void;
}

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 900;
const PADDING = 60;

function renderMarkerShape(shape: MarkerShape, color: string, size: number): JSX.Element {
  const s = size;
  switch (shape) {
    case 'dot':
      return <circle cx="0" cy="0" r={s / 2} fill={color} stroke="white" strokeWidth="1.5" />;
    case 'pin':
      return (
        <g>
          <path d={`M 0 ${-s * 1.5} C ${-s * 0.6} ${-s * 1.5} ${-s} ${-s} ${-s} ${-s * 0.5} C ${-s} ${s * 0.3} 0 ${s * 0.8} 0 ${s * 0.8} C 0 ${s * 0.8} ${s} ${s * 0.3} ${s} ${-s * 0.5} C ${s} ${-s} ${s * 0.6} ${-s * 1.5} 0 ${-s * 1.5} Z`}
            fill={color} stroke="white" strokeWidth="1.5" />
          <circle cx="0" cy={-s * 0.6} r={s * 0.3} fill="white" opacity="0.8" />
        </g>
      );
    case 'landmark':
      return (
        <g>
          <rect x={-s * 0.6} y={-s * 0.3} width={s * 1.2} height={s * 0.8} fill={color} stroke="white" strokeWidth="1.5" />
          <polygon points={`0,${-s} ${-s * 0.7},${-s * 0.3} ${s * 0.7},${-s * 0.3}`} fill={color} stroke="white" strokeWidth="1.5" />
          <rect x={-s * 0.15} y={-s * 0.1} width={s * 0.3} height={s * 0.5} fill="white" opacity="0.6" />
        </g>
      );
    case 'warning':
      return (
        <g>
          <polygon points={`0,${-s} ${-s * 0.9},${s * 0.6} ${s * 0.9},${s * 0.6}`} fill={color} stroke="white" strokeWidth="2" />
          <text x="0" y={s * 0.3} textAnchor="middle" fontSize={s * 0.8} fill="white" fontWeight="bold">!</text>
        </g>
      );
    case 'alert':
      return (
        <g>
          <circle cx="0" cy="0" r={s * 0.7} fill={color} stroke="white" strokeWidth="2" />
          <circle cx="0" cy="0" r={s * 0.4} fill="white" opacity="0.3" />
          <circle cx="0" cy="0" r={s} fill="none" stroke={color} strokeWidth="1" opacity="0.5" strokeDasharray="3,2" />
        </g>
      );
    case 'grid-ref':
      return (
        <g>
          <rect x={-s * 0.5} y={-s * 0.5} width={s} height={s} fill="none" stroke={color} strokeWidth="2" />
          <line x1={-s * 0.3} y1="0" x2={s * 0.3} y2="0" stroke={color} strokeWidth="1.5" />
          <line x1="0" y1={-s * 0.3} x2="0" y2={s * 0.3} stroke={color} strokeWidth="1.5" />
        </g>
      );
    case 'cross':
      return (
        <g>
          <line x1={-s * 0.6} y1={-s * 0.6} x2={s * 0.6} y2={s * 0.6} stroke={color} strokeWidth="2.5" />
          <line x1={s * 0.6} y1={-s * 0.6} x2={-s * 0.6} y2={s * 0.6} stroke={color} strokeWidth="2.5" />
          <circle cx="0" cy="0" r={s * 0.2} fill={color} />
        </g>
      );
    case 'diamond':
      return (
        <polygon points={`0,${-s * 0.8} ${s * 0.6},0 0,${s * 0.8} ${-s * 0.6},0`}
          fill={color} stroke="white" strokeWidth="1.5" />
      );
    case 'star':
      return (
        <polygon points={Array.from({ length: 10 }, (_, i) => {
          const angle = (i * 36 - 90) * Math.PI / 180;
          const r = i % 2 === 0 ? s * 0.8 : s * 0.35;
          return `${Math.cos(angle) * r},${Math.sin(angle) * r}`;
        }).join(' ')} fill={color} stroke="white" strokeWidth="1.5" />
      );
    case 'flag':
      return (
        <g>
          <line x1="0" y1={-s} x2="0" y2={s * 0.5} stroke={color} strokeWidth="2" />
          <polygon points={`0,${-s} ${s * 0.7},${-s * 0.6} 0,${-s * 0.2}`} fill={color} />
          <circle cx="0" cy={s * 0.5} r={2} fill={color} />
        </g>
      );
    case 'circle':
      return (
        <g>
          <circle cx="0" cy="0" r={s * 0.6} fill="none" stroke={color} strokeWidth="2.5" />
          <circle cx="0" cy="0" r={s * 0.15} fill={color} />
        </g>
      );
    case 'square':
      return (
        <rect x={-s * 0.5} y={-s * 0.5} width={s} height={s} fill={color} stroke="white" strokeWidth="1.5" />
      );
    case 'triangle':
      return (
        <polygon points={`0,${-s * 0.8} ${-s * 0.7},${s * 0.5} ${s * 0.7},${s * 0.5}`}
          fill={color} stroke="white" strokeWidth="1.5" />
      );
    case 'hexagon':
      return (
        <polygon points={Array.from({ length: 6 }, (_, i) => {
          const angle = (i * 60 - 30) * Math.PI / 180;
          return `${Math.cos(angle) * s * 0.7},${Math.sin(angle) * s * 0.7}`;
        }).join(' ')} fill={color} stroke="white" strokeWidth="1.5" />
      );
    case 'building':
      return (
        <g>
          <rect x={-s * 0.5} y={-s * 0.8} width={s} height={s * 1.2} fill={color} stroke="white" strokeWidth="1.5" rx="1" />
          <rect x={-s * 0.3} y={-s * 0.6} width={s * 0.2} height={s * 0.2} fill="white" opacity="0.5" />
          <rect x={s * 0.1} y={-s * 0.6} width={s * 0.2} height={s * 0.2} fill="white" opacity="0.5" />
          <rect x={-s * 0.3} y={-s * 0.2} width={s * 0.2} height={s * 0.2} fill="white" opacity="0.5" />
          <rect x={s * 0.1} y={-s * 0.2} width={s * 0.2} height={s * 0.2} fill="white" opacity="0.5" />
          <rect x={-s * 0.15} y={s * 0.1} width={s * 0.3} height={s * 0.3} fill="white" opacity="0.5" />
        </g>
      );
    default:
      return <circle cx="0" cy="0" r={s / 2} fill={color} />;
  }
}

export default function CustomMap({ state, onMapClick, onMarkerClick, onLineClick, onMarkerDrag }: CustomMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingMarker, setDraggingMarker] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number; x: number; y: number } | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const getSvgCoords = useCallback((e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { svgX: 0, svgY: 0 };
    const scaleX = viewBox.w / rect.width;
    const scaleY = viewBox.h / rect.height;
    return {
      svgX: (e.clientX - rect.left) * scaleX + viewBox.x,
      svgY: (e.clientY - rect.top) * scaleY + viewBox.y,
    };
  }, [viewBox]);

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning || draggingMarker) return;
    const { svgX, svgY } = getSvgCoords(e);
    const { lat, lng } = svgToLatLng(svgX, svgY, MAP_WIDTH, MAP_HEIGHT, PADDING);
    onMapClick(lat, lng);
  }, [onMapClick, getSvgCoords, isPanning, draggingMarker]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.87;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = ((e.clientX - rect.left) / rect.width) * viewBox.w + viewBox.x;
    const mouseY = ((e.clientY - rect.top) / rect.height) * viewBox.h + viewBox.y;
    const newW = Math.max(150, Math.min(MAP_WIDTH * 3, viewBox.w * factor));
    const newH = Math.max(112, Math.min(MAP_HEIGHT * 3, viewBox.h * factor));
    const newX = mouseX - (mouseX - viewBox.x) * (newW / viewBox.w);
    const newY = mouseY - (mouseY - viewBox.y) * (newH / viewBox.h);
    setViewBox({ x: newX, y: newY, w: newW, h: newH });
  }, [viewBox]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || state.toolMode === 'pan' || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, [state.toolMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Update cursor position
    const { svgX, svgY } = getSvgCoords(e);
    const { lat, lng } = svgToLatLng(svgX, svgY, MAP_WIDTH, MAP_HEIGHT, PADDING);
    setCursorPos({ lat, lng, x: e.clientX, y: e.clientY });

    if (isPanning) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = (e.clientX - panStart.x) * (viewBox.w / rect.width);
      const dy = (e.clientY - panStart.y) * (viewBox.h / rect.height);
      setViewBox(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }

    if (draggingMarker) {
      const { lat, lng } = svgToLatLng(svgX, svgY, MAP_WIDTH, MAP_HEIGHT, PADDING);
      let finalLat = lat;
      let finalLng = lng;
      if (state.snapToGrid) {
        const gs = state.grid.spacing;
        finalLat = Math.round(lat / gs) * gs;
        finalLng = Math.round(lng / gs) * gs;
      }
      onMarkerDrag(draggingMarker, finalLat, finalLng);
    }
  }, [isPanning, panStart, viewBox, getSvgCoords, draggingMarker, state.snapToGrid, state.grid.spacing, onMarkerDrag]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDraggingMarker(null);
  }, []);

  const handleMarkerMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (state.toolMode === 'select') {
      e.stopPropagation();
      setDraggingMarker(id);
      onMarkerClick(id);
    }
  }, [state.toolMode, onMarkerClick]);

  // Grid lines
  const gridLines: JSX.Element[] = [];
  if (state.grid.visible) {
    const { north, south, west, east } = PROVINCE_BOUNDS;
    const gs = state.grid.spacing;
    const mgs = state.grid.minorSpacing;

    // Minor grid
    if (state.grid.showMinor) {
      for (let lat = Math.floor(south / mgs) * mgs; lat <= north; lat += mgs) {
        const p1 = latLngToSvg(lat, west, MAP_WIDTH, MAP_HEIGHT, PADDING);
        const p2 = latLngToSvg(lat, east, MAP_WIDTH, MAP_HEIGHT, PADDING);
        gridLines.push(
          <line key={`mlat-${lat}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={state.grid.color} strokeWidth="0.3" opacity={state.grid.opacity * 0.4} />
        );
      }
      for (let lng = Math.floor(west / mgs) * mgs; lng <= east; lng += mgs) {
        const p1 = latLngToSvg(north, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
        const p2 = latLngToSvg(south, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
        gridLines.push(
          <line key={`mlng-${lng}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={state.grid.color} strokeWidth="0.3" opacity={state.grid.opacity * 0.4} />
        );
      }
    }

    // Major grid
    for (let lat = Math.floor(south / gs) * gs; lat <= north; lat += gs) {
      const p1 = latLngToSvg(lat, west, MAP_WIDTH, MAP_HEIGHT, PADDING);
      const p2 = latLngToSvg(lat, east, MAP_WIDTH, MAP_HEIGHT, PADDING);
      gridLines.push(
        <line key={`lat-${lat}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={state.grid.color} strokeWidth="0.6" opacity={state.grid.opacity} />
      );
      if (state.grid.showLabels) {
        gridLines.push(
          <text key={`lat-l-${lat}`} x={p1.x - 4} y={p1.y + 3} fontSize="7"
            fill={state.grid.color} textAnchor="end" opacity="0.8">{lat.toFixed(2)}°N</text>
        );
      }
    }
    for (let lng = Math.floor(west / gs) * gs; lng <= east; lng += gs) {
      const p1 = latLngToSvg(north, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
      const p2 = latLngToSvg(south, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
      gridLines.push(
        <line key={`lng-${lng}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={state.grid.color} strokeWidth="0.6" opacity={state.grid.opacity} />
      );
      if (state.grid.showLabels) {
        gridLines.push(
          <text key={`lng-l-${lng}`} x={p1.x} y={p1.y - 4} fontSize="7"
            fill={state.grid.color} textAnchor="middle" opacity="0.8">{lng.toFixed(2)}°E</text>
        );
      }
    }
  }

  const provincePath = pointsToPath(PROVINCE_BOUNDARY, MAP_WIDTH, MAP_HEIGHT, PADDING);
  const gulfPath = pointsToPath(LINGAYEN_GULF, MAP_WIDTH, MAP_HEIGHT, PADDING);
  const riverPath = pointsToPath(AGNO_RIVER, MAP_WIDTH, MAP_HEIGHT, PADDING, false);
  const bayambangRiverPath = pointsToPath(BAYAMBANG_RIVER, MAP_WIDTH, MAP_HEIGHT, PADDING, false);
  const fabRiverPath = pointsToPath(FABRICATION_RIVER, MAP_WIDTH, MAP_HEIGHT, PADDING, false);
  const cordilleraPath = pointsToPath(CORDILLERA_RANGE, MAP_WIDTH, MAP_HEIGHT, PADDING, false);
  const zambalesPath = pointsToPath(ZAMBALES_RANGE, MAP_WIDTH, MAP_HEIGHT, PADDING, false);

  // Calculate distance between two markers
  const getDistance = (m1: MarkerData, m2: MarkerData): string => {
    const R = 6371;
    const dLat = (m2.lat - m1.lat) * Math.PI / 180;
    const dLng = (m2.lng - m1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(m1.lat * Math.PI / 180) * Math.cos(m2.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return d < 1 ? `${(d * 1000).toFixed(0)}m` : `${d.toFixed(1)}km`;
  };

  const cursorStyle = state.toolMode === 'pan' ? (isPanning ? 'grabbing' : 'grab')
    : state.toolMode === 'place-marker' ? 'crosshair'
    : state.toolMode === 'draw-line' ? 'cell'
    : state.toolMode === 'delete' ? 'not-allowed'
    : state.toolMode === 'measure' ? 'crosshair'
    : 'default';

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="w-full h-full"
        style={{ cursor: cursorStyle, userSelect: 'none' }}
        onClick={handleSvgClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setCursorPos(null); }}
      >
        <defs>
          <radialGradient id="oceanGrad" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0f2440" />
          </radialGradient>
          <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d6b4a" />
            <stop offset="50%" stopColor="#4a7c59" />
            <stop offset="100%" stopColor="#3d6b4a" />
          </linearGradient>
          <pattern id="waterPat" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M 0 10 Q 5 8 10 10 Q 15 12 20 10" stroke="#2563eb" strokeWidth="0.3" fill="none" opacity="0.3" />
          </pattern>
          <pattern id="terrainPat" patternUnits="userSpaceOnUse" width="30" height="30">
            <circle cx="5" cy="5" r="0.8" fill="#2d5a3a" opacity="0.3" />
            <circle cx="20" cy="12" r="0.6" fill="#2d5a3a" opacity="0.2" />
            <circle cx="12" cy="25" r="0.7" fill="#2d5a3a" opacity="0.25" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
          </filter>
          <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="context-stroke" />
          </marker>
        </defs>

        {/* Ocean */}
        <rect x="-200" y="-200" width={MAP_WIDTH + 400} height={MAP_HEIGHT + 400} fill="url(#oceanGrad)" />
        <rect x="-200" y="-200" width={MAP_WIDTH + 400} height={MAP_HEIGHT + 400} fill="url(#waterPat)" opacity="0.4" />

        {/* Grid */}
        {gridLines}

        {/* Gulf */}
        <path d={gulfPath} fill="#1e40af" opacity="0.35" />
        <text x={latLngToSvg(16.1, 119.7, MAP_WIDTH, MAP_HEIGHT, PADDING).x}
          y={latLngToSvg(16.1, 119.7, MAP_WIDTH, MAP_HEIGHT, PADDING).y}
          fontSize="12" fill="#60a5fa" textAnchor="middle" fontStyle="italic" opacity="0.7"
          transform={`rotate(-15, ${latLngToSvg(16.1, 119.7, MAP_WIDTH, MAP_HEIGHT, PADDING).x}, ${latLngToSvg(16.1, 119.7, MAP_WIDTH, MAP_HEIGHT, PADDING).y})`}>
          Lingayen Gulf
        </text>

        {/* Province shadow */}
        <path d={provincePath} fill="#000" opacity="0.15" transform="translate(3, 3)" />
        {/* Province land */}
        <path d={provincePath} fill="url(#landGrad)" stroke="#2d5a3a" strokeWidth="2" />
        <path d={provincePath} fill="url(#terrainPat)" />

        {/* Rivers */}
        {state.showRivers && (
          <>
            <path d={riverPath} stroke="#2563eb" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d={riverPath} stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
            <path d={bayambangRiverPath} stroke="#2563eb" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
            <path d={bayambangRiverPath} stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.6" strokeLinecap="round" />
            <path d={fabRiverPath} stroke="#2563eb" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
            <path d={fabRiverPath} stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.6" strokeLinecap="round" />
          </>
        )}

        {/* Mountains */}
        {state.showMountains && (
          <>
            <path d={cordilleraPath} stroke="#8B7355" strokeWidth="8" fill="none" opacity="0.3" strokeLinecap="round" />
            <path d={cordilleraPath} stroke="#6B5B45" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" strokeDasharray="2,6" />
            {CORDILLERA_RANGE.map(([lat, lng], i) => {
              const pos = latLngToSvg(lat, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
              return <polygon key={`c${i}`} points={`${pos.x},${pos.y - 7} ${pos.x - 5},${pos.y + 3} ${pos.x + 5},${pos.y + 3}`}
                fill="#8B7355" opacity="0.6" />;
            })}
            <path d={zambalesPath} stroke="#8B7355" strokeWidth="6" fill="none" opacity="0.3" strokeLinecap="round" />
            {ZAMBALES_RANGE.map(([lat, lng], i) => {
              const pos = latLngToSvg(lat, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
              return <polygon key={`z${i}`} points={`${pos.x},${pos.y - 5} ${pos.x - 4},${pos.y + 2} ${pos.x + 4},${pos.y + 2}`}
                fill="#8B7355" opacity="0.6" />;
            })}
          </>
        )}

        {/* Hundred Islands */}
        {HUNDRED_ISLANDS.map(([lat, lng], i) => {
          const pos = latLngToSvg(lat, lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
          return <ellipse key={`isl${i}`} cx={pos.x} cy={pos.y} rx={3 + (i % 3)} ry={2 + (i % 2)}
            fill="#5a8f6a" stroke="#2d5a3a" strokeWidth="0.5" />;
        })}

        {/* Roads */}
        {state.showRoads && ROADS.map((road, i) => {
          const path = pointsToPath(road.points, MAP_WIDTH, MAP_HEIGHT, PADDING, false);
          const roadColor = road.type === 'national' ? '#f59e0b' : road.type === 'provincial' ? '#94a3b8' : '#64748b';
          const roadWidth = road.type === 'national' ? 3 : road.type === 'provincial' ? 2 : 1;
          return (
            <g key={`road-${i}`}>
              <path d={path} stroke="#1e293b" strokeWidth={roadWidth + 1.5} fill="none" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d={path} stroke={roadColor} strokeWidth={roadWidth} fill="none" opacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
              {road.type === 'national' && (
                <path d={path} stroke="#fbbf24" strokeWidth="0.5" fill="none" opacity="0.5" strokeLinecap="round" strokeDasharray="8,8" />
              )}
            </g>
          );
        })}

        {/* Municipalities */}
        {state.showMunicipalities && MUNICIPALITIES.map((muni) => {
          const pos = latLngToSvg(muni.lat, muni.lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
          return (
            <g key={muni.name}>
              <circle cx={pos.x} cy={pos.y} r={muni.isCity ? 3.5 : 2}
                fill={muni.isCity ? '#fbbf24' : '#cbd5e1'} stroke="#1e293b" strokeWidth="0.6" />
              {state.showLabels && (
                <text x={pos.x + 5} y={pos.y + 3} fontSize={muni.isCity ? '8' : '6'}
                  fill={muni.isCity ? '#fbbf24' : '#94a3b8'} fontWeight={muni.isCity ? 'bold' : 'normal'} opacity="0.8">
                  {muni.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Province boundary highlight */}
        <path d={provincePath} fill="none" stroke="#fbbf24" strokeWidth="0.8" opacity="0.25" strokeDasharray="6,4" />

        {/* Connection Lines */}
        {state.lines.map((line) => {
          const from = state.markers.find(m => m.id === line.fromMarkerId);
          const to = state.markers.find(m => m.id === line.toMarkerId);
          if (!from || !to) return null;
          const p1 = latLngToSvg(from.lat, from.lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
          const p2 = latLngToSvg(to.lat, to.lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
          const isSelected = state.selectedLineId === line.id;
          const styleInfo = LINE_STYLES[line.style];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          return (
            <g key={line.id} onClick={(e) => { e.stopPropagation(); onLineClick(line.id); }} style={{ cursor: 'pointer' }}>
              {/* Double line effect */}
              {line.style === 'double' && (
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={line.color} strokeWidth={line.width + 4} opacity="0.3" strokeLinecap="round" />
              )}
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={line.color}
                strokeWidth={line.style === 'thick' ? line.width + 2 : line.width}
                strokeDasharray={styleInfo.dasharray}
                strokeLinecap="round"
                markerEnd={line.style === 'arrow' ? 'url(#arrowHead)' : undefined}
                opacity={isSelected ? 1 : 0.8}
                filter={isSelected ? 'url(#glow)' : undefined}
              />
              {/* Selection highlight */}
              {isSelected && (
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke="white" strokeWidth={line.width + 4} opacity="0.2" strokeLinecap="round" />
              )}
              {/* Line label */}
              {(line.label || line.showDistance) && (
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect x={-30} y={-10} width="60" height="14" rx="3" fill="rgba(15,23,42,0.85)" stroke={line.color} strokeWidth="0.5" />
                  <text x="0" y="1" textAnchor="middle" fontSize="7" fill="white">
                    {line.label}{line.showDistance ? ` (${getDistance(from, to)})` : ''}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Markers */}
        {state.markers.map((marker) => {
          const pos = latLngToSvg(marker.lat, marker.lng, MAP_WIDTH, MAP_HEIGHT, PADDING);
          const isSelected = state.selectedMarkerId === marker.id;
          const isHovered = hoveredMarker === marker.id;
          const scale = isSelected ? 1.2 : isHovered ? 1.1 : 1;

          return (
            <g key={marker.id}
              transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
              style={{ cursor: state.toolMode === 'select' ? 'move' : state.toolMode === 'delete' ? 'pointer' : 'default' }}
              onMouseDown={(e) => handleMarkerMouseDown(e, marker.id)}
              onClick={(e) => {
                e.stopPropagation();
                if (state.toolMode === 'delete') {
                  // handled by parent
                }
                onMarkerClick(marker.id);
              }}
              onMouseEnter={() => {
                setHoveredMarker(marker.id);
                setTooltip({ x: pos.x, y: pos.y - 20, text: `${marker.label || marker.name}\n${marker.lat.toFixed(4)}°N, ${marker.lng.toFixed(4)}°E` });
              }}
              onMouseLeave={() => { setHoveredMarker(null); setTooltip(null); }}
              filter={isSelected ? 'url(#glow)' : 'url(#shadow)'}
            >
              {renderMarkerShape(marker.shape, marker.color, marker.size)}
              {/* Label */}
              {marker.label && (
                <text x="0" y={marker.size + 8} textAnchor="middle" fontSize="7"
                  fill="white" fontWeight="bold" opacity="0.9"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                  {marker.label}
                </text>
              )}
              {/* Selection ring */}
              {isSelected && (
                <circle cx="0" cy="0" r={marker.size + 4} fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" strokeDasharray="4,2">
                  <animate attributeName="stroke-dashoffset" values="0;12" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* Compass Rose */}
        <g transform={`translate(${MAP_WIDTH - 70}, ${MAP_HEIGHT - 70})`}>
          <circle cx="0" cy="0" r="22" fill="rgba(15, 23, 42, 0.85)" stroke="#475569" strokeWidth="1" />
          <polygon points="0,-18 -3,-4 0,-7 3,-4" fill="#ef4444" />
          <polygon points="0,18 -3,4 0,7 3,4" fill="#64748b" />
          <polygon points="-18,0 -4,-3 -7,0 -4,3" fill="#64748b" />
          <polygon points="18,0 4,-3 7,0 4,3" fill="#64748b" />
          <text x="0" y="-23" textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="bold">N</text>
          <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
        </g>

        {/* Scale bar */}
        <g transform={`translate(${MAP_WIDTH - 180}, ${MAP_HEIGHT - 25})`}>
          <line x1="0" y1="0" x2="70" y2="0" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="70" y1="-3" x2="70" y2="3" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="35" y="-6" textAnchor="middle" fontSize="7" fill="#e2e8f0">~25 km</text>
        </g>

        {/* Title */}
        <g transform="translate(25, 25)">
          <rect width="180" height="42" rx="6" fill="rgba(15, 23, 42, 0.92)" stroke="#fbbf24" strokeWidth="1" />
          <text x="90" y="18" textAnchor="middle" fontSize="14" fill="#fbbf24" fontWeight="bold">PANGASINAN</text>
          <text x="90" y="32" textAnchor="middle" fontSize="8" fill="#94a3b8">Engineering Map System v2.0</text>
        </g>
      </svg>

      {/* Coordinate readout */}
      {cursorPos && (
        <div className="absolute bottom-4 right-4 z-20 bg-slate-900/95 backdrop-blur-sm border border-slate-600 rounded-lg px-3 py-1.5 text-xs font-mono text-green-400">
          LAT: {cursorPos.lat.toFixed(5)}°N &nbsp; LNG: {cursorPos.lng.toFixed(5)}°E
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute z-50 pointer-events-none bg-slate-800 border border-slate-500 rounded px-2 py-1 text-xs text-white whitespace-pre-line shadow-lg"
          style={{ left: '50%', top: '10px', transform: 'translateX(-50%)' }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
