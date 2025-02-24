// frontend/src/components/Header.tsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/thenews_logo.png";

interface NavLink {
  path: string;
  label: string;
}

const Header: React.FC = () => {
  const location = useLocation();

  // Se estiver no dashboard, os links não serão exibidos
  const isDashboard = location.pathname === "/dashboard" || location.pathname === "/dashboardAdmin";

  // Lista de links de navegação
  const navLinks: NavLink[] = [
    { path: "/", label: "Home" },
    { path: "/login", label: "Login" },
  ];

  return (
    <header className="header">
      <div className="container">
        <img src={logo} alt="TheNews Logo" className="logo" />
        {!isDashboard && ( // Se NÃO estiver no dashboard, mostra os links
          <nav>
            <ul>
              {navLinks
                .filter((link) => link.path !== location.pathname) // Oculta o link da página atual
                .map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
