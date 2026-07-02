import { useEffect, useState } from "react";
import "./AdminDashboard.css";

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
                <h2 className="dashboard-loading">טוען את לוח הבקרה...</h2>
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
                    <h1>דשבורד המחקר</h1>
                    <p>סקירה כללית של תוצאות הניסוי ונתוני המשתתפים</p>
                </div>

                <button className="dashboard-logout-btn" onClick={onLogout}>
                    התנתקות
                </button>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <span className="dashboard-label">סה"כ משתתפים</span>
                    <strong>{stats.participants_count}</strong>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-label">סה"כ תשובות</span>
                    <strong>{stats.answers_count}</strong>
                </div>

                <div className="dashboard-card highlight-card">
                    <span className="dashboard-label">דיוק כלל המשתתפים</span>
                    <strong>{stats.accuracy}%</strong>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-label">דיוק המודל</span>
                    <strong>{stats.model_accuracy}%</strong>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-label">דיוק המשתתפים - סבב 1</span>
                    <strong>{round1Accuracy}%</strong>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-label">דיוק המשתתפים - סבב 2</span>
                    <strong>{round2Accuracy}%</strong>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-label">רמת ביטחון ממוצעת</span>
                    <strong>{stats.avg_confidence}%</strong>
                </div>

                <div className="dashboard-card wide-card">
                    <span className="dashboard-label">זמן תגובה ממוצע</span>

                    <strong>
                        {stats.avg_response_time}
                        <span className="time-unit"> שנ׳</span>
                    </strong>
                </div>
            </div>


            <div className="dashboard-chart-card">
                <div className="chart-header">
                    <h2>השוואת ביצועי המשתתפים למודל EfficientNet-B0</h2>
                    <p>השוואה בין דיוק המשתתפים לבין מודל הלמידה</p>
                </div>

                <div className="chart-wrapper">
                    <div className="simple-bar-chart">
                        <div className="bar-item">
                            <span>משתתפים</span>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{ width: `${stats.accuracy}%` }}
                                ></div>
                            </div>
                            <strong>{stats.accuracy}%</strong>
                        </div>

                        <div className="bar-item">
                            <span>מודל</span>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{ width: `${stats.model_accuracy}%` }}
                                ></div>
                            </div>
                            <strong>{stats.model_accuracy}%</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;