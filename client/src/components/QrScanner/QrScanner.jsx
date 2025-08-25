import React from 'react';
import './QrScanner.scss';

const QrScanner = ({ onScan, onClose }) => {
  const handleMockScan = () => {
    const mockData = 'https://azs.rosneft.ru/discount/12345';
    onScan(mockData);
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <div className="scanner-header">
          <h3>Сканирование QR кода</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="scanner-content">
          <div className="scanner-placeholder">
            <div className="qr-frame">
              <div className="scan-animation"></div>
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
            <p>Наведите камеру на QR код на АЗС</p>
          </div>
          
          <div className="scanner-actions">
            <button className="scan-button" onClick={handleMockScan}>
              📷 Сканировать
            </button>
            <button className="cancel-button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrScanner;