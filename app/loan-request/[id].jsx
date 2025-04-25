import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';

const BASE_URL = "http://192.168.100.148:4001/api";

// Memoized components for better performance
const StatusBadge = memo(({ status }) => {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return <MaterialIcons name="check-circle" size={16} color="#ffffff" />;
      case 'rejected': return <MaterialIcons name="cancel" size={16} color="#ffffff" />;
      case 'pending': return <MaterialIcons name="hourglass-empty" size={16} color="#ffffff" />;
      default: return <MaterialIcons name="help" size={16} color="#ffffff" />;
    }
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
      {getStatusIcon(status)}
      <Text style={styles.statusText}>{status || 'Unknown'}</Text>
    </View>
  );
});

const InfoRow = memo(({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
));

const CardHeader = memo(({ icon, title, color = '#6a11cb' }) => (
  <View style={styles.cardHeaderRow}>
    <MaterialIcons name={icon} size={22} color={color} />
    <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
  </View>
));

const InfoCard = memo(({ children, borderColor, borderWidth }) => (
  <View style={[
    styles.infoCard, 
    borderColor && borderWidth ? { borderLeftColor: borderColor, borderLeftWidth: borderWidth } : {}
  ]}>
    {children}
  </View>
));

// Format utility functions
const formatters = {
  date: (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  },
  
  currency: (amount) => {
    if (amount === undefined || amount === null) return '$0';
    return '$' + Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }
};

const LoanRequestDetailScreen = () => {
  const { loanData, id } = useLocalSearchParams();
  const router = useRouter();
  const [loanRequest, setLoanRequest] = useState(loanData ? JSON.parse(loanData) : null);
  const [loading, setLoading] = useState(!loanData);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLoanRequestDetails = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // If we already have loanData but want to refresh, we need the id
      const requestId = id || (loanRequest?._id);
      
      if (!requestId) {
        throw new Error('No loan request ID available');
      }
      
      const response = await fetch(`${BASE_URL}/loan-requests/${requestId}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch data');
      
      setLoanRequest(data);
      console.log('Fetched loan request:', data);
    } catch (e) {
      console.error('Error fetching loan request:', e);
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, loanRequest]);
  
  useEffect(() => {
    // Only fetch from API if we don't have the data passed in via params
    if (!loanData && id) {
      fetchLoanRequestDetails();
    } else {
      setLoading(false);
    }
  }, [id, loanData, fetchLoanRequestDetails]);

  const handleBackPress = () => {
    // Use replace instead of back() to ensure we go back to the loan requests screen
    router.replace('/user-loan-requests');
  };

  // Early returns for loading/error states
  if (loading && !refreshing) {
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

  const renderPersonalInfo = () => (
    <InfoCard>
      <CardHeader icon="info-outline" title="Key Details" />
      
      <InfoRow label="Email" value={loanRequest.email || 'N/A'} />
      <InfoRow label="Phone" value={loanRequest.personalInfo?.phoneNumber || 'N/A'} />
      <InfoRow label="Address" value={loanRequest.personalInfo?.address || 'N/A'} />
      <InfoRow label="Statement" value={loanRequest.statement || 'N/A'} />
      <InfoRow label="Status" value={loanRequest.status || 'Pending'} />
      <InfoRow label="User ID" value={loanRequest.userId || 'N/A'} />
      <InfoRow label="Created On" value={formatters.date(loanRequest.createdAt)} />
      <InfoRow label="Last Updated" value={formatters.date(loanRequest.updatedAt)} />
      <InfoRow label="Purpose" value={loanRequest.purpose || 'Not specified'} />
      <InfoRow label="Duration" value={`${loanRequest.duration || 'N/A'} months`} />
      <InfoRow label="Interest Rate" value={`${loanRequest.interestRate || 'N/A'}%`} />
      <InfoRow label="Guarantors" value={loanRequest.guarantors?.length || 0} />
    </InfoCard>
  );

  const renderPaymentInfo = () => (
    <InfoCard>
      <CardHeader icon="payments" title="Payment Information" />
      
      <InfoRow 
        label="Principal Amount" 
        value={formatters.currency(loanRequest.loanAmount || 0)} 
      />
      
      {loanRequest.paymentFrequency && (
        <InfoRow 
          label="Payment Frequency" 
          value={loanRequest.paymentFrequency} 
        />
      )}
      
      {loanRequest.monthlyPayment !== undefined && (
        <InfoRow 
          label="Monthly Payment" 
          value={formatters.currency(loanRequest.monthlyPayment)} 
        />
      )}
      
      {loanRequest.totalInterest !== undefined && (
        <InfoRow 
          label="Total Interest" 
          value={formatters.currency(loanRequest.totalInterest)} 
        />
      )}
      
      {loanRequest.totalPayment !== undefined && (
        <InfoRow 
          label="Total Payment" 
          value={formatters.currency(loanRequest.totalPayment)} 
        />
      )}
      
      {loanRequest.firstPaymentDate && (
        <InfoRow 
          label="First Payment Date" 
          value={formatters.date(loanRequest.firstPaymentDate)} 
        />
      )}
    </InfoCard>
  );

  const renderApplicantInfo = () => {
    if (!loanRequest.applicant) return null;
    
    return (
      <InfoCard>
        <CardHeader icon="person-outline" title="Applicant Information" />
        
        <InfoRow 
          label="Full Name" 
          value={loanRequest.applicant.name || 'N/A'} 
        />
        
        <InfoRow 
          label="Contact Number" 
          value={loanRequest.applicant.contact || 'N/A'} 
        />
        
        {loanRequest.applicant.email && (
          <InfoRow 
            label="Email" 
            value={loanRequest.applicant.email} 
          />
        )}
        
        {loanRequest.applicant.address && (
          <InfoRow 
            label="Address" 
            value={loanRequest.applicant.address} 
          />
        )}
        
        {loanRequest.applicant.occupation && (
          <InfoRow 
            label="Occupation" 
            value={loanRequest.applicant.occupation} 
          />
        )}
        
        {loanRequest.applicant.income !== undefined && (
          <InfoRow 
            label="Monthly Income" 
            value={formatters.currency(loanRequest.applicant.income)} 
          />
        )}
        
        {loanRequest.applicant.employmentStatus && (
          <InfoRow 
            label="Employment Status" 
            value={loanRequest.applicant.employmentStatus} 
          />
        )}
      </InfoCard>
    );
  };

  const renderCollateralInfo = () => {
    if (!loanRequest.collateral) return null;
    
    return (
      <InfoCard>
        <CardHeader icon="security" title="Collateral Information" />
        
        <InfoRow 
          label="Type" 
          value={loanRequest.collateral.type || 'N/A'} 
        />
        
        <InfoRow 
          label="Value" 
          value={formatters.currency(loanRequest.collateral.value || 0)} 
        />
        
        {loanRequest.collateral.description && (
          <InfoRow 
            label="Description" 
            value={loanRequest.collateral.description} 
          />
        )}
      </InfoCard>
    );
  };

  const renderGuarantors = () => {
    if (!loanRequest.guarantors || !loanRequest.guarantors.length) return null;
    
    return (
      <InfoCard>
        <CardHeader icon="people-outline" title="Guarantors" />
        
        {loanRequest.guarantors.map((guarantor, index) => (
          <View key={index} style={styles.guarantorContainer}>
            <Text style={styles.guarantorHeader}>Guarantor {index + 1}</Text>
            
            <InfoRow label="Name" value={guarantor.name || 'N/A'} />
            <InfoRow label="Contact" value={guarantor.cnic || 'N/A'} />
            
            {guarantor.email && (
              <InfoRow label="Email" value={guarantor.email} />
            )}
            
            {guarantor.location && (
              <InfoRow label="Location" value={guarantor.location} />
            )}
            
            {index < loanRequest.guarantors.length - 1 && (
              <View style={styles.guarantorDivider} />
            )}
          </View>
        ))}
      </InfoCard>
    );
  };

  const renderApprovalDetails = () => {
    if (!loanRequest.approvalDetails) return null;
    
    return (
      <InfoCard borderColor="#4CAF50" borderWidth={4}>
        <CardHeader icon="check-circle-outline" title="Approval Details" color="#4CAF50" />
        
        <InfoRow 
          label="Approved By" 
          value={loanRequest.approvalDetails.approvedBy || 'N/A'} 
        />
        
        <InfoRow 
          label="Approval Date" 
          value={formatters.date(loanRequest.approvalDetails.approvalDate)} 
        />
        
        {loanRequest.approvalDetails.notes && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Notes:</Text>
            <Text style={styles.noteText}>{loanRequest.approvalDetails.notes}</Text>
          </View>
        )}
        
        {loanRequest.approvalDetails.disbursementDate && (
          <InfoRow 
            label="Disbursement Date" 
            value={formatters.date(loanRequest.approvalDetails.disbursementDate)} 
          />
        )}
      </InfoCard>
    );
  };

  const renderRejectionDetails = () => {
    if (!loanRequest.rejectionDetails) return null;
    
    return (
      <InfoCard borderColor="#F44336" borderWidth={4}>
        <CardHeader icon="cancel" title="Rejection Details" color="#F44336" />
        
        <InfoRow 
          label="Rejected By" 
          value={loanRequest.rejectionDetails.rejectedBy || 'N/A'} 
        />
        
        <InfoRow 
          label="Rejection Date" 
          value={formatters.date(loanRequest.rejectionDetails.rejectionDate)} 
        />
        
        {loanRequest.rejectionDetails.reason && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Reason:</Text>
            <Text style={styles.noteText}>{loanRequest.rejectionDetails.reason}</Text>
          </View>
        )}
      </InfoCard>
    );
  };

  const renderDocuments = () => {
    if (!loanRequest.documents || !loanRequest.documents.length) return null;
    
    return (
      <InfoCard>
        <CardHeader icon="description" title="Documents" />
        
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
      </InfoCard>
    );
  };

  const renderRemarks = () => {
    if (!loanRequest.remarks) return null;
    
    return (
      <InfoCard>
        <CardHeader icon="chat" title="Additional Remarks" />
        <Text style={styles.remarksText}>{loanRequest.remarks}</Text>
      </InfoCard>
    );
  };

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
              <StatusBadge status={loanRequest.status} />
            </View>
            
            <View style={styles.amountSection}>
              <Text style={styles.amountLabelHeader}>Loan Amount</Text>
              <Text style={styles.amountValueHeader}>
                {formatters.currency(loanRequest.loanAmount)}
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
                {formatters.currency(loanRequest.monthlyPayment || 0)} /mo
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.detailsContainer}>
          {renderPersonalInfo()}
          {renderPaymentInfo()}
          {renderApplicantInfo()}
          {renderCollateralInfo()}
          {renderGuarantors()}
          {renderApprovalDetails()}
          {renderRejectionDetails()}
          {renderDocuments()}
          {renderRemarks()}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.refreshButton]} 
              onPress={fetchLoanRequestDetails}
              disabled={refreshing}
              activeOpacity={0.7}
            >
              {refreshing ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Feather name="refresh-cw" size={18} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Refresh</Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.backToListButton]} 
              onPress={handleBackPress}
              activeOpacity={0.7}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
    elevation: 3,
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