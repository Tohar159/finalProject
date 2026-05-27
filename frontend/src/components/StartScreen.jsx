import "./StartScreen.css";

function StartScreen({ onContinue, onAdminClick }) {
    return (
        <div className="start-page">
            <button className="admin-corner-btn" onClick={onAdminClick}>
                Admin Portal
            </button>

            <div className="start-card">
                <div className="start-logo">
                    Real or <span>Fake?</span>
                </div>

                <p className="start-description">
                    In this experiment, you will be asked to identify whether images are real or AI-generated.
                </p>

                <div className="start-features">
                    <div>Round 1 — with time limit</div>
                    <div>Round 2 — without time limit</div>
                    <div>Your answers are anonymous and used for research purposes only.</div>
                </div>

                <button className="primary-btn" onClick={onContinue}>
                    Continue
                </button>
            </div>
        </div>
    );
}

export default StartScreen;