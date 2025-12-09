import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { COLORS } from "../util/colors";

const EXTENSION_URL =
  "https://chromewebstore.google.com/detail/EXTENSION_ID";

export default function BrowserProtectionScreen() {
  const nav = useNavigation();
  const { theme, isRTL } = useAppSettings();

  const openExtensionPage = async () => {
    try {
      const canOpen = await Linking.canOpenURL(EXTENSION_URL);
      if (canOpen) await Linking.openURL(EXTENSION_URL);
    } catch (e) {
      console.log("Error opening extension URL:", e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={[
            styles.backBtn,
            { backgroundColor: theme.mode === "dark" ? "#1E1E2C" : "#EFEFF5" },
          ]}
        >
          <Ionicons
            name={isRTL ? "arrow-forward" : "arrow-back"}
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Browser Protection
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.cardBorder,
            },
          ]}
        >
          <View style={styles.logoRow}>
            <View
              style={[styles.logoCircle, { backgroundColor: COLORS.purple1 }]}
            >
              <Ionicons name="shield-checkmark" size={22} color="#FFF" />
            </View>

            <Text
              style={[styles.cardTitle, { color: theme.colors.text }]}
            >
              KnightHoot Detect – Chrome Extension
            </Text>
          </View>

          <Text
            style={[styles.cardSub, { color: theme.colors.subtext }]}
          >
            Enable real-time URL scam detection directly in your desktop browser.
          </Text>

          <View style={styles.separator} />

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            كيف تعمل الحماية؟
          </Text>

          <Text style={[styles.paragraph, { color: theme.colors.subtext }]}>
            عند تثبيت إضافة KnightHoot Detect على متصفح Chrome، تقوم الإضافة
            بفحص أي موقع تزورينه لحظيًا وتعرض تنبيهًا داخل المتصفح يوضح ما إذا
            كان الموقع آمنًا أو احتياليًا.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            خطوات التفعيل:
          </Text>

          {[
            "افتحي الرابط من جهاز الكمبيوتر (Chrome Desktop).",
            "ثبّتي إضافة KnightHoot Detect من Chrome Web Store.",
            "بعد التثبيت سيتم فحص المواقع تلقائيًا مع تنبيه فوري إذا كان الرابط مشبوهًا.",
          ].map((step, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: theme.colors.text }]}>
                •
              </Text>
              <Text style={[styles.bulletText, { color: theme.colors.subtext }]}>
                {step}
              </Text>
            </View>
          ))}

          {/* Open Extension Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: COLORS.purple1 }]}
            onPress={openExtensionPage}
          >
            <Ionicons name="logo-chrome" size={18} color="#FFF" />
            <Text style={styles.primaryBtnText}>
              فتح صفحة الإضافة / Open extension page
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor:
                theme.mode === "dark" ? "#10121A" : "#E9F3FF",
            },
          ]}
        >
          <Ionicons name="information-circle-outline" size={20} color="#3B82F6" />
          <Text
            style={[styles.infoText, { color: theme.colors.text }]}
          >
            تعمل حماية المتصفح فقط على Chrome Desktop.  
            تطبيق KnightHoot على الجوال يركز على فحص الرسائل والروابط بينما الإضافة
            توفر طبقة حماية إضافية أثناء التصفح على الكمبيوتر.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 18,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardSub: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  separator: {
    height: 1,
    backgroundColor: "#D1D5DB50",
    marginVertical: 14,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bulletDot: {
    fontSize: 18,
    marginRight: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },

  primaryBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  primaryBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  infoCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    columnGap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
