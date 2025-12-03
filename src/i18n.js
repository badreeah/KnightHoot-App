import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: { cancel: "Cancel", continue: "Continue" },
      safe: {
        title: "Safe Browsing",
        invalidUrl: "Enter a valid URL to scan",
        scanError: "An error occurred while scanning",
        warnTitle: "Warning: Suspicious Site",
        warnBody: "This site is flagged as blocked/phishing. Do you want to continue?",
        openFail: "Could not open the link",
        banner: "This site looks suspicious — proceed with caution",
        checkUrl: "Check URL",
        websiteUrl: "Website URL",
        urlPlaceholder: "https://example.com",
        downloadProtTitle: "File Download Protection",
        downloadProtDesc: "Prevents downloading suspicious files or shows a warning",
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
        rating: { safe: "Safe", suspicious: "Suspicious", danger: "Danger" }
      },
      addDevice: {
        title: "Add Device",
        searchPlaceholder: "Search Device",
        emptyTitle: "No results found",
        emptySubtitle:
          "The search could not be found, please check spelling or write another word.",
        scanCta: "Scan Device",
        connected: "• Connected",
        disconnected: "• Disconnected",
        selectType: "Select Type",
        category: "Category",
        myDevices: "My Devices",
        family: "Family",
        addNow: "Add Now",
        addNew: "Add New Device",
        filter: { all: "All", my: "My Device", family: "Family" }
      },
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
  types: { calls: "Calls", messages: "Messages", email: "Email", web: "Web" }
    },welcome: {
  title: "Welcome to KnightHooT",
  signIn: "Sign In",
  signUp: "Sign Up",
  google: "Sign up with Google"
}
  },
  ar: {
    translation: {
      common: { cancel: "إلغاء", continue: "متابعة" },
      safe: {
        title: "التصفح الآمن",
        invalidUrl: "أدخل رابطًا صالحًا للفحص",
        scanError: "حدث خطأ أثناء الفحص",
        warnTitle: "تحذير: موقع مشبوه",
        warnBody: "تم تمييز هذا الموقع كمحظور/احتيالي. هل تريد المتابعة؟",
        openFail: "تعذّر فتح الرابط",
        banner: "هذا الموقع يبدو مشبوهاً — تابع بحذر",
        checkUrl: "فحص الرابط",
        websiteUrl: "رابط الموقع",
        urlPlaceholder: "https://example.com",
        downloadProtTitle: "حماية تحميل الملفات",
        downloadProtDesc: "تمنع تنزيل الملفات المشتبه بها أو تعرض تحذيرًا",
        websiteRating: "تقييم الموقع",
        lastScan: "نتيجة آخر فحص",
        notScanned: "لم يتم الفحص بعد",
        tipsTitle: "نصائح التصفح",
        tip1: "تأكد من وجود HTTPS في شريط العنوان",
        tip2: "لا تدخل بياناتك دون سبب واضح",
        tip3: "احذر من الروابط القصيرة أو النطاقات الغريبة",
        lastScanTitle: "نتيجة الفحص الأخيرة",
        domain: "المجال",
        reason: "السبب",
        openLink: "فتح الرابط",
        report: "تبليغ",
        reportSent: "تم إرسال تقرير إلى النظام (تجريبي)",
        rating: { safe: "آمن", suspicious: "مشبوه", danger: "خطر" }
      },
      addDevice: {
        title: "إضافة جهاز",
        searchPlaceholder: "ابحث عن جهاز",
        emptyTitle: "لا توجد نتائج",
        emptySubtitle:
          "تعذر العثور على ما تبحث عنه، تأكد من الإملاء أو جرّب كلمة أخرى.",
        scanCta: "فحص الجهاز",
        connected: "• متصل",
        disconnected: "• غير متصل",
        selectType: "اختر النوع",
        category: "التصنيف",
        myDevices: "أجهزتي",
        family: "العائلة",
        addNow: "أضف الآن",
        addNew: "إضافة جهاز جديد",
        filter: { all: "الكل", my: "جهازي", family: "العائلة" }
      },
      reportScam: {
  title: "الإبلاغ عن احتيال",
  question: "ما نوع الاحتيال الذي واجهته؟",
  phone: "رقم الهاتف",
  phonePh: "أدخل رقم الهاتف المشبوه",
  description: "الوصف",
  callDescPh: "صف ما حدث أثناء المكالمة",
  sender: "اسم/رقم المرسل",
  senderPh: "أدخل اسم أو رقم المرسل",
  msgContent: "نص الرسالة",
  msgPh: "ألصِق الرسالة المشبوهة هنا",
  email: "بريد المرسل",
  emailPh: "أدخل بريد المرسل",
  emailSubject: "موضوع البريد",
  emailSubjectPh: "أدخل موضوع البريد",
  url: "رابط الموقع",
  webDescPh: "صف الموقع الاحتيالي",
  submit: "إرسال البلاغ",
  submitted: "تم إرسال البلاغ!",
  thanks: "شكرًا لمساهمتك في حماية المجتمع",
  types: { calls: "مكالمات", messages: "رسائل", email: "بريد", web: "ويب" }
}, welcome: {
  title: "مرحبًا بك في KnightHooT",
  signIn: "تسجيل الدخول",
  signUp: "إنشاء حساب",
  google: "التسجيل عبر Google"
}
    }
  }
}};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",             // القيمة الابتدائية
    fallbackLng: "en",     // يرجع للإنجليزية لو مفتاح ناقص
    interpolation: { escapeValue: false },
    compatibilityJSON: "v3",
    debug: false
  });

export default i18n;
