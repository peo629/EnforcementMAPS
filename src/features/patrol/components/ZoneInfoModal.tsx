import React from 'react';
import { Modal, Text, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { PatrolZone } from '@geo/src/zones';

interface ZoneInfoModalProps {
  zone: PatrolZone | null;
  visible: boolean;
  onClose: () => void;
}

export default function ZoneInfoModal({ zone, visible, onClose }: ZoneInfoModalProps) {
  if (!zone) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={[styles.colorDot, { backgroundColor: zone.color }]} />
            <Text style={styles.title}>{zone.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {zone.description ? (
              <Text style={styles.description}>{zone.description}</Text>
            ) : null}

            {zone.boundaries && zone.boundaries.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Boundaries</Text>
                {zone.boundaries.map((b, i) => (
                  <View key={i} style={styles.boundaryRow}>
                    <Text style={styles.compass}>{b.compass}</Text>
                    <Text style={styles.boundaryStreet}>{b.street}</Text>
                    <Text style={styles.boundaryIncluded}>
                      {b.included ? 'Included' : 'Excluded'}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            {zone.patrolStreets && zone.patrolStreets.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Patrol Streets</Text>
                {zone.patrolStreets.map((ps, i) => (
                  <View key={i} style={styles.streetRow}>
                    <Text style={styles.streetName}>{ps.street}</Text>
                    <Text style={styles.streetCoverage}>
                      {ps.coverage === 'full' ? 'Full coverage' : 'Partial'}
                    </Text>
                    {ps.segments.map((seg, j) => (
                      <Text key={j} style={styles.segmentText}>
                        {seg.from} to {seg.to}
                        {seg.to_landmark ? ` (${seg.to_landmark})` : ''}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  closeBtnText: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  description: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  boundaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#334155',
  },
  compass: {
    width: 32,
    fontSize: 12,
    fontWeight: '600',
    color: '#60A5FA',
  },
  boundaryStreet: {
    flex: 1,
    fontSize: 14,
    color: '#E5E7EB',
  },
  boundaryIncluded: {
    fontSize: 12,
    color: '#6B7280',
  },
  streetRow: {
    marginBottom: 12,
  },
  streetName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  streetCoverage: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  segmentText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 12,
    lineHeight: 18,
  },
});
