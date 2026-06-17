import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function AdminDashboard({ onLogout }) {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch("https://deepfake-backend-ki3i.onrender.com/admin/stats")
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch((err) => console.error(err));
    }, []);

    if (!stats) {
        return (
            <div className="admin-dashboard-page">
                <h2 className="dashboard-loading">Loading dashboard...</h2>
            </div>
        );
    }

    const round1Accuracy =
        stats.accuracy_by_round?.find((item) => item.round === 1)?.accuracy ?? 0;

    const round2Accuracy =
        stats.accuracy_by_round?.find((item) => item.round === 2)?.accuracy ?? 0;

    const comparisonData = [
        {
            name: "Human",
            accuracy: stats.accuracy
        },
        {
            name: "Model",
            accuracy: stats.model_accuracy
        }
    ];

    return (
        <div className="admin-dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>Research Dashboard</h1>
                    <p>Overview of experiment participation and performance.</p>
                </div>

                <button className="dashboard-logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <span className="dashboard-label">Participants</span>
                    <strong>{stats.participants_count}</strong>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-label">Total Answers</span>
                    <strong>{stats.answers_count}</strong>
                </div>

                <div className="dashboard-card highlight-card">
                    <span className="dashboard-label">Overall Accuracy</span>
                    <strong>{stats.accuracy}%</strong>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-label">Model Accuracy</span>
                    <strong>{stats.model_accuracy}%</strong>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-label">Round 1 Accuracy</span>
                    <strong>{round1Accuracy}%</strong>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-label">Round 2 Accuracy</span>
                    <strong>{round2Accuracy}%</strong>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-label">Avg Confidence</span>
                    <strong>{stats.avg_confidence}%</strong>
                </div>

                <div className="dashboard-card wide-card">
                    <span className="dashboard-label">Avg Response Time</span>
                    <strong>{stats.avg_response_time}s</strong>
                </div>
            </div>

            <div className="dashboard-chart-card">
                <div className="chart-header">
                    <h2>Human vs Model Accuracy</h2>
                    <p>Compare participant performance with the AI model.</p>
                </div>

                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData}>
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="accuracy" fill="#6c63ff" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;