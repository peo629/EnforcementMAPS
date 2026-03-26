/**
 * Canonical patrol zone seed data.
 * Source of truth for zone boundaries — derived from my-app/app/constants/zones.ts.
 * The server seeds the patrol_zones table from this data.
 */

export interface ZoneCoordinate {
  latitude: number;
  longitude: number;
}

export interface PatrolZoneSeed {
  id: string;
  name: string;
  color: string;
  coordinates: ZoneCoordinate[];
  center: ZoneCoordinate;
  streets?: string[];
}

export const PATROL_ZONES: PatrolZoneSeed[] = [
  {
    id: 'FLAGSTAFF',
    name: 'Flagstaff',
    color: '#FF6B6B',
    coordinates: [
      { latitude: -37.8100, longitude: 144.9525 },
      { latitude: -37.8100, longitude: 144.9600 },
      { latitude: -37.8150, longitude: 144.9600 },
      { latitude: -37.8150, longitude: 144.9525 },
    ],
    center: { latitude: -37.8125, longitude: 144.9563 },
    streets: ['William St', 'La Trobe St', 'King St', 'Dudley St'],
  },
  {
    id: 'BOURKE_NORTH',
    name: 'Bourke Street North',
    color: '#4ECDC4',
    coordinates: [
      { latitude: -37.8110, longitude: 144.9600 },
      { latitude: -37.8110, longitude: 144.9680 },
      { latitude: -37.8155, longitude: 144.9680 },
      { latitude: -37.8155, longitude: 144.9600 },
    ],
    center: { latitude: -37.8133, longitude: 144.9640 },
    streets: ['Bourke St', 'Elizabeth St', 'Swanston St', 'Russell St'],
  },
  {
    id: 'BOURKE_SOUTH',
    name: 'Bourke Street South',
    color: '#45B7D1',
    coordinates: [
      { latitude: -37.8155, longitude: 144.9600 },
      { latitude: -37.8155, longitude: 144.9680 },
      { latitude: -37.8200, longitude: 144.9680 },
      { latitude: -37.8200, longitude: 144.9600 },
    ],
    center: { latitude: -37.8178, longitude: 144.9640 },
    streets: ['Collins St', 'Elizabeth St', 'Swanston St', 'Exhibition St'],
  },
  {
    id: 'DOCKLANDS',
    name: 'Docklands',
    color: '#96CEB4',
    coordinates: [
      { latitude: -37.8130, longitude: 144.9380 },
      { latitude: -37.8130, longitude: 144.9525 },
      { latitude: -37.8200, longitude: 144.9525 },
      { latitude: -37.8200, longitude: 144.9380 },
    ],
    center: { latitude: -37.8165, longitude: 144.9453 },
    streets: ['Harbour Esplanade', 'Docklands Dr', 'Bourke St West', 'Collins St West'],
  },
  {
    id: 'SOUTHBANK',
    name: 'Southbank',
    color: '#FFEAA7',
    coordinates: [
      { latitude: -37.8200, longitude: 144.9525 },
      { latitude: -37.8200, longitude: 144.9680 },
      { latitude: -37.8260, longitude: 144.9680 },
      { latitude: -37.8260, longitude: 144.9525 },
    ],
    center: { latitude: -37.8230, longitude: 144.9603 },
    streets: ['Southbank Blvd', 'City Rd', 'Sturt St', 'Clarendon St'],
  },
  {
    id: 'CARLTON',
    name: 'Carlton',
    color: '#DDA0DD',
    coordinates: [
      { latitude: -37.8000, longitude: 144.9600 },
      { latitude: -37.8000, longitude: 144.9730 },
      { latitude: -37.8100, longitude: 144.9730 },
      { latitude: -37.8100, longitude: 144.9600 },
    ],
    center: { latitude: -37.8050, longitude: 144.9665 },
    streets: ['Rathdowne St', 'Nicholson St', 'Carlton St', 'Victoria St'],
  },
  {
    id: 'FITZROY',
    name: 'Fitzroy',
    color: '#98D8C8',
    coordinates: [
      { latitude: -37.7950, longitude: 144.9730 },
      { latitude: -37.7950, longitude: 144.9850 },
      { latitude: -37.8050, longitude: 144.9850 },
      { latitude: -37.8050, longitude: 144.9730 },
    ],
    center: { latitude: -37.8000, longitude: 144.9790 },
    streets: ['Brunswick St', 'Smith St', 'Johnston St', 'Gertrude St'],
  },
  {
    id: 'QUEEN_VIC',
    name: 'Queen Victoria Market',
    color: '#F7DC6F',
    coordinates: [
      { latitude: -37.8050, longitude: 144.9525 },
      { latitude: -37.8050, longitude: 144.9600 },
      { latitude: -37.8100, longitude: 144.9600 },
      { latitude: -37.8100, longitude: 144.9525 },
    ],
    center: { latitude: -37.8075, longitude: 144.9563 },
    streets: ['Queen St', 'Victoria St', 'Peel St', 'Franklin St'],
  },
];
