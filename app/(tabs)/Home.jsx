import { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, ScrollView } from 'react-native'; 
import { db, setDoc, doc } from '../../utilis/firebaseConfig'; 
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; 
import { useRouter } from 'expo-router'; 
import { Link } from 'expo-router'; 

const LandingPage = () => {   
  const [modalVisible, setModalVisible] = useState(false);   
  const [cnic, setCnic] = useState('');   
  const [email, setEmail] = useState('');   
  const [password, setPassword] = useState('');   
  const [name, setName] = useState('');   
  const [selectedCategory, setSelectedCategory] = useState('');   
  const [selectedSubcategory, setSelectedSubcategory] = useState('');   
  const [initialDeposit, setInitialDeposit] = useState('');   
  const [loanPeriod, setLoanPeriod] = useState('3');   
  const [installments, setInstallments] = useState([]);   
  const [isUserCreated, setIsUserCreated] = useState(false);   
  const [error, setError] = useState('');    

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
    if (!email || !password || !name) {       
      setError('Please fill in all fields.');       
      return;     
    }      

    try {       
      // Create the user with Firebase Authentication       
      const auth = getAuth();       
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);       
      const user = userCredential.user;        

      // Update Firebase Authentication displayName       
      await updateProfile(user, {         
        displayName: name,  // Set displayName in Firebase Authentication       
      });        

      // Save user data to Firestore       
      await setDoc(doc(db, 'users', user.uid), {         
        name: name,         
        email: user.email,         
        bio: 'No bio available',  // Optional bio field         
        profilePicture: '',  // Optional, default profile picture       
      });        

      // Navigate to the login screen after successful sign-up       
      router.push('/login');       
      console.log('User signed up and data saved:', user.uid);     
    } catch (error) {       
      console.error('Error during sign-up', error);       
      setError('you are already signed up');     
    }   
  };    

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
          <ScrollView contentContainerStyle={styles.modalContent}>             
            <Text style={styles.modalHeader}>Fill Out Your Information</Text>             
            <Text style={styles.categoryText}>Loan Category: {selectedCategory}</Text>             
            <Text style={styles.categoryText}>Subcategory: {selectedSubcategory || 'Please select a subcategory'}</Text>              

            {/* Render Subcategories */}             
            <View style={styles.subcategoryList}>               
              {loanData[selectedCategory]?.subcategories.map((subcategory) => (                 
                <TouchableOpacity                   
                  key={subcategory}                   
                  style={styles.subcategoryButton}                   
                  onPress={() => handleSubcategorySelect(subcategory)}                 
                >                   
                  <Text style={styles.subcategoryButtonText}>{subcategory}</Text>                 
                </TouchableOpacity>               
              ))}             
            </View>              

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

            {/* Form Inputs with New UI */}             
            <TextInput               
              style={styles.input}               
              placeholder="CNIC"               
              value={cnic}               
              onChangeText={setCnic}               
              keyboardType="numeric"             
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
              placeholder="Name"               
              value={name}               
              onChangeText={setName}             
            />             
            <TextInput               
              style={styles.input}               
              placeholder="Initial Deposit (PKR)"               
              value={initialDeposit}               
              onChangeText={setInitialDeposit}               
              keyboardType="numeric"             
            />             
            <TextInput               
              style={styles.input}               
              placeholder="Loan Period (in years)"               
              value={loanPeriod}               
              onChangeText={setLoanPeriod}               
              keyboardType="numeric"             
            />              

            {/* Submit Button */}             
            <TouchableOpacity style={styles.submitButton} onPress={handleProceed}>               
              <Text style={styles.buttonText}>Proceed</Text>             
            </TouchableOpacity>              

            {/* Login Button */}             
            <Link href="/login" style={styles.loginButton}>Go to Login</Link>              

            {/* Error message */}             
            {error && <Text style={styles.errorText}>{error}</Text>}              

            {/* Close Button */}             
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>               
              <Text style={styles.closeButtonText}>Close</Text>             
            </TouchableOpacity>           
          </ScrollView>         
        </View>       
      </Modal>     
    </View>   
  ); 
};

