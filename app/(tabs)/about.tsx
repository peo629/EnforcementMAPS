import { Text, View, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EnforcementMAPS</Text>
      <Text style={styles.subtitle}>Municipal Area Patrol System</Text>
      <Text style={styles.version}>Version 1.0.0</Text>
      <Text style={styles.description}>
        City of Melbourne \u2014 Parking Enforcement
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  version: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 8,
  },
  description: {
    color: '#374151',
    fontSize: 12,
    marginTop: 24,
  },
});
