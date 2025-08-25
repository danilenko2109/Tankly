
import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
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
  '5': 'wnnwwnnnn',
  '6': 'nnwwwnnnn',
  '7': 'nnnwnnwnw',
  '8': 'wnnwnnwnn',
  '9': 'nnwwnnwnn',
  'A': 'wnnnnwnnw',
  'B': 'nnwnnwnnw',
  'C': 'wnwnnwnnn',
  'D': 'nnnnwwnnw',
  'E': 'wnnnwwnnn',
  'F': 'nnwnwwnnn',
  'G': 'nnnnnwwnw',
  'H': 'wnnnnwwnn',
  'I': 'nnwnnwwnn',
  'J': 'nnnnwwwnn',
  'K': 'wnnnnnnww',
  'L': 'nnwnnnnww'
};

function Code39({ value = '', height = 100, stroke = 3, showText = true }) {
  const sanitized = `*${value.toUpperCase().replace(/[^A-Z0-9\-\.\/\+%\$ ]/g, '')}*`;
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

function PromotionsPage() {
  const discountCode = "DISCOUNT-2024-15%";

  return (
    <div className="promotions-page">
      <div className="animated-background">
        <div className="particles"></div>
        <div className="gradient-overlay"></div>
      </div>

      <div className="promotions-container">
  
        <div className="discount-banner glass-card">
          <h1>Ваша персональная скидка</h1>
          <p className="discount-amount">15% на всё топливо</p>
          
          <div className="barcode-container">
            <Code39 value={discountCode} height={120} stroke={4} />
          </div>
          
          <div className="discount-info">
            <div className="discount-detail">
              <span className="label">Код скидки:</span>
              <span className="value">{discountCode}</span>
            </div>
            <div className="discount-detail">
              <span className="label">Действует до:</span>
              <span className="value">31.12.2025</span>
            </div>
          </div>
        </div>

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

      <NavBar activeTab="promotions" />
    </div>
  );
}

export default PromotionsPage;