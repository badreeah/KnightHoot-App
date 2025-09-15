import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  TextInput,
  Modal,
  useColorScheme,
  I18nManager,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from '../util/colors';

export default function Profile() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [language, setLanguage] = useState('en');
  const [activeScreen, setActiveScreen] = useState("main");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
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
    password: "********"
  });
  
  const [tempData, setTempData] = useState({...userData});
  
  // Apply RTL layout when language is Arabic
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(language === 'ar');
  
  // Theme-aware styles
  const themeStyles = useMemo(() => {
    return {
      backgroundColor: isDarkMode ? COLORS.darkBackground : '#F9FAFB',
      textColor: isDarkMode ? COLORS.darkText : COLORS.purple8,
      cardBackground: isDarkMode ? COLORS.darkCard : 'white',
      borderColor: isDarkMode ? COLORS.darkBorder : '#F3F4F6',
      inputBackground: isDarkMode ? COLORS.darkInput : 'white',
      profileBackground: isDarkMode ? COLORS.darkCard : '#797EF6',
      profileText: isDarkMode ? COLORS.darkText : 'white',
      profileUsername: isDarkMode ? COLORS.gray2 : "#b8b8b8ff",
    };
  }, [isDarkMode]);
  
  // Translations
  const translations = {
    en: {
      appName: "KnightHoo",
      profile: "Profile",
      myAccount: "My Account",
      accountDesc: "Make changes to your account",
      language: "Language",
      languageDesc: "Choose your preferred language",
      darkMode: "Dark Mode",
      darkModeDesc: "Manage your device looks",
      settings: "Settings",
      settingsDesc: "Manage your account security",
      privacy: "Privacy Policy",
      privacyDesc: "Learn more about us",
      editProfile: "Edit Profile",
      firstName: "First Name",
      firstNamePlaceholder: "What's your first name?",
      lastName: "Last Name",
      lastNamePlaceholder: "And your last name?",
      selectGender: "Select your gender",
      gender : "Gender",
      dob: "Date of Birth",
      save: "Save Changes",
      cancel: "Cancel",
      close: "Close",
      selectDob: "Select Date of Birth",
      selectLanguage: "Select Language",
      english: "English",
      arabic: "Arabic",
      male: "Male",
      female: "Female",
      other: "Other",
      appearance: "Appearance",
      opacity: "Opacity",
      cornerRadius: "Corner radius",
      typography: "Typography",
      lineHeight: "Line height",
      letterSpacing: "Letter spacing",
      alignment: "Alignment",
      phoneNumber: "Phone number",
      email: "Email",
      password: "Password",
      country: "Country",
      selectCountry: "Select your country",
      selectDate: "Select date"
    },
    ar: {
      appName: "KnightHoo ",
      profile: "الملف الشخصي",
      myAccount: "حسابي",
      accountDesc: "إجراء تغييرات على حسابك",
      language: "اللغة",
      languageDesc: "اختر لغتك المفضلة",
      darkMode: "الوضع الداكن",
      darkModeDesc: "إدارة مظهر جهازك",
      settings: "الإعدادات",
      settingsDesc: "إدارة أمان حسابك",
      privacy: "سياسة الخصوصية",
      privacyDesc: "تعرف علينا أكثر",
      editProfile: "تعديل الملف",
      firstName: "الاسم الأول",
      firstNamePlaceholder: "ما هو اسمك الأول؟",
      lastName: "اسم العائلة",
      lastNamePlaceholder: "ما هو اسم عائلتك؟",
      selectGender: "اختر جنسك",
      gender: "الجنس",
      dob: "تاريخ الميلاد",
      save: "حفظ التغييرات",
      cancel: "إلغاء",
      close: "إغلاق",
      selectDob: "اختر تاريخ الميلاد",
      selectLanguage: "اختر اللغة",
      english: "الإنجليزية",
      arabic: "العربية",
      male: "ذكر",
      female: "أنثى",
      other: "أخرى",
      appearance: "المظهر",
      opacity: "العتامة",
      cornerRadius: "نصف قطر الزاوية",
      typography: "الطباعة",
      lineHeight: "ارتفاع السطر",
      letterSpacing: "تباعد الأحرف",
      alignment: "المحاذاة",
      phoneNumber: "رقم الهاتف",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      country: "الدولة",
      selectCountry: " اختر دولتك",
      selectDate: "اختر التاريخ"
    }
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  // List of countries
  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
    "France", "Saudi Arabia", "United Arab Emirates", "Egypt", "Kuwait",
    "Qatar", "Oman", "Bahrain", "Jordan", "Lebanon", "Morocco", "Tunisia"
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({length: 31}, (_, i) => i + 1);
  const years = Array.from({length: 100}, (_, i) => new Date().getFullYear() - 0 - i); 

  const genders = [t.male, t.female, t.other];

  const formatDate = (date) => {
    if (!date) return "";
    
    const day = date.getDate();
    const month = date.toLocaleString(language, { month: 'long' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  const toggleDarkMode = (value) => {
    setIsDarkMode(value);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageModal(false);
    I18nManager.forceRTL(lang === 'ar');
  };

  const handleSave = () => {
    setUserData({...tempData});
    setActiveScreen("main");
  };

  const handleCancel = () => {
    setTempData({...userData});
    setActiveScreen("main");
  };

  const handleDateSelect = () => {
    const dateStr = `${selectedDay} ${months[selectedMonth]} ${selectedYear}`;
    setTempData({...tempData, dateOfBirth: dateStr});
    setShowDatePickerModal(false);
  };

  const handleCountrySelect = (country) => {
    setTempData({...tempData, country});
    setShowCountryModal(false);
  };

  const handleGenderSelect = (gender) => {
    setTempData({...tempData, gender});
    setShowGenderModal(false);
  };

  const styles = createStyles(themeStyles, isRTL);

  const renderMainScreen = () => (
    <ScrollView style={[styles.container, {backgroundColor: themeStyles.backgroundColor}]}>
      {/* Header with back arrow */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons 
            name={isRTL ? "arrow-forward" : "arrow-back"} 
            size={24} 
            color={COLORS.purple8} 
          />
        </Pressable>
        <Text style={[styles.headerTitle, {color: themeStyles.textColor}]}>{t.profile}</Text>
        <View style={{width: 24}} />
      </View>

      {/* Profile Section with Image */}
      <View style={[styles.profileSection, {backgroundColor: themeStyles.profileBackground}]}>
        <Image 
          source={require("../assets/images/Avatar.png")}
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, {color: themeStyles.profileText}]}>
          {userData.firstName} {userData.lastName}
        </Text>
        <Text style={[styles.profileUsername, {color: themeStyles.profileUsername}]}>
          {userData.email}
        </Text>
      </View>

      <View style={[styles.divider, {backgroundColor: themeStyles.borderColor}]} />

      {/* Account Settings */}
      <View style={[styles.settingsContainer, {backgroundColor: themeStyles.cardBackground}]}>
        {/* My Account Setting */}
        <Pressable 
          style={styles.settingItem}
          onPress={() => {
            setTempData({...userData});
            setActiveScreen("edit");
          }}
        >
          <View style={styles.settingInfo}>
            <Image
              source={require("../assets/icons/account.png")}
              style={{width: 58, height: 58}}
            />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, {color: themeStyles.textColor}]}>{t.myAccount}</Text>
              <Text style={[styles.settingDescription, {color: themeStyles.textColor}]}>{t.accountDesc}</Text>
            </View>
          </View>
          <Ionicons 
            name={isRTL ? "arrow-back" : "arrow-forward"} 
            size={20} 
            color={COLORS.gray2} 
          />
        </Pressable>
        
        {/* Language Setting */}
        <Pressable 
          style={styles.settingItem}
          onPress={() => setShowLanguageModal(true)}
        >
          <View style={styles.settingInfo}>
            <Image
              source={require("../assets/icons/language.png")}
              style={{width: 58, height: 58}}
            />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, {color: themeStyles.textColor}]}>{t.language}</Text>
              <Text style={[styles.settingDescription, {color: themeStyles.textColor}]}>{t.languageDesc}</Text>
            </View>
          </View>
          <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={20} color={COLORS.gray2} /> 
        </Pressable>
        
        {/* Dark Mode Setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Image
              source={require("../assets/icons/dark-mode.png")}
              style={{width: 58, height: 58}}
            />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, {color: themeStyles.textColor}]}>{t.darkMode}</Text>
              <Text style={[styles.settingDescription, {color: themeStyles.textColor}]}>{t.darkModeDesc}</Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: COLORS.gray1, true: COLORS.purple1 }}
            thumbColor={isDarkMode ? COLORS.purple1 : '#ffffff'}
          />
        </View>
        
        {/* Settings */}
        <Pressable style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Image
              source={require("../assets/icons/settings.png")}
              style={{width: 58, height: 58}}
            />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, {color: themeStyles.textColor}]}>{t.settings}</Text>
              <Text style={[styles.settingDescription, {color: themeStyles.textColor}]}>{t.settingsDesc}</Text>
            </View>
          </View>
          <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={20} color={COLORS.gray2} /> 
        </Pressable>
        
        {/* Privacy Policy */}
        <Pressable 
          style={styles.settingItem}
          onPress={() => setActiveScreen("privacy")}
        >
          <View style={styles.settingInfo}>
            <Image
              source={require("../assets/icons/privacy.png")}
              style={{width: 58, height: 58}}
            />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, {color: themeStyles.textColor}]}>{t.privacy}</Text>
              <Text style={[styles.settingDescription, {color: themeStyles.textColor}]}>{t.privacyDesc}</Text>
            </View>
          </View>
          <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={20} color={COLORS.gray2} /> 
        </Pressable>
      </View>

      <View style={[styles.divider, {backgroundColor: themeStyles.borderColor}]} />

      {/* Alignment Settings */}
      <View style={[styles.settingsContainer, {backgroundColor: themeStyles.cardBackground}]}>
        <Text style={[styles.sectionTitle, {color: themeStyles.textColor}]}>More</Text>
      </View>
    </ScrollView>
  );

  const renderEditScreen = () => (
    <ScrollView style={[styles.container, {backgroundColor: themeStyles.backgroundColor}]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable onPress={() => setActiveScreen("main")}>
          <Ionicons 
            name={isRTL ? "arrow-forward" : "arrow-back"} 
            size={24} 
            color={COLORS.purple8} 
          />
        </Pressable>
        <Text style={[styles.headerTitle, {color: themeStyles.textColor}]}>{t.editProfile}</Text>
        <View style={{width: 24}} />
      </View>

      {/* Profile Info with Image */}
      <View style={[styles.profileSection, {backgroundColor: themeStyles.profileBackground}]}>
        <Image 
          source={require("../assets/images/Avatar.png")} 
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, {color: themeStyles.profileText}]}>
          {tempData.firstName} {tempData.lastName}
        </Text>
        <Text style={[styles.profileUsername, {color: themeStyles.profileUsername}]}>
          {tempData.username}
        </Text>
      </View>

      {/* Edit Form */}
      <View style={[styles.formContainer, {backgroundColor: themeStyles.cardBackground}]}>
        <Text style={[styles.formLabel, {color: themeStyles.textColor}]}>{t.firstName}</Text>
        <TextInput
          style={[styles.input, {backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor}]}
          value={tempData.firstName}
          onChangeText={(text) => setTempData({...tempData, firstName: text})}
          textAlign={isRTL ? 'right' : 'left'}
          placeholder={t.firstNamePlaceholder}
          placeholderTextColor={COLORS.gray2}
        />

        <Text style={[styles.formLabel, {color: themeStyles.textColor}]}>{t.lastName}</Text>
        <TextInput
          style={[styles.input, {backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor}]}
          value={tempData.lastName}
          onChangeText={(text) => setTempData({...tempData, lastName: text})}
          textAlign={isRTL ? 'right' : 'left'}
          placeholder={t.lastNamePlaceholder}
          placeholderTextColor={COLORS.gray2}
        />

        <Text style={[styles.formLabel, {color: themeStyles.textColor}]}>{t.gender}</Text>
        <Pressable 
          style={[styles.input, {backgroundColor: themeStyles.inputBackground, justifyContent: 'center'}]}
          onPress={() => setShowGenderModal(true)}
        >
          <Text style={[tempData.gender ? {color: themeStyles.textColor} : {color: COLORS.gray2}, {textAlign: isRTL ? 'right' : 'left'}]}>
            {tempData.gender || t.selectGender}
          </Text>
        </Pressable>
        
        {/* Date of Birth with Calendar Picker */}
        <Text style={[styles.formLabel, {color: themeStyles.textColor}]}>{t.dob}</Text>
        <Pressable 
          style={[styles.input, {backgroundColor: themeStyles.inputBackground}]}
          onPress={() => setShowDatePickerModal(true)}
        >
          <Text style={[tempData.dateOfBirth ? {color: themeStyles.textColor} : {color: COLORS.gray2},
                        {textAlign: isRTL ? 'right' : 'left'}]}>
            {tempData.dateOfBirth || t.selectDate}
          </Text>
        </Pressable> 
        
        {/* Phone Number Field */}
        <Text style={[styles.formLabel, {color: themeStyles.textColor}]}>{t.phoneNumber}</Text>
        <TextInput
          style={[styles.input, {backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor}]}
          value={tempData.phoneNumber || ""}
          onChangeText={(text) => setTempData({...tempData, phoneNumber: text})}
          textAlign={isRTL ? 'right' : 'left'}
          placeholder="Enter your phone number"
          placeholderTextColor={COLORS.gray2}
          keyboardType="phone-pad"
        />
        
        {/* Email Field */}
        <Text style={[styles.formLabel, {color: themeStyles.textColor}]}>{t.email}</Text>
        <TextInput
          style={[styles.input, {backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor}]}
          value={tempData.email || ""}
          onChangeText={(text) => setTempData({...tempData, email: text})}
          textAlign={isRTL ? 'right' : 'left'}
          placeholder="Enter your email"
          placeholderTextColor={COLORS.gray2}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Field */}
        <Text style={[styles.formLabel, {color: themeStyles.textColor}]}>{t.password}</Text>
        <TextInput
          style={[styles.input, {backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor}]}
          value={tempData.password || ""}
          onChangeText={(text) => setTempData({...tempData, password: text})}
          textAlign={isRTL ? 'right' : 'left'}
          placeholder="Enter your password"
          placeholderTextColor={COLORS.gray2}
          secureTextEntry={true}
        />

        <View style={styles.buttonRow}>
          <Pressable 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>{t.cancel}</Text>
          </Pressable>
          <Pressable 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>{t.save}</Text>
          </Pressable>
        </View>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePickerModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {backgroundColor: themeStyles.cardBackground}]}>
            <Text style={[styles.modalTitle, {color: themeStyles.textColor}]}>{t.selectDob}</Text>
            
            <View style={styles.datePickerContainer}>
              {/* Day Picker */}
              <ScrollView style={styles.pickerColumn}>
                {days.map(day => (
                  <Pressable
                    key={day}
                    style={[
                      styles.pickerOption,
                      selectedDay === day && styles.selectedPickerOption
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedDay === day && styles.selectedPickerOptionText
                    ]}>
                      {day}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              
              {/* Month Picker */}
              <ScrollView style={styles.pickerColumn}>
                {months.map((month, index) => (
                  <Pressable
                    key={month}
                    style={[
                      styles.pickerOption,
                      selectedMonth === index && styles.selectedPickerOption
                    ]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedMonth === index && styles.selectedPickerOptionText
                    ]}>
                      {month}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              
              {/* Year Picker */}
              <ScrollView style={styles.pickerColumn}>
                {years.map(year => (
                  <Pressable
                    key={year}
                    style={[
                      styles.pickerOption,
                      selectedYear === year && styles.selectedPickerOption
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedYear === year && styles.selectedPickerOptionText
                    ]}>
                      {year}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButton}
                onPress={() => setShowDatePickerModal(false)}
              >
                <Text style={styles.modalButtonText}>{t.cancel}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleDateSelect}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>{t.selectDate}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Country Selection Modal */}
      <Modal
        visible={showCountryModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {backgroundColor: themeStyles.cardBackground}]}>
            <Text style={[styles.modalTitle, {color: themeStyles.textColor}]}>{t.selectCountry}</Text>
            
            <ScrollView style={styles.optionsScroll}>
              {countries.map((country, index) => (
                <Pressable
                  key={index}
                  style={styles.option}
                  onPress={() => handleCountrySelect(country)}
                >
                  <Text style={[styles.optionText, {color: themeStyles.textColor}]}>{country}</Text>
                </Pressable>
              ))}
            </ScrollView>
            
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowCountryModal(false)}
            >
              <Text style={styles.closeButtonText}>{t.close}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {backgroundColor: themeStyles.cardBackground}]}>
            <Text style={[styles.modalTitle, {color: themeStyles.textColor}]}>{t.selectGender}</Text>
            
            {genders.map((gender, index) => (
              <Pressable
                key={index}
                style={styles.option}
                onPress={() => handleGenderSelect(gender)}
              >
                <Text style={[styles.optionText, {color: themeStyles.textColor}]}>{gender}</Text>
              </Pressable>
            ))}
            
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.closeButtonText}>{t.close}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={{height: 120}} />
    </ScrollView>
  );
  
  // Language Selection Modal
  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, {backgroundColor: themeStyles.cardBackground}]}>
          <Text style={[styles.modalTitle, {color: themeStyles.textColor}]}>{t.selectLanguage}</Text>
          
          <Pressable
            style={styles.option}
            onPress={() => changeLanguage('en')}
          >
            <Text style={[styles.optionText, {color: themeStyles.textColor}]}>{t.english}</Text>
          </Pressable>
          
          <Pressable
            style={styles.option}
            onPress={() => changeLanguage('ar')}
          >
            <Text style={[styles.optionText, {color: themeStyles.textColor}]}>{t.arabic}</Text>
          </Pressable>
          
          <Pressable
            style={styles.closeButton}
            onPress={() => setShowLanguageModal(false)}
          >
            <Text style={styles.closeButtonText}>{t.close}</Text>
          </Pressable>
        </View>
        </View>
    </Modal>
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
        If you have questions about this Privacy Policy, please contact us at: [Insert Email or Website].
      </Text>

      <View style={{height: 120}} />
    </ScrollView>
  </View>
);

  return (
    <View style={[styles.container, {backgroundColor: themeStyles.backgroundColor}]}>
      {activeScreen === "main" && renderMainScreen()}
      {activeScreen === "edit" && renderEditScreen()}
      {activeScreen === "privacy" && renderPrivacyPolicyScreen()}
      {renderLanguageModal()}
    </View>
  );
}

