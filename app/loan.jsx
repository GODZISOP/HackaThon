import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import useRouter
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../utilis/firebaseConfig'; // Import the configured Firebase instance

const LoanFormPage = () => {
  const { category, subcategory } = useLocalSearchParams();
  const router = useRouter(); // Initialize the router
  const [loanAmount, setLoanAmount] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [loanDuration, setLoanDuration] = useState('12');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // State for email
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');

  const calculateInstallment = () => {
    if (!loanAmount || !loanDuration) {
      Alert.alert('Error', 'Please enter the loan amount and duration.');
      return;
    }
    const amount = parseFloat(loanAmount);
    const duration = parseInt(loanDuration, 10);

    if (isNaN(amount) || isNaN(duration) || duration <= 0) {
      Alert.alert('Error', 'Invalid loan amount or duration.');
      return;
    }

    const installment = (amount / duration).toFixed(2);
    setMonthlyInstallment(installment);
    
    
  };


  const handleSubmit = async () => {
    if (!name || !email || !cnic || !password) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Email, CNIC, and Password).');
      return;
    }

    try {
      const userData = {
        name,
        email,
        cnic,
        password,
        category: category || 'None',
        subcategory: subcategory || 'None',
        loanAmount,
        initialDeposit,
        loanDuration,
        monthlyInstallment,
        timestamp: new Date(),
      };

      // Add data to the 'users' collection
      await addDoc(collection(db, 'users'), userData);
      console.log('User successfully added to users collection:', userData);
      Alert.alert('Success', 'Your loan form has been submitted successfully!');

      // Reset the form
      setEmail('');
      setCnic('');
      setPassword('');
      setLoanAmount('');
      setInitialDeposit('');
      setLoanDuration('12');
      setMonthlyInstallment('');

      // Navigate to the login page
      router.push('/login'); // Replace '/login' with the actual path of your login page
    } catch (error) {
      console.error('Error submitting user data:', error);
      Alert.alert('Error', 'There was an issue submitting your form. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Loan Form</Text>

      <Text style={styles.info}>
        Selected Category: <Text style={styles.highlight}>{category || 'None'}</Text>
      </Text>
      <Text style={styles.info}>
        Selected Subcategory: <Text style={styles.highlight}>{subcategory || 'None'}</Text>
      </Text>

      {/* Name Input */}
    

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* CNIC Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter CNIC (e.g., 12345-6789012-3)"
        placeholderTextColor="#ccc"
        value={cnic}
        onChangeText={setCnic}
        keyboardType="numeric"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* Loan Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Loan Amount (PKR)"
        placeholderTextColor="#ccc"
        value={loanAmount}
        onChangeText={setLoanAmount}
        keyboardType="numeric"
      />

      {/* Initial Deposit Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Initial Deposit (PKR)"
        placeholderTextColor="#ccc"
        value={initialDeposit}
        onChangeText={setInitialDeposit}
        keyboardType="numeric"
      />

      {/* Loan Duration Input */}
      <Text style={styles.subHeader}>Loan Duration (Months):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Duration (in months)"
        placeholderTextColor="#ccc"
        value={loanDuration}
        onChangeText={setLoanDuration}
        keyboardType="numeric"
      />

      {/* Calculate Installment */}
      <TouchableOpacity style={styles.calculateButton} onPress={calculateInstallment}>
        <Text style={styles.buttonText}>Calculate Installment</Text>
      </TouchableOpacity>

      {/* Display Monthly Installment */}
      {monthlyInstallment && (
        <Text style={styles.info}>
          Monthly Installment: <Text style={styles.highlight}>PKR {monthlyInstallment}</Text>
        </Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: '#b3b3b3',
    marginBottom: 10,
  },
  highlight: {
    color: '#8e44ad',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6c3483',
    backgroundColor: '#2e2e2e',
    color: '#e6e6e6',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 18,
    color: '#b3b3b3',
    marginBottom: 10,
  },
  calculateButton: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoanFormPage;
