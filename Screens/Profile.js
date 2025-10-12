import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  TextInput,
  Modal,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { COLORS } from "../util/colors";
import { useTranslation } from "react-i18next";
import { useAppSettings } from "../src/context/AppSettingProvid";
import { supabase } from "../supabase";


export default function Profile() {
  const navigation = useNavigation();
  const { theme, isRTL, language, setLanguage, setThemeMode } = useAppSettings();
  const { t } = useTranslation();

  const [activeScreen, setActiveScreen] = useState("main");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [appPasswordString, setAppPasswordString] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [connectedEmail, setConnectedEmail] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

  // Check for connected email account
  useEffect(() => {
    const checkEmailConnection = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('email_accounts')
            .select('email_address')
            .eq('user_id', user.id)
            .eq('status', 'connected')
            .single();

          if (data && !error) {
            setConnectedEmail(data.email_address);
          } else {
            setConnectedEmail(null);
          }
        }
      } catch (error) {
        console.error('Error checking email connection:', error);
        setConnectedEmail(null);
      }
    };

    checkEmailConnection();
  }, []);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2000);

  const [userData, setUserData] = useState({
    firstName: "Itunuoluwa",
    lastName: "Abidoye",
    username: "@itunuoluwa",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    country: "",
    email: "xxx@gmail.com",
    password: "********",
  });
  const [tempData, setTempData] = useState({ ...userData });

  // ثيم مشتق لنفس أسلوبكم السابق
  const themeStyles = useMemo(() => {
    return {
      backgroundColor: theme.colors.background,
      textColor: theme.colors.text,
      cardBackground: theme.colors.card,
      borderColor: theme.colors.cardBorder,
      inputBackground: theme.mode === "dark" ? "#161b25" : "#fff",
      profileBackground: theme.mode === "dark" ? theme.colors.card : "#797EF6",
      profileText: theme.colors.text,
      profileUsername: theme.mode === "dark" ? theme.colors.subtext : "#b8b8b8ff",
    };
  }, [theme]);

  const styles = createStyles(theme, themeStyles, isRTL);

  const countries = [
    "United States","United Kingdom","Canada","Australia","Germany",
    "France","Saudi Arabia","United Arab Emirates","Egypt","Kuwait",
    "Qatar","Oman","Bahrain","Jordan","Lebanon","Morocco","Tunisia"
  ];
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const genders = [t("male"), t("female"), t("other")];

  const handleSave = () => {
    setUserData({ ...tempData });
    setActiveScreen("main");
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    setActiveScreen("main");
  };

  const handleDateSelect = () => {
    const dateStr = `${selectedDay} ${months[selectedMonth]} ${selectedYear}`;
    setTempData({ ...tempData, dateOfBirth: dateStr });
    setShowDatePickerModal(false);
  };

  const handleCountrySelect = (country) => {
    setTempData({ ...tempData, country });
    setShowCountryModal(false);
  };

  const handleGenderSelect = (gender) => {
    setTempData({ ...tempData, gender });
    setShowGenderModal(false);
  };

  const handleDisconnectEmail = async () => {
    if (!connectedEmail) return;

    setDisconnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('unlink-email', {
        body: { email: connectedEmail }
      });

      if (error) throw error;

      alert('Email disconnected successfully!');
      setConnectedEmail(null);
    } catch (error) {
      alert('Failed to disconnect email: ' + error.message);
    } finally {
      setDisconnecting(false);
    }
  };

  const renderMainScreen = () => (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.purple1} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>{t("profile")}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Section */}
      <View style={[styles.profileSection, { backgroundColor: themeStyles.profileBackground, borderColor: themeStyles.borderColor }]}>
        <Image source={require("../assets/images/Avatar.png")} style={styles.profileImage} />
        <Text style={[styles.profileName, { color: themeStyles.profileText }]}>
          {userData.firstName} {userData.lastName}
        </Text>
        <Text style={[styles.profileUsername, { color: themeStyles.profileUsername }]}>
          {userData.email}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: themeStyles.borderColor }]} />

      {/* Settings Card */}
      <View style={[styles.settingsContainer, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
        {/* My Account */}
        <Pressable
          style={styles.settingItem}
          onPress={() => {
            setTempData({ ...userData });
            setActiveScreen("edit");
          }}
        >
          <View style={styles.settingInfo}>
            <Image source={require("../assets/icons/account.png")} style={{ width: 58, height: 58 }} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: themeStyles.textColor }]}>{t("myAccount")}</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>{t("accountDesc")}</Text>
            </View>
          </View>
          <Ionicons
            name={isRTL ? "arrow-back" : "arrow-forward"}
            size={20}
            color={theme.colors.subtext}
          />
        </Pressable>

        {/* Language */}
        <Pressable style={styles.settingItem} onPress={() => setShowLanguageModal(true)}>
          <View style={styles.settingInfo}>
            <Image source={require("../assets/icons/language.png")} style={{ width: 58, height: 58 }} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: themeStyles.textColor }]}>{t("language")}</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>{t("languageDesc")}</Text>
            </View>
          </View>
          <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={20} color={theme.colors.subtext} />
        </Pressable>

        {/* Dark Mode */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Image source={require("../assets/icons/dark-mode.png")} style={{ width: 58, height: 58 }} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: themeStyles.textColor }]}>{t("darkMode")}</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>{t("darkModeDesc")}</Text>
            </View>
          </View>
          <Switch
            value={theme.mode === "dark"}
            onValueChange={(val) => setThemeMode(val ? "dark" : "light")}
            trackColor={{ false: COLORS.gray1, true: COLORS.purple1 }}
            thumbColor={theme.mode === "dark" ? COLORS.purple1 : "#ffffff"}
          />
        </View>

