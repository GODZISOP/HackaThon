import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';

const BASE_URL = "http://192.168.100.148:4001/api";

const LoanRequestDetailScreen = () => {
  const { loanData, id } = useLocalSearchParams();
  const router = useRouter();
  const [loanRequest, setLoanRequest] = useState(loanData ? JSON.parse(loanData) : null);
  const [loading, setLoading] = useState(!loanData);
  const [error, setError] = useState(null);
  console.log(loanRequest);
  const fetchLoanRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/loan-requests/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch data');
      setLoanRequest(data);
      console.log('Fetched loan request:', data);
    } catch (e) {
      console.error('Error fetching loan request:', e);
      setError(e.message);
    } finally {
      setLoading(false);
      console.log(data);
    }
  };
  
  useEffect(() => {
    // Only fetch from API if we don't have the data passed in via params
    if (!loanData && id) {
      fetchLoanRequestDetails();
    } else {
      setLoading(false);
    }
    console.log(loanRequest); 
  }, [id, loanData]);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0';
    return '$' + Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  if (loading) {
    return (
      <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading loan details...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#F44336" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchLoanRequestDetails}
        >
          <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.retryButtonGradient}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  if (!loanRequest) {
    return (
      <View style={styles.errorContainer}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076432.png' }}
          style={styles.noDataImage}
        />
        <Text style={styles.noDataText}>No loan request found</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchLoanRequestDetails}
        >
          <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.retryButtonGradient}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.containerOuter}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient 
          colors={['#6a11cb', '#2575fc']} 
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.loanIdText}>ID: {loanRequest._id.substring(0, 8)}...</Text>
          </View>

          <View style={styles.mainHeader}>
            <View style={styles.statusRow}>
              <Text style={styles.headerTitle}>Loan Request</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(loanRequest.status) }]}>
                <Text style={styles.statusText}>{loanRequest.status || 'Unknown'}</Text>
              </View>
            </View>
            
            // Check if loanAmount is defined, otherwise default to 0
<View style={styles.amountSection}>
  <Text style={styles.amountLabelHeader}>Loan Amount</Text>
  <Text style={styles.amountValueHeader}>
    {loanRequest.loanAmount ? formatCurrency(loanRequest.loanAmount) : 'N/A'}
  </Text>
