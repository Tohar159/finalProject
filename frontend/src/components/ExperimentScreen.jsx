import { useState, useEffect } from "react";

function ExperimentScreen({ round, onFinishRound }) {
    const [images, setImages] = useState([]);
    const [reason, setReason] = useState("");
    const [confidence, setConfidence] = useState(50);
    const isTimed = round === 1;
    const [answers, setAnswers] = useState([]);
    const TIME_LIMIT = 15;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [time, setTime] = useState(TIME_LIMIT);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/images")
            .then((res) => res.json())
            .then((data) => setImages(data))
            .catch((err) => console.error("Error loading images:", err));
    }, []);

    useEffect(() => {
        if (isTimed && time > 0) {
            const timer = setTimeout(() => {
                setTime(time - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [time, isTimed]);

    if (images.length === 0) {
        return <div>Loading images...</div>;
    }

    const currentImage = images[currentIndex];

    function handleNext() {
        if (!selected) {
            alert("Please choose Real or Fake");
            return;
        }

        const correctAnswer = currentImage.correct;

        const newAnswer = {
            imageId: currentImage.imageId,
            selected: selected,
            correct: correctAnswer,
            isCorrect: selected === correctAnswer,
            reason: reason || "",
            confidence: Number(confidence),
            round: round,
        };

        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);

        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelected(null);
            setReason("");
            setConfidence(50);
            setTime(TIME_LIMIT);
        } else {
            console.log("All answers:", updatedAnswers);
            onFinishRound(updatedAnswers);
        }
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>
                Round {round} | Image {currentIndex + 1} of {images.length}
            </h2>

            <div style={{ marginBottom: "10px" }}>
                {isTimed && <div>⏱ Time: {time}</div>}
            </div>

            <img
                src={currentImage.imageUrl}
                alt="test"
                style={{
                    width: "400px",
                    height: "300px",
                    objectFit: "contain",
                }}
            />

            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={() => setSelected("real")}
                    disabled={isTimed && time === 0}
                >
                    Real
                </button>

                <button
                    onClick={() => setSelected("fake")}
                    disabled={isTimed && time === 0}
                    style={{ marginLeft: "10px" }}
                >
                    Fake
                </button>
            </div>

            <p>Selected: {selected || "None"}</p>

            <div style={{ marginTop: "20px" }}>
                <p>Why did you choose this answer?</p>

                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{ width: "300px" }}
                />
            </div>

            <div style={{ marginTop: "20px" }}>
                <p>How confident are you?</p>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value)}
                />

                <p>{confidence}%</p>
            </div>

            <button
                style={{ marginTop: "20px" }}
                onClick={handleNext}
                disabled={!selected}
            >
                Next
            </button>
        </div>
    );
}

export default ExperimentScreen;