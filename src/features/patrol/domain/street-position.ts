import { getCurrentStreetPosition, type StreetPosition } from '@geo/src/streets';

export function inferStreetPosition(latitude: number, longitude: number, gpsAccuracy?: number | null): StreetPosition | null {
  return getCurrentStreetPosition(latitude, longitude, gpsAccuracy);
}
