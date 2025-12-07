// TestDataInserter.js - Component to insert test data into database
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { supabase } from '../supabase';
import { useAppSettings } from "../src/context/AppSettingProvid";

const TestDataInserter = ({ navigation }) => {
  const { theme } = useAppSettings();
  const styles = makeStyles(theme);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  const insertSMSTestData = async () => {
    setLoading(true);
    addResult('Inserting SMS test data...', 'info');

    const testSMS = [
      { sender_id: '+966501234567', message_content: 'تحقق من رصيدك الآن! اضغط على الرابط للحصول على جائزة 1000 ريال', classification_response: 'spam', confidence_score: 0.95 },
      { sender_id: '+966507654321', message_content: 'موعد اجتماعك غداً الساعة العاشرة صباحاً في المكتب', classification_response: 'ham', confidence_score: 0.12 },
      { sender_id: '+966555555555', message_content: 'لقد ربحت جائزة كبرى! ارسل معلوماتك البنكية للحصول عليها', classification_response: 'spam', confidence_score: 0.98 },
      { sender_id: '+966509876543', message_content: 'تم تأجيل المحاضرة إلى الأسبوع القادم. شكراً لتفهمكم', classification_response: 'ham', confidence_score: 0.08 },
      { sender_id: 'BANK-ALERT', message_content: 'عزيزي العميل، تم سحب 5000 ريال من حسابك. للاعتراض اتصل فوراً', classification_response: 'spam', confidence_score: 0.88 },
    ];

    try {
      const { data, error } = await supabase
        .from('sms_scans')
        .insert(testSMS.map(sms => ({
          ...sms,
          created_at: new Date().toISOString()
        })));

      if (error) {
        addResult(`❌ Error: ${error.message}`, 'error');
      } else {
        addResult(`✅ Inserted ${testSMS.length} SMS records`, 'success');
      }
    } catch (err) {
      addResult(`❌ Exception: ${err.message}`, 'error');
    }

    setLoading(false);
  };

  const insertEmailTestData = async () => {
    setLoading(true);
    addResult('Inserting Email test data...', 'info');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      addResult('❌ No user logged in', 'error');
      setLoading(false);
      return;
    }

    const testEmails = [
      {
        user_id: user.id,
        message_id: 'msg1',
        subject: 'Congratulations! You won $1,000,000',
        from_address: 'scammer@fake.com',
        snippet: 'Click here to claim your prize',
        scan_score: 0.95,
        is_scam: true
      },
      {
        user_id: user.id,
        message_id: 'msg2',
        subject: 'Meeting reminder for tomorrow',
        from_address: 'colleague@company.com',
        snippet: 'Don\'t forget our meeting at 10 AM',
        scan_score: 0.05,
        is_scam: false
      },
      {
        user_id: user.id,
        message_id: 'msg3',
        subject: 'Urgent: Update your account information',
        from_address: 'noreply@phishing.com',
        snippet: 'Your account will be suspended',
        scan_score: 0.89,
        is_scam: true
      },
    ];

    try {
      const { data, error } = await supabase
        .from('email_scans')
        .insert(testEmails.map(email => ({
          ...email,
          scanned_at: new Date().toISOString()
        })));

      if (error) {
        addResult(`❌ Error: ${error.message}`, 'error');
      } else {
        addResult(`✅ Inserted ${testEmails.length} email records`, 'success');
      }
    } catch (err) {
      addResult(`❌ Exception: ${err.message}`, 'error');
    }

    setLoading(false);
  };

  const insertURLTestData = async () => {
    setLoading(true);
    addResult('Inserting URL test data...', 'info');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      addResult('❌ No user logged in', 'error');
      setLoading(false);
      return;
    }

    const testURLs = [
      {
        user_id: user.id,
        input_url: 'https://phishing-site.com/login',
        domain: 'phishing-site.com',
        path: '/login',
        rating: 'dangerous',
        reason: 'Known phishing domain'
      },
      {
        user_id: user.id,
        input_url: 'https://google.com',
        domain: 'google.com',
        path: '/',
        rating: 'safe',
        reason: 'Trusted domain'
      },
      {
        user_id: user.id,
        input_url: 'https://suspicious-offer.xyz/claim',
        domain: 'suspicious-offer.xyz',
        path: '/claim',
        rating: 'suspicious',
        reason: 'New domain with suspicious patterns'
      },
    ];

    try {
      const { data, error } = await supabase
        .from('safe_url_scans')
        .insert(testURLs.map(url => ({
          ...url,
          created_at: new Date().toISOString()
        })));

      if (error) {
        addResult(`❌ Error: ${error.message}`, 'error');
      } else {
        addResult(`✅ Inserted ${testURLs.length} URL records`, 'success');
      }
    } catch (err) {
      addResult(`❌ Exception: ${err.message}`, 'error');
    }

    setLoading(false);
  };

  const insertPhoneCallTestData = async () => {
    setLoading(true);
    addResult('Inserting Phone Call test data...', 'info');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      addResult('❌ No user logged in', 'error');
      setLoading(false);
      return;
    }

    const testCalls = [
      { user_id: user.id, prediction: 'spam', confidence: 0.92 },
      { user_id: user.id, prediction: 'legitimate', confidence: 0.15 },
      { user_id: user.id, prediction: 'spam', confidence: 0.78 },
      { user_id: user.id, prediction: 'legitimate', confidence: 0.22 },
    ];

    try {
      const { data, error } = await supabase
        .from('PhoneCalls')
        .insert(testCalls.map(call => ({
          ...call,
          created_at: new Date().toISOString()
        })));

      if (error) {
        addResult(`❌ Error: ${error.message}`, 'error');
      } else {
        addResult(`✅ Inserted ${testCalls.length} phone call records`, 'success');
      }
    } catch (err) {
      addResult(`❌ Exception: ${err.message}`, 'error');
    }

    setLoading(false);
  };

  const insertAllTestData = async () => {
    setResults([]);
    await insertSMSTestData();
    await insertEmailTestData();
    await insertURLTestData();
    await insertPhoneCallTestData();
    Alert.alert('Success', 'All test data inserted successfully!');
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Data Inserter</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Use this tool to insert test data into your database tables.
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={insertAllTestData}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Inserting...' : 'Insert All Test Data'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={insertSMSTestData}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Insert SMS Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={insertEmailTestData}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Insert Email Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={insertURLTestData}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Insert URL Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={insertPhoneCallTestData}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Insert Call Data</Text>
          </TouchableOpacity>

          {results.length > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={clearResults}
            >
              <Text style={styles.clearButtonText}>Clear Results</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Results:</Text>
          {results.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultTime}>[{result.time}]</Text>
              <Text style={[
                styles.resultMessage,
                result.type === 'error' && styles.errorText,
                result.type === 'success' && styles.successText,
              ]}>
                {result.message}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 16,
    fontFamily: 'Poppins-600',
    color: theme.colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-600',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-400',
    color: theme.colors.subtext,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  clearButton: {
    backgroundColor: theme.badges.danger,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-600',
    color: theme.colors.primary,
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-600',
    color: '#FFFFFF',
  },
  resultsContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-600',
    color: theme.colors.text,
    marginBottom: 10,
  },
  resultItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
  },
  resultTime: {
    fontSize: 11,
    fontFamily: 'Poppins-400',
    color: theme.colors.subtext,
    marginBottom: 4,
  },
  resultMessage: {
    fontSize: 13,
    fontFamily: 'Poppins-400',
    color: theme.colors.text,
  },
  errorText: {
    color: theme.badges.danger,
    fontFamily: 'Poppins-600',
  },
  successText: {
    color: theme.badges.safe,
    fontFamily: 'Poppins-600',
  },
});

export default TestDataInserter;
