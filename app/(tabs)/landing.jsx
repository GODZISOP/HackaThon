import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  StatusBar,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LandingPage = () => {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const navigateTo = (screen) => {
    router.push(`/${screen}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={['#4776E6', '#8E54E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>LoanEasy</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.scrollView, { opacity: fadeAnim }]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#4776E6', '#8E54E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBackground}
          >
            <View style={styles.heroContent}>
             
              <Text style={styles.heroTitle}>Financial Freedom at Your Fingertips</Text>
              <Text style={styles.heroSubtitle}>Fast, secure loans tailored to your needs</Text>
              
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => navigateTo('getStarted')}
              >
                <Text style={styles.heroButtonText}>Get Started</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#6a11cb" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Feature Cards */}
        <View style={styles.featureCardsContainer}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          
          <View style={styles.featureCards}>
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => navigateTo('loans')}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(106, 17, 203, 0.1)' }]}>
                <FontAwesome5 name="hand-holding-usd" size={22} color="#6a11cb" />
              </View>
              <Text style={styles.featureTitle}>Quick Loans</Text>
              <Text style={styles.featureDescription}>Get approved in minutes with minimal documentation</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => navigateTo('microfinance')}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(37, 117, 252, 0.1)' }]}>
                <FontAwesome5 name="coins" size={22} color="#2575fc" />
              </View>
              <Text style={styles.featureTitle}>Microfinance</Text>
              <Text style={styles.featureDescription}>Small business solutions to help you grow</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.featureCards}>
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => navigateTo('savings')}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(10, 186, 181, 0.1)' }]}>
                <FontAwesome5 name="piggy-bank" size={22} color="#0abab5" />
              </View>
              <Text style={styles.featureTitle}>Savings</Text>
              <Text style={styles.featureDescription}>Smart saving plans with competitive interest rates</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => navigateTo('advisor')}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(252, 82, 37, 0.1)' }]}>
                <FontAwesome5 name="chart-line" size={22} color="#fc5225" />
              </View>
              <Text style={styles.featureTitle}>Financial Advisor</Text>
              <Text style={styles.featureDescription}>Get expert advice on your financial decisions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Options Section */}
        <View style={styles.userOptionsContainer}>
          <Text style={styles.sectionTitle}>Account Access</Text>
          
          <View style={styles.userOptionsWrapper}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.userOptionsGradient}
            >
              <TouchableOpacity 
                style={styles.userOptionButton}
                onPress={() => navigateTo('login')}
              >
                <Ionicons name="log-in-outline" size={24} color="#fff" />
                <Text style={styles.userOptionText}>Login</Text>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" style={styles.userOptionArrow} />
              </TouchableOpacity>
              
              <View style={styles.userOptionDivider} />
              
              <TouchableOpacity 
                style={styles.userOptionButton}
                onPress={() => navigateTo('register')}
              >
                <Ionicons name="person-add-outline" size={24} color="#fff" />
                <Text style={styles.userOptionText}>Register</Text>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" style={styles.userOptionArrow} />
              </TouchableOpacity>
              
              <View style={styles.userOptionDivider} />
              
              <TouchableOpacity 
                style={styles.userOptionButton}
                onPress={() => navigateTo('profile')}
              >
                <Ionicons name="person-circle-outline" size={24} color="#fff" />
                <Text style={styles.userOptionText}>Profile</Text>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" style={styles.userOptionArrow} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Why Choose Us Section */}
        <View style={styles.whyChooseUsContainer}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          
          <View style={styles.whyChooseUsCard}>
            <View style={styles.whyChooseUsItem}>
              <View style={styles.whyChooseUsIconCircle}>
                <Ionicons name="flash-outline" size={22} color="#fff" />
              </View>
              <View style={styles.whyChooseUsTextContainer}>
                <Text style={styles.whyChooseUsTitle}>Fast Processing</Text>
                <Text style={styles.whyChooseUsDescription}>Get your loan approved within minutes, not days</Text>
              </View>
            </View>
            
            <View style={styles.whyChooseUsItem}>
              <View style={styles.whyChooseUsIconCircle}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
              </View>
              <View style={styles.whyChooseUsTextContainer}>
                <Text style={styles.whyChooseUsTitle}>Secure & Safe</Text>
                <Text style={styles.whyChooseUsDescription}>Bank-level security protocols for all transactions</Text>
              </View>
            </View>
            
            <View style={styles.whyChooseUsItem}>
              <View style={styles.whyChooseUsIconCircle}>
                <Ionicons name="cash-outline" size={22} color="#fff" />
              </View>
              <View style={styles.whyChooseUsTextContainer}>
                <Text style={styles.whyChooseUsTitle}>Low Interest Rates</Text>
                <Text style={styles.whyChooseUsDescription}>Competitive rates tailored to your credit profile</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaContainer}>
          <LinearGradient
            colors={['#4776E6', '#8E54E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
            <Text style={styles.ctaSubtitle}>Join thousands of satisfied customers</Text>
            
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigateTo('apply')}
            >
              <Text style={styles.ctaButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 LoanEasy. All rights reserved.</Text>
          <Text style={styles.footerSubtext}>Secure • Reliable • Fast</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    width: width,
    height: height * 0.5,
  },
  heroBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
    width: '100%',
  },
  heroLogo: {
    width: width * 0.4,
    height: 60,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
  },
  heroButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  heroButtonText: {
    color: '#6a11cb',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  featureCardsContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  featureCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  userOptionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
  },
  userOptionsWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  userOptionsGradient: {
    backgroundColor: '#6a11cb',
    borderRadius: 20,
    padding: 5,
  },
  userOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  userOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
    flex: 1,
  },
  userOptionArrow: {
    opacity: 0.7,
  },
  userOptionDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  whyChooseUsContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  whyChooseUsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  whyChooseUsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  whyChooseUsIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6a11cb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whyChooseUsTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  whyChooseUsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  whyChooseUsDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ctaContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  ctaGradient: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 25,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  ctaButtonText: {
    color: '#6a11cb',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default LandingPage;