import { useEffect } from "react";

function RoundIntro({ round, onNext }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onNext();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <div style={{ textAlign: "center", marginTop: "150px" }}>
            <h1>Round {round}</h1>

            <p>
                {round === 1
                    ? "Please note: this round is time-limited."
                    : "Please note: this round is not time-limited."}
            </p>

            <p>Starting soon...</p>
        </div>
    );
}

export default RoundIntro;