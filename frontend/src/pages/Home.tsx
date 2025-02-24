// frontend/src/pages/Home.tsx

import "../styles/Home.css";

import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <div className="content">
                <h1>The News Client</h1>
                <h3>Verifique os status de sua conta</h3>
                <div className="home-buttons">
                    <Link to="/login" className="btn">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
