// Screens/SmsScam.js
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../util/colors";
import { supabase } from "../supabase";
import { useAppSettings } from "../src/context/AppSettingProvid";

const API_BASE_URL = "http://192.168.88.1:8000";

// Random SMS messages for testing (mix of spam and legitimate)
const RANDOM_SMS_MESSAGES = [
  {
    sender: "+966501234567",
    text: "تحقق من رصيدك الآن! اضغط على الرابط للحصول على جائزة 1000 ريال",
  },
  {
    sender: "+966507654321",
    text: "موعد اجتماعك غداً الساعة العاشرة صباحاً في المكتب",
  },
  {
    sender: "+966555555555",
    text: "لقد ربحت جائزة كبرى! ارسل معلوماتك البنكية للحصول عليها",
  },
  {
    sender: "+966509876543",
    text: "تم تأجيل المحاضرة إلى الأسبوع القادم. شكراً لتفهمكم",
  },
  {
    sender: "BANK-ALERT",
    text: "عزيزي العميل، تم سحب 5000 ريال من حسابك. للاعتراض اتصل فوراً",
  },
  {
    sender: "+966502345678",
    text: "مرحباً، هل أنت متاح للقاء غداً لمناقشة المشروع؟",
  },
  {
    sender: "STC-OFFERS",
    text: "عرض خاص! احصل على 100 جيجا مجاناً. ارسل بياناتك الشخصية الآن",
  },
  {
    sender: "+966508765432",
    text: "لا تنسى شراء الحليب والخبز في طريق العودة للمنزل",
  },
  {
    sender: "+966501111111",
    text: "مبروك! تم اختيارك للفوز بسيارة فاخرة. اضغط الرابط للمطالبة بالجائزة",
  },
  {
    sender: "+966503456789",
    text: "اجتماع الفريق اليوم الساعة الثالثة عصراً عبر زووم",
  },
];


