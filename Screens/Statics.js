// Statics.js
import React, { useState, useEffect } from 'react';
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
  const { theme } = useAppSettings();
  const styles = makeStyles(theme);

  const screenWidth = Dimensions.get('window').width - 40;
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
    </ScrollView>
  );
};

const makeStyles = (theme) => StyleSheet.create({
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
