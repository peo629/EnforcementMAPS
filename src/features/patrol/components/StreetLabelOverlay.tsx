import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StreetLabelOverlayProps {
  latitude: number;
  longitude: number;
  zoom: number;
  /** Zoom level at which labels appear — default 17 matches Google Maps street level */
  zoomThreshold?: number;
  apiKey: string;
}

interface ReverseGeocodeResult {
  streetNumber?: string;
  streetName?: string;
  suburb?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ZOOM_THRESHOLD = 17;
const DEBOUNCE_MS = 800;

// ─── Reverse Geocode ──────────────────────────────────────────────────────────

async function reverseGeocode(
  lat: number,
  lng: number,
  apiKey: string
): Promise<ReverseGeocodeResult> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&result_type=street_address|route`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocode error ${res.status}`);
  const data = await res.json();

  if (data.status !== 'OK' || !data.results?.length) {
    return {};
  }

  const components: { long_name: string; types: string[] }[] =
    data.results[0]?.address_components ?? [];

  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name;

  return {
    streetNumber: get('street_number'),
    streetName: get('route'),
    suburb: get('locality'),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StreetLabelOverlay({
  latitude,
  longitude,
  zoom,
  zoomThreshold = ZOOM_THRESHOLD,
  apiKey,
}: StreetLabelOverlayProps) {
  const [address, setAddress] = useState<ReverseGeocodeResult | null>(null);
  const [visible, setVisible] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFetchRef = useRef<string>('');

  const fetchAddress = useCallback(
    async (lat: number, lng: number) => {
      const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      if (key === lastFetchRef.current) return;
      lastFetchRef.current = key;

      try {
        const result = await reverseGeocode(lat, lng, apiKey);
        setAddress(result);
      } catch {
        // Silently fail — street labels are decorative
        setAddress(null);
      }
    },
    [apiKey]
  );

  useEffect(() => {
    const shouldShow = zoom >= zoomThreshold;
    setVisible(shouldShow);

    if (!shouldShow) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchAddress(latitude, longitude);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [latitude, longitude, zoom, zoomThreshold, fetchAddress]);

  if (!visible || !address?.streetName) return null;

  const line1 = [address.streetNumber, address.streetName]
    .filter(Boolean)
    .join(' ');
  const line2 = address.suburb ?? '';

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}
      flat={false}
    >
      <View style={styles.container}>
        <Text style={styles.streetText} numberOfLines={1}>
          {line1}
        </Text>
        {line2 ? (
          <Text style={styles.suburbText} numberOfLines={1}>
            {line2}
          </Text>
        ) : null}
        <View style={styles.tail} />
      </View>
    </Marker>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// High-contrast label: white text on dark semi-transparent background.
// Legible on both standard and satellite map styles.

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    maxWidth: 200,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
  },
  streetText: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  suburbText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
    textAlign: 'center',
  },
  tail: {
    position: 'absolute',
    bottom: -6,
    width: 10,
    height: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    transform: [{ rotate: '45deg' }],
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
