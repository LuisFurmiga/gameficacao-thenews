// frontend/src/pages/Login.tsx

import "../styles/Login.css";

import { useForm } from "react-hook-form";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";

import { AuthContext } from "../contexts/AuthContext";
import { loginReader } from "../services/readerService";
import api from "../services/api";

interface LoginFormInputs {
    email: string;
}

const schema = yup.object().shape({
    email: yup.string().email("Email inválido").required("O email é obrigatório"),
});

const Login: React.FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: LoginFormInputs) => {
        setLoading(true);
        try {
            const response = await loginReader(data.email);

            // Captura o token da resposta
            const token = response.token;
            localStorage.setItem("token", token);

            // Decodifica o token para obter o email
            const decoded: any = jwtDecode(token);

            // Verifica se o AuthContext existe antes de chamar setUser
            if (authContext?.setUser) {
                authContext.setUser({ email: decoded.email, token });
            }

            // Define o token nas requisições da API
            api.defaults.headers.Authorization = `Bearer ${token}`;

            // Verifica se o email termina com "@admin.com"
            if (decoded.email.endsWith("@admin.com")) {
                navigate("/dashboardAdmin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Erro no login", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="email" placeholder="Email" {...register("email")} />
                {errors.email && <p>{errors.email.message}</p>}

                <button type="submit" disabled={loading}>{loading ? "Carregando..." : "Entrar"}</button>
            </form>
        </div>
    );
};

export default Login;
