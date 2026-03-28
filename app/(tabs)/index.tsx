import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function PatrolScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Patrol screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About screen
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
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
    marginTop: 16,
  },
});
