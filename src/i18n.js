import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Global labels
      selectLanguage: "Select language",
      english: "English",
      arabic: "Arabic",
      close: "Close",

      common: {
        cancel: "Cancel",
        continue: "Continue",
      },

      //------------------------------------------
      // SAFE BROWSING
      //------------------------------------------
      safe: {
        title: "Safe Browsing",
        invalidUrl: "Enter a valid URL to scan",
        scanError: "An error occurred while scanning",
        warnTitle: "Warning: Suspicious Site",
        warnBody:
          "This site is flagged as blocked/phishing. Do you want to continue?",
        openFail: "Could not open the link",
        banner: "This site looks suspicious — proceed with caution",

        checkUrl: "Check URL",
        websiteUrl: "Website URL",
        urlPlaceholder: "https://example.com",

        downloadProtTitle: "File Download Protection",
        downloadProtDesc:
          "Prevents downloading suspicious files or shows a warning",

        websiteRating: "Website Rating",
        lastScan: "Last scan result",
        notScanned: "Not scanned yet",

        tipsTitle: "Browsing Tips",
        tip1: "Make sure you see HTTPS in the address bar",
        tip2: "Don’t enter your data without a clear reason",
        tip3: "Beware of short links or strange domains",

        lastScanTitle: "Last Scan Result",
        domain: "Domain",
        reason: "Reason",

        openLink: "Open Link",
        report: "Report",
        reportSent: "Report sent to the system (Mock)",

        rating: {
          safe: "Safe",
          suspicious: "Suspicious",
          danger: "Danger",
        },
      },

      //------------------------------------------
      // ADD DEVICE
      //------------------------------------------
      addDevice: {
  headerTitle: "Add Device",
  loading: "Loading Devices...",
  defaultName: "New Device",

  emptyTitle: "No devices found",
  emptySubtitle: "You haven't added any devices yet. Start by adding your first device.",
  emptyButton: "Add Device",

  searchPlaceholder: "Search Device",

  filters: {
    all: "All",
    myDevice: "My Device",
    family: "Family",
  },

  form: {
    addTitle: "Add Device",
    editTitle: "Edit Device",
    connected: "• Connected",
    disconnected: "• Disconnected",
    selectType: "Select Type",
    categoryTitle: "Category",
    myDevices: "My Devices",
    family: "Family",
    addNow: "Add Now",
    saveChanges: "Save Changes",
    addNewDevice: "Add New Device",
  },

  types: {
    iphone: "iPhone",
    laptop: "Laptop",
    tablet: "Tablet",
  },

  alerts: {
    selectType: "Please select a device type.",
    notAuthenticated: "User not authenticated. Please log in.",
    toggleFail: "Failed to update device status.",
    deleteFail: "Failed to delete device.",
    saveFailAdd: "Failed to add device. Check RLS policies.",
    saveFailUpdate: "Failed to update device. Check RLS policies.",
  },
},


manageAlerts: {
  headers: {
    sms: "SMS Alerts",
    email: "Email Alerts",
  },

  sections: {
    sms: {
      uncertain: "Uncertain SMS Alerts",
      certain: "Certain SMS Alerts",
    },
    email: {
      uncertain: "Scanned Emails",
      certain: "Suspicious Emails",
    },
  },

  empty: {
    sms: {
      uncertain: "No uncertain SMS alerts.",
      certain: "No certain SMS alerts.",
    },
    email: {
      uncertain: "No scanned email alerts.",
      certain: "No suspicious email alerts.",
    },
  },

  labels: {
    from: "From",
    description: "Description",
  },

  actions: {
    report: "Report",
    unreport: "Unreport",
    restore: "Restore",
  },

  titles: {
    suspiciousSms: "Suspicious SMS Detected!",
    smsScanned: "SMS Scanned",
    suspiciousEmail: "Suspicious Email Detected!",
    emailScanned: "Email Scanned",
  },

  sms: {
    unknownSender: "Unknown Sender",
    senderBlocked: "SMS sender blocked",
    safe: "SMS scanned and safe",
    detectedAt: "Detected at {{time}}",
  },

  email: {
    flagged: "Flagged as potential scam",
    safe: "Scanned and safe",
  },

  alerts: {
    successTitle: "Success",
    errorTitle: "Error",
    fetchSmsError: "Failed to fetch SMS scans.",
    reportSuccess: "{{channel}} reported successfully.",
    reportError: "Failed to report alert.",
    unreportSuccess: "{{channel}} unreported successfully.",
    unreportError: "Failed to unreport alert.",
    restoreSuccess: "Alert dismissed successfully.",
  },

  time: {
    today: "Today",
    yesterday: "Yesterday",
    days: "{{count}} days ago",
    weeks: "{{count}} weeks ago",
    months: "{{count}} months ago",
  },
}
,
      //------------------------------------------
      // REPORT SCAM
      //------------------------------------------
      reportScam: {
        title: "Report a Scam",
        question: "What type of scam did you encounter?",

        phone: "Phone Number",
        phonePh: "Enter the suspicious phone number",

        description: "Description",
        callDescPh: "Describe what happened during the call",

        sender: "Sender's Name / Number",
        senderPh: "Enter the sender's name or number",

        msgContent: "Message Content",
        msgPh: "Paste the suspicious message here",

        email: "Sender's Email",
        emailPh: "Enter the sender's email address",
        emailSubject: "Email Subject",
        emailSubjectPh: "Enter the email subject",

        url: "Website URL",
        webDescPh: "Describe the fraudulent website",

        submit: "Submit Report",
        submitted: "Report Submitted!",
        thanks: "Thank you for keeping the community safe",

        types: {
          calls: "Calls",
          messages: "Messages",
          email: "Email",
          web: "Web",
        },
        submit: "Submit Report",
title: "Report a Scam",
question: "What type of scam did you encounter?",
      },

      //------------------------------------------
      // WELCOME / AUTH
      //------------------------------------------
      welcome: {
        title: "Welcome to KnightHooT",
        signIn: "Sign In",
        signUp: "Sign Up",
        google: "Sign up with Google",
      },

          //------------------------------------------
      // SMS SCAM
      //------------------------------------------
