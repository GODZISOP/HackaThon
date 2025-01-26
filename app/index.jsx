import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to LoanEasy!</Text>
      <Text style={styles.description}>
        Your trusted partner for fast and secure loans. Get started today!
      </Text>

      <TouchableOpacity style={styles.button}>
        <Link href="/Home" style={styles.linkText}>Go to Front</Link>
      </TouchableOpacity>
    </View>
  );
}

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#388E3C', // Dark green text
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#388E3C', // Dark green description text
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#388E3C', // Dark green button background
    paddingVertical: 12,
    paddingHorizontal: 64,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Adding shadow for the button
  },
  linkText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
});
