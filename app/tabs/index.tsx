import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PatrolMap from '@/features/patrol/components/PatrolMapLegacy';
import ActiveDispatchList from '@/features/code21/components/ActiveDispatchList';
import Code2Button from '@/features/code21/components/Code2Button';
import { useAssignment } from '@/features/patrol/hooks/useAssignment';
import { useActiveDispatches } from '@/features/code21/hooks/useActiveDispatches';

export default function MapScreen() {
  const [selectedZone, setSelectedZone] = useState<string | undefined>();
  const { assignment, refresh: refreshAssignment } = useAssignment();
  const { dispatches, acknowledge, refresh: refreshDispatches } = useActiveDispatches();

  useFocusEffect(
    useCallback(() => {
      refreshAssignment();
      refreshDispatches();
    }, [refreshAssignment, refreshDispatches])
  );

  const markers = dispatches.map((d) => ({
    id: d.id,
    latitude: d.latitude,
    longitude: d.longitude,
    title: d.addressLabel,
    type: 'code21' as const,
  }));

  return (
    <View style={styles.container}>
      {assignment && (
        <View style={[styles.banner, { backgroundColor: assignment.zoneColor || '#007AFF' }]}>
          <Text style={styles.bannerText}>Zone: {assignment.zoneName}</Text>
        </View>
      )}

      <View style={styles.mapContainer}>
        <PatrolMap markers={markers} selectedZone={selectedZone} onZonePress={(zoneId) => setSelectedZone(zoneId)} />
      </View>

      <View style={styles.bottomPanel}>
        <Code2Button hasAssignment={!!assignment} onLogged={refreshAssignment} />
        {dispatches.length > 0 && (
          <ActiveDispatchList dispatches={dispatches} onAcknowledge={acknowledge} onSelect={() => {}} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    padding: 8,
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  mapContainer: {
    flex: 1,
  },
  bottomPanel: {
    maxHeight: '40%',
    backgroundColor: '#f5f5f5',
  },
});
