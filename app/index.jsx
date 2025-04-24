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
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, translateY]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
    colors={['#6a11cb', '#2575fc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* Top Pattern Overlay */}
      <View style={styles.patternOverlay}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
          style={styles.patternGradient}
        />
      </View>

      {/* App Logo Section */}
      <Animatable.View 
        animation="fadeIn" 
        duration={1000} 
        style={styles.logoContainer}
      >
        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/images/hi.gif')}
            style={styles.logoImage}
          />
        </View>
      </Animatable.View>

      {/* Content Card */}
      <Animatable.View
        animation="fadeInUp"
        duration={900}
        delay={200}
        style={styles.contentCard}
      >
        <Text style={styles.welcomeText}>Welcome to <Text style={styles.brandText}>LoanEasy</Text></Text>
        <Text style={styles.tagline}>
          Quick, secure loans tailored to your needs
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
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <View style={styles.arrowContainer}>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/')}
            activeOpacity={0.7}
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
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    opacity: 0.6,
  },
  patternGradient: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.08,
  },
  logoWrapper: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.38,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentCard: {
    width: width,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  brandText: {
    fontWeight: '800',
    color: '#8E54E9',
  },
  tagline: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
    marginBottom: 36,
    letterSpacing: 0.2,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#8E54E9',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#8E54E9',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  arrowContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  loginButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#8E54E9',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Index;