const styles = StyleSheet.create({   
  container: {     
    flex: 1,     
    backgroundColor: '#e5f5e0',     
    justifyContent: 'center',     
    alignItems: 'center',     
    padding: 20,   
  },   
  header: {     
    fontSize: 28,     
    fontWeight: '700',     
    marginBottom: 30,     
    color: '#4CAF50',     // Green header color   
    textAlign: 'center',   
  },   
  categoryButton: {     
    backgroundColor: '#388E3C',     // Green button color   
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
    color: '#fff',     
    fontWeight: '600',   
  },   
  modalOverlay: {     
    flex: 1,     
    justifyContent: 'center',     
    alignItems: 'center',     
    backgroundColor: 'rgba(0, 0, 0, 0.7)',   
  },   
  modalContent: {     
    backgroundColor: '#fff',     
    padding: 30,     
    borderRadius: 12,     
    width: '90%',     
    alignItems: 'center',   
  },   
  modalHeader: {     
    fontSize: 24,     
    fontWeight: '700',     
    color: '#388E3C',     // Green modal header color   
    marginBottom: 20,   
  },   
  categoryText: {     
    fontSize: 16,     
    color: '#388E3C',     // Green text color   
    marginBottom: 15,   
  },   
  subcategoryList: {     
    maxHeight: 180,     
    marginBottom: 20,     
    width: '100%',   
  },   
  subcategoryButton: {     
    padding: 14,     
    backgroundColor: '#f4f4f4',     
    marginBottom: 12,     
    borderRadius: 10,     
    width: '100%',     
    alignItems: 'center',   
  },   
  subcategoryButtonText: {     
    fontSize: 16,     
    color: '#388E3C',     // Green subcategory button text   
  },   
  loanInfoText: {     
    fontSize: 16,     
    color: '#555',     
    marginBottom: 15,   
  },   
  input: {     
    height: 50,     
    width: '100%',     
    borderColor: '#388E3C',     // Green input borders   
    borderWidth: 1.5,     
    borderRadius: 12,     
    marginBottom: 15,     
    paddingLeft: 15,     
    fontSize: 16,     
    backgroundColor: '#fafafa',     
    shadowColor: '#ccc',     
    shadowOffset: { width: 0, height: 2 },     
    shadowOpacity: 0.1,     
    shadowRadius: 4,     
    elevation: 1,   
  },   
  submitButton: {     
    backgroundColor: '#388E3C',     // Green submit button   
    paddingVertical: 15,     
    paddingHorizontal: 50,     
    borderRadius: 25,     
    marginVertical: 10,     
    width: '100%',     
    alignItems: 'center',   
  },   
  loginButton: {     
    fontSize: 16,     
    color: '#388E3C',     // Green login button text   
    marginTop: 15,     
    textDecorationLine: 'underline',   
  },   
  errorText: {     
    fontSize: 14,     
    color: 'red',     
    marginBottom: 10,   
  },   
  closeButton: {     
    backgroundColor: '#388E3C',     // Green close button   
    paddingVertical: 12,     
    paddingHorizontal: 35,     
    borderRadius: 25,     
    marginTop: 20,     
    width: '100%',     
    alignItems: 'center',   
  },   
  closeButtonText: {     
    fontSize: 18,     
    color: '#fff',   
  },   
  installmentList: {     
    marginTop: 20,     
    width: '100%',   
  },   
  installmentListHeader: {     
    fontSize: 18,     
    fontWeight: '700',     
    color: '#388E3C',     // Green installment header   
    marginBottom: 10,   
  },   
  installmentListScroll: {     
    maxHeight: 200,   
  },   
  installmentItem: {     
    padding: 12,     
    backgroundColor: '#f7f7f7',     
    marginBottom: 10,     
    borderRadius: 8,   
  },   
  installmentText: {     
    fontSize: 16,     
    color: '#388E3C',     // Green installment text   
  }, });

export default LandingPage;
