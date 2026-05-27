import { useState, useEffect } from "react";
import { LuClock3 } from "react-icons/lu";
import "./ExperimentScreen.css";

function ExperimentScreen({ round, onFinishRound }) {
    const TIME_LIMIT = 10;
    const isTimed = round === 1;

    const [images, setImages] = useState([]);
    const [participantId, setParticipantId] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [selected, setSelected] = useState(null);
    const [reason, setReason] = useState("");
    const [confidence, setConfidence] = useState(50);
    const [time, setTime] = useState(TIME_LIMIT);
    const [imageStartTime, setImageStartTime] = useState(Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function startExperiment() {
            try {
                const participantResponse = await fetch("http://127.0.0.1:8000/participants", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        age: null,
                        gender: null,
                        country: null,
                    }),
                });

                const participantData = await participantResponse.json();
                setParticipantId(participantData.participant_id);

                const usedImageIds = JSON.parse(localStorage.getItem("usedImageIds") || "[]");
                const excludeQuery =
                    usedImageIds.length > 0 ? `?exclude=${usedImageIds.join(",")}` : "";

                const imagesResponse = await fetch(
                    `http://127.0.0.1:8000/images/random${excludeQuery}`
                );

                const imagesData = await imagesResponse.json();

                console.log("Images from server:", imagesData);
                setImages(imagesData);
                setImageStartTime(Date.now());
            } catch (err) {
                console.error("Error starting experiment:", err);
            }
        }

        startExperiment();
    }, []);

    useEffect(() => {
        if (!isTimed || images.length === 0 || isSubmitting) return;

        if (time > 0) {
            const timer = setTimeout(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }

        if (time === 0 && !selected) {
            submitAnswer("no_answer");
        }
    }, [time, isTimed, selected, isSubmitting, images.length]);

    if (images.length === 0 || participantId === null) {
        return <div>Loading experiment...</div>;
    }

    const currentImage = images[currentIndex];

    async function submitAnswer(answerValue) {
        if (isSubmitting) return;

        setIsSubmitting(true);

        const responseTimeSeconds = (Date.now() - imageStartTime) / 1000;

        try {
            const response = await fetch("http://127.0.0.1:8000/answers/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    participantId: participantId,
                    imageId: currentImage.image_id,
                    selected: answerValue,
                    reason: reason || "",
                    confidence: Number(confidence),
                    responseTimeSeconds: Number(responseTimeSeconds.toFixed(2)),
                    round: round,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save answer");
            }

            const newAnswer = await response.json();
            const updatedAnswers = [...answers, newAnswer];

            setAnswers(updatedAnswers);

            if (currentIndex < images.length - 1) {
                setCurrentIndex((prevIndex) => prevIndex + 1);
                setSelected(null);
                setReason("");
                setConfidence(50);
                setTime(TIME_LIMIT);
                setImageStartTime(Date.now());
                setIsSubmitting(false);
            } else {
                const currentRoundImageIds = images.map((img) => img.image_id);
                const previousUsedIds = JSON.parse(localStorage.getItem("usedImageIds") || "[]");

                localStorage.setItem(
                    "usedImageIds",
                    JSON.stringify([...previousUsedIds, ...currentRoundImageIds])
                );

                onFinishRound(updatedAnswers);
            }
        } catch (error) {
            console.error("Error saving answer:", error);
            alert("There was a problem saving the answer");
            setIsSubmitting(false);
        }
    }

    function handleNext() {
        if (!selected) {
            alert("Please choose Real or Fake");
            return;
        }

        submitAnswer(selected);
    }

    return (
        <div className="experiment-page">
            <div className="brand-logo">
                <div className="sparkle sparkle-one"> ✦ </div>
                <div className="sparkle sparkle-two"> ✦ </div>

                <div className="brand-title">
                    Real or <span>Fake? </span>
                </div>

                <div className="brand-subtitle">
                    Can you beat AI?
                </div>

                <div className="brand-underline"></div>
            </div>


            <div className="experiment-header">
                <h2>
                    Round {round} | Image {currentIndex + 1} of {images.length}
                </h2>

                {isTimed && (
                    <div className="timer">
                    <div className="timer-top">
                    <LuClock3 className="timer-icon" />

                    <span className="timer-number">
                    00:{String(time).padStart(2, "0")}
            </span>
        </div>

    <div className="timer-label">
        Time left
    </div>
</div>
                )}
            </div>

            <div className="progress-segments">
                {Array.from({ length: images.length }).map((_, index) => (
                    <div
                        key={index}
                        className={`segment ${
                            index <= currentIndex ? "active" : ""
                        }`}
                    />
                ))}
            </div>


            <div className="experiment-card">
                <h1 className="question-title">
                    Is this image <span className="real-word">real</span> or{" "}
                    <span className="fake-word">fake</span>?
                </h1>

                <img
                    src={`http://127.0.0.1:8000/${currentImage.image_path}`}
                    alt="test"
                    className="experiment-image"
                />

                <div className="choice-buttons">
                    <button
                        className={`choice-btn ${selected === "real" ? "selected" : ""}`}
                        onClick={() => setSelected("real")}
                        disabled={isSubmitting || (isTimed && time === 0)}
                    >
                        Real
                    </button>

                    <button
                        className={`choice-btn ${selected === "fake" ? "selected" : ""}`}
                        onClick={() => setSelected("fake")}
                        disabled={isSubmitting || (isTimed && time === 0)}
                    >
                        Fake
                    </button>
                </div>

                <div className="confidence-section">
                    <label className="confidence-title">How confident are you?</label>

                    <div
                        className="confidence-slider-wrap"
                        style={{
                            "--confidence-percent": `${confidence}%`,
                            "--confidence-number": confidence
                        }}
                    >
                        <span className="confidence-value">{confidence}%</span>

                        <span className="confidence-left">😕 Not sure</span>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={confidence}
                            onChange={(e) => setConfidence(e.target.value)}
                            disabled={isSubmitting}
                        />

                        <span className="confidence-right">Very sure 😊</span>
                    </div>
                </div>

                <div className="form-section">
                    <label>
                        Why did you choose this answer?
                        <span className="optional-text">(optional)</span>
                    </label>

                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Share your thoughts..."
                    />
                </div>

                <button
                    className="next-btn"
                    onClick={handleNext}
                    disabled={!selected || isSubmitting}
                >
                    Next
                </button>
            </div>
        </div>
    );

}
export default ExperimentScreen;