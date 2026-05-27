import { useEffect } from "react";
import "./RoundIntro.css";

function RoundIntro({ round, onNext }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onNext();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onNext]);

    const isTimed = round === 1;

    return (
        <div className="round-intro-page">
            <div className="round-intro-content">
                <h1 className="round-number">
                    Round {round}
                </h1>

                <h2 className="round-subtitle">
                    {round === 1 ? "With Time Limit" : "Without Time Limit"}
                </h2>

                <p className="round-description">
                    {round === 1
                        ? "Each image must be answered before the timer ends."
                        : "You may inspect each image for as long as you wish."}
                </p>

                <p className="round-starting">
                    Starting soon...
                </p>
            </div>
        </div>
    );
}

export default RoundIntro;