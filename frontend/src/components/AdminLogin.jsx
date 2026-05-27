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
            setError("Incorrect password");
        }
    }

    return (
        <div className="admin-login-page">
            <button className="admin-back-btn" onClick={onBack}>
                ← Back
            </button>

            <div className="admin-login-container">
                <h1 className="admin-login-title">Research Dashboard</h1>

                <p className="admin-login-subtitle">
                    Administrator Login
                </p>

                <div className="password-wrapper">
                    <input
                        className="password-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
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
                    Login
                </button>
            </div>
        </div>
    );
}

export default AdminLogin;