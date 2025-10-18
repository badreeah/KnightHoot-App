<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
=======
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase';
>>>>>>> 57fbe7bd7995e1c712d61e7c753613b2fbbce4f4
=======
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const initialAlertsData = {
  uncertain: [
    {
      id: 1,
      title: "Suspicious SMS Detected !",
      from: "+1234567890 (John Doe)",
      description: "This SMS may contain a suspicious link. Do not click the link.",
      action: "the sms sender is blocked",
      time: "Detected at 11:32 AM",
      date: "1 week ago",
      iconColor: '#FDFEBB',
      reported: false,
      restored: false,
    },
    {
      id: 2,
      title: "Suspicious SMS Detected !",
      from: "+9876543210 (Jane Smith)",
      description: "This SMS contains suspicious content.",
      action: "User alerted",
      time: "Detected at 9:15 AM",
      date: "2 days ago",
      iconColor: '#FDFEBB',
      reported: false,
      restored: false,
    },
  ],
  certain: [
    {
      id: 3,
      title: "Suspicious SMS Handled !",
      from: "+4567890123 (Sam Doe)",
      description: "This SMS has been handled and blocked automatically.",
      action: "Automatically handled",
      time: "Detected at 10:00 AM",
      date: "Today",
      iconColor: '#FE6D72',
      reported: false,
      restored: false,
    },
  ],
};

const ManageAlertsScreen = () => {
  const [alertsData, setAlertsData] = useState(initialAlertsData);
  const [activeCardId, setActiveCardId] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveCardId(activeCardId === id ? null : id);
  };

  const reportAlert = (type, id) => {
    setAlertsData(prev => ({
      ...prev,
      [type]: prev[type].map(alert => alert.id === id ? { ...alert, reported: true, restored: false } : alert)
    }));
  };

  const restoreAlert = (type, id) => {
    setAlertsData(prev => ({
      ...prev,
      [type]: prev[type].map(alert => alert.id === id ? { ...alert, restored: true, reported: false } : alert)
    }));
  };

  const renderAlertCard = (alert, type) => {
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
          alert.restored && styles.alertRestored
        ]}
      >
        <View style={[styles.alertIcon, { backgroundColor: alert.iconColor }]} />
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <View style={styles.divider} />

          <Text style={styles.alertText}>
            <Text style={styles.alertLabel}>From:</Text> {alert.from}
          </Text>
          <Text style={styles.alertText}>
            <Text style={styles.alertLabel}>Description:</Text> {alert.description}
          </Text>

          {isActive && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => reportAlert(type, alert.id)}
              >
                <Ionicons name="alert-circle-outline" size={18} color="#fff" style={{marginRight: 6}} />
                <Text style={styles.reportButtonText}>Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.restoreButton}
                onPress={() => restoreAlert(type, alert.id)}
              >
                <Ionicons name="refresh-outline" size={18} color="#fff" style={{marginRight: 6}} />
                <Text style={styles.restoreButtonText}>Restore</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";
>>>>>>> origin/feature/alerts-stats

const SUPABASE_URL = 'https://qsgrxnzljtoebmeqcpbp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZ3J4bnpsanRvZWJtZXFjcGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MzQ1MTMsImV4cCI6MjA3NDIxMDUxM30.2sHDLxRF_dZp0tbZ5_Pefed3rsOoEfw5zMVAjEjIqZs';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

