import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ScrollView, 
  StatusBar, 
  SafeAreaView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

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
    setPressedButton(category);
    setSelectedCategory(category);
    
    // Add a small delay for the press effect
    setTimeout(() => {
      setModalVisible(true);
      setPressedButton(null);
    }, 150);
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

  // Navigate to login page
  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      
      {/* Login Button */}
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={navigateToLogin}
        activeOpacity={0.8}
      >
        <Ionicons name="log-in-outline" size={20} color="#fff" />
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      
      <Animatable.View 
        animation="fadeIn" 
        duration={800} 
        style={styles.headerContainer}
      >
        <Text style={styles.header}>Finance Solutions</Text>
        <Text style={styles.subheader}>Choose a loan category to get started</Text>
      </Animatable.View>
      
      <ScrollView 
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(loanData).map((category, index) => (
          <Animatable.View
            key={category}
            animation="fadeInUp"
            delay={index * 100}
            duration={500}
          >
            <TouchableOpacity
              style={[
                styles.card, 
                pressedButton === category && styles.cardPressed
              ]}
              onPress={() => handleCategorySelect(category)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={categoryIcons[category] || 'help-circle-outline'} 
                    size={28} 
                    color="#6C63FF" 
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardText}>{category}</Text>
                  <Text style={styles.cardSubtext}>{loanData[category].length} options available</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </ScrollView>

      {/* Modal for subcategories */}
      <Modal 
        visible={modalVisible} 
        transparent={true} 
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animatable.View
          animation="fadeIn"
          duration={300}
          style={styles.modalOverlay}
        >
          <Animatable.View
            animation="zoomIn"
            duration={400}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCategory}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeIconButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.subcategoryList}>
              {loanData[selectedCategory]?.map((subcategory, index) => (
                <Animatable.View
                  key={subcategory}
                  animation="fadeInUp"
                  delay={index * 50}
                >
                  <TouchableOpacity
                    style={[
                      styles.subcategoryButton, 
                      pressedButton === subcategory && styles.subcategoryPressed
                    ]}
                    onPress={() => handleSubcategorySelect(subcategory)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.subcategoryIconContainer}>
                      <Ionicons
                        name={subcategoryIcons[subcategory] || 'help-circle-outline'}
                        size={22}
                        color="#6C63FF"
                      />
                    </View>
                    <Text style={styles.subcategoryText}>{subcategory}</Text>
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={closeModal}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  loginButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 30 : 10,
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
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: {
    backgroundColor: '#f0f0ff',
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtext: {
    color: '#888',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeIconButton: {
    padding: 5,
  },
  subcategoryList: {
    maxHeight: 400,
  },
  subcategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  subcategoryPressed: {
    backgroundColor: '#f0f0ff',
    borderColor: '#6C63FF',
  },
  subcategoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subcategoryText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LandingPage;