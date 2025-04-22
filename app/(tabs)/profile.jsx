import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  StatusBar,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const BASE_URL = "http://192.168.100.144:4001";

const Profile = () => {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(50);

  // Fetch profile data from AsyncStorage
  const fetchStoredProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        // If profile exists in AsyncStorage, use it and stop loading
        setUserProfile(JSON.parse(storedProfile));
        setLoading(false);
      } else if (email) {
        // If no profile in AsyncStorage, fetch from API
        setLoading(true);  // Set loading true only when necessary
        await fetchProfileData(email);
      } else {
        setLoading(false); // No profile and no email
        setError('No profile found.');
      }
    } catch (error) {
      console.error('Error fetching stored profile:', error);
      setLoading(false); // Ensure loading is stopped even on error
      setError('Failed to fetch profile from storage.');
      if (email) {
        await fetchProfileData(email);  // Attempt to fetch profile from API if error occurs
      }
    }
  };
  
  useEffect(() => {
    fetchStoredProfile();
  }, [email]);

  useEffect(() => {
    if (userProfile) { // Only trigger animation when profile data is available
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
        }),
      ]).start();
    }
  }, [userProfile]); // Trigger animation when userProfile is updated

  const fetchProfileData = async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/api/profile?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Profile data fetch failed');
      }
      setUserProfile(data);
      setLoading(false);
      // Save fetched profile data to AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoading(false);
      setError(error.message);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProfileData(email).finally(() => setRefreshing(false));
  }, [email]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userProfile'); // Remove profile data on logout
      router.replace('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const ProfileCard = ({ icon, title, value }) => (
    <Animated.View 
      style={[
        styles.card, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY: translateY }] 
        }
      ]}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={24} color="#ffffff" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value || 'Not available'}</Text>
      </View>
    </Animated.View>
  );

  if (loading || !userProfile) {
    return (
      <View style={styles.loaderContainer}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.background}
        />
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.background}
        />
        <MaterialIcons name="error-outline" size={60} color="#ffffff" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => fetchProfileData(email)}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.background}
        />
        <MaterialIcons name="person-outline" size={60} color="#ffffff" />
        <Text style={styles.noProfileText}>No profile available.</Text>
      </View>
    );
  }

  const { name, email: userEmail, cnic, currentInstallment, profileImage } = userProfile;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.background}
      />
      
      {/* Header with logout button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#ffffff"
            colors={["#ffffff"]}
          />
        }
      >
        <Animated.View 
          style={[
            styles.profileSection, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: translateY }] 
            }
          ]}
        >
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="person" size={60} color="#6a11cb" />
              </View>
            )}
          </View>
          <Text style={styles.name}>{name || 'No Name'}</Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          <ProfileCard 
            icon="email" 
            title="Email" 
            value={userEmail || email} 
          />
          <ProfileCard 
            icon="credit-card" 
            title="CNIC" 
            value={cnic} 
          />
          <ProfileCard 
            icon="payment" 
            title="Current Installment" 
            value={currentInstallment} 
          />
          
          {/* Additional cards can be added here */}
          <ProfileCard 
            icon="event" 
            title="Member Since" 
            value="January 2024" 
          />
          <ProfileCard 
            icon="check-circle" 
            title="Status" 
            value="Active" 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImageContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#ffffff',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 15,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  noProfileText: {
    marginTop: 16,
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#6a11cb',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;