const createStyles = (theme, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', 
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50, 
    paddingBottom: 30,
  },
  backButton: {
    fontSize: 24,
    color: COLORS.purple8,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.purple8
  },
  profileSection: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#797EF6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  settingsContainer: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  settingDescription: {
    fontSize: 14,
    paddingHorizontal: 16,
  },
  formContainer: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    textAlign: isRTL ? 'right' : 'left',
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.purple2,
    borderRadius: 16,
    padding: 16,
    fontSize: 18
  },
  buttonRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
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
  },
  cancelButtonText: {
    fontWeight: "500",
    fontSize: 16,
    color: COLORS.purple8,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    marginLeft: isRTL ? 0 : 8,
    marginRight: isRTL ? 8 : 0,
    alignItems: "center",
    backgroundColor: COLORS.brightTiffany,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: "80%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    textAlign: isRTL ? 'right' : 'left',
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.brightTiffany,
  },
  datePickerContainer: {
    flexDirection: 'row',
    height: 200,
    marginVertical: 16,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerOption: {
    padding: 10,
    alignItems: 'center',
  },
  selectedPickerOption: {
    backgroundColor: COLORS.purple1,
    borderRadius: 8,
  },
  pickerOptionText: {
    fontSize: 16,
    color: COLORS.purple8,
  },
  selectedPickerOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: COLORS.gray2,
  },
  modalButtonPrimary: {
    backgroundColor: COLORS.purple1,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtonPrimaryText: {
    color: 'white',
  },
  optionsScroll: {
    maxHeight: 300,
    width: '100%',
  },
  privacyContent: {
    padding: 20,
  },
  privacyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  privacyParagraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});