export default function SmsScam({ navigation }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const [scanInterval, setScanInterval] = useState(null);
  const [processedMessages, setProcessedMessages] = useState([]);

  // الثيم + RTL من الكونتكست
  const { theme, isRTL } = useAppSettings();
  // مهم: تغيير الاسم إلى createStyles عشان ما يصير تعارض
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  // Check API status on mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();
      if (data.status === "running") {
        setApiStatus("connected");
      } else {
        setApiStatus("disconnected");
      }
    } catch (error) {
      console.error("API status check failed:", error);
      setApiStatus("disconnected");
    }
  };

  const handleStartScanning = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/scan-control/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "start" }),
      });

      if (!response.ok) {
        throw new Error("Failed to start scanning");
      }

      const data = await response.json();
      setIsScanning(true);
      setProcessedMessages([]);
      setScanResults([
        {
          time: new Date().toLocaleTimeString(),
          message: "🔍 " + data.message,
          type: "info",
        },
      ]);

      // Start scanning random messages every 5 seconds
      const intervalId = setInterval(() => {
        scanRandomMessage();
      }, 5000);
      setScanInterval(intervalId);

      // Scan the first message immediately
      setTimeout(() => {
        scanRandomMessage();
      }, 1000);

      Alert.alert("Success", "SMS scanning started successfully");
    } catch (error) {
      console.error("Error starting scan:", error);
      Alert.alert(
        "Connection Error",
        `Unable to connect to the API server. Please ensure:\n1. The Python API is running\n2. Update API_BASE_URL in SmsScam.js with your IP address\n\nError: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopScanning = async () => {
    setIsLoading(true);
    try {
      if (scanInterval) {
        clearInterval(scanInterval);
        setScanInterval(null);
      }

      const response = await fetch(`${API_BASE_URL}/scan-control/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "stop" }),
      });

      if (!response.ok) {
        throw new Error("Failed to stop scanning");
      }

      const data = await response.json();
      setIsScanning(false);
      setScanResults((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          message: "⏹️ " + data.message,
          type: "info",
        },
      ]);
      Alert.alert("Success", "SMS scanning stopped");
    } catch (error) {
      console.error("Error stopping scan:", error);
      Alert.alert("Error", "Failed to stop scanning");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to scan a random message from the pool
  const scanRandomMessage = async () => {
    const availableMessages = RANDOM_SMS_MESSAGES.filter(
      (msg, index) => !processedMessages.includes(index)
    );

    if (availableMessages.length === 0) {
      setProcessedMessages([]);
      setScanResults((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          message: "🔄 All messages scanned. Restarting from beginning...",
          type: "info",
        },
      ]);
      return;
    }

    const randomIndex = Math.floor(Math.random() * RANDOM_SMS_MESSAGES.length);

    if (processedMessages.includes(randomIndex)) {
      return scanRandomMessage();
    }

    const selectedMessage = RANDOM_SMS_MESSAGES[randomIndex];
    setProcessedMessages((prev) => [...prev, randomIndex]);

    setScanResults((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        message: `📱 New SMS from ${selectedMessage.sender}:\n"${selectedMessage.text}"`,
        type: "info",
      },
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: selectedMessage.text }),
      });

      if (!response.ok) {
        throw new Error("Classification failed");
      }

      const data = await response.json();

      await saveToDatabase(
        selectedMessage.sender,
        selectedMessage.text,
        data.classification,
        data.confidence / 100
      );

      setScanResults((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          message: `${data.message}\nConfidence: ${data.confidence}%`,
          type: data.classification === "spam" ? "spam" : "safe",
        },
        {
          time: new Date().toLocaleTimeString(),
          message: "─────────────────────────",
          type: "divider",
        },
      ]);
    } catch (error) {
      console.error("Error classifying message:", error);
      setScanResults((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          message: "❌ Classification error. Check API connection.",
          type: "error",
        },
      ]);
    }
  };

  const saveToDatabase = async (sender, message, classification, confidence) => {
    try {
      const { data, error } = await supabase.from("sms_scans").insert([
        {
          sender_id: sender,
          message_content: message,
          classification_response: classification,
          confidence_score: confidence,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error saving to database:", error);
      } else {
        console.log("Saved to database successfully");
      }
    } catch (err) {
      console.error("Database save error:", err);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [scanInterval]);

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons
          name={isRTL ? "arrow-forward" : "arrow-back"}
          size={24}
          color={theme.colors.text}
        />
      </Pressable>

      {/* Header */}
      <Text style={styles.header}>KnightHoo</Text>

      {/* Section Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>SMS Scam</Text>
        <View
          style={[
            styles.statusDot,
            apiStatus === "connected"
              ? styles.statusConnected
              : styles.statusDisconnected,
          ]}
        />
      </View>

      {/* Classification Response Area */}
      <View style={styles.responseCard}>
        <ScrollView showsVerticalScrollIndicator={true}>
          {scanResults.length === 0 ? (
            <Text style={styles.responseText}>
              {isScanning
                ? "Monitoring incoming messages... Awaiting classification of new SMS content."
                : apiStatus === "disconnected"
                ? "⚠️ API Server not connected. Please start the Python API server.\n\nTo start the server:\n1. Navigate to the python folder\n2. Run: python api.py\n3. Update API_BASE_URL with your IP"
                : "Press START to begin monitoring SMS messages for scam detection."}
            </Text>
          ) : (
            scanResults.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultTime}>[{result.time}]</Text>
                <Text
                  style={[
                    styles.resultMessage,
                    result.type === "spam" && styles.spamText,
                    result.type === "safe" && styles.safeText,
                  ]}
                >
                  {result.message}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {/* START Button */}
        <Pressable
          onPress={handleStartScanning}
          disabled={isScanning || isLoading || apiStatus === "disconnected"}
          style={[
            styles.button,
            styles.startButton,
            (isScanning || isLoading || apiStatus === "disconnected") &&
              styles.buttonDisabled,
          ]}
        >
          {isLoading && !isScanning ? (
            <ActivityIndicator color={theme.colors.primaryTextOn} />
          ) : (
            <Text style={styles.buttonText}>START</Text>
          )}
        </Pressable>

        {/* STOP Button */}
        <Pressable
          onPress={handleStopScanning}
          disabled={!isScanning || isLoading}
          style={[
            styles.button,
            styles.stopButton,
            (!isScanning || isLoading) && styles.buttonDisabled,
          ]}
        >
          {isLoading && isScanning ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>STOP</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

// دالة بناء الـ styles مبنية على theme + isRTL
const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
    },
    backButton: {
      position: "absolute",
      top: 60,
      left: isRTL ? undefined : 24,
      right: isRTL ? 24 : undefined,
      zIndex: 10,
      padding: 8,
    },
    header: {
      fontSize: 24,
      fontFamily: "Poppins-700",
      textAlign: "center",
      color: theme.colors.text,
      marginBottom: 40,
      
    },
    titleContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 32,
      fontFamily: "Poppins-800",
      color: theme.colors.primary,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    statusConnected: {
      backgroundColor: "#10B981",
    },
    statusDisconnected: {
      backgroundColor: "#EF4444",
    },
    responseCard: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 24,
      marginBottom: 32,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    responseText: {
      fontSize: 16,
      fontFamily: "Poppins-400",
      color: theme.colors.subtext,
      lineHeight: 24,
      textAlign: isRTL ? "right" : "left",
    },
    resultItem: {
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.cardBorder,
    },
    resultTime: {
      fontSize: 11,
      fontFamily: "Poppins-400",
      color: theme.colors.subtext,
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
    },
    resultMessage: {
      fontSize: 13,
      fontFamily: "Poppins-400",
      color: theme.colors.text,
      lineHeight: 20,
      textAlign: isRTL ? "right" : "left",
    },
    spamText: {
      color: COLORS.purple7,
      fontFamily: "Poppins-600",
    },
    safeText: {
      color: COLORS.brightTiffany || "#059669",
      fontFamily: "Poppins-600",
    },
    buttonContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      gap: 16,
    },
    button: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    startButton: {
      backgroundColor: theme.colors.primary,
    },
    stopButton: {
      backgroundColor: COLORS.purple7,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 18,
      fontFamily: "Poppins-700",
      color: theme.colors.primaryTextOn,
      letterSpacing: 1,
    },
  });
