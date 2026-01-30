import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  return (
    <button
      onClick={() => setIsLight(!isLight)}
      className="btn-theme"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--glass-border)',
        padding: '0.4rem',
        borderRadius: '12px',
        color: 'var(--text-main)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        width: '40px',
        height: '40px'
      }}
      aria-label="Toggle Theme"
    >
      {isLight ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
