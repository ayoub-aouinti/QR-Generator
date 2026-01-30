import { useTranslation } from 'react-i18next';
import QrGenerator from './components/QrGenerator';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';

function App() {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <LanguageSwitcher />
      <QrGenerator />
      
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '3rem', 
        color: 'var(--text-muted)', 
        fontSize: '0.85rem' 
      }}>
        <p>{t('footer_text', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  )
}

export default App
