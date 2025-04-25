import React from 'react';
import { View, Text, TouchableOpacity,  StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  // Use `useRouter` to navigate
import AsyncStorage from '@react-native-async-storage/async-storage';


const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage data
      await AsyncStorage.removeItem('userProfile');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userToken');

      // Navigate to the login screen
      router.replace('/login');  // Replace with your login screen path
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Are you sure you want to log out?</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Logout;
