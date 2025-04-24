import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const BASE_URL = "http://192.168.100.148:4001/api";

const UserLoanRequestsScreen = () => {
  const { email: paramEmail, userId: paramUserId } = useLocalSearchParams();
  const router = useRouter();
  
  const [loanRequests, setLoanRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch loan requests by email or userId
  const fetchRequests = async ({ email, userId }) => {
    try {
      setLoading(true);

      const url = new URL(`${BASE_URL}/loan-requests`);
      if (email) url.searchParams.append('email', email);
      if (userId) url.searchParams.append('userId', userId);
  
      const response = await fetch(url.toString());
      const data = await response.json();
  
      // Log the data for debugging
      console.log('Fetched loan requests:', data);
  
      if (!response.ok) throw new Error(data.message || `Server error: ${response.status}`);
      if (!Array.isArray(data)) throw new Error('Unexpected response format');
  
      setLoanRequests(data);
      setError(null);
    } catch (e) {
      console.error('Fetch error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    const init = async () => {
      let email = paramEmail;
      if (!email) {
        email = await AsyncStorage.getItem('userEmail');
      }
      // If navigating with new userId, clear stored email filter
      if (paramUserId) {
        email = null;
      }

      if (!email && !paramUserId) {
        setError('No filter provided.');
        setLoading(false);
        return;
      }

      // persist the email if provided
      if (email) await AsyncStorage.setItem('userEmail', email);

      fetchRequests({ email, userId: paramUserId });
    };
    init();
  }, [paramEmail, paramUserId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests({ email: paramEmail, userId: paramUserId });
  };

  const navigateToDetail = (loanRequest) => {
    // Pass the entire loan request object instead of just the ID
    router.push({
      pathname: `/loan-request/${loanRequest._id}`,
      params: { loanData: JSON.stringify(loanRequest) }
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return '#4CAF50';
      case 'rejected': return '#F44336';
      case 'pending': return '#FFC107';
      default: return '#FFC107'; // Default to pending color
    }
  };

  if (loading && !refreshing) {
    return (
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading your loan requests...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.errorContainer}
      >
        <MaterialIcons name="error-outline" size={64} color="#ffffff" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchRequests({ email: paramEmail, userId: paramUserId })}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      style={styles.background}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Your Loan Requests</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Feather name="refresh-cw" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loanRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076432.png' }} 
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No loan requests found</Text>
          <Text style={styles.emptySubText}>Start by creating a new loan request</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/create-loan')}
          >
            <Text style={styles.createButtonText}>Create New Request</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
        data={loanRequests}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.listContainer}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.requestCard}
            onPress={() => navigateToDetail(item)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <Text style={styles.loanAmount}>{Number(item.loanAmount).toLocaleString()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]} >
                <Text style={styles.statusText}>{item.status || 'Pending'}</Text>
              </View>
            </View>
      
            <View style={styles.divider} />
      
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Feather name="mail" size={16} color="#6a11cb" />
                <Text style={styles.infoText} numberOfLines={1}>{item.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="user" size={16} color="#6a11cb" />
                <Text style={styles.infoText} numberOfLines={1}>ID: {item.userId?.substring(0, 8)}...</Text>
              </View>
            </View>
      
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Feather name="users" size={16} color="#6a11cb" />
                <Text style={styles.infoText}>{item.guarantors?.length || 0} Guarantors</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="calendar" size={16} color="#6a11cb" />
                <Text style={styles.infoText}>
                  {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                </Text>
              </View>
            </View>
      
            <View style={styles.viewDetailsContainer}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Feather name="chevron-right" size={16} color="#2575fc" />
            </View>
          </TouchableOpacity>
        )}
      />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6a11cb',
    marginTop: 4,
  },
  loanAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2575fc',
    marginLeft: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    color: '#444',
    fontSize: 14,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  viewDetailsText: {
    color: '#2575fc',
    fontWeight: '600',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    tintColor: 'rgba(255, 255, 255, 0.8)',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserLoanRequestsScreen;