import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable'; // Import Animatable

const LandingPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pressedButton, setPressedButton] = useState(null); 
  const router = useRouter();

  // Loan Categories and Subcategories
  const loanData = {
    'Wedding Loans': ['Valima', 'Furniture', 'Valima Food', 'Jahez'],
    'Home Construction Loans': ['Structure', 'Finishing', 'Loan'],
    'Business Startup Loans': ['Buy Stall', 'Advance Rent for Shop', 'Shop Assets', 'Shop Machinery'],
    'Education Loans': ['University Fees', 'Child Fees Loan'],
  };

  // Icon Mapping for Categories
  const categoryIcons = {
    'Wedding Loans': 'heart-outline',
    'Home Construction Loans': 'home-outline',
    'Business Startup Loans': 'briefcase-outline',
    'Education Loans': 'school-outline',
  };

  // Icon Mapping for Subcategories
  const subcategoryIcons = {
    'Valima': 'restaurant-outline',
    'Furniture': 'bed-outline',
    'Valima Food': 'fast-food-outline',
    'Jahez': 'gift-outline',
    'Structure': 'construct-outline',
    'Finishing': 'color-palette-outline',
    'Loan': 'cash-outline',
    'Buy Stall': 'cart-outline',
    'Advance Rent for Shop': 'business-outline',
    'Shop Assets': 'briefcase-outline',
    'Shop Machinery': 'cog-outline',
    'University Fees': 'school-outline',
    'Child Fees Loan': 'book-outline',
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleSubcategorySelect = (subcategory) => {
    setPressedButton(subcategory);
    setTimeout(() => {
      setModalVisible(false);
      setPressedButton(null);
      router.push({
        pathname: '/loan',
        params: { category: selectedCategory, subcategory: subcategory },
      });
    }, 200);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Your Loan Category</Text>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {Object.keys(loanData).map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.card, pressedButton === category && { backgroundColor: 'purple', color: 'white' }]}
            onPress={() => handleCategorySelect(category)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <Ionicons 
                name={categoryIcons[category] || 'help-circle-outline'} 
                size={30} 
                color="purple" 
                style={styles.icon} 
              />
              <Text style={styles.cardText}>{category}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal for subcategories */}
      <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
        <Animatable.View
          animation="fadeIn" // Apply fadeIn animation
          duration={300}
          style={styles.modalOverlay}
        >
          <Animatable.View
            animation="zoomIn" // Apply zoomIn animation
            duration={500}
            style={styles.modalContent}
          >
            <Text style={styles.modalHeader}>{selectedCategory}</Text>
            {loanData[selectedCategory]?.map((subcategory) => (
              <TouchableOpacity
                key={subcategory}
                style={[styles.subcategoryButton, pressedButton === subcategory && { backgroundColor: 'purple', color: 'white' }]}
                onPress={() => handleSubcategorySelect(subcategory)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={subcategoryIcons[subcategory] || 'help-circle-outline'}
                  size={24}
                  color="purple"
                  style={styles.subcategoryIcon}
                />
                <Text style={styles.buttonText}>{subcategory}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.buttonText1}>Close</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  listContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '80%',
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: 'purple',
    shadowOffset: { width: 12, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    marginRight: 15,
  },
  cardText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    paddingTop: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  subcategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: 'purple',
    shadowOffset: { width: 12, height: 12 },
    shadowOpacity: 0.1,
    width: '100%',
    justifyContent: 'center',
  },
  subcategoryIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  buttonText1: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  closeButton: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 10,
    
    marginTop: 20,
    color: 'white',
    width: '100%',
    alignItems: 'center',
  },
});

export default LandingPage;
