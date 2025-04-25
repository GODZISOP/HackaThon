import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  StatusBar,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Check if the user is already logged in when the component mounts
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedEmail) {
          router.push(`/profile?email=${encodeURIComponent(storedEmail)}`);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const baseUrl = "http://192.168.100.148:4001"; // Ensure the IP is correct
  const TIMEOUT = 30000; // Timeout in milliseconds (30 seconds)

  const handleLogin = async () => {
    if (!email || !loginCode) {
      Alert.alert('Error', 'Please enter both email and login code.');
      return;
    }

    // Validate Email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Validate Login Code format (4 digits)
    if (!loginCode || !/^\d{4}$/.test(loginCode)) {
      Alert.alert('Invalid Login Code', 'Please enter a valid 4-digit login code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await axios.post(
        `${baseUrl}/login`,
        { email, loginCode }, // Only send email and loginCode
        { timeout: TIMEOUT }
      );

      if (res.status === 200) {
        if (res.data.userId) {
          // If user ID is found, proceed with login
          Alert.alert('Login Successful', res.data.message);
          await AsyncStorage.setItem('userEmail', email);
          await AsyncStorage.setItem('userId', res.data.userId);  // Store userId

          router.push(`/profile?email=${encodeURIComponent(email)}`);
        } else {
          // Handle case where no user ID is found for this email
          Alert.alert('No User Found', 'No user ID found for this email. Please check your email or register.');
          setErrorMessage('No user ID found for this email.');
        }
      } else {
        Alert.alert('Login Failed', res.data.message || 'Login failed.');
        setErrorMessage(res.data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login Error:', error);

      if (!error.response) {
        // Network error
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        const msg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
        Alert.alert('Error', msg);
      }

      setErrorMessage(error.response?.data?.message || error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.background}
      />
      <ScrollView contentContainerStyle={styles.innerContainer}>
        {/* Centered Image at the top */}
        <Image
          source={require('../assets/images/sign.gif')} // Ensure this path is correct
          style={styles.image}
        />

        <View style={styles.formContainer}>
          <Text style={styles.header}>Welcome Back!</Text>
          <Text style={styles.subHeader}>Login to your account</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Login Code</Text>
            <TextInput
              style={styles.input}
              placeholder="4-digit code"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={loginCode}
              onChangeText={setLoginCode}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
          </View>

          {/* Show loading spinner while logging in */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Logging in...</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.forgotButtonContainer}>
            <Text style={styles.forgotButtonText}>Forgot your login code?</Text>
          </TouchableOpacity>

          {/* Show error message if login fails */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  image: {
    width: width * 0.5,
    height: 150,
    marginBottom: 20,
    borderRadius: 15,
  },
  formContainer: {
    width: width * 0.85,
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    paddingLeft: 4,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loginButton: {
    height: 55,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6a11cb',
  },
  forgotButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  errorContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 87, 87, 0.2)',
  },
  errorMessage: {
    color: '#ffdddd',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoginScreen;
