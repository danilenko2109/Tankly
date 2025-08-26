import React, { useState, useEffect } from 'react'; 
import NavBar from '../../components/NavBar/NavBar'; 
import Header from '../../components/Header/Header';
import './PromotionsPage.scss'; 

const SoonBanner = () => (
  <div className="soon-banner">
    <span>Скоро</span>
  </div>
);

const CODE39 = {
  '0': 'nnnwwnwnn',
  '1': 'wnnwnnnnw',
  '2': 'nnwwnnnnw',
  '3': 'wnwwnnnnn',
  '4': 'nnnwwnnnw',
  
  'A': 'wnnnnwnnw',
  'B': 'nnwnnwnnw',
  'C': 'wnwnnwnnn',
 
};

function Code39({ value = '', height = 100, stroke = 3, showText = true }) {
  const sanitized = `${value.toUpperCase().replace(/[^A-Z0-9\-\.\/\+%\$ ]/g, '')}`;
  let x = 0;
  const bars = [];
  const gap = stroke;
  
  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];
    const pattern = CODE39[char];
    if (!pattern) continue;
    
    for (let j = 0; j < pattern.length; j++) {
      const isBar = j % 2 === 0;
      const wide = pattern[j] === 'w';
      const w = wide ? stroke * 3 : stroke;
      
      if (isBar) {
        bars.push(<rect key={`${i}-${j}`} x={x} y={0} width={w} height={height} rx={2} />);
      }
      x += w;
    }
    x += gap;
  }
  
  return (
    <div className="barcode">
      <svg width={x} height={height} viewBox={`0 0 ${x} ${height}`} xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">{bars}</g>
      </svg>
      {showText && <div className="barcode__text">{value}</div>}
    </div>
  );
}

function AddCardModal({ isOpen, onClose, onAddCard }) {
  const [cardNumber, setCardNumber] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('lukoil');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber.trim()) {
      setError('Введите номер карты');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 5000));
      
      if (cardNumber.length < 8) {
        throw new Error('Неверный формат номера карты');
      }
      
      onAddCard({
        number: cardNumber,
        partner: selectedPartner,
        status: 'loading',
        addedAt: new Date().toISOString()
      });
      
      setCardNumber('');
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка при проверке карты');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card">
        <div className="modal-header">
          <h2>Привязать карту</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-notice">
          <p>Проверка карты в базе займет от 5 до 10 минут</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Выберите партнера:</label>
            <div className="partner-selector">
              <div className={`partner-option ${selectedPartner === 'lukoil' ? 'active' : ''}`} 
                   onClick={() => setSelectedPartner('lukoil')}>
                <div className="partner-logo lukoil">
                  <img src="/Lukoil.svg" alt="Лукойл" width='60px' />
                </div>
                <span className='company_name'>Лукойл</span>
              </div>
              
              <div className={`partner-option ${selectedPartner === 'rosneft' ? 'active' : ''}`} 
                   onClick={() => setSelectedPartner('rosneft')}>
                <div className="partner-logo rosneft">
                  <img src="/Rosneft.svg" alt="Роснефть" width="60px" />
                </div>
                <span className='company_name'>Роснефть</span>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="cardNumber">Номер карты:</label>
            <input 
              type="text" 
              id="cardNumber" 
              value={cardNumber} 
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Введите номер карты" 
              disabled={isProcessing}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="modal-actions">
            <button type="submit" disabled={isProcessing} className={isProcessing ? 'processing' : ''} className="mainbtn">
              {isProcessing ? 'Проверка...' : 'Добавить карту'}
            </button>
            <button type="button" onClick={onClose} disabled={isProcessing} className="mainbtn" background-color="red">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserCards({ cards, onAddCard, onDeleteCard }) {
  return (
    <div className="user-cards glass-card">
      <div className="user-cards-header">
        <h2>Мои карты</h2>
        <button className="add-card-btn" onClick={onAddCard}>
          + Добавить карту
        </button>
      </div>
      
      {cards.length === 0 ? (
        <div className="no-cards">
          <p>У вас пока нет привязанных карт</p>
        </div>
      ) : (
        <div className="cards-list">
  {cards.map((card, index) => (
    <div key={index} className="card-item">
      <div className={`card-logo ${card.partner}`}>
        <img 
          src={card.partner === 'lukoil' ? '/Lukoil.svg' : '/Rosneft.svg'} 
          alt={card.partner === 'lukoil' ? 'Лукойл' : 'Роснефть'}
          className="partner-logo-img" width="50px"
        />
      </div>
      <div className="card-info">
        <div className="card-number">**** {card.number.slice(-4)}</div>
        <div className={`card-status ${card.status}`}>
          {card.status === 'active' ? 'Активна' : 'Загрузка...'}
        </div>
      </div>
      <button 
        className="delete-card-btn"
        onClick={() => onDeleteCard(index)}
        title="Удалить карту"
      >
        ×
      </button>
    </div>
  ))}
</div>
      )}
    </div>
  );
}

function PromotionsPage() {
  const discountCode = "DISCOUNT-2025-15%";
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [userCards, setUserCards] = useState([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const checkCardStatus = (cards) => {
    const now = new Date();
    return cards.map(card => {
      if (card.status === 'loading') {
        const addedTime = new Date(card.addedAt);
        const diffMinutes = (now - addedTime) / (1000 * 60);
        
        if (diffMinutes >= 10) {
          return { ...card, status: 'active' };
        }
      }
      return card;
    });
  };

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedPromotions');
    if (!hasVisited) {
      setShowWelcomeModal(true);
      localStorage.setItem('hasVisitedPromotions', 'true');
    }

    const savedCards = localStorage.getItem('userCards');
    if (savedCards) {
      const parsedCards = JSON.parse(savedCards);
      const updatedCards = checkCardStatus(parsedCards);
      setUserCards(updatedCards);
      localStorage.setItem('userCards', JSON.stringify(updatedCards));
    }

    const interval = setInterval(() => {
      setUserCards(prevCards => {
        const updatedCards = checkCardStatus(prevCards);
        localStorage.setItem('userCards', JSON.stringify(updatedCards));
        return updatedCards;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAddCard = (cardData) => {
    const newCards = [...userCards, cardData];
    setUserCards(newCards);
    localStorage.setItem('userCards', JSON.stringify(newCards));
  };

  const handleDeleteCard = (index) => {
    const newCards = userCards.filter((_, i) => i !== index);
    setUserCards(newCards);
    localStorage.setItem('userCards', JSON.stringify(newCards));
  };

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <div className="promotions-page">
      <Header></Header>
      <div className="animated-background">
        <div className="particles"></div>
        <div className="gradient-overlay"></div>
      </div>
      
      <div className="promotions-container">
        <div className="discount-banner glass-card">
          <h1>Ваша персональная скидка</h1>
          <p className="discount-amount">15% на всё топливо</p>
          
          <div className="barcode-container">
            <Code39 value={discountCode} height={100} stroke={3} />
          </div>
          
          <div className="discount-info">
            <div className="discount-detail">
              {/* <span className="label">Код скидки:</span>
              <span className="value">{discountCode}</span> */}
            </div>
            <div className="discount-detail">
              <span className="label">Действует до:</span>
              <span className="value">31.12.2025</span>
            </div>
          </div>
        </div>

        <UserCards 
          cards={userCards} 
          onAddCard={() => setShowAddCardModal(true)} 
          onDeleteCard={handleDeleteCard}
        />

        <div className="instruction-card glass-card">
          <h2>🎯 Как использовать скидки</h2>
          <p>Для активации скидок на заправке:</p>
          <ol>
            <li>Покажите этот штрих-код кассиру</li>
            <li>Или отсканируйте его на терминале</li>
            <li>Скидка aplicará автоматически</li>
            <li>Оплатите заказ любым способом</li>
          </ol>
        </div>

        <div className="promotions-grid">
          <div className="promotion-card glass-card">
            <div className="promotion-icon">⛽</div>
            <h3>Постоянная скидка</h3>
            <p>Всегда получайте скидку до 4₽/л в зависимости от вашего статуса</p>
            <div className="promotion-discount">До -4₽/л</div>
          </div>
          
          <div className="promotion-card glass-card">
            <SoonBanner />
            <div className="promotion-icon">🌙</div>
            <h3>Ночная заправка</h3>
            <p>С 22:00 до 06:00 дополнительная скидка 2%</p>
            <div className="promotion-discount">-2%</div>
          </div>
          
          <div className="promotion-card glass-card">
            <SoonBanner />
            <div className="promotion-icon">🎂</div>
            <h3>День рождения</h3>
            <p>В день рождения получайте двойную скидку</p>
            <div className="promotion-discount">x2 скидка</div>
          </div>
          
          <div className="promotion-card glass-card">
            <SoonBanner />
            <div className="promotion-icon">☕</div>
            <h3>Кофе + топливо</h3>
            <p>При покупке кофе скидка 1.5₽ на каждый литр</p>
            <div className="promotion-discount">-1.5₽/л</div>
          </div>
          
          <div className="promotion-card glass-card">
            <SoonBanner />
            <div className="promotion-icon">👥</div>
            <h3>Приведи друга</h3>
            <p>Приведите друга и получите +500 бонусных баллов</p>
            <div className="promotion-discount">+500 баллов</div>
          </div>
          
          <div className="promotion-card glass-card">
            <SoonBanner />
            <div className="promotion-icon">💳</div>
            <h3>Картой онлайн</h3>
            <p>Оплата картой через приложение - дополнительно 1%</p>
            <div className="promotion-discount">-1%</div>
          </div>
        </div>

        <div className="qr-instruction glass-card">
          <h2>📱 Где использовать штрих-код</h2>
          <div className="qr-locations">
            <div className="qr-location">
              <div className="location-icon">🏪</div>
              <div className="location-info">
                <h4>На кассе</h4>
                <p>Покажите штрих-код кассиру при оплате</p>
              </div>
            </div>
            
            <div className="qr-location">
              <div className="location-icon">📱</div>
              <div className="location-info">
                <h4>На терминале</h4>
                <p>Отсканируйте код на платежном терминале</p>
              </div>
            </div>
            
            <div className="qr-location">
              <div className="location-icon">⛽</div>
              <div className="location-info">
                <h4>На колонке</h4>
                <p>Используйте перед началом заправки</p>
              </div>
            </div>
          </div>
        </div>

        <div className="terms-section glass-card">
          <h3>📋 Условия использования скидок</h3>
          <ul>
            <li>Скидки не суммируются с другими акциями</li>
            <li>Максимальная скидка 20% от суммы чека</li>
            <li>Действует на все виды топлива</li>
            <li>Не распространяется на сопутствующие товары</li>
            <li>Акция действует на всех АЗС сети</li>
          </ul>
        </div>
      </div>

      <AddCardModal 
        isOpen={showAddCardModal} 
        onClose={() => setShowAddCardModal(false)} 
        onAddCard={handleAddCard} 
      />

      {showWelcomeModal && (
        <div className="modal-overlay">
          <div className="modal-content welcome-modal glass-card">
            <div className="modal-header">
              <h2>Приветствуем в программе лояльности!</h2>
            </div>
            
            <div className="welcome-content">
              <p>Для получения максимальных скидок привяжите свои карты заправок</p>
              
              <div className="partners-showcase">
                <div className="partner-card">
                  <div className="partner-logo lukoil">Лукойл</div>
                  <p>Скидки до 5%</p>
                </div>
                
                <div className="partner-card">
                  <div className="partner-logo rosneft">Роснефть</div>
                  <p>Скидки до 4%</p>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button onClick={closeWelcomeModal}>Понятно</button>
              <button 
                onClick={() => {
                  closeWelcomeModal();
                  setShowAddCardModal(true);
                }} 
                className="primary"
              >
                Привязать карту
              </button>
            </div>
          </div>
        </div>
      )}

      <NavBar activeTab="promotions" />
    </div>
  );
}

export default PromotionsPage;