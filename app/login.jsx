import { useRouter } from 'expo-router';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utilis/firebaseConfig';
import { useState } from 'react';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setCnic] = useState('');  // New state for CNIC
  const [phoneNumber, setPhoneNumber] = useState('');  // New state for Phone Number
  const [address, setAddress] = useState('');  // New state for Address
  const [isLoading, setIsLoading] = useState(false);  // Manage loading state
  const [error, setError] = useState(null);  // Manage error state

  // Handle login process
  const handleLogin = async () => {
    if (!email || !password || !cnic || !phoneNumber || !address) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);  // Start loading
    setError(null);  // Clear any previous errors

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user.email);
      router.push('/profile');  // Navigate to the Profile page
    } catch (error) {
      console.error('Error signing in:', error.message);
      setError("Invalid email or password.");  // Show error message
    } finally {
      setIsLoading(false);  // Stop loading after the process is complete
    }
  };

  return (
    <View style={styles.container}>
      {/* Image at the top */}
      {/* <Image source={require('path-to-your-image.png')} style={styles.image} /> */}

      <Text style={styles.title}>Log In</Text>

      {/* Display error message if any */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}  // Binding input with state
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}  // Binding input with state
      />
      <TextInput
        style={styles.input}
        onChangeText={setCnic}
        placeholder="CNIC"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={cnic}  // Binding input with state
      />
      <TextInput
        style={styles.input}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phoneNumber}  // Binding input with state
      />
      <TextInput
        style={styles.input}
        onChangeText={setAddress}
        placeholder="Address"
        placeholderTextColor="#aaa"
        value={address}  // Binding input with state
      />

      {/* Show loading spinner while authenticating */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.spinner} />
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
    backgroundColor: '#f4f4f4',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: '#000',  // Shadow for image
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',  // Green color for the title
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#4CAF50',  // Green border color for inputs
    borderWidth: 2,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    width: '90%',
    backgroundColor: '#4CAF50',  // Green background color for the button
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
    color: '#4CAF50',  // Green color for the link
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
  },
  spinner: {
    marginTop: 20,
  },
});

export default SignIn;
