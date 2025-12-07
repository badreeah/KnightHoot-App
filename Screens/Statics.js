// Statics.js
import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Modal } from 'react-native';
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase';
import { useAppSettings } from "../src/context/AppSettingProvid";

const StaticsScreen = ({ navigation }) => {
=======
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { BarChart } from "react-native-chart-kit";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../supabase';
import { useAppSettings } from "../src/context/AppSettingProvid";

const initialData = {
  sources: [
    { name: "SMS", count: 22, active: true },
    { name: "Calls", count: 10, active: false },
    { name: "Email", count: 0, active: false },
    { name: "URL", count: 12, active: false },
  ],
  severity: [
    { level: "Low", count: 87 },
    { level: "Medium", count: 12 },
    { level: "High", count: 4 },
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
>>>>>>> main
  const { theme } = useAppSettings();
  const styles = makeStyles(theme);

  const screenWidth = Dimensions.get('window').width - 40;
<<<<<<< HEAD
  const boxWidth = (screenWidth - 120 - 16 - 16) / 2;

  const [alertsExpanded, setAlertsExpanded] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSeverityFilterModal, setShowSeverityFilterModal] = useState(false);
  const [showChartFilterModal, setShowChartFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Today');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('Daily');
  const [selectedChartFilter, setSelectedChartFilter] = useState('Weekly');

  const [sources, setSources] = useState([
    { name: "SMS", count: 0 },
    { name: "Calls", count: 0 },
    { name: "Email", count: 0 },
    { name: "URL", count: 0 },
  ]);

  const [severity, setSeverity] = useState([
    { level: "Low", count: 0 },
    { level: "Medium", count: 0 },
    { level: "High", count: 0 },
  ]);

  const [riskActivityData, setRiskActivityData] = useState({
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    data: [0, 0, 0, 0, 0, 0, 0],
  });

  const [userId, setUserId] = useState(null);

  // Fetch stats from database based on selected filter
  const fetchAllStats = async (userId, filter = 'Today', severityFilter = 'Daily', chartFilter = 'Weekly') => {
    try {
      console.log('Fetching all stats for user:', userId, 'Filter:', filter, 'Severity:', severityFilter, 'Chart:', chartFilter);

      // Fetch SMS scans
      const { data: smsScans, error: smsError } = await supabase
        .from('sms_scans')
        .select('*');

      if (smsError) console.error('Error fetching SMS scans:', smsError);
      console.log('SMS scans:', smsScans?.length || 0);

      // Fetch email scans
      let emailScans = [];
      if (userId) {
        const { data, error: emailError } = await supabase
          .from('email_scans')
          .select('*')
          .eq('user_id', userId);
        if (emailError) console.error('Error fetching email scans:', emailError);
        emailScans = data || [];
        console.log('Email scans:', emailScans.length);
      }

      // Fetch URL scans
      let urlScans = [];
      if (userId) {
        const { data, error: urlError } = await supabase
          .from('safe_url_scans')
          .select('*')
          .eq('user_id', userId);
        if (urlError) console.error('Error fetching URL scans:', urlError);
        urlScans = data || [];
        console.log('URL scans:', urlScans.length);
      }

      // Fetch phone calls
      let callLogs = [];
      if (userId) {
        const { data, error: callError } = await supabase
          .from('PhoneCalls')
          .select('*')
          .eq('user_id', userId);
        if (callError) console.error('Error fetching phone calls:', callError);
        callLogs = data || [];
        console.log('Phone calls:', callLogs.length);
      }

      // Calculate date range for Alert by source
      let startDate, endDate;
      const now = new Date();

      if (filter === 'Today') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
      } else if (filter === 'This week') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
      }

      // Filter scans based on date range for Alert by source
      const filteredScans = {
        sms: (smsScans || []).filter(s => {
          const d = new Date(s.created_at);
          return d >= startDate && d <= endDate;
        }),
        calls: (callLogs || []).filter(s => {
          const d = new Date(s.created_at);
          return d >= startDate && d <= endDate;
        }),
        email: (emailScans || []).filter(s => {
          const d = new Date(s.scanned_at || s.created_at);
          return d >= startDate && d <= endDate;
        }),
        url: (urlScans || []).filter(s => {
          const d = new Date(s.created_at);
          return d >= startDate && d <= endDate;
        }),
      };

      setSources([
        { name: "SMS", count: filteredScans.sms.length },
        { name: "Calls", count: filteredScans.calls.length },
        { name: "Email", count: filteredScans.email.length },
        { name: "URL", count: filteredScans.url.length },
      ]);

      // Calculate date range for Severity Score
      let severityStartDate, severityEndDate;
      const nowSeverity = new Date();

      if (severityFilter === 'Daily') {
        severityStartDate = new Date(nowSeverity.setHours(0, 0, 0, 0));
        severityEndDate = new Date(nowSeverity.setHours(23, 59, 59, 999));
      } else if (severityFilter === 'Weekly') {
        severityStartDate = new Date();
        severityStartDate.setDate(severityStartDate.getDate() - 6);
        severityStartDate.setHours(0, 0, 0, 0);
        severityEndDate = new Date();
        severityEndDate.setHours(23, 59, 59, 999);
      }

      // Filter scans for severity score
      const severityFilteredScans = {
        sms: (smsScans || []).filter(s => {
          const d = new Date(s.created_at);
          return d >= severityStartDate && d <= severityEndDate;
        }),
        calls: (callLogs || []).filter(s => {
          const d = new Date(s.created_at);
          return d >= severityStartDate && d <= severityEndDate;
        }),
        email: (emailScans || []).filter(s => {
          const d = new Date(s.scanned_at || s.created_at);
          return d >= severityStartDate && d <= severityEndDate;
        }),
        url: (urlScans || []).filter(s => {
          const d = new Date(s.created_at);
          return d >= severityStartDate && d <= severityEndDate;
        }),
      };

      // Calculate severity scores
      const allScans = [
        ...(severityFilteredScans.sms || []).map(s => ({
          score: s.confidence_score || 0,
          type: 'sms',
          created_at: s.created_at
        })),
        ...(severityFilteredScans.email || []).map(s => ({
          score: s.scan_score || 0,
          type: 'email',
          created_at: s.scanned_at
        })),
        ...(severityFilteredScans.url || []).map(s => ({
          score: s.rating === 'safe' ? 0.2 : s.rating === 'suspicious' ? 0.6 : 0.9,
          type: 'url',
          created_at: s.created_at
        })),
        ...(severityFilteredScans.calls || []).map(s => ({
          score: s.confidence || 0,
          type: 'call',
          created_at: s.created_at
        })),
      ];

      let lowCount = 0, mediumCount = 0, highCount = 0;

      allScans.forEach(scan => {
        if (scan.score < 0.4) lowCount++;
        else if (scan.score < 0.7) mediumCount++;
        else highCount++;
      });

      console.log('Severity - Low:', lowCount, 'Medium:', mediumCount, 'High:', highCount);

      setSeverity([
        { level: "Low", count: lowCount },
        { level: "Medium", count: mediumCount },
        { level: "High", count: highCount },
      ]);

      // Calculate risk activity based on chart filter
      let chartLabels = [];
      let chartData = [];

      if (chartFilter === 'Weekly') {
        // Last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date;
        });

        chartLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

        chartData = last7Days.map(date => {
          const dayStart = new Date(date);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(date);
          dayEnd.setHours(23, 59, 59, 999);

          // Count all scans for this day
          const dailyScans = [
            ...(smsScans || []).filter(s => {
              const d = new Date(s.created_at);
              return d >= dayStart && d <= dayEnd;
            }),
            ...(callLogs || []).filter(s => {
              const d = new Date(s.created_at);
              return d >= dayStart && d <= dayEnd;
            }),
            ...(emailScans || []).filter(s => {
              const d = new Date(s.scanned_at || s.created_at);
              return d >= dayStart && d <= dayEnd;
            }),
            ...(urlScans || []).filter(s => {
              const d = new Date(s.created_at);
              return d >= dayStart && d <= dayEnd;
            }),
          ];

          return dailyScans.length;
        });
      } else if (chartFilter === 'Monthly') {
        // Last 4 weeks
        const last4Weeks = Array.from({ length: 4 }, (_, i) => {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() - (i * 7));
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 6);
          return { start: new Date(startDate), end: new Date(endDate) };
        }).reverse();

        chartLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

        chartData = last4Weeks.map(week => {
          const weekStart = new Date(week.start);
          weekStart.setHours(0, 0, 0, 0);
          const weekEnd = new Date(week.end);
          weekEnd.setHours(23, 59, 59, 999);

          // Count all scans for this week
          const weeklyScans = [
            ...(smsScans || []).filter(s => {
              const d = new Date(s.created_at);
              return d >= weekStart && d <= weekEnd;
            }),
            ...(callLogs || []).filter(s => {
              const d = new Date(s.created_at);
              return d >= weekStart && d <= weekEnd;
            }),
            ...(emailScans || []).filter(s => {
              const d = new Date(s.scanned_at || s.created_at);
              return d >= weekStart && d <= weekEnd;
            }),
            ...(urlScans || []).filter(s => {
              const d = new Date(s.created_at);
              return d >= weekStart && d <= weekEnd;
            }),
          ];

          return weeklyScans.length;
        });
      }

      console.log('Chart data:', chartData);

      setRiskActivityData({
        labels: chartLabels,
        data: chartData,
      });

      console.log('Stats update complete!');

    } catch (err) {
      console.error('Error in fetchAllStats:', err);
    }
  };

  // Get user and fetch data
  useEffect(() => {
    const getUserAndFetch = async () => {
      console.log('Statics: Fetching user and data...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Statics: User:', user?.id);
      if (user) {
        setUserId(user.id);
        await fetchAllStats(user.id, selectedFilter, selectedSeverityFilter, selectedChartFilter);
      } else {
        await fetchAllStats(null, selectedFilter, selectedSeverityFilter, selectedChartFilter);
      }
    };
    getUserAndFetch();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (userId !== null) {
      fetchAllStats(userId, selectedFilter, selectedSeverityFilter, selectedChartFilter);
    }
  }, [selectedFilter, selectedSeverityFilter, selectedChartFilter]);

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('stats_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sms_scans',
        },
        async () => await fetchAllStats(userId, selectedFilter, selectedSeverityFilter, selectedChartFilter)
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'email_scans',
          filter: userId ? `user_id=eq.${userId}` : undefined,
        },
        async () => await fetchAllStats(userId, selectedFilter, selectedSeverityFilter, selectedChartFilter)
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'safe_url_scans',
          filter: userId ? `user_id=eq.${userId}` : undefined,
        },
        async () => await fetchAllStats(userId, selectedFilter, selectedSeverityFilter, selectedChartFilter)
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'PhoneCalls',
          filter: userId ? `user_id=eq.${userId}` : undefined,
        },
        async () => await fetchAllStats(userId, selectedFilter, selectedSeverityFilter, selectedChartFilter)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, selectedFilter, selectedSeverityFilter, selectedChartFilter]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setShowFilterModal(false);
  };

  const handleSeverityFilterChange = (filter) => {
    setSelectedSeverityFilter(filter);
    setShowSeverityFilterModal(false);
  };

  const handleChartFilterChange = (filter) => {
    setSelectedChartFilter(filter);
    setShowChartFilterModal(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Alert by Source Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.headerContainer}
          onPress={() => setAlertsExpanded(!alertsExpanded)}
        >
          <Text style={styles.headerTitle}>Alert by source</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Text style={styles.filterText}>{selectedFilter}</Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.subtext} />
            </TouchableOpacity>
            <Ionicons
              name={alertsExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.colors.subtext}
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>

        {alertsExpanded && (
          <>
            <View style={styles.sourcesRow}>
              <Image
                source={require('../assets/icons/sms_scam2.png')}
                style={styles.sourceIcon}
              />
              <View style={styles.sourcesContainer}>
                {sources.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.sourceBox, { width: boxWidth }]}
                  >
                    <Text style={styles.sourceName}>{item.name}</Text>
                    <Text style={styles.sourceCount}>{item.count}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Severity Score Section */}
            <View style={styles.severitySection}>
              <View style={styles.severityHeader}>
                <Text style={styles.sectionTitle}>Severity score</Text>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => setShowSeverityFilterModal(true)}
                >
                  <Text style={styles.filterText}>{selectedSeverityFilter}</Text>
                  <Ionicons name="chevron-down" size={16} color={theme.colors.subtext} />
                </TouchableOpacity>
              </View>
              <View style={styles.severityContainer}>
                {severity.map((item, index) => {
                  const dotColor =
                    item.level === 'Low' ? '#C8E6C9' :
                    item.level === 'Medium' ? '#FFE082' :
                    '#EF9A9A';
                  return (
                    <View key={index} style={styles.severityBox}>
                      <View style={styles.severityRow}>
                        <View style={[styles.colorDot, { backgroundColor: dotColor }]} />
                        <Text style={styles.severityLabel}>{item.level}</Text>
                      </View>
                      <Text style={styles.severityCount}>{item.count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </View>

      {/* Risk Activity Section */}
      <View style={styles.riskActivitySection}>
        <Text style={styles.riskActivityLabel}>Risk Activity</Text>

        <View style={styles.riskActivityCard}>
          <View style={styles.riskActivityHeader}>
            <Text style={styles.riskActivityTitle}>Average Attacks</Text>
            <TouchableOpacity
              style={styles.chartFilterButton}
              onPress={() => setShowChartFilterModal(true)}
            >
              <Text style={styles.chartFilterText}>{selectedChartFilter}</Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.subtext} />
            </TouchableOpacity>
          </View>

          <BarChart
            data={{
              labels: riskActivityData.labels,
              datasets: [{
                data: riskActivityData.data.length > 0 && riskActivityData.data.some(v => v > 0)
                  ? riskActivityData.data
                  : [1, 1, 1, 1, 1, 1, 1]
              }],
            }}
            width={screenWidth - 40}
            height={240}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            segments={3}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(121, 134, 203, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(158, 158, 158, ${opacity})`,
              barPercentage: 0.5,
              fillShadowGradient: '#7986CB',
              fillShadowGradientOpacity: 1,
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: '#E0E0E0',
                strokeWidth: 1,
              },
              propsForLabels: {
                fontSize: 12,
                fontFamily: 'Poppins-500',
              },
            }}
            style={styles.chartStyle}
          />
        </View>
      </View>

      {/* Alert by Source Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.modalOption,
                selectedFilter === 'Today' && styles.modalOptionSelected
              ]}
              onPress={() => handleFilterChange('Today')}
            >
              <Text style={[
                styles.modalOptionText,
                selectedFilter === 'Today' && styles.modalOptionTextSelected
              ]}>
                Today
              </Text>
              {selectedFilter === 'Today' && (
                <Ionicons name="checkmark" size={20} color="#7986CB" />
              )}
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={[
                styles.modalOption,
                selectedFilter === 'This week' && styles.modalOptionSelected
              ]}
              onPress={() => handleFilterChange('This week')}
            >
              <Text style={[
                styles.modalOptionText,
                selectedFilter === 'This week' && styles.modalOptionTextSelected
              ]}>
                This week
              </Text>
              {selectedFilter === 'This week' && (
                <Ionicons name="checkmark" size={20} color="#7986CB" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Severity Score Filter Modal */}
      <Modal
        visible={showSeverityFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSeverityFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSeverityFilterModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.modalOption,
                selectedSeverityFilter === 'Daily' && styles.modalOptionSelected
              ]}
              onPress={() => handleSeverityFilterChange('Daily')}
            >
              <Text style={[
                styles.modalOptionText,
                selectedSeverityFilter === 'Daily' && styles.modalOptionTextSelected
              ]}>
                Daily
              </Text>
              {selectedSeverityFilter === 'Daily' && (
                <Ionicons name="checkmark" size={20} color="#7986CB" />
              )}
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={[
                styles.modalOption,
                selectedSeverityFilter === 'Weekly' && styles.modalOptionSelected
              ]}
              onPress={() => handleSeverityFilterChange('Weekly')}
            >
              <Text style={[
                styles.modalOptionText,
                selectedSeverityFilter === 'Weekly' && styles.modalOptionTextSelected
              ]}>
                Weekly
              </Text>
              {selectedSeverityFilter === 'Weekly' && (
                <Ionicons name="checkmark" size={20} color="#7986CB" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Chart Filter Modal */}
      <Modal
        visible={showChartFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowChartFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowChartFilterModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.modalOption,
                selectedChartFilter === 'Weekly' && styles.modalOptionSelected
              ]}
              onPress={() => handleChartFilterChange('Weekly')}
            >
              <Text style={[
                styles.modalOptionText,
                selectedChartFilter === 'Weekly' && styles.modalOptionTextSelected
              ]}>
                Weekly
              </Text>
              {selectedChartFilter === 'Weekly' && (
                <Ionicons name="checkmark" size={20} color="#7986CB" />
              )}
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={[
                styles.modalOption,
                selectedChartFilter === 'Monthly' && styles.modalOptionSelected
              ]}
              onPress={() => handleChartFilterChange('Monthly')}
            >
              <Text style={[
                styles.modalOptionText,
                selectedChartFilter === 'Monthly' && styles.modalOptionTextSelected
              ]}>
                Monthly
              </Text>
              {selectedChartFilter === 'Monthly' && (
                <Ionicons name="checkmark" size={20} color="#7986CB" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
=======
  const boxWidth = (screenWidth - 16) / 2;

  const [sources, setSources] = useState(initialData.sources);
  const [severity] = useState(initialData.severity);
  const [activeTab, setActiveTab] = useState('Today');
  const [animatedData, setAnimatedData] = useState(initialData.riskActivityToday.data.map(() => new Animated.Value(0)));

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
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.timeText}>5:13 PM</Text>
        <View style={styles.topBarRight}>
          <Ionicons name="wifi" size={16} color={theme.colors.text} style={{ marginRight: 6 }} />
          <Ionicons name="battery-full" size={16} color={theme.colors.text} />
          <Text style={styles.batteryText}>100%</Text>
        </View>
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          <View style={styles.headerIconContainer}>
            <View style={[styles.headerIconRing, { backgroundColor: theme.colors.primary, opacity: 0.12 }]} />
            <MaterialCommunityIcons name="shield-check" size={20} color={theme.colors.primary} style={styles.shieldIcon} />
          </View>
          <Text style={styles.headerTitle}>Alert by source</Text>
        </View>
        <View style={[styles.tabsContainer, { backgroundColor: theme.colors.cardBorder + '30' }]}>
          {['Today','This week'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && { backgroundColor: theme.colors.card }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && { color: theme.colors.text }]}>
                {tab}
              </Text>
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
              style={[
                styles.sourceBox,
                { width: boxWidth, height: 80, borderColor: theme.colors.outline, backgroundColor: theme.colors.card },
                isActive && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, shadowColor: theme.colors.primary, elevation: 8 }
              ]}
              activeOpacity={isSelectable ? 0.7 : 1}
              onPress={() => onSourcePress(index)}
              disabled={!isSelectable}
            >
              <Text style={isActive ? styles.sourceNameActive : isSelectable ? [styles.sourceNamePurple, { color: theme.colors.primary }] : styles.sourceNameGrey}>
                {item.name}
              </Text>
              <Text style={isActive ? styles.sourceCountActive : isSelectable ? [styles.sourceCountPurple, { color: theme.colors.primary }] : styles.sourceCountGrey}>
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
          {severity.map((item, index) => {
            const colorDot =
              index === 0 ? theme.badges.safe :
              index === 1 ? theme.badges.warn :
              theme.badges.danger;
            return (
              <View key={index} style={[styles.severityBox, { backgroundColor: theme.colors.card }]}>
                <View style={styles.severityLabelRow}>
                  <View style={[styles.colorDot, { backgroundColor: colorDot }]} />
                  <Text style={styles.severityLabel}>{item.level}</Text>
                </View>
                <Text style={styles.severityCount}>{item.count}</Text>
                <Text style={styles.severityDetail}>Score</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Risk Activity Section */}
      <View style={[styles.riskActivityContainer, { backgroundColor: theme.colors.card }]}>
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
            backgroundColor: theme.colors.card,
            backgroundGradientFrom: theme.colors.card,
            backgroundGradientTo: theme.colors.card,
            decimalPlaces: 0,
            color: () => theme.colors.primary,              // لون الأعمدة
            labelColor: () => theme.colors.text,            // لون عناوين المحور
            barPercentage: 0.8,
            fillShadowGradient: theme.colors.primary,       // تعبئة العمود
            fillShadowGradientOpacity: 0.75,
            propsForLabels: { fontWeight: 'bold' },
          }}
          style={styles.chartStyle}
        />
      </View>
>>>>>>> main
    </ScrollView>
  );
};

const makeStyles = (theme) => StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginBottom: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-600',
    color: theme.colors.subtext,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Poppins-500',
    color: theme.colors.subtext,
  },
  expandIcon: {
    marginLeft: 4,
  },
  sourcesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sourceIcon: {
    width: 120,
    height: 120,
    marginRight: 0,
    resizeMode: 'contain',
  },
  sourcesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceBox: {
    height: 80,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#80CBC4',
    backgroundColor: '#E0F2F1',
  },
  sourceName: {
    fontFamily: 'Poppins-600',
    fontSize: 16,
    color: '#7986CB',
    marginBottom: 4,
  },
  sourceCount: {
    fontFamily: 'Poppins-700',
    fontSize: 24,
    color: '#4DD0E1',
  },
  severitySection: {
    marginTop: 20,
  },
  severityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-600',
    color: theme.colors.subtext,
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  severityBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8EAF6',
    shadowColor: "#7986CB",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  severityLabel: {
    fontSize: 13,
    color: theme.colors.subtext,
    fontFamily: 'Poppins-500',
  },
  severityCount: {
    fontSize: 28,
    fontFamily: 'Poppins-700',
    color: theme.colors.text,
  },
  riskActivitySection: {
    marginBottom: 30,
  },
  riskActivityLabel: {
    fontSize: 20,
    fontFamily: 'Poppins-600',
    color: theme.colors.subtext,
    marginBottom: 16,
  },
  riskActivityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E8EAF6',
    shadowColor: "#7986CB",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  riskActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  riskActivityTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-600',
    color: '#7986CB',
  },
  chartFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chartFilterText: {
    fontSize: 13,
    fontFamily: 'Poppins-500',
    color: theme.colors.subtext,
    marginRight: 4,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalOptionSelected: {
    backgroundColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-500',
    color: '#374151',
  },
  modalOptionTextSelected: {
    color: '#7986CB',
    fontFamily: 'Poppins-600',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
});

export default StaticsScreen;
=======
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: theme.colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  timeText: { fontSize: 13, color: theme.colors.text, fontWeight: '600' },
  topBarRight: { flexDirection: 'row', alignItems: 'center' },
  batteryText: { fontSize: 13, marginLeft: 4, fontWeight: '600', color: theme.colors.text },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIconContainer: { position: 'relative', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  headerIconRing: { position: 'absolute', width: 38, height: 38, borderRadius: 19 },
  shieldIcon: { transform: [{ rotate: '-15deg' }] },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginLeft: 10 },
  tabsContainer: { flexDirection: 'row', borderRadius: 20 },
  tabButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  tabText: { color: theme.colors.tint, fontWeight: '600' },
  sourcesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  sourceBox: { borderRadius: 16, paddingHorizontal: 16, marginBottom: 16, alignItems: 'center', borderWidth: 2 },
  sourceNamePurple: { fontWeight: '600' },
  sourceNameGrey: { color: theme.colors.subtext, fontWeight: '600' },
  sourceNameActive: { color: theme.colors.primaryTextOn, fontWeight: '600' },
  sourceCountPurple: { fontWeight: 'bold', marginTop: 6 },
  sourceCountGrey: { color: theme.colors.subtext, fontWeight: 'bold', marginTop: 6 },
  sourceCountActive: { color: theme.colors.primaryTextOn, fontWeight: 'bold', marginTop: 6 },
  severitySection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 12 },
  severityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -5 },
  severityBox: { flex: 1, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 12, marginHorizontal: 5, alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3, elevation: 1 },
  severityLabelRow: { flexDirection: 'row', alignItems: 'center' },
  severityLabel: { fontSize: 14, color: theme.colors.subtext, fontWeight: '600' },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  severityCount: { fontSize: 20, fontWeight: 'bold', marginTop: 8, color: theme.colors.text },
  severityDetail: { fontSize: 12, color: theme.colors.subtext, marginTop: 2 },
  riskActivityContainer: { borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  riskActivityTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 12 },
  chartStyle: { marginVertical: 8, borderRadius: 16, paddingRight: 0, paddingLeft: 0 },
});

export default AlertsScreen;
>>>>>>> main
