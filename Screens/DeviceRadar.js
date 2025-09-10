import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../util/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withDelay,
  interpolateColor,
} from 'react-native-reanimated';

const initialDevices = [
    { id: "1", name: "Phone1", type: "phone", angle: 45, radius: 2, selected: false },
    { id: "2", name: "Laptop1", type: "laptop", angle: 120, radius: 4, selected: false },
    { id: "3", name: "Ipad", type: "tablet", angle: 210, radius: 3, selected: false },
    { id: "4", name: "Phone2", type: "phone", angle: 300, radius: 2, selected: false },
    { id: "5", name: "Laptop2", type: "laptop", angle: 15, radius: 4, selected: false },
];

const DeviceIcon = ({ type }) => {
    let iconName = "phone-portrait-outline";
    if (type === 'laptop') iconName = "laptop-outline";
    if (type === 'tablet') iconName = "tablet-portrait-outline";
    return <Ionicons name={iconName} size={28} color={COLORS.purple1} />;
};

const { width: screenWidth } = Dimensions.get('window');
const radarSize = screenWidth * 1.2;

const RadarPulse = ({ delay }) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        const animation = withRepeat(
            withTiming(1, { duration: 3000, easing: Easing.out(Easing.ease) }),
            -1
        );
        const opacityAnimation = withRepeat(
            withTiming(0, { duration: 3000, easing: Easing.out(Easing.ease) }),
            -1
        );
        
        scale.value = withDelay(delay, animation);
        opacity.value = withDelay(delay, opacityAnimation);

    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const animatedBorderColor = interpolateColor(
            scale.value,
            [0, 1],
            [COLORS.purple8, COLORS.purple1]
        );
        const animatedBackgroundColor = interpolateColor(
            scale.value,
            [0, 1],
            [`${COLORS.purple8}14`, `${COLORS.purple1}14`]
        );

        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
            width: radarSize,
            height: radarSize,
            borderRadius: radarSize / 2,
            borderColor: animatedBorderColor,
            backgroundColor: animatedBackgroundColor,
        };
    });

    return <Animated.View style={[styles.pulse, animatedStyle]} />;
};


export default function DeviceRadar({ navigation }) {
    const [devices, setDevices] = useState(initialDevices);

    const handleSelectDevice = (deviceId) => {
        // 1. Show the purple border immediately
        setDevices(
            devices.map(d => ({
                ...d,
                selected: d.id === deviceId,
            }))
        );

        const selectedDevice = initialDevices.find(d => d.id === deviceId);

        // 2. Wait for a moment so the user sees the selection feedback
        setTimeout(() => {
            if (selectedDevice) {
                // 3. Navigate to the next screen
                navigation.navigate('AddDeviceList', { selectedDevice });
            }
        }, 400); // 400ms delay
    };

    const getDevicePosition = (angle, radius) => {
        const center = radarSize / 2;
        const totalRings = 4;
        const ringSpacing = center / (totalRings + 1);
        const radiusPixels = ringSpacing * radius;
        const radian = (angle * Math.PI) / 180;
        const x = center + Math.cos(radian) * radiusPixels;
        const y = center + Math.sin(radian) * radiusPixels;
        return { top: y, left: x };
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.purple8} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.radarContainer}>
                    <RadarPulse delay={0} />
                    <RadarPulse delay={1000} />
                    <RadarPulse delay={2000} />

                    {[1, 2, 3, 4].map((ring) => {
                        const center = radarSize / 2;
                        const ringSpacing = center / 5;
                        const size = ringSpacing * ring * 2;
                        return (
                            <View
                                key={ring}
                                style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
                            />
                        );
                    })}
                    
                    <View style={styles.centerCircle} />

                    {devices.map((device) => {
                        const position = getDevicePosition(device.angle, device.radius);
                        return (
                            <TouchableOpacity
                                key={device.id}
                                style={[styles.deviceNode, { top: position.top - 40, left: position.left - 45 }]}
                                onPress={() => handleSelectDevice(device.id)}
                            >
                                {device.selected && <View style={styles.selectedIndicator} />}
                                <DeviceIcon type={device.type} />
                                <Text style={styles.deviceName}>{device.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 50,
        paddingHorizontal: 16,
        zIndex: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    radarContainer: {
        width: radarSize,
        height: radarSize,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulse: {
        position: 'absolute',
        borderWidth: 2,
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
        width: 90,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 16,
        padding: 8,
    },
    selectedIndicator: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.purple1,
    },
    deviceName: {
        fontSize: 14,
        color: COLORS.purple8,
        fontWeight: '500',
        marginTop: 4,
    },
});

