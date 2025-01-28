import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const LandingPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const router = useRouter();

  const loanData = {
    'Wedding Loans': ['Valima', 'Furniture', 'Valima Food', 'Jahez'],
    'Home Construction Loans': ['Structure', 'Finishing', 'Loan'],
    'Business Startup Loans': ['Buy Stall', 'Advance Rent for Shop', 'Shop Assets', 'Shop Machinery'],
    'Education Loans': ['University Fees', 'Child Fees Loan'],
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleSubcategorySelect = (subcategory) => {
    setModalVisible(false);

    // Navigate to Loan Form Page with the selected category and subcategory
    router.push({
      pathname: '/loan',
      params: {
        category: selectedCategory,
        subcategory: subcategory,
      },
    });
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

      {/* Modal for Subcategories */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalHeader}>{selectedCategory}</Text>
            {loanData[selectedCategory]?.map((subcategory) => (
              <TouchableOpacity
                key={subcategory}
                style={styles.subcategoryButton}
                onPress={() => handleSubcategorySelect(subcategory)}
              >
                <Text style={styles.buttonText}>{subcategory}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
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
    padding: 20,
    backgroundColor: 'black', // Dark purple-black background
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white', // Vibrant purple for the header text
    marginBottom: 30,
  },
  categoryButton: {
    backgroundColor: 'purple', // Bright purple for buttons
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark overlay
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#2d2d44', // Slightly lighter purple for modal
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a29bfe', // Vibrant purple for modal header
    textAlign: 'center',
    marginBottom: 20,
  },
  subcategoryButton: {
    backgroundColor: 'purple', // Bright purple for buttons

    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#e74c3c', // Red for close button
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default LandingPage;
