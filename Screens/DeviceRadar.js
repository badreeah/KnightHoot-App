import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Conditional BLE import with fallback
let BleManager;
try {
  BleManager = require('react-native-ble-plx').BleManager;
} catch (e) {
  console.warn('BLE PLX not available, using mock');
  // Mock BleManager for development/testing
  BleManager = class MockBleManager {
    constructor() {
      this.state = 'PoweredOn';
    }
    
    onStateChange(callback, emitCurrentState) {
      if (emitCurrentState) {
        setTimeout(() => callback('PoweredOn'), 0);
      }
      return { remove: () => {} };
    }
    
    async state() {
      return 'PoweredOn';
    }
    
    startDeviceScan(serviceUUIDs, options, callback) {
      console.log('Mock BLE scan started');
      // Simulate finding devices
      const mockDevices = [
        { id: 'mock-1', name: 'Mock Phone', localName: 'Mock Phone', bluetooth_id: 'AA:BB:CC:DD:EE:11' },
        { id: 'mock-2', name: 'Mock Laptop', localName: 'Mock Laptop', bluetooth_id: 'AA:BB:CC:DD:EE:22' },
        { id: 'mock-3', name: 'Mock Tablet', localName: 'Mock Tablet', bluetooth_id: 'AA:BB:CC:DD:EE:33' },
      ];
      
      let deviceIndex = 0;
      this.scanInterval = setInterval(() => {
        if (deviceIndex < mockDevices.length && Math.random() > 0.5) {
          callback(null, mockDevices[deviceIndex]);
          deviceIndex++;
        }
      }, 1000);
    }
    
    stopDeviceScan() {
      console.log('Mock BLE scan stopped');
      if (this.scanInterval) {
        clearInterval(this.scanInterval);
      }
    }
  };
}

// Define COLORS locally
const COLORS = {
  purple1: '#7C3AED',
  purple8: '#4C1D95',
  gray1: '#F9FAFB',
  pulseEnd: 'rgba(76, 29, 149, 0)',
};

const initialDevices = [
  { id: "1", name: "Phone1", type: "phone", angle: 45, radius: 2, selected: false, bluetooth_id: "mock-bt-1" },
  { id: "2", name: "Laptop1", type: "laptop", angle: 120, radius: 4, selected: false, bluetooth_id: "mock-bt-2" },
  { id: "3", name: "Ipad", type: "tablet", angle: 210, radius: 3, selected: false, bluetooth_id: "mock-bt-3" },
  { id: "4", name: "Phone2", type: "phone", angle: 300, radius: 2, selected: false, bluetooth_id: "mock-bt-4" },
  { id: "5", name: "Laptop2", type: "laptop", angle: 15, radius: 4, selected: false, bluetooth_id: "mock-bt-5" },
];

const DeviceIcon = ({ type }) => {
  let iconName = "phone-portrait-outline";
  if (type === 'laptop') iconName = "laptop-outline";
  if (type === 'tablet') iconName = "tablet-portrait-outline";
  return <Ionicons name={iconName} size={20} color={COLORS.purple1} />;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const radarSize = Math.min(screenWidth, screenHeight);
const radarWidth = radarSize;
const radarHeight = radarSize;

const RadarPulse = ({ delay }) => {
  const pulseAnim = useMemo(() => new Animated.Value(0), []);
  const opacityAnim = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    let timeout;
    const animate = () => {
      pulseAnim.setValue(0);
      opacityAnim.setValue(1);
      
      Animated.parallel([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    timeout = setTimeout(() => animate(), delay);
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [pulseAnim, opacityAnim, delay]);

  const scaleX = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1.05],
  });

  const scaleY = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1.05],
  });

  return (
    <Animated.View
      style={[
        styles.pulse,
        {
          width: radarWidth,
          height: radarHeight,
          borderRadius: Math.max(radarWidth, radarHeight) / 2,
          transform: [{ scaleX }, { scaleY }],
          opacity: opacityAnim,
        },
      ]}
    />
  );
};

