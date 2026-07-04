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

    const charCount = feedback.length;

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

                <h1 className="feedback-summary-title">
                    סיימתם את חלק זיהוי התמונות! 🎉
                </h1>

                <p className="summary-intro">
                    להלן תוצאות הזיהוי שלכם
                </p>

                <div className="summary-score">

                    <span className="score-number">
                        {totalCorrect}
                    </span>

                    <span className="score-total">
                        / {answers.length}
                    </span>

                </div>



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
                    onChange={(e) => {

                        const text = e.target.value;

                        if (text.length <= 300) {
                            setFeedback(text);
                        }

                    }}
                />

                <div className="word-counter">
                    {charCount} / 300 תווים
                </div>

                <p className="next-step-note">
                    עוד שלב אחד קטן ומסיימים 😊
                </p>

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