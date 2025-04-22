import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const LoanFormPage = () => {
  const { category, subcategory } = useLocalSearchParams();
  const router = useRouter();

  // State variables
  const [loanAmount, setLoanAmount] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [loanDuration, setLoanDuration] = useState('12');
  const [monthlyInstallment, setMonthlyInstallment] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl = "http://192.168.100.144:4001";

  // Helper functions
  const checkUserExists = async (email, cnic) => {
    try {
      const response = await fetch(`http://localhost:4001/api/check-user?email=${email}&cnic=${cnic}`);
      const data = await response.json();
      return response.status === 400 ? alert(data.message) : false;
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  };

  const formatCurrency = (value) => value?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const unformatCurrency = (value) => value?.replace(/,/g, '');

  const formatCNIC = (text) => {
    const digits = text.replace(/\D/g, '');
    return digits.length <= 5
      ? digits
      : digits.length <= 12
        ? `${digits.slice(0, 5)}-${digits.slice(5)}`
        : `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    const isPasswordValid = password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);

    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }
    if (!cnicRegex.test(cnic)) {
      Alert.alert('Invalid CNIC', 'Please enter a valid CNIC in the format 00000-0000000-0.');
      return false;
    }
    if (!isPasswordValid) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters and include both letters and numbers.');
      return false;
    }
    if (!name || !email || !cnic || !password || !loanAmount || !initialDeposit || !loanDuration) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return false;
    }

    return true;
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    const userData = {
      name,
      email,
      cnic,
      password,
      loanAmount: unformatCurrency(loanAmount),
      initialDeposit: unformatCurrency(initialDeposit),
      loanDuration,
      monthlyInstallment: monthlyInstallment ? unformatCurrency(monthlyInstallment) : '',
    };
  
    try {
      // Check if the user already exists by email or CNIC
      const checkResponse = await axios.get(`${baseUrl}/api/check-user`, { params: { email, cnic } });
      
      if (checkResponse.data.exists) {
        Alert.alert(
          'Already Registered',
          'You are already registered with this email or CNIC. Please log in.',
          [{ text: 'OK', onPress: () => router.push('/login') }]
        );
        setIsSubmitting(false);
        return;
      }
  
      const res = await axios.post(`${baseUrl}/api/submit`, userData);
      if (res.status === 200) {
        Alert.alert(
          'Application Submitted',
          'Your loan application has been successfully submitted. You will be redirected to login.',
          [{ text: 'OK', onPress: () => router.push('/login') }]
        );
      }
    } catch (error) {
      console.error('Error submitting loan form:', error);
      Alert.alert(
        'Submission Failed',
        `We couldn't process your application. ${error.response?.data?.message || 'Please try again later.'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Monthly installment calculation
  const calculateInstallment = () => {
    if (!loanAmount || !loanDuration) {
      Alert.alert('Missing Information', 'Please enter both loan amount and duration.');
      return;
    }

    setIsCalculating(true);
    const amount = parseFloat(unformatCurrency(loanAmount));
    const duration = parseInt(loanDuration, 10);

    if (isNaN(amount) || isNaN(duration) || duration <= 0) {
      Alert.alert('Invalid Input', 'Please check your loan amount and duration values.');
      setIsCalculating(false);
      return;
    }

    setTimeout(() => {
      const installment = (amount / duration).toFixed(2);
      setMonthlyInstallment(formatCurrency(installment));
      setIsCalculating(false);
    }, 800);
  };

  // Handlers for input changes
  const handleLoanAmountChange = (text) => {
    const unformatted = unformatCurrency(text);
    if (unformatted === '' || /^\d+$/.test(unformatted)) {
      setLoanAmount(formatCurrency(unformatted));
    }
  };

  const handleInitialDepositChange = (text) => {
    const unformatted = unformatCurrency(text);
    if (unformatted === '' || /^\d+$/.test(unformatted)) {
      setInitialDeposit(formatCurrency(unformatted));
    }
  };

  const handleCNICChange = (text) => setCnic(formatCNIC(text));

  // Navigation to login
  const navigateToLogin = () => router.push('/login');

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {/* Floating Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={navigateToLogin} activeOpacity={0.8}>
        <Ionicons name="log-in-outline" size={20} color="#fff" />
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={require('../assets/images/sign.gif')} style={styles.image} resizeMode="contain" />

          <Text style={styles.header}>Loan Application</Text>

          {/* Category Section */}
          <View style={styles.categoryContainer}>
            <View style={styles.categoryItem}>
              <Text style={styles.categoryLabel}>Category</Text>
              <Text style={styles.categoryValue}>{category || 'None'}</Text>
            </View>
            <View style={styles.categoryDivider} />
            <View style={styles.categoryItem}>
              <Text style={styles.categoryLabel}>Subcategory</Text>
              <Text style={styles.categoryValue}>{subcategory || 'None'}</Text>
            </View>
          </View>

          {/* Personal Information Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <FormInput
              icon="person-outline"
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
            <FormInput
              icon="mail-outline"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <FormInput
              icon="card-outline"
              placeholder="CNIC (e.g., 12345-6789012-3)"
              value={cnic}
              onChangeText={handleCNICChange}
              keyboardType="numeric"
              maxLength={15}
            />
            <FormInput
              icon="lock-closed-outline"
              placeholder="Create Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              passwordToggle
              onTogglePassword={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          </View>

          {/* Loan Details Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Loan Details</Text>
            <FormInput
              icon="cash-outline"
              placeholder="Loan Amount (PKR)"
              value={loanAmount}
              onChangeText={handleLoanAmountChange}
              keyboardType="numeric"
            />
            <FormInput
              icon="wallet-outline"
              placeholder="Initial Deposit (PKR)"
              value={initialDeposit}
              onChangeText={handleInitialDepositChange}
              keyboardType="numeric"
            />
            <FormInput
              icon="calendar-outline"
              placeholder="Loan Duration (months)"
              value={loanDuration}
              onChangeText={setLoanDuration}
              keyboardType="numeric"
            />
            <CalculateButton isCalculating={isCalculating} onPress={calculateInstallment} />
            {monthlyInstallment && <MonthlyInstallment result={monthlyInstallment} />}
          </View>

          {/* Submit Button */}
          <SubmitButton isSubmitting={isSubmitting} onPress={handleSubmit} />
          <Disclaimer />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// Helper components for form inputs
const FormInput = ({ icon, placeholder, value, onChangeText, keyboardType, maxLength, secureTextEntry, passwordToggle, onTogglePassword }) => (
  <View style={styles.inputContainer}>
    <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      secureTextEntry={secureTextEntry}
    />
    {passwordToggle && (
      <TouchableOpacity onPress={onTogglePassword} style={styles.passwordToggle}>
        <Ionicons name="eye-outline" size={20} color="#666" />
      </TouchableOpacity>
    )}
  </View>
);

const CalculateButton = ({ isCalculating, onPress }) => (
  <TouchableOpacity style={[styles.calculateButton, isCalculating && styles.buttonDisabled]} onPress={onPress} disabled={isCalculating}>
    {isCalculating ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Calculate Monthly Payment</Text>}
  </TouchableOpacity>
);

const MonthlyInstallment = ({ result }) => (
  <View style={styles.resultCard}>
    <Text style={styles.resultLabel}>Monthly Payment</Text>
    <Text style={styles.resultValue}>PKR {result}</Text>
  </View>
);

const SubmitButton = ({ isSubmitting, onPress }) => (
  <TouchableOpacity style={[styles.submitButton, isSubmitting && styles.buttonDisabled]} onPress={onPress} disabled={isSubmitting}>
    {isSubmitting ? (
      <ActivityIndicator size="small" color="#fff" />
    ) : (
      <>
        <Text style={styles.submitButtonText}>Submit Application</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.submitIcon} />
      </>
    )}
  </TouchableOpacity>
);

const Disclaimer = () => (
  <Text style={styles.disclaimer}>
    By submitting this form, you agree to our Terms & Conditions and Privacy Policy.
  </Text>
);


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '60%',
    height: 120,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  loginButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#6C63FF',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 25,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
  },
  categoryDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  categoryLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    paddingVertical: 12,
  },
  passwordToggle: {
    padding: 10,
  },
  calculateButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#F0F0FF',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  submitIcon: {
    marginLeft: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default LoanFormPage;