import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();

  // Function to create/update user profile in Firestore
  const createUserProfile = async (user) => {
    try {
      const userDocRef = doc(db, "users", user.uid);

      const defaultProfile = {
        CNIC: "",
        PhoneNumber: "",
        Address: "",
        Email: user.email || "",
      };

      await setDoc(userDocRef, defaultProfile, { merge: true });
      console.log("User profile created/updated in Firestore!");
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  };

  // Function to fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setProfile(userDoc.data());
        console.log("User profile fetched:", userDoc.data());
      } else {
        console.log("No profile found for user:", uid);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User signed in:", currentUser.email);

        await createUserProfile(currentUser);
        await fetchUserProfile(currentUser.uid);
      } else {
        setUser(null);
        setProfile(null);
        console.log("No user is signed in.");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#a29bfe" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.noUserText}>No user is logged in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Profile Details</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.displayName || "N/A"}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email || "N/A"}</Text>
        <Text style={styles.label}>CNIC</Text>
        <Text style={styles.value}>{profile?.CNIC || "N/A"}</Text>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>{profile?.PhoneNumber || "N/A"}</Text>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{profile?.Address || "N/A"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e2c", // Dark background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "black", // Slightly lighter purple-black card
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Shadow for Android
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#a29bfe", // Vibrant purple for header
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dfe6e9", // Light gray for labels
    marginTop: 15,
  },
  value: {
    fontSize: 18,
    fontWeight: "400",
    color: "purple", // White for profile values
    marginTop: 5,
  },
  loadingText: {
    fontSize: 18,
    color: "#a29bfe",
    marginTop: 10,
  },
  noUserText: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
  },
});

export default ProfileScreen;
