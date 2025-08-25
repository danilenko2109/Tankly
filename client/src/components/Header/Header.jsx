import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="container"> 
        <a href="/" className="logo">
          <img src="/logotank.png" alt="Tankly Logo" className="logo__icon"/>
          <span className="logo__text">Tankly</span>
        </a>
      </div>
    </header>
  );
};

export default Header;