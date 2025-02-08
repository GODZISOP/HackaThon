import { Link, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient backgrounds
import * as Animatable from 'react-native-animatable'; 
import { useRoute } from '@react-navigation/native';// For animations
import { useState,useEffect } from 'react';
const { height, width } = Dimensions.get('window');
  const router = useRouter();

const Index = () => {
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={['white', 'white']} // White and light purple gradient
      style={styles.container}
    >
      {/* Image/GIF Section */}
      <Animatable.View
        animation="fadeInDown"
        duration={1500}
        style={styles.header}
      >
        <Image
          source={require('../assets/images/hi.gif')} // Replace with your image
          style={styles.profileImage} // Image takes full width and no round corners
        />
      </Animatable.View>

      {/* Bottom section with curves */}
      <Animatable.View
        animation="fadeInUp"
        duration={1500}
        style={[styles.footer, { opacity: fadeAnim }]}
      >
        <Text style={styles.welcomeText}>Welcome to LoanEasy</Text>
        <Text style={styles.tagline}>Your trusted partner for fast and secure loans.</Text>

        {/* Loan Request Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/loan')} // Update route as needed
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flex: 1,  // Image takes up half of the screen (top portion)
    justifyContent: 'center', 

    alignItems: 'center', 
    marginTop: height * 0.1,
    overflow: 'hidden',  // Ensure image does not overflow outside the screen
  },
  profileImage: {
    width: width,  // Image takes full width of the screen
    height: height * 0.5,  // Height adjusted to 50% of the screen
    resizeMode: 'cover',  // Ensures the image covers the area without distortion
  },
  welcomeText: { fontSize: width * 0.08, fontWeight: 'bold', color: 'black', textAlign: 'center', marginBottom: 10 },
  tagline: { fontSize: width * 0.05, color: 'black', textAlign: 'center', paddingHorizontal: 40, lineHeight: 24 },
  footer: {
    flex: 1, // Bottom part takes up the other half of the screen
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: 'pink', // Add a white background to the footer for contrast
    borderTopLeftRadius: 50, // Curved top left corner
    borderTopRightRadius: 50, // Curved top right corner
    borderBottomLeftRadius: 30, // Curved bottom left corner
    borderBottomRightRadius: 30, // Curved bottom right corner
    shadowColor: '#000', // Shadow for visual effect
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
    elevation: 5, // Elevation for shadow on Android
  },
  button: {
    backgroundColor: 'black', // Purple button
    paddingVertical: 15,
    paddingHorizontal: width * 0.2,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: width * 0.05, fontWeight: 'bold' },
});

export default Index;
