import { View, Text, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";

export default function Statics() {
  const { theme, isRTL } = useAppSettings(); // get theme and RTL
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]); // create styles with theme

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
