import { Link } from 'expo-router';
import { View, Text, ScrollView, FlatList, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
const Index =()=>{

    return(
       <View style={styles.container}>
Welcome page
<TouchableOpacity  style={styles.button}>
 <Link href="/Signup" >go to sign</Link>
</TouchableOpacity>
       </View> 
    )
}

export default Index;
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F8F6FF', // Light purple background
        paddingHorizontal: 20,
        paddingTop: 50,
      },
      button: {
        color:'white',
        backgroundColor: '#6a1b9a', // Purple button background
        paddingVertical: 12,
        paddingHorizontal: 64,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Adding shadow for the button
    },
})