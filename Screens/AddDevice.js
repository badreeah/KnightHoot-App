import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../util/colors';
import { useAppSettings } from "../src/context/AppSettingProvid";
import { useTranslation } from "react-i18next";

// --- للتبديل بين الحالاه ---

// الحالة الممتلئة (يوجد أجهزة)
const initialMockDevices = [
  {
    id: '1',
    name: 'Phone 1',
    type: 'phone',
    category: 'My Devices',
    connected: true,
    enabled: true,
  },
  {
    id: '2',
    name: 'Laptop 1',
    type: 'laptop',
    category: 'My Devices',
    connected: true,
    enabled: true,
  },
  {
    id: '3',
    name: 'ipad 1',
    type: 'tablet',
    category: 'Family',
    connected: true,
    enabled: true,
  },
];

// الحالة الفارغة (لا يوجد أجهزة)ا
// const mockDevices = [];



const EmptyState = ({ onScanPress }) => (
  <View style={styles.emptyContainer}>
    <Image 
      source={require('../assets/images/not_found.png')} 
      style={styles.emptyImage}
    />
    <Text style={styles.emptyTitle}>No results found</Text>
    <Text style={styles.emptySubtitle}>
      The search could not be found, please check spelling or write another word.
    </Text>
    <TouchableOpacity style={styles.scanButton} onPress={onScanPress}>
      <Text style={styles.scanButtonText}>Scan Device</Text>
    </TouchableOpacity>
  </View>
);


