// ManageAlerts.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase';
import { useAppSettings } from "../src/context/AppSettingProvid";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const { theme } = useAppSettings();
  const styles = makeStyles(theme);

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

    scans.forEach((scan) => {
      const alert = {
        id: `email-${scan.id}`,
        title: scan.is_scam ? "Suspicious Email Detected!" : "Email Scanned",
        from: scan.from_address,
        description: scan.subject + (scan.snippet ? ` - ${scan.snippet}` : ''),
        action: scan.is_scam ? "Flagged as potential scam" : "Scanned and safe",
        time: new Date(scan.scanned_at).toLocaleTimeString(),
        date: new Date(scan.scanned_at).toLocaleDateString(),
        iconColor: scan.is_scam ? theme.badges.danger : theme.badges.safe,
        reported: false,
        restored: false,
      };

      if (scan.is_scam) emailAlerts.certain.push(alert);
      else emailAlerts.uncertain.push(alert);
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
        async () => {
          await fetchEmailScans(userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveCardId(activeCardId === id ? null : id);
  };

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
        const { error } = await supabase.from('scam_reports').insert([reportData]);
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
      try {
        const { error } = await supabase
          .from('scam_reports')
          .update({ status: 'dismissed_by_user' })
          .eq('user_id', userId)
          .eq('scam_type', 'email')
          .eq('description', descriptionToDelete);
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
                style={[styles.reportButton, { backgroundColor: theme.badges.danger }]}
                onPress={() => alert.reported ? unreportAlert(type, alert.id) : reportAlert(type, alert.id)}
              >
                <Ionicons name="alert-circle-outline" size={18} color={theme.colors.primaryTextOn} style={{marginRight: 6}} />
                <Text style={[styles.reportButtonText, { color: theme.colors.primaryTextOn }]}>
                  {alert.reported ? 'Unreport' : 'Report'}
                </Text>
              </TouchableOpacity>

              {!(type.startsWith('email') && alert.reported) && (
                <TouchableOpacity
                  style={[styles.restoreButton, { backgroundColor: theme.badges.safe }]}
                  onPress={() => restoreAlert(type, alert.id)}
                >
                  <Ionicons name="refresh-outline" size={18} color={theme.colors.primaryTextOn} style={{marginRight: 6}} />
                  <Text style={[styles.restoreButtonText, { color: theme.colors.primaryTextOn }]}>Restore</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
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

const makeStyles = (theme) => StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  channelTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.tint, marginTop: 20, marginBottom: 10 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 10 },
  alertCard: { flexDirection: 'row', backgroundColor: theme.colors.card, borderRadius: 16, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: theme.colors.cardBorder },
  alertCardActive: { borderColor: theme.colors.primary },
  alertReported: { opacity: 0.7 },
  alertRestored: { opacity: 0.7 },
  alertIcon: { width: 24, height: 24, borderRadius: 8, marginRight: 15 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: theme.colors.text },
  divider: { height: 1, backgroundColor: theme.colors.cardBorder, marginVertical: 8 },
  alertText: { fontSize: 13, color: theme.colors.subtext },
  alertLabel: { fontWeight: 'bold', color: theme.colors.text },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  reportButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginRight: 10 },
  reportButtonText: { fontWeight: 'bold' },
  restoreButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  restoreButtonText: { fontWeight: 'bold' },
  placeholderText: { fontSize: 16, fontStyle: 'italic', color: theme.colors.subtext, textAlign: 'center' },
});

export default ManageAlertsScreen;
