import QrGenerator from './components/QrGenerator';
import './App.css';

function App() {
  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <QrGenerator />
      
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '3rem', 
        color: 'var(--text-muted)', 
        fontSize: '0.85rem' 
      }}>
        <p>© {new Date().getFullYear()} QR Studio • Built with Passion</p>
      </footer>
    </div>
  )
}

export default App
