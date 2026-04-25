function StartScreen({ onContinue }) {
    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>Real or Fake?</h1>

            <p>
                In this experiment, you will be asked to identify whether images are real or fake.
            </p>

            <p>
                The experiment includes two rounds: one with a time limit and one without a time limit.
            </p>

            <button onClick={onContinue}>
                Continue
            </button>
        </div>
    );
}

export default StartScreen;