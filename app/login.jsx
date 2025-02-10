import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    console.log('Email:', email);
    console.log('Login Code:', loginCode);

    try {
      const response = await fetch('http://localhost:4001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          loginCode: loginCode,
        }),
      });

      console.log('Response Status:', response.status);
      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        Alert.alert('Login Successful', data.message);
        console.log("Navigating to profile with email:", email);
        
        // Ensure the email is passed as query param correctly
        router.push(`/profile?email=${encodeURIComponent(email)}`);
        
      } else {
        Alert.alert('Error', data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        {/* Centered Image at the top */}
        <Image
          source={require('../assets/images/sign.gif')} // Make sure to replace the path with your local image
          style={styles.image}
        />

        <Text style={styles.header}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Login to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#ddd"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your login code"
          placeholderTextColor="#ddd"
          value={loginCode}
          onChangeText={setLoginCode}
          secureTextEntry={true}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot your login code?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Grey background for the form
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '60%', // Adjust the image width to fit the screen better
    height: 150,  // Adjust height as needed
    marginBottom: 30, // Add some space below the image
    alignSelf: 'center', // Center image horizontally
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A2BE2', // Purple header text color
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subHeader: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#8A2BE2', // Purple login button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#8A2BE2',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
