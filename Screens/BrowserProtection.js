// Screens/BrowserProtection.js
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
import { useTranslation } from "react-i18next";

const EXTENSION_URL =
  "https://chromewebstore.google.com/detail/EXTENSION_ID";

export default function BrowserProtectionScreen() {
  const nav = useNavigation();
  const { theme, isRTL } = useAppSettings();
  const { t } = useTranslation();

  const openExtensionPage = async () => {
    try {
      const canOpen = await Linking.canOpenURL(EXTENSION_URL);
      if (canOpen) await Linking.openURL(EXTENSION_URL);
    } catch (e) {
      console.log("Error opening extension URL:", e);
    }
  };

  const steps = [
    t("browserProtection.steps.s1"),
    t("browserProtection.steps.s2"),
    t("browserProtection.steps.s3"),
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
            name={ "arrow-back"}
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t("settings.BrowserProtection")}
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

            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              {t("browserProtection.cardTitle")}
            </Text>
          </View>

          <Text
            style={[
              styles.cardSub,
              {
                color: theme.colors.subtext,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {t("browserProtection.cardSubtitle")}
          </Text>

          <View style={styles.separator} />

          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {t("browserProtection.howTitle")}
          </Text>

          <Text
            style={[
              styles.paragraph,
              {
                color: theme.colors.subtext,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {t("browserProtection.howBody")}
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {t("browserProtection.stepsTitle")}
          </Text>

          {steps.map((step, i) => (
            <View
              key={i}
              style={[
                styles.bulletRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Text
                style={[
                  styles.bulletDot,
                  {
                    color: theme.colors.text,
                    marginRight: isRTL ? 0 : 6,
                    marginLeft: isRTL ? 6 : 0,
                  },
                ]}
              >
                •
              </Text>
              <Text
                style={[
                  styles.bulletText,
                  {
                    color: theme.colors.subtext,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
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
              {t("browserProtection.buttonLabel")}
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
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#3B82F6"
          />
          <Text
            style={[
              styles.infoText,
              {
                color: theme.colors.text,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {t("browserProtection.infoText")}
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
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bulletDot: {
    fontSize: 18,
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