<<<<<<< HEAD
const ManageAlerts = ({ navigation }) => {
    const [alertsData, setAlertsData] = useState({ uncertain: [], certain: [] });
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        setLoading(true);
        const { data: alerts, error } = await supabase
            .from('alerts')
            .select('*')
            .order('created_at', { ascending: false });
=======
const initialAlertsData = {
  sms: {
    uncertain: [
      {
        id: 1,
        title: "Suspicious SMS Detected !",
        from: "+1234567890 (John Doe)",
        description: "This SMS may contain a suspicious link. Do not click the link.",
        action: "the sms sender is blocked",
        time: "Detected at 11:32 AM",
        date: "1 week ago",
        iconColor: '#FDFEBB',
        reported: false,
        restored: false,
      },
      {
        id: 2,
        title: "Suspicious SMS Detected !",
        from: "+9876543210 (Jane Smith)",
        description: "This SMS contains suspicious content.",
        action: "User alerted",
        time: "Detected at 9:15 AM",
        date: "2 days ago",
        iconColor: '#FDFEBB',
        reported: false,
        restored: false,
      },
    ],
    certain: [
      {
        id: 3,
        title: "Suspicious SMS Handled !",
        from: "+4567890123 (Sam Doe)",
        description: "This SMS has been handled and blocked automatically.",
        action: "Automatically handled",
        time: "Detected at 10:00 AM",
        date: "Today",
        iconColor: '#FE6D72',
        reported: false,
        restored: false,
      },
    ],
  },
  email: {
    uncertain: [],
    certain: [],
  },
};

const ManageAlertsScreen = () => {
  const [alertsData, setAlertsData] = useState(initialAlertsData);
  const [activeCardId, setActiveCardId] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchEmailScans = async (userId) => {
    const { data: scans, error } = await supabase
      .from('email_scans')
      .select('*')
      .eq('user_id', userId)
      .order('scanned_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching email scans:', error);
      return;
    }

    const emailAlerts = {
      uncertain: [],
      certain: [],
    };

    scans.forEach((scan, index) => {
      const alert = {
        id: `email-${scan.id}`,
        title: scan.is_scam ? "Suspicious Email Detected!" : "Email Scanned",
        from: scan.from_address,
        description: scan.subject + (scan.snippet ? ` - ${scan.snippet}` : ''),
        action: scan.is_scam ? "Flagged as potential scam" : "Scanned and safe",
        time: new Date(scan.scanned_at).toLocaleTimeString(),
        date: new Date(scan.scanned_at).toLocaleDateString(),
        iconColor: scan.is_scam ? '#FE6D72' : '#52A7FC',
        reported: false,
        restored: false,
      };

      if (scan.is_scam) {
        emailAlerts.certain.push(alert);
      } else {
        emailAlerts.uncertain.push(alert);
      }
    });

    setAlertsData(prev => ({
      ...prev,
      email: emailAlerts,
    }));
  };

  useEffect(() => {
    const getUserAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await fetchEmailScans(user.id);
      }
    };

    getUserAndFetch();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('email_scans_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'email_scans',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          console.log('New email scan inserted:', payload.new);
          // Refetch to update the list
          await fetchEmailScans(userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
>>>>>>> 57fbe7bd7995e1c712d61e7c753613b2fbbce4f4

        if (error) {
            console.error('Error fetching alerts:', error.message);
            setLoading(false);
            return;
        }

<<<<<<< HEAD
        const processedAlerts = { uncertain: [], certain: [] };
        alerts.forEach(alert => {
            const isCertain = alert.severity.toLowerCase() === 'high';
            const processedAlert = {
                id: alert.id,
                title: isCertain ? 'Suspicious SMS Handled !' : 'Suspicious SMS Detected !',
                from: `Device ID: ${alert.device_id ? alert.device_id.substring(0, 8) + '...' : 'N/A'}`,
                description: alert.message,
                action: 'Awaiting User Review',
                time: new Date(alert.created_at).toLocaleTimeString('ar-EG'),
                date: new Date(alert.created_at).toLocaleDateString('ar-EG'),
                iconColor: isCertain ? '#F16A6A' : '#FCEEAA',
                reported: false,
                restored: false,
            };
            if (isCertain) processedAlerts.certain.push(processedAlert);
            else processedAlerts.uncertain.push(processedAlert);
        });

        setAlertsData(processedAlerts);
        setLoading(false);
    };
=======
  const reportAlert = async (type, id) => {
    const [channel, subType] = type.split('-');
    if (channel === 'email') {
      const alert = alertsData[channel][subType].find(a => a.id === id);
      if (!alert) return;
      const parts = alert.description.split(' - ');
      const subject = parts[0];
      const snippet = parts.slice(1).join(' - ') || '';
      const reportData = {
        user_id: userId,
        scam_type: 'email',
        description: `Email: ${alert.from}\nSubject: ${subject}\nDescription: ${snippet}`,
      };
      try {
        const { error } = await supabase
          .from('scam_reports')
          .insert([reportData]);
        if (error) {
          console.error('Error reporting email:', error);
          Alert.alert('Error', 'Failed to report email. Please try again.');
          return;
        }
        setAlertsData(prev => ({
          ...prev,
          [channel]: {
            ...prev[channel],
            [subType]: prev[channel][subType].map(a => a.id === id ? { ...a, reported: true, restored: false } : a)
          }
        }));
        Alert.alert('Success', 'Email reported successfully.');
      } catch (err) {
        console.error('Error:', err);
        Alert.alert('Error', 'An error occurred while reporting.');
      }
    } else {
      setAlertsData(prev => ({
        ...prev,
        [channel]: {
          ...prev[channel],
          [subType]: prev[channel][subType].map(alert => alert.id === id ? { ...alert, reported: true, restored: false } : alert)
        }
      }));
    }
  };

  const unreportAlert = async (type, id) => {
    const [channel, subType] = type.split('-');
    if (channel === 'email') {
      const alert = alertsData[channel][subType].find(a => a.id === id);
      if (!alert) return;
      const parts = alert.description.split(' - ');
      const subject = parts[0];
      const snippet = parts.slice(1).join(' - ') || '';
      const descriptionToDelete = `Email: ${alert.from}\nSubject: ${subject}\nDescription: ${snippet}`;
      console.log('Unreporting email with userId:', userId, 'description:', descriptionToDelete);
      try {
        const { data, error } = await supabase
          .from('scam_reports')
          .update({ status: 'dismissed_by_user' })
          .eq('user_id', userId)
          .eq('scam_type', 'email')
          .eq('description', descriptionToDelete)
          .select();
        console.log('Update result:', data, 'error:', error);
        if (error) {
          console.error('Error unreporting email:', error);
          Alert.alert('Error', 'Failed to unreport email. Please try again.');
          return;
        }
        setAlertsData(prev => ({
          ...prev,
          [channel]: {
            ...prev[channel],
            [subType]: prev[channel][subType].map(a => a.id === id ? { ...a, reported: false } : a)
          }
        }));
        Alert.alert('Success', 'Email unreported successfully.');
      } catch (err) {
        console.error('Error:', err);
        Alert.alert('Error', 'An error occurred while unreporting.');
      }
    }
  };

  const restoreAlert = (type, id) => {
    const [channel, subType] = type.split('-');
    if (channel === 'email') {
      setAlertsData(prev => ({
        ...prev,
        [channel]: {
          ...prev[channel],
          [subType]: prev[channel][subType].filter(alert => alert.id !== id)
        }
      }));
    } else {
      setAlertsData(prev => ({
        ...prev,
        [channel]: {
          ...prev[channel],
          [subType]: prev[channel][subType].map(alert => alert.id === id ? { ...alert, restored: true, reported: false } : alert)
        }
      }));
    }
  };
>>>>>>> 57fbe7bd7995e1c712d61e7c753613b2fbbce4f4

    useEffect(() => {
        fetchAlerts();
    }, []);

    const reportAlert = async (type, id) => {
        setAlertsData(prev => ({
            ...prev,
            [type]: prev[type].map(alert => alert.id === id ? { ...alert, reported: true, restored: false } : alert)
        }));
    };

<<<<<<< HEAD
    const restoreAlert = async (type, id) => {
        setAlertsData(prev => ({
            ...prev,
            [type]: prev[type].map(alert => alert.id === id ? { ...alert, restored: true, reported: false } : alert)
        }));
    };

    const renderAlertCard = (alert, type) => {
        let cardStyle = [styles.alertCard];
        if (alert.reported || alert.restored) cardStyle.push(styles.alertDisabled);

        return (
            <View key={alert.id} style={cardStyle}>
                <View style={styles.cardHeader}>
                    <View style={[styles.alertIcon, { backgroundColor: alert.iconColor }]} />
                    <View style={styles.alertContent}>
                        <Text style={styles.alertTitle}>{alert.title}</Text>
                        <View style={styles.divider} />
                        <View style={styles.alertDetails}>
                            <Text style={styles.detailText}><Text style={styles.detailLabel}>From:</Text> {alert.from}</Text>
                            <Text style={styles.detailText}><Text style={styles.detailLabel}>Description:</Text> {alert.description}</Text>
                            <Text style={styles.warningText}>Do not click the link.</Text>
                            <Text style={styles.detailText}><Text style={styles.detailLabel}>Action Taken:</Text> {alert.action}</Text>
                            <Text style={styles.detailText}><Text style={styles.detailLabel}>Time:</Text> {alert.time}</Text>
                            <Text style={styles.detailText}><Text style={styles.detailLabel}>Date:</Text> {alert.date}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.reportButton, alert.reported && styles.buttonDisabled]}
                        onPress={() => reportAlert(type, alert.id)}
                        disabled={alert.reported || alert.restored}
                    >
                        <Text style={[styles.reportButtonText, alert.reported && styles.buttonTextDisabled]}>
                            {alert.reported ? 'Reported' : 'Report'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.restoreButton, alert.restored && styles.buttonDisabled]}
                        onPress={() => restoreAlert(type, alert.id)}
                        disabled={alert.reported || alert.restored}
                    >
                        <Text style={[styles.restoreButtonText, alert.restored && styles.buttonTextDisabled]}>
                            {alert.restored ? 'Restored' : 'Restore'}
                        </Text>
                    </TouchableOpacity>
                </View>
=======
          {isActive && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => alert.reported ? unreportAlert(type, alert.id) : reportAlert(type, alert.id)}
              >
                <Ionicons name="alert-circle-outline" size={18} color="#fff" style={{marginRight: 6}} />
                <Text style={styles.reportButtonText}>{alert.reported ? 'Unreport' : 'Report'}</Text>
              </TouchableOpacity>

              {!(type.startsWith('email') && alert.reported) && (
                <TouchableOpacity
                  style={styles.restoreButton}
                  onPress={() => restoreAlert(type, alert.id)}
                >
                  <Ionicons name="refresh-outline" size={18} color="#fff" style={{marginRight: 6}} />
                  <Text style={styles.restoreButtonText}>Restore</Text>
                </TouchableOpacity>
              )}
>>>>>>> 57fbe7bd7995e1c712d61e7c753613b2fbbce4f4
            </View>
        );
    };

