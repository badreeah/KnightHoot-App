import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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

import { useFonts } from "expo-font";

{
  /*  <Stack.Navigator screenOptions={{ headerShown: false }}>
          <>
            <Stack.Screen name="OnBoarding" component={OnBoarding} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Home" component={Tabs} />
          </>
        </Stack.Navigator> */
}
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
import SignUp from "./Screens/SignUp";

const Stack = createNativeStackNavigator();

export default function App() {
  const [showOnBoarding, setShowOnBoarding] = useState(true); //  start with onboarding

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

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <>
            <Stack.Screen name="OnBoarding" component={OnBoarding} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="VerificationOTP" component={VerificationOTP} />
            <Stack.Screen
              name="SetNewPasswordScreen"
              component={SetNewPasswordScreen}
            />
            <Stack.Screen name="Home" component={Tabs} />
            <Stack.Screen name="DeviceRadar" component={DeviceRadar} />
            <Stack.Screen name="ReportScam" component={ReportScam} />
            <Stack.Screen name="AnalyzeCall" component={AnalyzeCall} />
          </>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
