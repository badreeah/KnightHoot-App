// Screens/PrivacyScreen.js
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
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.purple1}
            style={isRTL && { transform: [{ scaleX: -1 }] }}
          />
        </Pressable>
        <Text style={styles.headerTitle}>{t("privacy") || "Privacy"}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.privacyContent}>
        <Text style={styles.privacyTitle}>Privacy Policy for KnightHoot</Text>

        <Text style={styles.privacyParagraph}>
          Last Updated: [September 2025]
        </Text>

        <Text style={styles.privacyParagraph}>
          KnightHoot is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, and protect your information when you use
          our app, KnightHoot, which helps protect users from scams through
          email, calls, SMS, and URLs.
        </Text>

        <Text style={styles.privacySubtitle}>1. Information We Collect</Text>
        <Text style={styles.privacyParagraph}>
          We may collect the following information: First name, last name, email
          address, phone number, gender, device type (personal or family member),
          scam alerts, reports, and keywords detected in calls for scam detection
          purposes.
        </Text>

        <Text style={styles.privacySubtitle}>2. How We Use Your Information</Text>
        <Text style={styles.privacyParagraph}>
          We use your information to detect and alert you about potential scams,
          block suspicious URLs (if you enable it), store and display scam alert
          history, improve the app’s features, and allow you to manage multiple
          devices and family members.
        </Text>

        <Text style={styles.privacySubtitle}>3. Permissions and Actions</Text>
        <Text style={styles.privacyParagraph}>
          KnightHoot may require permissions to monitor calls for scam keywords
          and block unsafe URLs. You can choose between Alert Mode (only alerts)
          and Action Mode (blocking URLs with permission).
        </Text>

        <Text style={styles.privacySubtitle}>4. Data Storage and Management</Text>
        <Text style={styles.privacyParagraph}>
          If you allow data storage, it will be used for scam detection and
          improving the app. You can delete your data or account anytime in the
          settings.
        </Text>

        <Text style={styles.privacySubtitle}>5. Family Member Devices</Text>
        <Text style={styles.privacyParagraph}>
          When you add family members, you can manage their devices and receive
          scam alerts relevant to them.
        </Text>

        <Text style={styles.privacySubtitle}>6. Your Privacy Choices</Text>
        <Text style={styles.privacyParagraph}>
          You can manage or delete your personal data and control permissions
          such as call monitoring and URL blocking at any time.
        </Text>

        <Text style={styles.privacySubtitle}>7. Security</Text>
        <Text style={styles.privacyParagraph}>
          We apply reasonable security measures to protect your personal data,
          but no system can be completely secure.
        </Text>

        <Text style={styles.privacySubtitle}>8. Children’s Privacy</Text>
        <Text style={styles.privacyParagraph}>
          KnightHoot is not intended for children under 13. If we learn we
          collected information from a child, we will delete it.
        </Text>

        <Text style={styles.privacySubtitle}>9. Changes to This Policy</Text>
        <Text style={styles.privacyParagraph}>
          We may update this Privacy Policy from time to time. Any changes will
          be reflected in the app with the updated date shown above.
        </Text>

        <Text style={styles.privacySubtitle}>10. Contact Us</Text>
        <Text style={styles.privacyParagraph}>
          If you have questions about this Privacy Policy, please contact us.
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
      flexDirection: isRTL ? "row-reverse" : "row",
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
