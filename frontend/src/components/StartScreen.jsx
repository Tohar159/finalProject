import "./StartScreen.css";

function StartScreen({ onContinue, onAdminClick }) {
    return (
        <div className="start-page">
            <button className="admin-corner-btn" onClick={onAdminClick}>
                כניסת מנהל
            </button>

            <div className="start-card">
                <div className="start-logo">
                    אמיתי או <span> AI ? </span>
                </div>

                <p className="start-description">
                    בניסוי זה תתבקשו לזהות האם התמונות המוצגות הן אמיתיות או נוצרו באמצעות בינה מלאכותית
                </p>

                <div className="features-title">
                    הניסוי כולל שני סבבים:
                </div>

                <div className="rounds-list">
                    <div>
                        סבב 1 – עם הגבלת זמן
                        <span className="round-extra"> (10 שניות לכל תמונה)</span>
                    </div>

                    <div>
                        סבב 2 – ללא הגבלת זמן
                    </div>
                </div>


                    <div className="end-of-experience">
                        <strong>בסיום שני הסבבים</strong> תתבקשו למלא שאלון קצר
                    </div>

                    <div className="privacy-text">
                        🕒 משך הניסוי המשוער: כ־10 דקות
                    </div>

                <button className="primary-btn" onClick={onContinue}>
                    המשך
                </button>
            </div>
        </div>
    );
}

export default StartScreen;