smsScam: {
  header: "KnightHoo",
  title: "SMS Scam",

  apiNotConnected:
    "⚠️ API Server not connected. Please start the Python API server.\n\nTo start the server:\n1. Navigate to the python folder\n2. Run: python api.py\n3. Update API_BASE_URL with your IP",

  waitingScan: "Press START to begin monitoring SMS messages for scam detection.",
  monitoring: "Monitoring incoming messages... Awaiting classification of new SMS content.",

  startSuccess: "SMS scanning started successfully",
  stopSuccess: "SMS scanning stopped",

  connectionErrorTitle: "Connection Error",
  connectionErrorBody:
    "Unable to connect to the API server. Please ensure the Python API is running.",

  errorGeneric: "Error",
  failStop: "Failed to stop scanning",

  allScanned: "🔄 All messages scanned. Restarting from beginning...",
  newSMS: "New SMS from",
  classificationError: "❌ Classification error. Check API connection.",

  start: "START",
  stop: "STOP",
},
      //------------------------------------------
      // HOME SCREEN
      //------------------------------------------
      home: {
  hello: "Hello, {{name}}",
  glad: "Glad to see you!",
  covered: "We’ve got you covered",
  tipsHeader: "Today’s Smart Tips",
  safetyKit: "Your Safety Kit",
  analyzeCall: "Analyze Call",
  safeBrowsing: "Safe Browsing",
  reportScam: "Report Scam",
  smsScam: "SMS Scam",
   tips: {
    thinkTitle: "Think Before You Share",
    thinkBody:
      "Avoid giving out passwords or ID numbers over the phone, even if the caller appears to be trustworthy.",
    pauseTitle: "Pause Before You Click",
    pauseBody:
      "Always check links, scam links may look genuine but can direct you to harmful websites.",
    urgencyTitle: "Don’t Trust Urgency",
    urgencyBody:
      "Scammers use pressure tactics like 'Act now!' — pause and think before you respond.",
  },
},settings: {
  title: "Settings",

  accountSecurity: "Account & Security",
  changePassword: "Change Password",
  changeEmail: "Change Email",

  accountActions: "Account Actions",
  logout: "Log Out",
  deleteAccount: "Delete Account",

  about: "About",
  privacy: "Privacy Policy",
  contactSupport: "Contact Support",
  rateApp: "Rate KnightHoot",
  versionLabel: "Version",

  delete: {
    title: "Delete Account",
    message: "Are you sure? This action is permanent.",
    cancel: "Cancel",
    confirm: "Delete",
  },

  errors: {
    title: "Error",
    logoutFail: "Failed to log out: {{message}}",
    userNotFound: "User not found.",
    generic: "Something went wrong: {{message}}",
    emailApp: "Unable to open email app.",
    openLink: "Unable to open the link.",
  },
}
,password: {
  title: "Change Password",

  current: "Current Password",
  new: "New Password",
  confirm: "Confirm New Password",

  placeholders: {
    current: "Enter your current password",
    new: "Enter your new password",
    confirm: "Re-enter your new password",
  },

  errors: {
    fillAll: "Please fill in all fields.",
    minLength: "Password must be at least 6 characters.",
    notMatch: "New passwords do not match.",
    noEmail: "Could not retrieve your email address.",
    wrongCurrent: "Current password is incorrect.",
  },

  success: {
    updated: "Password updated successfully.",
  },
},

