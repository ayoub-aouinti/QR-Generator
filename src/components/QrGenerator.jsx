import { useState, useRef } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Download,
  FileText,
  Image as ImageIcon,
  QrCode as QrIcon,
  RefreshCw,
  Palette,
  Upload,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

const MotionDiv = motion.div;

const FAMOUS_SITE_LOGOS = [
  { name: "Google", url: "https://www.google.com/s2/favicons?domain=google.com&sz=128" },
  { name: "Facebook", url: "https://www.google.com/s2/favicons?domain=facebook.com&sz=128" },
  { name: "Instagram", url: "https://www.google.com/s2/favicons?domain=instagram.com&sz=128" },
  { name: "Twitter", url: "https://www.google.com/s2/favicons?domain=twitter.com&sz=128" },
  { name: "LinkedIn", url: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=128" },
  { name: "YouTube", url: "https://www.google.com/s2/favicons?domain=youtube.com&sz=128" },
  { name: "WhatsApp", url: "https://www.google.com/s2/favicons?domain=whatsapp.com&sz=128" },
  { name: "GitHub", url: "https://www.google.com/s2/favicons?domain=github.com&sz=128" },
];

const QrGenerator = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Customization state
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [customLogo, setCustomLogo] = useState(null);
  
  const fileInputRef = useRef(null);

  const generateQRCode = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    try {
      // Add a small delay for "premium" feel & animation
      await new Promise((resolve) => setTimeout(resolve, 600));

      const logoUrl = customLogo || selectedLogo;
      
      const options = {
        width: 600, // Higher resolution for better quality
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: logoUrl ? 'H' : 'M',
      };

      // Create a virtual canvas to render the QR code
      const canvas = document.createElement("canvas");
      await QRCode.toCanvas(canvas, text, options);

      if (logoUrl) {
        const ctx = canvas.getContext("2d");
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.src = logoUrl;

        await new Promise((resolve) => {
          logo.onload = resolve;
          logo.onerror = () => {
              console.error("Failed to load logo");
              resolve(); // Still finish generating without logo
          };
        });

        if (logo.complete && logo.naturalWidth > 0) {
            const logoSize = canvas.width * 0.2;
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;

            // Draw white background for logo
            ctx.fillStyle = bgColor;
            ctx.beginPath();
            ctx.roundRect(x - 5, y - 5, logoSize + 10, logoSize + 10, 10);
            ctx.fill();

            // Draw logo
            ctx.drawImage(logo, x, y, logoSize, logoSize);
        }
      }

      const dataUrl = canvas.toDataURL("image/png");
      setQrDataUrl(dataUrl);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#ec4899", "#10b981"],
      });
    } catch (err) {
      console.error("QR Generation Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLogo(event.target.result);
        setSelectedLogo(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadPNG = () => {
    const link = document.createElement("a");
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(qrDataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * 100) / imgProps.width;

    // Center the QR code on the page
    const x = (pdfWidth - 100) / 2;
    const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

    pdf.setFontSize(22);
    pdf.text(t('pdf_header'), pdfWidth / 2, 40, { align: "center" });
    pdf.addImage(qrDataUrl, "PNG", x, y, 100, pdfHeight);
    pdf.setFontSize(10);
    pdf.setTextColor(150);
    pdf.text(t('source_text', { text }), pdfWidth / 2, y + pdfHeight + 10, { align: "center" });

    pdf.save(`qrcode-${Date.now()}.pdf`);
  };

  return (
    <div className="glass-card">
      <div style={{ textAlign: "center" }}>
        <span className="badge">{t('badge')}</span>
        <h1 className="title">{t('title')}</h1>
        <p className="subtitle">{t('subtitle')}</p>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder={t('placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateQRCode()}
        />
      </div>

      <div className="customization-panel">
        <div className="customization-section">
            <h3 className="section-title">
                <Palette size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                {t('colors')}
            </h3>
            <div className="color-controls">
                <div className="color-input-wrapper">
                    <input 
                        type="color" 
                        value={fgColor} 
                        onChange={(e) => setFgColor(e.target.value)} 
                    />
                    <span>{t('fg_color')}</span>
                </div>
                <div className="color-input-wrapper">
                    <input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)} 
                    />
                    <span>{t('bg_color')}</span>
                </div>
            </div>
        </div>

        <div className="customization-section">
            <h3 className="section-title">{t('logo')}</h3>
            <div className="logo-grid">
                <div 
                    className={`logo-item ${!selectedLogo && !customLogo ? 'active' : ''}`}
                    onClick={() => { setSelectedLogo(null); setCustomLogo(null); }}
                >
                    <X size={20} />
                </div>
                {FAMOUS_SITE_LOGOS.map((site) => (
                    <div 
                        key={site.name}
                        className={`logo-item ${selectedLogo === site.url ? 'active' : ''}`}
                        onClick={() => { setSelectedLogo(site.url); setCustomLogo(null); }}
                    >
                        <img src={site.url} alt={site.name} title={site.name} />
                    </div>
                ))}
            </div>
            
            <div 
                className={`custom-logo-upload ${customLogo ? 'active' : ''}`}
                onClick={() => fileInputRef.current.click()}
                style={customLogo ? { borderColor: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)' } : {}}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={handleCustomLogoUpload} 
                />
                {customLogo ? (
                    <img src={customLogo} alt="Custom logo" style={{ height: '40px', borderRadius: '4px' }} />
                ) : (
                    <>
                        <Upload size={20} />
                        <span>{t('upload_hint')}</span>
                    </>
                )}
            </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={generateQRCode}
          disabled={!text.trim() || isGenerating}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {isGenerating ? (
            <RefreshCw className="animate-spin" size={20} />
          ) : (
            <QrIcon size={20} />
          )}
          {isGenerating ? t('generating') : t('generate')}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
            <MotionDiv
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="loader-container"
            >
                <RefreshCw className="animate-spin" size={40} color="var(--primary)" />
                <p style={{ color: "var(--text-muted)" }}>{t('generating')}</p>
            </MotionDiv>
        ) : qrDataUrl && (
          <MotionDiv
            key="qr"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="qr-container"
          >
            <div className="qr-image-wrapper">
                <img
                    src={qrDataUrl}
                    alt="Generated QR"
                    style={{
                        width: "220px",
                        height: "220px",
                        display: "block"
                    }}
                />
            </div>

            <div className="actions">
              <button className="btn btn-secondary" onClick={downloadPNG}>
                <ImageIcon size={18} />
                {t('download_png')}
              </button>
              <button className="btn btn-secondary" onClick={downloadPDF}>
                <FileText size={18} />
                {t('export_pdf')}
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {!qrDataUrl && !isGenerating && (
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
          }}
        >
          <p>{t('hint')}</p>
        </div>
      )}
    </div>
  );
};

export default QrGenerator;
