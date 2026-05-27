import "./SummaryScreen.css";

function SummaryScreen({ answers }) {
    const round1 = answers.filter((a) => a.round === 1);
    const round2 = answers.filter((a) => a.round === 2);

    const correct1 = round1.filter((a) => a.isCorrect).length;
    const correct2 = round2.filter((a) => a.isCorrect).length;

    const totalCorrect = answers.filter((a) => a.isCorrect).length;

    const successRate =
        answers.length > 0
            ? Math.round((totalCorrect / answers.length) * 100)
            : 0;

    return (
        <div className="summary-page">
            <div className="summary-content">

                <h1 className="summary-title">
                    Experiment Summary
                </h1>

                <div className="summary-score">
                    <span className="score-number">
                        {totalCorrect}
                    </span>

                    <span className="score-total">
                        / {answers.length}
                    </span>
                </div>

                <p className="summary-rate">
                    Success Rate: {successRate}%
                </p>

                <div className="summary-cards">

                    <div className="summary-card">
                        <div className="summary-card-title">
                            Round 1
                        </div>

                        <div className="summary-card-subtitle">
                            Timed
                        </div>

                        <div className="summary-card-score">
                            {correct1} / {round1.length}
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-card-title">
                            Round 2
                        </div>

                        <div className="summary-card-subtitle">
                            Not Timed
                        </div>

                        <div className="summary-card-score">
                            {correct2} / {round2.length}
                        </div>
                    </div>

                </div>

                <div className="summary-footer">
                    <h3 className="summary-thankyou">
                        Thank you for participating!
                    </h3>
                </div>

            </div>
        </div>
    );
}

export default SummaryScreen;