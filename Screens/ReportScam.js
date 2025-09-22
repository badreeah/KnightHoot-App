import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../util/colors';
import { useAppSettings } from "../src/context/AppSettingProvid"; // [theme][rtl]
import { useTranslation } from "react-i18next";                    // [i18n]

const scamTypes = [
  { id: 'calls', name: 'Calls', icon: 'call-outline' },
  { id: 'messages', name: 'Messages', icon: 'chatbubble-ellipses-outline' },
  { id: 'email', name: 'Email', icon: 'mail-outline' },
  { id: 'web', name: 'Web', icon: 'globe-outline' },
];

export default function ReportScam({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { theme, isRTL } = useAppSettings(); // [theme][rtl]
  const { t } = useTranslation();            // [i18n]
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]); // [theme][rtl]

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigation.goBack();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigation]);

  const handleSubmit = () => {
    console.log('Report Submitted for category:', selectedCategory);
    setIsSubmitted(true);
  };

  const renderFormFields = () => {
    switch (selectedCategory) {
      case 'calls':
        return (
          <>
            <Text style={styles.inputLabel}>{t('reportScam.phone', 'Phone Number')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('reportScam.phonePh', 'Enter the suspicious phone number')}
              keyboardType="phone-pad"
              placeholderTextColor={theme.colors.subtext}   // [theme]
              textAlign={isRTL ? 'right' : 'left'}          // [rtl]
            />
            <Text style={styles.inputLabel}>{t('reportScam.description', 'Description')}</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder={t('reportScam.callDescPh', 'Describe what happened during the call')}
              multiline
              placeholderTextColor={theme.colors.subtext}   // [theme]
              textAlign={isRTL ? 'right' : 'left'}          // [rtl]
            />
          </>
        );
      case 'messages':
        return (
          <>
            <Text style={styles.inputLabel}>{t('reportScam.sender', "Sender's Name / Number")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('reportScam.senderPh', "Enter the sender's name or number")}
              placeholderTextColor={theme.colors.subtext}   // [theme]
              textAlign={isRTL ? 'right' : 'left'}          // [rtl]
            />
            <Text style={styles.inputLabel}>{t('reportScam.msgContent', 'Message Content')}</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder={t('reportScam.msgPh', 'Paste the suspicious message here')}
              multiline
              placeholderTextColor={theme.colors.subtext}   // [theme]
              textAlign={isRTL ? 'right' : 'left'}          // [rtl]
            />
          </>
        );
      case 'email':
        return (
          <>
            <Text style={styles.inputLabel}>{t('reportScam.email', "Sender's Email")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('reportScam.emailPh', "Enter the sender's email address")}
              keyboardType="email-address"
              placeholderTextColor={theme.colors.subtext}   // [theme]
              textAlign={isRTL ? 'right' : 'left'}          // [rtl]
              autoCapitalize="none"
            />
            <Text style={styles.inputLabel}>{t('reportScam.emailSubject', 'Email Subject')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('reportScam.emailSubjectPh', 'Enter the email subject')}
              placeholderTextColor={theme.colors.subtext}   // [theme]
              textAlign={isRTL ? 'right' : 'left'}          // [rtl]
            />
          </>
        );
      case 'web':
        return (
          <>
            <Text style={styles.inputLabel}>{t('reportScam.url', 'Website URL')}</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com"
              keyboardType="url"
              placeholderTextColor={theme.colors.subtext}   // [theme]
              textAlign={isRTL ? 'right' : 'left'}          // [rtl]
              autoCapitalize="none"
            />
            <Text style={styles.inputLabel}>{t('reportScam.description', 'Description')}</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder={t('reportScam.webDescPh', 'Describe the fraudulent website')}
              multiline
              placeholderTextColor={theme.colors.subtext}   // [theme]
              textAlign={isRTL ? 'right' : 'left'}          // [rtl]
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
          source={require('../assets/images/check2.png')} 
          style={{ width: 144, height: 144 }}
          resizeMode="contain"
        />
        <Text style={styles.successTitle}>{t('reportScam.submitted', 'Report Submitted!')}</Text>
        <Text style={styles.successSubtitle}>{t('reportScam.thanks', 'Thank you for keeping the community safe')}</Text>
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

      <Text style={styles.sectionTitle}>What type of scam did you encounter?</Text>
      <View style={styles.categoryContainer}>
        {scamTypes.map((type) => {
          const label = t(`reportScam.types.${type.id}`, type.id); 
          const selected = selectedCategory === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              style={[styles.categoryCard, selected && styles.categoryCardSelected]}
              onPress={() => setSelectedCategory(type.id)}
            >
              <Ionicons
                name={type.icon}
                size={32}
                color={selected ? COLORS.purple1 : theme.colors.text} // [theme]
              />
              <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedCategory && (
        <View style={styles.formContainer}>
            {renderFormFields()}
        </View>
      )}

      {selectedCategory && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, 
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins-600',
    fontSize: 20,
    color: theme.colors.text,
  },
  sectionTitle: {
    fontFamily: 'Poppins-500',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 16,
    marginTop: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: theme.colors.cardBorder,
  },
  categoryCardSelected: {
    borderColor: COLORS.purple1,
    backgroundColor: '#F3F1FE',
  },
  categoryText: {
    fontFamily: 'Poppins-500',
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 8,
  },
  categoryTextSelected: {
    color: COLORS.purple1,
  },
  formContainer: {
    marginTop: 24,
  },
  inputLabel: {
    fontFamily: 'Poppins-500',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    fontSize: 16,
    fontFamily: theme.colors.text,
    marginBottom: 20,
  },
  multilineInput: {
      height: 120,
      textAlignVertical: 'top',
  },
  submitButton: {
      backgroundColor: theme.colors.primary, // [theme]
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
  },
  submitButtonText: {
      color: theme.colors.primaryTextOn, // [theme]
      fontSize: 18,
      fontFamily: 'Poppins-600',
  },
  successContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successTitle: {
    fontFamily: 'Poppins-600',
    fontSize: 24,
    color: COLORS.purple7,
    marginTop: 24,
  },
  successSubtitle: {
    fontFamily: 'Poppins-400',
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 8,
    textAlign: 'center',
  }
});