import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../utilis/firebaseConfig'; // Import Firebase Firestore

const ProfileUpdatePage = () => {
  const [cnic, setCnic] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setEmail(user.email); // Use the email from Firebase Auth
      fetchUserProfile(user.uid); // Fetch user profile from Firestore
    }
  }, [user]);

  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCnic(userData.CNIC || '');
        setPhoneNumber(userData.PhoneNumber || '');
        setAddress(userData.Address || '');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
  };

  const handleProfileUpdate = async () => {
    const { uid } = user;

    if (!cnic || !phoneNumber || !address) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      // Update Firestore with the user's email, CNIC, phone number, and address
      await setDoc(doc(db, 'users', uid), {
        CNIC: cnic,
        PhoneNumber: phoneNumber,
        Address: address,
        Email: email, // You may want to store this as well if it's being changed
      }, { merge: true });

      setLoading(false);
      Alert.alert('Profile Updated', 'Your profile information has been updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
      Alert.alert('Error', 'There was an issue updating your profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="CNIC"
        value={cnic}
        onChangeText={setCnic}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={false} // Make it read-only if the email is fixed
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleProfileUpdate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Profile'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    color: '#2D3E50',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1.5,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ProfileUpdatePage;
