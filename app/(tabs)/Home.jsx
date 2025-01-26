import { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, ScrollView } from 'react-native';
import { db, addDoc, collection } from '../../utilis/firebaseConfig'; // Import Firebase functions
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'; // Import Firebase Auth functions
import { useRouter } from 'expo-router'; // Import useRouter hook for navigation

const LandingPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [loanPeriod, setLoanPeriod] = useState('3');
  const [installments, setInstallments] = useState([]);
  const [isUserCreated, setIsUserCreated] = useState(false);

  const router = useRouter();
  const loanData = {
    'Wedding Loans': {
      subcategories: ['Valima', 'Furniture', 'Valima Food', 'Jahez'],
      maxLoan: 500000,
      loanPeriod: '3 years',
    },
    'Home Construction Loans': {
      subcategories: ['Structure', 'Finishing', 'Loan'],
      maxLoan: 1000000,
      loanPeriod: '5 years',
    },
    'Business Startup Loans': {
      subcategories: ['Buy Stall', 'Advance Rent for Shop', 'Shop Assets', 'Shop Machinery'],
      maxLoan: 1000000,
      loanPeriod: '5 years',
    },
    'Education Loans': {
      subcategories: ['University Fees', 'Child Fees Loan'],
      maxLoan: 1000000,
      loanPeriod: '4 years',
    },
  };

  const calculateInstallments = () => {
    const principal = loanData[selectedCategory]?.maxLoan - (initialDeposit ? parseInt(initialDeposit) : 0);
    const interestRate = 0.10;
    const months = parseInt(loanPeriod) * 12;
    const monthlyRate = interestRate / 12;

    if (principal > 0) {
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      
      const installmentList = [];
      for (let month = 1; month <= months; month++) {
        installmentList.push({
          month: month,
          installment: emi.toFixed(2),
        });
      }

      setInstallments(installmentList);
    } else {
      setInstallments([]);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      calculateInstallments();
    }
  }, [selectedCategory, loanPeriod, initialDeposit]);

  const handleProceed = async () => {
    const auth = getAuth();
    const defaultPassword = 'Default@123'; // Default password for the user

    try {
      // Create the user using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, defaultPassword);
      const user = userCredential.user;
      console.log("User created: ", user);

      // Send email verification (optional)
      await sendEmailVerification(user);

      // Prepare the form data for Firestore
      const formData = {
        CNIC: cnic,
        Email: email,
        Name: name,
        Category: selectedCategory,
        Subcategory: selectedSubcategory,
        InitialDeposit: initialDeposit,
        LoanPeriod: loanPeriod,
        Installments: installments,
      };

      // Save data to Firebase Firestore
      const docRef = await addDoc(collection(db, 'loanApplications'), formData);
      console.log("Document written with ID: ", docRef.id);

      // Mark user creation as successful
      setIsUserCreated(true);
      
      // Close the modal after submission
      setModalVisible(false);

    } catch (e) {
      console.error("Error adding document: ", e); // Detailed error logging
    }
  };

  useEffect(() => {
    if (isUserCreated) {
      // Navigate to login page only when user creation is successful
      router.push('/login');
    }
  }, [isUserCreated]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    setModalVisible(true);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Your Loan Category</Text>

      {/* Loan Category Buttons */}
      {Object.keys(loanData).map((category) => (
        <TouchableOpacity
          key={category}
          style={styles.categoryButton}
          onPress={() => handleCategorySelect(category)}
        >
          <Text style={styles.buttonText}>{category}</Text>
        </TouchableOpacity>
      ))}

      {/* Modal for Category and Subcategory Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Fill Out Your Information</Text>
            <Text style={styles.categoryText}>Loan Category: {selectedCategory}</Text>
            <Text style={styles.categoryText}>Subcategory: {selectedSubcategory || 'Please select a subcategory'}</Text>

            {/* Render Subcategories */}
            <ScrollView style={styles.subcategoryList}>
              {loanData[selectedCategory]?.subcategories.map((subcategory) => (
                <TouchableOpacity
                  key={subcategory}
                  style={styles.subcategoryButton}
                  onPress={() => handleSubcategorySelect(subcategory)}
                >
                  <Text style={styles.subcategoryButtonText}>{subcategory}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Loan Information */}
            <Text style={styles.loanInfoText}>Maximum Loan: PKR {loanData[selectedCategory]?.maxLoan}</Text>
            <Text style={styles.loanInfoText}>Loan Period: {loanData[selectedCategory]?.loanPeriod}</Text>

            {/* Installments Preview */}
            {installments.length > 0 && (
              <View style={styles.installmentList}>
                <Text style={styles.installmentListHeader}>Monthly Installments</Text>
                <ScrollView style={styles.installmentListScroll}>
                  {installments.map((item) => (
                    <View key={item.month} style={styles.installmentItem}>
                      <Text style={styles.installmentText}>Month {item.month}: PKR {item.installment}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* CNIC Input */}
            <TextInput
              style={styles.input}
              placeholder="CNIC"
              value={cnic}
              onChangeText={setCnic}
              keyboardType="numeric"
            />

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {/* Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />

            {/* Initial Deposit Input */}
            <TextInput
              style={styles.input}
              placeholder="Initial Deposit (PKR)"
              value={initialDeposit}
              onChangeText={setInitialDeposit}
              keyboardType="numeric"
            />

            {/* Loan Period Input */}
            <TextInput
              style={styles.input}
              placeholder="Loan Period (in years)"
              value={loanPeriod}
              onChangeText={setLoanPeriod}
              keyboardType="numeric"
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleProceed}>
              <Text style={styles.buttonText}></Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  categoryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2D3E50',
  },
  categoryText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#2D3E50',
  },
  subcategoryList: {
    maxHeight: 150,
    marginBottom: 20,
    width: '100%',
  },
  subcategoryButton: {
    padding: 12,
    backgroundColor: '#f7f7f7',
    marginBottom: 12,
    borderRadius: 8,
    width: '100%',
  },
  subcategoryButtonText: {
    fontSize: 16,
    color: '#333',
  },
  loanInfoText: {
    fontSize: 16,
    marginBottom: 15,
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
  closeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  installmentList: {
    marginTop: 20,
    width: '100%',
  },
  installmentListHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2D3E50',
  },
  installmentListScroll: {
    maxHeight: 200,
    width: '100%',
  },
  installmentItem: {
    padding: 12,
    backgroundColor: '#f7f7f7',
    marginBottom: 10,
    borderRadius: 8,
  },
  installmentText: {
    fontSize: 16,
    color: '#333',
  },
});

export default LandingPage;
