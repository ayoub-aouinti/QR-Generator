import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "badge": "Free & Unlimited",
      "title": "QR Studio",
      "subtitle": "Instant, high-quality QR codes for anything.",
      "placeholder": "Enter URL or text here...",
      "generate": "Generate QR Code",
      "generating": "Generating...",
      "download_png": "Download PNG",
      "export_pdf": "Export PDF",
      "footer_text": "© {{year}} QR Studio • Built with Passion",
      "hint": "Enter a link to see the magic happen",
      "source_text": "Source: {{text}}",
      "pdf_header": "Generated QR Code"
    }
  },
  fr: {
    translation: {
      "badge": "Gratuit & Illimité",
      "title": "QR Studio",
      "subtitle": "Codes QR instantanés et de haute qualité pour tout.",
      "placeholder": "Entrez l'URL ou le texte ici...",
      "generate": "Générer le Code QR",
      "generating": "Génération...",
      "download_png": "Télécharger PNG",
      "export_pdf": "Exporter PDF",
      "footer_text": "© {{year}} QR Studio • Construit avec Passion",
      "hint": "Entrez un lien pour voir la magie opérer",
      "source_text": "Source: {{text}}",
      "pdf_header": "Code QR Généré"
    }
  },
  ar: {
    translation: {
      "badge": "مجاني وغير محدود",
      "title": "استوديو QR",
      "subtitle": "أكواد QR فورية وعالية الجودة لأي شيء.",
      "placeholder": "أدخل الرابط أو النص هنا...",
      "generate": "إنشاء رمز QR",
      "generating": "جاري الإنشاء...",
      "download_png": "تحميل PNG",
      "export_pdf": "تصدير PDF",
      "footer_text": "© {{year}} استوديو QR • تم بناؤه بشغف",
      "hint": "أدخل رابطًا لترى السحر يحدث",
      "source_text": "المصدر: {{text}}",
      "pdf_header": "رمز QR المولد"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
