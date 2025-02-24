import "../styles/DashboardAdmin.css";

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"; // Seria usado para o gráfico de engajamento diário
import { BarChart, Bar } from "recharts"; // Seria usado para o gráfico de newsletter
import { PieChart, Pie, Cell } from "recharts"; // Seria usado para o gráfico de UTMs

import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

interface Reader {
    email: string;
}

interface AdminMetrics {
    totalOpenings: number;
    totalReaders: number;
    averageStreak: number;
}

interface ReaderRanking {
    reader: Reader;
    longest_streak: number;
    current_streak: number;
}

const DashboardAdmin: React.FC = () => {
    const { user, logout } = useContext(AuthContext) ?? {};
    const navigate = useNavigate();

    const [AdminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);
    const [statistics, setStatistics] = useState<AdminMetrics | null>(null);
    const [ranking, setRanking] = useState<ReaderRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newsletters, setNewsletters] = useState<{ id: number; resource_id: string }[]>([]);
    const [selectedNewsletter, setSelectedNewsletter] = useState<string>("*"); // Padrão: todas as newsletters
    const [streakStatus, setStreakStatus] = useState<string>("1"); // Padrão: todos os leitores

    const [engagementData, setEngagementData] = useState([]);
    const [newsletterData, setNewsletterData] = useState([]);
    const [utmData, setUtmData] = useState([]);


    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        } else {
            fetchNewsletters();
            fetchFilteredData();
            fetchEngagementData();
        }
    
        const fetchAdminMetrics = async () => {
            try {
                const response = await api.get("/admin/metrics", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setAdminMetrics(response.data);
            } catch (err) {
                setError("Erro ao buscar estatísticas administrativas.");
            }
        };
    
        const fetchRanking = async () => {
            try {
                const response = await api.get("/admin/top-readers", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setRanking(response.data);
            } catch (err) {
                setError("Erro ao buscar ranking de leitores.");
            }
        };
    
        Promise.all([fetchAdminMetrics(), fetchRanking()]).finally(() => setLoading(false));
    }, [user, navigate, selectedNewsletter, streakStatus]);

    const fetchNewsletters = async () => {
        try {
            const response = await api.get("/admin/newsletters"); // Rota da API que retorna os newsletters
            setNewsletters(response.data); // Salva os dados no estado
        } catch (error) {
            console.error("Erro ao buscar newsletters:", error);
        }
    };
    
    const fetchFilteredData = async () => {
        try {
            const response = await api.get("/admin/metrics", {
                params: {
                    newsletterId: selectedNewsletter,
                    streakStatus: streakStatus,
                },
            });
            setStatistics(response.data);
        } catch (error) {
            console.error("Erro ao buscar estatísticas", error);
        }
    };

    const fetchEngagementData = async () => {
        try {
            const response = await api.get("/admin/metrics", {
                headers: { Authorization: `Bearer ${user?.token}` }
            });

            //setEngagementData(response.data.dailyEngagement); // Dados para gráfico de linhas
            //setNewsletterData(response.data.newsletterEngagement); // Dados para gráfico de barras
            //setUtmData(response.data.utmDistribution); // Dados para gráfico de pizza
        } catch (error) {
            console.error("Erro ao buscar engajamento", error);
        }
    };

    return (
        <div className="dashboard-container">
            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="stats-container">
                    <h2>📊 Painel Administrativo</h2>
                    <p><strong>📬 Total de Aberturas:</strong> {statistics?.totalOpenings || AdminMetrics?.totalOpenings}</p>
                    <p><strong>👥 Leitores Únicos:</strong> {statistics?.totalReaders || AdminMetrics?.totalReaders}</p>
                    <p><strong>🔥 Média de Streaks:</strong> {statistics?.averageStreak ? Number(statistics?.averageStreak).toFixed(2) : AdminMetrics?.averageStreak ? Number(AdminMetrics?.averageStreak).toFixed(2) : "0.00"} dias</p>

                    <div className="filters">
                        <h2>🔍Filtros </h2> 
                        <label>
                            Newsletter:
                            <select value={selectedNewsletter} onChange={(e) => setSelectedNewsletter(e.target.value)}>
                                <option value="*">Todas</option>
                                {newsletters.map((newsletter) => (
                                    <option key={newsletter.id} value={newsletter.resource_id}>
                                        {newsletter.resource_id}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Streak atual maior que:
                            <input
                                type="number"
                                value={streakStatus}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) { // Garante que apenas números inteiros sejam aceitos
                                        setStreakStatus(value);
                                    }
                                }}
                                placeholder="Digite um número"
                                min="1"
                            />
                        </label>
                    </div>

                    <h2>🏆 Ranking de Leitores</h2>
                    {ranking.length > 0 ? (
                        <table className="ranking-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Maior Streak</th>
                                    <th>Streak Atual</th>
                                </tr>
                            </thead>
                            <tbody>
                            {ranking.map((reader, index) => {
                                const medalEmoji = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅";

                                return (
                                    <tr key={index}>
                                        <td>{medalEmoji} {reader.reader.email}</td>
                                        <td>{reader.longest_streak} dias</td>
                                        <td>{reader.current_streak} dias</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    ) : (
                        <p>Nenhum leitor no ranking ainda.</p>
                    )}

                    <div className="charts-container">
                        {/* 📊 Gráfico de Linhas - Engajamento Diário */}
                        <h3>📈 Engajamento Diário</h3>
                        {engagementData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={engagementData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="opens" stroke="#007bff" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>Carregando...</p>
                        )}

                        {/* 📊 Gráfico de Barras - Engajamento por Newsletter */}
                        <h3>📰 Engajamento por Newsletter</h3>
                        {newsletterData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={newsletterData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="newsletter" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="opens" fill="#f4b400" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>Carregando...</p>
                        )}

                        {/* 🌍 Gráfico de Pizza - Distribuição de Origem (UTM) */}
                        <h3>🌍 Distribuição de Origem (UTM)</h3>
                        {utmData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Tooltip />
                                    <Pie
                                        data={utmData}
                                        dataKey="count"
                                        nameKey="source"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {utmData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={["#007bff", "#ff9800", "#4caf50", "#e91e63", "#9c27b0"][index % 5]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>Carregando...</p>
                        )}
                    </div>

                    <button className="logout-button" onClick={logout}>Sair</button>
                </div>
            )}
        </div>
    );
};

export default DashboardAdmin;