<<<<<<< HEAD
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A29A3" />
                <Text style={styles.loadingText}>Fetching alerts from Supabase...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.mainContainer}>
                <View style={styles.appHeader}>
                    <Text style={styles.appName}>KnightHoo</Text>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                 <View style={styles.pageHeader}>
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="arrow-back" size={24} color="#555" />
    </TouchableOpacity>
    <Text style={styles.pageTitle}>Manage Alerts</Text>
</View>


                    {/* Uncertain Alerts Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Uncertain Alerts</Text>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text style={styles.filterText}>Today</Text>
                                <Ionicons name="chevron-down" size={16} color="#555" />
                            </TouchableOpacity>
                        </View>
                        {alertsData.uncertain.length > 0 ? (
                            alertsData.uncertain.map(alert => renderAlertCard(alert, 'uncertain'))
                        ) : (
                            <Text style={styles.noAlertsText}>No uncertain alerts found.</Text>
                        )}
                    </View>

                    {/* Certain Alerts Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Certain Alerts</Text>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text style={styles.filterText}>Today</Text>
                                <Ionicons name="chevron-down" size={16} color="#555" />
                            </TouchableOpacity>
                        </View>
                        {alertsData.certain.length > 0 ? (
                            alertsData.certain.map(alert => renderAlertCard(alert, 'certain'))
                        ) : (
                            <Text style={styles.noAlertsText}>No certain alerts found.</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFF' },
    mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
    loadingText: { marginTop: 10, color: '#555' },
    appHeader: { paddingVertical: 12, alignItems: 'center' },
    appName: { fontSize: 22, fontWeight: 'bold', color: '#4A29A3' },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 10 },
    pageTitle: { fontSize: 18, fontWeight: '600', color: '#8B5CF6', marginLeft: 16 },
    section: { marginBottom: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
    filterButton: { flexDirection: 'row', alignItems: 'center' },
    filterText: { color: '#555', marginRight: 4 },
    alertCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#EEE', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
    alertDisabled: { opacity: 0.6 },
    cardHeader: { flexDirection: 'row' },
    alertIcon: { width: 40, height: 40, borderRadius: 8, marginRight: 12, marginTop: 4 },
    alertContent: { flex: 1 },
    alertTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 8 },
    alertDetails: { gap: 4 },
    detailText: { color: '#555', fontSize: 13 },
    detailLabel: { fontWeight: '600' },
    warningText: { color: '#D9534F', fontWeight: '600', fontSize: 13 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 },
    reportButton: { backgroundColor: '#FEF0F0', borderWidth: 1, borderColor: '#F8D2D2', paddingVertical: 8, paddingHorizontal: 24, borderRadius: 8 },
    reportButtonText: { color: '#E53E3E', fontWeight: '600' },
    restoreButton: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', paddingVertical: 8, paddingHorizontal: 24, borderRadius: 8 },
    restoreButtonText: { color: '#059669', fontWeight: '600' },
    buttonDisabled: { backgroundColor: '#F5F5F5', borderColor: '#E0E0E0' },
    buttonTextDisabled: { color: '#999' },
    noAlertsText: { textAlign: 'center', color: '#888', fontStyle: 'italic', paddingVertical: 20 },
=======
  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
<<<<<<< HEAD
        {Object.keys(alertsData).map(channel => (
          <View key={channel}>
            <Text style={styles.channelTitle}>{channel.toUpperCase()} ALERTS</Text>
            {['uncertain','certain'].map(type => (
              <View key={`${channel}-${type}`} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {channel === 'sms' ? (type === 'uncertain' ? 'Uncertain SMS Alerts' : 'Certain SMS Alerts') :
                   (type === 'uncertain' ? 'Scanned Emails' : 'Suspicious Emails')}
                </Text>
                {alertsData[channel][type].length === 0 ? (
                  <Text style={styles.placeholderText}>No {type} {channel} alerts</Text>
                ) : (
                  alertsData[channel][type].map(alert => renderAlertCard(alert, `${channel}-${type}`))
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
=======
        {['uncertain','certain'].map(type => (
          <View key={type} style={styles.section}>
            <Text style={styles.sectionTitle}>{type === 'uncertain' ? 'Uncertain Alerts' : 'Certain Alerts'}</Text>
            {alertsData[type].length === 0 ? (
              <Text style={styles.placeholderText}>No {type} alerts</Text>
            ) : (
              alertsData[type].map(alert => renderAlertCard(alert, type))
            )}
          </View>
        ))}
      </ScrollView>
    <View style={styles.container}>
      <Text style={{ color: theme.colors.text }}>{t("manageAlerts")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f6f6f6' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  alertCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 15 },
  alertCardActive: { borderColor: '#7F3DFF', borderWidth: 1 },
  alertReported: { opacity: 0.6 },
  alertRestored: { opacity: 0.6 },
  alertIcon: { width: 24, height: 24, borderRadius: 8, marginRight: 15 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  alertText: { fontSize: 13, color: '#555' },
  alertLabel: { fontWeight: 'bold', color: '#333' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  reportButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginRight: 10 },
  reportButtonText: { color: '#fff', fontWeight: 'bold' },
  restoreButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3498db', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  restoreButtonText: { color: '#fff', fontWeight: 'bold' },
  placeholderText: { fontSize: 16, fontStyle: 'italic', color: '#999', textAlign: 'center' },
});

export default ManageAlertsScreen;
}
>>>>>>> origin/feature/alerts-stats

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f6f6f6' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  channelTitle: { fontSize: 20, fontWeight: 'bold', color: '#7F3DFF', marginTop: 20, marginBottom: 10 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  alertCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 15 },
  alertCardActive: { borderColor: '#7F3DFF', borderWidth: 1 },
  alertReported: { opacity: 0.6 },
  alertRestored: { opacity: 0.6 },
  alertIcon: { width: 24, height: 24, borderRadius: 8, marginRight: 15 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  alertText: { fontSize: 13, color: '#555' },
  alertLabel: { fontWeight: 'bold', color: '#333' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  reportButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginRight: 10 },
  reportButtonText: { color: '#fff', fontWeight: 'bold' },
  restoreButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3498db', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  restoreButtonText: { color: '#fff', fontWeight: 'bold' },
  placeholderText: { fontSize: 16, fontStyle: 'italic', color: '#999', textAlign: 'center' },
>>>>>>> 57fbe7bd7995e1c712d61e7c753613b2fbbce4f4
});

export default ManageAlerts;
