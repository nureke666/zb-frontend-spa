import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Подключаем твой CSS

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Состояния для JS логики
  const[isMenuOpen, setIsMenuOpen] = useState(false);
  const [iin, setIin] = useState('');

  // Логика бургер-меню
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Логика проверки ИИН
  const handleCheckIin = () => {
    const iinValue = iin.trim();
    if (!iinValue) {
      alert('Пожалуйста, введите ИИН');
      return;
    }
    if (iinValue.length !== 12 || isNaN(Number(iinValue))) {
      alert('Ошибка: ИИН должен состоять из 12 цифр.');
    } else {
      alert(`Вы ввели ИИН: ${iinValue}\n(Статус: Заявка в обработке...)`);
    }
  };

  return (
    <div className="landing-wrapper">
      {/* Шапка */}
      <header>
        <div className="container header-inner">
          <div className="header-top">
            <div className="logos">
              <span>Zharqyn Bolashaq</span>
            </div>
            {/* Кнопка меню для мобильных */}
            <div className="burger-menu" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {/* Навигация */}
          <div className={`nav-wrapper ${isMenuOpen ? 'active' : ''}`}>
            <nav>
              <ul>
                <li><a href="#">Главная</a></li>
                <li><a href="#">О программе</a></li>
                <li><a href="#">Учебные заведения</a></li>
                <li><a href="#">Новости</a></li>
                <li><a href="#">Вопросы и ответы</a></li>
              </ul>
            </nav>
            <div className="header-actions">
              <span>KZ | <b>RU</b> | ENG</span>
              <button className="btn-login" onClick={() => navigate('/login')}>
                Войти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Главный экран */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="subtitle">ОБРАЗОВАТЕЛЬНАЯ ПРОГРАММА</span>
            <h1>Гранты «Жарқын Болашақ» для молодежи Мангистау</h1>
            <p className="hero-desc">
              Получите бесплатное образование в лучших колледжах и ВУЗах страны с гарантированным трудоустройством
            </p>
            <div className="hero-buttons">
              <a href="#" className="btn-main">Подать заявку</a>
              <a href="#" className="link-how">Как это работает?</a>
            </div>
          </div>
          <div className="hero-img">
            <img 
              src="https://via.placeholder.com/600x400?text=Студенты" 
              alt="Students" 
            />
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="stats">
        <div className="container stats-inner">
          <div className="stat-item">
            <h3>1100+</h3>
            <p>Грантов выделено</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>ВУЗов партнеров</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Трудоустройство</p>
          </div>
        </div>
      </section>

      {/* Проверка статуса */}
      <section className="check-status">
        <div className="container check-box">
          <h3>Проверьте статус вашей заявки</h3>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Введите ИИН" 
              value={iin}
              onChange={(e) => setIin(e.target.value)}
            />
            <button className="btn-check" onClick={handleCheckIin}>
              Проверить
            </button>
          </div>
        </div>
      </section>

      {/* Партнеры */}
      <section className="partners">
        <div className="container">
          <h2 className="section-title">Учебные заведения-партнеры</h2>
          <p className="section-desc">Более 50 колледжей и университетов по всему Казахстану</p>
          
          <div className="partners-content">
            <div className="partners-map">
              <img 
                src="https://via.placeholder.com/600x400?text=Карта+Казахстана" 
                alt="Map" 
              />
            </div>
            <div className="partners-list">
              <div className="partner-card">
                <div className="partner-logo"></div>
                <div className="partner-info">
                  <h4>Yessenov University</h4>
                  <p>г. Актау, 150 грантов.</p>
                </div>
              </div>
              <div className="partner-card">
                <div className="partner-logo"></div>
                <div className="partner-info">
                  <h4>Atyrau University</h4>
                  <p>г. Атырау, 100 грантов.</p>
                </div>
              </div>
              <div className="partner-card">
                <div className="partner-logo"></div>
                <div className="partner-info">
                  <h4>Satbayev University</h4>
                  <p>г. Алматы, 150 грантов.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Новости */}
      <section className="news">
        <div className="container">
          <div className="news-header">
            <h2>Последние новости</h2>
            <a href="#" className="link-all">Все новости →</a>
          </div>
          
          <div className="news-grid">
            <div className="news-card">
              <img src="https://via.placeholder.com/350x200" alt="News" />
              <div className="news-card-content">
                <span className="news-date">12.12.2023</span>
                <p className="news-text">Старт приема заявок на новый учебный год...</p>
                <a href="#" className="news-read">Читать далее →</a>
              </div>
            </div>
            <div className="news-card">
              <img src="https://via.placeholder.com/350x200" alt="News" />
              <div className="news-card-content">
                <span className="news-date">15.12.2023</span>
                <p className="news-text">Встреча со студентами в Актау прошла успешно...</p>
                <a href="#" className="news-read">Читать далее →</a>
              </div>
            </div>
            <div className="news-card">
              <img src="https://via.placeholder.com/350x200" alt="News" />
              <div className="news-card-content">
                <span className="news-date">20.12.2023</span>
                <p className="news-text">Новые условия для получения грантов...</p>
                <a href="#" className="news-read">Читать далее →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h5>Zharqyn Bolashaq</h5>
              <p>Национальная платформа управления образовательными грантами</p>
            </div>
            <div className="footer-col">
              <ul className="footer-links">
                <li><a href="#">Быстрые ссылки</a></li>
                <li><a href="#">О программе</a></li>
                <li><a href="#">Гранты</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <ul className="footer-links">
                <li><a href="#">Поддержка</a></li>
                <li><a href="#">Центр помощи</a></li>
                <li><a href="#">Политика конфиденциальности</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <ul className="footer-links">
                <li>Контакты</li>
                <li>info@zharqyn.kz</li>
                <li>+7 (7172) 123-456</li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            © 2026 Zharqyn Bolashaq. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;