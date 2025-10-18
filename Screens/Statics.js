<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { BarChart } from 'react-native-chart-kit';
import Svg, { Path } from 'react-native-svg';
import ShieldIcon from '../assets/images/shield.png'; 

// ---------------- Supabase config ----------------
const SUPABASE_URL = 'https://qsgrxnzljtoebmeqcpbp.supabase.co';
const SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZ3J4bnpsanRvZWJtZXFjcGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MzQ1MTMsImV4cCI6MjA3NDIxMDUxM30.2sHDLxRF_dZp0tbZ5_Pefed3rsOoEfw5zMVAjEjIqZs'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
=======
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { BarChart } from "react-native-chart-kit";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../supabase';

const initialData = {
  sources: [
    { name: "SMS", count: 22, active: true },
    { name: "Calls", count: 10, active: false },
    { name: "Email", count: 0, active: false },
    { name: "URL", count: 12, active: false },
  ],
  severity: [
    { level: "Low", count: 87, colorDot: '#52A7FC' },
    { level: "Medium", count: 12, colorDot: '#FFC107' },
    { level: "High", count: 4, colorDot: '#F66E83' },
  ],
  riskActivityToday: {
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    data: [1200, 500, 1500, 800, 2313, 600, 1400],
  },
  riskActivityWeek: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [3500, 4200, 3100, 4600],
  },
};
>>>>>>> 57fbe7bd7995e1c712d61e7c753613b2fbbce4f4

// ---------------- UI Components ----------------
const FilterButton = ({ text, onPress }) => (
  <TouchableOpacity style={styles.filterButton} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.filterButtonText}>{text}</Text>
    <Svg width="12" height="12" viewBox="0 0 24 24">
      <Path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  </TouchableOpacity>
);

const SourceStatBox = ({ label, value, color, active, onPress }) => (
  <TouchableOpacity 
    style={[styles.sourceStatBox, { borderColor: color, backgroundColor: active ? color : '#FFFFFF' }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.sourceStatLabel, { color: active ? '#FFF' : '#718096' }]}>{label}</Text>
    <Text style={[styles.sourceStatValue, { color: active ? '#FFF' : color }]}>{value}</Text>
  </TouchableOpacity>
);

const SeverityScoreBox = ({ level, value, color }) => (
  <View style={styles.severityBox}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <View style={[styles.severityDot, { backgroundColor: color }]} />
      <Text style={styles.severityLevel}>{level}</Text>
    </View>
    <Text style={styles.severityValue}>{value}</Text>
  </View>
);