export default function DeviceRadar({ navigation }) {
  const [manager, setManager] = useState(null);
  const [devices, setDevices] = useState(initialDevices);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [useDummies, setUseDummies] = useState(true);
  const [bleAvailable, setBleAvailable] = useState(true);

  // Initialize BLE Manager
  useEffect(() => {
    try {
      if (BleManager) {
        const bleManager = new BleManager();
        setManager(bleManager);
      } else {
        setBleAvailable(false);
      }
    } catch (error) {
      console.warn('Failed to initialize BLE Manager:', error);
      setBleAvailable(false);
    }

    return () => {
      if (manager) {
        manager.stopDeviceScan();
      }
    };
  }, []);

  useEffect(() => {
    if (!manager || useDummies) return;

    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn' && !scanning) {
        scanDevices();
      } else if (state === 'PoweredOff') {
        Alert.alert('Bluetooth', 'Please enable Bluetooth to scan for devices');
      }
    }, true);

    return () => {
      subscription.remove();
    };
  }, [manager, useDummies, scanning]);

  const scanDevices = () => {
    if (!manager || scanning) return;
    
    setScanning(true);
    setDiscoveredDevices([]);

    try {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          if (error.message && error.message.includes('BluetoothLE is unsupported')) {
            Alert.alert('Bluetooth Error', 'Bluetooth is not supported on this device');
            setScanning(false);
            manager.stopDeviceScan();
          }
          return;
        }

        if (device && device.id) {
          const newDevice = {
            id: device.id,
            name: device.name || device.localName || `Device ${device.id.slice(0, 4)}`,
            type: determineDeviceType(device),
            angle: Math.random() * 360,
            radius: Math.floor(Math.random() * 4) + 1,
            selected: false,
            bluetooth_id: device.bluetooth_id || device.id,
          };

          setDiscoveredDevices((prev) => {
            if (prev.find((d) => d.id === newDevice.id)) return prev;
            return [...prev, newDevice];
          });
        }
      });

      // Stop scanning after 10 seconds
      setTimeout(() => {
        if (manager) {
          manager.stopDeviceScan();
        }
        setScanning(false);
      }, 10000);
    } catch (error) {
      console.error('Failed to start scan:', error);
      setScanning(false);
    }
  };

  const determineDeviceType = (device) => {
    const name = (device.name || device.localName || '').toLowerCase();
    if (name.includes('laptop') || name.includes('macbook') || name.includes('computer')) {
      return 'laptop';
    } else if (name.includes('tablet') || name.includes('ipad')) {
      return 'tablet';
    }
    return 'phone';
  };

  const toggleMode = () => {
    const nextUseDummies = !useDummies;
    setUseDummies(nextUseDummies);

    if (!nextUseDummies) {
      if (!bleAvailable || !manager) {
        Alert.alert(
          'Bluetooth Not Available',
          'Bluetooth functionality is not available. Using dummy mode instead.',
        );
        setUseDummies(true);
        return;
      }

      manager.state().then((state) => {
        if (state === 'PoweredOn') {
          scanDevices();
        } else {
          Alert.alert('Bluetooth', 'Please enable Bluetooth to scan for devices');
        }
      }).catch((error) => {
        console.error('Failed to check BLE state:', error);
        Alert.alert('Error', 'Failed to access Bluetooth. Using dummy mode.');
        setUseDummies(true);
      });
    }
  };

  const allDevices = useDummies ? devices : [...devices, ...discoveredDevices];

  const handleSelectDevice = (deviceId) => {
    const updatedDevices = allDevices.map((d) => ({
      ...d,
      selected: d.id === deviceId,
    }));
    
    // Update state for initial devices
    setDevices(updatedDevices.filter(d => initialDevices.find(init => init.id === d.id)));
    
    // Update state for discovered devices
    setDiscoveredDevices(updatedDevices.filter(d => !initialDevices.find(init => init.id === d.id)));

    const selectedDevice = allDevices.find((d) => d.id === deviceId);

    setTimeout(() => {
      if (selectedDevice && navigation) {
        navigation.navigate('AddDevice', { selectedDevice, isNew: true });
      }
    }, 400);
  };

  const getDevicePosition = (angle, radius) => {
    const centerX = radarWidth / 2;
    const centerY = radarHeight / 2;
    const totalRings = 4;
    // Increased ring spacing for more room between devices
    const ringSpacingX = centerX / (totalRings + 0.5);
    const ringSpacingY = centerY / (totalRings + 0.5);
    const radiusX = ringSpacingX * radius;
    const radiusY = ringSpacingY * radius;
    const radian = (angle * Math.PI) / 180;
    const x = centerX + Math.cos(radian) * radiusX;
    const y = centerY + Math.sin(radian) * radiusY;
    return {
      top: y,
      left: x,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation?.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.purple8} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
          <Text style={styles.toggleText}>
            {useDummies ? 'Bluetooth Mode' : 'Dummy Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.radarContainer, { width: radarWidth, height: radarHeight }]}>
          <RadarPulse delay={0} />
          <RadarPulse delay={1000} />
          <RadarPulse delay={2000} />

          {[1, 2, 3, 4].map((ring) => {
            const centerX = radarWidth / 2;
            const centerY = radarHeight / 2;
            const ringSpacingX = centerX / 5;
            const ringSpacingY = centerY / 5;
            const width = ringSpacingX * ring * 2;
            const height = ringSpacingY * ring * 2;
            return (
              <View
                key={ring}
                style={[
                  styles.circle,
                  {
                    width: width,
                    height: height,
                    borderRadius: Math.max(width, height) / 2,
                    top: centerY - height / 2,
                    left: centerX - width / 2,
                  },
                ]}
              />
            );
          })}

          <View
            style={[
              styles.centerCircle,
              {
                top: radarHeight / 2 - 10,
                left: radarWidth / 2 - 10,
              },
            ]}
          />

          {allDevices.map((device) => {
            const position = getDevicePosition(device.angle, device.radius);
            return (
              <TouchableOpacity
                key={device.id}
                onPress={() => handleSelectDevice(device.id)}
                style={[
                  styles.deviceNode,
                  {
                    top: position.top - 25,
                    left: position.left - 35,
                    borderWidth: device.selected ? 2 : 0,
                    borderColor: device.selected ? COLORS.purple1 : 'transparent',
                  },
                ]}
              >
                <DeviceIcon type={device.type} />
                <Text style={styles.deviceName}>{device.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <Text style={styles.statusText}>
          {!bleAvailable
            ? 'Bluetooth not available - Using dummy data'
            : scanning
            ? 'Scanning for devices...'
            : useDummies
            ? 'Showing dummy data'
            : 'Scan complete'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray1,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.purple1,
    borderRadius: 8,
  },
  toggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarContainer: {
    position: 'relative',
  },
  pulse: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: COLORS.purple8,
    backgroundColor: COLORS.pulseEnd,
  },
  circle: {
    position: 'absolute',
    borderColor: '#E5E7EB',
    borderWidth: 1.5,
  },
  centerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    position: 'absolute',
  },
  deviceNode: {
    position: 'absolute',
    width: 70,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deviceName: {
    fontSize: 10,
    color: COLORS.purple8,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  statusText: {
    position: 'absolute',
    bottom: 50,
    fontSize: 16,
    color: COLORS.purple8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});