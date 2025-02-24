// frontend/src/routes/ProtectedRoute.tsx

import { useContext, useEffect, ReactNode } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authContext?.user) {
            navigate("/dashboard"); // Se estiver logado, redireciona para o Dashboard
        }
    }, [authContext?.user, navigate]);

    return authContext?.user ? children : null;
};

export default ProtectedRoute;
