# Testing Guide - How to See Data in ManageAlerts and Statics

## Quick Start - Insert Test Data

### Option 1: Navigate to Test Data Inserter (Recommended)

Add this button somewhere in your app (e.g., in Home.js or Profile.js):

```javascript
<TouchableOpacity
  onPress={() => navigation.navigate('TestDataInserter')}
  style={{ padding: 10, backgroundColor: '#9A9DD7', borderRadius: 8, margin: 10 }}
>
  <Text style={{ color: 'white', textAlign: 'center' }}>Insert Test Data</Text>
</TouchableOpacity>
```

Then:
1. Click the button to navigate to TestDataInserter
2. Click **"Insert All Test Data"**
3. Wait for success messages
4. Navigate to **Manage Alerts** or **Statistics** tab
5. You should see data!

### Option 2: Use SMS Scam Screen

1. Make sure Python API is running (`python python/api.py`)
2. Navigate to SMS Scam screen from Home
3. Click **START**
4. Watch messages being classified and saved
5. Navigate to **Manage Alerts** or **Statistics** tab
6. You should see the SMS data!

### Option 3: Manual Database Insertion via Supabase

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to your project
3. Click **Table Editor** in left sidebar
4. Select `sms_scans` table
5. Click **Insert** → **Insert row**
6. Fill in:
   - sender_id: `+1234567890`
   - message_content: `You won $1000! Click here to claim`
   - classification_response: `spam`
   - confidence_score: `0.95`
   - created_at: `now()`
7. Click **Save**
8. Repeat for more rows
9. Go to ManageAlerts or Statics in your app - data should appear!

---

## What You Should See

### In ManageAlerts Screen:
- **Uncertain Alerts Section**: Low confidence scams or legitimate messages
- **Certain Alerts Section**: High confidence spam messages
- Click on any alert to expand and see Report/Restore buttons
- Yellow icon = Uncertain
- Red icon = Certain/Spam

### In Statics Screen:
- **Source Boxes**:
  - SMS: Count of SMS scans
  - Email: Count of email scans
  - URL: Count of URL scans
  - Calls: Count of phone calls
- **Severity Score**:
  - Low: Scores < 0.4
  - Medium: Scores 0.4-0.7
  - High: Scores > 0.7
- **Risk Activity Chart**: Shows daily/weekly attack counts

---

## Common Issues & Solutions

### Issue: "No uncertain alerts" / "No certain alerts"

**Solution 1:** Insert test data using TestDataInserter
```
navigation.navigate('TestDataInserter')
→ Click "Insert All Test Data"
```

**Solution 2:** Check database directly
- Open Supabase dashboard
- Go to Table Editor → `sms_scans`
- Verify rows exist
- Check `classification_response` column has 'spam' or 'ham'
- Check `confidence_score` is between 0 and 1

**Solution 3:** Check console logs
```javascript
// Add to ManageAlerts.js fetchSMSScans function
console.log('Fetched SMS scans:', scans);
console.log('Uncertain alerts:', uncertain);
console.log('Certain alerts:', certain);
```

### Issue: Statistics showing all zeros

**Solution:** Insert data for all sources:
1. SMS data → `sms_scans` table
2. Email data → `email_scans` table (must include user_id)
3. URL data → `safe_url_scans` table (must include user_id)
4. Call data → `PhoneCalls` table (must include user_id)

Use TestDataInserter to insert all at once!

### Issue: Real-time updates not working

**Solution:** Restart the app completely
- Close app
- Restart
- Data should appear immediately on screen load

---

## Table Requirements

### For `sms_scans`:
```sql
Required columns:
- sender_id (text)
- message_content (text)
- classification_response (text) -- must be 'spam' or 'ham'
- confidence_score (numeric) -- 0.0 to 1.0
- created_at (timestamp)

Note: No user_id column in this table!
```

### For `email_scans`:
```sql
Required columns:
- user_id (uuid) -- IMPORTANT: Must match logged-in user!
- message_id (text)
- subject (text)
- from_address (text)
- scan_score (numeric) -- 0.0 to 1.0
- is_scam (boolean)
- scanned_at (timestamp)
```

### For `safe_url_scans`:
```sql
Required columns:
- user_id (uuid) -- IMPORTANT: Must match logged-in user!
- input_url (text)
- domain (text)
- rating (text) -- 'safe', 'suspicious', or 'dangerous'
- created_at (timestamp)
```

### For `PhoneCalls`:
```sql
Required columns:
- user_id (text) -- IMPORTANT: Must match logged-in user!
- prediction (text) -- 'spam' or 'legitimate'
- confidence (real) -- 0.0 to 1.0
- created_at (timestamp)
```

---

## Sample Test Data

### SMS Test Data (Copy to Supabase SQL Editor):
```sql
INSERT INTO sms_scans (sender_id, message_content, classification_response, confidence_score, created_at)
VALUES
  ('+966501234567', 'تحقق من رصيدك الآن! اضغط على الرابط', 'spam', 0.95, NOW()),
  ('+966507654321', 'موعد اجتماعك غداً الساعة العاشرة', 'ham', 0.12, NOW()),
  ('+966555555555', 'لقد ربحت جائزة كبرى!', 'spam', 0.98, NOW()),
  ('BANK-ALERT', 'تم سحب 5000 ريال من حسابك', 'spam', 0.88, NOW());
```

### Email Test Data (Replace YOUR_USER_ID):
```sql
INSERT INTO email_scans (user_id, message_id, subject, from_address, scan_score, is_scam, scanned_at)
VALUES
  ('YOUR_USER_ID', 'msg1', 'You won $1,000,000', 'scam@fake.com', 0.95, true, NOW()),
  ('YOUR_USER_ID', 'msg2', 'Meeting reminder', 'colleague@work.com', 0.05, false, NOW());
```

### To get YOUR_USER_ID:
```sql
SELECT id FROM auth.users WHERE email = 'your@email.com';
```

---

## Verification Checklist

- [ ] Python API is running at http://192.168.1.140:8000
- [ ] Can access http://192.168.1.140:8000/docs
- [ ] User is logged in (check with console.log)
- [ ] TestDataInserter screen is accessible
- [ ] Test data inserted successfully
- [ ] ManageAlerts shows alerts
- [ ] Statics shows counts in source boxes
- [ ] Statics shows severity scores
- [ ] Statics shows risk activity chart
- [ ] Real-time updates work when adding new data

---

## Debug Commands

Add these to your screens for debugging:

```javascript
// In ManageAlerts.js
console.log('User ID:', userId);
console.log('Uncertain alerts count:', uncertainAlerts.length);
console.log('Certain alerts count:', certainAlerts.length);

// In Statics.js
console.log('User ID:', userId);
console.log('Sources:', sources);
console.log('Severity:', severity);
console.log('Risk data:', riskActivityData);
```

---

## Success Criteria

You'll know it's working when:

1. ✅ ManageAlerts shows at least one alert in either section
2. ✅ Statics shows non-zero counts in source boxes
3. ✅ Statics shows severity distribution
4. ✅ Statics chart shows bar graph with data
5. ✅ Clicking alert in ManageAlerts expands it
6. ✅ Report button works and shows success
7. ✅ Real-time: Adding data in Supabase instantly appears in app
