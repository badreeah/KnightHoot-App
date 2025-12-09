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
import { useAppSettings } from "../src/context/AppSettingProvid";
import { supabase } from "../supabase";

// عدلي هذا الرابط حسب API حقتك
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
  const [apiStatus, setApiStatus] = useState("checking"); // connected | disconnected | checking
  const [scanInterval, setScanInterval] = useState(null);
  const [processedMessages, setProcessedMessages] = useState([]);

  const { theme, isRTL } = useAppSettings();
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

  const scanRandomMessage = async () => {
    const availableIndexes = RANDOM_SMS_MESSAGES.map((_, idx) => idx).filter(
      (idx) => !processedMessages.includes(idx)
    );

    if (availableIndexes.length === 0) {
      // كل الرسائل انمسحت، نعيد من البداية
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

    const randomIndex =
      availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
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

      // نتوقع من الـ API يرجع classification و confidence (0–100 مثلاً)
      const classification = data.classification; // "spam" أو "ham" حسب API
      const confidence = data.confidence ?? data.score ?? 0;

      await saveToDatabase(
        selectedMessage.sender,
        selectedMessage.text,
        classification,
        confidence / 100
      );

      setScanResults((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          message: `${data.message ?? "Classification result"}\nConfidence: ${
            confidence
          }%`,
          type: classification === "spam" ? "spam" : "safe",
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

  // تنظيف الـ interval عند الخروج من الشاشة
  useEffect(() => {
    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [scanInterval]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons
            name={isRTL ? "arrow-forward" : "arrow-back"}
            size={24}
            color={theme.colors.text}
          />
        </Pressable>

        <Text style={styles.headerTitle}>SMS Scam Detector</Text>

        <View style={styles.statusWrapper}>
          <View
            style={[
              styles.statusDot,
              apiStatus === "connected"
                ? styles.statusConnected
                : styles.statusDisconnected,
            ]}
          />
          <Text style={styles.statusText}>
            {apiStatus === "connected"
              ? "Online"
              : apiStatus === "checking"
              ? "Checking..."
              : "Offline"}
          </Text>
        </View>
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Live SMS Monitoring</Text>
        <Text style={styles.sectionSubtitle}>
          Simulated SMS messages are analyzed in real time to detect potential
          scams.
        </Text>

        <View style={styles.resultsContainer}>
          {scanResults.length === 0 ? (
            <Text style={styles.placeholderText}>
              {apiStatus === "disconnected"
                ? "⚠️ API Server not connected.\nPlease start the Python API server and check the API_BASE_URL."
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
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        {/* START */}
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

        {/* STOP */}
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
    </ScrollView>
  );
}

// نفس أسلوب SafeBrowsing / ReportScam: ثيم ديناميكي
const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    header: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 60,
      paddingBottom: 20,
    },
    headerTitle: {
      fontFamily: "Poppins-600",
      fontSize: 20,
      color: theme.colors.text,
      textAlign: "center",
    },
    statusWrapper: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    statusConnected: {
      backgroundColor: "#10B981",
    },
    statusDisconnected: {
      backgroundColor: "#EF4444",
    },
    statusText: {
      fontFamily: "Poppins-400",
      fontSize: 12,
      color: theme.colors.subtext,
    },

    card: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      marginBottom: 16,
    },
    sectionTitle: {
      fontFamily: "Poppins-500",
      fontSize: 18,
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    sectionSubtitle: {
      fontFamily: "Poppins-400",
      fontSize: 13,
      color: theme.colors.subtext,
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
    },

    resultsContainer: {
      maxHeight: 380,
    },
    placeholderText: {
      fontFamily: "Poppins-400",
      fontSize: 14,
      color: theme.colors.subtext,
      textAlign: isRTL ? "right" : "left",
      lineHeight: 22,
    },
    resultItem: {
      marginBottom: 10,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.cardBorder,
    },
    resultTime: {
      fontFamily: "Poppins-400",
      fontSize: 11,
      color: theme.colors.subtext,
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
    },
    resultMessage: {
      fontFamily: "Poppins-400",
      fontSize: 13,
      color: theme.colors.text,
      lineHeight: 20,
      textAlign: isRTL ? "right" : "left",
    },
    spamText: {
      color: COLORS.purple7,
      fontFamily: "Poppins-600",
    },
    safeText: {
      color: COLORS.brightTiffany,
      fontFamily: "Poppins-600",
    },

    buttonRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 8,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
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
      fontFamily: "Poppins-600",
      fontSize: 16,
      color: theme.colors.primaryTextOn,
      letterSpacing: 1,
    },
  });
