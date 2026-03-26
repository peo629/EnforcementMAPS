import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ActiveCode21 } from '../api/dispatch.api';

interface Props {
  dispatches: ActiveCode21[];
  onAcknowledge: (id: string) => void;
  onSelect: (item: ActiveCode21) => void;
}

export default function ActiveDispatchList({ dispatches, onAcknowledge, onSelect }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPATCHED':
        return '#FFA500';
      case 'ACKNOWLEDGED':
        return '#4CAF50';
      case 'IN_PROGRESS':
        return '#2196F3';
      default:
        return '#999';
    }
  };

  const renderItem = ({ item }: { item: ActiveCode21 }) => (
    <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.address}>{item.addressLabel}</Text>
          <Text style={styles.type}>
            {item.offenceType} — {item.code21Type}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      {item.status === 'DISPATCHED' && (
        <TouchableOpacity style={styles.ackButton} onPress={() => onAcknowledge(item.id)}>
          <Text style={styles.ackButtonText}>Acknowledge</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={dispatches}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No active dispatches</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  address: { fontSize: 15, fontWeight: '600' },
  type: { fontSize: 13, color: '#666', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  description: { fontSize: 13, color: '#555', marginBottom: 8 },
  ackButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  ackButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  empty: { alignItems: 'center', padding: 30 },
  emptyText: { fontSize: 15, color: '#999' },
});
