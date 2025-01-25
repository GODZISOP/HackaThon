import { useState } from 'react';
import { auth, db } from '../utilis/firebaseConfig';  // Assuming Firebase is initialized
import { createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';  // Import necessary Firebase functions
import { setDoc, doc } from 'firebase/firestore';  // Firestore methods
import { useRouter } from 'expo-router';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'; // Import Image  

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPeriod, setLoanPeriod] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !name || !loanAmount || !loanPeriod) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Authentication displayName
      await updateProfile(user, {
        displayName: name,  // Set displayName in Firebase Authentication
      });

      // Save user data to Firestore including loan information
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: user.email,
        bio: bio || 'No bio available',
        profilePicture: '',  // Optional, default profile picture
        loanAmount: loanAmount,
        loanPeriod: loanPeriod,
      });

      // Send a password reset email to the user to prompt them to change their password
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent.');

      // Navigate to the login screen after successful sign-up
      router.push('/login');  // Adjust this route as needed for your login screen
      console.log('User signed up and data saved:', user.uid);
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Image at the top of the screen */}
      <Image
        source={require('../assets/images/signup.gif')} // Replace with your image path
        style={styles.image}
      />
      
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      
      {/* Loan Amount input */}
      <TextInput
        style={styles.input}
        placeholder="Loan Amount"
        value={loanAmount}
        onChangeText={setLoanAmount}
        keyboardType="numeric" // Ensures the keyboard is appropriate for number input
      />
      
      {/* Loan Period input */}
      <TextInput
        style={styles.input}
        placeholder="Loan Period (in months)"
        value={loanPeriod}
        onChangeText={setLoanPeriod}
        keyboardType="numeric" // Ensures the keyboard is appropriate for number input
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Login button to navigate to Login screen */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',  // Soft background color for a modern feel
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#6200ee',
    shadowColor: '#000',  // Add shadow to the image for visual depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ee', // Modern, appealing color for the title
  },
  input: {
    width: '85%',
    height: 50,
    marginBottom: 15,
    paddingLeft: 15,
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',  // White background for the input fields
    elevation: 3,  // Adding shadow to the inputs for better depth
  },
  button: {
    width: '85%',
    padding: 15,
    backgroundColor: '#6200ee',  // Purple button for prominence
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',  // Shadow for a floating effect
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#6200ee', // Color to match the design
  },
  loginButton: {
    fontSize: 16,
    color: '#6200ee',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default SignUp;
