import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { auth, db } from '../../utilis/firebaseConfig'; // Firebase config import
import { doc, getDoc } from 'firebase/firestore'; // Firebase Firestore

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userDetails, setUserDetails] = useState(null);  // To store user details from Firestore
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserInfo({
          displayName: user.displayName || 'Anonymous',
          email: user.email,
          photoURL:
            user.photoURL ||
            'https://i0.wp.com/picjumbo.com/wp-content/uploads/black-friday-images-download.jpg?w=600&quality=80',
        });

        // Fetch user details (name, address, phone) from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());  // Set fetched user details
            setBio(docSnap.data().bio || 'No bio available');
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setUserInfo(null);
        setBio('');
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6A0DAD" />
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data found. Please log in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: userInfo.photoURL }} style={styles.profileImage} />
        <Text style={styles.displayName}>{userInfo.displayName}</Text>
        <Text style={styles.bio}>{bio}</Text>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </View>

      {/* User Details */}
      <View style={styles.detailsContainer}>
        {userDetails && (
          <>
            <Text style={styles.detailsText}>Name: {userDetails.name}</Text>
            <Text style={styles.detailsText}>Address: {userDetails.address}</Text>
            <Text style={styles.detailsText}>Phone: {userDetails.phone}</Text>
          </>
        )}
      </View>

      {/* Recent Posts */}
      <ScrollView style={styles.postsContainer}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        {/* Post items can be dynamically added here */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FF', // Light purple background
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#6A0DAD', // Purple border
    marginBottom: 15,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  followButton: {
    backgroundColor: '#6A0DAD', // Purple button
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  postsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#6A0DAD',
    textAlign: 'center',
  },
});

export default Profile;
