import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const LoanRequestScreen = () => {
  const params = useLocalSearchParams();

  const [form, setForm] = useState({
    email: params.email || "",
    loanAmount: params.loanAmount || "",
    userId: params.userId || "",
    guarantor1Name: '',
    guarantor1Email: '',
    guarantor1Location: '',
    guarantor1Cnic: '',
    guarantor2Name: '',
    guarantor2Email: '',
    guarantor2Location: '',
    guarantor2Cnic: '',
    address: '',
    phoneNumber: '',
    statement: '',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        email: form.email,
        loanAmount: form.loanAmount,
        userId: form.userId,
        guarantors: [
          { name: form.guarantor1Name, email: form.guarantor1Email, location: form.guarantor1Location, cnic: form.guarantor1Cnic },
          { name: form.guarantor2Name, email: form.guarantor2Email, location: form.guarantor2Location, cnic: form.guarantor2Cnic }
        ],
        personalInfo: { address: form.address, phoneNumber: form.phoneNumber },
        statement: form.statement || "",
      };

      console.log("📤 Sending Loan Request:", payload);

      const response = await fetch('http://localhost:4001/api/loan-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Submission failed');

      Alert.alert('✅ Success', 'Loan request submitted successfully');
    } catch (error) {
      Alert.alert('❌ Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Loan Request</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{form.email}</Text>

        <Text style={styles.label}>Loan Amount:</Text>
        <Text style={styles.text}>{form.loanAmount}</Text>

        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.text}>{form.userId}</Text>
      </View>

      {/* Guarantor 1 */}
      <View style={styles.card}>
        <Text style={styles.subHeading}>Guarantor 1</Text>
        <TextInput style={styles.input} placeholder="Name" onChangeText={(val) => handleChange('guarantor1Name', val)} />
        <TextInput style={styles.input} placeholder="Email" onChangeText={(val) => handleChange('guarantor1Email', val)} />
        <TextInput style={styles.input} placeholder="Location" onChangeText={(val) => handleChange('guarantor1Location', val)} />
        <TextInput style={styles.input} placeholder="CNIC" onChangeText={(val) => handleChange('guarantor1Cnic', val)} />
      </View>

      {/* Guarantor 2 */}
      <View style={styles.card}>
        <Text style={styles.subHeading}>Guarantor 2</Text>
        <TextInput style={styles.input} placeholder="Name" onChangeText={(val) => handleChange('guarantor2Name', val)} />
        <TextInput style={styles.input} placeholder="Email" onChangeText={(val) => handleChange('guarantor2Email', val)} />
        <TextInput style={styles.input} placeholder="Location" onChangeText={(val) => handleChange('guarantor2Location', val)} />
        <TextInput style={styles.input} placeholder="CNIC" onChangeText={(val) => handleChange('guarantor2Cnic', val)} />
      </View>

      {/* Personal Information */}
      <View style={styles.card}>
        <Text style={styles.subHeading}>Personal Information</Text>
        <TextInput style={styles.input} placeholder="Address" onChangeText={(val) => handleChange('address', val)} />
        <TextInput style={styles.input} placeholder="Phone Number" onChangeText={(val) => handleChange('phoneNumber', val)} />
        <TextInput style={styles.input} placeholder="Statement (Optional)" onChangeText={(val) => handleChange('statement', val)} />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Loan Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff', // White background
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#5F4B8B', // Purple color for heading
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5F4B8B', // Purple color for subheading
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'purple',
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'purple',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'purple', // Purple color for button
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#5F4B8B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoanRequestScreen;