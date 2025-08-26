import React, { useEffect, useMemo, useRef, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import BalanceModal from '../../components/BalanceModal/BalanceModal';
import Header from '../../components/Header/Header';

import './FuelPage.scss';
import TanklyLoadingScreen from '../../components/TanklyLoadingScreen/TanklyLoadingScreen';

const LS_KEYS = {
  state: 'fuelApp:premium:v4',
};

const saveState = (s) => {
  try {
    localStorage.setItem(LS_KEYS.state, JSON.stringify(s));
  } catch {
    console.log("Ошибка сохранения");
  }
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(LS_KEYS.state);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialPrices = {
  'ДТ': 69.2,
  'АИ-92': 58.9,
  'АИ-95+': 63.4,
  'ГАЗ': 28.5,
};

const DISCOUNTS = {
  basic: { petrol: -1.5, diesel: -1.2, gas: -0.3, name: 'Базовый', minPoints: 0, color: '#6B7280' },
  silver: { petrol: -2.0, diesel: -1.5, gas: -0.5, name: 'Серебряный', minPoints: 500, color: '#C0C0C0' },
  gold: { petrol: -3.0, diesel: -2.0, gas: -0.8, name: 'Золотой', minPoints: 1000, color: '#D4AF37' },
  platinum: { petrol: -4.0, diesel: -2.5, gas: -1.0, name: 'Платиновый', minPoints: 2000, color: '#E5E4E2' },
};

function deriveStatus(points) {
  if (points >= DISCOUNTS.platinum.minPoints) return 'platinum';
  if (points >= DISCOUNTS.gold.minPoints) return 'gold';
  if (points >= DISCOUNTS.silver.minPoints) return 'silver';
  return 'basic';
}

function formatMoney(n) { return (Number(n) || 0).toFixed(2); }

function FuelPage() {
  const hydrated = useRef(false);
  const [state, setState] = useState(() => {
    const saved = loadState();
    return (
      saved ?? {
        userBalance: 500.0,
        loyaltyPoints: 0,
        prices: initialPrices,
        history: [],
        lastStationId: null,
        favoriteFuel: null,
        activePayment: null,
      }
    );
  });

  useEffect(() => {
    if (hydrated.current) saveState(state);
  }, [state]);

  useEffect(() => { hydrated.current = true; }, []);

  const [selectedFuel, setSelectedFuel] = useState(state.favoriteFuel);
  const [fuelAmount, setFuelAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('balance');
  const [ setShowAddBalanceModal] = useState(false);
  const [ setCardNumber] = useState('');
  const [ setCardExpiry] = useState('');
  const [ setCardCVC] = useState('');
  const [ setCardName] = useState('');
  const [topUpAmount] = useState(1000);
  const [isDrifting, setIsDrifting] = useState(true);
  const [lastPricesUpdate, setLastPricesUpdate] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('prices');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentNotification, setPaymentNotification] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  const userStatus = useMemo(() => deriveStatus(state.loyaltyPoints), [state.loyaltyPoints]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  function baseDiscountForFuel(fuelType) {
    if (!fuelType || !userStatus || !DISCOUNTS[userStatus]) return 0;
    
    if (fuelType === 'ГАЗ') return DISCOUNTS[userStatus].gas || 0;
    if (fuelType === 'ДТ') return DISCOUNTS[userStatus].diesel || 0;
    return DISCOUNTS[userStatus].petrol || 0;
  }
  
  function finalPricePerL(fuelType) {
    const price = state.prices?.[fuelType] || 0;
    const baseDisc = baseDiscountForFuel(fuelType) || 0;
    return Math.max(0, Number((price + baseDisc).toFixed(1)));
  }
  
  useEffect(() => {
    if (selectedFuel && fuelAmount > 0) {
      setTotalPrice(formatMoney(finalPricePerL(selectedFuel) * fuelAmount));
    } else {
      setTotalPrice(0);
    }
  }, [selectedFuel, fuelAmount, state.prices, userStatus]);

  useEffect(() => {
    if (!isDrifting) return;
    const iv = setInterval(() => {
      setState(s => {
        const next = { ...s.prices };
        Object.keys(next).forEach(k => {
          const delta = (Math.random() - 0.5) * 0.2;
          next[k] = Math.max(10, Number((next[k] + delta).toFixed(1)));
        });
        return { ...s, prices: next };
      });
      setLastPricesUpdate(Date.now());
    }, 60 * 1000);
    return () => clearInterval(iv);
  }, [isDrifting]);
  

  
  const handleAddBalance = (amount) => {
    setBalance(prev => prev + amount);
     setShowAddBalanceModal(true);
  };
  

  function handleRefuel() {
    if (!selectedFuel || fuelAmount <= 0) {
      setPaymentNotification({
        type: 'error',
        message: 'Выберите топливо и укажите количество'
      });
      return;
    }
    
    setState(s => ({ ...s, favoriteFuel: selectedFuel }));
    setShowPaymentModal(true);
    setPaymentNotification(null);
  }

  function handlePayment() {
    const pricePerL = finalPricePerL(selectedFuel);
    const total = Number(pricePerL * fuelAmount);

    if (paymentMethod === 'balance' && (state.userBalance || 0) < total) {
      setPaymentNotification({
        type: 'error',
        message: 'На вашем балансе недостаточно средств для совершения операции'
      });
      return;
    }

    if (paymentMethod === 'card') {
      setPaymentNotification({
        type: 'error',
        message: 'В настоящее время оплата банковской картой недоступна. Пожалуйста, выберите другой способ оплаты.'
      });
      return;
    }

    const historyItem = {
      id: Date.now(),
      dateISO: new Date().toISOString(),
      stationId: state.lastStationId || 'A-12',
      fuel: selectedFuel,
      liters: fuelAmount,
      pricePerL,
      total: Number(total.toFixed(2)),
      payment: paymentMethod,
      status: 'paid',
      barcode: `FUEL-${Date.now()}`
    };

    setState(s => ({
      ...s,
      userBalance: paymentMethod === 'balance' ? Number(((s.userBalance || 0) - total).toFixed(2)) : (s.userBalance || 0),
      history: [historyItem, ...(s.history || [])].slice(0, 50),
      activePayment: historyItem
    }));

    setPaymentNotification({
      type: 'success',
      message: 'Топливо успешно приобретено! Перейдите в раздел "Мои купоны" и отсканируйте купон на заправке.'
    });

    setTimeout(() => {
      setShowPaymentModal(false);
      setFuelAmount(0);
      setPaymentNotification(null);
    }, 3000);
  }

  function getFuelIcon(f) {
    switch (f) { 
      case 'АИ-95+': return '🔥'; 
      case 'ГАЗ': return '🔵'; 
      default: return '⛽'; 
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'paid': return '⏳';
      case 'completed': return '✅';
      default: return '❓';
    }
  }

  if (isLoading) {
    return (
       <TanklyLoadingScreen/>
    );
  }

  return (

    <div className="fuel-page">
      <div className="animated-background">
      <Header></Header>
        <div className="particles"></div>
        <div className="gradient-overlay"></div>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal glass-card">
            <div className="success-content">
              <div className="success-icon">✅</div>
              <div className="success-message">{successMessage}</div>
              <button className="btn-primary" onClick={() => setShowSuccessModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      <header className="fuel-header">
        <div className="user-info">
          <div className="glass-card balance-card">
        <div>
          <span className="label">Баланс</span>
          <div className="value">{balance} ₽</div>
        </div>
        <button 
          className="add-balance-btn"
          onClick={() => setIsBalanceModalOpen(true)}
          title="Пополнить баланс"
        >
          +
        </button>
      </div>

      
          
          <div className="points-card glass-card">
            <div className="points-info">
              <span className="label">Баллы</span>
              <span className="value">{state.loyaltyPoints}</span>
            </div>
            <div className="status-badge" style={{ 
              background: 'rgba(212, 175, 55, 0.2)',
              color: '#D4AF37'
            }}>
             Скоро
            </div>
          </div>
        </div>
      </header>

      <nav className="section-nav">
        <button className={`nav-item ${activeTab === 'prices' ? 'active' : ''}`} onClick={() => setActiveTab('prices')}>
          <span className="nav-icon">⛽</span>
          <span className="nav-text">Топливо</span>
          <div className="nav-indicator"></div>
        </button>
        <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          <span className="nav-icon">📊</span>
          <span className="nav-text">История</span>
          <div className="nav-indicator"></div>
        </button>
      </nav>
<BalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        onAddBalance={handleAddBalance}
      />
      <div className="main-content">
        {activeTab === 'prices' && (
          <section className="fuel-prices">
            <div className="section-header">
              <h2 className="section-title">Актуальные цены</h2>
              <div className="prices-controls">
                <span className="update-time">Обновлено: {new Date(lastPricesUpdate).toLocaleTimeString()}</span>
                <label className="drift-toggle switch">
                  <input type="checkbox" checked={isDrifting} onChange={() => setIsDrifting(v => !v)} />
                  <span className="slider"></span>
                  <span className="toggle-text">Автообновление</span>
                </label>
              </div>
            </div>
            
            <div className="prices-grid">
              {Object.entries(state.prices || {}).map(([fuel, price]) => {
                const finalP = finalPricePerL(fuel);
                const baseDisc = baseDiscountForFuel(fuel);
                const isSelected = selectedFuel === fuel;
                const discountPercent = ((price - finalP) / price * 100).toFixed(0);
                
                return (
                  <div key={fuel} className={`price-card glass-card ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedFuel(fuel)}>
                    <div className="fuel-header">
                      <div className="fuel-name">
                        <span className="fuel-icon">{getFuelIcon(fuel)}</span>
                        <span>{fuel}</span>
                      </div>
                      <div className="fuel-pricing">
                        <span className="final-price">{finalP} ₽</span>
                        <span className="base-price">{price.toFixed(1)} ₽</span>
                        {discountPercent > 0 && <span className="discount-badge">-{discountPercent}%</span>}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="fuel-details">
                        <div className="price-breakdown">
                          <span className="breakdown-item">Ваша скидка: {Math.abs(baseDisc).toFixed(1)} ₽/л</span>
                        </div>
                        
                        <div className="amount-selector">
                          <label htmlFor="fuel-amount">Количество литров:</label>
                          <div className="amount-controls">
                            <button className="amount-btn" onClick={(e) => { e.stopPropagation(); setFuelAmount(prev => Math.max(0, prev - 1)); }}>-</button>
                            <input type="number" id="fuel-amount" min="0" step="1" value={fuelAmount} onChange={e => setFuelAmount(Math.max(0, parseFloat(e.target.value) || 0))} placeholder="0" />
                            <button className="amount-btn" onClick={(e) => { e.stopPropagation(); setFuelAmount(prev => prev + 1); }}>+</button>
                          </div>
                        </div>
                        
                        {fuelAmount > 0 && (
                          <div className="total-section">
                            <div className="total-price">Итого: <span>{totalPrice} ₽</span></div>
                            <button className="refuel-btn glow-button" onClick={handleRefuel}>
                              <span className='add-card-btn'>Заправить</span>
                              <div className="btn-glow"></div>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === 'history' && (
          <section className="history-section">
            <div className="section-header">
              <h2 className="section-title">История операций</h2>
              <span className="history-count">{state.history?.length || 0}</span>
            </div>
            
            {!state.history || state.history.length === 0 ? (
              <div className="empty-state glass-card">
                <div className="empty-icon">📋</div>
                <p>Пока нет операций</p>
                <small>После заправки здесь появятся ваши транзакции</small>
              </div>
            ) : (
              <div className="history-list">
                {state.history.map(h => (
                  <div key={h.id} className="history-item glass-card">
                    <div className="history-main">
                      <div className="history-title">{h.fuel} · {h.liters} л</div>
                      <div className="history-amount">-{formatMoney(h.total)} ₽</div>
                    </div>
                    <div className="history-details">
                      <div className="history-date">{new Date(h.dateISO).toLocaleString()}</div>
                      <div className="history-meta">
                        {h.payment === 'balance' ? 'С баланса' : 'Картой'}
                        <span className={`status status-${h.status}`}>
                          {getStatusIcon(h.status)} {h.status === 'paid' ? 'Ожидает' : 'Завершено'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal glass-card">
            <h3>Оплата заправки</h3>
            
            {paymentNotification && (
              <div className={`payment-notification ${paymentNotification.type}`}>
                <div className="notification-icon">
                  {paymentNotification.type === 'success' ? '✅' : '❌'}
                </div>
                <div className="notification-message">
                  {paymentNotification.message}
                </div>
              </div>
            )}
            
            {!paymentNotification || paymentNotification.type === 'error' ? (
              <>
                <div className="payment-details">
                  <div className="detail-row"><span>Топливо:</span><span>{selectedFuel}</span></div>
                  <div className="detail-row"><span>Количество:</span><span>{fuelAmount} л</span></div>
                  <div className="detail-row"><span>Цена за литр:</span><span>{finalPricePerL(selectedFuel)} ₽</span></div>
                  <div className="detail-row total"><span>Сумма:</span><span>{totalPrice} ₽</span></div>
                </div>
                
                <div className="payment-methods">
                  <h4>Способ оплаты</h4>
                  <div className="method-options">
                    <label className="method-option">
                      <input type="radio" name="payment-method" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      <span>Банковская карта</span>
                    </label>
                    <label className="method-option">
                      <input type="radio" name="payment-method" value="balance" checked={paymentMethod === 'balance'} onChange={() => setPaymentMethod('balance')} />
                      <span>Баланс приложения ({formatMoney(state.userBalance || 0)} ₽)</span>
                    </label>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button className="mainbtn" onClick={() => setShowPaymentModal(false)}>Отмена</button>
                  <button className="mainbtn" onClick={handlePayment}>Оплатить</button>
                </div>
              </>
            ) : (
              <div className="modal-actions">
                <button className="mainbtn" onClick={() => {
                  setShowPaymentModal(false);
                  setFuelAmount(0);
                  setPaymentNotification(null);
                }}>Закрыть</button>
              </div>
            )}
          </div>
        </div>
      )}

      <NavBar activeTab="fuel" />
    </div>
  );
}

export default FuelPage;