<<<<<<< HEAD
// ---------------- Main Screen ----------------
const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [riskActivityWeek, setRiskActivityWeek] = useState({ labels: [], data: [] });
  const [filterWeek, setFilterWeek] = useState('all');

  const allowedActive = useMemo(() => ['SMS', 'Calls', 'Email', 'URL'], []);

  const processLogs = useCallback(
    (logsData) => {
      const sourcesCounts = {};
      const severityCounts = { low: 0, medium: 0, high: 0 };
      const weeksCount = Array(4).fill(0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysInMilliseconds = 24 * 60 * 60 * 1000;

      (logsData || []).forEach((log) => {
        const logDate = new Date(log.created_at || new Date());
        const diffInDays = Math.floor((today.getTime() - logDate.getTime()) / daysInMilliseconds);

        if (filterWeek === 'thisWeek' && diffInDays >= 7) return;

        const channel = log.source_type || 'Other';
        sourcesCounts[channel] = (sourcesCounts[channel] || 0) + 1;

        const sevLevel = (log.severity || 'low').toLowerCase();
        if (severityCounts.hasOwnProperty(sevLevel)) severityCounts[sevLevel]++;
        else severityCounts.low++;

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks >= 0 && diffInWeeks < 4) weeksCount[3 - diffInWeeks]++;
      });

      const finalSources = allowedActive.map((name) => ({
        name,
        count: sourcesCounts[name] || 0,
        active: name === 'SMS',
      }));

      const finalSeverity = [
        { level: 'Low', count: severityCounts.low },
        { level: 'Medium', count: severityCounts.medium },
        { level: 'High', count: severityCounts.high },
      ];

      return {
        sources: finalSources,
        severity: finalSeverity,
        riskActivityWeek: { labels: ['Week1', 'Week2', 'Week3', 'Week4'], data: weeksCount },
      };
    },
    [allowedActive, filterWeek]
  );

  // ---------------- Filter button handlers ----------------
  const handleThisWeek = () => {
    setFilterWeek(filterWeek === 'thisWeek' ? 'all' : 'thisWeek');
=======
  useEffect(() => {
    const fetchEmailStats = async () => {
      const { count, error } = await supabase
        .from('email_scans')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching email stats:', error);
        return;
      }

      setSources(prev =>
        prev.map(source =>
          source.name === 'Email' ? { ...source, count: count || 0 } : source
        )
      );
    };

    fetchEmailStats();
  }, []);

  const onSourcePress = (index) => {
    if (!allowedActive.includes(sources[index].name)) return;
    setSources(prev =>
      prev.map((item, i) => ({ ...item, active: i === index }))
    );
>>>>>>> 57fbe7bd7995e1c712d61e7c753613b2fbbce4f4
  };

  const handleSourceClick = (sourceName) => {
    setSources(prev => prev.map(source => ({
      ...source,
      active: source.name === sourceName
    })));
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      const processed = processLogs(data || []);
      setSources(processed.sources);
      setSeverity(processed.severity);
      setRiskActivityWeek(processed.riskActivityWeek);
    } catch (err) {
      console.error('Refresh error:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Fetch logs from Supabase ----------------
  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('communication_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;

        const processed = processLogs(data || []);
        if (!mounted) return;
        setSources(processed.sources);
        setSeverity(processed.severity);
        setRiskActivityWeek(processed.riskActivityWeek);
      } catch (err) {
        console.error('Supabase fetch error:', err.message || err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLogs();

    const logsChannel = supabase
      .channel('public:communication_logs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'communication_logs' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(logsChannel);
    };
  }, [processLogs]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Fetching statistics from Supabase...</Text>
      </View>
    );
  }

  // ---------------- Chart config ----------------
  const chartData = {
    labels: riskActivityWeek.labels.length ? riskActivityWeek.labels : ['W1', 'W2', 'W3', 'W4'],
    datasets: [{ data: riskActivityWeek.data.length ? riskActivityWeek.data : [0, 0, 0, 0] }],
  };
  const screenWidth = Dimensions.get('window').width - 40;
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    barPercentage: 0.6,
    color: (opacity = 1) => `rgba(128,90,213, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(90, 90, 90, ${opacity})`,
    propsForBackgroundLines: { strokeDasharray: '' },
  };

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { BarChart } from "react-native-chart-kit";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const initialData = {
  sources: [
    { name: "SMS", count: 22, active: true },
    { name: "Calls", count: 10, active: false },
    { name: "Email", count: 5, active: false },
    { name: "URL", count: 12, active: false },
  ],
  severity: [
    { level: "Low", count: 87, colorDot: '#52A7FC' },
    { level: "Medium", count: 12, colorDot: '#FFC107' },
    { level: "High", count: 4, colorDot: '#F66E83' },
  ],
  riskActivityToday: {
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    data: [1200, 500, 1500, 800, 2313, 600, 1400],
  },
  riskActivityWeek: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [3500, 4200, 3100, 4600],
  },
};

const allowedActive = ["SMS", "Email", "URL"];

