import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import "./SummaryScreen.css";

function SummaryScreen() {

    const { width, height } = useWindowSize();

    const [showConfetti, setShowConfetti] = useState(true);

    const [copied, setCopied] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 8000);

        return () => clearTimeout(timer);

    }, []);

    async function copyLink() {

        await navigator.clipboard.writeText(window.location.origin);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2500);
    }

    return (
        <>
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={180}
                    gravity={0.18}
                    initialVelocityY={12}
                />
            )}

        <div className="summary-page">

            <div className="summary-content">

                <h1 className="summary-title">
                    תודה רבה על השתתפותכם !
                </h1>

                <div className="summary-divider"></div>

                <p className="summary-description">
                     השתתפותכם חשובה ותורמת לקידום המחקר בנושא זיהוי תמונות
                    <br />
                    שנוצרו באמצעות בינה מלאכותית
                    <br />
                </p>

                <p className="summary-description second">
                    אם נהניתם מהניסוי, נשמח אם תשתפו עם חברים או בני משפחה
                </p>

                <button
                    className="copy-link"
                    onClick={copyLink}
                >
                    🔗 העתק קישור לניסוי
                </button>

                {copied && (
                    <div className="copied-message">
                        ✓ הקישור הועתק ללוח
                    </div>
                )}

            </div>

        </div>
            </>
    );
}

export default SummaryScreen;