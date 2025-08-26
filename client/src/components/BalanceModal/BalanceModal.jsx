import React, { useState } from 'react';
import './BalanceModal.scss';

const BalanceModal = ({ isOpen, onClose, onAddBalance }) => {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [100, 500, 1000, 2000];

  const handleAmountSelect = (amt) => {
    setSelectedAmount(amt);
    setAmount(amt.toString());
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
    setSelectedAmount(null);
  };

  const handleCardInput = (field, value) => {
    let formattedValue = value;
    
    switch (field) {
      case 'number':
        formattedValue = value.replace(/\D/g, '').slice(0, 16);
        if (formattedValue.length > 0) {
          formattedValue = formattedValue.match(/.{1,4}/g).join(' ');
        }
        break;
      case 'expiry':
        formattedValue = value.replace(/\D/g, '').slice(0, 4);
        if (formattedValue.length > 2) {
          formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
        }
        break;
      case 'cvc':
        formattedValue = value.replace(/\D/g, '').slice(0, 3);
        break;
      default:
        formattedValue = value;
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || amount < 100) {
      alert('Минимальная сумма пополнения - 100 рублей');
      return;
    }

    if (!cardData.number || cardData.number.replace(/\D/g, '').length !== 16) {
      alert('Введите корректный номер карты');
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onAddBalance(parseInt(amount));
      onClose();
      
      // Сброс формы
      setAmount('');
      setSelectedAmount(null);
      setCardData({ number: '', name: '', expiry: '', cvc: '' });
    } catch (error) {
      console.error('Ошибка пополнения:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content balance-modal">
        <div className="modal-header">
          <h2>Пополнение баланса</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Выберите сумму:</label>
            <div className="amount-options">
              {presetAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  className={`amount-option ${selectedAmount === amt ? 'selected' : ''}`}
                  onClick={() => handleAmountSelect(amt)}
                >
                  {amt} ₽
                </button>
              ))}
            </div>
            
            <div className="custom-amount">
              <input
                type="text"
                value={amount}
                onChange={handleCustomAmount}
                placeholder="Или введите свою сумму"
                className="card-input"
              />
            </div>
          </div>

          <div className="card-form">
            <div className="form-group">
              <label>Номер карты:</label>
              <input
                type="text"
                value={cardData.number}
                onChange={(e) => handleCardInput('number', e.target.value)}
                placeholder="0000 0000 0000 0000"
                className="card-input"
                maxLength={19}
              />
            </div>

            <div className="form-group">
              <label>Имя владельца:</label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => handleCardInput('name', e.target.value.toUpperCase())}
                placeholder="IVAN IVANOV"
                className="card-input"
              />
            </div>

            <div className="input-row">
              <div className="form-group">
                <label>Срок действия:</label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => handleCardInput('expiry', e.target.value)}
                  placeholder="MM/ГГ"
                  className="card-input"
                  maxLength={5}
                />
              </div>

              <div className="form-group">
                <label>CVC:</label>
                <input
                  type="text"
                  value={cardData.cvc}
                  onChange={(e) => handleCardInput('cvc', e.target.value)}
                  placeholder="123"
                  className="card-input cvc-input"
                  maxLength={3}
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            
            <button 
              type="submit" 
              disabled={isProcessing}
              className={isProcessing ? 'btn-primary processing' : 'btn-primary'}
            >
              {isProcessing ? 'Обработка...' : `Пополнить ${amount ? amount + ' ₽' : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BalanceModal;  