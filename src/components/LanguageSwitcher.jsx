import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' }
  ];

  return (
    <div className="language-switcher" style={{ 
      display: 'flex', 
      gap: '0.5rem', 
      justifyContent: 'center', 
      marginBottom: '1.5rem' 
    }}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`btn-lang ${i18n.language === lang.code ? 'active' : ''}`}
          style={{
            background: i18n.language === lang.code ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--glass-border)',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
