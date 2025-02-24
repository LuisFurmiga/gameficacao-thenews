// frontend/src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";
import { loginReader } from '../services/readerService';

interface User {
    email: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
    loginReader: (email: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token); // Decodifica o token
                setUser({ email: decoded.email, token }); // Armazena email e token
            } catch (error) {
                console.error("Erro ao decodificar token:", error);
                setUser(null);
            }
        }
        setLoading(false);
    }, []);  

    const handleLogin = async (email: string) => {
        try {
            const response = await loginReader(email);
            if (response?.data?.token) {
                localStorage.setItem("token", response.data.token);
    
                // Decodifica o token para extrair o e-mail do usuário
                const decoded: any = jwtDecode(response.data.token);
                
                // Define o usuário com email e token
                setUser({ email: decoded.email, token: response.data.token });
            } else {
                console.error("Erro: Token inválido na resposta do servidor.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, loginReader: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
