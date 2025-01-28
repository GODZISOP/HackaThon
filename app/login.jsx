import { useRouter } from 'expo-router';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utilis/firebaseConfig';
import { useState } from 'react';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setCnic] = useState(''); // New state for CNIC
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for Phone Number
  const [address, setAddress] = useState(''); // New state for Address
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const [error, setError] = useState(null); // Manage error state

  // Handle login process
  const handleLogin = async () => {
    if (!email || !password || !cnic || !phoneNumber || !address) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user.email);
      router.push('/profile'); // Navigate to the Profile page
    } catch (error) {
      console.error('Error signing in:', error.message);
      setError('Invalid email or password.'); // Show error message
    } finally {
      setIsLoading(false); // Stop loading after the process is complete
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      {/* Display error message if any */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
      />
      <TextInput
        style={styles.input}
        onChangeText={setCnic}
        placeholder="CNIC"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={cnic}
      />
      <TextInput
        style={styles.input}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phoneNumber}
      />
      <TextInput
        style={styles.input}
        onChangeText={setAddress}
        placeholder="Address"
        placeholderTextColor="#aaa"
        value={address}
      />

      {/* Show loading spinner while authenticating */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#9b59b6" style={styles.spinner} />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
          <Text style={styles.submitButtonText}>Sign In</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.link} onPress={() => router.push('/sign')}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a', // Dark background
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e6e6e6', // Light text color
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#6c3483', // Purple border color
    borderWidth: 2,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: '#2e2e2e', // Dark gray background for input
    fontSize: 16,
    color: '#e6e6e6', // Light text inside input
  },
  submitButton: {
    width: '90%',
    backgroundColor: '#8e44ad', // Vibrant purple button
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    fontSize: 16,
    color: '#9b59b6', // Soft purple color for the link
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#ff6b6b', // Light red for errors
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  spinner: {
    marginTop: 20,
  },
});

export default SignIn;