email: {
  title: "Change Email Address",

  new: "New Email",
  password: "Current Password",

  placeholders: {
    new: "Enter your new email address",
    password: "Enter your current password",
  },

  errors: {
    fillAll: "Please fill in all fields.",
    invalid: "Please enter a valid email address.",
    noEmail: "Could not retrieve your current email.",
    wrongPassword: "Incorrect password.",
  },

  verifyTitle: "Verification Required",
  verifyMessage:
    "A verification link has been sent to your new email. Please verify to complete the update.",
},
save: "Save",

 //------------------------------------------
      // ANALYZE CALL
      //------------------------------------------
      analyzeCall: {
        title: "Analyze Call",
        transcriptPlaceholder: "Transcription will appear here...",
        micPermissionRequired: "Microphone permission required",
        noTranscription: "No transcription",
        uploadError: "Error uploading audio",
        fetchError: "Error fetching transcription",

        warningTitle: "Warning",
        warningBody:
          "This call is detected as a scam. We recommend you hang up immediately.",

        record: "Record",
        stop: "Stop",
        transcribe: "Transcribe",
      },statistics: {
  title: "Alert by source",
  today: "Today",
  week: "This week",

  sources: {
    sms: "SMS",
    calls: "Calls",
    email: "Email",
    url: "URL",
  },

  severityTitle: "Severity score",
  severity: {
    low: "Low",
    medium: "Medium",
    high: "High",
    score: "Score",
  },

  riskActivity: "Risk Activity",
},
      //------------------------------------------
      // PROFILE
      //------------------------------------------
      profile: {
        title: "Profile",

        account: "Account",
        editAccount: "Edit account",

        language: "Language",
        languageSmall: "language",

        darkMode: "Dark Mode",
        darkModeSmall: "darkMode",

        settings: "Settings",
        privacy: "Privacy",
        reviewPrivacy: "Review privacy",
        more: "More",

        firstName: "First Name",
        lastName: "Last Name",
        gender: "Gender",
        selectGender: "Select Gender",

        dateOfBirth: "Date of Birth",
        selectDate: "Select Date",

        phoneNumber: "Phone Number",
        email: "Email",
        password: "Password",

        cancel: "Cancel",
        save: "Save",
        close: "Close",

        male: "Male",
        female: "Female",

        selectDob: "Select Date of Birth",

        connectEmailForScanning: "Connect Email for Scanning",
        emailAddress: "Email Address",
        appPassword: "App Password",
        emailPlaceholder: "Enter your email",
        passwordPlaceholder: "Leave blank to keep current password",
        passwordPlaceholderApp: "Enter 16-character app password",
        emailError: "Please enter your email address",
        passwordError16: "Please enter exactly 16 characters for your app password",
        connecting: "Connecting...",
        connect: "Connect",

        emailScanning: "Email Scanning",
        connectedForScanning: "connected for scanning",
        connectYourEmailToScan: "connect your email to scan",

        emailDisconnectedSuccess: "Email disconnected successfully.",
        emailDisconnectedFail: "Failed to disconnect email: ",
        disconnectEmailTitle: "Disconnect email?",
        disconnectEmailMessage: "Are you sure you want to disconnect {{email}}?",
        disconnect: "Disconnect",

        emailConnectedSuccess: "Email connected successfully.",
        emailConnectedFail: "Failed to connect email: ",
      },
      
      //
      privacy: {
  title: "Privacy Policy",
  heading: "Privacy Policy for KnightHoot",
  lastUpdated: "Last Updated: September 2025",

  intro:
    "KnightHoot is committed to protecting your privacy. This policy explains how we collect, use, and protect your information when using our app, which helps protect users from scams through email, calls, SMS, and URLs.",

  section1: {
    title: "1. Information We Collect",
    text:
      "We may collect information such as first name, last name, email address, phone number, gender, device type (personal or family), scam alerts, reports, and detected keywords for scam detection purposes.",
  },

  section2: {
    title: "2. How We Use Your Information",
    text:
      "We use your information to detect scam attempts, block suspicious URLs (if enabled), store alert history, improve app features, and manage multiple devices and family members.",
  },

  section3: {
    title: "3. Permissions and Actions",
    text:
      "KnightHoot may require permissions to monitor calls for scam keywords and block unsafe URLs.",
  },

  section4: {
    title: "4. Data Storage and Management",
    text:
      "If you allow data storage, it will be used to improve scam detection. You may delete your data or account at any time.",
  },

  section5: {
    title: "5. Family Member Devices",
    text:
      "When adding family members, you may manage their devices and receive scam alerts that concern them.",
  },

  section6: {
    title: "6. Your Privacy Choices",
    text:
      "You may manage or delete your data and control permissions such as call monitoring and URL blocking at any time.",
  },

  section7: {
    title: "7. Security",
    text:
      "We apply reasonable security measures to protect your personal data, but no system can be completely secure.",
  },

  section8: {
    title: "8. Children’s Privacy",
    text:
      "KnightHoot is not intended for children under 13. If we learn that we collected information from a child, it will be deleted.",
  },

  section9: {
    title: "9. Changes to This Policy",
    text:
      "We may update this Privacy Policy occasionally. Any changes will be reflected with the updated date.",
  },

  section10: {
    title: "10. Contact Us",
    text: "If you have questions about this policy, please contact us.",
  },
},
    },
  },

  //===========================================================
  // ARABIC TRANSLATION
  //===========================================================
  ar: {
    translation: {
      selectLanguage: "اختر اللغة",
      english: "الإنجليزية",
      arabic: "العربية",
      close: "إغلاق",

      common: {
        cancel: "إلغاء",
        continue: "متابعة",
      },
settings: {
  title: "الإعدادات",

  accountSecurity: "الحساب والأمان",
  changePassword: "تغيير كلمة المرور",
  changeEmail: "تغيير البريد الإلكتروني",

  accountActions: "إجراءات الحساب",
  logout: "تسجيل الخروج",
  deleteAccount: "حذف الحساب",

  about: "حول التطبيق",
  privacy: "سياسة الخصوصية",
  contactSupport: "التواصل مع الدعم",
  rateApp: "تقييم KnightHoot",
  versionLabel: "الإصدار",

  delete: {
    title: "حذف الحساب",
    message: "هل أنت متأكد؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.",
    cancel: "إلغاء",
    confirm: "حذف",
  },

  errors: {
    title: "خطأ",
    logoutFail: "تعذر تسجيل الخروج: {{message}}",
    userNotFound: "لم يتم العثور على المستخدم.",
    generic: "حدث خطأ غير متوقع: {{message}}",
    emailApp: "تعذر فتح تطبيق البريد الإلكتروني.",
    openLink: "تعذر فتح الرابط.",
  },
}
,password: {
  title: "تغيير كلمة المرور",

  current: "كلمة المرور الحالية",
  new: "كلمة المرور الجديدة",
  confirm: "تأكيد كلمة المرور الجديدة",

  placeholders: {
    current: "أدخل كلمة المرور الحالية",
    new: "أدخل كلمة المرور الجديدة",
    confirm: "أعد إدخال كلمة المرور الجديدة",
  },

  errors: {
    fillAll: "يرجى تعبئة جميع الحقول.",
    minLength: "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل.",
    notMatch: "كلمتا المرور غير متطابقتين.",
    noEmail: "تعذر استرجاع بريدك الإلكتروني.",
    wrongCurrent: "كلمة المرور الحالية غير صحيحة.",
  },

  success: {
    updated: "تم تحديث كلمة المرور بنجاح.",
  },
},
save: "حفظ",
privacy: {
  title: "سياسة الخصوصية",
  heading: "سياسة الخصوصية لتطبيق KnightHoot",
  lastUpdated: "آخر تحديث: سبتمبر 2025",

  intro:
    "يحرص تطبيق KnightHoot على حماية خصوصيتك. توضح هذه السياسة كيفية جمع معلوماتك واستخدامها وحمايتها أثناء استخدام التطبيق، والذي يساعد المستخدمين في الحماية من الاحتيال عبر البريد الإلكتروني والمكالمات والرسائل القصيرة والروابط.",

  section1: {
    title: "1. المعلومات التي نقوم بجمعها",
    text:
      "قد نقوم بجمع معلومات مثل الاسم الأول، الاسم الأخير، البريد الإلكتروني، رقم الهاتف، الجنس، نوع الجهاز (شخصي أو أحد أفراد العائلة)، تنبيهات الاحتيال، التقارير، والكلمات التي يتم اكتشافها أثناء تحليل الاحتيال.",
  },

  section2: {
    title: "2. كيفية استخدام معلوماتك",
    text:
      "نستخدم معلوماتك للكشف عن محاولات الاحتيال، وحظر الروابط المشبوهة (في حال تفعيل الميزة)، وتخزين سجلات التنبيهات، وتحسين ميزات التطبيق، وتمكين إدارة أجهزة العائلة.",
  },

  section3: {
    title: "3. الأذونات والإجراءات",
    text:
      "قد يتطلب تطبيق KnightHoot أذونات مثل مراقبة المكالمات للبحث عن كلمات دالة على الاحتيال، بالإضافة إلى حظر الروابط غير الآمنة.",
  },

  section4: {
    title: "4. تخزين البيانات وإدارتها",
    text:
      "في حال السماح بتخزين البيانات، سيتم استخدامها لتحسين دقة اكتشاف الاحتيال. ويمكنك حذف بياناتك أو حسابك في أي وقت.",
  },

  section5: {
    title: "5. أجهزة أفراد العائلة",
    text:
      "عند إضافة أفراد العائلة، يمكنك إدارة أجهزتهم واستقبال التنبيهات الخاصة بهم.",
  },

  section6: {
    title: "6. خيارات الخصوصية لديك",
    text:
      "يمكنك إدارة بياناتك أو حذفها والتحكم في الأذونات مثل مراقبة المكالمات وحظر الروابط في أي وقت.",
  },

  section7: {
    title: "7. الأمان",
    text:
      "نطبق إجراءات أمان مناسبة لحماية بياناتك، ولكن لا يوجد نظام آمن بشكل كامل.",
  },

  section8: {
    title: "8. خصوصية الأطفال",
    text:
      "تطبيق KnightHoot غير مخصص للأطفال دون سن 13 عامًا. وإذا علمنا بوجود بيانات طفل، فسيتم حذفها.",
  },

  section9: {
    title: "9. التعديلات على هذه السياسة",
    text:
      "قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. ستظهر التعديلات في التطبيق مع تاريخ التحديث.",
  },

  section10: {
    title: "10. تواصل معنا",
    text: "إذا كان لديك أي استفسار حول سياسة الخصوصية، يرجى التواصل معنا.",
  },
}
,
email: {
  title: "تغيير البريد الإلكتروني",

  new: "البريد الإلكتروني الجديد",
  password: "كلمة المرور الحالية",

  placeholders: {
    new: "أدخل البريد الإلكتروني الجديد",
    password: "أدخل كلمة المرور الحالية",
  },

  errors: {
    fillAll: "يرجى تعبئة جميع الحقول.",
    invalid: "يرجى إدخال بريد إلكتروني صحيح.",
    noEmail: "تعذر استرجاع البريد الإلكتروني الحالي.",
    wrongPassword: "كلمة المرور غير صحيحة.",
  },

  verifyTitle: "مطلوب التحقق",
  verifyMessage:
    "تم إرسال رابط التفعيل إلى بريدك الإلكتروني الجديد. يرجى التحقق لإكمال عملية التحديث.",
},

      //------------------------------------------
      // SAFE BROWSING
      //------------------------------------------
      safe: {
        title: "التصفح الآمن",
        invalidUrl: "أدخل رابطًا صالحًا للفحص",
        scanError: "حدث خطأ أثناء الفحص",
        warnTitle: "تحذير: موقع مشبوه",
        warnBody:
          "تم تمييز هذا الموقع كموقع محظور أو احتيالي. هل تريد المتابعة؟",
        openFail: "تعذّر فتح الرابط",
        banner: "هذا الموقع يبدو مشبوها — تابع بحذر",

        checkUrl: "فحص الرابط",
        websiteUrl: "رابط الموقع",
        urlPlaceholder: "https://example.com",

        downloadProtTitle: "حماية تحميل الملفات",
        downloadProtDesc:
          "تقوم بحظر أو تحذير المستخدم عند محاولة تنزيل ملف مشبوه",

        websiteRating: "تقييم الموقع",
        lastScan: "نتيجة آخر فحص",
        notScanned: "لم يتم فحص أي موقع بعد",

        tipsTitle: "نصائح التصفح",
        tip1: "تأكد من وجود HTTPS في شريط العنوان",
        tip2: "لا تدخل بياناتك دون سبب واضح",
        tip3: "احذر من الروابط القصيرة أو النطاقات الغريبة",

        lastScanTitle: "نتيجة الفحص الأخيرة",
        domain: "النطاق",
        reason: "السبب",

        openLink: "فتح الرابط",
        report: "تبليغ",
        reportSent: "تم إرسال التقرير للنظام (تجريبي)",

        rating: {
          safe: "آمن",
          suspicious: "مشبوه",
          danger: "خطر",
        },
      },
   //------------------------------------------
      // ANALYZE CALL
      //------------------------------------------
      analyzeCall: {
        title: "تحليل المكالمة",
        transcriptPlaceholder: "سيظهر نص المكالمة هنا...",
        micPermissionRequired: "مطلوب إذن الوصول إلى الميكروفون",
        noTranscription: "لا يوجد نص للمكالمة",
        uploadError: "حدث خطأ أثناء رفع الصوت",
        fetchError: "حدث خطأ أثناء جلب النص",

        warningTitle: "تحذير",
        warningBody:
          "تم اكتشاف أن هذه المكالمة احتيالية. ننصحك بإنهاء المكالمة فورًا.",

        record: "بدء التسجيل",
        stop: "إيقاف التسجيل",
        transcribe: "تحويل إلى نص",
      },
      
      //------------------------------------------
      // ADD DEVICE
      //------------------------------------------
      addDevice: {
  headerTitle: "إضافة جهاز",
  loading: "جاري تحميل الأجهزة...",
  defaultName: "جهاز جديد",

  emptyTitle: "لا توجد أجهزة",
  emptySubtitle: "لم تقم بإضافة أي جهاز حتى الآن. ابدأ بإضافة أول جهاز لك.",
  emptyButton: "إضافة جهاز",

  searchPlaceholder: "البحث عن جهاز",

  filters: {
    all: "الكل",
    myDevice: "أجهزتي",
    family: "العائلة",
  },

  form: {
    addTitle: "إضافة جهاز",
    editTitle: "تعديل الجهاز",
    connected: "• متصل",
    disconnected: "• غير متصل",
    selectType: "اختر النوع",
    categoryTitle: "الفئة",
    myDevices: "أجهزتي",
    family: "العائلة",
    addNow: "إضافة الآن",
    saveChanges: "حفظ التغييرات",
    addNewDevice: "إضافة جهاز جديد",
  },

  types: {
    iphone: "هاتف",
    laptop: "حاسب محمول",
    tablet: "جهاز لوحي",
  },

  alerts: {
    selectType: "يرجى اختيار نوع الجهاز.",
    notAuthenticated: "المستخدم غير مسجل الدخول. يرجى تسجيل الدخول.",
    toggleFail: "فشل في تحديث حالة الجهاز.",
    deleteFail: "فشل في حذف الجهاز.",
    saveFailAdd: "فشل في إضافة الجهاز. تحقق من RLS policies.",
    saveFailUpdate: "فشل في تحديث الجهاز. تحقق من RLS policies.",
  },
}
,

manageAlerts: {
  headers: {
    sms: "تنبيهات الرسائل النصية",
    email: "تنبيهات البريد الإلكتروني",
  },

  sections: {
    sms: {
      uncertain: "تنبيهات الرسائل النصية غير المؤكدة",
      certain: "تنبيهات الرسائل النصية المؤكدة",
    },
    email: {
      uncertain: "رسائل البريد الإلكتروني المفحوصة",
      certain: "رسائل البريد الإلكتروني المشبوهة",
    },
  },

  empty: {
    sms: {
      uncertain: "لا توجد أي تنبيهات رسائل نصية غير مؤكدة.",
      certain: "لا توجد أي تنبيهات رسائل نصية مؤكدة.",
    },
    email: {
      uncertain: "لا توجد رسائل بريد إلكتروني مفحوصة.",
      certain: "لا توجد رسائل بريد إلكتروني مشبوهة.",
    },
  },

  labels: {
    from: "من",
    description: "الوصف",
  },

  actions: {
    report: "إبلاغ",
    unreport: "إلغاء الإبلاغ",
    restore: "تجاهل التنبيه",
  },
settings: {
  title: "الإعدادات",

  accountSecurity: "الحساب والأمان",
  changePassword: "تغيير كلمة المرور",
  changeEmail: "تغيير البريد الإلكتروني",

  accountActions: "إجراءات الحساب",
  logout: "تسجيل الخروج",
  deleteAccount: "حذف الحساب",

  about: "حول التطبيق",
  privacy: "سياسة الخصوصية",
  contactSupport: "التواصل مع الدعم",
  rateApp: "تقييم KnightHoot",
  versionLabel: "الإصدار",

  delete: {
    title: "حذف الحساب",
    message: "هل أنت متأكد؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.",
    cancel: "إلغاء",
    confirm: "حذف",
  },

  errors: {
    title: "خطأ",
    logoutFail: "تعذر تسجيل الخروج: {{message}}",
    userNotFound: "لم يتم العثور على المستخدم.",
    generic: "حدث خطأ غير متوقع: {{message}}",
    emailApp: "تعذر فتح تطبيق البريد الإلكتروني.",
    openLink: "تعذر فتح الرابط.",
  },
},
  titles: {
    suspiciousSms: "تم رصد رسالة نصية مشبوهة",
    smsScanned: "تم فحص الرسالة النصية",
    suspiciousEmail: "تم رصد بريد إلكتروني مشبوه",
    emailScanned: "تم فحص البريد الإلكتروني",
  },

  sms: {
    unknownSender: "مرسل غير معروف",
    senderBlocked: "تم حظر مرسل الرسالة النصية",
    safe: "تم فحص الرسالة النصية وهي آمنة",
    detectedAt: "تم رصده في الساعة {{time}}",
  },

  email: {
    flagged: "تم وسمه كاحتيال محتمل",
    safe: "تم الفحص والبريد الإلكتروني آمن",
  },

  alerts: {
    successTitle: "نجاح",
    errorTitle: "خطأ",
    fetchSmsError: "فشل في جلب بيانات الرسائل النصية.",
    reportSuccess: "تم الإبلاغ عن {{channel}} بنجاح.",
    reportError: "فشل في إتمام عملية الإبلاغ.",
    unreportSuccess: "تم إلغاء الإبلاغ عن {{channel}} بنجاح.",
    unreportError: "فشل في إلغاء الإبلاغ عن التنبيه.",
    restoreSuccess: "تم تجاهل التنبيه بنجاح.",
  },

  time: {
    today: "اليوم",
    yesterday: "الأمس",
    days: "قبل {{count}} يوم",
    weeks: "قبل {{count}} أسبوع",
    months: "قبل {{count}} شهر",
  },
}
,

      //------------------------------------------
      // REPORT SCAM
      //------------------------------------------
      reportScam: {
        title: "الإبلاغ عن احتيال",
        question: "ما نوع الاحتيال الذي واجهته؟",

        phone: "رقم الهاتف",
        phonePh: "أدخل الرقم المشبوه",

        description: "الوصف",
        callDescPh: "صف ما حدث أثناء المكالمة",

        sender: "اسم/رقم المرسل",
        senderPh: "أدخل اسم أو رقم المرسل",

        msgContent: "نص الرسالة",
        msgPh: "ألصق الرسالة المشبوهة هنا",

        email: "بريد المرسل",
        emailPh: "أدخل بريد المرسل",
        emailSubject: "موضوع البريد",
        emailSubjectPh: "أدخل موضوع البريد",

        url: "رابط الموقع",
        webDescPh: "صف الموقع الاحتيالي",

        submit: "إرسال البلاغ",
        submitted: "تم إرسال البلاغ!",
        thanks: "شكرًا لمساهمتك في حماية المستخدمين",

        types: {
          calls: "مكالمات",
          messages: "رسائل",
          email: "بريد",
          web: "ويب",
        },
        submit: "إرسال البلاغ",
title: "الإبلاغ عن احتيال",
question: "ما نوع الاحتيال الذي واجهته؟",
      },

      //------------------------------------------
      // WELCOME / AUTH
      //------------------------------------------
      welcome: {
        title: "مرحبًا بك في KnightHooT",
        signIn: "تسجيل الدخول",
        signUp: "إنشاء حساب",
        google: "التسجيل باستخدام Google",
      },

          //------------------------------------------
      // SMS SCAM
      //------------------------------------------
smsScam: {
  header: "KnightHoo",
  title: "اكتشاف الرسائل الاحتيالية",

  apiNotConnected:
    "⚠️ خادم الـ API غير متصل. يرجى تشغيل خادم Python.\n\nللتشغيل:\n1. انتقل إلى مجلد python\n2. شغل الأمر: python api.py\n3. حدّث قيمة API_BASE_URL بعنوان جهازك",

  waitingScan: "اضغط START للبدء في مراقبة الرسائل بحثاً عن الاحتيال.",
  monitoring: "جاري مراقبة الرسائل... بانتظار رسالة جديدة للتحليل.",

  startSuccess: "تم بدء فحص الرسائل بنجاح",
  stopSuccess: "تم إيقاف فحص الرسائل",

  connectionErrorTitle: "خطأ في الاتصال",
  connectionErrorBody:
    "تعذر الاتصال بخادم الـ API. تأكد من تشغيل خادم Python.",

  errorGeneric: "خطأ",
  failStop: "فشل في إيقاف الفحص",

  allScanned: "🔄 تم فحص جميع الرسائل. إعادة البدء من جديد...",
  newSMS: "رسالة جديدة من",
  classificationError: "❌ خطأ في التصنيف. تحقق من اتصال API.",

  start: "بدء",
  stop: "إيقاف",
},

      //------------------------------------------
      // HOME SCREEN
      //------------------------------------------
      home: {
  hello: "مرحبًا، {{name}}",
  glad: "سعداء برؤيتك!",
  covered: "نحن هنا لحمايتك",
  tipsHeader: "نصائح اليوم الذكية",
  safetyKit: "مجموعتك الأمنية",
  analyzeCall: "تحليل المكالمة",
  safeBrowsing: "التصفح الآمن",
  reportScam: "الإبلاغ عن احتيال",
  smsScam: "رسائل الاحتيال",
       tips: {
    thinkTitle: "فكر قبل أن تشارك",
    thinkBody:
      "تجنب مشاركة كلمات المرور أو أرقام الهوية عبر الهاتف، حتى لو بدا المتصل موثوقًا.",
    pauseTitle: "تمهّل قبل أن تضغط",
    pauseBody:
      "تحقّق دائمًا من الروابط؛ فقد تبدو روابط الاحتيال حقيقية لكنها قد توجهك إلى مواقع ضارة.",
    urgencyTitle: "لا تثق في الاستعجال",
    urgencyBody:
      "يستخدم المحتالون أساليب ضغط مثل «تصرف الآن!»؛ خذ وقتك وفكر قبل أن تستجيب.",
  },

},
statistics: {
  title: "التنبيهات حسب المصدر",
  today: "اليوم",
  week: "هذا الأسبوع",

  sources: {
    sms: "رسائل SMS",
    calls: "مكالمات",
    email: "البريد",
    url: "روابط URL",
  },

  severityTitle: "درجة الخطورة",
  severity: {
    low: "منخفض",
    medium: "متوسط",
    high: "عالٍ",
    score: "النتيجة",
  },

  riskActivity: "نشاط المخاطر",
}
,
      //------------------------------------------
      // PROFILE
      //------------------------------------------
      profile: {
        title: "الملف الشخصي",

        account: "الحساب",
        editAccount: "تعديل الحساب",

        language: "اللغة",
        languageSmall: "اللغة",

        darkMode: "الوضع الداكن",
        darkModeSmall: "الوضع الداكن",

        settings: "الإعدادات",
        privacy: "الخصوصية",
        reviewPrivacy: "مراجعة الخصوصية",
        more: "المزيد",

        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        gender: "الجنس",
        selectGender: "اختر الجنس",

        dateOfBirth: "تاريخ الميلاد",
        selectDate: "اختر التاريخ",

        phoneNumber: "رقم الجوال",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",

        cancel: "إلغاء",
        save: "حفظ",
        close: "إغلاق",

        male: "ذكر",
        female: "أنثى",

        selectDob: "اختر تاريخ الميلاد",

        connectEmailForScanning: "ربط البريد للفحص",
        emailAddress: "البريد الإلكتروني",
        appPassword: "كلمة مرور التطبيق",
        emailPlaceholder: "أدخل بريدك الإلكتروني",
        passwordPlaceholder: "اتركه فارغًا للاحتفاظ بكلمة المرور الحالية",
        passwordPlaceholderApp: "أدخل كلمة مرور التطبيق (16 حرفًا)",
        emailError: "يرجى إدخال البريد الإلكتروني",
        passwordError16: "يرجى إدخال 16 حرفًا لكلمة المرور",
        connecting: "جارٍ الاتصال...",
        connect: "اتصال",

        emailScanning: "فحص البريد",
        connectedForScanning: "متصل للفحص",
        connectYourEmailToScan: "اربط بريدك الإلكتروني للفحص",

        emailDisconnectedSuccess: "تم فصل البريد الإلكتروني بنجاح.",
        emailDisconnectedFail: "حدث خطأ أثناء فصل البريد: ",
        disconnectEmailTitle: "هل تريد فصل البريد؟",
        disconnectEmailMessage: "هل أنت متأكد أنك تريد فصل {{email}}؟",
        disconnect: "فصل",

        emailConnectedSuccess: "تم ربط البريد الإلكتروني بنجاح.",
        emailConnectedFail: "تعذّر ربط البريد الإلكتروني: ",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  compatibilityJSON: "v3",
  debug: false,
});

export default i18n;