import { useState } from "react";
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
} from "lucide-react";
import confetti from "canvas-confetti";

const MotionDiv = motion.div;

const QrGenerator = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    try {
      // Add a small delay for "premium" feel & animation
      await new Promise((resolve) => setTimeout(resolve, 600));

      const options = {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      };

      const dataUrl = await QRCode.toDataURL(text, options);
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
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

      <AnimatePresence>
        {qrDataUrl && !isGenerating && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="qr-container"
          >
            <img
              src={qrDataUrl}
              alt="Generated QR"
              style={{
                width: "250px",
                height: "250px",
                borderRadius: "16px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
                background: "white",
                padding: "10px",
              }}
            />

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
