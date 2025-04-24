import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';
// You'll need to install expo-linear-gradient:
// expo install expo-linear-gradient

const LoanRequestScreen = () => {
  const params = useLocalSearchParams();
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const [form, setForm] = useState({
    email: params.email || "",
    loanAmount: params.loanAmount || "",
    userId: params.userId || "",
    guarantor1Name: params.guarantor1Name || '',
    guarantor1Email: params.guarantor1Email || '',
    guarantor1Location: params.guarantor1Location || '',
    guarantor1Cnic: params.guarantor1Cnic || '',
    guarantor2Name: params.guarantor2Name || '',
    guarantor2Email: params.guarantor2Email || '',
    guarantor2Location: params.guarantor2Location || '',
    guarantor2Cnic: params.guarantor2Cnic || '',
    duration: "",         // ← new
    interestRate: "",     // ← new
    monthlyPayment: "",   // ← new
    statement: params.statement || "",
    address: params.address || '',
    phoneNumber: params.phoneNumber || '',
    statement: params.statement || '',
  });
  

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
 
  const BASE_URL = "http://192.168.100.148:4001";

  const nextStep = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      const payload = {
        email: form.email,
        loanAmount: parseFloat(form.loanAmount) || 0,  // Ensure it's a valid number
        duration: parseFloat(form.duration) || 0,      // New field for loan duration
        interestRate: parseFloat(form.interestRate) || 0, // New field for interest rate
        monthlyPayment: parseFloat(form.monthlyPayment) || 0, // New field for monthly payment
        userId: form.userId,
        guarantors: [
          { name: form.guarantor1Name, email: form.guarantor1Email, location: form.guarantor1Location, cnic: form.guarantor1Cnic },
          { name: form.guarantor2Name, email: form.guarantor2Email, location: form.guarantor2Location, cnic: form.guarantor2Cnic }
        ],
        personalInfo: { address: form.address, phoneNumber: form.phoneNumber },
        statement: form.statement || "",
      };
      
  
      console.log("📤 Sending Loan Request:", payload);
  
      const response = await fetch(`${BASE_URL}/api/loan-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Submission failed');
  
      // persist the email in AsyncStorage so your list screen can fall back on it
      await AsyncStorage.setItem('userEmail', form.email);
  
      setLoading(false);
      Alert.alert('Success', 'Your loan request has been submitted successfully', [
        {
          text: 'OK',
          onPress: () =>
            router.push({
              pathname: '/requser',
              params: {
                params: { ...form }, // passing everything in the form
                
              },
            }),
        },
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };
  
  // ... rest of your existing code ...

  

  const renderInputField = (label, placeholder, key, keyboardType = "default", isSecure = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={form[key]}
          onChangeText={(val) => handleChange(key, val)}
          keyboardType={keyboardType}
          secureTextEntry={isSecure}
          placeholderTextColor="#A0AEC0"
        />
      </View>
    </View>
  );

  const renderNonEditableField = (label, value) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.nonEditableWrapper}>
        <Text style={styles.nonEditableText}>{value}</Text>
      </View>
    </View>
  );

  // Updated GradientButton to use actual LinearGradient
  const GradientButton = ({ onPress, text, disabled, style }) => (
    <TouchableOpacity 
      style={[styles.gradientButtonContainer, style, disabled && styles.disabledButton]} 
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientButton}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.progressStepContainer}>
          <View style={[
            styles.progressStep,
            step < activeStep ? styles.progressStepCompleted : 
            step === activeStep ? styles.progressStepActive : 
            styles.progressStepInactive
          ]}>
            {step < activeStep ? (
              <Text style={styles.progressStepTextCompleted}>✓</Text>
            ) : (
              <Text style={step === activeStep ? styles.progressStepTextActive : styles.progressStepTextInactive}>{step}</Text>
            )}
          </View>
          {step < 4 && (
            <View style={[
              styles.progressLine,
              step < activeStep ? styles.progressLineCompleted : styles.progressLineInactive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Loan Information</Text>
     +      {/* existing fields */}
            {renderInputField("Email", "Enter your email", "email", "email-address")}
            {renderInputField("Loan Amount", "Enter amount", "loanAmount", "numeric")}
            {renderInputField("User ID", "Enter your user ID", "userId")}
     
     +      {/* new required fields */}
     +      {renderInputField("Duration (months)", "e.g. 12", "duration", "numeric")}
     +      {renderInputField("Interest Rate (%)", "e.g. 5.5", "interestRate", "numeric")}
     +      {renderInputField("Monthly Payment", "e.g. 450.00", "monthlyPayment", "numeric")}
     
            <GradientButton text="Continue" onPress={nextStep} style={{ marginTop: 20 }}/>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>First Guarantor</Text>
            <Text style={styles.stepDescription}>Please provide your first guarantor's information</Text>
            
            {renderInputField("Full Name", "Enter guarantor's full name", "guarantor1Name")}
            {renderInputField("Email Address", "Enter guarantor's email", "guarantor1Email", "email-address")}
            {renderInputField("Location", "Enter guarantor's location", "guarantor1Location")}
            {renderInputField("CNIC Number", "Enter guarantor's CNIC", "guarantor1Cnic")}
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <GradientButton 
                text="Continue" 
                onPress={nextStep} 
                style={{ flex: 1 }}
              />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Second Guarantor</Text>
            <Text style={styles.stepDescription}>Please provide your second guarantor's information</Text>
            
            {renderInputField("Full Name", "Enter guarantor's full name", "guarantor2Name")}
            {renderInputField("Email Address", "Enter guarantor's email", "guarantor2Email", "email-address")}
            {renderInputField("Location", "Enter guarantor's location", "guarantor2Location")}
            {renderInputField("CNIC Number", "Enter guarantor's CNIC", "guarantor2Cnic")}
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <GradientButton 
                text="Continue" 
                onPress={nextStep} 
                style={{ flex: 1 }}
              />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Your Details</Text>
          <Text style={styles.stepDescription}>Please provide your personal information</Text>
          
          {renderInputField("Address", "Enter your complete address", "address")}
          {renderInputField("Phone Number", "Enter your phone number", "phoneNumber", "phone-pad")}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Additional Statement (Optional)</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Any additional information you'd like to share"
                value={form.statement}
                onChangeText={(val) => handleChange('statement', val)}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor="#A0AEC0"
              />
            </View>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <GradientButton 
              text={loading ? "Submitting..." : "Submit Application"}
              onPress={handleSubmit}
              disabled={loading}
              style={{ flex: 1 }}
            />
          </View>
          
          {/* New Button Example */}
          <GradientButton
            text="Cancel Request"
            onPress={() => {
              Alert.alert("Cancelled", "Your loan request has been cancelled.");
              // Perform any cancel action here, like navigating back or resetting the form
            }}
            style={{ marginTop: 20, backgroundColor: '#E2E8F0' }}
          />
        </View>
      );
    default:
      return null;
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6a11cb" />
      <View style={styles.container}>
        {/* Header with Gradient - Fixed implementation */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#6a11cb', '#2575fc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerBackground}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Loan Application</Text>
              <Text style={styles.headerSubtitle}>Step {activeStep} of 4</Text>
            </View>
          </LinearGradient>
        </View>
        
        {renderProgressBar()}
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
          
          <View style={styles.securityNote}>
            <Text style={styles.securityText}>Your information is secure and encrypted</Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  headerContainer: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden', // Important for rounded corners with LinearGradient
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  headerBackground: {
    width: '100%',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -15,
    paddingHorizontal: 30,
    zIndex: 1,
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  progressStepCompleted: {
    backgroundColor: '#2575fc',
  },
  progressStepActive: {
    backgroundColor: '#6a11cb',
  },
  progressStepInactive: {
    backgroundColor: '#E2E8F0',
  },
  progressStepTextCompleted: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressStepTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressStepTextInactive: {
    color: '#718096',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressLine: {
    flex: 1,
    height: 3,
    marginHorizontal: -5,
    zIndex: 1,
  },
  progressLineCompleted: {
    backgroundColor: '#2575fc',
  },
  progressLineInactive: {
    backgroundColor: '#E2E8F0',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  stepContent: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    overflow: 'hidden',
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2D3748',
  },
  textAreaWrapper: {
    height: 120,
    alignItems: 'flex-start',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  nonEditableWrapper: {
    padding: 16,
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
  },
  nonEditableText: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  gradientButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#6a11cb',
    fontSize: 16,
    fontWeight: '700',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  securityText: {
    fontSize: 12,
    color: '#6a11cb',
    marginLeft: 5,
  }
});

export default LoanRequestScreen;