const AlertsScreen = () => {
  const screenWidth = Dimensions.get('window').width - 40;
  const boxWidth = (screenWidth - 16) / 2;

  const [sources, setSources] = useState(initialData.sources);
  const [severity] = useState(initialData.severity);
  const [activeTab, setActiveTab] = useState('Today');
  const [animatedData, setAnimatedData] = useState(initialData.riskActivityToday.data.map(() => new Animated.Value(0)));

  const onSourcePress = (index) => {
    if (!allowedActive.includes(sources[index].name)) return;
    setSources(prev =>
      prev.map((item, i) => ({ ...item, active: i === index }))
    );
  };

  const chartData = activeTab === 'Today' ? initialData.riskActivityToday : initialData.riskActivityWeek;

  useEffect(() => {
    const values = chartData.data.map(() => new Animated.Value(0));
    setAnimatedData(values);

    Animated.stagger(
      100,
      values.map((val, index) =>
        Animated.timing(val, {
          toValue: chartData.data[index],
          duration: 800,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [activeTab]);

  return (
<<<<<<< HEAD
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alert by source</Text>
        <View style={styles.headerButtons}>
          <FilterButton 
            text={filterWeek === 'thisWeek' ? 'All time' : 'This week'} 
            onPress={handleThisWeek} 
          />
          <TouchableOpacity style={styles.refreshButton} onPress={refreshData}>
            <Text style={styles.refreshButtonText}>↻</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Source Statistics */}
      <View style={styles.sourceStatsSection}>
        <View style={styles.shieldContainer}>
          <Image source={ShieldIcon} style={styles.shieldImage} />
        </View>
        <View style={styles.sourceGrid}>
          {sources.map((s) => (
            <SourceStatBox
              key={s.name}
              label={s.name}
              value={`${s.count}`}
              color={getColorForSource(s.name)}
              active={s.active}
              onPress={() => handleSourceClick(s.name)}
            />
          ))}
          <Text style={styles.statisticsLabel}>Statistics</Text>
        </View>
      </View>

      {/* Severity Score */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Severity score</Text>
        </View>
        <View style={styles.severityGrid}>
          {severity.map((sev) => (
            <SeverityScoreBox
              key={sev.level}
              level={sev.level}
              value={`${sev.count}`}
              color={severityColor(sev.level)}
            />
          ))}
        </View>
      </View>

      {/* Risk Activity */}
      <View style={[styles.section, styles.riskCard]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.cardTitle}>Average Attacks</Text>
        </View>
        <BarChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          fromZero
          style={{ marginTop: 10, borderRadius: 12 }}
        />
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

// ---------------- Helpers ----------------
const getColorForSource = (name) => {
  switch (name) {
    case 'SMS': return '#805AD5';
    case 'Calls': return '#38B2AC';
    case 'Email': return '#4299E1';
    case 'URL': return '#ED8936';
    default: return '#A0AEC0';
  }
};

const severityColor = (level) => {
  switch ((level || '').toLowerCase()) {
    case 'low': return '#63B3ED';
    case 'medium': return '#F6E05E';
    case 'high': return '#F56565';
    default: return '#A0AEC0';
  }
};

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  loadingText: {
    marginTop: 10,
    color: '#718096',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    marginLeft: 8,
    backgroundColor: '#805AD5',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  sourceStatsSection: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shieldContainer: {
    marginRight: 20,
    justifyContent: 'center',
  },
  shieldImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  sourceGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sourceStatBox: {
    width: '48%',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sourceStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  sourceStatValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statisticsLabel: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  severityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityBox: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  severityLevel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
  },
  severityValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  riskCard: {
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
});

export default Statistics;
=======
    <View style={styles.container}>
      <Text style={styles.text}>Statics</Text>
    </View>
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.timeText}>5:13 PM</Text>
        <View style={styles.topBarRight}>
          <Ionicons name="wifi" size={16} color="#000" style={{ marginRight: 6 }} />
          <Ionicons name="battery-full" size={16} color="#000" />
          <Text style={styles.batteryText}>100%</Text>
        </View>
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Ionicons name="arrow-back" size={24} color="#7F3DFF" />
          <View style={styles.headerIconContainer}>
            <View style={styles.headerIconRing} />
            <MaterialCommunityIcons name="shield-check" size={20} color="#6200EE" style={styles.shieldIcon} />
          </View>
          <Text style={styles.headerTitle}>Alert by source</Text>
        </View>
        <View style={styles.tabsContainer}>
          {['Today','This week'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Source Boxes */}
      <View style={styles.sourcesContainer}>
        {sources.map((item, index) => {
          const isActive = item.active && allowedActive.includes(item.name);
          const isSelectable = allowedActive.includes(item.name);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.sourceBox, { width: boxWidth, height: 80 }, isActive && styles.sourceBoxActive, !isActive && styles.sourceBoxBorderBlue]}
              activeOpacity={isSelectable ? 0.7 : 1}
              onPress={() => onSourcePress(index)}
              disabled={!isSelectable}
            >
              <Text style={[isActive ? styles.sourceNameActive : isSelectable ? styles.sourceNamePurple : styles.sourceNameGrey]}>
                {item.name}
              </Text>
              <Text style={[isActive ? styles.sourceCountActive : isSelectable ? styles.sourceCountPurple : styles.sourceCountGrey]}>
                {item.count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Severity Section */}
      <View style={styles.severitySection}>
        <Text style={styles.sectionTitle}>Severity score</Text>
        <View style={styles.severityContainer}>
          {severity.map((item, index) => (
            <View key={index} style={styles.severityBox}>
              <View style={styles.severityLabelRow}>
                <View style={[styles.colorDot, { backgroundColor: item.colorDot }]} />
                <Text style={styles.severityLabel}>{item.level}</Text>
              </View>
              <Text style={styles.severityCount}>{item.count}</Text>
              <Text style={styles.severityDetail}>Score</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Risk Activity Section */}
      <View style={styles.riskActivityContainer}>
        <Text style={styles.riskActivityTitle}>Risk Activity</Text>
        <BarChart
          data={{
            labels: chartData.labels,
            datasets: [{ data: animatedData.map(a => a.__getValue()) }],
          }}
          width={screenWidth}
          height={220}
          fromZero
          yAxisLabel=""
          showValuesOnTopOfBars
          withInnerLines={false}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1, index) => chartData.data[index] === Math.max(...chartData.data) ? `rgba(98, 0, 238, ${opacity})` : `rgba(224,224,224,${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            barPercentage: 0.8,
            fillShadowGradient: 'rgba(98,0,238,0.5)',
            fillShadowGradientOpacity: 1,
            propsForLabels: { fontWeight: 'bold' },
          }}
          style={styles.chartStyle}
        />
      </View>
    </ScrollView>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background, // now theme works
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: theme.colors.text, // example text color from theme
    },
  });
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#EFEFF4" },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  timeText: { fontSize: 13, color: "#000", fontWeight: '600' },
  topBarRight: { flexDirection: 'row', alignItems: 'center' },
  batteryText: { fontSize: 13, marginLeft: 4, fontWeight: '600' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIconContainer: { position: 'relative', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  headerIconRing: { position: 'absolute', width: 38, height: 38, borderRadius: 19, backgroundColor: '#6200EE', opacity: 0.1 },
  shieldIcon: { transform: [{ rotate: '-15deg' }] },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: "#333", marginLeft: 10 },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#E6E6FA', borderRadius: 20 },
  tabButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  activeTab: { backgroundColor: '#fff' },
  tabText: { color: '#8A2BE2', fontWeight: '600' },
  activeTabText: { color: '#333' },
  sourcesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  sourceBox: { borderRadius: 16, paddingHorizontal: 16, marginBottom: 16, alignItems: 'center', backgroundColor: "#fff", borderWidth: 2, borderColor: '#52A7FC' },
  sourceBoxBorderBlue: { borderColor: '#52A7FC' },
  sourceBoxActive: { backgroundColor: '#6200EE', borderColor: '#6200EE', shadowColor: '#6200EE', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  sourceNamePurple: { color: '#6200EE', fontWeight: '600' },
  sourceNameGrey: { color: '#666', fontWeight: '600' },
  sourceNameActive: { color: '#fff', fontWeight: '600' },
  sourceCountPurple: { color: '#6200EE', fontWeight: 'bold', marginTop: 6 },
  sourceCountGrey: { color: '#666', fontWeight: 'bold', marginTop: 6 },
  sourceCountActive: { color: '#fff', fontWeight: 'bold', marginTop: 6 },
  severitySection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: "#333", marginBottom: 12 },
  severityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -5 },
  severityBox: { flex: 1, backgroundColor: "#fff", borderRadius: 16, paddingVertical: 16, paddingHorizontal: 12, marginHorizontal: 5, alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3, elevation: 1 },
  severityLabelRow: { flexDirection: 'row', alignItems: 'center' },
  severityLabel: { fontSize: 14, color: "#555", fontWeight: '600' },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  severityCount: { fontSize: 20, fontWeight: 'bold', marginTop: 8, color: "#333" },
  severityDetail: { fontSize: 12, color: '#999', marginTop: 2 },
  riskActivityContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  riskActivityTitle: { fontSize: 18, fontWeight: 'bold', color: "#333", marginBottom: 12 },
  chartStyle: { marginVertical: 8, borderRadius: 16, paddingRight: 0, paddingLeft: 0 },
});

export default AlertsScreen;
>>>>>>> origin/feature/alerts-stats
