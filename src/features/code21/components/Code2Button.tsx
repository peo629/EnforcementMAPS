import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { dispatchService } from '../api/dispatch.api';

interface Props {
  hasAssignment: boolean;
  onLogged: () => void;
}

export default function Code2Button({ hasAssignment, onLogged }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (!hasAssignment) {
      Alert.alert('No Assignment', 'You need an active zone assignment to log Code2.');
      return;
    }

    Alert.alert('Log Code2', 'Confirm you are active in the field for your assigned zone?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          setLoading(true);
          try {
            await dispatchService.logCode2();
            Alert.alert('Code2 Logged', 'Your field-active status has been recorded.');
            onLogged();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to log Code2');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={[styles.button, !hasAssignment && styles.disabled]} onPress={handlePress} disabled={loading}>
      <Text style={styles.text}>{loading ? 'Logging...' : 'Log Code2'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7C3AED',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    margin: 12,
  },
  disabled: {
    backgroundColor: '#C4B5FD',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
