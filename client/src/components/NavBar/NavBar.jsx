import { MdHomeFilled } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";
import { FaRegMap } from "react-icons/fa6";
import { FaBarcode } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import "./NavBar.scss";

const NavBar = () => {
  const tabs = [
    { id: "home", path: "/", icon: <MdHomeFilled />, label: "Главная" },
    { id: "about", path: "/about-us", icon: <MdInfoOutline />, label: "О нас" },
    { id: "check", path: "/check", icon: <FaBarcode />, label: "Купон" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) => 
              `navbar__item ${isActive ? "navbar__item--active" : ""}`
            }
            aria-label={tab.label}
          >
            <div className="navbar__icon">{tab.icon}</div>
            <span className="navbar__label">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;