import { useState } from "react";
import "./OpenQuestion.css";

function OpenQuestion({ participantId, answers, onContinue }) {

    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const totalCorrect = answers.filter((a) => a.isCorrect).length;

    const successRate =
        answers.length > 0
            ? Math.round((totalCorrect / answers.length) * 100)
            : 0;

    const handleContinue = async () => {

        setLoading(true);

        try {

            await fetch("https://deepfake-backend-ki3i.onrender.com/open-feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    participant_id: participantId,
                    feedback_text: feedback,
                }),
            });

            onContinue();

        } catch (error) {

            console.error(error);
            alert("אירעה שגיאה בשמירת התשובה.");

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="feedback-page">

            <div className="feedback-card">

                <h1 className="summary-title">
                    סיימתם את חלק זיהוי התמונות! 🎉
                </h1>

                <p className="summary-intro">
                    לפניכם סיכום קצר של הביצועים שלכם.
                </p>

                <div className="summary-score">

                    <span className="score-number">
                        {totalCorrect}
                    </span>

                    <span className="score-total">
                        / {answers.length}
                    </span>

                </div>

                <p className="summary-rate">
                    אחוז הצלחה: {successRate}%
                </p>

                <div className="summary-divider"></div>

                <h2 className="feedback-question">
                    נשמח לשמוע את דעתכם
                </h2>

                <p className="feedback-description">
                    מהם הסימנים או המאפיינים שעליהם הסתמכתם במהלך הניסוי
                    כדי לזהות האם התמונה אמיתית או נוצרה באמצעות בינה מלאכותית?
                </p>

                <p className="feedback-note">
                    שאלה זו אינה חובה.
                </p>

                <textarea
                    className="feedback-textarea"
                    placeholder="לדוגמה: העיניים, הידיים, התאורה, הרקע או כל מאפיין אחר..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />

                <button
                    className="primary-btn"
                    onClick={handleContinue}
                    disabled={loading}
                >
                    {loading ? "שומר..." : "המשך לשאלון"}
                </button>

            </div>

        </div>

    );
}

export default OpenQuestion;