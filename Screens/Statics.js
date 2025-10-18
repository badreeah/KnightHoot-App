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

  return (
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