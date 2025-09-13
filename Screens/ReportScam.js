import React, { useState, useEffect } from 'react';
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

const scamTypes = [
  { id: 'calls', name: 'Calls', icon: 'call-outline' },
  { id: 'messages', name: 'Messages', icon: 'chatbubble-ellipses-outline' },
  { id: 'email', name: 'Email', icon: 'mail-outline' },
  { id: 'web', name: 'Web', icon: 'globe-outline' },
];

export default function ReportScam({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="Enter the suspicious phone number" keyboardType="phone-pad" />
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput style={[styles.input, styles.multilineInput]} placeholder="Describe what happened during the call" multiline />
          </>
        );
      case 'messages':
        return (
          <>
            <Text style={styles.inputLabel}>Sender's Name / Number</Text>
            <TextInput style={styles.input} placeholder="Enter the sender's name or number" />
            <Text style={styles.inputLabel}>Message Content</Text>
            <TextInput style={[styles.input, styles.multilineInput]} placeholder="Paste the suspicious message here" multiline />
          </>
        );
      case 'email':
        return (
          <>
            <Text style={styles.inputLabel}>Sender's Email</Text>
            <TextInput style={styles.input} placeholder="Enter the sender's email address" keyboardType="email-address" />
            <Text style={styles.inputLabel}>Email Subject</Text>
            <TextInput style={styles.input} placeholder="Enter the email subject" />
          </>
        );
      case 'web':
        return (
          <>
            <Text style={styles.inputLabel}>Website URL</Text>
            <TextInput style={styles.input} placeholder="https://example.com" keyboardType="url" />
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput style={[styles.input, styles.multilineInput]} placeholder="Describe the fraudulent website" multiline />
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
        <Text style={styles.successTitle}>Report Submitted!</Text>
        <Text style={styles.successSubtitle}>Thank you for keeping the community safe</Text>
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
        {scamTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.categoryCard,
              selectedCategory === type.id && styles.categoryCardSelected,
            ]}
            onPress={() => setSelectedCategory(type.id)}
          >
            <Ionicons
              name={type.icon}
              size={32}
              color={selectedCategory === type.id ? COLORS.purple1 : COLORS.purple8}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === type.id && styles.categoryTextSelected,
              ]}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
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
    backgroundColor: '#F9FAFB',
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
    color: COLORS.purple8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-500',
    fontSize: 18,
    color: COLORS.purple7,
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  categoryCardSelected: {
    borderColor: COLORS.purple1,
    backgroundColor: '#F3F1FE',
  },
  categoryText: {
    fontFamily: 'Poppins-500',
    fontSize: 16,
    color: COLORS.purple8,
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
    color: COLORS.purple8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray1,
    fontSize: 16,
    fontFamily: 'Poppins-400',
    marginBottom: 20,
  },
  multilineInput: {
      height: 120,
      textAlignVertical: 'top',
  },
  submitButton: {
      backgroundColor: COLORS.brightTiffany,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
  },
  submitButtonText: {
      color: 'white',
      fontSize: 18,
      fontFamily: 'Poppins-600',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    color: COLORS.purple8,
    marginTop: 8,
    textAlign: 'center',
  }
});