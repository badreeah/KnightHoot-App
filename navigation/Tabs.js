import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";


import Home from "../Screens/Home";
import Statics from "../Screens/Statics";
import AddDevice from "../Screens/AddDevice";
import DeviceRadar from "../Screens/DeviceRadar";
import ManageAlerts from "../Screens/ManageAlerts";
import Profile from "../Screens/Profile";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); 

function AddDeviceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddDeviceList" component={AddDevice} />
      <Stack.Screen name="DeviceRadar" component={DeviceRadar} />
    </Stack.Navigator>
  );
}


const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#9A9DD7";
const INACTIVE_COLOR = "#808086";
const BG_COLOR = "#222227";

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <AnimatedTouchable
            key={route.key}
            onPress={onPress}
            layout={LinearTransition.springify().mass(0.6)}
            style={[styles.tabItem, isFocused && { backgroundColor: "#fff" }]}
          >
            <Image
              source={getIcon(route.name)}
              style={[
                styles.icon,
                { tintColor: isFocused ? PRIMARY_COLOR : INACTIVE_COLOR },
              ]}
            />
            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={[styles.label, { color: PRIMARY_COLOR }]}
              >
                {label}
              </Animated.Text>
            )}
          </AnimatedTouchable>
        );
      })}
    </View>
  );
}

// Icons mapping
function getIcon(name) {
  switch (name) {
    case "Home":
      return require("../assets/icons/home.png");
    case "Statistics":
      return require("../assets/icons/stats.png");
    case "Add Device":
      return require("../assets/icons/add.png");
    case "Alerts":
      return require("../assets/icons/bell.png");
    case "Profile":
      return require("../assets/icons/user.png");
    default:
      return require("../assets/icons/home.png");
  }
}

export default function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Statistics" component={Statics} />
      <Tab.Screen name="Add Device" component={AddDeviceStack} />
      <Tab.Screen name="Alerts" component={ManageAlerts} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    backgroundColor: BG_COLOR,
    width: "85%",
    alignSelf: "center",
    borderRadius: 30,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 25,
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    marginLeft: 6,
    fontSize: 12,
    fontFamily: "Poppins-600",
  },
});

