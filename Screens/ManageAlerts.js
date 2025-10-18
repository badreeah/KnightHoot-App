import React, { useState, useEffect } from 'react';
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

const SUPABASE_URL = 'https://qsgrxnzljtoebmeqcpbp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZ3J4bnpsanRvZWJtZXFjcGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MzQ1MTMsImV4cCI6MjA3NDIxMDUxM30.2sHDLxRF_dZp0tbZ5_Pefed3rsOoEfw5zMVAjEjIqZs';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ManageAlerts = ({ navigation }) => {
    const [alertsData, setAlertsData] = useState({ uncertain: [], certain: [] });
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        setLoading(true);
        const { data: alerts, error } = await supabase
            .from('alerts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching alerts:', error.message);
            setLoading(false);
            return;
        }

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

    useEffect(() => {
        fetchAlerts();
    }, []);

    const reportAlert = async (type, id) => {
        setAlertsData(prev => ({
            ...prev,
            [type]: prev[type].map(alert => alert.id === id ? { ...alert, reported: true, restored: false } : alert)
        }));
    };

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
            </View>
        );
    };

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
});

export default ManageAlerts;
