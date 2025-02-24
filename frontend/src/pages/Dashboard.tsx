// frontend/src/pages/Dashboard.tsx

import "../styles/Dashboard.css";

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

import api from "../services/api";
import { getRandomMessage } from "../components/motivationalMessages";

interface Opening {
    newsletter_id: number;
    resource_id: string;
    opened_at: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_channel: string;
}

const Dashboard: React.FC = () => {
    const { user, logout } = useContext(AuthContext) ?? {};
    const navigate = useNavigate();

    const [stats, setStats] = useState<{ currentStreak: number; longestStreak: number; lastOpenedDate: string } | null>(null);
    const [openings, setOpenings] = useState<Opening[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchUserStats = async () => {
            try {
                const response = await api.get(`/reader/stats?email=${user.email}`, {
                    headers: { Authorization: `Bearer ${user.token}` }, // Envia o token na requisição
                });
                setStats(response.data);
            } catch (err) {
                setError("Erro ao buscar estatísticas.");
            }
        };

        const fetchOpenings = async () => {
            try {
                const response = await api.get(`/reader/openings?email=${user.email}`, {
                    headers: { Authorization: `Bearer ${user.token}` }, // Envia o token na requisição
                });
                const openingsWithResource = await Promise.all(response.data.map(async (opening: Opening) => {
                    const resourceResponse = await api.get(`/reader/newsletter?newsletter_id=${opening.newsletter_id}`, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    });
                    return {
                        ...opening,
                        resource_id: resourceResponse.data.resource_id, // Adiciona resource_id ao objeto
                    };
                }));
                setOpenings(openingsWithResource);
            } catch (err) {
                setError("Erro ao buscar histórico de leituras.");
            }
        };

        Promise.all([fetchUserStats(), fetchOpenings()]).finally(() => setLoading(false));
    }, [user, navigate]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "Nenhuma leitura registrada";
        return new Date(dateString).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    };

    const getMotivationalMessage = () => {
        if (!stats) return getRandomMessage("neutral").message;
        if ((stats.currentStreak >= stats.longestStreak) && (stats.longestStreak > 1)) return getRandomMessage("good").message;
        if (stats.currentStreak > 5) return getRandomMessage("good").message;
        return getRandomMessage("neutral").message;
    };

    return (
        <div className="dashboard-container">
            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="stats-container">
                    <h2>📊 Seus Stats</h2>
                    <p><strong>🔥 Streak Atual:</strong> {stats?.currentStreak} dias</p>
                    <p><strong>🏆 Maior Streak:</strong> {stats?.longestStreak} dias</p>
                    <p><strong>📅 Última leitura:</strong> {formatDate(stats?.lastOpenedDate || "")}</p>

                    <h3 className="motivation">{getMotivationalMessage()}</h3>

                    <h2>📜 Histórico de Leituras</h2>
                    {openings.length > 0 ? (
                        <table className="reading-table">
                            <thead>
                                <tr>
                                    <th>📅 Data</th>
                                    <th>📰 Newsletter</th>
                                    <th>🌍 Origem</th>
                                    <th>📢 Meio</th>
                                    <th>🎯 Campanha</th>
                                    <th>📡 Canal</th>
                                </tr>
                            </thead>
                            <tbody>
                            {openings.map((opening, index) => (
                                <tr key={index}>
                                    <td>{new Date(opening.opened_at).toLocaleDateString("pt-BR")}</td>
                                    <td>{opening.resource_id}</td>
                                    <td>{opening.utm_source}</td>
                                    <td>{opening.utm_medium}</td>
                                    <td>{opening.utm_campaign}</td>
                                    <td>{opening.utm_channel}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Ainda não há leituras registradas.</p>
                    )}
                    <button className="logout-button" onClick={logout}>Sair</button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
