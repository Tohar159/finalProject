import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminLogin.css";

function AdminLogin({ onLoginSuccess, onBack }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function handleLogin() {
        if (password === "1234") {
            onLoginSuccess();
        } else {
            setError("סיסמה שגויה");
        }
    }

    return (
        <div className="admin-login-page">
            <button className="admin-back-btn" onClick={onBack}>
                → חזרה
            </button>

            <div className="admin-login-container">
                <h1 className="admin-login-title">דשבורד המחקר</h1>

                <p className="admin-login-subtitle">
                    כניסת מנהל
                </p>

                <div className="password-wrapper">
                    <input
                        className="password-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="הזינו סיסמה"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleLogin();
                            }
                        }}
                    />

                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                </div>

                {error && <p className="login-error">{error}</p>}

                <button className="login-btn" onClick={handleLogin}>
                    התחברות
                </button>
            </div>
        </div>
    );
}

export default AdminLogin;