</View>
          </View>

          <View style={styles.quickInfoRow}>
            <View style={styles.quickInfoItem}>
              <Feather name="calendar" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.quickInfoText}>
                {loanRequest.duration || 'N/A'} months
              </Text>
            </View>
            <View style={styles.quickInfoDivider} />
            <View style={styles.quickInfoItem}>
              <Feather name="percent" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.quickInfoText}>
                {loanRequest.interestRate || 'N/A'}% interest
              </Text>
            </View>
            <View style={styles.quickInfoDivider} />
            <View style={styles.quickInfoItem}>
              <FontAwesome5 name="money-bill-wave" size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.quickInfoText}>
                {formatCurrency(loanRequest.monthlyPayment)} /mo
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.detailsContainer}>
          {/* Key Details Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeaderRow}>
              <MaterialIcons name="info-outline" size={22} color="#6a11cb" />
              <Text style={styles.sectionTitle}>Key Details</Text>
            </View>
            
            <View style={styles.infoContainer}>
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Email</Text>
    <Text style={styles.infoValue}>{loanRequest.email}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Phone</Text>
    <Text style={styles.infoValue}>{loanRequest.personalInfo?.phoneNumber || 'N/A'}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Address</Text>
    <Text style={styles.infoValue}>{loanRequest.personalInfo?.address || 'N/A'}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Statement</Text>
    <Text style={styles.infoValue}>{loanRequest.statement}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Status</Text>
    <Text style={styles.infoValue}>{loanRequest.status}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>User ID</Text>
    <Text style={styles.infoValue}>{loanRequest.userId}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Created On</Text>
    <Text style={styles.infoValue}>{formatDate(loanRequest.createdAt)}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Last Updated</Text>
    <Text style={styles.infoValue}>{formatDate(loanRequest.updatedAt)}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Purpose</Text>
    <Text style={styles.infoValue}>{loanRequest.purpose || 'Not specified'}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Duration</Text>
    <Text style={styles.infoValue}>{loanRequest.duration || 'N/A'} months</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Interest Rate</Text>
    <Text style={styles.infoValue}>{loanRequest.interestRate || 'N/A'}%</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>Guarantors</Text>
    <Text style={styles.infoValue}>{loanRequest.guarantors?.length || 0}</Text>
  </View>
</View>
</View>

          {/* Payment Information */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeaderRow}>
              <MaterialIcons name="payments" size={22} color="#6a11cb" />
              <Text style={styles.sectionTitle}>Payment Information</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Principal Amount</Text>
              <Text style={styles.infoValue}>{formatCurrency(loanRequest.loanAmount)}</Text>
            </View>
            
            {loanRequest.paymentFrequency && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Frequency</Text>
                <Text style={styles.infoValue}>{loanRequest.paymentFrequency}</Text>
              </View>
            )}
            
            {loanRequest.monthlyPayment && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Monthly Payment</Text>
                <Text style={styles.infoValue}>{formatCurrency(loanRequest.monthlyPayment)}</Text>
              </View>
            )}
            
            {loanRequest.totalInterest && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total Interest</Text>
                <Text style={styles.infoValue}>{formatCurrency(loanRequest.totalInterest)}</Text>
              </View>
            )}
            
            {loanRequest.totalPayment && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total Payment</Text>
                <Text style={styles.infoValue}>{formatCurrency(loanRequest.totalPayment)}</Text>
              </View>
            )}
            
            {loanRequest.firstPaymentDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>First Payment Date</Text>
                <Text style={styles.infoValue}>{formatDate(loanRequest.firstPaymentDate)}</Text>
              </View>
            )}
          </View>

          {/* Applicant Information */}
          {loanRequest.applicant && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <MaterialIcons name="person-outline" size={22} color="#6a11cb" />
                <Text style={styles.sectionTitle}>Applicant Information</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{loanRequest.applicant.name || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact Number</Text>
                <Text style={styles.infoValue}>{loanRequest.applicant.contact || 'N/A'}</Text>
              </View>
              
              {loanRequest.applicant.email && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{loanRequest.applicant.email}</Text>
                </View>
              )}
              
              {loanRequest.applicant.address && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{loanRequest.applicant.address}</Text>
                </View>
              )}
              
              {loanRequest.applicant.occupation && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Occupation</Text>
                  <Text style={styles.infoValue}>{loanRequest.applicant.occupation}</Text>
                </View>
              )}
              
              {loanRequest.applicant.income && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Monthly Income</Text>
                  <Text style={styles.infoValue}>{formatCurrency(loanRequest.applicant.income)}</Text>
                </View>
              )}
              
              {loanRequest.applicant.employmentStatus && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Employment Status</Text>
                  <Text style={styles.infoValue}>{loanRequest.applicant.employmentStatus}</Text>
                </View>
              )}
            </View>
          )}

          {/* Collateral Information */}
          {loanRequest.collateral && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <MaterialIcons name="security" size={22} color="#6a11cb" />
                <Text style={styles.sectionTitle}>Collateral Information</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>{loanRequest.collateral.type || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Value</Text>
                <Text style={styles.infoValue}>{formatCurrency(loanRequest.collateral.value)}</Text>
              </View>
              
              {loanRequest.collateral.description && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{loanRequest.collateral.description}</Text>
                </View>
              )}
            </View>
          )}

          {/* Guarantors */}
          {loanRequest.guarantors && loanRequest.guarantors.length > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <MaterialIcons name="people-outline" size={22} color="#6a11cb" />
                <Text style={styles.sectionTitle}>Guarantors</Text>
              </View>
              
              {loanRequest.guarantors.map((guarantor, index) => (
                <View key={index} style={styles.guarantorContainer}>
                  <Text style={styles.guarantorHeader}>Guarantor {index + 1}</Text>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name</Text>
                    <Text style={styles.infoValue}>{guarantor.name || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Contact</Text>
                    <Text style={styles.infoValue}>{guarantor.cnic || 'N/A'}</Text>
                  </View>
                  
                  {guarantor.email && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Email</Text>
                      <Text style={styles.infoValue}>{guarantor.email}</Text>
                    </View>
                  )}
                  
                  {guarantor.location && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Location</Text>
                      <Text style={styles.infoValue}>{guarantor.location}</Text>
                    </View>
                  )}
                  
                  {index < loanRequest.guarantors.length - 1 && <View style={styles.guarantorDivider} />}
                </View>
              ))}
            </View>
          )}

          {/* Approval Details */}
          {loanRequest.approvalDetails && (
            <View style={[styles.infoCard, { borderLeftColor: '#4CAF50', borderLeftWidth: 4 }]}>
              <View style={styles.cardHeaderRow}>
                <MaterialIcons name="check-circle-outline" size={22} color="#4CAF50" />
                <Text style={[styles.sectionTitle, { color: '#4CAF50' }]}>Approval Details</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Approved By</Text>
                <Text style={styles.infoValue}>{loanRequest.approvalDetails.approvedBy || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Approval Date</Text>
                <Text style={styles.infoValue}>{formatDate(loanRequest.approvalDetails.approvalDate)}</Text>
              </View>
              
              {loanRequest.approvalDetails.notes && (
                <View style={styles.noteContainer}>
                  <Text style={styles.noteLabel}>Notes:</Text>
                  <Text style={styles.noteText}>{loanRequest.approvalDetails.notes}</Text>
                </View>
              )}
              
              {loanRequest.approvalDetails.disbursementDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Disbursement Date</Text>
                  <Text style={styles.infoValue}>{formatDate(loanRequest.approvalDetails.disbursementDate)}</Text>
                </View>
              )}
            </View>
          )}

          {/* Rejection Details */}
          {loanRequest.rejectionDetails && (
            <View style={[styles.infoCard, { borderLeftColor: '#F44336', borderLeftWidth: 4 }]}>
              <View style={styles.cardHeaderRow}>
                <MaterialIcons name="cancel" size={22} color="#F44336" />
                <Text style={[styles.sectionTitle, { color: '#F44336' }]}>Rejection Details</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rejected By</Text>
                <Text style={styles.infoValue}>{loanRequest.rejectionDetails.rejectedBy || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rejection Date</Text>
                <Text style={styles.infoValue}>{formatDate(loanRequest.rejectionDetails.rejectionDate)}</Text>
              </View>
              
              {loanRequest.rejectionDetails.reason && (
                <View style={styles.noteContainer}>
                  <Text style={styles.noteLabel}>Reason:</Text>
                  <Text style={styles.noteText}>{loanRequest.rejectionDetails.reason}</Text>
                </View>
              )}
            </View>
          )}

          {/* Documents */}
          {loanRequest.documents && loanRequest.documents.length > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <MaterialIcons name="description" size={22} color="#6a11cb" />
                <Text style={styles.sectionTitle}>Documents</Text>
              </View>
              
              {loanRequest.documents.map((doc, index) => (
                <View key={index} style={styles.documentRow}>
                  <MaterialIcons name="insert-drive-file" size={20} color="#2575fc" />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentType}>{doc.type || `Document ${index + 1}`}</Text>
                    <Text style={styles.documentFilename}>{doc.filename || 'Uploaded file'}</Text>
                  </View>
                  <TouchableOpacity style={styles.documentViewButton}>
                    <Text style={styles.documentViewText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Additional Remarks */}
          {loanRequest.remarks && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <MaterialIcons name="chat" size={22} color="#6a11cb" />
                <Text style={styles.sectionTitle}>Additional Remarks</Text>
              </View>
              
              <Text style={styles.remarksText}>{loanRequest.remarks}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.refreshButton]} 
              onPress={fetchLoanRequestDetails}
            >
              <Feather name="refresh-cw" size={18} color="#ffffff" />
              <Text style={styles.actionButtonText}>Refresh</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.backToListButton]} 
              onPress={() => router.back()}
            >
              <Feather name="list" size={18} color="#ffffff" />
              <Text style={styles.actionButtonText}>Back to List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  containerOuter: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  headerGradient: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loanIdText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  mainHeader: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
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
  amountSection: {
    marginTop: 10,
  },
  amountLabelHeader: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  amountValueHeader: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  quickInfoRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickInfoText: {
    color: '#ffffff',
    marginLeft: 6,
    fontSize: 14,
  },
  quickInfoDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  detailsContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  guarantorContainer: {
    marginBottom: 10,
  },
  guarantorHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 5,
  },
  guarantorDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  noteContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 10,
  },
  documentType: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  documentFilename: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  documentViewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
  },
  documentViewText: {
    color: '#2575fc',
    fontSize: 13,
    fontWeight: '600',
  },
  remarksText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 0.48,
  },
  refreshButton: {
    backgroundColor: '#6a11cb',
  },
  backToListButton: {
    backgroundColor: '#2575fc',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  noDataImage: {
    width: 100,
    height: 100,
    tintColor: '#aaa',
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    width: '50%',
    marginTop: 20,
    overflow: 'hidden',
    borderRadius: 10,
  },
  retryButtonGradient: {
    padding: 14,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoanRequestDetailScreen;