import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios'; // Import axios for API requests

const LoanFormPage = () => {
  const { category, subcategory } = useLocalSearchParams();
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [loanDuration, setLoanDuration] = useState('12');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const baseUrl = "http://localhost:4001";

  // Function to calculate monthly installment
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

  // Handle form submission
  const handleSubmit = async () => {
    const userData = {
      name,
      email,
      cnic,
      password,
      loanAmount,
      initialDeposit,
      loanDuration,
      monthlyInstallment,
    };

    try {
      // Make the POST request with axios
      const res = await axios.post(`${baseUrl}/api/submit`, userData);

      if (res.status === 200) {
        Alert.alert('Success', res.data.message);
        router.push('/login'); // Navigate to the login page after successful submission
      } else {
        Alert.alert('Error', 'There was an issue submitting the form.');
      }
    } catch (error) {
      console.error('Error submitting loan form:', error);
      Alert.alert('Error', `Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Loan Application Form</Text>

      <Text style={styles.info}>
        Selected Category: <Text style={styles.highlight}>{category || 'None'}</Text>
      </Text>
      <Text style={styles.info}>
        Selected Subcategory: <Text style={styles.highlight}>{subcategory || 'None'}</Text>
      </Text>

      {/* Form Fields */}
      <TextInput
        style={styles.input}
        placeholder="Enter Your Name"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter CNIC (e.g., 12345-6789012-3)"
        placeholderTextColor="#ccc"
        value={cnic}
        onChangeText={setCnic}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Loan Amount (PKR)"
        placeholderTextColor="#ccc"
        value={loanAmount}
        onChangeText={setLoanAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Initial Deposit (PKR)"
        placeholderTextColor="#ccc"
        value={initialDeposit}
        onChangeText={setInitialDeposit}
        keyboardType="numeric"
      />
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
    backgroundColor: '#f5f5f5', // Light background color for the main container
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#8A2BE2', // Purple color for the header text
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  highlight: {
    color: '#8A2BE2', // Purple color to highlight text
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#8A2BE2', // Purple border color
    backgroundColor: '#fff',
    color: '#333',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 18,
    color: '#8A2BE2', // Purple sub-header color
    marginBottom: 10,
  },
  calculateButton: {
    backgroundColor: '#8A2BE2', // Purple background for the calculate button
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#8A2BE2', // Purple background for the submit button
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
