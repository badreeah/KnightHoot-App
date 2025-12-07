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
        title: "Add Device",
        loading: "Loading Devices...",
        defaultName: "New Device",

        searchPlaceholder: "Search Device",

        emptyTitle: "No devices found",
        emptySubtitle:
          "You haven't added any devices yet. Start by adding your first device.",
        scanCta: "Scan Device",

        connected: "• Connected",
        disconnected: "• Disconnected",

        selectType: "Select Type",
        selectTypeError: "Please select a device type.",
        phone: "iPhone",
        laptop: "Laptop",
        tablet: "Tablet",

        category: "Category",
        myDevices: "My Devices",
        family: "Family",

        addNow: "Add Now",
        addNew: "Add New Device",
        editDevice: "Edit Device",

        dbError: "Failed to {{action}} device. Check RLS policies.",
        toggleError: "Failed to update device status.",
        deleteError: "Failed to delete device.",
        authError: "User not authenticated. Please log in.",

        filter: {
          all: "All",
          my: "My Device",
          family: "Family",
        },
      },

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
      // ADD DEVICE
      //------------------------------------------
      addDevice: {
        title: "إضافة جهاز",
        loading: "جاري تحميل الأجهزة...",
        defaultName: "جهاز جديد",

        searchPlaceholder: "بحث عن جهاز",

        emptyTitle: "لا توجد أجهزة",
        emptySubtitle:
          "لم تقم بإضافة أي جهاز بعد. ابدأ بإضافة جهازك الأول.",
        scanCta: "فحص الجهاز",

        connected: "• متصل",
        disconnected: "• غير متصل",

        selectType: "اختر النوع",
        selectTypeError: "يرجى اختيار نوع الجهاز.",
        phone: "هاتف",
        laptop: "لابتوب",
        tablet: "جهاز لوحي",

        category: "التصنيف",
        myDevices: "أجهزتي",
        family: "العائلة",

        addNow: "أضف الآن",
        addNew: "إضافة جهاز جديد",
        editDevice: "تعديل الجهاز",

        dbError: "فشل في {{action}} الجهاز. تحقق من صلاحيات RLS.",
        toggleError: "تعذّر تحديث حالة الجهاز.",
        deleteError: "تعذّر حذف الجهاز.",
        authError: "المستخدم غير مسجّل الدخول. يرجى تسجيل الدخول.",

        filter: {
          all: "الكل",
          my: "جهازي",
          family: "العائلة",
        },
      },

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
      // HOME SCREEN
      //------------------------------------------
      home: {
        hello: "مرحبًا، {{name}}",
        glad: "سعداء برؤيتك!",
        covered: "نحن هنا لحمايتك",
        tipsHeader: "نصائح اليوم الذكية",
        safetyKit: "مجموعتك الأمنية",
        analyzeCall: "تحليل المكالمات",
        safeBrowsing: "التصفح الآمن",
        reportScam: "الإبلاغ عن احتيال",
      },

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
