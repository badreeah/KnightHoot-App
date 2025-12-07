// ManageAlerts.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase';
import { useAppSettings } from "../src/context/AppSettingProvid";

const ManageAlertsScreen = ({ navigation }) => {
  const { theme } = useAppSettings();
  const styles = makeStyles(theme);

  const [uncertainAlerts, setUncertainAlerts] = useState([]);
  const [certainAlerts, setCertainAlerts] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [timeFilter, setTimeFilter] = useState('Today');

  // Fetch SMS scans from database
  const fetchSMSScans = async (userId) => {
    try {
      console.log('Fetching SMS scans...');
      const { data: scans, error } = await supabase
        .from('sms_scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching SMS scans:', error);
        Alert.alert('Database Error', `Failed to fetch SMS scans: ${error.message}`);
        return;
      }

      console.log('Fetched SMS scans:', scans?.length || 0, 'records');
      console.log('Sample scan:', scans?.[0]);

      const uncertain = [];
      const certain = [];

      scans?.forEach((scan) => {
        const isSpam = scan.classification_response?.toLowerCase() === 'spam';
        const confidence = scan.confidence_score || 0;

        const alert = {
          id: scan.id,
          title: isSpam ? 'Suspicious SMS Detected!' : 'SMS Scanned',
          from: scan.sender_id || 'Unknown Sender',
          description: scan.message_content?.substring(0, 100) + (scan.message_content?.length > 100 ? '...' : ''),
          action: isSpam ? 'SMS sender blocked' : 'SMS scanned and safe',
          time: `Detected at ${new Date(scan.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          date: getRelativeDate(scan.created_at),
          iconColor: isSpam ? '#FE6D72' : '#FDFEBB',
          confidence: confidence,
          reported: false,
          restored: false,
          raw_data: scan,
        };

        // Classify as certain (high confidence spam) or uncertain (low confidence or ham)
        if (isSpam && confidence > 0.7) {
          certain.push(alert);
        } else {
          uncertain.push(alert);
        }
      });

      console.log('Uncertain alerts:', uncertain.length);
      console.log('Certain alerts:', certain.length);

      setUncertainAlerts(uncertain);
      setCertainAlerts(certain);
    } catch (err) {
      console.error('Error in fetchSMSScans:', err);
      Alert.alert('Error', `Exception in fetchSMSScans: ${err.message}`);
    }
  };

  // Get relative date (Today, Yesterday, X days ago)
  const getRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  // Get user and fetch data
  useEffect(() => {
    const getUserAndFetch = async () => {
      console.log('ManageAlerts: Fetching user and data...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('ManageAlerts: User:', user?.id);
      if (user) {
        setUserId(user.id);
        await fetchSMSScans(user.id);
      } else {
        // If no user, still fetch SMS scans (no user_id filter)
        await fetchSMSScans(null);
      }
    };
    getUserAndFetch();
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('sms_scans_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sms_scans',
        },
        async () => {
          await fetchSMSScans(userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const toggleExpand = (id) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  // Report alert to scam_reports table
  const reportAlert = async (alert) => {
    try {
      const reportData = {
        user_id: userId,
        scam_type: 'messages',
        description: `From: ${alert.from}\nMessage: ${alert.description}\nConfidence: ${(alert.confidence * 100).toFixed(1)}%`,
        status: 'pending',
      };

      const { error } = await supabase.from('scam_reports').insert([reportData]);

      if (error) {
        console.error('Error reporting SMS:', error);
        Alert.alert('Error', 'Failed to report SMS. Please try again.');
        return;
      }

      // Update local state
      setUncertainAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, reported: true } : a));
      setCertainAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, reported: true } : a));

      Alert.alert('Success', 'SMS reported successfully.');
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', 'An error occurred while reporting.');
    }
  };

  // Unreport alert
  const unreportAlert = async (alert) => {
    try {
      const descriptionToDelete = `From: ${alert.from}\nMessage: ${alert.description}\nConfidence: ${(alert.confidence * 100).toFixed(1)}%`;

      const { error } = await supabase
        .from('scam_reports')
        .update({ status: 'dismissed_by_user' })
        .eq('user_id', userId)
        .eq('scam_type', 'messages')
        .eq('description', descriptionToDelete);

      if (error) {
        console.error('Error unreporting SMS:', error);
        Alert.alert('Error', 'Failed to unreport SMS. Please try again.');
        return;
      }

      setUncertainAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, reported: false } : a));
      setCertainAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, reported: false } : a));

      Alert.alert('Success', 'SMS unreported successfully.');
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', 'An error occurred while unreporting.');
    }
  };

  // Restore/dismiss alert
  const restoreAlert = (alert, isUncertain) => {
    if (isUncertain) {
      setUncertainAlerts(prev => prev.filter(a => a.id !== alert.id));
    } else {
      setCertainAlerts(prev => prev.filter(a => a.id !== alert.id));
    }
    Alert.alert('Success', 'Alert dismissed successfully.');
  };

  const renderAlertCard = (alert, isUncertain = true) => {
    const isActive = activeCardId === alert.id;

    return (
      <TouchableOpacity
        key={alert.id}
        activeOpacity={0.8}
        onPress={() => toggleExpand(alert.id)}
        style={[
          styles.alertCard,
          isActive && styles.alertCardActive,
          alert.reported && styles.alertReported,
        ]}
      >
        <View style={[styles.alertIcon, { backgroundColor: alert.iconColor }]} />
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <View style={styles.divider} />

          <Text style={styles.alertText}>
            <Text style={styles.alertLabel}>From: </Text>{alert.from}
          </Text>
          <Text style={styles.alertText}>
            <Text style={styles.alertLabel}>Description: </Text>{alert.description}
          </Text>
          {alert.action && (
            <Text style={[styles.alertText, { color: theme.badges.danger }]}>
              {alert.action}
            </Text>
          )}
          <Text style={styles.alertText}>
            <Text style={styles.alertLabel}>Time: </Text>{alert.time}
          </Text>
          <Text style={styles.alertText}>
            <Text style={styles.alertLabel}>Date: </Text>{alert.date}
          </Text>

          {isActive && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => alert.reported ? unreportAlert(alert) : reportAlert(alert)}
              >
                <Text style={styles.reportButtonText}>
                  {alert.reported ? 'Unreport' : 'Report'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.restoreButton}
                onPress={() => restoreAlert(alert, isUncertain)}
              >
                <Text style={styles.restoreButtonText}>Restore</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Alerts</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Uncertain Alerts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Uncertain Alerts</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>{timeFilter}</Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          {uncertainAlerts.length === 0 ? (
            <Text style={styles.placeholderText}>No uncertain alerts</Text>
          ) : (
            uncertainAlerts.map(alert => renderAlertCard(alert, true))
          )}
        </View>

        {/* Certain Alerts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Certain Alerts</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>{timeFilter}</Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          {certainAlerts.length === 0 ? (
            <Text style={styles.placeholderText}>No certain alerts</Text>
          ) : (
            certainAlerts.map(alert => renderAlertCard(alert, false))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-600',
    color: theme.colors.primary,
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-600',
    color: theme.colors.text,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Poppins-500',
    color: theme.colors.text,
    marginRight: 4,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
  },
  alertCardActive: {
    borderColor: theme.colors.primary,
  },
  alertReported: {
    opacity: 0.7,
  },
  alertIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    marginRight: 15,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-600',
    marginBottom: 8,
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginVertical: 8,
  },
  alertText: {
    fontSize: 13,
    fontFamily: 'Poppins-400',
    color: theme.colors.subtext,
    marginBottom: 4,
    lineHeight: 20,
  },
  alertLabel: {
    fontFamily: 'Poppins-600',
    color: theme.colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    gap: 10,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FE6D72',
    backgroundColor: '#FEE5E6',
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#5ECEC9',
    backgroundColor: '#E0F7F6',
  },
  reportButtonText: {
    fontFamily: 'Poppins-600',
    fontSize: 14,
    color: '#FE6D72',
  },
  restoreButtonText: {
    fontFamily: 'Poppins-600',
    fontSize: 14,
    color: '#5ECEC9',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Poppins-400',
    fontStyle: 'italic',
    color: theme.colors.subtext,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default ManageAlertsScreen;
