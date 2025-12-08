import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../util/colors";
import { useAppSettings } from "../src/context/AppSettingProvid"; // [theme][rtl]
import { useTranslation } from "react-i18next"; // [i18n]
import { supabase } from "../supabase";

const scamTypes = [
  { id: "calls", name: "Calls", icon: "call-outline" },
  { id: "messages", name: "Messages", icon: "chatbubble-ellipses-outline" },
  { id: "email", name: "Email", icon: "mail-outline" },
  { id: "web", name: "Web", icon: "globe-outline" },
];

export default function ReportScam({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    description: "",
    sender: "",
    msgContent: "",
    email: "",
    emailSubject: "",
    url: "",
    webDescription: "",
  });

  const { theme, isRTL } = useAppSettings(); // [theme][rtl]
  const { t } = useTranslation(); // [i18n]

  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]); // dynamic styles

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigation.goBack();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigation]);

  // استقبال البيانات من SafeBrowsing (selectedCategory = "web", url, description)
  useEffect(() => {
    if (navigation?.getState) {
      const params = navigation.getState().routes.slice(-1)[0]?.params;

      if (params?.selectedCategory === "web") {
        setSelectedCategory("web");
        setFormData((prev) => ({
          ...prev,
          url: params.url || "",
          webDescription: params.description || "",
        }));
      }
    }
  }, [navigation]);

  const validateForm = () => {
    switch (selectedCategory) {
      case "calls":
        if (!formData.phone.trim()) {
          Alert.alert(
            t("error", "Error"),
            t("phoneRequired", "Phone number is required")
          );
          return false;
        }
        if (!formData.description.trim()) {
          Alert.alert(
            t("error", "Error"),
            t("descriptionRequired", "Description is required")
          );
          return false;
        }
        break;
      case "messages":
        if (!formData.sender.trim()) {
          Alert.alert(
            t("error", "Error"),
            t("senderRequired", "Sender is required")
          );
          return false;
        }
        if (!formData.msgContent.trim()) {
          Alert.alert(
            t("error", "Error"),
            t("msgContentRequired", "Message content is required")
          );
          return false;
        }
        break;
      case "email":
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
          Alert.alert(
            t("error", "Error"),
            t("validEmailRequired", "Valid email is required")
          );
          return false;
        }
        break;
      case "web":
        if (!formData.url.trim() || !/^https?:\/\/.+/.test(formData.url)) {
          Alert.alert(
            t("error", "Error"),
            t("validUrlRequired", "Valid URL is required")
          );
          return false;
        }
        if (!formData.webDescription.trim()) {
          Alert.alert(
            t("error", "Error"),
            t("descriptionRequired", "Description is required")
          );
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  };

  const getDescription = () => {
    switch (selectedCategory) {
      case "calls":
        return `Phone: ${formData.phone}\nDescription: ${formData.description}`;
      case "messages":
        return `Sender: ${formData.sender}\nMessage: ${formData.msgContent}`;
      case "email":
        return `Email: ${formData.email}\nSubject: ${
          formData.emailSubject || "N/A"
        }`;
      case "web":
        return `URL: ${formData.url}\nDescription: ${formData.webDescription}`;
      default:
        return "";
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const reportData = {
        user_id: user.id,
        scam_type: selectedCategory,
        description: getDescription(),
      };

      const { error } = await supabase
        .from("scam_reports")
        .insert([reportData]);

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting report:", error);
      Alert.alert(
        t("error", "Error"),
        t("submitError", "Failed to submit report. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (selectedCategory) {
      case "calls":
        return (
          <>
            <Text style={styles.inputLabel}>
              {t("reportScam.phone", "Phone Number")}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t(
                "reportScam.phonePh",
                "Enter the suspicious phone number"
              )}
              keyboardType="phone-pad"
              placeholderTextColor={theme.colors.subtext}
              textAlign={isRTL ? "right" : "left"}
              value={formData.phone}
              onChangeText={(value) => updateFormData("phone", value)}
            />
            <Text style={styles.inputLabel}>
              {t("reportScam.description", "Description")}
            </Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder={t(
                "reportScam.callDescPh",
                "Describe what happened during the call"
              )}
              multiline
              placeholderTextColor={theme.colors.subtext}
              textAlign={isRTL ? "right" : "left"}
              value={formData.description}
              onChangeText={(value) => updateFormData("description", value)}
            />
          </>
        );
      case "messages":
        return (
          <>
            <Text style={styles.inputLabel}>
              {t("reportScam.sender", "Sender's Name / Number")}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t(
                "reportScam.senderPh",
                "Enter the sender's name or number"
              )}
              placeholderTextColor={theme.colors.subtext}
              textAlign={isRTL ? "right" : "left"}
              value={formData.sender}
              onChangeText={(value) => updateFormData("sender", value)}
            />
            <Text style={styles.inputLabel}>
              {t("reportScam.msgContent", "Message Content")}
            </Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder={t(
                "reportScam.msgPh",
                "Paste the suspicious message here"
              )}
              multiline
              placeholderTextColor={theme.colors.subtext}
              textAlign={isRTL ? "right" : "left"}
              value={formData.msgContent}
              onChangeText={(value) => updateFormData("msgContent", value)}
            />
          </>
        );
      case "email":
        return (
          <>
            <Text style={styles.inputLabel}>
              {t("reportScam.email", "Sender's Email")}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t(
                "reportScam.emailPh",
                "Enter the sender's email address"
              )}
              keyboardType="email-address"
              placeholderTextColor={theme.colors.subtext}
              textAlign={isRTL ? "right" : "left"}
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
            />
            <Text style={styles.inputLabel}>
              {t("reportScam.emailSubject", "Email Subject")}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t(
                "reportScam.emailSubjectPh",
                "Enter the email subject"
              )}
              placeholderTextColor={theme.colors.subtext}
              textAlign={isRTL ? "right" : "left"}
              value={formData.emailSubject}
              onChangeText={(value) => updateFormData("emailSubject", value)}
            />
          </>
        );
      case "web":
        return (
          <>
            <Text style={styles.inputLabel}>
              {t("reportScam.url", "Website URL")}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com"
              keyboardType="url"
              placeholderTextColor={theme.colors.subtext}
              textAlign={isRTL ? "right" : "left"}
              autoCapitalize="none"
              value={formData.url}
              onChangeText={(value) => updateFormData("url", value)}
            />
            <Text style={styles.inputLabel}>
              {t("reportScam.description", "Description")}
            </Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder={t(
                "reportScam.webDescPh",
                "Describe the fraudulent website"
              )}
              multiline
              placeholderTextColor={theme.colors.subtext}
              textAlign={isRTL ? "right" : "left"}
              value={formData.webDescription}
              onChangeText={(value) => updateFormData("webDescription", value)}
            />
          </>
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <View style={styles.successContainer}>
        <Image
          source={require("../assets/images/check2.png")}
          style={{ width: 144, height: 144 }}
          resizeMode="contain"
        />
        <Text style={styles.successTitle}>
          {t("reportScam.submitted", "Report Submitted!")}
        </Text>
        <Text style={styles.successSubtitle}>
          {t("reportScam.thanks", "Thank you for keeping the community safe")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.purple8} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report a Scam</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.sectionTitle}>
        What type of scam did you encounter?
      </Text>
      <View style={styles.categoryContainer}>
        {scamTypes.map((type) => {
          const label = t(`reportScam.types.${type.id}`, type.id);
          const selected = selectedCategory === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.categoryCard,
                selected && styles.categoryCardSelected,
              ]}
              onPress={() => setSelectedCategory(type.id)}
            >
              <Ionicons
                name={type.icon}
                size={32}
                color={selected ? COLORS.purple1 : theme.colors.text}
              />
              <Text
                style={[
                  styles.categoryText,
                  selected && styles.categoryTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedCategory && (
        <View style={styles.formContainer}>{renderFormFields()}</View>
      )}

      {selectedCategory && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? t("submitting", "Submitting...") : "Submit Report"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// Dynamic styles using theme and RTL
const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 60,
      paddingBottom: 20,
    },
    headerTitle: {
      fontFamily: "Poppins-600",
      fontSize: 20,
      color: theme.colors.text,
    },
    sectionTitle: {
      fontFamily: "Poppins-500",
      fontSize: 18,
      color: theme.colors.text,
      marginBottom: 16,
      marginTop: 16,
      textAlign: isRTL ? "right" : "left",
    },
    categoryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    categoryCard: {
      width: "48%",
      backgroundColor: theme.colors.card,
      padding: 20,
      borderRadius: 16,
      alignItems: "center",
      marginBottom: 16,
      borderWidth: 2,
      borderColor: theme.colors.cardBorder,
    },
    categoryCardSelected: {
      borderColor: COLORS.purple1,
      backgroundColor: "#F3F1FE",
    },
    categoryText: {
      fontFamily: "Poppins-500",
      fontSize: 16,
      color: theme.colors.text,
      marginTop: 8,
      textAlign: "center",
    },
    categoryTextSelected: {
      color: COLORS.purple1,
    },
    formContainer: {
      marginTop: 24,
    },
    inputLabel: {
      fontFamily: "Poppins-500",
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    input: {
      backgroundColor: theme.colors.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      fontSize: 16,
      fontFamily: "Poppins-400",
      marginBottom: 20,
      color: theme.colors.text,
    },
    multilineInput: {
      height: 120,
      textAlignVertical: "top",
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 40,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: theme.colors.primaryTextOn,
      fontSize: 18,
      fontFamily: "Poppins-600",
    },
    successContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    successTitle: {
      fontFamily: "Poppins-600",
      fontSize: 24,
      color: COLORS.purple7,
      marginTop: 24,
    },
    successSubtitle: {
      fontFamily: "Poppins-400",
      fontSize: 16,
      color: theme.colors.text,
      marginTop: 8,
      textAlign: "center",
    },
  });
