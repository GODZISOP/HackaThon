import React, { useState, useEffect, useRef } from 'react';
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
const BASE_URL = "http://192.168.100.148:4001";

const Profile = () => {
  const { email: routeEmail } = useLocalSearchParams();
  console.log("🔍 Route email param:", routeEmail);

  const router = useRouter();
  const [resolvedEmail, setResolvedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  console.log('Created At:', createdAt); // Debugging createdAt value


  // Load cache then revalidate
  useEffect(() => {
    (async () => {
      let userEmail = routeEmail || await AsyncStorage.getItem('userEmail');
      if (userEmail) {
        setResolvedEmail(userEmail);
        const cache = await AsyncStorage.getItem('userProfile');
        if (cache) {
          setUserProfile(JSON.parse(cache));
          setLoading(false);
        }
        fetchProfileData(userEmail);
      } else {
        setError('No email provided.');
        setLoading(false);
      }
    })();
  }, [routeEmail]);

  useEffect(() => {
    if (userProfile) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start();
    }
  }, [userProfile]);

  const fetchProfileData = async (email) => {
    try {
      console.log('Fetching profile for:', email);
      const response = await fetch(`${BASE_URL}/api/profile?email=${encodeURIComponent(email)}`);
      console.log(`HTTP ${response.status} ${response.statusText}`);
      const raw = await response.text();
      console.log('Raw response body:', raw);
      const data = JSON.parse(raw);
      if (!response.ok) throw new Error(data.message || 'Profile fetch failed');
      console.log('Parsed profile data:', data);  // Check here if createdAt exists in the response
      setUserProfile(data);
      await AsyncStorage.setItem('userProfile', JSON.stringify(data));
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  

  const onRefresh = React.useCallback(() => {
    if (resolvedEmail) {
      setRefreshing(true);
      fetchProfileData(resolvedEmail);
    }
  }, [resolvedEmail]);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['userEmail', 'userProfile']);
    router.replace('/login');
  };

  const ProfileCard = ({ icon, title, value }) => (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY }] }] }>
      <View style={styles.iconContainer}><MaterialIcons name={icon} size={24} color="#fff"/></View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value ?? 'Not available'}</Text>
      </View>
    </Animated.View>
  );

  if (loading && !userProfile) return (
    <View style={styles.loaderContainer}>
      <LinearGradient colors={['#6a11cb','#2575fc']} style={styles.background}/>
      <ActivityIndicator size="large" color="#fff"/>
      <Text style={styles.loadingText}>Loading profile...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.errorContainer}>
      <LinearGradient colors={['#6a11cb','#2575fc']} style={styles.background}/>
      <MaterialIcons name="error-outline" size={60} color="#fff"/>
      <Text style={styles.errorText}>Error: {error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => fetchProfileData(resolvedEmail)}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (!userProfile) return (
    <View style={styles.errorContainer}>
      <LinearGradient colors={['#6a11cb','#2575fc']} style={styles.background}/>
      <MaterialIcons name="person-outline" size={60} color="#fff"/>
      <Text style={styles.noProfileText}>No profile available.</Text>
    </View>
  );

  const { name, email: userEmail, cnic, currentInstallment, createdAt, status, profileImage } = userProfile;
  // Format Member Since with fallback
  let memberSince = 'N/A';
  if (createdAt) {
    const d = new Date(createdAt);
    console.log('Parsed createdAt:', d);  // Check if it's a valid Date object
    memberSince = !isNaN(d.getTime())
      ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'N/A';
  }
  
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <LinearGradient colors={['#6a11cb','#2575fc']} style={styles.background}/>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}><Ionicons name="log-out-outline" size={24} color="#fff"/></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> }>
        <Animated.View style={[styles.profileSection,{opacity:fadeAnim,transform:[{translateY}]}]}>
          <View style={styles.profileImageContainer}>
            {profileImage 
              ? <Image source={{uri:profileImage}} style={styles.profileImage}/> 
              : <View style={styles.placeholderImage}><MaterialIcons name="person" size={60} color="#6a11cb"/></View>
            }
          </View>
          <Text style={styles.name}>{name||'No Name'}</Text>
        </Animated.View>
        <View style={styles.cardsContainer}>
          <ProfileCard icon="email" title="Email" value={userEmail}/>
          <ProfileCard icon="credit-card" title="CNIC" value={cnic}/>
          <ProfileCard icon="payment" title="Current Installment" value={currentInstallment}/>
          <ProfileCard icon="event" title="Member Since" value={memberSince}/>
          <ProfileCard icon="check-circle" title="Status" value={status||'Active'}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ /* ... same styles ... */

container:{flex:1},background:{position:'absolute',left:0,right:0,top:0,bottom:0},scrollContent:{paddingBottom:30},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:16},headerTitle:{fontSize:20,fontWeight:'700',color:'#fff'},logoutButton:{padding:8,borderRadius:20,backgroundColor:'rgba(255,255,255,0.2)'},profileSection:{alignItems:'center',paddingVertical:20},profileImageContainer:{width:130,height:130,borderRadius:65,backgroundColor:'#fff',padding:5,shadowColor:'#000',shadowOffset:{width:0,height:8},shadowOpacity:0.3,shadowRadius:12,elevation:10,marginBottom:15},profileImage:{width:'100%',height:'100%',borderRadius:60,resizeMode:'cover'},placeholderImage:{width:'100%',height:'100%',borderRadius:60,backgroundColor:'#F0F0F0',justifyContent:'center',alignItems:'center'},name:{fontSize:26,fontWeight:'bold',color:'#fff',marginBottom:5},cardsContainer:{paddingHorizontal:20,paddingTop:10,gap:16},card:{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(255,255,255,0.15)',borderRadius:16,padding:20,shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.15,shadowRadius:12,elevation:5},iconContainer:{width:46,height:46,borderRadius:23,backgroundColor:'rgba(255,255,255,0.2)',justifyContent:'center',alignItems:'center',marginRight:16},cardContent:{flex:1},cardTitle:{fontSize:14,color:'rgba(255,255,255,0.7)',marginBottom:4},cardValue:{fontSize:16,color:'#fff',fontWeight:'600'},loaderContainer:{flex:1,justifyContent:'center',alignItems:'center'},loadingText:{marginTop:12,color:'#fff',fontSize:16,fontWeight:'500'},errorContainer:{flex:1,justifyContent:'center',alignItems:'center',padding:20},errorText:{marginTop:16,color:'#fff',fontSize:16,textAlign:'center',marginBottom:20},noProfileText:{marginTop:16,color:'#fff',fontSize:16,textAlign:'center'},retryButton:{backgroundColor:'#fff',paddingHorizontal:30,paddingVertical:12,borderRadius:25},retryButtonText:{color:'#6a11cb',fontSize:16,fontWeight:'600'}
});
export default Profile;