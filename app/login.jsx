// LoginPage.js
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Personal Information
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  const router = useRouter();

  // Handle login and data submission
  const handleLoginAndSubmit = async () => {
    const auth = getAuth();

    try {
      // Log in with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // User data object for submission
      const userDetails = {
        email,
        name,
        address,
        phone,
      };

      // Navigate to Profile page with user details
      router.push({
        pathname: '/profile', 
        query: { userDetails: JSON.stringify(userDetails) } // Passing the data as a query parameter
      });

    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Login and Provide Your Details</Text>
      
      {/* Login Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* Personal Information */}
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleLoginAndSubmit}>
        <Text style={styles.buttonText}>Login and Submit Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1.5,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginPage;
