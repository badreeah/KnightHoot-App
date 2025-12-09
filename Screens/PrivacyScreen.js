// PrivacyScreen.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { COLORS } from "../util/colors";

export default function PrivacyScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme, isRTL } = useAppSettings();

  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons
            name={"arrow-back"}
            size={24}
            color={COLORS.purple1}
          />
        </Pressable>

        <Text style={styles.headerTitle}>{t("privacy.title")}</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.privacyContent}>
        <Text style={styles.privacyTitle}>{t("privacy.heading")}</Text>

        <Text style={styles.privacyParagraph}>
          {t("privacy.lastUpdated")}
        </Text>

        <Text style={styles.privacyParagraph}>
          {t("privacy.intro")}
        </Text>

        <Text style={styles.privacySubtitle}>{t("privacy.section1.title")}</Text>
        <Text style={styles.privacyParagraph}>
          {t("privacy.section1.text")}
        </Text>

        <Text style={styles.privacySubtitle}>{t("privacy.section2.title")}</Text>
        <Text style={styles.privacyParagraph}>
          {t("privacy.section2.text")}
        </Text>

        <Text style={styles.privacySubtitle}>{t("privacy.section3.title")}</Text>
        <Text style={styles.privacyParagraph}>
          {t("privacy.section3.text")}
        </Text>

        <Text style={styles.privacySubtitle}>{t("privacy.section4.title")}</Text>
        <Text style={styles.privacyParagraph}>
          {t("privacy.section4.text")}
        </Text>

        <Text style={styles.privacySubtitle}>{t("privacy.section5.title")}</Text>
        <Text style={styles.privacyParagraph}>
          {t("privacy.section5.text")}
        </Text>

        <Text style={styles.privacySubtitle}>{t("privacy.section6.title")}</Text>
        <Text style={styles.privacyParagraph}>
          {t("privacy.section6.text")}
        </Text>

        <Text style={styles.privacySubtitle}>{t("privacy.section7.title")}</Text>
        <Text style={styles.privacyParagraph}>
          {t("privacy.section7.text")}
        </Text>

        <Text style={styles.privacySubtitle}>{t("privacy.section8.title")}</Text>
        <Text style={styles.privacyParagraph}>
          {t("privacy.section8.text")}
        </Text>

        <Text style={styles.privacySubtitle}>{t("privacy.section9.title")}</Text>
        <Text style={styles.privacyParagraph}>
          {t("privacy.section9.text")}
        </Text>

        <Text style={styles.privacySubtitle}>{t("privacy.section10.title")}</Text>
        <Text style={styles.privacyParagraph}>
          {t("privacy.section10.text")}
        </Text>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function createStyles(theme, isRTL) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 10,
    },
    header: {
      flexDirection:  "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 30,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
    },
    privacyContent: { padding: 20 },
    privacyTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.colors.text,
      textAlign: isRTL ? "right" : "left",
    },
    privacySubtitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 12,
      color: theme.colors.text,
      textAlign: isRTL ? "right" : "left",
    },
    privacyParagraph: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 16,
      color: theme.colors.text,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
  });
}
