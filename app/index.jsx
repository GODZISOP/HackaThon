import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useState, useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

// Get device screen dimensions for responsiveness
const { height, width } = Dimensions.get('window');

const Index = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const router = useRouter();

  useEffect(() => {
    // Run the animations when the component is mounted
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, translateY]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.background}
      />

      {/* Image/GIF Section */}
      <Animatable.View
        animation="fadeIn"
        duration={1200}
        style={styles.imageContainer}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={require('../assets/images/hi.gif')}
            style={styles.heroImage}
          />
        </View>
      </Animatable.View>

      {/* Content card */}
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        delay={300}
        style={styles.contentCard}
      >
        <Text style={styles.welcomeText}>Welcome to LoanEasy</Text>
        <Text style={styles.tagline}>
          Your trusted partner for fast and secure loans.
        </Text>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateY }]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push('/Home')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#6a11cb" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animatable.View>
    </View>
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.05,
  },
  imageWrapper: {
    width: width * 0.9,
    height: height * 0.4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentCard: {
    width: width,
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '90%',
    shadowColor: '#6a11cb',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(106, 17, 203, 0.3)',
  },
  buttonText: {
    color: '#6a11cb',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  loginButton: {
    paddingVertical: 12,
    width: '90%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#6a11cb',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default Index;