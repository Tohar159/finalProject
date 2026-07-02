import { useEffect } from "react";
import "./RoundIntro.css";

function RoundIntro({ round, onNext }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onNext();
        }, 6000);

        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <div className="round-intro-page">
            <div className="round-intro-content">
                <h1 className="round-number">
                    סבב {round}
                </h1>

                <h2 className="round-subtitle">
                    {round === 1 ? "עם הגבלת זמן" : "ללא הגבלת זמן"}
                </h2>

                <p className="round-description">
                    {round === 1
                        ? "לכל תמונה יוקצבו 10 שניות. יש לענות לפני תום הזמן."
                        : "בסבב זה תוכלו לבחון כל תמונה ללא הגבלת זמן."}
                </p>

                <p className="round-starting">
                    מתחילים בעוד רגע...
                </p>
            </div>
        </div>
    );
}

export default RoundIntro;