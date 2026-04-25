function SummaryScreen({ answers }) {

    const round1 = answers.filter(a => a.round === 1);
    const round2 = answers.filter(a => a.round === 2);

    const correct1 = round1.filter(a => a.isCorrect).length;
    const correct2 = round2.filter(a => a.isCorrect).length;

    const totalCorrect = answers.filter(a => a.isCorrect).length;

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>Experiment Summary</h1>

            <p>Round 1 (timed): {correct1} / {round1.length}</p>
            <p>Round 2 (not timed): {correct2} / {round2.length}</p>

            <h2>Total: {totalCorrect} / {answers.length}</h2>

            <p>
                Success rate:{" "}
                {answers.length > 0
                    ? Math.round((totalCorrect / answers.length) * 100)
                    : 0}
                %
            </p>

            <h3>Thank you for participating!</h3>
        </div>
    );
}

export default SummaryScreen;