{/* Settings */}
<Pressable
  style={styles.settingItem}
  onPress={() => navigation.navigate('Settings')}  
>
  <View style={styles.settingInfo}>
    <Image source={require("../assets/icons/settings.png")} style={{ width: 58, height: 58 }} />
    <View style={styles.settingTextContainer}>
      <Text style={[styles.settingTitle, { color: themeStyles.textColor }]}>{t("settings")}</Text>
      <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>{t("settingsDesc")}</Text>
    </View>
  </View>
  <Ionicons
    name={isRTL ? "arrow-back" : "arrow-forward"}
    size={20}
    color={theme.colors.subtext}
  />
</Pressable>

        {/* Email Scanning */}
        <Pressable style={styles.settingItem} onPress={() => {
          if (connectedEmail) {
            // Show disconnect confirmation
            Alert.alert(
              'Disconnect Email',
              `Disconnect ${connectedEmail} from scam scanning?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Disconnect',
                  style: 'destructive',
                  onPress: handleDisconnectEmail
                }
              ]
            );
          } else {
            // Show connect modal
            setShowEmailModal(true);
          }
        }}>
           {/* Email     connection */}
          <View style={styles.settingInfo}>
           <Image
             source={require("../assets/icons/Email.png")}
               style={styles.emailIconAligned} 
           />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: themeStyles.textColor }]}>
                {connectedEmail ? 'Email' : 'Email Scanning'}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>
                {connectedEmail ? 'connected for scanning' : 'connect your email to scan'}
              </Text>
            </View>
          </View>
          <Ionicons
            name={connectedEmail ? "checkmark-circle" : (isRTL ? "arrow-back" : "arrow-forward")}
            size={20}
            color={connectedEmail ? '#4CAF50' : theme.colors.subtext}
          />
        </Pressable>

        {/* Privacy */}
        <Pressable style={styles.settingItem} onPress={() => setActiveScreen("privacy")}>
          <View style={styles.settingInfo}>
            <Image source={require("../assets/icons/privacy.png")} style={{ width: 58, height: 58 }} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: themeStyles.textColor }]}>{t("privacy")}</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.subtext }]}>{t("privacyDesc")}</Text>
            </View>
          </View>
          <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={20} color={theme.colors.subtext} />
        </Pressable>
      </View>

      <View style={[styles.divider, { backgroundColor: themeStyles.borderColor }]} />

      <View style={[styles.settingsContainer, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
        <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>More</Text>
      </View>
    </ScrollView>
  );

  const renderEditScreen = () => (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => setActiveScreen("main")}>
          <Ionicons name="arrow-back" size={24} color={COLORS.purple8} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: themeStyles.textColor }]}>{t("editProfile")}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Info */}
      <View style={[styles.profileSection, { backgroundColor: themeStyles.profileBackground, borderColor: themeStyles.borderColor }]}>
        <Image source={require("../assets/images/Avatar.png")} style={styles.profileImage} />
        <Text style={[styles.profileName, { color: themeStyles.profileText }]}>
          {tempData.firstName} {tempData.lastName}
        </Text>
        <Text style={[styles.profileUsername, { color: themeStyles.profileUsername }]}>
          {tempData.username}
        </Text>
      </View>

      {/* Form */}
      <View style={[styles.formContainer, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
        <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>{t("First Name")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
          value={tempData.firstName}
          onChangeText={(text) => setTempData({ ...tempData, firstName: text })}
          textAlign={isRTL ? "right" : "left"}
          placeholder={t("firstNamePlaceholder")}
          placeholderTextColor={theme.colors.subtext}
        />

        <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>{t("Last Name")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
          value={tempData.lastName}
          onChangeText={(text) => setTempData({ ...tempData, lastName: text })}
          textAlign={isRTL ? "right" : "left"}
          placeholder={t("lastNamePlaceholder")}
          placeholderTextColor={theme.colors.subtext}
        />

        <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>{t("Gender")}</Text>
        <Pressable
          style={[styles.input, { backgroundColor: themeStyles.inputBackground, justifyContent: "center" }]}
          onPress={() => setShowGenderModal(true)}
        >
          <Text
            style={[
              tempData.gender ? { color: themeStyles.textColor } : { color: theme.colors.subtext },
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {tempData.gender || t("selectGender")}
          </Text>
        </Pressable>

        <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>{t("Date Of Birth")}</Text>
        <Pressable style={[styles.input, { backgroundColor: themeStyles.inputBackground }]} onPress={() => setShowDatePickerModal(true)}>
          <Text
            style={[
              tempData.dateOfBirth ? { color: themeStyles.textColor } : { color: theme.colors.subtext },
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {tempData.dateOfBirth || t("selectDate")}
          </Text>
        </Pressable>

        <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>{t("Phone Number")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
          value={tempData.phoneNumber || ""}
          onChangeText={(text) => setTempData({ ...tempData, phoneNumber: text })}
          textAlign={isRTL ? "right" : "left"}
          placeholder="Enter your phone number"
          placeholderTextColor={theme.colors.subtext}
          keyboardType="phone-pad"
        />

        <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>{t("Email")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
          value={tempData.email || ""}
          onChangeText={(text) => setTempData({ ...tempData, email: text })}
          textAlign={isRTL ? "right" : "left"}
          placeholder="Enter your email"
          placeholderTextColor={theme.colors.subtext}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>{t("Password")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
          value={tempData.password || ""}
          onChangeText={(text) => setTempData({ ...tempData, password: text })}
          textAlign={isRTL ? "right" : "left"}
          placeholder="Enter your password"
          placeholderTextColor={theme.colors.subtext}
          secureTextEntry
        />

        <View style={styles.buttonRow}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
          </Pressable>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t("save")}</Text>
          </Pressable>
        </View>
      </View>

      {/* Date Picker Modal */}
      <Modal visible={showDatePickerModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: themeStyles.textColor }]}>{t("selectDob")}</Text>

            <View style={styles.datePickerContainer}>
              <ScrollView style={styles.pickerColumn}>
                {days.map((day) => (
                  <Pressable
                    key={day}
                    style={[styles.pickerOption, selectedDay === day && styles.selectedPickerOption]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[styles.pickerOptionText, selectedDay === day && styles.selectedPickerOptionText]}>
                      {day}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <ScrollView style={styles.pickerColumn}>
                {months.map((month, index) => (
                  <Pressable
                    key={month}
                    style={[styles.pickerOption, selectedMonth === index && styles.selectedPickerOption]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    <Text style={[styles.pickerOptionText, selectedMonth === index && styles.selectedPickerOptionText]}>
                      {month}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <ScrollView style={styles.pickerColumn}>
                {years.map((year) => (
                  <Pressable
                    key={year}
                    style={[styles.pickerOption, selectedYear === year && styles.selectedPickerOption]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[styles.pickerOptionText, selectedYear === year && styles.selectedPickerOptionText]}>
                      {year}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setShowDatePickerModal(false)}>
                <Text style={styles.modalButtonText}>{t("cancel")}</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleDateSelect}>
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>{t("selectDate")}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Country Selection Modal */}
      <Modal visible={showCountryModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: themeStyles.textColor }]}>{t("selectCountry")}</Text>

            <ScrollView style={styles.optionsScroll}>
              {countries.map((country, index) => (
                <Pressable key={index} style={styles.option} onPress={() => handleCountrySelect(country)}>
                  <Text style={[styles.optionText, { color: themeStyles.textColor }]}>{country}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable style={styles.closeButton} onPress={() => setShowCountryModal(false)}>
              <Text style={styles.closeButtonText}>{t("close")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Gender Selection Modal */}
      <Modal visible={showGenderModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: themeStyles.textColor }]}>{t("selectGender")}</Text>

            {genders.map((gender, index) => (
              <Pressable key={index} style={styles.option} onPress={() => handleGenderSelect(gender)}>
                <Text style={[styles.optionText, { color: themeStyles.textColor }]}>{gender}</Text>
              </Pressable>
            ))}

            <Pressable style={styles.closeButton} onPress={() => setShowGenderModal(false)}>
              <Text style={styles.closeButtonText}>{t("close")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={{ height: 120 }} />
    </ScrollView>
  );

 const renderPrivacyPolicyScreen = () => (
  <View style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <Pressable onPress={() => setActiveScreen("main")}>
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={COLORS.purple1} 
          style={isRTL && {transform: [{scaleX: -1}]}}
        />
      </Pressable>
      <Text style={styles.headerTitle}>{t.privacy}</Text>
      <View style={{width: 24}} />
    </View>

    {/* Content */}
    <ScrollView style={styles.privacyContent}>
      <Text style={styles.privacyTitle}>Privacy Policy for KnightHoot</Text>

      <Text style={styles.privacyParagraph}>
        Last Updated: [September 2025]
      </Text>

      <Text style={styles.privacyParagraph}>
        KnightHoot is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our app, KnightHoot, which helps protect users from scams through email, calls, SMS, and URLs.
      </Text>

      <Text style={styles.privacySubtitle}>1. Information We Collect</Text>
      <Text style={styles.privacyParagraph}>
        We may collect the following information: First name, last name, email address, phone number, gender, device type (personal or family member), scam alerts, reports, and keywords detected in calls for scam detection purposes.
      </Text>

      <Text style={styles.privacySubtitle}>2. How We Use Your Information</Text>
      <Text style={styles.privacyParagraph}>
        We use your information to detect and alert you about potential scams, block suspicious URLs (if you enable it), store and display scam alert history, improve the app’s features, and allow you to manage multiple devices and family members.
      </Text>

      <Text style={styles.privacySubtitle}>3. Permissions and Actions</Text>
      <Text style={styles.privacyParagraph}>
        KnightHoot may require permissions to monitor calls for scam keywords and block unsafe URLs. You can choose between Alert Mode (only alerts) and Action Mode (blocking URLs with permission).
      </Text>

      <Text style={styles.privacySubtitle}>4. Data Storage and Management</Text>
      <Text style={styles.privacyParagraph}>
        If you allow data storage, it will be used for scam detection and improving the app. You can delete your data or account anytime in the settings.
      </Text>

      <Text style={styles.privacySubtitle}>5. Family Member Devices</Text>
      <Text style={styles.privacyParagraph}>
        When you add family members, you can manage their devices and receive scam alerts relevant to them.
      </Text>

      <Text style={styles.privacySubtitle}>6. Your Privacy Choices</Text>
      <Text style={styles.privacyParagraph}>
        You can manage or delete your personal data and control permissions such as call monitoring and URL blocking at any time.
      </Text>

      <Text style={styles.privacySubtitle}>7. Security</Text>
      <Text style={styles.privacyParagraph}>
        We apply reasonable security measures to protect your personal data, but no system can be completely secure.
      </Text>

      <Text style={styles.privacySubtitle}>8. Children’s Privacy</Text>
      <Text style={styles.privacyParagraph}>
        KnightHoot is not intended for children under 13. If we learn we collected information from a child, we will delete it.
      </Text>

      <Text style={styles.privacySubtitle}>9. Changes to This Policy</Text>
      <Text style={styles.privacyParagraph}>
        We may update this Privacy Policy from time to time. Any changes will be reflected in the app with the updated date shown above.
      </Text>

      <Text style={styles.privacySubtitle}>10. Contact Us</Text>
      <Text style={styles.privacyParagraph}>
        If you have questions about this Privacy Policy, please contact us.
      </Text>

      <View style={{height: 120}} />
    </ScrollView>
  </View>
);
  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      {activeScreen === "main" && renderMainScreen()}
      {activeScreen === "edit" && renderEditScreen()}
      {activeScreen === "privacy" && renderPrivacyPolicyScreen()}
      {renderLanguageModal()}
      {renderEmailModal()}
    </View>
  );

  // Email connection logic (moved inline to avoid function reference issues)

  // Language Modal
  function renderLanguageModal() {
    return (
      <Modal visible={showLanguageModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: themeStyles.textColor }]}>{t("selectLanguage")}</Text>

            <Pressable style={styles.option} onPress={() => { setLanguage("en"); setShowLanguageModal(false); }}>
              <Text style={[styles.optionText, { color: themeStyles.textColor }]}>{t("english")}</Text>
            </Pressable>

            <Pressable style={styles.option} onPress={() => { setLanguage("ar"); setShowLanguageModal(false); }}>
              <Text style={[styles.optionText, { color: themeStyles.textColor }]}>{t("arabic")}</Text>
            </Pressable>

            <Pressable style={styles.closeButton} onPress={() => setShowLanguageModal(false)}>
              <Text style={styles.closeButtonText}>{t("close")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  function renderEmailModal() {
    return (
      <Modal visible={showEmailModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: themeStyles.textColor }]}>Connect Email for Scanning</Text>

            <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.subtext}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={[styles.formLabel, { color: themeStyles.textColor }]}>App Password</Text>
          
            <TextInput
              style={[
                styles.singleInput,
                {
                  backgroundColor: themeStyles.inputBackground,
                  color: themeStyles.textColor,
                  borderColor: appPasswordString.length === 16
                    ? '#4CAF50'
                    : appPasswordString.length > 0
                    ? COLORS.purple1
                    : theme.colors.cardBorder,
                },
              ]}
              value={appPasswordString}
              onChangeText={(text) => {
                const cleanText = text.replace(/\s+/g, '').toLowerCase().slice(0, 16);
                setAppPasswordString(cleanText);
                setPasswordError('');
              }}
              placeholder="Enter 16-character app password"
              placeholderTextColor={theme.colors.subtext}
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry
              maxLength={16}
            />

            {/* Error Message */}
            {passwordError ? (
              <Text style={[styles.errorText, { color: '#F44336' }]}>
                {passwordError}
              </Text>
            ) : null}

            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.cancelButton, { flex: 1 }]}
                onPress={() => {
                  setShowEmailModal(false);
                  setEmailInput('');
                  setAppPasswordString('');
                  setPasswordError('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.saveButton,
                  { flex: 1 },
                  connecting && { opacity: 0.5 },
                  appPasswordString.length === 16 && !connecting && {
                    backgroundColor: '#4CAF50',
                    shadowColor: '#4CAF50',
                  }
                ]}
                onPress={async () => {
                  const appPassword = appPasswordString;

                  if (!emailInput.trim()) {
                    setPasswordError('Please enter your email address');
                    return;
                  }
                  if (appPassword.length !== 16) {
                    setPasswordError('Please enter exactly 16 characters for your app password');
                    return;
                  }

                  setConnecting(true);
                  setPasswordError('');
                  try {
                    const { data, error } = await supabase.functions.invoke('register-email', {
                      body: { email: emailInput.trim(), appPassword: appPassword }
                    });

                    if (error) throw error;

                    alert('Email connected successfully!');
                    setConnectedEmail(emailInput.trim());
                    setShowEmailModal(false);
                    setEmailInput('');
                    setAppPasswordString('');
                  } catch (error) {
                    setPasswordError('Failed to connect email: ' + error.message);
                  } finally {
                    setConnecting(false);
                  }
                }}
                disabled={connecting}
              >
                <Text style={styles.saveButtonText}>
                  {connecting ? 'Connecting...' : 'Connect'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const createStyles = (theme, themeStyles, isRTL) =>
  StyleSheet.create({
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
    profileSection: {
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      alignItems: "center",
      shadowColor: "#797EF6",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    profileName: {
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 4,
      color: theme.colors.text,
    },
    profileUsername: {
      fontSize: 16,
      marginBottom: 16,
      color: theme.colors.subtext,
    },
    divider: {
      height: 1,
      marginVertical: 16,
      backgroundColor: theme.colors.cardBorder,
    },
    settingsContainer: {
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 16,
      color: theme.colors.text,
    },
    settingItem: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    settingInfo: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      flex: 1,
      gap: 12,
    },
    settingTextContainer: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 4,
      paddingHorizontal: 16,
      color: theme.colors.text,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    settingDescription: {
      fontSize: 14,
      paddingHorizontal: 16,
      color: theme.colors.subtext,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    formContainer: {
      borderRadius: 16,
      padding: 24,
      marginHorizontal: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    formLabel: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 16,
      textAlign: isRTL ? "right" : "left",
      color: theme.colors.text,
    },
    input: {
      borderWidth: 2,
      borderColor: COLORS.purple2,
      borderRadius: 16,
      padding: 16,
      fontSize: 18,
      color: theme.colors.text,
      backgroundColor: themeStyles.inputBackground,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    // Password input styles
    helperText: {
      fontSize: 14,
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },
    singleInput: {
      borderWidth: 2,
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      textAlign: isRTL ? "right" : "left",
      minHeight: 50,
    },
    errorText: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 8,
      fontWeight: '500',
    },
    buttonRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginTop: 24,
    },
    cancelButton: {
      flex: 1,
      borderWidth: 2,
      borderColor: COLORS.purple2,
      paddingVertical: 16,
      borderRadius: 16,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
      alignItems: "center",
      backgroundColor: theme.colors.card,
    },
    cancelButtonText: {
      fontWeight: "500",
      fontSize: 16,
      color: theme.colors.text,
    },
    saveButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 16,
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
      alignItems: "center",
      backgroundColor: theme.colors.primary,
    },
    saveButtonText: {
      color: theme.colors.primaryTextOn,
      fontWeight: "500",
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    modalContent: {
      borderRadius: 16,
      padding: 24,
      width: "86%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      textAlign: "center",
      color: theme.colors.text,
    },
    option: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.cardBorder,
    },
    optionText: {
      fontSize: 16,
      textAlign: isRTL ? "right" : "left",
      color: theme.colors.text,
    },
    closeButton: {
      marginTop: 16,
      padding: 16,
      alignItems: "center",
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.primary,
    },
    datePickerContainer: {
      flexDirection: "row",
      height: 200,
      marginVertical: 16,
    },
    pickerColumn: {
      flex: 1,
    },
    pickerOption: {
      padding: 10,
      alignItems: "center",
    },
    selectedPickerOption: {
      backgroundColor: COLORS.purple1,
      borderRadius: 8,
    },
    pickerOptionText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    selectedPickerOptionText: {
      color: "#fff",
      fontWeight: "bold",
    },
    modalButtons: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      alignItems: "center",
      borderRadius: 8,
      marginHorizontal: 8,
      backgroundColor: theme.colors.subtext,
    },
    modalButtonPrimary: {
      backgroundColor: COLORS.purple1,
    },
    modalButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    modalButtonPrimaryText: {
      color: "#fff",
    },
    optionsScroll: {
      maxHeight: 300,
      width: "100%",
    },
    privacyContent: {
      padding: 20,
    },
    privacyTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.colors.text,
      
    },
    privacyParagraph: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 16,
      color: theme.colors.text,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
     emailIconAligned: {
      width: 50,
      height: 50,
      marginHorizontal: 4, 
      alignSelf: 'center', 
    },
  });

