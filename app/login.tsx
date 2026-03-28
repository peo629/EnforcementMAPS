import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EnforcementMAPS</Text>
      <Text style={styles.subtitle}>Login</Text>
      <Link href="/" style={styles.link}>
        Go to Patrol
      </Link>
      <Link href="/register" style={styles.link}>
        Create an account
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 32,
  },
  link: {
    fontSize: 16,
    color: '#ffd33d',
    textDecorationLine: 'underline',
    marginTop: 12,
  },
});
