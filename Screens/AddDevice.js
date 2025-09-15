import React, { useEffect, useState } from 'react';
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
import { useTheme } from '../util/ThemeContext';

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

const EmptyState = ({ onScanPress, strings }) => (
  <View style={styles.emptyContainer}>
    <Image
      source={require('../assets/images/not_found.png')}
      style={styles.emptyImage}
    />
    <Text style={styles.emptyTitle}>{strings.noResultsTitle}</Text>
    <Text style={styles.emptySubtitle}>{strings.noResultsSubtitle}</Text>
    <TouchableOpacity style={styles.scanButton} onPress={onScanPress}>
      <Text style={styles.scanButtonText}>{strings.scanDevice}</Text>
    </TouchableOpacity>
  </View>
);

/**
 * AddDevice screen with:
 * - translation (en/ar)
 * - dark mode (light/dark)
 *
 * Notes:
 * - Will use route.params?.locale and route.params?.isDarkMode if provided by profile/settings.
 * - Does not change original device logic / functions.
 */
export default function AddDevice({ navigation, route }) {
  // If profile passes locale / theme via route.params, use them; otherwise default to en/light
  const [locale, setLocale] = useState(route.params?.locale || 'en'); // 'en' | 'ar'
  //const [isDarkMode, setIsDarkMode] = useState(route.params?.isDarkMode || false);
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeviceCategory, setNewDeviceCategory] = useState('My Devices');
  const [devices, setDevices] = useState(initialMockDevices);
  const [addEnabled, setAddEnabled] = useState(true);
  const [editingDevice, setEditingDevice] = useState(null);

  useEffect(() => {
    if (route.params?.selectedDevice) {
      setEditingDevice(route.params.selectedDevice);
      setShowAddForm(true);
    }

    // If profile/settings pass locale/isDarkMode updates while on this screen,
    // reflect them.
    if (route.params?.locale) setLocale(route.params.locale);
    if (typeof route.params?.isDarkMode !== 'undefined') setIsDarkMode(route.params.isDarkMode);
  }, [route.params?.selectedDevice, route.params?.locale, route.params?.isDarkMode]);

  // translation strings for this screen
  const strings = {
    en: {
      title: 'Add Device',
      searchPlaceholder: 'Search Device',
      all: 'All',
      myDevice: 'My Device',
      family: 'Family',
      noResultsTitle: 'No results found',
      noResultsSubtitle: 'The search could not be found, please check spelling or write another word.',
      scanDevice: 'Scan Device',
      addNow: 'Add Now',
      addNewDevice: 'Add New Device',
      connected: '• Connected',
      disconnected: '• Disconnected',
      selectType: 'Select Type',
      categoryTitle: 'Category',
    },
    ar: {
      title: 'إضافة جهاز',
      searchPlaceholder: 'ابحث عن جهاز',
      all: 'الكل',
      myDevice: 'أجهزتي',
      family: 'العائلة',
      noResultsTitle: 'لا توجد نتائج',
      noResultsSubtitle: 'لم يتم العثور على نتيجة، تحقق من الإملاء أو اكتب كلمة أخرى.',
      scanDevice: 'مسح الجهاز',
      addNow: 'أضف الآن',
      addNewDevice: 'إضافة جهاز جديد',
      connected: '• متصل',
      disconnected: '• غير متصل',
      selectType: 'اختر النوع',
      categoryTitle: 'الفئة',
    },
  }[locale];

  const isRTL = locale === 'ar';

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

  // Derived colors for dark / light mode
  const theme = {
    background: isDarkMode ? '#0F1724' : '#F9FAFB',
    card: isDarkMode ? '#0B1220' : '#FFFFFF',
    text: isDarkMode ? '#E6EEF6' : COLORS.purple8,
    subtext: isDarkMode ? '#9AA8B6' : COLORS.gray2,
    inputBg: isDarkMode ? '#0B1724' : '#FFFFFF',
    border: isDarkMode ? '#1F2A37' : '#F3F4F6',
    primaryButton: isDarkMode ? COLORS.purple1 : COLORS.brightTiffany,
  };

  // Merge dynamic styles
  const dynamicStyles = {
    container: { backgroundColor: theme.background },
    headerTitle: { color: theme.text },
    searchInput: {
      backgroundColor: theme.inputBg,
      borderColor: theme.border,
      color: theme.text,
    },
    card: {
      backgroundColor: theme.card,
      borderColor: theme.border,
    },
    deviceName: { color: theme.text },
    deviceNameInput: { color: theme.text },
    connectedText: { color: isDarkMode ? '#34D399' : '#10B981' },
    disconnectedText: { color: theme.subtext },
    categoryText: { color: theme.text },
    categoryTitle: { color: theme.text },
    categoryButtonActive: {
      borderColor: isDarkMode ? COLORS.purple1 : COLORS.purple1,
      backgroundColor: isDarkMode ? '#081226' : '#FFFFFF',
    },
    categoryButtonInactive: {
      borderColor: theme.border,
      backgroundColor: isDarkMode ? '#07111a' : '#F3F4F6',
    },
    categoryTextActive: { color: theme.text },
    categoryTextInactive: { color: theme.subtext },
    primaryButton: { backgroundColor: theme.primaryButton },
    emptyTitle: { color: theme.text },
    emptySubtitle: { color: theme.subtext },
    scanButtonText: { color: COLORS.purple1 },
  };

  // Header controls for testing / local toggles
  const LanguageToggle = () => (
    <TouchableOpacity
      onPress={() => setLocale(prev => (prev === 'en' ? 'ar' : 'en'))}
      style={{ padding: 6, marginHorizontal: 8 }}
    >
      <Text style={{ color: theme.text, fontWeight: '600' }}>{locale === 'en' ? 'EN' : 'ع'}</Text>
    </TouchableOpacity>
  );

  const ThemeToggle = () => (
    <TouchableOpacity
      onPress={() => setIsDarkMode(prev => !prev)}
      style={{ padding: 6, marginHorizontal: 8 }}
    >
      <Ionicons
        name={isDarkMode ? 'sunny' : 'moon'}
        size={20}
        color={theme.text}
        style={isRTL && { transform: [{ scaleX: -1 }] }}
      />
    </TouchableOpacity>
  );

  if (showAddForm) {
    const deviceData = editingDevice || { name: 'New Device', type: 'phone', category: 'My Devices' };
    return (
      <ScrollView style={[styles.container, dynamicStyles.container]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.text}
              style={isRTL && { transform: [{ scaleX: -1 }] }}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>{strings.title}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LanguageToggle />
            <ThemeToggle />
            <TouchableOpacity onPress={navigateToRadar}>
              <Image source={require('../assets/icons/scan.png')} style={{ width: 24, height: 24, tintColor: theme.text }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, dynamicStyles.card]}>
          <View style={[styles.row, { marginBottom: 16 }]}>
            <View style={styles.deviceInfo}>
              {getDeviceIcon(deviceData.type)}
              <TextInput style={[styles.deviceNameInput, dynamicStyles.deviceNameInput]} defaultValue={deviceData.name} />
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
            <Text style={addEnabled ? [styles.connectedText, dynamicStyles.connectedText] : [styles.disconnectedText, dynamicStyles.disconnectedText]}>
              {addEnabled ? strings.connected : strings.disconnected}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.selectTypeText, { color: theme.text }]}>{strings.selectType}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, dynamicStyles.card]}>
          <Text style={[styles.categoryTitle, dynamicStyles.categoryTitle]}>{strings.categoryTitle}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                newDeviceCategory === 'My Devices' ? styles.categoryButtonActive : styles.categoryButtonInactive,
                newDeviceCategory === 'My Devices' ? dynamicStyles.categoryButtonActive : dynamicStyles.categoryButtonInactive,
              ]}
              onPress={() => setNewDeviceCategory('My Devices')}
            >
              <Text style={newDeviceCategory === 'My Devices' ? [styles.categoryTextActive, dynamicStyles.categoryTextActive] : [styles.categoryTextInactive, dynamicStyles.categoryTextInactive]}>
                {strings.myDevice}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                newDeviceCategory === 'Family' ? styles.categoryButtonActive : styles.categoryButtonInactive,
                newDeviceCategory === 'Family' ? dynamicStyles.categoryButtonActive : dynamicStyles.categoryButtonInactive,
              ]}
              onPress={() => setNewDeviceCategory('Family')}
            >
              <Text style={newDeviceCategory === 'Family' ? [styles.categoryTextActive, dynamicStyles.categoryTextActive] : [styles.categoryTextInactive, dynamicStyles.categoryTextInactive]}>
                {strings.family}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.primaryButton, dynamicStyles.primaryButton]} onPress={handleDeviceAdded}>
          <Text style={styles.primaryButtonText}>{strings.addNow}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.text}
            style={isRTL && { transform: [{ scaleX: -1 }] }}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>{strings.title}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LanguageToggle />
          <ThemeToggle />
          <TouchableOpacity onPress={navigateToRadar}>
            <Image source={require('../assets/icons/scan.png')} style={{ width: 24, height: 24, tintColor: theme.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder={strings.searchPlaceholder}
          placeholderTextColor={theme.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, dynamicStyles.searchInput]}
        />
        <Ionicons name="search" size={20} color={theme.subtext} style={styles.searchIcon} />
      </View>

      <View style={styles.categoryFilterContainer}>
        {([strings.all, strings.myDevice, strings.family]).map(category => (
          <TouchableOpacity
            key={category}
            style={
              (selectedCategory === category || (selectedCategory === 'My Device' && category === strings.myDevice))
                ? [styles.categoryButtonActive, dynamicStyles.categoryButtonActive]
                : [styles.categoryButtonInactive, dynamicStyles.categoryButtonInactive]
            }
            onPress={() => setSelectedCategory(
              category === strings.all ? 'All' :
                category === strings.myDevice ? 'My Device' : 'Family'
            )}
          >
            <Text style={
              (selectedCategory === category || (selectedCategory === 'My Device' && category === strings.myDevice))
                ? [styles.categoryTextActive, dynamicStyles.categoryTextActive]
                : [styles.categoryTextInactive, dynamicStyles.categoryTextInactive]
            }>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredDevices.length === 0 ? (
        <EmptyState onScanPress={navigateToRadar} strings={strings} />
      ) : (
        <View>
          <View style={{ marginTop: 20 }}>
            {filteredDevices.map(device => (
              <View key={device.id} style={[styles.card, dynamicStyles.card]}>
                <View style={[styles.row, { marginBottom: 16 }]}>
                  <View style={styles.deviceInfo}>
                    {getDeviceIcon(device.type)}
                    <Text style={[styles.deviceName, dynamicStyles.deviceName]}>{device.name}</Text>
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
                  <Text style={device.enabled ? [styles.connectedText, dynamicStyles.connectedText] : [styles.disconnectedText, dynamicStyles.disconnectedText]}>
                    {device.enabled ? strings.connected : strings.disconnected}
                  </Text>
                  <Text style={[styles.categoryText, dynamicStyles.categoryText]}>{device.category}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.primaryButton, dynamicStyles.primaryButton]} onPress={() => setShowAddForm(true)}>
            <Text style={styles.primaryButtonText}>{strings.addNewDevice}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor overridden dynamically
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    // color overridden dynamically
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    // backgroundColor overridden dynamically
    borderRadius: 999,
    paddingLeft: 24,
    paddingRight: 50,
    fontSize: 16,
    borderWidth: 2,
    // borderColor overridden dynamically
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
  },
  card: {
    // backgroundColor overridden dynamically
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    // borderColor overridden dynamically
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '500',
    // color overridden dynamically
  },
  deviceNameInput: {
    fontSize: 18,
    fontWeight: '500',
    // color overridden dynamically
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  connectedText: {
    color: '#10B981',
    fontWeight: '500',
  },
  disconnectedText: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  selectTypeText: {
    color: COLORS.purple8,
  },
  categoryText: {
    color: COLORS.purple8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    // color overridden dynamically
  },
  categoryFilterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  categoryButtonActive: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.purple1,
    backgroundColor: 'white',
  },
  categoryButtonInactive: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    backgroundColor: '#F3F4F6',
  },
  categoryTextActive: {
    color: COLORS.purple8,
    fontWeight: '500',
  },
  categoryTextInactive: {
    color: COLORS.gray2,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: COLORS.brightTiffany,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  primaryButtonText: {
    color: 'white',
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
    color: COLORS.purple8,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.gray2,
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
