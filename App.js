import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { StatusBar, PermissionsAndroid, Platform, Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState, useEffect, useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import SmsListener from "react-native-android-sms-listener"; // مكتبة listener

import Welcome from "./Screens/Welcome";
import Tabs from "./navigation/Tabs";
import OnBoarding from "./components/OnBoarding";
import SignIn from "./Screens/SignIn";
import ForgetPassword from "./Screens/ForgetPassword";
import VerificationOTP from "./Screens/VerificationOTP";
import SetNewPasswordScreen from "./Screens/SetNewPasswordScreen";
import DeviceRadar from "./Screens/DeviceRadar";
import ReportScam from "./Screens/ReportScam";
import AnalyzeCall from "./Screens/AnalyzeCall";
import Profile from "./Screens/Profile";
import SafeBrowsing from "./Screens/SafeBrowsing";
import SettingsScreen from "./Screens/SettingsScreen";
import SplashScreen from "./Screens/SplshScreen";
import ScanURLScreen from "./Screens/ScanURL";
import SignUp from "./Screens/SignUp";

import "./src/i18n";
import {
  AppSettingsProvider,
  useAppSettings,
} from "./src/context/AppSettingProvid";

import { useFonts } from "expo-font";
import {
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-100": Poppins_100Thin,
    "Poppins-200": Poppins_200ExtraLight,
    "Poppins-300": Poppins_300Light,
    "Poppins-400": Poppins_400Regular,
    "Poppins-500": Poppins_500Medium,
    "Poppins-600": Poppins_600SemiBold,
    "Poppins-700": Poppins_700Bold,
    "Poppins-800": Poppins_800ExtraBold,
    "Poppins-900": Poppins_900Black,
  });

  // ======== SMS Listener Setup ========
  useEffect(() => {
    const requestSmsPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
            {
              title: "SMS Permission",
              message:
                "This app needs access to your SMS messages to detect scams.",
              buttonPositive: "Allow",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("SMS permission granted");
            startSmsListener();
          } else {
            Alert.alert(
              "Permission Denied",
              "Cannot detect SMS without permission."
            );
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        console.log("SMS detection not available on iOS");
      }
    };

    const startSmsListener = () => {
      const subscription = SmsListener.addListener((message) => {
        console.log("New SMS received:", message);
        // هنا يمكن إرسال الرسالة إلى backend أو تحليلها
      });

      return () => subscription.remove(); // إزالة listener عند الخروج
    };

    requestSmsPermission();
  }, []);
  // ======================================

  function NavigationWithTheme() {
    const { theme } = useAppSettings();

    const navTheme = useMemo(() => {
      const base =
        theme.mode === "dark" ? { ...DarkTheme } : { ...DefaultTheme };
      base.colors.background = theme.colors.background;
      base.colors.card = theme.colors.card;
      base.colors.text = theme.colors.text;
      base.colors.border = theme.colors.cardBorder;
      base.colors.primary = theme.colors.primary;
      return base;
    }, [theme]);

    const statusBarStyle = theme.mode === "dark" ? "light" : "dark";

    return (
      <>
        <StatusBar
          style={statusBarStyle}
          backgroundColor={theme.colors.background}
        />
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="OnBoarding" component={OnBoarding} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen
              name="VerificationOTP"
              component={VerificationOTP}
            />
            <Stack.Screen
              name="SetNewPasswordScreen"
              component={SetNewPasswordScreen}
            />
            <Stack.Screen name="Home" component={Tabs} />
            <Stack.Screen name="DeviceRadar" component={DeviceRadar} />
            <Stack.Screen name="ReportScam" component={ReportScam} />
            <Stack.Screen name="AnalyzeCall" component={AnalyzeCall} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="SafeBrowsing" component={SafeBrowsing} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ScanURL" component={ScanURLScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }

  return (
    <AppSettingsProvider>
      <SafeAreaProvider>
        <NavigationWithTheme />
      </SafeAreaProvider>
    </AppSettingsProvider>
  );
}
