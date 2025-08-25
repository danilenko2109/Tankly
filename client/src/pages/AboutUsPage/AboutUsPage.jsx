import React from 'react';
import './AboutUsPage.scss';

const AboutUsPage = () => {
  const partners = [
    "Лукойл",
    "Роснефть",
    "Газпромнефть",
    "Татнефть",
    "Башнефть",
    "Сургутнефтегаз",
    "ТНК",
    "АЗС 777",
    "Экоойл",
    "Несте"
  ];

  return (
    <div className="about-us-page">
      <div className="about-header">
        <div className="logo">
          <div className="logo-icon">⛽</div>
        </div>
        <h1>Tankly</h1>
        <p className="subtitle">Сервис для экономии на заправках</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Наша история</h2>
          <div className="text-content">
            <p>
              Tankly родился из простой идеи — сделать заправку автомобиля более выгодной 
              и удобной для каждого водителя. Основанный в 2022 году, наш сервис объединил 
              ведущие автозаправочные сети России, чтобы предложить пользователям 
              максимальные скидки и кэшбэк за топливо.
            </p>
            <p>
              Сегодня Tankly — это современное мобильное приложение, которое помогает 
              тысячам автовладельцев экономить на каждой заправке. Мы постоянно 
              развиваемся и добавляем новых партнеров, чтобы сделать наши предложения 
              еще выгоднее.
            </p>
          </div>
        </section>

        <section className="partners-section">
          <h2>Наши партнеры</h2>
          <p className="partners-description">
            Мы сотрудничаем с ведущими автозаправочными сетями России, 
            чтобы предоставить вам лучшие условия на заправках по всей стране.
          </p>
          
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div key={index} className="partner-card">
                <div className="partner-logo">
                  {partner.slice(0, 2)}
                </div>
                <div className="partner-name">{partner}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="advantages-section">
          <h2>Преимущества Tankly</h2>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">💰</div>
              <h3>Кэшбэк до 10%</h3>
              <p>Возвращаем часть средств за каждую заправку</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">📱</div>
              <h3>Удобное приложение</h3>
              <p>Все скидки и акции в вашем смартфоне</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">🗺️</div>
              <h3>По всей России</h3>
              <p>Тысячи АЗС-партнеров по всей стране</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">⚡</div>
              <h3>Мгновенные уведомления</h3>
              <p>Узнавайте о выгодных акциях первыми</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;