export default function AddDevice({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeviceCategory, setNewDeviceCategory] = useState('My Devices');
  const [devices, setDevices] = useState(initialMockDevices);
  const [addEnabled, setAddEnabled] = useState(true);
  const [editingDevice, setEditingDevice] = useState(null);

  const { theme, isRTL } = useAppSettings(); 
  const { t } = useTranslation();            
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  useEffect(() => {
    if (route.params?.selectedDevice) {
      setEditingDevice(route.params.selectedDevice);
      setShowAddForm(true);
    }
  }, [route.params?.selectedDevice]);


  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'My Device' && device.category === 'My Devices') ||
      (selectedCategory === 'Family' && device.category === 'Family');
    return matchesSearch && matchesCategory;
  });

  const getDeviceIcon = type => {
    const iconStyle = { width: 32, height: 32, resizeMode: 'contain' };
    switch (type) {
      case 'phone':
        return <Image source={require('../assets/icons/smartphone.png')} style={iconStyle} />;
      case 'laptop':
        return <Image source={require('../assets/icons/laptop.png')} style={iconStyle} />;
      case 'tablet':
        return <Image source={require('../assets/icons/tablet.png')} style={iconStyle} />;
      default:
        return null;
    }
  };

  const toggleDevice = deviceId => {
    setDevices(prev =>
      prev.map(d => (d.id === deviceId ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const navigateToRadar = () => {
    navigation.navigate('DeviceRadar');
  };
  
  const handleBackPress = () => {
      if (showAddForm) {
          setShowAddForm(false);
          setEditingDevice(null);
          navigation.setParams({ selectedDevice: undefined });
      } else {
          navigation.goBack();
      }
  };

  const handleDeviceAdded = () => {
    setShowAddForm(false);
    setEditingDevice(null);
    navigation.setParams({ selectedDevice: undefined });
  };

  if (showAddForm) {
    const deviceData = editingDevice || { name: 'New Device', type: 'phone', category: 'My Devices' };
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={COLORS.purple1} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Device</Text>
          <TouchableOpacity onPress={navigateToRadar}>
             <Image source={require('../assets/icons/scan.png')} style={{width: 24, height: 24}} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
            <View style={[styles.row, { marginBottom: 16 }]}>
                <View style={styles.deviceInfo}>
                    {getDeviceIcon(deviceData.type)}
                    <TextInput style={styles.deviceNameInput} defaultValue={deviceData.name} />
                </View>
                <Switch
                    value={addEnabled}
                    onValueChange={setAddEnabled}
                    trackColor={{ false: COLORS.gray1, true: COLORS.purple1 }}
                    thumbColor={'#ffffff'}
                />
            </View>
            <View style={styles.divider} />
            <View style={[styles.row, { marginTop: 16 }]}>
                <Text style={addEnabled ? styles.connectedText : styles.disconnectedText}>
                    {addEnabled ? '• Connected' : '• Disconnected'}
                </Text>
                <TouchableOpacity>
                    <Text style={styles.selectTypeText}>Select Type</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.card}>
            <Text style={styles.categoryTitle}>Category</Text>
            <View style={styles.row}>
                <TouchableOpacity
                    style={newDeviceCategory === 'My Devices' ? styles.categoryButtonActive : styles.categoryButtonInactive}
                    onPress={() => setNewDeviceCategory('My Devices')}
                >
                    <Text style={newDeviceCategory === 'My Devices' ? styles.categoryTextActive : styles.categoryTextInactive}>My Devices</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={newDeviceCategory === 'Family' ? styles.categoryButtonActive : styles.categoryButtonInactive}
                    onPress={() => setNewDeviceCategory('Family')}
                >
                    <Text style={newDeviceCategory === 'Family' ? styles.categoryTextActive : styles.categoryTextInactive}>Family</Text>
                </TouchableOpacity>
            </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleDeviceAdded}>
          <Text style={styles.primaryButtonText}>Add Now</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color={COLORS.purple1} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Device</Text>
            <TouchableOpacity onPress={navigateToRadar}>
                <Image source={require('../assets/icons/scan.png')} style={{width: 24, height: 24}} />
            </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
            <TextInput
                placeholder="Search Device"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholderTextColor={COLORS.gray2}
            />
            <Ionicons name="search" size={20} color={COLORS.gray2} style={styles.searchIcon} />
        </View>

        <View style={styles.categoryFilterContainer}>
            {(['All', 'My Device', 'Family']).map(category => (
                 <TouchableOpacity
                    key={category}
                    style={selectedCategory === category ? styles.categoryButtonActive : styles.categoryButtonInactive}
                    onPress={() => setSelectedCategory(category)}
                >
                    <Text style={selectedCategory === category ? styles.categoryTextActive : styles.categoryTextInactive}>{category}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {filteredDevices.length === 0 ? (
          <EmptyState onScanPress={navigateToRadar} />
        ) : (
          <View>
            <View style={{marginTop: 20}}>
                {filteredDevices.map(device => (
                    <View key={device.id} style={styles.card}>
                        <View style={[styles.row, { marginBottom: 16 }]}>
                            <View style={styles.deviceInfo}>
                                {getDeviceIcon(device.type)}
                                <Text style={styles.deviceName}>{device.name}</Text>
                            </View>
                            <Switch
                                value={device.enabled}
                                onValueChange={() => toggleDevice(device.id)}
                                trackColor={{ false: COLORS.gray1, true: COLORS.purple1 }}
                                thumbColor={'#ffffff'}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={[styles.row, { marginTop: 16 }]}>
                            <Text style={device.enabled ? styles.connectedText : styles.disconnectedText}>
                                {device.enabled ? '• Connected' : '• Disconnected'}
                            </Text>
                            <Text style={styles.categoryText}>{device.category}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setShowAddForm(true)}>
              <Text style={styles.primaryButtonText}>Add New Device</Text>
            </TouchableOpacity>
          </View>
        )}
    </ScrollView>
  );
}


const createStyles = (theme, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // [theme]
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: isRTL ? 'row-reverse' : 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50, 
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text, // [theme]
  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
  },
  searchInput: {
      flex: 1,
      height: 50,
      backgroundColor: theme.colors.card, // [theme]
      borderRadius: 999, 
      paddingLeft: isRTL ? 16 : 24,       // [rtl]
      paddingRight: isRTL ? 24 : 50,      // [rtl]
      fontSize: 16,
      borderWidth: 2,
      borderColor: theme.colors.cardBorder, // [theme]
      color: theme.colors.text,             // [theme]
  },
  searchIcon: {
      position: 'absolute',
      right: 20,
      transform: [{ scaleX: isRTL ? -1 : 1 }], // [rtl] (رمزية فقط)
  },
  card: {
    backgroundColor: theme.colors.card,   // [theme]
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder, // [theme]
  },
  row: {
      flexDirection: isRTL ? 'row-reverse' : 'row', // [rtl]
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  deviceInfo: {
      flexDirection: isRTL ? 'row-reverse' : 'row', // [rtl]
      alignItems: 'center',
      gap: 16,
  },
  deviceName: {
      fontSize: 18,
      fontWeight: '500',
      color: theme.colors.text, // [theme]
      textAlign: isRTL ? 'right' : 'left', // [rtl]
  },
  deviceNameInput: {
      fontSize: 18,
      fontWeight: '500',
      color: theme.colors.text, // [theme]
      textAlign: isRTL ? 'right' : 'left', // [rtl]
  },
  divider: {
      height: 1,
      backgroundColor: theme.colors.cardBorder, // [theme]
      marginVertical: 16,
  },
  connectedText: {
      color: '#10B981',
      fontWeight: '500',
  },
  disconnectedText: {
      color: theme.colors.subtext, // [theme]
      fontWeight: '500',
  },
  selectTypeText: {
      color: theme.colors.text, // [theme]
  },
  categoryText: {
      color: theme.colors.text, // [theme]
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    color: theme.colors.text, // [theme]
    textAlign: isRTL ? 'right' : 'left', // [rtl]
  },
  categoryFilterContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row', // [rtl]
    gap: 12,
    marginTop: 20
  },
  categoryButtonActive: {
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: COLORS.purple1,
      backgroundColor: theme.colors.card, // [theme]
  },
  categoryButtonInactive: {
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: theme.colors.cardBorder, // [theme]
      backgroundColor: theme.colors.card,   // [theme]
      opacity: 0.85,
  },
  categoryTextActive: {
      color: theme.colors.text, // [theme]
      fontWeight: '500'
  },
  categoryTextInactive: {
      color: theme.colors.subtext, // [theme]
      fontWeight: '500'
  },
  primaryButton: {
      backgroundColor: theme.colors.primary, // [theme]
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
  },
  primaryButtonText: {
      color: theme.colors.primaryTextOn, // [theme]
      fontSize: 18,
      fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
    marginBottom: 40,
  },
  emptyImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.text, // [theme]
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.subtext, // [theme]
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  scanButton: {
    width: '100%',
    paddingVertical: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.purple1,
    borderRadius: 16,
    alignItems: 'center',
  },
  scanButtonText: {
    color: COLORS.purple1,
    fontSize: 18,
    fontWeight: '500',
  },
});

