import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

const Profile = () => {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (email) {
      fetchProfileData(email);
    } else {
      setError('Email is required');
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [userProfile]);

  const fetchProfileData = async (email) => {
    try {
      const response = await fetch(`http://localhost:4001/profile?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Profile data fetch failed');
      }
      setUserProfile(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoading(false);
      setError(error.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#8A2BE2" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.text}>Error: {error}</Text>;
  }

  if (!userProfile) {
    return <Text style={styles.text}>No profile available.</Text>;
  }

  const { name, cnic, currentInstallment, email: userEmail, profilePicture } = userProfile;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
        {/* Use the user's profile picture, or fallback to a default image */}
        <Image
          source={profilePicture ? { uri: profilePicture } : require('../assets/images/CASH.gif')}  // Fallback image should be in the correct format
          style={styles.profileImage}
          resizeMode="cover"  // Ensures the image is covered inside the circular container
        />
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: fadeAnim }]}>
        <Text style={styles.name}>{name || 'Not available'}</Text>
        <Text style={styles.email}>Email: {userEmail || email}</Text>
        <Text style={styles.cnic}>CNIC: {cnic || 'Not available'}</Text>
        <Text style={styles.installment}>Current Installment: {currentInstallment || 'Not available'}</Text>
      </Animated.View>

      {/* Loan Request Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ 
          pathname: "/loanreq", 
          params: { 
            email: userProfile.email, 
            loanAmount: "50000",  // Example value
            userId: userProfile._id // Ensure userId is included
          } 
        })}
      >
        <Text style={styles.buttonText}>Request Loan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  imageContainer: {
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  profileImage: { 
    width: 180, 
    height: 180, 
    borderRadius: 90, // Ensures the image is round
    borderWidth: 4, 
    borderColor: '#fff' 
  },
  infoContainer: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: -30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  name: { fontSize: width * 0.08, fontWeight: 'bold', color: '#8A2BE2', textAlign: 'center', marginBottom: 15 },
  email: { fontSize: width * 0.05, color: '#4B0082', marginTop: 10, textAlign: 'center' },
  cnic: { fontSize: width * 0.05, color: '#4B0082', marginTop: 10, textAlign: 'center' },
  installment: { fontSize: width * 0.05, color: '#4B0082', marginTop: 10, textAlign: 'center' },
  button: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { textAlign: 'center', fontSize: width * 0.05, color: 'red', marginTop: 20 },
});

export default Profile;
